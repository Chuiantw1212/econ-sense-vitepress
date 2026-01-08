export interface LaborInsuranceResult {
    statutoryAge: number;
    diffYears: number;
    bonusPercentage: number;
    amountA: number;
    amountB: number;
    bestAmount: number;
    msg: string;
}

export function useLaborInsuranceCalculator() {

    // ... (getStatutoryAge 維持不變) ...
    function getStatutoryAge(birthYear: number): number {
        const rocYear = birthYear - 1911;
        if (rocYear <= 46) return 60;
        if (rocYear === 47) return 61;
        if (rocYear === 48) return 62;
        if (rocYear === 49) return 63;
        if (rocYear === 50) return 64;
        return 65;
    }

    // ... (calculateAnnuity 維持不變) ...
    function calculateAnnuity(
        avgSalary: number,
        seniorityMonths: number,
        claimAge: number,
        statutoryAge: number
    ): LaborInsuranceResult {
        const years = seniorityMonths / 12;
        let diff = claimAge - statutoryAge;

        // 有效增減給年限 (-5 ~ +5)
        let effectiveDiff = diff;
        if (effectiveDiff < -5) effectiveDiff = -5;
        if (effectiveDiff > 5) effectiveDiff = 5;

        const percentageRate = 0.04;
        const bonusPercentage = effectiveDiff * percentageRate;

        const rawA = (avgSalary * years * 0.00775) + 3000;
        const rawB = avgSalary * years * 0.0155;

        const factor = 1 + bonusPercentage;
        const finalA = Math.round(rawA * factor);
        const finalB = Math.round(rawB * factor);

        // 產生純文字狀態描述
        let msg = '標準請領';
        if (diff < 0) {
            msg = `提早 ${Math.abs(diff)} 年 (減給 ${Math.abs(bonusPercentage * 100)}%)`;
        } else if (diff > 0) {
            const displayBonus = Math.min(diff, 5) * 4; // 顯示用的趴數上限為 20%
            msg = `展延 ${diff} 年 (加給 ${displayBonus}%)`;
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

    /**
     * [新增] 計算終身領取現值 (PV)
     * 將未來每一期領到的年金，以 3% 折現率折算回「現在 (Current Age)」的價值
     * @param monthlyAmount 每月年金 (PMT)
     * @param currentAge 現在年齡
     * @param claimAge 開始請領年齡
     * @param lifeExpectancy 預期壽命 (幾歲過世)
     * @param discountRate 折現率 (預設 3%)
     */
    function calculateLifetimePV(
        monthlyAmount: number,
        currentAge: number,
        claimAge: number,
        lifeExpectancy: number,
        discountRate: number = 0.03
    ): number {
        if (monthlyAmount <= 0 || lifeExpectancy <= claimAge) return 0;

        const annualAmount = monthlyAmount * 12;
        let totalPV = 0;

        // 總共領幾年
        const durationYears = Math.floor(lifeExpectancy - claimAge);

        // 距離開始領還有幾年 (延遲期)
        // 如果已經超過請領年齡，則視為 0 (立即開始)
        const delayYears = Math.max(0, claimAge - currentAge);

        for (let i = 1; i <= durationYears; i++) {
            // 第 i 年領到的錢，距離現在是 (delayYears + i) 年後
            const time = delayYears + i;
            const pv = annualAmount / Math.pow(1 + discountRate, time);
            totalPV += pv;
        }

        return Math.round(totalPV);
    }

    return {
        getStatutoryAge,
        calculateAnnuity,
        calculateLifetimePV // Export 新函式
    };
}