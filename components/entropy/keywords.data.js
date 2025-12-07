const keywords = {
    "meta": {
        "model": "Neuro-Archetypes v4.0 (IRH Code System)",
        "version": "4.0",
        "total_keywords": 64,
        "axis_logic": {
            "x": "Drive ( I:Individual/Competition > 0 | O:Others/Connection < 0 )",
            "y": "Entropy ( H:Hot/Chaos > 0 | C:Cold/Order < 0 )",
            "z": "Topology ( R:Real/Sensory > 0 | V:Virtual/Prediction < 0 )"
        }
    },
    "keywords": [

        // ==================================================
        // Group I: Individual (Competition/Testosterone) X > 0
        // ==================================================

        // 1. 獵人 Hunter (IRH) - I+R+H
        // 特徵：個體 + 實感 + 熱系統 (瞬間反應、追求快感)
        { "id": 1, "keyword_zh": "野心", "keyword_en": "Ambition", "archetype": "Hunter", "vector": { "x": 0.95, "y": 0.80, "z": 0.80 } },
        { "id": 2, "keyword_zh": "勝利", "keyword_en": "Win", "archetype": "Hunter", "vector": { "x": 1.00, "y": 0.40, "z": 0.40 } },
        { "id": 3, "keyword_zh": "刺激", "keyword_en": "Thrills", "archetype": "Hunter", "vector": { "x": 0.50, "y": 0.95, "z": 0.70 } },
        { "id": 4, "keyword_zh": "本能", "keyword_en": "Instinct", "archetype": "Hunter", "vector": { "x": 0.50, "y": 0.60, "z": 0.95 } },
        { "id": 5, "keyword_zh": "挑戰", "keyword_en": "Challenge", "archetype": "Hunter", "vector": { "x": 0.60, "y": 0.60, "z": 0.60 } },
        { "id": 6, "keyword_zh": "征服", "keyword_en": "Conquer", "archetype": "Hunter", "vector": { "x": 0.90, "y": 0.85, "z": 0.30 } },
        { "id": 7, "keyword_zh": "速度", "keyword_en": "Speed", "archetype": "Hunter", "vector": { "x": 0.70, "y": 0.90, "z": 0.90 } },
        { "id": 8, "keyword_zh": "行動", "keyword_en": "Action", "archetype": "Hunter", "vector": { "x": 0.90, "y": 0.30, "z": 0.90 } },

        // 2. 先驅 Pioneer (IVH) - I+V+H  (原:尋路人/策士)
        // 特徵：個體 + 虛擬/願景 + 熱系統 (創新、顛覆、未來)
        { "id": 9, "keyword_zh": "變革", "keyword_en": "Reform", "archetype": "Pioneer", "vector": { "x": 0.90, "y": 0.90, "z": -0.90 } },
        { "id": 10, "keyword_zh": "謀略", "keyword_en": "Tactics", "archetype": "Pioneer", "vector": { "x": 0.95, "y": 0.50, "z": -0.40 } },
        { "id": 11, "keyword_zh": "創新", "keyword_en": "Innovation", "archetype": "Pioneer", "vector": { "x": 0.50, "y": 0.95, "z": -0.50 } },
        { "id": 12, "keyword_zh": "預判", "keyword_en": "Forecast", "archetype": "Pioneer", "vector": { "x": 0.50, "y": 0.40, "z": -0.95 } },
        { "id": 13, "keyword_zh": "趨勢", "keyword_en": "Trends", "archetype": "Pioneer", "vector": { "x": 0.60, "y": 0.60, "z": -0.60 } },
        { "id": 14, "keyword_zh": "顛覆", "keyword_en": "Disrupt", "archetype": "Pioneer", "vector": { "x": 0.90, "y": 0.90, "z": -0.20 } },
        { "id": 15, "keyword_zh": "願景", "keyword_en": "Vision", "archetype": "Pioneer", "vector": { "x": 0.30, "y": 0.90, "z": -0.90 } },
        { "id": 16, "keyword_zh": "開拓", "keyword_en": "Explore", "archetype": "Pioneer", "vector": { "x": 0.85, "y": 0.80, "z": -0.70 } },

        // 5. 工匠 Toolmaker (IRC) - I+R+C
        // 特徵：個體 + 實感 + 冷系統 (精準、技術、控制)
        { "id": 17, "keyword_zh": "精準", "keyword_en": "Precision", "archetype": "Toolmaker", "vector": { "x": 0.90, "y": -0.90, "z": 0.90 } },
        { "id": 18, "keyword_zh": "實力", "keyword_en": "Competence", "archetype": "Toolmaker", "vector": { "x": 0.95, "y": -0.40, "z": 0.40 } },
        { "id": 19, "keyword_zh": "控制", "keyword_en": "Control", "archetype": "Toolmaker", "vector": { "x": 0.50, "y": -0.95, "z": 0.50 } },
        { "id": 20, "keyword_zh": "細節", "keyword_en": "Details", "archetype": "Toolmaker", "vector": { "x": 0.40, "y": -0.40, "z": 0.95 } },
        { "id": 21, "keyword_zh": "技術", "keyword_en": "Skill", "archetype": "Toolmaker", "vector": { "x": 0.60, "y": -0.60, "z": 0.60 } },
        { "id": 22, "keyword_zh": "效率", "keyword_en": "Efficiency", "archetype": "Toolmaker", "vector": { "x": 0.90, "y": -0.90, "z": 0.20 } },
        { "id": 23, "keyword_zh": "專注", "keyword_en": "Focus", "archetype": "Toolmaker", "vector": { "x": 0.30, "y": -0.90, "z": 0.90 } },
        { "id": 24, "keyword_zh": "執行", "keyword_en": "Execute", "archetype": "Toolmaker", "vector": { "x": 0.90, "y": -0.20, "z": 0.90 } },

        // 6. 哨兵 Sentry (IVC) - I+V+C
        // 特徵：個體 + 虛擬/規則 + 冷系統 (權威、紀律、防禦)
        { "id": 25, "keyword_zh": "權威", "keyword_en": "Authority", "archetype": "Sentry", "vector": { "x": 0.90, "y": -0.90, "z": -0.90 } },
        { "id": 26, "keyword_zh": "責任", "keyword_en": "Duty", "archetype": "Sentry", "vector": { "x": 0.95, "y": -0.50, "z": -0.40 } },
        { "id": 27, "keyword_zh": "紀律", "keyword_en": "Discipline", "archetype": "Sentry", "vector": { "x": 0.50, "y": -0.95, "z": -0.50 } },
        { "id": 28, "keyword_zh": "原則", "keyword_en": "Principle", "archetype": "Sentry", "vector": { "x": 0.50, "y": -0.40, "z": -0.95 } },
        { "id": 29, "keyword_zh": "規則", "keyword_en": "Rules", "archetype": "Sentry", "vector": { "x": 0.60, "y": -0.60, "z": -0.60 } },
        { "id": 30, "keyword_zh": "結構", "keyword_en": "Structure", "archetype": "Sentry", "vector": { "x": 0.90, "y": -0.90, "z": -0.20 } },
        { "id": 31, "keyword_zh": "防禦", "keyword_en": "Defend", "archetype": "Sentry", "vector": { "x": 0.30, "y": -0.90, "z": -0.90 } },
        { "id": 32, "keyword_zh": "管理", "keyword_en": "Manage", "archetype": "Sentry", "vector": { "x": 0.90, "y": -0.20, "z": -0.90 } },


        // ==================================================
        // Group O: Others (Connection/Oxytocin) X < 0
        // ==================================================

        // 3. 採集者 Gatherer (ORH) - O+R+H
        // 特徵：群體 + 實感 + 熱系統 (體驗、新鮮、熱鬧)
        // *修正註記：原本的採集者比較偏向穩定(L)，但代碼 ORH 暗示他是High Entropy的「體驗收集者」*
        { "id": 33, "keyword_zh": "體驗", "keyword_en": "Experience", "archetype": "Gatherer", "vector": { "x": -0.80, "y": 0.90, "z": 0.90 } },
        { "id": 34, "keyword_zh": "樂趣", "keyword_en": "Fun", "archetype": "Gatherer", "vector": { "x": -0.90, "y": 0.80, "z": 0.60 } },
        { "id": 35, "keyword_zh": "自由", "keyword_en": "Freedom", "archetype": "Gatherer", "vector": { "x": -0.50, "y": 1.00, "z": 0.50 } },
        { "id": 36, "keyword_zh": "探索", "keyword_en": "Explore", "archetype": "Gatherer", "vector": { "x": -0.40, "y": 0.70, "z": 0.95 } },
        { "id": 37, "keyword_zh": "豐富", "keyword_en": "Richness", "archetype": "Gatherer", "vector": { "x": -0.60, "y": 0.60, "z": 0.60 } },
        { "id": 38, "keyword_zh": "驚喜", "keyword_en": "Surprise", "archetype": "Gatherer", "vector": { "x": -0.70, "y": 0.90, "z": 0.80 } },
        { "id": 39, "keyword_zh": "氛圍", "keyword_en": "Vibe", "archetype": "Gatherer", "vector": { "x": -0.80, "y": 0.90, "z": 0.90 } },
        { "id": 40, "keyword_zh": "分享", "keyword_en": "Share", "archetype": "Gatherer", "vector": { "x": -1.00, "y": 0.50, "z": 0.70 } },

        // 4. 薩滿 Shaman (OVH) - O+V+H
        // 特徵：群體 + 虛擬/願景 + 熱系統 (靈性、意義、共鳴)
        // *修正註記：代碼 OVH 代表他是用「內在視覺(V)」來進行高熵連結的*
        { "id": 41, "keyword_zh": "理想", "keyword_en": "Ideal", "archetype": "Shaman", "vector": { "x": -0.90, "y": 0.90, "z": -0.90 } },
        { "id": 42, "keyword_zh": "共鳴", "keyword_en": "Resonance", "archetype": "Shaman", "vector": { "x": -1.00, "y": 0.50, "z": -0.50 } },
        { "id": 43, "keyword_zh": "夢想", "keyword_en": "Dream", "archetype": "Shaman", "vector": { "x": -0.50, "y": 1.00, "z": -0.50 } },
        {
            "id": 44, "keyword_zh": "意義", "keyword_en": "Meaning",
            "archetype": "Shaman",
            "vector": { "x": -0.50, "y": 0.50, "z": -1.00 }
        },
        { "id": 45, "keyword_zh": "故事", "keyword_en": "Story", "archetype": "Shaman", "vector": { "x": -0.60, "y": 0.60, "z": -0.60 } },
        { "id": 46, "keyword_zh": "靈性", "keyword_en": "Spirit", "archetype": "Shaman", "vector": { "x": -0.80, "y": 0.90, "z": -0.70 } },
        { "id": 47, "keyword_zh": "信念", "keyword_en": "Belief", "archetype": "Shaman", "vector": { "x": -0.30, "y": 0.90, "z": -0.90 } },
        { "id": 48, "keyword_zh": "啟發", "keyword_en": "Inspire", "archetype": "Shaman", "vector": { "x": -0.90, "y": 0.80, "z": -0.60 } },

        // 7. 助人者 Helper (ORC) - O+R+C
        // 特徵：群體 + 實感 + 冷系統 (照顧、務實、溫暖)
        { "id": 49, "keyword_zh": "照顧", "keyword_en": "Care", "archetype": "Helper", "vector": { "x": -0.90, "y": -0.90, "z": 0.90 } },
        { "id": 50, "keyword_zh": "支援", "keyword_en": "Support", "archetype": "Helper", "vector": { "x": -1.00, "y": -0.50, "z": 0.50 } },
        { "id": 51, "keyword_zh": "安定", "keyword_en": "Stable", "archetype": "Helper", "vector": { "x": -0.50, "y": -1.00, "z": 0.50 } },
        { "id": 52, "keyword_zh": "體貼", "keyword_en": "Considerate", "archetype": "Helper", "vector": { "x": -0.50, "y": -0.50, "z": 1.00 } },
        { "id": 53, "keyword_zh": "溫暖", "keyword_en": "Warmth", "archetype": "Helper", "vector": { "x": -0.60, "y": -0.60, "z": 0.60 } },
        { "id": 54, "keyword_zh": "舒適", "keyword_en": "Comfort", "archetype": "Helper", "vector": { "x": -0.90, "y": -0.90, "z": 0.20 } },
        { "id": 55, "keyword_zh": "細心", "keyword_en": "Attentive", "archetype": "Helper", "vector": { "x": -0.30, "y": -0.90, "z": 0.90 } },
        { "id": 56, "keyword_zh": "陪伴", "keyword_en": "Company", "archetype": "Helper", "vector": { "x": -0.90, "y": -0.20, "z": 0.90 } },

        // 8. 長老 Elder (OVC) - O+V+C
        // 特徵：群體 + 虛擬/預測 + 冷系統 (傳承、智慧、歷史)
        { "id": 57, "keyword_zh": "傳承", "keyword_en": "Legacy", "archetype": "Elder", "vector": { "x": -0.90, "y": -0.90, "z": -0.90 } },
        { "id": 58, "keyword_zh": "包容", "keyword_en": "Embrace", "archetype": "Elder", "vector": { "x": -1.00, "y": -0.50, "z": -0.50 } },
        { "id": 59, "keyword_zh": "沈穩", "keyword_en": "Calm", "archetype": "Elder", "vector": { "x": -0.50, "y": -1.00, "z": -0.50 } },
        { "id": 60, "keyword_zh": "歷史", "keyword_en": "History", "archetype": "Elder", "vector": { "x": -0.50, "y": -0.50, "z": -1.00 } },
        { "id": 61, "keyword_zh": "智慧", "keyword_en": "Wisdom", "archetype": "Elder", "vector": { "x": -0.60, "y": -0.60, "z": -0.60 } },
        { "id": 62, "keyword_zh": "根基", "keyword_en": "Roots", "archetype": "Elder", "vector": { "x": -0.90, "y": -0.90, "z": -0.20 } },
        { "id": 63, "keyword_zh": "恆久", "keyword_en": "Endurance", "archetype": "Elder", "vector": { "x": -0.30, "y": -0.90, "z": -0.90 } },
        { "id": 64, "keyword_zh": "信任", "keyword_en": "Trust", "archetype": "Elder", "vector": { "x": -0.90, "y": -0.20, "z": -0.90 } }
    ]
}

export default {
    load() {
        return keywords
    }
}