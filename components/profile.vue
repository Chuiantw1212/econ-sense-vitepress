<template>
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
        <el-form ref="ruleFormRef" :model="profile" label-width="auto">
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
                            @change="onYearOfBirthChanged()" style="width: 130px">
                            <option label="請選擇" value=""></option>
                            <option v-for="year in birthYearOptions" :key="year" :label="year" :value="year" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="試算年齡">
                        <el-text>{{ profile.age }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="性別" required>
                        <el-radio-group v-model="profile.gender" @change="handleGenderChanged()">
                            <el-radio v-for="(item, key) in genders" :value="item.value">{{ item.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="預估餘命">
                        <el-text>{{ profile.lifeExpectancy }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="通貨膨脹">
                        <el-text>{{ inflationRate }}%</el-text>
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
        <div v-if="!user.uid" id="firebaseui-auth-container"></div>
    </el-dialog>
    <el-dialog v-model="loadingDialogVisible" title="等待伺服器開機" width="500">
        <div>此為免費服務，伺服器開機需10秒左右來準備以下必須資料。</div>
        <ul>
            <li>餘命運算</li>
            <li>2023聯徵房地資料契約</li>
            <li>央行擔保放款融通利率</li>
        </ul>
        <div>完成後此提示會自動關閉。就可以開始使用了。</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="backToCalendar()">放棄使用</el-button>
                <el-button v-loading="true" :disabled="true" type="primary" @click="loadingDialogVisible = false">
                    下一步
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>
<script setup lang="ts">
import { onMounted, ref, reactive, watch, nextTick, shallowRef, onBeforeUnmount, computed } from 'vue'
import firebase from 'firebase/compat/app';
const emits = defineEmits(['signOut'])
const user = reactive({
    displayName: '註冊用戶',
    email: '',
    photoURL: '',
    uid: '',
    id: '',
})
const profile = reactive({
    id: '', // 避免登入判斷錯誤
    yearOfBirth: '',
    dateOfBirth: '',
    gender: '',
    age: 0,
    lifeExpectancy: 0,
})
function openSignInDialog() {
    nextTick(() => {
        const uiConfig = {
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
</script>