import { ref, } from 'vue'
import { ElMessage, } from 'element-plus'
import type { MetadataMap } from '../types/metadata'

// ------------------------------------------------------------------
// 1. 定義全域狀態 (Singleton State)
// 放在 function 外部，確保切換頁面時資料不會消失，不用重新 fetch
// ------------------------------------------------------------------
const metadata = ref<MetadataMap>({})
const isMetadataReady = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)

// 用來儲存正在進行中的 Promise，防止重複請求 (Request Deduplication)
let fetchPromise: Promise<void> | null = null

const { VITE_BASE_URL } = import.meta.env

export function useMetadata() {

    /**
     * 核心獲取函數
     * @param force - 是否強制重新抓取 (例如使用者手動點擊重試)
     */
    const fetchMetadata = async (force = false) => {
        // 如果資料已經準備好，且沒有強制重抓，就直接返回
        if (isMetadataReady.value && !force) {
            return
        }

        // 如果正在抓取中，就回傳同一個 Promise (避免發出重複 Request)
        if (fetchPromise && !force) {
            await fetchPromise
            return
        }

        isLoading.value = true
        error.value = null

        // 開始執行抓取，並將 Promise 存起來
        fetchPromise = (async () => {
            try {
                const res = await fetch(`${VITE_BASE_URL}/api/v1/metadata`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })

                if (!res.ok) {
                    throw new Error(`Metadata API Error: ${res.status} ${res.statusText}`)
                }

                const data = await res.json()

                // 更新全域狀態
                metadata.value = data as MetadataMap
                isMetadataReady.value = true

            } catch (err: any) {
                console.error('Metadata fetch failed:', err)
                error.value = err.message || '無法載入設定檔'
                isMetadataReady.value = false

                // 這裡可以選擇是否要像原本一樣彈出 Alert
                // 或者交由 UI 層級去顯示錯誤訊息
                ElMessage.error('系統參數載入失敗，請檢查網路連線')

            } finally {
                isLoading.value = false
                fetchPromise = null // 清除 Promise 鎖
            }
        })()

        await fetchPromise
    }

    // 重置狀態 (通常用於登出或切換環境)
    const resetMetadata = () => {
        metadata.value = {}
        isMetadataReady.value = false
        error.value = null
        isLoading.value = false
    }

    return {
        // 狀態
        metadata, // 因為是 ref，外部使用時直接 v-model 或 props 傳入即可
        isMetadataReady,
        isLoading,
        error,

        // 方法
        fetchMetadata,
        resetMetadata
    }
}