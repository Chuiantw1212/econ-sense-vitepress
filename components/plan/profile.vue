<template>
    <el-card shadow="never">
        <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 16px;">基本資料與參數 (Profile)</span>

                <el-space>
                    <el-upload v-model:file-list="fileList" :limit="1" :show-file-list="false" accept=".json"
                        :auto-upload="false" @change="handleFileChange">
                        <el-button type="info" plain link size="small">匯入設定</el-button>
                    </el-upload>

                    <el-divider direction="vertical" />

                    <el-button v-if="!user.uid" type="primary" size="small" round @click="openSignInDialog">
                        會員登入
                    </el-button>
                    <el-button v-else type="danger" size="small" plain round @click="emits('signOut')">
                        登出
                    </el-button>
                </el-space>
            </div>
        </template>

        <el-row :gutter="40" align="top">

            <el-col :sm="8" :xs="24" style="text-align: center; margin-bottom: 20px;">
                <div style="padding: 20px 0; background-color: var(--el-fill-color-lighter); border-radius: 8px;">
                    <el-avatar :size="100" :src="user.photoURL"
                        style="border: 4px solid white; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
                        <span style="font-size: 32px; font-weight: bold;">{{ avatarText }}</span>
                    </el-avatar>

                    <div style="margin-top: 15px;">
                        <el-text size="large" tag="b" style="display: block;">{{ user.displayName || '訪客' }}</el-text>
                        <el-tag v-if="user.email" type="info" effect="plain" round size="small"
                            style="margin-top: 5px;">
                            {{ user.email }}
                        </el-tag>
                        <el-text v-else type="info" size="small" style="display: block; margin-top: 5px;">
                            尚未登入，資料僅存於本地
                        </el-text>
                    </div>

                    <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px;">
                        <el-statistic :value="modelValue.currentAge || 0" title="歲" value-style="font-size: 16px" />
                        <el-divider direction="vertical" style="height: 30px;" />
                        <el-statistic :value="modelValue.birthYear || '-'" title="年次" value-style="font-size: 16px" />
                    </div>
                </div>
            </el-col>

            <el-col :sm="16" :xs="24">
                <el-form ref="ruleFormRef" label-position="top" :model="modelValue" size="large">
                    <el-row :gutter="20">
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
                            <el-form-item label="生理性別 (Gender)" required>
                                <el-select v-model="modelValue.gender" placeholder="請選擇" style="width: 100%"
                                    @change="calculateAge">
                                    <el-option v-for="item in metadata?.opt_gender?.list" :key="item.code"
                                        :label="item.label" :value="item.code" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :xs="24">
                            <el-form-item label="職業保險 (Insurance)" required>
                                <el-select v-model="modelValue.careerInsuranceType" placeholder="投保類型"
                                    style="width: 100%">
                                    <el-option v-for="item in metadata?.opt_social_security?.list" :key="item.code"
                                        :label="item.label" :value="item.code" :disabled="item.disabled" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :xs="24">
                            <el-form-item label="預估通膨 (Inflation)">
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
            </el-col>
        </el-row>

        <template #footer>
            <el-collapse accordion>
                <el-collapse-item name="1">
                    <template #title>
                        <el-icon style="margin-right: 5px;">
                            <InfoFilled />
                        </el-icon> 試算參數與資料來源說明
                    </template>
                    <ul style="padding-left: 20px; line-height: 1.8; color: var(--el-text-color-regular);">
                        <li>
                            所有功能不須登入也可以用，登入註冊只是比較方便而已。
                        </li>
                        <li>
                            預期餘命：<el-link type="primary" href="https://data.gov.tw/dataset/39493"
                                target="_blank">國家發展委員會 - 預期壽命推估</el-link>
                        </li>
                        <li>
                            通貨膨脹(消費者物價指數年增率)：<el-link type="primary"
                                href="https://www.stat.gov.tw/Point.aspx?sid=t.2&n=3581&sms=11480"
                                target="_blank">中華民國統計資訊網</el-link>
                        </li>
                        <li>
                            公教人員年金改革到一半，目前沒人知道公保會怎麼調整。
                        </li>
                    </ul>
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