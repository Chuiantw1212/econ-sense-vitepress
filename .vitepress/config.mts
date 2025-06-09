import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  /** 
   * Site Metadata
   * https://vitepress.dev/reference/site-config#site-metadata
   */
  title: "海德堡隱士居",
  description: "海德堡隱士居是一座認知實驗基地，專注於性格測驗、財務思維與個人成長策略，帶你深度讀懂自己，用最高CP值接軌世界。",
  head: [
    ['link', { rel: 'icon', href: 'favicon.ico' }],
    // https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/?utm_source=lighthouse&utm_medium=devtools
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // Google Analytics
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-19NFT8GVCZ' }],
    ['script', {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-19NFT8GVCZ');`
    ],
  ],
  lang: 'zh',
  /**
   * Routing
   */
  // cleanUrls: true, // 加了會讓Line抓不到縮圖
  /**
   * Theme config (包含i18n)
   * https://vitepress.dev/reference/default-theme-config
   */
  themeConfig: {
    nav: [
      { text: '理財機房', link: '/finance' },
      { text: '成長艙室', link: '/growth' },
      { text: '人類觀察室', link: '/human' },
      { text: '生活實驗室', link: '/life' },
      { text: '技術研究室', link: '/tech' },
    ],
    sidebar: [
      {
        text: '線上/實體講座',
        link: '/calendar',
      },
        {
        text: '心火七職測驗',
        link: '/core7',
      },
      {
        text: '理財機房',
        link: '/finance',
        collapsed: false,
        items: [
          { text: '金錢人格DNA', link: '/finance/personality' },
          { text: '理財框架', link: '/finance/framework' },
          { text: '投資進階管道', link: '/finance/investment' },
          { text: '退休規劃(上)', link: '/finance/retirement-1' },
          { text: '退休規劃(下)', link: '/finance/retirement-2' },
          { text: '不買保險的保險觀', link: '/finance/insurance' },
          // { text: '說書: 金錢整理術', link: '/finance/management' },
          // { text: '財商桌遊: 小富翁大贏家', link: '/finance/financemj' },
        ]
      },
      {
        text: '成長艙室',
        link: '/growth',
        collapsed: false,
        items: [
          { text: 'MBTI內在世界建構法', link: '/growth/mbti' },
          { text: '何倫碼測驗&NLP職涯', link: '/growth/riasec' },
          { text: '軟體專案實務', link: '/growth/project' },
          // { text: '我是學渣，也是黑馬', link: '/growth/education' },
          // { text: '打造知識飛輪', link: '/growth/flywheel' },
        ]
      },
      {
        text: '人類觀察室',
        link: '/human',
        collapsed: false,
        items: [
          { text: '心火七職: 狩獵者', link: '/human/hunter' },
          { text: '說書: 人類大歷史', link: '/human/sapiens' },
          { text: '人生關卡的演化解答', link: '/human/evolution' },
          { text: '後備預官的民防心得', link: '/human/war' },
          { text: '單身狗地獄求生', link: '/human/single' },
        ]
      },
      {
        text: '生活實驗室',
        link: '/life',
        collapsed: false,
        items: [
          { text: '我是照顧者', link: '/life/carer' },
          { text: '愛之語', link: '/life/love-language' },
          { text: '從單車休閒到環島全攻略', link: '/life/cycling' },
          // { text: '極簡全齡宅', link: '/life/housing' },
        ]
      },
      {
        text: '技術研究室',
        link: '/tech',
        collapsed: false,
        items: [
          { text: '軟體職涯入門', link: '/tech/beginner' },
          { text: '網站初學須知', link: '/tech/web' },
          { text: '地表最快Node.js', link: '/tech/nodejs' },
          { text: 'VitePress無本部落格(上)', link: '/tech/blog-1' },
          { text: 'VitePress無本部落格(下)', link: '/tech/blog-2' },
          { text: '電腦DIY', link: '/tech/computer' },
        ]
      },
      {
        text: '關於EN Chu',
        link: '/about'
      },
    ],
    socialLinks: [
      {
        ariaLabel: 'Line群組',
        link: 'https://line.me/ti/g2/w2xjp79QxMO76vVw_aQuEqeH2ahdcn7uY7lQAg', icon: {
          svg: `<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 296.528 296.528" xml:space="preserve">
     <g>
       <path d="M295.838,115.347l0.003-0.001l-0.092-0.76c-0.001-0.013-0.002-0.023-0.004-0.036c-0.001-0.011-0.002-0.021-0.004-0.032
         l-0.344-2.858c-0.069-0.574-0.148-1.228-0.238-1.974l-0.072-0.594l-0.147,0.018c-3.617-20.571-13.553-40.093-28.942-56.762
         c-15.317-16.589-35.217-29.687-57.548-37.878c-19.133-7.018-39.434-10.577-60.337-10.577c-28.22,0-55.627,6.637-79.257,19.193
         C23.289,47.297-3.585,91.799,0.387,136.461c2.056,23.111,11.11,45.11,26.184,63.621c14.188,17.423,33.381,31.483,55.503,40.66
         c13.602,5.642,27.051,8.301,41.291,11.116l1.667,0.33c3.921,0.776,4.975,1.842,5.247,2.264c0.503,0.784,0.24,2.329,0.038,3.18
         c-0.186,0.785-0.378,1.568-0.57,2.352c-1.529,6.235-3.11,12.683-1.868,19.792c1.428,8.172,6.531,12.859,14.001,12.86
         c0.001,0,0.001,0,0.002,0c8.035,0,17.18-5.39,23.231-8.956l0.808-0.475c14.436-8.478,28.036-18.041,38.271-25.425
         c22.397-16.159,47.783-34.475,66.815-58.17C290.172,175.745,299.2,145.078,295.838,115.347z M92.343,160.561H66.761
         c-3.866,0-7-3.134-7-7V99.865c0-3.866,3.134-7,7-7c3.866,0,7,3.134,7,7v46.696h18.581c3.866,0,7,3.134,7,7
         C99.343,157.427,96.209,160.561,92.343,160.561z M119.03,153.371c0,3.866-3.134,7-7,7c-3.866,0-7-3.134-7-7V99.675
         c0-3.866,3.134-7,7-7c3.866,0,7,3.134,7,7V153.371z M182.304,153.371c0,3.033-1.953,5.721-4.838,6.658
         c-0.712,0.231-1.441,0.343-2.161,0.343c-2.199,0-4.323-1.039-5.666-2.888l-25.207-34.717v30.605c0,3.866-3.134,7-7,7
         c-3.866,0-7-3.134-7-7v-52.16c0-3.033,1.953-5.721,4.838-6.658c2.886-0.936,6.045,0.09,7.827,2.545l25.207,34.717V99.675
         c0-3.866,3.134-7,7-7c3.866,0,7,3.134,7,7V153.371z M233.311,159.269h-34.645c-3.866,0-7-3.134-7-7v-26.847V98.573
         c0-3.866,3.134-7,7-7h33.57c3.866,0,7,3.134,7,7s-3.134,7-7,7h-26.57v12.849h21.562c3.866,0,7,3.134,7,7c0,3.866-3.134,7-7,7
         h-21.562v12.847h27.645c3.866,0,7,3.134,7,7S237.177,159.269,233.311,159.269z"/>
     </g>
     </svg>` }
      },
      { ariaLabel: 'github', icon: 'github', link: 'https://github.com/Chuiantw1212/econ-sense-vite-press' },
    ],
    lastUpdated: {
      text: '上次更新',
      formatOptions: {
        forceLocale: true,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }
    },
    docFooter: {
      prev: '上一頁',
      next: '下一頁',
    },
    darkModeSwitchLabel: '深色模式',
    sidebarMenuLabel: '選單',
    returnToTopLabel: '回到頂端',
    outline: {
      label: '大綱'
    },
    footer: {
      message: 'Powered by <a href="https://vitepress.dev/" target="_blank">Vitepress</a>',
      copyright: `Copyright © 2023-${new Date().getFullYear()} EN Chu`
    },
    logo: {
      src: '/logo/logo_24.webp',
      width: '24px',
      height: '24px',
    },
    externalLinkIcon: true,
  },
  /**
   * Build
   */
  metaChunk: true,
  /**
   * Theme
   */
  appearance: 'dark',
  lastUpdated: true,
  /**
   * Customization
   */
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  vite: {
    plugins: [
      SearchPlugin({
        encode: false,
        tokenize: "full",
        buttonLabel: "搜尋",
        placeholder: "搜尋關鍵字"
      }) as any
    ]
  },
  /** Experimental */
  sitemap: {
    hostname: 'https://en-chu.com'
  },
})