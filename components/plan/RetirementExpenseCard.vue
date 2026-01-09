<template>
    <el-card shadow="never">
        <el-form :model="localData" label-position="top" label-width="auto">

            <el-divider>通用基礎設定 (金額皆為現值 PV)</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="真實月開銷基數 (信用卡加總)">
                        <el-input :value="formatMoney(baseMonthlyExpense)" disabled style="width: 100%">
                            <template #suffix>元 (現值)</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="預計退休/請領年齡">
                        <el-input :value="retirementAge" disabled style="width: 100%">
                            <template #suffix>歲</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="全期額外醫療預算 (等級)">
                        <el-select v-model="localData.medicalCode" placeholder="請選擇" style="width: 100%"
                            @change="handleMedicalChange">
                            <el-option v-for="opt in medicalOptions" :key="opt.code" :label="opt.label"
                                :value="opt.code">
                                <span style="float: left">{{ opt.label }}</span>
                                <span v-if="opt.amount"
                                    style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">
                                    {{ formatMoney(opt.amount) }}
                                </span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="全期額外醫療預算 (金額)">
                        <el-input-number v-model="localData.medicalExpense" :min="0" :step="1000" style="width: 100%" />
                        <div class="inflation-note">
                            * 此項目將以 {{ (MEDICAL_INFLATION_RATE * 100).toFixed(1) }}% 年增率估算
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider>階段一：活躍圓夢期 (退休~失能)</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="退休生活風格配置">
                        <el-select v-model="localData.lifestyleCode" placeholder="請選擇" style="width: 100%"
                            @change="handleLifestyleChange">
                            <el-option v-for="opt in lifestyleOptions" :key="opt.code" :label="opt.label"
                                :value="opt.code">
                                <span style="float: left">{{ opt.label }}</span>
                                <span v-if="opt.value"
                                    style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">
                                    x{{ Math.round(opt.value * 100) }}%
                                </span>
                            </el-option>
                        </el-select>
                        <div class="inflation-note">
                            * 生活與旅遊費將以 {{ (GENERAL_INFLATION_RATE * 100).toFixed(1) }}% 通膨率複利成長
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="階段一「首年」預估月支 (FV)">
                        <el-input :value="formatMoney(activePhaseFirstYearFV)" disabled style="width: 100%">
                            <template #suffix>元 (未來值)</template>
                        </el-input>
                        <div class="inflation-note">
                            * 這是您 {{ retirementAge }} 歲那一年的預估開銷
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider>階段二：失能照護期 (失能~終老)</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="失能啟動年齡 (分界點)">
                        <el-input-number v-model="localData.disabilityAge" :min="retirementAge + 1" :max="100"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="長照照顧模式配置">
                        <el-select v-model="localData.careModeCode" placeholder="請選擇" style="width: 100%"
                            @change="handleCareModeChange">
                            <el-option v-for="opt in careCostOptions" :key="opt.code" :label="opt.label"
                                :value="opt.code">
                                <span style="float: left">{{ opt.label }}</span>
                                <span v-if="opt.amount"
                                    style="float: right; color: var(--el-text-color-secondary); font-size: 12px;">
                                    {{ formatMoney(opt.amount) }}
                                </span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估照護費用 (現值)">
                        <el-input-number v-model="localData.disabilityExpense" :min="0" :step="1000"
                            style="width: 100%" />
                        <div class="inflation-note">
                            * 照護費將以 {{ (MEDICAL_INFLATION_RATE * 100).toFixed(1) }}% 較高通膨率成長
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="階段二「首年」預估月支 (FV)">
                        <el-input :value="formatMoney(passivePhaseFirstYearFV)" disabled style="width: 100%">
                            <template #suffix>元 (未來值)</template>
                        </el-input>
                        <div class="inflation-note">
                            * 這是您 {{ localData.disabilityAge }} 歲那一年的預估開銷
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider>全期支出結構預測 (含通膨複利)</el-divider>

            <RetirementExpenseChart :current-age="currentAge" :retirement-age="retirementAge"
                :life-expectancy="lifeExpectancy" :base-monthly-expense="baseMonthlyExpense"
                :medical-expense="localData.medicalExpense" :dream-coefficient="localData.dreamCoefficient"
                :disability-age="localData.disabilityAge" :disability-expense="localData.disabilityExpense"
                :living-expense-adjustment="localData.livingExpenseAdjustment" />

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RetirementExpenseChart from './charts/RetirementExpenseChart.vue';
import type { UserFormState } from './types/user';
import type { UserRetirementQuality } from './types/user';
// --- 常數設定 (僅用於顯示文字，實際計算在子組件內也有一份或共用) ---
const GENERAL_INFLATION_RATE = 0.03;
const MEDICAL_INFLATION_RATE = 0.04;

// --- Props & Types ---
interface OptionItem {
    code: string;
    label: string;
    value?: number;
    amount?: number;
    livingExpenseAdjustment?: number;
}

const props = defineProps<{
    metadata: {
        opt_medical_expenses?: { list: OptionItem[] },
        opt_lifestyle_curve?: { list: OptionItem[] },
        opt_care_costs?: { list: OptionItem[] }
    }
}>();

const model = defineModel<UserFormState>({ required: true });

// --- Options from Metadata ---
const medicalOptions = computed(() => props.metadata?.opt_medical_expenses?.list || []);
const lifestyleOptions = computed(() => props.metadata?.opt_lifestyle_curve?.list || []);
const careCostOptions = computed(() => props.metadata?.opt_care_costs?.list || []);

const localData = computed({
    get: () => {
        const defaults = {
            medicalCode: 'basic',
            medicalExpense: 2000,
            lifestyleCode: 'active',
            dreamCoefficient: 1.2,
            disabilityAge: 75,
            careModeCode: 'day_care',
            disabilityExpense: 45000,
            livingExpenseAdjustment: 1.0
        };
        return { ...defaults, ...model.value.retirementQuality };
    },
    set: (val: UserRetirementQuality) => {
        model.value.retirementQuality = val;
    }
});

// --- Time & Base Calculations ---
const currentYear = new Date().getFullYear();
const birthYear = computed(() => {
    const dateStr = model.value.profile?.birthDate;
    if (!dateStr) return currentYear - 30;
    return new Date(dateStr).getFullYear();
});
const currentAge = computed(() => currentYear - birthYear.value);

const baseMonthlyExpense = computed(() => {
    const cards = model.value.creditCards;
    let total = 0;
    if (Array.isArray(cards)) {
        total = cards.reduce((sum, card) => sum + (Number(card.averageMonthlyExpense) || 0), 0);
    }
    return total > 0 ? total : 30000;
});

const retirementAge = computed(() => model.value.laborInsurance?.expectedClaimAge || 65);
const lifeExpectancy = computed(() => {
    const remaining = model.value.laborInsurance?.predictedRemainingLife || 25;
    return Math.floor(retirementAge.value + remaining);
});

// --- FV Helper for Display ---
function calculateFV(pv: number, rate: number, years: number) {
    if (years <= 0) return pv;
    return pv * Math.pow(1 + rate, years);
}

// --- Phase Totals (Future Value) Display ---
const activePhaseFirstYearFV = computed(() => {
    const yearsToRetire = Math.max(0, retirementAge.value - currentAge.value);

    const basePV = baseMonthlyExpense.value * localData.value.dreamCoefficient;
    const baseFV = calculateFV(basePV, GENERAL_INFLATION_RATE, yearsToRetire);

    const medFV = calculateFV(localData.value.medicalExpense, MEDICAL_INFLATION_RATE, yearsToRetire);

    return Math.round(baseFV + medFV);
});

const passivePhaseFirstYearFV = computed(() => {
    const yearsToDisability = Math.max(0, localData.value.disabilityAge - currentAge.value);

    const basePV = baseMonthlyExpense.value * localData.value.livingExpenseAdjustment;
    const baseFV = calculateFV(basePV, GENERAL_INFLATION_RATE, yearsToDisability);

    const medFV = calculateFV(localData.value.medicalExpense, MEDICAL_INFLATION_RATE, yearsToDisability);

    const careFV = calculateFV(localData.value.disabilityExpense, MEDICAL_INFLATION_RATE, yearsToDisability);

    return Math.round(baseFV + medFV + careFV);
});

// --- Select Handlers ---
function handleMedicalChange(code: string) {
    const opt = medicalOptions.value.find(o => o.code === code);
    if (opt) {
        const newData = { ...localData.value };
        newData.medicalCode = code;
        newData.medicalExpense = opt.amount ?? 0;
        localData.value = newData;
    }
}
function handleLifestyleChange(code: string) {
    const opt = lifestyleOptions.value.find(o => o.code === code);
    if (opt) {
        const newData = { ...localData.value };
        newData.lifestyleCode = code;
        newData.dreamCoefficient = opt.value ?? 1.0;
        localData.value = newData;
    }
}
function handleCareModeChange(code: string) {
    const opt = careCostOptions.value.find(o => o.code === code);
    if (opt) {
        const newData = { ...localData.value };
        newData.careModeCode = code;
        newData.disabilityExpense = opt.amount ?? 0;
        newData.livingExpenseAdjustment = opt.livingExpenseAdjustment ?? 1.0;
        localData.value = newData;
    }
}

function formatMoney(val: number) { return Math.round(val).toLocaleString(); }
</script>

<style scoped>
.inflation-note {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 4px;
}
</style>