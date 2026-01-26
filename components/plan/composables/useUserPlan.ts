// composables/useUserPlan.ts
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useApi } from './useApi'
import { getInitialUserForm } from '../constants/initialState'
import type { UserFormState, FirebaseUser } from '../types/user'
import { ElMessage } from 'element-plus' // 建議加入 UI 提示

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

    /**
     * [新增] 匯入外部 JSON 資料並更新本地狀態
     * @param data 匯入的 JSON 物件
     */
    function importPlanData(data: any) {
        try {
            // 1. 簡易結構驗證 (至少要有 profile 或 career 其中之一才算有效)
            if (!data || typeof data !== 'object') {
                throw new Error('無效的資料格式')
            }

            // 檢查關鍵欄位是否存在 (Loose check)
            const requiredKeys = ['profile', 'career', 'portfolios', 'realEstates']
            const hasAnyKey = requiredKeys.some(key => key in data)

            if (!hasAnyKey) {
                throw new Error('檔案內容不符合財務規劃書格式')
            }

            // 2. 深度合併或覆蓋資料
            // 這裡採用「覆蓋策略」，但保留原有的 ID (如果是登入狀態，ID 不能亂改以免影響後端更新)
            // 如果是純離線模式，ID 覆蓋也無所謂

            const currentId = userForm.value.profile?.id // 保留當前用戶 ID (若有)

            // 使用解構賦值進行覆蓋，並確保陣列型別正確
            // 注意：這裡假設匯入的 JSON 結構與 UserFormState 完全一致
            userForm.value = {
                ...getInitialUserForm(), // 先重置為初始狀態，避免舊資料殘留
                ...data,                 // 覆蓋匯入資料
                profile: {
                    ...data.profile,
                    // 如果希望匯入後仍視為當前用戶的資料，可保留 ID
                    id: currentId || data.profile?.id 
                }
            }

            // 3. 特殊處理：確保陣列欄位不為 null
            if (!Array.isArray(userForm.value.portfolios)) userForm.value.portfolios = []
            if (!Array.isArray(userForm.value.realEstates)) userForm.value.realEstates = []
            if (!Array.isArray(userForm.value.creditCards)) userForm.value.creditCards = []

            // 商業 (Businesses) 結構可能比較複雜 (list)
            if (data.businesses && Array.isArray(data.businesses.list)) {
                userForm.value.businesses = data.businesses
            } else if (!userForm.value.businesses) {
                userForm.value.businesses = { list: [], total: 0, currentPage: 1, pageSize: 100, totalPages: 1 }
            }

            isDataReady.value = true

            ElMessage.success('財務資料匯入成功！')

        } catch (e: any) {
            console.error('Import failed:', e)
            ElMessage.error(`匯入失敗：${e.message}`)
            throw e // 讓呼叫端知道失敗了
        }
    }

    return {
        userForm,
        loggedInUser,
        isDataReady,
        initAuthListener,
        fetchPlanData,
        importPlanData
    }
}