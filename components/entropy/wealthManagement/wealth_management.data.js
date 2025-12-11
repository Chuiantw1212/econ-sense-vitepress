// wealth_management.data.js
const wealthManagementData = {
    // 1. Hunter (IRH)
    Hunter: {
        totem: "金錢是獵物 (Prey) 與彈藥 (Ammo)",
        totemDesc: "是多巴胺的具象化。如果不持續捕獵（賺錢）或射擊（消費），大腦會因缺乏刺激而陷入焦慮。",
        management: {
            title: "狩獵隔離機制 (Kill Switch)",
            desc: "你的大腦將「金錢」視為狩獵成功的獎賞（Dopamine hit），導致賺越多花越兇的報復性循環。",
            action: "建立「戰利品庫」。這不是儲蓄，這是你的「積分榜」。將收入的 50% 在入帳瞬間「物理性隔離」（如轉入無網銀功能的帳戶或購買實體黃金），讓剩下的錢成為「有限的子彈」，逼迫自己精準射擊。",
            blindSpot: "多巴胺崩潰 (Dopamine Crash)。在狩獵成功後（大賺）容易因過度自信而產生「賭徒謬誤」，進行毀滅性消費。"
        }
    },

    // 2. Pioneer (IVH)
    Pioneer: {
        totem: "金錢是現實扭曲力場 (Reality Distortion Capital)",
        totemDesc: "是用來縮短「現在」與「腦中願景」距離的燃料，本質是為了這世界還不存在的東西買單。",
        management: {
            title: "現金流警報器 (Runway Alert)",
            desc: "你的 DMN (預設模式網絡) 過於發達，導致容易忽視 TPN (當下執行) 的物理限制，常誤以為「估值」等於「現金」。",
            action: "聘請一位「極度悲觀」的財務副手或設定自動化警報。當現金流低於 6 個月生存線時，強制凍結所有「研發型」支出。你需要外部的約束力來對抗你的樂觀偏誤。",
            blindSpot: "願景溢價。容易為了「概念」支付過高的價格，忽視了執行層面的成本結構。"
        }
    },

    // 3. Gatherer (ORH)
    Gatherer: {
        totem: "金錢是社交流動性 (Social Liquidity)",
        totemDesc: "是一種信號，用來證明自己在群體中的位階，並維持高頻率的人際互動。",
        management: {
            title: "展示面預算 (Signaling Budget)",
            desc: "你的消費往往是為了「展演 (Signaling)」。這不是浪費，而是你獲取資源的方式，但必須控制邊界。",
            action: "將「社交支出」視為「行銷費用」。每筆請客或治裝都必須問自己：這筆錢能帶來多少「連結回報 (ROCx)」？如果只是為了面子而無實質連結，直接砍掉。",
            blindSpot: "生活方式通膨 (Lifestyle Creep)。隨著收入增加，為了維持在更高圈層的「人設」，導致儲蓄率永遠為零。"
        }
    },

    // 4. Shaman (OVH)
    Shaman: {
        totem: "金錢是業力貨幣 (Karmic Currency)",
        totemDesc: "是顯化集體願景的能量載體。錢本身無意義，重點是錢流向哪裡（善或惡）。",
        management: {
            title: "無意識自動化 (Unconscious Automation)",
            desc: "強迫薩滿記帳是徒勞的，你們會下意識逃避「世俗的算計」。",
            action: "建立「水庫分流系統」。薪資入帳當天自動扣除 60% 到投資與儲蓄池，剩下的 40% 讓你隨意使用。不要讓自己有機會做財務決策，讓系統代勞。",
            blindSpot: "神聖匱乏感 (Sacred Poverty)。潛意識裡認為「貧窮才是高尚的」，導致無意識地排斥財富進入生命。"
        }
    },

    // 5. Toolmaker (IRC)
    Toolmaker: {
        totem: "金錢是效能指標 (Efficiency Metric)",
        totemDesc: "是對自身技能與判斷力的客觀評分，追求絕對的精確與無風險套利。",
        management: {
            title: "機會成本計算 (Opportunity Cost)",
            desc: "你容易陷入「省小錢花大時間」的陷阱，因為你的大腦喜歡解題（比價/優化）的過程。",
            action: "設定「時間匯率」。計算你的時薪，任何低於此時薪的省錢行為（如花1小時找優惠券省50元）都是虧損。強迫自己購買「時間」而非購買「折扣」。",
            blindSpot: "分析癱瘓 (Analysis Paralysis)。在需要快速決策時，因過度追求「最優解」而錯失整個市場波段。"
        }
    },

    // 6. Sentry (IVC)
    Sentry: {
        totem: "金錢是護城河 (Moat)",
        totemDesc: "用於構建獨立於外部混亂的系統，確保在任何災難下都能維持運作。",
        management: {
            title: "反脆弱配置 (Antifragile Allocation)",
            desc: "你傾向於過度防禦（囤積現金），這反而讓你暴露在通膨的攻擊下。",
            action: "建立「三層防禦體系」。1. 生存層（現金）；2. 抗通膨層（硬資產）；3. 成長層（指數基金）。告訴自己：不投資才是最大的風險。",
            blindSpot: "災難化思維。因為過度在大腦模擬最壞情況（V+C），導致不敢動用資金進行必要的投資或享受。"
        }
    },

    // 7. Helper (ORC)
    Helper: {
        totem: "金錢是守護屏障 (Shield)",
        totemDesc: "確保所愛之人的穩定生活，是提供照顧與支援的物質基礎。",
        management: {
            title: "財務界線設定 (Financial Boundaries)",
            desc: "你的錢包常是破洞的，因為你無法拒絕親友的請求（O型驅力）。",
            action: "建立「不可動用信託」。將養老金與緊急預備金放入法律上或物理上極難取用的帳戶。當親友借錢時，你可以誠實地說：「錢被鎖住了，我拿不出來。」",
            blindSpot: "軟性債務與共同依賴。為了幫助別人而承擔了不該承擔的風險（如作保），這不是幫忙，是共沉淪。"
        }
    },

    // 8. Elder (OVC)
    Elder: {
        totem: "金錢是傳承信託 (Dynastic Trust)",
        totemDesc: "超越個人壽命的資源，用於維繫家族、組織或價值觀的長存。",
        management: {
            title: "家族辦公室思維 (Family Office Mindset)",
            desc: "你思考的時間維度太長，容易忽略短期的流動性風險。",
            action: "聘請專業代理人。你適合制定戰略，但不適合處理細節。找一個 Toolmaker (工匠) 或 Helper (助人者) 來幫你管理日常帳務與執行交易。",
            blindSpot: "路徑依賴與僵化。因為過於重視歷史與傳統，堅持持有已經過氣的「藍籌股」，錯失新時代的轉折點。"
        }
    }
};

export default {
    load() {
        return wealthManagementData
    }
}