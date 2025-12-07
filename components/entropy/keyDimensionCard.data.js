const MANUAL_DB = {
    // X 軸：驅動力 (睪固酮/側化 vs 催產素/整合)
    x: {
        pos: { // I: Individual (Testosterone)
            chemical: "睪固酮 (Testosterone) / 腦側化",
            mechanism: `
                你的大腦受<b>睪固酮</b>影響，傾向高度的<b>「功能側化 (Lateralization)」</b>與<b>「模組化 (Modularity)」</b>。
                研究顯示，睪固酮會減少胼胝體的資訊交流，使左腦（邏輯/語言）與右腦（空間/直覺）能獨立運作而不互相干擾。
                <br><br>
                這種<b>「去連結 (Uncoupling)」</b>機制讓你具備極強的「屏蔽力」，能在競爭高壓下關閉情緒干擾，專注於解決問題的工具理性 (Instrumental Rationality)。
            `,
            dos: ["參與零和賽局或有明確排名的競爭", "爭取高自主權與決策權的職位", "設定短期且具挑戰性的具體目標"],
            donts: ["齊頭式平等的平均主義環境", "被微觀管理 (Micromanagement) 而失去控制權", "缺乏明確回饋的例行公事"]
        },
        neg: { // O: Others (Oxytocin)
            chemical: "催產素 (Oxytocin) / 全腦整合",
            mechanism: `
                你的大腦受<b>催產素</b>調節，促進了極高的<b>「跨半球連結 (Inter-hemispheric Connectivity)」</b>。
                這強化了右腦（情緒感知）與左腦（敘事理解）的即時同步，使你的大腦呈現<b>「全腦整合」</b>狀態。
                <br><br>
                你的優勢在於能同時處理邏輯與情感資訊，讀懂複雜的「空氣」與社交訊號，這是建立深層信任與領導團隊的生物學基礎。
            `,
            dos: ["建立心理安全感極高的協作團隊", "從事助人、教育或諮詢等利他工作", "透過深層對話建立情感連結"],
            donts: ["充滿敵意與政治鬥爭的職場", "孤立無援的單兵作戰模式", "為了績效指標而被迫犧牲人際關係"]
        }
    },

    // Y 軸：熵狀態 (NE/Amygdala vs GABA/PFC)
    y: {
        pos: { // H: Hot (High Entropy)
            chemical: "去甲腎上腺素 / 熵腦假說",
            mechanism: `
                你的大腦偏向<b>「熱系統 (Hot System)」</b>，這意味著你的<b>杏仁核</b>反應極快，且受<b>去甲腎上腺素 (Norepinephrine)</b> 驅動進入高喚醒狀態。
                這符合<b>「熵腦假說」</b>中的<b>「臨界狀態 (Criticality)」</b>，神經網絡連結度極高且發散。
                <br><br>
                雖然抑制控制較弱，但這讓你具備極佳的戰術適應力，能繞過緩慢的邏輯過濾，直接對環境刺激做出直覺反應，將情緒張力轉化為創造燃料。
            `,
            dos: ["多工處理 (Multitasking) 與高強度衝刺", "在危機或變動環境中進行快速決策", "利用情緒張力作為創造力的燃料"],
            donts: ["被要求長時間「冷靜」與壓抑情緒", "缺乏外部死線 (Deadline) 的低壓環境", "過度繁瑣且無意義的行政流程"]
        },
        neg: { // C: Cold (Low Entropy)
            chemical: "GABA / 前額葉抑制控制",
            mechanism: `
                你的大腦由<b>「冷系統 (Cold System)」</b>主導。你的前額葉皮質利用主要的抑制性神經遞質 <b>GABA</b>，有效地平息邊緣系統的雜訊。
                <br><br>
                這賦予你強大的「認知煞車」能力，能過濾衝動與干擾，維持神經訊號的極高<b>信噪比 (Signal-to-Noise Ratio)</b>。
                你擅長將混亂的變數收斂為有序的邏輯模型，追求可預測性與精準度。
            `,
            dos: ["需要深度運算與邏輯推演的任務", "建立並優化複雜的標準作業程序 (SOP)", "在資訊充分且穩定的環境中做決策"],
            donts: ["充滿情緒干擾與人際戲劇的環境", "缺乏邏輯結構的混亂指令", "被迫在資訊不足時進行豪賭"]
        }
    },

    // Z 軸：拓撲向 (ACh/CEN vs DMN/Hypofrontality)
    z: {
        pos: { // R: Real (CEN)
            chemical: "乙醯膽鹼 (ACh) / 執行網絡",
            mechanism: `
                你的大腦由<b>中央執行網絡 (CEN)</b> 強勢主導。高濃度的<b>乙醯膽鹼 (Acetylcholine)</b> 就像聚光燈一樣，增加了感官皮層的訊號增益。
                <br><br>
                這讓你將注意力鎖定在「外部世界」與具體細節，你的認知資源主要用於處理當下的感官數據、工作記憶與實體操作。你活在「當下」，大腦像雷達一樣持續掃描環境。
            `,
            dos: ["處理看得到、摸得到的實體問題", "需要快速反應的現場操作任務", "基於數據與感官證據的實證決策"],
            donts: ["長時間脫離現實的抽象空想", "沒有明確產出的發散式會議", "被強迫進行無意義的內省與反思"]
        },
        neg: { // V: Virtual (DMN)
            chemical: "預設模式網絡 (DMN) / 解離機制",
            mechanism: `
                你的大腦由<b>預設模式網絡 (DMN)</b> 主導，這通常與高度的內省、意義建構有關。
                有趣的是，神經影像學研究 (Newberg et al.) 指出，當你進入深度專注或「通道 (Channeling)」狀態時，你的大腦具備<b>「暫時關閉前額葉 (Hypofrontality)」</b>的能力。
                <br><br>
                這讓你能夠暫時放下「小我 (Ego)」的執著與批判，讓內在的宏大敘事或潛意識訊息自然流露，這正是創造力與靈性體驗的生物學基礎。
            `,
            dos: ["進行長期的戰略佈局與願景構建", "需要深度整合與意義尋找的任務", "享有大量不受打擾的獨處時間 (讓 DMN 運作)"],
            donts: ["被瑣碎的行政庶務填滿行程", "缺乏獨處空間 (DMN 無法離線運作)", "只看眼前利益的短視操作"]
        }
    }
};

const AXIS_CONFIG = {
    x: {
        name: '驅動力',
        pos: { label: '個體競爭 (I)', color: '#F56C6C', icon: '🚀', manual: MANUAL_DB.x.pos },
        neg: { label: '群體連結 (O)', color: '#67C23A', icon: '🤝', manual: MANUAL_DB.x.neg }
    },
    y: {
        name: '熵狀態',
        pos: { label: '熱系統 (H)', color: '#E6A23C', icon: '🔥', manual: MANUAL_DB.y.pos },
        neg: { label: '冷系統 (C)', color: '#409EFF', icon: '❄️', manual: MANUAL_DB.y.neg }
    },
    z: {
        name: '拓撲向',
        pos: { label: '實感執行 (R)', color: '#909399', icon: '👁️', manual: MANUAL_DB.z.pos },
        neg: { label: '預判模擬 (V)', color: '#9370DB', icon: '🧠', manual: MANUAL_DB.z.neg }
    }
};

export default {
    load() {
        return AXIS_CONFIG
    }
}