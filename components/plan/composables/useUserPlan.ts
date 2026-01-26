import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { ElMessage } from 'element-plus'
import { useApi } from './useApi'
import { getInitialUserForm } from '../constants/initialState'
import type { UserFormState, FirebaseUser } from '../types/user'

// 建立全域狀態 (Singleton)
const userForm = ref<UserFormState>(getInitialUserForm())
const loggedInUser = ref<FirebaseUser>({
    id: "", uid: "", displayName: "訪客", email: "", photoUrl: "", isAnonymous: true
})
const isDataReady = ref(false)

export function useUserPlan() {
    const { authFetch } = useApi()

    function initAuthListener() {
        const auth = getAuth()
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // [登入狀態]
                loggedInUser.value = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || '會員',
                    email: firebaseUser.email || '',
                    photoUrl: firebaseUser.photoURL || '',
                    isAnonymous: firebaseUser.isAnonymous,
                    id: ''
                }
                await fetchPlanData()
            } else {
                // [登出狀態]
                loggedInUser.value = {
                    id: "", uid: "", displayName: "訪客", email: "", photoUrl: "", isAnonymous: true
                }

                // 清除資料庫 ID
                clearDatabaseIds(userForm.value)

                isDataReady.value = true
            }
        })
    }

    async function logout() {
        try {
            isDataReady.value = false
            const auth = getAuth()
            await signOut(auth)

            resetToGuest()
            ElMessage.success('已切換為離線模式，資料已保留')
        } catch (e: any) {
            console.error('Logout failed', e)
            ElMessage.error('登出失敗')
        } finally {
            setTimeout(() => { isDataReady.value = true }, 500)
        }
    }

    function resetToGuest() {
        loggedInUser.value = {
            id: "", uid: "", displayName: "訪客", email: "", photoUrl: "", isAnonymous: true
        }
        clearDatabaseIds(userForm.value)
    }

    /**
     * [修正] 清除資料庫 ID
     * 將 ID 設為空字串，商業部分直接重置為空物件
     */
    function clearDatabaseIds(form: UserFormState) {
        // 單一物件
        if (form.profile) form.profile.id = ""
        if (form.career) form.career.id = ""
        if (form.retirement) form.retirement.id = ""
        if (form.tax) form.tax.id = ""
        if (form.laborInsurance) form.laborInsurance.id = ""
        if (form.laborPension) form.laborPension.id = ""

        // 陣列物件
        form.portfolios?.forEach(i => i.id = "")
        form.realEstates?.forEach(i => i.id = "")
        form.creditCards?.forEach(i => i.id = "")

        // [修正] 商業 (Businesses) - 直接重置為空狀態
        form.businesses = {
            list: [],
            total: 0,
            currentPage: 1,
            pageSize: 100,
            totalPages: 1
        }
    }

    async function fetchPlanData() {
        try {
            isDataReady.value = false

            let userRes = await authFetch('/api/v1/user/me')
            if (!userRes) {
                userRes = await authFetch('/api/v1/user/me', { method: 'POST' })
            }

            if (userRes) {
                const baseUserData = await userRes.json()

                if (baseUserData.id) {
                    userForm.value = {
                        ...userForm.value,
                        ...baseUserData,
                        portfolios: userForm.value.portfolios,
                        realEstates: userForm.value.realEstates,
                        businesses: userForm.value.businesses
                    }
                    loggedInUser.value.id = String(baseUserData.id)
                }

                const [portfolioRes, realEstateRes, businessesRes, creditCardsRes] = await Promise.all([
                    authFetch('/api/v1/user/portfolios'),
                    authFetch('/api/v1/user/real-estates'),
                    authFetch('/api/v1/user/businesses', { params: { currentPage: 1, pageSize: 100 } }),
                    authFetch('/api/v1/user/credit-cards'),
                ])

                if (portfolioRes) {
                    const data = await portfolioRes.json()
                    if (Array.isArray(data)) userForm.value.portfolios = data
                }
                if (realEstateRes) {
                    const data = await realEstateRes.json()
                    if (Array.isArray(data)) userForm.value.realEstates = data
                }
                if (businessesRes) {
                    const data = await businessesRes.json()
                    // 確保回傳的是物件結構且包含 list
                    if (data && Array.isArray(data.list)) {
                        userForm.value.businesses = data
                    }
                }
                if (creditCardsRes) {
                    const data = await creditCardsRes.json()
                    if (Array.isArray(data)) userForm.value.creditCards = data
                }
            }

        } catch (e) {
            console.error("fetchPlanData error:", e)
            ElMessage.error('同步雲端資料時發生錯誤')
        } finally {
            isDataReady.value = true
        }
    }

    function importPlanData(data: any) {
        try {
            if (!data || typeof data !== 'object') throw new Error('無效的資料格式')

            const requiredKeys = ['profile', 'career', 'portfolios', 'realEstates']
            const hasAnyKey = requiredKeys.some(key => key in data)
            if (!hasAnyKey) throw new Error('檔案內容不符合財務規劃書格式')

            // 匯入資料
            userForm.value = {
                ...getInitialUserForm(),
                ...data
            }

            // 訪客模式下清除 ID (注意：這會連帶把匯入的商業資料清空)
            if (!loggedInUser.value.uid) {
                clearDatabaseIds(userForm.value)
            }

            // 防呆處理
            if (!Array.isArray(userForm.value.portfolios)) userForm.value.portfolios = []
            if (!Array.isArray(userForm.value.realEstates)) userForm.value.realEstates = []
            if (!Array.isArray(userForm.value.creditCards)) userForm.value.creditCards = []

            // 商業部分防呆：確保結構正確
            if (!userForm.value.businesses || !Array.isArray(userForm.value.businesses.list)) {
                // 如果匯入的資料不完整或結構錯誤，給予預設空值
                userForm.value.businesses = {
                    list: [], total: 0, currentPage: 1, pageSize: 100, totalPages: 1
                }
            }

            isDataReady.value = true
            ElMessage.success('財務資料匯入成功！')

        } catch (e: any) {
            console.error('Import failed:', e)
            ElMessage.error(`匯入失敗：${e.message}`)
            throw e
        }
    }

    return {
        userForm,
        loggedInUser,
        isDataReady,
        initAuthListener,
        fetchPlanData,
        importPlanData,
        logout
    }
}