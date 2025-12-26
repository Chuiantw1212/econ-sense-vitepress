<template>
    <el-space direction="vertical" fill size="large" style="width: 100%" v-loading="isSubmitting">

        <el-empty v-if="markets.length === 0" description="尚未配置任何市場">
            <el-button type="primary" :icon="Plus" @click="addMarket">新增市場資產</el-button>
        </el-empty>

        <el-card v-for="(item, index) in markets" :key="item.id" shadow="never">
            <el-form label-width="auto">

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <el-icon>
                            <TrendCharts />
                        </el-icon>
                        資產配置 {{ index + 1 }}
                    </span>

                    <el-button type="danger" circle :icon="Delete" @click="removeMarket(index, item)"></el-button>
                </div>

                <el-divider style="margin: 12px 0;" />

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="投資市場">
                            <el-select v-model="item.countryCode" placeholder="請選擇投資市場" style="width: 100%" filterable
                                @change="() => handleMarketChange(item)">
                                <el-option v-for="opt in marketOptions" :key="opt.code" :label="opt.label"
                                    :value="opt.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :xs="24">
                        <el-form-item label="幣別 / 匯率">
                            <div style="display: flex; gap: 8px; width: 100%; align-items: center;">
                                <el-tag type="info" size="default" effect="plain"
                                    style="flex-shrink: 0; min-width: 60px; text-align: center;">
                                    {{ item.currency || '-' }}
                                </el-tag>

                                <el-input-number v-model="item.exchangeRate" :precision="4" style="flex-grow: 1;"
                                    placeholder="自動匯率" disabled :controls="false" />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="市值 (原幣)">
                            <el-input-number v-model="item.marketValue" :min="0" :step="1000" style="width: 100%"
                                controls-position="right" :disabled="!item.currency" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="折合台幣">
                            <el-tag type="info" disable-transitions style="width: 100%; justify-content: start;"
                                :disabled="true">
                                ≈ {{ Math.round(item.marketValue * item.exchangeRate).toLocaleString() }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="年已實現損益">
                            <el-input-number v-model="item.realizedPnl" :step="1000" style="width: 100%"
                                controls-position="right" placeholder="原幣金額" :disabled="!item.currency" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="折合台幣損益">
                            <el-text tag="b" :type="item.realizedPnl >= 0 ? 'danger' : 'success'">
                                {{ item.realizedPnl >= 0 ? '+' : '' }}
                                {{ Math.round(item.realizedPnl * item.exchangeRate).toLocaleString() }}
                            </el-text>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-card>

        <el-button v-if="markets.length > 0" type="primary" plain :icon="Plus"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addMarket">
            新增市場資產
        </el-button>

        <el-alert v-if="markets.length > 0" type="info" :closable="false" show-icon>
            <template #title>
                <div style="display: flex; gap: 20px;">
                    <span>總庫存: NT$ {{ Math.round(summary.totalValue).toLocaleString() }}</span>
                    <span>
                        總損益:
                        <span
                            :style="{ color: summary.totalPnl >= 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
                            {{ summary.totalPnl > 0 ? '+' : '' }}{{ Math.round(summary.totalPnl).toLocaleString() }}
                        </span>
                    </span>
                </div>
            </template>
        </el-alert>

    </el-space>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Delete, TrendCharts } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { UserSecuritiy } from './types/user'
import { MetadataMap } from './types/metadata'
import { useApi } from '@/components/plan/composables/useApi'

const { authFetch } = useApi()

const props = defineProps<{
    metadata: MetadataMap
}>()

// --- 狀態管理 ---
const markets = ref<UserSecuritiy[]>([])
const isSubmitting = ref(false)

const marketOptions = computed(() => {
    return props.metadata?.opt_market?.list || []
})

// --- 業務邏輯 (Function Declaration Style) ---

/**
 * 新增市場 (POST)
 */
async function addMarket() {
    isSubmitting.value = true
    try {
        const response = await authFetch('/api/v1/user/securities', {
            method: 'POST',
        })

        if (response && response.ok) {
            const data = await response.json()
            markets.value.push(data as UserSecuritiy)
            ElMessage.success('新增成功')
        }
    } catch (error) {
        console.error('API Error:', error)
        ElMessage.error('新增失敗')
    } finally {
        isSubmitting.value = false
    }
}

/**
 * 移除市場 (DELETE)
 */
async function removeMarket(index: number, item: UserSecuritiy) {
    if (!item.id) {
        markets.value.splice(index, 1)
        return
    }

    isSubmitting.value = true
    try {
        const response = await authFetch(`/api/v1/user/securities/${item.id}`, {
            method: 'DELETE'
        })

        if (response && response.ok) {
            markets.value.splice(index, 1)
            ElMessage.success('已移除資產')
        }
    } catch (error) {
        console.error('API Error:', error)
        ElMessage.error('刪除失敗')
    } finally {
        isSubmitting.value = false
    }
}

/**
 * 切換市場並更新 (PUT)
 * 當下拉選單改變時，更新前端狀態並同步回傳 Server
 */
async function handleMarketChange(item: UserSecuritiy) {
    const selectedOption = marketOptions.value.find(opt => opt.code === item.countryCode)

    if (selectedOption) {
        // 1. 前端先更新，讓 UI 即時反應
        item.currency = selectedOption.currency
        item.exchangeRate = selectedOption.defaultRate

        // 2. 如果這是一筆已存在的資料 (有 ID)，則發送 PUT 請求同步後端
        if (item.id) {
            try {
                // 注意：PUT 通常需要 body 告訴後端更新後的內容
                await authFetch(`/api/v1/user/securities/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                })

                // 這裡通常不需要 ElMessage.success，以免使用者覺得一直跳通知很煩
            } catch (error) {
                console.error('Update failed:', error)
                ElMessage.error('更新市場資訊失敗')
            }
        }
    }
}

// 總計摘要 (Computed 依舊保持箭頭函式即可，這是 Vue 的慣例)
const summary = computed(() => {
    const totalValue = markets.value.reduce((sum, item) => sum + (item.marketValue * item.exchangeRate), 0)
    const totalPnl = markets.value.reduce((sum, item) => sum + (item.realizedPnl * item.exchangeRate), 0)
    return { totalValue, totalPnl }
})
</script>