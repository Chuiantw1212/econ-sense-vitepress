<template>
    <el-card class="hunter-strategy-card" shadow="never" :body-style="{ padding: '0' }">

        <div class="strategy-header">
            <div class="header-left">
                <el-icon class="guide-icon">
                    <Compass />
                </el-icon>
                <h3 class="header-title">生存攻略 Strategic SOP</h3>
            </div>
            <el-tag type="success" effect="dark" round>Action Item</el-tag>
        </div>

        <div class="core-strategy">
            <h3 class="strategy-name">
                <span class="highlight">強制性</span> 冷靜緩衝區
            </h3>
            <p class="strategy-desc">
                你的攻擊性極強，這意味著你需要更厚的盾牌。你需要配置一筆<strong>「打死都不能動」</strong>的現金儲備（流動性緩衝）。
            </p>
        </div>

        <div class="steps-container">
            <el-steps direction="vertical" :active="1" finish-status="success">

                <el-step title="Step 1: 定義性質 (Definition)">
                    <template #description>
                        <div class="step-desc">
                            這筆錢不是為了賺錢，而是為了在你因<strong>過度自信</strong>而犯錯時，確保你還有翻身的籌碼 。
                        </div>
                    </template>
                </el-step>

                <el-step title="Step 2: 物理鎖定 (Lock-in)">
                    <template #description>
                        <div class="step-desc">
                            人為製造<strong>「變現摩擦力」</strong>。將這筆資金放入定存或信託，讓你無法在情緒高漲時一鍵下單。
                        </div>
                    </template>
                </el-step>

                <el-step title="Step 3: 順應天性 (Adaptation)">
                    <template #description>
                        <div class="step-desc">
                            別強迫自己像<strong>工匠(IRC)</strong>那樣每天盯報表，也別逼自己做<strong>長老(OVC)</strong>的長線規劃，那會讓你窒息
                            。做你擅長的狩獵，但在背後留好退路。
                        </div>
                    </template>
                </el-step>

            </el-steps>
        </div>

        <div class="action-footer">
            <el-button type="success" size="large" circle class="check-btn" @click="confirmStrategy">
                <el-icon>
                    <Check />
                </el-icon>
            </el-button>
            <span class="footer-text">我承諾建立緩衝區</span>
        </div>

    </el-card>
</template>

<script setup>
import { Compass, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const confirmStrategy = () => {
    ElMessage({
        message: '策略已鎖定！記住：這筆錢是你翻身的最後籌碼。',
        type: 'success',
        duration: 4000,
        showClose: true
    })
}
</script>

<style lang="scss" scoped>
.hunter-strategy-card {
    max-width: 700px;
    background-color: #2b2b2b;
    /* 延續深色主題 */
    border: 1px solid #67C23A;
    /* 綠色邊框代表安全/解法 */
    color: #fff;
    border-radius: 8px;
    margin: 10px 0;
    overflow: hidden;

    // 強制設定所有標題標籤的間距，防止跑版
    h3 {
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.4 !important;
    }

    // Header
    .strategy-header {
        background: rgba(103, 194, 58, 0.15);
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(103, 194, 58, 0.3);

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;

            .guide-icon {
                font-size: 1.4rem;
                color: #67C23A;
            }

            .header-title {
                font-size: 1.1rem;
                font-weight: 800;
                letter-spacing: 1px;
                color: #e1f3d8;
            }
        }
    }

    // Core Strategy
    .core-strategy {
        padding: 25px 20px 10px 20px;
        text-align: center;

        .strategy-name {
            margin-bottom: 15px !important; // 強制下方間距
            font-size: 1.6rem;
            font-weight: 900;
            color: #fff;

            .highlight {
                color: #67C23A;
                border-bottom: 3px solid #67C23A;
                padding-bottom: 2px;
            }
        }

        .strategy-desc {
            font-size: 1rem;
            color: #ccc;
            line-height: 1.6;
            margin: 0;
            text-align: justify;

            strong {
                color: #67C23A;
            }
        }
    }

    // Steps
    .steps-container {
        padding: 20px 30px;

        // 覆蓋 Element Plus Steps 樣式以適應深色模式
        :deep(.el-step__title) {
            color: #e1f3d8 !important;
            font-weight: bold;
            font-size: 1rem;
            line-height: 1.5;
        }

        :deep(.el-step__description) {
            color: #aaa !important;
            padding-right: 0;
        }

        :deep(.el-step__head.is-process) {
            color: #67C23A;
            border-color: #67C23A;
        }

        :deep(.el-step__line) {
            background-color: #555;
        }

        .step-desc {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 15px;
            color: #bbb;

            strong {
                color: #67C23A;
            }
        }
    }

    // Footer
    .action-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.2);

        .check-btn {
            font-size: 1.5rem;
            box-shadow: 0 0 15px rgba(103, 194, 58, 0.4);
            transition: all 0.3s;

            &:hover {
                transform: scale(1.1);
                box-shadow: 0 0 25px rgba(103, 194, 58, 0.6);
            }
        }

        .footer-text {
            font-size: 0.9rem;
            color: #909399;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: bold;
        }
    }
}
</style>