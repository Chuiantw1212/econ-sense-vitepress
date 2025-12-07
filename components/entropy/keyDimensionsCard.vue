<template>
    <el-card class="manual-card" shadow="hover" v-if="result">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🧠 大腦使用說明書</span>
                    <el-tooltip content="基於神經遞質(Neurotransmitters)、腦網路(Brain Networks)與熵腦理論的科學分析。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag size="small" effect="dark" type="warning">
                    核心驅動
                </el-tag>
            </div>
        </template>

        <div class="card-content">

            <div class="summary-box">
                <div class="summary-text">
                    生物掃描顯示，你的神經系統預設為
                </div>
                <div class="summary-main">
                    <span class="highlight" :style="{ color: result.dims[0].color }">
                        {{ result.dims[0].label }}
                    </span>
                    <span class="connector">+</span>
                    <span class="highlight" :style="{ color: result.dims[1].color }">
                        {{ result.dims[1].label }}
                    </span>
                </div>
            </div>

            <el-divider border-style="dashed" />

            <div class="manual-list">
                <div v-for="(dim, index) in result.dims" :key="index" class="manual-item">

                    <div class="manual-header">
                        <div class="dim-icon-wrapper" :style="{ background: dim.bg }">
                            <span class="dim-icon">{{ dim.icon }}</span>
                        </div>
                        <div class="dim-info">
                            <div class="dim-title" :style="{ color: dim.color }">{{ dim.label }} 模式</div>
                            <div class="dim-subtitle">由 {{ dim.manual.chemical }} 主導</div>
                        </div>
                    </div>

                    <div class="science-box">
                        <div class="science-label"><el-icon>
                                <Cpu />
                            </el-icon> 神經生物機制</div>
                        <div class="science-content" v-html="dim.manual.mechanism"></div>
                    </div>

                    <div class="instruction-grid">
                        <div class="instruction-col do">
                            <div class="col-header"><el-icon>
                                    <Check />
                                </el-icon> 充能模式 (Do)</div>
                            <ul class="col-list">
                                <li v-for="item in dim.manual.dos" :key="item">{{ item }}</li>
                            </ul>
                        </div>
                        <div class="instruction-col dont">
                            <div class="col-header"><el-icon>
                                    <Close />
                                </el-icon> 耗損模式 (Don't)</div>
                            <ul class="col-list">
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
import { computed, onMounted, ref } from 'vue';
import { data } from './keyDimensionCard.data.js'
import { InfoFilled, Cpu, Check, Close } from '@element-plus/icons-vue';

// --- Props ---
const props = defineProps<{
    userVector: { x: number; y: number; z: number } | null
}>();

// --- 計算邏輯 ---
const result = computed(() => {
    if (!props.userVector) return null;
    const { x, y, z } = props.userVector;

    const rawDims = [
        { axis: 'x', value: x, abs: Math.abs(x) },
        { axis: 'y', value: y, abs: Math.abs(y) },
        { axis: 'z', value: z, abs: Math.abs(z) }
    ];

    // 排序取出前兩名
    rawDims.sort((a, b) => b.abs - a.abs);
    const top2 = rawDims.slice(0, 2);

    const formattedDims = top2.map(d => {
        // @ts-ignore
        const config = data[d.axis];
        const side = d.value >= 0 ? config.pos : config.neg;

        return {
            axisName: config.name,
            value: d.value,
            label: side.label,
            color: side.color,
            bg: side.color + '15', // very light bg
            icon: side.icon,
            manual: side.manual
        };
    });

    return { dims: formattedDims };
});
</script>

<style scoped>
.manual-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
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

/* 總結區 */
.summary-box {
    text-align: center;
    margin-bottom: 15px;
}

.summary-text {
    font-size: 0.9rem;
    color: #909399;
    margin-bottom: 5px;
}

.summary-main {
    font-size: 1.3rem;
    font-weight: 800;
}

.connector {
    color: #dcdfe6;
    margin: 0 8px;
    font-weight: normal;
}

/* 說明書列表 */
.manual-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.manual-item {
    padding: 20px;
    background: #fdfdfd;
    border: 1px solid #f0f2f5;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
}

/* 標頭 */
.manual-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
}

.dim-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.dim-title {
    font-size: 1.1rem;
    font-weight: bold;
}

.dim-subtitle {
    font-size: 0.85rem;
    color: #909399;
}

/* 科學機制 */
.science-box {
    background: #f4f4f5;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #555;
    border-left: 4px solid #909399;
}

.science-label {
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Do & Don't Grid */
.instruction-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

@media (max-width: 600px) {
    .instruction-grid {
        grid-template-columns: 1fr;
    }
}

.instruction-col {
    padding: 12px;
    border-radius: 8px;
}

.instruction-col.do {
    background: rgba(103, 194, 58, 0.08);
}

.instruction-col.dont {
    background: rgba(245, 108, 108, 0.08);
}

.col-header {
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.do .col-header {
    color: #67C23A;
}

.dont .col-header {
    color: #F56C6C;
}

.col-list {
    margin: 0;
    padding-left: 20px;
    font-size: 0.9rem;
    color: #606266;
    line-height: 1.5;
}

.col-list li {
    margin-bottom: 4px;
}
</style>