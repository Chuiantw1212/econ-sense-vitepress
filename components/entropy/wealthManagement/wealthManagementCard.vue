<template>
    <el-card class="management-card" shadow="hover" v-if="primaryRole">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🛡️ 財富守成 (Wealth Defense)</span>
                    <el-tooltip content="診斷你的消費心理漏洞，並建立強制儲蓄的防禦機制。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag type="success" effect="dark" round>行為矯正</el-tag>
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
                        <div class="archetype-box">
                            <div class="arch-label">消費心理原型</div>
                            <div class="arch-title">{{ role.info.archetype }}</div>
                            <div class="arch-quote">"{{ role.info.moneyView }}"</div>
                        </div>

                        <div class="leak-section">
                            <div class="section-title error-text">
                                <el-icon>
                                    <WarningFilled />
                                </el-icon> 財務漏洞 (The Leak)
                            </div>
                            <div class="section-content">{{ role.info.leak }}</div>
                        </div>

                        <div class="saboteur-box">
                            <span class="sab-label">👿 內在破壞者：</span>
                            <span class="sab-text">{{ role.info.saboteur }}</span>
                        </div>

                        <el-divider border-style="dashed" />

                        <div class="protocol-section">
                            <div class="section-title success-text">
                                <el-icon>
                                    <Checked />
                                </el-icon> 防禦協議 (The Protocol)
                            </div>
                            <div class="protocol-card">
                                {{ role.info.protocol }}
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
import { InfoFilled, WarningFilled, Checked } from '@element-plus/icons-vue';
import { data } from './wealth_management.data.js'; // 請確認路徑

const props = defineProps<{ primaryRole: string, secondaryRole?: string }>();
const activeTab = ref('');

// (ROLE_NAME_MAP 與 ARCHETYPE_COLORS 同前，省略以節省篇幅...)
// 請務必保留原本的對照表邏輯

const displayRoles = computed(() => {
    // 邏輯同前，讀取 data
    const list = [];
    if (props.primaryRole) {
        list.push({ key: props.primaryRole, color: '#FF4500', info: data[props.primaryRole] }); // 簡化示意
    }
    // ...
    return list;
});
// ...
</script>

<style scoped>
/* 重點樣式區隔 */
.archetype-box {
    text-align: center;
    margin-bottom: 20px;
    background: #f4f4f5;
    padding: 15px;
    border-radius: 8px;
}

.arch-label {
    font-size: 0.8rem;
    color: #909399;
    letter-spacing: 1px;
}

.arch-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #303133;
    margin: 5px 0;
}

.arch-quote {
    font-style: italic;
    color: #606266;
    font-size: 0.95rem;
}

.section-title {
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.error-text {
    color: #F56C6C;
}

.success-text {
    color: #67C23A;
}

.leak-section {
    margin-bottom: 15px;
    padding: 0 5px;
}

.section-content {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #555;
    text-align: justify;
}

.saboteur-box {
    background: #fff0f0;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
    border-left: 3px solid #F56C6C;
}

.sab-label {
    font-weight: bold;
    color: #F56C6C;
}

.protocol-card {
    background: #f0f9eb;
    border: 1px solid #e1f3d8;
    padding: 15px;
    border-radius: 8px;
    color: #529b2e;
    font-weight: 500;
    line-height: 1.6;
}
</style>