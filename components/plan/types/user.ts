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

export interface SecurityData {
    allocationETF: string
    stockPercentage: number
    irr: number
    presentAsset: number
    averaging: number
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
    downpayPercent: number
    loanTerm: number
    totalPriceEstimated: number
    interestRate: number
    loanAmount: number
    totalPrice: number
    downpay: number
    downpayGoal: number
    monthlyRepay: number
    downpayYear: number
    downpayTotalPrice: number
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
    security: SecurityData
    spouse: SpouseData
    parenting: ParentingData
    mortgage: MortgageData
    estatePrice: RealEstateData['price']
    estateSize: RealEstateData['size']
}