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
        apiKey: "AIzaSyBUfih_WbN-NlRAuaCM2fXQQry9t3JxV5U",
        authDomain: "enchu-12074.firebaseapp.com",
        projectId: "enchu-12074",
        storageBucket: "enchu-12074.firebasestorage.app",
        messagingSenderId: "178386523946",
        appId: "1:178386523946:web:9812dc0106909cee0ef053",
        measurementId: "G-LYLDS6NEQW"
      })
      firebase.performance()
    }
  }
}