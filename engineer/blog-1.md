---
description: Vitepress無本部落格，適合前端初學者、文字工作者學習，自由掌握內容，免費託管，建立屬於自己的線上空間。
outline: [2,3]
---

# VitePress無本部落格

《VitePress無本部落格》涵蓋環境建置、本機運行、發布與修改、進階設定等內容。適合想學習前端的初學者、希望脫離平台倒閉困擾的使用者，以及不想負擔部落格託管費用的使用者。這個指南將帶您一步步建立並管理自己的無本部落格，實現高效、低成本的網路內容創作。

## 環境建置

在進行 Vitepress 開發之前，首先需要完成一些必要的環境設定。以下是你需要依序完成的步驟，從打開終端機到安裝開發工具，確保你具備所有必要的工具來順利啟動專案。

### 終端機

在安裝 Node.js 和 Git 之前，你需要打開終端機來輸入相關指令。根據你的作業系統，打開終端機的方法有所不同。

#### Windows 用戶

1. **使用搜尋功能**  
   - 按下 **Windows 鍵**，在搜尋欄中輸入「cmd」或「Command Prompt」。
   - 點擊搜尋結果中的 **Command Prompt**。

2. **使用運行功能**  
   - 按下 **Windows + R**，在彈出的「運行」窗口中輸入「cmd」，並按下 Enter。

#### Mac 用戶

1. **使用 Spotlight 搜尋**  
   - 按下 **Command + 空格鍵**，在搜尋欄中輸入「Terminal」，然後按下 Enter。

2. **使用 Finder**  
   - 打開 Finder，前往 **應用程式 > 工具程式** 目錄，然後點擊 **Terminal**。

### Node.js的安裝

Node.js 是 Vite 的運行環境，因此安裝 Node.js 是使用 Vitepress 的第一步。

#### 安裝步驟

1. **前往 Node.js 官方網站**  
   打開 [Node.js 官方網站](https://nodejs.org/)，你會看到兩個版本可供選擇：
   - **LTS (長期支援版)**：這是更穩定的版本，適合大多數用戶。
   - **Current (最新版本)**：包含最新的功能，但可能不夠穩定。

2. **下載並安裝 Node.js**  
   下載適合你作業系統的安裝檔案，並按照提示安裝。建議保留預設設置。

3. **確認安裝成功**  
   安裝完成後，打開終端機並輸入以下指令，檢查 Node.js 是否安裝成功：

   ```bash
   node -v
   ```

   若顯示版本號，則表示安裝成功。

### VS Code的安裝

VS Code 是一款免費且強大的編輯器，支援各種編程語言，與 Vitepress 的開發流程相當契合。

#### 安裝步驟

1. **前往 VS Code 官方網站**  
   到 [VS Code 官方網站](https://code.visualstudio.com/) 下載適合你作業系統的安裝檔案。

2. **安裝 VS Code**  
   執行安裝檔案，並按照提示完成安裝。你可以保留預設選項即可。

3. **安裝 Vitepress 所需擴充功能（可選）**  
   雖然本文不需要介紹額外的開發工具，但你可以安裝一些擴充功能來提升開發效率，例如 Vue.js 擴充功能，以幫助編寫 Vue 組件。


### Git的安裝

Git 是管理版本控制的重要工具，用於跟蹤代碼的變更。在 Windows 和 Mac 上安裝 Git 的步驟略有不同，請根據你的作業系統選擇適合的步驟。

#### Windows 用戶

1. **前往 Git 官方網站**  
   打開 [Git 官方網站](https://git-scm.com/)，下載適合 Windows 的安裝檔案。

2. **安裝 Git**  
   執行下載的安裝檔案，並按照提示安裝。在安裝過程中，建議勾選「Git Bash」，這將允許你使用命令行來管理 Git。

3. **確認安裝成功**  
   完成安裝後，打開 **Git Bash** 或 **Command Prompt**，輸入以下指令檢查 Git 是否安裝成功：

   ```bash
   git --version
   ```

   如果顯示版本號，則表示安裝成功。

#### Mac 用戶

Mac 用戶在安裝 Git 之前，建議保留至少 15GB 的硬碟空間，以確保安裝過程順利且能為未來的專案留出足夠的空間。

1. **安裝 Homebrew**  
   在 Mac 上建議先安裝 Homebrew 來方便安裝 Git。打開 **Terminal**，輸入以下指令來安裝 Homebrew：

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **使用 Homebrew 安裝 Git**  
   Homebrew 安裝完成後，輸入以下指令安裝 Git：

   ```bash
   brew install git
   ```

3. **確認安裝成功**  
   輸入以下指令來檢查 Git 是否安裝成功：

   ```bash
   git --version
   ```

   如果顯示版本號，則表示 Git 安裝成功。

### GitHub 帳號註冊

GitHub 是用來存放及分享代碼的平台。如果你還沒有 GitHub 帳號，可以按照以下步驟來註冊：

#### 註冊步驟

1. **前往 GitHub 官方網站**  
   打開 [GitHub 官方網站](https://github.com/)。

2. **建立新帳號**  
   點擊右上角的「Sign up」，然後按照頁面提示輸入你的電子郵件、密碼等信息來註冊帳號。

3. **完成註冊**  
   按照頁面的引導完成帳號的設置，包括設定使用者名稱和選擇方案（你可以選擇免費方案）。

### GitHub Desktop的安裝

GitHub Desktop 是 Git 的圖形化工具，讓你可以更加方便地管理和同步 GitHub 儲存庫，對於不熟悉命令行的使用者來說十分方便。

#### 安裝步驟

1. **前往 GitHub Desktop 官方網站**  
   打開 [GitHub Desktop 官方網站](https://desktop.github.com/) 並下載適合你作業系統的安裝檔案。

2. **安裝並登入**  
   完成安裝後，打開 GitHub Desktop，並使用你的 GitHub 帳號登入。如果你還沒有 GitHub 帳號，可以在安裝前按照上面「註冊 GitHub 帳號」的步驟進行註冊。

完成這些環境設定後，你就具備了啟動 Vitepress 專案所需的基本工具。你現在可以進行專案的初始化，開始你的開發旅程。

### 總結說明

在進行 Vitepress 專案的開發時，你需要理解並使用一些核心工具。這些工具各自扮演不同的角色，從開發環境設置到版本控制再到代碼協作，它們構成了整個開發流程的基礎。

#### 終端機、Node.js、VS Code

- **終端機**：  
  使用終端機來輸入命令和運行應用程式。無論是安裝依賴、啟動開發伺服器還是運行 Git 命令，終端機是與系統互動的核心工具。

- **Node.js**：  
  Vitepress 依賴 Node.js 來構建和運行靜態網站。Node.js 允許你安裝並管理專案中的各種依賴，並提供伺服器端的 JavaScript 運行環境。

- **VS Code**：  
  簡單來說，VS Code 就是工程師的 **Word**。就像 Word 用來編輯文件一樣，VS Code 是專為編寫和管理程式碼設計的強大編輯器。它支援智能提示、自動補全和擴充功能，幫助工程師更高效地開發專案。VS Code 提供了靈活的擴展能力，讓你可以根據開發需求自定義編輯環境。

#### Git、GitHub、GitHub Desktop

- **Git**：  
  一般上班族使用資料夾來管理他們的工作檔案，而工程師使用 **Git** 來管理任務和代碼。Git 是一個版本控制系統，幫助工程師追蹤代碼的變更，允許建立分支來處理不同任務，並在完成後進行合併。這樣可以有效管理專案的不同版本，確保每次變更都能被記錄和回溯。

- **GitHub**：  
  就像一般上班族接觸到的 Email 提供者（如 Outlook、Gmail），工程師則會接觸到 **GitHub**、**GitLab** 等版本控制平台。GitHub 是基於 Git 的雲端平台，用來儲存和協作管理代碼，提供了 Pull Requests、Issues 等工具來支援團隊開發。  

- **GitHub Desktop**：  
  **GitHub Desktop** 讓工程師可以遠離駭客任務般的命令行界面（CLI）世界，改用相對人性化的圖形介面。它簡化了 Git 和 GitHub 的操作，讓你可以通過視覺化的操作進行提交、推送和分支管理，而不必依賴複雜的命令行操作。對於不熟悉 CLI 的開發者來說，GitHub Desktop 提供了更直觀和便捷的開發體驗。

## 本地端運行

在完成開發環境的建置後，接下來就是將 Vitepress 專案運行在本地端，這樣你可以即時查看更改效果。本文將一步步帶你進行以下操作：從 GitHub Fork 一個 Vitepress 專案、安裝依賴、啟動本地伺服器，並在瀏覽器中查看網站。

### Fork 專案

首先，我們需要將專案 Fork 到自己的 GitHub 帳戶中。

#### 步驟

1. **前往專案網址**  
   打開 [這個 Vitepress 專案](https://github.com/Chuiantw1212/chuiantw1212.github.io)。

2. **Fork 專案**  
   在右上角點擊 **Fork** 按鈕，將這個專案複製到你的 GitHub 帳戶。

3. **修改 Fork 後的專案名稱**  
   Fork 完成後，前往你 Fork 的儲存庫頁面，點擊專案名稱旁邊的 **Settings**（設定）標籤。你 **必須** 將專案名稱修改為 `your-username.github.io`，其中 `your-username` 替換為你的 GitHub 使用者名稱。這是 GitHub Pages 自動部署的 **必須條件**，確保你的網站可以正確部署在 `https://your-username.github.io`。

   - 進入 **Settings** 後，找到 **Repository name** 欄位。
   - 修改儲存庫名稱為 `your-username.github.io`。
   - 完成後點擊 **Rename**。

4. **複製專案到本地端**  
   打開 GitHub Desktop 或使用 Git，將已改名的專案克隆到本地端：

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io
   ```

5. **推送更改並自動部署**  
   當你推送專案更改到該儲存庫後，GitHub Pages 將會自動部署你的網站並將其托管在 `https://your-username.github.io`。如果不按此格式命名，GitHub Pages 將無法自動識別並部署網站。

### 打開專案

1. **前往 GitHub 儲存庫**  
   首先，打開你 Fork 的專案儲存庫頁面。在專案頁面右上角，找到綠色的 **Code** 按鈕。點擊它會彈出一個選單，這個選單包含了多種下載和克隆專案的方式，包括 HTTPS、SSH 和 **Open with GitHub Desktop** 等選項。

2. **選擇 Open with GitHub Desktop**  
   在彈出的選單中，選擇 **Open with GitHub Desktop**。這個選項會將儲存庫直接打開到 GitHub Desktop 應用程式中。如果你的電腦尚未安裝 GitHub Desktop，系統會提示你安裝。點擊這個選項後，系統會自動切換到 GitHub Desktop 應用程式，並顯示複製專案到本地端的界面。

3. **複製專案到本地端**  
   在 GitHub Desktop 中，會看到一個視窗詢問你將專案儲存到哪個資料夾。你可以選擇本地端一個你偏好的資料夾來存放這個專案。在選擇好存放路徑後，點擊 **Clone** 按鈕。這個動作會複製整個專案到你選擇的本地資料夾中，讓你可以在本地環境下進行開發和修改。

4. **選擇用途**  
   在複製過程中，GitHub Desktop 可能會詢問你專案的用途。這是為了幫助你更好地配置開發環境。當出現選項時，選擇 **For my own purpose**，這意味著你將這個專案作為個人開發使用。點擊 **繼續** 完成這個步驟。

5. **打開專案到 VS Code**  
   專案成功複製到本地端後，你可以選擇將專案直接在 VS Code 中打開。在 GitHub Desktop 的右上角，有一個按鈕標示為 **Open in Visual Studio Code**。點擊這個按鈕，系統會自動打開 VS Code，並將你剛剛複製到本地的專案載入到編輯器中。如果你尚未安裝 VS Code，系統會提示你安裝。VS Code 開啟後，你將可以開始查看、編輯和修改專案文件。

通過這些步驟，你已經成功將專案從 GitHub 複製到本地端，並在 VS Code 中打開，可以開始進行開發工作。

### 打開 VS Code 的內建終端機

在將專案複製到本地並打開 VS Code 後，下一步是使用 VS Code 內建的終端機進行進一步的開發操作，例如安裝依賴或運行本地伺服器。VS Code 提供了一個內建終端機功能，讓你無需離開編輯器就能直接使用命令行工具。

#### 在 Mac 上打開終端機

1. 確保 VS Code 已經打開並載入了你的專案。
2. 按下 Control + `（即 Control 和鍵盤左上角的「~」按鍵，同時按下）。
3. 這將打開 VS Code 的下方區域，顯示終端機窗口，並且默認會顯示當前專案的路徑。
4. **注意**：如果你使用注音輸入法，請務必切換到英文模式，否則無法正確打開內建終端機。

#### 在 Windows 上打開終端機

1. 確保 VS Code 已經打開並載入了你的專案。
2. 按下 Ctrl + `（即 Ctrl 和鍵盤左上角的「~」按鍵，同時按下）。
3. 與 Mac 相同，終端機會在 VS Code 的下方區域打開，並顯示當前專案的路徑。
4. **注意**：如果使用注音輸入法，也需要切換到英文模式，否則內建終端機可能無法正確打開。

#### 輸入對應的指令

1. 在 VS Code 的內建終端機中，輸入以下指令來安裝專案所需的依賴：

   ```bash
   npm install
   ```

2. 安裝完成後，啟動 VitePress 本地開發伺服器，運行以下指令：

   ```bash
   npx vitepress dev
   ```

3. 運行該指令後，VS Code 終端機會顯示本地開發伺服器的網址，預設為 `http://localhost:5173`。你可以打開瀏覽器，訪問該網址來預覽你的網站。

## GitHub 說明與設定

GitHub Actions 與 GitHub Pages 是 GitHub 提供的兩項功能，它們可以配合使用來實現自動化部署靜態網站。

### GitHub Actions

在 VitePress 專案中，你可以通過以下步驟來設定 GitHub Actions，實現網站的自動化部署：

1. **建立工作流程檔案**  
   在你的專案中，創建一個 `.github/workflows` 資料夾，並新增一個 `.yml` 檔案（例如 `deploy.yml`）。這個檔案用來定義自動化流程。

2. **配置觸發條件**  
   在 `.yml` 檔案中，設定工作流程的觸發條件。例如，當代碼推送到 `main` 分支時自動執行構建和部署：

   ```yaml
   # Sample workflow for building and deploying a VitePress site to GitHub Pages
   name: Deploy VitePress site to Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: pages
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: npm
         - name: Install dependencies
           run: npm ci
         - name: Build with VitePress
           run: npm run docs:build
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: .vitepress/dist

     deploy:
       environment:
         name: github-pages
       needs: build
       runs-on: ubuntu-latest
       steps:
         - name: Deploy to GitHub Pages
           uses: actions/deploy-pages@v4
   ```

3. **自動化部署**  
   當你將代碼推送到 `main` 分支後，GitHub Actions 會自動運行上述工作流程，並將構建好的網站部署到 GitHub Pages，實現無需手動操作的自動化部署。

### Github Pages

**GitHub Pages** 是 GitHub 提供的一個免費靜態網站託管服務，特別適合用於 VitePress 網站的部署。透過 GitHub Pages，你可以將專案中的靜態文件自動生成為網站，並進行托管。操作流程如下：

1. 前往你的 GitHub 專案頁面，點擊頂部的 **Settings**（設定）標籤。
2. 在設定頁面中，向下滾動，找到 **Pages** 部分。
3. 在 **Source** 的下拉選單中，選擇 **GitHub Actions** 作為網站的部署來源。這會讓 GitHub Pages 根據你的 GitHub Actions 工作流程自動構建和部署網站。
4. 點擊 **Save** 保存設定。

完成這些步驟後，GitHub Pages 會自動通過 GitHub Actions 工作流程，從專案的正確分支和目錄中生成並部署你的網站。

## 發布與修改

在進行 Vitepress 專案的開發過程中，你可以使用 VS Code 修改網站的配置，並使用 GitHub Desktop 將變更發布到 GitHub Pages。這樣，網站會自動更新並反映最新的變更。以下是詳細的步驟說明。

### 修改 Vitepress 標題

1. **打開 VS Code**  
   使用 VS Code 開啟你的 Vitepress 專案，並導航至專案目錄中的 `.vitepress/config.js` 檔案。

2. **修改網站標題**  
   在 `config.js` 檔案中，找到 `title` 屬性並修改它。例如：

   ```javascript
   export default {
     title: '我的新網站標題',
     description: '這是網站的描述'
   }
   ```

3. **保存變更**  
   **強調：一定要保存檔案！**  
   按下 **Ctrl + S**（Windows）或 **Command + S**（Mac）來保存修改。  
   - 只有保存了變更後，才能在本地瀏覽器中看到更新的結果。
   - 保存後，這些變更才會記錄在本地的 Git 中，這樣你才能在後續使用 GitHub Desktop 提交變更。

### 透過 GitHub Desktop 發布

1. **打開 GitHub Desktop**  
   使用 GitHub Desktop 開啟你的專案，它會自動檢測到你在 VS Code 中所做的變更。

2. **提交變更**  
   在 GitHub Desktop 中輸入提交訊息，描述你所做的變更，例如「修改網站標題」，然後點擊 **Commit to main**。

3. **推送到 GitHub**  
   提交變更後，點擊右上角的 **Push origin**，將本地的變更推送到 GitHub 儲存庫。這將觸發 GitHub Actions 自動部署網站。

### 確認網站更新

當你推送代碼到 GitHub 後，GitHub Actions 會自動執行並部署你的網站。要確認網站是否已成功更新，請按照以下步驟進行檢查：

1. **前往 GitHub Pages 網站**  
   部署完成後，你可以通過以下網址訪問你的網站：  
   `https://你的用戶名.github.io/`

2. **檢查更新是否生效**  
   開啟瀏覽器，進入上述網址，檢查你在 VS Code 中進行的修改是否已反映到網站上。例如，確認網站標題或內容是否已更新。

3. **驗證所有功能正常**  
   瀏覽網站，確保所有連結、圖片以及其他功能正常運行。如果出現問題，返回專案進行調整並重新推送變更。

通過這些步驟，你可以輕鬆確認 VitePress 網站的變更是否已成功部署到 GitHub Pages。


## 線上/實體講座

### 簡報

<LazySlide shareLink="https://docs.google.com/presentation/d/1N_rlj0UvRpO1gqXPaB5nf4D9E5VOvV-3eG5HRXUmOwk/edit?usp=drive_link">
    <iframe src="https://docs.google.com/presentation/d/1N_rlj0UvRpO1gqXPaB5nf4D9E5VOvV-3eG5HRXUmOwk/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

### 評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR1alZykvevitpuRy6lw7JAtRn9LmqZ2WCAkgd_LhxMS3G0bEW6uiY3X-t-S3gNqMFOxo1n7JzcSZi2/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

## 外部資源

<table>
    <thead>
        <tr>
            <th>名稱</th>
            <th>說明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <a href="https://nodejs.org/" target="_blank">Node.js</a>
            </td>
            <td>任何會寫Javascript的人都需要的網站</td>
        </tr>
        <tr>
            <td>
                <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a>
            </td>
            <td>我最偏好的程式編輯器</td>
        </tr>
        <tr>
            <td>
                <a href="https://vitepress.dev/" target="_blank">VitePress官方網站</a>
            </td>
            <td>VitePress官方網站</td>
        </tr>
        <tr>
            <td>
                <a href="https://pages.github.com/" target="_blank">Github Pages</a>
            </td>
            <td>可以免費託管VitePress部落格的服務</td>
        </tr>
         <tr>
            <td>
                <a href="https://desktop.github.com/" target="_blank">Github Desktop</a>
            </td>
            <td>Github所屬的Git GUI的官方網站</td>
        </tr>
    </tbody>
</table>

<script setup>
import LazySlide from '../components/lazySlide.vue'
</script>
