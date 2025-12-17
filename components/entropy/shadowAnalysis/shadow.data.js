const data = {
    // 1. Hunter (IRH)
    Hunter: {
        shadowName: "衝動控制失調 (Impulse Dysregulation)",
        acute: "【外化攻擊】當獎勵預期落空，前額葉抑制功能失效，傾向訴諸語言或肢體衝突，展現典型的「挫折-攻擊」模式。",
        chronic: "【刺激成癮】為了維持多巴胺水平，可能沉溺於高風險投機、極限運動或物質濫用，生活變成一場失控的賭局。",
        antidote: "【行為活化】進行高強度的體能消耗（如拳擊、重訓），代謝過剩的皮質醇，而非尋找更多競爭對手。"
    },

    // 2. Pioneer (IVH)
    Pioneer: {
        shadowName: "宏大自戀解離 (Grandiose Dissociation)",
        acute: "【躁狂思維】思維奔逸 (Flight of ideas)，高估自身能力，大腦DMN網路過度活躍，做出脫離現實風險的決策。",
        chronic: "【病態自戀】否認現實回饋，將失敗歸咎於環境，陷入「懷才不遇」的認知扭曲，拒絕累積具體成果。",
        antidote: "【接地練習】停止發想。強制執行一件極度具體、重複性高的小事（如手沖咖啡、整理數據），強迫大腦連結物理現實。"
    },

    // 3. Gatherer (ORH)
    Gatherer: {
        shadowName: "情感調節障礙 (Affective Dysregulation)",
        acute: "【表演型行為】杏仁核對社交信號過度反應，透過戲劇化的情緒表達來索求關注，無法忍受焦慮。",
        chronic: "【焦慮依附】極度恐懼被群體拋棄，導致界線模糊的社交成癮 (FOMO)，喪失獨處能力。",
        antidote: "【正念獨處】關閉通訊軟體。練習與「無聊」共處，觀察自己的情緒起伏而不隨之行動 (Urge Surfing)。"
    },

    // 4. Shaman (OVH)
    Shaman: {
        shadowName: "病理性解離 (Pathological Dissociation)",
        acute: "【現實感喪失】自我邊界 (Ego Boundaries) 溶解，分不清內在與外在的資訊，易被環境負能量淹沒而恐慌。",
        chronic: "【靈性逃避】Spiritual Bypassing。用過度抽象的信念來防禦現實痛苦，導致生活自理功能退化。",
        antidote: "【物理結界】建立具體的物理界線（如鎖門、負重毯）。透過食用根莖類食物或園藝，強化身體感知。"
    },

    // 5. Toolmaker (IRC)
    Toolmaker: {
        shadowName: "強迫性僵化 (Obsessive Rigidity)",
        acute: "【分析癱瘓】錯誤監控系統過度活躍，陷入細節的無限迴圈，對任何干擾展現出冰冷的敵意。",
        chronic: "【述情障礙】Alexithymia。情感麻木，將人視為「故障的工具」，透過強迫性工作來逃避內在空虛。",
        antidote: "【容錯練習】刻意設定「80分」的完成標準。接觸大自然這種「不完美但和諧」的有機系統，療癒線性思維。"
    },

    // 6. Sentry (IVC)
    Sentry: {
        shadowName: "偏執控制 (Paranoid Control)",
        acute: "【獨裁防禦】威脅偵測系統閾值過低。面臨壓力時，變本加厲地制定規則，進行微觀管理 (Micromanagement)。",
        chronic: "【敵意歸因】認定環境充滿惡意，築起防禦高牆，拒絕任何新資訊，死守已經失效的舊典範。",
        antidote: "【信任授權】練習將控制權交出去。允許他人犯錯，並觀察「失控」其實不會導致毀滅。"
    },

    // 7. Helper (ORC)
    Helper: {
        shadowName: "病態利他 (Pathological Altruism)",
        acute: "【殉道者情結】共情疲勞 (Compassion Fatigue)。崩潰時透過強調自己的犧牲，勒索他人的內疚感。",
        chronic: "【被動攻擊】表面順從但內心積壓怨恨，常轉化為不明原因的慢性疼痛或疲勞，用生病換取休息。",
        antidote: "【自我邊界】練習說「不」。每天做一件「只為自己開心」且「對他人無用」的事，重建自我價值。"
    },

    // 8. Elder (OVC)
    Elder: {
        shadowName: "認知停滯 (Cognitive Stagnation)",
        acute: "【教條主義】認知彈性下降。面對新觀念衝擊時，採取道德高地的姿態進行批判，拒絕溝通。",
        chronic: "【習得性無助】對改變感到絕望，切斷與新事物的連結，陷入憤世嫉俗 (Cynicism) 的封閉狀態。",
        antidote: "【初學者心態】強迫自己學習一項全新技能（如新語言、新軟體），重新活化神經可塑性。"
    }
};
export default {
    load() {
        return data
    }
}