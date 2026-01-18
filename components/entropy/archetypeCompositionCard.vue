<template>
    <el-card class="composition-card" shadow="hover" v-if="hasData">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🧬 靈魂光譜分析</span>
                    <el-tooltip content="解構你的人格化學成分。第一條代表你的核心驅動力，其他則是你的輔助特質。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag type="info" effect="plain" round size="small">
                    成分解構
                </el-tag>
            </div>
        </template>

        <div class="card-content">

            <div class="summary-section">
                <div class="summary-title">
                    你的靈魂混色：<span :style="{ color: dominantColor }">{{ dominantRoleName }}主導的{{ mixType }}</span>
                </div>
                <div class="summary-text">
                    {{ barnumText }}
                </div>
            </div>

            <el-divider border-style="dashed" class="divider-spacing" />

            <div class="composition-list">
                <div v-for="item in sortedComposition" :key="item.key" class="comp-item">
                    <div class="comp-info">
                        <span class="comp-label">
                            <span class="role-icon">{{ item.icon }}</span>
                            <span>{{ item.name }}</span>
                        </span>
                        <span class="comp-value">{{ item.percentage }}%</span>
                    </div>

                    <div class="comp-bar-bg">
                        <div class="comp-bar-fill" :style="{
                            width: getRelativeWidth(item.count) + '%',
                            background: item.color
                        }"></div>
                    </div>
                </div>
            </div>

            <div class="footer-note">
                <el-icon>
                    <MagicStick />
                </el-icon>
                <span>正是這些看似矛盾的成分，構成了完整的你。</span>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled, MagicStick } from '@element-plus/icons-vue';

// --- 1. 定義介面與 Props ---
interface IVector {
    x: number;
    y: number;
    z: number;
}

interface IKeyword {
    id: number;
    keyword_zh: string;
    keyword_en: string;
    archetype: string;
    vector: IVector;
}

const props = defineProps<{
    selectedKeywords: IKeyword[];
    // 接收父層計算出的真正第一名 (權重共振結果)
    primaryRole?: string;
}>();

// --- 2. 配置設定 (加入 Icon) ---
const ARCHETYPE_CONFIG: Record<string, { name: string, color: string, icon: string }> = {
    'Hunter': { name: '獵人', color: '#FF4500', icon: '🏹' }, // IRH
    'Pioneer': { name: '先驅', color: '#FF8C00', icon: '🧭' }, // IVH
    'Toolmaker': { name: '工匠', color: '#1E90FF', icon: '🛠' }, // IRC
    'Sentry': { name: '哨兵', color: '#00008B', icon: '🛡️' }, // IVC
    'Gatherer': { name: '採集者', color: '#32CD32', icon: '🍇' }, // ORH
    'Shaman': { name: '薩滿', color: '#9370DB', icon: '🦋' }, // OVH
    'Helper': { name: '助人者', color: '#20B2AA', icon: '🫂' }, // ORC
    'Elder': { name: '長老', color: '#2E8B57', icon: '🌳' }  // OVC
};

// --- 3. 計算邏輯 ---
const composition = computed(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    // 初始化
    Object.keys(ARCHETYPE_CONFIG).forEach(key => counts[key] = 0);

    // 統計
    props.selectedKeywords.forEach(k => {
        const roleKey = k.archetype;
        if (ARCHETYPE_CONFIG[roleKey]) {
            counts[roleKey]++;
            total++;
        }
    });

    if (total === 0) return [];

    // 轉換並排序
    return Object.entries(counts)
        .map(([key, count]) => ({
            key,
            name: ARCHETYPE_CONFIG[key].name,
            color: ARCHETYPE_CONFIG[key].color,
            icon: ARCHETYPE_CONFIG[key].icon, // 加入 Icon
            percentage: Math.round((count / total) * 100),
            count
        }))
        .sort((a, b) => {
            // 霸王條款：如果 a 是父層指定的 Primary Role，絕對置頂
            if (props.primaryRole && a.key === props.primaryRole) return -1;
            if (props.primaryRole && b.key === props.primaryRole) return 1;

            // 否則依照百分比(數量)降序
            return b.percentage - a.percentage;
        });
});

const sortedComposition = computed(() => composition.value);
const hasData = computed(() => sortedComposition.value.length > 0);

// 取出第一名數據
const dominantRole = computed(() => sortedComposition.value[0]);
const dominantRoleName = computed(() => dominantRole.value?.name || '未知');
const dominantColor = computed(() => dominantRole.value?.color || '#333');

// 計算最大票數 (為了長條圖比例)
const maxCount = computed(() => {
    if (sortedComposition.value.length === 0) return 1;
    return Math.max(...sortedComposition.value.map(item => item.count));
});

// 計算相對寬度的 Helper
const getRelativeWidth = (count: number) => {
    if (maxCount.value === 0) return 0;
    return (count / maxCount.value) * 100;
};

// --- 4. 巴納姆文案 ---
const mixType = computed(() => {
    const list = sortedComposition.value;
    if (list.length === 0) return '';

    const top1 = list[0];
    const activeRolesCount = list.filter(i => i.count > 0).length;

    if (top1.percentage >= 50) return '極致純粹體';
    if (activeRolesCount >= 5 && top1.percentage < 25) return '高熵混沌體';
    return '複合共生體';
});

const barnumText = computed(() => {
    const list = sortedComposition.value;
    if (list.length === 0) return '';

    const top1 = list[0];
    const top2 = list[1];
    const activeRolesCount = list.filter(i => i.count > 0).length;

    if (top1.percentage >= 50) {
        return `你的靈魂中流淌著純粹的${top1.name}血液。這種極致的專注力是你的天賦，但也可能讓你對其他觀點產生盲點。你不是不能理解別人，而是你選擇了極致的道路。`;
    }

    if (top2 && (Math.abs(top1.percentage - top2.percentage) < 20)) {
        return `你的內在住著兩個截然不同的靈魂：${top1.name}的渴望與${top2.name}的特質在你體內持續對話。這種內在張力讓你時常感到矛盾，但這正是你創造力的來源——你能在不同觀點間自由切換。`;
    }

    if (activeRolesCount >= 5) {
        return `你是一個極其複雜的多面體。你拒絕被單一標籤定義，在不同場合下，你會靈活調用${top1.name}、${top2?.name}甚至更多面向來適應環境。你的適應力極強，但也容易感到迷失。`;
    }

    return `以${top1.name}為核心，輔以${top2?.name}的特質。你大體上清楚自己的方向，但偶爾會被次要人格的衝動所影響。這種微小的雜訊，反而讓你看起來更具人性魅力。`;
});

</script>

<style scoped>
.composition-card {
    margin-top: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
    font-weight: 800;
    font-size: 1.1rem;
    color: #303133;
}

.info-icon {
    font-size: 14px;
    color: #bdbdbd;
    cursor: help;
}

.divider-spacing {
    margin: 20px 0;
}

/* Summary Section */
.summary-section {
    text-align: left;
    padding: 5px 0;
}

.summary-title {
    font-size: 1.1rem;
    font-weight: 900;
    margin-bottom: 8px;
    color: #303133;
}

.summary-text {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    text-align: justify;
    font-style: italic;
}

/* Composition List */
.composition-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.comp-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.comp-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    font-weight: 700;
    color: #606266;
}

.comp-label {
    display: flex;
    align-items: center;
    gap: 6px;
    /* 調整間距 */
}

/* 新增：Icon 樣式 */
.role-icon {
    font-size: 1.1rem;
    line-height: 1;
    display: inline-block;
    width: 20px;
    /* 固定寬度確保對齊 */
    text-align: center;
}

/* 移除原本的 .dot 樣式，因為用 Icon 取代了 */

.comp-bar-bg {
    width: 100%;
    height: 10px;
    background: #f0f2f5;
    border-radius: 6px;
    overflow: hidden;
}

.comp-bar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 1s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Footer */
.footer-note {
    margin-top: 25px;
    font-size: 0.8rem;
    color: #909399;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    opacity: 0.8;
}

@media (max-width: 600px) {
    .summary-title {
        font-size: 1rem;
    }
}
</style>