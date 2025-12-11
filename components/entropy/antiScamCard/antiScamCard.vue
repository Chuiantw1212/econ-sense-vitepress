<template>
    <el-card class="scam-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🛡️ 防詐護盾 (Anti-Scam)</span>
                    <el-tooltip content="分析你的認知偏差與大腦神經機制，揭露你最容易中招的詐騙劇本。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#000" effect="dark" round style="border:none; color: #ffeb3b;">
                    <el-icon style="vertical-align: middle; margin-right: 4px;">
                        <WarnTriangleFilled />
                    </el-icon>
                    高風險預警
                </el-tag>
            </div>
        </template>

        <div class="card-content">

            <el-tabs v-model="activeTab" type="border-card" class="scam-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            <span class="role-dot" :style="{ color: role.color }">●</span>
                            {{ index === 0 ? '主顯' : '次顯' }}：{{ role.nameZh }}
                        </span>
                    </template>

                    <div class="tab-inner">

                        <div class="weakness-box">
                            <div class="weakness-label">YOUR COGNITIVE BACKDOOR</div>
                            <div class="weakness-title">{{ role.info.weakness }}</div>

                            <div class="neuro-mechanism">
                                <span class="neuro-icon">🧠</span>
                                {{ role.info.neuroMechanism }}
                            </div>
                        </div>

                        <div class="hook-box">
                            <div class="hook-icon">🎣</div>
                            <div class="hook-text">
                                <span class="hook-label">詐騙話術：</span>
                                {{ role.info.hook }}
                            </div>
                        </div>

                        <el-divider border-style="dashed" class="divider-spacing" />

                        <div class="scenario-section">
                            <div class="section-title">
                                <el-icon>
                                    <VideoPlay />
                                </el-icon> 針對你的詐騙劇本
                            </div>
                            <ul class="scenario-list">
                                <li v-for="(item, idx) in role.info.scenarios" :key="idx">
                                    {{ item }}
                                </li>
                            </ul>
                        </div>

                        <div class="defense-box">
                            <div class="defense-header">
                                <el-icon>
                                    <Lock />
                                </el-icon> 防禦補丁 (Security Patch)
                            </div>
                            <div class="defense-content">{{ role.info.defense }}</div>
                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="footer-warning">
                <el-icon>
                    <Hide />
                </el-icon> 記住：貪婪與恐懼是駭客的鑰匙，冷靜是唯一的防火牆。
            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InfoFilled, WarnTriangleFilled, VideoPlay, Lock, Hide } from '@element-plus/icons-vue';
// 引入更新後的資料檔
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
.scam-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
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

.scam-tabs {
    border: none;
    box-shadow: none;
}

.scam-tabs :deep(.el-tabs__content) {
    padding: 20px 10px;
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

/* 1. Weakness Box */
.weakness-box {
    background: #2c3e50;
    color: #ffeb3b;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.weakness-label {
    font-size: 0.7rem;
    letter-spacing: 2px;
    opacity: 0.8;
    margin-bottom: 4px;
}

.weakness-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 10px;
}

/* 神經機制區塊 */
.neuro-mechanism {
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #fff;
    text-align: left;
    line-height: 1.5;
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.neuro-icon {
    font-size: 1rem;
}

/* 2. Hook Box */
.hook-box {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #fff8e1;
    border: 1px dashed #ffc107;
    padding: 12px;
    border-radius: 8px;
}

.hook-icon {
    font-size: 1.5rem;
    margin-top: -2px;
}

.hook-text {
    font-size: 0.95rem;
    color: #5d4037;
    font-style: italic;
    line-height: 1.5;
}

.hook-label {
    font-weight: bold;
    font-style: normal;
    color: #ff8f00;
}

.divider-spacing {
    margin: 10px 0;
}

/* 3. Scenario List */
.scenario-section {
    padding: 0 5px;
}

.section-title {
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #303133;
}

.scenario-list {
    margin: 0;
    padding-left: 20px;
    color: #606266;
    font-size: 0.9rem;
    line-height: 1.6;
}

.scenario-list li {
    margin-bottom: 6px;
}

/* 4. Defense Box */
.defense-box {
    background: #f0f9eb;
    border-left: 4px solid #67c23a;
    padding: 15px;
    border-radius: 4px;
    margin-top: 5px;
}

.defense-header {
    color: #67c23a;
    font-weight: 800;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.defense-content {
    font-size: 0.95rem;
    color: #303133;
    font-weight: 500;
    line-height: 1.5;
    text-align: justify;
}

/* Footer */
.footer-warning {
    margin-top: 10px;
    padding: 10px;
    background: #000;
    color: #fff;
    font-size: 0.75rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
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