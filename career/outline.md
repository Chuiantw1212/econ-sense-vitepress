---
description: 探索職涯發展，涵蓋NLP的理想職涯、打造知識飛輪和軟體專案實務，助您提升職場技能與實現職涯目標。
outline: deep
---

# 職涯發展：探索規劃與自我成長的多元資源與實用建議

《職涯發展》頁面提供多種資源，涵蓋職涯規劃、自我成長及技能提升。無論您處於哪個職業階段，這裡的內容將從不同角度提供實用建議，幫助您找到適合的路徑。這些資源旨在帶來啟發，協助您在職業發展中尋找新的方向與可能性，逐步實現自我成長。

## 單元目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

<script setup>
import DigitalDocuments from '../components/digitalDocuments.vue'

const digitalDocumentItems = [
    {
        url: './software',
        name: '軟體專案實務',
        keywords: ['從PMP到敏捷', '理想敏捷', '實務敏捷', '角色盲點'],
        audience: ['職場小白/轉職者，對軟體開發實務感到好奇的人', '覺得專案中的夥伴很難搞的人', '對專案管理有興趣的人與PMI相關持證人'],
        rating: 3
    },
    {
        url: './flywheel',
        name: '打造知識飛輪',
        keywords: ['制定目標', '學習', '輸出', '優化'],
        audience: ['渴望有效學習各方面知識的人', '想建立自己知識體系的人，包括學生和專家', '對內容創作充滿好奇心的人'],
        rating: 3
    },
     {
        url: './riasec',
        name: 'NLP的理想職涯',
        keywords: ['興趣', '能力', '現實',],
        audience: ['想體驗NLP的人', '想系統的探索職涯的人'],
        rating: 3
    },
]
</script>
