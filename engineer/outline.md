---
description: EN Chu的工程師職涯經驗與分享。
outline: deep
---

# 線上工具&工程師專區：財務測驗與職涯經驗分享的多元資源平台

線上工具&工程師專區，為社會大眾提供多樣化的線上測驗和財務計算機，從開源財務規劃到金錢性格測驗，助您掌握財務狀況。此外，專區還分享工程師的職涯經驗，包括軟體職涯入門、網站開發指南及電腦DIY，幫助技術初學者和專業人士提升技能。

## 線上工具

<table>
    <thead>
        <tr>
            <th>名稱</th>
            <th>內容</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <a href="../plan.html">開源財務規畫表</a>
            </td>
            <td>主要做給有勞保身份的社會大眾(受僱員工/中小企業主)的財務計算機。</td>
        </tr>
        <tr>
            <td>
                <a href="../finance/disc.html">金錢性格測驗</a>
            </td>
            <td>以書本為參考，結合DISC與社會觀察產出的財務行為建議。</td>
        </tr>
        <tr>
            <td>
                <a href="../career/riasec.html">職業興趣探索</a>
            </td>
            <td>基於何倫碼做出的職涯適性速查。</td>
        </tr>
    </tbody>
</table>

## 單元目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

<!-- ## 外部優質課程

<Courses :modelValue="courseItems"></Courses> -->

<script setup>
import DigitalDocuments from '../components/digitalDocuments.vue'
import Courses from '../components/courses.vue'

const digitalDocumentItems = [
{
        url: './beginner',
        name: '軟體職涯入門',
        keywords: ['職涯探索', '學習', '履歷', '求職'],
        audience: ['資訊工程相關科系大三以上學生','欲轉職為軟體工程師的社會人士', '打算換工作的在職軟體工程師也可以來聽聽看'],
        rating: 2
    },
    {
        url: './web',
        name: '網站初學須知',
        keywords: ['較早的網站演進', '2016後的網站演進', '工程師作業環境', '全端自學經驗分享'],
        audience: ['想學習網站基本概念的初學者','想當工程師寫程式的待轉職者', '需要架站與工程師溝通的PM'],
        rating: 3
    },
    {
        url: './computer',
        name: '電腦DIY',
        keywords: ['主要元件', '次要元件', '其他周邊', '組裝'],
        audience: ['價格敏感型消費者', '想自己裝修電腦的人', '總感覺自己被店家宰羊的人'],
        rating: 3
    },
    {
        url: './blog-1',
        name: 'Vitepress無本部落格',
        keywords: ['環境建置', '本機運行', '發布與修改', '進階設定'],
        audience: ['想學習前端的初學者','厭倦隨著平台倒閉到處搬家的文字工作者', '不想負擔部落格託管費用的使用者'],
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
