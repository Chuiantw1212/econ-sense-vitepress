<template>
    <div class="business-table-container">
        <el-card shadow="never">
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
                        <template #default="{ row, $index }">
                            <el-button link type="primary" :icon="Edit" @click="handleEdit(row, $index)">
                            </el-button>
                            <el-button link type="danger" :icon="Delete" @click="handleDelete(row, $index)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-container" v-if="!isGuest || pageData.total > pageData.pageSize">
                    <el-pagination :current-page="pageData.currentPage" :page-size="pageData.pageSize"
                        :total="pageData.total" :page-sizes="[5, 10, 20, 50]" :background="true"
                        layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>

                <div v-else-if="isGuest" class="text-xs text-gray-400 text-center mt-2">
                    訪客模式上限 10 筆資料 (目前 {{ pageData.total }}/10)
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
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { MetadataMap } from './types/metadata'
import { useApi } from '@/components/plan/composables/useApi'
import { useUserPlan } from '@/components/plan/composables/useUserPlan'
import type { UserBusiness } from './types/user'
import type { PaginatedResponse } from './types/util'
import BusinessDialogForm from './businessDialogForm.vue'

// ==========================================
// Props & State
// ==========================================
const emit = defineEmits<{ (e: 'update'): void }>()
const props = withDefaults(defineProps<{ metadata: MetadataMap }>(), { metadata: () => ({}) })

const { authFetch } = useApi()
const { loggedInUser, userForm } = useUserPlan()

// 判斷是否為訪客
const isGuest = computed(() => !loggedInUser.value.uid)

// 離線編輯定位索引
const editingIndex = ref(-1)

// 預設空分頁結構
const emptyPageData: PaginatedResponse<UserBusiness> = {
    list: [], total: 0, currentPage: 1, pageSize: 10, totalPages: 0
}

// [核心] pageData Computed
const pageData = computed({
    get() {
        // 如果 userForm.businesses 不存在，給預設空結構
        if (!userForm.value.businesses) {
            return emptyPageData
        }
        // [雙重防呆] 萬一資料結構壞掉 (變成陣列)，強制修復為物件結構
        if (Array.isArray(userForm.value.businesses)) {
            return {
                ...emptyPageData,
                list: userForm.value.businesses,
                total: userForm.value.businesses.length
            }
        }
        return userForm.value.businesses
    },
    set(val) {
        userForm.value.businesses = val
    }
})

// UI State
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formComponentRef = ref<InstanceType<typeof BusinessDialogForm>>()

const currentBusiness = reactive<UserBusiness>(createDefaultBusiness())

function createDefaultBusiness(): UserBusiness {
    return {
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        projectYears: 5,
        taxCategory: 'exempt',
        acquisitionCost: 0,
        incomeMode: 'monthly',
        monthlyIncome: 0,
        monthlyCost: 0,
        loanAmount: 0,
        loanInterestRate: 0,
        roi: '-',
        irr: '-',
        groupId: 1
    }
}

// ==========================================
// Data Fetching
// ==========================================

async function refreshData(targetPage?: number, targetSize?: number) {
    // 訪客不抓 API
    if (isGuest.value) return

    try {
        const currentPage = targetPage || pageData.value.currentPage
        const pageSize = targetSize || pageData.value.pageSize

        const res = await authFetch('/api/v1/user/businesses', {
            method: 'GET',
            params: { currentPage, pageSize }
        })

        if (res && res.ok) {
            const newData = await res.json()
            userForm.value.businesses = newData
        }
    } catch (e) {
        console.error(e)
    }
}

onMounted(() => { refreshData(1) })

// ==========================================
// Helpers
// ==========================================

function indexMethod(index: number) {
    const { currentPage, pageSize } = pageData.value
    return (currentPage - 1) * pageSize + index + 1
}

function getNetCashFlow(item: UserBusiness) {
    const income = item.monthlyIncome || 0
    const cost = item.monthlyCost || 0
    const interest = Math.round((item.loanAmount || 0) * (item.loanInterestRate || 0) / 100 / 12)
    return income - cost - interest
}

function formatNumber(val: number) {
    return val?.toLocaleString() || '0'
}

function getRateColor(val?: string | number) {
    if (!val || val === '-') return ''
    const strVal = String(val)
    if (strVal.includes('虧損')) return 'text-danger'
    const num = parseFloat(strVal.replace(/[^\d.-]/g, ''))
    if (!isNaN(num) && num < 0) return 'text-danger'
    return 'text-success'
}

// ==========================================
// Pagination
// ==========================================

function handleSizeChange(val: number) {
    if (isGuest.value) return
    refreshData(1, val)
}

function handleCurrentChange(val: number) {
    if (isGuest.value) return
    refreshData(val, pageData.value.pageSize)
}

// ==========================================
// CRUD Operations
// ==========================================

function handleCreate() {
    // [訪客限制] 10筆
    if (isGuest.value && pageData.value.list.length >= 10) {
        ElMessage.warning('訪客試算限制最多 10 筆資料，請登入以解鎖限制。')
        return
    }

    isEdit.value = false
    editingIndex.value = -1
    Object.assign(currentBusiness, createDefaultBusiness())
    dialogVisible.value = true
    nextTick(() => formComponentRef.value?.clearValidate())
}

function handleEdit(row: UserBusiness, index: number) {
    isEdit.value = true
    editingIndex.value = index // 紀錄 index 供離線編輯使用
    Object.assign(currentBusiness, JSON.parse(JSON.stringify(row)))
    dialogVisible.value = true
    nextTick(() => formComponentRef.value?.clearValidate())
}

function handleDelete(row: UserBusiness, index: number) {
    ElMessageBox.confirm(`確定刪除「${row.name}」嗎？`, '警告', {
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {

        // [訪客模式] 操作 list 陣列
        if (isGuest.value || !row.id) {
            const currentData = JSON.parse(JSON.stringify(pageData.value)) as PaginatedResponse<UserBusiness>

            if (index >= 0 && index < currentData.list.length) {
                currentData.list.splice(index, 1)
                currentData.total = currentData.list.length // 更新 total

                // 回寫全域狀態
                userForm.value.businesses = currentData

                ElMessage.success('已移除 (離線)')
                emit('update')
            }
            return
        }

        // [會員模式] API
        try {
            await authFetch(`/api/v1/user/businesses/${row.id}`, { method: 'DELETE' })
            ElMessage.success('已刪除')

            // 智能跳頁
            let targetPage = pageData.value.currentPage
            if (pageData.value.list.length === 1 && targetPage > 1) {
                targetPage--
            }
            await refreshData(targetPage)
            emit('update')
        } catch (e) {
            ElMessage.error('刪除失敗')
        }
    }).catch(() => { })
}

async function handleSubmit() {
    const isValid = await formComponentRef.value?.validate()
    if (!isValid) return

    submitting.value = true
    const payload = JSON.parse(JSON.stringify(currentBusiness)) as UserBusiness

    try {
        // ==========================================
        // [訪客 / 離線模式]
        // ==========================================
        if (isGuest.value) {
            const currentData = JSON.parse(JSON.stringify(pageData.value)) as PaginatedResponse<UserBusiness>

            if (!Array.isArray(currentData.list)) {
                currentData.list = []
            }

            if (isEdit.value) {
                // 編輯: 使用 editingIndex
                if (editingIndex.value >= 0 && editingIndex.value < currentData.list.length) {
                    currentData.list[editingIndex.value] = payload
                }
            } else {
                // 新增: Push 到 list，確保 id 為空字串
                currentData.list.push({ ...payload, id: "" })
            }

            currentData.total = currentData.list.length

            // 回寫全域
            userForm.value.businesses = currentData

            ElMessage.success(isEdit.value ? '已更新 (離線)' : '已新增 (離線)')
            dialogVisible.value = false
            emit('update')
            return
        }

        // ==========================================
        // [會員模式] API
        // ==========================================
        const method = isEdit.value ? 'PUT' : 'POST'
        const url = isEdit.value
            ? `/api/v1/user/businesses/${payload.id}`
            : `/api/v1/user/businesses`

        const res = await authFetch(url, { method, body: payload })

        if (res && res.ok) {
            ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
            dialogVisible.value = false
            await refreshData()
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