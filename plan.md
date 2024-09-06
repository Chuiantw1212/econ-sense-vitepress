---
description: 台灣唯一開源的線上財務規劃表，工程師可學Vue+Node.js+GCP，民眾建立財務觀念，並提供回饋意見。
outline: deep
head:
  - - meta
    - name: og:image
      property: og:image
      content: /finance/plan/calculator.png
---
<!-- https://vitepress.dev/reference/frontmatter-config#head -->

# 開源財務規劃表

1. 金融惠普：民眾可以快速建立生涯財務觀念。<el-button @click="isOpenPreview=true">示意圖</el-button>
2. 開源驗證：任何人都可以檢視程式碼是否有安全漏洞。 (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-hyper-express" target="_blank">後端開源</a>)。
3. 資料安全：提供了表單離線匯出功能，不需註冊也可以保留試算結果。


<el-dialog :modelValue="isOpenPreview" title="示意圖" center destroy-on-close lock-scroll
    @close="isOpenPreview = false">
    <div class="preview__div">
      <img src="https://storage.googleapis.com/public.econ-sense.com/finance/plan/%E7%A4%BA%E6%84%8F%E5%9C%96.webp" alt="示意圖"></img>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isOpenPreview = false">關閉</el-button>
      </div>
    </template>
</el-dialog>

<Calculator></Calculator>

## 專家諮詢

<a href="https://www.azsinopro.com.tw/reservation/" target="_blank">Azimut Sinopro 安睿宏觀</a>是國際高端理財顧問領導品牌，提供個人及家庭全生涯理財規劃，與中高資產家族辦公室服務，團隊擁有如<a href="https://www.fpat.org.tw/Certification/List" target="_blank">CFP®、AFP等國際證照</a>，專注於為客戶達成理想生活品質。以超過27年的顧問經歷，服務超過5,000組台灣家庭，運用專業的理財觀點、客觀的投資建議，提供量身訂製財務解決方案，內容包含投資規劃、稅務規劃、風險管理、信用管理及現金流管理等專業規劃與諮詢服務。

<a href="https://www.azsinopro.com.tw/reservation/" target="_blank">
  <img src="/plan/Group175.png" alt=banner>
</a>

<script setup>
import { ref } from 'vue'
import Calculator from './components/calculator/index.vue'
const isOpenPreview = ref(false)
</script>
<style lang=scss scoped>
.preview__div {
  height: 420px;
  overflow-y: auto;
}
</style>
