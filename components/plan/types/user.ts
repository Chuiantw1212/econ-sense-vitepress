import { PaginatedResponse } from "./util";

// 模擬 Firebase User 的核心欄位
export interface FirebaseUser {
    id: string; // [修改] 統一為 string，方便與資料庫 UUID 對接
    uid: string;
    displayName: string;
    email: string;
    photoUrl: string;
    isAnonymous?: boolean;
}

/* =================================================================
   定義資料介面 (Interfaces)
   優化重點：
   1. ID 統一為字串 (string)，解決型別不一致問題。
   2. 採用金融專業術語 (Financial Standard Naming)。
================================================================= */

/**
 * 個人基本資料 (Personal Profile)
 */
export interface PersonalProfile {
    /** 資料庫唯一識別碼 */
    id?: string;

    /** 出生日期 (格式: YYYY-MM-DD) */
    birthDate: string;

    /** 生理性別 (影響預期壽命與保費計算) */
    gender: 'MALE' | 'FEMALE';

    /** 當前試算年齡 */
    currentAge: number;

    /** 預期壽命 (依據國發會推估或自訂) */
    lifeExpectancy: number;

    /** 結婚年份 (建議存字串，如 '2020') */
    marriageYear: string;

    /** 職業保險類別 (例如：勞保 LABOR、公保 PUBLIC) */
    careerInsuranceType: string;

    /** 個人簡介/故事 */
    biography?: string;
}

/**
 * 職業與收入資料 (Career & Income)
 */
export interface UserCareer {
    id?: string;

    /** 本薪 (Base Salary) */
    baseSalary: number;

    /** 其他津貼 (Allowance) */
    otherAllowance: number;

    /** 勞保費個人負擔 */
    laborInsurance: number;

    /** 健保費個人負擔 */
    healthInsurance: number;

    /** 其他扣項 (福利金等) */
    otherDeduction: number;

    // --- 勞退相關 (Labor Pension) ---

    /** 個人自提率 (0 ~ 0.06) */
    pensionPersonalRate: number;

    /** 個人自提金額 (從薪資扣除) */
    pensionPersonalAmount: number;

    /** 雇主提繳金額 (額外資產，不影響實領薪資) */
    pensionEmployerAmount: number;

    /** 每月勞退總提撥 (個人+雇主)，用於計算未來現金流 */
    pensionTotalAmount: number;

    // --- 其他 ---

    /** 員工認股扣款 */
    stockDeduction: number;

    /** 公司相對提撥 (Matching) */
    stockCompanyMatch: number;

    /** 扶養親屬人數 (影響稅務) */
    dependents: number;

    /** 每月實領淨額 (Net Income) */
    monthlyNetIncome: number;

    /** 年終與非經常性獎金 */
    annualBonus: number;

    /** 全年總收入 (用於稅務階層判斷) */
    annualTotalIncome: number;
}

/**
 * 金融資產 (Portfolios)
 * 包含股票、ETF、基金、外幣等
 */
export interface UserPortfolio {
    id?: string;

    /** 投資市場代碼 (e.g., 'US', 'TW', 'JP') */
    countryCode: string;

    /** 交易幣別 (e.g., 'USD', 'TWD') */
    currency: string;

    /** 匯率 (Exchange Rate)，用於計算 TWD 市值 */
    exchangeRate: number;

    /** 庫存市值 (原幣) */
    marketValue: number;

    /** 年度已實現損益 (原幣) */
    realizedPnl: number;

    /** (選填) 標的代碼 */
    targetSymbol?: string;

    /** (選填) 資產配置權重 */
    equityWeight?: number;

    /** (選填) 年化報酬率 */
    annualizedReturn?: number;
}

/**
 * 不動產資產 (Real Estate)
 */
export interface UserRealEstate {
    id?: string;

    /** 物件名稱 (e.g. 板橋自用宅) */
    name: string;

    /** 屋齡 */
    age: number;

    /** 權狀坪數 */
    size: number;

    /** 單價 (萬/坪) */
    pricePerPing: number;

    /** 總價 (市價) = 單價 * 坪數 */
    totalPrice: number;

    /** 公告/評定現值 (稅基) */
    assessedValue: number;

    /** 預估持有稅率 (%) */
    holdingTaxRate: number;

    /** 實際支付持有稅 (年) */
    actualHoldingCost: number;

    /** 銀行貸款餘額 */
    loanAmount: number;

    /** 貸款年利率 (%) */
    interestRate: number;

    /** 用途: 自用(self) / 出租(rent) / 閒置(vacant) */
    usageType: 'self' | 'rent' | 'vacant';

    /** 月租金收入 (僅當 rent 時有效) */
    monthlyRent: number;
}

/**
 * 商業/副業 (Business / Side Hustle)
 * 例如：太陽能板投資、加盟店、網拍
 */
export interface UserBusiness {
    id?: string;

    /** 專案名稱 */
    name: string;

    /** 稅務類別: 6%推計(deemed_6) / 核實申報(verified) / 免稅(exempt) */
    taxCategory: 'deemed_6' | 'verified' | 'exempt';

    /** 取得成本 (本金) */
    acquisitionCost: number;

    /** 開始日期 */
    startDate: string;

    /** 專案年限 */
    projectYears: number;

    /** 收入模式: 每月固定(monthly) / 累計總額反推(total) */
    incomeMode: 'monthly' | 'total';

    /** 歷史累計總營收 (當 mode='total' 時必填) */
    totalAccumulatedIncome?: number;

    /** 預估月平均收入 */
    monthlyIncome: number;

    /** 每月營運成本 */
    monthlyCost: number;

    /** 貸款金額 */
    loanAmount: number;

    /** 貸款利率 */
    loanInterestRate: number;

    /** 投報率 ROI (顯示用字串或數值) */
    roi?: string | number;

    /** 內部報酬率 IRR */
    irr?: string | number;

    /** 群組 ID (若有) */
    groupId?: number;
}

/**
 * 信用卡 (Credit Card)
 * 用於支出管理與現金流追蹤
 */
export interface UserCreditCard {
    id?: string;

    /** Firebase UID */
    firebaseUid?: string;

    /** 卡片名稱 (e.g. 玉山 U Bear) */
    name: string;

    /** 扣款帳戶 (e.g. 台新 Richart) */
    deductionAccount: string;

    /** 用途分類 (e.g. online, daily) */
    usageType: string;

    /** 存放位置: 錢包(wallet) / 數位(digital) / 抽屜(drawer) */
    storageLocation: 'wallet' | 'digital' | 'drawer' | string;

    /** 平均月刷卡金額 */
    averageMonthlyExpense: number;

    createdAt?: string | Date;
    updatedAt?: string | Date;
}

/**
 * 稅務規劃專用設定 (Tax)
 */
export interface UserTax {
    id?: string;

    /** 預估其他所得 (股利、利息、租金等需併入綜所稅項目) */
    estimatedOtherIncome: number;
}

/**
 * 勞退 (Labor Pension)
 * 新制退休金個人專戶
 */
export interface UserLaborPension {
    id?: string;

    /** 預計退休年齡 */
    expectedRetirementAge: number;

    /** 退休後預期餘命 */
    remainingLifeAtRetirement: number;

    /** 退休金投資報酬率預估 */
    retirementRoi: number;

    /** 雇主提繳累積額 */
    employerContribution: number;

    /** 雇主提繳收益 */
    employerEarnings: number;

    /** 個人提繳累積額 */
    personalContribution: number;

    /** 個人提繳收益 */
    personalEarnings: number;

    /** 目前年資 (月) */
    currentWorkSeniority: number;

    /** 預估退休時累積總額 (稅前 FV) */
    predictedLumpSum?: number;

    /** 預估稅後實領淨額 (Net FV) */
    predictedNetLumpSum?: number;
}

/**
 * 勞保 (Labor Insurance)
 * 老年年金給付
 */
export interface UserLaborInsurance {
    id?: string;

    /** 預計請領年齡 */
    expectedClaimAge: number;

    /** 最高 60 個月平均投保薪資 */
    averageMonthlySalary: number;

    /** 保險年資 (月) */
    insuranceSeniority: number;

    /** 預估領取年限 */
    predictedRemainingLife: number;

    /** 預估每月領取金額 (Annuity) */
    predictedMonthlyAnnuity?: number;
}

/**
 * 退休規劃全週期 (Retirement Lifecycle)
 * 涵蓋 Go-Go, Slow-Go, No-Go 三階段
 */
export interface UserRetirement {
    id?: string;
    userId?: string;
    updatedAt?: string;

    // --- Phase 1: 活躍期 (Go-Go) ---
    /** 家庭型態: 獨居(single) / 伴侶(couple) */
    householdType: 'single' | 'couple';

    /** 居住模式代碼 */
    housingMode: string;

    /** 居住月預算 */
    housingCost: number;

    /** 健康等級代碼 */
    healthTierCode: string;

    /** 健康月預算 (日常保健) */
    healthCost: number;

    /** 活躍生活水準代碼 */
    activeLivingCode: string;

    /** 活躍生活月預算 (娛樂、旅遊) */
    activeLivingCost: number;

    // --- Phase 2: 慢活期 (Slow-Go) ---
    /** Slow-Go 啟動年齡 (預設 75) */
    slowGoStartAge: number;

    /** 醫療防禦策略代碼 */
    defenseTierCode: string;

    /** 定期醫療月預算 (慢性病) */
    monthlyMedicalCost: number;

    /** 重大傷病策略代碼 */
    criticalIllnessCode: string;

    /** 重大傷病一次性準備金 (風險自留額) */
    criticalIllnessReserve: number;

    // --- Phase 3: 長照期 (No-Go) ---
    /** No-Go 啟動年齡 (預設 80) */
    nogoStartAge: number;

    /** 長照模式代碼 (e.g. 居家、機構) */
    ltcCareMode: string;

    /** 每月主照護成本 */
    ltcMonthlyCost: number;

    /** 每月隱形雜支 (尿布、營養品) */
    ltcMonthlySupplies: number;

    /** 政府補助扣減額 */
    ltcSubsidy: number;
}

/**
 * 總表單狀態介面 (Global Form State)
 * 前端使用的主要資料結構
 */
export interface UserFormState {
    /** 財務規劃書 ID */
    id?: string;

    profile: PersonalProfile;
    career: UserCareer;

    /** 金融資產列表 */
    portfolios: UserPortfolio[];

    /** 不動產列表 */
    realEstates: UserRealEstate[];

    /** 商業/副業列表 (簡化為陣列結構) */
    businesses: PaginatedResponse<UserBusiness>,

    /** 信用卡列表 */
    creditCards: UserCreditCard[];

    tax: UserTax;
    laborPension: UserLaborPension;
    laborInsurance: UserLaborInsurance;
    retirement: UserRetirement;
}