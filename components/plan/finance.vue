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
                        {{ marketDefinitions[item.countryCode]?.label.split(' ')[0] }}
                    </span>
                    <el-button type="danger" link :icon="Delete" @click="removeMarket(index)">移除</el-button>
                </div>

                <el-divider style="margin: 12px 0;" />

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="投資市場 (國家)">
                            <el-select v-model="item.countryCode" placeholder="請選擇投資市場" style="width: 100%" filterable
                                @change="() => handleMarketChange(item)">
                                <el-option v-for="(def, code) in marketDefinitions" :key="code"
                                    :label="def.flag + ' ' + def.label" :value="code" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :xs="24">
                        <el-form-item label="幣別 / 匯率">
                            <div style="display: flex; gap: 8px; width: 100%;">
                                <el-tag type="info" size="default" effect="plain" style="flex-shrink: 0;">
                                    {{ item.currency }}
                                </el-tag>

                                <el-input-number v-model="item.exchangeRate" :precision="4" :step="0.1"
                                    controls-position="right" style="flex-grow: 1;" placeholder="匯率" />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="市值 (原幣)">
                            <el-input-number v-model="item.marketValue" :min="0" :step="1000" style="width: 100%"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="折合台幣">
                            <el-tag type="info" disable-transitions style="width: 100%; justify-content: start;">
                                ≈ {{ Math.round(item.marketValue * item.exchangeRate).toLocaleString() }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="年已實現損益">
                            <el-input-number v-model="item.realizedPnl" :step="1000" style="width: 100%"
                                controls-position="right" placeholder="原幣金額" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="折合台幣損益">
                            <el-text tag="b" :type="item.realizedPnl >= 0 ? 'danger' : 'success'"
                                style="font-size: 15px;">
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

    </el-space>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Delete, TrendCharts, Money } from '@element-plus/icons-vue'

// --- 1. 定義市場資料庫 (Master Data) ---
// 這裡定義了國家與幣別/匯率的對應關係
const marketDefinitions: Record<string, { label: string, currency: string, defaultRate: number, flag: string }> = {
    'TW': { label: '台灣 (Taiwan)', currency: 'TWD', defaultRate: 1.0, flag: '🇹🇼' },
    'US': { label: '美國 (USA)', currency: 'USD', defaultRate: 32.5, flag: '🇺🇸' },
    'JP': { label: '日本 (Japan)', currency: 'JPY', defaultRate: 0.21, flag: '🇯🇵' },
    'UK': { label: '英國 (UK)', currency: 'GBP', defaultRate: 41.2, flag: '🇬🇧' },
    'CN': { label: '中國 (China)', currency: 'CNY', defaultRate: 4.5, flag: '🇨🇳' },
    'VN': { label: '越南 (Vietnam)', currency: 'VND', defaultRate: 0.0013, flag: '🇻🇳' },
    'EU': { label: '歐洲 (Euro Zone)', currency: 'EUR', defaultRate: 35.1, flag: '🇪🇺' },
    'HK': { label: '香港 (Hong Kong)', currency: 'HKD', defaultRate: 4.1, flag: '🇭🇰' }
}

// --- 2. 資料結構 ---
interface MarketItem {
    id: number
    countryCode: string // 新增：儲存國家代碼 (key)
    currency: string    // 自動連動
    exchangeRate: number // 自動帶入但可修
    marketValue: number
    realizedPnl: number
}

// --- 3. 響應式狀態 ---
const markets = ref<MarketItem[]>([
    // 預設一筆資料範例
    { id: 1, countryCode: 'US', currency: 'USD', exchangeRate: 32.5, marketValue: 15000, realizedPnl: 500 }
])

let nextId = 2

// --- 4. 業務邏輯 ---

// 新增市場 (預設帶入台灣)
const addMarket = () => {
    const defaultMarket = 'TW'
    markets.value.push({
        id: nextId++,
        countryCode: defaultMarket,
        currency: marketDefinitions[defaultMarket].currency,
        exchangeRate: marketDefinitions[defaultMarket].defaultRate,
        marketValue: 0,
        realizedPnl: 0
    })
}

const removeMarket = (index: number) => {
    markets.value.splice(index, 1)
}

// 關鍵邏輯：當「市場」改變時，連動更新「幣別」與「匯率」
const handleMarketChange = (item: MarketItem) => {
    const def = marketDefinitions[item.countryCode]
    if (def) {
        item.currency = def.currency
        item.exchangeRate = def.defaultRate
    }
}

// 總計摘要
const summary = computed(() => {
    const totalValue = markets.value.reduce((sum, item) => sum + (item.marketValue * item.exchangeRate), 0)
    const totalPnl = markets.value.reduce((sum, item) => sum + (item.realizedPnl * item.exchangeRate), 0)
    return { totalValue, totalPnl }
})
</script>
