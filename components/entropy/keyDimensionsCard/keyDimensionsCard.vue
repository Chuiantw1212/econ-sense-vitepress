<template>
    <el-card class="manual-card" shadow="hover" v-if="result">

        <template #header>
            <div class="card-header">
                <span class="header-title">
                    <el-icon class="title-icon">
                        <Reading />
                    </el-icon>
                    核心驅動說明書
                </span>
                <el-tag type="info" size="small" effect="plain" round class="tracking-wide">BETA</el-tag>
            </div>
        </template>

        <div class="card-content">

            <div class="formula-container">
                <div class="formula-row">
                    <template v-for="(dim, index) in result.dims" :key="dim.axis">
                        <span class="formula-code" :style="{ color: dim.color }">
                            {{ dim.shortLabel }}
                        </span>
                        <span v-if="index < result.dims.length - 1" class="formula-divider">
                            /
                        </span>
                    </template>
                </div>
                <div class="formula-caption">您的認知原廠設定</div>
            </div>

            <el-divider border-style="dashed" class="compact-divider" />

            <div class="manual-list">
                <div v-for="dim in result.dims" :key="dim.axis" class="manual-item">

                    <div class="item-header">
                        <div class="left-col">
                            <span class="dim-icon">{{ dim.icon }}</span>
                            <div class="dim-info">
                                <span class="dim-name" :style="{ color: dim.color }">{{ dim.label }}</span>
                                <span class="dim-metaphor">{{ dim.metaphor }}</span>
                            </div>
                        </div>
                        <div class="right-col">
                            <div class="percentage-box">
                                <span class="val">{{ dim.percentage }}</span>
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </div>

                    <el-progress :percentage="dim.percentage" :color="dim.color" :stroke-width="6" :show-text="false"
                        class="compact-progress" />

                    <div class="concept-section">
                        <p class="summary-text">{{ dim.manual.summary }}</p>
                        <div class="tags-wrapper">
                            <span v-for="tag in dim.manual.tags" :key="tag" class="micro-tag">
                                #{{ tag }}
                            </span>
                        </div>
                    </div>

                    <div class="action-grid">

                        <div class="action-card do-card">
                            <div class="action-header text-success">
                                <el-icon>
                                    <Check />
                                </el-icon> 充能 (Do)
                            </div>
                            <ul class="action-list">
                                <li v-for="item in dim.manual.dos" :key="item">{{ item }}</li>
                            </ul>
                        </div>

                        <div class="action-card dont-card">
                            <div class="action-header text-danger">
                                <el-icon>
                                    <Close />
                                </el-icon> 耗損 (Don't)
                            </div>
                            <ul class="action-list">
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
import { Check, Close, Reading } from '@element-plus/icons-vue';

// 定義 Props
// 改為接收計算好的 result 物件
defineProps<{
    result: {
        dims: Array<{
            axis: string;
            metaphor: string;
            value: number;
            percentage: number;
            label: string;
            shortLabel: string;
            color: string;
            icon: string;
            manual: {
                summary: string;
                tags: string[];
                dos: string[];
                donts: string[];
            }
        }>
    } | null
}>();
</script>

<style scoped>
/* 卡片容器 */
.manual-card {
    border-radius: 16px;
    border: 1px solid var(--el-border-color-lighter);
    margin-top: 20px;
    background: #ffffff;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title {
    display: flex;
    align-items: center;
    font-weight: 800;
    font-size: 16px;
    color: #1f2937;
    letter-spacing: 0.5px;
}

.title-icon {
    margin-right: 8px;
}

/* 2. 極簡化配方樣式 (Simplified Formula) */
.formula-container {
    text-align: center;
    padding: 12px 0 4px 0;
}

.formula-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.formula-code {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 900;
    font-size: 2rem;
    line-height: 1;
    letter-spacing: -1px;
}

.formula-divider {
    color: #e5e7eb;
    font-size: 1.5rem;
    font-weight: 300;
    transform: translateY(2px);
}

.formula-caption {
    font-size: 0.75rem;
    color: #9ca3af;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 600;
}

.compact-divider {
    margin: 24px 0;
    border-color: #f3f4f6;
}

/* 3. 列表項目佈局 */
.manual-list {
    display: flex;
    flex-direction: column;
    gap: 48px;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
}

.left-col {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dim-icon {
    font-size: 1.8rem;
    line-height: 1;
}

.dim-info {
    display: flex;
    flex-direction: column;
}

.dim-name {
    font-weight: 800;
    font-size: 1.15rem;
    line-height: 1.2;
}

.dim-metaphor {
    font-size: 0.8rem;
    color: #9ca3af;
    font-weight: 500;
}

.percentage-box {
    display: flex;
    align-items: baseline;
    color: #374151;
}

.percentage-box .val {
    font-weight: 900;
    font-size: 1.5rem;
    line-height: 1;
    font-feature-settings: "tnum";
}

.percentage-box .unit {
    font-size: 0.85rem;
    font-weight: 600;
    color: #9ca3af;
    margin-left: 3px;
}

.compact-progress {
    margin-bottom: 16px;
}

/* 概念與標籤 */
.concept-section {
    margin-bottom: 20px;
}

.summary-text {
    font-size: 0.95rem;
    color: #4b5563;
    line-height: 1.7;
    font-weight: 400;
    margin-bottom: 12px;
    text-align: justify;
}

.tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.micro-tag {
    font-size: 0.75rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 600;
    letter-spacing: 0.3px;
}

/* 4. 行動網格 (Do / Don't) */
.action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.action-card {
    border-radius: 12px;
    padding: 16px;
    font-size: 0.9rem;
    border: 1px solid transparent;
    height: 100%;
}

/* 綠色系 (充能) */
.do-card {
    background-color: #f0fdf4;
    border-color: #bbf7d0;
}

/* 紅色系 (耗損) */
.dont-card {
    background-color: #fef2f2;
    border-color: #fecaca;
}

.action-header {
    font-weight: 800;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
}

.text-success {
    color: #15803d;
}

.text-danger {
    color: #b91c1c;
}

.action-list {
    margin: 0;
    padding-left: 0;
    list-style: none;
    color: #4b5563;
    line-height: 1.6;
}

.action-list li {
    margin-bottom: 6px;
    padding-left: 14px;
    position: relative;
}

/* 自定義列表項目符號 */
.action-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: currentColor;
    font-weight: bold;
    opacity: 0.6;
}

@media (max-width: 640px) {
    .action-grid {
        grid-template-columns: 1fr;
    }
}
</style>