---

# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "常識經濟學"
  text: "econ-sense.com"
  tagline: 無痛無腦理財、腳踏實地賺錢
  actions:
    - theme: brand
      text: 金融理財
      link: /feedback
    - theme: brand
      text: 軟體專案
      link: /software

features:
  - title: JS工程師
    details: 2017進入職場，精通Vue<br>Javascript統一前後端<br>積極的社群貢獻者
  - title: 創業
    details: Job Pair共同創辦人/CTO<br>前後端開發<br>還有其他
  - title: 金融
    details: AFP理財規劃顧問<br>學校學不到的事-理財講師<br>累積講座人次破千
---

<script setup>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzxiXnAvtkAW5AzoV-CsBLNbryVJZrGqI",
  authDomain: "econ-sense-9a250.firebaseapp.com",
  projectId: "econ-sense-9a250",
  storageBucket: "econ-sense-9a250.appspot.com",
  messagingSenderId: "449033690264",
  appId: "1:449033690264:web:f5e419118030eb3afe44ed",
  measurementId: "G-19NFT8GVCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
</script>
