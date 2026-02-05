// composables/useApi.ts
import { getAuth } from "firebase/auth"
import firebase from 'firebase/compat/app'
import { ElMessage } from 'element-plus'

// 定義擴充的 Options 介面
interface AuthFetchOptions extends Omit<RequestInit, 'body'> {
    headers?: HeadersInit
    params?: Record<string, string | number | boolean | undefined | null>
    // ✨ 關鍵修改：允許 BodyInit (原生) 或 一般物件 (我們封裝的功能)
    body?: BodyInit | Record<string, any> | null
}
export function useApi() {

    // 取得當前 Token (包含強制刷新邏輯)
    const getIdToken = async (forceRefresh = false) => {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return null
        return await user.getIdToken(forceRefresh)
    }

    // 封裝後的 Fetch
    const authFetch = async (endpoint: string, options: AuthFetchOptions = {}) => {
        const auth = getAuth()
        if (!auth.currentUser) return null

        let token = await getIdToken()

        // 1. 先將 params 從 options 分離出來，避免傳給原生 fetch 導致錯誤
        const { params, ...fetchOptions } = options

        const headers = new Headers(options.headers || {})
        headers.set('Authorization', `Bearer ${token}`)
        if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json')
        }

        let body = options.body
        if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
            body = JSON.stringify(body)
            // 自動補上 Content-Type
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json')
            }
        }

        // ✨ 核心優化：處理 Query String ✨
        // 這裡會自動處理 ? 和 &，也會自動 encode 特殊字元
        let queryString = ''
        if (params) {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value))
                }
            })
            queryString = searchParams.toString()
        }

        // 判斷原本 endpoint 是否已有 ?，決定是用 ? 還是 & 連接
        const separator = endpoint.includes('?') ? '&' : '?'
        const finalEndpoint = queryString ? `${endpoint}${separator}${queryString}` : endpoint

        const serviceUrl = `${import.meta.env.VITE_BASE_URL}${finalEndpoint}`

        // 效能監控 (可選)
        const perf = firebase.performance()
        const trace = perf.trace(endpoint)
        trace.start()
        let res = await fetch(serviceUrl, {
            ...fetchOptions, // 這裡傳入的是已經扣除 params 的 options
            headers,
            body: body as BodyInit
        })
        trace.stop()

        // 處理 Token 過期 (401)
        if (res.status === 401) {
            console.log('Token expired, retrying...')
            token = await getIdToken(true) // 強制刷新
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
                res = await fetch(serviceUrl, {
                    ...options,
                    headers,
                    body: body as BodyInit // 強制轉型給 fetch 看
                })
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