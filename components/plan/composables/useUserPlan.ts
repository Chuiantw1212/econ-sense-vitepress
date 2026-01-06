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
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // 1. 更新使用者基本資料 (Firebase 端)
                loggedInUser.value = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || '會員',
                    email: firebaseUser.email || '',
                    photoUrl: firebaseUser.photoURL || '',
                    isAnonymous: firebaseUser.isAnonymous,
                    id: '' // 待後端回傳資料庫 ID
                }

                // 2. 抓取雲端資料 (後端 DB)
                await fetchPlanData()
            } else {
                // 登出重置
                userForm.value = getInitialUserForm()
                isDataReady.value = false
            }
        })
    }

    /**
     * 核心資料獲取邏輯
     * 修改為：並行獲取 User Info, Portfolios, RealEstates
     */
    async function fetchPlanData() {
        try {
            isDataReady.value = false

            // --- Step 1: 獲取或建立使用者基礎資料 ---
            let userRes = await authFetch('/api/v1/user/me')

            // 如果 404 或是新建用戶，則建立新資料
            if (!userRes) {
                userRes = await authFetch('/api/v1/user/me', { method: 'POST' })
            }

            // 如果使用者存在，才繼續抓取關聯資產
            if (userRes) {
                const baseUserData = await userRes.json()

                // 1. 更新 userForm 的基礎欄位 (保留本地初始值，覆蓋後端回傳值)
                if (baseUserData.id) {
                    userForm.value = {
                        ...userForm.value,
                        ...baseUserData,
                        // 預防後端回傳的 portfolios/realEstates 是舊結構或 null，先暫時用本地狀態或空陣列
                        portfolios: userForm.value.portfolios,
                        realEstates: userForm.value.realEstates
                    }

                    // 同步更新 loggedInUser 的 DB ID
                    loggedInUser.value.id = baseUserData.id
                }

                // --- Step 2: 並行獲取資產列表 (Parallel Fetching) ---
                // 假設您的 API 路徑有包含 /api/v1 前綴
                const [portfolioRes, realEstateRes, businessesRes, creditCardsRes] = await Promise.all([
                    authFetch('/api/v1/user/portfolios'),
                    authFetch('/api/v1/user/real-estates'),
                    authFetch('/api/v1/user/businesses', {
                        params: {
                            currentPage: 1,
                            pageSize: 100,
                        }
                    }),
                    authFetch('/api/v1/user/credit-cards'),
                ])

                // --- Step 3: 更新金融資產 (Portfolios) ---
                if (portfolioRes) {
                    const portfoliosData = await portfolioRes.json()
                    // 確保回傳的是陣列，避免錯誤
                    if (Array.isArray(portfoliosData)) {
                        userForm.value.portfolios = portfoliosData
                    }
                }

                // --- Step 4: 更新不動產 (RealEstates) ---
                if (realEstateRes) {
                    const realEstatesData = await realEstateRes.json()
                    // 確保回傳的是陣列
                    if (Array.isArray(realEstatesData)) {
                        userForm.value.realEstates = realEstatesData
                    }
                }

                // --- Step 5: 更新商業資產 ---
                if (businessesRes) {
                    const businessesData = await businessesRes.json()
                    // 確保回傳的是陣列
                    if (Array.isArray(businessesData.list)) {
                        userForm.value.businesses = businessesData
                    }
                }

                // --- Step 6: 更新信用卡 ---
                if (creditCardsRes) {
                    const creditCardsData = await creditCardsRes.json()
                    // 確保回傳的是陣列
                    if (Array.isArray(creditCardsData)) {
                        userForm.value.creditCards = creditCardsData
                    }
                }
            }

        } catch (e) {
            console.error("fetchPlanData error:", e)
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