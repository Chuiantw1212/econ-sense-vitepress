---
outline: deep
---

# 職涯發展 - 工程師專區

歡迎來到我的職涯發展分享，這裡是我個人工作經驗的統整。

## 內容目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

<script setup>
import DigitalDocuments from '../components/digitalDocuments.vue'
import Courses from '../components/courses.vue'

const digitalDocumentItems = [
    {
        url: './computer',
        name: '電腦DIY',
        keywords: ['主要元件', '次要元件', '其他周邊', '組裝'],
        audience: ['價格敏感型消費者', '想自己裝修電腦的人', '總感覺自己被店家宰羊的人'],
        rating: 3
    },
    {
        url: './blog',
        name: 'Vitepress無本部落格',
        keywords: ['環境建置', '本機運行', '發布', '修改'],
        audience: ['想學習前端的初學者','想脫離隨著平台倒閉到處搬家的文字工作者', '不想付託管費用的文字工作者'],
        rating: 3
    },
]

const courseItems = [
    {
        image: '/career/learnWeb.png',
        description: `LearnWeb Taiwan 旨在交流網頁領域相關資訊與技術，包含但不限於「前端」/「後端」/「UI、UX」/「PM」等職務相關內容，我們不定時會舉辦工作坊、講座、純聊天場，也歡迎剛入門與想學習網頁技術的朋友加入！`,
        name: 'LearnWeb-Taiwan',
        url: 'https://learnweb.tw/',
    },
]
</script>
