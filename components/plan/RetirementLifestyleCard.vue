<template>
    <el-card shadow="never">
        <!-- <template #header>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 16px; font-weight: 600; color: #303133;">
                    Step 2: 活躍期支出 (Go-Go Years)
                </span>
                <el-tag type="info" size="small" effect="plain">三支柱模型</el-tag>
            </div>
        </template> -->

        <el-form label-position="top">

            <el-divider>居住模式</el-divider>
            
            <el-row :gutter="12">
                <el-col :span="8" :xs="24">
                    <el-form-item label="型態" style="margin-bottom: 0;">
                        <el-radio-group v-model="retirement.householdType" @change="onHouseholdChange">
                            <el-radio-button label="single">獨居</el-radio-button>
                            <el-radio-button label="couple">共居</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                
                <el-col :span="10" :xs="24">
                    <el-form-item label="方案選擇" style="margin-bottom: 0;">
                        <el-select 
                            v-model="retirement.housingMode" 
                            placeholder="請選擇" 
                            style="width: 100%" 
                            @change="onHousingModeSelect"
                            filterable
                        >
                            <el-option 
                                v-for="opt in currentHousingOptions" 
                                :key="opt.code" 
                                :label="opt.label" 
                                :value="opt.code" 
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6" :xs="24">
                    <el-form-item label="月成本" style="margin-bottom: 0;">
                        <el-input-number 
                            v-model="retirement.housingCost" 
                            :min="0" :step="1000" controls-position="right" style="width: 100%"
                            @change="triggerSave"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedHousingOpt" class="description-row">
                <el-icon style="margin-right: 4px; position: relative; top: 2px;"><InfoFilled /></el-icon>
                {{ selectedHousingOpt.description }}
            </div>


            <el-divider>日常健康</el-divider>

            <el-row :gutter="12">
                <el-col :span="16" :xs="24">
                    <el-form-item label="維護等級" style="margin-bottom: 0;">
                        <el-select 
                            v-model="retirement.healthTierCode" 
                            placeholder="請選擇等級" 
                            style="width: 100%" 
                            @change="onHealthTierSelect"
                        >
                            <el-option 
                                v-for="item in opt_medical_gogo" 
                                :key="item.code" 
                                :label="item.label" 
                                :value="item.code" 
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :xs="24">
                    <el-form-item label="月成本 (含4%通膨)" style="margin-bottom: 0;">
                        <el-input-number 
                            v-model="retirement.healthCost" 
                            :min="0" :step="500" controls-position="right" style="width: 100%"
                            @change="triggerSave"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedHealthOpt" class="description-row">
                <el-icon style="margin-right: 4px; position: relative; top: 2px;"><InfoFilled /></el-icon>
                {{ selectedHealthOpt.description }}
            </div>


            <el-divider>活躍生活</el-divider>

            <el-form-item label="參考指標：目前信用卡月均消費" style="margin-bottom: 12px;">
                 <el-input :value="formatMoney(currentCreditCardAvg)" disabled style="width: 100%">
                    <template #prepend>現況</template>
                    <template #append>元/月</template>
                </el-input>
            </el-form-item>

            <el-row :gutter="12">
                <el-col :span="16" :xs="24">
                    <el-form-item label="預計生活水準" style="margin-bottom: 0;">
                        <el-select 
                            v-model="retirement.activeLivingCode" 
                            placeholder="請選擇" 
                            style="width: 100%" 
                            @change="onActiveLivingSelect"
                        >
                            <el-option 
                                v-for="opt in activeLivingOptions" 
                                :key="opt.code" 
                                :label="`${opt.code} ${opt.label}`" 
                                :value="opt.code" 
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :xs="24">
                    <el-form-item label="月預算" style="margin-bottom: 0;">
                        <el-input-number 
                            v-model="retirement.activeLivingCost" 
                            :min="0" :step="1000" controls-position="right" style="width: 100%"
                            @change="triggerSave"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedActiveOpt" class="description-row">
                <el-icon style="margin-right: 4px; position: relative; top: 2px;"><InfoFilled /></el-icon>
                {{ selectedActiveOpt.description }}
            </div>


            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #ebeef5; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #606266; font-weight: 500;">
                    每月總現金流需求 (Total Burn)
                </span>
                <span style="font-size: 20px; font-weight: 700; color: #F56C6C; font-family: monospace;">
                    NT$ {{ formatMoney(totalMonthlyExpense) }}
                </span>
            </div>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { InfoFilled } from '@element-plus/icons-vue'; // 引入 icon
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState, UserRetirement } from './types/user';

// --- 1. 定義與設定 ---
const props = defineProps<{
    metadata: Record<string, any>;
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// --- 2. 資料初始化 ---
const ensureDefaults = () => {
    if (!userForm.value.retirement) {
        userForm.value.retirement = {} as UserRetirement;
    }
    const target = userForm.value.retirement;
    
    const defaults: Partial<UserRetirement> = {
        householdType: 'single', housingMode: '', housingCost: 0,
        healthTierCode: '', healthCost: 0,
        activeLivingCode: '', activeLivingCost: 0
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

// === Housing ===
const soloList = computed(() => props.metadata?.opt_housing_solo?.list || []);
const colivingList = computed(() => props.metadata?.opt_housing_coliving?.list || []);

const currentHousingOptions = computed(() => {
    return retirement.value.householdType === 'single' ? soloList.value : colivingList.value;
});

const selectedHousingOpt = computed(() => {
    return currentHousingOptions.value.find((opt: any) => opt.code === retirement.value.housingMode);
});

const onHouseholdChange = () => {
    retirement.value.housingMode = '';
    retirement.value.housingCost = 0;
    triggerSave();
};

const onHousingModeSelect = (code: string) => {
    const opt = currentHousingOptions.value.find((o: any) => o.code === code);
    if (opt) {
        // 通常是 monthlyCost
        retirement.value.housingCost = safeNumber(opt.monthlyCost);
        triggerSave();
    }
};

// === Health ===
const opt_medical_gogo = computed(() => props.metadata?.opt_medical_gogo?.list || []);

// 新增：為了顯示 Description，我們需要計算出當前選中的 Health Object
const selectedHealthOpt = computed(() => {
    return opt_medical_gogo.value.find((opt: any) => opt.code === retirement.value.healthTierCode);
});

const onHealthTierSelect = (code: string) => {
    const opt = opt_medical_gogo.value.find((o: any) => o.code === code);
    if (opt) {
        // 依照您提供的 JSON，欄位是 monthlyCost
        const base = safeNumber(opt.monthlyCost);
        retirement.value.healthCost = Math.round(base * 1.04);
        triggerSave();
    }
};

// === Active Living ===
const activeLivingOptions = computed(() => props.metadata?.opt_active_living?.list || []);

const currentCreditCardAvg = computed(() => {
    const cards = userForm.value.creditCards || [];
    return cards.reduce((sum, card) => sum + safeNumber(card.averageMonthlyExpense), 0);
});

const selectedActiveOpt = computed(() => {
    return activeLivingOptions.value.find((opt: any) => opt.code === retirement.value.activeLivingCode);
});

const onActiveLivingSelect = (code: string) => {
    const opt = activeLivingOptions.value.find((o: any) => o.code === code);
    if (opt) {
        // 通常是 monthlyCost
        retirement.value.activeLivingCost = safeNumber(opt.monthlyCost);
        triggerSave();
    }
};

// --- 工具與存檔 ---
const totalMonthlyExpense = computed(() => {
    return safeNumber(retirement.value.housingCost) + 
           safeNumber(retirement.value.healthCost) + 
           safeNumber(retirement.value.activeLivingCost);
});

function safeNumber(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

function formatMoney(val: number | undefined) {
    return new Intl.NumberFormat('zh-TW').format(safeNumber(val));
}

const getPayload = () => {
    const { 
        householdType, housingMode, housingCost,
        healthTierCode, healthCost,
        activeLivingCode, activeLivingCost
    } = retirement.value;

    return {
        householdType, housingMode, housingCost,
        healthTierCode, healthCost,
        activeLivingCode, activeLivingCost
    };
};

const triggerSave = debounce(async () => {
    try {
        await authFetch('/api/v1/user/retirement/gogo', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getPayload())
        });
    } catch (e) { console.error('Save failed', e); }
}, 800);

watch(() => userForm.value.retirement, () => triggerSave(), { deep: true });
</script>

<style scoped>
.section-title {
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 14px;
    color: #606266;
}

.description-row {
    margin-top: 8px;
    padding: 10px 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-size: 13px;
    color: #606266;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
}
</style>