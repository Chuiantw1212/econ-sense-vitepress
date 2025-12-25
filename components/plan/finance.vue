<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">

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
                    <el-button type="danger" link :icon="Delete" @click="removeMarket(index)">移除</el-button>
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
                                    style="flex-shrink: 0; min-width: 60px; text-align: center;" :disabled="true">
                                    {{ item.currency || '-' }}
                                </el-tag>

                                <el-input-number v-model="item.exchangeRate" :precision="4" :step="0.1"
                                    controls-position="right" style="flex-grow: 1;" placeholder="匯率"
                                    :disabled="!item.currency" />
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

// --- 1. Props 定義 (接軌外部資料) ---
interface MarketOption {
    code: string        // e.g., "US"
    label: string       // e.g., "美國"
    currency: string    // e.g., "USD"
    defaultRate: number // e.g., 32.5
}

interface Metadata {
    opt_market: {
        name: string
        id: string
        list: MarketOption[]
    }
}

const props = defineProps<{
    metadata: Metadata
}>()

// --- 2. 工具函數：自動產生國旗 (無需 CSS/圖片) ---
const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '🌐'
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}

// --- 3. 資料結構 ---
interface MarketItem {
    id: number
    countryCode: string  // 對應 metadata 中的 code
    currency: string     // 連動
    exchangeRate: number // 連動但可修
    marketValue: number
    realizedPnl: number
}

// --- 4. 響應式狀態 ---
// 預設先給一筆資料，若 metadata 尚未載入，則 countryCode 暫留空
const markets = ref<MarketItem[]>([
    { id: 1, countryCode: '', currency: '', exchangeRate: 0, marketValue: 0, realizedPnl: 0 }
])

let nextId = 2

// 取得市場選單列表 (防呆：若父層還沒傳入 metadata 則回傳空陣列)
const marketOptions = computed(() => {
    return props.metadata?.opt_market?.list || []
})

// --- 5. 業務邏輯 ---

const addMarket = () => {
    markets.value.push({
        id: nextId++,
        countryCode: '',
        currency: '',
        exchangeRate: 0,
        marketValue: 0,
        realizedPnl: 0
    })
}

const removeMarket = (index: number) => {
    markets.value.splice(index, 1)
}

// 關鍵邏輯：當「市場」改變時，從 props 查找對應資料並填入
const handleMarketChange = (item: MarketItem) => {
    // 從 props.metadata.opt_market.list 中尋找
    const selectedOption = marketOptions.value.find(opt => opt.code === item.countryCode)

    if (selectedOption) {
        item.currency = selectedOption.currency
        item.exchangeRate = selectedOption.defaultRate
    }
}

// 總計摘要
const summary = computed(() => {
    const totalValue = markets.value.reduce((sum, item) => sum + (item.marketValue * item.exchangeRate), 0)
    const totalPnl = markets.value.reduce((sum, item) => sum + (item.realizedPnl * item.exchangeRate), 0)
    return { totalValue, totalPnl }
})
</script>