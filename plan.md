---
description: 台灣唯一開源的線上財務規劃表，工程師可學Vue+Node.js+GCP，民眾建立財務觀念，並提供回饋意見。
outline: deep
head:
  - - meta
    - name: og:image
      property: og:image
      content: https://econ-sense.com/plan/calculator.png
  - - meta
    - name: og:url
      property: og:url
      content: https://econ-sense.com/plan.html
---
<!-- https://vitepress.dev/reference/frontmatter-config#head -->

# 開源財務規劃表

1. 金融惠普：民眾可以快速建立生涯財務觀念，並提共<a href="/calendar.html#聯絡en">回饋意見</a>。
2. 開源驗證：任何人都可以檢視程式碼是否有安全漏洞。 (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-hyper-express" target="_blank">後端開源</a>)。
3. 如果還是擔心個資，也提供了表單離線匯出功能，不需註冊也可以保留試算結果。

<Calculator></Calculator>

## 專家諮詢
<a href="https://www.azsinopro.com.tw/" target="_blank">Azimut Sinopro 安睿宏觀</a>是國際高端理財顧問領導品牌，提供個人及家庭全生涯理財規劃，與中高資產家族辦公室服務，團隊擁有如<a href="https://www.fpat.org.tw/Certification/List" target="_blank">CFP®、AFP等國際證照</a>，專注於為客戶達成理想生活品質。以超過27年的顧問經歷，服務超過5,000組台灣家庭，運用專業的理財觀點、客觀的投資建議，提供量身訂製財務解決方案，內容包含投資規劃、稅務規劃、風險管理、信用管理及現金流管理等專業規劃與諮詢服務。

<a href="https://www.azsinopro.com.tw/" target="_blank">
  <img src="/plan/Group175.png">
</a>

<script setup>
import Calculator from './components/calculator/index.vue'
</script>
