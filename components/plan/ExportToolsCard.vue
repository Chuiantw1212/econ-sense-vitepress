<template>
    <el-card shadow="never" class="export-card no-print">
        <el-row :gutter="16">
            <el-col :span="12" :xs="24">
                <el-button type="primary" plain icon="Download" style="width: 100%; height: 40px;"
                    @click="downloadJson">
                    匯出 JSON 檔案
                </el-button>
                <div style="font-size: 12px; color: #909399; margin-top: 6px; text-align: center;">
                    備份完整設定資料
                </div>
            </el-col>

            <el-col :span="12" :xs="24">
                <el-button type="default" icon="Printer" style="width: 100%; height: 40px;" @click="triggerPrint">
                    列印 / 存為 PDF
                </el-button>
                <div style="font-size: 12px; color: #909399; margin-top: 6px; text-align: center;">
                    輸出 A4 格式報告
                </div>
            </el-col>
        </el-row>

        <el-divider />

        <!-- 整合帳號管理/重置資料區域 -->
        <div class="account-management-section">
            <el-row align="middle" justify="space-between">
                <el-col :span="16" :xs="24">
                    <h5 style="margin: 0 0 8px 0; font-size: 14px;">重置所有資料</h5>
                    <p class="text-desc">
                        此動作將呼叫 API 清除資料庫中的所有資料，包含您的 Firebase 使用者帳號資訊，且無法復原。
                    </p>
                </el-col>
                <el-col :span="8" :xs="24" style="text-align: right; margin-top: 10px;">
                    <el-button type="danger" plain @click="handleDeleteAccount" :loading="isDeleting">
                        {{ '重置資料' }}
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vitepress';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getAuth, deleteUser } from 'firebase/auth';
import { Download, Printer } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import { useUserPlan } from '@/components/plan/composables/useUserPlan';
import type { UserFormState } from '@/components/plan/types/user'; // 請依實際路徑調整

const userForm = defineModel<UserFormState>({ required: true });

// --- 功能 1: 匯出 JSON ---
const downloadJson = () => {
    if (!userForm.value) return;

    // 1. 轉換數據為字串
    const dataStr = JSON.stringify(userForm.value, null, 2);

    // 2. 建立 Blob 物件
    const blob = new Blob([dataStr], { type: 'application/json' });

    // 3. 產生下載連結
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // 4. 設定檔名 (加上日期時間)
    const date = new Date().toISOString().split('T')[0];
    link.download = `retirement_plan_${date}.json`;

    // 5. 觸發點擊並清理
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// --- 功能 2: 列印 ---
const triggerPrint = () => {
    window.print();
};

// --- 功能 3: 重置資料/帳號管理 (整合自 DeleteAccountCard) ---
const router = useRouter();
const { authFetch } = useApi();
const { loggedInUser, resetUserForm } = useUserPlan();

const isDeleting = ref(false);
const isGuest = computed(() => !loggedInUser.value?.uid);

const handleDeleteAccount = async () => {
    try {
        await ElMessageBox.confirm(
            '警告：您確定要重置所有資料嗎？這將呼叫 API 清除資料庫與 Firebase 使用者帳號，此動作無法復原。',
            '重置資料確認',
            {
                confirmButtonText: '確定重置',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: 'el-button--danger'
            }
        );
    } catch {
        return;
    }

    isDeleting.value = true;

    try {
        // --- 訪客模式：只重置前端 ---
        if (isGuest.value) {
            resetUserForm();
            ElMessage.success('試算資料已重置');
            return;
        }

        // --- 會員模式：完整刪除流程 ---
        // A. 刪除後端資料庫資料
        const res = await authFetch('/api/v1/user/account', {
            method: 'DELETE'
        });

        if (!res || !res.ok) {
            throw new Error('後端資料刪除失敗，請稍後再試或聯繫客服');
        }

        // B. 刪除 Firebase Auth User
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            try {
                await deleteUser(currentUser);
            } catch (firebaseError: any) {
                if (firebaseError.code === 'auth/requires-recent-login') {
                    ElMessage.error('為了安全起見，請重新登入後再執行刪除操作。');
                    return;
                }
                throw firebaseError;
            }
        }

        // C. 清理前端狀態
        resetUserForm();
        ElMessage.success('帳號已成功註銷');

    } catch (e: any) {
        console.error(e);
        ElMessage.error(e.message || '刪除失敗');
    } finally {
        isDeleting.value = false;
    }
};
</script>

<style scoped>
/* 這裡的樣式僅影響卡片本身 */
.export-card {
    margin-top: 24px;
}

/* 列印時隱藏此卡片本身 
  (雖然這通常寫在全域 CSS 比較保險，但這裡加上 scoped @media print 作為雙重保障)
*/
@media print {
    .no-print {
        display: none !important;
    }
}

.text-desc {
    font-size: 13px;
    color: #606266;
    margin: 0;
    line-height: 1.5;
}
</style>