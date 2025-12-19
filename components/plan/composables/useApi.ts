// composables/useApi.ts
import { getAuth } from "firebase/auth"
import firebase from 'firebase/compat/app'
import { ElMessage } from 'element-plus'

const { VITE_BASE_URL } = import.meta.env

export function useApi() {

    // 取得當前 Token (包含強制刷新邏輯)
    const getIdToken = async (forceRefresh = false) => {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return null
        return await user.getIdToken(forceRefresh)
    }

    // 封裝後的 Fetch
    const authFetch = async (endpoint: string, options: RequestInit = {}) => {
        const auth = getAuth()
        if (!auth.currentUser) return null // 未登入

        let token = await getIdToken()

        const headers = new Headers(options.headers || {})
        headers.set('Authorization', `Bearer ${token}`)
        if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json')
        }

        const serviceUrl = `${VITE_BASE_URL}${endpoint}`

        // 效能監控 (可選)
        const perf = firebase.performance()
        const trace = perf.trace(endpoint)
        trace.start()

        let res = await fetch(serviceUrl, { ...options, headers })

        trace.stop()

        // 處理 Token 過期 (401)
        if (res.status === 401) {
            console.log('Token expired, retrying...')
            token = await getIdToken(true) // 強制刷新
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
                res = await fetch(serviceUrl, { ...options, headers })
            }
        }

        if (!res.ok) {
            // 統一錯誤處理
            const errorText = await res.text()
            ElMessage.error(errorText || `API Error: ${res.status}`)
            throw new Error(errorText)
        }

        return res
    }

    return { authFetch }
}