<template>
    <el-card class="career-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">💼 核心心智與賽道 (Strategic Tracks)</span>
                    <el-tooltip content="分析你的大腦天生適合玩哪種「商業遊戲」與「能量賽局」。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag type="success" effect="dark" round>雙核心分析</el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs v-model="activeTab" type="border-card" class="career-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            <span class="role-dot" :style="{ color: role.color }">●</span>
                            {{ index === 0 ? '主顯' : '次顯' }}：{{ role.nameZh }}
                        </span>
                    </template>

                    <div class="tab-inner">

                        <div class="intro-box">
                            <div class="highlight-badge">
                                <el-icon>
                                    <Aim />
                                </el-icon> 核心戰略：{{ role.info.highlight }}
                            </div>
                        </div>

                        <div class="track-list">
                            <div v-for="(track, idx) in role.info.tracks" :key="idx" class="track-item">
                                <div class="track-header">
                                    <div class="track-title-row">
                                        <span class="track-name">{{ track.name }}</span>
                                        <el-tag size="small" effect="plain" :type="getTypeTag(track.type)">{{ track.type
                                            }}收益</el-tag>
                                    </div>
                                    <div class="track-tags">
                                        範例：{{ track.tags.join(' / ') }}
                                    </div>
                                </div>

                                <div class="track-desc">
                                    {{ track.desc }}
                                </div>

                                <div class="salary-visual">
                                    <div class="salary-track">
                                        <div class="salary-bar" :style="{
                                            left: calculateLeft(track.min) + '%',
                                            width: calculateWidth(track.min, track.max) + '%',
                                            background: role.color
                                        }"></div>

                                        <span class="salary-label min-label"
                                            :style="{ left: calculateLeft(track.min) + '%' }">
                                            ${{ track.min }}k
                                        </span>

                                        <span class="salary-label max-label"
                                            :style="{ left: (calculateLeft(track.min) + calculateWidth(track.min, track.max)) + '%' }">
                                            {{ track.max >= MAX_SALARY_SCALE ? '∞' : '$' + track.max + 'k' }}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="disclaimer">
                * 薪資數據為產業預估區間 (月薪/專案收入)，僅供賽道潛力參考。
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InfoFilled, Aim } from '@element-plus/icons-vue';
// 引入資料檔 (無需變更)
import { data } from './career_visual.data.js';

const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

const activeTab = ref('');

// 視覺化最大值：200k
const MAX_SALARY_SCALE = 200;
// 視覺化最小值 (偏移量)：30k
const MIN_SALARY_SCALE = 30;

const ROLE_NAME_MAP: Record<string, string> = {
    'Hunter': '獵人', 'Pioneer': '先驅', 'Toolmaker': '工匠', 'Sentry': '哨兵',
    'Gatherer': '採集者', 'Shaman': '薩滿', 'Helper': '助人者', 'Elder': '長老',
};

const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500', 'Pioneer': '#FF8C00', 'Toolmaker': '#1E90FF', 'Sentry': '#00008B',
    'Gatherer': '#32CD32', 'Shaman': '#9370DB', 'Helper': '#20B2AA', 'Elder': '#2E8B57',
};

const displayRoles = computed(() => {
    const list = [];
    if (props.primaryRole) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole],
            color: ARCHETYPE_COLORS[props.primaryRole],
            // @ts-ignore
            info: data[props.primaryRole]
        });
    }
    if (props.secondaryRole && props.secondaryRole !== props.primaryRole) {
        list.push({
            key: props.secondaryRole,
            nameZh: ROLE_NAME_MAP[props.secondaryRole],
            color: ARCHETYPE_COLORS[props.secondaryRole],
            // @ts-ignore
            info: data[props.secondaryRole]
        });
    }
    return list;
});

watch(displayRoles, (newVal) => {
    if (newVal.length > 0 && !activeTab.value) activeTab.value = newVal[0].key;
}, { immediate: true });

// --- 輔助函數 ---

function calculateLeft(min: number) {
    const adjustedMin = Math.max(min - MIN_SALARY_SCALE, 0);
    const range = MAX_SALARY_SCALE - MIN_SALARY_SCALE;
    return Math.min((adjustedMin / range) * 100, 100);
}

function calculateWidth(min: number, max: number) {
    const safeMax = Math.min(max, MAX_SALARY_SCALE);
    const range = MAX_SALARY_SCALE - MIN_SALARY_SCALE;
    const adjustedMin = Math.max(min, MIN_SALARY_SCALE);
    const width = ((safeMax - adjustedMin) / range) * 100;
    return Math.max(width, 5);
}

function getTypeTag(type: string) {
    if (type.includes('指數') || type.includes('極端')) return 'danger';
    if (type.includes('波動') || type.includes('時薪')) return 'warning';
    return 'info';
}
</script>

<style scoped>
.career-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
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

.career-tabs {
    border: none;
    box-shadow: none;
}

.career-tabs :deep(.el-tabs__content) {
    padding: 15px 5px;
}

.tab-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
}

.role-dot {
    font-size: 1.2rem;
    line-height: 1;
}

.intro-box {
    margin-bottom: 20px;
    text-align: center;
}

.highlight-badge {
    background: #f0f9eb;
    color: #67C23A;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 1rem;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 8px rgba(103, 194, 58, 0.1);
}

.track-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.track-item {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 15px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.track-header {
    margin-bottom: 8px;
}

.track-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.track-name {
    font-weight: bold;
    font-size: 1.1rem;
    color: #303133;
}

.track-tags {
    font-size: 0.85rem;
    color: #909399;
}

.track-desc {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    margin-bottom: 12px;
    font-weight: 500;
}

/* 薪資視覺化 (極簡版) */
.salary-visual {
    margin-top: 25px;
    padding: 0 5px;
}

.salary-track {
    position: relative;
    height: 8px;
    background-color: #f2f3f5;
    border-radius: 4px;
    /* 移除 margin-bottom，因為不需要給下方刻度留空間了 */
}

.salary-bar {
    position: absolute;
    height: 100%;
    border-radius: 4px;
    opacity: 0.85;
    top: 0;
}

.salary-label {
    position: absolute;
    top: -22px;
    /* 標籤位置 */
    font-size: 0.8rem;
    color: #606266;
    font-weight: bold;
    transform: translateX(-50%);
    white-space: nowrap;
}

.min-label {
    color: #909399;
}

.max-label {
    color: #303133;
    font-size: 0.9rem;
}

.disclaimer {
    margin-top: 20px;
    font-size: 0.75rem;
    color: #909399;
    text-align: right;
    font-style: italic;
    padding-right: 10px;
}
</style>