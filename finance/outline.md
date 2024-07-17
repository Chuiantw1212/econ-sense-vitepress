---
description: 《金錢整理術》：金錢整理術、小錢包存錢法、存錢筆記本、培養整理習慣。適合重視財務整理、想自動化收支管理、好奇如何實踐省錢的人。
outline: deep
---
# 無痛理財

探索深入的無痛理財世界。這裡涵蓋了理財框架、勞工退休規劃以及投資進階管道等多樣化主題，為您提供專業的資訊和實用建議。無論您是金融新手或有一定經驗，這些內容都能夠幫助您理解金融領域中的重要概念和方法。讓我們一同探索，有效管理財富，為未來做好準備。

## 內容目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

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
        url: './retirement',
        name: '勞工退休規劃',
        keywords: ['勞保勞退', '老後變現', '老前整理', '移轉節稅'],
        audience: ['家中有退休/屆退休長輩的孝順子女', '想儘早規劃未來的遠見人', '擔心退休金不夠用的社會大眾'],
        rating: 2
    },
    {
        url: './asset',
        name: '投資進階管道',
        keywords: ['證券', '太陽能', '加密貨幣', '天使投資'],
        audience: ['對純被動收入好奇的人', '想遠離看盤或沒時間看盤的人', '怕被騙或是歸零的人'],
        rating: 3
    },
    {
        url: './single',
        name: '單身狗地獄求生',
        keywords: ['獵殺女巫', '台灣現狀', '身心靈準備', '財務準備(信託)'],
        audience: ['選擇或是被迫單身的人', '介於兩者之間的人', '想了解低生育率成因的人'],
        rating: 1
    },
    {
        url: './single',
        name: '金錢整理術',
        keywords: ['金錢整理術', '小錢包存錢法', '存錢筆記本', '培養整理習慣'],
        audience: ['意識到"整理"財務很重要的人', '想自動化收支管理的人', '對如何實踐省錢概念感到好奇的人'],
        rating: 3
    }
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
        url: 'https://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/111S203/3',
    },
    {
        image:'/finance/laborEducation.jpeg',
        description:`歡迎蒞臨全民勞教e網，您的勞動保險與就業保險學習平台。我們提供多樣的課程，包括『勞工保險、勞工職業災害保險及就業保險相關法規』的深入解說和實用案例，以及『就業保險法』和『就業保險給付作業』的實務應用。透過『勞工保險給付作業(一)－生育給付、老年給付』的具體實務指導，我們致力於提升您在勞動保險領域的專業素養。加入我們，共同探索勞工保險體系，獲取實用知識，助您在職場中更為自信與有競爭力。`,
        name:'全民勞教E網 - 勞工保險',
        url:'https://labor-elearning.mol.gov.tw/co_course.php?tag=1&view=1&cgp=10000004'
    },
]
</script>
