---
description: Vitepress無本部落格，適合前端初學者、文字工作者學習，自由掌握內容，免費託管，建立屬於自己的線上空間。
outline: [2,3]
---

# VitePress無本部落格

《VitePress無本部落格》涵蓋環境建置、本機運行、發布與修改、進階設定等內容。適合想學習前端的初學者、希望脫離平台倒閉困擾的使用者，以及不想負擔部落格託管費用的使用者。這個指南將帶您一步步建立並管理自己的無本部落格，實現高效、低成本的網路內容創作。

## 環境建置

在進行 Vitepress 開發之前，首先需要完成一些必要的環境設定。以下是你需要依序完成的步驟，從打開終端機到安裝開發工具，確保你具備所有必要的工具來順利啟動專案。

### 打開終端機

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

---

### 安裝 Node.js

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

---

### 安裝 Git

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

---

### 安裝 VS Code (Visual Studio Code)

VS Code 是一款免費且強大的編輯器，支援各種編程語言，與 Vitepress 的開發流程相當契合。

#### 安裝步驟

1. **前往 VS Code 官方網站**  
   到 [VS Code 官方網站](https://code.visualstudio.com/) 下載適合你作業系統的安裝檔案。

2. **安裝 VS Code**  
   執行安裝檔案，並按照提示完成安裝。你可以保留預設選項即可。

3. **安裝 Vitepress 所需擴充功能（可選）**  
   雖然本文不需要介紹額外的開發工具，但你可以安裝一些擴充功能來提升開發效率，例如 Vue.js 擴充功能，以幫助編寫 Vue 組件。

---

### 註冊 GitHub 帳號

GitHub 是用來存放及分享代碼的平台。如果你還沒有 GitHub 帳號，可以按照以下步驟來註冊：

#### 註冊步驟

1. **前往 GitHub 官方網站**  
   打開 [GitHub 官方網站](https://github.com/)。

2. **建立新帳號**  
   點擊右上角的「Sign up」，然後按照頁面提示輸入你的電子郵件、密碼等信息來註冊帳號。

3. **完成註冊**  
   按照頁面的引導完成帳號的設置，包括設定使用者名稱和選擇方案（你可以選擇免費方案）。

---

### 安裝 GitHub Desktop

GitHub Desktop 是 Git 的圖形化工具，讓你可以更加方便地管理和同步 GitHub 儲存庫，對於不熟悉命令行的使用者來說十分方便。

#### 安裝步驟

1. **前往 GitHub Desktop 官方網站**  
   打開 [GitHub Desktop 官方網站](https://desktop.github.com/) 並下載適合你作業系統的安裝檔案。

2. **安裝並登入**  
   完成安裝後，打開 GitHub Desktop，並使用你的 GitHub 帳號登入。如果你還沒有 GitHub 帳號，可以在安裝前按照上面「註冊 GitHub 帳號」的步驟進行註冊。

完成這些環境設定後，你就具備了啟動 Vitepress 專案所需的基本工具。你現在可以進行專案的初始化，開始你的開發旅程。

## 本地端運行

在完成開發環境的建置後，接下來就是將 Vitepress 專案運行在本地端，這樣你可以即時查看更改效果。本文將一步步帶你進行以下操作：從 GitHub Fork 一個 Vitepress 專案、安裝依賴、啟動本地伺服器，並在瀏覽器中查看網站。

### Fork 專案

首先，我們需要將專案 Fork 到自己的 GitHub 帳戶中。

#### 步驟

1. **前往專案網址**  
   打開 [這個 Vitepress 專案](https://github.com/Chuiantw1212/chuiantw1212.github.io)。

2. **Fork 專案**  
   在右上角點擊 **Fork** 按鈕，將這個專案複製到你的 GitHub 帳戶。

3. **複製專案到本地端**  
   打開 GitHub Desktop 或者使用 Git，將專案克隆到本地端：

   ```bash
   git clone https://github.com/YOUR_USERNAME/chuiantw1212.github.io
   ```

### 使用 VS Code 打開專案

接下來，我們將使用 VS Code 開啟這個專案並進行開發。

#### 步驟

1. **開啟 VS Code**  
   安裝好 VS Code 後，打開應用程式。

2. **打開專案資料夾**  
   在 VS Code 中，選擇「檔案 -> 開啟資料夾」並導航到你剛剛克隆的專案資料夾。

### 安裝依賴並啟動本地伺服器

在專案資料夾中，我們將使用 npm 安裝所需的依賴並啟動本地開發伺服器。

#### 步驟

1. **安裝依賴**  
   在 VS Code 的終端機中，輸入以下指令來安裝專案所需的依賴：

   ```bash
   npm install
   ```

2. **啟動本地伺服器**  
   接著，輸入以下指令來啟動開發伺服器：

   ```bash
   npm run docs:dev
   ```

3. **造訪本地網站**  
   開啟你的瀏覽器，訪問localhost來查看本地運行的網站：

## GitHub 說明與設定

在 Vitepress 專案開發過程中，使用 Git、GitHub、GitHub Desktop、GitHub Actions 和 GitHub Pages 是十分重要的，它們各自扮演不同的角色，能夠幫助你管理版本、協作開發，並自動將網站部署到網絡上。以下將詳細介紹它們的差異與設定。

### Git, GitHub, GitHub Desktop

1. **Git**  
   Git 是一個開源的版本控制系統，允許開發者在本地追蹤代碼的變更，進行分支管理，合併和版本控制，適合多人協作開發。每個開發者的本地環境都有完整的代碼歷史，這意味著即使沒有網絡連接，開發者也可以進行提交、創建分支等操作。Git 的靈活性和強大的分支系統使其成為當今最流行的版本控制工具之一。

2. **GitHub**  
   GitHub 是基於 Git 的雲端平台，提供了一個集中式的代碼托管服務，讓開發者能夠在互聯網上共享和協作管理代碼。除了版本控制外，GitHub 還提供了強大的協作工具，如 Pull Requests、Issues 追蹤、以及與其他開發人員進行代碼審查的功能。GitHub 的附加功能（例如 GitHub Actions）允許自動化工作流和部署，這對於現代開發流程來說至關重要，因為它能夠將開發與運維自動化集成在一起。

3. **GitHub Desktop**  
   GitHub Desktop 是 Git 和 GitHub 的圖形化應用程式，旨在簡化 Git 工作流，特別是對於不熟悉命令行的使用者。通過 GitHub Desktop，用戶可以視覺化地進行 Git 操作，從而避免了使用命令行的繁瑣過程。如果沒有這個圖形化介面，用戶將不得不面對像駭客任務般的黑色命令行窗口，依賴手動輸入指令來進行操作，這對沒有技術背景的使用者來說，充滿挑戰且不直觀。CLI 操作需要記住諸如 `git init`、`git add`、`git commit`、`git push` 等命令，而 GitHub Desktop 將這些操作簡化為按幾個按鈕即可完成，極大降低了學習門檻。

   GitHub Desktop 提供了一個更直觀的使用體驗，讓用戶能輕鬆完成提交、推送、合併等操作，專注於開發和協作，無需面對命令行的複雜性。

**關係**：  

- **Git** 是版本控制系統的核心，負責管理本地的代碼版本。
- **GitHub** 是基於 Git 的雲端平台，用來在互聯網上托管和協作管理 Git 儲存庫。
- **GitHub Desktop** 提供了一個圖形化的操作界面，讓開發者可以更加輕鬆地在本地使用 Git 和 GitHub 進行操作，簡化了命令行的繁瑣流程。

### GitHub Actions

GitHub Actions 是 GitHub 提供的一種自動化工具，可以在代碼推送到指定分支時，自動執行工作流，如構建、測試和部署。對於 Vitepress 網站來說，GitHub Actions 可以用來自動構建和部署網站到 GitHub Pages。

#### 1. 設定 GitHub Actions

在 Vitepress 專案中，你可以使用 GitHub Actions 來自動部署網站。以下是具體步驟：

1. **啟用 GitHub Actions**
   - 前往你的 GitHub 專案頁面，點擊 **Actions** 分頁，選擇 **I understand my workflows, go ahead and enable them**，啟用 Actions 功能。

2. **建立工作流程文件**
   - 在 Vitepress 專案中，建立 `.github/workflows` 資料夾，並在該資料夾下新增 `deploy.yml` 檔案來定義自動化工作流。

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

3. **提交並推送到 GitHub**
   - 當你將代碼推送到 `main` 分支時，GitHub Actions 會自動執行構建並部署你的 Vitepress 網站。

---

### GitHub Pages

GitHub Pages 是 GitHub 提供的一個免費的靜態網站託管服務，可以自動將代碼中的靜態文件生成網站。它非常適合 Vitepress 開發的網站部署。

1. **功能與特點**：
   - 免費的靜態網站託管服務，可以將網站托管在 GitHub 提供的域名下。
   - 支持與 GitHub Actions 結合進行自動化部署。
   - 支持自定義域名。

2. **設定流程**：
   - 前往專案的 **Settings** 分頁，找到 **Pages** 頁面。
   - 在 **Source** 下拉選單中選擇 **GitHub Actions** 作為部署來源。
   - 保存設定後，GitHub Pages 會自動從你的專案中構建並部署靜態網站。

## 發布與修改

在完成 Vitepress 專案的開發後，將這些變更發布到 GitHub，並通過 GitHub Pages 展示網站給使用者。以下是詳細的發布與修改步驟，包括如何啟用 GitHub Actions、設定 GitHub Pages，以及使用 VS Code 和 GitHub Desktop 進行專案的變更與發布。

### 使用 VS Code 變更 Vitepress 專案的標題

在 Vitepress 專案中，修改專案的標題非常簡單。你只需要編輯專案的設定檔案。

#### 變更步驟

1. **打開 VS Code**
   使用 VS Code 打開你的 Vitepress 專案。

2. **找到設定檔案**
   尋找專案根目錄中的 `docs/.vitepress/config.js` 檔案，這是 Vitepress 的主要設定檔案。

3. **修改標題**
   在 `config.js` 檔案中，找到 `title` 屬性，並修改為你想要的新標題。範例如下：

   ```javascript
   export default {
     title: '我的新網站標題',
     description: '這是網站的描述'
   }
   ```

4. **保存變更**
   修改完後，按下 **Command + S**（Mac）或 **Ctrl + S**（Windows）保存變更。

---

### 使用 GitHub Desktop 發布變更

當你在 VS Code 中完成了專案修改後，你可以使用 GitHub Desktop 將這些變更推送到 GitHub。

#### 發布步驟

1. **打開 GitHub Desktop**
   打開 GitHub Desktop，並確保你已經連接到專案的本地版本庫。

2. **提交變更**
   在 GitHub Desktop 中，你將看到所有已修改的檔案。輸入提交訊息描述你的變更，然後點擊 **Commit to main** 按鈕。

3. **推送變更到 GitHub**
   提交變更後，點擊右上角的 **Push origin** 按鈕，將本地的變更推送到 GitHub。

---

### 確認網站更新

當你推送了代碼並觸發了 GitHub Actions 自動部署後，可以檢查網站是否更新。

#### 確認步驟

1. **檢查 GitHub Pages 網站**
   在瀏覽器中打開你的 GitHub Pages 網站，通常是 `https://你的用戶名.github.io/專案名`。

2. **驗證變更**
   檢查網站是否反映了你在 Vitepress 專案中所做的修改，例如變更的標題等。

---

這些步驟將幫助你順利設定自動化工作流，並通過 GitHub Pages 發布與更新你的 Vitepress 專案，確保每次變更都能快速呈現給網站的使用者。

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
