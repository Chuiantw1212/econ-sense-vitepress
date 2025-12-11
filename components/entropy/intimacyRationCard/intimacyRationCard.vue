<template>
    <el-card class="intimacy-card" shadow="hover" v-if="roleData">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">💞 親密關係架構 (Intimacy Architecture)</span>
                    <el-tooltip content="基於熵腦熱力學，分析你的通訊協定與黃金互補對象。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag color="#e91e63" effect="dark" round style="border:none;">分層相容理論</el-tag>
            </div>
        </template>

        <div class="card-content">

            <div class="layer-block">
                <div class="layer-header">
                    <span class="layer-badge">Layer 1</span>
                    <span class="layer-title">物理層：通訊協定 (Protocol)</span>
                </div>
                <div class="id-card">
                    <div class="id-left">
                        <div class="my-code">{{ roleData.code }}</div>
                        <div class="my-protocol">{{ roleData.protocol }}</div>
                    </div>
                    <div class="id-right">
                        <div class="id-desc">{{ roleData.desc }}</div>
                        <div class="id-warning">
                            <el-icon>
                                <WarningFilled />
                            </el-icon>
                            <strong>鐵律：</strong>請尋找同樣是
                            <span class="highlight">{{ roleData.protocol.split(' ')[0] }} 型</span>
                            的伴侶。
                        </div>
                    </div>
                </div>
            </div>

            <div class="layer-block mt-4">
                <div class="layer-header">
                    <span class="layer-badge">Layer 2</span>
                    <span class="layer-title">應用層：選擇你的賽道</span>
                </div>

                <el-tabs type="border-card" class="path-tabs">

                    <el-tab-pane>
                        <template #label>
                            <span class="tab-label"><el-icon>
                                    <CopyDocument />
                                </el-icon> 路徑 A：同頻共振</span>
                        </template>

                        <div class="path-container path-a">
                            <div class="path-intro">追求極致的舒適與效率，摩擦力最小。</div>

                            <div class="match-box">
                                <div class="match-target">{{ roleData.pathA.target }}</div>
                                <div class="match-tags">
                                    <el-tag size="small" type="info">優點：{{ roleData.pathA.pros }}</el-tag>
                                    <el-tag size="small" type="warning">缺點：{{ roleData.pathA.cons }}</el-tag>
                                </div>
                            </div>
                            <div class="path-detail">{{ roleData.pathA.desc }}</div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane>
                        <template #label>
                            <span class="tab-label highlight-tab"><el-icon>
                                    <Connection />
                                </el-icon> 路徑 B：黃金互補</span>
                        </template>

                        <div class="path-container path-b">
                            <div class="path-intro">追求化學反應與成長，透過互補讓系統完整。</div>

                            <div class="gold-card">
                                <div class="gold-header">
                                    <el-icon>
                                        <Trophy />
                                    </el-icon> 黃金隊友 (GOLDEN PARTNER)
                                </div>
                                <div class="gold-body">
                                    <div class="partner-name">{{ roleData.pathB.target }}</div>
                                    <div class="partner-code">{{ roleData.pathB.code }}</div>
                                </div>
                                <div class="gold-relation">
                                    <strong>{{ roleData.pathB.relation }}</strong>
                                    <p>{{ roleData.pathB.chemistry }}</p>
                                </div>
                            </div>

                            <div class="manual-box">
                                <div class="manual-title">
                                    <el-icon>
                                        <Tools />
                                    </el-icon> 操作手冊 (User Manual)
                                </div>
                                <div class="manual-text">{{ roleData.pathB.manual }}</div>
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
import { InfoFilled, CopyDocument, Connection, Tools, WarningFilled, Trophy } from '@element-plus/icons-vue';
// 引入修正後的資料檔
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
.intimacy-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
    border-left: 5px solid #e91e63;
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

/* Layer Header */
.layer-block {
    margin-bottom: 20px;
}

.mt-4 {
    margin-top: 25px;
}

.layer-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.layer-badge {
    background: #303133;
    color: #fff;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}

.layer-title {
    font-weight: 800;
    color: #2c3e50;
    font-size: 1rem;
}

/* Layer 1: ID Card (Passport Style) */
.id-card {
    display: flex;
    background: linear-gradient(135deg, #fce4ec, #fff0f5);
    border: 1px solid #f8bbd0;
    border-radius: 8px;
    padding: 15px;
    align-items: center;
    gap: 20px;
}

.id-left {
    text-align: center;
    border-right: 1px dashed #f48fb1;
    padding-right: 20px;
    min-width: 100px;
}

.my-code {
    font-size: 1.4rem;
    font-weight: 900;
    color: #e91e63;
    font-family: monospace;
    letter-spacing: 1px;
}

.my-protocol {
    font-size: 0.8rem;
    color: #880e4f;
    font-weight: bold;
    margin-top: 4px;
}

.id-right {
    flex-grow: 1;
}

.id-desc {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 8px;
}

.id-warning {
    font-size: 0.85rem;
    color: #c2185b;
    background: rgba(255, 255, 255, 0.6);
    padding: 6px 10px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.highlight {
    font-weight: bold;
    text-decoration: underline;
}

/* Tabs & Paths */
.path-tabs {
    border: none;
    box-shadow: none;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
}

.tab-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: bold;
}

.highlight-tab {
    color: #d81b60;
}

.path-container {
    padding: 10px 5px;
}

.path-intro {
    font-size: 0.9rem;
    color: #909399;
    margin-bottom: 15px;
    font-style: italic;
}

/* Path A (Blue/Grey) */
.path-a .match-box {
    background: #f0f2f5;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 10px;
}

.path-a .match-target {
    font-size: 1.2rem;
    font-weight: 800;
    color: #606266;
    margin-bottom: 8px;
}

.path-a .match-tags {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.path-a .path-detail {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
    text-align: justify;
}

/* Path B (Gold/Pink) - The Highlight */
.gold-card {
    background: linear-gradient(135deg, #fff8e1, #fff);
    border: 1px solid #ffecb3;
    border-left: 4px solid #ffc107;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    position: relative;
    overflow: hidden;
}

.gold-header {
    font-size: 0.75rem;
    color: #ffb300;
    font-weight: 800;
    letter-spacing: 1px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.gold-body {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
}

.partner-name {
    font-size: 1.4rem;
    font-weight: 800;
    color: #303133;
}

.partner-code {
    font-size: 1rem;
    color: #909399;
    font-family: monospace;
    background: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #eee;
}

.gold-relation {
    font-size: 0.95rem;
    color: #5d4037;
    line-height: 1.5;
}

.gold-relation strong {
    color: #e91e63;
    margin-right: 5px;
}

/* Manual Box */
.manual-box {
    background: #37474f;
    color: #eceff1;
    padding: 15px;
    border-radius: 8px;
}

.manual-title {
    font-size: 0.9rem;
    font-weight: bold;
    color: #80cbc4;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.manual-text {
    font-size: 0.9rem;
    line-height: 1.6;
    opacity: 0.95;
}

@media (max-width: 600px) {
    .id-card {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }

    .id-left {
        border-right: none;
        border-bottom: 1px dashed #f48fb1;
        padding-bottom: 10px;
        padding-right: 0;
        width: 100%;
    }
}
</style>