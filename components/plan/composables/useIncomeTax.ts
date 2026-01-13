// src/components/plan/composables/useIncomeTax.ts
import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { UserCareer } from '../types/user';

// --- 基礎參數設定 (2024/2025 台灣稅制參數) ---
const TAX_CONSTANTS = {
    EXEMPTION: 97000,           // 免稅額 (每人)
    STANDARD_DEDUCTION: 131000, // 標準扣除額 (單身)
    SALARY_DEDUCTION: 218000,   // 薪資特別扣除額 (上限)
};

// 稅率級距表 (Net Income)
export const TAX_BRACKETS = [
    { rate: 5, threshold: 590000, progressiveDiff: 0, label: '低稅率', title: '資產累積黃金期', advice: '您的稅率極低，稅務規劃並非首要任務。應專注於「開源」與「資產累積」。建議將資金投入高成長型標的（如股票型ETF），無需過度擔心股利稅負問題。' },
    { rate: 12, threshold: 1330000, progressiveDiff: 41300, label: '中稅率', title: '善用扣除額與自提', advice: '您處於中產階級稅率。建議檢視「勞退自提」是否提滿 6%，這是最無風險的節稅投資（立即回報 12%）。同時可檢視保險費、捐贈等列舉扣除額是否高於標準扣除額。' },
    { rate: 20, threshold: 2660000, progressiveDiff: 147700, label: '中高稅率', title: '積極稅務管理', advice: '稅負感開始明顯。建議積極使用「勞退自提 6%」。投資方面，若股利所得較高，可試算「28% 分離課稅」是否較划算。可開始關注海外所得（基本稅額）的免稅額度配置。' },
    { rate: 30, threshold: 4980000, progressiveDiff: 413700, label: '高稅率', title: '分離課稅與避險', advice: '您是國家稅收主力。建議將部分資產配置於「海外所得」（如美股、海外債），利用每年 750 萬的最低稅負制免稅額度。國內投資應優先考慮分離課稅商品或不配息的資本利得型商品。' },
    { rate: 40, threshold: Infinity, progressiveDiff: 911700, label: '頂層稅率', title: '傳承與資產保全', advice: '稅務成本極高。應從「個人稅務」轉向「家族稅務」或「法人架構」思考。重點在於資產保全與傳承規劃，建議諮詢專業會計師進行信託或遺贈稅規劃。' }
];

export function useIncomeTax(careerSource: MaybeRefOrGetter<UserCareer>) {

    const annualGrossIncome = computed(() => Number(toValue(careerSource)?.annualTotalIncome) || 0);

    // 計算各項扣除額
    const deductions = computed(() => {
        const career = toValue(careerSource);
        if (!career) return { exemption: 0, standard: 0, salary: 0, pension: 0 };

        // 免稅額: 本人 + 扶養親屬
        const dependentsCount = (career.dependents || 0);
        const exemptionTotal = TAX_CONSTANTS.EXEMPTION * (1 + dependentsCount);

        // 薪資特別扣除額 (不能超過薪資收入，上限 21.8萬)
        const salaryDed = Math.min(annualGrossIncome.value, TAX_CONSTANTS.SALARY_DEDUCTION);

        // 勞退自提金額 (全額免稅)
        // pensionPersonalAmount 是月繳，需 * 12
        const pensionDed = (career.pensionPersonalAmount || 0) * 12;

        return {
            exemption: exemptionTotal,
            standard: TAX_CONSTANTS.STANDARD_DEDUCTION,
            salary: salaryDed,
            pension: pensionDed
        };
    });

    // 綜合所得淨額 (Taxable Income)
    const estimatedNetIncome = computed(() => {
        const d = deductions.value;
        const net = annualGrossIncome.value - d.exemption - d.standard - d.salary - d.pension;
        return Math.max(0, net);
    });

    // 稅率級距判斷
    const currentBracket = computed(() => {
        const net = estimatedNetIncome.value;

        for (const bracket of TAX_BRACKETS) {
            if (net <= bracket.threshold) {
                return bracket;
            }
        }
        // Fallback (should not reach here if last threshold is Infinity)
        return TAX_BRACKETS[0];
    });

    // 預估應納稅額
    const estimatedTaxAmount = computed(() => {
        const net = estimatedNetIncome.value;
        const { rate, progressiveDiff } = currentBracket.value;
        return Math.round((net * (rate / 100)) - progressiveDiff);
    });

    // 有效稅率
    const effectiveTaxRate = computed(() => {
        if (annualGrossIncome.value <= 0) return '0.0';
        return ((estimatedTaxAmount.value / annualGrossIncome.value) * 100).toFixed(1);
    });

    // 勞退節稅效益試算
    const pensionTaxSave = computed(() => {
        return Math.round(deductions.value.pension * (currentBracket.value.rate / 100));
    });

    return {
        annualGrossIncome,
        deductions,
        estimatedNetIncome,
        currentBracket,
        estimatedTaxAmount,
        effectiveTaxRate,
        pensionTaxSave
    };
}