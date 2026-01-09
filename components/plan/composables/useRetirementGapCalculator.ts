// src/components/plan/composables/useRetirementGapCalculator.ts

import { useRetirementExpenseCalculator, INFLATION_RATES } from './useRetirementExpenseCalculator';

export interface GapSimulationParams {
    birthYear: number;

    // 勞退參數 (Asset 1: Lump Sum)
    laborPension: {
        retirementAge: number;       // 預計退休/領勞退年齡
        predictedNetLumpSum: number; // 稅後淨額
        roi: number;                 // 5.69
    };

    // 勞保參數 (Asset 2: Annuity)
    laborInsurance: {
        claimAge: number;            // 勞保起領年齡
        predictedMonthlyAnnuity: number;
    };

    // 支出參數
    expenseParams: any;
}

export interface YearSimulationData {
    age: number;
    inflowLumpSum: number;
    inflowAnnuity: number;
    outflowExpense: number;
    netFlow: number;
    assetsBalance: number;
    isDepleted: boolean;
}

export function useRetirementGapCalculator() {
    const { generateExpenseStream } = useRetirementExpenseCalculator();

    function runSimulation(params: GapSimulationParams): YearSimulationData[] {
        const { laborPension, laborInsurance, expenseParams } = params;
        const lifeExpectancy = expenseParams.lifeExpectancy;
        const currentAge = expenseParams.currentAge;

        // --- 關鍵修正 1: 模擬起點取「最晚」時間 ---
        // 避免還在工作(或單邊領取)時就開始扣支出
        const startSimulationAge = Math.max(laborPension.retirementAge, laborInsurance.claimAge);

        // 2. 準備支出資料流
        // 強制支出從 startSimulationAge 開始計算
        const expenseStream = generateExpenseStream({
            ...expenseParams,
            retirementAge: startSimulationAge
        });

        // 3. 準備參數
        const decimalRoi = laborPension.roi / 100; // 5.69 -> 0.0569
        const startMonthlyAnnuity = laborInsurance.predictedMonthlyAnnuity;

        // --- 關鍵修正 2: 初始化資產 (處理遞延滾存) ---
        // 如果勞退(60歲)比模擬起點(65歲)早領，這筆錢會先在帳戶裡滾 5 年複利
        let currentAssets = 0;
        let initialLumpSumInflow = 0; // 用於圖表顯示第一年的流入

        const gapYears = startSimulationAge - laborPension.retirementAge;

        if (gapYears > 0) {
            // 情況 A: 勞退早於起點 (已領取，滾存中)
            // FV = PV * (1+r)^n
            currentAssets = Math.round(
                laborPension.predictedNetLumpSum * Math.pow(1 + decimalRoi, gapYears)
            );
            // 註：因為是「已存在」的本金，這裡不計入 inflowLumpSum (現金流)，而是直接墊高 assetsBalance
        } else {
            // 情況 B: 勞退等於起點 (當年領取)
            // 會在迴圈的第一年作為 inflow 處理
        }

        const simulationResults: YearSimulationData[] = [];

        // 4. 逐年模擬 (從 最晚退休日 ~ 預估餘命)
        for (let age = startSimulationAge; age <= lifeExpectancy; age++) {

            // --- A. 年初資產滾存 ---
            // 去年留下來的(或初始化的)錢，先滾利息
            if (currentAssets > 0) {
                currentAssets = Math.round(currentAssets * (1 + decimalRoi));
            }

            // --- B. 勞退一次金流入 ---
            let inflowLumpSum = 0;
            // 只有當「勞退年齡 == 模擬起點」時，才視為當年度現金流入
            if (age === laborPension.retirementAge && gapYears === 0) {
                inflowLumpSum = laborPension.predictedNetLumpSum;
            }

            // --- C. 勞保年金流入 (抗通膨) ---
            let inflowAnnuity = 0;
            if (age >= laborInsurance.claimAge) {
                // 計算通膨因子：從「現在」累積到「這一歲」
                const yearsFromNow = age - currentAge;
                const inflationFactor = Math.pow(1 + INFLATION_RATES.GENERAL, yearsFromNow);

                const nominalMonthly = startMonthlyAnnuity * inflationFactor;
                inflowAnnuity = Math.round(nominalMonthly * 12);
            }

            // --- D. 支出流出 ---
            let outflowExpense = 0;
            const expData = expenseStream.find(d => d.age === age);
            if (expData) {
                outflowExpense = expData.totalMonthly * 12;
            }

            // --- E. 結算 ---
            const netFlow = inflowLumpSum + inflowAnnuity - outflowExpense;
            currentAssets += netFlow;

            simulationResults.push({
                age,
                inflowLumpSum,
                inflowAnnuity,
                outflowExpense,
                netFlow,
                assetsBalance: Math.round(currentAssets),
                isDepleted: currentAssets < 0
            });
        }

        return simulationResults;
    }

    return {
        runSimulation
    };
}