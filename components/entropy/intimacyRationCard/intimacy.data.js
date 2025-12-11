// intimacy.data.js
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
            desc: "【鏡像效應】極致的快節奏。兩人都是油門，沒人踩煞車，容易過熱燒毀。",
            pros: "效率極高",
            cons: "缺乏緩衝"
        },
        pathB: {
            target: "Helper (助人者)",
            code: "O-R-C",
            relation: "前後方互補 (Front & Rear)",
            chemistry: "你在前線衝刺 (I+H)，他在後方守成 (O+C)。他能包容你的自我，你給予他保護。",
            manual: "【區域劃分】財務與行程全權交給 Helper；【翻譯】急躁時，先深呼吸再說話。"
        }
    },

    // 3. Gatherer (O-R-H)
    Gatherer: {
        protocol: "R (現證型)",
        code: "O-R-H",
        desc: "你關注「體驗」與「人際」。你需要一個能陪你享受物質世界，同時能拉住你的人。",
        pathA: {
            target: "Gatherer (採集者)",
            desc: "【派對效應】每天都精彩熱鬧，但財務與生活秩序容易陷入混亂。",
            pros: "樂趣無窮",
            cons: "失序風險"
        },
        pathB: {
            target: "Toolmaker (工匠)",
            code: "I-R-C",
            relation: "生活互補 (Life Partners)",
            chemistry: "你是明星 (O+H)，他是經紀人 (I+C)。你需要他的穩定邏輯；他需要你的熱情破冰。",
            manual: "【區域劃分】讓 Toolmaker 規劃儲蓄與 SOP；【翻譯】接受他的沈默是思考而非冷漠。"
        }
    },

    // 5. Toolmaker (I-R-C)
    Toolmaker: {
        protocol: "R (現證型)",
        code: "I-R-C",
        desc: "你關注「邏輯」與「結構」。你需要一個講求實際，但能帶給你溫度的人。",
        pathA: {
            target: "Toolmaker (工匠)",
            desc: "【機械效應】極度理性與高效，但生活可能缺乏情趣與變數 (死水效應)。",
            pros: "零摩擦",
            cons: "缺乏激情"
        },
        pathB: {
            target: "Gatherer (採集者)",
            code: "O-R-H",
            relation: "生活互補 (Life Partners)",
            chemistry: "你提供架構 (I+C)，他帶回精彩 (O+H)。他融化你的冰冷，你為他築起防波堤。",
            manual: "【區域劃分】週末行程全權放手給 Gatherer；【翻譯】將他的情緒視為「環境參數」來讀取。"
        }
    },

    // 7. Helper (O-R-C)
    Helper: {
        protocol: "R (現證型)",
        code: "O-R-C",
        desc: "你關注「關係」與「穩定」。你需要一個能給你安全感，且腳踏實地的人。",
        pathA: {
            target: "Helper (助人者)",
            desc: "【溫室效應】最溫暖舒適的窩，但兩人都缺乏攻擊性，遇外部危機時易無力招架。",
            pros: "高度和諧",
            cons: "防禦力弱"
        },
        pathB: {
            target: "Hunter (獵人)",
            code: "I-R-H",
            relation: "守護互補 (The Guardian Pair)",
            chemistry: "你提供溫暖的家 (O+C)，他帶回豐盛的獵物 (I+H)。只有你能安撫受傷的野獸。",
            manual: "【區域劃分】接受 Hunter 的冒險是為了家；【翻譯】當他獨斷時，溫柔提醒他回頭看你。"
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
            desc: "【超新星效應】兩個夢想家的結合，火花四射，但可能因為沒人顧家而導致生活崩塌。",
            pros: "靈魂共鳴",
            cons: "落地困難"
        },
        pathB: {
            target: "Elder (長老)",
            code: "O-V-C",
            relation: "導師互補 (Mentor & Protégé)",
            chemistry: "你負責開拓疆土 (I+H)，他負責治理國家 (O+C)。他欣賞你的突破，你依賴他的智慧。",
            manual: "【區域劃分】尊重 Elder 的風險警告；【翻譯】請 Elder 幫你把願景翻譯成人類語言。"
        }
    },

    // 4. Shaman (O-V-H)
    Shaman: {
        protocol: "V (內觀型)",
        code: "O-V-H",
        desc: "你關注「意義」與「靈魂」。你需要一個能與你在精神世界共鳴，但能拉住風箏線的人。",
        pathA: {
            target: "Shaman (薩滿)",
            desc: "【共振效應】靈魂伴侶的極致，但容易陷入集體情緒漩渦，缺乏現實錨點。",
            pros: "深度連結",
            cons: "脫離現實"
        },
        pathB: {
            target: "Sentry (哨兵)",
            code: "I-V-C",
            relation: "靈魂互補 (Soul Anchor)",
            chemistry: "你負責飛翔 (O+H)，他負責拉線 (I+C)。你提供靈性啟發，他提供邏輯架構。",
            manual: "【區域劃分】信任 Sentry 的邏輯判斷；【翻譯】當你情緒氾濫時，讓他幫你釐清因果。"
        }
    },

    // 6. Sentry (I-V-C)
    Sentry: {
        protocol: "V (內觀型)",
        code: "I-V-C",
        desc: "你關注「規律」與「系統」。你需要一個能理解長遠佈局，但能帶給你不一樣視角的人。",
        pathA: {
            target: "Sentry (哨兵)",
            desc: "【碉堡效應】最穩固的堡壘，但生活可能像修道院一樣枯燥，缺乏生命的色彩。",
            pros: "絕對安全",
            cons: "缺乏生氣"
        },
        pathB: {
            target: "Shaman (薩滿)",
            code: "O-V-H",
            relation: "錨點互補 (The Anchor)",
            chemistry: "你提供架構 (I+C)，他提供靈性 (O+H)。雙方在精神世界共舞，他是你唯一讀不懂的書。",
            manual: "【區域劃分】允許 Shaman 的直覺帶領探索；【翻譯】學習用感性語言表達你的關心。"
        }
    },

    // 8. Elder (O-V-C)
    Elder: {
        protocol: "V (內觀型)",
        code: "O-V-C",
        desc: "你關注「傳承」與「價值」。你需要一個能理解歷史深度，並幫你把智慧傳出去的人。",
        pathA: {
            target: "Elder (長老)",
            desc: "【圖書館效應】極度和諧與智慧的結合，但可能缺乏行動力，陷入空談。",
            pros: "深度理解",
            cons: "行動遲緩"
        },
        pathB: {
            target: "Pioneer (先驅)",
            code: "I-V-H",
            relation: "願景互補 (Visionary Pair)",
            chemistry: "你負責守護價值 (O+C)，他負責衝破邊界 (I+H)。你是他最堅強的後盾與軍師。",
            manual: "【區域劃分】支持 Pioneer 的冒險；【翻譯】在他受挫時，用你的智慧給予包容。"
        }
    }
};

export default {
    load() {
        return intimacyData
    }
}