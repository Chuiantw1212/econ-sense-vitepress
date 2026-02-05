import { ref, computed } from 'vue'

// 健保投保金額分級表 (2024/2025 參考)
// 重點：最低 27,470，最高 219,500
const HEALTH_INSURANCE_BRACKETS = [
    { limit: 27470, value: 27470 }, // 第1級 (基本工資)
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
    { limit: 45800, value: 45800 },
    { limit: 48200, value: 48200 },
    { limit: 50600, value: 50600 },
    { limit: 53000, value: 53000 },
    { limit: 55400, value: 55400 },
    { limit: 57800, value: 57800 },
    { limit: 60800, value: 60800 },
    { limit: 63800, value: 63800 },
    { limit: 66800, value: 66800 },
    { limit: 69800, value: 69800 },
    { limit: 72800, value: 72800 },
    { limit: 76500, value: 76500 },
    { limit: 80200, value: 80200 },
    { limit: 83900, value: 83900 },
    { limit: 87600, value: 87600 },
    { limit: 92100, value: 92100 },
    { limit: 96600, value: 96600 },
    { limit: 101100, value: 101100 },
    { limit: 105600, value: 105600 },
    { limit: 110100, value: 110100 },
    { limit: 115500, value: 115500 },
    { limit: 120900, value: 120900 },
    { limit: 126300, value: 126300 },
    { limit: 131700, value: 131700 },
    { limit: 137100, value: 137100 },
    { limit: 142500, value: 142500 },
    { limit: 147900, value: 147900 },
    { limit: 150000, value: 150000 }, // 常見分界
    { limit: 182000, value: 182000 }, // 級距跳耀較大
    { limit: 219500, value: 219500 }, // 最高級距
];

/**
 * 健保計算 Composable
 * @param initialWage 初始工資
 * @param initialDependents 初始眷屬人數 (預設 0)
 */
export function useHealthInsurance(initialWage: number = 0, initialDependents: number = 0) {
    // 響應式狀態
    const actualWage = ref(initialWage);
    const dependents = ref(initialDependents); // 依附眷屬人數

    // 內部計算：取得投保金額 (Insured Wage)
    const insuredWage = computed(() => {
        const wage = Number(actualWage.value);
        if (wage <= 0) return 0;

        // 1. 低於基本工資，以基本工資計 (27,470)
        if (wage < 27470) return 27470;

        // 2. 查找級距
        const bracket = HEALTH_INSURANCE_BRACKETS.find(b => wage <= b.limit);

        // 3. 超過最高級距 (219,500)，以最高級距計
        return bracket ? bracket.value : 219500;
    });

    // 計算健保個人負擔 (Personal Premium)
    // 公式：投保金額 * 費率(5.17%) * 負擔比率(30%) * (1 + 眷屬人數)
    // 規則：眷屬人數超過 3 人以 3 人計
    const personalPremium = computed(() => {
        const rate = 0.0517; // 健保費率
        const personalShare = 0.3; // 個人負擔比率

        // 眷屬計費人數上限為 3
        const count = Math.min(Number(dependents.value), 3);

        // (1 + count) 代表 本人 + 眷屬
        return Math.round(insuredWage.value * rate * personalShare * (1 + count));
    });

    return {
        actualWage,      // 輸入：實際薪資
        dependents,      // 輸入：眷屬人數
        insuredWage,     // 輸出：健保投保金額
        personalPremium  // 輸出：每月自付額
    };
}