<template>
    <el-card class="social-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🤝 你的社交生態位</span>
                    <el-tooltip content="分析你在群體中最適合的協作對象、潛在衝突與生活圈完全不重疊的族群。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag type="primary" effect="dark" round>關係圖譜</el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs v-model="activeTab" type="border-card" class="social-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            <span class="role-dot" :style="{ color: role.color }">●</span>
                            {{ index === 0 ? '主顯' : '次顯' }}：{{ role.nameZh }}
                        </span>
                    </template>

                    <div class="tab-inner">
                        <p class="intro-text">
                            當你處於 <strong>{{ role.nameZh }}</strong> 模式時，你的社交引力場如下：
                        </p>

                        <div class="relation-grid" v-if="role.compat">

                            <div class="relation-item soulmate">
                                <div class="icon-wrapper">💖</div>
                                <div class="relation-info">
                                    <div class="relation-label" style="color: #F56C6C;">靈魂伴侶 (Soulmate)</div>
                                    <div class="relation-role">{{ role.compat.soulmate.name }}</div>
                                    <div class="relation-desc">{{ role.compat.soulmate.reason }}</div>
                                </div>
                            </div>

                            <div class="relation-item ally">
                                <div class="icon-wrapper">⚔️</div>
                                <div class="relation-info">
                                    <div class="relation-label" style="color: #409EFF;">互補戰友 (Ally)</div>
                                    <div class="relation-role">{{ role.compat.ally.name }}</div>
                                    <div class="relation-desc">{{ role.compat.ally.reason }}</div>
                                </div>
                            </div>

                            <div class="relation-item nemesis">
                                <div class="icon-wrapper">⚡</div>
                                <div class="relation-info">
                                    <div class="relation-label" style="color: #E6A23C;">磨合天敵 (Nemesis)</div>
                                    <div class="relation-role">{{ role.compat.nemesis.name }}</div>
                                    <div class="relation-desc">{{ role.compat.nemesis.reason }}</div>
                                </div>
                            </div>

                            <div class="relation-item alien">
                                <div class="icon-wrapper">🛸</div>
                                <div class="relation-info">
                                    <div class="relation-label alien-label">外星生物 (Alien)</div>
                                    <div class="relation-role">{{ role.compat.alien.name }}</div>
                                    <div class="relation-desc">{{ role.compat.alien.reason }}</div>
                                </div>
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
import { InfoFilled } from '@element-plus/icons-vue';
import { data } from './socialCompatibilityCard.data.js';

// --- Props: 接收雙核心 ---
const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

const activeTab = ref('');

// --- 資料定義 ---
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

    // 主顯角色
    if (props.primaryRole) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole] || props.primaryRole,
            color: ARCHETYPE_COLORS[props.primaryRole] || '#333',
            compat: data[props.primaryRole]
        });
    }

    // 次顯角色 (存在且與主顯不同才顯示)
    if (props.secondaryRole && props.secondaryRole !== props.primaryRole) {
        list.push({
            key: props.secondaryRole,
            nameZh: ROLE_NAME_MAP[props.secondaryRole] || props.secondaryRole,
            color: ARCHETYPE_COLORS[props.secondaryRole] || '#333',
            compat: data[props.secondaryRole]
        });
    }

    return list;
});

// 預設選中第一個分頁
watch(displayRoles, (newVal) => {
    if (newVal.length > 0 && !activeTab.value) {
        activeTab.value = newVal[0].key;
    }
}, { immediate: true });

</script>

<style scoped>
.social-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    background: #fff;
    /* 移除原本的頂部粗框，因為現在是 Tabs 風格，邊框交給 Tabs 處理比較好看 */
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

/* Tabs 樣式微調 */
.social-tabs {
    border: none;
    box-shadow: none;
}

.social-tabs :deep(.el-tabs__content) {
    padding: 20px 5px 5px 5px;
    /* 調整內距 */
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
    font-size: 0.95rem;
    color: #606266;
    margin-bottom: 15px;
    text-align: center;
}

/* 關係列表樣式 (保持不變) */
.relation-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.relation-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 15px;
    border-radius: 8px;
    background: #fdfdfd;
    border: 1px solid #f0f2f5;
    transition: transform 0.2s;
}

.relation-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.soulmate {
    border-left: 4px solid #F56C6C;
}

.ally {
    border-left: 4px solid #409EFF;
}

.nemesis {
    border-left: 4px solid #E6A23C;
}

.alien {
    border-left: 4px solid #606266;
    background-color: #f8f9fa;
    opacity: 0.95;
}

.alien-label {
    color: #606266;
}

.icon-wrapper {
    font-size: 1.8rem;
    flex-shrink: 0;
}

.relation-info {
    flex-grow: 1;
}

.relation-label {
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 2px;
    letter-spacing: 0.5px;
}

.relation-role {
    font-weight: 800;
    font-size: 1.05rem;
    color: #303133;
    margin-bottom: 4px;
}

.relation-desc {
    font-size: 0.9rem;
    color: #606266;
    line-height: 1.4;
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