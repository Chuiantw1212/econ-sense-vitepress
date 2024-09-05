# 常識經濟學

這是「常識經濟學」部落格的前端專案，採用 [Vitepress](https://vitepress.dev/)（基於 [Vue 3](https://vuejs.org/)）作為靜態網站生成工具，打造輕量化、高效能的部落格平台。前端功能包含多樣化的互動工具，提升使用者體驗。

## 主要功能

1. 開源財務計算機: 提供[免費且即時的財務計算工具](https://econ-sense.com/plan.html)，協助使用者進行個人財務規劃與管理。
1. Holland Code (何倫碼) 興趣測驗: 提供完整的 [RIASEC 興趣測驗](https://econ-sense.com/career/riasec.html)，幫助使用者發掘自己的職業興趣，並依據「常識經濟學」的理念提供職涯規劃建議。
2. Google Drive 文件嵌入: 將 Google Drive 文件（如 Google 文件、Google 投影片、Google 試算表）透過 iframe 嵌入頁面，用於展示課堂使用的投影片和教材。

## 使用的技術模組

### TypeScript
專案採用 [TypeScript](https://www.typescriptlang.org/) 開發，透過強型別和編譯階段的檢查機制，確保程式碼的穩定性與可維護性。使用 TypeScript 能有效提升開發效率，並減少運行時期的錯誤。

### Chart.js
[Chart.js](https://www.chartjs.org/) 是一個功能強大的圖表庫，專案中運用它來視覺化財務數據，以及繪製 RIASEC 測驗的雷達圖。不論是長條圖、折線圖或圓餅圖，Chart.js 都能動態生成高品質圖表，讓使用者能直觀地分析財務狀況與測驗結果。

### Element Plus
專案採用了 [Element Plus](https://element-plus.org/) 這個基於 Vue 3 的 UI 元件庫，來實現美觀且響應式的使用者介面。這些元件能保證使用者在不同裝置上都能獲得一致、流暢的操作體驗。

### Fuse.js
為了提升使用者的搜尋體驗，專案使用了 [Fuse.js](https://www.fusejs.io/) 這個輕量模糊搜尋工具。Fuse.js 讓使用者能快速搜尋資料，在進行興趣測驗時即時提供最符合的職業選項。

### html2canvas
[html2canvas](https://html2canvas.hertzen.com/) 用於將網頁內容轉換為圖片，方便使用者截圖。這在生成測驗結果的時候特別實用，使用者可以簡單地儲存或分享測驗成果。

## 部署
此專案已部署在 [Firebase](https://firebase.google.com/) 上，利用 Firebase 的 [Hosting](https://firebase.google.com/docs/hosting) 功能，確保網站能快速、安全地提供靜態內容。同時 Firebase 提供的無縫集成，使得前端部署更加方便與高效。

## 後端功能
如果想了解後端的功能與技術模組，請造訪[常識經濟學部落格AP專案。](https://github.com/Chuiantw1212/econ-sense-ap-hyper-express)
