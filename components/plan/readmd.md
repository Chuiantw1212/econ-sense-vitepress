# 線上理財規劃書 - 功能導航架構 (Wealth OS: Functional Dashboard)

## 1. 架構理念 (Core Philosophy)

本系統採 **「動態階級演化 (Class Evolution)」** 模型，捨棄靜態的會計報表。
核心邏輯為：**「抗熵防禦 (Shield) → 儲蓄候選 (Candidate) → 資產經營 (Engine) → 階級紮根 (Rooting)。」**

* **核心價值：** 退休不是一個數字，而是「被動引擎替代率」達到 100% 的狀態。
* **技術棧：** VitePress + Vue 3 (Composition API) + Pinia + Neon Postgres
* **UI 規範：** Element Plus (嚴格執行 **Zero Custom CSS** 與 **對稱平衡排版** 原則)。

---

## 2. 核心資料流向 (Data Flow)

```mermaid
graph TD
    subgraph AssetEngine [I. 資產引擎 (產出/存量)]
        A1[金融資產 - 流動性核心]
        A2[房地產 - 階級錨點]
        A3[商業副業 - 效能矩陣]
        
        calc_IRR[實測年化 IRR]
        calc_Passive[被動收入總額]
        calc_Liquid[流動資產水位]
    end

    subgraph LifeOps [II. 生活營運 (消耗/候選)]
        B1[職業收入 - 每月實領]
        B2[信用卡透視 - 月均支出]
        calc_Burn[月均消耗 Burn Rate]
        calc_Saving[儲蓄率門檻 L1-L5]
    end

    subgraph Navigator [III. 目標導航 (階級演化路徑)]
        direction TB
        N1[優先級 1: 熵增緩衝 - 生存防禦]
        N2[優先級 2: 被動引擎 - 勞力替代]
        N3[優先級 3: 資產紮根 - 物理固化]
        N4[優先級 4: 時間主權 - 終極進化]
        
        Retirement((終極目標: 退休狀態))
    end

    A1 & A2 & A3 --> calc_Passive
    A1 --> calc_Liquid
    B1 & B2 --> calc_Saving
    B2 --> calc_Burn
    
    calc_Liquid & calc_Burn --> N1
    calc_Passive & calc_Burn --> N2
    A2 & calc_Burn --> N3
    N2 -->|替代率 100%| Retirement
    N4 -->|絕對選擇權| Retirement

```

---

## 3. 三大核心功能模組 (The Three Pillars)

### I. 資產引擎模組 (Asset Engine)

> **定位：** 系統的「能量來源」。

1. **金融資產中心 (Financial Hub)**
* **流動性定義：** 僅計入 `Portfolios` 內之市值，作為「熵增緩衝」的計算基準。


2. **商業與副業矩陣 (Business Matrix)**
* **效能矩陣：** 以 IRR 與投入成本為座標，區分「高產出資產」與「熵增不良資產」。



### II. 生活營運模組 (Life Operations)

> **定位：** 階級躍遷的「候選資格」審查。

1. **主動收入儲蓄分析 (Saving Capacity Card)：**
* **候選人邏輯：** 儲蓄率決定你的階級候選資格 (L1 財務熵增 ~ L5 極限抗熵)。
* **核心算式：** `薪資實拿 - 月均支出 = 月結餘`。
* **紮根診斷：** 強調儲蓄只是「門檻」，必須配合「資產經營」才能真正紮根。



### III. 目標導航模組 (Strategic Navigator) [NEW]

> **定位：** 系統的「引導大腦」。將退休目標拆解為四個可驗證的階段。

#### **階段 1：熵增緩衝 (Entropy Shield)**

* **導航目標：** 建立 12 個月的「現金水位」。
* **核心指標：** `流動性資產 / 月均總消耗`。
* **階級意義：** 止血與防禦，確保系統不會因意外墜落回 L1。

#### **階段 2：被動引擎 (Passive Engine)**

* **導航目標：** 被動收入替代率。
* **核心指標：** `被動收益 / 月均總消耗`。
* **階級意義：** 效率與替代。替代率達 100% 即解鎖「退休」資格。

#### **階段 3：資產紮根 (Asset Anchoring)**

* **導航目標：** 物理性階級固化（如：自住房產）。
* **核心指標：** 房貸壓力測試、資產淨值比。
* **階級意義：** 防禦通膨收割，將身分標註在物理土地上。

#### **階段 4：時間主權 (Time Sovereignty)**

* **導航目標：** 2 年期「脫產轉型基金」。
* **階級意義：** 演化與飛躍。獲得「不為錢工作」的絕對選擇權。

---

## 4. 退休整合邏輯 (Retirement Integration)

本系統不將退休視為單一存款數字，而是將其整合進 **「被動引擎」** 導航中：

* **退休門檻：** 當「被動引擎替代率」達 100% 時，系統標註為 **[退休資格達成]**。
* **退休穩定性：** 需同時滿足「熵增緩衝 > 12個月」與「資產紮根完成」，方可定義為 **[結構性退休]**（不會因市場震盪而被迫回歸勞動市場）。

---

## 5. UI/UX 與技術規範 (Standards)

* **五段式階級刻度 (Segmented Progress)：** 所有導航指標捨棄連續性進度條，改用「五段方塊」，體現階級門檻的「跳躍性」與「資格感」。
* **對稱平衡排版：** 診斷卡片下半部嚴格執行「左右對稱」，左側為「長期定位」，右側為「紮根關鍵」。
* **數據雙向同步 (defineModel)：** 診斷卡片直接綁定全域 `UserFormState`，實現「修改即診斷」的即時反饋。
* **Zero Custom CSS：** 僅使用 Element Plus Grid、Tailwind 及原生的對稱 CSS Flexbox。

---

## 6. 開發優先級 (Roadmap)

1. **Phase 1: 基礎抗熵層 [DONE]**
* `SavingCapacityCard` (儲蓄候選診斷)
* `EntropyShieldCard` (水位防禦導航)


2. **Phase 2: 資產經營層 [IN PROGRESS]**
* `PassiveEngineCard` (被動收入替代率)
* `AssetEfficiencyMatrix` (IRR 矩陣圖表)


3. **Phase 3: 固化與演化層**
* `AssetAnchoringCard` (不動產壓力測試)
* `TimeSovereigntyCard` (轉型基金試算)


4. **Phase 4: 終極整合**
* `WealthOS_RetirementSummary` (結構性退休路徑預測)
