<template>
    <el-card class="hunter-interaction-card" shadow="hover">

        <div class="test-header">
            <el-tag type="warning" effect="dark" round>實戰模擬</el-tag>
            <h3 class="title">獵人本能測試：你能忍住不開槍嗎？</h3>
        </div>

        <div class="simulator-screen" :class="{ 'crashed': isCrashed }">
            <div class="market-label">🚀 迷因幣 (MEME) 即時報價</div>

            <div class="price-display">
                <span class="currency">$</span>
                <span class="amount">{{ currentPrice.toFixed(2) }}</span>
                <span class="change" v-if="!isCrashed && !isSuccess">(+{{ growthRate }}%)</span>
            </div>

            <div class="chart-visual">
                <div class="bar" v-for="n in 5" :key="n" :style="getBarStyle(n)"></div>
            </div>

            <div class="control-panel" v-if="gameState === 'playing'">
                <el-button type="danger" size="large" class="action-btn" @click="handleBuy">
                    ⚡ 這次不一樣！全倉追進！
                </el-button>
                <p class="timer-hint">忍耐倒數：{{ timeLeft }}s</p>
            </div>

            <div class="result-box fail" v-if="gameState === 'fail'">
                <el-icon class="result-icon">
                    <WarningFilled />
                </el-icon>
                <h4>獵殺失敗：你買在最高點！</h4>
                <p>這就是<strong>「熱系統 (Hot)」</strong>的代價。你把隨機波動當成了機會。<br>你的腎上腺素戰勝了邏輯。</p>
                <el-button size="small" @click="resetGame">不服氣，再來一次</el-button>
            </div>

            <div class="result-box success" v-if="gameState === 'success'">
                <el-icon class="result-icon">
                    <CircleCheckFilled />
                </el-icon>
                <h4>狩獵成功：你守住了現金！</h4>
                <p>恭喜！你啟動了<strong>「冷靜緩衝區」</strong>。行情隨後崩盤了，但你毫髮無傷。<br>這才是頂級獵人的耐心。</p>
                <el-button type="success" size="small" @click="resetGame">再來一次</el-button>
            </div>

        </div>

    </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { WarningFilled, CircleCheckFilled } from '@element-plus/icons-vue'

// 狀態管理
const gameState = ref('playing') // playing, fail, success
const currentPrice = ref(100.00)
const growthRate = ref(0)
const timeLeft = ref(5)
const isCrashed = ref(false)
let timer = null
let priceInterval = null

// 隨機價格跳動邏輯
const startSimulation = () => {
    gameState.value = 'playing'
    currentPrice.value = 100.00
    timeLeft.value = 5
    isCrashed.value = false
    growthRate.value = 0

    // 價格狂飆
    priceInterval = setInterval(() => {
        const jump = Math.random() * 5 + 1
        currentPrice.value += jump
        growthRate.value += Math.floor(jump)
    }, 200)

    // 倒數計時 (忍耐測試)
    timer = setInterval(() => {
        timeLeft.value--
        if (timeLeft.value <= 0) {
            handleWaitSuccess()
        }
    }, 1000)
}

// 玩家選擇：買進 (失敗)
const handleBuy = () => {
    clearInterval(timer)
    clearInterval(priceInterval)
    gameState.value = 'fail'
    isCrashed.value = true // 模擬買入即崩盤
    currentPrice.value = currentPrice.value * 0.3 // 暴跌
}

// 玩家選擇：忍住 (成功)
const handleWaitSuccess = () => {
    clearInterval(timer)
    clearInterval(priceInterval)
    gameState.value = 'success'
    isCrashed.value = true // 市場崩盤，但玩家沒買
    currentPrice.value = 50.00
}

const resetGame = () => {
    clearInterval(timer)
    clearInterval(priceInterval)
    startSimulation()
}

// CSS 動畫輔助函數
const getBarStyle = (n) => {
    return {
        height: `${Math.random() * 40 + 20}%`,
        animationDelay: `${n * 0.1}s`
    }
}

onMounted(() => {
    startSimulation()
})

onUnmounted(() => {
    clearInterval(timer)
    clearInterval(priceInterval)
})
</script>

<style lang="scss" scoped>
.hunter-interaction-card {
    max-width: 700px;
    background: #1a1a1a;
    border: 1px solid #444;
    color: #fff;
    margin: 20px 0;
    overflow: hidden;
}

.test-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;

    .title {
        margin: 0 !important;
        font-size: 1.1rem;
        color: #E6A23C;
        /* 警告色 */
    }
}

.simulator-screen {
    background: #000;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    position: relative;
    transition: all 0.3s;

    &.crashed {
        border-color: #F56C6C;
        background: rgba(245, 108, 108, 0.1);
    }
}

.market-label {
    color: #909399;
    font-size: 0.9rem;
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.price-display {
    font-family: 'Courier New', monospace;
    margin-bottom: 20px;

    .currency {
        font-size: 1.5rem;
        color: #67C23A;
    }

    .amount {
        font-size: 3rem;
        font-weight: 900;
        color: #67C23A;
        text-shadow: 0 0 10px rgba(103, 194, 58, 0.5);
    }

    .change {
        font-size: 1rem;
        color: #67C23A;
        margin-left: 10px;
        animation: blink 0.5s infinite;
    }
}

/* 模擬 K 線圖動畫 */
.chart-visual {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 60px;
    gap: 5px;
    margin-bottom: 20px;
    opacity: 0.5;

    .bar {
        width: 15px;
        background: #67C23A;
        border-radius: 2px 2px 0 0;
        animation: grow 0.5s infinite alternate;
    }
}

.control-panel {
    .action-btn {
        font-weight: 900;
        letter-spacing: 1px;
        box-shadow: 0 0 15px rgba(245, 108, 108, 0.4);
        animation: pulse 1s infinite;
        width: 100%;
        max-width: 300px;
    }

    .timer-hint {
        margin-top: 15px;
        font-size: 0.8rem;
        color: #666;
    }
}

.result-box {
    padding: 20px;
    border-radius: 8px;
    animation: slideUp 0.3s ease-out;

    .result-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }

    h4 {
        font-size: 1.2rem;
        margin: 0 0 10px 0;
    }

    p {
        color: #ccc;
        margin-bottom: 15px;
        line-height: 1.5;
    }

    &.fail {
        background: rgba(245, 108, 108, 0.2);
        border: 1px solid #F56C6C;

        .result-icon {
            color: #F56C6C;
        }

        h4 {
            color: #F56C6C;
        }
    }

    &.success {
        background: rgba(103, 194, 58, 0.2);
        border: 1px solid #67C23A;

        .result-icon {
            color: #67C23A;
        }

        h4 {
            color: #67C23A;
        }
    }
}

@keyframes blink {
    50% {
        opacity: 0.5;
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes grow {
    from {
        transform: scaleY(0.8);
    }

    to {
        transform: scaleY(1.2);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>