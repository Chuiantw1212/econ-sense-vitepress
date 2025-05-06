/**
 * Vue Core
 * https://vitepress.dev/guide/custom-theme
 */
import Theme from 'vitepress/theme'
import { install } from 'element-plus'

// Styles
import 'element-plus/dist/index.css'
import './custom.scss'
import './36b7cf.scss'

// Scripts
import firebase from 'firebase/compat/app'
import "firebase/compat/performance";

// export vue app
export default {
  extends: Theme,
  async enhanceApp({ app, }) {
    install(app)
    /**
     * Since Theme.enhanceApp can be async, you can conditionally import and register Vue plugins that access browser APIs on import
     * https://vitepress.dev/guide/ssr-compat#conditional-import
     */
    if (!import.meta.env.SSR) {
      firebase.initializeApp({
        apiKey: "AIzaSyADacfSXAMQ3XLIho3-xvzhb04_YcHQ1Vc",
        authDomain: "enchu-8085a.firebaseapp.com",
        projectId: "enchu-8085a",
        storageBucket: "enchu-8085a.firebasestorage.app",
        messagingSenderId: "592400229145",
        appId: "1:592400229145:web:858fc1199d18601dc25b88",
        measurementId: "G-9860DS47Z6"
      })
      firebase.performance()
    }
  }
}