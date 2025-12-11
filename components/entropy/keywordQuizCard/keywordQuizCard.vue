<template>
    <el-card class="quiz-card" shadow="hover">
        <template #header>
            <div class="card-header">
                <div class="header-content">
                    <span>請憑直覺勾選 10~20 個關鍵字</span>
                    <el-tag effect="dark" round :type="selectedCount >= 10 ? 'success' : 'info'">
                        {{ selectedCount }} / 20
                    </el-tag>
                </div>
                <el-button @click="resetTest" size="small">重置</el-button>
            </div>
        </template>

        <el-row class="keyword-container">
            <el-checkbox-group v-model="internalSelected" @change="debouncedUpdate">
                <el-checkbox v-for="item in visibleKeywords" :key="item.keyword_zh" :label="item.keyword_zh"
                    :value="item" border style="margin: 5px;">
                    {{ item.keyword_zh }}
                </el-checkbox>
            </el-checkbox-group>
        </el-row>

        <div v-if="!isExpanded" class="expand-section">
            <el-divider content-position="center">
                <el-button text bg type="primary" @click="isExpanded = true">
                    覺得不夠？顯示更多關鍵字
                    <el-icon class="el-icon--right">
                        <ArrowDown />
                    </el-icon>
                </el-button>
            </el-divider>
        </div>
        <div v-else class="expanded-hint">
            <el-text type="info" size="small">已顯示所有關鍵字</el-text>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
// 引入資料源 (請確認路徑正確)
import { data } from './keywords.data.js';

// --- 定義輸出事件 ---
// 父層透過 @update="handleUpdate" 接收分析結果
const emit = defineEmits<{
    (e: 'update', payload: AnalysisResult): void
}>();

// --- 介面定義 ---
interface Vector3 { x: number; y: number; z: number; }
interface KeywordItem { id: number; keyword_zh: string; archetype: string; vector: Vector3; }
interface AnalysisResult {
    keywords: KeywordItem[];      // 已勾選的關鍵字
    dimension: Vector3 | null;    // 三維向量分數
    archetypes: {                 // 角色分析結果
        primary: string;
        secondary: string | undefined;
    };
}

// --- 內部狀態 ---
const shuffledKeywords = shallowRef<KeywordItem[]>([]);
const internalSelected = ref<KeywordItem[]>([]);
const isExpanded = ref(false);

const selectedCount = computed(() => internalSelected.value.length);

const visibleKeywords = computed(() => {
    if (isExpanded.value) return shuffledKeywords.value;
    const limit = Math.ceil(shuffledKeywords.value.length / 2);
    return shuffledKeywords.value.slice(0, limit);
});

// --- 初始化與洗牌邏輯 ---
onMounted(() => {
    initKeywords();
});

function initKeywords() {
    const rawData = data.keywords || [];
    // 1. 去重
    const uniqueMap = new Map<string, KeywordItem>();
    rawData.forEach((item: any) => {
        if (item?.keyword_zh) {
            const k = item.keyword_zh.trim();
            if (!uniqueMap.has(k)) uniqueMap.set(k, { ...item, keyword_zh: k });
        }
    });
    const uniqueData = Array.from(uniqueMap.values());

    // 2. 分層 (Stratification)
    const groups: Record<string, KeywordItem[]> = {};
    uniqueData.forEach(item => {
        if (!groups[item.archetype]) groups[item.archetype] = [];
        groups[item.archetype].push(item);
    });

    // 3. 建構平衡池
    let visiblePool: KeywordItem[] = [];
    let hiddenPool: KeywordItem[] = [];
    Object.keys(groups).forEach(key => {
        const items = shuffle(groups[key]);
        const mid = Math.ceil(items.length / 2);
        visiblePool = visiblePool.concat(items.slice(0, mid));
        hiddenPool = hiddenPool.concat(items.slice(mid));
    });

    // 4. 最終洗牌
    const finalSequence = [...shuffle(visiblePool), ...shuffle(hiddenPool)];
    shuffledKeywords.value = finalSequence.map((item, idx) => ({ ...item, id: idx }));
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// --- 計算與傳輸邏輯 ---
function performCalculation() {
    const selected = internalSelected.value;

    // 1. 若無勾選，傳出空結果
    if (selected.length === 0) {
        emit('update', {
            keywords: [],
            dimension: null,
            archetypes: { primary: '', secondary: undefined }
        });
        return;
    }

    // 2. 計算向量
    let totalVec = { x: 0, y: 0, z: 0 };
    const counts: Record<string, number> = {};

    selected.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
        counts[kw.archetype] = (counts[kw.archetype] || 0) + 1;
    });

    const count = selected.length;
    const dimensionScore = {
        x: totalVec.x / count,
        y: totalVec.y / count,
        z: totalVec.z / count
    };

    // 3. 計算角色排名
    const sortedRoles = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const primary = sortedRoles[0] ? sortedRoles[0][0] : '';
    const secondary = (sortedRoles[1] && sortedRoles[1][1] > 0) ? sortedRoles[1][0] : undefined;

    // 4. 發送結果給父層
    emit('update', {
        keywords: [...selected], // 傳遞副本
        dimension: dimensionScore,
        archetypes: { primary, secondary }
    });
}

// --- 防抖 (Debounce) ---
// 避免用戶連續勾選時頻繁觸發父層重繪 (3D圖)
function debounce(fn: Function, delay: number) {
    let timeoutId: any = null;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

const debouncedUpdate = debounce(performCalculation, 500);

// --- 重置 ---
function resetTest() {
    internalSelected.value = [];
    isExpanded.value = false;
    initKeywords();
    performCalculation(); // 觸發一次更新以清空父層
}
</script>

<style scoped lang="scss">
.quiz-card {
    margin-bottom: 20px;
    transition: all 0.3s ease;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: #303133;
}

.keyword-container {
    justify-content: center;
    margin-bottom: 10px;
}

.expand-section {
    margin-top: 15px;
    margin-bottom: 5px;
}

.expanded-hint {
    text-align: center;
    margin-top: 10px;
    opacity: 0.6;
}
</style>