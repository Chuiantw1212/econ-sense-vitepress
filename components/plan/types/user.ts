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
export interface CareerProfile {
    householdSize: number;           // 家庭人數 (原 headCount)
    monthlyBaseSalary: number;       // 月本薪 (Gross Salary)
    employeeWelfareFundRate: number; // 職工福利金費率
    employeeWelfareFundAmount: number; // 職工福利金金額
    // 若是金額建議用 employeeWelfareFundAmount
    insuredUnit: 'company' | 'union' | string; // 投保單位
    regionalAllowance: number;       // 地域加給

    // 社會保險 (Social Insurance - e.g., Labor Insurance)
    socialInsurance: {
        personalPremium: number;       // 勞保個人負擔 (Labor Insurance Premium)
        insuredSalary: number;         // 投保薪資 (原 salary)
        currentSeniority: number;      // 目前年資 (原 presentSeniority)
        projectedSeniority: number;    // 預估未來年資 (原 futureSeniority)
    };

    // 退休金提撥 (Pension Contribution - e.g., Labor Pension)
    pension: {
        insuredSalary: number;         // 提撥薪資基級 (原 salary)
        contributionRate: number;      // 提撥率 (原 rate)
        employerMonthlyContribution: number; // 雇主月提撥額 (原 monthlyContribution)
        employeeMonthlyContribution: number; // 勞工自願月提撥額 (原 monthlyContributionEmployee)
    };

    healthInsurancePremium: number;  // 健保費
    estimatedMonthlyNetIncome: number; // 預估月稅後淨利 (原 monthlyNetPayEstimated)
    actualMonthlyNetIncome: number;    // 實領薪資 (Net Pay)
    monthlyLivingExpenses: number;     // 月生活支出 (原 monthlyExpense)
    monthlySavingsAmount: number;      // 月儲蓄金額 (原 monthlySaving)
}

/**
 * 退休規劃 (Retirement Planning)
 */
export interface RetirementPlan {
    retirementAge: number;           // 預計退休年齡 (原 age)
    lifeExpectancy: number;          // 預期壽命 (同上，可能重複但用於計算)
    yearsUntilRetirement: number;    // 距離退休年數 (原 yearsToRetirement)
    retirementYear: number;          // 預計退休年份 (原 yearOfRetire)
    projectedLumpSum: number;        // 預估退休金總額 (一次領) (原 annuitySum，Annuity通常指年金，LumpSum指一次領)

    // 社會保險年金 (Social Security Annuity)
    socialSecurity: {
        monthlyAnnuity: number;        // 月退俸/年金 (原 monthlyAnnuity)
        currentSeniority: number;      // 目前年資
        projectedSeniority: number;    // 預估退休時年資
    };

    // 職業退休金 (Occupational Pension)
    occupationalPension: {
        employeeContributionTotal: number;      // 勞工自提累計本金 (原 employeeContribution)
        employeeContributionReturn: number;     // 勞工自提累計收益 (原 employeeContributionIncome)
        employerContributionTotal: number;      // 雇主提撥累計本金 (原 employerContribution)
        employerContributionReturn: number;     // 雇主提撥累計收益 (原 employerContributionIncome)
        annualizedReturnRate: number;           // 預期年化報酬率 (原 irrOverDecade)
        projectedLumpSum: number;               // 預估退休金總額 (原 lumpSum)
    };

    monthlyRetirementLivingExpenses: number; // 退休後月生活費 (原 monthlyLivingExpense)

    // 失能照護規劃 (Disability & Long-term Care)
    longTermCare: {
        onsetAge: number;                // 預估失能年齡 (原 age)
        monthlyLivingExpenses: number;   // 失能後月生活費
        monthlyCareExpenses: number;     // 月照護費用 (原 monthlyCaringExpense)
        housingArrangement: string;      // 居住安排 (原 housing)
        caregiverType: string;           // 照護者類型 (原 carer)
    };
}

/**
 * 投資組合部位 (Portfolio Position)
 * 已依您的要求保留優化後的版本
 */
export interface PortfolioPosition {
    /**
     * 標的代碼 (Target Symbol)
     * 例如: 'AOA', 'AOK', 'VT'
     */
    targetSymbol: string;

    /**
     * 股票權重/股債比 (Equity Weight)
     * 說明: 股票在投資組合中的比例 (0~1 或 0~100)。
     */
    equityWeight: number;

    /**
     * 預期年化報酬率 (Annualized Return / CAGR)
     * 說明: 來自爬蟲抓取的長期歷史年化報酬率。
     */
    annualizedReturn: number;

    /**
     * 市場現值 (Market Value)
     * 說明: 該部位目前的總資產價值。
     */
    marketValue: number;
}

/**
 * 配偶資料 (Spouse Information)
 */
export interface SpouseProfile {
    marriageYear: string;           // 結婚年份 (原 yearOfMarriage)
    marriageDuration: number;       // 結婚年數 (原 marriageLength)
    monthlyHouseholdContribution: number; // 配偶月分擔家計額 (原 monthlyContribution)
    weddingExpenses: number;        // 婚禮費用 (原 weddingExpense)
    birthYear: string;              // 出生年份
    monthlyNetIncome: number;       // 月稅後淨利 (原 monthlyNetPay)
    personalMonthlyExpenses: number; // 個人月支出 (原 monthlyExpense)
}

/**
 * 子女教養計畫 (Parenting & Education Plan)
 */
export interface ParentingPlan {
    annualChildExpense: number;           // 子女年平均支出 (原 childAnnualExpense)
    spouseMonthlyContribution: number;    // 配偶月分擔育兒費 (原 spouseMonthlyContribution)
    financialIndependenceAge: number;     // 子女經濟獨立年齡 (原 independentAge)
    firstChildBirthYear: number;          // 第一胎出生年 (原 firstBornYear)
    secondChildBirthYear: number;         // 第二胎出生年 (原 secondBornYear)

    // 保險規劃
    insuranceBudget: number;              // 保險預算 (原 insurance，命名較模糊)
    numberOfChildren: number;             // 子女人數 (原 headCount)
    lifeInsuranceCoverage: number;        // 壽險保額需求 (原 lifeInsurance)
}

/**
 * 房貸試算資料 (Mortgage Analysis)
 */
export interface MortgageAnalysis {
    // --- A. 貸款參數 (Loan Parameters) ---
    downPaymentRatio: number;       // 頭期款比例 (%) (原 downpayPercent)
    annualInterestRate: number;     // 年利率 (%) (原 interestRate)
    loanTenure: number;             // 貸款年期 (年) (原 loanTerm)

    // --- B. 價格定錨 (Price Benchmarks) ---
    marketEstimatedPrice: number;   // 市場估算價格 (原 estimatedPrice)
    targetPurchasePrice: number;    // 目標成交價格 (原 targetPrice)

    // --- C. 時間價值 (Time Value) ---
    expectedPurchaseYear: number;   // 預計購屋年度 (原 purchaseYear)
    futurePropertyValue: number;    // 預估未來房價 (考量通膨) (原 futurePrice)

    // --- D. 資金缺口 (Funding Gap) ---
    requiredDownPayment: number;    // 應備頭期款 (原 requiredDownPayment)
    currentAvailableCapital: number;// 現有自備款 (原 availableDownPayment)

    // --- E. 還款壓力 (Repayment Burden) ---
    loanPrincipal: number;          // 貸款本金 (原 loanAmount)
    monthlyMortgagePayment: number; // 月付房貸金額 (原 monthlyPayment)
}

/**
 * 不動產物件資料 (Real Estate Property)
 */
export interface RealEstateProperty {
    // 價格與市場行情資訊 (Market Data)
    marketInfo: {
        county: string;                 // 縣市
        district: string;               // 鄉鎮市區 (原 town，台灣行政區通常用 District)
        propertyType: string;           // 物件型態 (Building Type)
        propertyAge: string;            // 屋齡 (Building Age)
        hasParkingSpace: boolean | string; // 是否含車位 (建議轉為 boolean)

        // 市場行情統計
        sampleCount: number;            // 樣本數 (原 count)
        percentile25Price: number;      // 第25百分位價格 (原 pr25)
        percentile75Price: number;      // 第75百分位價格 (原 pr75)
        averageTotalPrice: number;      // 平均總價 (原 average)
        averageUnitPrice: number;       // 平均單價 (萬/坪) (原 unitPrice)
    };

    // 物件規格 (Property Specifications)
    specs: {
        // --- 1. 面積資訊 (Area in Ping) ---
        grossFloorArea: number;         // 權狀面積 (原 grossArea)
        mainBuildingArea: number;       // 主建物面積 (原 mainArea)
        ancillaryBuildingArea: number;  // 附屬建物面積 (原 ancillaryArea)
        commonArea: number;             // 公設面積 (原 commonArea)
        parkingArea: number;            // 車位面積 (原 parkingArea)

        // --- 2. 格局配置 (Layout) ---
        occupantCount: number;          // 居住人數 (原 headCount)
        bathroomCount: number;          // 衛浴數
        livingRoomCount: number;        // 廳數
        balconyCount: number;           // 陽台數

        // 臥室配置
        doubleBedroomCount: number;     // 雙人房數
        singleBedroomCount: number;     // 單人房數

        // --- 3. 其他參數 (Other Parameters) ---
        publicAreaRatio: number;        // 公設比 (%) (原 publicRatio)
        parkingSpaceCount: number;      // 車位數量
    };
}

// 總表單狀態介面 (Global Form State)
export interface UserFormState {
    profile: PersonalProfile;
    career: CareerProfile;
    retirement: RetirementPlan;
    portfolio: PortfolioPosition; // 若是多筆投資，建議改為 PortfolioPosition[]
    spouse: SpouseProfile;
    parenting: ParentingPlan;
    mortgage: MortgageAnalysis;
    estateMarketInfo: RealEstateProperty['marketInfo']; // 對應 estatePrice
    estateSpecs: RealEstateProperty['specs'];           // 對應 estateSize
}
