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
    birthYear: string | number; // 出生年份 (原 yearOfBirth)
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

// 總表單狀態介面 (Global Form State)
export interface UserFormState {
    profile: PersonalProfile;
    career: UserCareer;
    portfolios: UserPortfolio[]
}
