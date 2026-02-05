/**
 * 退職所得稅試算結果介面 (Step 1)
 */
export interface TaxableBuckets {
    exemptAmount: number;
    halfTaxedIncome: number;
    fullyTaxedIncome: number;
    totalTaxableIncome: number;
    threshold1: number; // 經通膨調整後的級距一
    threshold2: number; // 經通膨調整後的級距二
}

/**
 * 最終稅額試算結果介面 (Step 2 & 3)
 */
export interface FinalTaxResult {
    netIncome: number;
    taxRate: number;
    progDiff: number;
    taxAmount: number;
    netReceive: number;
    // 新增：顯示用的調整後扣除額，讓使用者知道未來的免稅防護罩變多大
    inflatedDeduction: number;
}

export function useRetirementTaxCalculator() {

    // --- 基礎常數定義 (115年度基期) ---
    const BASE_LEVEL_1 = 206000; // 20.6萬
    const BASE_LEVEL_2 = 414000; // 41.4萬
    const BASE_SINGLE_DEDUCTION = 237000; // 單身防護罩

    // 稅率級距基期 (用於計算累進稅)
    const BRACKET_1 = 610000;
    const BRACKET_2 = 1380000;
    const BRACKET_3 = 2770000;
    const BRACKET_4 = 5080000;

    // 累進差額基期
    const DIFF_2 = 42700;
    const DIFF_3 = 153100;
    const DIFF_4 = 430100;
    const DIFF_5 = 938100;

    const INFLATION_RATE = 0.03; // 3% 通膨

    /**
     * 通膨計算輔助函式
     */
    function getInflatedValue(baseValue: number, years: number): number {
        if (years <= 0) return baseValue;
        return Math.round(baseValue * Math.pow(1 + INFLATION_RATE, years));
    }

    /**
     * Function 1: 計算退職所得級距與應申報金額 (含通膨調整)
     * @param totalAmount 退休金領取總額 (FV)
     * @param yearsService 服務年資
     * @param futureYears 距離退休年數 (用於通膨調整)
     */
    function getTaxableIncomeBuckets(totalAmount: number, yearsService: number, futureYears: number = 0): TaxableBuckets {
        const Y = Math.max(1, Math.floor(yearsService));
        const T = Math.round(totalAmount);

        // 計算通膨後的級距標準
        const adjustedLevel1 = getInflatedValue(BASE_LEVEL_1, futureYears);
        const adjustedLevel2 = getInflatedValue(BASE_LEVEL_2, futureYears);

        const threshold1 = adjustedLevel1 * Y;
        const threshold2 = adjustedLevel2 * Y;

        let exemptAmount = 0;
        let halfTaxedIncome = 0;
        let fullyTaxedIncome = 0;

        // 1. 免稅層
        if (T <= threshold1) {
            exemptAmount = 0;
        } else {
            // 2. 半數課稅層
            const tier2Width = threshold2 - threshold1;
            const amountInTier2 = Math.min(T - threshold1, tier2Width);

            if (amountInTier2 > 0) {
                halfTaxedIncome = Math.round(amountInTier2 * 0.5);
            }

            // 3. 全數課稅層
            if (T > threshold2) {
                fullyTaxedIncome = Math.round(T - threshold2);
            }
        }

        return {
            exemptAmount,
            halfTaxedIncome,
            fullyTaxedIncome,
            totalTaxableIncome: halfTaxedIncome + fullyTaxedIncome,
            threshold1,
            threshold2
        };
    }

    /**
     * Function 2: 計算最終稅額與實領淨額 (含通膨調整)
     * @param taxableIncome 應申報退職所得
     * @param originalTotalAmount 原始領取總額
     * @param futureYears 距離退休年數 (用於通膨調整)
     */
    function calculateFinalTaxAndNet(taxableIncome: number, originalTotalAmount: number, futureYears: number = 0): FinalTaxResult {

        // 1. 通膨調整後的扣除額 (防護罩)
        const inflatedDeduction = getInflatedValue(BASE_SINGLE_DEDUCTION, futureYears);
        const netIncome = Math.max(0, taxableIncome - inflatedDeduction);

        // 2. 通膨調整後的稅率級距 (Brackets) 與 累進差額 (ProgDiff)
        // 註：累進差額是數學推導結果，若級距擴大 X 倍，差額也會擴大 X 倍
        const b1 = getInflatedValue(BRACKET_1, futureYears);
        const b2 = getInflatedValue(BRACKET_2, futureYears);
        const b3 = getInflatedValue(BRACKET_3, futureYears);
        const b4 = getInflatedValue(BRACKET_4, futureYears);

        const pd2 = getInflatedValue(DIFF_2, futureYears);
        const pd3 = getInflatedValue(DIFF_3, futureYears);
        const pd4 = getInflatedValue(DIFF_4, futureYears);
        const pd5 = getInflatedValue(DIFF_5, futureYears);

        let taxRate = 5;
        let progDiff = 0;
        let taxAmount = 0;

        if (netIncome <= b1) {
            taxRate = 5;
            progDiff = 0;
            taxAmount = netIncome * 0.05;
        } else if (netIncome <= b2) {
            taxRate = 12;
            progDiff = pd2;
            taxAmount = netIncome * 0.12 - progDiff;
        } else if (netIncome <= b3) {
            taxRate = 20;
            progDiff = pd3;
            taxAmount = netIncome * 0.20 - progDiff;
        } else if (netIncome <= b4) {
            taxRate = 30;
            progDiff = pd4;
            taxAmount = netIncome * 0.30 - progDiff;
        } else {
            taxRate = 40;
            progDiff = pd5;
            taxAmount = netIncome * 0.40 - progDiff;
        }

        taxAmount = Math.round(taxAmount);

        return {
            netIncome,
            taxRate,
            progDiff,
            taxAmount,
            netReceive: originalTotalAmount - taxAmount,
            inflatedDeduction
        };
    }

    return {
        getTaxableIncomeBuckets,
        calculateFinalTaxAndNet
    };
}