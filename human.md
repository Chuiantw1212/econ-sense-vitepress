---
description: 揭開人性與制度的遮羞布，從演化心理到社會邏輯，觀察那些說出來會社死，但你其實早已發現的事。
outline: deep
---

# 人類觀察室：看清制度、性格與文化背後的真實機制

揭開人性與制度的遮羞布，從演化心理到社會邏輯，觀察那些說出來會社死，但你其實早已發現的事。

## 單元目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

<script setup>
import DigitalDocuments from './components/digitalDocuments.vue'

const digitalDocumentItems = [
    {
        url: './human/love-language',
        name: '愛之語測驗',
        rating: 1
    },
    {
        url: './human/single',
        name: '單身狗地獄求生',
        keywords: ['生育率的歷史', '台灣現狀', '財務面的準備', '非財務的準備'],
        audience: ['想了解低生育率成因的人', '選擇或被迫單身一輩子的人', '介於兩者之間的人'],
        rating: 2
    },
     {
        url: './human/war',
        name: '後備預官的民防心得',
        keywords: ['統一大夢', '備戰與反戰', '戰爭期間的假想','人民真正能做的事'],
        audience: ['台灣人',],
        rating: 2
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
                "name": "人類觀察室",
                "item": "https://en-chu.com/human"
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
