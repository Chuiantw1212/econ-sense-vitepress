# 線上理財規劃書系統 (Online Financial Planning System)

這是一個基於 **VitePress** 與 **Element Plus** 構建的現代化線上理財規劃書生成系統。本專案旨在提供符合 CFP (Certified Financial Planner) 標準的互動式理財報告，並強調專業、潔淨的視覺體驗。

## 🛠 技術堆疊 (Tech Stack)

- **核心框架**: [VitePress](https://vitepress.dev/) (靜態網站生成器)
- **UI 組件庫**: [Element Plus](https://element-plus.org/) (Vue 3 UI 框架)
- **圖標庫**: @element-plus/icons-vue
- **樣式系統**: 依賴 Element Plus 內建 CSS 變數與組件樣式 (不使用 Custom CSS)

## 📂 檔案結構 (File Structure)

本專案採用模組化的文件結構，所有頁面內容位於 `docs/` 目錄下：

```text
.
├── docs/
│   ├── index.md                  # [已完成] 封面頁 (Cover Page)
│   └── plan/                     # 核心規劃模組資料夾
│       ├── index.md              # [已完成] 目錄與儀表板 (Dashboard/TOC)
│       ├── disclaimer.md         # [待開發] 01. 責任與義務聲明
│       ├── family-background.md  # [待開發] 02. 家庭成員與背景
│       ├── goal-setting.md       # [待開發] 03. 理財目標設定
│       ├── financial-status.md   # [待開發] 04. 財務現況分析 (收支/資產負債)
│       ├── recommendations.md    # [待開發] 05. 綜合規劃建議
│       ├── benefit-analysis.md   # [待開發] 06. 效益分析與預測
│       ├── execution-plan.md     # [待開發] 07. 執行計畫
│       └── review.md             # [待開發] 08. 定期檢視
├── package.json
└── README.md                     # 本文件