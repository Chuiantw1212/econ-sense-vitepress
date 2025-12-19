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
    // 為了區分價格與坪數，這裡稍微重新命名 Interface
    price: {
        county: string
        town: string
        buildingType: string
        buildingAge: string
        hasParking: string
        count: number
        pr25: number
        pr75: number
        average: number
        unitPrice: number
    }
    size: {
        publicRatio: number
        bathroom: number
        livingRoom: number
        balcony: number // 已修正拼字 balcany -> balcony
        parkingSpace: number
        doubleBedRoom: number
        singleBedRoom: number
        mainBuilding: number
        outBuilding: number
        floorSize: number
        parkingSize: number
        headCount: number
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