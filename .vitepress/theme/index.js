// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'
import './custom.css'
export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  async enhanceApp({ app, }) {
    /**
     * Vitepress在Server side打包所以會出windows找不到的錯誤
     * https://vitepress.dev/guide/ssr-compat#conditional-import
     */
    if (!import.meta.env.SSR) {
      const firebase = await import('firebaseui')
      app.use(firebase.default)
    }
    install(app)
  }
}