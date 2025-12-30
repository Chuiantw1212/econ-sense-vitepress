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

<el-dialog 
    v-model="isOpenPreview" 
    title="示意圖" 
    center 
    destroy-on-close 
    lock-scroll
  >
  <div class="preview__div">
    <img class="div__image" src="https://storage.googleapis.com/enchu-8085a.firebasestorage.app/finance/plan/%E7%A4%BA%E6%84%8F%E5%9C%96.webp" alt="示意圖" />
  </div>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="isOpenPreview = false">關閉</el-button>
    </div>
  </template>
</el-dialog>

<div v-if="error" class="error-state">
    <el-alert :title="error" type="error" show-icon :closable="false">
        <el-button size="small" @click="initData" style="margin-top: 10px;">重試</el-button>
    </el-alert>
</div>

<div v-loading="isLoading" element-loading-text="同步雲端資料與設定中..." style="min-height: 200px;">
    <Profile 
        v-if="isReady"
        v-model="userForm.profile" 
        :user="loggedInUser" 
        :metadata="metadata" 
    />
</div>

## 資產負債表

### 金融

<div v-if="isReady">
    <Portfolio  v-model="userForm.portfolios"  :metadata="metadata" />
</div>
<div v-else style="height: 100px;" v-loading="true"></div>

### 不動產

<div v-if="isReady">
    <RealEstate 
        v-model="userForm.realEstates" 
        :metadata="metadata" 
    />
</div>
<div v-else style="height: 100px;" v-loading="true"></div>

## 損益表

### 職業收入

<div v-if="isReady">
    <Career 
        v-model="userForm.career" 
    />
</div>
<div v-else style="height: 100px;" v-loading="true"></div>

## 現金流量表

<div v-if="isReady">
    <p>現金流量表內容...</p>
</div>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'

// --- Components ---
import Profile from '@/components/plan/profile.vue'
import Career from '@/components/plan/career.vue'
import Portfolio from '@/components/plan/portfolio.vue'
// 引用我們剛剛建立的 UserRealEstate 組件
import RealEstate from '@/components/plan/realEstate.vue'

// --- Composables ---
import { useUserPlan } from '@/components/plan/composables/useUserPlan'
import { useMetadata } from '@/components/plan/composables/useMetadata'

// --- State & Refs ---
const isOpenPreview = ref(false)
let authUnsubscribe: (() => void) | null = null

// useUserPlan 負責取得初始資料 (fetch GET) 並放入 userForm
const { userForm, loggedInUser, isDataReady, initAuthListener } = useUserPlan()
const { metadata, isMetadataReady, fetchMetadata, error } = useMetadata()

// --- Computed ---
const isReady = computed(() => isDataReady.value && isMetadataReady.value)
const isLoading = computed(() => !isReady.value)

// --- 初始化與生命週期 ---
const initData = async () => {
    fetchMetadata()
    authUnsubscribe = initAuthListener()
}

onMounted(() => {
    initData()
})

onUnmounted(() => {
    // 清理監聽器
    if (authUnsubscribe) authUnsubscribe()
})
</script>

<style lang="scss" scoped>
.preview__div {
  height: 420px;
  overflow-y: auto;
  .div__image {
    margin: auto;
    display: block; 
    max-width: 100%; 
  }
}

.error-state {
    padding: 20px;
    text-align: center;
}
</style>