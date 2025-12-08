<template>
    <el-card class="hunter-anthro-card" shadow="never">

        <div class="card-header">
            <div class="header-left">
                <el-icon class="icon-clock">
                    <Timer />
                </el-icon>
                <span class="title-text">演化邏輯 Evolutionary Logic</span>
            </div>
            <div class="header-right">
                <span class="file-code">FILE: PALEOLITHIC-01</span>
            </div>
        </div>

        <div class="core-message">
            <p>
                現代心理學告訴我們，你的性格並不是缺陷，而是演化留下來的<strong>生存優勢</strong>。
                <br />
                你的大腦是為了<strong>舊石器時代</strong>設計的，而不是為了現代股市。
            </p>
        </div>

        <div class="comparison-container">

            <div class="era-box ancient">
                <div class="era-title">
                    <span class="emoji">🦖</span> 遠古荒野
                </div>
                <div class="scenario">
                    <span class="label">情境：</span> 草叢突然晃動
                </div>
                <div class="reaction">
                    <span class="label">你的反應：</span>
                    <p>不經思考，直接投擲長矛！</p>
                </div>
                <div class="outcome success">
                    <el-icon>
                        <CircleCheckFilled />
                    </el-icon>
                    <span><strong>結果：</strong> 獵到晚餐，部落存活。</span>
                </div>
            </div>

            <div class="vs-divider">
                <el-icon>
                    <Switch />
                </el-icon>
            </div>

            <div class="era-box modern">
                <div class="era-title">
                    <span class="emoji">📉</span> 現代金融
                </div>
                <div class="scenario">
                    <span class="label">情境：</span> 股價突然跳動
                </div>
                <div class="reaction">
                    <span class="label">你的反應：</span>
                    <p>不經思考，直接下單追價！</p>
                </div>
                <div class="outcome danger">
                    <el-icon>
                        <CircleCloseFilled />
                    </el-icon>
                    <span><strong>結果：</strong> 追高殺低，資產縮水。</span>
                </div>
            </div>

        </div>

        <div class="card-footer">
            <div class="quote-box">
                <el-icon class="quote-mark">
                    <CollectionTag />
                </el-icon>
                <p class="quote-text">
                    若部落全是長老，將在安逸與保守中<strong>緩慢淘汰</strong>；<br />
                    <strong>正是因為有了獵人，才為群體在變局中衝出了一線生機。</strong>
                </p>
            </div>
        </div>

    </el-card>
</template>

<script setup>
import { Timer, Switch, CircleCheckFilled, CircleCloseFilled, CollectionTag } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.hunter-anthro-card {
    max-width: 700px;
    border: 1px solid #dcdfe6;
    border-top: 4px solid #F56C6C;
    /* 獵人紅 */
    background-color: #fff;
    border-radius: 8px;
    margin: 10px 0;

    :deep(.el-card__body) {
        padding: 0;
    }
}

/* Header */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #ebeef5;

    .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #303133;
        font-weight: 800;
        font-size: 1rem;

        .icon-clock {
            font-size: 1.2rem;
            color: #909399;
        }
    }

    .file-code {
        font-size: 0.7rem;
        color: #C0C4CC;
        font-family: monospace;
        letter-spacing: 1px;
    }
}

/* Core Message */
.core-message {
    padding: 20px 24px;
    text-align: center;

    p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.6;
        color: #606266;

        strong {
            color: #F56C6C;
            font-size: 1.1rem;
        }
    }
}

/* Comparison Container */
.comparison-container {
    display: flex;
    align-items: stretch;
    padding: 0 20px 20px 20px;
    gap: 15px;

    .vs-divider {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #DCDFE6;
        font-size: 1.5rem;
    }

    .era-box {
        flex: 1;
        border-radius: 8px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border: 1px solid #ebeef5;
        transition: all 0.3s;

        /* 遠古風格：大地色/暖色 */
        &.ancient {
            background: linear-gradient(135deg, #fdf6ec 0%, #fff 100%);
            border-top: 3px solid #d4a373;

            .era-title {
                color: #d4a373;
            }

            .scenario {
                color: #8d5b2e;
            }
        }

        /* 現代風格：冷色/科技色 */
        &.modern {
            background: linear-gradient(135deg, #f4f4f5 0%, #fff 100%);
            border-top: 3px solid #909399;

            .era-title {
                color: #606266;
            }

            .scenario {
                color: #303133;
            }
        }

        .era-title {
            font-weight: 900;
            font-size: 1rem;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .scenario {
            font-size: 0.85rem;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.05);
            padding: 4px 8px;
            border-radius: 4px;

            .label {
                opacity: 0.7;
                font-weight: normal;
            }
        }

        .reaction {
            flex-grow: 1;
            font-size: 0.95rem;
            line-height: 1.4;

            .label {
                font-size: 0.75rem;
                color: #909399;
                display: block;
                margin-bottom: 2px;
            }

            p {
                margin: 0;
                font-weight: bold;
                color: #303133;
            }
        }

        .outcome {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.9rem;
            font-weight: bold;

            &.success {
                color: #67C23A;
            }

            &.danger {
                color: #F56C6C;
            }
        }
    }
}

/* Footer: 部落格言 */
.card-footer {
    background: #303133;
    color: #fff;
    padding: 20px 24px;

    .quote-box {
        position: relative;
        padding-left: 34px;

        .quote-mark {
            position: absolute;
            left: 0;
            top: 0;
            font-size: 1.6rem;
            color: #F56C6C;
            opacity: 0.9;
        }

        .quote-text {
            margin: 0;
            font-size: 1rem;
            line-height: 1.6;
            color: #e0e0e0;
            font-style: italic;

            strong {
                color: #F56C6C;
                font-weight: bold;
                font-style: normal;
                border-bottom: 1px dashed #F56C6C;
            }
        }

        .source-ref {
            margin-top: 10px;
            text-align: right;
            font-size: 0.75rem;
            color: #777;
            font-family: monospace;
        }
    }
}

/* Mobile RWD */
@media (max-width: 600px) {
    .comparison-container {
        flex-direction: column;

        .vs-divider {
            transform: rotate(90deg);
            margin: -5px 0;
        }
    }
}
</style>