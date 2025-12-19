<template>
    <div v-loading="isLoading" element-loading-text="同步雲端資料與設定中...">

        <Profile v-if="isReady" ref="ProfileRef" v-model="userForm.profile" :user="loggedInUser" :metadata="metadata" />

        <div v-else-if="error" class="error-state">
            {{ error }}
            <el-button @click="initData">重試</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import Profile from './profile.vue'
import { useUserPlan } from './composables/useUserPlan'
import { useMetadata } from './composables/useMetadata' // 假設您也把 metadata 抽離了

// 引入 Composables
const { userForm, loggedInUser, isDataReady, initAuthListener } = useUserPlan()
const { metadata, isMetadataReady, fetchMetadata, error } = useMetadata()

const ProfileRef = ref()
let authUnsubscribe: (() => void) | null = null

// 計算屬性：是否所有資料都準備好了
const isReady = computed(() => isDataReady.value && isMetadataReady.value)
const isLoading = computed(() => !isReady.value)

// 初始化邏輯
const initData = async () => {
    // 1. 平行執行：啟動 Auth 監聽 與 抓取 Metadata
    // Promise.all 並不完全適用這裡，因為 Auth 是 Event Driven，但 Metadata 是 Promise
    fetchMetadata()

    // 2. 啟動 Firebase 監聽
    authUnsubscribe = initAuthListener()
}

onMounted(() => {
    initData()
})

onUnmounted(() => {
    // 記得清理監聽器，避免 Memory Leak
    if (authUnsubscribe) authUnsubscribe()
})
</script>