<template>
    <el-card class="investment-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">📈 投資戰略 (Investment Strategy)</span>
                    <el-tooltip content="提供適合你神經原型的投資風格、具體標的與風險偏好。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#f56c6c" effect="dark" round style="border:none;">資產增值</el-tag>
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

                        <div class="top-section">
                            <div class="info-block style-block">
                                <div class="section-label">投資風格 (Style)</div>
                                <div class="style-content">
                                    <div class="main-style">{{ role.info.style }}</div>
                                    <div class="edge-text">{{ role.info.edge }}</div>
                                </div>
                            </div>

                            <div class="info-block target-block">
                                <div class="section-label">核心標的 (Targets)</div>
                                <div class="target-grid">
                                    <el-tag v-for="(t, i) in role.info.targets" :key="i" class="target-tag"
                                        effect="light" type="danger">
                                        <el-icon class="target-icon">
                                            <Aim />
                                        </el-icon> {{ t }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>

                        <el-divider border-style="dashed" />

                        <div class="bottom-section">
                            <div class="strategy-box">
                                <div class="box-header gold-text">
                                    <el-icon>
                                        <TrendCharts />
                                    </el-icon> 獲利方程式 (Winning Strategy)
                                </div>
                                <div class="box-content">{{ role.info.strategy }}</div>
                            </div>

                            <div class="risk-box">
                                <div class="box-header red-text">
                                    <el-icon>
                                        <WarningFilled />
                                    </el-icon> 死亡螺旋 (Fatal Risk)
                                </div>
                                <div class="box-content">{{ role.info.fatalRisk }}</div>
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
import { InfoFilled, Aim, TrendCharts, WarningFilled } from '@element-plus/icons-vue';
// 引入你的資料檔路徑，請確認路徑正確
import { data } from './wealth_investment.data.js';

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

// 整合資料邏輯
const displayRoles = computed(() => {
    const list = [];

    // 主顯
    if (props.primaryRole && data[props.primaryRole]) {
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

// 自動切換到第一個 Tab
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
    /* 左側紅色邊條 */
    border-left: 5px solid #f56c6c;
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

/* Tabs 優化 */
.wealth-tabs {
    border: none;
    box-shadow: none;
}

.wealth-tabs :deep(.el-tabs__content) {
    padding: 20px;
}

.tab-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: bold;
    color: #606266;
}

.role-dot {
    font-size: 1.2rem;
    line-height: 1;
}

.tab-inner {
    animation: fadeIn 0.4s ease-in-out;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 上半部：風格與標的 */
.top-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

@media (max-width: 768px) {
    .top-section {
        grid-template-columns: 1fr;
    }
}

.section-label {
    font-size: 0.85rem;
    color: #909399;
    font-weight: bold;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.style-content {
    background: #f9f9f9;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #eee;
}

.main-style {
    font-size: 1.1rem;
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px;
}

.edge-text {
    font-size: 0.9rem;
    color: #606266;
}

.target-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.target-tag {
    font-size: 0.9rem;
    padding: 6px 10px;
    height: auto;
}

.target-icon {
    margin-right: 4px;
}

/* 下半部：策略與風險 */
.bottom-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* 策略區塊 (金色系) */
.strategy-box {
    background: #fffbf0;
    border: 1px solid #faecd8;
    border-radius: 8px;
    padding: 16px;
    position: relative;
}

.strategy-box::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #e6a23c;
    /* Warning color */
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

.gold-text {
    color: #d48806;
}

/* 風險區塊 (紅色系) */
.risk-box {
    background: #fef0f0;
    border: 1px solid #fde2e2;
    border-radius: 8px;
    padding: 16px;
    position: relative;
}

.risk-box::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #f56c6c;
    /* Danger color */
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

.red-text {
    color: #f56c6c;
}

.box-header {
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.box-content {
    font-size: 0.95rem;
    color: #5e4d4d;
    /* 深褐色文字，閱讀舒適 */
    line-height: 1.6;
    text-align: justify;
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