<template>
    <el-card class="career-card" shadow="hover" v-if="careerInfo">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">💼 適合賽道 (Career Path)</span>
                    <el-tooltip content="基於你的神經原型優勢，這些領域能讓你進入心流狀態。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag type="primary" effect="dark" round>天賦優勢</el-tag>
            </div>
        </template>

        <div class="card-content">
            <div class="career-box">
                <div class="quote-icon">❝</div>

                <div class="career-list">
                    <div v-for="(item, index) in careerInfo.list" :key="index" class="career-item">
                        <div class="item-category">
                            <span class="bullet-point">●</span>
                            {{ item.category }}：
                        </div>
                        <div class="item-jobs">{{ item.jobs }}</div>
                    </div>
                </div>

            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
// 引入更新後的 career.data.js
import { data } from './career.data.js';

const props = defineProps<{
    primaryRole: string // e.g., 'Hunter'
}>();

const careerInfo = computed(() => {
    // @ts-ignore
    return data[props.primaryRole] || null;
});
</script>

<style scoped>
.career-card {
    margin-top: 20px;
    border-radius: 12px;
    background: #fff;
    border-left: 5px solid #409EFF;
    border-top: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
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

.card-content {
    padding: 10px 5px;
}

.career-box {
    position: relative;
    background-color: #ecf5ff;
    padding: 20px 15px 20px 25px;
    border-radius: 8px;
    color: #303133;
}

.quote-icon {
    position: absolute;
    top: 5px;
    left: 8px;
    font-size: 2rem;
    color: #409EFF;
    opacity: 0.3;
    font-family: serif;
    line-height: 1;
}

/* 列表樣式 */
.career-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    /* 項目之間的間距 */
}

.career-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.item-category {
    font-weight: bold;
    color: #409EFF;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.bullet-point {
    font-size: 0.8rem;
    color: #409EFF;
    opacity: 0.7;
}

.item-jobs {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.5;
    padding-left: 18px;
    /* 縮排對齊 */
}
</style>