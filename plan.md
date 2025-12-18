---
description: 台灣唯一開源的線上財務規劃表，工程師可學Vue+Node.js+GCP，民眾建立財務觀念，並提供回饋意見。
outline: deep
head:
  - - meta
    - name: og:image
      property: og:image
      content: /finance/plan/calculator.png
---

# 開源財務規劃書

1. 金融惠普：民眾可以快速建立生涯財務觀念。<el-button class="d-none d-md-inline-block" @click="isOpenPreview=true">示意圖</el-button>
2. 開源驗證：任何人都可以檢視程式碼是否有安全漏洞。 (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-hyper-express" target="_blank">後端開源</a>)。
3. 資料安全：提供了表單離線匯出功能，不需註冊也可以保留試算結果。

<el-dialog :modelValue="isOpenPreview" title="示意圖" center destroy-on-close lock-scroll
    @close="isOpenPreview = false">
    <div class="preview__div">
      <img class="div__image" src="https://storage.googleapis.com/enchu-8085a.firebasestorage.app/finance/plan/%E7%A4%BA%E6%84%8F%E5%9C%96.webp" alt="示意圖"></img>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isOpenPreview = false">關閉</el-button>
      </div>
    </template>
</el-dialog>

<Plan></Plan>

<script setup lang="ts">
import { ref } from 'vue'
import Plan from './components/plan/plan.vue'
const isOpenPreview = ref(false)
</script>

<style lang="scss" scoped>
.preview__div {
  height: 420px;
  overflow-y: auto;
  .div__image {
    margin: auto;
  }
}
</style>
