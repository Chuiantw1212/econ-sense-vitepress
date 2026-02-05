# 海德堡隱士居

這是「海德堡隱士居」部落格的前端專案，採用 [Vitepress](https://vitepress.dev/)（基於 [Vue 3](https://vuejs.org/)）作為靜態網站生成工具，打造輕量化、高效能的部落格平台。前端功能包含多樣化的互動工具，提升使用者體驗。

## 主要功能

1. **開源財務計算機**: 提供[免費且即時的財務計算工具](https://en-chu.com/plan.html)，協助使用者進行個人財務規劃與管理。
2. **Holland Code (何倫碼) 興趣測驗**: 提供完整的 [RIASEC 興趣測驗](https://en-chu.com/growth/riasec.html)，幫助使用者發掘自己的職業興趣，並依據「海德堡隱士居」的理念提供職涯規劃建議。
3. **熵腦模型 (Entropy Brain Model)**: 這是本站的核心理論框架，結合神經科學與心理學，構建出一套系統化的[人格與認知分析模型](https://www.en-chu.com/entropy.html)。透過熱力學熵的概念解釋大腦運作過程，提供深度的自我探索與行為分析。
4. **Google Drive 文件嵌入**: 將 Google Drive 文件（如 Google 文件、Google 簡報、Google 試算表）透過 iframe 嵌入頁面，用於展示課堂使用的簡報和教材。

## 使用的技術模組

### TypeScript

專案採用 [TypeScript](https://www.typescriptlang.org/) 開發，透過強型別和編譯階段的檢查機制，確保程式碼的穩定性與可維護性。

### Chart.js

[Chart.js](https://www.chartjs.org/) 用於視覺化財務數據，以及繪製 RIASEC 測驗與熵腦模型分析的雷達圖與圖表。

### Element Plus

採用 [Element Plus](https://element-plus.org/) UI 元件庫，實現美觀且響應式的使用者介面。

### Fuse.js

使用 [Fuse.js](https://www.fusejs.io/) 輕量模糊搜尋工具，提升測驗與資料檢索的體驗。

### html2canvas

[html2canvas](https://html2canvas.hertzen.com/) 用於將網頁內容轉換為圖片，方便使用者儲存測驗結果或理論模型圖表。

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

## 後端功能

如果想了解後端的功能與技術模組，請造訪[海德堡隱士居部落格AP專案。](https://github.com/Chuiantw1212/econ-sense-ap-hyper-express)