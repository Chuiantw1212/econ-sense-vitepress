<template>
    <el-card shadow="never" class="no-go-card">

        <el-form label-position="top">

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="啟動年齡 (No-Go Start)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.nogoStartAge" :min="60" :max="totalLifeExpectancy - 1"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預期壽命 (End)" style="margin-bottom: 12px;">
                        <el-input :value="`${totalLifeExpectancy} 歲`" disabled style="width: 100%">
                            <template #prefix><el-icon>
                                    <Timer />
                                </el-icon></template>
                            <template #append>預測值</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="description-row danger-bg" style="margin-bottom: 24px;">
                <el-icon>
                    <InfoFilled />
                </el-icon>
                <span>
                    預計照護期間：<b>{{ Number(careDuration).toFixed(1) }} 年</b>
                    <span class="sub-text">(台北市平均不健康生存年數約 8.5 年)</span>
                </span>
            </div>


            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="照顧模式 (Strategy)" style="margin-bottom: 12px;">
                        <el-select v-model="retirement.ltcCareMode" placeholder="請選擇模式" style="width: 100%"
                            @change="onModeSelect">
                            <el-option-group v-for="group in groupedModeOptions" :key="group.label"
                                :label="group.label">
                                <el-option v-for="item in group.options" :key="item.code" :label="item.label"
                                    :value="item.code" />
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="基本月費 (Base Cost)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.ltcMonthlyCost" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedModeOpt" class="description-row" style="margin-bottom: 16px;">
                <el-icon>
                    <InfoFilled />
                </el-icon>
                <span>{{ selectedModeOpt.description }}</span>
            </div>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="隱形雜支 (Hidden Costs)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.ltcMonthlySupplies" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="政府補助 (Subsidy Deduction)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.ltcSubsidy" :min="0" :step="1000" controls-position="right"
                            style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>

        <template #footer>
            <div style="display: flex; justify-content: space-between; align-items: center;">

                <el-space :size="8" alignment="center">
                    <el-statistic :value="retirement.ltcMonthlyCost" :value-style="formulaStyle"
                        :formatter="moneyFormatter" />

                    <el-icon color="#909399">
                        <Plus />
                    </el-icon>

                    <el-statistic :value="retirement.ltcMonthlySupplies" :value-style="formulaStyle"
                        :formatter="moneyFormatter" />

                    <el-icon color="#909399">
                        <Minus />
                    </el-icon>

                    <el-statistic :value="retirement.ltcSubsidy" :value-style="{ ...formulaStyle, }"
                        :formatter="moneyFormatter" />
                </el-space>

                <el-statistic :value="netMonthlyBurn">
                    <template #prefix>NT$</template>
                </el-statistic>
            </div>
        </template>

    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { Timer, InfoFilled, Plus, Minus } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState, UserRetirement } from './types/user';

// --- 定義與 Props ---
const props = defineProps<{
    metadata: Record<string, any>; // opt_retirement_nogo_ltc_mode
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// --- 初始化 ---
const ensureDefaults = () => {
    if (!userForm.value.retirement) {
        userForm.value.retirement = {} as UserRetirement;
    }
    const target = userForm.value.retirement;

    // 預設值參考 2026 台北精算 (雜支1.5萬)
    const defaults: Partial<UserRetirement> = {
        nogoStartAge: 80,
        ltcCareMode: '',
        ltcMonthlyCost: 0,
        ltcMonthlySupplies: 15000,
        ltcSubsidy: 0
    };

    Object.keys(defaults).forEach((key) => {
        const k = key as keyof UserRetirement;
        if (target[k] === undefined) {
            (target[k] as any) = defaults[k];
        }
    });
};
ensureDefaults();

const retirement = computed(() => userForm.value.retirement);

// --- 邏輯區 ---

// (A) 計算壽命終點 (連動 LaborInsurance)
const totalLifeExpectancy = computed(() => {
    const labor = (userForm.value as any).laborInsurance;
    if (!labor) return 85;

    const claimAge = safeNumber(labor.expectedClaimAge);
    const remaining = safeNumber(labor.predictedRemainingLife);
    const baseAge = claimAge > 0 ? claimAge : 65;
    const duration = remaining > 0 ? remaining : 20;

    return baseAge + duration;
});

// (B) 期間計算
const careDuration = computed(() => {
    const start = safeNumber(retirement.value.nogoStartAge);
    const end = totalLifeExpectancy.value;
    const duration = end - start;
    return duration > 0 ? duration : 0;
});

// (C) 選單分組
const rawModeList = computed(() => props.metadata?.opt_retirement_nogo_ltc_mode?.list || []);

const groupedModeOptions = computed(() => {
    const list = rawModeList.value;
    const homeGroup = {
        label: '居家照護 (Home Care)',
        options: list.filter((i: any) => i.category === 'HOME')
    };
    const instGroup = {
        label: '機構照護 (Institutional Care)',
        options: list.filter((i: any) => i.category === 'INSTITUTION')
    };
    return [homeGroup, instGroup].filter(g => g.options.length > 0);
});

// 選中項目描述
const selectedModeOpt = computed(() => {
    return rawModeList.value.find((opt: any) => opt.code === retirement.value.ltcCareMode);
});

// 模式切換連動
const onModeSelect = (code: string) => {
    const opt = rawModeList.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.ltcMonthlyCost = safeNumber(opt.monthlyCost);
        retirement.value.ltcMonthlySupplies = safeNumber(opt.defaultSupplies);
        retirement.value.ltcSubsidy = safeNumber(opt.defaultSubsidy);
        triggerSave();
    }
};

// (D) 淨現金流計算
const netMonthlyBurn = computed(() => {
    const cost = safeNumber(retirement.value.ltcMonthlyCost);
    const supplies = safeNumber(retirement.value.ltcMonthlySupplies);
    const subsidy = safeNumber(retirement.value.ltcSubsidy);

    const total = cost + supplies - subsidy;
    return total > 0 ? total : 0;
});

// --- 工具 ---
const formulaStyle = {
    fontSize: '16px',
    fontWeight: 500,
    color: '#303133'
};

const moneyFormatter = (value: number) => {
    return value?.toLocaleString?.() ?? '0';
};

function safeNumber(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

const getPayload = () => {
    const {
        nogoStartAge, ltcCareMode,
        ltcMonthlyCost, ltcMonthlySupplies, ltcSubsidy
    } = retirement.value;

    return {
        nogoStartAge, ltcCareMode,
        ltcMonthlyCost, ltcMonthlySupplies, ltcSubsidy
    };
};

const triggerSave = debounce(async () => {
    try {
        await authFetch('/api/v1/user/retirement/no-go', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getPayload())
        });
    } catch (e) { console.error('Save failed', e); }
}, 800);

watch(() => userForm.value.retirement, () => triggerSave(), { deep: true });
</script>

<style scoped>
/* Header & Title */
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

/* Description Rows */
.description-row {
    margin-top: 8px;
    padding: 10px 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    font-size: 12px;
    color: #606266;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
}

.description-row .el-icon {
    margin-right: 6px;
    margin-top: 2px;
    color: #909399;
}

/* Danger Style */
.danger-bg {
    background-color: #fef0f0;
    color: #F56C6C;
}

.danger-bg .el-icon {
    color: #F56C6C;
}

.sub-text {
    opacity: 0.8;
    font-size: 11px;
    margin-left: 4px;
}
</style>