<template>
    <div>
        <h3 id="_購屋貸款試算" tabindex="-1">購屋貸款試算</h3>
        <el-card>
            <el-form label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="購屋西元年">
                            <el-input-number v-model="mortgage.buyHouseYear" @change="calculateMortgage()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="預估貸款成數">
                            <a href="https://member.jcic.org.tw/main_member/MorgageQuery.aspx"
                                target="_blank">住宅貸款統計查詢網</a>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="貸款比例(%)">
                            <el-input-number v-model="mortgage.loanPercent" :min="0" :max="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="預估貸款">
                            <el-text>{{ Number(mortgage.loanAmount).toLocaleString() }} NTD</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="預估頭期款">
                            <el-text>{{ Number(mortgage.downPayment).toLocaleString() }} NTD</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="試算利息(%)">
                            <el-input-number v-model="mortgage.interestRate" :min="0" @change="calculateMortgage()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="貸款年期">
                            <el-input-number v-model="mortgage.loanTerm" :min="0" @change="calculateMortgage()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="還款金額" prop="floorSize">
                            <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD / 月</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="試算說明" name="1" :border="true">
                        <ul>
                            <li>
                                試算利息：<a href="https://www.cbc.gov.tw/tw/lp-370-1.html" target="_blank">央行貼放利率</a>
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </template>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    config: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    estatePrice: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
})
const mortgage = computed(() => {
    return props.modelValue
})

function calculateMortgage(options: any = { propagate: true }) {
    const { propagate = true } = options
    debounce(() => {
        drawMortgageChart()
    })(propagate)
}

function drawMortgageChart() {
    const { loanPercent, loanTerm, interestRate } = mortgage.value
    const { totalPrice, } = props.estatePrice
    if (!totalPrice || !loanPercent || !loanTerm) {
        return
    }
    const loanAmount = totalPrice * loanPercent / 100
    mortgage.value.loanAmount = Math.floor(loanAmount)
    const downPayment = Math.floor(totalPrice - loanAmount)
    mortgage.value.estimatedDownPayment = downPayment
    if (!mortgage.value.downPayment) {
        mortgage.value.downPayment = downPayment
    }

    /**
     * 本息平均攤還
     * https://zh.wikipedia.org/zh-tw/%E6%9C%AC%E6%81%AF%E5%B9%B3%E5%9D%87%E6%94%A4%E9%82%84
     */
    const monthlyInterestRate = interestRate / 100 / 12
    const monthCount = loanTerm * 12

    const part = Math.pow(1 + monthlyInterestRate, monthCount)
    const fraction = part * monthlyInterestRate
    const deno = part - 1

    const averageRepayRate = fraction / deno
    mortgage.value.monthlyRepay = Math.floor(loanAmount * averageRepayRate)

    emits('update:modelValue', mortgage.value)
}

const debounceId = ref()
function debounce(func, delay = 100) {
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
    calculateMortgage,
})
</script>