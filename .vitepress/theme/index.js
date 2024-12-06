// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'
import './custom.scss'
import './36b7cf.scss'

console.log('run time check')

export default {
  extends: Theme,
  async enhanceApp({ app, }) {
    install(app)
  }
}