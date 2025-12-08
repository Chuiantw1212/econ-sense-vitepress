<template>
    <el-card class="hunter-origin-card" shadow="hover" :body-style="{ padding: '20px !important' }">

        <div class="career-header">
            <div class="career-badges">
                <el-tag type="danger" effect="dark" class="role-tag">獵人 Hunter</el-tag>
                <span class="divider">|</span>
                <span class="career-title">負責短期高風險獲利</span>
            </div>
            <div class="icon-box">🏹</div>
        </div>

        <div class="card-content">
            <p class="niche-desc">
                你是部落中的<strong>「肉食供應者」</strong>。在充滿不確定性的動態環境中，你負責承擔風險，為群體帶回高額回報。
            </p>

            <div class="career-mapping">
                <div class="mapping-label">現代對應角色 (Modern Roles)</div>
                <div class="roles-grid">
                    <div class="role-item">
                        <el-icon>
                            <Suitcase />
                        </el-icon>
                        <span>創業家</span>
                    </div>
                    <div class="role-item">
                        <el-icon>
                            <Medal />
                        </el-icon>
                        <span>頂尖業務</span>
                    </div>
                    <div class="role-item">
                        <el-icon>
                            <TrendCharts />
                        </el-icon>
                        <span>王牌交易員</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="value-statement">
                <el-icon color="#F56C6C" class="flag-icon">
                    <Flag />
                </el-icon>
                <span class="statement-text">
                    沒有你，部落將在變局中錯失機會；<br>若全是長老，部落將在飢荒中滅絕。
                </span>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { Suitcase, Medal, TrendCharts, Flag } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.hunter-origin-card {
    border: 1px solid #fab6b6 !important;
    border-left: 6px solid #F56C6C !important;
    background: linear-gradient(180deg, #ffffff 0%, #fffbfc 100%);
    border-radius: 8px;
    margin: 10px 0;
    overflow: visible;
    /* 允許 footer 負邊距延伸 */
}

/* Header: 職業識別 */
.career-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    /* 頂部對齊防止高度拉伸 */
    margin-bottom: 20px;
    border-bottom: 1px dashed #fde2e2;
    padding-bottom: 15px;
    flex-wrap: nowrap;
    /* 禁止 Header 整體換行，保持左右結構 */
}

.career-badges {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    /* 內部標籤允許換行 */
}

.role-tag {
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 1px;
    white-space: nowrap;
    /* 防止標籤內文字斷行 */
}

.divider {
    color: #ddd;
    font-weight: 300;
    display: inline-block;
}

.career-title {
    font-weight: bold;
    color: #555;
    font-size: 0.95rem;
    line-height: 1.4;
}

.icon-box {
    font-size: 2rem;
    line-height: 1;
    flex-shrink: 0 !important;
    /* 強制 Icon 不被壓縮 */
    margin-left: 10px;
}

/* 內容區 */
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

/* 職業對應區塊 */
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
    /* 預設三欄 */
    gap: 10px;
}

.role-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: #F56C6C;
    font-weight: bold;
    font-size: 0.95rem;
    text-align: center;

    .el-icon {
        font-size: 1.4rem;
        background: white;
        padding: 8px;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(245, 108, 108, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.4rem;
        /* 固定寬高防止跑版 */
        height: 1.4rem;
        box-sizing: content-box;
        /* 確保 padding 不影響尺寸計算 */
    }
}

/* Footer: 價值宣言 */
.card-footer {
    /* 關鍵修正：使用 !important 確保負邊距生效，填滿卡片底部 */
    margin-top: 25px !important;
    background: #2b2b2b;
    color: #fff;
    padding: 15px 20px;

    /* 抵銷 el-card body padding (20px) */
    margin-left: -20px !important;
    margin-right: -20px !important;
    margin-bottom: -20px !important;

    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.value-statement {
    display: flex;
    align-items: flex-start;
    /* 頂部對齊，適應多行 */
    gap: 12px;
}

.flag-icon {
    flex-shrink: 0 !important;
    /* Icon 不壓縮 */
    margin-top: 3px;
    font-size: 1.2rem;
}

.statement-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #ddd;
    font-style: italic;
    word-break: break-word;
    /* 防止長文字撐開容器 */
}

/* Mobile RWD 調整 */
@media (max-width: 480px) {
    .career-badges {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }

    .divider {
        display: none;
        /* 手機版隱藏分隔線 */
    }

    .roles-grid {
        grid-template-columns: 1fr;
        /* 手機版改為單欄垂直排列 */
        gap: 12px;
    }

    .role-item {
        flex-direction: row;
        /* Icon 在左，文字在右 */
        padding-left: 10px;
    }
}
</style>