<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">
        <el-empty v-if="creditCards.length === 0" description="尚未配置信用卡金流">
            <el-button type="primary" :icon="Plus" :loading="isAdding" @click="addCard">
                新增金流配置
            </el-button>
        </el-empty>

        <el-card v-for="(item, index) in creditCards" :key="item.id" shadow="never">
            <el-form label-position="top">

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <el-icon :size="20">
                            <CreditCard />
                        </el-icon>
                        <span style="font-weight: bold; font-size: 16px;">
                            {{ item.name || `信用卡 ${index + 1}` }}
                        </span>

                        <el-tag v-if="item.usageType" :type="getUsageMeta(item.usageType)?.color || 'info'"
                            effect="light" round size="small">
                            {{ getUsageMeta(item.usageType)?.label || item.usageType }}
                        </el-tag>
                    </div>
                    <el-button type="danger" plain circle :icon="Delete" size="small"
                        @click="removeCard(index, item)" />
                </div>

                <el-divider style="margin: 12px 0;" />

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="卡片名稱">
                            <el-input v-model="item.name" placeholder="例：富邦 J 卡" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="連結扣款帳戶">
                            <el-input v-model="item.deductionAccount" placeholder="例：台新 Richart (薪轉)"
                                @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="主要資金用途">
                            <el-select v-model="item.usageType" placeholder="請選擇" style="width: 100%"
                                @change="handleUpdate(item)">
                                <el-option v-for="opt in usageOptions" :key="opt.code" :label="opt.label"
                                    :value="opt.code">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span>{{ opt.label }}</span>
                                        <span style="color: #909399; font-size: 12px;">{{ opt.desc }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="實體/數位狀態">
                            <el-radio-group v-model="item.storageLocation" style="width: 100%; display: flex;"
                                @change="handleUpdate(item)">
                                <el-radio-button label="wallet" style="flex: 1; text-align: center;">
                                    <el-tooltip content="隨身攜帶 (低摩擦)" placement="top">
                                        <span>{{ STORAGE_ICONS.wallet }} 錢包</span>
                                    </el-tooltip>
                                </el-radio-button>
                                <el-radio-button label="digital" style="flex: 1; text-align: center;">
                                    <el-tooltip content="僅數位綁定 (中摩擦)" placement="top">
                                        <span>{{ STORAGE_ICONS.digital }} 數位</span>
                                    </el-tooltip>
                                </el-radio-button>
                                <el-radio-button label="drawer" style="flex: 1; text-align: center;">
                                    <el-tooltip content="抽屜/保險箱 (高摩擦)" placement="top">
                                        <span>{{ STORAGE_ICONS.drawer }} 抽屜</span>
                                    </el-tooltip>
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="平均月消費">
                            <el-input-number v-model="item.averageMonthlyExpense" :step="1000" style="width: 100%"
                                controls-position="right" placeholder="輸入金額" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="- 年化預估支出">
                            <el-text tag="b" type="info" size="large">
                                {{ formatCurrency((item.averageMonthlyExpense || 0) * 12) }}
                            </el-text>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-card>

        <el-button v-if="creditCards.length > 0" type="primary" plain :icon="Plus" :loading="isAdding"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addCard">
            新增金流配置
        </el-button>

    </el-space>
</template>

<script setup lang="ts">
import { ref, computed, } from 'vue'
import { Plus, Delete, CreditCard } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useApi } from '@/components/plan/composables/useApi'

// --- Interfaces ---
type EpTagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

interface UsageOption {
    code: string;
    label: string;
    color?: EpTagType;
    desc?: string;
}

export interface UserCreditCard {
    id?: string;
    name: string;
    deductionAccount?: string;
    usageType: string;
    averageMonthlyExpense: number;
    storageLocation?: 'wallet' | 'digital' | 'drawer';
}

interface Metadata {
    opt_credit_card_usage_type?: {
        list: UsageOption[];
    };
    [key: string]: any;
}

// --- Constants ---
const STORAGE_ICONS: Record<string, string> = {
    wallet: '💳',
    digital: '📲',
    drawer: '🔒'
}

// --- Props & Model ---
const props = defineProps<{
    metadata: Metadata
}>()

const creditCards = defineModel<UserCreditCard[]>({
    required: true,
    default: []
})

// --- State & API ---
const { authFetch } = useApi()
const isAdding = ref(false)

// --- Computed ---
const usageOptions = computed(() => {
    return props.metadata.opt_credit_card_usage_type?.list || [];
})

const getUsageMeta = (code: string) => {
    return usageOptions.value.find(opt => opt.code === code)
}

const formatCurrency = (val: number) => {
    return val.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 })
}

// --- Actions ---

/**
 * 更新信用卡資訊
 * 呼叫 PUT /api/v1/credit-cards
 */
async function handleUpdate(item: UserCreditCard) {
    if (!item.id) return
    try {
        const res = await authFetch(`/api/v1/user/credit-cards/${item.id}`, {
            method: 'PUT',
            body: item
        })
        if (!res || !res.ok) console.error(`Update failed: ${res?.status}`)
    } catch (e) {
        console.error('Update error:', e)
    }
}

async function addCard() {
    if (isAdding.value) return
    isAdding.value = true
    try {
        const res = await authFetch('/api/v1/user/credit-cards', { method: 'POST' })
        if (!res || !res.ok) throw new Error('Create failed')

        const newCard = await res.json()
        creditCards.value.push(newCard)
        ElMessage.success('已新增信用卡配置')
    } catch (e) {
        console.error(e)
        ElMessage.error('新增失敗')
    } finally {
        isAdding.value = false
    }
}

async function removeCard(index: number, item: UserCreditCard) {
    const confirm = window.confirm(`確定要刪除 ${item.name || '這張卡片'} 嗎？`)
    if (!confirm) return

    try {
        const res = await authFetch(`/api/v1/user/credit-cards/${item.id}`, { method: 'DELETE' })
        if (res && res.ok) {
            creditCards.value.splice(index, 1)
            ElMessage.success('已移除')
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('移除失敗')
    }
}
</script>

<style scoped>
/* 讓 Radio Button 填滿寬度 */
:deep(.el-radio-group) {
    width: 100%;
    display: flex;
}

:deep(.el-radio-group .el-radio-button) {
    flex: 1;
}

:deep(.el-radio-group .el-radio-button__inner) {
    width: 100%;
}
</style>