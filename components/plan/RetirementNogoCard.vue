<template>
    <el-card shadow="never" class="no-go-card">
        
        <el-form label-position="top">

            <div class="header-row">
                 <span class="title">1. 定義長照期 (Timeline)</span>
                 <el-tag type="danger" effect="dark" size="small">資金黑洞期</el-tag>
            </div>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="啟動年齡 (No-Go Start)" style="margin-bottom: 12px;">
                        <el-input-number 
                            v-model="retirement.ltcStartAge" 
                            :min="60" 
                            :max="lifeExpectancy - 1" 
                            controls-position="right" 
                            style="width: 100%"
                            @change="triggerSave"
                        />
                    </el-form-item>
                </el-col>
                
                <el-col :span="12" :xs="24">
                    <el-form-item label="預期壽命 (End)" style="margin-bottom: 12px;">
                        <el-input :value="`${lifeExpectancy} 歲`" disabled style="width: 100%">
                            <template #prefix><el-icon><Timer /></el-icon></template>
                            <template #append>預測值</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="description-row danger-bg">
                <el-icon><InfoFilled /></el-icon>
                <span>
                    預計照護期間：<b>{{ careDuration }} 年</b> 
                    <span class="sub-text">(台北市平均不健康生存年數約 8.5 年)</span>
                </span>
            </div>


            <div class="section-header">2. 照顧模式與人力成本</div>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="選擇模式" style="margin-bottom: 12px;">
                        <el-select 
                            v-model="retirement.ltcCareMode" 
                            placeholder="請選擇模式" 
                            style="width: 100%" 
                            @change="onModeSelect"
                        >
                            <el-option 
                                v-for="item in modeOptions" 
                                :key="item.code" 
                                :label="item.label" 
                                :value="item.code" 
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="基本月費 (Base Cost)" style="margin-bottom: 12px;">
                        <el-input-number 
                            v-model="retirement.ltcMonthlyCost" 
                            :min="0" :step="1000" 
                            controls-position="right" 
                            style="width: 100%"
                            @change="triggerSave"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <div v-if="selectedModeOpt" class="description-row">
                <el-icon><InfoFilled /></el-icon>
                <span>{{ selectedModeOpt.description }}</span>
            </div>


            <div class="section-header">3. 隱形開銷與補助</div>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="月雜支 (耗材/食宿)" style="margin-bottom: 12px;">
                        <el-input-number 
                            v-model="retirement.ltcMonthlySupplies" 
                            :min="0" :step="1000" 
                            controls-position="right" 
                            style="width: 100%"
                            @change="triggerSave"
                        />
                        <div v-if="retirement.ltcMonthlySupplies < 12000" class="warning-text">
                            * [cite_start]111年調查顯示平均雜支約 $1.2萬，過低可能低估尿布/管路費 [cite: 132-137]
                        </div>
                    </el-form-item>
                </el-col>
                
                <el-col :span="12" :xs="24">
                    <el-form-item label="政府補助 (扣減)" style="margin-bottom: 12px;">
                        <el-input-number 
                            v-model="retirement.ltcSubsidy" 
                            :min="0" :step="1000" 
                            controls-position="right" 
                            style="width: 100%"
                            @change="triggerSave"
                        />
                        <div class="hint-text">
                            * [cite_start]機構補助約$1萬，一般外看無補助 [cite: 158]
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>

        <template #footer>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 14px; color: #606266; font-weight: 500;">No-Go 每月淨開銷</span>
                    <span style="font-size: 11px; color: #909399;">(月費 + 雜支 - 補助)</span>
                </div>
                
                <el-statistic 
                    :value="netMonthlyBurn" 
                    :value-style="{ color: '#F56C6C', fontWeight: 'bold', fontSize: '24px' }"
                >
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

// --- 1. 定義與設定 ---
const props = defineProps<{
    metadata: Record<string, any>; // 預期包含 opt_retirement_ltc_mode
    lifeExpectancy: number;        // 來自 UserLaborInsurance 的預測值
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// --- 2. 初始化與預設值 ---
const ensureDefaults = () => {
    if (!userForm.value.retirement) {
        userForm.value.retirement = {} as UserRetirement;
    }
    const target = userForm.value.retirement;
    
    // 預設值參考 2026 台北精算報告：
    // 雜支 15000 (含尿布、營養品、管路費、食宿差額)
    const defaults: Partial<UserRetirement> = {
        ltcStartAge: 80,
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

// --- 3. 邏輯區 ---

// (A) Timeline Duration
const careDuration = computed(() => {
    const start = safeNumber(retirement.value.ltcStartAge);
    const end = safeNumber(props.lifeExpectancy);
    const duration = end - start;
    return duration > 0 ? duration : 0;
});

// (B) Care Mode Selection
const modeOptions = computed(() => props.metadata?.opt_retirement_ltc_mode?.list || []);

const selectedModeOpt = computed(() => {
    return modeOptions.value.find((opt: any) => opt.code === retirement.value.ltcCareMode);
});

const onModeSelect = (code: string) => {
    const opt = modeOptions.value.find((o: any) => o.code === code);
    if (opt) {
        // 自動帶入三個關鍵欄位
        retirement.value.ltcMonthlyCost = safeNumber(opt.monthlyCost);
        retirement.value.ltcMonthlySupplies = safeNumber(opt.defaultSupplies);
        retirement.value.ltcSubsidy = safeNumber(opt.defaultSubsidy);
        triggerSave();
    }
};

// (C) Net Monthly Burn Formula
// 公式：(月費 + 雜支) - 補助
const netMonthlyBurn = computed(() => {
    const cost = safeNumber(retirement.value.ltcMonthlyCost);
    const supplies = safeNumber(retirement.value.ltcMonthlySupplies);
    const subsidy = safeNumber(retirement.value.ltcSubsidy);
    
    const total = cost + supplies - subsidy;
    return total > 0 ? total : 0;
});

// --- 工具 ---
function safeNumber(val: any): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

const getPayload = () => {
    const { 
        ltcStartAge, ltcCareMode, 
        ltcMonthlyCost, ltcMonthlySupplies, ltcSubsidy 
    } = retirement.value;

    return { 
        ltcStartAge, ltcCareMode, 
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
    font-size: 14px; font-weight: 600; color: #303133;
}
.section-header {
    font-size: 14px; font-weight: 600; color: #303133; 
    margin: 24px 0 12px 0;
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

/* Danger Style for No-Go Phase */
.danger-bg {
    background-color: #fef0f0; /* Light Red */
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

/* Warning & Hints */
.warning-text {
    font-size: 11px; 
    color: #E6A23C; /* Warning Orange */
    margin-top: 4px; 
    text-align: right;
    line-height: 1.4;
}
.hint-text {
    font-size: 11px; 
    color: #909399; 
    margin-top: 4px; 
    text-align: right;
}
</style>