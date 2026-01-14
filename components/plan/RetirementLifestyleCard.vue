<template>
    <el-card shadow="never">
        <template #header>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 16px; font-weight: 600; color: #303133;">
                    Step 2: 活躍期支出 (Go-Go Years)
                </span>
                <el-tag type="info" size="small" effect="plain">三支柱模型</el-tag>
            </div>
        </template>

        <el-form label-position="top">

            <div style="margin-bottom: 12px; font-weight: 600; font-size: 14px; color: #606266;">
                1. 居住模式 (Housing)
            </div>

            <el-row :gutter="12">
                <el-col :span="24">
                    <el-form-item label="型態選擇" style="margin-bottom: 12px;">
                        <el-radio-group v-model="retirement.householdType" @change="onHouseholdChange">
                            <el-radio label="single">獨居 (Solo)</el-radio>
                            <el-radio label="couple">共居 (Co-living)</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="14" :xs="24">
                    <el-form-item label="具體方案" style="margin-bottom: 12px;">
                        <el-select v-model="retirement.housingMode" placeholder="請選擇" style="width: 100%"
                            @change="onHousingModeSelect" filterable>
                            <el-option v-for="opt in currentHousingOptions" :key="opt.code" :label="opt.label"
                                :value="opt.code" />
                        </el-select>
                        <div v-if="selectedHousingOpt"
                            style="font-size: 12px; color: #909399; margin-top: 4px; line-height: 1.4;">
                            {{ selectedHousingOpt.description }}
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="10" :xs="24">
                    <el-form-item label="月成本 (NT$)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.housingCost" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div style="margin: 24px 0 12px; font-weight: 600; font-size: 14px; color: #606266;">
                2. 日常健康 (Health Maintenance)
            </div>

            <el-row :gutter="12">
                <el-col :span="14" :xs="24">
                    <el-form-item label="維護等級" style="margin-bottom: 12px;">
                        <el-select v-model="retirement.healthTierCode" placeholder="請選擇" style="width: 100%"
                            @change="onHealthTierSelect">
                            <el-option v-for="item in healthOptions" :key="item.code" :label="item.label"
                                :value="item.code" />
                        </el-select>
                        <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                            * 已自動計入 4% 醫療通膨係數
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="10" :xs="24">
                    <el-form-item label="月成本 (NT$)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.healthCost" :min="0" :step="500" controls-position="right"
                            style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div style="margin: 24px 0 12px; font-weight: 600; font-size: 14px; color: #606266;">
                3. 活躍生活 (Active Living)
            </div>

            <el-row :gutter="12">
                <el-col :span="24">
                    <el-form-item label="參考指標：目前信用卡月均消費" style="margin-bottom: 12px;">
                        <el-input :value="formatMoney(currentCreditCardAvg)" disabled style="width: 100%">
                            <template #prepend>現況</template>
                            <template #append>元/月</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="14" :xs="24">
                    <el-form-item label="預計生活水準 (L-Tier)" style="margin-bottom: 12px;">
                        <el-select v-model="retirement.activeLivingCode" placeholder="請選擇" style="width: 100%"
                            @change="onActiveLivingSelect">
                            <el-option v-for="opt in activeLivingOptions" :key="opt.code"
                                :label="`${opt.code} ${opt.label}`" :value="opt.code" />
                        </el-select>
                        <div v-if="selectedActiveOpt"
                            style="font-size: 12px; color: #909399; margin-top: 4px; line-height: 1.4;">
                            {{ selectedActiveOpt.description }}
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="10" :xs="24">
                    <el-form-item label="月預算 (NT$)" style="margin-bottom: 12px;">
                        <el-input-number v-model="retirement.activeLivingCost" :min="0" :step="1000"
                            controls-position="right" style="width: 100%" @change="triggerSave" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div
                style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #ebeef5; display: flex; justify-content: space-between; align-items: center;">
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
import { computed, watch, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState, UserRetirement } from './types/user';

// --- 1. 定義與設定 (Definitions) ---
const props = defineProps<{
    metadata: Record<string, any>; // 預期包含 opt_* 系列選單
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// --- 2. 資料初始化 (Initialization) ---
const ensureDefaults = () => {
    if (!userForm.value.retirement) {
        userForm.value.retirement = {} as UserRetirement;
    }
    const target = userForm.value.retirement;

    // 定義預設值 (Default State)
    const defaults: Partial<UserRetirement> = {
        householdType: 'single',
        housingMode: '',
        housingCost: 0,
        healthTierCode: '',
        healthCost: 0,
        activeLivingCode: '',
        activeLivingCost: 0
    };

    // 僅在值為 undefined 時補上預設值，避免覆蓋既有資料
    Object.keys(defaults).forEach((key) => {
        const k = key as keyof UserRetirement;
        if (target[k] === undefined) {
            (target[k] as any) = defaults[k];
        }
    });
};

// 立即執行初始化
ensureDefaults();

// 簡寫參照，方便後續存取
const retirement = computed(() => userForm.value.retirement);

// --- 3. 核心邏輯：三大支柱 (Three Pillars Logic) ---

// === Pillar 1: 居住 (Housing) ===
const soloList = computed(() => props.metadata?.opt_housing_solo?.list || []);
const colivingList = computed(() => props.metadata?.opt_housing_coliving?.list || []);

const currentHousingOptions = computed(() => {
    return retirement.value.householdType === 'single' ? soloList.value : colivingList.value;
});

const selectedHousingOpt = computed(() => {
    return currentHousingOptions.value.find((opt: any) => opt.code === retirement.value.housingMode);
});

// 切換獨居/共居 -> 重置方案
const onHouseholdChange = () => {
    retirement.value.housingMode = '';
    retirement.value.housingCost = 0;
    triggerSave();
};

// 選擇方案 -> 自動帶入成本
const onHousingModeSelect = (code: string) => {
    const opt = currentHousingOptions.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.housingCost = safeNumber(opt.monthlyCost);
        triggerSave();
    }
};

// === Pillar 2: 醫療 (Health) ===
const healthOptions = computed(() => props.metadata?.opt_health_tier?.list || []);

// 修正：欄位名稱對應 JSON 的 code 與 monthlyBudget
const onHealthTierSelect = (code: string) => {
    // 1. 改用 o.code 比對
    const opt = healthOptions.value.find((o: any) => o.code === code);

    if (opt) {
        // 2. 改讀取 o.monthlyBudget
        const base = safeNumber(opt.monthlyBudget);

        // 維持 1.04 倍通膨邏輯
        retirement.value.healthCost = Math.round(base * 1.04);
        triggerSave();
    }
};
// === Pillar 3: 活躍生活 (Active Living) ===
const activeLivingOptions = computed(() => props.metadata?.opt_active_living?.list || []);

// 信用卡平均 (參考錨點)
const currentCreditCardAvg = computed(() => {
    const cards = userForm.value.creditCards || [];
    return cards.reduce((sum, card) => sum + safeNumber(card.averageMonthlyExpense), 0);
});

const selectedActiveOpt = computed(() => {
    return activeLivingOptions.value.find((opt: any) => opt.code === retirement.value.activeLivingCode);
});

// 選擇生活水準 -> 自動帶入預算
const onActiveLivingSelect = (code: string) => {
    const opt = activeLivingOptions.value.find((o: any) => o.code === code);
    if (opt) {
        retirement.value.activeLivingCost = safeNumber(opt.monthlyCost);
        triggerSave();
    }
};

// --- 4. 計算與工具 (Calculations & Utils) ---

// 總月支出
const totalMonthlyExpense = computed(() => {
    return safeNumber(retirement.value.housingCost) +
        safeNumber(retirement.value.healthCost) +
        safeNumber(retirement.value.activeLivingCost);
});

// 安全數值轉換 (避免 NaN)
function safeNumber(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

// 金額格式化 (Template 使用)
function formatMoney(val: number | undefined) {
    return new Intl.NumberFormat('zh-TW').format(safeNumber(val));
}

// --- 5. 持久化 (Persistence) ---

// 構建 Payload (只提取本卡片相關欄位，Partial Update)
const getPayload = () => {
    const {
        householdType, housingMode, housingCost,
        healthTierCode, healthCost,
        activeLivingCode, activeLivingCost
    } = retirement.value;

    return {
        householdType,
        housingMode,
        housingCost,
        healthTierCode,
        healthCost,
        activeLivingCode,
        activeLivingCost
    };
};

const saveToServer = async () => {
    try {
        await authFetch('/api/v1/user/retirement', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getPayload())
        });
    } catch (error) {
        console.error('Failed to save retirement lifestyle:', error);
    }
};

const triggerSave = debounce(saveToServer, 800);

// 監聽資料變更自動存檔 (Deep Watch)
// 為了效能，也可以只監聽上述提取的特定欄位，但 Deep Watch 實作最單純
watch(
    () => userForm.value.retirement,
    () => triggerSave(),
    { deep: true }
);

</script>