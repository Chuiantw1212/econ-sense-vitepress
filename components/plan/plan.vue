<template>
    <div v-loading="!isSelectReady" element-loading-text="載入設定檔中...">
        <Profile v-if="isSelectReady" :metadata="metadata" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Profile from './profile.vue'
import { ElMessageBox } from 'element-plus'
// 引入我們上一段定義好的型別
import type { MetadataMap } from './types/MetadataDTO'

const { VITE_BASE_URL } = import.meta.env

// 狀態控制
const isSelectReady = ref<boolean>(false)

// 定義 metadata 容器，使用 MetadataMap 型別 (Record<string, MetadataDTO>)
const metadata = ref<MetadataMap>({})

onMounted(() => {
    setSelecOptionSync()
})

async function setSelecOptionSync() {
    // 避免重複呼叫
    if (isSelectReady.value) {
        return
    }

    try {
        // 1. 發起請求
        const bankConfigPromises = [
            fetch(`${VITE_BASE_URL}/api/v1/metadata`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        ]

        // 2. 等待回應
        const [metadataRes] = await Promise.all(bankConfigPromises)

        console.log(metadataRes)

        // 3. 檢查 HTTP 狀態
        if (!metadataRes.ok) {
            throw new Error(`API Error: ${metadataRes.status} ${metadataRes.statusText}`)
        }

        // 4. 解析 JSON 並賦值
        // 假設後端回傳結構是 Map/Object: { "cfg_financial": {...}, "opt_gender": {...} }
        const data = await metadataRes.json()
        metadata.value = data as MetadataMap

        // 5. 標記完成
        isSelectReady.value = true

    } catch (error: any) {
        console.error('Metadata fetch failed:', error)

        // 修正了原本的 typo: error.msssage -> error.message
        ElMessageBox.alert(error.message || 'Google Cloud App Engine 無回應', '系統錯誤', {
            confirmButtonText: '回講座排程',
            type: 'error',
            callback: () => {
                // backToCalendar() // 視您的需求取消註解
            },
        })
    }
}
</script>