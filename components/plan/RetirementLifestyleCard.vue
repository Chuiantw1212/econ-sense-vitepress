<template>
    <el-card shadow="never">
        <template #header>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 18px; font-weight: bold;">Step 1: 退休生活風格</span>
                <el-tag type="danger" effect="plain">剛性支出模型 (2026)</el-tag>
            </div>
        </template>

        <el-form label-position="top">

            <el-divider content-position="left">1. 財務階層與剛性生存底線</el-divider>

            <el-alert v-if="currentTier" :title="`財務定位：${currentTier.label}`" :type="tierAlertLevel" show-icon
                :closable="false" style="margin-bottom: 20px;">
                <div>
                    {{ currentTier.description }}
                </div>
                <div style="margin-top: 8px; display: flex; gap: 8px;">
                    <el-tag size="small" type="danger" effect="dark">剛性保留係數: {{ (currentTier.rigidFactor *
                        100).toFixed(0)
                        }}%</el-tag>
                    <el-tag size="small" type="info" effect="plain">年薪區間: {{ formatMoney(currentTier.rangeMin) }} - {{
                        currentTier.rangeMax ? formatMoney(currentTier.rangeMax) : '∞' }}</el-tag>
                </div>
            </el-alert>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="財務身份 (依年薪自動判斷)">
                        <el-select v-model="localData.tierCode" placeholder="請選擇" style="width: 100%" filterable
                            @change="handleTierChange">
                            <el-option v-for="tier in rigidTiers" :key="tier.code" :label="`${tier.code} ${tier.label}`"
                                :value="tier.code" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="目前真實月開銷 (信用卡平均)">
                        <el-input :value="formatMoney(baseMonthlyExpense)" disabled>
                            <template #suffix>元/月</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24" v-if="currentTier">
                    <div
                        style="margin-bottom: 15px; padding: 10px; background-color: #fcfcfc; border-radius: 4px; border: 1px dashed #dcdfe6;">
                        <div
                            style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; color: #606266;">
                            <span>
                                <el-icon>
                                    <Lock />
                                </el-icon> 剛性生存底線: <b>{{ formatMoney(adjustedBaseExpense) }}</b>
                            </span>
                            <span>
                                <el-icon>
                                    <Sunny />
                                </el-icon> 彈性生活空間: <b>{{ formatMoney(flexibleExpense) }}</b>
                            </span>
                        </div>
                        <el-progress :percentage="currentTier.rigidFactor * 100" :stroke-width="18" text-inside striped
                            :status="tierAlertLevel === 'error' ? 'exception' : (tierAlertLevel === 'warning' ? 'warning' : 'success')">
                            <span>{{ (currentTier.rigidFactor * 100).toFixed(0) }}% 剛性保留 (生存必需)</span>
                        </el-progress>
                        <div style="font-size: 12px; color: #909399; margin-top: 4px; text-align: right;">
                            * 剛性係數越高，代表退休後可削減的開支越少 (抗通膨能力弱)
                        </div>
                    </div>
                </el-col>

                <el-col :span="24">
                    <el-form-item>
                        <template #label>
                            <span>退休剛性生存月費 (Base)</span>
                            <el-tooltip content="計算公式：目前月開銷 × 剛性保留係數。此金額為維持基本生存的最低門檻，不含額外娛樂。" placement="top">
                                <el-icon style="margin-left: 4px; color: #909399; cursor: pointer;">
                                    <InfoFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-input :value="formatMoney(adjustedBaseExpense)" disabled size="large">
                            <template #prepend>計算結果</template>
                            <template #suffix>元/月</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">2. 居住與家庭結構</el-divider>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="家庭結構">
                        <el-radio-group v-model="localData.householdType">
                            <el-radio label="single">單身</el-radio>
                            <el-radio label="couple">雙人</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="居住狀態">
                        <el-select v-model="localData.housingMode" placeholder="請選擇" style="width: 100%">
                            <el-option v-for="opt in housingOptions" :key="opt.code" :label="opt.label"
                                :value="opt.code" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="每月居住現金流 (持有成本/租金)">
                        <el-input-number v-model="localData.housingCost" :min="0" :step="1000" style="width: 100%"
                            controls-position="right" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">3. 活躍生活與圓夢</el-divider>

            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="期望生活風格 (疊加於生存底線之上)">
                        <el-select v-model="localData.lifestyleCode" placeholder="請選擇" style="width: 100%">
                            <el-option v-for="opt in lifestyleOptions" :key="opt.code"
                                :label="`${opt.label} (年預算 ${formatMoney(opt.amount_yearly)})`" :value="opt.code" />
                        </el-select>
                        <el-alert v-if="lifestyleGap > 0"
                            :title="`階層躍升：每年需額外準備 ${formatMoney(lifestyleGap)} 元 (月攤提 ${formatMoney(lifestyleGapMonthly)})`"
                            type="warning" :closable="false" show-icon style="margin-top: 10px;" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div style="margin-top: 30px; background-color: #f5f7fa; padding: 24px; border-radius: 8px;">
                <div style="margin-bottom: 16px; font-size: 14px; color: #606266; font-weight: 500;">
                    活躍期 <b>年度</b> 總需求結構：
                </div>

                <el-row align="middle">
                    <el-col :span="18" :xs="24">
                        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">

                            <div style="font-size: 24px; color: #909399; margin-right: 4px;">(</div>

                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #909399;">剛性生存</div>
                                <div style="font-size: 15px; font-weight: bold; color: #303133;">{{
                                    formatMoney(adjustedBaseExpense) }}</div>
                            </div>

                            <el-icon style="margin: 0 4px;">
                                <Plus />
                            </el-icon>

                            <div style="text-align: center;">
                                <el-tooltip content="活躍期健康維護常數：預防醫學、牙齒與營養補充" placement="top">
                                    <div>
                                        <div style="font-size: 12px; color: #409EFF;">健康維護</div>
                                        <div style="font-size: 15px; font-weight: bold; color: #409EFF;">{{
                                            formatMoney(activeHealthCost) }}</div>
                                    </div>
                                </el-tooltip>
                            </div>

                            <el-icon v-if="singlePenaltyAmount > 0" style="margin: 0 4px;">
                                <Plus />
                            </el-icon>

                            <div v-if="singlePenaltyAmount > 0" style="text-align: center;">
                                <div style="font-size: 12px; color: #F56C6C;">單身加成</div>
                                <div style="font-size: 15px; font-weight: bold; color: #F56C6C;">{{
                                    formatMoney(singlePenaltyAmount) }}</div>
                            </div>

                            <el-icon style="margin: 0 4px;">
                                <Plus />
                            </el-icon>

                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #E6A23C;">居住月費</div>
                                <div style="font-size: 15px; font-weight: bold; color: #303133;">{{
                                    formatMoney(localData.housingCost) }}</div>
                            </div>

                            <el-icon style="margin: 0 4px;">
                                <Plus />
                            </el-icon>

                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #67C23A;">圓夢月攤</div>
                                <div style="font-size: 15px; font-weight: bold; color: #303133;">{{
                                    formatMoney(lifestyleGapMonthly) }}</div>
                            </div>

                            <div style="font-size: 24px; color: #909399; margin-left: 4px;">)</div>

                            <div style="display: flex; align-items: center; margin-left: 8px;">
                                <span style="font-size: 16px; color: #606266; font-weight: bold;">× 12</span>
                                <span style="font-size: 12px; color: #909399; margin-left: 4px;">(月)</span>
                            </div>

                            <div style="margin-left: 12px; font-size: 20px; color: #909399;">=</div>
                        </div>
                    </el-col>

                    <el-col :span="6" :xs="24" style="text-align: right;">
                        <el-statistic :value="totalYearlyDemand"
                            value-style="font-size: 28px; font-weight: bold; color: #409EFF;">
                            <template #title>
                                <span style="font-size: 15px; font-weight: 600;">活躍期年度總支出</span>
                            </template>
                        </el-statistic>
                    </el-col>
                </el-row>
            </div>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { Plus, InfoFilled, Lock, Sunny } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState } from './types/user';
import { RetirementLifestyle } from './types/user';

const { authFetch } = useApi();
const model = defineModel<UserFormState>({ required: true });

const props = defineProps<{
    meta?: any;
    metadata?: any;
}>();

// --- 資料源 ---
const metaSource = computed(() => props.meta || props.metadata || {});

// [更新] 使用 opt_rigid_factor_model
const rigidTiers = computed(() => metaSource.value.opt_rigid_factor_model?.list || []);
const housingOptions = computed(() => metaSource.value.opt_housing_mode?.list || []);
const lifestyleOptions = computed(() => metaSource.value.opt_active_lifestyle?.list || []);

// --- 收入與開銷 ---
const monthlyNetIncome = computed(() => Number(model.value.career?.monthlyNetIncome) || 0);

// [新增] 年薪計算 (用於新模型的級距判斷)
const annualNetIncome = computed(() => monthlyNetIncome.value * 12);

const baseMonthlyExpense = computed(() => {
    const cards = model.value.creditCards;
    let total = 0;
    if (Array.isArray(cards)) {
        total = cards.reduce((sum, card) => sum + (Number(card.averageMonthlyExpense) || 0), 0);
    }
    return total > 0 ? total : 30000;
});

// --- 本地資料 ---
const localData = computed({
    get: () => {
        const defaults: RetirementLifestyle = {
            tierCode: '',
            baseRetentionRate: 0.85, // 仍保留此欄位作為相容，但計算時會優先用 rigidFactor
            householdType: 'single',
            housingMode: 'OWN_HOME_LOAN_FREE',
            housingCost: 0,
            lifestyleCode: 'L2',
        };
        return { ...defaults, ...model.value.retirementLifestyle } as RetirementLifestyle;
    },
    set: (val: RetirementLifestyle) => {
        model.value.retirementLifestyle = val;
    }
});

// --- 邏輯 1: 自動判斷階層 (基於年薪 range) ---
const currentTier = computed(() => {
    // 優先使用已選的 code
    if (localData.value.tierCode) {
        return rigidTiers.value.find((t: any) => t.code === localData.value.tierCode);
    }

    if (!rigidTiers.value.length) return null;
    const income = annualNetIncome.value;

    // [更新] 判斷邏輯：年薪落點
    return rigidTiers.value.find((t: any) => {
        const min = t.rangeMin || 0;
        const max = t.rangeMax;
        if (!max) return income >= min;
        return income >= min && income <= max;
    }) || rigidTiers.value[0];
});

// 自動帶入 tier
watch(() => annualNetIncome.value, () => {
    if (!localData.value.tierCode && currentTier.value) {
        updateTierData(currentTier.value);
    }
}, { immediate: true });

function handleTierChange(code: string) {
    const tier = rigidTiers.value.find((t: any) => t.code === code);
    if (tier) updateTierData(tier);
}

function updateTierData(tier: any) {
    const newData = { ...localData.value };
    newData.tierCode = tier.code;

    // 如果需要將 rigidFactor 存入 baseRetentionRate (做為紀錄)
    if (tier.rigidFactor) {
        newData.baseRetentionRate = tier.rigidFactor;
    }
    localData.value = newData;
}

// --- 邏輯 2: 居住成本連動 ---
const housingMap = computed(() => {
    const map: Record<string, any> = {};
    housingOptions.value.forEach((opt: any) => map[opt.code] = opt);
    return map;
});

watch(
    [() => localData.value.housingMode, () => localData.value.householdType],
    ([newMode, newType], [oldMode, oldType]) => {
        if (!newMode) return;
        const opt = housingMap.value[newMode];
        if (!opt) return;

        const base = opt.amount_monthly || 0;
        const add = (newType === 'couple') ? (opt.amount_couple_add || 0) : 0;
        const suggestedCost = base + add;

        const currentCost = localData.value.housingCost;
        let shouldUpdate = false;

        if (currentCost === 0) shouldUpdate = true;
        else if (newMode !== oldMode) shouldUpdate = true;
        else if (newType !== oldType) shouldUpdate = true;

        if (shouldUpdate) {
            const newData = { ...localData.value };
            newData.housingCost = suggestedCost;
            localData.value = newData;
        }
    },
    { immediate: true }
);

// --- 邏輯 3: 生活風格落差 ---
const lifestyleMap = computed(() => {
    const map: Record<string, any> = {};
    lifestyleOptions.value.forEach((opt: any) => map[opt.code] = opt);
    return map;
});

const selectedLifestyle = computed(() => lifestyleMap.value[localData.value.lifestyleCode]);

// [注意] 這裡暫時維持 L-tier 與 D-tier 的隱含對應，若 rigid model 沒有 implied_tiers 欄位可能需要調整
// 假設 lifestyle options 裡的 implied_tiers 仍對應 "D1"..."D10" code
const impliedLifestyleBudget = computed(() => {
    if (!currentTier.value || !lifestyleOptions.value.length) return 0;
    const implied = lifestyleOptions.value.find((l: any) =>
        l.implied_tiers && l.implied_tiers.includes(currentTier.value.code)
    );
    return implied ? (implied.amount_yearly || 0) : 0;
});

const lifestyleGap = computed(() => {
    const target = selectedLifestyle.value?.amount_yearly || 0;
    const base = impliedLifestyleBudget.value;
    return Math.max(0, target - base);
});

const lifestyleGapMonthly = computed(() => Math.round(lifestyleGap.value / 12));

// --- 邏輯 4: 計算總需求 (基於剛性係數) ---

// 剛性與彈性拆解 (視覺化用)
const flexibleExpense = computed(() => {
    return Math.max(0, baseMonthlyExpense.value - adjustedBaseExpense.value);
});

// 活躍期健康維護常數 ($6700) - 保留此常數
const activeHealthCost = computed(() => 6700);

// [核心修正] 替代後生存月開銷 (Base) = 目前開銷 * 剛性係數
const adjustedBaseExpense = computed(() => {
    let factor = 0.7; // 預設

    if (currentTier.value?.rigidFactor) {
        factor = currentTier.value.rigidFactor;
    } else if (localData.value.baseRetentionRate) {
        // 兼容處理
        factor = localData.value.baseRetentionRate > 2
            ? localData.value.baseRetentionRate / 100
            : localData.value.baseRetentionRate;
    }

    return Math.round(baseMonthlyExpense.value * factor);
});

const singlePenaltyAmount = computed(() => {
    if (localData.value.householdType !== 'single') return 0;
    if (!currentTier.value) return 0;

    const level = parseInt(currentTier.value.code.replace('D', ''));
    if (!isNaN(level) && level <= 5) {
        return Math.round(adjustedBaseExpense.value * 0.15);
    }
    return 0;
});

const totalMonthlyDemand = computed(() => {
    return adjustedBaseExpense.value
        + activeHealthCost.value
        + singlePenaltyAmount.value
        + (localData.value.housingCost || 0)
        + lifestyleGapMonthly.value;
});

const totalYearlyDemand = computed(() => {
    return totalMonthlyDemand.value * 12;
});

// --- UI 輔助 ---
const tierAlertLevel = computed(() => {
    if (!currentTier.value) return 'info';
    const code = currentTier.value.code;
    const level = parseInt(code.replace('D', ''));
    if (level <= 2) return 'error'; // D1-D2 赤字生存
    if (level >= 8) return 'success'; // D8-D10 資產積累
    return 'warning'; // 中產陷阱
});

function formatMoney(val: number | undefined) {
    if (val === undefined || val === null) return '0';
    return Math.round(val).toLocaleString();
}

// --- 自動儲存 ---
const debouncedSave = debounce(async () => {
    try {
        await authFetch('/api/v1/user/retirement-lifestyle', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model.value.retirementLifestyle)
        });
    } catch (e) {
        console.error(e);
    }
}, 800);

watch(() => model.value.retirementLifestyle, (n) => { if (n) debouncedSave(); }, { deep: true });
</script>