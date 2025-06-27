---
description: 探索測驗、轉型與技能進化的軌道圖，從學渣翻身到黑馬奔馳，成長不再靠運氣，而是可複製的飛行計劃。
outline: deep
---

# 成長艙室：導航自我進化的個人駕駛艙

探索測驗、轉型與技能進化的軌道圖，從學渣翻身到黑馬奔馳，成長不再靠運氣，而是可複製的飛行計劃。

## 單元目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

<script setup>
import DigitalDocuments from './components/digitalDocuments.vue'

const digitalDocumentItems = [
    {
        url: './growth/riasec',
        name: '何倫碼測驗&NLP的理想職涯',
        keywords: ['興趣', '能力', '現實',],
        audience: ['想體驗NLP的人', '想系統的探索職涯的人'],
        rating: 3
    },
    // {
    //     url: './growth/project',
    //     name: '軟體專案實務',
    //     keywords: ['從PMP到敏捷', '理想敏捷', '角色盲點', '實踐敏捷',],
    //     audience: ['職場小白/轉職者，對軟體開發實務感到好奇的人', '覺得專案中的夥伴很難搞的人', '對專案管理有興趣的人與PMI相關持證人'],
    //     rating: 3
    // },
    // {
    //     url: './growth/education',
    //     name: '我是學渣，也是黑馬',
    //     keywords: ['傷仲永', '教育問題', '喚醒黑馬', '教養假想'],
    //     audience: ['正在尋求個人成長和突破的人', '面臨教育或職業困境的學生和年輕人', '在教育與教養中受過傷的人'],
    //     rating: 3
    // },
    // {
    //     url: './growth/flywheel',
    //     name: '打造知識飛輪',
    //     keywords: ['制定目標', '學習', '輸出', '優化'],
    //     audience: ['渴望有效學習各方面知識的人', '想建立自己知識體系的人，包括學生和專家', '對內容創作充滿好奇心的人'],
    //     rating: 3
    // },
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
                "name": "職涯發展",
                "item": "https://en-chu.com/framework"
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
