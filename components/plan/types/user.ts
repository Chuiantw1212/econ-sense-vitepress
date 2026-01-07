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

    // 更新：Rate 和 Amount 都存入資料庫
    pensionRate: number;
    pensionAmount: number;

    // 員工認股 (保留前一版功能)
    stockDeduction: number;
    stockCompanyMatch: number;

    // 新增：眷屬人數
    dependents: number;

    // 每月實領
    monthlyNetIncome: number;
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
 * 退休規劃資料模型
 * 對應資料庫 table: user_retirement
 */
export interface UserLaborPension {
    expectedRetirementAge: number;      // 原 expected_retirement_age
    remainingLifeAtRetirement: number;  // 原 remaining_life_at_retirement
    retirementRoi: number;              // 原 retirement_roi
    employerContribution: number;       // 原 employer_contribution
    employerEarnings: number;           // 原 employer_earnings
    personalContribution: number;       // 原 personal_contribution
    personalEarnings: number;           // 原 personal_earnings
    currentWorkSeniority: number;       // 原 current_work_seniority
}


// 總表單狀態介面 (Global Form State)
export interface UserFormState {
    profile: PersonalProfile;
    career: UserCareer;
    portfolios: UserPortfolio[],
    realEstates: UserRealEstate[],
    businesses: PaginatedResponse<UserBusiness[]>,
    creditCards: UserCreditCard[],
    laborPension: UserLaborPension
}
