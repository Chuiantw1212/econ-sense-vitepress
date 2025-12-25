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
        ref="ProfileRef" 
        v-model="userForm.profile" 
        :user="loggedInUser" 
        :metadata="metadata" 
    />
</div>

## 資產負債表

### 金融

<div v-if="true||isReady">
    <Finance :metadata="metadata" />
</div>
<div v-else style="height: 100px;" v-loading="true"></div>

### 房產

### 企業

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
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'

// --- Components ---
import Finance from '@/components/plan/finance.vue'
import Profile from '@/components/plan/profile.vue'
import Career from '@/components/plan/career.vue'
// import Plan from '@/components/plan/plan.vue' // 若沒用到可移除

// --- Composables ---
import { useUserPlan } from '@/components/plan/composables/useUserPlan'
import { useMetadata } from '@/components/plan/composables/useMetadata'
import { useApi } from '@/components/plan/composables/useApi'

// --- State & Refs ---
const isOpenPreview = ref(false)
const ProfileRef = ref()
let authUnsubscribe: (() => void) | null = null

const { userForm, loggedInUser, isDataReady, initAuthListener } = useUserPlan()
const { metadata, isMetadataReady, fetchMetadata, error } = useMetadata()
const { authFetch } = useApi()

// --- Computed ---
const isReady = computed(() => isDataReady.value && isMetadataReady.value)
const isLoading = computed(() => !isReady.value)


// --- 核心：優雅的自動儲存工廠 (Auto-Save Factory) ---

/**
 * 建立自動儲存函式
 * @param endpoint API 路徑
 * @param label 錯誤提示用的名稱
 * @param delay 防抖時間 (ms)
 */
const createAutoSaver = (endpoint: string, label: string, delay = 1000) => {
    return debounce(async (data: any) => {
        // 雙重防護：如果資料還沒準備好，絕對不存檔 (避免覆蓋雲端資料)
        if (!isReady.value) return

        try {
            await authFetch(endpoint, {
                method: 'PUT',
                body: data,
            })
            // console.log(`[AutoSave] ${label} saved.`) 
        } catch (e) {
            console.error(`${label} save failed`, e)
            ElMessage.error(`${label} 儲存失敗，請檢查網路連線`)
        }
    }, delay)
}

// 實例化儲存器
const saveProfile = createAutoSaver('/api/v1/user/profile', '個人檔案', 800)
const saveCareer = createAutoSaver('/api/v1/user/career', '職業收入', 1000)


// --- 監聽器 (Watchers) ---

// 1. 監聽 Profile 變動
watch(
    () => userForm.value.profile,
    (newVal) => { if (isReady.value) saveProfile(newVal) },
    { deep: true }
)

// 2. 監聽 Career 變動
watch(
    () => userForm.value.career,
    (newVal) => { if (isReady.value) saveCareer(newVal) },
    { deep: true }
)


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
    // 取消尚未執行的 Debounce 請求，避免組件卸載後報錯
    saveProfile.cancel()
    saveCareer.cancel()
})
</script>

<style lang="scss" scoped>
.preview__div {
  height: 420px;
  overflow-y: auto;
  .div__image {
    margin: auto;
    display: block; // 建議加上 block 避免 inline 產生的多餘間隙
    max-width: 100%; // 避免圖片爆版
  }
}

.error-state {
    padding: 20px;
    text-align: center;
}
</style>