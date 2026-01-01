# 線上理財規劃書 - 功能導航架構 (Wealth OS: Functional Dashboard)

## 1. 架構理念 (Core Philosophy)

本系統捨棄傳統會計「三表分離」的設計，改採**「模組化儀表板 (Modular Dashboard)」**架構。
核心邏輯為：**「資產驅動收入 (Asset Engine) → 收入覆蓋支出 (Operations) → 剩餘轉向未來 (Navigator)。」**

* **技術棧：** VitePress (SSG) + Vue 3 + Pinia (State) + Neon Serverless Postgres
* **UI 框架：** Element Plus (嚴格執行 **Zero Custom CSS** 原則)
* **管理視角：** 以「決策」為核心，專注於資產效率 (IRR/ROI) 與現金流監控。

---

## 2. 核心資料流向 (Data Flow)

```mermaid
graph TD
    subgraph AssetEngine [I. 資產引擎 (產出金流)]
        A1[金融資產 - CSV自動化]
        A2[房地產 - 租金管理]
        A3[商業副業 - 效能矩陣]
        
        calc_IRR[實測年化報酬率 IRR]
        calc_Passive[被動收入總額]
        calc_NetWorth[淨資產總額]
    end

    subgraph LifeOps [II. 生活營運 (消耗金流)]
        B1[職業收入 - 主動]
        B2[生活支出 - 信用卡透視]
        calc_Burn[月均支出 Burn Rate]
    end

    subgraph Navigator [III. 目標導航 (預測未來)]
        C1[財富自由度 (Passive / Burn)]
        C2[退休權益庫 (勞保/勞退)]
        C3[生涯模擬 (基於 IRR)]
    end

    A1 & A2 & A3 --> calc_IRR
    A1 & A2 & A3 --> calc_Passive
    A1 & A2 & A3 --> calc_NetWorth
    B2 --> calc_Burn
    
    calc_Passive --> C1
    calc_Burn --> C1
    calc_IRR --> C3
    calc_Passive & B1 & calc_Burn -->|年度結餘| C3

```

---

## 3. 三大核心功能模組 (The Three Pillars)

### I. 資產引擎模組 (Asset Engine)

> **定位：** 您的「印鈔機」。將資產存量與其產生的被動收益（股息、租金、分潤）整合管理。

1. **金融資產中心 (Financial Hub)**
* **數據來源：** 自動解析券商 `庫存.CSV` (現值) 與 `交易.CSV` (流向)。
* **核心指標：**
* **本金水位線：** 透過交易紀錄反推真實投入成本 (Principal)。
* **實測 IRR：** 計算過去一年的真實資金效率 (如：美股帳戶 17.5%)。
* **預估股息：** 根據庫存自動推算年度理財收入。




2. **房地產管理 (Real Estate)**
* **功能：** 管理非自住投資物件（收租房、商辦）。
* **指標：** 銀行估值、租金投報率 (Gross Yield)、貸款槓桿倍數。


3. **商業與副業矩陣 (Business & Side Hustle Matrix)** [NEW]
* **功能：** 針對本業、副業、股權投資、太陽能案場等進行多元管理。
* **視覺化核心：** **資產效能矩陣 (Asset Efficiency Matrix)**。
* **X軸：** 投入成本 / **Y軸：** IRR (內部報酬率)。
* **背景視覺：** 垂直漸層 (上綠下紅)，直觀顯示資產優劣位置。
* **分組管理：** 提供 5 種色系標籤 (藍/橘/紫/青/粉)，由用戶自定義群組意義 (如：藍色=本業、紫色=高風險)，降低系統複雜度。
* **警示機制：** 自動繪製 **IRR 3% 警戒線**，標示不良資產分界。


* **指標：** 預估年限、稅務類別 (免稅/6%/核實)、月淨現金流。



---

### II. 生活營運模組 (Life Operations)

> **定位：** 您的「日常營運成本」。專注於現金流動性管理。

1. **職業收入分析：**
* 管理薪資單 (Payroll) 與非經常性獎金 (Bonus)。


2. **信用卡穿透分析 (Credit Card Insight)：**
* **架構：** `el-tabs` 切換不同支付工具。
* **邏輯：** 輸入過去 5 個月帳單，自動計算「月均支出」。
* **分類：**
* 🟢 **一般開支** (浮動生活費)
* 🔵 **訂閱開支** (固定週期性)
* 🟠 **專案開支** (一次性大額，不計入常態月均，但計入年度預算)





---

### III. 目標導航模組 (Strategic Navigator)

> **定位：** 您的「戰情室」。回答「還要多久退休」與「風險係數」。

1. **財富自由度 (Financial Freedom Dashboard)：**
* **公式：** `[資產引擎] 被動收入總額 / [生活營運] 常態月均支出`。
* **呈現：** 使用 `el-progress` 視覺化進度，目標為 100% (Fire)。


2. **退休金庫 (Pension Vault)：**
* 整合勞保 (年金) 與勞退 (專戶) 的未來給付預估。


3. **生涯模擬沙盒 (Life Sim Sandbox)：**
* **參數開關：** 切換 `[個人實測 IRR]` vs `[市場平均 7%]`。
* **趨勢圖：** 預測未來 10-30 年的資產累積曲線，驗證資產配置的長期效益。



---

## 4. UI/UX 實作規範 (Implementation Standards)

* **Zero Custom CSS：** 嚴格禁止 `<style>` 區塊。所有排版使用 Element Plus 的 `el-row`, `el-col`, `el-space`, `el-card` 及 Tailwind CSS Utility Classes。
* **狀態管理 (Pinia)：** 建立 `useAssetStore` (整合金融/房產/商業) 與 `useExpenseStore`，確保單一數據源 (Single Source of Truth)。
* **響應式設計：** 優先考慮 `xs` (手機) 與 `md` (桌面) 的 `el-col` 斷點配置。
* **圖表整合：** 使用 Chart.js 配合自定義 Plugin (如背景漸層、警戒線) 強化數據解讀力。

---

## 5. 開發優先級 (Roadmap)

1. **Phase 1: 建立資產引擎心臟 (Asset Core)**
* ✅ 建置 `useAssetStore`。
* ✅ 開發 `AssetFinancial.vue`：實作 CSV 匯入、小計排除邏輯。


2. **Phase 2: 商業與副業模組 (Business Matrix)**
* ✅ 開發 `AssetBusiness.vue`。
* ✅ 實作「資產效能矩陣」圖表 (IRR/Cost Scatter Plot)。
* ✅ 實作 5 色分組與後端 Metadata 對接。


3. **Phase 3: 完善生活營運 (Operations)**
* 開發 `ExpenseCreditCard.vue`：實作 5 個月均值算法。


4. **Phase 4: 連結目標導航 (Navigation)**
* 開發 `DashboardFreedom.vue`：串接前三者的數據，顯示自由度。


5. **Phase 5: 擴充資產類別 (Expansion)**
* 加入房地產模組 (Real Estate) 與貸款試算。