這份 README 已經根據您提供的最新大綱（資產引擎、生活營運、目標導航）進行了完整的重構。加入了我們剛討論完的「重大資產稅務試算」、「退休現金流精算」等核心邏輯。

---

# 線上理財規劃書 - 功能導航架構 (Wealth OS: Functional Dashboard)

## 1. 架構理念 (Core Philosophy)

本系統採 **「動態階級演化 (Class Evolution)」** 模型，捨棄靜態的會計報表，轉而構建一套能抵抗熵增的財務作業系統。

* **核心價值：** 退休不是一個靜態數字，而是「被動引擎」與「資產紮根」的動態平衡狀態。
* **技術棧：** VitePress + Vue 3 (Composition API) + Pinia + Neon Postgres
* **UI 規範：** Element Plus (嚴格執行 **Zero Custom CSS** 與 **對稱平衡排版** 原則)。

---

## 2. 系統核心架構 (System Architecture)

本系統由三大引擎驅動，形成完整的財務生態閉環：

```mermaid
graph TD
    subgraph Asset [I. 資產引擎 (Asset Engine)]
        A1[金融資產]
        A2[不動產現況]
        A3[商業副業]
        A4[資產總覽 Dashboard]
    end

    subgraph Life [II. 生活營運 (Life Operations)]
        L1[職業收入]
        L2[信用卡管理]
        L3[儲蓄率 Fire Rate]
        L4[年度稅務預算 Tax]
    end

    subgraph Goal [III. 目標導航 (Goal Navigation)]
        G1[退休規劃 (現金流精算)]
        G2[重大資產 (房/車目標)]
    end

    %% 資料流向
    A1 & A2 & A3 --> A4
    A4 -->|淨值數據| G1
    
    L1 & L2 --> L3
    L2 -->|支出基數| G1
    
    G2 -->|持有成本/稅金 (Opex)| L4
    G2 -->|購置本金 (Capex)| A4
    
    L4 -->|修正後支出| L3

```

---

## 3. 三大核心功能模組 (The Three Pillars)

### I. 資產引擎 (Asset Engine)

> **定位：** 系統的「存量」管理與「產出」核心。

1. **金融資產 (Financial Assets)：**
* 股票、債券、基金的市值追蹤。
* 計算「流動性水位」作為防禦基底。


2. **不動產 (Real Estate Holdings)：**
* 管理**現有**持有的房產現值與房貸餘額。
* 提供資產固化程度的指標。


3. **商業或副業 (Business Matrix)：**
* 追蹤非受雇型的現金流來源。


4. **資產總覽 (Net Worth Dashboard)：**
* 整合上述數據，計算淨資產與資產配置比例。



### II. 生活營運 (Life Operations)

> **定位：** 系統的「流量」管控與「預算」審查。

1. **職業收入 (Career Income)：**
* 紀錄主動收入來源，計算人力資本價值。


2. **信用卡管理 (Credit Card Ops)：**
* 分析月均支出（Burn Rate），作為退休生活費推估的**黃金基數 (Base Amount)**。


3. **儲蓄率 (Fire Rate)：**
* 核心指標：`(總收入 - 總支出) / 總收入`。
* 決定階級躍遷速度的關鍵動能。


4. **年度稅務預算 (Tax Budget) [Auto]：**
* **自動化連動：** 自動彙整「資產引擎」中的房產稅/地價稅，以及「目標導航」中車輛的牌照燃料稅。
* 確保「隱形持有成本」被具象化為每月預算。



### III. 目標導航 (Goal Navigation)

> **定位：** 系統的「未來」路徑規劃與「缺口」試算。

1. **退休規劃 (Retirement Navigation)：**
* **新制勞退 & 勞保年金：** 官方退休金試算。
* **退休現金流精算 (Cashflow Projection)：**
* **基數 (Base)：** 依據生活營運算出的真實開銷 (如 36,300 元)。
* **動態調節：** 疊加「活躍期係數 (Lifestyle)」、「居住成本還原 (Housing Correction)」與「高齡醫療公積金 (Aging Medical)」。
* **失能防禦：** 整合長照模式 (`opt_care_costs`) 的風險預算。




2. **重大資產導航 (Major Assets)：**
* **購車/購屋計畫：** 設定未來的大額資本支出 (Capex) 目標。
* **稅務與維護連動：**
* 內建台灣汽機車稅率表與房產持有稅率。
* 當設定買車目標時，自動反饋增加的「年持有成本 (Opex)」至生活營運模組，防止買得起養不起。





---

## 4. 退休整合邏輯 (Retirement Integration Logic)

本系統的退休規劃並非單一維度，而是 **「雙軌制 (Dual Track)」** 評估：

1. **現金流覆蓋率 (Cashflow Coverage)：**
* 公式：`(被動收入 + 勞保勞退 + 提領率) / (基礎生活費 + 醫療公積金 + 居住還原金)`
* 目標：覆蓋率 > 100% 且具備抗通膨能力。


2. **資產重置準備 (Sinking Funds)：**
* 透過「重大資產導航」，確保退休期間的換車、房屋修繕等大型支出，已有獨立的本金準備，不侵蝕生活費。



---

## 5. UI/UX 與技術規範 (Standards)

* **主要介面：** 使用 Element Plus 的 `el-card`、`el-statistic`、`el-table` 進行模組化堆疊。
* **導航回饋機制：**
* **目標設定區** (Goal Navigation) 的變動，必須 **即時 (Real-time)** 反應在 **生活營運區** (Life Operations) 的預算壓力上。
* 例如：新增一台 3000cc 進口車目標 -> 年度稅務預算自動增加 2.2 萬 -> 儲蓄率自動下降。


* **Zero Custom CSS：** 僅使用 Grid/Flex 佈局，確保RWD與維護性。

---

## 6. 開發優先級 (Roadmap)

1. **Phase 1: 生活營運與資產現況 [DONE]**
* 職業收入、信用卡支出、金融資產輸入。
* 基礎儲蓄率計算。


2. **Phase 2: 目標導航核心 [IN PROGRESS]**
* **重大資產模組：** 實作 `AssetGoals.vue`，內建 `opt_asset_tax_presets.json` 稅務資料庫。
* **退休精算模組：** 實作 `RetirementCalculator.vue`，整合生活費基數與三大調節參數。


3. **Phase 3: 全局連動與稅務預算**
* 實作「稅務預算」自動化計算邏輯。
* 串接「目標」對「營運」的 Opex 壓力測試。


4. **Phase 4: 戰情室總覽**
* 資產總覽 Dashboard 與 Fire Rate 視覺化。