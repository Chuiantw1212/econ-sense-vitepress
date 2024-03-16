---
outline: deep
---

# 職涯發展

探索「職涯發展」，這個頁面匯集了軟體專案實務和打造知識飛輪兩個主題，提供了豐富的職涯成長資源。無論您是對軟體專案管理感興趣，想要深入了解專案管理實務，還是希望建立自己的知識體系，提升職場競爭力，這裡都有適合您的資訊和工具。讓我們一同探索如何在職涯道路上不斷成長和進步。

## 內容目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

<script setup>
import DigitalDocuments from '../components/digitalDocuments.vue'
import Courses from '../components/courses.vue'

const digitalDocumentItems = [
    {
        url: './software',
        name: '軟體專案實務',
        keywords: ['從PMP到敏捷', '理想敏捷', '實務敏捷', '角色盲點'],
        audience: ['職場小白/轉職者，對軟體開發實務感到好奇的人', '希望了解專案中角色個別困境的人', '對專案管理有興趣的人與PMI相關持證人'],
        rating: 3
    },
    {
        url: './software',
        name: '打造知識飛輪',
        keywords: ['制定目標', '學習', '輸出', '優化'],
        audience: ['渴望有效學習各方面知識的人', '想減輕家人負擔的長輩', '對講師內容創作充滿好奇心的人'],
        rating: 3
    },
]

const courseItems = [
    {
        image: '/career/daren.png',
        description: `「這裡是《大人學》課程報名網站。您可以在這裡參與我們優質的實體與線上課程，註冊學員也能下載豐富的學習資源。讓我們一同往成熟大人之路邁進！」`,
        name: '大人學',
        url: 'https://shop.darencademy.com/index/search/tag/PDU',
    },
]
</script>
