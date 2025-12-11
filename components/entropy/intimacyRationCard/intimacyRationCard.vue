<template>
    <el-card class="intimacy-card" shadow="hover" v-if="roleData">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">💞 親密關係架構</span>
                    <el-tooltip content="熵腦熱力學：關係是兩個系統的能量交換。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
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
                    <span>鐵律：請尋找同樣是 <strong>{{ roleData.protocol.split(' ')[0] }} 型</strong> 的人，否則無法通訊。</span>
                </div>
            </div>

            <div class="guide-container">
                <div class="guide-box guide-calm">
                    <div class="guide-icon"><el-icon>
                            <Ship />
                        </el-icon></div>
                    <div class="guide-content">
                        <div class="guide-title">動盪期首選</div>
                        <div class="guide-desc">若你需要修復與安穩<br />選擇 <strong>同頻共振</strong></div>
                    </div>
                </div>
                <div class="guide-vs">VS</div>
                <div class="guide-box guide-active">
                    <div class="guide-icon"><el-icon>
                            <Compass />
                        </el-icon></div>
                    <div class="guide-content">
                        <div class="guide-title">探索期首選</div>
                        <div class="guide-desc">若你渴望突破與完整<br />選擇 <strong>黃金互補</strong></div>
                    </div>
                </div>
            </div>

            <div class="paths-container">
                <el-tabs class="clean-tabs" stretch>

                    <el-tab-pane label="路徑 A：同頻共振 (舒適)">
                        <div class="tab-inner">
                            <div class="partner-card theme-resonance">

                                <div class="pc-header">
                                    <el-icon>
                                        <CopyDocument />
                                    </el-icon> 鏡像伴侶 (The Mirror)
                                </div>

                                <div class="pc-identity">
                                    <div class="pc-name">{{ roleData.pathA.target }}</div>
                                    <div class="pc-code">{{ roleData.code }} (同款)</div>
                                </div>

                                <div class="pc-dynamics">
                                    <div class="dyn-title">{{ roleData.pathA.relation }}</div>
                                    <div class="dyn-text">{{ roleData.pathA.chemistry }}</div>
                                </div>

                                <div class="pc-tags">
                                    <div class="tag-item tag-pro">
                                        <el-icon>
                                            <CircleCheckFilled />
                                        </el-icon> {{ roleData.pathA.pros }}
                                    </div>
                                    <div class="tag-item tag-con">
                                        <el-icon>
                                            <WarningFilled />
                                        </el-icon> {{ roleData.pathA.cons }}
                                    </div>
                                </div>

                                <div class="pc-manual" v-if="roleData.pathA.manual">
                                    <div class="man-title"><el-icon>
                                            <Tools />
                                        </el-icon> 同頻維護手冊</div>
                                    <div v-for="(item, idx) in roleData.pathA.manual" :key="idx" class="man-item">
                                        <span class="man-dot">•</span> {{ item }}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="路徑 B：黃金互補 (成長)">
                        <div class="tab-inner">
                            <div class="partner-card theme-complementary">

                                <div class="pc-header">
                                    <el-icon>
                                        <Connection />
                                    </el-icon> 互補伴侶 (The Partner)
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
                                    <div class="tag-item tag-pro">
                                        <el-icon>
                                            <CircleCheckFilled />
                                        </el-icon> {{ roleData.pathB.pros }}
                                    </div>
                                    <div class="tag-item tag-con">
                                        <el-icon>
                                            <WarningFilled />
                                        </el-icon> {{ roleData.pathB.cons }}
                                    </div>
                                </div>

                                <div class="pc-manual" v-if="roleData.pathB.manual">
                                    <div class="man-title"><el-icon>
                                            <Tools />
                                        </el-icon> 互補操作手冊</div>
                                    <div v-for="(item, idx) in roleData.pathB.manual" :key="idx" class="man-item">
                                        <span class="man-dot">•</span> {{ item }}
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
import { InfoFilled, Key, Ship, Compass, CopyDocument, Connection, Tools, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue';
// 引入資料檔
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
/* 卡片容器：去框線，強調柔和感 */
.intimacy-card {
    margin-top: 20px;
    border-radius: 16px;
    border: none;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
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

.info-icon {
    font-size: 14px;
    color: #bdbdbd;
    cursor: help;
}

.protocol-badge {
    background: #f4f4f5;
    color: #606266;
    font-size: 0.8rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid #dcdfe6;
}

/* 1. Hero Section */
.hero-section {
    text-align: center;
    padding: 25px 0 15px;
}

.hero-code {
    font-size: 2.2rem;
    font-weight: 900;
    color: #303133;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: 2px;
    line-height: 1.2;
}

.hero-desc {
    font-size: 1rem;
    color: #555;
    margin-top: 8px;
    line-height: 1.6;
}

.hero-rule {
    margin-top: 15px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff0f6;
    color: #c2185b;
    padding: 6px 16px;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 600;
}

/* 2. Guide Container (平衡設計) */
.guide-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 15px;
    margin: 20px 0;
    gap: 10px;
}

.guide-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
}

.guide-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #fff;
    flex-shrink: 0;
}

.guide-content {
    display: flex;
    flex-direction: column;
}

.guide-title {
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
}

.guide-desc {
    font-size: 0.85rem;
    line-height: 1.3;
    color: #606266;
}

.guide-desc strong {
    color: #303133;
}

/* Theme Styles for Guide */
.guide-calm .guide-icon {
    background: linear-gradient(135deg, #4db6ac, #009688);
}

.guide-calm .guide-title {
    color: #00796b;
}

.guide-active .guide-icon {
    background: linear-gradient(135deg, #ffb74d, #f57c00);
}

.guide-active .guide-title {
    color: #ef6c00;
}

.guide-vs {
    font-size: 0.8rem;
    font-weight: 900;
    color: #e0e0e0;
    font-style: italic;
}

/* 3. Partner Card (核心組件) */
.clean-tabs :deep(.el-tabs__header) {
    background: transparent;
    margin-bottom: 20px;
}

.clean-tabs :deep(.el-tabs__item.is-active) {
    color: #303133;
    font-weight: 900;
}

.tab-inner {
    padding: 0 5px;
    animation: fadeIn 0.5s ease;
}

.partner-card {
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    border: 1px solid transparent;
}

/* Header */
.pc-header {
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 15px;
    opacity: 0.9;
}

/* Identity */
.pc-identity {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.pc-name {
    font-size: 2rem;
    font-weight: 800;
    color: #303133;
    line-height: 1;
}

.pc-code {
    font-family: monospace;
    font-size: 1rem;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.8);
    font-weight: bold;
}

/* Dynamics */
.pc-dynamics {
    margin-bottom: 25px;
}

.dyn-title {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 6px;
}

.dyn-text {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #555;
}

/* Tags (Pros/Cons) */
.pc-tags {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 25px;
    background: rgba(255, 255, 255, 0.6);
    padding: 15px;
    border-radius: 8px;
}

.tag-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.4;
}

.tag-pro {
    color: #2e7d32;
}

.tag-con {
    color: #e65100;
}

/* Manual List */
.pc-manual {
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
}

.man-title {
    font-size: 0.85rem;
    font-weight: 800;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.man-item {
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 6px;
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.man-dot {
    font-weight: bold;
    font-size: 1.2rem;
    line-height: 1rem;
}

/* === Theme Styles (Unified Logic) === */

/* Resonance (Blue/Teal) */
.theme-resonance {
    background: linear-gradient(135deg, #e0f2f1 0%, #e8eaf6 100%);
    border-color: #b2dfdb;
}

.theme-resonance .pc-header {
    color: #00796b;
}

.theme-resonance .pc-code {
    color: #00796b;
    border: 1px solid #80cbc4;
}

.theme-resonance .dyn-title {
    color: #00695c;
}

.theme-resonance .pc-manual {
    background: rgba(255, 255, 255, 0.7);
    border: 1px dashed #80cbc4;
}

.theme-resonance .man-title {
    color: #00897b;
}

.theme-resonance .man-item {
    color: #004d40;
}

.theme-resonance .man-dot {
    color: #00897b;
}

/* Complementary (Orange/Pink) */
.theme-complementary {
    background: linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%);
    border-color: #ffcc80;
}

.theme-complementary .pc-header {
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
    background: rgba(255, 255, 255, 0.7);
    border: 1px dashed #ffab91;
}

.theme-complementary .man-title {
    color: #d84315;
}

.theme-complementary .man-item {
    color: #3e2723;
}

.theme-complementary .man-dot {
    color: #e65100;
}

@media (max-width: 600px) {
    .guide-container {
        flex-direction: column;
        align-items: stretch;
        text-align: left;
    }

    .guide-vs {
        display: none;
    }

    .pc-body {
        flex-direction: column;
        gap: 5px;
    }

    .pc-name {
        font-size: 1.6rem;
    }
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