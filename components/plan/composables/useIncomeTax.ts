import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { UserCareer, UserTax } from '../types/user';

// =================================================================
// 1. 稅務常數設定 (2025/2026 基準)
// 參考財政部公告之 114 年度綜合所得稅免稅額及扣除額
// =================================================================

const TAX_CONSTANTS = {
    EXEMPTION: 97000,           // 免稅額 (每人)
    STANDARD_DEDUCTION: 131000, // 標準扣除額 (單身者)
    SALARY_DEDUCTION: 218000,   // 薪資所得特別扣除額 (上限)
};

// 累進稅率級距表 (Net Taxable Income)
// 依據 114 年度級距調整 (0-61萬: 5%, 61-138萬: 12%...)
// progressiveDiff (累進差額) = (級距下限 * (本級稅率 - 上級稅率)) + 上級累進差額
export const TAX_BRACKETS = [
    {
        rate: 5,
        threshold: 610000,
        progressiveDiff: 0,
        label: '低稅率',
        title: '資產累積黃金期',
        advice: '您的稅率極低，稅務規劃並非首要任務。應專注於「開源」與「資產累積」。建議將資金投入高成長型標的（如股票型ETF），無需過度擔心股利稅負問題。'
    },
    {
        rate: 12,
        threshold: 1380000,
        progressiveDiff: 42700,   // 610000 * 0.07
        label: '中稅率',
        title: '善用扣除額與自提',
        advice: '您處於中產階級稅率。建議檢視「勞退自提」是否提滿 6%，這是最無風險的節稅投資（立即回報 12%）。同時可檢視保險費、捐贈等列舉扣除額是否高於標準扣除額。'
    },
    {
        rate: 20,
        threshold: 2770000,
        progressiveDiff: 153100,  // 1380000 * 0.08 + 42700
        label: '中高稅率',
        title: '積極稅務管理',
        advice: '稅負感開始明顯。建議積極使用「勞退自提 6%」。投資方面，若股利所得較高，可試算「28% 分離課稅」是否較划算。可開始關注海外所得（基本稅額）的免稅額度配置。'
    },
    {
        rate: 30,
        threshold: 5190000,
        progressiveDiff: 430100,  // 2770000 * 0.10 + 153100
        label: '高稅率',
        title: '分離課稅與避險',
        advice: '您是國家稅收主力。建議將部分資產配置於「海外所得」（如美股、海外債），利用每年 750 萬的最低稅負制免稅額度。國內投資應優先考慮分離課稅商品或不配息的資本利得型商品。'
    },
    {
        rate: 40,
        threshold: Infinity,
        progressiveDiff: 949100,  // 5190000 * 0.10 + 430100
        label: '頂層稅率',
        title: '傳承與資產保全',
        advice: '稅務成本極高。應從「個人稅務」轉向「家族稅務」或「法人架構」思考。重點在於資產保全與傳承規劃，建議諮詢專業會計師進行信託或遺贈稅規劃。'
    }
];

// =================================================================
// 2. Composable 核心邏輯
// =================================================================

export function useIncomeTax(
    careerSource: MaybeRefOrGetter<UserCareer>,
    taxSource: MaybeRefOrGetter<UserTax>
) {

    // --- A. 收入面 (Income) ---

    // 1. 薪資所得 (Annual Salary)
    const annualSalaryIncome = computed(() => Number(toValue(careerSource)?.annualTotalIncome) || 0);

    // 2. 其他所得 (Other Income: Dividend, Rent, etc.)
    const otherIncome = computed(() => Number(toValue(taxSource)?.estimatedOtherIncome) || 0);

    // 3. 綜合所得總額 (Total Gross Income)
    const totalGrossIncome = computed(() => annualSalaryIncome.value + otherIncome.value);


    // --- B. 減除面 (Deductions) ---

    const deductions = computed(() => {
        const career = toValue(careerSource);
        if (!career) return { exemption: 0, standard: 0, salary: 0, pension: 0 };

        // (1) 免稅額: 本人 + 扶養親屬
        // 若 dependents = 0，代表僅本人 (1人)
        const dependentsCount = (career.dependents || 0);
        const exemptionTotal = TAX_CONSTANTS.EXEMPTION * (1 + dependentsCount);

        // (2) 標準扣除額
        // *目前簡化假設為單身，若需支援夫妻合併申報需擴充邏輯
        const standardDed = TAX_CONSTANTS.STANDARD_DEDUCTION;

        // (3) 薪資所得特別扣除額
        // 邏輯：取 min(薪資收入, 上限21.8萬)。注意：不可扣抵「其他所得」。
        const salaryDed = Math.min(annualSalaryIncome.value, TAX_CONSTANTS.SALARY_DEDUCTION);

        // (4) 勞退自提 (全額免稅)
        // 邏輯：月提撥 * 12。這是「所得總額」階段就排除的，這裡視為減項處理方便計算。
        const pensionDed = (career.pensionPersonalAmount || 0) * 12;

        return {
            exemption: exemptionTotal,
            standard: standardDed,
            salary: salaryDed,
            pension: pensionDed
        };
    });


    // --- C. 計算結果 (Result) ---

    // 綜合所得淨額 (Net Taxable Income)
    const estimatedNetIncome = computed(() => {
        const d = deductions.value;
        // 公式：總所得 - 免稅額 - 標扣 - 薪扣 - 勞退
        const net = totalGrossIncome.value - d.exemption - d.standard - d.salary - d.pension;
        return Math.max(0, net); // 不得小於 0
    });

    // 稅率級距判斷 (Current Bracket)
    const currentBracket = computed(() => {
        const net = estimatedNetIncome.value;

        for (const bracket of TAX_BRACKETS) {
            if (net <= bracket.threshold) {
                return bracket;
            }
        }
        // Fallback: 超過最後一個門檻，即為最高級距
        return TAX_BRACKETS[TAX_BRACKETS.length - 1];
    });

    // 預估應納稅額 (Estimated Tax)
    // 公式：(淨額 * 稅率) - 累進差額
    const estimatedTaxAmount = computed(() => {
        const net = estimatedNetIncome.value;
        const { rate, progressiveDiff } = currentBracket.value;
        return Math.round((net * (rate / 100)) - progressiveDiff);
    });

    // 有效稅率 (Effective Tax Rate)
    // 公式：應納稅額 / 總收入 (Gross)
    const effectiveTaxRate = computed(() => {
        if (totalGrossIncome.value <= 0) return '0.0';
        return ((estimatedTaxAmount.value / totalGrossIncome.value) * 100).toFixed(1);
    });

    // 勞退節稅效益試算 (Pension Tax Savings)
    // 公式：勞退自提總額 * 邊際稅率
    const pensionTaxSave = computed(() => {
        return Math.round(deductions.value.pension * (currentBracket.value.rate / 100));
    });

    return {
        // Inputs & Intermediates
        annualSalaryIncome,
        otherIncome,
        totalGrossIncome,
        deductions,

        // Outputs
        estimatedNetIncome,
        currentBracket,
        estimatedTaxAmount,
        effectiveTaxRate,
        pensionTaxSave
    };
}