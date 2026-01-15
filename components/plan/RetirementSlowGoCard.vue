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
                    <el-form-item label="醫療品質分級 (Medical Quality)" style="margin-bottom: 12px;">
                        <el-select v-model="retirement.defenseTierCode" placeholder="請選擇" style="width: 100%"
                            @change="onTierSelect">
                            <el-option v-for="item in tierOptions" :key="item.code" :label="item.label"
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

            <div v-if="selectedTierOpt" class="description-row">
                <el-icon>
                    <InfoFilled />
                </el-icon>
                <span>{{ selectedTierOpt.description }}</span>
            </div>

            <el-row :gutter="20" style="margin-top: 8px;">
                <el-col :span="24">
                    <el-form-item label="重大傷病準備金 (PV)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.criticalIllnessReserve" :min="0" :step="100000"
                            :max="10000000" controls-position="right" style="width: 100%" @change="triggerSave" />
                        <div v-if="retirement.criticalIllnessReserve < 500000"
                            style="font-size: 12px; color: #F56C6C; margin-top: 4px; text-align: right;">
                            建議至少準備 50萬
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <div
                style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ebeef5; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #606266;">每月現金流需求</span>
                <el-statistic :value="retirement.monthlyMedicalCost" :precision="0">
                    <template #prefix>NT$</template>
                </el-statistic>
            </div>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { Calendar, InfoFilled } from '@element-plus/icons-vue';
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

// [修正] 改讀取 opt_medical_slowgo
const tierOptions = computed(() => props.metadata?.opt_retirement_slowgo_medical?.list || []);

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

function formatMoney(val: number | undefined) {
    return new Intl.NumberFormat('zh-TW').format(safeNumber(val));
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