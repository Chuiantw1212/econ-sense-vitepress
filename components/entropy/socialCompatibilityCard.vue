<template>
    <el-card class="social-card" shadow="hover" v-if="compat">
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

            <p class="intro-text">
                你是 <strong>{{ roleNameZh }}</strong>，這是在人類物種中與你的關係鏈：
            </p>

            <div class="relation-grid">

                <div class="relation-item soulmate">
                    <div class="icon-wrapper">💖</div>
                    <div class="relation-info">
                        <div class="relation-label" style="color: #F56C6C;">靈魂伴侶 (Soulmate)</div>
                        <div class="relation-role">{{ compat.soulmate.name }}</div>
                        <div class="relation-desc">{{ compat.soulmate.reason }}</div>
                    </div>
                </div>

                <div class="relation-item ally">
                    <div class="icon-wrapper">⚔️</div>
                    <div class="relation-info">
                        <div class="relation-label" style="color: #409EFF;">互補戰友 (Ally)</div>
                        <div class="relation-role">{{ compat.ally.name }}</div>
                        <div class="relation-desc">{{ compat.ally.reason }}</div>
                    </div>
                </div>

                <div class="relation-item nemesis">
                    <div class="icon-wrapper">⚡</div>
                    <div class="relation-info">
                        <div class="relation-label" style="color: #E6A23C;">磨合天敵 (Nemesis)</div>
                        <div class="relation-role">{{ compat.nemesis.name }}</div>
                        <div class="relation-desc">{{ compat.nemesis.reason }}</div>
                    </div>
                </div>

                <div class="relation-item alien">
                    <div class="icon-wrapper">🛸</div>
                    <div class="relation-info">
                        <div class="relation-label alien-label">外星生物 (Alien)</div>
                        <div class="relation-role">{{ compat.alien.name }}</div>
                        <div class="relation-desc">{{ compat.alien.reason }} (www)</div>
                    </div>
                </div>

            </div>

        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
// 引入更新後的資料檔
import { data } from './socialCompatibilityCard.data.js';

const props = defineProps<{
    primaryRole: string
}>();

const ROLE_NAME_MAP: Record<string, string> = {
    'Hunter': '獵人', 'Pioneer': '先驅', 'Toolmaker': '工匠', 'Sentry': '哨兵',
    'Gatherer': '採集者', 'Shaman': '薩滿', 'Helper': '助人者', 'Elder': '長老',
};

const roleNameZh = computed(() => ROLE_NAME_MAP[props.primaryRole] || props.primaryRole);
const compat = computed(() => data[props.primaryRole] || null);
</script>

<style scoped>
.social-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    background: #fff;
    border-top: 4px solid #409EFF;
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

.intro-text {
    font-size: 0.95rem;
    color: #606266;
    margin-bottom: 15px;
    text-align: center;
}

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
    position: relative;
    overflow: hidden;
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

/* 外星人特殊樣式：淡灰色背景，低調處理 */
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
</style>