<template>
    <el-card shadow="never">

        <el-form label-position="top">

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="啟動年齡 (Slow-Go Start)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.slowGoStartAge" :min="55" :max="90"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估期間" style="margin-bottom: 12px;">
                        <el-input :value="durationText" disabled style="width: 100%">
                            <template #prefix><el-icon>
                                    <Calendar />
                                </el-icon></template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row :gutter="20" style="margin-top: 8px;">
                <el-col :span="12" :xs="24">
                    <el-form-item label="醫療品質分級" style="margin-bottom: 12px;">
                        <el-select v-model="retirement.defenseTierCode" placeholder="請選擇品質等級" style="width: 100%"
                            @change="onMedicalTierSelect">
                            <el-option v-for="item in medicalOptions" :key="item.code" :label="item.label"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="月預算 (保費+自費)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.monthlyMedicalCost" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedMedicalOpt" class="description-row">
                <el-icon>
                    <InfoFilled />
                </el-icon>
                <span>{{ selectedMedicalOpt.description }}</span>
            </div>


            <el-row :gutter="20" style="margin-top: 8px;">
                <el-col :span="12" :xs="24">
                    <el-form-item label="重大傷病策略" style="margin-bottom: 12px;">
                        <el-select v-model="retirement.criticalIllnessCode" placeholder="請選擇儲備水位" style="width: 100%"
                            @change="onCriticalTierSelect">
                            <el-option v-for="item in criticalOptions" :key="item.code" :label="item.label"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="準備金額 (PV)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.criticalIllnessReserve" :min="0" :step="100000"
                            :max="10000000" controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedCriticalOpt" class="description-row">
                <el-icon>
                    <InfoFilled />
                </el-icon>
                <span>{{ selectedCriticalOpt.description }}</span>
            </div>

        </el-form>

        <template #footer>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #606266;">每月現金流需求</span>

                <el-statistic :value="retirement.monthlyMedicalCost">
                    <template #prefix>NT$</template>
                </el-statistic>
            </div>
        </template>

    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { Calendar, InfoFilled } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState, UserRetirement } from './types/user';

// --- 1. 定義 ---
const props = defineProps<{
    metadata: Record<string, any>;
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// --- 2. 初始化 ---
const ensureDefaults = () => {
    if (!userForm.value.retirement) {
        userForm.value.retirement = {} as UserRetirement;
    }
    const target = userForm.value.retirement;

    const defaults: Partial<UserRetirement> = {
        slowGoStartAge: 75,
        defenseTierCode: '',
        monthlyMedicalCost: 0,
        criticalIllnessCode: '',
        criticalIllnessReserve: 200000,
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

// --- 3. 邏輯區 ---

// (A) Timeline
const durationText = computed(() => {
    const start = safeNumber(retirement.value.slowGoStartAge);
    const ltcStart = safeNumber(retirement.value.nogoStartAge);
    const end = ltcStart > 0 ? ltcStart : 80;

    if (end <= start) return '設定異常';

    const isProjected = ltcStart === 0;
    const yearDiff = end - start;
    return `${start} ~ ${end} 歲 (約 ${yearDiff} 年)${isProjected ? '*' : ''}`;
});

// (B) Medical Quality (opt_retirement_slowgo_medical)
const medicalOptions = computed(() => props.metadata?.opt_retirement_slowgo_medical?.list || []);

const selectedMedicalOpt = computed(() => {
    return medicalOptions.value.find((opt: any) => opt.code === retirement.value.defenseTierCode);
});

const onMedicalTierSelect = (code: string) => {
    const opt = medicalOptions.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.monthlyMedicalCost = safeNumber(opt.monthlyBudget);
        triggerSave();
    }
};

// (C) Critical Reserve (opt_slowgo_critical)
const criticalOptions = computed(() => props.metadata?.opt_slowgo_critical?.list || []);

const selectedCriticalOpt = computed(() => {
    return criticalOptions.value.find((opt: any) => opt.code === retirement.value.criticalIllnessCode);
});

const onCriticalTierSelect = (code: string) => {
    const opt = criticalOptions.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.criticalIllnessReserve = safeNumber(opt.amount);
        triggerSave();
    }
};

// --- 工具 ---
function safeNumber(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

function formatMoney(val: number | undefined) {
    return new Intl.NumberFormat('zh-TW').format(safeNumber(val));
}

const getPayload = () => {
    const {
        slowGoStartAge,
        defenseTierCode, monthlyMedicalCost,
        criticalIllnessCode, criticalIllnessReserve
    } = retirement.value;

    return {
        slowGoStartAge,
        defenseTierCode, monthlyMedicalCost,
        criticalIllnessCode, criticalIllnessReserve
    };
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

<style scoped>
.description-row {
    margin-bottom: 20px;
    padding: 10px 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    font-size: 13px;
    color: #606266;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
}

.description-row .el-icon {
    margin-right: 6px;
    margin-top: 3px;
    color: #909399;
}
</style>