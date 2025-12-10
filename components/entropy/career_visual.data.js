const careerVisualData = {
    // 1. Hunter (IRH)
    Hunter: {
        highlight: "尋找非對稱收益 (Asymmetric Payoff)",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["刑事偵查", "急診/重症護理", "外勤業務", "活動執行"],
                min: 60, max: 100, // 年薪 60-100萬
                desc: "【高壓護城河】利用你對混亂的耐受度，在常人無法忍受的高壓前線建立生存基石。",
                type: "高壓平原型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["土地開發", "醫材大藥廠", "危機處理顧問"],
                min: 80, max: 250, // 年薪 80-250萬
                desc: "【績效槓桿】在零和賽局中，靠狼性與戰術直覺獲勝。年薪取決於你的體力與野心。",
                type: "績效階梯型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["全職操盤手", "加密貨幣合約", "避險基金經理"],
                min: 100, max: 1000, // 上限破表
                desc: "【極限博弈】脫離勞務對價。利用大腦對數字波動的極度敏感，追求指數級的財富爆發。",
                type: "極端波動型 (Binary)"
            }
        ]
    },

    // 2. Pioneer (IVH)
    Pioneer: {
        highlight: "從 0 到 1 的現實扭曲力場",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["商業開發 (BD)", "儲備幹部 (MA)", "產業分析師"],
                min: 55, max: 90,
                desc: "【戰略職能】在成熟企業中擔任「探路者」。利用你的宏觀視野為企業尋找新機會。",
                type: "穩定型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["新事業負責人", "轉型顧問", "產品長 (CPO)"],
                min: 120, max: 300,
                desc: "【破壞式創新】負責解決最複雜的「從 0 到 1」難題。你是企業內部的創業家，享有高薪與決策權。",
                type: "專案波動型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["新創共同創辦人", "天使投資人", "Web3 發起人"],
                min: 0, max: 2000, // 創業初期可能無薪
                desc: "【股權爆發】拒絕販賣時間，改為販賣「未來」。承擔極高風險創立新局，透過資本市場變現。",
                type: "指數冪次型 (Equity)"
            }
        ]
    },

    // 3. Gatherer (ORH)
    Gatherer: {
        highlight: "流量與情緒的共振",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["活動企劃", "公關專員", "高端櫃姐/櫃哥"],
                min: 45, max: 80,
                desc: "【體驗交付】利用敏銳的感知力，在第一線創造氛圍，確保每個人的情緒都被妥善照顧。",
                type: "現金流型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["私人銀行家", "頂級房仲", "公關總監"],
                min: 100, max: 300,
                desc: "【人脈樞紐】成為資源交換的節點。經營高淨值人群的信任，透過消除資訊不對稱獲利。",
                type: "高波動型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["頭部網紅/KOL", "直播帶貨主", "演藝經紀老闆"],
                min: 80, max: 1000,
                desc: "【注意力經濟】將個人魅力數位化、規模化。影響力不受物理空間限制，流量即金流。",
                type: "指數型"
            }
        ]
    },

    // 4. Shaman (OVH)
    Shaman: {
        highlight: "信念與認知的重塑",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["心理諮商師", "社工督導", "企業內訓專員"],
                min: 50, max: 90,
                desc: "【專業助人】在機構內提供穩定的療癒力量。依靠證照與機構資源，進行深度對話與輔導。",
                type: "穩定型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["高管教練", "知名講師", "身心靈導師"],
                min: 100, max: 250,
                desc: "【高價賦能】將智慧模組化。針對企業或個人進行「認知升級」，解決昂貴的心智問題。",
                type: "講師費型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["品牌主理人", "IP 創作者", "宗教/社群領袖"],
                min: 60, max: 800,
                desc: "【信仰變現】建立屬於你的「教派」。透過內容與故事集結群眾，創造信仰溢價。",
                type: "長尾效應型"
            }
        ]
    },

    // 5. Toolmaker (IRC)
    Toolmaker: {
        highlight: "追求極致的確定性",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["資深工程師", "財務會計", "醫檢/物理治療"],
                min: 60, max: 100,
                desc: "【技術運維】成為系統中不可或缺的螺絲釘。依靠硬核技術維持龐大機器的運轉。",
                type: "穩定成長型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["主治醫師", "機師", "精算師", "資安專家"],
                min: 150, max: 400,
                desc: "【精密壟斷】在封閉且高門檻的領域達到極致。市場為你的「零失誤」支付頂級年薪。",
                type: "技能累計型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["建築事務所主持", "營造廠老闆", "技術長(CTO)"],
                min: 120, max: 600,
                desc: "【物理掌控】組建團隊，將你對物理空間與細節的控制欲，放大為可規模化的專案生意。",
                type: "專案提成型"
            }
        ]
    },

    // 6. Sentry (IVC)
    Sentry: {
        highlight: "系統架構與規則守護",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["法務專員", "合規經理", "公務員"],
                min: 55, max: 90,
                desc: "【規則守護】在既定體制內維護秩序。價值在於對法規與流程的熟悉，為組織規避風險。",
                type: "高穩定型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["系統架構師", "法務長", "研發總監"],
                min: 120, max: 300,
                desc: "【頂層設計】設計能夠長期運轉的邏輯骨架。無論是程式碼還是法律架構，你是規則制定者。",
                type: "階梯型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["量化基金經理", "專利佈局顧問", "早期智庫"],
                min: 100, max: 500,
                desc: "【資訊套利】利用資訊不對稱與深度研究獲利。在數據與邏輯的縫隙中尋找高槓桿回報。",
                type: "終身俸型"
            }
        ]
    },

    // 7. Helper (ORC)
    Helper: {
        highlight: "組織運作的穩定基石",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["行政專員", "銀行櫃員", "秘書/特助"],
                min: 45, max: 75,
                desc: "【流程執行】在穩定的SOP下進行精確操作。適合追求工作與生活平衡的人。",
                type: "線性積累型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["營運總監 (COO)", "護理長", "人資經理"],
                min: 90, max: 180,
                desc: "【體系運籌】成為組織的大管家。協調複雜的人事與資源，確保龐大機構能如期運轉。",
                type: "穩定型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["私人家族管家", "頂級隨扈", "VIP 客戶經理"],
                min: 80, max: 300,
                desc: "【極致信任】將服務昇華為「託付」。服務對象轉向頂級階層，依靠深層信任關係獲取高報酬。",
                type: "高穩定型"
            }
        ]
    },

    // 8. Elder (OVC)
    Elder: {
        highlight: "智慧整合與價值仲裁",
        tracks: [
            {
                name: "地板賽道 (The Floor)",
                tags: ["文字編輯", "博物館員", "學校行政"],
                min: 40, max: 70,
                desc: "【知識保存】在安靜的環境中整理資訊。遠離喧囂，專注於知識與文化的保存。",
                type: "穩定型"
            },
            {
                name: "天花板賽道 (The Ceiling)",
                tags: ["總編輯", "策展人", "勞資協調人"],
                min: 80, max: 180,
                desc: "【價值仲裁】解決複雜的人際與利益衝突。利用全局觀為混亂局面定調。",
                type: "隨年資增長型"
            },
            {
                name: "破框賽道 (The Breakout)",
                tags: ["暢銷作家", "付費訂閱主理", "戰略國師"],
                min: 50, max: 500,
                desc: "【智慧變現】掌握詮釋權。將深刻洞察轉化為顧問服務或知識產品，實現知識的複利變現。",
                type: "聲望變現型"
            }
        ]
    }
};

export default {
    load() {
        return careerVisualData
    }
}