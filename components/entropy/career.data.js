// career.data.js
const careerVisualData = {
    // 1. Hunter (IRH)
    Hunter: {
        highlight: "尋找非對稱收益 (Asymmetric Payoff)",
        tracks: [
            {
                name: "高頻套利 (Alpha Seeking)",
                tags: ["加密貨幣合約", "量化交易員(Execution)", "博弈操盤"],
                min: 60, max: 800,
                desc: "TPN 網絡主導。利用對價格波動的極度敏感，在市場無效性消失前的毫秒級窗口內完成收割。",
                type: "極端波動型 (Binary)"
            },
            {
                name: "前線獵殺 (Frontline Hunting)",
                tags: ["頂級業務(Closer)", "土地開發", "賞金獵人"],
                min: 50, max: 400,
                desc: "將「拒絕」視為多巴胺獎勵迴路的起點。在零和賽局中，透過征服對手獲得生理快感。",
                type: "績效階梯型"
            },
            {
                name: "極限操作 (Kinetic Ops)",
                tags: ["外科急診", "戰地記者", "特勤安保"],
                min: 70, max: 250,
                desc: "只有在生死交關的高熵環境下，大腦才能進入「心流」。平靜的環境會導致你的前額葉「熄火」。",
                type: "高壓平原型"
            }
        ]
    },

    // 2. Pioneer (IVH)
    Pioneer: {
        highlight: "從 0 到 1 的現實扭曲力場",
        tracks: [
            {
                name: "風險資本 (Venture Capital)",
                tags: ["早期VC", "天使投資", "孵化器主理"],
                min: 80, max: 1000,
                desc: "運用 V (內觀) 模擬五年後的平行宇宙。在眾人看不懂時下注，賺取認知的「時空紅利」。",
                type: "指數冪次型 (Power Law)"
            },
            {
                name: "造夢工程 (Visioneering)",
                tags: ["創始人/CEO", "科幻敘事", "產品架構(0-1)"],
                min: 0, max: 1500,
                desc: "無中生有。將腦中高熵的「幻覺」透過說服力具現化為真實，這是一種合法的現實扭曲技術。",
                type: "指數型"
            },
            {
                name: "破壞式顧問 (Disruption)",
                tags: ["企業轉型", "政治操盤", "危機公關"],
                min: 100, max: 500,
                desc: "專門尋找舊系統(C)的僵化點，引入混亂(H)來釋放價值。你是舊秩序的送葬者。",
                type: "專案波動型"
            }
        ]
    },

    // 3. Gatherer (ORH)
    Gatherer: {
        highlight: "流量與情緒的共振",
        tracks: [
            {
                name: "流量經濟 (Attention Economy)",
                tags: ["頭部網紅", "直播帶貨", "演藝明星"],
                min: 40, max: 800,
                desc: "你的大腦是高性能的「情緒雷達」。將群眾無形的注意力匯聚，並瞬間轉化為購買力。",
                type: "指數型"
            },
            {
                name: "超級節點 (Super Connector)",
                tags: ["頂級經紀", "高端仲介", "私人銀行家"],
                min: 60, max: 400,
                desc: "不生產產品，而是生產「關係」。在 O (他者) 的網絡中，透過消除資訊不對稱來抽取佣金。",
                type: "高波動型"
            },
            {
                name: "氛圍主理 (Vibe Manager)",
                tags: ["活動策展", "體驗設計", "夜店/餐飲主理"],
                min: 50, max: 200,
                desc: "販賣「當下」。在物理空間中調度聲光人流，創造出一種不可複製的高熵體驗。",
                type: "現金流型"
            }
        ]
    },

    // 4. Shaman (OVH)
    Shaman: {
        highlight: "認知與信念的重塑",
        tracks: [
            {
                name: "認知轉化 (Alchemist)",
                tags: ["高管教練", "心理治療師", "靈性導師"],
                min: 60, max: 350,
                desc: "處理最複雜的系統—人心。透過 V (內觀) 共情，重組他人的信念系統，釋放被鎖住的潛能。",
                type: "高單價時薪"
            },
            {
                name: "信仰構建 (Evangelism)",
                tags: ["品牌長(CBO)", "社群領袖", "文化運動"],
                min: 50, max: 300,
                desc: "為冰冷的產品或組織注入「靈魂」。你販賣的不是功能，而是歸屬感與意義。",
                type: "長尾效應型"
            },
            {
                name: "社會治癒 (Social Healing)",
                tags: ["NPO領袖", "DEI顧問", "藝術治療"],
                min: 40, max: 150,
                desc: "承接群體的陰影與創傷。將社會的高熵情緒轉化為具體的行動方案。",
                type: "穩定型"
            }
        ]
    },

    // 5. Toolmaker (IRC)
    Toolmaker: {
        highlight: "追求極致的確定性與掌控",
        tracks: [
            {
                name: "技術壟斷 (Specialist)",
                tags: ["專科醫師", "晶片架構師", "主任工程師"],
                min: 120, max: 600,
                desc: "TPN 網絡的極致運作。利用高門檻知識建立護城河，讓市場必須為你的「零失誤」支付溢價。",
                type: "高階梯型"
            },
            {
                name: "精密工藝 (Craftsmanship)",
                tags: ["量化開發(Dev)", "資安紅隊", "珠寶/鐘錶師"],
                min: 80, max: 350,
                desc: "在封閉系統中將誤差降至零。大腦享受與「物」互動的純粹邏輯，厭惡人的不可控變數。",
                type: "技能累計型"
            },
            {
                name: "效能優化 (Optimization)",
                tags: ["良率工程師", "精算師", "稅務規劃"],
                min: 70, max: 300,
                desc: "從現有系統中「擠」出利潤。透過降低系統熵值（減少浪費與風險）來創造價值。",
                type: "穩定成長型"
            }
        ]
    },

    // 6. Sentry (IVC)
    Sentry: {
        highlight: "抽象邏輯的具現與維護",
        tracks: [
            {
                name: "架構設計 (Architect)",
                tags: ["後端架構師", "區塊鏈底層", "城市規劃"],
                min: 100, max: 450,
                desc: "構建虛擬世界的地基。利用 DMN 的模擬能力，設計出能自動運轉且極度永續的系統。",
                type: "階梯型"
            },
            {
                name: "規則守護 (Guardian)",
                tags: ["法官/檢察官", "合規長(CCO)", "資安藍隊"],
                min: 90, max: 300,
                desc: "定義邊界。在 V (虛擬/法律/代碼) 的世界中巡邏，清除任何試圖破壞秩序的高熵因子。",
                type: "高穩定型"
            },
            {
                name: "學術殿堂 (Theorist)",
                tags: ["理論物理", "歷史學家", "哲學研究"],
                min: 60, max: 200,
                desc: "在純粹的思維宮殿中構建邏輯閉環。將混亂的現實世界抽象化為整齊的理論模型。",
                type: "終身俸型"
            }
        ]
    },

    // 7. Helper (ORC)
    Helper: {
        highlight: "組織的穩定基石與潤滑劑",
        tracks: [
            {
                name: "信任交付 (Trust Service)",
                tags: ["私人管家", "護理師", "客戶成功(CSM)"],
                min: 50, max: 150,
                desc: "高頻且穩定的 O (人際) 互動。透過日復一日的精確執行，建立他人無法動搖的信任依賴。",
                type: "線性積累型"
            },
            {
                name: "組織運維 (Operations)",
                tags: ["行政總監", "人資營運", "專案管理(PM)"],
                min: 50, max: 200,
                desc: "你是混亂與秩序之間的過濾器。確保高層的瘋狂想法(H)能安全落地為基層的可執行流程(C)。",
                type: "穩定型"
            },
            {
                name: "資源分配 (Gatekeeper)",
                tags: ["採購經理", "銀行授信", "補助審核"],
                min: 60, max: 180,
                desc: "守護資源的入口。在有限的資源下進行最合乎規範的分配，維持群體內部的公平。",
                type: "穩定型"
            }
        ]
    },

    // 8. Elder (OVC)
    Elder: {
        highlight: "跨維度的智慧整合與傳承",
        tracks: [
            {
                name: "價值仲裁 (Arbitration)",
                tags: ["外交官", "勞資調解", "法庭調解員"],
                min: 80, max: 300,
                desc: "站在高維度視角(V)，平衡各方利益衝突(O)。你的價值在於「防止系統因內耗而崩潰」。",
                type: "隨年資增長型"
            },
            {
                name: "文化詮釋 (Interpretation)",
                tags: ["總編輯", "出版人", "博物館長"],
                min: 60, max: 250,
                desc: "定義什麼是「好」。掌握文化資本的定價權，將當下的混亂資訊過濾為歷史的智慧。",
                type: "聲望變現型"
            },
            {
                name: "顧問傳承 (Wisdom)",
                tags: ["企業顧問", "二代導師", "家族辦公室"],
                min: 100, max: 500,
                desc: "將隱性知識 (Tacit Knowledge) 轉化為可傳承的智慧。這是越老越值錢的時間複利遊戲。",
                type: "高時薪型"
            }
        ]
    }
};

export default {
    load() {
        return careerVisualData
    }
}