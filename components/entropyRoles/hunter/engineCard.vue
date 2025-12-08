<template>
    <el-card class="hunter-engine-card" shadow="hover" :body-style="{ padding: '0px' }">
        <div class="engine-header">
            <div class="header-title">
                <el-icon class="icon-spin">
                    <Setting />
                </el-icon>
                <span>三軸動力爐 The Engine</span>
            </div>
            <div class="rpm-badge">7000 RPM</div>
        </div>

        <div class="dashboard-grid">

            <div class="gauge-container">
                <div class="gauge-label">動機 Motivation</div>
                <el-progress type="dashboard" :percentage="100" :color="colors.individual" :width="110"
                    :stroke-width="10">
                    <template #default>
                        <div class="gauge-inner">
                            <span class="axis-code" :style="{ color: colors.individual }">I</span>
                            <span class="axis-name">Individual</span>
                        </div>
                    </template>
                </el-progress>
                <div class="info-box">
                    <div class="chemical">
                        <el-tag effect="dark" size="small" color="#4a4a4a"
                            :style="{ borderColor: colors.individual }">睪固酮
                            Testosterone</el-tag>
                    </div>
                    <p class="desc">
                        關注自我與地位。<br>
                        這是<strong>「我要贏」</strong>的力量。
                    </p>
                </div>
            </div>

            <div class="gauge-container">
                <div class="gauge-label">認知 Cognition</div>
                <el-progress type="dashboard" :percentage="100" :color="colors.real" :width="110" :stroke-width="10">
                    <template #default>
                        <div class="gauge-inner">
                            <span class="axis-code" :style="{ color: colors.real }">R</span>
                            <span class="axis-name">Real</span>
                        </div>
                    </template>
                </el-progress>
                <div class="info-box">
                    <div class="chemical">
                        <el-tag effect="dark" size="small" color="#4a4a4a" :style="{ borderColor: colors.real }">TPN
                            任務網絡</el-tag>
                    </div>
                    <p class="desc">
                        關注物理現實與數據。<br>
                        相信<strong>「眼見為憑」</strong>。
                    </p>
                </div>
            </div>

            <div class="gauge-container">
                <div class="gauge-label">控制 Control</div>
                <el-progress type="dashboard" :percentage="100" :color="colors.hot" :width="110" :stroke-width="10">
                    <template #default>
                        <div class="gauge-inner">
                            <span class="axis-code" :style="{ color: colors.hot }">H</span>
                            <span class="axis-name">Hot</span>
                        </div>
                    </template>
                </el-progress>
                <div class="info-box">
                    <div class="chemical">
                        <el-tag effect="dark" size="small" color="#4a4a4a" :style="{ borderColor: colors.hot }">Hot
                            System</el-tag>
                    </div>
                    <p class="desc">
                        情緒激發力強。<br>
                        依賴<strong>「直覺反應」</strong>與爆發力。
                    </p>
                </div>
            </div>

        </div>

        <div class="engine-footer">
            <p>💡 系統分析：這是一個為<strong>動態博弈</strong>而生的大腦，在靜態環境中容易過熱。</p>
        </div>
    </el-card>
</template>

<script setup>
import { Setting } from '@element-plus/icons-vue'

const colors = {
    individual: '#F56C6C', // 紅色 - 競爭
    real: '#E6A23C',       // 橙色 - 現實警示
    hot: '#F56C6C'         // 紅色 - 熱系統
}
</script>

<style lang="scss" scoped>
.hunter-engine-card {
    max-width: 700px;
    background-color: #2b2b2b;
    /* 深色底，模擬儀表板 */
    color: #fff;
    border: 1px solid #444;
    border-radius: 12px;
    margin: 10px 0;
    overflow: hidden;

    // Header 區塊
    .engine-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: linear-gradient(90deg, #1f1f1f 0%, #333 100%);
        border-bottom: 1px solid #444;

        .header-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
            font-size: 1.1rem;
            color: #ddd;

            .icon-spin {
                animation: spin 4s linear infinite;
            }
        }

        .rpm-badge {
            font-family: 'Courier New', monospace;
            color: #F56C6C;
            font-weight: 800;
            letter-spacing: 1px;
            text-shadow: 0 0 5px rgba(245, 108, 108, 0.6);
        }
    }

    // 儀表板網格
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 25px 15px;
        background: radial-gradient(circle at center, #3a3a3a 0%, #2b2b2b 100%);

        @media (max-width: 600px) {
            grid-template-columns: 1fr;
            gap: 30px;
        }
    }

    // 單個儀表容器
    .gauge-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .gauge-label {
            margin-bottom: 10px;
            font-size: 0.9rem;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        // 儀表內部文字
        .gauge-inner {
            display: flex;
            flex-direction: column;
            line-height: 1;

            .axis-code {
                font-size: 2.2rem;
                font-weight: 900;
                font-family: sans-serif;
            }

            .axis-name {
                font-size: 0.75rem;
                color: #999;
                margin-top: 2px;
            }
        }

        // 說明區塊
        .info-box {
            margin-top: 15px;

            .chemical {
                margin-bottom: 8px;

                // 覆蓋 el-tag 樣式使其融入深色主題
                :deep(.el-tag) {
                    border-width: 1px;
                    color: #eee;
                    font-weight: bold;
                }
            }

            .desc {
                font-size: 0.85rem;
                color: #ccc;
                line-height: 1.5;
                margin: 0;

                strong {
                    color: #fff;
                    border-bottom: 1px dashed #F56C6C;
                }
            }
        }
    }

    // 底部總結
    .engine-footer {
        background: #1a1a1a;
        padding: 10px 15px;
        text-align: center;
        border-top: 1px solid #444;

        p {
            margin: 0;
            font-size: 0.9rem;
            color: #aaa;

            strong {
                color: #E6A23C;
            }
        }
    }
}

// 動畫定義
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>