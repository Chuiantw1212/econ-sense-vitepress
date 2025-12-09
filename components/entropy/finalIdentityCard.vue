<template>
    <el-card class="final-card" shadow="always" v-if="primaryRole" :style="{ '--primary-accent': primaryColor }">
        <div class="final-content">

            <div class="code-display">
                <div class="code-label">你的最終神經原型代碼是：</div>
                <div class="code-main">
                    <span class="code-type">
                        <div class="code-en">{{ codeParts[0] }}</div>
                        <div class="code-zh">{{ axisLabels[0] }}</div>
                    </span>
                    <span class="code-type">
                        <div class="code-en">{{ codeParts[1] }}</div>
                        <div class="code-zh">{{ axisLabels[1] }}</div>
                    </span>
                    <span class="code-type">
                        <div class="code-en">{{ codeParts[2] }}</div>
                        <div class="code-zh">{{ axisLabels[2] }}</div>
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

// --- Props ---
// 只接收主角色，確保與其他卡片一致
const props = defineProps<{
    primaryRole: string // 例如 'Hunter'
}>();

// --- 靜態資料定義 ---

// 1. 角色 -> 標準代碼映射表
const ARCHETYPE_CODES: Record<string, string> = {
    'Hunter': 'IRH', 'Pioneer': 'IVH', 'Toolmaker': 'IRC', 'Sentry': 'IVC',
    'Gatherer': 'ORH', 'Shaman': 'OVH', 'Helper': 'ORC', 'Elder': 'OVC',
};

// 2. 中文名稱映射
const ROLE_NAME_ZH: Record<string, string> = {
    'Hunter': '獵人', 'Pioneer': '先驅', 'Toolmaker': '工匠', 'Sentry': '哨兵',
    'Gatherer': '採集者', 'Shaman': '薩滿', 'Helper': '助人者', 'Elder': '長老',
};

// 3. 代碼字母 -> 中文標籤 (顯示在方塊下)
const AXIS_LABEL_MAP: Record<string, string> = {
    'I': '個體', 'O': '群體',
    'R': '實證', 'V': '內觀',
    'H': '熱系統', 'C': '冷系統'
};

// 4. 代碼字母 -> 文案描述 (用於分享文字)
const DESC_MAP: Record<string, string> = {
    'I': '競爭導向', 'O': '連結導向',
    'R': '實感執行', 'V': '內在預判',
    'H': '高變革性', 'C': '高穩定性'
};

// 5. 角色顏色
const ARCHETYPE_COLORS: Record<string, string> = {
    'Hunter': '#FF4500', 'Pioneer': '#FF8C00', 'Toolmaker': '#1E90FF', 'Sentry': '#00008B',
    'Gatherer': '#32CD32', 'Shaman': '#9370DB', 'Helper': '#20B2AA', 'Elder': '#2E8B57',
};

// --- Computed Logic ---

// 取得標準代碼 (例如 "IRH")
const finalCode = computed(() => {
    return ARCHETYPE_CODES[props.primaryRole] || '???';
});

// 拆解代碼 ['I', 'R', 'H']
const codeParts = computed(() => {
    return finalCode.value.split('');
});

// 取得對應的中文標籤 ['個體', '實證', '熱系統']
const axisLabels = computed(() => {
    return codeParts.value.map(char => AXIS_LABEL_MAP[char] || '');
});

const translatedArchetypeName = computed(() => {
    return ROLE_NAME_ZH[props.primaryRole] || props.primaryRole;
});

const primaryColor = computed(() => {
    return ARCHETYPE_COLORS[props.primaryRole] || '#36b7cf';
});

// --- 社交文案生成 (您要求的格式) ---
const socialText = computed(() => {
    if (!finalCode.value) return "請先完成關鍵字勾選以生成報告。";

    const [c1, c2, c3] = codeParts.value;
    const roleName = translatedArchetypeName.value;

    // 第一段：代碼解析 (IRH - 個體 實證 熱系統)
    const intro = `我的神經原型代碼是 ${finalCode.value} (${AXIS_LABEL_MAP[c1]} ${AXIS_LABEL_MAP[c2]} ${AXIS_LABEL_MAP[c3]})，`;

    // 第二段：詳細描述
    const summary = `我是一個以 ${DESC_MAP[c1]} 為驅力，擅長 ${DESC_MAP[c2]}，並處於 ${DESC_MAP[c3]} 狀態的 ${roleName} 型人格！`;

    return intro + summary;
});

// --- 行動函數 ---
const shareResult = () => {
    const url = window.location.href;
    const text = socialText.value + `\n【點擊此處測試你的神經原型】 ${url}`;

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

.code-type {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 90px;
    color: #fff;
    padding: 5px;
    border-radius: 8px;
    background-color: var(--primary-accent);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.code-en {
    font-size: 1.8rem;
    font-weight: 900;
    line-height: 1;
}

.code-zh {
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 4px;
}

.archetype-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-accent);
    margin-top: 10px;
}

/* 分享文案 */
.share-summary {
    padding: 15px;
    text-align: center;
    font-size: 1rem;
    line-height: 1.6;
    color: #303133;
    font-style: italic;
    font-weight: 500;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 20px;
}

/* 社交按鈕 */
.social-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
}
</style>