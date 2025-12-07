<template>
    <el-card class="hybrid-card" shadow="hover" v-if="result">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">✨ 靈魂雙核心</span>
                    <el-tooltip content="根據你勾選的關鍵字數量，分析你的兩大主導人格及其混合比例。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag size="small" effect="plain" round>混合光譜</el-tag>
            </div>
        </template>

        <div class="hybrid-content">

            <div class="summary-section">
                <div class="connection-bar">
                    <div class="bar-container">
                        <div class="bar-fill" :style="{
                            width: '100%',
                            background: `linear-gradient(90deg, ${result.primary.color}, ${result.secondary.color})`
                        }"></div>
                    </div>
                    <div class="ratio-labels">
                        <span :style="{ color: result.primary.color }">{{ result.primary.name }} {{
                            result.primaryPercent
                            }}%</span>
                        <span class="vs">VS</span>
                        <span :style="{ color: result.secondary.color }">{{ result.secondary.name }} {{ 100 -
                            result.primaryPercent }}%</span>
                    </div>
                </div>

                <div class="analysis-text">
                    <p>
                        你的大腦由 <strong :style="{ color: result.primary.color }">{{ result.primary.name }}</strong> 主導，
                        但同時融合了 <strong :style="{ color: result.secondary.color }">{{ result.secondary.name }}</strong>
                        的特質。
                        {{ getInsightText(result.primary.key, result.secondary.key) }}
                    </p>
                </div>
            </div>

            <el-divider border-style="dashed" class="divider-spacing" />

            <el-tabs v-model="activeTab" type="border-card" class="role-tabs">

                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <div class="tab-label">
                            <span class="role-icon" :style="{ color: role.color }">●</span>
                            <span>{{ index === 0 ? '主顯' : '次顯' }}：{{ role.name }}</span>
                        </div>
                    </template>

                    <div class="role-detail">
                        <div class="role-header">
                            <div class="avatar" :style="{ backgroundColor: role.color }">
                                {{ role.name[0] }}
                            </div>
                            <div class="role-title">
                                <h3>{{ role.name }}</h3>
                                <span class="role-eng">{{ role.key }}</span>
                            </div>
                            <div class="count-tag">
                                選中 {{ role.count }} 個關鍵字
                            </div>
                        </div>

                        <div class="strategy-grid">

                            <div class="strategy-box career">
                                <div class="box-header">
                                    <el-icon>
                                        <Briefcase />
                                    </el-icon> 適合賽道 (Career)
                                </div>
                                <div class="box-content">
                                    {{ role.details.career }}
                                </div>
                            </div>

                            <div class="strategy-box wealth">
                                <div class="box-header">
                                    <el-icon>
                                        <Money />
                                    </el-icon> 財務策略 (Wealth)
                                </div>
                                <div class="box-content">
                                    {{ role.details.wealth }}
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
import { InfoFilled, Briefcase, Money } from '@element-plus/icons-vue';
// 假定此檔案存在，且內容為上次更新的 archetypeDetails
import { data } from './hybridSoulCard.data.js';

// --- Props ---
const props = defineProps<{
    selectedKeywords: Array<{ archetype: string }>
}>();

// --- 狀態 ---
const activeTab = ref('');

// --- 8 大角色基礎定義 (僅用於顏色和名稱映射) ---
const archetypesList = [
    { key: 'Hunter', name: '獵人', color: '#FF4500' },
    { key: 'Pioneer', name: '先驅', color: '#FF8C00' },
    { key: 'Toolmaker', name: '工匠', color: '#1E90FF' },
    { key: 'Sentry', name: '哨兵', color: '#00008B' },
    { key: 'Gatherer', name: '採集者', color: '#32CD32' },
    { key: 'Shaman', name: '薩滿', color: '#9370DB' },
    { key: 'Helper', name: '助人者', color: '#20B2AA' },
    { key: 'Elder', name: '長老', color: '#2E8B57' },
];

// --- 核心邏輯：計算計數與比例 ---
const result = computed(() => {
    if (!props.selectedKeywords || props.selectedKeywords.length === 0) return null;

    // 1. 計數
    const counts: Record<string, number> = {};
    props.selectedKeywords.forEach(kw => {
        counts[kw.archetype] = (counts[kw.archetype] || 0) + 1;
    });

    // 2. 排序
    const ranked = archetypesList.map(arch => ({
        ...arch,
        count: counts[arch.key] || 0,
        details: data[arch.key] // 綁定詳細資料
    })).sort((a, b) => b.count - a.count);

    const primary = ranked[0];
    const secondary = ranked[1];

    // 3. 計算比例
    const totalTop2 = primary.count + secondary.count;
    const safeTotal = totalTop2 === 0 ? 1 : totalTop2;
    const p1Percent = Math.round((primary.count / safeTotal) * 100);

    return { primary, secondary, primaryPercent: p1Percent };
});

const displayRoles = computed(() => {
    if (!result.value) return [];
    // 確保次要角色有貢獻 (計數 > 0) 且不與主要角色重複 (避免兩人同分但只顯示一人)
    const list = [result.value.primary];

    if (result.value.secondary.count > 0 && result.value.secondary.key !== result.value.primary.key) {
        list.push(result.value.secondary);
    }
    return list;
});

// 當結果變更時，預設選中主顯角色
watch(result, (newVal) => {
    if (newVal) {
        activeTab.value = newVal.primary.key;
    }
}, { immediate: true });

function getInsightText(pKey: string, sKey: string) {
    if (pKey === sKey) return "你的能量非常集中，是該領域的純粹專家，建議深化單一賽道優勢。";
    return "主顯角色決定了你的「進攻方向」，次顯角色則是你的「輔助技能」或「防禦底線」。";
}
</script>

<style scoped>
.hybrid-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    background-color: #fff;
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

/* 頂部總覽區 */
.summary-section {
    padding: 0 10px;
}

.connection-bar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
}

.bar-container {
    width: 100%;
    height: 8px;
    background-color: #f2f3f5;
    border-radius: 4px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ratio-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    font-weight: bold;
}

.vs {
    color: #C0C4CC;
    font-size: 0.8rem;
    font-weight: normal;
}

.analysis-text {
    background: #f8f9fa;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #606266;
    line-height: 1.5;
}

.divider-spacing {
    margin: 20px 0;
}

/* Tabs 樣式 */
.role-tabs {
    box-shadow: none;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    background: #fff;
}

.tab-label {
    display: flex;
    align-items: center;
    gap: 6px;
}

.role-icon {
    font-size: 1.2rem;
    line-height: 1;
}

/* 角色詳情 */
.role-detail {
    padding: 10px 5px;
}

.role-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.role-title h3 {
    margin: 0px !important;
    font-size: 1.2rem;
    color: #303133;
}

.role-eng {
    font-size: 0.85rem;
    color: #909399;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.count-tag {
    margin-left: auto;
    font-size: 0.85rem;
    color: #606266;
    background: #f4f4f5;
    padding: 4px 10px;
    border-radius: 12px;
}

/* 策略網格 */
.strategy-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.strategy-box {
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid;
}

.strategy-box.career {
    background: rgba(64, 158, 255, 0.08);
    border-color: #409EFF;
}

.strategy-box.wealth {
    background: rgba(230, 162, 60, 0.08);
    border-color: #E6A23C;
}

.box-header {
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
}

.career .box-header {
    color: #409EFF;
}

.wealth .box-header {
    color: #E6A23C;
}

.box-content {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    text-align: justify;
}
</style>