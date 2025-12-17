<template>
    <el-card class="healing-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🌿 自我修復指南</span>
                    <el-tooltip content="為你的身心靈提供專屬的充電方案。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#e8f5e9" effect="light" style="color: #2e7d32; border: none;" round>
                    能量管理
                </el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs v-model="activeTab" class="healing-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <div class="custom-tab-label">
                            <span class="role-dot" :style="{ background: role.color }"></span>
                            {{ index === 0 ? '主顯' : '次顯' }} · {{ role.nameZh }}
                        </div>
                    </template>

                    <div class="tab-inner">

                        <div class="zen-box energy-theme">
                            <div class="box-icon">
                                <el-icon>
                                    <Lightning />
                                </el-icon>
                            </div>
                            <div class="box-content">
                                <div class="box-label">能量模式 (Mode)</div>
                                <div class="box-text title-font">{{ role.info.energyType }}</div>
                            </div>
                        </div>

                        <div class="zen-box whisper-theme">
                            <div class="box-icon">
                                <el-icon>
                                    <Moon />
                                </el-icon>
                            </div>
                            <div class="box-content">
                                <div class="box-label">當身體在求救...</div>
                                <div class="box-text">{{ role.info.burnoutSign }}</div>
                            </div>
                        </div>

                        <div class="zen-box ritual-theme">
                            <div class="box-icon">
                                <el-icon>
                                    <HotWater />
                                </el-icon>
                            </div>
                            <div class="box-content">
                                <div class="box-label">專屬修復儀式</div>
                                <div class="box-text highlight-text">
                                    {{ role.info.protocol }}
                                </div>
                            </div>
                        </div>

                        <div class="spacer"></div>

                        <div class="affirmation-container">
                            <el-icon class="quote-icon-top">
                                <ChatLineSquare />
                            </el-icon>
                            <div class="affirmation-text">
                                {{ role.info.affirmation }}
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
    Lightning,
    Moon,
    HotWater,
    ChatLineSquare
} from '@element-plus/icons-vue';
import { data } from './self_care.data.js';

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
    if (newVal.length > 0 && !activeTab.value) activeTab.value = newVal[0].key;
}, { immediate: true });

</script>

<style scoped>
/* 全局容器 */
.healing-card {
    margin-top: 20px;
    border-radius: 20px;
    /* 更圓潤 */
    border: none;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
    /* 柔和光暈 */
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
    font-weight: 700;
    font-size: 1.1rem;
    color: #2c3e50;
    letter-spacing: 1px;
}

.info-icon {
    font-size: 14px;
    color: #b0bec5;
    cursor: help;
}

/* === [核心修正] 療癒系 Tabs 設計 === */
.healing-tabs {
    background: transparent;
}

/* 隱藏預設的灰色底線 */
.healing-tabs :deep(.el-tabs__nav-wrap::after) {
    display: none;
}

/* 隱藏預設的藍色滑動條 */
.healing-tabs :deep(.el-tabs__active-bar) {
    display: none;
}

/* Tab 頭部容器置中 */
.healing-tabs :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: center;
    padding: 10px 0 20px;
}

/* Tab 按鈕本體 */
.healing-tabs :deep(.el-tabs__item) {
    padding: 0 20px !important;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    /* 膠囊狀 */
    margin: 0 5px;
    color: #90a4ae;
    /* 未選中顏色：冷灰 */
    font-weight: 500;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

/* Tab 被選中時的狀態：柔和綠底 */
.healing-tabs :deep(.el-tabs__item.is-active) {
    background-color: #e8f5e9;
    /* 淺綠底 */
    color: #2e7d32;
    /* 深綠字 */
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(46, 125, 50, 0.1);
}

/* Tab 內的標籤內容 */
.custom-tab-label {
    display: flex;
    align-items: center;
    gap: 6px;
}

.role-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.tab-inner {
    animation: fadeIn 0.8s ease;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 10px 20px;
}

/* === Zen Box (統一區塊) === */
.zen-box {
    display: flex;
    gap: 15px;
    align-items: center;
    padding: 20px;
    border-radius: 16px;
    /* 更圓潤 */
    transition: transform 0.2s ease;
}

.box-icon {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    /* Icon 微陰影 */
    flex-shrink: 0;
}

.box-content {
    flex: 1;
}

.box-label {
    font-size: 0.75rem;
    color: #8d99ae;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 4px;
    font-weight: 600;
}

.box-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #4a5568;
}

/* === 主題配色 (柔和色系) === */
.energy-theme {
    background-color: #fffbeb;
}

/* Amber-50 */
.energy-theme .box-icon {
    color: #f59e0b;
}

.title-font {
    font-weight: 700;
    color: #92400e;
    font-size: 1.1rem;
}

.whisper-theme {
    background-color: #f1f5f9;
}

/* Slate-50 */
.whisper-theme .box-icon {
    color: #64748b;
}

.ritual-theme {
    background-color: #f0fdf4;
}

/* Green-50 */
.ritual-theme .box-icon {
    color: #4ade80;
}

.highlight-text {
    color: #166534;
    font-weight: 500;
}

/* === 4. Affirmation (修正版) === */
.spacer {
    height: 10px;
}

.affirmation-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px 20px;
    margin-top: 10px;
}

.quote-icon-top {
    font-size: 1.6rem;
    color: #d7ccc8;
    margin-bottom: 10px;
    opacity: 0.6;
}

.affirmation-text {
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 1.1rem;
    font-style: italic;
    color: #6d6d6d;
    line-height: 1.6;
    letter-spacing: 0.5px;
    font-weight: 500;
}

@media (max-width: 600px) {
    .zen-box {
        padding: 15px;
        gap: 12px;
    }

    .box-icon {
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>