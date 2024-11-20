// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'
import './custom.css'
import './4ed0e1.css'
export default {
  extends: Theme,
  async enhanceApp({ app, }) {
    install(app)
  }
}