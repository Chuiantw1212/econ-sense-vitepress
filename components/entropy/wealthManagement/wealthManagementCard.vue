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
                            <span class="sab-label">👿 內在破壞者：</span>
                            <span class="sab-text">{{ role.info.saboteur }}</span>
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
// 請確認此路徑與您的檔案結構一致
import { data } from './wealth_management.data.js';

const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

const activeTab = ref('');

// 角色中文對照
const ROLE_NAME_MAP: Record<string, string> = {
    'Hunter': '獵人', 'Pioneer': '先驅', 'Toolmaker': '工匠', 'Sentry': '哨兵',
    'Gatherer': '採集者', 'Shaman': '薩滿', 'Helper': '助人者', 'Elder': '長老',
};

// 角色代表色
const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500', 'Pioneer': '#FF8C00', 'Toolmaker': '#1E90FF', 'Sentry': '#00008B',
    'Gatherer': '#32CD32', 'Shaman': '#9370DB', 'Helper': '#20B2AA', 'Elder': '#2E8B57',
};

// 整合資料
const displayRoles = computed(() => {
    const list = [];

    // 主顯角色
    if (props.primaryRole && data[props.primaryRole]) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole],
            color: ARCHETYPE_COLORS[props.primaryRole],
            // @ts-ignore
            info: data[props.primaryRole]
        });
    }

    // 次顯角色 (需存在且與主顯不同)
    if (props.secondaryRole &&
        props.secondaryRole !== props.primaryRole &&
        data[props.secondaryRole]) {
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

// 自動切換 Tab
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
    /* 左側綠條，象徵守成與安全 */
    border-left: 5px solid #13ce66;
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

/* Tabs 樣式優化 */
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

/* 1. 心理原型 (Archetype Box) */
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

/* 2. 通用訊息框 (Info Box) */
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

/* 警示框 (橘色) */
.warning-box {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
}

.warning-box .box-content {
    color: #8c5f00;
}

/* 成功框 (綠色) */
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

/* 3. 破壞者框 (Saboteur Box) */
.saboteur-box {
    background: #fff0f0;
    padding: 12px;
    border-radius: 6px;
    font-size: 0.9rem;
    border-left: 4px solid #F56C6C;
    display: flex;
    gap: 5px;
    align-items: flex-start;
}

.sab-label {
    font-weight: bold;
    color: #F56C6C;
    white-space: nowrap;
}

.sab-text {
    color: #5e4d4d;
    line-height: 1.5;
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