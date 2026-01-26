<template>
    <div class="business-table-container">
        <el-card shadow="never" v-loading="loading">
            <template v-if="pageData.list && pageData.list.length > 0">
                <el-table :data="pageData.list" style="width: 100%" stripe show-overflow-tooltip
                    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">

                    <el-table-column type="index" :index="indexMethod" label="#" width="60" align="center" />

                    <el-table-column label="名稱" prop="name" min-width="120" show-overflow-tooltip>
                        <template #default="{ row }">
                            <div class="font-medium text-gray-800 truncate-text">{{ row.name }}</div>
                            <div class="xs-show text-xs text-gray-400 mt-1">
                                成本: {{ formatNumber(row.acquisitionCost) }}
                            </div>
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

                    <el-table-column label="操作" width="140" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">
                            </el-button>
                            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">
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
import { ref, reactive, nextTick, onMounted } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { MetadataMap } from './types/metadata'
import { useApi } from '@/components/plan/composables/useApi'
import type { UserBusiness } from './types/user'
import type { PaginatedResponse } from './types/util'
import BusinessDialogForm from './businessDialogForm.vue'

// ==========================================
// 1. 定義 Emits 與 Props
// ==========================================
// [修改] 定義 emit 事件，當資料有變動(CUD)時通知父層
const emit = defineEmits<{
    (e: 'update'): void
}>()

const props = withDefaults(defineProps<{
    metadata: MetadataMap,
}>(), {
    metadata: () => ({})
})

const { authFetch } = useApi()
const loading = ref(false)

// [修改] pageData 轉為內部狀態，不再依賴父層傳入
const pageData = ref<PaginatedResponse<UserBusiness>>({
    list: [],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
})

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
    irr: '-',
    groupId: 1
})

const currentBusiness = reactive<UserBusiness>(createDefaultBusiness())

// ==========================================
// 3. 核心功能：API 獲取與更新
// ==========================================

const refreshData = async (targetPage?: number, targetSize?: number) => {
    loading.value = true
    try {
        const currentPage = targetPage || pageData.value.currentPage
        const pageSize = targetSize || pageData.value.pageSize

        const res = await authFetch('/api/v1/user/businesses', {
            method: 'GET',
            params: { currentPage, pageSize }
        })

        if (res && res.ok) {
            const newData = await res.json()
            // 更新本地狀態
            pageData.value = newData
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('無法載入列表數據')
    } finally {
        loading.value = false
    }
}

// 初始化時自動抓資料
onMounted(() => {
    refreshData(1)
})

// ==========================================
// 4. 計算邏輯 & Formatters
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

const formatNumber = (val: number) => val?.toLocaleString() || '0'

const getRateColor = (val?: string) => {
    if (!val || val === '-') return ''
    if (val.includes('虧損')) return 'text-danger'
    const num = parseFloat(val.replace(/[^\d.-]/g, ''))
    if (!isNaN(num) && num < 0) return 'text-danger'
    return 'text-success'
}

// ==========================================
// 5. 分頁操作
// ==========================================
const handleSizeChange = (val: number) => {
    refreshData(1, val)
}

const handleCurrentChange = (val: number) => {
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

            // 智能跳頁
            let targetPage = pageData.value.currentPage
            if (pageData.value.list.length === 1 && targetPage > 1) {
                targetPage--
            }
            await refreshData(targetPage)

            // [關鍵] 通知父層：資料已變動，請更新圖表
            emit('update')
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

            // 重新抓取列表
            await refreshData()

            // [關鍵] 通知父層：資料已變動，請更新圖表
            emit('update')
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

.xs-show {
    display: none;
}

@media (max-width: 768px) {
    .hidden-xs-only {
        display: none;
    }

    .xs-show {
        display: block;
    }

    .pagination-container {
        justify-content: center;
    }
}
</style>