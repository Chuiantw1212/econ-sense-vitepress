---
description: 從全端開發到部署維運，專為想活得乾淨、寫得清楚、跑得穩定的工程師與創作者設計的技術實作基地。
outline: deep
---

# 技術研究室：打造可靠、可維護、能讓人活得更好的技術棧

從全端開發到部署維運，專為想活得乾淨、寫得清楚、跑得穩定的工程師與創作者設計的技術實作基地。

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
                <a href="../framework/riasec.html">職業興趣探索</a>
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
import DigitalDocuments from './components/digitalDocuments.vue'
import Courses from './components/courses.vue'

const digitalDocumentItems = [
{
        url: './tech/beginner',
        name: '軟體職涯入門',
        keywords: ['職涯探索', '學習', '履歷', '求職'],
        audience: ['資訊工程相關科系大三以上學生','欲轉職為軟體工程師的社會人士', '寫程式寫出興趣的初學者'],
        rating: 2
    },
    {
        url: './tech/web',
        name: '網站初學須知',
        keywords: ['較早的網站演進', '2016後的網站演進', '工程師作業環境', '全端自學經驗分享'],
        audience: ['想學習網站基本概念的初學者','想當工程師寫程式的待轉職者', '需要架站與工程師溝通的PM'],
        rating: 3
    },
    {
        url: './tech/computer',
        name: '電腦DIY',
        keywords: ['主要元件', '次要元件', '其他周邊', '組裝'],
        audience: ['價格敏感型消費者', '想自己裝修電腦的人', '總感覺自己被店家宰羊的人'],
        rating: 3
    },
    {
        url: './tech/blog-1',
        name: 'Vitepress無本部落格',
        keywords: ['環境建置', '本機運行', '發布與修改', '進階設定'],
        audience: ['想學習前端的初學者','厭倦隨著平台倒閉到處搬家的文字工作者', '不想負擔部落格託管費用的使用者'],
        rating: 3
    },
]

const courseItems = [
    {
        image: '/engineer/learnWeb.png',
        description: `LearnWeb Taiwan 旨在交流網頁領域相關資訊與技術，包含但不限於「前端」/「後端」/「UI、UX」/「PM」等職務相關內容，我們不定時會舉辦工作坊、講座、純聊天場，也歡迎剛入門與想學習網頁技術的朋友加入！`,
        name: 'LearnWeb-Taiwan',
        url: 'https://learnweb.tw/',
    },
]

// SEO Structued Data
import { useData } from 'vitepress'
import { onMounted, onBeforeUnmount } from 'vue'
const { page, frontmatter } = useData()

onMounted(() => {
    const lastUpdated = new Date(page.value.lastUpdated).toISOString()
    const dataJsonLD = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "工程師專區",
                "item": "https://econ-sense.com/practice"
            }]
        },
    ]

    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.id = 'ldJson'
    script.textContent = JSON.stringify(dataJsonLD)
    document.head.appendChild(script)
})

onBeforeUnmount(()=>{
    const existedScript = document.querySelector('#ldJson')
    existedScript?.remove()
})
</script>
