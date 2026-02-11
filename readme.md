# 海德堡隱士居

這是「海德堡隱士居」部落格的前端專案，採用 [Vitepress](https://vitepress.dev/)（基於 [Vue 3](https://vuejs.org/)）作為靜態網站生成工具，打造輕量化、高效能的部落格平台。前端功能包含多樣化的互動工具，提升使用者體驗。

## 主要功能

1. **開源財務計算機**: 提供[免費且即時的財務計算工具](https://en-chu.com/plan.html)，協助使用者進行個人財務規劃與管理。
2. **Holland Code (何倫碼) 興趣測驗**: 提供完整的 [RIASEC 興趣測驗](https://en-chu.com/growth/riasec.html)，幫助使用者發掘自己的職業興趣，並依據「海德堡隱士居」的理念提供職涯規劃建議。
3. **熵腦模型 (Entropy Brain Model)**: 這是本站的核心理論框架，結合神經科學與心理學，構建出一套系統化的[人格與認知分析模型](https://www.en-chu.com/entropy.html)。透過熱力學熵的概念解釋大腦運作過程，提供深度的自我探索與行為分析。
4. **Google Drive 文件嵌入**: 將 Google Drive 文件（如 Google 文件、Google 簡報、Google 試算表）透過 iframe 嵌入頁面，用於展示課堂使用的簡報和教材。

## AI 輔助開發 (AI-Assisted Development)

本專案，特別是「開源財務計算機」與「熵腦模型」的開發過程，大量採用了 AI 輔助編程工具。從程式碼的生成、重構到單元測試的撰寫，AI 在許多環節都扮演了重要角色，顯著提升了開發效率。然而，在關鍵的除錯、業務邏輯驗證與 UI/UX 體驗調校等環節，則更依賴開發者的手動介入與判斷，以確保最終產出的品質。

透過與 AI 的協作，開發者得以將更多精力專注於業務邏輯的梳理與使用者體驗的優化，而非耗費在重複的樣板程式碼上。這也證明了在現代軟體工程中，人機協作是實現快速迭代與創新的有效途徑。

## 主要技術棧 (Main Tech Stack)

本專案採用現代化的前端技術棧，旨在提供高效能、可維護且豐富互動的體驗。以下是 `package.json` 中的核心套件：

*   **框架 (Framework)**
    *   **VitePress**: 基於 Vite 與 Vue 3 的靜態網站生成器，提供極速的開發體驗與優異的打包效能。
    *   **Vue.js**: 專案的核心框架，使用 Vue 3 的 Composition API 來組織元件邏輯，提高程式碼的可讀性與複用性。

*   **狀態管理 (State Management)**
    *   **Pinia**: Vue 官方推薦的狀態管理庫，用於管理複雜的跨元件狀態，例如在「財務規劃書」中的使用者表單資料。

*   **UI 與樣式 (UI & Styling)**
    *   **Element Plus**: 一套完整的 Vue 3 UI 元件庫，加速開發美觀且具備響應式設計的介面。
    *   **Sass**: CSS 預處理器，透過變數、巢狀規則等功能，讓樣式表的撰寫與維護更加結構化。

*   **功能性套件 (Utility Packages)**
    *   **Chart.js**: 用於繪製各類圖表，將「熵腦人格測驗」的雷達圖與財務分析數據進行視覺化呈現。
    *   **Fuse.js**: 一個輕量級的模糊搜尋引擎，在測驗的關鍵字選擇功能中提供流暢的搜尋體驗。
    *   **html2canvas**: 將指定的 DOM 元素繪製成 Canvas，實現將測驗結果或圖表匯出為圖片的功能，方便使用者分享與保存。

*   **開發工具 (Development)**
    *   **TypeScript**: 專案主要開發語言，為 JavaScript 提供強型別支援，在編譯階段捕捉潛在錯誤，提升程式碼的穩定性與健壯性。

## 部署

此專案已部署在 [Firebase](https://firebase.google.com/) 上，利用 Firebase 的 [Hosting](https://firebase.google.com/docs/hosting) 功能，確保網站能快速、安全地提供靜態內容。

---

## 本地開發與故障排除

### 啟動開發伺服器

```bash
pnpm run dev

```

### 常見問題：EACCES Permission Denied (Port 5173)

在 Windows 環境下啟動 VitePress 時，若遇到 `Error: listen EACCES: permission denied ::1:5173`，通常是因為該端口被 Windows 的網路位址轉換 (WinNAT) 或 Hyper-V 保留排除。

#### 解決方案 A：重啟 WinNAT（推薦）

以 **系統管理員身份** 開啟 PowerShell，並執行以下指令：

```powershell
net stop winnat
net start winnat

```

#### 解決方案 B：更換運行端口

若不希望更改系統設定，可直接指定其他端口啟動：

```bash
pnpm run dev --port 8080

```

#### 解決方案 C：強制使用 IPv4 迴路

```bash
pnpm run dev --host 127.0.0.1

```

---

## 後端專案

如果想了解後端的功能與技術細節，請參閱 [calculator-api-spring](https://github.com/Chuiantw1212/calculator-api-spring) 專案。