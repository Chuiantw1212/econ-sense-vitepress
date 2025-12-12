<template>
    <el-card class="management-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🛡️ 財富守成</span>
                    <el-tooltip content="診斷你的消費心理漏洞，並建立強制儲蓄的防禦機制。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <div class="header-right">
                    <span class="type-badge">行為矯正</span>
                </div>
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

                        <div class="profile-section">
                            <div class="profile-main">
                                <div class="profile-label">消費心理原型</div>

                                <h1 class="title-zh" :style="{ color: role.color }">
                                    {{ role.info?.archetype_zh }}
                                </h1>

                                <div class="title-en-badge">
                                    {{ role.info?.archetype_en }}
                                </div>
                            </div>

                            <div class="quote-container">
                                <div class="quote-icon-wrapper">
                                    <el-icon>
                                        <ChatLineSquare />
                                    </el-icon>
                                </div>
                                <div class="quote-content">
                                    {{ role.info?.moneyView }}
                                </div>
                            </div>
                        </div>

                        <div class="diagnosis-grid">

                            <div class="diag-box leak-style">
                                <div class="diag-header">
                                    <el-icon>
                                        <WarningFilled />
                                    </el-icon> 致命漏洞
                                </div>
                                <div class="diag-content">
                                    {{ role.info?.leak }}
                                </div>
                            </div>

                            <div class="diag-box saboteur-style">
                                <div class="diag-header">
                                    <el-icon>
                                        <Warning />
                                    </el-icon> 潛意識破壞者
                                </div>
                                <div class="diag-content">
                                    {{ role.info?.saboteur }}
                                </div>
                            </div>

                        </div>

                        <div class="prescription-box">
                            <div class="pres-header">
                                <el-icon>
                                    <FirstAidKit />
                                </el-icon> 矯正處方 (Protocol)
                            </div>
                            <div class="pres-content">
                                {{ role.info?.protocol }}
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
import {
    InfoFilled,
    WarningFilled,
    Warning,
    FirstAidKit,
    ChatLineSquare
} from '@element-plus/icons-vue';

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
    if (props.primaryRole && data && data[props.primaryRole]) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole],
            color: ARCHETYPE_COLORS[props.primaryRole],
            // @ts-ignore
            info: data[props.primaryRole]
        });
    }
    if (props.secondaryRole && props.secondaryRole !== props.primaryRole && data && data[props.secondaryRole]) {
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
/* 基礎容器 */
.management-card {
    margin-top: 20px;
    border-radius: 12px;
    /* 統一圓角 */
    background: #fff;
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title {
    font-weight: 800;
    font-size: 1.1rem;
    color: #303133;
}

.info-icon {
    font-size: 14px;
    color: #bdbdbd;
    cursor: help;
}

.type-badge {
    background: #f0f9eb;
    color: #529b2e;
    font-size: 0.8rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid #e1f3d8;
}

/* Tabs 樣式統一化 (與其他卡片一致) */
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

/* 1. Profile Section */
.profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
}

.profile-label {
    font-size: 0.75rem;
    color: #909399;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

/* 中文標題 */
.title-zh {
    font-size: 2.4rem;
    font-weight: 900;
    line-height: 1.1;
    margin: 0 0 10px 0;
    letter-spacing: 2px;
}

/* 英文標題 (標籤化) */
.title-en-badge {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    background-color: #303133;
    padding: 4px 12px;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 語錄區塊 (Flex) */
.quote-container {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #fff;
    border: 1px solid #f0f0f0;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    max-width: 80%;
    margin: 0 auto;
    text-align: left;
}

.quote-icon-wrapper {
    font-size: 1.6rem;
    color: #dcdfe6;
    flex-shrink: 0;
    margin-top: 2px;
}

.quote-content {
    font-size: 1rem;
    color: #555;
    font-style: italic;
    line-height: 1.6;
    font-weight: 500;
}

.spacer {
    height: 20px;
}

/* 2. Diagnosis Grid */
.diagnosis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
}

.diag-box {
    padding: 18px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid #ebeef5;
    border-top: 4px solid transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.diag-header {
    font-size: 0.95rem;
    font-weight: 800;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.diag-content {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #555;
    text-align: justify;
}

/* Colors */
.leak-style {
    border-top-color: #f56c6c;
}

.leak-style .diag-header {
    color: #c0392b;
}

.saboteur-style {
    border-top-color: #e6a23c;
}

.saboteur-style .diag-header {
    color: #d35400;
}

/* 3. Prescription Box */
.prescription-box {
    background: #f0f9eb;
    border: 1px solid #e1f3d8;
    border-radius: 10px;
    padding: 20px;
    position: relative;
    overflow: hidden;
}

.prescription-box::after {
    content: "+";
    position: absolute;
    right: -10px;
    bottom: -20px;
    font-size: 6rem;
    color: rgba(103, 194, 58, 0.1);
    font-weight: 900;
    pointer-events: none;
}

.pres-header {
    font-size: 1.1rem;
    font-weight: 800;
    color: #2e7d32;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.pres-content {
    font-size: 1rem;
    color: #1b5e20;
    line-height: 1.6;
    font-weight: 600;
    position: relative;
    z-index: 1;
}

/* RWD */
@media (max-width: 600px) {
    .profile-section {
        align-items: flex-start;
        text-align: left;
    }

    .title-zh {
        font-size: 2rem;
    }

    .quote-container {
        max-width: 100%;
        width: 100%;
        box-sizing: border-box;
    }

    .diagnosis-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
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