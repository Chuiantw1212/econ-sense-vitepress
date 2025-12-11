const intimacyData = {
    // =============================================
    // R型陣營 (現證型)：通訊協定為 Reality (現實)
    // =============================================

    // 1. Hunter (I-R-H)
    Hunter: {
        protocol: "R (現證型)",
        code: "I-R-H",
        desc: "你關注「目標」與「狩獵」。你需要一個能聽懂現實語言、不談空泛哲學的隊友。",
        pathA: {
            target: "Hunter (獵人)",
            code: "I-R-H",
            relation: "戰友效應 (War Comrades)",
            chemistry: "背靠背作戰的夥伴。世界上只有他能秒懂你的野心與疲憊，無需言語解釋。",
            pros: "極致默契，執行力無人能及。",
            cons: "雙倍焦慮，缺乏煞車機制。",
            manual: [
                "【強制冷卻】約定每週末必須「強制關機」，禁止談論工作與目標。",
                "【互不干涉】你們都是王，請劃分各自的領土（戰場），避免權力鬥爭。"
            ]
        },
        pathB: {
            target: "Helper (助人者)",
            code: "O-R-C",
            relation: "前後方互補 (Front & Rear)",
            chemistry: "你在前線衝刺，他在後方守成。他提供你缺乏的細膩照顧，你給予他強大的保護。",
            pros: "攻守兼備，系統穩定性極高。",
            cons: "價值觀衝突，需磨合「任務 vs 關係」。",
            manual: [
                "【區域劃分】財務與行程全權交給 Helper，不要插手微管理。",
                "【翻譯機制】當你急躁時，請先深呼吸，將命令句轉為請求句。"
            ]
        }
    },

    // 3. Gatherer (O-R-H)
    Gatherer: {
        protocol: "R (現證型)",
        code: "O-R-H",
        desc: "你關注「體驗」與「人際」。你需要一個能陪你享受物質世界，同時能拉住你的人。",
        pathA: {
            target: "Gatherer (採集者)",
            code: "O-R-H",
            relation: "共樂效應 (The Party)",
            chemistry: "生活是永不落幕的派對。你們能一起探索世界的美好，情緒價值拉滿。",
            pros: "樂趣無窮，社交圈極大化。",
            cons: "邊界模糊，秩序容易陷入混亂。",
            manual: [
                "【共同帳戶】請聘請會計師或使用自動化記帳，避免兩人一起變成月光族。",
                "【獨處時間】約定每週一天的「閉關日」，阻斷所有社交訊號，讓多巴胺歸零。"
            ]
        },
        pathB: {
            target: "Toolmaker (工匠)",
            code: "I-R-C",
            relation: "生活互補 (Life Partners)",
            chemistry: "你是明星，他是經紀人。你需要他的穩定邏輯來落地；他需要你的熱情來破冰。",
            pros: "將混亂轉化為資產，生活井井有條。",
            cons: "情感溫差大，容易覺得對方冷漠。",
            manual: [
                "【區域劃分】讓 Toolmaker 規劃儲蓄與 SOP，你負責執行社交公關。",
                "【翻譯機制】接受他的沈默是「正在思考」，而不是冷漠或拒絕。"
            ]
        }
    },

    // 5. Toolmaker (I-R-C)
    Toolmaker: {
        protocol: "R (現證型)",
        code: "I-R-C",
        desc: "你關注「邏輯」與「結構」。你需要一個講求實際，但能帶給你溫度的人。",
        pathA: {
            target: "Toolmaker (工匠)",
            code: "I-R-C",
            relation: "精密運轉 (Precision Gears)",
            chemistry: "如同兩台精密儀器同步運作。家中井井有條，溝通效率極高，零情緒內耗。",
            pros: "零摩擦，極致的理性與秩序。",
            cons: "缺乏變數，生活容易陷入機械化。",
            manual: [
                "【注入亂數】每月安排一次「隨機旅行」或「未知體驗」，打破慣性。",
                "【情感儀式】約定每天必須有 10 分鐘的「非邏輯對話」，只談感覺不談解決方案。"
            ]
        },
        pathB: {
            target: "Gatherer (採集者)",
            code: "O-R-H",
            relation: "生活互補 (Life Partners)",
            chemistry: "你提供架構，他帶回精彩。他融化你的冰冷，你為他築起防波堤。",
            pros: "打破孤島，讓你的世界與人連結。",
            cons: "社交能量消耗大，需適應混亂感。",
            manual: [
                "【區域劃分】週末行程全權放手給 Gatherer，嘗試不按計畫走。",
                "【翻譯機制】將他的情緒視為「環境參數」來讀取，而非系統錯誤。"
            ]
        }
    },

    // 7. Helper (O-R-C)
    Helper: {
        protocol: "R (現證型)",
        code: "O-R-C",
        desc: "你關注「關係」與「穩定」。你需要一個能給你安全感，且腳踏實地的人。",
        pathA: {
            target: "Helper (助人者)",
            code: "O-R-C",
            relation: "歲月靜好 (Safe Haven)",
            chemistry: "最深層的理解與陪伴。你們共同營造了一個溫暖、安全且充滿愛的避風港。",
            pros: "高度安全感，幾乎沒有衝突。",
            cons: "圈子封閉，遇危機時缺乏防禦力。",
            manual: [
                "【共同冒險】一起設定一個「稍微有點可怕」的年度目標，練習突破舒適圈。",
                "【練習衝突】約定「不開心要直接說」，避免兩人都在忍耐而累積內傷。"
            ]
        },
        pathB: {
            target: "Hunter (獵人)",
            code: "I-R-H",
            relation: "守護互補 (The Guardian Pair)",
            chemistry: "你提供溫暖的家，他帶回豐盛的獵物。只有你能安撫受傷的野獸。",
            pros: "資源與安全感兼具，抗風險能力強。",
            cons: "常感被忽略，需忍受對方的獨斷。",
            manual: [
                "【區域劃分】接受 Hunter 的冒險是為了家，不要過度干涉他的戰場。",
                "【翻譯機制】當他獨斷獨行時，溫柔地提醒他：「我們需要你回頭看看。」"
            ]
        }
    },

    // =============================================
    // V型陣營 (內觀型)：通訊協定為 Vision (願景)
    // =============================================

    // 2. Pioneer (I-V-H)
    Pioneer: {
        protocol: "V (內觀型)",
        code: "I-V-H",
        desc: "你關注「未來」與「可能性」。你需要一個能聽懂瘋狂想法，不會叫你『面對現實』的人。",
        pathA: {
            target: "Pioneer (先驅)",
            code: "I-V-H",
            relation: "共振效應 (Supernova)",
            chemistry: "你們是彼此的燃料。在無人理解的創新之路上，只有他能看見你眼中的星辰大海。",
            pros: "靈魂共鳴，互相激發無限創意。",
            cons: "落地困難，容易因沒人顧家而崩塌。",
            manual: [
                "【聘請管家】請務必花錢請人打理家務與瑣事，不要讓柴米油鹽消磨你們的靈氣。",
                "【輪流落地】約定每季由一人負責「現實檢查 (Reality Check)」，審視財務狀況。"
            ]
        },
        pathB: {
            target: "Elder (長老)",
            code: "O-V-C",
            relation: "導師互補 (Mentor & Protégé)",
            chemistry: "你負責開拓疆土，他負責治理國家。他欣賞你的突破，你依賴他的智慧。",
            pros: "智慧與衝勁結合，決策質量極高。",
            cons: "節奏衝突，覺得對方太慢/太衝。",
            manual: [
                "【區域劃分】尊重 Elder 的風險警告，那是歷史的教訓。",
                "【翻譯機制】請 Elder 幫你把抽象的願景，翻譯成大眾聽得懂的人類語言。"
            ]
        }
    },

    // 4. Shaman (O-V-H)
    Shaman: {
        protocol: "V (內觀型)",
        code: "O-V-H",
        desc: "你關注「意義」與「靈魂」。你需要一個能與你在精神世界共鳴，但能拉住風箏線的人。",
        pathA: {
            target: "Shaman (薩滿)",
            code: "O-V-H",
            relation: "靈魂雙生 (Twin Flames)",
            chemistry: "無需言語的心電感應。你們能共同探索精神世界的深處，獲得極大的心靈滿足。",
            pros: "深度連結，情感價值極高。",
            cons: "情緒共振過強，容易集體憂鬱。",
            manual: [
                "【物理錨點】一起做家事、運動或種花，強迫肉體與現實世界連結。",
                "【情緒隔離】當一方陷入情緒黑洞時，另一方必須保持距離，避免「共業」沈淪。"
            ]
        },
        pathB: {
            target: "Sentry (哨兵)",
            code: "I-V-C",
            relation: "靈魂互補 (Soul Anchor)",
            chemistry: "你負責飛翔，他負責拉線。你提供靈性啟發，他提供邏輯架構。",
            pros: "精神世界有秩序，靈性得以落地。",
            cons: "邏輯與感受衝突，覺得對方冷血。",
            manual: [
                "【區域劃分】信任 Sentry 的邏輯判斷，那是保護你的圍牆。",
                "【翻譯機制】當你情緒氾濫時，讓他幫你釐清因果關係，不要抗拒邏輯。"
            ]
        }
    },

    // 6. Sentry (I-V-C)
    Sentry: {
        protocol: "V (內觀型)",
        code: "I-V-C",
        desc: "你關注「規律」與「系統」。你需要一個能理解長遠佈局，但能帶給你不一樣視角的人。",
        pathA: {
            target: "Sentry (哨兵)",
            code: "I-V-C",
            relation: "智庫效應 (Think Tank)",
            chemistry: "高質量的知識對話。你們享受在安靜中各自閱讀、思考，並能深度交流。",
            pros: "心智安穩，生活極度規律且安全。",
            cons: "缺乏生氣，容易陷入過度悲觀。",
            manual: [
                "【拒絕避險】約定每年必須有一筆「浪費預算」，去做一件無意義但開心的事。",
                "【停止共振】當一人陷入災難化思考時，另一人必須強制喊停，禁止互相嚇唬。"
            ]
        },
        pathB: {
            target: "Shaman (薩滿)",
            code: "O-V-H",
            relation: "錨點互補 (The Anchor)",
            chemistry: "你提供架構，他提供靈性。雙方在精神世界共舞，他是你唯一讀不懂的書。",
            pros: "生命色彩豐富，學會用直覺感知。",
            cons: "秩序被擾亂，需消耗能量處理情緒。",
            manual: [
                "【區域劃分】允許 Shaman 的直覺帶領探索，偶爾關掉邏輯。",
                "【翻譯機制】學習用感性語言（我感覺...）而非邏輯語言（我認為...）表達關心。"
            ]
        }
    },

    // 8. Elder (O-V-C)
    Elder: {
        protocol: "V (內觀型)",
        code: "O-V-C",
        desc: "你關注「傳承」與「價值」。你需要一個能理解歷史深度，並幫你把智慧傳出去的人。",
        pathA: {
            target: "Elder (長老)",
            code: "O-V-C",
            relation: "時光效應 (Timeless)",
            chemistry: "如同兩棵老樹並肩而立。你們擁有共同的價值觀與歷史感，歲月靜好。",
            pros: "深度理解，極致的包容與平靜。",
            cons: "行動遲緩，容易與時代脫節。",
            manual: [
                "【設定期限】對於生活決策（如裝修、旅行），設定強制執行的 Deadline，避免議而不決。",
                "【接觸新芽】一起去學習一項年輕人的技能或科技，避免世界封閉。"
            ]
        },
        pathB: {
            target: "Pioneer (先驅)",
            code: "I-V-H",
            relation: "願景互補 (Visionary Pair)",
            chemistry: "你負責守護價值，他負責衝破邊界。你是他最堅強的後盾與軍師。",
            pros: "讓智慧產生影響力，參與未來創造。",
            cons: "需承受對方帶來的冒險風險。",
            manual: [
                "【區域劃分】全力支持 Pioneer 的冒險，那是生命的活力來源。",
                "【翻譯機制】在他受挫時，用你的智慧給予包容，而非說教。"
            ]
        }
    }
};

export default {
    load() {
        return intimacyData
    }
}