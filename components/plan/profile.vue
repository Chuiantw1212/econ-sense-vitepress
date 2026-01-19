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
                <div style="padding-top: 10px;">

                    <el-avatar :size="90" :src="user.photoUrl"
                        style="border: 3px solid var(--el-border-color-lighter); box-shadow: var(--el-box-shadow-light);">
                        <span style="font-size: 32px; font-weight: bold;">{{ avatarText }}</span>
                    </el-avatar>

                    <div style="margin-top: 15px;">
                        <el-text size="large" tag="b" style="display: block; margin-bottom: 4px;">
                            {{ user.displayName || '訪客' }}
                        </el-text>

                        <el-tag v-if="user.email" type="info" effect="light" round size="default">
                            {{ user.email }}
                        </el-tag>
                        <el-text v-else type="info" size="small">
                            本地模式
                        </el-text>
                    </div>
                </div>
            </el-col>

            <el-col :sm="16" :xs="24">
                <el-form ref="ruleFormRef" label-position="top" :model="profile" size="large">
                    <el-row :gutter="20">

                        <el-col :span="12" :xs="24">
                            <el-form-item label="出生日期 (Birthday)" required>
                                <el-date-picker v-model="profile.birthDate" type="date" placeholder="請選擇生日"
                                    format="YYYY/MM/DD" value-format="YYYY-MM-DD" :disabled-date="disableFutureDates"
                                    @change="handleBirthdayChange" style="width: 100%" />
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :xs="24">
                            <el-form-item label="試算年齡 (Age)">
                                <el-input :disabled="true"
                                    :value="profile.currentAge ? profile.currentAge + ' 歲' : '-'">
                                    <template #prefix>
                                        <el-icon>
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :xs="24">
                            <el-form-item label="生理性別 (Gender)" required>
                                <el-select v-model="profile.gender" placeholder="請選擇" style="width: 100%"
                                    @change="handleUpdate">
                                    <el-option v-for="item in metadata?.opt_gender?.list" :key="item.code"
                                        :label="item.label" :value="item.code" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :xs="24">
                            <el-form-item label="職業保險 (Insurance)" required>
                                <el-select v-model="profile.careerInsuranceType" placeholder="投保類型" style="width: 100%"
                                    @change="handleUpdate">
                                    <el-option v-for="item in metadata?.opt_social_security?.list" :key="item.code"
                                        :label="item.label" :value="item.code" :disabled="item.disabled" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :xs="24">
                            <el-form-item label="預估通膨 (Inflation)">
                                <el-input readonly :value="'3%'" :disabled="true">
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
                        <li>所有功能不須登入也可以用，登入註冊只是比較方便而已。</li>
                        <li>預期餘命：<el-link type="primary" href="https://data.gov.tw/dataset/39493"
                                target="_blank">國家發展委員會
                                - 預期壽命推估</el-link>
                        </li>
                        <li>通貨膨脹(消費者物價指數年增率)：<el-link type="primary"
                                href="https://www.stat.gov.tw/Point.aspx?sid=t.2&n=3581&sms=11480"
                                target="_blank">中華民國統計資訊網</el-link></li>
                        <li>公教人員年金改革到一半，目前沒人知道公保會怎麼調整。</li>
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
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { InfoFilled, TrendCharts, User } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { useApi } from '@/components/plan/composables/useApi'
// Firebase Import (Compat Mode)
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"

// Types
import type { PersonalProfile, FirebaseUser } from './types/user'
import type { MetadataMap } from './types/metadata'

// Emits
const emits = defineEmits(['signOut', 'upload'])
const { authFetch } = useApi()

// --- 核心改變：使用 defineModel 取代 Props & Emit ---
const profile = defineModel<PersonalProfile>({ required: true })

// Props Definition (User & Metadata)
const props = withDefaults(defineProps<{
    user: FirebaseUser
    metadata?: MetadataMap
}>(), {
    user: () => ({
        id: '', uid: '', displayName: '', email: '', photoUrl: '', isAnonymous: true
    }),
    metadata: () => ({})
})

// State
const loginDialogVisible = ref(false)
const isMobile = ref(false)
const fileList = ref([])

// --- Computed Logic ---
const avatarText = computed(() => {
    const name = props.user.displayName
    return name ? name.charAt(0).toUpperCase() : 'U'
})

// --- Hooks ---
onMounted(async () => {
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

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkIsMobile)
})

// --- Methods ---

/**
 * 處理資料更新：發送 PUT 請求
 * 綁定在 @change 事件上
 */
async function handleUpdate() {
    try {
        const res = await authFetch(`/api/v1/user/profile`, {
            method: 'PUT',
            body: profile.value,
        })
        if (!res || !res.ok) console.error(`Profile update failed: ${res?.status}`)
    } catch (e) {
        console.error('Profile update error:', e)
    }
}

// 1. 禁止選擇未來日期
const disableFutureDates = (time: Date) => {
    return time.getTime() > Date.now()
}

// 2. 處理生日變更邏輯 (計算年齡並觸發存檔)
function handleBirthdayChange(val: string | null) {
    if (!val) {
        // 清除資料
        profile.value.birthDate = ''
        profile.value.currentAge = 0
    } else {
        // 解析並計算
        const birthDateObj = new Date(val)
        const birthYear = birthDateObj.getFullYear()
        const currentYear = new Date().getFullYear()
        const newAge = currentYear - birthYear

        // 更新 Model
        profile.value.birthDate = val
        profile.value.currentAge = newAge
    }

    // 計算完畢後，觸發存檔
    handleUpdate()
}

function checkIsMobile() {
    isMobile.value = window.innerWidth < 768
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
    // @ts-ignore
    if (!window.firebase) return

    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: () => {
                loginDialogVisible.value = false
                return false
            }
        },
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        signInFlow: 'popup',
        tosUrl: '#',
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

defineExpose({
    openSignInDialog,
    toggleSignInDialog: (v: boolean) => loginDialogVisible.value = v
})
</script>

<style scoped>
:deep(.firebaseui-container) {
    max-width: 100%;
}

.info-content p {
    margin: 8px 0;
    line-height: 1.5;
    color: var(--el-text-color-regular);
    font-size: 14px;
}
</style>