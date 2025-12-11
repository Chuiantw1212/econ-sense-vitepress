<template>
    <el-card class="investment-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">📈 投資戰略 (Investment Strategy)</span>
                    <el-tooltip content="提供適合你神經原型的資產配置、標的選擇與獲利策略。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#f56c6c" effect="dark" round style="border:none;">資產增值</el-tag>
            </div>
        </template>

        <div class="card-content">
            <el-tabs v-model="activeTab" type="border-card" class="wealth-tabs">
                <el-tab-pane v-for="(role, index) in displayRoles" :key="role.key" :name="role.key">
                    <template #label>
                        <span class="tab-label">
                            <span class="role-dot" :style="{ color: role.color }">●</span>
                            {{ index === 0 ? '主顯' : '次顯' }}
                        </span>
                    </template>

                    <div class="tab-inner">

                        <div class="edge-banner">
                            <div class="edge-label">YOUR MARKET EDGE</div>
                            <div class="edge-text">{{ role.info.edge }}</div>
                        </div>

                        <div class="grid-section">
                            <div class="grid-item">
                                <div class="item-label">投資風格</div>
                                <el-tag type="danger" effect="plain" class="style-tag">{{ role.info.style }}</el-tag>
                            </div>
                            <div class="grid-item">
                                <div class="item-label">核心標的</div>
                                <div class="target-list">
                                    <span v-for="t in role.info.targets" :key="t" class="target-badge">
                                        {{ t }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <el-divider border-style="dashed" />

                        <div class="strategy-section">
                            <div class="st-header">
                                <el-icon>
                                    <TrendCharts />
                                </el-icon> 獲利方程式
                            </div>
                            <div class="st-content">{{ role.info.strategy }}</div>
                        </div>

                        <div class="risk-section">
                            <div class="risk-header">
                                <el-icon>
                                    <CircleCloseFilled />
                                </el-icon> 死亡螺旋 (Fatal Risk)
                            </div>
                            <div class="risk-content">{{ role.info.fatalRisk }}</div>
                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InfoFilled, TrendCharts, CircleCloseFilled } from '@element-plus/icons-vue';
import { data } from './wealth_investment.data.js'; // 請確認路徑

const props = defineProps<{ primaryRole: string, secondaryRole?: string }>();
const activeTab = ref('');

// (其餘 Script 邏輯與上方 Management 類似，只需換 data source)
const displayRoles = computed(() => {
    // 邏輯同前，讀取 data
    const list = [];
    if (props.primaryRole) {
        list.push({ key: props.primaryRole, color: '#FF4500', info: data[props.primaryRole] }); // 簡化示意
    }
    // ...
    return list;
});
</script>

<style scoped>
/* 視覺差異化：使用紅色/金色系 */
.edge-banner {
    background: linear-gradient(90deg, #fcece8, #fff);
    border-left: 4px solid #f56c6c;
    padding: 12px;
    margin-bottom: 15px;
}

.edge-label {
    font-size: 0.7rem;
    color: #f56c6c;
    font-weight: bold;
    letter-spacing: 1px;
}

.edge-text {
    font-size: 1.1rem;
    font-weight: bold;
    color: #303133;
}

.grid-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.item-label {
    font-size: 0.85rem;
    color: #909399;
    margin-bottom: 5px;
}

.style-tag {
    font-weight: bold;
    font-size: 0.9rem;
}

.target-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.target-badge {
    background: #fdf6ec;
    color: #e6a23c;
    border: 1px solid #faecd8;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.85rem;
}

.st-header {
    color: #d48806;
    font-weight: bold;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.st-content {
    font-size: 0.95rem;
    line-height: 1.5;
    color: #555;
    text-align: justify;
}

.risk-section {
    margin-top: 15px;
    background: #2c3e50;
    color: #fff;
    padding: 12px;
    border-radius: 6px;
}

.risk-header {
    font-weight: bold;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f56c6c;
}

.risk-content {
    font-size: 0.9rem;
    opacity: 0.9;
}
</style>