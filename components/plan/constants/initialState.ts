// src/constants/initialState.ts
import type { UserFormState } from '../types/user' // 假設路徑

export const getInitialUserForm = (): UserFormState => ({
    // 1. 個人基本資料 (Personal Profile)
    profile: {
        id: '',
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
        id: '',
        baseSalary: 0,
        otherAllowance: 0,
        laborInsurance: 0,
        healthInsurance: 0,
        otherDeduction: 0,

        // --- 勞退相關 ---
        pensionPersonalRate: 0,
        pensionPersonalAmount: 0,
        pensionEmployerAmount: 0,
        pensionTotalAmount: 0,

        // --- 其他 ---
        monthlyNetIncome: 0,
        annualBonus: 0,
        stockDeduction: 0,
        stockCompanyMatch: 0,
        
        // 稅務計算用
        annualTotalIncome: 0,
        dependents: 0
    },

    // 3. 退休規劃 (Retirement Planning)
    retirement: {
        id: '',
        householdType: 'single',
        housingMode: 'rent', // 預設租屋
        healthTierCode: 'standard',
        activeLivingCode: 'basic',
        
        // Timeline
        slowGoStartAge: 75,
        nogoStartAge: 80,
        defenseTierCode: 'basic',
        criticalIllnessCode: 'none',
        criticalIllnessReserve: 0,

        // Expenses
        housingCost: 0,
        healthCost: 0,
        activeLivingCost: 0,
        monthlyMedicalCost: 0,

        // Long Term Care
        ltcCareMode: 'HOME_CARE',
        ltcMonthlyCost: 0,
        ltcMonthlySupplies: 0,
        ltcSubsidy: 0
    },

    // 4. 稅務 (Tax)
    tax: {
        id: '',
        estimatedOtherIncome: 0
    },

    // 5. 勞保 (Labor Insurance)
    laborInsurance: {
        id: '',
        expectedClaimAge: 65,
        averageMonthlySalary: 0,
        insuranceSeniority: 0,
        predictedRemainingLife: 20,
        predictedMonthlyAnnuity: 0
    },

    // 6. 勞退 (Labor Pension)
    laborPension: {
        id: '',
        expectedRetirementAge: 65,
        remainingLifeAtRetirement: 20,
        retirementRoi: 3.0,
        employerContribution: 0,
        employerEarnings: 0,
        personalContribution: 0,
        personalEarnings: 0,
        currentWorkSeniority: 0,
        predictedNetLumpSum: 0,
        predictedLumpSum: 0
    },

    // 7. 資產列表 (Assets Lists)
    portfolios: [],
    realEstates: [],
    creditCards: [],
    businesses: {
        list: [],
        total: 0,
        currentPage: 1,
        pageSize: 100,
        totalPages: 1
    }
})
