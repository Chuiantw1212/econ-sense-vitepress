<template>
    <el-card class="hunter-strategy-card" shadow="never" :body-style="{ padding: '0' }">

        <div class="strategy-header">
            <div class="header-left">
                <el-icon class="guide-icon">
                    <Compass />
                </el-icon>
                <span class="header-title">生存攻略 The Strategy</span>
            </div>
            <el-tag type="success" effect="dark" round>Action Item</el-tag>
        </div>

        <div class="core-strategy">
            <h3 class="strategy-name">
                <span class="highlight">強制性</span> 冷靜緩衝區
            </h3>
            <p class="strategy-desc">
                你的攻擊力是雙面刃。為了不讓自己在一次失誤中出局，你需要的不是「更準的槍」，而是「防彈背心」。
            </p>
        </div>

        <div class="steps-container">
            <el-steps direction="vertical" :active="1" finish-status="success">

                <el-step title="Step 1: 承認情緒 (Acceptance)">
                    <template #description>
                        <div class="step-desc">
                            承認自己在情緒高漲時會犯錯。不要試圖用意志力抵抗衝動，那行不通。
                        </div>
                    </template>
                </el-step>

                <el-step title="Step 2: 配置保命金 (Allocation)">
                    <template #description>
                        <div class="step-desc">
                            將資產切出一塊<strong>「打死都不能動」</strong>的流動性緩衝。這筆錢不是為了增值，而是為了存活。
                        </div>
                    </template>
                </el-step>

                <el-step title="Step 3: 物理鎖定 (Lock-in)">
                    <template #description>
                        <div class="step-desc">
                            將這筆資金放入<strong>難以變現</strong>的帳戶（如長期定存、信託）。增加動用資金的「摩擦力」，讓你無法在衝動時一鍵下單。
                        </div>
                    </template>
                </el-step>

            </el-steps>
        </div>

        <div class="niche-advice">
            <div class="advice-icon">💡</div>
            <div class="advice-content">
                <strong>生態位提醒：</strong><br />
                如果你是獵人(IRH)，別強迫自己坐在辦公室做長老(OVC)的長線規劃，那會讓你窒息。順應你的爆發力，但要繫好安全帶。
            </div>
        </div>

        <div class="action-footer">
            <el-button type="success" size="large" circle class="check-btn" @click="confirmStrategy">
                <el-icon>
                    <Check />
                </el-icon>
            </el-button>
            <span class="footer-text">我已了解並準備執行</span>
        </div>

    </el-card>
</template>

<script setup>
import { Compass, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const confirmStrategy = () => {
    ElMessage({
        message: '策略已鎖定！記住：留得青山在，不怕沒柴燒。',
        type: 'success',
        duration: 3000,
        showClose: true
    })
}
</script>

<style lang="scss" scoped>
.hunter-strategy-card {
    background-color: #2b2b2b;
    /* 延續深色主題 */
    border: 1px solid #67C23A;
    /* 綠色邊框代表安全/解法 */
    color: #fff;
    border-radius: 8px;
    margin: 10px 0;
    overflow: hidden;

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
            margin: 0 0 15px 0;
            font-size: 1.6rem;
            font-weight: 900;
            color: #fff;

            .highlight {
                color: #67C23A;
                border-bottom: 3px solid #67C23A;
            }
        }

        .strategy-desc {
            font-size: 1rem;
            color: #ccc;
            line-height: 1.6;
            margin: 0;
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
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 10px;

            strong {
                color: #67C23A;
            }
        }
    }

    // Niche Advice (文檔引用區)
    .niche-advice {
        margin: 0 20px 20px 20px;
        background: rgba(255, 255, 255, 0.05);
        border-left: 4px solid #67C23A;
        padding: 12px;
        border-radius: 0 4px 4px 0;
        display: flex;
        gap: 12px;
        align-items: flex-start;

        .advice-icon {
            font-size: 1.2rem;
        }

        .advice-content {
            font-size: 0.9rem;
            color: #bbb;
            line-height: 1.5;
            font-style: italic;

            strong {
                color: #67C23A;
                font-style: normal;
            }
        }
    }

    // Footer
    .action-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
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
            font-size: 0.8rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    }
}
</style>