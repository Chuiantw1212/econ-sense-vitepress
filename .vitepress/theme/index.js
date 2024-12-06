// https://vitepress.dev/guide/custom-theme
import { onMounted, } from 'vue'
import Theme from 'vitepress/theme'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'
import './custom.scss'
import './36b7cf.scss'

onMounted(async () => {
  window.firebase = firebase
  await initializeApp()
})

async function initializeApp() {
  try {
    loadingDialogVisible.value = true
    await firebase.initializeApp({
      apiKey: "AIzaSyDzxiXnAvtkAW5AzoV-CsBLNbryVJZrGqI",
      authDomain: "econ-sense-9a250.firebaseapp.com",
      projectId: "econ-sense-9a250",
      storageBucket: "econ-sense-9a250.appspot.com",
      messagingSenderId: "449033690264",
      appId: "1:449033690264:web:f5e419118030eb3afe44ed",
      measurementId: "G-19NFT8GVCZ"
    })
  } catch (error) {
    console.log(error.message || error)
  }
}


export default {
  extends: Theme,
  async enhanceApp({ app, }) {
    install(app)
  }
}