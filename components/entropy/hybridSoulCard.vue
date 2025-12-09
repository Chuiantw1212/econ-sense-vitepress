<template>
    <el-card class="hybrid-card" shadow="hover" v-if="result">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">✨ 靈魂雙核心 (Identity)</span>
                    <el-tooltip content="根據你勾選的關鍵字數量，分析你的兩大主導人格及其混合比例。" placement="top">
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
import { data } from './hybridSoulCard.data.js';

const props = defineProps<{
    selectedKeywords: Array<{ archetype: string }>
}>();

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
    if (!props.selectedKeywords || props.selectedKeywords.length === 0) return null;

    const counts: Record<string, number> = {};
    props.selectedKeywords.forEach(kw => {
        counts[kw.archetype] = (counts[kw.archetype] || 0) + 1;
    });

    const ranked = archetypesList.map(arch => ({
        ...arch,
        count: counts[arch.key] || 0,
        details: data[arch.key]
    })).sort((a, b) => b.count - a.count);

    const primary = ranked[0];
    const secondary = ranked[1];

    // 計算總數與百分比
    const total = primary.count + secondary.count || 1;
    const p1Percent = Math.round((primary.count / total) * 100);

    // 判斷次要角色是否存在 (票數需 > 0 且 與主角色不同)
    const validSecondary = secondary.count > 0 && secondary.key !== primary.key;

    return {
        primary,
        secondary: validSecondary ? secondary : primary,
        primaryPercent: p1Percent,
        hasSecondary: validSecondary
    };
});

const hasSecondary = computed(() => result.value?.hasSecondary ?? false);

// --- 文案邏輯修正 ---
function getInsightText(pKey: string, sKey: string) {
    if (pKey === sKey) return "你的能量非常集中，是該領域的純粹專家。";

    // 修正後的文案，強調「切換」與「內耗」，而非單純的手段/動機
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

.quote {
    position: absolute;
    top: 5px;
    left: 10px;
    font-size: 2.5rem;
    color: #f0f2f5;
    font-family: serif;
    z-index: 0;
}
</style>