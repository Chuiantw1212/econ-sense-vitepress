<template>
  <el-card shadow="never">
    <el-form label-position="top">
      
      <el-divider content-position="left">居住設定 (Housing)</el-divider>
      
      <el-row :gutter="12">
        <el-col :span="8" :xs="24">
          <el-form-item label="型態">
            <el-radio-group v-model="retirement.householdType" @change="onHouseholdChange" style="width: 100%">
              <el-radio-button label="single" style="width: 50%">獨居</el-radio-button>
              <el-radio-button label="couple" style="width: 50%">共居</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        
        <el-col :span="10" :xs="24">
          <el-form-item label="方案選擇">
            <el-select 
              v-model="retirement.housingMode" 
              placeholder="請選擇" 
              style="width: 100%" 
              filterable
              @change="onHousingModeSelect"
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
          <el-form-item label="月成本">
            <el-input-number 
              v-model="retirement.housingCost" 
              :min="0" :step="1000" 
              controls-position="right" 
              style="width: 100%"
              @change="triggerSave"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-alert
        v-if="selectedHousingOpt"
        :title="selectedHousingOpt.description"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px;"
      />

      <el-divider content-position="left">健康維護 (Health)</el-divider>

      <el-row :gutter="12">
        <el-col :span="16" :xs="24">
          <el-form-item label="維護等級">
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
          <el-form-item label="月成本 (含4%通膨)">
            <el-input-number 
              v-model="retirement.healthCost" 
              :min="0" :step="500" 
              controls-position="right" 
              style="width: 100%"
              @change="triggerSave"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-alert
        v-if="selectedHealthOpt"
        :title="selectedHealthOpt.description"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px;"
      />

      <el-divider content-position="left">活躍生活 (Active Living)</el-divider>

      <el-form-item label="參考指標：目前信用卡月均消費">
         <el-input :value="formatMoney(currentCreditCardAvg)" disabled style="width: 100%">
            <template #prepend>現況</template>
            <template #append>元/月</template>
        </el-input>
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="16" :xs="24">
          <el-form-item label="預計生活水準">
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
          <el-form-item label="月預算">
            <el-input-number 
              v-model="retirement.activeLivingCost" 
              :min="0" :step="1000" 
              controls-position="right" 
              style="width: 100%"
              @change="triggerSave"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-alert
        v-if="selectedActiveOpt"
        :title="selectedActiveOpt.description"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px;"
      />

      <el-divider style="margin: 24px 0 16px 0;" />
      
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <el-text type="info" size="default">每月總現金流需求 (Total Burn)</el-text>
        
        <el-statistic 
          :value="totalMonthlyExpense" 
          :precision="0"
          value-style="color: var(--el-color-danger); font-weight: bold; font-size: 20px; font-family: monospace;"
        >
          <template #prefix>NT$</template>
        </el-statistic>
      </div>

    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
// Icon 自動引入或手動引入皆可，這裡保留手動引入以防萬一
import { InfoFilled } from '@element-plus/icons-vue'; 
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
    // 請確認後端 Controller 是 @PatchMapping("/gogo") 還是 "/go-go"
    // 這裡依照您的原始碼使用 "/go-go" (建議後端也統一為 kebab-case)
    await authFetch('/api/v1/user/retirement/go-go', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getPayload())
    });
  } catch (e) { console.error('Save failed', e); }
}, 800);

watch(() => userForm.value.retirement, () => triggerSave(), { deep: true });
</script>