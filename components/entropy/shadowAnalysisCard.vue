<template>
    <el-card class="shadow-card" shadow="hover" v-if="hasData">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🌑 陰影與壓力模式</span>
                    <el-tag type="danger" effect="dark" size="small">警告</el-tag>
                </div>
                <el-tooltip content="當你的大腦能量耗盡或面臨威脅時，你的主導與次要人格會分別轉化為不同的防禦型態。" placement="top">
                    <el-icon class="info-icon">
                        <InfoFilled />
                    </el-icon>
                </el-tooltip>
            </div>
        </template>

        <div class="shadow-content">

            <el-tabs v-model="activeTab" type="border-card" class="shadow-tabs">

                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            {{ index === 0 ? '👑 主顯：' : '⚔️ 次顯：' }} {{ role.name }}
                        </span>
                    </template>

                    <div class="tab-inner">
                        <div class="shadow-identity">
                            <div class="shadow-name">
                                失控異變：<span class="text-danger">{{ role.data.shadowName }}</span>
                            </div>
                        </div>

                        <el-divider border-style="dashed" class="divider-dark" />

                        <div class="stress-grid">
                            <div class="stress-box acute">
                                <div class="box-title">⚡ 急性壓力 (戰逃反應)</div>
                                <div class="box-desc">{{ role.data.acute }}</div>
                            </div>
                            <div class="stress-box chronic">
                                <div class="box-title">🌧️ 慢性壓力 (過勞耗損)</div>
                                <div class="box-desc">{{ role.data.chronic }}</div>
                            </div>
                        </div>

                        <div class="antidote-box">
                            <div class="antidote-label">💊 {{ role.name }} 的急救處方</div>
                            <div class="antidote-text">{{ role.data.antidote }}</div>
                        </div>
                    </div>

                </el-tab-pane>
            </el-tabs>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
import { data as shadowScripts } from './shadow.data.js';

// --- Props ---
// 接收兩個角色 Key，secondary 為選填
const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

// --- State ---
const activeTab = ref('');

// --- Computed ---
const roleNameMap: Record<string, string> = {
    Hunter: '獵人', Pioneer: '先驅', Gatherer: '採集者', Shaman: '薩滿',
    Toolmaker: '工匠', Sentry: '哨兵', Helper: '助人者', Elder: '長老'
};

const displayRoles = computed(() => {
    const list = [];

    // 1. 處理主顯
    if (props.primaryRole && shadowScripts[props.primaryRole]) {
        list.push({
            key: props.primaryRole,
            name: roleNameMap[props.primaryRole],
            data: shadowScripts[props.primaryRole]
        });
    }

    // 2. 處理次顯 (只有當次顯存在，且不等於主顯時才加入)
    if (props.secondaryRole && props.secondaryRole !== props.primaryRole && shadowScripts[props.secondaryRole]) {
        list.push({
            key: props.secondaryRole,
            name: roleNameMap[props.secondaryRole],
            data: shadowScripts[props.secondaryRole]
        });
    }

    return list;
});

const hasData = computed(() => displayRoles.value.length > 0);

// 當資料變更時，預設選中第一個 Tab
watch(displayRoles, (newVal) => {
    if (newVal.length > 0) {
        activeTab.value = newVal[0].key;
    }
}, { immediate: true });

</script>

<style scoped>
/* 整體深色風格 */
.shadow-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #4c4d4f;
    background: linear-gradient(145deg, #2b2b2b, #1a1a1a);
    color: #e0e0e0;
    overflow: hidden;
    /* 防止 Tab 圓角溢出 */
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title {
    font-weight: bold;
    font-size: 16px;
    color: #fff;
}

.info-icon {
    color: #909399;
    cursor: help;
}

/* --- Tabs 深色適配 --- */
.shadow-tabs {
    background: transparent;
    border: none;
    box-shadow: none;
}

:deep(.el-tabs__header) {
    background-color: #2b2b2b;
    border-bottom: 1px solid #4c4d4f;
}

:deep(.el-tabs__item) {
    color: #909399;
    border-right: 1px solid #4c4d4f !important;
}

:deep(.el-tabs__item.is-active) {
    background-color: #1a1a1a !important;
    /* 選中時背景變深 */
    color: #F56C6C !important;
    /* 選中文字變紅 */
    border-bottom-color: #1a1a1a !important;
}

:deep(.el-tabs__content) {
    padding: 20px 5px 5px 5px;
    background-color: #1a1a1a;
}

/* 陰影身份區 */
.shadow-identity {
    text-align: center;
    margin-bottom: 20px;
}

.shadow-name {
    font-size: 1.2rem;
    font-weight: bold;
}

.text-danger {
    color: #F56C6C;
    font-weight: 800;
    text-shadow: 0 0 10px rgba(245, 108, 108, 0.3);
    margin-left: 8px;
}

/* 壓力網格 */
.stress-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
}

@media (max-width: 600px) {
    .stress-grid {
        grid-template-columns: 1fr;
    }
}

.stress-box {
    padding: 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    line-height: 1.5;
}

.stress-box.acute {
    background: rgba(245, 108, 108, 0.1);
    border-left: 3px solid #F56C6C;
}

.stress-box.chronic {
    background: rgba(144, 147, 153, 0.1);
    border-left: 3px solid #909399;
}

.box-title {
    font-weight: bold;
    margin-bottom: 6px;
    color: #fff;
}

.box-desc {
    color: #ccc;
    text-align: justify;
}

/* 處方箋 */
.antidote-box {
    background: #67C23A;
    color: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.antidote-label {
    font-size: 0.85rem;
    opacity: 0.9;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.antidote-text {
    font-weight: 500;
    font-size: 1rem;
}

.divider-dark {
    border-color: #4c4d4f;
    margin: 15px 0;
}
</style>