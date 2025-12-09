<template>
    <el-card class="wealth-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">💰 財富戰略 (Wealth Strategy)</span>
                    <el-tooltip content="分析你的雙核心金錢觀（Money Totem）與最適合你的理財護城河。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#B88230" effect="dark" round style="border:none;">雙核心觀點</el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs v-model="activeTab" type="border-card" class="wealth-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            <span class="role-dot" :style="{ color: role.color }">●</span>
                            {{ index === 0 ? '主顯' : '次顯' }}：{{ role.nameZh }}
                        </span>
                    </template>

                    <div class="tab-inner">

                        <div class="intro-text">
                            當 <strong>{{ role.nameZh }}</strong> 掌管你的錢包時，你的財務性格如下：
                        </div>

                        <div class="totem-section">
                            <div class="totem-icon">
                                <el-icon>
                                    <Wallet />
                                </el-icon>
                            </div>
                            <div class="totem-text">
                                <div class="totem-label">MONEY TOTEM</div>
                                <div class="totem-title">{{ role.info.totem }}</div>
                                <div class="totem-desc">{{ role.info.totemDesc }}</div>
                            </div>
                        </div>

                        <div class="style-box">
                            <div class="style-label">投資屬性：</div>
                            <div class="style-tags">
                                <el-tag v-for="(tag, idx) in role.info.style.split(' / ')" :key="idx" type="warning"
                                    effect="plain" class="style-tag">
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </div>

                        <el-divider border-style="dashed" />

                        <div class="advice-box">
                            <div class="box-title">
                                <el-icon>
                                    <Key />
                                </el-icon> 核心策略：{{ role.info.advice.title }}
                            </div>
                            <div class="box-content">
                                {{ role.info.advice.content }}
                            </div>
                        </div>

                        <div class="risk-box">
                            <div class="risk-title">
                                <el-icon>
                                    <Warning />
                                </el-icon> 財務陰影
                            </div>
                            <div class="risk-content">
                                {{ role.info.risk }}
                            </div>
                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InfoFilled, Wallet, Key, Warning } from '@element-plus/icons-vue';
// 引入 wealth.data.js (無需變更)
import { data } from './wealth.data.js';

const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

const activeTab = ref('');

// --- 資料映射 ---
const ROLE_NAME_MAP: Record<string, string> = {
    'Hunter': '獵人', 'Pioneer': '先驅', 'Toolmaker': '工匠', 'Sentry': '哨兵',
    'Gatherer': '採集者', 'Shaman': '薩滿', 'Helper': '助人者', 'Elder': '長老',
};

const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500', 'Pioneer': '#FF8C00', 'Toolmaker': '#1E90FF', 'Sentry': '#00008B',
    'Gatherer': '#32CD32', 'Shaman': '#9370DB', 'Helper': '#20B2AA', 'Elder': '#2E8B57',
};

// --- Computed ---
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

</script>

<style scoped>
.wealth-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
    /* 金色側邊條，象徵財富 */
    border-left: 5px solid #B88230;
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

/* Tabs 樣式 */
.wealth-tabs {
    border: none;
    box-shadow: none;
}

.wealth-tabs :deep(.el-tabs__content) {
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

.tab-inner {
    animation: fadeIn 0.3s ease-in-out;
}

.intro-text {
    text-align: center;
    font-size: 0.9rem;
    color: #606266;
    margin-bottom: 15px;
}

/* 1. 圖騰區 (黑底金字) */
.totem-section {
    display: flex;
    align-items: center;
    gap: 15px;
    background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
    color: #e5c07b;
    /* 淡金色 */
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #444;
}

.totem-icon {
    font-size: 2.8rem;
    display: flex;
    align-items: center;
    color: #B88230;
    /* 深金色 */
    padding-right: 15px;
    border-right: 1px solid #444;
}

.totem-text {
    flex-grow: 1;
}

.totem-label {
    font-size: 0.65rem;
    color: #888;
    letter-spacing: 1px;
    margin-bottom: 2px;
}

.totem-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
    color: #fff;
}

.totem-desc {
    font-size: 0.9rem;
    color: #ccc;
    line-height: 1.4;
    font-style: italic;
}

/* 2. 風格標籤 */
.style-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.style-label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #606266;
}

.style-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.style-tag {
    border-color: #e6a23c;
    color: #b88230;
    font-weight: bold;
    background-color: #fffbf0;
}

/* 3. 建議與風險區塊共用 */
.advice-box,
.risk-box {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    border: 1px solid transparent;
}

/* 建議區 (淡黃色) */
.advice-box {
    background-color: #fdf6ec;
    border-color: #faecd8;
}

.box-title {
    font-weight: bold;
    color: #b88230;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
}

.box-content {
    font-size: 0.95rem;
    color: #606266;
    line-height: 1.6;
    text-align: justify;
}

/* 風險區 (淡紅色) */
.risk-box {
    background-color: #fef0f0;
    border-color: #fde2e2;
    margin-bottom: 0;
}

.risk-title {
    font-weight: bold;
    color: #f56c6c;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
}

.risk-content {
    font-size: 0.95rem;
    color: #606266;
    line-height: 1.6;
    text-align: justify;
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