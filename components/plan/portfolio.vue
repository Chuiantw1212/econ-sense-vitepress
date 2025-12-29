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
                                ≈ {{ Math.round(item.marketValue * item.exchangeRate).toLocaleString() }}
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

        <el-button v-if="markets.length > 0" type="primary" plain :icon="Plus"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addMarket">
            新增市場資產
        </el-button>

        <RoiRadarChart :portfolios="markets" />

    </el-space>
</template>

<script setup lang="ts">
import RoiRadarChart from './charts/RoiRadarChart.vue' // 假設路徑
import { ref, computed, watch } from 'vue'
import { Plus, Delete, TrendCharts } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// 引用更新後的 Type
import { UserPortfolio } from './types/user'
import { MetadataMap } from './types/metadata'
import { useApi } from '@/components/plan/composables/useApi'

const { authFetch } = useApi()

// 1. Props 定義更新：加入 portfolios
// 修改 defineProps 部分
const props = withDefaults(defineProps<{
    metadata: MetadataMap,
    modelValue?: UserPortfolio[] // 加個 ? 變成可選，雖然有了預設值其實沒差，但語意較佳
}>(), {
    // 設定預設值為空陣列
    modelValue: () => []
})
// --- 狀態管理 ---

// 2. 初始化 markets
// 使用 props.modelValue 初始化，並建立一個本地副本以免直接修改 props
const markets = ref<UserPortfolio[]>([...(props.modelValue || [])])

// [重要] 監聽 props 變更
// 若父層資料是 API 非同步取得，這個 watch 確保資料載入後 markets 會同步更新
watch(() => props.modelValue, (newVal) => {
    markets.value = [...(newVal || [])]
}, { deep: true })

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
        const response = await authFetch('/api/v1/user/portfolios', {
            method: 'POST',
        })

        if (response && response.ok) {
            const data = await response.json()
            // 3. 型別斷言更新為 UserPortfolio
            markets.value.push(data as UserPortfolio)
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
async function removeMarket(index: number, item: UserPortfolio) {
    // 若沒有 ID (極少見，除非是純前端暫存)，直接移除
    if (!item.id) {
        markets.value.splice(index, 1)
        return
    }

    isSubmitting.value = true
    try {
        const response = await authFetch(`/api/v1/user/portfolios/${item.id}`, {
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
async function handleMarketChange(item: UserPortfolio) {
    const selectedOption = marketOptions.value.find(opt => opt.code === item.countryCode)

    if (selectedOption) {
        // 1. 前端先更新，讓 UI 即時反應
        item.currency = selectedOption.currency
        item.exchangeRate = selectedOption.defaultRate

        // 2. 如果這是一筆已存在的資料 (有 ID)，則發送 PUT 請求同步後端
        if (item.id) {
            try {
                // 注意：PUT 通常需要 body 告訴後端更新後的內容
                await authFetch(`/api/v1/user/portfolios/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                })

                // 靜默更新成功，不跳提示干擾體驗
            } catch (error) {
                console.error('Update failed:', error)
                ElMessage.error('更新市場資訊失敗')
            }
        }
    }
}

// 總計摘要
const summary = computed(() => {
    // 1. 總庫存市值 (TWD) = 原幣市值 * 匯率
    const totalValue = markets.value.reduce((sum, item) => {
        const val = item.marketValue || 0
        const rate = item.exchangeRate || 1 // 防呆
        return sum + (val * rate)
    }, 0)

    // 2. 總損益 (TWD) = 直接加總 (因為用戶輸入的就是台幣)
    const totalPnl = markets.value.reduce((sum, item) => {
        const pnl = item.realizedPnl || 0
        return sum + pnl
    }, 0)

    // 3. 計算本金 = 總市值 - 總損益 (依照您定義的公式)
    // 邏輯：市值 110萬 (含獲利), 獲利 10萬 => 本金 = 100萬
    const principal = totalValue - totalPnl

    // 4. 年報酬率 = 損益 / 本金
    // 防呆：如果本金為 0 (例如剛新增還沒填市值)，報酬率設為 0
    const totalRoi = principal !== 0 ? totalPnl / principal : 0

    return { totalValue, totalPnl, totalRoi }
})
</script>