<template>
    <el-card class="final-card" shadow="always" v-if="finalCode" :style="{ '--primary-accent': primaryColor }">
        <div class="final-content">

            <div class="code-display">
                <div class="code-label">你的最終神經原型代碼是：</div>
                <div class="code-main">
                    <span class="code-type">
                        <div class="code-en">{{ codeParts[0] }}</div>
                        <div class="code-zh">{{ CHINESE_MAP[codeParts[0]] }}</div>
                    </span>
                    <span class="code-type">
                        <div class="code-en">{{ codeParts[1] }}</div>
                        <div class="code-zh">{{ CHINESE_MAP[codeParts[1]] }}</div>
                    </span>
                    <span class="code-type">
                        <div class="code-en">{{ codeParts[2] }}</div>
                        <div class="code-zh">{{ CHINESE_MAP[codeParts[2]] }}</div>
                    </span>
                </div>
                <h3 class="archetype-name">{{ primaryRole }} ({{ translatedArchetypeName }})</h3>
            </div>

            <div class="share-summary">
                <p>{{ socialText }}</p>
            </div>

            <el-divider />

            <div class="social-actions">
                <el-button type="primary" :icon="Share" round @click="shareResult"
                    :style="{ backgroundColor: primaryColor, borderColor: primaryColor }">
                    分享我的結果
                </el-button>
                <el-button :icon="ChatLineRound" round @click="joinCommunity" color="#36b7cf" plain>
                    加入社群 (密碼：你的角色)
                </el-button>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Share, ChatLineRound } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 接口定義 (與 Main.vue 保持一致)
interface Vector3 { x: number; y: number; z: number; }

const props = defineProps<{
    primaryRole: string, // 例如 'Hunter'
    userVector: Vector3 | null // 最終的平均向量
}>();

// --- 中文映射表 (用於顯示) ---
const CHINESE_MAP: Record<string, string> = {
    I: '個體', O: '群體', R: '實證', V: '內觀', H: '熱系統', C: '冷系統',
    Hunter: '獵人', Pioneer: '先驅', Toolmaker: '工匠', Sentry: '哨兵',
    Gatherer: '採集者', Shaman: '薩滿', Helper: '助人者', Elder: '長老',
};

// --- 角色顏色映射 (保持功能色不變) ---
const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500',    // 獵人 - 橙紅
    'Pioneer': '#FF8C00',   // 先驅 - 亮橙
    'Toolmaker': '#1E90FF', // 工匠 - 藍
    'Sentry': '#00008B',    // 哨兵 - 深藍
    'Gatherer': '#32CD32',  // 採集者 - 綠
    'Shaman': '#9370DB',    // 薩滿 - 紫
    'Helper': '#20B2AA',    // 助人者 - 淺綠/藍綠
    'Elder': '#2E8B57',     // 長老 - 深綠
};

const primaryColor = computed(() => {
    return ARCHETYPE_COLORS[props.primaryRole] || '#36b7cf';
});

const translatedArchetypeName = computed(() => {
    return CHINESE_MAP[props.primaryRole] || props.primaryRole;
});

// --- 邏輯：從向量計算出 3 字母代碼 (D-T-E) ---
const finalCode = computed(() => {
    const v = props.userVector;
    if (!v || !props.primaryRole) return null;

    const mapCode = (score: number, posChar: string, negChar: string) => score >= 0 ? posChar : negChar;

    const C1 = mapCode(v.x, 'I', 'O');
    const C2 = mapCode(v.z, 'R', 'V');
    const C3 = mapCode(v.y, 'H', 'C');

    return `${C1}${C2}${C3}`;
});

const codeParts = computed(() => {
    return finalCode.value ? finalCode.value.split('') : ['', '', ''];
});


// --- 社交文案生成 ---
const socialText = computed(() => {
    if (!finalCode.value) return "請先完成關鍵字勾選以生成報告。";

    const intro = `我的神經原型代碼是 ${finalCode.value} (${CHINESE_MAP[finalCode.value[0]]} ${CHINESE_MAP[finalCode.value[1]]} ${CHINESE_MAP[finalCode.value[2]]})，`;

    const desc: Record<string, string> = {
        'I': '競爭導向', 'O': '連結導向',
        'R': '實感執行', 'V': '內在預判',
        'H': '高變革性', 'C': '高穩定性'
    };

    const [c1, c2, c3] = codeParts.value;
    const summary = `我是一個以 ${desc[c1]} 為驅力，擅長 ${desc[c2]}，並處於 ${desc[c3]} 狀態的${translatedArchetypeName.value}型人格！`;

    return intro + summary;
});


// --- 行動函數 ---
const shareResult = () => {
    const url = window.location.href;
    const text = socialText.value + `【點擊此處測試你的神經原型】 ${url}`;

    if (navigator.share) {
        navigator.share({
            title: '我的神經原型代碼',
            text: text,
            url: url
        }).catch((error) => console.log('Error sharing', error));
    } else {
        navigator.clipboard.writeText(text);
        ElMessage.success('結果已複製到剪貼簿，快去分享吧！');
    }
};

const joinCommunity = () => {
    window.open('https://line.me/ti/g2/w2xjp79QxMO76vVw_aQuEqeH2ahdcn7uY7lQAg', '_blank');
};
</script>

<style scoped>
.final-card {
    margin-top: 20px;
    border-radius: 16px;
    border: 2px solid var(--primary-accent);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    /* 移除 max-width 和 margin auto，讓卡片使用全寬 */
}

.final-content {
    padding: 10px;
}

/* 代碼展示區 */
.code-display {
    text-align: center;
    margin-bottom: 20px;
}

.code-label {
    font-size: 0.95rem;
    color: #606266;
    font-weight: bold;
    margin-bottom: 8px;
}

.code-main {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 10px;
}

/* 包含中英文的代碼方塊樣式 */
.code-type {
    /* 讓內容垂直居中 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 80px;
    /* 給予足夠高度容納兩行文字 */

    color: #fff;
    padding: 5px 15px;
    border-radius: 8px;
    background-color: var(--primary-accent);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.code-en {
    font-size: 1.5rem;
    /* 英文代碼 */
    font-weight: 900;
    line-height: 1.1;
}

.code-zh {
    font-size: 0.9rem;
    /* 中文標籤 */
    font-weight: 500;
    line-height: 1.1;
}

.archetype-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-accent);
    margin-top: 5px;
}

/* 分享文案 */
.share-summary {
    padding: 10px 0;
    text-align: center;
    font-size: 1rem;
    line-height: 1.6;
    color: #303133;
    font-style: italic;
    font-weight: 500;
}

/* 社交按鈕 */
.social-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
}
</style>