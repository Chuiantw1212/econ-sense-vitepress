const wealthInvestmentData = {
    // Hunter: 靠波動賺錢
    Hunter: {
        edge: "對風險與波動的極致敏感度",
        style: "狙擊手 (Sniper)",
        targets: ["加密貨幣合約", "波動率指數 (VIX)", "轉機股", "外匯保證金"],
        strategy: "【槓鈴策略】你的優勢是「抓轉折」。不要做定期定額這種無聊的事。90% 資金放定存（保命），10% 資金做高倍數槓桿博弈（爆擊）。",
        fatalRisk: "過度交易 (Over-trading)：為了尋求刺激而頻繁進出，把獲利都交給了手續費。"
    },

    // Pioneer: 靠趨勢賺錢
    Pioneer: {
        edge: "對未來趨勢的直覺洞察",
        style: "天使投資人 (Angel Investor)",
        targets: ["早期新創股權", "AI/Web3 科技股", "長期選擇權 (LEAPS)", "募資專案"],
        strategy: "【賽道押注】你適合投資「還沒被大眾認可」的未來。尋找那些具有指數級成長潛力的賽道，做早期的佈局者。",
        fatalRisk: "看錯週期：倒在黎明前。趨勢是對的，但你進場太早，資金在市場爆發前就燒光了。"
    },

    // Gatherer: 靠資訊流賺錢
    Gatherer: {
        edge: "對市場情緒與人流的感知",
        style: "趨勢跟隨者 (Trend Follower)",
        targets: ["熱門動能股", "精華區房地產", "限量球鞋/名錶", "迷因幣 (Meme Coins)"],
        strategy: "【衝浪策略】你不需要懂財報，你只需要懂「人」。跟隨市場熱度進場，在人聲鼎沸時離場。利用你的社交網絡獲取第一手消息。",
        fatalRisk: "最後一棒：因為貪戀派對的氛圍，在泡沫破裂前夕還在加碼。"
    },

    // Shaman: 靠信念賺錢
    Shaman: {
        edge: "對集體共識的號召力",
        style: "價值投資 (Value / Impact)",
        targets: ["ESG 永續基金", "B 型企業", "文化藝術品", "品牌創始股"],
        strategy: "【信仰持倉】投資那些「你希望它贏」的企業。如果這間公司的價值觀與你不合，你賺了錢也會痛苦。長期持有你相信的未來。",
        fatalRisk: "情感偏誤：愛上你的投資標的，即使基本面已經爛掉，還在為它找理由。"
    },

    // Toolmaker: 靠邏輯賺錢
    Toolmaker: {
        edge: "對數字與系統的解析力",
        style: "量化交易 (Quant)",
        targets: ["程式交易策略", "ETF 輪動", "期現套利", "網格交易"],
        strategy: "【機械化操作】消除人為情感。建立一套有回測依據的進出場 SOP，然後像機器人一樣執行。你的利潤來自於紀律。",
        fatalRisk: "黑天鵝：過度依賴歷史數據回測，當市場發生前所未見的變動時，模型可能會瞬間失效。"
    },

    // Sentry: 靠週期賺錢
    Sentry: {
        edge: "對風險結構的掌控力",
        style: "資產配置 (Asset Allocator)",
        targets: ["全市場 ETF (VT)", "美國公債", "黃金", "防禦型類股"],
        strategy: "【全天候配置】你不需要預測市場，你需要的是「準備好」。建立一個無論景氣好壞都能穩定增長的股債組合 (如 Risk Parity)。",
        fatalRisk: "現金拖累：為了過度避險而持有過多現金，導致長期績效跑輸大盤。"
    },

    // Helper: 靠時間賺錢
    Helper: {
        edge: "對穩定與安全的堅持",
        style: "存股族 (Dividend Growth)",
        targets: ["高股息 ETF", "金融股", "公用事業", "儲蓄險"],
        strategy: "【現金流堆疊】專注於「配息」。看著戶頭定期有錢進來，會給你巨大的安全感，讓你能拿得住資產，享受複利效應。",
        fatalRisk: "賺了息賠了價：為了追求高配息，買入產業衰退的公司。"
    },

    // Elder: 靠眼光賺錢
    Elder: {
        edge: "穿越週期的歷史視角",
        style: "長期持有 (Buy & Hold)",
        targets: ["波克夏型控股公司", "土地", "古董", "指數型基金"],
        strategy: "【慢富哲學】做時間的朋友。你不在此刻與人爭利，你佈局的是十年後的收成。適合流動性低但增值潛力高的資產。",
        fatalRisk: "流動性鎖死：急需用錢時，發現手上的古董或土地賣不掉。"
    }
};

export default {
    load() {
        return wealthInvestmentData
    }
}