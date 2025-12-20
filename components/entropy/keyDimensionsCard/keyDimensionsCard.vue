<template>
    <el-card class="manual-card" shadow="hover" v-if="result">
        <template #header>
            <div class="card-header">
                <span class="title">⚡ 核心驅動說明書</span>
            </div>
        </template>

        <div class="card-content">

            <div class="summary-box">
                <div class="summary-main">
                    <span v-for="(dim, index) in result.sortedDims" :key="index">
                        <span class="highlight" :style="{ color: dim.color }">
                            {{ dim.label.split(' ')[0] }}
                        </span>
                        <span v-if="index < 2" class="connector">+</span>
                    </span>
                </div>
                <div class="summary-sub">你的大腦原廠設定</div>
            </div>

            <el-divider border-style="dashed" class="compact-divider" />

            <div class="manual-list">
                <div v-for="(dim, index) in result.sortedDims" :key="index" class="manual-item">

                    <div class="row-header">
                        <div class="left-info">
                            <span class="dim-icon">{{ dim.icon }}</span>
                            <span class="dim-name" :style="{ color: dim.color }">{{ dim.label }}</span>
                            <span class="dim-meta text-gray">({{ dim.metaphor }})</span>
                        </div>
                        <div class="right-info">
                            <span class="impact-val">{{ dim.percentage }}%</span>
                            <span class="text-xs">影響力</span>
                        </div>
                    </div>

                    <el-progress :percentage="dim.percentage" :color="dim.color" :stroke-width="4" :show-text="false"
                        class="compact-progress" />

                    <div class="core-concept">
                        <div class="concept-text">{{ dim.manual.summary }}</div>
                        <div class="tags-row">
                            <el-tag v-for="tag in dim.manual.tags" :key="tag" size="small" effect="plain"
                                class="mini-tag">
                                {{ tag }}
                            </el-tag>
                        </div>
                    </div>

                    <div class="action-grid">
                        <div class="action-col do">
                            <div class="col-title" :style="{ color: '#67C23A' }">
                                <el-icon>
                                    <Check />
                                </el-icon> 充能 (Do)
                            </div>
                            <ul>
                                <li v-for="item in dim.manual.dos" :key="item">{{ item }}</li>
                            </ul>
                        </div>
                        <div class="action-col dont">
                            <div class="col-title" :style="{ color: '#F56C6C' }">
                                <el-icon>
                                    <Close />
                                </el-icon> 耗損 (Don't)
                            </div>
                            <ul>
                                <li v-for="item in dim.manual.donts" :key="item">{{ item }}</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { data } from './keyDimensionCard.data.js';
import { Check, Close } from '@element-plus/icons-vue';

const props = defineProps<{
    userVector: { x: number; y: number; z: number } | null
}>();

const result = computed(() => {
    if (!props.userVector) return null;
    const { x, y, z } = props.userVector;

    const totalScore = Math.abs(x) + Math.abs(y) + Math.abs(z);
    const denominator = totalScore === 0 ? 1 : totalScore;

    const rawDims = [
        { axis: 'x', value: x, abs: Math.abs(x) },
        { axis: 'y', value: y, abs: Math.abs(y) },
        { axis: 'z', value: z, abs: Math.abs(z) },
    ];

    // 排序
    rawDims.sort((a, b) => b.abs - a.abs);

    const formattedDims = rawDims.map(d => {
        // @ts-ignore
        const config = data[d.axis];
        const side = d.value >= 0 ? config.pos : config.neg;
        const percent = Math.round((d.abs / denominator) * 100);

        return {
            metaphor: config.metaphor,
            value: d.value,
            percentage: percent,
            label: side.label,
            color: side.color,
            icon: side.icon,
            manual: side.manual
        };
    });

    return { sortedDims: formattedDims };
});
</script>

<style scoped>
.manual-card {
    margin-top: 16px;
    border-radius: 12px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-weight: 800;
    font-size: 16px;
}

/* Summary */
.summary-box {
    text-align: center;
    margin-bottom: 12px;
}

.summary-main {
    font-size: 1.6rem;
    font-weight: 900;
    letter-spacing: 1px;
    line-height: 1.2;
}

.summary-sub {
    font-size: 0.8rem;
    color: #909399;
    margin-top: 4px;
}

.connector {
    color: #dcdfe6;
    margin: 0 8px;
    font-weight: 300;
}

.compact-divider {
    margin: 12px 0;
}

/* Item Layout */
.manual-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.row-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 4px;
}

.left-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.dim-icon {
    font-size: 1.4rem;
}

.dim-name {
    font-weight: 800;
    font-size: 1.1rem;
}

.text-gray {
    color: #909399;
    font-size: 0.8rem;
}

.right-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1;
}

.impact-val {
    font-weight: 800;
    font-size: 1.1rem;
    color: #303133;
}

.text-xs {
    font-size: 0.7rem;
    color: #C0C4CC;
}

.compact-progress {
    margin-bottom: 10px;
}

/* Concept */
.core-concept {
    margin-bottom: 10px;
}

.concept-text {
    font-size: 0.95rem;
    font-weight: 500;
    color: #303133;
    margin-bottom: 6px;
}

.tags-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.mini-tag {
    border: none;
    background: #f4f4f5;
    color: #606266;
}

/* Action Grid */
.action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.action-col {
    padding: 10px;
    border-radius: 8px;
    background: #fcfcfc;
    border: 1px solid #f0f2f5;
}

.col-title {
    font-weight: 800;
    font-size: 0.85rem;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.action-col ul {
    margin: 0;
    padding-left: 14px;
    font-size: 0.85rem;
    color: #555;
    line-height: 1.4;
}

.action-col li {
    margin-bottom: 3px;
}

@media (max-width: 400px) {
    .action-grid {
        grid-template-columns: 1fr;
    }
}
</style>