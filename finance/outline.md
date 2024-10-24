---
description: 《金錢整理術》：金錢整理術、小錢包存錢法、存錢筆記本、培養整理習慣。適合重視財務整理、想自動化收支管理、好奇如何實踐省錢的人。
outline: deep
---
# 無痛理財：涵蓋理財框架、退休規劃及投資進階的全方位指南

探索深入的無痛理財世界。這裡涵蓋了理財框架、退休規劃以及投資進階管道等多樣化主題，為您提供專業的資訊和實用建議。無論您是金融新手或有一定經驗，這些內容都能夠幫助您理解金融領域中的重要概念和方法。讓我們一同探索，有效管理財富，為未來做好準備。

## 講座系列

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

## 說書系列

<DigitalDocuments :items="storyItems"></DigitalDocuments>

## 財商桌遊

<DigitalDocuments :items="gameItems"></DigitalDocuments>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

<script setup>
import DigitalDocuments from '../components/digitalDocuments.vue'
import Courses from '../components/courses.vue'
const digitalDocumentItems = [
    {
        url: './framework',
        name: '理財框架',
        keywords: ['開源', '節流', '投資', '風險控制'],
        audience: ['剛出社會的新鮮人', '想掌握理財觀念全貌的人', '總覺得理財很難的人'],
        rating: 3
    },
    {
        url: './retirement-1',
        name: '退休規劃(上)',
        keywords: ['勞保勞退', '公保公退', '老後居住', '老後變現'],
        audience: ['關注退休的職場人士與公務員', '計畫為老後居住做準備的人', '想為退休資產變現做準備的人'],
        rating: 2
    },
    {
        url: './retirement-2',
        name: '退休規劃(下)',
        keywords: ['財務', '醫療', '法律', '生死'],
        audience: ['即將進入退休或正在規劃退休生活的人', '希望為未來做好醫療和法律安排的人', '希望減少家人在處理後事時壓力的人'],
        rating: 3
    },
    {
        url: './investment',
        name: '投資進階管道',
        keywords: ['證券', '太陽能', '加密貨幣', '天使投資'],
        audience: ['對純被動收入好奇的人', '想遠離看盤或沒時間看盤的人', '怕被騙或是歸零的人'],
        rating: 3
    },
]

const storyItems = [
    {
        url: './single',
        name: '金錢整理術',
        keywords: ['金錢整理術', '小錢包存錢法', '存錢筆記本', '培養整理習慣'],
        audience: ['意識到"整理"財務很重要的人', '想自動化收支管理的人', '對如何實踐省錢概念感到好奇的人'],
        rating: 3
    },
    {
        url: './insurance',
        name: '醫生買保險',
        keywords: ['健保與醫療險', '癌症險', '長照險', '儲蓄險', '自己保保險'],
        audience: ['沒保過保險的新鮮人', '不想保保險的人', '不太知道自己保了什麼鬼東西的人'],
        rating: 2
    },
]

const gameItems = [
    {
        url: './financemj',
        name: '小富翁大贏家',
        keywords: ['開源', '節流', '投資', '風險控制'],
        audience: ['國二至高中(職)',],
        rating: 3
    },
]

const courseItems = [
    {
        image: '/finance/111S203.webp',
        description: `本課程改編自介惠基金會「偏鄉婦女財務幸福計畫」教材，共有 6 堂課。
        <ul>
            <li>第1堂 課介紹理財規劃流程及家庭財務報表編制。</li>
            <li>第2堂 課介紹我國退休金制度以及金錢詐騙剝削預防。</li>
            <li>第3堂 課說明職涯規劃與借貸評</li>
            <li>第4堂 投資報酬與風險</li>
            <li>第5堂 人生風險與保險</li>
        </ul>`,
        name: '臺大開放式課程 - 財務幸福自我養成計畫',
        url: 'https://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/111S203/1',
    },
    // {
    //     image:'/finance/laborEducation.jpeg',
    //     description:`歡迎蒞臨全民勞教e網，您的勞動保險與就業保險學習平台。我們提供多樣的課程，包括『勞工保險、勞工職業災害保險及就業保險相關法規』的深入解說和實用案例，以及『就業保險法』和『就業保險給付作業』的實務應用。透過『勞工保險給付作業(一)－生育給付、老年給付』的具體實務指導，我們致力於提升您在勞動保險領域的專業素養。加入我們，共同探索勞工保險體系，獲取實用知識，助您在職場中更為自信與有競爭力。`,
    //     name:'全民勞教E網 - 勞工保險',
    //     url:'https://labor-elearning.mol.gov.tw/co_course.php?tag=1&view=1&cgp=10000004'
    // },
]
</script>
