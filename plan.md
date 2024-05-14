---
description: 台灣唯一開源的線上財務規劃表，工程師可學習Javascript，民眾建立財務觀念，並提供回饋意見。
outline: deep
head:
  - - meta
    - name: og:image
      content: https://econ-sense.com/plan/lifeAsset.png
---

# 開源財務規劃表

<!-- - 資訊安全：Google 將安全視為資料中心的根基，絕不怠慢。而且有領先業界的安全團隊在全球各地隨時待命，防護能力無與倫比，因此您可以安心將資料存放在 Google 資料中心。
- 金融專業：AFP 理財規劃顧問具有核心理財規劃知識及技巧，嚴格遵守職業道德規範，並熟悉國內市場發展與政策新知，能全面、客觀的分析客戶條件背景，並取得信任，進而提供國內民眾理財規劃專業服務。
- 源碼開放：任何人都可以檢視前端、後端程式碼是否有安全漏洞。如果還是會怕，也提供了資料匯出功能。 -->

<!-- 1. 台灣唯一<a href="https://zh.wikipedia.org/zh-tw/%E5%BC%80%E6%BA%90%E8%BD%AF%E4%BB%B6" target="_blank">開源</a>的線上財務規劃表。 -->
1. 金融惠普：民眾可以快速建立生涯財務觀念，並提共<a href="/calendar.html#聯絡en">回饋意見</a>。
2. 開源驗證：任何人都可以檢視程式碼是否有安全漏洞。 (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-fastify-typescript" target="_blank">後端開源</a>)。
3. 如果還是擔心個資，也提供了表單離線匯出功能，不需註冊也可以保留試算結果。

<Calculator></Calculator>

<script setup>
import Calculator from './components/calculator/index.vue'
</script>
