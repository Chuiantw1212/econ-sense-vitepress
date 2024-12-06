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

// Firebase
window.firebase = firebase
firebase.initializeApp({
  apiKey: "AIzaSyDzxiXnAvtkAW5AzoV-CsBLNbryVJZrGqI",
  authDomain: "econ-sense-9a250.firebaseapp.com",
  projectId: "econ-sense-9a250",
  storageBucket: "econ-sense-9a250.appspot.com",
  messagingSenderId: "449033690264",
  appId: "1:449033690264:web:f5e419118030eb3afe44ed",
  measurementId: "G-19NFT8GVCZ"
})
firebase.performance()

// export vue app
export default {
  extends: Theme,
  async enhanceApp({ app, }) {
    install(app)
  }
}