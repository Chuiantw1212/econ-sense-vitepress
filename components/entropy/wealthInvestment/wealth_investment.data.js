const wealthInvestmentData = {
    // Hunter (IRH): 高度個體化、實證導向、高熵熱動
    // 修正點：強調「隧道視野」帶來的短期爆發力與對長期規劃的生理性排斥
    Hunter: {
        edge: "對價格動能與盤面情緒的極致反應速度 (Tunnel Vision)",
        style: "動能交易者 (Momentum Trader)",
        targets: ["高頻交易 (HFT)", "當沖/隔日沖", "期貨/選擇權末日輪", "波動率套利"],
        strategy: "【狙擊策略】利用 I 型的掌控欲與 R 型的實證主義，專注於「當下」的價格行為 (Price Action)。不預測未來，只交易看到的訊號。嚴格執行停損是生存唯一法則。",
        fatalRisk: "多巴胺成癮 (Dopamine Addiction)：將交易視為獲取神經化學獎勵的手段，導致在無行情的震盪盤中「過度交易」或「報復性交易」直到爆倉。"
    },

    // Pioneer (IVH): 高度個體化、內觀導向、高熵熱動
    // 修正點：將焦點從「趨勢」轉向「非共識的未來」，V 型人活在未來
    Pioneer: {
        edge: "對「反直覺」未來的想像力與構建力 (Simulation)",
        style: "風險資本家 (Venture Capital Style)",
        targets: ["早期種子輪", "破壞性科技 (AI/Biotech)", "槓桿型長線選擇權", "加密貨幣一級市場"],
        strategy: "【冪次法則】承認 90% 的投資可能會歸零，但依靠剩下 10% 的百倍回報 (100x) 覆蓋成本。必須學會「分散押注」在不同的高風險賽道，而非單吊一支。",
        fatalRisk: "幻覺確信 (Hallucination)：V 型大腦容易將內部的模擬誤認為外部現實，導致在市場已經證偽該技術時，仍堅持「眾人皆醉我獨醒」而死抱歸零。"
    },

    // Gatherer (ORH): 他者導向、實證導向、高熵熱動
    // 修正點：強調 O 型的「廣角視野」與對「人」的敏感度，而非單純的資訊流
    Gatherer: {
        edge: "對「社群共識」與「FOMO 情緒」的敏銳感知 (Peripheral Vision)",
        style: "敘事衝浪者 (Narrative Surfer)",
        targets: ["Meme Coins (迷因幣)", "熱門消費股", "跟單交易 (Copy Trading)", "奢侈品/潮物"],
        strategy: "【社交動能】你的獲利來源是「群眾的瘋狂」。利用廣角視野掃描哪裡人多、哪裡熱鬧。在社群討論度（Hype）上升期介入，在討論度轉向時（而非價格崩跌時）果斷離場。",
        fatalRisk: "人際雜訊 (Social Noise)：O 型人難以抗拒群體壓力，容易在泡沫破裂前夕，因為「不想被社群拋棄」或聽信「帶單老師」而成為最後一隻老鼠。"
    },

    // Shaman (OVH): 他者導向、內觀導向、高熵熱動
    // 修正點：強調 V 型的「意義構建」與 O 型的「感召力」，他們投資的是「信仰」
    Shaman: {
        edge: "對品牌價值與集體潛意識的洞察 (Meaning Making)",
        style: "影響力投資 (Impact/Cult Investing)",
        targets: ["具有強大社群文化的品牌 (如 Tesla, Apple 早期)", "DAO (去中心化組織)", "藝術品/NFT", "宗教性資產"],
        strategy: "【圖騰經濟】尋找那些能讓用戶產生「宗教般狂熱」的標的。你不看財報，你看的是「教主」的魅力與「信徒」的忠誠度。當信仰還在，泡沫就不會破。",
        fatalRisk: "情感綁架 (Emotional Attachment)：將投資標的視為自我認同的一部分（O+V），無法客觀面對基本面的惡化，將「停損」視為「背叛信仰」。"
    },

    // Toolmaker (IRC): 高度個體化、實證導向、低熵冷控
    // 修正點：強調 C 型對「確定性」的渴望與 R 型對「數據」的依賴
    Toolmaker: {
        edge: "對規則、邊界與微觀結構的解析力 (Optimization)",
        style: "套利與量化 (Arbitrageur Quant)",
        targets: ["期現套利", "DeFi 流動性挖礦", "可轉債套利", "統計套利策略"],
        strategy: "【無風險套利】利用 IRC 大腦的精密運算，尋找市場定價錯誤的瞬間。不賭方向，只賺取「數學上必然」的利潤。重視交易系統的穩健性 (Robustness)。",
        fatalRisk: "黑箱依賴 (Black Box Bias)：過度相信回測數據與模型，忽略了極端行情下的流動性枯竭（R 型依賴過往數據的盲點），導致「撿了芝麻，丟了西瓜」。"
    },

    // Sentry (IVC): 高度個體化、內觀導向、低熵冷控
    // 修正點：強調 V 型的「系統架構」與 C 型的「風險防禦」
    Sentry: {
        edge: "對宏觀週期與系統性風險的架構能力 (System Architecture)",
        style: "宏觀配置者 (Macro Allocator)",
        targets: ["全天候資產組合 (Risk Parity)", "主權債券", "避險基金 (Global Macro)", "防禦性指數"],
        strategy: "【防禦性護城河】利用 V 型大腦構建跨越牛熊的資產模型。你的目標不是擊敗大盤，而是「永不爆倉」。透過資產之間的負相關性來對沖風險。",
        fatalRisk: "悲觀偏誤 (Pessimism Bias)：C+V 型大腦容易在大腦中模擬出災難場景，導致長期持有過多現金或過度避險，錯失資產增長的黃金週期。"
    },

    // Helper (ORC): 他者導向、實證導向、低熵冷控
    // 修正點：強調 O 型的「維護」與 R 型的「具體反饋」
    Helper: {
        edge: "對現金流與具體資產的維護能力 (Maintenance)",
        style: "現金流收集者 (Income Investor)",
        targets: ["高股息 ETF", "REITs (不動產信託)", "公用事業股", "定存/儲蓄險"],
        strategy: "【複利種植】你需要的不是「帳面價值」的波動，而是「落袋為安」的配息（R 型實證）。專注於累積能產生被動收入的資產，讓時間成為盟友。",
        fatalRisk: "價值陷阱 (Value Trap)：ORC 傾向於相信眼見為憑的高殖利率（R），卻忽略了產業衰退的隱形風險（缺乏 V 的未來視角），導致賺了股息賠了本金。"
    },

    // Elder (OVC): 他者導向、內觀導向、低熵冷控
    // 修正點：強調「跨代視角」與「連結性」，不只是買入持有，而是傳承
    Elder: {
        edge: "穿越週期的智慧與人際網絡的連結 (Wisdom & Legacy)",
        style: "基石投資者 (Endowment Model)",
        targets: ["家族辦公室", "土地/林地", "古董/收藏品", "波克夏型控股"],
        strategy: "【代際傳承】利用 O 型的連結與 V 型的遠見，進行超長週期的佈局。投資於「人類社會必要的基礎設施」。你不在此刻與市場爭利，你佈局的是下一代的起點。",
        fatalRisk: "流動性僵化 (Illiquidity)：過度偏好低熵、穩定的實體或長期資產，導致在急需現金流時無法變現，資產富裕但現金貧乏。"
    }
};

export default {
    load() {
        return wealthInvestmentData
    }
}