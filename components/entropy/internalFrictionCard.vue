<template>
    <el-card class="friction-card" shadow="hover" v-if="frictionResult.hasData"
        :style="{ '--friction-color': frictionColor }">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🔄 雙核心內部摩擦分析</span>
                    <el-tooltip content="分析你的主顯與次顯人格在神經維度上的差異。差異越大，代表兩種模式切換時的認知耗損(Cognitive Load)越高。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag :color="frictionColor" effect="dark" round class="level-tag">
                    {{ frictionResult.levelZh }}
                </el-tag>
            </div>
        </template>

        <div class="friction-content">

            <div class="summary-section">
                <div class="friction-score">
                    <div class="score-num" :style="{ color: frictionColor }">{{ frictionResult.differenceCount }}</div>
                    <div class="score-label">維度衝突</div>
                </div>
                <div class="summary-text">
                    你的 <strong>{{ primaryRoleZh }}</strong> 與 <strong>{{ secondaryRoleZh }}</strong> 在核心運作上

                    <span v-if="frictionResult.differenceCount === 1">
                        僅存在單一維度的分歧。這屬於<strong>良性磨合</strong>，你通常能順暢切換視角，僅在特定情境下會感到些微的猶豫，認知負擔較低。
                    </span>

                    <span v-else-if="frictionResult.differenceCount === 2">
                        存在<strong>顯著的內在張力</strong>。你需要消耗可觀的認知能量來進行「換檔」，常感到自我矛盾（例如想衝刺又想安全，想獨處又怕孤單）。需建立明確的「模式切換儀式」。
                    </span>

                    <span v-else>
                        處於<strong>重災區等級的對立狀態</strong>。你的大腦像是在同時踩油門與煞車，雖然這讓你具備極致的全面性，但<strong>內耗極大</strong>。若無明確的場景切割，容易陷入決策癱瘓或長期疲勞。
                    </span>
                </div>
            </div>

            <el-divider border-style="dashed" />

            <div class="conflict-list">
                <div v-for="(conflict, index) in frictionResult.conflicts" :key="index" class="conflict-item">
                    <div class="conflict-header">
                        <span class="axis-badge">{{ conflict.axisName }}</span>
                        <span class="conflict-vs">
                            {{ conflict.primaryPole }}
                            <el-icon class="vs-icon">
                                <Switch />
                            </el-icon>
                            {{ conflict.secondaryPole }}
                        </span>
                    </div>
                    <div class="conflict-desc">
                        {{ getConflictDescription(conflict.axisName) }}
                    </div>
                </div>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled, Switch } from '@element-plus/icons-vue';

// --- Props ---
const props = defineProps<{
    primaryRole: string,
    secondaryRole: string | undefined,
}>();

// --- 資料定義 ---
const ARCHETYPE_CODES: Record<string, string> = {
    'Hunter': 'IRH', 'Pioneer': 'IVH', 'Toolmaker': 'IRC', 'Sentry': 'IVC',
    'Gatherer': 'ORH', 'Shaman': 'OVH', 'Helper': 'ORC', 'Elder': 'OVC',
};

const ROLE_NAME_MAP: Record<string, string> = {
    'Hunter': '獵人', 'Pioneer': '先驅', 'Toolmaker': '工匠', 'Sentry': '哨兵',
    'Gatherer': '採集者', 'Shaman': '薩滿', 'Helper': '助人者', 'Elder': '長老',
};

const AXIS_INFO = [
    { name: '驅動力', codes: ['I', 'O'], labels: { I: '個體競爭', O: '群體連結' } },
    { name: '拓撲向', codes: ['R', 'V'], labels: { R: '實證執行', V: '內觀預判' } },
    { name: '熵狀態', codes: ['H', 'C'], labels: { H: '熱系統(變革)', C: '冷系統(秩序)' } }
];

// --- Computed ---

const primaryRoleZh = computed(() => ROLE_NAME_MAP[props.primaryRole] || props.primaryRole);
const secondaryRoleZh = computed(() => props.secondaryRole ? (ROLE_NAME_MAP[props.secondaryRole] || props.secondaryRole) : '');

const frictionResult = computed(() => {
    // 0 差異或無次要角色 -> 不顯示
    if (!props.secondaryRole || props.primaryRole === props.secondaryRole) {
        return { hasData: false, differenceCount: 0, levelZh: '', conflicts: [] };
    }

    const code1 = ARCHETYPE_CODES[props.primaryRole];
    const code2 = ARCHETYPE_CODES[props.secondaryRole];

    if (!code1 || !code2) return { hasData: false };

    let diffCount = 0;
    const conflicts = [];

    for (let i = 0; i < 3; i++) {
        if (code1[i] !== code2[i]) {
            diffCount++;
            const axis = AXIS_INFO[i];
            // @ts-ignore
            conflicts.push({
                axisName: axis.name,
                // @ts-ignore
                primaryPole: axis.labels[code1[i]],
                // @ts-ignore
                secondaryPole: axis.labels[code2[i]]
            });
        }
    }

    // 定義三個等級
    let levelZh = '';
    if (diffCount === 1) levelZh = '輕度磨合';
    else if (diffCount === 2) levelZh = '中度內耗';
    else if (diffCount === 3) levelZh = '重度拉扯';

    return {
        hasData: true,
        differenceCount: diffCount,
        levelZh,
        conflicts
    };
});

// 視覺樣式 (顏色定義)
const frictionColor = computed(() => {
    const c = frictionResult.value.differenceCount;
    if (c >= 3) return '#F56C6C'; // 紅色 (重災區)
    if (c === 2) return '#E6A23C'; // 橘色 (明顯)
    return '#67C23A';             // 綠色 (輕度)
});

// 衝突描述文案 (保持不變)
function getConflictDescription(axisName: string) {
    if (axisName === '驅動力') return "你的動機在「為自己贏」與「為大家贏」之間擺盪。需釐清當下任務的受益對象，避免在競爭時心軟，或在合作時過於自我。";
    if (axisName === '拓撲向') return "你的認知模式在「看見細節」與「看見願景」之間拉扯。容易發生規劃了宏大藍圖（V）卻在執行細節（R）時感到挫折，或反之。";
    if (axisName === '熵狀態') return "這是最消耗能量的衝突。一部分的你渴望刺激與改變（H），另一部分的你卻極度需要安全感與秩序（C）。容易在衝動過後陷入焦慮。";
    return "";
}
</script>

<style scoped>
.friction-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    border-left: 5px solid var(--friction-color);
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

/* 調整 Tag 樣式以適應自訂顏色 */
.level-tag {
    color: #fff;
    border: none;
}

/* 總結區 */
.summary-section {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 5px 0;
}

.friction-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 80px;
}

.score-num {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1;
}

.score-label {
    font-size: 0.8rem;
    color: #909399;
}

.summary-text {
    font-size: 0.95rem;
    color: #606266;
    line-height: 1.6;
    flex-grow: 1;
}

/* 衝突列表 */
.conflict-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.conflict-item {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
}

.conflict-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    flex-wrap: wrap;
}

.axis-badge {
    background: #303133;
    color: #fff;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}

.conflict-vs {
    font-weight: bold;
    color: #303133;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
}

.vs-icon {
    color: #909399;
    font-size: 0.85rem;
}

.conflict-desc {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.5;
    padding-left: 4px;
    border-left: 2px solid #dcdfe6;
}
</style>