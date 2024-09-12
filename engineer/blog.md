---
description: Vitepress無本部落格，適合前端初學者、文字工作者學習，自由掌握內容，免費託管，建立屬於自己的線上空間。
outline: [2,3]
---

# VitePress無本部落格

《VitePress無本部落格》涵蓋環境建置、本機運行、發布與修改、進階設定等內容。適合想學習前端的初學者、希望脫離平台倒閉困擾的使用者，以及不想負擔部落格託管費用的使用者。這個指南將帶您一步步建立並管理自己的無本部落格，實現高效、低成本的網路內容創作。

## 環境建置

### 安裝 Node.js

Vitepress 是基於 Vite 和 Vue 的靜態網站生成器，而 Vite 又依賴於 Node.js，因此安裝 Node.js 是不可或缺的一步。

#### 安裝步驟

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

### 安裝 VS Code (Visual Studio Code)

VS Code 是一款功能強大的免費編輯器，支援各種編程語言，並且與 Vitepress 的開發流程相當契合。

#### 安裝步驟

1. **前往 VS Code 官方網站**  
   到 [VS Code 官方網站](https://code.visualstudio.com/) 下載適合你作業系統的安裝檔案。

2. **安裝 VS Code**  
   選擇預設選項並完成安裝。

3. **安裝 Vitepress 所需擴充功能（可選）**  
   雖然本文不需要介紹額外的開發工具，但 VS Code 內建擴充功能，可以為 Vitepress 開發提供便利，比如 Vue.js 支援擴充功能，幫助你更好地編寫 Vue 組件。

### 安裝 GitHub Desktop

GitHub Desktop 是管理 Git 儲存庫的圖形化工具，對於想要與 GitHub 上的儲存庫同步專案的人來說非常方便。使用它來管理你的 Vitepress 專案可以讓流程更加簡單。

#### 安裝步驟

1. **前往 GitHub Desktop 官方網站**  
   打開 [GitHub Desktop 官方網站](https://desktop.github.com/) 並下載對應版本的安裝檔案。

2. **安裝並登入**  
   完成安裝後，使用你的 GitHub 帳戶登入。如果你還沒有 GitHub 帳戶，現在可以前往 [GitHub](https://github.com/) 註冊。

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

## 進階設定

在完成基礎的 Vitepress 環境建置和修改發布後，你可以進行一些進階設定來提升網站效能與使用體驗。本文將帶你完成以下設定：GA（Google Analytics）埋設、介面中文化、添加搜尋功能，以及優化 SEO 的 meta 設定。

### GA（Google Analytics）埋設

透過 Google Analytics（GA），你可以追蹤網站的使用數據，了解訪客行為。以下是如何在 Vitepress 中嵌入 GA 代碼。

#### 步驟

1. **申請 Google Analytics 帳號**  
   前往 [Google Analytics](https://analytics.google.com/) 註冊並創建帳戶。完成後，你將獲得一個追蹤代碼（格式為 `G-XXXXXXXXXX`）。

2. **編輯 `config.js` 文件**  
   在 `docs/.vitepress/config.js` 中的 `head` 區塊加入 GA 代碼：

   ```javascript
   export default {
     title: '你的網站標題',
     description: '你的網站描述',
     head: [
       [
         'script',
         {
           async: true,
           src: `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`,
         },
       ],
       [
         'script',
         {},
         `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');`,
       ],
     ],
   }
   ```

3. **確認 GA 是否生效**  
   儲存後重新啟動伺服器，並使用 Google Analytics 的實時數據來確認流量追蹤是否正常。

### 中文化

在 Vitepress 中設置多語系不僅限於修改基本語言參數，還可以自訂一些與用戶互動的元素，如日期格式、導航標籤及其他界面文字。以下是具體的配置方式：

#### 步驟

1. **設置語言及界面文本**  
   在 `config.js` 中的 `themeConfig` 區塊內進行以下設定，這不僅會將介面中文化，還會調整與頁面更新日期、頁腳導航、模式切換等相關的顯示文字：

   ```javascript
   export default {
     lang: 'zh-TW',
     title: '你的網站標題',
     description: '你的網站描述',
     themeConfig: {
       lastUpdated: {
         text: '上次更新',
         formatOptions: {
           forceLocale: true,
           year: 'numeric',
           month: '2-digit',
           day: '2-digit',
           hour: 'numeric',
           minute: 'numeric',
           second: 'numeric',
         },
       },
       docFooter: {
         prev: '上一頁',
         next: '下一頁',
       },
       darkModeSwitchLabel: '深色模式',
       sidebarMenuLabel: '選單',
       returnToTopLabel: '回到頂端',
       outline: {
         label: '大綱',
       },
     },
   }
   ```

2. **參數詳解**:
   - **lastUpdated**: 顯示文件最後更新的時間。`formatOptions` 允許自定義時間格式，並強制使用 `zh-TW` 的本地化日期格式。
   - **docFooter**: 自訂頁面底部的前後頁導航文字，適合多頁文件的網站。
   - **darkModeSwitchLabel**: 切換深色模式的標籤。
   - **sidebarMenuLabel**: 設置側邊欄選單的標籤名稱。
   - **returnToTopLabel**: 用於頁面底部回到頂端的按鈕標籤。
   - **outline**: 自訂顯示文檔大綱的標籤名稱。

3. **確認效果**  
   完成這些設置後，重新啟動本地伺服器，並查看網站是否已正確應用多語系設定。

### 添加搜尋功能：使用 `vitepress-plugin-search`

除了內建的簡單搜尋功能，Vitepress 還可以通過社群插件來增強搜尋體驗。這裡介紹如何使用 `vitepress-plugin-search` 來實現站內搜尋功能。

#### 步驟

1. **安裝 `vitepress-plugin-search`**  
   首先，你需要安裝這個插件。進入專案目錄後，運行以下指令：

   ```bash
   npm install vitepress-plugin-search --save
   ```

2. **修改 `config.js` 配置**  
   在 `config.js` 文件中，導入並使用這個插件：

   ```javascript
   import { SearchPlugin } from 'vitepress-plugin-search';

   export default {
     title: '你的網站標題',
     description: '你的網站描述',
     themeConfig: {
       // 其他配置
     },
     plugins: [
       SearchPlugin({
         // 你可以根據需要設置選項
         placeholder: '搜尋文件',
         maxSuggestions: 10,
       }),
     ],
   }
   ```

3. **自定義搜尋選項**  
   `vitepress-plugin-search` 提供了一些選項可以進行自定義，例如：
   - **placeholder**: 搜尋欄中的預設提示文字。
   - **maxSuggestions**: 搜尋結果的最大顯示數量。
   - **ignore**: 你可以指定不想要被索引的檔案或路徑。

4. **啟動開發伺服器並測試**  
   完成設定後，重新啟動伺服器：

   ```bash
   npm run docs:dev
   ```

   打開瀏覽器，搜尋欄現在應該可以正常使用，並顯示文件中的搜尋結果。

### 設定 meta 強化 SEO

優化網站的 SEO 有助於提升搜尋引擎的可見性。可以通過 `config.js` 設置全局 meta 標籤，也可以在每個 `.md` 檔案中設置自定義的 meta 標籤來強化該頁面的 SEO。

#### 步驟

1. **在 `config.js` 中設置 meta 標籤**  
   你可以在 `head` 區塊中加入以下 meta 標籤：

   ```javascript
   export default {
     title: '你的網站標題',
     description: '你的網站描述',
     head: [
       ['meta', { name: 'keywords', content: '關鍵字1, 關鍵字2, 關鍵字3' }],
       ['meta', { name: 'author', content: '你的姓名' }],
       ['meta', { name: 'description', content: '這是你的網站描述' }],
       ['meta', { property: 'og:title', content: '你的網站標題' }],
       ['meta', { property: 'og:description', content: '你的網站描述' }],
       ['meta', { property: 'og:image', content: '/path/to/image.png' }],
     ],
   }
   ```

2. **在每個 `.md` 檔案中設置自定義 meta 標籤**  
為了針對特定頁面進行 SEO 優化，可以在每個 Markdown 文件的開頭加入以下語法來設置自定義的 meta 標籤：

    ```markdown
    ---
    description: 提供開源專案管理工具的詳細教學，適合初學者與有經驗的開發者。
    head:
    - - meta
        - name: og:image
          property: og:image
          content: /images/guide/cover.png
    ---
    ```

   - **description**: 這個欄位描述該頁面的內容，可以幫助搜尋引擎更好地索引你的網頁。範例中的描述解釋了頁面的目的是教學和專案管理。
   - **head**: 在 `head` 區塊中，我們加入了一個 `og:image`，這是 Open Graph 用於社交媒體分享的預覽圖片，內容可以是你希望在分享時展示的圖像路徑。

    這樣的設置能夠針對每個頁面進行個性化優化，讓 SEO 效果更加精準。

## 線上/實體講座

### 投影片

<LazySlide>
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
