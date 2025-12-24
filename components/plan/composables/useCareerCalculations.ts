// composables/useCareerCalculations.ts
import { computed } from 'vue'

// 常數設定 (依據您的 config.js)
const FOOD_EXPENSE = 3000 // 伙食津貼免稅額
const LABOR_INSURANCE_LEVELS = [27470, 28800, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800] // 範例簡化，建議補全
const HEALTH_INSURANCE_LEVELS = [27470, 28800, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800] // 範例簡化

export function useCareerCalculations() {

    // 1. 查找投保薪資級距
    const findInsuredSalary = (salary: number, levels: number[]) => {
        if (!salary) return 0
        // 若薪資低於最低級距，以最低級距計；高於最高，以最高計
        if (salary < levels[0]) return levels[0]
        const level = levels.find(l => l >= salary)
        return level || levels[levels.length - 1]
    }

    // 2. 計算職工福利金 (0.5%)
    const calcWelfareFund = (monthlyBaseSalary: number, isCompany: boolean) => {
        if (!isCompany || !monthlyBaseSalary) return 0
        return Math.floor((monthlyBaseSalary + FOOD_EXPENSE) * 0.005)
    }

    // 3. 計算勞保自付額 (保留您的原始邏輯)
    const calcLaborPremium = (salary: number, insuredUnit: 'company' | 'union') => {
        const insuredSalary = findInsuredSalary(salary, LABOR_INSURANCE_LEVELS)

        // 費率設定
        const ordinaryAccidentRate = 11
        const employmentRate = 1
        const accidentRate = 0.11

        let insuranceRate = ordinaryAccidentRate
        let shareRate = 20 // 公司投保個人負擔 20%

        if (insuredUnit === 'union') {
            insuranceRate += accidentRate
            shareRate = 60 // 工會投保個人負擔 60%
        } else {
            insuranceRate += employmentRate
        }

        insuranceRate /= 100
        shareRate /= 100

        return {
            insuredSalary,
            expense: Math.ceil(insuredSalary * insuranceRate * shareRate)
        }
    }

    // 4. 計算健保自付額
    const calcHealthPremium = (salary: number, insuredUnit: 'company' | 'union', headCount = 0) => {
        let rawSalary = salary
        if (insuredUnit === 'company') rawSalary += FOOD_EXPENSE

        // TODO: 這裡可加入負責人最低投保級距邏輯 (entrepreneurHealthInsuranceLevel)

        const insuredSalary = findInsuredSalary(rawSalary, HEALTH_INSURANCE_LEVELS)
        const premiumRate = 5.17 // 費率
        const shareRate = insuredUnit === 'union' ? 60 : 30 // 自付比

        return {
            insuredSalary,
            expense: Math.ceil(insuredSalary * (premiumRate / 100) * (shareRate / 100))
        }
    }

    // 5. 計算勞退 (雇主提撥 + 個人自提)
    const calcPension = (salary: number, selfRate: number, insuredUnit: 'company' | 'union') => {
        // 工會投保無雇主提繳
        if (insuredUnit === 'union') return { employer: 0, employee: 0, insuredSalary: 0 }

        const rawSalary = salary + FOOD_EXPENSE
        const insuredSalary = findInsuredSalary(rawSalary, LABOR_INSURANCE_LEVELS)

        return {
            insuredSalary,
            employer: Math.floor(insuredSalary * 0.06), // 雇主 6%
            employee: Math.floor(insuredSalary * (selfRate / 100)) // 自提
        }
    }

    return {
        FOOD_EXPENSE,
        calcWelfareFund,
        calcLaborPremium,
        calcHealthPremium,
        calcPension
    }
}