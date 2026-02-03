<template>
    <el-card shadow="never">
        <template #header>
            <el-row justify="space-between" align="middle">
                <el-col :span="12">
                    <el-text size="large" tag="b">精確年齡處理器 (Replace & Parse)</el-text>
                </el-col>
            </el-row>
        </template>

        <el-form label-position="top">
            <el-form-item label="1. 上傳包含中文年齡之生命表 (JSON)">
                <el-upload action="#" :auto-upload="false" :on-change="handleFileChange" :show-file-list="true"
                    limit="1" accept=".json" style="width: 100%">
                    <template #trigger>
                        <el-button :icon="Upload" type="primary" plain style="width: 100%">選擇檔案</el-button>
                    </template>
                </el-upload>
            </el-form-item>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-button :icon="Cpu" type="warning" style="width: 100%" :disabled="rawData.length === 0"
                        @click="transformData">
                        移除「歲」並轉換數值
                    </el-button>
                </el-col>
                <el-col :span="12">
                    <el-button :icon="Download" type="success" style="width: 100%" :disabled="!isProcessed"
                        @click="downloadJson">
                        匯出處理結果
                    </el-button>
                </el-col>
            </el-row>

            <el-divider content-position="left">轉換結果預覽 (Clean Numbers)</el-divider>
            <el-table :data="processedData.slice(0, 10)" stripe border size="small" style="width: 100%">
                <el-table-column prop="gender" label="Gender" width="100" />
                <el-table-column prop="age" label="Age (Number)" width="120">
                    <template #default="scope">
                        <el-tag size="small" effect="dark" type="info">{{ scope.row.age }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="expected_lifespan" label="Exp. Lifespan" />
                <el-table-column prop="year" label="Year" />
            </el-table>
        </el-form>

        <template #footer>
            <el-alert v-if="isProcessed" title="處理完畢。年齡欄位已完成「歲」字串移除並轉型為數字，符合理財規劃書試算引擎的嚴格型別定義。" type="success" show-icon
                :closable="false" />
        </template>
    </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, Upload, Cpu } from '@element-plus/icons-vue';

// 定義資料模型，僅包含核心英文鍵值
const processedData = defineModel({
    type: Array,
    default: () => []
});

const rawData = ref([]);
const isProcessed = ref(false);

/**
 * 處理檔案上傳讀取
 */
const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target.result);
            rawData.value = json;
            isProcessed.value = false;
            ElMessage.success(`讀取成功，共 ${json.length} 筆原始記錄`);
        } catch (err) {
            ElMessage.error('檔案解析失敗，請提供正確的 JSON 格式');
        }
    };
    reader.readAsText(file.raw);
};

/**
 * 核心轉換邏輯：
 * 1. 僅保留「男性」與「女性」 (排除總計)
 * 2. 轉換性別值為 MALE / FEMALE
 * 3. 處理 Age：使用 .replaceAll('歲', '') 移除單位後轉為 Number
 * 4. 僅保留 year, gender, age, expected_lifespan
 */
const transformData = () => {
    if (rawData.value.length === 0) {
        ElMessage.warning('請先選擇並上傳原始 JSON 檔案');
        return;
    }

    const genderMap = {
        '男性': 'MALE',
        '女性': 'FEMALE'
    };

    try {
        processedData.value = rawData.value
            .filter(item => genderMap[item['性別']])
            .map(item => ({
                year: item['西元年'],
                gender: genderMap[item['性別']],
                // 依照要求：先使用 replaceAll 移除「歲」字樣，再轉為數字
                age: Number(item['年齡'].replaceAll('歲', '')),
                expected_lifespan: item['預期壽命']
            }));

        isProcessed.value = true;
        ElMessage.success('轉換完成：Age 欄位已透過字串替換並成功轉為 Number');
    } catch (error) {
        ElMessage.error('資料轉換過程中發生錯誤，請檢查原始資料欄位內容');
    }
};

/**
 * 下載純淨版 JSON
 */
const downloadJson = () => {
    if (processedData.value.length === 0) return;
    const dataStr = JSON.stringify(processedData.value, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life_table_numeric_replaced_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
</script>
