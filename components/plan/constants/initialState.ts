// src/constants/initialState.ts
import type { UserFormState } from '../types/user' // 假設路徑

export const getInitialUserForm = (): UserFormState => ({
    // 1. 個人基本資料 (Personal Profile)
    profile: {
        id: '',
        birthYear: '', // 尚未輸入時留空
        birthDate: '',
        gender: 'MALE', // 預設男性，可配合 UI 選單
        currentAge: 0,
        lifeExpectancy: 85, // 國人平均壽命參考值 (保守估計)
        marriageYear: '',
        careerInsuranceType: '勞工保險', // 最常見類型
        biography: ''
    },

    // 2. 職業與收入資料 (Career & Income)
    career: {
        baseSalary: 0,
        otherAllowance: 0,
        laborInsurance: 0,
        healthInsurance: 0,
        otherDeduction: 0,

        // 更新：Rate 和 Amount 都存入資料庫
        pensionRate: 0,
        pensionAmount: 0,

        // 員工認股 (保留前一版功能)
        stockDeduction: 0,
        stockCompanyMatch: 0,
    },

    // 3. 退休規劃 (Retirement Planning)
    retirement: {
        retirementAge: 65, // 法定退休年齡參考
        lifeExpectancy: 85,
        yearsUntilRetirement: 0,
        retirementYear: new Date().getFullYear() + 30, // 預設 30 年後
        projectedLumpSum: 0,

        socialSecurity: {
            monthlyAnnuity: 0,
            currentSeniority: 0,
            projectedSeniority: 0
        },

        occupationalPension: {
            employeeContributionTotal: 0,
            employeeContributionReturn: 0,
            employerContributionTotal: 0,
            employerContributionReturn: 0,
            annualizedReturnRate: 3.0, // 勞退基金歷史平均收益參考 (保守)
            projectedLumpSum: 0
        },

        monthlyRetirementLivingExpenses: 0,

        longTermCare: {
            onsetAge: 75, // 需長照平均年齡參考
            monthlyLivingExpenses: 0,
            monthlyCareExpenses: 0,
            housingArrangement: '自宅',
            caregiverType: '外籍看護'
        }
    },

    // 4. 投資組合部位 (Portfolio Position)
    // 註：目前為單一部位結構，若需多筆需改為陣列
    portfolio: {
        targetSymbol: '',
        equityWeight: 0,
        annualizedReturn: 0,
        marketValue: 0
    },

    // 5. 配偶資料 (Spouse Profile)
    spouse: {
        marriageYear: '',
        marriageDuration: 0,
        monthlyHouseholdContribution: 0,
        weddingExpenses: 0,
        birthYear: '',
        monthlyNetIncome: 0,
        personalMonthlyExpenses: 0
    },

    // 6. 子女教養計畫 (Parenting Plan)
    parenting: {
        annualChildExpense: 0,
        spouseMonthlyContribution: 0,
        financialIndependenceAge: 22, // 大學畢業年齡
        firstChildBirthYear: 0,
        secondChildBirthYear: 0,
        insuranceBudget: 0,
        numberOfChildren: 0,
        lifeInsuranceCoverage: 0
    },

    // 7. 房貸試算 (Mortgage Analysis)
    mortgage: {
        downPaymentRatio: 20, // 常見頭期款 20%
        annualInterestRate: 2.15, // 近期房貸利率參考
        loanTenure: 30, // 30年期
        marketEstimatedPrice: 0,
        targetPurchasePrice: 0,
        expectedPurchaseYear: 0,
        futurePropertyValue: 0,
        requiredDownPayment: 0,
        currentAvailableCapital: 0,
        loanPrincipal: 0,
        monthlyMortgagePayment: 0
    },

    // 8. 不動產 - 市場行情 (Estate Market Info)
    estateMarketInfo: {
        county: '',
        district: '',
        propertyType: '電梯大樓', // 預設類型
        propertyAge: '',
        hasParkingSpace: false,
        sampleCount: 0,
        percentile25Price: 0,
        percentile75Price: 0,
        averageTotalPrice: 0,
        averageUnitPrice: 0
    },

    // 9. 不動產 - 物件規格 (Estate Specs)
    estateSpecs: {
        grossFloorArea: 0,
        mainBuildingArea: 0,
        ancillaryBuildingArea: 0,
        commonArea: 0,
        parkingArea: 0,
        occupantCount: 1,
        bathroomCount: 1,
        livingRoomCount: 1,
        balconyCount: 0,
        doubleBedroomCount: 0,
        singleBedroomCount: 0,
        publicAreaRatio: 0,
        parkingSpaceCount: 0
    }
})
