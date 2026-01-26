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
                if (loggedInUser.value.uid) {
                    resetToGuest()
                }
                if (!isDataReady.value) {
                    isDataReady.value = true
                }
            }
        })
    }

    /**
     * 重置為訪客狀態 (登出用)
     * 這裡使用 getInitialUserForm 徹底清空「資料」，回歸初始值
     */
    function resetToGuest() {
        loggedInUser.value = {
            id: "", uid: "", displayName: "訪客", email: "", photoUrl: "", isAnonymous: true
        }
        // 登出時：徹底清空所有欄位資料
        userForm.value = getInitialUserForm()
    }

    async function logout() {
        try {
            isDataReady.value = false
            const auth = getAuth()
            await signOut(auth)

            resetToGuest()
            ElMessage.success('已安全登出')
        } catch (e: any) {
            console.error('Logout failed', e)
            ElMessage.error('登出失敗')
        } finally {
            setTimeout(() => {
                isDataReady.value = true
            }, 500)
        }
    }

    /**
     * [修正邏輯] 清除資料庫 ID (匯入用)
     * 目的：保留「資料內容」，只移除「ID」以便視為新資料
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

        // [修正] 商業 (Businesses)
        // 這裡不能清空 list，而是要保留 list 內容，只把裡面的 id 拿掉
        if (form.businesses && Array.isArray(form.businesses.list)) {
            form.businesses.list.forEach(i => i.id = "")
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

            // 訪客模式下清除 ID (避免 ID 衝突)
            if (!loggedInUser.value.uid) {
                clearDatabaseIds(userForm.value)
            }

            // 防呆處理
            if (!Array.isArray(userForm.value.portfolios)) userForm.value.portfolios = []
            if (!Array.isArray(userForm.value.realEstates)) userForm.value.realEstates = []
            if (!Array.isArray(userForm.value.creditCards)) userForm.value.creditCards = []

            // 商業結構防呆
            if (!userForm.value.businesses || !Array.isArray(userForm.value.businesses.list)) {
                // 如果匯入的是舊版陣列，嘗試轉型
                if (Array.isArray(userForm.value.businesses)) {
                    userForm.value.businesses = {
                        list: userForm.value.businesses,
                        total: (userForm.value.businesses as any[]).length,
                        currentPage: 1,
                        pageSize: 100,
                        totalPages: 1
                    }
                } else {
                    // 若無資料，給空物件
                    userForm.value.businesses = {
                        list: [], total: 0, currentPage: 1, pageSize: 100, totalPages: 1
                    }
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