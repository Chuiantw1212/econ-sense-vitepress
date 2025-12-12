<template>
    <el-card class="scam-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🛡️ 防詐護盾</span>
                    <el-tooltip content="分析你的認知偏差，揭露你最容易中招的詐騙劇本。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag type="danger" effect="plain" round size="small">
                    高風險預警
                </el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="role-dot" :style="{ color: role.color }">●</span>
                        <span>{{ index === 0 ? '主顯' : '次顯' }}：{{ role.nameZh }}</span>
                    </template>

                    <div class="tab-inner">

                        <div class="section-group">
                            <div class="section-label">認知後門 (Weakness)</div>
                            <div class="weakness-content">
                                <h2 class="weakness-title">{{ role.info.weakness }}</h2>
                                <div class="neuro-text">
                                    {{ role.info.neuroMechanism }}
                                </div>
                            </div>
                        </div>

                        <div class="spacer"></div>

                        <div class="section-group">
                            <div class="section-label">致命話術 (The Hook)</div>
                            <div class="hook-block">
                                <el-icon class="quote-icon">
                                    <ChatLineSquare />
                                </el-icon>
                                <div class="hook-text">
                                    {{ role.info.hook }}
                                </div>
                            </div>
                        </div>

                        <div class="spacer"></div>

                        <div class="section-group">
                            <div class="section-label">常見劇本 (Scenarios)</div>
                            <div class="scenario-list">
                                <div v-for="(item, idx) in role.info.scenarios" :key="idx" class="scenario-item">
                                    <el-icon class="item-icon">
                                        <VideoPlay />
                                    </el-icon>
                                    <span class="item-text">{{ item }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="spacer-lg"></div>

                        <div class="defense-block">
                            <div class="def-header">
                                <el-icon>
                                    <Lock />
                                </el-icon> 防禦補丁 (Defense)
                            </div>
                            <div class="def-text">
                                {{ role.info.defense }}
                            </div>
                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="footer-note">
                <el-icon>
                    <Warning />
                </el-icon> 記住：貪婪與恐懼是駭客的鑰匙，冷靜是唯一的防火牆。
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
    InfoFilled,
    VideoPlay,
    Lock,
    Warning,
    Cpu,
    ChatLineSquare
} from '@element-plus/icons-vue';
// 引入資料檔
import { data } from './anti_scam.data.js';

const props = defineProps<{
    primaryRole: string,
    secondaryRole?: string
}>();

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
    if (props.primaryRole && data[props.primaryRole]) {
        list.push({
            key: props.primaryRole,
            nameZh: ROLE_NAME_MAP[props.primaryRole],
            color: ARCHETYPE_COLORS[props.primaryRole],
            // @ts-ignore
            info: data[props.primaryRole]
        });
    }
    if (props.secondaryRole && props.secondaryRole !== props.primaryRole && data[props.secondaryRole]) {
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
/* 容器 */
.scam-card {
    margin-top: 20px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    background: #fff;
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

/* 內部排版：留白是關鍵 */
.tab-inner {
    padding: 15px 5px 5px;
    animation: fadeIn 0.5s ease;
}

.section-group {
    margin-bottom: 5px;
}

.section-label {
    font-size: 0.75rem;
    color: #909399;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-weight: 600;
}

.spacer {
    height: 20px;
}

.spacer-lg {
    height: 30px;
}

/* 1. Weakness */
.weakness-title {
    font-size: 1.6rem;
    font-weight: 900;
    color: #303133;
    margin: 0 0 8px 0 !important;
    line-height: 1.2;
    padding: 0 !important;
}

.neuro-text {
    font-size: 0.9rem;
    color: #606266;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.5;
}

.neuro-icon {
    margin-top: 2px;
}

/* 2. Hook Block (左側線條引用) */
.hook-block {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    border-left: 4px solid #e6a23c;
    /* 唯一的警示色 */
    padding-left: 15px;
}

.quote-icon {
    font-size: 1.4rem;
    color: #e6a23c;
    margin-top: 2px;
}

.hook-text {
    font-size: 1rem;
    color: #303133;
    font-style: italic;
    line-height: 1.6;
    font-weight: 500;
}

/* 3. Scenario List */
.scenario-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.scenario-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.95rem;
    color: #555;
    line-height: 1.5;
}

.item-icon {
    color: #f56c6c;
    margin-top: 3px;
}

/* 4. Defense Block (輕量背景) */
.defense-block {
    background: #f0f9eb;
    /* 極淡綠 */
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid #e1f3d8;
}

.def-header {
    font-size: 0.9rem;
    font-weight: 800;
    color: #2e7d32;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.def-text {
    font-size: 0.95rem;
    color: #1b5e20;
    line-height: 1.6;
    font-weight: 500;
}

/* Footer */
.footer-note {
    margin-top: 0;
    padding: 12px 20px;
    background: #fafafa;
    border-top: 1px solid #ebeef5;
    color: #909399;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.role-dot {
    font-size: 1.2rem;
    line-height: 1;
}

@media (max-width: 600px) {
    .weakness-title {
        font-size: 1.4rem;
    }

    .footer-note {
        flex-direction: column;
        text-align: center;
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