// career.data.js
const careerData = {
    // 1. Hunter (IRH)
    Hunter: {
        list: [
            { category: "金融與高風險投資", jobs: "丙種交易員 (Prop Trader)、加密貨幣操盤手、不良資產處置專員" },
            { category: "緊急應變與軍警", jobs: "特種部隊 (SWAT)、刑警/緝毒探員、搜救隊長、戰地記者" },
            { category: "前線醫療", jobs: "急診室醫師 (ER)、創傷外科醫師、飛行護理師" },
            { category: "極限業務", jobs: "陌生開發業務 (Hunter Sales)、土地開發專員、危機處理公關" }
        ]
    },

    // 2. Pioneer (IVH)
    Pioneer: {
        list: [
            { category: "創業與高階管理", jobs: "科技新創創辦人/CEO、產品長 (CPO)、轉型顧問" },
            { category: "創意與願景", jobs: "電影導演、廣告創意總監 (CD)、科幻小說家、遊戲製作人" },
            { category: "趨勢與資本", jobs: "風險投資合夥人 (VC)、宏觀經濟學家、趨勢分析師 (Futurist)" },
            { category: "策略規劃", jobs: "首席策略官 (CSO)、品牌架構師、政治競選操盤手" }
        ]
    },

    // 3. Gatherer (ORH)
    Gatherer: {
        list: [
            { category: "演藝與傳播", jobs: "YouTuber/直播主、演藝人員、活動主持人 (MC)、外景節目主持" },
            { category: "公關與行銷", jobs: "公關經理 (PR)、品牌發言人、活動策展人、時尚買手" },
            { category: "前線服務與銷售", jobs: "頂級房仲、空服員、導遊/領隊、健身團課教練" },
            { category: "教育現場", jobs: "幼兒律動老師、體驗教育引導員" }
        ]
    },

    // 4. Shaman (OVH)
    Shaman: {
        list: [
            { category: "療癒與諮商", jobs: "心理諮商師 (完形/心理劇)、藝術治療師、戲劇治療師、靈性導師" },
            { category: "社會影響力", jobs: "非營利組織 (NPO) 負責人、社會運動領袖、募款經理" },
            { category: "啟發與教練", jobs: "企業高管教練 (Executive Coach)、激勵講師、職涯教練" },
            { category: "故事行銷", jobs: "品牌故事長 (Chief Storyteller)、紀錄片導演" }
        ]
    },

    // 5. Toolmaker (IRC)
    Toolmaker: {
        list: [
            { category: "精密工程", jobs: "結構工程師、資安分析師 (防禦端)、晶片佈局工程師" },
            { category: "專業醫療", jobs: "顯微手術醫師、麻醉科醫師、牙醫師、藥劑師" },
            { category: "精算與合規", jobs: "會計師 (CPA)、精算師、專利工程師、鑑識會計" },
            { category: "高階操作", jobs: "民航機師、高鐵駕駛、珠寶鑑定師、鐘錶修復師" }
        ]
    },

    // 6. Sentry (IVC)
    Sentry: {
        list: [
            { category: "系統架構", jobs: "軟體系統架構師、AI 演算法科學家、區塊鏈底層開發" },
            { category: "法律與學術", jobs: "法官、憲法學者、大學教授、智庫研究員" },
            { category: "長期規劃", jobs: "都市計畫師、量化交易策略開發 (Quant)、稅務顧問" },
            { category: "深度創作", jobs: "非虛構類作家 (理論/歷史)、古典音樂作曲家、哲學家" }
        ]
    },

    // 7. Helper (ORC)
    Helper: {
        list: [
            { category: "行政管理", jobs: "行政總監、執行秘書、檔案管理員、註冊組長" },
            { category: "醫療照護", jobs: "護理師、職能治療師、營養師、長照管理師" },
            { category: "人力資源", jobs: "薪酬福利專員 (C&B)、員工關係專員、企業內訓協調" },
            { category: "穩定服務", jobs: "博物館/圖書館員、銀行櫃員、客戶服務經理 (CSM)" }
        ]
    },

    // 8. Elder (OVC)
    Elder: {
        list: [
            { category: "編輯與文化", jobs: "總編輯、文學經紀人、歷史學家、翻譯/口譯" },
            { category: "外交與協調", jobs: "外交官、勞資爭議調解員、國際關係分析師" },
            { category: "顧問與諮詢", jobs: "獵頭顧問 (研究型)、組織發展顧問 (OD)、員工協助方案專員" },
            { category: "心靈與教育", jobs: "學校輔導老師、瑜珈/冥想導師、社工師 (個案管理)" }
        ]
    }
};

export default {
    load() {
        return careerData
    }
}