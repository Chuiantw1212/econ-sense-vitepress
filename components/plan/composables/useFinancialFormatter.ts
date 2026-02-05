// docs/.vitepress/theme/composables/useFinancialFormatter.ts
export function useFinancialFormatter() {

    /**
     * 格式化金額 (支援多幣別小數位數優化)
     */
    const formatCurrency = (value: number, currency: string = 'TWD') => {
        if (isNaN(value)) return '-'

        // 依據幣別決定小數位數
        let digits = 0
        if (currency === 'USD') digits = 2
        if (currency === 'JPY') digits = 0 // 日幣通常不看小數點
        if (currency === 'TWD') digits = 0

        return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        }).format(value)
    }

    const getTrendColor = (value: number) => {
        if (value > 0) return 'var(--el-color-danger)'
        if (value < 0) return 'var(--el-color-success)'
        return 'var(--el-text-color-regular)'
    }

    return {
        formatCurrency,
        getTrendColor
    }
}