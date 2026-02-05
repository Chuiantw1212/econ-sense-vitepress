/**
 * 財務計算機參數介面
 */
export interface TVMParams {
    rate: number;
    nper: number;
    pmt: number;
    pv: number;
    type?: 0 | 1;
}

/**
 * 資產成長序列資料點
 */
export interface AssetDataPoint {
    year: number;   // 西元年
    age: number;    // 當下年齡
    amount: number; // 當下資產總額
}

export function useFinancialCalculator() {

    /**
     * 基礎 TVM 終值計算 (Excel FV 邏輯)
     */
    function calcFV({ rate, nper, pmt, pv, type = 0 }: TVMParams): number {
        if (rate === 0) {
            return pv + (pmt * nper);
        }
        const compoundFactor = Math.pow(1 + rate, nper);
        const fvFromPV = pv * compoundFactor;
        const annuityFactor = (compoundFactor - 1) / rate;
        const fvFromPMT = pmt * annuityFactor * (type === 1 ? (1 + rate) : 1);

        return fvFromPV + fvFromPMT;
    }

    /**
     * [單點計算] 退休專用終值
     * 自動處理年利率轉月利率、年數轉月數
     */
    function calcRetirementFV(
        annualRatePercent: number,
        years: number,
        monthlyPMT: number,
        currentPV: number
    ): number {
        if (years < 0) return currentPV; // 防呆

        const ratePerPeriod = (annualRatePercent / 100) / 12;
        const nPer = years * 12;

        const result = calcFV({
            rate: ratePerPeriod,
            nper: nPer,
            pmt: monthlyPMT,
            pv: currentPV
        });

        return Math.round(result);
    }

    /**
     * [序列計算] 產生從現在到退休每一年的資產變化
     * @param annualRatePercent 年報酬率 (%)
     * @param totalYears 總預估年數 (例如距離退休還有 20 年)
     * @param monthlyPMT 每月提撥金額
     * @param currentPV 目前現值
     */
    function calcRetirementFVSeries(
        annualRatePercent: number,
        totalYears: number,
        monthlyPMT: number,
        currentPV: number
    ): number[] { // 直接回傳數字陣列
        const series: number[] = [];

        for (let i = 0; i <= totalYears; i++) {
            series.push(calcRetirementFV(annualRatePercent, i, monthlyPMT, currentPV));
        }

        return series;
    }

    return {
        calcFV,
        calcRetirementFV,
        calcRetirementFVSeries
    };
}