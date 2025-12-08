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
                <h3 class="archetype-name">{{ primaryRoleEn }} ({{ translatedArchetypeName }})</h3>
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
                    加入原型社群
                </el-button>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Share, ChatLineRound } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 接口定義
interface Vector3 { x: number; y: number; z: number; }

const props = defineProps<{
    userVector: Vector3 | null // 最終的平均向量
}>();

// --- 靜態資料定義 ---

// 1. 中英文標籤映射表
const CHINESE_MAP: Record<string, string> = {
    I: '個體', O: '群體', R: '實證', V: '內觀', H: '熱系統', C: '冷系統',
    Hunter: '獵人', Pioneer: '先驅', Toolmaker: '工匠', Sentry: '哨兵',
    Gatherer: '採集者', Shaman: '薩滿', Helper: '助人者', Elder: '長老',
};

// 2. 角色代碼到名稱的映射表 (核心查找表)
const ARCHETYPE_MAP_BY_CODE: Record<string, { en: string; zh: string }> = {
    'IRH': { en: 'Hunter', zh: '獵人' },
    'IVH': { en: 'Pioneer', zh: '先驅' },
    'IRC': { en: 'Toolmaker', zh: '工匠' },
    'IVC': { en: 'Sentry', zh: '哨兵' },
    'ORH': { en: 'Gatherer', zh: '採集者' },
    'OVH': { en: 'Shaman', zh: '薩滿' },
    'ORC': { en: 'Helper', zh: '助人者' },
    'OVC': { en: 'Elder', zh: '長老' },
};

// 3. 角色顏色映射 (功能色)
const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500',
    'Pioneer': '#FF8C00',
    'Toolmaker': '#1E90FF',
    'Sentry': '#00008B',
    'Gatherer': '#32CD32',
    'Shaman': '#9370DB',
    'Helper': '#20B2AA',
    'Elder': '#2E8B57',
};

// --- 核心計算邏輯 ---

// 1. 計算最終 3 字母代碼
const finalCode = computed(() => {
    const v = props.userVector;
    if (!v) return null;

    const mapCode = (score: number, posChar: string, negChar: string) => score >= 0 ? posChar : negChar;

    // C1: Drive (X) -> I/O
    const C1 = mapCode(v.x, 'I', 'O');
    // C2: Topology (Z) -> R/V
    const C2 = mapCode(v.z, 'R', 'V');
    // C3: Entropy (Y) -> H/C
    const C3 = mapCode(v.y, 'H', 'C');

    return `${C1}${C2}${C3}`;
});

// 2. 從代碼查找角色名稱
const calculatedRole = computed(() => {
    if (!finalCode.value) return { en: 'Unknown', zh: '未知角色' };
    return ARCHETYPE_MAP_BY_CODE[finalCode.value] || { en: 'Unknown', zh: '未知角色' };
});

const primaryRoleEn = computed(() => calculatedRole.value.en);
const translatedArchetypeName = computed(() => calculatedRole.value.zh);

// 3. 提取代碼單字
const codeParts = computed(() => {
    return finalCode.value ? finalCode.value.split('') : ['', '', ''];
});

// 4. 提取顏色
const primaryColor = computed(() => {
    return ARCHETYPE_COLORS[primaryRoleEn.value] || '#36b7cf';
});


// --- 社交文案生成 ---
const socialText = computed(() => {
    if (!finalCode.value) return "請先完成關鍵字勾選以生成報告。";

    const [c1, c2, c3] = codeParts.value;
    const desc: Record<string, string> = {
        'I': '競爭導向', 'O': '連結導向',
        'R': '實感執行', 'V': '內在預判',
        'H': '高變革性', 'C': '高穩定性'
    };

    const intro = `我的神經原型代碼是 ${finalCode.value} (${CHINESE_MAP[c1]} ${CHINESE_MAP[c2]} ${CHINESE_MAP[c3]})，`;

    const summary = `我是一個以 ${desc[c1]} 為驅力，擅長 ${desc[c2]}，並處於 ${desc[c3]} 狀態的${translatedArchetypeName.value}型人格！`;

    return intro + summary;
});


// --- 行動函數 (未變動) ---
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
    /* 已移除 max-width，卡片將使用 full width */
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 80px;
    width: 100px;
    /* 給予固定寬度確保排版一致 */

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