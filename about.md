---
description: 非專業講師，每週三分享於學校學不到的事。現為Job Pair共同創辦人，並任職於普鴻資訊。
outline: [2,3]
---

# 關於 EN Chu

<VPTeamMembers size="medium" :members="members" />

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'
import SkillIcon from './components/skillIcons.vue'

const members = [
  {
    avatar: `https://storage.googleapis.com/public.econ-sense.com/about/enchu.webp`,
    title: '分享者',
    desc:'群益期貨、潛能聚、普鴻資訊、誠遠國際、LearnWeb、韶光心理學苑(2024/11)、PMI Taiwan(2025/01)',
    org: '學校學不到的事',
    orgLink: 'https://www.facebook.com/groups/304681766894402',
  },
  {
    avatar: `https://storage.googleapis.com/public.econ-sense.com/about/nodejs.webp`,
    title: '全端工程師',
    desc:'2024 玉山銀行委外<br/>2020-2023 凱基人壽委外<br/>2017-2020 前端工程師',
    org: 'Job Pair',
    orgLink: 'https://job-pair.com/',
  },
]
</script>

## 主要專案

### 開源財務規劃表

1. 金融惠普：民眾可以快速建立生涯財務觀念。
2. 開源驗證：任何人都可以檢視程式碼是否有安全漏洞。 (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-hyper-express" target="_blank">後端開源</a>)。
3. 資料安全：提供了表單離線匯出功能，不需註冊也可以保留試算結果。

<a href="https://econ-sense.com/plan.html">
    <img class="aobut__image--100" src="/finance/plan/calculator.png" alt="finance-planner">
</a>

### Job Pair

求職找工作可以很簡單！Job Pair媒合型人力銀行，勾選你理想的企業文化、工作環境、組織階段、管理模式、人際風格和工作模式，即刻為你配對最合適的職缺，開啟專屬於你的職場旅程。

<a href="https://job-pair.com" target="_blank">
    <img class="aobut__image--100" src="https://storage.googleapis.com/public.econ-sense.com/about/jobPair.webp" alt=job-pair>
</a>

## 技術棧

### 前端

<SkillIcon :modelValue="'js,html,css,ts,vue,pinia,vuetify,nuxtjs,vite,sass,bootstrap,md'"></SkillIcon>

### 後端

<SkillIcon :modelValue="'nodejs,ts,express,mongodb,postgres,postman'"></SkillIcon>

### 雲服務與其他

<SkillIcon :modelValue="'firebase,gcp,git,github,gitlab,bitbucket,githubactions,npm,vscode,regex,windows,linux'"></SkillIcon>

## 專業認證

### AFP理財規劃顧問

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--100" src="https://storage.googleapis.com/public.econ-sense.com/about/afp.webp" alt=AFP理財規劃顧問>
</div>

### PMP國際專案管理師

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--100" src="https://storage.googleapis.com/public.econ-sense.com/about/pmp.webp" alt=PMP國際專案管理師>
</div>

### 其他金融證明書

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/morale.webp" alt=金融市場常識與職業道德>
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/fundLaw.webp" alt=投信投顧相關法規(含自律規範)>
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/trust.webp" alt=信託業務專業>
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/finTech.webp" alt=金融科技力>
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/planner.webp" alt=理財規劃人員>
</div>

## 教育背景

### Master in Informatics

<img class="aobut__image--100" src="https://storage.googleapis.com/public.econ-sense.com/about/northeastern.webp" alt=Northeastern>

### 義務役預備軍官

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/military1.webp" alt=義務役預備軍官正面>
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/military2.webp" alt=義務役預備軍官反面>
</div>

### 中興大學資訊科學學士

<img class="aobut__image--100" src="https://storage.googleapis.com/public.econ-sense.com/about/nchu.webp" alt=nchu>

## 興趣認證

### NLP專業執行師

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--100" src="https://storage.googleapis.com/public.econ-sense.com/about/nlp1.webp" alt=NLP專業執行師>
</div>

### Cafe Startups 認證講師

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--100" src="https://storage.googleapis.com/public.econ-sense.com/about/cafe.webp" alt=精實創業咖啡館認證講師>
</div>

### 新天鵝堡桌遊教師

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/swan2.webp" alt=新天鵝堡進階桌遊師>
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/swan1.webp" alt=新天鵝堡初階桌遊師>
</div>

### 環島/泳渡

環島：2020, 2022, 2023, 2024

泳渡：2023, 2024

<div style="display:flex;flex-wrap:wrap;">
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/cycling1.webp" alt=環島>
    <img class="aobut__image--50" src="https://storage.googleapis.com/public.econ-sense.com/about/swimming.webp" alt=泳渡>
</div>

<style lang=scss>
.aobut__image--100 {
    width:100%;
    border: 1px solid #e2e2e3;
}
.aobut__image--50 {
    width:50%;
    border: 1px solid #e2e2e3;
}
</style>
