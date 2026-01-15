<template>
    <el-card shadow="never">
        <el-form label-position="top">

            <div class="form-block">
                <div class="block-title">
                    <el-icon>
                        <House />
                    </el-icon> 居住設定 (Housing)
                </div>

                <el-row :gutter="12">
                    <el-col :span="8" :xs="24">
                        <el-form-item label="型態">
                            <el-radio-group v-model="retirement.householdType" class="full-width-radio"
                                @change="onHouseholdChange">
                                <el-radio-button label="single">獨居</el-radio-button>
                                <el-radio-button label="couple">共居</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10" :xs="24">
                        <el-form-item label="方案選擇">
                            <el-select v-model="retirement.housingMode" placeholder="請選擇" class="full-width-input"
                                filterable @change="onHousingModeSelect">
                                <el-option v-for="opt in currentHousingOptions" :key="opt.code" :label="opt.label"
                                    :value="opt.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" :xs="24">
                        <el-form-item label="月成本">
                            <el-input-number v-model="retirement.housingCost" :min="0" :step="1000"
                                controls-position="right" class="full-width-input" @change="triggerSave" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <div v-if="selectedHousingOpt" class="block-desc">
                    {{ selectedHousingOpt.description }}
                </div>
            </div>

            <div class="form-block">
                <div class="block-title">
                    <el-icon>
                        <FirstAidKit />
                    </el-icon> 健康維護 (Health)
                </div>

                <el-row :gutter="12">
                    <el-col :span="16" :xs="24">
                        <el-form-item label="維護等級">
                            <el-select v-model="retirement.healthTierCode" placeholder="請選擇等級" class="full-width-input"
                                @change="onHealthTierSelect">
                                <el-option v-for="item in opt_medical_gogo" :key="item.code" :label="item.label"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :xs="24">
                        <el-form-item label="月成本 (含4%通膨)">
                            <el-input-number v-model="retirement.healthCost" :min="0" :step="500"
                                controls-position="right" class="full-width-input" @change="triggerSave" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <div v-if="selectedHealthOpt" class="block-desc">
                    {{ selectedHealthOpt.description }}
                </div>
            </div>

            <div class="form-block no-bottom-margin">
                <div class="block-title">
                    <el-icon>
                        <Coffee />
                    </el-icon> 活躍生活 (Active Living)
                </div>

                <el-form-item label="參考指標：目前信用卡月均消費">
                    <el-input :value="formatMoney(currentCreditCardAvg)" disabled class="full-width-input">
                        <template #prepend>現況</template>
                        <template #append>元/月</template>
                    </el-input>
                </el-form-item>

                <el-row :gutter="12">
                    <el-col :span="16" :xs="24">
                        <el-form-item label="預計生活水準">
                            <el-select v-model="retirement.activeLivingCode" placeholder="請選擇" class="full-width-input"
                                @change="onActiveLivingSelect">
                                <el-option v-for="opt in activeLivingOptions" :key="opt.code"
                                    :label="`${opt.code} ${opt.label}`" :value="opt.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :xs="24">
                        <el-form-item label="月預算">
                            <el-input-number v-model="retirement.activeLivingCost" :min="0" :step="1000"
                                controls-position="right" class="full-width-input" @change="triggerSave" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <div v-if="selectedActiveOpt" class="block-desc">
                    {{ selectedActiveOpt.description }}
                </div>
            </div>

        </el-form>

        <template #footer>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #606266;">每月現金流需求</span>

                <el-statistic :value="totalMonthlyExpense" :precision="0">
                    <template #prefix>NT$</template>
                </el-statistic>
            </div>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
// 引入區塊標題所需的 Icons (注意：已移除 InfoFilled)
import { House, FirstAidKit, Coffee } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState, UserRetirement } from './types/user';

// --- 1. 定義 props 與 model ---
const props = defineProps<{
    metadata: Record<string, any>;
}>();

// 綁定父層傳入的 userForm
const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// --- 2. 資料初始化 (Defaults) ---
const ensureDefaults = () => {
    if (!userForm.value.retirement) {
        userForm.value.retirement = {} as UserRetirement;
    }
    const target = userForm.value.retirement;

    // 設定欄位預設值，避免 UI 存取 undefined
    const defaults: Partial<UserRetirement> = {
        householdType: 'single',
        housingMode: '',
        housingCost: 0,
        healthTierCode: '',
        healthCost: 0,
        activeLivingCode: '',
        activeLivingCost: 0
    };

    Object.keys(defaults).forEach((key) => {
        const k = key as keyof UserRetirement;
        if (target[k] === undefined) {
            (target[k] as any) = defaults[k];
        }
    });
};
// 執行初始化
ensureDefaults();

// 建立捷徑 computed，方便後續存取
const retirement = computed(() => userForm.value.retirement);

// --- 3. 邏輯處理 ---

//Helper: 數字轉換與格式化
function safeNumber(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

function formatMoney(val: any) {
    return new Intl.NumberFormat('zh-TW').format(safeNumber(val));
}

// === Block 1: Housing (居住設定) ===
const soloList = computed(() => props.metadata?.opt_housing_solo?.list || []);
const colivingList = computed(() => props.metadata?.opt_housing_coliving?.list || []);

// 根據家庭型態 (single/couple) 切換對應的選單
const currentHousingOptions = computed(() => {
    return retirement.value.householdType === 'single' ? soloList.value : colivingList.value;
});

// 取得目前選中的方案物件 (用於顯示 Description)
const selectedHousingOpt = computed(() => {
    return currentHousingOptions.value.find((opt: any) => opt.code === retirement.value.housingMode);
});

// 當切換家庭型態時，重置方案與金額
const onHouseholdChange = () => {
    retirement.value.housingMode = '';
    retirement.value.housingCost = 0;
    triggerSave();
};

// 當選擇方案時，自動帶入金額
const onHousingModeSelect = (code: string) => {
    const opt = currentHousingOptions.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.housingCost = safeNumber(opt.monthlyCost);
        triggerSave();
    }
};

// === Block 2: Health (健康維護) ===
const opt_medical_gogo = computed(() => props.metadata?.opt_retirement_gogo_medical?.list || []);

const selectedHealthOpt = computed(() => {
    return opt_medical_gogo.value.find((opt: any) => opt.code === retirement.value.healthTierCode);
});

const onHealthTierSelect = (code: string) => {
    const opt = opt_medical_gogo.value.find((o: any) => o.code === code);
    if (opt) {
        const base = safeNumber(opt.monthlyCost);
        // 邏輯：自動加上 4% 通膨預估 (Base * 1.04)
        retirement.value.healthCost = Math.round(base * 1.04);
        triggerSave();
    }
};

// === Block 3: Active Living (活躍生活) ===
const activeLivingOptions = computed(() => props.metadata?.opt_retirement_gogo_living?.list || []);

// 計算目前信用卡平均消費總和 (作為參考指標)
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
        retirement.value.activeLivingCost = safeNumber(opt.monthlyCost);
        triggerSave();
    }
};

// === Footer: 總計 ===
const totalMonthlyExpense = computed(() => {
    return safeNumber(retirement.value.housingCost) +
        safeNumber(retirement.value.healthCost) +
        safeNumber(retirement.value.activeLivingCost);
});

// --- 4. 存檔邏輯 (Auto Save) ---

// 準備 Payload，只傳送該卡片相關的欄位
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

// Debounce 800ms 防止頻繁打 API
const triggerSave = debounce(async () => {
    try {
        await authFetch('/api/v1/user/retirement/go-go', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getPayload())
        });
    } catch (e) {
        console.error('Auto-save failed:', e);
    }
}, 800);

// 監聽物件變更自動存檔
watch(() => userForm.value.retirement, () => triggerSave(), { deep: true });
</script>

<style scoped>
/* 1. 區塊設計 (Block Design) */
.form-block {
    background-color: var(--el-fill-color-lighter);
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    transition: background-color 0.3s;
}

.form-block.no-bottom-margin {
    margin-bottom: 0;
}

.block-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--el-text-color-primary);
}

.block-title .el-icon {
    font-size: 16px;
}

/* 2. 純文字說明樣式 */
.block-desc {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.6;
}

/* 3. 元件寬度處理 */
.full-width-input {
    width: 100%;
}

.full-width-radio {
    display: flex;
    width: 100%;
}

.full-width-radio :deep(.el-radio-button) {
    flex: 1;
}

.full-width-radio :deep(.el-radio-button__inner) {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
}

/* 4. 底部總結 */
.footer-divider {
    margin: 24px 0 16px 0;
}

.footer-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary-label {
    display: flex;
    flex-direction: column;
}
</style>