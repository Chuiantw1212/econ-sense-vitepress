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

                        <div class="style-section">
                            <div class="section-label">投資風格</div>
                            <div class="tag-group">
                                <el-tag v-for="(tag, idx) in getStyleTags(role.info.style)" :key="idx" effect="plain"
                                    type="danger" class="style-tag">
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </div>

                        <div class="target-section">
                            <div class="section-label">核心標的</div>
                            <div class="target-grid">
                                <div v-for="(t, i) in role.info.targets" :key="i" class="target-item">
                                    <el-icon class="target-icon">
                                        <Aim />
                                    </el-icon> {{ t }}
                                </div>
                            </div>
                        </div>

                        <el-divider border-style="dashed" />

                        <div class="strategy-box">
                            <div class="st-title">
                                <el-icon>
                                    <TrendCharts />
                                </el-icon> 獲利方程式
                            </div>
                            <div class="st-content">{{ role.info.strategy }}</div>
                        </div>

                        <div class="risk-box">
                            <div class="risk-title">
                                <el-icon>
                                    <WarningFilled />
                                </el-icon> 死亡螺旋 (Fatal Risk)
                            </div>
                            <div class="risk-content">{{ role.info.fatalRisk }}</div>
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

// 安全處理 split
function getStyleTags(styleStr: string) {
    if (!styleStr) return [];
    return styleStr.split(' / ');
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
    /* 紅色側邊條，象徵進攻與獲利 */
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

/* Labels */
.section-label {
    font-size: 0.85rem;
    color: #909399;
    font-weight: bold;
    margin-bottom: 8px;
}

/* 1. 風格標籤 */
.tag-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.style-tag {
    border-radius: 4px;
    font-weight: bold;
}

/* 2. 標的列表 */
.target-grid {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.target-item {
    background: #fdfcfc;
    border: 1px solid #eee;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.95rem;
    color: #303133;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
}

.target-icon {
    color: #f56c6c;
}

/* 3. 策略區塊 (金色) */
.strategy-box {
    background: #fff8e6;
    border: 1px solid #faecd8;
    padding: 15px;
    border-radius: 8px;
}

.st-title {
    color: #d48806;
    font-weight: bold;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
}

.st-content {
    font-size: 0.95rem;
    color: #5e4d4d;
    line-height: 1.6;
    font-weight: 500;
    text-align: justify;
}

/* 4. 風險區塊 (淡紅) */
.risk-box {
    background: #fef0f0;
    border: 1px solid #fde2e2;
    padding: 12px;
    border-radius: 8px;
}

.risk-title {
    color: #f56c6c;
    font-weight: bold;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
}

.risk-content {
    font-size: 0.9rem;
    color: #606266;
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