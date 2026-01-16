// composables/useRetirementCalculator.ts
import type { UserFormState } from '../types/user'; // 請確認此路徑正確

/**
 * 計算基礎參數 (Timeline Context)
 * 所有的 Stream 計算都需要這些時間軸資訊，以確保陣列長度對齊
 */
export interface TimelineContext {
    currentAge: number;
    startSimulationAge: number; // 通常是退休年齡 (勞退請領點)
    endSimulationAge: number;   // 生命終點 (勞保預測)
    inflationRate: number;      // e.g. 0.02
}

/**
 * 單一年度的金流資料點
 */
export interface CashFlowPoint {
    age: number;
    amount: number; // 金額 (Nominal Value, 含通膨)
}

/**
 * 資產存量計算結果介面
 */
export interface AssetStockPoint {
    age: number;
    startBalance: number; // 年初餘額
    endBalance: number;   // 年底餘額 (含損益與收支)
    totalInflow: number;  // 當年總收入 (不含本金生息)
    totalExpense: number; // 當年總支出
    netFlow: number;      // 淨現金流
    isDepleted: boolean;  // 是否已耗盡 (負債)
}

export function useRetirementCalculator() {

    // =================================================================
    // Part 0: 存量提取 (Stock Extractors)
    // =================================================================

    /**
     * 取得 [勞退新制] 預估一次領總額 (最重要的起始存量)
     * 對應 UserLaborPension.predictedNetLumpSum
     */
    function getLaborPensionLumpSum(form: UserFormState): number {
        // 優先使用「稅後實領淨額」，若無則用「稅前累積總額」
        return form.laborPension?.predictedNetLumpSum ??
            form.laborPension?.predictedLumpSum ??
            0;
    }

    // =================================================================
    // Part 1: 獨立金流計算函式 (Stream Generators)
    // =================================================================

    /**
     * 1. 計算 [勞保年金] 金流陣列 (Inflow)
     * [修正] 加入通膨成長因子，假設年金能跟上 CPI (如 3%)
     */
    function calcLaborInsuranceStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const labor = form.laborInsurance;
        // 這是「現值 (PV)」的月領金額
        const annualAnnuityPV = (labor?.predictedMonthlyAnnuity ?? 0) * 12;
        const claimAge = labor?.expectedClaimAge ?? 65;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            // 計算通膨係數 (從現在 Current Age 到 該歲數 Age)
            const yearIndex = age - ctx.currentAge;
            const inflator = Math.pow(1 + ctx.inflationRate, yearIndex);

            // 邏輯：只有達到請領年齡後才有收入
            // 金額 = 現值 * 通膨係數
            let amount = 0;
            if (age >= claimAge) {
                amount = annualAnnuityPV * inflator;
            }

            stream.push({ age, amount: Math.round(amount) });
        }
        return stream;
    }

    /**
      * 2. 計算 [Go-Go 活躍期] 支出陣列 (Outflow)
      * [修正] 支出應從「勞保年金請領年齡 (完全退休)」才開始計算
      * 在此之前視為「半退休/還在工作」，由薪水覆蓋生活費，不消耗退休金
      */
    function calcGoGoExpenseStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const labor = form.laborInsurance;
        const r = form.retirement || {};

        const slowGoStart = r.slowGoStartAge ?? 75;
        // [新增] 真實退休點 = 勞保請領年齡
        const realRetireAge = labor?.expectedClaimAge ?? 65;

        // 基礎月費
        const baseMonthly = (r.housingCost ?? 0) +
            (r.healthCost ?? 0) +
            (r.activeLivingCost ?? 0);
        const baseAnnual = baseMonthly * 12;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            const yearIndex = age - ctx.currentAge;
            const inflator = Math.pow(1 + ctx.inflationRate, yearIndex);

            let amount = 0;

            // 邏輯：
            // 1. 年齡 < SlowGo (還在 GoGo 期)
            // 2. 年齡 >= RealRetireAge (已經真正退休，開始吃老本)
            if (age < slowGoStart && age >= realRetireAge) {
                amount = baseAnnual * inflator;
            }

            stream.push({ age, amount: Math.round(amount) });
        }
        return stream;
    }

    /**
     * 3. 計算 [Slow-Go 慢活期] 支出陣列 (Outflow)
     * 包含：housingCost + monthlyMedicalCost
     */
    function calcSlowGoExpenseStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const r = form.retirement || {};
        const slowGoStart = r.slowGoStartAge ?? 75;
        const noGoStart = r.nogoStartAge ?? 80; // [Check] 使用 nogoStartAge

        // 基礎月費
        const baseMonthly = (r.housingCost ?? 0) +
            (r.monthlyMedicalCost ?? 0);
        const baseAnnual = baseMonthly * 12;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            const yearIndex = age - ctx.currentAge;
            const inflator = Math.pow(1 + ctx.inflationRate, yearIndex);

            // 邏輯：介於 [SlowGo, NoGo) 之間
            let amount = 0;
            if (age >= slowGoStart && age < noGoStart) {
                amount = baseAnnual * inflator;
            }

            stream.push({ age, amount: Math.round(amount) });
        }
        return stream;
    }

    /**
     * 4. 計算 [No-Go 長照期] 支出陣列 (Outflow)
     * 包含：(housingCost*) + ltcMonthlyCost + ltcMonthlySupplies - ltcSubsidy
     */
    function calcNoGoExpenseStream(
        form: UserFormState,
        ctx: TimelineContext
    ): CashFlowPoint[] {
        const r = form.retirement || {};
        const noGoStart = r.nogoStartAge ?? 80; // [Check] 使用 nogoStartAge
        const isInstitution = (r.ltcCareMode || '').includes('INSTITUTION');

        // 居住費：若住機構則移除 UserRetirement.housingCost
        const housingCost = isInstitution ? 0 : (r.housingCost ?? 0);

        // 長照淨支出：費用 + 雜支 - 補助
        const ltcRaw = (r.ltcMonthlyCost ?? 0) +
            (r.ltcMonthlySupplies ?? 0) -
            (r.ltcSubsidy ?? 0);

        const ltcNet = Math.max(0, ltcRaw); // 避免負值

        const baseMonthly = housingCost + ltcNet;
        const baseAnnual = baseMonthly * 12;

        const stream: CashFlowPoint[] = [];

        for (let age = ctx.startSimulationAge; age <= ctx.endSimulationAge; age++) {
            const yearIndex = age - ctx.currentAge;
            const inflator = Math.pow(1 + ctx.inflationRate, yearIndex);

            // 邏輯：>= NoGo Start
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

    /**
     * 計算退休金存量變化 (Bar Chart Data Source)
     * @param initialAssets 起始資產總額 (包含：勞退一次領 + 個人累積儲蓄)
     * @param roi 年化報酬率 (e.g. 0.03)
     * @param inflowStreams 所有收入陣列 (需長度一致)
     * @param outflowStreams 所有支出陣列 (需長度一致)
     */
    function calculateAssetStockSeries(
        initialAssets: number,
        roi: number,
        inflowStreams: CashFlowPoint[][],
        outflowStreams: CashFlowPoint[][]
    ): AssetStockPoint[] {

        // 驗證陣列長度
        if (inflowStreams.length === 0 && outflowStreams.length === 0) return [];
        const length = (inflowStreams[0] || outflowStreams[0])?.length || 0;

        const result: AssetStockPoint[] = [];
        let currentPool = initialAssets; // 資產水庫

        for (let i = 0; i < length; i++) {
            // 取得當下年齡 (假設所有 stream 的 age 都對齊)
            const age = (inflowStreams[0] || outflowStreams[0])[i].age;

            // A. 彙總當年度所有收入
            let yearIn = 0;
            inflowStreams.forEach(stream => {
                yearIn += stream[i]?.amount || 0;
            });

            // B. 彙總當年度所有支出
            let yearOut = 0;
            outflowStreams.forEach(stream => {
                yearOut += stream[i]?.amount || 0;
            });

            // C. 計算資產變化
            // 公式：End = (Start * (1 + ROI)) + (In - Out)

            // 只有當資產 > 0 時才計算投資獲利 (避免負債還生利息)
            const interest = currentPool > 0 ? currentPool * roi : 0;

            const netFlow = yearIn - yearOut;
            const endBalance = currentPool + interest + netFlow;

            result.push({
                age,
                startBalance: Math.round(currentPool),
                endBalance: Math.round(endBalance),
                totalInflow: yearIn,
                totalExpense: yearOut,
                netFlow: netFlow,
                isDepleted: endBalance < 0
            });

            // 更新下一年的起始
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