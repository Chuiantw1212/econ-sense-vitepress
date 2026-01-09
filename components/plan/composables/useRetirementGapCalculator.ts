// src/components/plan/composables/useRetirementGapCalculator.ts

import { useRetirementExpenseCalculator, INFLATION_RATES } from './useRetirementExpenseCalculator';
import { useLaborInsuranceCalculator } from './useLaborInsuranceCalculator';

export interface GapSimulationParams {
    birthYear: number;

    // 勞退參數 (Asset 1: Lump Sum)
    laborPension: {
        retirementAge: number;   // 勞退請領年齡 (資金注入點)
        predictedNetLumpSum: number; // 稅後實領淨額 (來自上一張卡片)
        roi: number;             // 退休後資金運用的年化報酬率 (ex: 5.69)
    };

    // 勞保參數 (Asset 2: Annuity)
    laborInsurance: {
        avgSalary: number;
        seniorityMonths: number;
        claimAge: number;        // 勞保請領年齡 (年金啟動點)
    };

    // 支出參數
    expenseParams: any;
}

export interface YearSimulationData {
    age: number;

    // 現金流細項
    inflowLumpSum: number;       // 當年領到的勞退 (通常只有一年有值)
    inflowAnnuity: number;       // 當年領到的勞保
    outflowExpense: number;      // 當年支出
    netFlow: number;             // 淨現金流

    // 資產存量
    assetsBalance: number;       // 年底資產餘額
    isDepleted: boolean;         // 是否已耗盡
}

export function useRetirementGapCalculator() {
    const { generateExpenseStream } = useRetirementExpenseCalculator();
    const { getStatutoryAge, calculateAnnuity } = useLaborInsuranceCalculator();

    function runSimulation(params: GapSimulationParams): YearSimulationData[] {
        const { birthYear, laborPension, laborInsurance, expenseParams } = params;
        const lifeExpectancy = expenseParams.lifeExpectancy;

        // 1. 決定模擬起點 (退休生效日)
        // 定義：勞退領取日 或 勞保領取日，兩者最早的那一天
        const startSimulationAge = Math.min(laborPension.retirementAge, laborInsurance.claimAge);

        // 2. 準備支出資料流 (全期)
        // generateExpenseStream 預設會算出 retirementAge ~ lifeExpectancy
        // 我們需要確保它能覆蓋 startSimulationAge
        const expenseStream = generateExpenseStream({
            ...expenseParams,
            retirementAge: startSimulationAge // 強制讓支出從最早退休日開始算
        });

        // 3. 計算勞保起始年金 (PV)
        const statutoryAge = getStatutoryAge(birthYear);
        const liResult = calculateAnnuity(
            laborInsurance.avgSalary,
            laborInsurance.seniorityMonths,
            laborInsurance.claimAge,
            statutoryAge
        );
        const startMonthlyAnnuity = liResult.bestAmount;

        // 4. 準備參數
        const decimalRoi = laborPension.roi / 100; // 5.69 -> 0.0569
        let currentAssets = 0; // 初始資產設為 0 (因為我們專注於退休金的流動，或者可視為大筆資金尚未入帳)

        const simulationResults: YearSimulationData[] = [];

        // 5. 逐年模擬 (從 最早退休日 ~ 預估餘命)
        for (let age = startSimulationAge; age <= lifeExpectancy; age++) {
            const yearIndexFromStart = age - startSimulationAge;

            // --- A. 年初資產滾存 ---
            // 去年留下來的錢，先滾利息
            // (保守起見，當年新進來的錢不計入當年完整複利，或視為年底結算)
            if (currentAssets > 0) {
                currentAssets = Math.round(currentAssets * (1 + decimalRoi));
            }

            // --- B. 勞退一次金流入 (Lump Sum) ---
            let inflowLumpSum = 0;
            if (age === laborPension.retirementAge) {
                // 就在這一年，大筆退休金入帳
                inflowLumpSum = laborPension.predictedNetLumpSum;
            }

            // --- C. 勞保年金流入 (Annuity) ---
            let inflowAnnuity = 0;
            if (age >= laborInsurance.claimAge) {
                // 勞保隨一般通膨調整 (假設)
                // 從「開始領」的那一年起算通膨，或是從「現在」起算？
                // 為了保持購買力恆定假設，我們讓它隨通膨成長
                // 這裡的 yearIndex 是從 startSimulationAge 開始
                // 但通膨應該是從「現在(currentAge)」累積過來的。
                // 由於 expenseStream 已經處理好通膨後的金額，我們這裡也做對應處理
                // 簡單作法：假設 startMonthlyAnnuity 是「現在幣值」，則乘上 (age - currentAge) 的通膨

                const yearsFromNow = age - expenseParams.currentAge;
                const inflationFactor = Math.pow(1 + INFLATION_RATES.GENERAL, yearsFromNow);

                const adjustedMonthly = startMonthlyAnnuity * inflationFactor;
                inflowAnnuity = Math.round(adjustedMonthly * 12);
            }

            // --- D. 支出流出 (Expense) ---
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