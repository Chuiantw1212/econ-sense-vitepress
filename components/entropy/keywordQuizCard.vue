<template>
    <el-card class="neo-brutalist-card" shadow="never">

        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title-text">直覺勾選</span>
                    <div class="counter-pill" :class="{ 'is-active': selectedCount >= 10 }">
                        {{ selectedCount }} / 20
                    </div>
                </div>
                <el-button class="reset-btn" size="small" @click="resetTest" round>
                    重置
                </el-button>
            </div>
        </template>

        <div class="grid-container">
            <el-checkbox-group v-model="internalSelected" @change="debouncedUpdate" class="neo-grid">
                <el-checkbox v-for="item in visibleKeywords" :key="item.keyword_zh" :label="item.keyword_zh"
                    :value="item" class="neo-tile">
                    <span class="tile-text">{{ item.keyword_zh }}</span>
                </el-checkbox>
            </el-checkbox-group>
        </div>

        <div v-if="!isExpanded" class="expand-bar" @click="isExpanded = true">
            <span class="expand-text">顯示更多 ▼</span>
        </div>
        <div v-else class="footer-hint">
            已顯示全部
        </div>

    </el-card>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue';
// 請確認資料路徑
import { data } from './keywords.data.js';

// --- Emit ---
const emit = defineEmits<{
    (e: 'update', payload: AnalysisResult): void
}>();

// --- Types ---
interface Vector3 { x: number; y: number; z: number; }
interface KeywordItem { id: number; keyword_zh: string; archetype: string; vector: Vector3; }
interface AnalysisResult {
    keywords: KeywordItem[];
    dimension: Vector3 | null;
    archetypes: { primary: string; secondary: string | undefined; };
}

// --- State ---
const shuffledKeywords = shallowRef<KeywordItem[]>([]);
const internalSelected = ref<KeywordItem[]>([]);
const isExpanded = ref(false);

const selectedCount = computed(() => internalSelected.value.length);

const visibleKeywords = computed(() => {
    if (isExpanded.value) return shuffledKeywords.value;
    // 保持 4 的倍數
    const limit = Math.ceil(shuffledKeywords.value.length / 2);
    return shuffledKeywords.value.slice(0, Math.ceil(limit / 4) * 4);
});

// --- Init ---
onMounted(() => {
    initKeywords();
});

function initKeywords() {
    const rawData = data.keywords || [];
    const uniqueMap = new Map();
    rawData.forEach((item: any) => {
        if (item?.keyword_zh) {
            const k = item.keyword_zh.trim();
            if (!uniqueMap.has(k)) uniqueMap.set(k, { ...item, keyword_zh: k });
        }
    });

    const groups: Record<string, KeywordItem[]> = {};
    Array.from(uniqueMap.values()).forEach((item: any) => {
        if (!groups[item.archetype]) groups[item.archetype] = [];
        groups[item.archetype].push(item);
    });

    let visiblePool: KeywordItem[] = [];
    let hiddenPool: KeywordItem[] = [];

    Object.keys(groups).forEach(key => {
        const items = shuffle(groups[key]);
        const mid = Math.ceil(items.length / 2);
        visiblePool = visiblePool.concat(items.slice(0, mid));
        hiddenPool = hiddenPool.concat(items.slice(mid));
    });

    shuffledKeywords.value = [...shuffle(visiblePool), ...shuffle(hiddenPool)]
        .map((item, idx) => ({ ...item, id: idx }));
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// --- Calculation ---
function performCalculation() {
    const selected = internalSelected.value;
    if (selected.length === 0) {
        emit('update', { keywords: [], dimension: null, archetypes: { primary: '', secondary: undefined } });
        return;
    }

    let totalVec = { x: 0, y: 0, z: 0 };
    const counts: Record<string, number> = {};

    selected.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
        counts[kw.archetype] = (counts[kw.archetype] || 0) + 1;
    });

    const count = selected.length;
    const dimensionScore = { x: totalVec.x / count, y: totalVec.y / count, z: totalVec.z / count };

    const sortedRoles = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    emit('update', {
        keywords: [...selected],
        dimension: dimensionScore,
        archetypes: {
            primary: sortedRoles[0] ? sortedRoles[0][0] : '',
            secondary: (sortedRoles[1] && sortedRoles[1][1] > 0) ? sortedRoles[1][0] : undefined
        }
    });
}

function debounce(fn: Function, delay: number) {
    let timeoutId: any = null;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
const debouncedUpdate = debounce(performCalculation, 500);

function resetTest() {
    internalSelected.value = [];
    isExpanded.value = false;
    initKeywords();
    performCalculation();
}
</script>

<style scoped lang="scss">
/* --- 1. Neo-Brutalist Card --- */
.neo-brutalist-card {
    border-radius: 16px !important;
    border: 2px solid #303133 !important;
    box-shadow: 4px 4px 0px #303133 !important;
    margin-bottom: 24px;
    background-color: #fff;
    overflow: hidden;

    :deep(.el-card__header) {
        padding: 12px 16px;
        background-color: #fff;
        border-bottom: 2px solid #303133;
    }

    :deep(.el-card__body) {
        padding: 0 !important;
    }
}

/* --- 2. Header --- */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-text {
    font-weight: 800;
    font-size: 1.1rem;
    color: #303133;
}

.counter-pill {
    font-size: 0.9rem;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 20px;
    background: #f3f4f6;
    color: #909399;
    border: 1px solid #dcdfe6;
    transition: all 0.3s;

    &.is-active {
        background: #303133;
        color: #fff;
        border-color: #303133;
    }
}

.reset-btn {
    font-weight: 700 !important;
    border: 2px solid #303133 !important;
    color: #303133 !important;

    &:hover {
        background: #303133 !important;
        color: #fff !important;
    }
}

/* --- 3. Grid Layout (4 Columns) --- */
.grid-container {
    width: 100%;
}

.neo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    width: 100%;
}

/* --- 4. Tile (扁平化設計) --- */
.neo-tile {
    width: 100%;
    margin: 0 !important;
    border-radius: 0 !important;
    padding: 0 !important;

    /* 關鍵修改：固定高度，不再使用 aspect-ratio */
    height: 52px !important;

    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
    transition: all 0.15s ease-out;

    :deep(.el-checkbox__input) {
        display: none !important;
    }

    /* Label 文字區域 */
    :deep(.el-checkbox__label) {
        width: 100%;
        height: 100%;
        padding: 0 4px !important;
        /* 左右稍微留白 */
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        /* 字體與行高優化 */
        font-size: 14px !important;
        /* 手機上夠大且清楚 */
        line-height: 1.1;
        /* 緊湊行高，萬一有兩行字也不會爆 */
        font-weight: 700 !important;
        color: #606266;

        white-space: pre-wrap;
        word-break: break-all;
    }

    &:active {
        background: #f9fafb;
    }
}

/* 選中狀態 */
.neo-tile.is-checked {
    background: #303133 !important;
    border-color: #303133 !important;
    z-index: 1;

    :deep(.el-checkbox__label) {
        color: #fff !important;
        font-weight: 900 !important;
    }
}

/* 邊框清理 */
.neo-grid .neo-tile:nth-child(4n) {
    border-right: none;
}

/* --- 5. Footer --- */
.expand-bar {
    background: #fff;
    text-align: center;
    padding: 10px;
    /* 高度稍微調小 */
    cursor: pointer;
    border-top: 2px solid #303133;
    transition: background 0.2s;

    &:hover {
        background: #f9fafb;
    }
}

.expand-text {
    font-weight: 800;
    font-size: 0.9rem;
    color: #303133;
}

.footer-hint {
    text-align: center;
    padding: 8px;
    font-size: 0.8rem;
    color: #909399;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
}

/* --- RWD --- */
@media (min-width: 640px) {
    .neo-grid {
        grid-template-columns: repeat(6, 1fr);
    }

    .neo-grid .neo-tile:nth-child(4n) {
        border-right: 1px solid #e5e7eb;
    }

    .neo-grid .neo-tile:nth-child(6n) {
        border-right: none;
    }

    /* 平板電腦以上，高度可以稍微寬裕一點點，或者保持一致 */
    .neo-tile {
        height: 60px !important;
    }

    .neo-tile :deep(.el-checkbox__label) {
        font-size: 16px !important;
    }
}

@media (min-width: 1024px) {
    .neo-grid {
        grid-template-columns: repeat(8, 1fr);
    }

    .neo-grid .neo-tile:nth-child(6n) {
        border-right: 1px solid #e5e7eb;
    }

    .neo-grid .neo-tile:nth-child(8n) {
        border-right: none;
    }

    .neo-tile:hover:not(.is-checked) {
        background: #f3f4f6;
    }
}
</style>