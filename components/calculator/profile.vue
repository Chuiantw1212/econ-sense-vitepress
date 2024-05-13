<template>
    <el-card>
        <template #header>
            <div class="card-header card-header--custom">
                <span>基本資料與參數</span>
                <div class="header__btnGroup">
                    <el-upload v-model:file-list="fileList" :limit="1" :show-file-list="false" @success="handleChange">
                        <el-button>匯入</el-button>
                    </el-upload>
                    <el-button v-if="!user.uid" @click="openSignInDialog()">登入</el-button>
                    <el-button v-else @click="emits('signOut')">登出</el-button>
                </div>
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
                        <econSelect v-model="profile.yearOfBirth" @change="calculateProfile()" style="width: 130px"
                            :options="birthYearOptions">
                        </econSelect>
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
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="職業保險別" required>
                        <econSelect v-model="profile.careerInsuranceType" @change="calculateProfile()"
                            style="width: 130px" :options="config.insuranceTypes">
                        </econSelect>
                    </el-form-item>
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
                        <li>
                            公教人員年金改革到一半，目前沒人知道公保會怎麼調整。
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
    <el-dialog v-model="loginDialogVisible" title="登入" :fullscreen="isFullScreen">
        <p>
            歡迎您使用我們的服務！註冊後，您可以輕鬆使用我們的平台，因為您的資料將被安全儲存，包括電子郵件地址和填寫的表單內容。這樣做是為了方便您下次登入時無需重新輸入表單資料，提供更順暢的使用體驗。我們十分尊重您的隱私，您的資料將受到保護並嚴格保密。
        </p>
        <div id="firebaseui-auth-container"></div>
    </el-dialog>
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
const { VITE_BASE_URL } = import.meta.env
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import firebase from 'firebase/compat/app';
import econSelect from '../econSelect.vue'
const emits = defineEmits(['update:modelValue', 'signOut', 'upload'])
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
const birthYearOptions = ref<any[]>([])
const marriageYearOptions = ref<any[]>([])
const isFullScreen = ref(false)
// hooks
onMounted(async () => {
    setBirthYearOptions()
    setMarriageYears()
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
// methods
const fileList = ref([])
function handleChange(undefined, uploadedRes) {
    const { raw } = uploadedRes
    const userFormFile: File = raw
    var fileReader = new FileReader();
    fileReader.onload = function (evt) {
        const userFormString: string = evt.target.result as string
        const userForm = JSON.parse(userFormString)
        emits('upload', userForm)
    };
    fileReader.readAsText(userFormFile);
}
function setMarriageYears() {
    const currentYear = new Date().getFullYear()
    const beforeYears = []
    const afterYears = []
    for (let i = 0; i < 20; i++) {
        const afterYear = currentYear + i
        afterYears.push({
            label: afterYear,
            value: afterYear,
        })
        if (i !== 0) {
            const beforeYear = currentYear - i
            beforeYears.push({
                label: beforeYear,
                value: beforeYear,
            })
        }
    }
    marriageYearOptions.value = [...afterYears.reverse(), ...beforeYears,]
}
function setBirthYearOptions() {
    const year = new Date().getFullYear()
    for (let i = 0; i < 60; i++) {
        const calculatedYear = Number(year) - i - 18
        birthYearOptions.value.push({
            label: calculatedYear,
            value: calculatedYear
        })
    }
}
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

async function calculateProfile(options: any = { propagate: true }) {
    const { propagate = true } = options
    drawProfileChart(propagate)
}

async function drawProfileChart(propagate = false) {
    const { yearOfBirth, gender } = profile.value
    if (yearOfBirth && gender) {
        const ceYear = new Date().getFullYear()
        const calculateAge = ceYear - Number(yearOfBirth)
        profile.value.age = calculateAge
        if (propagate) {
            emits('update:modelValue', profile.value)
        }
    } else {
        profile.value.age = 0
        profile.value.lifeExpectancy = 0
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

    .header__btnGroup {
        display: flex;
        gap: 8px;
    }
}

.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular);
        background: white !important;
    }
}
</style>
