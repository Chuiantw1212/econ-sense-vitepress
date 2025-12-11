<template>
    <el-card class="leverage-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">⚡ 財富槓桿 (Wealth Leverage)</span>
                    <el-tooltip content="分析如何利用你的天賦優勢，不靠販賣時間也能實現收入倍增。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#8e44ad" effect="dark" round style="border:none;">收入加速器</el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs v-model="activeTab" type="border-card" class="leverage-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            <span class="role-dot" :style="{ color: role.color }">●</span>
                            {{ index === 0 ? '主顯' : '次顯' }}：{{ role.nameZh }}
                        </span>
                    </template>

                    <div class="tab-inner">

                        <div class="lever-box">
                            <div class="lever-icon-area">
                                <el-icon class="lever-icon">
                                    <Lightning />
                                </el-icon>
                            </div>
                            <div class="lever-content">
                                <div class="lever-label">YOUR MULTIPLIER (乘數效應)</div>
                                <div class="lever-title">{{ role.info.leverageType }}</div>
                                <div class="lever-subtitle">× {{ role.info.multiplier }}</div>
                            </div>
                        </div>

                        <div class="desc-text">{{ role.info.desc }}</div>

                        <div class="strategy-box">
                            <div class="box-header">
                                <el-icon>
                                    <TrendCharts />
                                </el-icon> 如何規模化？ (Scaling Strategy)
                            </div>
                            <div class="box-content">
                                {{ role.info.scaling }}
                            </div>
                        </div>

                        <div class="partner-section">
                            <div class="divider-line">
                                <span class="divider-label">
                                    <el-icon>
                                        <UserFilled />
                                    </el-icon> 致富黃金搭檔
                                </span>
                            </div>

                            <div class="partner-card">
                                <div class="p-header">
                                    你需要一位 <strong>{{ role.info.partner }}</strong>
                                </div>
                                <div class="p-desc">
                                    {{ role.info.partnerDesc }}
                                </div>
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
import { InfoFilled, Lightning, TrendCharts, UserFilled } from '@element-plus/icons-vue';
// 引入資料檔
import { data } from './wealth_leverage.data.js';

const props = defineProps<{ primaryRole: string, secondaryRole?: string }>();
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
    if (props.primaryRole) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole],
            color: ARCHETYPE_COLORS[props.primaryRole],
            // @ts-ignore
            info: data[props.primaryRole]
        });
    }
    if (props.secondaryRole && props.secondaryRole !== props.primaryRole) {
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
.leverage-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
    /* 紫色側邊條，象徵倍增 */
    border-left: 5px solid #8e44ad;
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

/* Tabs */
.leverage-tabs {
    border: none;
    box-shadow: none;
}

.leverage-tabs :deep(.el-tabs__content) {
    padding: 15px 5px;
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

/* 1. Lever Box (核心支點) */
.lever-box {
    display: flex;
    background: linear-gradient(135deg, #6a1b9a, #4a148c);
    color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(142, 68, 173, 0.2);
}

.lever-icon-area {
    width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    font-size: 2.2rem;
    color: #e1bee7;
    /* 淡紫色 */
}

.lever-content {
    padding: 15px;
    flex-grow: 1;
}

.lever-label {
    font-size: 0.7rem;
    letter-spacing: 1.5px;
    opacity: 0.8;
    margin-bottom: 2px;
    color: #e1bee7;
}

.lever-title {
    font-size: 1.3rem;
    font-weight: 800;
    margin-bottom: 2px;
    color: #fff;
}

.lever-subtitle {
    font-size: 1rem;
    font-weight: bold;
    color: #ffeb3b;
    /* 黃色對比色 */
}

.desc-text {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    padding: 0 5px;
}

/* 2. Strategy Box */
.strategy-box {
    background: #f3e5f5;
    /* 淡紫背景 */
    border: 1px solid #e1bee7;
    border-radius: 8px;
    padding: 15px;
}

.box-header {
    color: #8e44ad;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.box-content {
    font-size: 0.95rem;
    color: #4a148c;
    line-height: 1.6;
    font-weight: 500;
}

/* 3. Partner Section */
.partner-section {
    margin-top: 10px;
}

.divider-line {
    position: relative;
    text-align: center;
    margin-bottom: 15px;
}

.divider-line::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #eee;
    z-index: 0;
}

.divider-label {
    position: relative;
    z-index: 1;
    background: #fff;
    padding: 0 15px;
    color: #909399;
    font-size: 0.85rem;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.partner-card {
    background: #fafafa;
    border: 1px dashed #ccc;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.p-header {
    font-size: 1.05rem;
    color: #303133;
    margin-bottom: 6px;
}

.p-header strong {
    color: #8e44ad;
}

.p-desc {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
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