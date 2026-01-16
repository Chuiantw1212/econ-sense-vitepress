import type { UserFormState } from '../types/user';

// --- 內建通膨設定 (Hardcoded Inflation Rates) ---
const INF_NORMAL = 0.03;  // 一般通膨 (Go-Go, Slow-Go, Inflow)
const INF_MEDICAL = 0.03; // 醫療/長照通膨 (No-Go)

/**
 * 計算基礎參數 (Timeline Context)
 * [Update] 移除了 inflationRate，改用內建分段費率
 */
export interface TimelineContext {
    currentAge: number;
    startSimulationAge: number;
    endSimulationAge: number;
}

export interface CashFlowPoint {
    age: number;
    amount: number;
}

export interface AssetStockPoint {
    age: number;
    startBalance: number;
    endBalance: number;
    totalInflow: number;
    totalExpense: number;
    netFlow: number;
    isDepleted: boolean;
}

export function useRetirementCalculator() {

    // =================================================================
    // Part 0: 存量提取 (Stock Extractors)
    // =================================================================
    function getLaborPensionLumpSum(form: UserFormState): number {
        return form.laborPension?.predictedNetLumpSum ??
            form.laborPension?.predictedLumpSum ??
            0;
    }

    // =================================================================
    // Part 1: 獨立金流計算 (Stream Generators)
    // =================================================================

    /**
     * 1. 勞保年金 (Inflow)
     * 使用一般通膨 (3%)
     */
    function calcLaborInsuranceStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const labor = form.laborInsurance;
        const annualAnnuityPV = (labor?.predictedMonthlyAnnuity ?? 0) * 12;
        const claimAge = labor?.expectedClaimAge ?? 65;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            const yearIndex = age - ctx.currentAge;
            const inflator = Math.pow(1 + INF_NORMAL, yearIndex); // 3%

            let amount = 0;
            if (age >= claimAge) {
                amount = annualAnnuityPV * inflator;
            }
            stream.push({ age, amount: Math.round(amount) });
        }
        return stream;
    }

    /**
     * 2. Go-Go 活躍期 (Outflow)
     * 使用一般通膨 (3%)
     */
    function calcGoGoExpenseStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const labor = form.laborInsurance;
        const r = form.retirement || {};
        const slowGoStart = r.slowGoStartAge ?? 75;
        const realRetireAge = labor?.expectedClaimAge ?? 65;

        const baseMonthly = (r.housingCost ?? 0) + (r.healthCost ?? 0) + (r.activeLivingCost ?? 0);
        const baseAnnual = baseMonthly * 12;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            const yearIndex = age - ctx.currentAge;
            const inflator = Math.pow(1 + INF_NORMAL, yearIndex); // 3%

            let amount = 0;
            if (age < slowGoStart && age >= realRetireAge) {
                amount = baseAnnual * inflator;
            }
            stream.push({ age, amount: Math.round(amount) });
        }
        return stream;
    }

    /**
     * 3. Slow-Go 慢活期 (Outflow)
     * 使用一般通膨 (3%)
     */
    function calcSlowGoExpenseStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const r = form.retirement || {};
        const slowGoStart = r.slowGoStartAge ?? 75;
        const noGoStart = r.nogoStartAge ?? 80;

        const baseMonthly = (r.housingCost ?? 0) + (r.monthlyMedicalCost ?? 0);
        const baseAnnual = baseMonthly * 12;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            const yearIndex = age - ctx.currentAge;
            const inflator = Math.pow(1 + INF_NORMAL, yearIndex); // 3%

            let amount = 0;
            if (age >= slowGoStart && age < noGoStart) {
                amount = baseAnnual * inflator;
            }
            stream.push({ age, amount: Math.round(amount) });
        }
        return stream;
    }

    /**
     * 4. No-Go 長照期 (Outflow)
     * [Critical Update] 使用醫療通膨 (5%)
     */
    function calcNoGoExpenseStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const r = form.retirement || {};
        const noGoStart = r.nogoStartAge ?? 80;
        const isInstitution = (r.ltcCareMode || '').includes('INSTITUTION');

        const housingCost = isInstitution ? 0 : (r.housingCost ?? 0);
        const ltcRaw = (r.ltcMonthlyCost ?? 0) + (r.ltcMonthlySupplies ?? 0) - (r.ltcSubsidy ?? 0);
        const ltcNet = Math.max(0, ltcRaw);

        const baseMonthly = housingCost + ltcNet;
        const baseAnnual = baseMonthly * 12;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            const yearIndex = age - ctx.currentAge;
            // [Update] 使用 5% 通膨
            const inflator = Math.pow(1 + INF_MEDICAL, yearIndex);

            let amount = 0;
            if (age >= noGoStart) {
                amount = baseAnnual * inflator;
            }
            stream.push({ age, amount: Math.round(amount) });
        }
        return stream;
    }

    // =================================================================
    // Part 2: 彙總計算 (Aggregator)
    // =================================================================
    function calculateAssetStockSeries(
        initialAssets: number,
        roi: number,
        inflowStreams: CashFlowPoint[][],
        outflowStreams: CashFlowPoint[][]
    ): AssetStockPoint[] {
        if (inflowStreams.length === 0 && outflowStreams.length === 0) return [];
        const length = (inflowStreams[0] || outflowStreams[0])?.length || 0;

        const result: AssetStockPoint[] = [];
        let currentPool = initialAssets;

        for (let i = 0; i < length; i++) {
            const age = (inflowStreams[0] || outflowStreams[0])[i].age;

            let yearIn = 0;
            inflowStreams.forEach(stream => { yearIn += stream[i]?.amount || 0; });

            let yearOut = 0;
            outflowStreams.forEach(stream => { yearOut += stream[i]?.amount || 0; });

            // ROI 計算：僅針對正資產
            const interest = currentPool > 0 ? currentPool * roi : 0;
            const netFlow = yearIn - yearOut;
            const endBalance = currentPool + interest + netFlow;

            result.push({
                age,
                startBalance: Math.round(currentPool),
                endBalance: Math.round(endBalance),
                totalInflow: yearIn,
                totalExpense: yearOut,
                netFlow,
                isDepleted: endBalance < 0
            });

            currentPool = endBalance;
        }
        return result;
    }

    return {
        getLaborPensionLumpSum,
        calcLaborInsuranceStream,
        calcGoGoExpenseStream,
        calcSlowGoExpenseStream,
        calcNoGoExpenseStream,
        calculateAssetStockSeries
    };
}