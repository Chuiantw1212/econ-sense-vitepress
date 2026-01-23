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

    </el-card>
</template>

<script setup lang="ts">
import { Download, Printer } from '@element-plus/icons-vue';
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
</style>