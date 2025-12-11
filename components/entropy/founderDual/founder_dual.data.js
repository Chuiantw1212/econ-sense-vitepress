const founderDualData = {
    // ==========================================
    // Group 1: 雙熱動 (H+H) - 擴張與動員
    // 功能：帶領族人走出洞穴，尋找新獵場或建立新神話。
    // ==========================================

    // Hunter (IRH) + Pioneer (IVH)
    "Hunter_Pioneer": {
        title: "拓荒首領 (The Frontier Chief)",
        thermoType: "核融合反應爐 (Nuclear Fusion)",
        chemistry: "H+H (雙熱動) / I+I (雙個體)",
        desc: "你是帶領族人跨越冰原、尋找新大陸的領袖。Pioneer 看見了遠方的綠洲，Hunter 負責斬殺沿途的野獸。你不需要地圖，你走到哪，路就在哪。",
        advantage: "【極致侵略性】在從 0 到 1 的蠻荒階段無人能擋，能用最短時間攻下獵場灘頭堡。",
        blindspot: "失速風險。因為缺乏「煞車機制 (C)」，容易在高速衝鋒中因為糧草耗盡或管理失控而瞬間解體。",
        partner: "你需要一位 Sentry (哨兵) 或 Helper (助人者) 來幫你收拾殘局和管糧倉。"
    },

    // Gatherer (ORH) + Hunter (IRH)
    "Gatherer_Hunter": {
        title: "機會主義掠食者 (The Opportunistic Forager)",
        thermoType: "掠奪性熱能 (Predatory Heat)",
        chemistry: "H+H (雙熱動) / R+R (雙現證)",
        desc: "你是最靈活的生存者。Gatherer 負責廣泛搜尋漿果與獸群的蹤跡，Hunter 負責精準投擲長矛。你對叢林中任何「資源流動」的氣味極度敏感。",
        advantage: "【資源收割】非常擅長交易與獲取。你能在沒有自產糧食的情況下，光靠「交換與狩獵」就讓部落富足。",
        blindspot: "缺乏長期囤積。今天的獵物今天吃完，很難累積成可規模化的「農耕系統」。"
    },

    // Hunter (IRH) + Shaman (OVH)
    "Hunter_Shaman": {
        title: "戰舞者 (The War Dancer)",
        thermoType: "精神燃燒 (Spiritual Combustion)",
        chemistry: "H+H (雙熱動) / 跨維度整合",
        desc: "你用「信仰」來驅動「殺戮」。在出征前，你是那個負責跳戰舞、讓戰士們進入狂暴狀態的人。你讓流血變成了神聖的儀式。",
        advantage: "【狂熱死士】你能建立一支對你絕對忠誠的部隊，在極端惡劣的環境下依然保有高昂士氣。",
        blindspot: "集體狂熱。容易分不清「神諭」與「妄想」，帶著族人集體衝向懸崖。"
    },

    // Gatherer (ORH) + Pioneer (IVH)
    "Gatherer_Pioneer": {
        title: "持火者 (The Fire Bearer)",
        thermoType: "擴散性熱能 (Diffusive Heat)",
        chemistry: "H+H (雙熱動) / 跨維度整合",
        desc: "Pioneer 點燃火種，Gatherer 將火傳遞給所有人。你是天生的造勢者，高舉火把吸引周圍所有分散的部落向你靠攏。",
        advantage: "【病毒式擴散】你不需要完美的工具，你只要有一個信號，就能讓整片叢林都注意到你。",
        blindspot: "燃料耗盡。名氣大於實力，容易因無法持續提供足夠的獵物而導致信譽崩盤。"
    },

    // Pioneer (IVH) + Shaman (OVH)
    "Pioneer_Shaman": {
        title: "神話建構者 (The Myth Maker)",
        thermoType: "純粹高熵體 (Pure High Entropy)",
        chemistry: "H+H (雙熱動) / V+V (雙內觀)",
        desc: "你活在傳說之中。你編織了關於「起源」與「終點」的共同故事（虛構現實），讓智人 (Sapiens) 得以突破鄧巴數而團結。",
        advantage: "【定義未來】你是顛覆性概念的源頭，能吸引頂級人才為「意義」而非「食物」工作。",
        blindspot: "物理斷層。極度缺乏 R (現證) 功能，如果沒有強力的執行者，你的應許之地永遠只是營火邊的故事。"
    },

    // Gatherer (ORH) + Shaman (OVH)
    "Gatherer_Shaman": {
        title: "聚落核心 (The Circle Maker)",
        thermoType: "情感共振場 (Resonance Field)",
        chemistry: "H+H (雙熱動) / O+O (雙他人)",
        desc: "你是營火晚會的主持人。Gatherer 連結人，Shaman 凝聚魂。你經營的不是部落，是歸屬感與集體記憶。",
        advantage: "【社群槓桿】擁有極高的族人黏著度與自發傳播力，凝聚成本極低。",
        blindspot: "人治色彩過重。組織架構鬆散，依賴個人的個人魅力，難以形成制度。"
    },

    // ==========================================
    // Group 2: 冷熱混合 (H+C) - 技術與適應
    // 功能：製造工具、改良陷阱、優化資源分配。
    // ==========================================

    // Hunter (IRH) + Toolmaker (IRC)
    "Hunter_Toolmaker": {
        title: "黑曜石匠人 (The Obsidian Knapper)",
        thermoType: "精密燃燒機 (Precision Engine)",
        chemistry: "H+C (混合) / R+R (雙現證)",
        desc: "你既能打磨出最鋒利的黑曜石 (Toolmaker)，又敢拿它去刺穿猛獁象 (Hunter)。你是舊石器時代的高科技單兵。",
        advantage: "【產品力變現】不像一般工匠只會閉門造車，你極度清楚如何將技術優勢轉化為殺戮效率。",
        blindspot: "格局受限。容易陷入「戰術上的勤奮」，忽略了遷徙與氣候變遷的戰略佈局。"
    },

    // Hunter (IRH) + Sentry (IVC)
    "Hunter_Sentry": {
        title: "設陷者 (The Trap Setter)",
        thermoType: "溫控反應爐 (Controlled Reactor)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Sentry 負責觀察獸徑與規律，Hunter 負責收網。你在冒險前已經算好了所有退路，這是不對稱作戰的極致。",
        advantage: "【風險套利】擅長在極度危險的叢林中，找到那條唯一的生路。",
        blindspot: "決策內耗。大腦中「衝」與「縮」的聲音常打架，導致錯失瞬間的獵殺機會。"
    },

    // Helper (ORC) + Hunter (IRH)
    "Helper_Hunter": {
        title: "狩獵隊協調者 (The Hunt Coordinator)",
        thermoType: "實用主義者 (Pragmatist)",
        chemistry: "H+C (混合) / R+R (雙現證)",
        desc: "你有 Helper 的協作能力與 Hunter 的戰鬥力。在圍獵長毛象時，你是那個負責分配站位、發號施令並照顧傷員的隊長。",
        advantage: "【落地執行】能帶著小隊衝鋒陷陣，又能細心照顧隊員的後勤需求。",
        blindspot: "戰略短視。過度關注眼前的獵物數量，缺乏對季節變遷的宏觀視野。"
    },

    // Elder (OVC) + Hunter (IRH)
    "Elder_Hunter": {
        title: "部落族長 (The Clan Patriarch)",
        thermoType: "深沈熱能 (Deep Heat)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "外表是溫和的長者 (Elder)，內心是兇猛的獅子 (Hunter)。為了部落的生存，你用最平靜的語氣，下達最殘酷的命令。",
        advantage: "【權謀槓桿】擅長利用聯姻、結盟與威攝來達成目的，是部落政治的頂級玩家。",
        blindspot: "過於深沈。城府太深導致其他部落或內部成員難以完全信任你。"
    },

    // Pioneer (IVH) + Toolmaker (IRC)
    "Pioneer_Toolmaker": {
        title: "火種發明家 (The Fire Inventor)",
        thermoType: "原型機 (Prototype Engine)",
        chemistry: "H+C (混合) / I+I (雙個體)",
        desc: "Pioneer 想像火，Toolmaker 鑽木取火。你是那個不滿足於現狀，第一個把圓形石頭打磨成輪子的人。",
        advantage: "【硬核創新】你是少數能將「幻想」落實到「物理工具」的人，能做出改變部落命運的發明。",
        blindspot: "無視人性。過度專注於工具本身，忽略了族人是否懂得使用，容易做出過於複雜的工具。"
    },

    // Pioneer (IVH) + Sentry (IVC)
    "Pioneer_Sentry": {
        title: "領地標記員 (The Territory Marker)",
        thermoType: "藍圖繪製者 (Blueprint Maker)",
        chemistry: "H+C (混合) / V+V (雙內觀)",
        desc: "你的大腦是一張地圖。Pioneer 探索未知邊界，Sentry 設立界碑與禁忌。你構建的是部落的疆域與規則。",
        advantage: "【頂層設計】你設計的部落制度具有極強的邏輯自洽性與長遠生命力。",
        blindspot: "落地困難。地圖畫得很完美，但現實世界的地形充滿泥沼，容易陷入「眼高手低」。"
    },

    // Helper (ORC) + Pioneer (IVH)
    "Helper_Pioneer": {
        title: "拓荒嚮導 (The Path Clearer)",
        thermoType: "溫和推進器 (Gentle Thruster)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "你為了部落還未抵達的綠洲 (Pioneer) 而在前方披荊斬棘 (Helper)。你是最忠誠的開路者。",
        advantage: "【願景守護】當所有人都想回頭時，你會為了信念堅持砍出一條路，並照顧好掉隊的人。",
        blindspot: "缺乏主見。容易依附於更強勢的酋長，或為了「隊伍和諧」而犧牲行進速度。"
    },

    // Elder (OVC) + Pioneer (IVH)
    "Elder_Pioneer": {
        title: "神諭者 (The Oracle)",
        thermoType: "燈塔 (Lighthouse)",
        chemistry: "H+C (混合) / V+V (雙內觀)",
        desc: "你結合了對未來的預知 (Pioneer) 與對過去的記憶 (Elder)。你看待世界的角度是超越時間的。",
        advantage: "【跨時代洞察】能從星象與歷史中預測災難與機遇，做出的決策往往能保全部落血脈。",
        blindspot: "曲高和寡。你的預言太過深奧，初期很難被只想吃飽的族人理解。"
    },

    // Gatherer (ORH) + Toolmaker (IRC)
    "Gatherer_Toolmaker": {
        title: "結網者 (The Net Weaver)",
        thermoType: "用戶介面 (User Interface)",
        chemistry: "H+C (混合) / R+R (雙現證)",
        desc: "你懂得魚的習性 (Gatherer)，也懂得如何編織精巧的漁網 (Toolmaker)。你是技術與獵物之間的最佳介面。",
        advantage: "【PMF 專家】最容易做出「好用工具」的類型，做出的陷阱既精巧又真的能抓到獵物。",
        blindspot: "平庸化陷阱。為了迎合大眾口味而犧牲了工具的獨特性，或為了編織技巧而忽視魚群的變化。"
    },

    // Gatherer (ORH) + Sentry (IVC)
    "Gatherer_Sentry": {
        title: "聽風者 (The Wind Reader)",
        thermoType: "資訊過濾網 (Info Filter)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Gatherer 收集風中的氣味，Sentry 分析其中的危險。你掌握著叢林中的所有秘密。",
        advantage: "【資訊套利】總能比別人早一步發現獸潮的來襲或水源的位置。",
        blindspot: "分析癱瘓。風中的訊息量過大導致決策緩慢，聽太多反而不敢踏出洞穴。"
    },

    // Gatherer (ORH) + Helper (ORC)
    "Gatherer_Helper": {
        title: "洞穴守護者 (The Cave Keeper)",
        thermoType: "溫暖流動 (Warm Flow)",
        chemistry: "H+C (混合) / O+O (雙他人)",
        desc: "你是部落的管家。Gatherer 帶回外部物資，Helper 負責分配食物。你讓每個回到洞穴的人都感到溫暖。",
        advantage: "【體驗經濟】在維持部落內部和諧、物資分配與照顧老弱上擁有無敵的優勢。",
        blindspot: "討好型人格。難以拒絕外人的無理索求，導致部落儲糧被侵蝕。"
    },

    // Elder (OVC) + Gatherer (ORH)
    "Elder_Gatherer": {
        title: "結盟者 (The Alliance Maker)",
        thermoType: "人脈樞紐 (Network Hub)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Elder 懂人性的弱點，Gatherer 擅長交換禮物。你能在部落間的複雜關係中游刃有餘。",
        advantage: "【資源撮合】你不生產長矛，你生產「和平條約」。你是最強的外交官。",
        blindspot: "缺乏實業。如果沒有實體武力支撐，容易變成只會「說好話」而無實質產出的人。"
    },

    // Shaman (OVH) + Toolmaker (IRC)
    "Shaman_Toolmaker": {
        title: "圖騰雕刻師 (The Totem Carver)",
        thermoType: "魔導具 (Magic Tool)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "Shaman 賦予靈魂，Toolmaker 雕刻木頭。你擅長創造「有法力的器物」（如護身符）。",
        advantage: "【溢價製造機】能讓普通的木頭產生信仰價值，換取高額的物資。",
        blindspot: "過度沈溺細節。容易在微小的花紋上糾結太久，忽視了量產與實用性。"
    },

    // Sentry (IVC) + Shaman (OVH)
    "Sentry_Shaman": {
        title: "禁忌守護者 (The Taboo Keeper)",
        thermoType: "神聖契約 (Sacred Pact)",
        chemistry: "H+C (混合) / V+V (雙內觀)",
        desc: "Shaman 定義神聖，Sentry 執行律法。你是部落傳統與禁忌的捍衛者。",
        advantage: "【組織韌性】建立的部落具有極強的紀律性與凝聚力，不易被外族同化。",
        blindspot: "排外性。容易形成封閉的教條，將創新視為對神靈的褻瀆。"
    },

    // Helper (ORC) + Shaman (OVH)
    "Helper_Shaman": {
        title: "巫醫 (The Medicine Man)",
        thermoType: "溫柔光芒 (Gentle Light)",
        chemistry: "H+C (混合) / O+O (雙他人)",
        desc: "Shaman 感知病痛，Helper 採藥熬湯。你是部落中的療癒者，修補戰士的身心。",
        advantage: "【人才留存】族人對你有極深的情感依賴，大家是為了「被治癒」而留下。",
        blindspot: "慈母多敗兒。過度包容偷懶或犯錯的族人，導致部落戰力下降。"
    },

    // Elder (OVC) + Shaman (OVH)
    "Elder_Shaman": {
        title: "儀式主持者 (The Ritual Master)",
        thermoType: "精神圖騰 (Spiritual Totem)",
        chemistry: "H+C (混合) / 跨維度整合",
        desc: "你是智慧與靈性的結合體。你在部落中扮演的是「與祖靈溝通」的最高象徵。",
        advantage: "【至高權威】一個手勢就能定紛止爭，是族人在迷茫時的北極星。",
        blindspot: "脫離第一線。高居祭壇之上，容易被底下的族人蒙蔽真相。"
    },

    // ==========================================
    // Group 3: 雙冷控 (C+C) - 秩序與傳承
    // 功能：守護火種、分配糧食、記憶歷史。
    // ==========================================

    // Sentry (IVC) + Toolmaker (IRC)
    "Sentry_Toolmaker": {
        title: "巨石堆砌者 (The Stone Mason)",
        thermoType: "絕對零度 (Absolute Zero)",
        chemistry: "C+C (雙冷控) / I+I (雙個體)",
        desc: "Toolmaker 切割石頭，Sentry 設計結構。你建造的防禦工事與糧倉堅不可摧，但也毫無溫度。",
        advantage: "【零失誤】適合從事儲糧倉建設、武器庫管理等容錯率為零的任務。",
        blindspot: "熱寂 (Heat Death)。完全缺乏衝勁與冒險精神，如果沒有獵人帶回食物，堡壘裡的人會餓死。"
    },

    // Helper (ORC) + Toolmaker (IRC)
    "Helper_Toolmaker": {
        title: "選種人 (The Seed Sorter)",
        thermoType: "高效齒輪 (Efficient Gear)",
        chemistry: "C+C (雙冷控) / R+R (雙現證)",
        desc: "你既有分辨好壞的眼光 (Toolmaker) 又有耐心分類 (Helper)。你是確保明年有收成的關鍵人物。",
        advantage: "【交付品質】交給你的分類與整理任務，你能以極高的精確度完成。",
        blindspot: "缺乏野心。容易滿足於日復一日的篩選工作，缺乏開墾新田地的動力。"
    },

    // Elder (OVC) + Toolmaker (IRC)
    "Elder_Toolmaker": {
        title: "技藝傳承者 (The Craft Keeper)",
        thermoType: "時光膠囊 (Time Capsule)",
        chemistry: "C+C (雙冷控) / 跨維度整合",
        desc: "你有技術 (Toolmaker) 也有智慧 (Elder)。你掌握著那些古老且複雜的工藝（如製陶或解讀繩結）。",
        advantage: "【極致權威】在極其冷門的知識領域成為不可撼動的第一人，掌握著文明的火種。",
        blindspot: "與世隔絕。完全不屑於向年輕人解釋繩結的含義，導致知識失傳。"
    },

    // Helper (ORC) + Sentry (IVC)
    "Helper_Sentry": {
        title: "守火人 (The Fire Keeper)",
        thermoType: "護盾 (Shield)",
        chemistry: "C+C (雙冷控) / 跨維度整合",
        desc: "Sentry 警惕熄滅的風險，Helper 負責添柴。你是最令人安心的守夜者，確保長夜中火種不滅。",
        advantage: "【守成之王】當部落進入寒冬，你是最佳的守護者，杜絕任何不必要的浪費。",
        blindspot: "官僚主義。容易為了「省柴火」而限制大家取暖，把簡單的生存需求複雜化。"
    },

    // Elder (OVC) + Sentry (IVC)
    "Elder_Sentry": {
        title: "岩壁記事者 (The Cave Recorder)",
        thermoType: "靜止座標 (Static Coordinate)",
        chemistry: "C+C (雙冷控) / V+V (雙內觀)",
        desc: "你們活在岩壁與歷史之中。你們負責將部落的榮耀與教訓刻在石頭上，永垂不朽。",
        advantage: "【基業長青】確保部落的核心價值觀與傳說不會隨時間流失。",
        blindspot: "極度保守。拒絕任何新的繪畫風格或工具，成為部落創新的最大阻力。"
    },

    // Elder (OVC) + Helper (ORC)
    "Elder_Helper": {
        title: "度冬者 (The Winter Survivor)",
        thermoType: "恆溫箱 (Incubator)",
        chemistry: "C+C (雙冷控) / O+O (雙他人)",
        desc: "你們是部落中最溫暖的存在，默默守護著幼童與傷患度過漫長的冬天。",
        advantage: "【穩定的後盾】提供最穩定的支持系統，讓前線戰將無後顧之憂。",
        blindspot: "缺乏戰鬥力。在野獸入侵的時刻，過於溫和的你們會是第一批犧牲者。"
    }
};

export default {
    load() {
        return founderDualData
    }
}