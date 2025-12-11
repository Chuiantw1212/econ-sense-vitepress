<template>
    <el-card class="intimacy-card" shadow="hover" v-if="roleData">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">💞 親密關係架構</span>
                </div>
                <div class="header-right">
                    <span class="protocol-badge">{{ roleData.protocol }}</span>
                </div>
            </div>
        </template>

        <div class="card-content">

            <div class="hero-section">
                <div class="hero-main">
                    <div class="hero-code">{{ roleData.code }}</div>
                    <div class="hero-desc">{{ roleData.desc }}</div>
                </div>
                <div class="hero-rule">
                    <el-icon>
                        <Key />
                    </el-icon>
                    <span>鐵律：找同樣是 <strong>{{ roleData.protocol.split(' ')[0] }} 型</strong> 的人。</span>
                </div>
            </div>

            <div class="guide-strip">
                <div class="guide-item calm">
                    <el-icon>
                        <Ship />
                    </el-icon> 動盪期選 <strong>同頻</strong>
                </div>
                <div class="guide-divider"></div>
                <div class="guide-item active">
                    <el-icon>
                        <Compass />
                    </el-icon> 探索期選 <strong>互補</strong>
                </div>
            </div>

            <div class="paths-container">
                <el-tabs class="clean-tabs" stretch>

                    <el-tab-pane label="同頻共振">
                        <div class="tab-inner">
                            <div class="partner-card theme-resonance">

                                <div class="pc-header">
                                    <span class="pc-subtitle">鏡像伴侶 (The Mirror)</span>
                                </div>

                                <div class="pc-identity">
                                    <div class="pc-name">{{ roleData.pathA.target }}</div>
                                    <div class="pc-code">{{ roleData.code }}</div>
                                </div>

                                <div class="pc-dynamics">
                                    <div class="dyn-title">{{ roleData.pathA.relation }}</div>
                                    <div class="dyn-text">{{ roleData.pathA.chemistry }}</div>
                                </div>

                                <div class="pc-tags">
                                    <span class="tag-item pro">👍 {{ roleData.pathA.pros }}</span>
                                    <span class="tag-item con">⚠️ {{ roleData.pathA.cons }}</span>
                                </div>

                                <div class="pc-manual" v-if="roleData.pathA.manual">
                                    <div class="man-title"><el-icon>
                                            <Tools />
                                        </el-icon> 維護手冊</div>
                                    <div v-for="(item, idx) in roleData.pathA.manual" :key="idx" class="man-item">
                                        • {{ item }}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="黃金互補">
                        <div class="tab-inner">
                            <div class="partner-card theme-complementary">

                                <div class="pc-header">
                                    <span class="pc-subtitle">互補伴侶 (The Partner)</span>
                                </div>

                                <div class="pc-identity">
                                    <div class="pc-name">{{ roleData.pathB.target }}</div>
                                    <div class="pc-code">{{ roleData.pathB.code }}</div>
                                </div>

                                <div class="pc-dynamics">
                                    <div class="dyn-title">{{ roleData.pathB.relation }}</div>
                                    <div class="dyn-text">{{ roleData.pathB.chemistry }}</div>
                                </div>

                                <div class="pc-tags">
                                    <span class="tag-item pro">👍 {{ roleData.pathB.pros }}</span>
                                    <span class="tag-item con">⚠️ {{ roleData.pathB.cons }}</span>
                                </div>

                                <div class="pc-manual" v-if="roleData.pathB.manual">
                                    <div class="man-title"><el-icon>
                                            <Tools />
                                        </el-icon> 操作手冊</div>
                                    <div v-for="(item, idx) in roleData.pathB.manual" :key="idx" class="man-item">
                                        • {{ item }}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </el-tab-pane>

                </el-tabs>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled, Key, Ship, Compass, Tools } from '@element-plus/icons-vue';
import { data } from './intimacy.data.js';

const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

const roleData = computed(() => {
    // @ts-ignore
    return data[props.primaryRole] || null;
});
</script>

<style scoped>
/* 容器優化 */
.intimacy-card {
    margin-top: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title {
    font-weight: 800;
    font-size: 1.1rem;
    color: #303133;
}

.protocol-badge {
    background: #f4f4f5;
    color: #606266;
    font-size: 0.8rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 6px;
}

/* 1. Hero Section */
.hero-section {
    text-align: center;
    padding: 20px 0 10px;
}

.hero-code {
    font-size: 2rem;
    font-weight: 900;
    color: #303133;
    font-family: sans-serif;
    letter-spacing: 1px;
    line-height: 1.1;
}

.hero-desc {
    font-size: 0.95rem;
    color: #606266;
    margin-top: 8px;
    line-height: 1.5;
    padding: 0 10px;
}

.hero-rule {
    margin-top: 15px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff0f6;
    color: #c2185b;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
}

/* 2. Guide Strip (簡化版) */
.guide-strip {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin: 15px 0 20px;
    padding: 10px;
    background: #f9fafc;
    border-radius: 8px;
}

.guide-item {
    font-size: 0.85rem;
    color: #606266;
    display: flex;
    align-items: center;
    gap: 5px;
}

.guide-item strong {
    margin-left: 2px;
}

.guide-divider {
    width: 1px;
    height: 12px;
    background: #dcdfe6;
}

.calm {
    color: #00897b;
}

.active {
    color: #e65100;
}

/* 3. Partner Card */
.clean-tabs :deep(.el-tabs__header) {
    margin-bottom: 15px;
}

.clean-tabs :deep(.el-tabs__item) {
    font-size: 0.95rem;
    color: #909399;
}

.clean-tabs :deep(.el-tabs__item.is-active) {
    color: #303133;
    font-weight: 800;
}

.clean-tabs :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: #f0f0f0;
}

.tab-inner {
    animation: fadeIn 0.4s ease;
}

.partner-card {
    border-radius: 12px;
    padding: 20px;
    border: 1px solid transparent;
}

/* Header */
.pc-header {
    margin-bottom: 10px;
}

.pc-subtitle {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.7;
}

/* Identity - 關鍵修改：預設 Flex，手機版強制換行 */
.pc-identity {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 15px;
}

.pc-name {
    font-size: 1.6rem;
    font-weight: 800;
    color: #303133;
    line-height: 1.2;
}

.pc-code {
    font-family: monospace;
    font-size: 0.9rem;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.8);
    font-weight: bold;
    white-space: nowrap;
}

/* Dynamics */
.pc-dynamics {
    margin-bottom: 20px;
}

.dyn-title {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 6px;
}

.dyn-text {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #555;
    text-align: justify;
}

/* Tags */
.pc-tags {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.tag-item {
    font-size: 0.85rem;
    font-weight: 500;
    line-height: 1.4;
    display: flex;
    gap: 6px;
}

.tag-item.pro {
    color: #2e7d32;
}

.tag-item.con {
    color: #e65100;
}

/* Manual */
.pc-manual {
    padding: 12px;
    border-radius: 8px;
    margin-top: 10px;
}

.man-title {
    font-size: 0.8rem;
    font-weight: 800;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.man-item {
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 4px;
    padding-left: 4px;
}

/* Themes */
.theme-resonance {
    background: linear-gradient(180deg, #e0f2f1 0%, #ffffff 100%);
    /* 頂部到底部漸層，更乾淨 */
    border-color: #b2dfdb;
}

.theme-resonance .pc-subtitle {
    color: #00695c;
}

.theme-resonance .pc-code {
    color: #00796b;
    border: 1px solid #80cbc4;
}

.theme-resonance .dyn-title {
    color: #004d40;
}

.theme-resonance .pc-manual {
    background: rgba(224, 242, 241, 0.5);
    border: 1px dashed #80cbc4;
}

.theme-resonance .man-title {
    color: #00695c;
}

.theme-resonance .man-item {
    color: #004d40;
}

.theme-complementary {
    background: linear-gradient(180deg, #fff3e0 0%, #ffffff 100%);
    border-color: #ffcc80;
}

.theme-complementary .pc-subtitle {
    color: #e65100;
}

.theme-complementary .pc-code {
    color: #ef6c00;
    border: 1px solid #ffb74d;
}

.theme-complementary .dyn-title {
    color: #d84315;
}

.theme-complementary .pc-manual {
    background: rgba(255, 243, 224, 0.5);
    border: 1px dashed #ffab91;
}

.theme-complementary .man-title {
    color: #bf360c;
}

.theme-complementary .man-item {
    color: #3e2723;
}

/* Mobile Optimization Media Query */
@media (max-width: 600px) {

    /* 強制 Hero 區塊靠左對齊，解決「換行又置中」的視覺混亂 */
    .hero-section {
        text-align: left;
        padding: 15px 5px;
    }

    .hero-code {
        font-size: 1.8rem;
    }

    .hero-desc {
        padding: 0;
        margin-top: 5px;
    }

    .hero-rule {
        width: 100%;
        box-sizing: border-box;
    }

    /* 角色與代碼垂直堆疊，解決「擠在一起」的髒亂 */
    .pc-identity {
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
    }

    .pc-name {
        font-size: 1.5rem;
    }

    .pc-code {
        font-size: 0.85rem;
    }

    /* 導航列更緊湊 */
    .guide-strip {
        gap: 10px;
        font-size: 0.8rem;
    }

    .guide-item strong {
        display: block;
        font-size: 0.85rem;
    }

    /* 強調文字換行 */
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>