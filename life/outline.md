---
outline: deep
---

# 好好生活

## 內容目錄

<table>
    <thead>
        <tr>
            <th>名稱</th>
            <th>內容</th>
            <th>誰適合參與</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>
                <a style="white-space: nowrap;" href="./scarcity">
                匱乏心理學</a>
            </th>
            <th>
                新文明病、認知匱乏<br>匱乏循環、打造寬鬆
            </th>
            <th>
                <ul>
                    <li>玩過財富流想多了解精力的人</li>
                    <li>想知道為何缺錢時不該借貸或主動投資的人</li>
                    <li>對基本的認知心理學感興趣的人</li>
                </ul>
            </th>
        </tr>
         <tr>
            <th>
                <a style="white-space: nowrap;" href="./scarcity">
                我是照顧者</a>
            </th>
            <th>
                延遲老化、照顧資源<br>醫療資源、跨領域整合
            </th>
            <th>
                <ul>
                    <li>想為了照顧父母做準備的人</li>
                    <li>想減輕家人負擔的長輩</li>
                    <li>被各種長照術語搞得很亂的人</li>
                </ul>
            </th>
        </tr>
         <tr>
            <th>
                <a style="white-space: nowrap;" href="./housing">
                極簡全齡宅</a>
            </th>
            <th>
            </th>
            <th>
                <ul>
                </ul>
            </th>
        </tr>
    </tbody>
</table>

## 外部優質課程

<Courses :modelValue="items"></Courses>

<script setup>

import Courses from '../components/courses.vue'
const items = [
    {
        image: '/life/04___logo_promote.jpg',
        description: `只要有網路，無論是開車、走路、做菜、帶小孩，隨時都可以在線學習。讓我們用聲音陪你往前走，留給你一雙眼睛，抬頭看見自己和世界的變化。`,
        name: '啟點線上學苑',
        url: 'https://www.youtube.com/@koob',
    },
]

</script>
