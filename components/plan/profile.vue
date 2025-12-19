<template>
    <el-card shadow="never">
        <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 16px;">基本資料與參數 (Profile & Parameters)</span>

                <el-space>
                    <el-upload v-model:file-list="fileList" :limit="1" :show-file-list="false" accept=".json"
                        :auto-upload="false" @change="handleFileChange">
                        <el-button type="info" plain size="small">匯入設定</el-button>
                    </el-upload>

                    <el-button v-if="!user.uid" type="primary" size="small" @click="openSignInDialog">
                        會員登入
                    </el-button>

                    <el-button v-else type="danger" plain size="small" @click="emits('signOut')">
                        登出
                    </el-button>
                </el-space>
            </div>
        </template>

        <el-row :gutter="20" align="middle" style="margin-bottom: 20px;">
            <el-col :span="24" style="display: flex; align-items: center; gap: 15px;">
                <el-avatar :size="60" :src="user.photoURL" shape="circle">
                    <span style="font-size: 20px; font-weight: bold;">{{ avatarText }}</span>
                </el-avatar>

                <div style="display: flex; flex-direction: column;">
                    <el-text size="large" tag="b">{{ user.displayName || '訪客' }}</el-text>
                    <el-text type="info" size="small">{{ user.email || '尚未登入' }}</el-text>
                </div>
            </el-col>
        </el-row>

        <el-divider />

        <el-form ref="ruleFormRef" label-position="top" :model="modelValue">
            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="出生年份 (Birth Year)" required>
                        <el-select v-model="modelValue.birthYear" placeholder="請選擇" style="width: 100%"
                            @change="calculateAge" filterable>
                            <el-option v-for="item in birthYearOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="當前年齡 (Current Age)">
                        <el-input-number v-model="modelValue.currentAge" disabled style="width: 100%"
                            :controls="false" />
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="生理性別 (Gender)" required>
                        <el-radio-group v-model="modelValue.gender" @change="calculateAge">
                            <el-radio v-for="item in metadata?.opt_gender?.list" :key="item.code" :value="item.code"
                                border>
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="職業保險類別 (Insurance Type)" required>
                        <el-select v-model="modelValue.careerInsuranceType" placeholder="請選擇投保類型" style="width: 100%">
                            <el-option v-for="item in metadata?.opt_social_security?.list" :key="item.code"
                                :label="item.label" :value="item.code" :disabled="item.disabled" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估通貨膨脹率 (Inflation Rate)">
                        <el-input readonly :value="'3%'">
                            <template #prefix>
                                <el-icon>
                                    <TrendCharts />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <template #footer>
            <el-collapse accordion>
                <el-collapse-item name="1">
                    <template #title>
                        <el-icon style="margin-right: 5px;">
                            <InfoFilled />
                        </el-icon> 試算參數與資料來源說明
                    </template>
                    <div class="info-content">
                        <p>1. 所有功能不須登入也可以使用，登入後可雲端儲存進度。</p>
                        <p>2. 預期餘命參考：<el-link type="primary" href="https://data.gov.tw/dataset/39493"
                                target="_blank">國家發展委員會 -
                                預期壽命推估</el-link></p>
                        <p>3. 通貨膨脹率參數：<el-link type="primary"
                                href="https://www.stat.gov.tw/Point.aspx?sid=t.2&n=3581&sms=11480"
                                target="_blank">中華民國統計資訊網 (CPI)</el-link></p>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>

    <el-dialog v-model="loginDialogVisible" title="會員登入 / 註冊" :fullscreen="isMobile" width="400px" destroy-on-close
        append-to-body>
        <div id="firebaseui-auth-container"></div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { InfoFilled, TrendCharts } from '@element-plus/icons-vue' // 記得引入 Icon
import type { UploadFile } from 'element-plus'

// Firebase Import (Compat Mode)
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"

// Types
import type { PersonalProfile, FirebaseUser } from './types/user'
import type { MetadataMap } from './types/metadata'

// Emits
const emits = defineEmits(['update:modelValue', 'signOut', 'upload'])

// Props Definition
const props = withDefaults(defineProps<{
    modelValue: PersonalProfile
    user: FirebaseUser
    metadata?: MetadataMap
}>(), {
    // 這裡的預設值僅作為 Fallback，主要依賴父層傳入
    user: () => ({
        id: '', uid: '', displayName: '', email: '', photoURL: '', isAnonymous: true
    }),
    metadata: () => ({})
})

// State
const loginDialogVisible = ref(false)
const isMobile = ref(false)
const birthYearOptions = ref<{ label: number, value: number }[]>([])
const fileList = ref([])

// --- Computed Logic ---

// Avatar Fallback Text (e.g., "王")
const avatarText = computed(() => {
    const name = props.user.displayName
    return name ? name.charAt(0).toUpperCase() : 'U'
})

// --- Hooks ---

onMounted(async () => {
    // 初始化 Firebase UI 資源
    try {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.firebase) {
            // @ts-ignore
            await import(`./firebase-ui/firebase-ui-auth__zh_tw.js`)
            await import(`./firebase-ui/firebase-ui-auth.css`)
        }
    } catch (e) {
        console.warn('Firebase UI resources load failed', e)
    }

    initOptions()
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkIsMobile)
})

// --- Methods ---

function checkIsMobile() {
    isMobile.value = window.innerWidth < 768
}

function initOptions() {
    const currentYear = new Date().getFullYear()
    // 產生過去 80 年的選項
    const options = []
    for (let i = 0; i < 80; i++) {
        const y = currentYear - i - 18 // 從 18 歲開始算
        options.push({ label: y, value: y })
    }
    birthYearOptions.value = options
}

function calculateAge() {
    const { birthYear } = props.modelValue
    if (birthYear) {
        const currentYear = new Date().getFullYear()
        // 更新 modelValue (因為是物件參考，直接修改屬性會觸發父層響應，但發出 emit 較為正規)
        const newAge = currentYear - Number(birthYear)

        // 觸發更新
        const updatedProfile = {
            ...props.modelValue,
            currentAge: newAge
        }
        emits('update:modelValue', updatedProfile)
    }
}

// 檔案上傳處理
function handleFileChange(uploadFile: UploadFile) {
    if (!uploadFile.raw) return

    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const result = e.target?.result as string
            const parsedData = JSON.parse(result)
            emits('upload', parsedData)
            // 清空列表以便下次上傳
            fileList.value = []
        } catch (err) {
            console.error('JSON Parse Error', err)
        }
    }
    reader.readAsText(uploadFile.raw)
}

function openSignInDialog() {
    loginDialogVisible.value = true
    nextTick(() => {
        initFirebaseUI()
    })
}

function initFirebaseUI() {
    // 確保 window.firebase 存在 (由 theme/index.js 初始化)
    // @ts-ignore
    if (!window.firebase) return

    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: () => {
                loginDialogVisible.value = false // 登入成功關閉視窗
                return false // 阻止自動轉址
            }
        },
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        signInFlow: 'popup',
        tosUrl: '#', // 建議換成您的實際連結
        privacyPolicyUrl: '#'
    }

    // @ts-ignore
    const firebaseui = window.firebaseui
    if (firebaseui) {
        const auth = firebase.auth()
        let ui = firebaseui.auth.AuthUI.getInstance()
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(auth)
        }
        ui.start('#firebaseui-auth-container', uiConfig)
    }
}

// 公開方法給父層呼叫
defineExpose({
    openSignInDialog,
    toggleSignInDialog: (v: boolean) => loginDialogVisible.value = v
})
</script>

<style scoped>
/* 僅保留必要的 Firebase UI 容器樣式微調 
   其他排版全部交給 Element Plus 
*/
:deep(.firebaseui-container) {
    max-width: 100%;
    /* 讓它在 Dialog 內自適應 */
}

/* 讓說明文字有點間距 */
.info-content p {
    margin: 8px 0;
    line-height: 1.5;
    color: var(--el-text-color-regular);
    font-size: 14px;
}
</style>