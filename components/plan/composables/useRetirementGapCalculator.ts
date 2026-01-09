// src/components/plan/composables/useRetirementGapCalculator.ts

import { useFinancialCalculator } from './useFinancialCalculator';
import { useRetirementExpenseCalculator, INFLATION_RATES } from './useRetirementExpenseCalculator';
import { useLaborInsuranceCalculator } from './useLaborInsuranceCalculator';

export interface GapSimulationParams {
    currentAge: number;
    birthYear: number;

    // 勞退參數
    laborPension: {
        totalAccumulated: number;
        roi: number;             // 修正：這裡傳入的是 5.69 (代表 5.69%)
        retirementAge: number;
    };

    // 勞保參數
    laborInsurance: {
        avgSalary: number;
        seniorityMonths: number;
        claimAge: number;
    };

    // 支出參數
    expenseParams: any;
}

export interface YearSimulationData {
    age: number;
    yearIndex: number;
    annualExpense: number;
    annualLaborInsurance: number;
    netFlow: number;
    assetsBalance: number;
    isDepleted: boolean;
}

export function useRetirementGapCalculator() {
    const { calcFV } = useFinancialCalculator();
    const { generateExpenseStream } = useRetirementExpenseCalculator();
    const { getStatutoryAge, calculateAnnuity } = useLaborInsuranceCalculator();

    function runSimulation(params: GapSimulationParams): YearSimulationData[] {
        const { currentAge, birthYear, laborPension, laborInsurance, expenseParams } = params;
        const lifeExpectancy = expenseParams.lifeExpectancy;

        // --- 關鍵修正：將 ROI 轉為小數 ---
        // 資料庫存 5.69 -> 轉為 0.0569 用於運算
        const decimalRoi = laborPension.roi / 100;

        // 1. 取得全期支出預測 (已含通膨)
        const expenseStream = generateExpenseStream(expenseParams);

        // 2. 計算勞保起始年金
        const statutoryAge = getStatutoryAge(birthYear);
        const liResult = calculateAnnuity(
            laborInsurance.avgSalary,
            laborInsurance.seniorityMonths,
            laborInsurance.claimAge,
            statutoryAge
        );
        const startMonthlyAnnuity = liResult.bestAmount;

        // 3. 初始化資產 (勞退現值)
        // 假設：這筆錢在退休前會以 ROI 繼續滾存
        // 計算退休當下這筆錢的 FV (Future Value)
        const yearsToRetire = Math.max(0, laborPension.retirementAge - currentAge);

        // 使用 decimalRoi 計算複利
        let currentAssets = Math.round(
            laborPension.totalAccumulated * Math.pow(1 + decimalRoi, yearsToRetire)
        );

        const simulationResults: YearSimulationData[] = [];

        // 4. 逐年模擬 (從現在 ~ 預估餘命)
        for (let age = currentAge; age <= lifeExpectancy; age++) {
            const yearIndex = age - currentAge;

            // --- A. 資產增值 (年初) ---
            // 只有在進入這一年迴圈時，資產還存在才增值
            // 若還沒退休，前面已經一次滾到退休當下了？
            // 修正邏輯：為了畫圖好看，我們通常是「逐年」滾動。
            // 回退上面的 currentAssets 初始化，改為逐年計算。

            if (age === currentAge) {
                // 第一年，資產 = 目前累積金額
                currentAssets = laborPension.totalAccumulated;
            } else if (currentAssets > 0) {
                // 次年起，前一年的餘額 + 投資收益 (使用 decimalRoi)
                currentAssets = Math.round(currentAssets * (1 + decimalRoi));
            }

            // --- B. 確認當年度支出 (流出) ---
            let annualExpense = 0;
            if (age >= laborPension.retirementAge) {
                const expData = expenseStream.find(d => d.age === age);
                annualExpense = expData ? expData.totalMonthly * 12 : 0;
            }

            // --- C. 確認勞保收入 (流入) ---
            let annualLI = 0;
            if (age >= laborInsurance.claimAge) {
                // 勞保年金隨一般通膨調整 (INFLATION_RATES.GENERAL 仍為小數 0.03)
                const inflationFactor = Math.pow(1 + INFLATION_RATES.GENERAL, yearIndex);
                const adjustedMonthly = startMonthlyAnnuity * inflationFactor;
                annualLI = Math.round(adjustedMonthly * 12);
            }

            // --- D. 淨現金流與結算 ---
            const netFlow = annualLI - annualExpense;

            // 退休後才開始動用本金填補缺口
            if (age >= laborPension.retirementAge) {
                currentAssets += netFlow;
            }

            simulationResults.push({
                age,
                yearIndex,
                annualExpense,
                annualLaborInsurance: annualLI,
                netFlow,
                assetsBalance: currentAssets,
                isDepleted: currentAssets < 0
            });
        }

        return simulationResults;
    }

    return {
        runSimulation
    };
}