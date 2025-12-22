// composables/useUserPlan.ts
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useApi } from './useApi'
import { getInitialUserForm } from '../constants/initialState'
import type { UserFormState, FirebaseUser } from '../types/user'

// 建立全域狀態 (Singleton)，這樣切換頁面資料還在
const userForm = ref<UserFormState>(getInitialUserForm())
const loggedInUser = ref<FirebaseUser>({
    id: "", uid: "", displayName: "訪客", email: "", photoUrl: "", isAnonymous: true
})
const isDataReady = ref(false)

export function useUserPlan() {
    const { authFetch } = useApi()

    // 初始化監聽器 (建議在 App.vue 或 Layout 層級呼叫一次即可)
    function initAuthListener() {
        const auth = getAuth()
        // onAuthStateChanged 會回傳 unsubscribe 函數
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // 1. 更新使用者基本資料
                loggedInUser.value = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || '會員',
                    email: firebaseUser.email || '',
                    photoUrl: firebaseUser.photoURL || '',
                    isAnonymous: firebaseUser.isAnonymous,
                    id: '' // 待後端回傳
                }
                // console.log(loggedInUser.value)
                // 2. 抓取雲端資料
                await fetchPlanData()
            } else {
                // 登出重置
                userForm.value = getInitialUserForm()
                isDataReady.value = false
            }
        })
    }

    async function fetchPlanData() {
        try {
            isDataReady.value = false
            // 先嘗試讀取
            let res = await authFetch('/api/v1/user/profile')

            // 如果 404 或是新建用戶，則建立新資料
            if (!res) {
                res = await authFetch('/api/v1/user/profile', { method: 'POST' })
            }

            if (res) {
                const remoteData = await res.json()
                if (remoteData.id) {
                    // loggedInUser.value.id = remoteData.id
                    Object.assign(userForm.value.profile, remoteData)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            isDataReady.value = true
        }
    }

    return {
        userForm,
        loggedInUser,
        isDataReady,
        initAuthListener,
        fetchPlanData
    }
}