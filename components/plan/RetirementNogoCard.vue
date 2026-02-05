<template>
    <el-card shadow="never" class="no-go-card">

        <el-form label-position="top">

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="啟動年齡 (No-Go Start)">
                        <el-input-number v-model="retirement.nogoStartAge" :min="60" :max="totalLifeExpectancy - 1"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預期壽命 (End)">
                        <el-input :value="`${totalLifeExpectancy} 歲`" disabled style="width: 100%">
                            <template #prefix><el-icon>
                                    <Timer />
                                </el-icon></template>
                            <template #append>預測值</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div
                style="font-size: 13px; color: #F56C6C; margin-bottom: 24px; display: flex; align-items: center; gap: 6px;">
                <el-icon>
                    <InfoFilled />
                </el-icon>
                <span>預計照護期間：<b>{{ Number(careDuration).toFixed(1) }} 年</b></span>
            </div>

            <el-divider />

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="照顧模式 (Strategy)">
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
                    <el-form-item label="基本月費 (Base Cost)">
                        <el-input-number v-model="retirement.ltcMonthlyCost" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedModeOpt"
                style="background-color: #f5f7fa; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
                <div style="font-size: 12px; color: #909399; margin-bottom: 4px; font-weight: bold;">
                    模式說明 (Description)
                </div>
                <div style="font-size: 13px; color: #606266; line-height: 1.6;">
                    {{ selectedModeOpt.description }}
                </div>
            </div>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="隱形雜支 (Hidden Costs)">
                        <el-input-number v-model="retirement.ltcMonthlySupplies" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="政府補助 (Subsidy)">
                        <el-input-number v-model="retirement.ltcSubsidy" :min="0" :step="1000" controls-position="right"
                            style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>

        <template #footer>
            <div style="display: flex; justify-content: space-between; align-items: center;">

                <el-space :size="4" alignment="center" style="color: #606266; font-size: 14px;">
                    <span style="font-size: 14px; color: #606266;">每月現金流需求</span>
                    <!-- <span>{{ formatMoney(retirement.ltcMonthlyCost) }}</span>
                    <span>+</span>
                    <span>{{ formatMoney(retirement.ltcMonthlySupplies) }}</span>
                    <span>-</span>
                    <span>{{ formatMoney(retirement.ltcSubsidy) }}</span> -->
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
import { Timer, InfoFilled } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState, UserRetirement } from './types/user';

// --- 定義與 Props ---
const props = defineProps<{
    metadata: Record<string, any>;
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// --- 初始化 ---
const ensureDefaults = () => {
    if (!userForm.value.retirement) {
        userForm.value.retirement = {} as UserRetirement;
    }
    const target = userForm.value.retirement;

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
const totalLifeExpectancy = computed(() => {
    const labor = (userForm.value as any).laborInsurance;
    if (!labor) return 85;
    const claimAge = safeNumber(labor.expectedClaimAge);
    const remaining = safeNumber(labor.predictedRemainingLife);
    const baseAge = claimAge > 0 ? claimAge : 65;
    const duration = remaining > 0 ? remaining : 20;
    return baseAge + duration;
});

const careDuration = computed(() => {
    const start = safeNumber(retirement.value.nogoStartAge);
    const end = totalLifeExpectancy.value;
    const duration = end - start;
    return duration > 0 ? duration : 0;
});

const rawModeList = computed(() => props.metadata?.opt_retirement_nogo_ltc_mode?.list || []);

const groupedModeOptions = computed(() => {
    const list = rawModeList.value;
    const cats = Array.from(new Set(list.map((i: any) => i.category)));
    return cats.map(cat => ({
        label: cat,
        options: list.filter((i: any) => i.category === cat)
    }));
});

const selectedModeOpt = computed(() => {
    return rawModeList.value.find((opt: any) => opt.code === retirement.value.ltcCareMode);
});

const onModeSelect = (code: string) => {
    const opt = rawModeList.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.ltcMonthlyCost = safeNumber(opt.monthlyCost);
        retirement.value.ltcMonthlySupplies = safeNumber(opt.defaultSupplies);
        retirement.value.ltcSubsidy = safeNumber(opt.defaultSubsidy);
        triggerSave();
    }
};

const netMonthlyBurn = computed(() => {
    const cost = safeNumber(retirement.value.ltcMonthlyCost);
    const supplies = safeNumber(retirement.value.ltcMonthlySupplies);
    const subsidy = safeNumber(retirement.value.ltcSubsidy);
    const total = cost + supplies - subsidy;
    return total > 0 ? total : 0;
});

// --- 工具 ---
const formatMoney = (val: number | undefined) => {
    return (val || 0).toLocaleString();
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