<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">

        <el-empty v-if="!creditCards || creditCards.length === 0" description="尚未配置信用卡金流">
            <el-button type="primary" :icon="Plus" @click="addCard">
                新增金流配置
            </el-button>
        </el-empty>

        <el-card v-for="(item, index) in creditCards" :key="item.id || `cc-${index}`" shadow="never">
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
                                        <span v-if="opt.desc" style="color: #909399; font-size: 12px;">{{ opt.desc
                                            }}</span>
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

        <el-button v-if="creditCards && creditCards.length > 0" type="primary" plain :icon="Plus"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addCard">
            新增金流配置
        </el-button>

    </el-space>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Delete, CreditCard } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApi } from '@/components/plan/composables/useApi'
import { useUserPlan } from '@/components/plan/composables/useUserPlan'
import type { UserCreditCard } from './types/user'
import type { MetadataMap } from './types/metadata' // OptionItem 移到下方自定義，因為結構特殊

// [新增] 定義符合後端回傳結構的 OptionItem
interface CreditCardOptionItem {
    code: string;
    label: string;
    color?: string;
    desc?: string;
    sort?: number;
    [key: string]: any;
}

// --- Props & Model ---
const props = defineProps<{
    metadata: MetadataMap
}>()

const creditCards = defineModel<UserCreditCard[]>({
    required: true,
    default: []
})

// --- Constants ---
const STORAGE_ICONS: Record<string, string> = {
    wallet: '💳',
    digital: '📲',
    drawer: '🔒'
}

type EpTagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

// --- State & API ---
const { authFetch } = useApi()
const { loggedInUser } = useUserPlan()

const isGuest = computed(() => !loggedInUser.value.uid)

// --- Computed ---
const usageOptions = computed<CreditCardOptionItem[]>(() => {
    // 1. 優先嘗試從後端 Metadata 讀取
    const metaList = props.metadata?.opt_credit_card_usage_type?.list as CreditCardOptionItem[]

    if (metaList && metaList.length > 0) {
        return metaList
    }

    // 2. [修正] 離線 Fallback：使用您提供的真實資料結構
    return [
        { code: "daily", label: "日常生活", color: "success", desc: "超商餐飲、加油等日常開銷", sort: 1 },
        { code: "subscription", label: "固定訂閱", color: "warning", desc: "水電保費、串流等自動扣款", sort: 2 },
        { code: "online", label: "網購/行動支付", color: "primary", desc: "網購平台與行動支付專用", sort: 3 },
        { code: "travel", label: "旅遊/海外", color: "primary", desc: "機票住宿、海外實體消費", sort: 4 },
        { code: "project", label: "專案/代墊", color: "danger", desc: "公司代墊、公務報銷使用", sort: 5 },
        { code: "installment", label: "大額分期", color: "info", desc: "3C家電等零利率分期", sort: 6 },
        { code: "backup", label: "備用/其他", color: "info", desc: "低頻使用或特殊聯名卡", sort: 7 }
    ]
})

const getUsageMeta = (code: string) => {
    // [修正] 改用 code 比對
    const opt = usageOptions.value.find(o => o.code === code)
    return {
        label: opt?.label || code,
        color: (opt?.color as EpTagType) || 'info'
    }
}

const formatCurrency = (val: number) => {
    return val.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 })
}

// --- Actions ---

async function addCard() {
    const currentList = creditCards.value || []

    const newCard: UserCreditCard = {
        id: "",
        name: '新信用卡',
        deductionAccount: '',
        usageType: 'daily', // 對應 options 裡面的 code: 'daily'
        averageMonthlyExpense: 0,
        storageLocation: 'wallet'
    }

    creditCards.value = [...currentList, newCard]

    if (isGuest.value) return

    try {
        const res = await authFetch('/api/v1/user/credit-cards', { method: 'POST' })
        if (res && res.ok) {
            const serverData = await res.json()
            const lastIndex = creditCards.value.length - 1
            if (lastIndex >= 0) {
                Object.assign(creditCards.value[lastIndex], serverData)
            }
        }
    } catch (e) {
        console.warn('新增卡片連線失敗，保留為本地資料', e)
    }
}

async function removeCard(index: number, item: UserCreditCard) {
    try {
        await ElMessageBox.confirm(`確定要刪除「${item.name || '這張卡片'}」嗎？`, '刪除確認', {
            confirmButtonText: '刪除',
            cancelButtonText: '取消',
            type: 'warning'
        })

        const newList = [...creditCards.value]
        newList.splice(index, 1)
        creditCards.value = newList

        if (isGuest.value || !item.id) return

        authFetch(`/api/v1/user/credit-cards/${item.id}`, { method: 'DELETE' })
            .catch(e => console.warn('背景刪除失敗', e))

        ElMessage.success('已移除')

    } catch (action) {
    }
}

async function handleUpdate(item: UserCreditCard) {
    if (isGuest.value || !item.id) return

    try {
        await authFetch(`/api/v1/user/credit-cards/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
    } catch (e) {
        console.warn('更新同步失敗', e)
    }
}
</script>

<style scoped>
:deep(.el-radio-group) {
    width: 100%;
    display: flex;
}

:deep(.el-radio-group .el-radio-button) {
    flex: 1;
}

:deep(.el-radio-group .el-radio-button__inner) {
    width: 100%;
    padding: 8px 15px;
}
</style>