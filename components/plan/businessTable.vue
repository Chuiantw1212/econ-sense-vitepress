<template>
    <div class="business-table-container">

        <CostEfficiencyMatrix :metadata="metadata"></CostEfficiencyMatrix>

        <div style="height: 24px;"></div>

        <el-card v-loading="loading">
            <template v-if="pageData.list && pageData.list.length > 0">

                <el-table :data="pageData.list" style="width: 100%" stripe show-overflow-tooltip
                    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">

                    <el-table-column type="index" :index="indexMethod" label="#" width="60" align="center" />

                    <el-table-column label="名稱" prop="name" width="120" show-overflow-tooltip>
                        <template #default="{ row }">
                            <div class="font-medium text-gray-800 truncate-text">{{ row.name }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="投入成本" align="right" min-width="110" class-name="hidden-xs-only">
                        <template #default="{ row }">
                            {{ formatNumber(row.acquisitionCost) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="月淨現金流" align="right" min-width="110">
                        <template #default="{ row }">
                            <span :class="getNetCashFlow(row) >= 0 ? 'text-success' : 'text-danger'"
                                class="font-mono font-bold">
                                {{ formatNumber(getNetCashFlow(row)) }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="IRR" align="right" min-width="90">
                        <template #default="{ row }">
                            <span :class="getRateColor(row.irr)" class="font-mono font-bold">
                                {{ row.irr || '-' }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="150" align="center">
                        <template #default="{ row }">
                            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">
                                編輯
                            </el-button>
                            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">
                                刪除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-container">
                    <el-pagination :current-page="pageData.currentPage" :page-size="pageData.pageSize"
                        :total="pageData.total" :page-sizes="[5, 10, 20, 50]" :background="true"
                        layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </template>

            <template v-else>
                <el-empty description="暫無商業或副業資產">
                    <el-button type="primary" :icon="Plus" @click="handleCreate">立即新增</el-button>
                </el-empty>
            </template>
        </el-card>

        <div style="height: 24px;"></div>

        <el-button type="primary" plain :icon="Plus" style="width: 100%; border-style: dashed;" @click="handleCreate">
            新增資產項目
        </el-button>

        <el-dialog v-model="dialogVisible" :title="isEdit ? '編輯資產項目' : '新增資產項目'" width="600px" destroy-on-close
            align-center append-to-body :close-on-click-modal="false">
            <BusinessDialogForm ref="formComponentRef" v-model="currentBusiness" :metadata="metadata" />

            <template #footer>
                <div class="flex justify-end gap-2">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="submitting" @click="handleSubmit">
                        確認儲存
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MetadataMap } from './types/metadata'
import { useApi } from '@/components/plan/composables/useApi'
import type { UserBusiness } from './types/user'
import type { PaginatedResponse } from './types/util'
import BusinessDialogForm from './businessDialogForm.vue'
import CostEfficiencyMatrix from './charts/CostEfficiencyMatrix.vue'

const { authFetch } = useApi()

// ==========================================
// 1. 資料模型 (v-model)
// ==========================================
// 定義 model，這代表 pageData 是雙向綁定的
// 父層傳進來初始值，子層可以直接修改 pageData.value，父層會同步收到更新
const pageData = defineModel<PaginatedResponse<UserBusiness>>({
    required: true,
    default: () => ({ list: [], total: 0, currentPage: 1, pageSize: 10, totalPages: 0 })
})
const props = withDefaults(defineProps<{
    metadata: MetadataMap,
}>(), {
    metadata: () => ({})
})

// Loading 狀態 (子層自己控制讀取動畫)
const loading = ref(false)

// ==========================================
// 2. 狀態管理
// ==========================================
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formComponentRef = ref<InstanceType<typeof BusinessDialogForm>>()

const createDefaultBusiness = (): UserBusiness => ({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    projectYears: 5,
    taxCategory: 'exempt',
    acquisitionCost: 0,
    incomeMode: 'monthly',
    totalAccumulatedIncome: 0,
    monthlyIncome: 0,
    monthlyCost: 0,
    loanAmount: 0,
    loanInterestRate: 0,
    roi: '-',
    irr: '-'
})

const currentBusiness = reactive<UserBusiness>(createDefaultBusiness())

// ==========================================
// 3. 核心功能：子層主動更新資料
// ==========================================

// 這個 function 用來去後端抓最新的資料，並更新給父層
const refreshData = async (targetPage?: number, targetSize?: number) => {
    loading.value = true
    try {
        // 使用傳入的參數，或當前的 pageData 參數
        const currentPage = targetPage || pageData.value.currentPage
        const pageSize = targetSize || pageData.value.pageSize

        const res = await authFetch('/api/v1/user/businesses', {
            method: 'GET',
            params: {
                currentPage,
                pageSize,
                keyword: '設備', // 若有搜尋關鍵字，也能輕鬆加入，不用擔心 & 符號
                isActive: true   // boolean 也會自動轉字串
            }
        })

        if (res && res.ok) {
            const newData = await res.json()
            // 【關鍵】直接更新 model，父層資料會同步變更
            pageData.value = newData
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('資料更新失敗')
    } finally {
        loading.value = false
    }
}

// ==========================================
// 4. 計算邏輯
// ==========================================
const indexMethod = (index: number) => {
    const { currentPage, pageSize } = pageData.value
    return (currentPage - 1) * pageSize + index + 1
}

const getNetCashFlow = (item: UserBusiness) => {
    const income = item.monthlyIncome || 0
    const cost = item.monthlyCost || 0
    const interest = Math.round((item.loanAmount || 0) * (item.loanInterestRate || 0) / 100 / 12)
    return income - cost - interest
}

// ==========================================
// 5. 分頁操作
// ==========================================
const handleSizeChange = (val: number) => {
    // 切換筆數，回到第一頁，並更新資料
    refreshData(1, val)
}

const handleCurrentChange = (val: number) => {
    // 切換頁碼，更新資料
    refreshData(val, pageData.value.pageSize)
}

// ==========================================
// 6. CRUD 操作
// ==========================================
const handleCreate = () => {
    isEdit.value = false
    Object.assign(currentBusiness, createDefaultBusiness())
    dialogVisible.value = true
    nextTick(() => formComponentRef.value?.clearValidate())
}

const handleEdit = (row: UserBusiness) => {
    isEdit.value = true
    Object.assign(currentBusiness, JSON.parse(JSON.stringify(row)))
    dialogVisible.value = true
    nextTick(() => formComponentRef.value?.clearValidate())
}

const handleDelete = (row: UserBusiness) => {
    ElMessageBox.confirm(`確定刪除「${row.name}」嗎？`, '警告', {
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        if (!row.id) return
        try {
            await authFetch(`/api/v1/user/businesses/${row.id}`, { method: 'DELETE' })
            ElMessage.success('已刪除')

            // 刪除成功後，子層自己去抓新的資料並 update 給父層
            // 優化：若該頁剩一筆被刪掉且非第一頁，往前跳一頁
            let targetPage = pageData.value.currentPage
            if (pageData.value.list.length === 1 && targetPage > 1) {
                targetPage--
            }
            refreshData(targetPage)
        } catch (e) {
            ElMessage.error('刪除失敗')
        }
    }).catch(() => { })
}

const handleSubmit = async () => {
    const isValid = await formComponentRef.value?.validate()
    if (!isValid) return

    submitting.value = true
    try {
        const method = isEdit.value ? 'PUT' : 'POST'
        const url = isEdit.value
            ? `/api/v1/user/businesses/${currentBusiness.id}`
            : `/api/v1/user/businesses`

        const res = await authFetch(url, {
            method,
            body: currentBusiness
        })

        if (res && res.ok) {
            ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
            dialogVisible.value = false
            // 儲存成功，更新資料
            refreshData()
        } else {
            throw new Error('API Error')
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('儲存失敗')
    } finally {
        submitting.value = false
    }
}

// ==========================================
// 7. Helpers
// ==========================================
const formatNumber = (val: number) => val?.toLocaleString() || '0'

const getRateColor = (val?: string) => {
    if (!val || val === '-') return ''
    if (val.includes('虧損') || val.includes('-')) {
        if (val.includes('虧損')) return 'text-danger'
        const num = parseFloat(val.replace(/[^\d.-]/g, ''))
        if (!isNaN(num) && num < 0) return 'text-danger'
    }
    return 'text-success'
}
</script>

<style scoped>
.business-table-container {
    padding: 0;
}

.text-success {
    color: var(--el-color-success);
}

.text-danger {
    color: var(--el-color-danger);
}

.truncate-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .hidden-xs-only {
        display: none;
    }

    .pagination-container {
        justify-content: center;
    }
}
</style>