---
description: 台灣唯一開源的線上財務規劃表，工程師可學Vue+Node.js+GCP，民眾建立財務觀念，並提供回饋意見。
outline: deep
head:
  - - meta
    - name: og:image
      property: og:image
      content: /finance/plan/calculator.png
---

# 開源財務規劃書

1. 金融惠普：民眾可以快速建立生涯財務觀念。<el-button class="d-none d-md-inline-block" @click="isOpenPreview=true">示意圖</el-button>
2. 開源驗證：任何人都可以檢視程式碼是否有安全漏洞。 (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-hyper-express" target="_blank">後端開源</a>)。
3. 資料安全：提供了表單離線匯出功能，不需註冊也可以保留試算結果。

<el-dialog :modelValue="isOpenPreview" title="示意圖" center destroy-on-close lock-scroll
    @close="isOpenPreview = false">
    <div class="preview__div">
      <img class="div__image" src="https://storage.googleapis.com/enchu-8085a.firebasestorage.app/finance/plan/%E7%A4%BA%E6%84%8F%E5%9C%96.webp" alt="示意圖"></img>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isOpenPreview = false">關閉</el-button>
      </div>
    </template>
</el-dialog>

<div v-loading="isLoading" element-loading-text="同步雲端資料與設定中...">
    <Profile v-if="isReady" ref="ProfileRef" v-model="userForm.profile" :user="loggedInUser" :metadata="metadata"
        @update:modelValue="onProfileChanged()" />
    <div v-else-if="error" class="error-state">
        {{ error }}
        <el-button @click="initData">重試</el-button>
    </div>
    <h2>損益表</h2>
    <Career v-model="userForm.career"></Career>
    <h2>資產負債表</h2>
    <h2>現金流量表</h2>
</div>

<script setup lang="ts">
import Plan from '@/components/plan/plan.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import Profile from '@/components/plan/profile.vue'
import Career from '@/components/plan/career.vue'
import { useUserPlan } from '@/components/plan/composables/useUserPlan'
import { useMetadata } from '@/components/plan/composables/useMetadata' // 假設您也把 metadata 抽離了
import { useApi } from '@/components/plan/composables/useApi'
// 引入 Composables
const isOpenPreview = ref(false)
const { userForm, loggedInUser, isDataReady, initAuthListener } = useUserPlan()
const { metadata, isMetadataReady, fetchMetadata, error } = useMetadata()
const { authFetch } = useApi()
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
async function onProfileChanged() {
    authFetch(`/api/v1/user/profile`, {
        method: 'PUT',
        body: userForm.value.profile,
    })
    // changeAllCards({
    //     profile: true
    // })
}
onMounted(() => {
    initData()
})
onUnmounted(() => {
    // 記得清理監聽器，避免 Memory Leak
    if (authUnsubscribe) authUnsubscribe()
})
</script>

<style lang="scss" scoped>
.preview__div {
  height: 420px;
  overflow-y: auto;
  .div__image {
    margin: auto;
  }
}
</style>
