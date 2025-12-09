<template>
    <el-card class="friction-card" shadow="hover" v-if="frictionResult.hasData"
        :style="{ '--friction-color': frictionColor }">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">
                        {{ frictionResult.differenceCount === 1 ? '⚠️ 外部盲區與磨合' : '🔄 雙核心內部摩擦' }}
                    </span>
                    <el-tooltip content="分析主顯與次顯人格的維度差異。差異 1 為良性但有盲區；差異 2 為顯著內耗；差異 3 為極度對立。" placement="top">
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

                    <div v-if="frictionResult.differenceCount === 1">
                        你的 <strong>{{ primaryRoleZh }}</strong> 與 <strong>{{ secondaryRoleZh }}</strong> 高度相似，僅有一個維度不同。
                        這屬於<strong>「良性磨合」</strong>，你切換狀態非常滑順，執行力極強。
                        <br /><br />
                        <span class="blind-spot-warning">
                            <strong>🛑 但代價是「外部盲區」：</strong><br />
                            因為雷達重疊率太高，你們同時忽視了
                            <span class="missing-traits">{{ frictionResult.missingTraits }}</span>
                            的訊號。建議尋找互補隊友來幫你看路。
                        </span>
                    </div>

                    <div v-else-if="frictionResult.differenceCount === 2">
                        你的 <strong>{{ primaryRoleZh }}</strong> 與 <strong>{{ secondaryRoleZh }}</strong> 在核心運作上存在
                        <strong>「顯著的內在張力」</strong>。
                        <br /><br />
                        這意味著你的大腦經常需要<strong>「手動換檔」</strong>。例如：你想衝刺（熱系統）但同時又極度缺乏安全感（冷系統）；或是你想顧全大局（群體）卻又受不了被拘束（個體）。這種矛盾會消耗你的認知能量，容易感到心累。
                    </div>

                    <div v-else>
                        警告：這屬於<strong>「極限拉扯的重災區」</strong>。
                        你的 <strong>{{ primaryRoleZh }}</strong> 與 <strong>{{ secondaryRoleZh }}</strong> 在所有維度上都完全相反。
                        <br /><br />
                        你的大腦像是在<strong>「同時踩油門與煞車」</strong>。雖然這讓你擁有上帝般的全面視角（什麼人都懂），但內耗極大。若沒有明確切割「工作模式」與「生活模式」，你很容易陷入決策癱瘓或長期焦慮。
                    </div>

                </div>
            </div>

            <el-divider border-style="dashed" />

            <div class="detail-list">
                <div v-for="(conflict, index) in frictionResult.conflicts" :key="index" class="conflict-item">
                    <div class="conflict-header">
                        <span class="axis-badge">{{ conflict.axisName }}</span>
                        <span class="conflict-vs">
                            {{ conflict.primaryPole }} <el-icon class="vs-icon">
                                <Switch />
                            </el-icon> {{ conflict.secondaryPole }}
                        </span>
                    </div>
                    <div class="conflict-desc">{{ getConflictDescription(conflict.axisName) }}</div>
                </div>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled, Switch } from '@element-plus/icons-vue';

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
    { name: '驅動力', codes: ['I', 'O'], labels: { I: '個體競爭', O: '群體連結' }, missing: { I: '群體共融', O: '獨立自我' } },
    { name: '拓撲向', codes: ['R', 'V'], labels: { R: '實證執行', V: '內觀預判' }, missing: { R: '宏觀願景', V: '落地細節' } },
    { name: '熵狀態', codes: ['H', 'C'], labels: { H: '熱系統(變革)', C: '冷系統(秩序)' }, missing: { H: '穩定秩序', C: '破局勇氣' } }
];

// --- Computed ---

const primaryRoleZh = computed(() => ROLE_NAME_MAP[props.primaryRole] || props.primaryRole);
const secondaryRoleZh = computed(() => props.secondaryRole ? (ROLE_NAME_MAP[props.secondaryRole] || props.secondaryRole) : '');

const frictionResult = computed(() => {
    // 1. 無次要角色或角色相同 -> 視為無摩擦，不顯示
    if (!props.secondaryRole || props.primaryRole === props.secondaryRole) {
        return { hasData: false, differenceCount: 0, levelZh: '', conflicts: [], missingTraits: '' };
    }

    const code1 = ARCHETYPE_CODES[props.primaryRole];
    const code2 = ARCHETYPE_CODES[props.secondaryRole];

    if (!code1 || !code2) return { hasData: false };

    let diffCount = 0;
    const conflicts = [];
    const missingTraitsArr = [];

    // 2. 逐一比對
    for (let i = 0; i < 3; i++) {
        if (code1[i] !== code2[i]) {
            diffCount++; // 有衝突
            const axis = AXIS_INFO[i];
            // @ts-ignore
            conflicts.push({
                axisName: axis.name,
                // @ts-ignore
                primaryPole: axis.labels[code1[i]],
                // @ts-ignore
                secondaryPole: axis.labels[code2[i]]
            });
        } else {
            // 無衝突 -> 記錄盲區 (兩個角色都缺少的那一面)
            const axis = AXIS_INFO[i];
            // @ts-ignore
            missingTraitsArr.push(axis.missing[code1[i]]);
        }
    }

    // 3. 定義中文等級
    let levelZh = '';
    if (diffCount === 1) levelZh = '良性磨合';
    else if (diffCount === 2) levelZh = '顯著內耗';
    else if (diffCount === 3) levelZh = '重度拉扯';

    return {
        hasData: true,
        differenceCount: diffCount,
        levelZh,
        conflicts,
        missingTraits: missingTraitsArr.join('、') // e.g. "群體共融、破局勇氣"
    };
});

// 顏色定義：根據程度變色
const frictionColor = computed(() => {
    const c = frictionResult.value.differenceCount;
    if (c === 3) return '#F56C6C'; // 紅色 (重災區)
    if (c === 2) return '#E6A23C'; // 橘色 (顯著)
    return '#67C23A';             // 綠色 (良性)
});

// 衝突描述文案
function getConflictDescription(axisName: string) {
    if (axisName === '驅動力') return "你的動機在「為自己贏」與「為大家贏」之間擺盪。需釐清當下任務的受益對象。";
    if (axisName === '拓撲向') return "你的認知模式在「看見細節」與「看見願景」之間拉扯。容易發生規劃了藍圖卻在執行時感到挫折。";
    if (axisName === '熵狀態') return "渴望刺激（H）與需要安全感（C）並存，這是一腳油門一腳煞車，最消耗能量的衝突。";
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

.level-tag {
    color: #fff;
    border: none;
}

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

/* 1階專用的盲區警示框 */
.blind-spot-warning {
    display: block;
    margin-top: 10px;
    padding: 10px;
    background-color: #f0f9eb;
    /* 淡綠色背景 */
    border-radius: 6px;
    color: #67C23A;
    font-size: 0.9rem;
    border: 1px solid #e1f3d8;
}

.missing-traits {
    font-weight: bold;
    text-decoration: underline;
}

.detail-list {
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
    padding-left: 4px;
    border-left: 2px solid #dcdfe6;
}
</style>