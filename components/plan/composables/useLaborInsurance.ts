import { ref, computed } from 'vue'

// 勞工保險投保薪資分級表 (2024/2025 參考)
// 勞保天花板目前鎖在 45,800
const LABOR_INSURANCE_BRACKETS = [
    { limit: 27470, value: 27470 }, // 基本工資 (第1級)
    { limit: 27600, value: 27600 },
    { limit: 28800, value: 28800 },
    { limit: 30300, value: 30300 },
    { limit: 31800, value: 31800 },
    { limit: 33300, value: 33300 },
    { limit: 34800, value: 34800 },
    { limit: 36300, value: 36300 },
    { limit: 38200, value: 38200 },
    { limit: 40100, value: 40100 },
    { limit: 42000, value: 42000 },
    { limit: 43900, value: 43900 },
    { limit: 45800, value: 45800 }  // 第13級 (最高上限)
];

/**
 * 勞保計算 Composable
 * @param initialWage 初始工資
 */
export function useLaborInsurance(initialWage: number = 0) {
    // 輸入：實際薪資
    const actualWage = ref(initialWage);
    
    // 內部計算：取得投保薪資 (Insured Wage)
    const insuredWage = computed(() => {
        const wage = Number(actualWage.value);
        if (wage <= 0) return 0;

        // 1. 薪資低於基本工資，以基本工資計算 (27,470)
        if (wage < 27470) return 27470;

        // 2. 查找級距：薪資 <= 上限 的第一個級距
        const bracket = LABOR_INSURANCE_BRACKETS.find(b => wage <= b.limit);

        // 3. 若超過最高級距 (45,800)，則取最高級距
        return bracket ? bracket.value : 45800;
    });

    // 計算勞保個人負擔 (Personal Premium)
    const personalPremium = computed(() => {
        // ★★★ 修正這裡 ★★★
        // 2024費率: 0.12 (普通11% + 就保1%)
        // 2025費率: 0.125 (普通11.5% + 就保1%)
        const rate = 0.125;

        const personalShare = 0.2; // 勞工負擔比例 (20%)

        return Math.round(insuredWage.value * rate * personalShare);
    });

    return {
        actualWage,      // 輸入：可綁定 v-model
        insuredWage,     // 輸出：勞保投保薪資 (最高 45,800)
        personalPremium  // 輸出：每月扣繳金額
    };
}