<template>
    <el-card class="management-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🛡️ 財富守成 (Wealth Defense)</span>
                    <el-tooltip content="分析你的金錢圖騰（潛意識金錢觀）與收支管理盲點。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#13ce66" effect="dark" round style="border:none;">行為矯正</el-tag>
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

                        <div class="totem-box">
                            <div class="totem-icon-area">
                                <el-icon class="totem-icon">
                                    <WalletFilled />
                                </el-icon>
                            </div>
                            <div class="totem-content">
                                <div class="totem-label">MONEY TOTEM</div>
                                <div class="totem-head">{{ role.info.totem }}</div>
                                <div class="totem-text">{{ role.info.totemDesc }}</div>
                            </div>
                        </div>

                        <el-divider border-style="dashed">
                            <span class="divider-text">收支行為診斷</span>
                        </el-divider>

                        <div class="info-box warning-box">
                            <div class="box-title">
                                <el-icon>
                                    <View />
                                </el-icon> 行為盲點
                            </div>
                            <div class="box-content">{{ role.info.management.desc }}</div>
                        </div>

                        <div class="info-box success-box">
                            <div class="box-title">
                                <el-icon>
                                    <Tools />
                                </el-icon> 矯正策略：{{ role.info.management.title }}
                            </div>
                            <div class="box-content highlight-text">
                                {{ role.info.management.action }}
                            </div>
                        </div>

                        <div class="blind-spot">
                            <div class="blind-icon">🛑</div>
                            <div class="blind-text">
                                <strong>致命傷：</strong>{{ role.info.management.blindSpot }}
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
import { InfoFilled, WalletFilled, View, Tools } from '@element-plus/icons-vue';
// 引入 wealth.data.js
import { data } from './wealth_management.data.js';

const props = defineProps<{ primaryRole: string, secondaryRole?: string }>();
const activeTab = ref('');

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
</script>

<style scoped>
.management-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
    border-left: 5px solid #13ce66;
    /* 綠色象徵守成 */
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

/* Tabs */
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
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* 1. Totem (黑金) */
.totem-box {
    display: flex;
    background: linear-gradient(135deg, #2c3e50, #000);
    color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.totem-icon-area {
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    font-size: 2rem;
    color: #13ce66;
    /* 這裡用綠色呼應守成主題 */
}

.totem-content {
    padding: 15px;
    flex-grow: 1;
}

.totem-label {
    font-size: 0.7rem;
    letter-spacing: 1.5px;
    opacity: 0.7;
    margin-bottom: 2px;
    color: #E5C07B;
}

.totem-head {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 4px;
    color: #fff;
}

.totem-text {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #ccc;
    font-style: italic;
}

.divider-text {
    font-size: 0.85rem;
    color: #909399;
}

/* 2. Info Boxes (通用) */
.info-box {
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid transparent;
}

.box-title {
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.box-content {
    font-size: 0.95rem;
    line-height: 1.6;
    text-align: justify;
}

/* Warning Box (橘色) */
.warning-box {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
}

.warning-box .box-content {
    color: #8c5f00;
}

/* Success Box (綠色 - 重點區) */
.success-box {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
}

.success-box .box-content {
    color: #405936;
}

.highlight-text {
    font-weight: 500;
}

/* 3. Blind Spot (灰色底) */
.blind-spot {
    display: flex;
    gap: 10px;
    background: #f4f4f5;
    padding: 10px 15px;
    border-radius: 6px;
    align-items: flex-start;
}

.blind-icon {
    font-size: 1.2rem;
    margin-top: -2px;
}

.blind-text {
    font-size: 0.9rem;
    color: #606266;
    line-height: 1.5;
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