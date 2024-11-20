---
outline: deep
description: 好好生活，匯聚多元生活研究，為您帶來日常中的小靈感，讓生活更舒心自在。從身心靈成長、人際互動到單身生活趣味、居家極簡設計，提供實用建議，助您找到生活的平衡與愉悅。無論是尋找內心的平靜或為家庭打造理想空間，這裡的內容為您呈現貼近生活的啟發，陪伴您開啟更美好的每一天。
---

# 好好生活：探索舒心日常與靈感啟發

好好生活，匯聚多元生活研究，為您帶來日常中的小靈感，讓生活更舒心自在。從身心靈成長、人際互動到單身生活趣味、居家極簡設計，提供實用建議，助您找到生活的平衡與愉悅。無論是尋找內心的平靜或為家庭打造理想空間，這裡的內容為您呈現貼近生活的啟發，陪伴您開啟更美好的每一天。

## 單元目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

<script setup>
import DigitalDocuments from '../components/digitalDocuments.vue'
import Courses from '../components/courses.vue'

const digitalDocumentItems = [
    {
        url: './single',
        name: '單身狗地獄求生',
        keywords: ['生育率的歷史', '台灣現狀', '財務面的準備', '非財務的準備'],
        audience: ['想了解低生育率成因的人', '選擇或被迫單身一輩子的人', '介於兩者之間的人'],
        rating: 2
    },
    {
        url: './education',
        name: '我是學渣，也是黑馬',
        keywords: ['傷仲永', '教育問題', '喚醒黑馬', '教養假想'],
        audience: ['正在尋求個人成長和突破的人', '面臨教育或職業困境的學生和年輕人', '在教育與教養中受過傷的人'],
        rating: 3
    },
    {
        url: './carer',
        name: '我是照顧者',
        keywords: ['延遲老化', '照顧資源', '醫療資源', '跨領域整合'],
        audience: ['想為了照顧父母做準備的人', '想減輕家人負擔的長輩', '被各種長照術語搞得很亂的人'],
        rating: 1
    },
    {
        url: './housing',
        name: '極簡全齡宅',
        keywords: ['斷捨離', '全齡宅設計'],
        audience: ['想看斷捨離如何實踐的人', '好奇斷捨離與裝修有何關聯的人', '想準備宜居的房子給自己與家人者'],
        rating: 2
    },
]

const courseItems = [
    {
        image: '/life/turnKey.jpg',
        description: `只要有網路，無論是開車、走路、做菜、帶小孩，隨時都可以在線學習。讓我們用聲音陪你往前走，留給你一雙眼睛，抬頭看見自己和世界的變化。`,
        name: '啟點線上學苑',
        url: 'https://www.youtube.com/@koob',
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
                "name": "好好生活",
                "item": "https://econ-sense.com/life"
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
