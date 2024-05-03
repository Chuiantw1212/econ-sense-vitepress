<template>
    <div>
        <h2 id="_1. 基本資料" tabindex="-1">
            1. 基本資料
            <a class="header-anchor" href="#1. 基本資料" aria-label="Permalink to &quot;1. 基本資料&quot;">&ZeroWidthSpace;</a>
        </h2>
        <el-card>
            <template #header>
                <div class="card-header card-header--custom">
                    <span>基本資料與參數</span>
                    <el-button v-if="!user.uid" @click="openSignInDialog()">登入</el-button>
                    <el-button v-else @click="emits('signOut')">登出</el-button>
                </div>
            </template>
            <el-form ref="ruleFormRef" label-width="auto">
                <el-row>
                    <el-col v-if="user.photoURL" :span="12">
                        <el-form-item :label="user.displayName">
                            <el-avatar :src="user.photoURL"></el-avatar>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="user.email" :span="12">
                        <el-form-item label="註冊信箱">
                            <el-text>{{ user.email }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出生年" required>
                            <select v-model="profile.yearOfBirth" class="form__select" placeholder="請選擇"
                                @change="calculateProfile()" style="width: 130px">
                                <option label="請選擇" value=""></option>
                                <option v-for="year in config.birthYearOptions" :key="year" :label="year"
                                    :value="year" />
                            </select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="試算年齡">
                            <el-text>{{ profile.age }} 歲</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="性別" required>
                            <el-radio-group v-model="profile.gender" @change="calculateProfile()">
                                <el-radio v-for="(item, key) in config.genders" :value="item.value">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="預估餘命">
                            <el-text>{{ profile.lifeExpectancy }} 年</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通貨膨脹">
                            <el-text>{{ config.inflationRate }}%</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="試算說明" name="1" :border="true">
                        <ul>
                            <li>
                                預期餘命：<a href="https://data.gov.tw/dataset/39493" target="_blank">預期壽命推估</a>
                            </li>
                            <li>
                                通貨膨脹(消費者物價指數年增率)：<a href="https://www.stat.gov.tw/Point.aspx?sid=t.2&n=3581&sms=11480"
                                    target="_blank">中華民國統計資訊網</a>
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </template>
        </el-card>
        <el-dialog v-model="loginDialogVisible" title="登入" :fullscreen="isFullScreen">
            邀請您進入我們的服務。註冊後，您可以方便地使用我們的平台，因為您的資料將被儲存，包括您的電子郵件地址以及填寫的表單內容。這樣做是為了讓您下次登入時不必重新輸入表單資料，提供更流暢的使用體驗。我們尊重您的隱私，您的資料將受到保護並嚴格保密。
            <div id="firebaseui-auth-container"></div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
/**
 * Warning: FirebaseUI is not currently compatible with the v9 modular SDK. The v9 compatibility layer (specifically, the * app-compat and auth-compat packages) permits the usage of FirebaseUI alongside v9, but without the app size reduction * and other benefits of the v9 SDK.
 * https://firebase.google.com/docs/auth/web/firebaseui
 * https://firebase.google.com/docs/web/modular-upgrade
 */
/**
 * FirebaseUI for Web — Auth
 * https://firebaseopensource.com/projects/firebase/firebaseui-web/
 */
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import firebase from 'firebase/compat/app';
const { VITE_BASE_URL } = import.meta.env
const emits = defineEmits(['update:modelValue', 'signOut'])
const loginDialogVisible = ref(false)
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {
                id: '', // 避免登入判斷錯誤
                yearOfBirth: '',
                dateOfBirth: '',
                gender: '',
                age: 0,
                lifeExpectancy: 0,
            }
        }
    },
    user: {
        type: Object,
        default: () => {
            return {}
        }
    },
    config: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const isFullScreen = ref(false)
onMounted(async () => {
    window?.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
    window?.removeEventListener('resize', onResize)
})
function onResize() {
    isFullScreen.value = window?.innerWidth < 768
}
const profile = computed(() => {
    return props.modelValue
})
function toggleSignInDialog(value) {
    loginDialogVisible.value = value
}
function openSignInDialog() {
    toggleSignInDialog(true)
    nextTick(() => {
        // https://firebase.google.com/docs/auth/web/firebaseui
        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return false;
                },
                // uiShown: function () {
                //     // The widget is rendered.
                //     // Hide the loader.
                //     document.getElementById('loader').style.display = 'none';
                // }
            },
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            signInFlow: 'popup',
            // Terms of service url.
            tosUrl: 'https://storage.googleapis.com/public.econ-sense.com/Terms%20of%20Use.pdf',
            // Privacy policy url.
            privacyPolicyUrl: 'https://storage.googleapis.com/public.econ-sense.com/Privacy%20Policy%20for%20Econ-Sense.com.pdf'
        };
        /**
         * 避免FirebaseUI重複初始化錯誤
         * https://stackoverflow.com/questions/47589209/error-in-mounted-hook-error-an-authui-instance-already-exists
         */
        if (firebaseui.auth.AuthUI.getInstance()) {
            const ui = firebaseui.auth.AuthUI.getInstance()
            ui?.start('#firebaseui-auth-container', uiConfig)
        } else {
            const ui = new firebaseui.auth.AuthUI(firebase.auth())
            ui?.start('#firebaseui-auth-container', uiConfig)
        }
    })
}
async function calculateProfile() {
    const { yearOfBirth, gender } = profile.value
    if (yearOfBirth && gender) {
        const ceYear = new Date().getFullYear()
        const calculateAge = ceYear - Number(yearOfBirth)
        const res = await fetch(`${VITE_BASE_URL}/calculate/lifeExpectancy`, {
            method: 'post',
            body: JSON.stringify({
                ceYear,
                age: calculateAge,
                gender,
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        const lifeExpectancy = await res.json()
        profile.value.age = calculateAge
        profile.value.lifeExpectancy = Number(lifeExpectancy)

        emits('update:modelValue', profile.value)
    }
}

defineExpose({
    calculateProfile,
    toggleSignInDialog
});
</script>
<style lang="scss" scoped>
.form__select {
    all: unset;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 130px;
    padding: 0 15px;

    &:disabled {
        background-color: rgb(245, 247, 250);
    }
}

.card-header--custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular);
        background: white !important;
    }
}

:deep(.my-label) {
    background: white;
}

:deep(.my-content) {
    background: white;
}
</style>
