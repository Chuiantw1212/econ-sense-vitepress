沒問題。這份 `README.md` 將作為您的開發藍圖，整合了我們之前討論過的所有核心邏輯，包括**財富自由度計算**、**三張信用卡支出管理**以及**勞保勞退整合卡片**。

這份文件定義了**資料流向**、**組件層級**以及**邏輯依賴關係**。

---

# 線上理財規劃書系統架構 (Financial Planning System Architecture)

## 1. 專案概述 (Overview)

本專案旨在構建一個互動式的線上理財規劃書。系統核心圍繞於財務三大表（收支表、資產負債表、現金流量表）的連動與試算。

* **技術棧：** VitePress (SSG Framework) + Vue 3
* **UI 框架：** Element Plus (全站樣式與組件)
* **樣式原則：** **Zero Custom CSS**。所有排版、間距、響應式設計均透過 Element Plus 的 Props、Slots 與內建 Layout 系統達成。

---

## 2. 核心資料流向 (Core Data Flow)

系統採單向資料流邏輯，確保數據的一致性與連動性。

```mermaid
graph TD
    subgraph BalanceSheet [資產負債表 (存量)]
        A[投資資產]
        B[退休權益 (勞保/勞退)]
        C[負債]
    end

    subgraph IncomeStatement [收支表 (流量)]
        D[職業收入]
        E[理財收入 (由 A 衍生)]
        F[生活支出 (含信用卡管理)]
        G[年度結餘 (D+E-F)]
        H[財富自由度 (E/F)]
    end

    subgraph CashFlow [現金流量表 (預測)]
        I[未來資產累積]
        J[重大目標事件]
        K[退休可行性分析]
    end

    A -->|產生股息/債息| E
    B -->|提供退休金預估| K
    G -->|注入資金| I
    C -->|產生利息支出| F

```

---

## 3. 模組架構詳解 (Module Architecture)

### 3.1. 收支表 (Income Statement)

**定位：** 管理現金流入與流出，計算年度結餘與財務自由度。

#### **A. 收入區塊 (Revenue Section)**

1. **職業收入卡片 (Active Income Card)**
* **功能：** 記錄薪資、獎金、兼職收入。
* **組件：** `el-card` > `el-form`。


2. **理財收入卡片 (Passive Income Card)**
* **資料來源：** 自動讀取「資產負債表」中「投資資產」的預估回報，亦可手動調整。
* **關鍵指標：** 這是計算「財富自由度」的分子。



#### **B. 支出區塊 (Expense Section)**

1. **生活支出卡片 (Living Expense Card)**
* **功能：** 記錄食衣住行等日常開銷。
* **進階功能：** **信用卡支出透視 (Credit Card Insight)**
* **UI 架構：** `el-tabs` (切換不同信用卡) + `el-statistic`。
* **邏輯：** 輸入過去 5 個月帳單，自動計算「月均支出」。
* **分類：** 一般開支 (浮動)、訂閱開支 (固定)、專案開支 (一次性)。




2. **稅務與借貸支出卡片 (Tax & Liability Expense)**
* **功能：** 記錄所得稅、房貸利息、信貸利息。



#### **C. 儀表板區塊 (Dashboard Section)**

* **財富自由度 (Financial Freedom Ratio)**
* **邏輯：** `理財收入 / 總支出`。
* **呈現：** `el-progress` (進度條) + `el-alert` (評語)。


* **年度結餘 (Yearly Surplus)**
* **呈現：** `el-statistic`。



---

### 3.2. 資產負債表 (Balance Sheet)

**定位：** 盤點家庭身價，管理資產配置與退休權益。

#### **A. 資產區塊 (Assets Section)**

1. **流動資產卡片 (Liquid Assets)**
* **內容：** 現金、活存、定存、外幣。
* **指標：** 緊急預備金倍數。


2. **投資資產卡片 (Investment Assets)**
* **內容：** 股票、ETF、基金、債券。
* **重點：** 需設定「預期年化報酬率」(用於推算未來現金流)。


3. **自用資產卡片 (Use Assets)**
* **內容：** 自住不動產、汽車。


4. **退休權益總覽卡片 (Retirement Assets)**
* **定位：** **單一卡片整合勞保與勞退**。
* **UI 架構 (三層式)：**
* **第一層 (Glance)：** 預估退休後「每月總領金額」大字顯示。
* **第二層 (Pillars)：** 左右分欄顯示「勞保老年給付」與「勞退個人專戶」細節。
* **第三層 (Gap)：** 視覺化圖表顯示距離「理想退休金」的缺口。





#### **B. 負債區塊 (Liabilities Section)**

1. **負債管理卡片**
* **內容：** 房貸餘額、車貸、信用卡未繳餘額。



#### **C. 總結區塊 (Summary)**

* **家庭淨值 (Net Worth)：** 資產 - 負債。
* **資產配置餅圖：** 使用 ECharts 展示 (流動/投資/自用) 比例。

---

### 3.3. 現金流量表 (Cash Flow Statement)

**定位：** 預測未來財務狀況，驗證目標可行性。此表主要為「計算結果」，輸入項較少。

#### **A. 參數設定 (Settings)**

1. **總體經濟假設**
* **內容：** 通膨率、薪資成長率。


2. **重大理財目標卡片 (Major Goals)**
* **內容：** 設定未來時間點的大額支出（如：5年後買房、30年後退休）。
* **UI：** `el-timeline` 形式呈現。



#### **B. 試算結果 (Projection)**

1. **生涯現金流模擬表**
* **組件：** `el-table`。
* **欄位：** 年度、年齡、收入、支出、結餘、累積資產。
* **警示：** 若某年「流動資產 < 0」，顯示紅色 `el-tag type="danger"` (黑字倒閉預警)。


2. **資產累積趨勢圖**
* **組件：** ECharts 折線圖/堆疊圖。
* **展示：** 顯示資產隨時間複利成長的曲線。



---

## 4. 全域組件與工具 (Global Components & Utils)

為了保持代碼整潔，將共用邏輯提取為 Composables 或 Utils。

* **`useCurrencyFormat`**: 統一處理金額格式化 (千分位, $ 符號)。
* **`useFinancialCalcs`**: 封裝複利計算 (FV)、現值 (PV)、年金 (PMT) 等核心算法。
* **`CardContainer`**: 統一封裝 `el-card` 的 header 樣式與 padding，確保全站視覺一致。

---

## 5. 開發優先級 (Roadmap)

1. **Phase 1: 基礎盤點 (Current State)**
* 實作「職業收入卡」與「生活支出卡」(含信用卡分析)。
* 實作「資產負債表」四大分類卡片 (含退休權益卡)。
* 完成「財富自由度」與「淨值」的即時計算展示。


2. **Phase 2: 未來預測 (Future State)**
* 實作「現金流量表」的試算引擎。
* 整合「理財目標」對現金流的衝擊。


3. **Phase 3: 優化與視覺化 (Polish)**
* 引入 ECharts 繪製趨勢圖與分佈圖。
* 加入動態理財建議 (基於數據的 `el-alert` 提示)。



---