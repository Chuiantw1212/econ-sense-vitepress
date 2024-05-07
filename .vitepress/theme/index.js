// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'
import './custom.css'
import 'firebaseui/dist/firebaseui.css'
// import firebase from 'firebase/compat/app';
export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  async enhanceApp({ app, }) {
    install(app)
  }
}