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

## 發布與修改

當你已經在本地成功運行 Vitepress 專案後，下一步就是學會如何修改專案內容並發布到 GitHub Pages 上。本文將帶你一步步操作：如何在 VS Code 中變更 Vitepress 專案的標題，以及如何使用 GitHub Desktop 將這些變更發布到 GitHub Pages。

### 使用 VS Code 變更 Vitepress 專案的標題

在 Vitepress 專案中，網站的標題通常位於配置文件中，例如 `docs/.vitepress/config.js`。讓我們來看看如何變更標題。

#### 步驟

1. **打開 `config.js` 文件**  
   在 VS Code 中，導航到專案的 `docs/.vitepress/` 資料夾，找到 `config.js` 文件並打開它。

2. **修改標題**  
   找到配置文件中的 `title` 欄位。這個欄位定義了網站顯示的標題。你可以修改如下：

   ```javascript
   export default {
     title: '新網站標題',  // 將原標題替換為你想要的新標題
     description: '這是我的 Vitepress 網站',
   }
   ```

3. **保存文件**  
   修改完成後，按下 `Ctrl + S` 或 `Cmd + S` 保存文件。

4. **查看本地變更**  
   在終端機中，確保開發伺服器正在運行。你可以刷新localhost來查看標題是否已正確更改。

### 使用 GitHub Desktop 發布變更

當你對專案的變更感到滿意後，我們可以使用 GitHub Desktop 將這些變更發布到 GitHub Pages。

#### 步驟

1. **打開 GitHub Desktop**  
   打開 GitHub Desktop 應用程式，並確保已登入你的帳戶並打開了專案儲存庫。

2. **確認變更**  
   GitHub Desktop 會自動偵測你在 VS Code 中所做的變更。你應該會看到文件的修改列表，確保變更內容（例如 `config.js` 的修改）顯示正確。

3. **提交變更**  
   在下方的欄位中輸入簡短的變更說明（例如：「更新網站標題」），然後點擊 `Commit to main`。

4. **推送到遠端儲存庫**  
   提交變更後，點擊右上角的 `Push origin`，將變更推送到 GitHub。

5. **更新 GitHub Pages**  
   若你的專案已設定為透過 GitHub Pages 發布，推送到 `main` 分支後，GitHub Pages 會自動更新網站。你可以在 GitHub Pages 頁面查看變更是否已經生效。

### 確認網站更新

幾分鐘後，前往你的 GitHub Pages 網站，應該可以看到最新的變更已經生效。如果你還沒有設置 GitHub Pages，請參考 [GitHub Pages 官方說明](https://docs.github.com/en/pages) 來了解如何設定。

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
