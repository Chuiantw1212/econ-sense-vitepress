<template>
    <el-card class="neo-brutalist-card" shadow="never">

        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title-text">直覺勾選</span>
                    <div class="counter-pill" :class="counterClass">
                        {{ selectedCount }} / 30
                    </div>
                </div>
                <el-button class="reset-btn" size="small" @click="resetTest" round>
                    重置
                </el-button>
            </div>
        </template>

        <transition name="toast-slide">
            <div v-if="showHint" class="fixed-status-toast" :class="hintStatus.class">
                <span class="status-icon">{{ hintStatus.icon }}</span>
                <span class="status-text">{{ hintStatus.text }}</span>
            </div>
        </transition>

        <div class="grid-container">
            <el-checkbox-group v-model="internalSelected" @change="debouncedUpdate" class="neo-grid" :max="30">
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
import { ref, shallowRef, computed, onMounted, watch } from 'vue';
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

const showHint = ref(false);
let hintTimer: any = null;

const selectedCount = computed(() => internalSelected.value.length);

// 計數器樣式
const counterClass = computed(() => {
    if (selectedCount.value === 30) return 'is-max';
    if (selectedCount.value >= 20) return 'is-optimal';
    if (selectedCount.value >= 10) return 'is-active';
    return '';
});

// 🔥 三階段提示邏輯
const hintStatus = computed(() => {
    const count = selectedCount.value;

    // 0. 未開始
    if (count === 0) return { text: '請憑直覺勾選...', class: 'is-neutral', icon: '👆' };

    // 1. 未達標 (<10)
    if (count < 10) return {
        text: `還差 ${10 - count} 個解鎖基礎分析...`,
        class: 'is-warning',
        icon: '🔒'
    };

    // 2. 第一階段：10~19 (基礎達標 - 滿足急性子)
    if (count < 20) return {
        text: `已解鎖！可往下滑，或選更多個提升精度...`,
        class: 'is-success',
        icon: '✅'
    };

    // 3. 第二階段：20~29 (高解析度 - 滿足求好心切)
    if (count < 30) return {
        text: `模型解析度提升中！再 ${30 - count} 個達極限...`,
        class: 'is-optimal',
        icon: '🚀'
    };

    // 4. 第三階段：30 (完美上限 - 滿足完美主義)
    return {
        text: '完美！已達上限，獲取最高解析度報告',
        class: 'is-max',
        icon: '🏆'
    };
});

const visibleKeywords = computed(() => {
    if (isExpanded.value) return shuffledKeywords.value;
    const limit = Math.ceil(shuffledKeywords.value.length / 2);
    return shuffledKeywords.value.slice(0, Math.ceil(limit / 4) * 4);
});

// --- Init ---
onMounted(() => {
    initKeywords();
});

// --- Watcher ---
watch(selectedCount, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        triggerHint();
    }
});

function triggerHint() {
    showHint.value = true;
    if (hintTimer) clearTimeout(hintTimer);
    // 顯示 1.5 秒後消失
    hintTimer = setTimeout(() => {
        showHint.value = false;
    }, 1500);
}

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

    // 不足 10 個時傳空值
    if (selected.length < 10) {
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
    showHint.value = false;
    initKeywords();
    performCalculation();
}
</script>

<style scoped lang="scss">
/* --- Neo-Brutalist Card --- */
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

/* --- Fixed Status Toast --- */
.fixed-status-toast {
    position: fixed;
    top: 80px;
    /* 視您的 Navbar 高度調整 */
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;

    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 50px;
    border: 2px solid #000;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    font-weight: 800;
    font-size: 0.95rem;
    white-space: nowrap;
    pointer-events: none;

    /* 狀態顏色 */
    &.is-neutral {
        background: #fff;
        color: #333;
        border-color: #e4e7ed;
    }

    /* 警告/未達標 */
    &.is-warning {
        background: #fef08a;
        color: #854d0e;
        border-color: #fde047;
    }

    /* 階段一 (10-19) */
    &.is-success {
        background: #4ade80;
        color: #064e3b;
        border-color: #22c55e;
    }

    /* 階段二 (20-29) */
    &.is-optimal {
        background: #8b5cf6;
        color: #fff;
        border-color: #7c3aed;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    }

    /* 階段三 (30) */
    &.is-max {
        background: #000;
        color: #FFD700;
        border-color: #FFD700;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    }
}

.toast-slide-enter-active,
.toast-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
}

/* --- Header --- */
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
        background: #4ade80;
        /* Green */
        color: #064e3b;
        border-color: #22c55e;
    }

    &.is-optimal {
        background: #8b5cf6;
        /* Violet */
        color: #fff;
        border-color: #7c3aed;
    }

    &.is-max {
        background: #000;
        color: #FFD700;
        border-color: #FFD700;
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

/* --- Grid & Tile --- */
.grid-container {
    width: 100%;
}

.neo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    width: 100%;
}

.neo-tile {
    width: 100%;
    margin: 0 !important;
    border-radius: 0 !important;
    padding: 0 !important;
    height: 52px !important;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
    transition: all 0.15s ease-out;

    :deep(.el-checkbox__input) {
        display: none !important;
    }

    :deep(.el-checkbox__label) {
        width: 100%;
        height: 100%;
        padding: 0 4px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 14px !important;
        line-height: 1.1;
        font-weight: 700 !important;
        color: #606266;
        white-space: pre-wrap;
        word-break: break-all;
    }

    &:active {
        background: #f9fafb;
    }

    /* 滿 30 個後，未選項目變灰 */
    &.is-disabled {
        background: #f5f7fa;

        :deep(.el-checkbox__label) {
            color: #c0c4cc;
        }
    }
}

.neo-tile.is-checked {
    background: #303133 !important;
    border-color: #303133 !important;
    z-index: 1;

    :deep(.el-checkbox__label) {
        color: #fff !important;
        font-weight: 900 !important;
    }
}

.neo-grid .neo-tile:nth-child(4n) {
    border-right: none;
}

/* --- Footer --- */
.expand-bar {
    background: #fff;
    text-align: center;
    padding: 10px;
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