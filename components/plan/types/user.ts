import { PaginatedResponse } from "./util";
// 模擬 Firebase User 的核心欄位
export interface FirebaseUser {
    id: string,
    uid: string;
    displayName: string;
    email: string;
    photoUrl: string;
    isAnonymous?: boolean;
}

/* =================================================================
   定義資料介面 (Interfaces)
   優化重點：採用金融專業術語 (Financial Standard Naming)
================================================================= */

/**
 * 個人基本資料 (Personal Profile)
 */
export interface PersonalProfile {
    id: string;
    birthDate: string;          // 出生日期 (原 dateOfBirth)
    gender: 'MALE' | 'FEMALE'; // 性別
    currentAge: number;         // 當前年齡 (原 age)
    lifeExpectancy: number;     // 預期壽命
    marriageYear: string;       // 結婚年份 (原 yearOfMarriage)
    careerInsuranceType: string; // 職業保險類別 (例如：勞保、公保)
    biography: string;          // 個人簡介/故事 (原 story)
}

/**
 * 職業與收入資料 (Career & Income)
 */
export interface UserCareer {
    baseSalary: number;
    otherAllowance: number;
    laborInsurance: number;
    healthInsurance: number;
    otherDeduction: number;

    // --- 勞退相關 (Labor Pension) ---

    /** * 個人自提率 (0 ~ 0.06) 
     * 例如: 0.06 代表 6%
     */
    pensionPersonalRate: number;

    /** * 個人自提金額 (Personal Contribution)
     * *這是從薪水扣除的，會影響 monthlyNetIncome*
     * 計算方式: 投保薪資 * pensionPersonalRate
     */
    pensionPersonalAmount: number;

    /** * [新增] 雇主提繳金額 (Employer Contribution)
     * *這是雇主額外出的 (6%)，不影響 monthlyNetIncome，但屬於您的資產*
     * 計算方式: 投保薪資 * 0.06
     */
    pensionEmployerAmount: number;

    /** * [新增] 每月勞退總提撥 (Total Monthly Contribution)
     * *這是給「退休卡片」計算未來現金流 (PMT) 用的*
     * 計算公式: pensionPersonalAmount + employerPensionAmount
     */
    pensionTotalAmount: number;

    // --- 其他 ---

    // 員工認股
    stockDeduction: number;
    stockCompanyMatch: number;

    // 眷屬人數 (影響所得稅扣除額)
    dependents: number;

    // 每月實領 (Net Income)
    monthlyNetIncome: number;

    annualBonus: number;       // 年終與非經常性獎金
    annualTotalIncome: number; // 全年總薪資 (用於階層判斷)
}

/**
 * 
 */
export interface UserPortfolio {
    /** 唯一識別碼 */
    id: string | number;

    /** * 投資市場代碼 
     * e.g., 'US' (美股), 'TW' (台股), 'JP' (日股)
     */
    countryCode: string;

    /** * 交易幣別 
     * e.g., 'USD', 'TWD', 'JPY'
     */
    currency: string;

    /** * 匯率 (Exchange Rate)
     * 用於計算當下 TWD 市值
     */
    exchangeRate: number;

    /** * 庫存市值 (原幣) 
     * Market Value in Original Currency
     */
    marketValue: number;

    /** * 年度已實現損益 (原幣)
     * Realized P&L (Capital Gains + Dividends)
     */
    realizedPnl: number;
}

/**
 * 使用者不動產資產配置模型
 * 對應資料庫欄位: real_estate_assets_data (JSONB)
 */
export interface UserRealEstate {
    /**
     * 唯一識別碼
     * 前端暫用 Date.now() 生成，後端建議改用 UUID
     */
    id: number;

    /**
     * 物件名稱
     * 例：板橋自用宅、信義區投資套房
     */
    name: string;

    /**
     * 屋齡 (年)
     */
    age: number;

    /**
     * 權狀坪數
     * 用於計算總價 (size * pricePerPing)
     */
    size: number;

    /**
     * 單價 (萬/坪)
     */
    pricePerPing: number;

    /**
     * 總價 (市價) - 自動計算
     * 公式：Math.round(pricePerPing * size * 10000)
     * 用於計算資產負債表之總資產
     */
    totalPrice: number;

    /**
     * 公告/評定現值 (稅基)
     * 用於計算持有稅、預估遺產稅與贈與稅
     */
    assessedValue: number;

    /**
     * 預估持有稅率 (%)
     * 包含房屋稅與地價稅之預估合計費率
     */
    holdingTaxRate: number;

    /**
     * [新增] 實際支付房屋稅 (年) - 用於核對與精準計算
     */
    actualHoldingCost: number;

    /**
     * 銀行貸款餘額
     * 用於計算淨值與每月利息支出
     */
    loanAmount: number;

    /**
     * 年利率 (%)
     * 用於計算每月利息成本
     */
    interestRate: number;

    /**
     * 用途狀態
     * self: 自用住宅
     * rent: 出租投資 (開啟租金輸入與 ROI 計算)
     * vacant: 閒置資產
     */
    usageType: 'self' | 'rent' | 'vacant';

    /**
     * 月租金收入
     * 僅當 usageType === 'rent' 時列入現金流計算
     */
    monthlyRent: number;
}

export interface UserBusiness {
    id?: number;
    name: string;
    taxCategory: 'deemed_6' | 'verified' | 'exempt';
    acquisitionCost: number;
    startDate: string;
    projectYears: number;

    /** * 收入輸入模式 
     * - 'monthly': 直接輸入月均
     * - 'total': 輸入累計總額 (由系統自動回推月均)
     */
    incomeMode: 'monthly' | 'total';

    /** * 歷史累計總營收 (真實資料)
     * 當 mode 為 'total' 時，此欄位必填
     */
    totalAccumulatedIncome?: number;

    /** * 預估月平均收入 (計算結果)
     * 系統依然需要這個欄位來計算 ROI 和現金流，
     * 但當 mode='total' 時，這會變成由前端自動計算的唯讀欄位。
     */
    monthlyIncome: number;

    monthlyCost: number;
    loanAmount: number;
    loanInterestRate: number;

    // 新增這兩個欄位 (建議存字串以包含特殊狀態)
    roi?: string;
    irr?: string;

    groupId?: number;
}

export interface UserCreditCard {
    /** * 唯一識別碼 (來自 UserBaseEntity) 
   */
    id?: string;

    /** * Firebase 用戶唯一識別碼 
     */
    firebaseUid?: string;

    /**
     * 卡片名稱 (e.g. 玉山 U Bear)
     */
    name: string;

    /**
     * 扣款帳戶 (e.g. 台新 Richart)
     * 用於追蹤現金流出處
     */
    deductionAccount: string;

    /**
     * 用途分類代碼 (e.g. online, daily, travel)
     * 建議值參考 metadata 中的 opt_credit_card_usage_type
     */
    usageType: string;

    /**
     * 卡片存放位置 (e.g. wallet, digital, drawer)
     * wallet: 錢包(實體), digital: 數位(僅綁定), drawer: 抽屜(少用)
     */
    storageLocation: 'wallet' | 'digital' | 'drawer' | string;

    /**
     * 平均月開支 (預估每月刷卡金額)
     * 在 TypeScript 中對應 BigDecimal 為 number
     */
    averageMonthlyExpense: number;

    /** 建立時間 (ISO String) */
    createdAt?: string | Date;

    /** 更新時間 (ISO String) */
    updatedAt?: string | Date;
}

/**
 * 稅務規劃專用設定 (Tax Planning Configuration)
 * 獨立於 Career，用於管理各類所得、扣除額與稅務策略
 */
export interface UserTax {
    id?: string;

    /** * 預估其他所得 (Other Income)
     * 包含：股利、利息、租金、兼職等需併入綜所稅的金額
     */
    estimatedOtherIncome: number;
}

/**
 * 退休規劃資料模型
 * 對應資料庫 table: user_retirement
 */
export interface UserLaborPension {
    expectedRetirementAge: number;
    remainingLifeAtRetirement: number;
    retirementRoi: number;
    employerContribution: number;
    employerEarnings: number;
    personalContribution: number;
    personalEarnings: number;
    currentWorkSeniority: number;
    /** * [新增] 預估退休時累積總額 (稅前 FV)
     * 用於：紀錄帳面總資產
     */
    predictedLumpSum?: number;

    /** * [新增] 預估稅後實領淨額 (Net FV)
     * 用於：缺口分析卡片 (作為 Asset 1 的起始金額)
     */
    predictedNetLumpSum?: number;
}

/**
 * 勞保老年年金相關資料 (Labor Insurance)
 */
export interface UserLaborInsurance {
    /** * 預計開始請領年齡 (Expected Claim Age)
     * 邏輯: 需大於等於 (法定請領年齡 - 5)
     */
    expectedClaimAge: number;

    /** * 最高 60 個月之平均投保薪資 (Average Monthly Insurance Salary)
     * 限制: 目前上限 45,800
     */
    averageMonthlySalary: number;

    /** * 保險年資 (Insurance Seniority)
     * 單位: 總月數 (Months)
     */
    insuranceSeniority: number;

    predictedRemainingLife: number;
    /** * [新增] 預估每月領取金額 (Annuity)
     * 用於：退休缺口分析卡片 (作為 Asset 2 的現金流基準)
     */
    predictedMonthlyAnnuity?: number;
}

/**
 * 退休規劃全週期資料 (Retirement Lifecycle Entity)
 * 對應資料庫 Table: user_retirement
 * 核心邏輯：涵蓋退休後三個階段的現金流與資產負債設定
 * 1. Go-Go (活躍期): 高娛樂、高活動
 * 2. Slow-Go (慢活期): 醫療支出增加、活動減少
 * 3. No-Go (長照期): 高額照護支出、生活無法自理
 */
export interface UserRetirement {
    /** 資料庫唯一識別碼 (Primary Key) */
    id?: string;

    /** 關聯的用戶 ID (Foreign Key) */
    userId?: string;

    /** 最後更新時間 (ISO 8601 String) */
    updatedAt?: string;

    // ==========================================
    // Phase 1: 活躍期 (Go-Go Years)
    // 特徵：剛退休身體健康，開銷集中在娛樂與維持生活品質
    // ==========================================

    /**
     * 家庭型態 (Household Structure)
     * 影響居住與生活費用的計算基準
     * - 'single': 獨居 (Solo)
     * - 'couple': 伴侶共居 (Co-living, 費用可能分攤)
     */
    householdType: 'single' | 'couple';

    /**
     * 居住方案代碼 (Housing Strategy Code)
     * 對應設定檔: opt_housing_mode.json
     * e.g., 'SOLO_RENT_SUITE' (租套房), 'OWN_house' (自有宅)
     */
    housingMode: string;

    /**
     * 居住月預算 (Monthly Housing Cost)
     * 來源：由 housingMode 查表後寫入，或用戶自訂
     * 包含：租金、管理費、房屋稅攤提等居住剛性支出
     */
    housingCost: number;

    /**
     * 基礎健康維持等級代碼 (Basic Health Tier)
     * 對應設定檔: opt_health_tier.json
     * e.g., 'basic' (健保為主), 'premium' (含高階健檢/保健品)
     */
    healthTierCode: string;

    /**
     * 基礎健康月預算 (Monthly Health Cost)
     * 用於：活躍期的日常保健、健身、營養品支出
     * *注意：此階段尚未包含慢性病或重大醫療支出*
     */
    healthCost: number;

    /**
     * 活躍生活水準代碼 (Active Living Tier)
     * 對應設定檔: opt_active_living.json
     * e.g., 'Q3' (寬裕/國外旅遊), 'Q1' (基本/國內休閒)
     */
    activeLivingCode: string;

    /**
     * 活躍生活月預算 (Monthly Active Living Cost)
     * 包含：伙食、交通、娛樂、旅遊、社交等所有變動開銷
     * *這是退休初期最高的支出項目*
     */
    activeLivingCost: number;

    // ==========================================
    // Phase 2: 慢活期 (Slow-Go Years)
    // 特徵：身體機能退化，醫療頻率增加，娛樂支出轉為醫療防禦
    // ==========================================

    /**
     * [時間軸] Slow-Go 啟動年齡
     * 定義：活躍期的結束點，慢活期的開始點
     * 預設值: 75 歲 (可由用戶調整)
     */
    slowGoStartAge: number;

    /**
     * 醫療防禦策略代碼 (Medical Defense Tier)
     * 對應設定檔: opt_retirement_slowgo_medical.json
     * e.g., 'D_QUALITY' (高品質自費醫療), 'D_BASIC' (健保為主)
     */
    defenseTierCode: string;

    /**
     * 定期醫療月預算 (Monthly Medical Cost)
     * 包含：慢性病掛號費、長期處方藥自費額、定期回診交通費
     * *此階段醫療通膨率通常高於一般通膨*
     */
    monthlyMedicalCost: number;

    /**
     * 重大傷病策略代碼 (Critical Illness Strategy)
     * 對應設定檔: opt_slowgo_critical.json
     * e.g., 'R_STANDARD' (標準癌症備用金)
     */
    criticalIllnessCode: string;

    /**
     * 重大傷病一次性準備金 (Critical Illness Reserve - Lump Sum)
     * 性質：風險自留額 (Risk Retention)
     * 用途：癌症標靶、達文西手術、心臟支架等高額自費材
     * *這是一筆 PV (現值) 存量，而非月支出*
     */
    criticalIllnessReserve: number;

    // ==========================================
    // Phase 3: 長照期 (No-Go Years)
    // 特徵：失能/失智，需要全天候人力或機構照護，資金消耗最快
    // ==========================================

    /**
     * [時間軸] No-Go 啟動年齡
     * 定義：慢活期的結束點，長照期的開始點
     * 上限值：應小於或等於預期壽命 (Life Expectancy)
     * 預設值: 80 歲
     */
    nogoStartAge: number;

    /**
     * 長照模式代碼 (LTC Care Strategy)
     * 對應設定檔: opt_retirement_nogo_ltc_mode.json
     * e.g., 'LTC_HOME_HYBRID' (外看+日照), 'LTC_INSTITUTION' (機構)
     */
    ltcCareMode: string;

    /**
     * 每月主照護成本 (LTC Base Monthly Cost)
     * 包含：外籍/本籍看護薪資、機構月費 (房費+照護費)
     */
    ltcMonthlyCost: number;

    /**
     * 每月隱形雜支 (LTC Hidden Supplies Cost)
     * 包含：尿布、營養品、管路費、特殊醫材、食宿水電差額
     * *極易被低估的項目，建議值 $12,000 ~ $18,000*
     */
    ltcMonthlySupplies: number;

    /**
     * 每月政府補助扣減額 (LTC Subsidy Deduction)
     * 包含：長照2.0居家服務補助、住宿式機構補助
     * 計算公式：(ltcMonthlyCost + ltcMonthlySupplies) - ltcSubsidy = 淨現金流出
     */
    ltcSubsidy: number;
}

// 總表單狀態介面 (Global Form State)
export interface UserFormState {
    profile: PersonalProfile;
    career: UserCareer;
    portfolios: UserPortfolio[],
    realEstates: UserRealEstate[],
    businesses: PaginatedResponse<UserBusiness[]>,
    creditCards: UserCreditCard[],
    tax: UserTax,
    laborPension: UserLaborPension,
    laborInsurance: UserLaborInsurance;
    retirement: UserRetirement
}
