<template>
    <el-card class="hybrid-card" shadow="hover" v-if="result">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">✨ 靈魂雙核心 (Identity)</span>
                    <el-tooltip content="分析你的兩大主導人格及其混合狀態。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag size="small" effect="plain" round>性格解析</el-tag>
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
                        <span class="p-label" :style="{ color: result.primary.color }">{{ result.primary.name }} {{
                            result.primaryPercent }}%</span>
                        <span class="vs-label">VS</span>
                        <span class="s-label" :style="{ color: result.secondary.color }">
                            {{ hasSecondary ? `${result.secondary.name} ${100 - result.primaryPercent}%` : '純粹單核心' }}
                        </span>
                    </div>
                </div>

                <div class="insight-text">
                    <template v-if="hasSecondary">
                        你的大腦由 <strong>{{ result.primary.name }}</strong> 主導，但經常受到 <strong>{{ result.secondary.name
                        }}</strong> 的影響。
                        {{ getInsightText(result.primary.key, result.secondary.key) }}
                    </template>
                    <template v-else>
                        你的能量高度集中，是一位純粹的 <strong>{{ result.primary.name }}</strong>。你的決策模式非常一致，思維路徑專一且穩定。
                    </template>
                </div>
            </div>

            <el-divider border-style="dashed" class="divider-spacing" />

            <div class="profile-container" :class="{ 'single-mode': !hasSecondary }">

                <div class="role-card primary-card" :style="{ '--role-color': result.primary.color }">
                    <div class="role-badge">主顯人格</div>
                    <div class="role-header">
                        <div class="role-icon" :style="{ backgroundColor: result.primary.color }">{{
                            result.primary.name[0] }}
                        </div>
                        <div class="role-info">
                            <div class="role-name">{{ result.primary.name }}</div>
                            <div class="role-code">{{ result.primary.key }}</div>
                        </div>
                    </div>
                    <div class="role-desc">
                        {{ result.primary.details.description }}
                    </div>
                </div>

                <div class="role-card secondary-card" v-if="hasSecondary"
                    :style="{ '--role-color': result.secondary.color }">
                    <div class="role-badge">次顯人格</div>
                    <div class="role-header">
                        <div class="role-icon" :style="{ backgroundColor: result.secondary.color }">{{
                            result.secondary.name[0]
                        }}</div>
                        <div class="role-info">
                            <div class="role-name">{{ result.secondary.name }}</div>
                            <div class="role-code">{{ result.secondary.key }}</div>
                        </div>
                    </div>
                    <div class="role-desc">
                        {{ result.secondary.details.description }}
                    </div>
                </div>

            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
// 引入資料檔 (維持您原本的變數名或 import)
import { data } from './archetypes.data.js';

// --- 修改 Props 定義 ---
const props = defineProps<{
    primaryRole: string;       // 必填，例如 'Hunter'
    secondaryRole?: string;    // 選填
    primaryCount?: number;     // 選填，若父層有算票數可傳入，用於顯示比例
    secondaryCount?: number;   // 選填
}>();

// 角色定義表
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

const result = computed(() => {
    if (!props.primaryRole) return null;

    // 1. 獲取主顯與次顯的 Meta 資料 (顏色、中文名)
    const primaryMeta = archetypesList.find(a => a.key === props.primaryRole);
    const secondaryMeta = props.secondaryRole
        ? archetypesList.find(a => a.key === props.secondaryRole)
        : null;

    if (!primaryMeta) return null;

    // 2. 準備詳細描述資料 (從 data.js 撈取)
    const primaryDetails = data[props.primaryRole];
    // 若無次要角色，暫時用主角色填補避免報錯 (UI會隱藏)
    const secondaryDetails = props.secondaryRole ? data[props.secondaryRole] : data[props.primaryRole];

    // 3. 判斷是否有有效的次要角色
    // (有傳入 secondaryRole 且 與主角色不同)
    const hasSec = !!(props.secondaryRole && props.secondaryRole !== props.primaryRole);

    // 4. 計算百分比 (如果父層沒傳 Count，預設給一個漂亮的比例)
    let pPercent = 100;
    if (hasSec) {
        const pCount = props.primaryCount !== undefined ? props.primaryCount : 6; // 預設 6:4
        const sCount = props.secondaryCount !== undefined ? props.secondaryCount : 4;
        const total = pCount + sCount;
        pPercent = total > 0 ? Math.round((pCount / total) * 100) : 60;
    }

    // 組合最終物件
    return {
        primary: { ...primaryMeta, details: primaryDetails },
        secondary: hasSec && secondaryMeta
            ? { ...secondaryMeta, details: secondaryDetails }
            : { ...primaryMeta, details: primaryDetails }, // Fallback
        primaryPercent: pPercent,
        hasSecondary: hasSec
    };
});

const hasSecondary = computed(() => result.value?.hasSecondary ?? false);

// --- 文案邏輯 ---
function getInsightText(pKey: string, sKey: string) {
    if (pKey === sKey) return "你的能量非常集中，是該領域的純粹專家。";
    return "這意味著你的行為模式並非單一固定，而是在這兩種人格之間動態擺盪。這可能是特定情境下的「無意識切換」，也可能是決策時「內在摩擦」的來源。";
}
</script>

<style scoped>
.hybrid-card {
    margin-top: 20px;
    border-radius: 12px;
    background-color: #fff;
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

/* 1. 光譜條區域 */
.summary-section {
    padding: 0 5px;
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
    transition: width 0.8s ease;
}

.ratio-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    font-weight: bold;
}

.p-label {
    font-size: 1rem;
}

.s-label {
    font-size: 0.9rem;
    opacity: 0.8;
}

.vs-label {
    color: #C0C4CC;
    font-size: 0.8rem;
    font-weight: normal;
}

.insight-text {
    background: #f8f9fa;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #606266;
    line-height: 1.5;
    text-align: left;
}

.divider-spacing {
    margin: 20px 0;
}

/* 2. 左右對比容器 */
.profile-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

/* 單核心模式 */
.profile-container.single-mode {
    justify-content: center;
}

.profile-container.single-mode .role-card {
    max-width: 500px;
    width: 100%;
}

/* 角色卡片 */
.role-card {
    flex: 1;
    min-width: 280px;
    border: 1px solid #e4e7ed;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    background: #fff;
    border-top: 5px solid var(--role-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
}

.role-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.role-badge {
    background-color: var(--role-color);
    color: #fff;
    font-size: 0.75rem;
    padding: 2px 0;
    text-align: center;
    font-weight: bold;
    opacity: 0.9;
}

.role-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    border-bottom: 1px solid #f0f2f5;
}

.role-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 800;
    font-size: 1.2rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.role-info {
    display: flex;
    flex-direction: column;
}

.role-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #303133;
}

.role-code {
    font-size: 0.85rem;
    color: #909399;
    letter-spacing: 1px;
}

.role-desc {
    padding: 20px;
    font-size: 0.95rem;
    color: #555;
    line-height: 1.7;
    text-align: justify;
    background: #fdfdfd;
    height: 100%;
}
</style>