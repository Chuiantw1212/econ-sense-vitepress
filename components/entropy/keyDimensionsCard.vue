<template>
    <el-card class="key-dim-card" shadow="hover" v-if="result">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🗝️ 核心維度識別</span>
                    <el-tooltip content="系統自動過濾掉數值較低的維度，找出最能定義你人格的兩大支柱。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag size="small" effect="dark" :type="intensityColor">
                    {{ result.intensityLabel }}
                </el-tag>
            </div>
        </template>

        <div class="card-content">
            <div class="summary-box">
                <div class="summary-prefix">你是</div>
                <div class="summary-main">
                    <span class="highlight" :style="{ color: result.dims[0].color }">
                        {{ result.dims[0].intensity }}的{{ result.dims[0].label }}
                    </span>
                    <span class="connector">+</span>
                    <span class="highlight" :style="{ color: result.dims[1].color }">
                        {{ result.dims[1].label }}
                    </span>
                </div>
                <div class="summary-suffix">導向者</div>
            </div>

            <el-divider border-style="dashed" />

            <div class="dimensions-list">
                <div v-for="(dim, index) in result.dims" :key="index" class="dim-item">

                    <div class="dim-header">
                        <div class="dim-icon">{{ dim.icon }}</div>
                        <div class="dim-name">{{ dim.axisName }}</div>
                        <div class="dim-score">{{ Math.round(Math.abs(dim.value) * 100) }}% 傾向</div>
                    </div>

                    <div class="dim-bar-bg">
                        <div class="dim-bar-fill"
                            :style="{ width: Math.abs(dim.value) * 100 + '%', background: dim.color }">
                        </div>
                    </div>

                    <div class="dim-desc">
                        <el-tag size="small" effect="plain" :color="dim.bg"
                            :style="{ color: dim.color, borderColor: dim.color }">
                            {{ dim.label }}
                        </el-tag>
                        <span class="desc-text">{{ dim.description }}</span>
                    </div>

                </div>
            </div>

            <div v-if="result.ignored" class="ignored-dim">
                <el-icon>
                    <View />
                </el-icon>
                <span>
                    你的 <strong>{{ result.ignored.axisName }}</strong> 特質相對平衡（{{
                        Math.round(Math.abs(result.ignored.value)*100)
                    }}%），
                    因此對性格影響較小。
                </span>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled, View } from '@element-plus/icons-vue';

// --- Props ---
const props = defineProps<{
    userVector: { x: number; y: number; z: number } | null
}>();

// --- 設定檔 ---
const AXIS_CONFIG = {
    x: {
        name: '驅動力',
        pos: { label: '個體 (I)', desc: '競爭與成就驅動', color: '#F56C6C', icon: '🚀' }, // Red
        neg: { label: '群體 (O)', desc: '連結與共情驅動', color: '#67C23A', icon: '🤝' }  // Green
    },
    y: {
        name: '熵狀態',
        pos: { label: '熱系統 (H)', desc: '發散與創造導向', color: '#E6A23C', icon: '🔥' }, // Orange
        neg: { label: '冷系統 (C)', desc: '收斂與秩序導向', color: '#409EFF', icon: '❄️' }  // Blue
    },
    z: {
        name: '拓撲向',
        pos: { label: '實感 (R)', desc: '感官與當下導向', color: '#909399', icon: '👁️' },  // Grey/Blue
        neg: { label: '預判 (V)', desc: '預測與模型導向', color: '#9370DB', icon: '🧠' }   // Purple
    }
};

// --- 計算邏輯 ---
const result = computed(() => {
    if (!props.userVector) return null;
    const { x, y, z } = props.userVector;

    // 1. 整理三個維度的數據
    const rawDims = [
        { axis: 'x', value: x, abs: Math.abs(x) },
        { axis: 'y', value: y, abs: Math.abs(y) },
        { axis: 'z', value: z, abs: Math.abs(z) }
    ];

    // 2. 排序：絕對值大的排前面
    rawDims.sort((a, b) => b.abs - a.abs);

    // 3. 取出前兩名 (Dominant) 和最後一名 (Recessive)
    const top2 = rawDims.slice(0, 2);
    const weak = rawDims[2];

    // 4. 格式化前兩名數據
    const formattedDims = top2.map(d => {
        const config = AXIS_CONFIG[d.axis];
        const side = d.value >= 0 ? config.pos : config.neg;

        // 強度形容詞
        let intensity = '溫和';
        if (d.abs >= 0.7) intensity = '異常明顯';
        else if (d.abs >= 0.4) intensity = '明顯';

        return {
            axisName: config.name,
            value: d.value,
            label: side.label,
            description: side.desc,
            color: side.color,
            bg: side.color + '20', // 20% opacity for background
            icon: side.icon,
            intensity: intensity
        };
    });

    // 5. 判斷整體強度標籤 (看第一名的強度)
    const mainIntensity = formattedDims[0].intensity;

    // 6. 處理被忽略的維度 (只有當它真的很弱 < 0.3 時才特別顯示提示)
    const ignoredInfo = weak.abs < 0.3 ? {
        axisName: AXIS_CONFIG[weak.axis].name,
        value: weak.value
    } : null;

    return {
        dims: formattedDims,
        ignored: ignoredInfo,
        intensityLabel: mainIntensity + '特質',
    };
});

const intensityColor = computed(() => {
    if (!result.value) return '';
    const i = result.value.dims[0].intensity;
    if (i === '異常明顯') return 'danger';
    if (i === '明顯') return 'warning';
    return 'info';
});
</script>

<style scoped>
.key-dim-card {
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

/* 結論句樣式 */
.summary-box {
    text-align: center;
    padding: 10px 0;
    font-size: 1.1rem;
}

.summary-prefix,
.summary-suffix {
    color: #909399;
    font-size: 0.9rem;
    margin-bottom: 4px;
}

.summary-main {
    font-weight: 800;
    font-size: 1.4rem;
    margin: 8px 0;
    line-height: 1.4;
}

.connector {
    color: #DCDFE6;
    margin: 0 8px;
    font-weight: normal;
}

/* 維度列表 */
.dim-item {
    margin-bottom: 20px;
}

.dim-item:last-child {
    margin-bottom: 0;
}

.dim-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.dim-icon {
    font-size: 1.2rem;
}

.dim-name {
    font-weight: bold;
    color: #606266;
    flex: 1;
}

.dim-score {
    font-size: 0.85rem;
    color: #909399;
}

.dim-bar-bg {
    width: 100%;
    height: 8px;
    background: #f2f3f5;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.dim-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s ease;
}

.dim-desc {
    display: flex;
    align-items: center;
    gap: 8px;
}

.desc-text {
    font-size: 0.9rem;
    color: #606266;
}

/* 忽略維度提示 */
.ignored-dim {
    margin-top: 20px;
    padding: 10px;
    background: #f4f4f5;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #909399;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.4;
}
</style>