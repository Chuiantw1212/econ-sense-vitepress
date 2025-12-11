<template>
    <el-card class="management-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🛡️ 財富守成 (Wealth Defense)</span>
                    <el-tooltip content="診斷你的消費心理漏洞，並建立強制儲蓄的防禦機制。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#13ce66" effect="dark" round style="border:none;">行為矯正</el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs v-model="activeTab" type="border-card" class="wealth-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            <span class="role-dot" :style="{ color: role.color }">●</span>
                            {{ index === 0 ? '主顯' : '次顯' }}：{{ role.nameZh }}
                        </span>
                    </template>

                    <div class="tab-inner">

                        <div class="archetype-box">
                            <div class="arch-label">消費心理原型</div>
                            <div class="arch-title">{{ role.info.archetype }}</div>
                            <div class="arch-quote">"{{ role.info.moneyView }}"</div>
                        </div>

                        <el-divider border-style="dashed" class="divider-spacing">
                            <span class="divider-text">財務行為診斷</span>
                        </el-divider>

                        <div class="info-box warning-box">
                            <div class="box-title">
                                <el-icon>
                                    <WarningFilled />
                                </el-icon> 財務漏洞 (The Leak)
                            </div>
                            <div class="box-content">{{ role.info.leak }}</div>
                        </div>

                        <div class="saboteur-box">
                            <div class="sab-header">
                                <span class="sab-icon">👿</span>
                                <span class="sab-label">內在破壞者</span>
                            </div>
                            <div class="sab-text">{{ role.info.saboteur }}</div>
                        </div>

                        <div class="info-box success-box">
                            <div class="box-title">
                                <el-icon>
                                    <Checked />
                                </el-icon> 防禦協議 (The Protocol)
                            </div>
                            <div class="box-content highlight-text">
                                {{ role.info.protocol }}
                            </div>
                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InfoFilled, WarningFilled, Checked } from '@element-plus/icons-vue';
// 請確認路徑
import { data } from './wealth_management.data.js';

const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

const activeTab = ref('');

const ROLE_NAME_MAP: Record<string, string> = {
    'Hunter': '獵人', 'Pioneer': '先驅', 'Toolmaker': '工匠', 'Sentry': '哨兵',
    'Gatherer': '採集者', 'Shaman': '薩滿', 'Helper': '助人者', 'Elder': '長老',
};

const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500', 'Pioneer': '#FF8C00', 'Toolmaker': '#1E90FF', 'Sentry': '#00008B',
    'Gatherer': '#32CD32', 'Shaman': '#9370DB', 'Helper': '#20B2AA', 'Elder': '#2E8B57',
};

const displayRoles = computed(() => {
    const list = [];
    if (props.primaryRole && data[props.primaryRole]) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole],
            color: ARCHETYPE_COLORS[props.primaryRole],
            // @ts-ignore
            info: data[props.primaryRole]
        });
    }
    if (props.secondaryRole && props.secondaryRole !== props.primaryRole && data[props.secondaryRole]) {
        list.push({
            key: props.secondaryRole,
            nameZh: ROLE_NAME_MAP[props.secondaryRole],
            color: ARCHETYPE_COLORS[props.secondaryRole],
            // @ts-ignore
            info: data[props.secondaryRole]
        });
    }
    return list;
});

watch(displayRoles, (newVal) => {
    if (newVal.length > 0 && !activeTab.value) {
        activeTab.value = newVal[0].key;
    }
}, { immediate: true });

</script>

<style scoped>
.management-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 6px;
}

.title {
    font-weight: bold;
    font-size: 16px;
    color: #303133;
}

.info-icon {
    font-size: 14px;
    color: #909399;
    cursor: help;
}

.wealth-tabs {
    border: none;
    box-shadow: none;
}

.wealth-tabs :deep(.el-tabs__content) {
    padding: 20px 10px;
}

.tab-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
}

.role-dot {
    font-size: 1.2rem;
    line-height: 1;
}

.tab-inner {
    animation: fadeIn 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* 1. Archetype Box */
.archetype-box {
    text-align: center;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
}

.arch-label {
    font-size: 0.75rem;
    color: #909399;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.arch-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: #303133;
    margin: 5px 0;
}

.arch-quote {
    font-style: italic;
    color: #606266;
    font-size: 0.95rem;
    margin-top: 5px;
}

.divider-spacing {
    margin: 20px 0;
}

.divider-text {
    font-size: 0.85rem;
    color: #C0C4CC;
}

/* 2. Info Box (Generic) */
.info-box {
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid transparent;
}

.box-title {
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.box-content {
    font-size: 0.95rem;
    line-height: 1.6;
    text-align: justify;
}

/* Warning Box */
.warning-box {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
}

.warning-box .box-content {
    color: #8c5f00;
}

/* Success Box */
.success-box {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
}

.success-box .box-content {
    color: #405936;
}

.highlight-text {
    font-weight: 500;
}

/* 3. Saboteur Box (修正樣式) */
.saboteur-box {
    background: #fff0f0;
    padding: 12px 15px;
    /* 增加 padding */
    border-radius: 8px;
    border-left: 4px solid #F56C6C;
    /* 移除 display: flex，改回預設 block，讓內文自動換行 */
}

.sab-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    /* 標題與內文的間距 */
}

.sab-icon {
    font-size: 1.1rem;
}

.sab-label {
    font-weight: bold;
    color: #F56C6C;
    font-size: 1rem;
}

.sab-text {
    color: #5e4d4d;
    line-height: 1.6;
    font-size: 0.95rem;
    padding-left: 2px;
    /* 微調對齊 */
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>