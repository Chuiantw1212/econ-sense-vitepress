<template>
    <el-card>
        <el-form label-width="auto">
            <canvas id="lifeAssetChart"></canvas>
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
    estate: {
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
// methods
function calculateLifeAsset(options: any = { propagate: true }) {
    const { propagate = true } = options
    customDebounce(() => {
        drawLifeAsset(options)
    })(propagate)
}

let lifeAssetChartInstance = ref<Chart>()
function drawLifeAsset(payload) {
    const {
        retirementAsset = [],
        securityAssetData = [],
        estateDebtData = [],
        propagate = [],
    } = payload

    const { irr } = props.security
    const { currentYear, inflationRate } = props.config
    const { downpayTotalPrice, downpayYear } = props.estate
    const { irrOverDecade } = props.retirement.pension
    const { yearsToRetirement, yearOfRetire, lifeExpectancy } = props.retirement


    const datasets = []
    const securityData: number[] = []
    const estateAsset: number[] = []
    const retireAssetData: number[] = []
    const labels: number[] = []
    const inflationModifier = 1 + inflationRate / 100
    let inflatedEstateAsset = downpayTotalPrice

    for (let i = 0; i < yearsToRetirement + lifeExpectancy; i++) {
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
        } else {
            estateAsset.push(0)
            estateDebtData.unshift(0)
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
        label: '房地產',
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
    const finalSecurity = securityData.pop()
    const finalDebt = estateDebtData.pop()
    const finalEstate = estateAsset.pop()
    const finalPension = retireAssetData.pop()
    profile.value.finalAsset = finalSecurity + finalEstate + finalPension - finalDebt
    if (propagate) {
        emits('update:modelValue', profile.value)
    }
    // 繪圖
    const chartData = {
        datasets,
        labels,
    }
    if (lifeAssetChartInstance.value) {
        lifeAssetChartInstance.value.data = chartData
        lifeAssetChartInstance.value.update()
    } else {
        const ctx: any = document.getElementById('lifeAssetChart')
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
        lifeAssetChartInstance = shallowRef(chartInstance)
    }
}

const debounceId = ref()
function customDebounce(func, delay = 100) {
    return (immediate) => {
        clearTimeout(debounceId.value)
        if (immediate) {
            func()
        } else {
            debounceId.value = setTimeout(() => {
                debounceId.value = undefined
                func()
            }, delay)
        }
    }
}

defineExpose({
    calculateLifeAsset,
})
</script>
<style lang="scss">
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