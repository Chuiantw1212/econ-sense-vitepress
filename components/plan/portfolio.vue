<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">


        <el-empty v-if="!markets || markets.length === 0" description="尚未配置任何市場">
            <el-button type="primary" :icon="Plus" @click="addMarket">新增市場資產</el-button>
        </el-empty>

        <el-card v-for="(item, index) in markets" :key="item.id || `temp-${index}`" shadow="never">
            <el-form label-width="auto">

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <el-icon>
                            <TrendCharts />
                        </el-icon>
                        資產配置 {{ index + 1 }}

                        <el-tag v-if="!item.id" size="small" type="warning" effect="plain" round>
                            {{ isGuest ? '離線試算' : '未同步' }}
                        </el-tag>
                    </span>

                    <el-button type="danger" plain circle :icon="Delete" @click="removeMarket(index, item)"></el-button>
                </div>

                <el-divider style="margin: 12px 0;" />

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="投資市場">
                            <el-select v-model="item.countryCode" placeholder="請選擇投資市場" style="width: 100%" filterable
                                @change="handleMarketChange(item)">
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
                                controls-position="right" :disabled="!item.currency"
                                @change="handleMarketChange(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="市值折合台幣">
                            <el-tag type="info" disable-transitions style="width: 100%; justify-content: start;"
                                :disabled="true">
                                ≈ {{ Math.round((item.marketValue || 0) * (item.exchangeRate || 0)).toLocaleString() }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="年已實現損益(台幣)">
                            <el-input-number v-model="item.realizedPnl" :step="1000" style="width: 100%"
                                controls-position="right" placeholder="原幣金額" :disabled="!item.currency"
                                @change="handleMarketChange(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                    </el-col>
                </el-row>

            </el-form>
        </el-card>

        <el-button v-if="markets && markets.length > 0" type="primary" plain :icon="Plus"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addMarket">
            新增市場資產
        </el-button>

        <RoiRadarChart v-if="markets && markets.length > 0" :portfolios="markets" />

    </el-space>
</template>

<script setup lang="ts">
import RoiRadarChart from './charts/RoiRadarChart.vue'
import { computed } from 'vue'
import { Plus, Delete, TrendCharts } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UserPortfolio } from './types/user'
import type { MetadataMap } from './types/metadata'
import { useApi } from '@/components/plan/composables/useApi'
import { useUserPlan } from '@/components/plan/composables/useUserPlan'

const { authFetch } = useApi()
const { loggedInUser } = useUserPlan()

const props = defineProps<{
    metadata: MetadataMap
}>()

// [核心] 雙向綁定 (使用 defineModel)
// 確保預設值為空陣列，避免父層傳入 undefined 時報錯
const markets = defineModel<UserPortfolio[]>({ required: true, default: [] })

const marketOptions = computed(() => {
    return props.metadata?.opt_market?.list || []
})

// 判斷是否為訪客 (未登入)
const isGuest = computed(() => !loggedInUser.value.uid)

// --- 業務邏輯 (樂觀更新 + 離線支援) ---

/**
 * 新增市場
 */
async function addMarket() {
    // 1. [防呆] 確保本地陣列已初始化
    // 這裡使用 currentMarkets 暫存，避免直接操作可能的 undefined
    const currentMarkets = markets.value || []

    const newItem: UserPortfolio = {
        id: "", // 初始無 ID
        countryCode: '',
        currency: '',
        exchangeRate: 1,
        marketValue: 0,
        realizedPnl: 0
    }

    // 2. [強制渲染] 使用「展開運算符 (...)」重新賦值
    // 這能解決 defineModel 在某些情況下 .push() 無法觸發畫面更新的問題
    markets.value = [...currentMarkets, newItem]

    // 3. [訪客攔截] 如果是訪客，到此為止，不發 API
    if (isGuest.value) {
        return
    }

    // 4. [背景同步] 會員則嘗試建立後端資料
    try {
        const response = await authFetch('/api/v1/user/portfolios', {
            method: 'POST',
        })

        if (response && response.ok) {
            const data = await response.json()

            // 找到剛剛新增的那一筆 (最後一筆)，更新其 ID
            // 注意：要重新讀取 markets.value，因為指標可能變了
            const lastIndex = markets.value.length - 1
            if (lastIndex >= 0) {
                // 使用 Object.assign 原地更新屬性，Vue 會偵測到屬性變更
                Object.assign(markets.value[lastIndex], data)
            }
        }
    } catch (error) {
        console.warn('新增資產連線失敗，僅保留本地資料', error)
        // 失敗了也不報錯，讓用戶繼續當離線版用
    }
}

/**
 * 移除市場
 */
async function removeMarket(index: number, item: UserPortfolio) {
    // 1. [UI 優先] 立即更新畫面 (同樣使用重新賦值確保響應性)
    const newList = [...markets.value]
    newList.splice(index, 1)
    markets.value = newList

    // 2. [訪客/離線攔截]
    if (isGuest.value || !item.id) {
        return
    }

    // 3. [背景同步]
    try {
        authFetch(`/api/v1/user/portfolios/${item.id}`, {
            method: 'DELETE'
        }).catch(e => console.warn('背景刪除失敗', e))

        ElMessage.success('已移除資產')
    } catch (error) {
        console.warn('API Error:', error)
    }
}

/**
 * 更新市場 (欄位變更時觸發)
 */
async function handleMarketChange(item: UserPortfolio) {
    // 1. 連動匯率邏輯
    const selectedOption = marketOptions.value.find(opt => opt.code === item.countryCode)
    if (selectedOption) {
        item.currency = selectedOption.currency
        // 只有匯率為 1 (預設值) 或切換幣別時才重置，保留用戶微調空間
        // 這裡採取強制連動策略，視需求可調整
        item.exchangeRate = selectedOption.defaultRate
    }

    // 2. [訪客/離線攔截]
    if (isGuest.value || !item.id) {
        return
    }

    // 3. [背景同步]
    try {
        await authFetch(`/api/v1/user/portfolios/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: item
        })
    } catch (error) {
        console.warn('更新同步失敗', error)
    }
}
</script>