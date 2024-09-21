---
description: 探索職涯發展，涵蓋NLP的理想職涯、打造知識飛輪和軟體專案實務，助您提升職場技能與實現職涯目標。
outline: deep
---

# 職涯發展

《職涯發展》頁面匯集了多種資源，旨在幫助讀者根據自己的需求進行探索與應用。無論您是剛開始職涯規劃、考慮轉職，還是希望提升技能，這裡的內容提供不同視角與實用建議，讓您自行選擇最適合自己的路徑。希望這些資源能為您的職業發展帶來啟發，助您找到前進的方向。

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
