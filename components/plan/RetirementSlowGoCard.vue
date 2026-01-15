<template>
    <el-card shadow="never">
        <el-form label-position="top">

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="啟動年齡 (Slow-Go Start)">
                        <el-input-number v-model="retirement.slowGoStartAge" :min="55" :max="90"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估期間">
                        <el-input :value="durationText" disabled style="width: 100%">
                            <template #prefix><el-icon>
                                    <Calendar />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="醫療防禦等級">
                        <el-select v-model="retirement.defenseTierCode" placeholder="請選擇" style="width: 100%"
                            @change="onTierSelect">
                            <el-option v-for="item in tierOptions" :key="item.code" :label="item.label"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="月預算 (保費+自費)">
                        <el-input-number v-model="retirement.monthlyMedicalCost" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-alert v-if="selectedTierOpt" :title="selectedTierOpt.description" type="info" :closable="false"
                show-icon style="margin-bottom: 20px;" />

            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="重大傷病準備金 (PV)">
                        <el-input-number v-model="retirement.criticalIllnessReserve" :min="0" :step="100000"
                            :max="10000000" controls-position="right" style="width: 100%" @change="triggerSave" />
                        <div style="text-align: right; margin-top: 4px;">
                            <el-text v-if="retirement.criticalIllnessReserve < 500000" type="danger" size="small">
                                建議至少準備 50萬
                            </el-text>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider style="margin: 24px 0 16px 0;" />

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <el-text type="info" size="default">每月現金流需求</el-text>

                <el-statistic :value="retirement.monthlyMedicalCost">
                    <template #prefix>NT$</template>
                </el-statistic>
            </div>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { Calendar } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState, UserRetirement } from './types/user';

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
        slowGoStartAge: 75,
        defenseTierCode: '',
        monthlyMedicalCost: 0,
        criticalIllnessReserve: 500000,
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

// --- 邏輯 ---

const durationText = computed(() => {
    const start = safeNumber(retirement.value.slowGoStartAge);
    const ltcStart = safeNumber(retirement.value.ltcStartAge);
    const end = ltcStart > 0 ? ltcStart : 80;

    if (end <= start) return '設定異常';

    const isProjected = ltcStart === 0;
    const yearDiff = end - start;

    return `${start} ~ ${end} 歲 (約 ${yearDiff} 年)${isProjected ? '*' : ''}`;
});

const tierOptions = computed(() => props.metadata?.opt_medical_defense?.list || []);

const selectedTierOpt = computed(() => {
    return tierOptions.value.find((opt: any) => opt.code === retirement.value.defenseTierCode);
});

const onTierSelect = (code: string) => {
    const opt = tierOptions.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.monthlyMedicalCost = safeNumber(opt.monthlyBudget);
        triggerSave();
    }
};

// --- 工具 ---
function safeNumber(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

const getPayload = () => {
    const {
        slowGoStartAge, defenseTierCode,
        monthlyMedicalCost, criticalIllnessReserve
    } = retirement.value;
    return { slowGoStartAge, defenseTierCode, monthlyMedicalCost, criticalIllnessReserve };
};

const triggerSave = debounce(async () => {
    try {
        await authFetch('/api/v1/user/retirement/slow-go', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getPayload())
        });
    } catch (e) { console.error('Save failed', e); }
}, 800);

watch(() => userForm.value.retirement, () => triggerSave(), { deep: true });
</script>