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

                        <div class="edge-banner">
                            <div class="edge-icon-area">
                                <el-icon>
                                    <Trophy />
                                </el-icon>
                            </div>
                            <div class="edge-content">
                                <div class="edge-label">MARKET EDGE (市場優勢)</div>
                                <div class="edge-text">{{ role.info.edge }}</div>
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
                                    <el-tag v-for="(tag, idx) in role.info.style" :key="idx" effect="plain"
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
                                    <span v-for="(t, i) in role.info.targets" :key="i" class="target-badge">
                                        {{ t }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <el-divider border-style="dashed" class="divider-spacing" />

                        <div class="strategy-box">
                            <div class="st-header">
                                <el-icon>
                                    <TrendCharts />
                                </el-icon> 獲利方程式
                            </div>
                            <div class="st-content">{{ role.info.strategy }}</div>
                        </div>

                        <div class="risk-box">
                            <div class="risk-header">
                                <el-icon>
                                    <CircleCloseFilled />
                                </el-icon> 死亡螺旋 (Fatal Risk)
                            </div>
                            <div class="risk-content">{{ role.info.fatalRisk }}</div>
                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="disclaimer-box">
                <div class="disclaimer-header">
                    <el-icon>
                        <Warning />
                    </el-icon> 免責聲明 (Disclaimer)
                </div>
                <div class="disclaimer-content">
                    本報告僅為行為金融學之性格分析，<strong>不構成任何投資建議</strong>。金融市場存在高度風險，過去績效不代表未來表現。請務必獨立思考，並<strong>自行承擔所有盈虧責任</strong>。
                </div>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InfoFilled, Aim, TrendCharts, Warning, CircleCloseFilled, Trophy, Operation } from '@element-plus/icons-vue';
// 引入專屬資料檔
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

// 處理字串分割 (以防 style 不是陣列)
function getStyleTags(styleStr: string) {
    if (!styleStr) return [];
    if (styleStr.includes('/')) return styleStr.split('/').map(s => s.trim());
    if (styleStr.includes(' ')) return styleStr.split(' ').map(s => s.trim());
    return [styleStr];
}

// 整合資料
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

// 自動切換 Tab
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

/* 1. 市場優勢 (Edge Banner) - 漸層強調 */
.edge-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(90deg, #fff5f5, #ffffff);
    border: 1px solid #ffece8;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(245, 108, 108, 0.05);
}

.edge-icon-area {
    background: #f56c6c;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.edge-content {
    flex-grow: 1;
}

.edge-label {
    font-size: 0.7rem;
    color: #f56c6c;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 2px;
}

.edge-text {
    font-size: 1.05rem;
    font-weight: bold;
    color: #2c3e50;
    line-height: 1.4;
}

/* 2. Grid Section */
.grid-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

@media (max-width: 600px) {
    .grid-section {
        grid-template-columns: 1fr;
    }
}

.grid-item {
    background: #fcfcfc;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 12px;
}

.item-header {
    font-size: 0.9rem;
    font-weight: bold;
    color: #606266;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px dashed #e0e0e0;
    padding-bottom: 6px;
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
    background: #ffffff;
    color: #e6a23c;
    /* 金色文字 */
    border: 1px solid #fceccb;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.divider-spacing {
    margin: 10px 0;
}

/* 3. 獲利方程式 (Strategy Box) - 金色主題 */
.strategy-box {
    background: #fffbf0;
    /* 淺金背景 */
    border: 1px solid #faecd8;
    border-left: 4px solid #e6a23c;
    padding: 15px;
    border-radius: 6px;
}

.st-header {
    color: #b88230;
    font-weight: 800;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
}

.st-content {
    font-size: 0.95rem;
    color: #5e4d4d;
    line-height: 1.6;
    text-align: justify;
}

/* 4. 死亡螺旋 (Risk Box) - 深色主題 */
.risk-box {
    background: #2c3e50;
    color: #fff;
    padding: 15px;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
}

.risk-box::after {
    content: "!";
    position: absolute;
    right: -10px;
    bottom: -20px;
    font-size: 5rem;
    color: rgba(255, 255, 255, 0.05);
    font-weight: 900;
}

.risk-header {
    color: #f56c6c;
    font-weight: 800;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
}

.risk-content {
    font-size: 0.9rem;
    color: #ecf0f1;
    line-height: 1.5;
    z-index: 1;
    position: relative;
}

/* 免責聲明 */
.disclaimer-box {
    margin-top: 10px;
    padding: 12px 15px;
    background-color: #f4f4f5;
    border-top: 1px solid #e4e7ed;
    color: #909399;
}

.disclaimer-header {
    font-size: 0.8rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
    color: #606266;
}

.disclaimer-content {
    font-size: 0.7rem;
    line-height: 1.4;
    text-align: justify;
}

.disclaimer-content strong {
    color: #303133;
    font-weight: 600;
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