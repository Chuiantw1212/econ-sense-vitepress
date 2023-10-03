import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "常識經濟學",
  description: "A VitePress Site",
  head: [['link', { rel: 'icon', href: '/logo/常-透明.png' }]],
  themeConfig: {
    logo: '/logo/常-透明.svg',
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: '首頁', link: '/' },
    //   { text: '好書推薦', link: '/books' }
    // ],

    sidebar: [
      {
        text: '經典課程',
        items: [
          { text: '理財框架', link: '/framework' },
          { text: '勞工退休規劃', link: '/retirement' },
          { text: '投資進階班', link: '/investment' }
        ]
      },
      {
        text: '好書推薦',
        items: [
          { text: '金融理財', link: '/finance' },
          { text: '創業', link: '/startup' },
          { text: '房地產', link: '/estate' },
        ]
      },
      {
        text: '關於',
        items: [
          {
            text: '朱老師', link: '/about'
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Chuiantw1212' },
      { icon: 'instagram', link: 'https://www.instagram.com/econ.sense' },
      // { icon: 'facebook', link: 'https://www.facebook.com/econ.sense.tw' },
    ]
  }
})
