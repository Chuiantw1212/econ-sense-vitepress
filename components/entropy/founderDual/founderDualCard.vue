<template>
    <el-card class="founder-dual-card" shadow="hover" v-if="dualInfo">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">⚛️ 創始人雙核原力 (Founder Dual-Core)</span>
                    <el-tooltip content="分析你的主顯與次顯人格如何產生「化學反應」，決定了你的創業風格。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag :color="thermoColor" effect="dark" round style="border:none;">
                    {{ dualInfo.thermoType?.split(' ')[0] || '分析中' }}
                </el-tag>
            </div>
        </template>

        <div class="card-content">

            <div class="hero-section" :style="gradientStyle">
                <div class="hero-overlay">
                    <div class="hero-icon">
                        {{ getThermoIcon(dualInfo.chemistry) }}
                    </div>
                    <div class="hero-text">
                        <div class="chemistry-label">{{ dualInfo.chemistry }}</div>
                        <h2 class="hero-title">{{ dualInfo.title }}</h2>
                        <div class="thermo-subtitle">
                            {{ dualInfo.thermoType?.split('(')[1]?.replace(')', '') || '' }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="desc-box">
                <div class="role-badges">
                    <span class="role-badge" :style="{ color: primaryColor }">● {{ primaryRole }}</span>
                    <span class="plus">+</span>
                    <span class="role-badge" :style="{ color: secondaryColor }">● {{ secondaryRole }}</span>
                </div>
                <div class="desc-text">{{ dualInfo.desc }}</div>
            </div>

            <el-divider border-style="dashed" />

            <div class="analysis-grid">
                <div class="analysis-box advantage-box">
                    <div class="box-header">
                        <el-icon>
                            <Trophy />
                        </el-icon> 創業必殺技
                    </div>
                    <div class="box-content">{{ dualInfo.advantage }}</div>
                </div>

                <div class="analysis-box blindspot-box">
                    <div class="box-header">
                        <el-icon>
                            <Warning />
                        </el-icon> 系統性盲區
                    </div>
                    <div class="box-content">{{ dualInfo.blindspot }}</div>
                </div>
            </div>

            <div class="partner-box">
                <div class="partner-icon">🧩</div>
                <div class="partner-text">
                    <strong>互補拼圖：</strong>{{ dualInfo.partner || getPartnerSuggestion(dualInfo.chemistry) }}
                </div>
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled, Trophy, Warning } from '@element-plus/icons-vue';
import { data } from './founder_dual.data.js';

const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

// 顏色映射表
const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500', 'Pioneer': '#FF8C00', 'Toolmaker': '#1E90FF', 'Sentry': '#00008B',
    'Gatherer': '#32CD32', 'Shaman': '#9370DB', 'Helper': '#20B2AA', 'Elder': '#2E8B57',
};

// 1. 計算雙核心資料
const dualInfo = computed(() => {
    if (!props.primaryRole) return null;

    const p = props.primaryRole;
    const s = props.secondaryRole || p; // Fallback to self

    // 產生 Key (按字母順序排序，確保 Hunter_Pioneer 與 Pioneer_Hunter 查到同一筆)
    const key = [p, s].sort().join('_');

    // @ts-ignore
    return data[key] || {
        title: "未知組合",
        thermoType: "Unknown (N/A)",
        chemistry: "N/A",
        desc: "尚未收錄此組合的詳細分析，請確認角色代碼是否正確。",
        advantage: "N/A",
        blindspot: "N/A"
    };
});

// 2. 視覺計算
const primaryColor = computed(() => ARCHETYPE_COLORS[props.primaryRole] || '#ccc');
const secondaryColor = computed(() => props.secondaryRole ? ARCHETYPE_COLORS[props.secondaryRole] : primaryColor.value);

const gradientStyle = computed(() => {
    return {
        background: `linear-gradient(135deg, ${primaryColor.value}, ${secondaryColor.value})`
    };
});

const thermoColor = computed(() => {
    const type = dualInfo.value?.chemistry || '';
    if (type.includes('H+H')) return '#f56c6c'; // 紅
    if (type.includes('C+C')) return '#409eff'; // 藍
    return '#9b59b6'; // 紫 (混合)
});

// 3. Helper Functions
function getThermoIcon(chemistry: string) {
    if (chemistry.includes('H+H')) return '🔥';
    if (chemistry.includes('C+C')) return '🧊';
    return '⚡';
}

function getPartnerSuggestion(chemistry: string) {
    if (chemistry.includes('H+H')) return "你需要一位 冷控型 (C) 的營運長或財務長來幫你踩煞車。";
    if (chemistry.includes('C+C')) return "你需要一位 熱動型 (H) 的業務合夥人或創始人來幫你點火。";
    return "你自帶冷熱循環，但在擴張期可能需要根據當下缺口補人。";
}
</script>

<style scoped>
.founder-dual-card {
    margin-top: 20px;
    border-radius: 12px;
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

/* 1. Hero Section */
.hero-section {
    position: relative;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: #fff;
}

.hero-icon {
    font-size: 3.5rem;
    margin-right: 15px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.hero-text {
    display: flex;
    flex-direction: column;
}

.chemistry-label {
    font-size: 0.8rem;
    opacity: 0.9;
    letter-spacing: 1px;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    border-radius: 4px;
    width: fit-content;
    margin-bottom: 4px;
}

.hero-title {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
}

.thermo-subtitle {
    font-size: 0.9rem;
    opacity: 0.8;
    font-style: italic;
}

/* 2. Desc Box */
.desc-box {
    margin-bottom: 15px;
}

.role-badges {
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
}

.plus {
    color: #909399;
    font-size: 0.8rem;
}

.desc-text {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    text-align: justify;
}

/* 3. Analysis Grid */
.analysis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

@media (max-width: 600px) {
    .analysis-grid {
        grid-template-columns: 1fr;
    }
}

.analysis-box {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid transparent;
}

.box-header {
    font-weight: bold;
    font-size: 0.95rem;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.box-content {
    font-size: 0.9rem;
    line-height: 1.5;
}

.advantage-box {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
}

.advantage-box .box-header {
    color: #529b2e;
}

.advantage-box .box-content {
    color: #3b5e2b;
}

.blindspot-box {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
}

.blindspot-box .box-header {
    color: #c45656;
}

.blindspot-box .box-content {
    color: #8f4b4b;
}

/* 4. Partner Box */
.partner-box {
    background: #f4f4f5;
    border-radius: 8px;
    padding: 12px 15px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.partner-icon {
    font-size: 1.2rem;
    margin-top: -2px;
}

.partner-text {
    font-size: 0.9rem;
    color: #606266;
    line-height: 1.5;
}
</style>