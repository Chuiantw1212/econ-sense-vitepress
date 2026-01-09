/**
 * 退休支出與通膨計算機 (Composable)
 * 用途：集中管理「雙軌通膨」運算邏輯，供圖表與缺口分析共用。
 */

// --- 常數定義 (Single Source of Truth) ---
export const INFLATION_RATES = {
    GENERAL: 0.03,  // 一般通膨 3% (生活、圓夢)
    MEDICAL: 0.04   // 醫療通膨 4% (醫療、照護)
};

// --- 型別定義 ---
export interface ExpenseCalcParams {
    currentAge: number;
    retirementAge: number;
    lifeExpectancy: number;

    // 金額 (PV 現值)
    baseMonthlyExpense: number;
    medicalExpense: number;
    disabilityExpense: number;

    // 參數
    dreamCoefficient: number;        // 活躍期係數
    disabilityAge: number;           // 失能啟動年齡
    livingExpenseAdjustment: number; // 機構調整係數
}

export interface ExpenseDataPoint {
    age: number;
    yearIndex: number; // 距離現在第幾年

    // 各細項金額 (Future Value)
    base: number;
    medical: number;
    dream: number;
    care: number;

    // 當年度總月支
    totalMonthly: number;
}

export function useRetirementExpenseCalculator() {

    /**
     * 複利終值計算 Helper
     */
    function calculateFV(pv: number, rate: number, years: number): number {
        if (years <= 0) return pv;
        return pv * Math.pow(1 + rate, years);
    }

    /**
     * 生成全期支出現金流陣列
     * @returns ExpenseDataPoint[] 每一歲的詳細支出資料
     */
    function generateExpenseStream(params: ExpenseCalcParams): ExpenseDataPoint[] {
        const {
            currentAge, retirementAge, lifeExpectancy,
            baseMonthlyExpense, medicalExpense, disabilityExpense,
            dreamCoefficient, disabilityAge, livingExpenseAdjustment
        } = params;

        const stream: ExpenseDataPoint[] = [];

        // 從退休年齡開始，算到預估餘命結束
        for (let age = retirementAge; age <= lifeExpectancy; age++) {
            const yearsFromNow = age - currentAge;

            // 1. 醫療費 (全期, 4% 通膨)
            const medFV = calculateFV(medicalExpense, INFLATION_RATES.MEDICAL, yearsFromNow);

            let baseFV = 0;
            let dreamFV = 0;
            let careFV = 0;

            if (age < disabilityAge) {
                // [階段一：活躍期]
                // 基本生活 (3% 通膨)
                baseFV = calculateFV(baseMonthlyExpense, INFLATION_RATES.GENERAL, yearsFromNow);

                // 圓夢金 (3% 通膨) - 基於基本生活費的加成
                const dreamPV = baseMonthlyExpense * (dreamCoefficient - 1);
                dreamFV = calculateFV(dreamPV, INFLATION_RATES.GENERAL, yearsFromNow);
                // 確保不為負數 (若係數 < 1)
                dreamFV = Math.max(0, dreamFV);
            } else {
                // [階段二：失能期]
                // 基本生活 (打折後, 3% 通膨)
                const baseAdjustedPV = baseMonthlyExpense * livingExpenseAdjustment;
                baseFV = calculateFV(baseAdjustedPV, INFLATION_RATES.GENERAL, yearsFromNow);

                // 照護費 (4% 通膨)
                careFV = calculateFV(disabilityExpense, INFLATION_RATES.MEDICAL, yearsFromNow);
            }

            stream.push({
                age,
                yearIndex: yearsFromNow,
                base: Math.round(baseFV),
                medical: Math.round(medFV),
                dream: Math.round(dreamFV),
                care: Math.round(careFV),
                totalMonthly: Math.round(baseFV + medFV + dreamFV + careFV)
            });
        }

        return stream;
    }

    /**
     * 取得特定時間點的預估總月支 (FV)
     * 用於 UI 顯示「首年預估月支」
     */
    function getSingleYearTotalFV(params: ExpenseCalcParams, targetAge: number): number {
        const yearsFromNow = Math.max(0, targetAge - params.currentAge);

        // 1. 醫療 (4%)
        const medFV = calculateFV(params.medicalExpense, INFLATION_RATES.MEDICAL, yearsFromNow);

        let otherFV = 0;

        if (targetAge < params.disabilityAge) {
            // 活躍期 (基數 * 係數, 3%)
            const totalBasePV = params.baseMonthlyExpense * params.dreamCoefficient;
            otherFV = calculateFV(totalBasePV, INFLATION_RATES.GENERAL, yearsFromNow);
        } else {
            // 失能期
            // 生活費 (基數 * 調整, 3%)
            const basePV = params.baseMonthlyExpense * params.livingExpenseAdjustment;
            const baseFV = calculateFV(basePV, INFLATION_RATES.GENERAL, yearsFromNow);

            // 照護費 (4%)
            const careFV = calculateFV(params.disabilityExpense, INFLATION_RATES.MEDICAL, yearsFromNow);

            otherFV = baseFV + careFV;
        }

        return Math.round(medFV + otherFV);
    }

    return {
        generateExpenseStream,
        getSingleYearTotalFV,
        INFLATION_RATES
    };
}