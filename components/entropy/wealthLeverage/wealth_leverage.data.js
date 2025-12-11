// wealth_leverage_revised.data.js
const wealthLeverageDataRevised = {
    // 1. Hunter (IRH) - 修正：強調套利與速度
    Hunter: {
        leverageType: "套利槓桿 (Arbitrage)",
        multiplier: "波動率 (Volatility)",
        desc: "你的大腦是高頻交易核心。優勢不在長期持有，而在於捕捉市場瞬間的「定價錯誤」與資訊落差。",
        scaling: "【交易規模化】透過金融衍生品或高頻交易，將單次精準判斷的收益最大化。你的工作是扣板機，不是長期耕耘。",
        partner: "Sentry (哨兵)",
        partnerDesc: "你需要一位極度冷靜的風控長。Sentry 建立的系統與底線，能防止你在殺紅眼時因為忽視法規或極端風險而歸零。"
    },

    // 2. Pioneer (IVH) - 維持：強調從0到1
    Pioneer: {
        leverageType: "複製槓桿 (Replication)",
        multiplier: "零邊際成本 (Code & Product)",
        desc: "你的強項是「破壞式創新」。一旦解決難題，就該將其封裝成軟體或標準化產品，利用代碼的邊際成本為零進行無限複製。",
        scaling: "【產品規模化】開發 SaaS 或專利產品。讓產品在你睡覺時繼續賣向全世界，這是唯一不需要許可的槓桿。",
        partner: "Helper (助人者)",
        partnerDesc: "你需要一位強大的營運長 (COO)。你的大腦充滿高熵的願景，只有 Helper 能將其拆解為可執行的 SOP 並穩定落地。"
    },

    // 3. Gatherer (ORH) - 維持：強調流量與感染力
    Gatherer: {
        leverageType: "媒體槓桿 (Media)",
        multiplier: "注意力 (Attention)",
        desc: "你的強項是「情緒感染」。不該進行一對一銷售，應透過直播或內容，一次對一百萬人說話。你是注意力的收割者。",
        scaling: "【影響力規模化】建立私域流量池。當你擁有「發聲權」，任何產品通過你的渠道都能瞬間變現。",
        partner: "Toolmaker (工匠)",
        partnerDesc: "Jobs 與 Wozniak 的經典組合。Toolmaker 提供堅實的產品壁壘，讓你不必擔心品質，專注於在前台炸場。"
    },

    // 4. Shaman (OVH) - 修正夥伴：需要架構師而非另一個導師
    Shaman: {
        leverageType: "社群槓桿 (Community)",
        multiplier: "信仰與共識 (Consensus)",
        desc: "你的強項是「賦予意義」。建立一個「教派」（社群/DAO），讓追隨者自發性地為你貢獻內容與傳播，依靠網絡效應獲利。",
        scaling: "【信仰規模化】發行 NFT 或建立知識體系。將你的感性號召轉化為可交易的「共識」，讓信徒成為股東。",
        partner: "Sentry (哨兵)",
        partnerDesc: "宗教需要先知 (Shaman)，但也需要律法 (Sentry)。Sentry 能將你的感性願景轉化為嚴密的組織章程與代幣經濟模型，防止社群崩塌。"
    },

    // 5. Toolmaker (IRC) - 維持：強調專利與IP
    Toolmaker: {
        leverageType: "技術槓桿 (Technology)",
        multiplier: "專利與獨佔 (Proprietary)",
        desc: "你的強項是「極致工藝」。不該廉價出賣技術時間，應將技術封裝成專利、解決方案或高門檻服務，賺取壟斷利潤。",
        scaling: "【技術規模化】技術授權 (Licensing) 或自動化工具。做那個「賣鏟子給淘金者」的人，這是最穩定的低熵收入。",
        partner: "Gatherer (採集者)",
        partnerDesc: "你需要一位超級業務。你的東西很好但太難懂，Gatherer 能將冷冰冰的技術翻譯成大眾語言，並利用人際網絡擴散。"
    },

    // 6. Sentry (IVC) - 維持：強調平台與抽稅
    Sentry: {
        leverageType: "規則槓桿 (Protocol)",
        multiplier: "過路費 (Tax/Fee)",
        desc: "你的強項是「架構設計」。你不該下場比賽，你該買下體育場，成為規則制定者（交易所、平台），向參與者收取過路費。",
        scaling: "【平台規模化】建立媒合系統。你不介入交易，你提供交易的「信任場所」，並從每一筆流動中抽成。",
        partner: "Hunter (獵人)",
        partnerDesc: "賭場蓋好了 (Sentry)，需要人來賭 (Hunter)。Hunter 能帶入第一批高風險偏好的使用者與流動性，啟動你的飛輪。"
    },

    // 7. Helper (ORC) - 修正：強調股權與代理人角色
    Helper: {
        leverageType: "組織槓桿 (Organization)",
        multiplier: "股權 (Equity)",
        desc: "你的強項是「降熵（穩定混亂）」。你是完美的「代理人」。你不適合單打獨鬥，你適合透過優化組織流程，放大團隊產出。",
        scaling: "【信任規模化】成為高成長公司的合夥人或營運長。你的財富不來自薪水，而來自依附於火箭（Pioneer）並獲得股權回報。",
        partner: "Pioneer (先驅)",
        partnerDesc: "Pioneer 負責踩油門，你負責看儀表板與補給。沒有你，Pioneer 的公司會解體；沒有 Pioneer，你缺乏爆發性成長的載體。"
    },

    // 8. Elder (OVC) - 修正夥伴：需要執行刀手
    Elder: {
        leverageType: "信譽槓桿 (Reputation)",
        multiplier: "資訊不對稱 (Asymmetry)",
        desc: "你的強項是「資源撮合」。你不需要親自下場，你利用長年累積的信用與人脈網，進行高層次的資源置換與背書。",
        scaling: "【人脈規模化】擔任顧問、獨董或造王者 (Kingmaker)。你的價值在於「你知道誰能解決這個問題」，賺取高額仲介費或乾股。",
        partner: "Hunter (獵人)",
        partnerDesc: "教父 (Elder) 需要殺手 (Hunter)。你擁有戰略與政治資本，但缺乏狼性與行動力。Hunter 是你最鋒利的刀，幫你執行骯髒或高風險的任務。"
    }
};

export default {
    load() {
        return wealthLeverageDataRevised
    }
}