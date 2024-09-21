<template>
    <el-card>
        <el-form label-width="auto">
            <canvas id="freedomRateChart"></canvas>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import Chart from 'chart.js/auto';
const emits = defineEmits(['update:modelValue', 'export'])
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    config: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    career: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    security: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    spouse: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    mortgage: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    parenting: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    retirement: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    estatePrice: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
})
const profile = computed(() => {
    return props.modelValue
})
const securitySum = ref(0)
// methods
let securityChartInstance = ref<Chart>()
function calculateFreedomRate(payload) {
    const {
        retirementAsset,
        securityAssetData,
    } = payload

    const { irr } = props.security
    const { currentYear, inflationRate } = props.config
    const { downpayTotalPrice, debtData = [], downpayYear } = props.mortgage
    const { irrOverDecade } = props.retirement.pension
    const { yearsToRetirement, yearOfRetire } = props.retirement
    const { lifeExpectancy } = profile.value


    const datasets = []
    const securityData: number[] = []
    const estateAsset: number[] = []
    const estateDebtData: number[] = []
    const retireAssetData: number[] = []
    const labels: number[] = []
    const inflationModifier = 1 + inflationRate / 100
    let inflatedEstateAsset = downpayTotalPrice

    for (let i = 0; i < lifeExpectancy; i++) {
        const year = currentYear + 1 + i
        labels.push(year)
        // data
        const secutiryValue = securityAssetData[i]
        if (secutiryValue) {
            securityData.push(secutiryValue)
        }
        inflatedEstateAsset *= inflationModifier
        // retirement
        if (year > yearOfRetire) {
            const retireAssetValue = retirementAsset.shift()
            if (retireAssetValue) {
                retireAssetData.push(Math.floor(retireAssetValue))
            }
        } else {
            retireAssetData.push(0)
        }
        // estate
        if (year >= downpayYear) {
            estateAsset.push(Math.floor(inflatedEstateAsset))
            const debtValue = debtData.shift()
            if (debtValue) {
                estateDebtData.push(-debtValue)
            }
        } else {
            estateAsset.push(0)
            estateDebtData.push(0)
        }
    }

    const tension = 0.5
    datasets.push({
        label: '證券資產',
        data: securityData,
        fill: true,
        tension,
    })
    datasets.push({
        label: '房貸負債',
        data: estateDebtData,
        fill: true,
        tension,
    })
    datasets.push({
        label: '房地增值',
        data: estateAsset,
        fill: true,
        tension,
    })
    datasets.push({
        label: '退休金',
        data: retireAssetData,
        fill: true,
        tension,
    })
    // security sum
    const finalAsset = securityData.pop()
    const finalDebt = estateDebtData.pop()
    const finalEstate = estateAsset.pop()
    const finalPension = retireAssetData.pop()
    securitySum.value = finalAsset + finalEstate + finalPension - finalDebt
    //
    const chartData = {
        datasets,
        labels,
    }
    if (securityChartInstance.value) {
        securityChartInstance.value.data = chartData
        securityChartInstance.value.update()
    } else {
        const ctx: any = document.getElementById('freedomRateChart')
        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        })
        securityChartInstance = shallowRef(chartInstance)
    }
}
defineExpose({
    calculateFreedomRate,
})
</script>
<style lang="scss" scoped>
.card-header--custom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header__btnGroup {
        display: flex;
        gap: 8px;
    }
}
</style>