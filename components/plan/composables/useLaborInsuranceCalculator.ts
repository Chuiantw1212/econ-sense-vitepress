export interface LaborInsuranceResult {
    statutoryAge: number;   // 法定請領年齡
    diffYears: number;      // 實際請領 vs 法定 (差幾年)
    bonusPercentage: number; // 增減給比例 (例如 -0.2 或 +0.08)
    amountA: number;        // 第一式 (保底型)
    amountB: number;        // 第二式 (年資型)
    bestAmount: number;     // 擇優結果
    msg: string;            // 狀態說明 (如：提早 3 年請領，減給 12%)
}

export function useLaborInsuranceCalculator() {

    /**
     * 計算法定請領年齡
     * 規則：
     * 46年次以前(含): 60歲
     * 47: 61, 48: 62, 49: 63, 50: 64
     * 51年次以後(含): 65歲
     */
    function getStatutoryAge(birthYear: number): number {
        // 轉換為民國年次 (西元 - 1911)
        const rocYear = birthYear - 1911;

        if (rocYear <= 46) return 60;
        if (rocYear === 47) return 61;
        if (rocYear === 48) return 62;
        if (rocYear === 49) return 63;
        if (rocYear === 50) return 64;
        return 65; // 51年次以後
    }

    /**
     * 計算勞保老年年金 (擇優)
     * @param avgSalary 最高60個月平均投保薪資
     * @param seniorityMonths 投保年資 (月)
     * @param claimAge 預計請領年齡
     * @param statutoryAge 法定請領年齡
     */
    function calculateAnnuity(
        avgSalary: number,
        seniorityMonths: number,
        claimAge: number,
        statutoryAge: number
    ): LaborInsuranceResult {

        // 1. 計算年資 (年)
        const years = seniorityMonths / 12;

        // 2. 計算提前或延後年數 (Diff)
        // 負數為提前，正數為延後
        let diff = claimAge - statutoryAge;

        // 限制：最多提前 5 年，延後加給最多也只算 5 年
        // (雖然可以延後更久領，但多出來的年份不加 %，這裡僅計算「有效」的 diff 用於倍率)
        let effectiveDiff = diff;
        if (effectiveDiff < -5) effectiveDiff = -5; // 理論上 UI 會擋
        if (effectiveDiff > 5) effectiveDiff = 5;

        // 3. 計算增減給比例 (每一年 4%)
        const percentageRate = 0.04;
        const bonusPercentage = effectiveDiff * percentageRate; // e.g., -0.2 or +0.2

        // 4. 基礎公式計算 (尚未乘上增減給)
        // 第一式：(平均月投保薪資 × 年資 × 0.775%) + 3,000元
        // 第二式：平均月投保薪資 × 年資 × 1.55%
        const rawA = (avgSalary * years * 0.00775) + 3000;
        const rawB = avgSalary * years * 0.0155;

        // 5. 乘上增減給係數 (1 + bonus)
        // 例如提前5年: * 0.8，延後5年: * 1.2
        const factor = 1 + bonusPercentage;
        const finalA = Math.round(rawA * factor);
        const finalB = Math.round(rawB * factor);

        // 6. 產生訊息
        let msg = '標準請領 (不增不減)';
        if (diff < 0) {
            msg = `提早 ${Math.abs(diff)} 年請領 (減給 ${Math.abs(bonusPercentage * 100)}%)`;
        } else if (diff > 0) {
            // 若實際延後超過5年，顯示文字仍需正確反映，但計算已封頂
            const displayBonus = Math.min(diff, 5) * 4;
            msg = `展延 ${diff} 年請領 (加給 ${displayBonus}%)`;
        }

        return {
            statutoryAge,
            diffYears: diff,
            bonusPercentage,
            amountA: finalA,
            amountB: finalB,
            bestAmount: Math.max(finalA, finalB),
            msg
        };
    }

    return {
        getStatutoryAge,
        calculateAnnuity
    };
}