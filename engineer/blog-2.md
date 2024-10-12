---
description: Vitepress無本部落格，適合前端初學者、文字工作者學習，自由掌握內容，免費託管，建立屬於自己的線上空間。
outline: [2,3]
---

# VitePress無本部落格 (下)

大綱還在想。

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
