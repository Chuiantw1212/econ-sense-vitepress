<template>
    <el-card shadow="never" class="danger-zone-card">
        <template #header>
            <div class="card-header">
                <span class="text-danger font-bold">危險區域 (Danger Zone)</span>
            </div>
        </template>

        <el-row align="middle" justify="space-between">
            <el-col :span="16" :xs="24">
                <h4 style="margin: 0 0 8px 0;">{{ isGuest ? '重置所有試算資料' : '註銷帳號與刪除資料' }}</h4>
                <p class="text-desc">
                    {{ isGuest
                        ? '這將會清空您目前在瀏覽器暫存的所有試算數據，恢復為預設值。'
                        : '此動作將永久刪除您的帳號及所有儲存的資產配置資料，且無法復原。'
                    }}
                </p>
            </el-col>
            <el-col :span="8" :xs="24" style="text-align: right; margin-top: 10px;">
                <el-button type="danger" plain @click="handleDeleteAccount" :loading="isDeleting">
                    {{ isGuest ? '重置資料' : '刪除帳號' }}
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vitepress'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getAuth, deleteUser } from 'firebase/auth' // Firebase Auth
import { useApi } from '@/components/plan/composables/useApi'
import { useUserPlan } from '@/components/plan/composables/useUserPlan'

// --- Init ---
const router = useRouter()
const { authFetch } = useApi()
const { loggedInUser, resetUserForm } = useUserPlan() // 假設 useUserPlan 有 export resetUserForm

const isDeleting = ref(false)
const isGuest = computed(() => !loggedInUser.value?.uid)

// --- Actions ---

const handleDeleteAccount = async () => {
    // 1. 二次確認 (使用 Element Plus MessageBox)
    try {
        await ElMessageBox.confirm(
            isGuest.value
                ? '確定要清空所有目前的試算資料嗎？此動作無法復原。'
                : '警告：您確定要永久刪除帳號嗎？所有雲端資料將消失且無法找回。',
            isGuest.value ? '重置確認' : '刪除帳號確認',
            {
                confirmButtonText: isGuest.value ? '確定重置' : '確定刪除',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: 'el-button--danger'
            }
        )
    } catch {
        // 使用者按取消
        return
    }

    isDeleting.value = true

    try {
        // --- 訪客模式：只重置前端 ---
        if (isGuest.value) {
            resetUserForm()
            ElMessage.success('試算資料已重置')
            // 選擇性：重新整理頁面或導回首頁
            router.go('/')
            return
        }

        // --- 會員模式：完整刪除流程 ---

        // A. 刪除後端資料庫資料 (PostgreSQL/MongoDB)
        // 建議後端實作 DELETE /api/v1/user/account
        const res = await authFetch('/api/v1/user/account', {
            method: 'DELETE'
        })

        if (!res || !res.ok) {
            throw new Error('後端資料刪除失敗，請稍後再試或聯繫客服')
        }

        // B. 刪除 Firebase Auth User
        const auth = getAuth()
        const currentUser = auth.currentUser

        if (currentUser) {
            try {
                await deleteUser(currentUser)
            } catch (firebaseError: any) {
                // 特殊情況處理：如果登入時間過久，Firebase 會要求重新登入才能刪除
                if (firebaseError.code === 'auth/requires-recent-login') {
                    ElMessage.error('為了安全起見，請重新登入後再執行刪除操作。')
                    return
                }
                throw firebaseError
            }
        }

        // C. 清理前端狀態
        resetUserForm()

        ElMessage.success('帳號已成功註銷')
        router.go('/') // 導回首頁

    } catch (e: any) {
        console.error(e)
        ElMessage.error(e.message || '刪除失敗')
    } finally {
        isDeleting.value = false
    }
}
</script>

<style scoped>
.danger-zone-card {
    border: 1px solid var(--el-color-danger-light-5);
    background-color: #fff0f0;
    /* 淡淡的紅色背景警示 */
}

.text-danger {
    color: var(--el-color-danger);
}

.text-desc {
    font-size: 14px;
    color: #606266;
    margin: 0;
    line-height: 1.5;
}

/* RWD 調整 */
@media (max-width: 768px) {
    .el-col {
        text-align: left !important;
        margin-bottom: 12px;
    }
}
</style>