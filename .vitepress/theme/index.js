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
import './doc.scss'

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
      console.log('Not SSR - Initializing Firebase Compat')

      const firebaseConfig = {
        apiKey: "AIzaSyADacfSXAMQ3XLIho3-xvzhb04_YcHQ1Vc",
        authDomain: "enchu-8085a.firebaseapp.com",
        projectId: "enchu-8085a",
        storageBucket: "enchu-8085a.firebasestorage.app",
        messagingSenderId: "592400229145",
        appId: "1:592400229145:web:858fc1199d18601dc25b88",
        measurementId: "G-9860DS47Z6"
      }

      // 避免重複初始化 (Hot Reload 時可能會發生)
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)

        // 啟動效能監控
        firebase.performance()

        // 2. 關鍵修正：手動將 firebase 掛載到 window 物件
        // 這是讓 firebase-ui-auth__zh_tw.js 能運作的絕對關鍵
        // @ts-ignore
        window.firebase = firebase

        console.log('Firebase globally attached to window.firebase')
      } else {
        // 如果已經初始化過，也要確保 window上有掛載 (針對 HMR 情境)
        // @ts-ignore
        if (!window.firebase) {
          // @ts-ignore
          window.firebase = firebase
        }
      }
    }
  }
}