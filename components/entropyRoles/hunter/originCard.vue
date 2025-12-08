<template>
    <el-card class="hunter-origin-card" shadow="hover">

        <div class="career-header">
            <div class="header-left">
                <el-tag type="danger" effect="dark" class="role-tag">獵人 Hunter</el-tag>
                <span class="career-title">| 負責短期高風險獲利</span>
            </div>
            <div class="icon-box">🏹</div>
        </div>

        <div class="card-content">
            <p class="niche-desc">
                你是市場中的<strong>「機會掠食者」</strong>。你的大腦不是為了守成而設計，而是為了在動態變化中，精準鎖定並拿下高價值的目標。
            </p>

            <div class="career-mapping">
                <div class="mapping-label">現代對應角色 (Modern Roles)</div>
                <div class="roles-grid">
                    <div class="role-item">
                        <div class="icon-circle"><el-icon>
                                <Suitcase />
                            </el-icon></div>
                        <span>創業家</span>
                    </div>
                    <div class="role-item">
                        <div class="icon-circle"><el-icon>
                                <Medal />
                            </el-icon></div>
                        <span>頂尖業務</span>
                    </div>
                    <div class="role-item">
                        <div class="icon-circle"><el-icon>
                                <TrendCharts />
                            </el-icon></div>
                        <span>王牌交易員</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="value-statement">
                <el-icon class="quote-icon">
                    <ChatLineSquare />
                </el-icon>
                <span class="statement-text">
                    在混亂的環境中，<br>
                    別人看到的是恐慌，你看到的是<strong>機會</strong>。
                </span>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { Suitcase, Medal, TrendCharts, ChatLineSquare } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.hunter-origin-card {
    max-width: 600px;
    border: 1px solid #fab6b6;
    border-left: 6px solid #F56C6C;
    background: linear-gradient(180deg, #ffffff 0%, #fffbfc 100%);
    border-radius: 8px;
    margin: 10px 0;

    /* 使用 :deep 穿透修改 Element Plus 內部樣式，替代 body-style */
    :deep(.el-card__body) {
        padding: 24px;
    }
}

/* Header */
.career-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    border-bottom: 1px dashed #fde2e2;
    padding-bottom: 15px;
}

.header-left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    /* 允許換行 */
    gap: 8px;
}

.role-tag {
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 1px;
}

.career-title {
    font-weight: bold;
    color: #555;
    font-size: 0.95rem;
    white-space: nowrap;
    /* 防止文字中間斷開 */
}

.icon-box {
    font-size: 2rem;
    line-height: 1;
    flex-shrink: 0;
    margin-left: 10px;
}

/* Content */
.niche-desc {
    font-size: 1.05rem;
    color: #303133;
    line-height: 1.6;
    margin-bottom: 25px;
    text-align: justify;

    strong {
        color: #F56C6C;
        border-bottom: 2px solid rgba(245, 108, 108, 0.2);
    }
}

.career-mapping {
    background-color: #fef0f0;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #fde2e2;
}

.mapping-label {
    font-size: 0.8rem;
    color: #909399;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: bold;
}

.roles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.role-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #F56C6C;
    font-weight: bold;
    font-size: 0.95rem;
    text-align: center;
}

.icon-circle {
    font-size: 1.2rem;
    background: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(245, 108, 108, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #F56C6C;
}

/* Footer */
.card-footer {
    margin-top: 0;
    background: #2b2b2b;
    color: #fff;
    /* 強制填滿底部 */
    margin: 24px -24px -24px -24px;
    padding: 20px 24px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.value-statement {
    display: flex;
    align-items: center;
    gap: 15px;
}

.quote-icon {
    font-size: 1.8rem;
    color: #F56C6C;
    opacity: 0.9;
    flex-shrink: 0;
}

.statement-text {
    font-size: 1rem;
    line-height: 1.5;
    color: #eee;
    font-style: italic;
    font-weight: 500;

    strong {
        color: #F56C6C;
        font-style: normal;
        font-weight: 800;
        font-size: 1.1rem;
    }
}

/* Mobile RWD */
@media (max-width: 480px) {
    .header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .roles-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .role-item {
        flex-direction: row;
        padding-left: 5px;
    }
}
</style>