<template>
    <div>
        <el-card>
            <template #header>
                <div class="card-header card-header--custom">
                    <span>資料中心
                    </span>
                    <div>
                        <el-button @click="exportUserForm()">匯出</el-button>
                        <!-- <el-button>但你怎麼知道左邊這顆按鈕不是強制登入？</el-button> -->
                    </div>
                </div>
            </template>
            <el-form ref="ruleFormRef" label-width="auto">
                <el-row>
                    <el-col>
                        給不敢登入又想保留紀錄的用戶使用。
                        <ol>
                            <li>按下匯出，會取得一包"開源財務規劃.json"。</li>
                            <li>下次使用就可直接匯入</li>
                        </ol>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>
<script setup lang="ts">
const emits = defineEmits(['export'])
// methods
async function exportUserForm() {
    emits('export')
}
</script>
<style lang="scss" scoped>
.card-header--custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular);
        background: white !important;
    }
}
</style>
