<template>
    <el-card class="hunter-trap-card" shadow="never">

        <div class="hazard-header">
            <div class="hazard-icon-box">
                <el-icon class="flashing-icon">
                    <WarningFilled />
                </el-icon>
            </div>
            <div class="hazard-title">
                <span class="main">狩獵盲區 The Trap</span>
                <span class="sub">系統偵測到高風險認知偏誤</span>
            </div>
        </div>

        <div class="bias-core">
            <div class="bias-label">致命傷 Fatal Flaw</div>
            <h3 class="bias-name">過度自信 (Overconfidence)</h3>
            <p class="bias-desc">
                你對「贏」的強烈渴望，讓你很難信任他人。
                <br />
                最大的風險在於：<span class="highlight">把「運氣」誤判為自己的「直覺」</span>。
            </p>
        </div>

        <div class="symptom-zone">
            <div class="zone-title">風險特徵 (Risk Indicators)</div>
            <ul class="symptom-list">
                <li class="symptom-item">
                    <el-icon color="#F56C6C">
                        <CircleCloseFilled />
                    </el-icon>
                    <span><strong>信任障礙：</strong> 總覺得別人的決策不如自己果斷。</span>
                </li>
                <li class="symptom-item">
                    <el-icon color="#F56C6C">
                        <CircleCloseFilled />
                    </el-icon>
                    <span><strong>過度操作：</strong> 因為無法忍受等待，頻繁進出市場。</span>
                </li>
                <li class="symptom-item">
                    <el-icon color="#F56C6C">
                        <CircleCloseFilled />
                    </el-icon>
                    <span><strong>歸因謬誤：</strong> 賺錢是實力，賠錢是運氣不好。</span>
                </li>
            </ul>
        </div>

        <div class="trap-footer">
            ⚠️ 警語：獵人往往不是死於獵物之手，而是死於體力耗盡。
        </div>

    </el-card>
</template>

<script setup>
import { WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.hunter-trap-card {
    background-color: #2b2b2b;
    /* 底色保持深色，延續上一張卡片的風格 */
    border: 2px solid #E6A23C;
    /* 使用黃色警告色作為邊框 */
    color: #fff;
    border-radius: 8px;
    margin: 10px 0;
    position: relative;
    overflow: hidden;

    // 背景斜紋警示效果
    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        background: repeating-linear-gradient(45deg,
                transparent,
                transparent 10px,
                rgba(230, 162, 60, 0.1) 10px,
                rgba(230, 162, 60, 0.1) 20px);
        pointer-events: none;
    }

    // Header
    .hazard-header {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-bottom: 15px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.2);

        .hazard-icon-box {
            font-size: 2.5rem;
            color: #E6A23C;
            display: flex;
            align-items: center;

            .flashing-icon {
                animation: flash 2s infinite;
            }
        }

        .hazard-title {
            display: flex;
            flex-direction: column;

            .main {
                font-size: 1.4rem;
                font-weight: 800;
                color: #E6A23C;
                letter-spacing: 1px;
            }

            .sub {
                font-size: 0.8rem;
                color: #909399;
                text-transform: uppercase;
            }
        }
    }

    // Core Bias
    .bias-core {
        padding: 20px 0;
        text-align: center;

        .bias-label {
            display: inline-block;
            background: #F56C6C;
            color: white;
            padding: 2px 8px;
            font-size: 0.75rem;
            border-radius: 4px;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .bias-name {
            font-size: 1.8rem;
            margin: 0 0 10px 0;
            color: #fff;
            font-weight: 900;
        }

        .bias-desc {
            font-size: 1rem;
            line-height: 1.6;
            color: #ccc;
            margin: 0;

            .highlight {
                color: #E6A23C;
                border-bottom: 1px solid #E6A23C;
                font-weight: bold;
            }
        }
    }

    // Symptom List
    .symptom-zone {
        background: rgba(0, 0, 0, 0.2);
        padding: 15px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.1);

        .zone-title {
            font-size: 0.85rem;
            color: #909399;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .symptom-list {
            list-style: none;
            padding: 0;
            margin: 0;

            .symptom-item {
                display: flex;
                align-items: flex-start;
                /* 對齊頂部，適應多行文字 */
                gap: 10px;
                margin-bottom: 8px;
                font-size: 0.95rem;
                color: #ddd;
                line-height: 1.4;

                strong {
                    color: #fff;
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    // Footer
    .trap-footer {
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.85rem;
        color: #F56C6C;
        font-weight: bold;
        text-align: center;
        background: rgba(245, 108, 108, 0.1);
        border-radius: 4px;
        padding: 8px;
    }
}

// 動畫
@keyframes flash {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>