<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">

        <el-empty v-if="creditCards.length === 0" description="尚未新增信用卡">
            <el-button type="primary" :icon="Plus" :loading="isAdding" @click="addCard">
                新增信用卡
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
                        <el-form-item label="卡片名稱 (別名)">
                            <el-input v-model="item.name" placeholder="例：富邦 J 卡" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="發卡銀行">
                            <el-input v-model="item.bankName" placeholder="例：台北富邦" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="主要資金用途 (Primary Function)">
                            <el-select v-model="item.usageType" placeholder="請選擇金流屬性" style="width: 100%"
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
                        <el-form-item label="信用額度 (Credit Limit)">
                            <el-input-number v-model="item.creditLimit" :step="10000" style="width: 100%"
                                controls-position="right" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8" :xs="12">
                        <el-form-item label="結帳日 (每幾號)">
                            <el-input-number v-model="item.statementDay" :min="1" :max="31" controls-position="right"
                                style="width: 100%" placeholder="日" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="12">
                        <el-form-item label="扣款日 (每幾號)">
                            <el-input-number v-model="item.paymentDay" :min="1" :max="31" controls-position="right"
                                style="width: 100%" placeholder="日" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="24">
                        <el-form-item label="一般回饋率 (%)">
                            <el-input v-model.number="item.rewardRate" type="number" placeholder="2.0"
                                @change="handleUpdate(item)">
                                <template #suffix>%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-card>

        <el-button v-if="creditCards.length > 0" type="primary" plain :icon="Plus" :loading="isAdding"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addCard">
            新增信用卡管理
        </el-button>

    </el-space>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Delete, CreditCard } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useApi } from '@/components/plan/composables/useApi'

// --- Interfaces ---
// 根據您的後端 Metadata 結構定義
interface UsageOption {
    code: string;
    label: string;
    color?: string; // e.g. 'success', 'warning'
    desc?: string;
}

interface UserCreditCard {
    id?: string;
    name: string;
    bankName: string;
    usageType: string; // e.g. 'daily', 'subscription'
    creditLimit: number;
    statementDay: number; // 結帳日
    paymentDay: number;   // 繳款日
    rewardRate: number;
}

interface Metadata {
    opt_credit_card_usage_type?: {
        list: UsageOption[];
    };
    [key: string]: any;
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

// 從 Metadata 解析選項列表
const usageOptions = computed(() => {
    return props.metadata.opt_credit_card_usage_type?.list || []
})

// Helper: 根據 code 找 meta (用於顯示標籤顏色與文字)
const getUsageMeta = (code: string) => {
    return usageOptions.value.find(opt => opt.code === code)
}

// --- Actions ---

async function addCard() {
    if (isAdding.value) return
    isAdding.value = true
    try {
        const res = await authFetch('/api/v1/user/credit-cards', { method: 'POST' })
        if (!res || !res.ok) throw new Error('Create failed')

        const rawData = await res.json()
        // 預設值處理
        const newCard: UserCreditCard = {
            ...rawData,
            name: '',
            creditLimit: 0,
            usageType: '' // 預設為空，強迫用戶選擇
        }

        creditCards.value.push(newCard)
        ElMessage.success('已新增信用卡')
    } catch (e) {
        console.error(e)
        ElMessage.error('新增失敗')
    } finally {
        isAdding.value = false
    }
}

async function handleUpdate(item: UserCreditCard) {
    if (!item.id) return
    try {
        const res = await authFetch(`/api/v1/user/credit-cards/${item.id}`, {
            method: 'PUT',
            body: item
        })
        if (!res || !res.ok) console.error(`Update failed`)
    } catch (e) {
        console.error(e)
    }
}

async function removeCard(index: number, item: UserCreditCard) {
    try {
        await authFetch(`/api/v1/user/credit-cards/${item.id}`, { method: 'DELETE' })
        creditCards.value.splice(index, 1)
        ElMessage.success('已移除信用卡')
    } catch (e) {
        console.error(e)
        ElMessage.error('刪除失敗')
    }
}
</script>

<style scoped>
/* Zero CSS strategy */
</style>