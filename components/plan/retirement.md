這份 README 已經修復了表格格式，並確保排版在 Markdown 渲染器（如 GitHub、GitLab 或 VS Code）中能正確顯示。

請將以下內容更新至您的 `README.md`。

---

# 🚀 退休全週期規劃模組 (Retirement Lifecycle Module)

本模組採用 **「生命週期三階段模型 (The Three-Stage Model)」**，將退休後的生活精準劃分為 **活躍期 (Go-Go)**、**防禦期 (Slow-Go)** 與 **長照期 (No-Go)**。

透過階段性拆解，解決傳統「一筆退休金算到底」導致的通膨誤判與醫療風險低估問題。

---

## 📌 Phase 1: 活躍期 (Go-Go Years)

* **對應卡片**：`LivingStyleCard` (每月支出結構)
* **核心邏輯**：**三大支柱簡化模型 (Three Pillars)**
* **階段特徵**：用戶身體健康、活動力強。重點在於預測「維持理想生活品質」所需的現金流。全面採用 **選單驅動 (Menu-driven)**，移除瑣碎記帳欄位。

| 支柱 (Pillar) | 資料源 (JSON) | 邏輯說明 |
| --- | --- | --- |
| **1. 居住支柱 (Housing)** | `opt_housing_solo` / `opt_housing_coliving` | **獨居 vs 共居**：用戶選擇家庭型態後，系統切換對應 JSON 選單。金額直接讀取 `monthlyCost`，反映真實持有或租賃成本。 |
| **2. 醫療支柱 (Health)** | `opt_health_tier` | **日常維護**：包含牙齒、營養品、健身、自費健檢。**通膨修正**：系統強制將基礎費用乘上 **1.04** (醫療通膨係數)。 |
| **3. 生活支柱 (Active Living)** | `opt_active_living` | **統包式預算 (Q1-Q5)**：將伙食、交通、娛樂、雜支打包為單一費率。左側顯示「目前刷卡額」作為現實參考。 |

> **⚠️ 邊界定義**：此卡片 **不包含** 重大傷病治療與長期照護費用。
---

## 🛡️ Phase 2: 防禦期 (Slow-Go Years)

* **對應卡片**：`MedicalDefenseCard` (醫療財務防禦)
* **核心邏輯**：**風險轉嫁 (Risk Transfer)**
* **階段特徵**：活動力下降，雖然生活開銷可能減少，但「修復身體」的頻率大幅增加。重點在於 **重大風險轉嫁** 與 **自費醫療儲備**。

| 關鍵指標 | 邏輯 / 預設值 | 說明 |
| --- | --- | --- |
| **防禦等級** | 連動財務階層 (D-Tier) | • **D1-D3**: 基礎型 (健保為主)<br>

<br>• **D4-D7**: 品質型 (部分自費)<br>

<br>• **D8-D10**: 尊榮型 (全自費/達文西/標靶) |
| **醫療通膨** | **3.5% ~ 4.5%** | **J-Curve 效應**：<br>

<br>醫療科技進步導致通膨率長期高於一般 CPI。 |
| **重大傷病準備** | **$50萬 ~ $200萬** | **一次性救命錢**：<br>

<br>用於癌症、心腦血管手術等保險無法全額覆蓋之缺口。 |

> **⚠️ 邊界定義**：此卡片專注於 **「事件 (Events)」** (如罹癌、手術)，而非日常保健。

---

## ♿ Phase 3: 長照期 (No-Go Years)

* **對應卡片**：`LTCStrategyCard` (長照風險戰略)
* **核心邏輯**：**失能照護 (Dependency Care)**
* **階段特徵**：失去自理能力。重點在於計算 **「照護人力成本」** 與 **「隱形開銷」**。

| 關鍵指標 | 邏輯 / 預設值 | 說明 |
| --- | --- | --- |
| **啟動年齡** | 預設 **80歲** | 基於平均不健康餘命 (約 7-9 年) 設定啟動點。 |
| **照顧模式** | 家人 / 外看 / 機構 | **隱藏成本**：<br>

<br>若選外籍看護，除薪資外自動加計 **$5,000** (食宿/就安費/健保)。 |
| **雜支耗材** | **+$12,000 / 月** | **補漏**：<br>

<br>機構費與看護費通常不含尿布、營養品、管灌配方等高頻耗材。 |
| **人力通膨** | **3.0% ~ 5.0%** | **包默病 (Baumol's Cost Disease)**：<br>

<br>反映少子化造成的人力服務成本飆升。 |

> **⚠️ 邊界定義**：此卡片專注於 **「依賴 (Dependency)」** 狀態下的生存成本。

---

## 💾 Data Structure (Updated Interface)

資料結構已隨 Go-Go Years 的簡化而更新，確保無冗餘欄位。

```typescript
/**
 * 退休生活風格 (Go-Go Years 專用)
 * 對應資料表: user_retirement_lifestyle
 */
export interface RetirementLifestyle {
    // --- 1. 居住支柱 (Housing) ---
    /** 居住型態: 'single' (獨居) | 'couple' (共居) */
    householdType: 'single' | 'couple';
    
    /** 居住方案代碼 (對應 JSON Code) */
    housingMode: string;
    
    /** 居住月成本 (查表後自動寫入) */
    housingCost: number;

    // --- 2. 醫療支柱 (日常 Health) ---
    /** 醫療等級代碼 (對應 opt_health_tier) */
    healthTierCode: string;
    
    /** 醫療月成本 (查表後 x 1.04 通膨係數寫入) */
    healthCost: number;

    // --- 3. 生活支柱 (Active Living) ---
    /** 生活水準代碼 (對應 opt_active_living Q1-Q5) */
    activeLivingCode: string;
    
    /** 生活月預算 (包含食衣住行育樂，查表後自動寫入) */
    activeLivingCost: number;
    
    // *註：原有的 utilities, foodCost, entertainment 等細項欄位皆已移除
}

/**
 * 醫療防禦設定 (Slow-Go Years 專用)
 * 對應資料表: user_medical_defense
 */
export interface MedicalDefense {
    defenseTier: 'basic' | 'standard' | 'premium';
    inflationRate: number;          // e.g. 0.045
    criticalIllnessReserve: number; // e.g. 1000000 (一次性準備金)
}

/**
 * 長照戰略設定 (No-Go Years 專用)
 * 對應資料表: user_ltc_strategy
 */
export interface LTCStrategy {
    enableAge: number;          // e.g. 80
    careMode: 'family' | 'migrant' | 'institution';
    monthlyCareCost: number;    // 人力費或機構月費
    monthlySupplies: number;    // 耗材費 (預設 12000)
    inflationRate: number;      // e.g. 0.035
}

```