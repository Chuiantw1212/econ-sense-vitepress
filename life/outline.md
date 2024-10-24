---
outline: deep
---

# 好好生活

「好好生活」頁面分享各種實用的生活經驗，從教養方式、斷捨離、家庭照顧到心理學小發現，還有一些簡單實用的裝修點子。這裡匯集的內容都是基於個人的生活研究，希望能夠帶來一些小幫助和靈感，讓日常生活更舒心自在。

## 單元目錄

<DigitalDocuments :items="digitalDocumentItems"></DigitalDocuments>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

<script setup>
import DigitalDocuments from '../components/digitalDocuments.vue'
import Courses from '../components/courses.vue'

const digitalDocumentItems = [
    // {
    //     url: './scarcity',
    //     name: '匱乏心理學',
    //     keywords: ['新文明病', '認知匱乏', '匱乏循環', '打造寬鬆'],
    //     audience: ['玩過財富流想多了解精力的人', '想知道為何缺錢時不該借貸或主動投資的人', '對基本的認知心理學感興趣的人'],
    //     rating: 3
    // },
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

</script>
