// founder_dual.data.js
const founderDualData = {
    // ==========================================
    // Group 1: 雙熱動 (H+H) - 高熵爆發型
    // 特徵：啟動力極強，但缺乏結構，容易燒乾資源。
    // ==========================================

    // Hunter (IRH) + Pioneer (IVH)
    "Hunter_Pioneer": {
        title: "戰爭領主 (The Warlord)",
        thermoType: "核融合反應爐 (Nuclear Fusion)",
        chemistry: "H+H (雙熱動) / I+I (雙個體)",
        desc: "你是「破壞式創新」的具象化。Pioneer 給予瘋狂的願景，Hunter 提供狼性的執行。你不需要地圖，你走到哪，路就在哪。",
        advantage: "【極致侵略性】在從 0 到 1 的階段無人能擋，能用最短時間攻下市場灘頭堡。",
        blindspot: "失速風險。因為缺乏「煞車機制 (C)」，容易在高速擴張中因為現金流斷裂或管理失控而瞬間解體。",
        partner: "你需要一位 Sentry (哨兵) 或 Helper (助人者) 來幫你收拾殘局和管錢。"
    },

    // Gatherer (ORH) + Hunter (IRH)
    "Gatherer_Hunter": {
        title: "海盜船長 (The Pirate Captain)",
        thermoType: "掠奪性熱能 (Predatory Heat)",
        chemistry: "H+H (雙熱動) / R+R (雙現證)",
        desc: "你是「機會主義」的極致。Gatherer 廣撒網找訊號，Hunter 精準出擊收割。你對市場的氣味極度敏感。",
        advantage: "【現金流收割機】非常擅長做生意（Deal Making）。你能在沒有產品的情況下，光靠「倒買倒賣」就能賺到第一桶金。",
        blindspot: "缺乏長期護城河。生意是做一單賺一單，很難累積成可規模化的「資產」或「系統」。"
    },

    // Hunter (IRH) + Shaman (OVH)
    "Hunter_Shaman": {
        title: "狂熱佈道者 (The Zealot)",
        thermoType: "精神燃燒 (Spiritual Combustion)",
        chemistry: "H+H (雙熱動) / 跨維度整合",
        desc: "你用「信仰」來驅動「殺戮」。你能讓團隊覺得正在進行一場聖戰，而不僅僅是工作。",
        advantage: "【死士團隊】你能建立一支對你絕對忠誠的部隊，在極端惡劣的環境下依然保有高昂士氣。",
        blindspot: "現實扭曲過度。容易分不清「願景」與「妄想」，帶著大家集體撞牆。"
    },

    // Gatherer (ORH) + Pioneer (IVH)
    "Gatherer_Pioneer": {
        title: "造勢天王 (The Showman)",
        thermoType: "擴散性熱能 (Diffusive Heat)",
        chemistry: "H+H (雙熱動) / 跨維度整合",
        desc: "Pioneer 負責造夢，Gatherer 負責傳播。你是天生的媒體大亨或行銷鬼才。",
        advantage: "【病毒式擴張】你不需要完美的產品，你只要有一個 Demo，就能讓全世界都討論你。",
        blindspot: "泡沫化。名氣大於實力，容易因產品交付失敗而引發巨大的公關災難。"
    },

    // Pioneer (IVH) + Shaman (OVH)
    "Pioneer_Shaman": {
        title: "預言家 (The Prophet)",
        thermoType: "純粹高熵體 (Pure High Entropy)",
        chemistry: "H+H (雙熱動) / V+V (雙內觀)",
        desc: "你活在未來，腳不沾地。你販賣的是人類的終極夢想，完全脫離物理現實的束縛。",
        advantage: "【定義未來】你是顛覆性概念的源頭，能吸引頂級人才為「意義」而非「金錢」工作。",
        blindspot: "物理斷層。極度缺乏 R (現證) 功能，如果沒有強力的營運長 (COO)，你的公司會是空中樓閣。"
    },

    // Gatherer (ORH) + Shaman (OVH)
    "Gatherer_Shaman": {
        title: "社群教主 (The Cult Leader)",
        thermoType: "情感共振場 (Resonance Field)",
        chemistry: "H+H (雙熱動) / O+O (雙他人)",
        desc: "你是「人」的磁鐵。Gatherer 連結人，Shaman 凝聚魂。你經營的不是公司，是粉絲俱樂部。",
        advantage: "【社群槓桿】擁有極高的用戶黏著度與自發傳播力，行銷成本極低。",
        blindspot: "人治色彩過重。組織架構鬆散，依賴創始人的個人魅力，難以制度化傳承。"
    },

    // ==========================================
    // Group 2: 冷熱混合 (H+C) - 自帶熱機型
    // 特徵：自帶動力與煞車，最穩定的單兵創業者。
    // ==========================================

    // Hunter (IRH) + Toolmaker (IRC)
    "Hunter_Toolmaker": {
        title: "技術殺手 (The Tech Assassin)",
        thermoType: "精密燃燒機 (Precision Engine)",
        chemistry: "H+C (混合) / R+R (雙現證)",
        desc: "你既能做出完美的刀 (Toolmaker)，又敢拿刀去砍人 (Hunter)。你是技術創業的最強單兵。",
        advantage: "【產品力變現】不像一般工程師只會閉門造車，你極度清楚如何將技術優勢轉化為市場優勢。",
        blindspot: "格局受限。容易陷入「戰術上的勤奮」，忽略了戰略上的長遠佈局。"
    },

    // Hunter (IRH) + Sentry (IVC)
    "Hunter_Sentry": {
        title: "冷血謀士 (The Cold Tactician)",
        thermoType: "溫控反應爐 (Controlled Reactor)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Sentry 負責佈局，Hunter 負責執行。你在冒險前已經算好了所有退路。",
        advantage: "【風險套利】擅長在極度危險的環境中，找到那條唯一的生路。這是不對稱作戰的專家。",
        blindspot: "決策內耗。大腦中「衝」與「縮」的聲音常打架，導致錯失瞬間的機會。"
    },

    // Helper (ORC) + Hunter (IRH)
    "Helper_Hunter": {
        title: "游擊隊長 (The Ranger)",
        thermoType: "實用主義者 (Pragmatist)",
        chemistry: "H+C (混合) / R+R (雙現證)",
        desc: "你有 Helper 的親和力與 Hunter 的殺傷力。你通常不會是大老闆，但你是最強的區域經理或專案負責人。",
        advantage: "【落地執行】能帶著團隊衝鋒陷陣，又能細心照顧隊員的後勤需求。",
        blindspot: "戰略短視。過度關注眼前的任務完成率，缺乏宏觀視野。"
    },

    // Elder (OVC) + Hunter (IRH)
    "Elder_Hunter": {
        title: "教父 (The Godfather)",
        thermoType: "深沈熱能 (Deep Heat)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "外表溫和 (Elder)，內心狠辣 (Hunter)。你用最溫柔的語氣，說出最致命的決策。",
        advantage: "【權謀槓桿】擅長利用人際關係與資源交換來達成目的，是談判桌上的頂級玩家。",
        blindspot: "過於深沈。城府太深導致合作夥伴難以完全信任你。"
    },

    // Pioneer (IVH) + Toolmaker (IRC)
    "Pioneer_Toolmaker": {
        title: "瘋狂科學家 (The Mad Scientist)",
        thermoType: "原型機 (Prototype Engine)",
        chemistry: "H+C (混合) / I+I (雙個體)",
        desc: "Pioneer 想像未來，Toolmaker 打造未來。你是 Elon Musk 類型的原型，致力於將科幻變為科學。",
        advantage: "【硬核創新】你是少數能將「願景」落實到「物理細節」的人，能做出劃時代的產品。",
        blindspot: "無視人性。過度專注於事與物，忽略了團隊管理與用戶感受。"
    },

    // Pioneer (IVH) + Sentry (IVC)
    "Pioneer_Sentry": {
        title: "系統架構師 (The Architect)",
        thermoType: "藍圖繪製者 (Blueprint Maker)",
        chemistry: "H+C (混合) / V+V (雙內觀)",
        desc: "你的大腦是一座宮殿。Pioneer 拓展邊界，Sentry 鞏固城牆。你構建的是龐大且嚴密的邏輯帝國。",
        advantage: "【頂層設計】你設計的商業模式具有極強的邏輯自洽性與長遠生命力。",
        blindspot: "落地困難。理論太完美，導致現實世界的執行總是不及格，容易陷入「眼高手低」。"
    },

    // Helper (ORC) + Pioneer (IVH)
    "Helper_Pioneer": {
        title: "傳教士 (The Missionary)",
        thermoType: "溫和推進器 (Gentle Thruster)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "你為了這世界還未出現的美好 (Pioneer) 而服務 (Helper)。你是最忠誠的創業夥伴。",
        advantage: "【願景守護】當所有人都放棄時，你會為了信念堅持到底，並處理好所有雜事。",
        blindspot: "缺乏主見。容易依附於更強勢的領導者，或為了「和諧」而犧牲效率。"
    },

    // Elder (OVC) + Pioneer (IVH)
    "Elder_Pioneer": {
        title: "精神領袖 (The Spiritual Guide)",
        thermoType: "燈塔 (Lighthouse)",
        chemistry: "H+C (混合) / V+V (雙內觀)",
        desc: "你結合了未來的願景 (Pioneer) 與過去的智慧 (Elder)。你看待創業的角度是歷史性的。",
        advantage: "【跨時代洞察】能從歷史週期中預測未來趨勢，做出的決策往往能穿越牛熊。",
        blindspot: "曲高和寡。你的想法太過深遠，初期很難被市場或員工理解。"
    },

    // Gatherer (ORH) + Toolmaker (IRC)
    "Gatherer_Toolmaker": {
        title: "產品經理 (The Product Manager)",
        thermoType: "用戶介面 (User Interface)",
        chemistry: "H+C (混合) / R+R (雙現證)",
        desc: "你懂人 (Gatherer) 也懂物 (Toolmaker)。你是技術與市場之間的最佳翻譯官。",
        advantage: "【PMF 專家】最容易找到 Product-Market Fit 的類型，做出的產品既好用又好賣。",
        blindspot: "平庸化陷阱。為了迎合市場而犧牲了產品的獨特性，或為了技術堅持而忽視市場聲音。"
    },

    // Gatherer (ORH) + Sentry (IVC)
    "Gatherer_Sentry": {
        title: "情報總監 (The Spymaster)",
        thermoType: "資訊過濾網 (Info Filter)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Gatherer 搜集海量資訊，Sentry 進行過濾分析。你掌握著市場的秘密。",
        advantage: "【資訊套利】總能比別人早一步發現市場的機會與風險。",
        blindspot: "分析癱瘓。資訊量過大導致決策緩慢，看太多反而不敢出手。"
    },

    // Gatherer (ORH) + Helper (ORC)
    "Gatherer_Helper": {
        title: "公關總管 (The Hospitality Master)",
        thermoType: "溫暖流動 (Warm Flow)",
        chemistry: "H+C (混合) / O+O (雙他人)",
        desc: "你是極致的服務業者。Gatherer 吸引客流，Helper 服務客戶。你讓每個人都感到賓至如歸。",
        advantage: "【體驗經濟】在服務業、餐飲業或社群運營上擁有無敵的優勢。",
        blindspot: "討好型人格。難以拒絕奧客或無理要求，導致利潤被侵蝕。"
    },

    // Elder (OVC) + Gatherer (ORH)
    "Elder_Gatherer": {
        title: "政客 (The Politician)",
        thermoType: "人脈樞紐 (Network Hub)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Elder 懂人性弱點，Gatherer 擅長社交。你能在複雜的人際迷宮中游刃有餘。",
        advantage: "【資源撮合】你不生產產品，你生產「關係」。你是最強的中介與掮客。",
        blindspot: "缺乏實業。如果沒有實體業務支撐，容易變成只會「喬事情」而無實質產出的人。"
    },

    // Shaman (OVH) + Toolmaker (IRC)
    "Shaman_Toolmaker": {
        title: "煉金術士 (The Alchemist)",
        thermoType: "魔導具 (Magic Tool)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Shaman 賦予意義，Toolmaker 打造載體。你擅長創造「有靈魂的產品」（如 Apple 產品）。",
        advantage: "【溢價製造機】能讓普通的工業品產生情感溢價，賣出高價。",
        blindspot: "過度沈溺細節。容易在微小的體驗上糾結太久，忽視了量產與成本。"
    },

    // Sentry (IVC) + Shaman (OVH)
    "Sentry_Shaman": {
        title: "守夜人 (The Night’s Watch)",
        thermoType: "神聖契約 (Sacred Pact)",
        chemistry: "H+C (混合) / V+V (雙內觀)",
        desc: "Shaman 守護價值觀，Sentry 守護邊界。你是組織文化的捍衛者。",
        advantage: "【組織韌性】建立的組織具有極強的抗壓性與凝聚力，不易被外部打垮。",
        blindspot: "排外性。容易形成封閉的圈子，排斥異己觀點。"
    },

    // Helper (ORC) + Shaman (OVH)
    "Helper_Shaman": {
        title: "療癒師 (The Healer)",
        thermoType: "溫柔光芒 (Gentle Light)",
        chemistry: "H+C (混合) / O+O (雙他人)",
        desc: "Shaman 感知痛苦，Helper 採取行動。你是團隊中的心理醫生與保母。",
        advantage: "【人才留存】員工流動率極低，大家是為了「家」的感覺而留下。",
        blindspot: "慈母多敗兒。過度包容表現不佳的員工，導致組織效率低落。"
    },

    // Elder (OVC) + Shaman (OVH)
    "Elder_Shaman": {
        title: "大祭司 (The High Priest)",
        thermoType: "精神圖騰 (Spiritual Totem)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "你是智慧與靈性的結合體。你在團隊中扮演的是「精神象徵」而非執行者。",
        advantage: "【至高權威】一句話就能定紛止爭，是團隊在迷茫時的燈塔。",
        blindspot: "脫離第一線。高高在上，容易被底下的執行層蒙蔽。"
    },

    // ==========================================
    // Group 3: 雙冷控 (C+C) - 低熵堡壘型
    // 特徵：極致穩定與優化，但缺乏啟動力，需要外部熱源。
    // ==========================================

    // Sentry (IVC) + Toolmaker (IRC)
    "Sentry_Toolmaker": {
        title: "堡壘建築師 (The Fortress Builder)",
        thermoType: "絕對零度 (Absolute Zero)",
        chemistry: "C+C (雙冷控) / I+I (雙個體)",
        desc: "Toolmaker 砌磚，Sentry 畫圖。你打造的系統堅不可摧，但也毫無溫度。",
        advantage: "【零失誤】適合從事資安、金融風控、精密製造等容錯率為零的行業。",
        blindspot: "熱寂 (Heat Death)。完全缺乏衝勁與冒險精神，如果沒有業務夥伴，公司會是一潭死水。"
    },

    // Helper (ORC) + Toolmaker (IRC)
    "Helper_Toolmaker": {
        title: "工匠管家 (The Craft Steward)",
        thermoType: "高效齒輪 (Efficient Gear)",
        chemistry: "C+C (雙冷控) / R+R (雙現證)",
        desc: "你既有技術又有耐心。你是最完美的「高級僱員」或「自由接案者」，但不是創業者。",
        advantage: "【交付品質】交給你的任務，你能以高於預期的品質準時完成。",
        blindspot: "缺乏野心。容易滿足於穩定的接案收入，缺乏擴張的動力。"
    },

    // Elder (OVC) + Toolmaker (IRC)
    "Elder_Toolmaker": {
        title: "博古通今的匠人 (The Master Craftsman)",
        thermoType: "時光膠囊 (Time Capsule)",
        chemistry: "C+C (雙冷控) / 跨維度整合",
        desc: "你有技術 (Toolmaker) 也有智慧 (Elder)。你是那種隱居深山的宗師。",
        advantage: "【極致權威】在極其利基的領域成為不可撼動的第一人。",
        blindspot: "與世隔絕。完全不屑於市場行銷，導致好東西沒人知道。"
    },

    // Helper (ORC) + Sentry (IVC)
    "Helper_Sentry": {
        title: "皇家護衛 (The Royal Guard)",
        thermoType: "護盾 (Shield)",
        chemistry: "C+C (雙冷控) / 跨維度整合",
        desc: "Sentry 看到危險，Helper 執行防護。你是最令人安心的後勤總管。",
        advantage: "【守成之王】當公司進入穩定期，你是最佳的守成者，杜絕浪費與弊端。",
        blindspot: "官僚主義。容易為了「合規」而犧牲「效率」，把簡單的事情複雜化。"
    },

    // Elder (OVC) + Sentry (IVC)
    "Elder_Sentry": {
        title: "圖書館長 (The Librarian)",
        thermoType: "靜止座標 (Static Coordinate)",
        chemistry: "C+C (雙冷控) / V+V (雙內觀)",
        desc: "你們活在規則與歷史之中。你們是組織的記憶庫與活化石。",
        advantage: "【基業長青】確保組織的核心價值觀與資產不會隨時間流失。",
        blindspot: "極度保守。拒絕任何改變，成為組織創新的最大阻力。"
    },

    // Elder (OVC) + Helper (ORC)
    "Elder_Helper": {
        title: "守護者 (The Caretaker)",
        thermoType: "恆溫箱 (Incubator)",
        chemistry: "C+C (雙冷控) / O+O (雙他人)",
        desc: "你們是組織中最溫暖的存在，默默守護著大家。",
        advantage: "【穩定的後盾】提供最穩定的支持系統，讓前線戰將無後顧之憂。",
        blindspot: "缺乏戰鬥力。在競爭激烈的市場中，過於溫和會被對手吞噬。"
    }
};

export default {
    load() {
        return founderDualData
    }
}