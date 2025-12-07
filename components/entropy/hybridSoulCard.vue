<template>
    <el-card class="hybrid-card" shadow="hover" v-if="result">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">✨ 靈魂雙核心</span>
                    <el-tooltip content="根據你勾選的關鍵字數量，分析你的兩大主導人格" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag size="small" effect="plain" round>混合光譜</el-tag>
            </div>
        </template>

        <div class="hybrid-content">
            <div class="role-battle">

                <div class="role primary">
                    <div class="avatar-wrapper">
                        <div class="avatar" :style="{ backgroundColor: result.primary.color }">
                            {{ result.primary.name[0] }}
                        </div>
                        <div class="count-badge" :style="{ borderColor: result.primary.color }">
                            {{ result.primary.count }}
                        </div>
                    </div>
                    <div class="role-info">
                        <h3>{{ result.primary.name }}</h3>
                        <span class="role-desc">主導人格</span>
                    </div>
                </div>

                <div class="connection-bar">
                    <div class="bar-container">
                        <div class="bar-fill" :style="{
                            width: result.primaryPercent + '%',
                            background: `linear-gradient(90deg, ${result.primary.color}, ${result.secondary.color})`
                        }"></div>
                    </div>
                    <div class="ratio-labels">
                        <span :style="{ color: result.primary.color }">{{ result.primaryPercent }}%</span>
                        <span class="vs">VS</span>
                        <span :style="{ color: result.secondary.color }">{{ 100 - result.primaryPercent }}%</span>
                    </div>
                </div>

                <div class="role secondary">
                    <div class="role-info">
                        <h3>{{ result.secondary.name }}</h3>
                        <span class="role-desc">次要人格</span>
                    </div>
                    <div class="avatar-wrapper">
                        <div class="avatar" :style="{ backgroundColor: result.secondary.color }">
                            {{ result.secondary.name[0] }}
                        </div>
                        <div class="count-badge secondary" :style="{ borderColor: result.secondary.color }">
                            {{ result.secondary.count }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="analysis-text">
                <p>
                    在你的選擇中，有 <strong>{{ result.primary.count }}</strong> 個關鍵字屬於 <span
                        :style="{ color: result.primary.color, fontWeight: 'bold' }">{{ result.primary.name }}</span>，
                    解釋了你 {{ result.primaryPercent }}% 的顯性特質；
                    另有 <strong>{{ result.secondary.count }}</strong> 個關鍵字指向 <span
                        :style="{ color: result.secondary.color, fontWeight: 'bold' }">{{ result.secondary.name
                        }}</span>。
                </p>
                <p class="insight">
                    {{ getInsightText(result.primary.key, result.secondary.key) }}
                </p>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';

// --- Props: 改為接收使用者選的所有關鍵字 ---
const props = defineProps<{
    selectedKeywords: Array<{ archetype: string }> // 只需要知道 archetype 欄位
}>();

// --- 8 大角色定義 (Key 必須對應 JSON 中的 archetype) ---
const archetypes = [
    { key: 'Hunter', name: '獵人', color: '#FF4500' },     // IRH
    { key: 'Pioneer', name: '先驅', color: '#FF8C00' },    // IVH
    { key: 'Toolmaker', name: '工匠', color: '#1E90FF' },  // IRC
    { key: 'Sentry', name: '哨兵', color: '#00008B' },     // IVC
    { key: 'Gatherer', name: '採集者', color: '#32CD32' }, // ORH
    { key: 'Shaman', name: '薩滿', color: '#9370DB' },     // OVH
    { key: 'Helper', name: '助人者', color: '#20B2AA' },   // ORC
    { key: 'Elder', name: '長老', color: '#2E8B57' },      // OVC
];

// --- 核心邏輯 ---
const result = computed(() => {
    if (!props.selectedKeywords || props.selectedKeywords.length === 0) return null;

    // 1. 計數 (Counting)
    const counts: Record<string, number> = {};
    props.selectedKeywords.forEach(kw => {
        // 累加每個角色出現的次數
        counts[kw.archetype] = (counts[kw.archetype] || 0) + 1;
    });

    // 2. 排序 (Ranking)
    // 將計數結果映射回角色定義，並由大到小排序
    const ranked = archetypes.map(arch => ({
        ...arch,
        count: counts[arch.key] || 0
    })).sort((a, b) => b.count - a.count);

    const primary = ranked[0];
    const secondary = ranked[1];

    // 3. 計算相對比例 (Relative Percentage)
    // 只計算前兩名的相對強度，用於顯示拉鋸戰
    const totalTop2 = primary.count + secondary.count;
    const safeTotal = totalTop2 === 0 ? 1 : totalTop2; // 避免除以零

    const p1Percent = Math.round((primary.count / safeTotal) * 100);

    return {
        primary,
        secondary,
        primaryPercent: p1Percent
    };
});

// --- 動態產生洞察文案 ---
function getInsightText(pKey: string, sKey: string) {
    if (pKey === sKey) return "你的特質非常集中，是一位純粹的專家。";
    // 這裡可以擴充更多組合邏輯，例如：
    // if ((pKey==='Hunter' && sKey==='Shaman') || (pKey==='Shaman' && sKey==='Hunter')) return "你同時擁有極強的競爭心與共情力，是罕見的矛盾綜合體。";
    return "這兩種角色構成了你的核心動力循環：前者決定目標，後者協助手段。";
}
</script>

<style scoped>
.hybrid-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    overflow: visible;
    /* 讓 badge 可以凸出去 */
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

.role-battle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0;
}

.role {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.role.secondary {
    justify-content: flex-end;
    text-align: right;
    flex-direction: row-reverse;
    /* 讓頭像在最右邊 */
}

.role-info h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #303133;
}

.role-desc {
    font-size: 12px;
    color: #909399;
}

/* 頭像與計數標籤 */
.avatar-wrapper {
    position: relative;
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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.count-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #fff;
    color: #303133;
    border: 2px solid;
    /* border color 由 inline style 控制 */
    font-size: 12px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 中間連接條 */
.connection-bar {
    flex: 1.5;
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bar-container {
    width: 100%;
    height: 6px;
    background-color: #f2f3f5;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
}

.bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    /* 彈跳動畫 */
}

.ratio-labels {
    display: flex;
    gap: 8px;
    font-size: 12px;
    font-weight: bold;
    align-items: center;
}

.vs {
    color: #C0C4CC;
    font-size: 10px;
    font-weight: normal;
}

.analysis-text {
    background: #f8f9fa;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.6;
    color: #606266;
}

.insight {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #e4e7ed;
    color: #303133;
}
</style>