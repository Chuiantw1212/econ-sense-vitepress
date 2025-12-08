<template>
    <el-card class="hunter-engine-card" shadow="never" :body-style="{ padding: '0' }">

        <div class="engine-header">
            <div class="header-left">
                <el-icon class="gear-icon is-loading">
                    <Setting />
                </el-icon>
                <span class="header-title">神經動力爐 Neuro-Engine</span>
            </div>
            <div class="status-badge">
                <span class="pulse-dot"></span>
                Running High
            </div>
        </div>

        <div class="dashboard-body">

            <div class="axis-column">
                <div class="gauge-wrapper">
                    <el-progress type="dashboard" :percentage="100" :width="100" color="#F56C6C" :stroke-width="8">
                        <template #default>
                            <div class="gauge-content">
                                <span class="axis-letter">I</span>
                                <span class="axis-name">Individual</span>
                            </div>
                        </template>
                    </el-progress>
                </div>
                <div class="spec-box">
                    <div class="spec-label">燃料 Fuel</div>
                    <div class="spec-value red-glow">睪固酮 (Testosterone)</div>
                    <p class="spec-desc">
                        你的神經迴路對<strong>「地位」</strong>與<strong>「競爭」</strong>高度敏感。這不是性格問題，是激素驅使你去「贏」。
                    </p>
                </div>
            </div>

            <div class="axis-column">
                <div class="gauge-wrapper">
                    <el-progress type="dashboard" :percentage="100" :width="100" color="#E6A23C" :stroke-width="8">
                        <template #default>
                            <div class="gauge-content">
                                <span class="axis-letter" style="color: #E6A23C">R</span>
                                <span class="axis-name">Real</span>
                            </div>
                        </template>
                    </el-progress>
                </div>
                <div class="spec-box">
                    <div class="spec-label">運算核心 CPU</div>
                    <div class="spec-value orange-glow">任務正向網絡 (TPN)</div>
                    <p class="spec-desc">
                        你的大腦極度關注<strong>物理現實</strong>與<strong>當下數據</strong>。當你專注狩獵時，負責內省的 DMN 網絡會被強力抑制。
                    </p>
                </div>
            </div>

            <div class="axis-column">
                <div class="gauge-wrapper">
                    <el-progress type="dashboard" :percentage="100" :width="100" color="#F56C6C" :stroke-width="8">
                        <template #default>
                            <div class="gauge-content">
                                <span class="axis-letter">H</span>
                                <span class="axis-name">Hot</span>
                            </div>
                        </template>
                    </el-progress>
                </div>
                <div class="spec-box">
                    <div class="spec-label">點火系統 Ignition</div>
                    <div class="spec-value red-glow">熱系統 (Hot System)</div>
                    <p class="spec-desc">
                        由<strong>杏仁核</strong>主導的快速反應迴路。這讓你擁有驚人的爆發力，但也讓你容易繞過前額葉的邏輯檢查。
                    </p>
                </div>
            </div>

        </div>

        <div class="engine-footer">
            <div class="analysis-row">
                <el-icon>
                    <DataAnalysis />
                </el-icon>
                <span><strong>系統診斷：</strong> 此架構為「高頻交易」與「動態博弈」特化設計，在靜態環境下容易過熱（焦慮）。</span>
            </div>
        </div>

    </el-card>
</template>

<script setup>
import { Setting, DataAnalysis } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.hunter-engine-card {
    max-width: 700px;
    background-color: #2b2b2b;
    /* 深灰底色，突顯儀表板質感 */
    border: 1px solid #4c4d4f;
    color: #fff;
    border-radius: 8px;
    margin: 10px 0;
}

/* Header */
.engine-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid #4c4d4f;

    .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #909399;

        .header-title {
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-size: 0.9rem;
        }
    }

    .status-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        color: #67C23A;
        font-family: monospace;
        font-weight: bold;

        .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #67C23A;
            border-radius: 50%;
            box-shadow: 0 0 5px #67C23A;
            animation: pulse 1.5s infinite;
        }
    }
}

/* Dashboard Body */
.dashboard-body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 25px 20px;
    background: radial-gradient(circle at center, #3a3a3a 0%, #2b2b2b 120%);
}

.axis-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

/* Gauge Styles */
.gauge-wrapper {
    margin-bottom: 15px;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
}

.gauge-content {
    display: flex;
    flex-direction: column;
    line-height: 1;

    .axis-letter {
        font-size: 2rem;
        font-weight: 900;
        color: #F56C6C;
        font-family: 'Arial Black', sans-serif;
    }

    .axis-name {
        font-size: 0.7rem;
        color: #909399;
        margin-top: 4px;
        text-transform: uppercase;
    }
}

/* Spec Box */
.spec-box {
    background: rgba(255, 255, 255, 0.05);
    padding: 10px;
    border-radius: 6px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .spec-label {
        font-size: 0.7rem;
        color: #909399;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 4px;
    }

    .spec-value {
        font-size: 0.95rem;
        font-weight: bold;
        margin-bottom: 8px;

        &.red-glow {
            color: #F56C6C;
            text-shadow: 0 0 10px rgba(245, 108, 108, 0.3);
        }

        &.orange-glow {
            color: #E6A23C;
            text-shadow: 0 0 10px rgba(230, 162, 60, 0.3);
        }
    }

    .spec-desc {
        font-size: 0.85rem;
        line-height: 1.5;
        color: #ccc;
        text-align: left;
        margin: 0;

        strong {
            color: #fff;
        }
    }
}

/* Footer */
.engine-footer {
    padding: 10px 20px;
    background: #202020;
    border-top: 1px solid #4c4d4f;

    .analysis-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 0.85rem;
        color: #aaa;
        line-height: 1.4;

        strong {
            color: #E6A23C;
        }
    }
}

/* Animations */
@keyframes pulse {
    0% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(0.8);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

/* Mobile RWD */
@media (max-width: 600px) {
    .dashboard-body {
        grid-template-columns: 1fr;
        /* 手機版改單欄 */
        gap: 30px;
    }

    .spec-box {
        text-align: center;

        .spec-desc {
            text-align: center;
            /* 手機版文字居中較美觀 */
        }
    }
}
</style>