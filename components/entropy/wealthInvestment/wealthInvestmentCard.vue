<template>
    <el-card class="investment-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">📈 投資戰略</span>
                    <el-tooltip content="提供適合你神經原型的投資風格、具體標的與風險偏好。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#fef0f0" effect="light" style="color: #f56c6c; border-color: #fde2e2;"
                    round>資產增值</el-tag>
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

                        <div class="edge-banner">
                            <div class="edge-icon-area">
                                <el-icon>
                                    <Trophy />
                                </el-icon>
                            </div>
                            <div class="edge-content">
                                <div class="edge-label">MARKET EDGE (市場優勢)</div>
                                <div class="edge-text">{{ role.info?.edge }}</div>
                            </div>
                        </div>

                        <div class="grid-section">
                            <div class="grid-item">
                                <div class="item-header">
                                    <el-icon>
                                        <Operation />
                                    </el-icon> 投資風格
                                </div>
                                <div class="tag-group">
                                    <el-tag v-for="(tag, idx) in role.info?.style" :key="idx" effect="plain"
                                        type="danger" class="style-tag">
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </div>

                            <div class="grid-item">
                                <div class="item-header">
                                    <el-icon>
                                        <Aim />
                                    </el-icon> 核心標的
                                </div>
                                <div class="target-list">
                                    <span v-for="(t, i) in role.info?.targets" :key="i" class="target-badge">
                                        {{ t }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <el-divider class="soft-divider" />

                        <div class="insights-container">

                            <div class="insight-row">
                                <div class="row-icon gold-icon">
                                    <el-icon>
                                        <TrendCharts />
                                    </el-icon>
                                </div>
                                <div class="row-content">
                                    <div class="row-title gold-text">獲利方程式 (Winning Formula)</div>
                                    <div class="row-text">{{ role.info?.strategy }}</div>
                                </div>
                            </div>

                            <div class="insight-row">
                                <div class="row-icon red-icon">
                                    <el-icon>
                                        <CircleCloseFilled />
                                    </el-icon>
                                </div>
                                <div class="row-content">
                                    <div class="row-title red-text">死亡螺旋 (Fatal Risk)</div>
                                    <div class="row-text">{{ role.info?.fatalRisk }}</div>
                                </div>
                            </div>

                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="footer-disclaimer">
                <el-icon>
                    <Warning />
                </el-icon>
                <span>本報告僅為行為金融學分析，<strong>不構成投資建議</strong>。投資有風險，請獨立判斷並自負盈虧。</span>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InfoFilled, Aim, TrendCharts, Warning, CircleCloseFilled, Trophy, Operation } from '@element-plus/icons-vue';

// [修正] 確保引用正確的資料檔
import { data } from './wealth_investment.data.js';

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

    // [修正] 移除所有 wealthManagementData 的引用，只使用 data

    // 主顯
    if (props.primaryRole && data && data[props.primaryRole]) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole],
            color: ARCHETYPE_COLORS[props.primaryRole],
            // @ts-ignore
            info: data[props.primaryRole]
        });
    }

    // 次顯
    if (props.secondaryRole &&
        props.secondaryRole !== props.primaryRole &&
        data &&
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

watch(displayRoles, (newVal) => {
    if (newVal.length > 0 && !activeTab.value) {
        activeTab.value = newVal[0].key;
    }
}, { immediate: true });

</script>

<style scoped>
.investment-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
    border-left: 5px solid #f56c6c;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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

/* Tabs */
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
    gap: 20px;
}

/* 1. Market Edge Banner */
.edge-banner {
    display: flex;
    align-items: center;
    gap: 15px;
    background: linear-gradient(90deg, #fff5f5, #ffffff);
    border: 1px solid #ffece8;
    padding: 15px 20px;
    border-radius: 8px;
}

.edge-icon-area {
    background: #f56c6c;
    color: white;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
}

.edge-label {
    font-size: 0.75rem;
    color: #f56c6c;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.edge-text {
    font-size: 1.1rem;
    font-weight: 900;
    color: #2c3e50;
    line-height: 1.3;
}

/* 2. Grid Section */
.grid-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.grid-item {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #f0f0f0;
}

.item-header {
    font-size: 0.9rem;
    font-weight: 800;
    color: #909399;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding-bottom: 5px;
    border-bottom: 1px dashed #e0e0e0;
}

.tag-group {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.style-tag {
    font-weight: bold;
    border-radius: 4px;
}

.target-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.target-badge {
    background: #fff;
    color: #e6a23c;
    border: 1px solid #fceccb;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
}

.soft-divider {
    margin: 5px 0;
    border-top: 1px dashed #eee;
}

/* 3. Insights Container */
.insights-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.insight-row {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 5px 0;
}

.row-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 2px;
}

.gold-icon {
    background: #fdf6ec;
    color: #e6a23c;
}

.red-icon {
    background: #fef0f0;
    color: #f56c6c;
}

.row-content {
    flex-grow: 1;
}

.row-title {
    font-size: 0.95rem;
    font-weight: 800;
    margin-bottom: 5px;
    letter-spacing: 0.5px;
}

.gold-text {
    color: #d48806;
}

.red-text {
    color: #c0392b;
}

.row-text {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    text-align: justify;
}

/* 4. Footer Disclaimer */
.footer-disclaimer {
    margin-top: 5px;
    padding: 15px 20px;
    border-top: 1px solid #f0f0f0;
    color: #999;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
}

.footer-disclaimer strong {
    color: #666;
    font-weight: 600;
}

@media (max-width: 600px) {
    .grid-section {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .edge-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .insight-row {
        flex-direction: column;
        gap: 8px;
    }

    .row-icon {
        width: auto;
        height: auto;
        background: transparent;
        padding: 0;
        justify-content: flex-start;
    }

    .footer-disclaimer {
        flex-direction: column;
        text-align: center;
        line-height: 1.4;
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