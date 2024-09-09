---
description: Vitepress無本部落格，適合前端初學者、文字工作者學習，自由掌握內容，免費託管，建立屬於自己的線上空間。
outline: deep
---

# VitePress無本部落格

《VitePress無本部落格》涵蓋環境建置、本機運行、發布與修改、進階設定等內容。適合想學習前端的初學者、希望脫離平台倒閉困擾的使用者，以及不想負擔部落格託管費用的使用者。這個指南將帶您一步步建立並管理自己的無本部落格，實現高效、低成本的網路內容創作。
<!--  -->

## 環境建置

### 1. 安裝 Node.js

Vitepress 是基於 Vite 和 Vue 的靜態網站生成器，而 Vite 又依賴於 Node.js，因此安裝 Node.js 是不可或缺的一步。

#### 安裝步驟：

1. **前往 Node.js 官方網站**  
   打開 [Node.js 官方網站](https://nodejs.org/)，你會看到兩個選項：「LTS」和「Current」。
   - **LTS (長期支援版)**：這是更穩定的版本，推薦使用。
   - **Current (最新版本)**：包含最新的功能，但相對不穩定。

2. **下載並安裝 Node.js**  
   下載適合你作業系統的安裝檔案，並按照提示安裝。保留預設設置即可。

3. **確認安裝成功**  
   打開終端機（或命令提示字元），輸入以下指令來檢查是否正確安裝：
   ```bash
   node -v
   ```
   若顯示版本號，表示安裝成功。

### 2. 安裝 VS Code (Visual Studio Code)

VS Code 是一款功能強大的免費編輯器，支援各種編程語言，並且與 Vitepress 的開發流程相當契合。

#### 安裝步驟：

1. **前往 VS Code 官方網站**  
   到 [VS Code 官方網站](https://code.visualstudio.com/) 下載適合你作業系統的安裝檔案。

2. **安裝 VS Code**  
   選擇預設選項並完成安裝。

3. **安裝 Vitepress 所需擴充功能（可選）**  
   雖然本文不需要介紹額外的開發工具，但 VS Code 內建擴充功能，可以為 Vitepress 開發提供便利，比如 Vue.js 支援擴充功能，幫助你更好地編寫 Vue 組件。

### 3. 安裝 GitHub Desktop

GitHub Desktop 是管理 Git 儲存庫的圖形化工具，對於想要與 GitHub 上的儲存庫同步專案的人來說非常方便。使用它來管理你的 Vitepress 專案可以讓流程更加簡單。

#### 安裝步驟：

1. **前往 GitHub Desktop 官方網站**  
   打開 [GitHub Desktop 官方網站](https://desktop.github.com/) 並下載對應版本的安裝檔案。

2. **安裝並登入**  
   完成安裝後，使用你的 GitHub 帳戶登入。如果你還沒有 GitHub 帳戶，現在可以前往 [GitHub](https://github.com/) 註冊。

## 本地端運行

在完成開發環境的建置後，接下來就是將 Vitepress 專案運行在本地端，這樣你可以即時查看更改效果。本文將一步步帶你進行以下操作：從 GitHub Fork 一個 Vitepress 專案、安裝依賴、啟動本地伺服器，並在瀏覽器中查看網站。

### 1. Fork 專案

首先，我們需要將專案 Fork 到自己的 GitHub 帳戶中。

#### 步驟：

1. **前往專案網址**  
   打開 [這個 Vitepress 專案](https://github.com/Chuiantw1212/chuiantw1212.github.io)。

2. **Fork 專案**  
   在右上角點擊 **Fork** 按鈕，將這個專案複製到你的 GitHub 帳戶。

3. **複製專案到本地端**  
   打開 GitHub Desktop 或者使用 Git，將專案克隆到本地端：
   ```bash
   git clone https://github.com/YOUR_USERNAME/chuiantw1212.github.io
   ```

### 2. 使用 VS Code 打開專案

接下來，我們將使用 VS Code 開啟這個專案並進行開發。

#### 步驟：

1. **開啟 VS Code**  
   安裝好 VS Code 後，打開應用程式。

2. **打開專案資料夾**  
   在 VS Code 中，選擇「檔案 -> 開啟資料夾」並導航到你剛剛克隆的專案資料夾。

### 3. 安裝依賴並啟動本地伺服器

在專案資料夾中，我們將使用 npm 安裝所需的依賴並啟動本地開發伺服器。

#### 步驟：

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
   開啟你的瀏覽器，訪問以下網址來查看本地運行的網站：
   [http://localhost:5173/](http://localhost:5173/)

## 投影片

<iframe src="https://docs.google.com/presentation/d/1N_rlj0UvRpO1gqXPaB5nf4D9E5VOvV-3eG5HRXUmOwk/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

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
