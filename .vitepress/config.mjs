import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "常識經濟學",
  description: "常識經濟學為您帶來無痛無腦的理財智慧，讓您輕鬆踏入金融世界。我們致力於降低理財與投資的門檻，提供易懂且實用的金融知識，包括投資技巧、退休規劃策略、ETF入門等內容。無論您是初學者或有一定金融基礎，常識經濟學都是您提升財務素養的理想平台。立即探索我們的內容，開啟您的腳踏實地賺錢之旅！",
  head: [
    ['link', { rel: 'icon', href: '/logo/常-白底.png' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-19NFT8GVCZ' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-19NFT8GVCZ');`
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '金融理財', link: '/finance/events' },
      { text: '職涯發展', link: '/job/software' }
    ],
    sidebar: [
      {
        text: '金融理財',
        link: '/finance/events',
        items: [
          { text: '理財框架', link: '/finance/framework' },
          { text: '勞工退休規劃', link: '/finance/retirement' },
          { text: '投資進階班', link: '/finance/investment' },
          { text: '匱乏心理學', link: '/finance/scarcity' },
          { text: '斷捨離', link: '/finance/danshari' },
        ]
      },
      {
        text: '職涯發展',
        link: '/job/events',
        items: [
          { text: '軟體專案理想與實務', link: '/job/software' },
          { text: '國中生的職涯課', link: '/job/education' },
        ]
      },
      {
        text: '友站連結',
        link: '/affiliate'
      },
      {
        text: '關於',
        link: '/about'
      }
    ],
    socialLinks: [
      {
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
      { icon: 'instagram', link: 'https://www.instagram.com/econ.sense' },
      { icon: 'github', link: 'https://github.com/Chuiantw1212/econ-sense-vite-press' },
    ],
    // i18n
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
    sidebarMenuLabel: '網站選單',
    returnToTopLabel: '回到頂端',
    outline: {
      label: '頁面大綱'
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜尋',
          },
          modal: {
            displayDetails: 'Display detailed list',
            resetButtonTitle: 'Reset search',
            backButtonTitle: 'Close search',
            noResultsText: 'No results for',
            footer: {
              selectText: '選取',
              selectKeyAriaLabel: 'enter',
              navigateText: '切換',
              navigateUpKeyAriaLabel: 'up arrow',
              navigateDownKeyAriaLabel: 'down arrow',
              closeText: '關閉',
              closeKeyAriaLabel: 'escape'
            }
          }
        },
      }
    },
    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2019-present Evan You'
    // },
    logo: '/logo/常-白底.png',
  },
  lang: 'zh',
  sitemap: {
    hostname: 'https://econ-sense.com'
  }
})
