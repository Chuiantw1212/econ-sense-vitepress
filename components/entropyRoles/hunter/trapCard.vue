<template>
    <el-card class="hunter-trap-card" shadow="never" :body-style="{ padding: '0' }">

        <div class="hazard-header">
            <div class="hazard-left">
                <el-icon class="warning-icon">
                    <WarningFilled />
                </el-icon>
                <span class="hazard-title">認知盲區 The Trap</span>
            </div>
            <div class="hazard-right">
                <span class="error-code">ERR_OVERCONFIDENCE</span>
            </div>
        </div>

        <div class="trap-content">

            <div class="bias-alert-box">
                <h3 class="bias-name">過度自信 (Overconfidence)</h3>
                <p class="bias-desc">
                    你的勝負欲讓你渴望掌控一切，這導致你<strong>很難信任他人</strong>，甚至相信自己能戰勝機率 。
                </p>
            </div>

            <div class="mechanism-box">
                <div class="mechanism-title">大腦的歸因謬誤：</div>
                <div class="comparison">
                    <div class="case">
                        <span class="label">賺錢時</span>
                        <span class="arrow">➔</span>
                        <span class="result success">「憑實力」</span>
                    </div>
                    <div class="case">
                        <span class="label">賠錢時</span>
                        <span class="arrow">➔</span>
                        <span class="result danger">「運氣差」</span>
                    </div>
                </div>
                <p class="warning-text">
                    因為太相信直覺，你常<strong>低估了運氣的成分</strong>，誤以為自己找到了必勝法則 。
                </p>
            </div>

            <div class="symptom-list">
                <div class="list-header">高風險行為偵測：</div>
                <ul>
                    <li>
                        <el-icon color="#F56C6C">
                            <CircleCloseFilled />
                        </el-icon>
                        <span><strong>過度操作 (Over-trading)：</strong> 無法忍受資金閒置，頻繁進出市場尋求刺激 。</span>
                    </li>
                    <li>
                        <el-icon color="#F56C6C">
                            <CircleCloseFilled />
                        </el-icon>
                        <span><strong>難以授權：</strong> 總覺得別人的決策太慢或太笨，最後把自己累死。</span>
                    </li>
                </ul>
            </div>

        </div>

        <div class="card-footer">
            <div class="footer-stripes"></div>
            <p class="footer-text">
                ⚠️ 警語：獵人往往不是死於獵物之手，而是死於<strong>體力耗盡</strong>與<strong>輕敵</strong>。
            </p>
        </div>

    </el-card>
</template>

<script setup>
import { WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.hunter-trap-card {
    max-width: 700px;
    background-color: #2b2b2b;
    border: 2px solid #E6A23C;
    /* 黃色警告框 */
    color: #fff;
    border-radius: 8px;
    margin: 10px 0;
    overflow: hidden;
}

/* Header */
.hazard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: repeating-linear-gradient(45deg,
            #E6A23C,
            #E6A23C 10px,
            #333 10px,
            #333 20px);
    border-bottom: 2px solid #E6A23C;

    .hazard-left {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #2b2b2b;
        padding: 5px 15px;
        border-radius: 4px;
        border: 1px solid #E6A23C;

        .warning-icon {
            font-size: 1.2rem;
            color: #E6A23C;
            animation: flash 2s infinite;
        }

        .hazard-title {
            font-weight: 900;
            color: #E6A23C;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    }

    .hazard-right {
        .error-code {
            font-family: monospace;
            background: #000;
            color: #F56C6C;
            padding: 4px 8px;
            font-size: 0.8rem;
            font-weight: bold;
            border-radius: 2px;
        }
    }
}

/* Content */
.trap-content {
    padding: 25px 25px 10px 25px;
}

/* Bias Alert Box */
.bias-alert-box {
    text-align: center;
    margin-bottom: 25px;

    .bias-name {
        font-size: 1.8rem;
        color: #fff;
        margin: 0 0 10px 0 !important;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    .bias-desc {
        color: #ccc;
        line-height: 1.6;
        font-size: 1rem;
        margin: 0;

        strong {
            color: #F56C6C;
            border-bottom: 1px dashed #F56C6C;
        }
    }
}

/* Mechanism Box */
.mechanism-box {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 25px;

    .mechanism-title {
        font-size: 0.9rem;
        color: #909399;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .comparison {
        display: flex;
        justify-content: space-around;
        margin-bottom: 15px;
        background: rgba(0, 0, 0, 0.3);
        padding: 10px;
        border-radius: 4px;

        .case {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95rem;

            .label {
                color: #aaa;
            }

            .arrow {
                color: #666;
            }

            .result {
                font-weight: bold;
                font-size: 1.1rem;

                &.success {
                    color: #67C23A;
                }

                &.danger {
                    color: #F56C6C;
                }
            }
        }
    }

    .warning-text {
        font-size: 0.95rem;
        color: #E6A23C;
        text-align: center;
        margin: 0;
        line-height: 1.5;

        strong {
            color: #fff;
            background-color: #E6A23C;
            color: #000;
            padding: 0 4px;
        }
    }
}

/* Symptom List */
.symptom-list {
    .list-header {
        font-size: 0.9rem;
        color: #F56C6C;
        font-weight: bold;
        margin-bottom: 10px;
        text-transform: uppercase;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 12px;
            font-size: 0.95rem;
            color: #ddd;
            line-height: 1;

            strong {
                color: #fff;
            }
        }
    }
}

/* Footer */
.card-footer {
    margin-top: 15px;
    background: #1a1a1a;
    padding: 15px 20px;
    border-top: 1px solid #444;
    position: relative;

    .footer-text {
        margin: 0;
        text-align: center;
        color: #909399;
        font-size: 0.9rem;
        font-style: italic;

        strong {
            color: #F56C6C;
        }
    }
}

/* Animations */
@keyframes flash {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
}

/* Mobile RWD */
@media (max-width: 600px) {
    .hazard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;

        .hazard-right {
            align-self: flex-end;
        }
    }

    .comparison {
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }
}
</style>