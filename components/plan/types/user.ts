// 模擬 Firebase User 的核心欄位
export interface FirebaseUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    isAnonymous?: boolean;
}

/* =================================================================
   定義資料介面 (Interfaces)
   將各個區塊定義清楚，方便組件引用與自動補全
================================================================= */

export interface ProfileData {
    id: string
    yearOfBirth: string | number // 兼容輸入框字串或計算用數字
    dateOfBirth: string
    gender: string
    age: number
    lifeExpectancy: number
    yearOfMarriage: string
    careerInsuranceType: string
    story: string
}

export interface CareerData {
    headCount: number
    monthlyBasicSalary: number
    employeeWelfareFund: number
    insuredUnit: 'company' | 'union' | string // 預留工會選項
    regionalAllowance: number
    insurance: {
        salary: number
        presentSeniority: number
        futureSeniority: number
        expense: number
    }
    pension: {
        salary: number
        rate: number
        monthlyContribution: number
        monthlyContributionEmployee: number
    }
    healthInsurancePremium: number // 已修正拼字 Insutance -> Insurance
    monthlyNetPayEstimated: number
    monthlyNetPay: number
    monthlyExpense: number
    monthlySaving: number
}

export interface RetirementData {
    age: number
    lifeExpectancy: number
    yearsToRetirement: number
    yearOfRetire: number
    annuitySum: number
    insurance: {
        monthlyAnnuity: number
        presentSeniority: number
        futureSeniority: number
    }
    pension: {
        employeeContribution: number // 已修正拼字 Contrubution -> Contribution
        employeeContributionIncome: number
        employerContribution: number
        employerContributionIncome: number
        irrOverDecade: number
        lumpSum: number
    }
    monthlyLivingExpense: number
    disability: {
        age: number
        monthlyLivingExpense: number
        monthlyCaringExpense: number
        housing: string
        carer: string
    }
}

export interface PortfolioPosition {
    /**
     * 標的代碼 (Target Symbol)
     * 例如: 'AOA', 'AOK', 'VT'
     * 原名: allocationETF
     */
    targetSymbol: string;

    /**
     * 股票權重/股債比 (Equity Ratio / Equity Weight)
     * 說明: 股票在投資組合中的比例 (0~1 或 0~100)。
     * 用途: 用於風險評估或推算預期報酬的係數。
     * 原名: stockPercentage
     */
    equityWeight: number;

    /**
     * 預期年化報酬率 (Expected Annualized Return / CAGR)
     * 說明: 來自爬蟲抓取的長期歷史年化報酬率。
     * 備註: 除非是計算現金流折現，否則單一標的通常用 "Return" 而非 "IRR"。
     * 原名: irr
     */
    annualizedReturn: number;

    /**
     * 市場現值 (Market Value / Present Value)
     * 說明: 該部位目前的總資產價值。
     * 原名: presentAsset
     */
    marketValue: number;
}

export interface SpouseData {
    yearOfMarriage: string
    marriageLength: number
    monthlyContribution: number
    weddingExpense: number
    yearOfBirth: string
    monthlyNetPay: number
    monthlyExpense: number
}

export interface ParentingData {
    childAnnualExpense: number
    spouseMonthlyContribution: number
    independentAge: number // 已修正拼字 independant -> independent
    firstBornYear: number
    secondBornYear: number
    insurance: number
    headCount: number
    lifeInsurance: number
}

export interface MortgageData {
    // --- A. 貸款參數 (基本設定) ---
    downpayPercent: number      // 頭期款比例 (例如 20)
    interestRate: number        // 房貸利率 (例如 2.15)
    loanTerm: number            // 貸款年限 (例如 30)

    // --- B. 價格定錨 (雙向比較) ---
    estimatedPrice: number      // [優化命名] 系統根據需求(RealEstateData)回推的市場行情
    targetPrice: number         // [優化命名] 使用者實際鎖定的目標總價 (原 totalPrice)

    // --- C. 時間價值 (未來規劃) ---
    purchaseYear: number        // [優化命名] 預計購屋年度 (原 downpayYear，例如 5 年後)
    futurePrice: number         // [優化命名] 考慮通膨後的未來房價 (原 downpayTotalPrice?)
    // *解析: 如果是5年後買，現在2000萬的房子可能會變成 2200萬

    // --- D. 資金試算 (缺口分析) ---
    requiredDownPayment: number // [優化命名] 應備頭期款目標 (TargetPrice * Percent)
    availableDownPayment: number// [優化命名] 現有/實際頭期款 (原 downpay)

    // --- E. 還款壓力 ---
    loanAmount: number          // 貸款金額 (TargetPrice - AvailableDownPayment)
    monthlyPayment: number      // [優化命名] 月付金 (原 monthlyRepay，Payment 是金融標準用語)
}

export interface RealEstateData {
    // 價格與市場行情資訊
    price: {
        county: string          // 縣市
        town: string            // 鄉鎮市區
        buildingType: string    // 物件型態 (電梯大樓/公寓/透天)
        buildingAge: string     // 屋齡
        hasParking: string      // 是否含車位

        // 市場行情數據
        count: number           // 樣本數
        pr25: number            // 低標價
        pr75: number            // 高標價
        average: number         // 平均總價
        unitPrice: number       // 單價 (萬/坪)
    }

    // 物件規格 (權狀面積結構) - 改名為 spec 或 propertySpec 較貼切，原名 size 亦可
    size: {
        // --- 1. 權狀核心面積 (坪數) ---
        grossArea: number       // 總坪數 (權狀面積) -> 原 floorSize
        mainArea: number        // 主建物面積 (室內) -> 原 mainBuilding
        ancillaryArea: number   // 附屬建物面積 (陽台/雨遮) -> 原 outBuilding
        commonArea: number      // 公設面積 -> 原 publicRatio (若是存面積用這個)
        parkingArea: number     // 車位面積 -> 原 parkingSize

        // --- 2. 格局配置 (數量) ---
        headCount: number       // 居住人數
        bathroom: number        // 衛
        livingRoom: number      // 廳
        balconyCount: number    // 陽台數量 -> 原 balcany (拼字修正 + 加上 Count 區分面積)

        // 房間配置
        doubleBedRoom: number   // 雙人房數
        singleBedRoom: number   // 單人房數

        // --- 3. 其他參數 ---
        publicRatio: number     // 公設比 (%) -> 建議新增此欄位單獨存百分比
        parkingSpaceCount: number // 車位數量 -> 原 parkingSpace
    }
}

// 總表單介面
export interface UserFormState {
    profile: ProfileData
    career: CareerData
    retirement: RetirementData
    portfolio: PortfolioPosition
    spouse: SpouseData
    parenting: ParentingData
    mortgage: MortgageData
    estatePrice: RealEstateData['price']
    estateSize: RealEstateData['size']
}