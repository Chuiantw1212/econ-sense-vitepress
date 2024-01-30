---
outline: deep
---
# 金融理財

探索深入的金融理財世界。這裡涵蓋了理財框架、勞工退休規劃以及投資進階管道等多樣化主題，為您提供專業的資訊和實用建議。無論您是金融新手或有一定經驗，這些內容都能夠幫助您理解金融領域中的重要概念和方法。讓我們一同探索，有效管理財富，為未來做好準備。

## 講座行事曆

<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Asia%2FTaipei&showPrint=0&showDate=1&showTabs=0&showCalendars=0&showTz=0&showTitle=0&hl=zh_TW&src=ZTlkYmE0YWQyYTBhNzEyZjgwMDZhZmE3NWI1NTM5MjllMjg2MWJjYmU1MTFlNmMzYzEyNWU2YTcwMmQ3NzNkZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=emgtdHcudGFpd2FuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23E4C441&color=%234285F4" style="border-width:0" width="100%" height="420" frameborder="0" scrolling="no"></iframe>

<a href="https://calendar.google.com/calendar/u/0?cid=ZTlkYmE0YWQyYTBhNzEyZjgwMDZhZmE3NWI1NTM5MjllMjg2MWJjYmU1MTFlNmMzYzEyNWU2YTcwMmQ3NzNkZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t" target="_blank">點此訂閱講座行事曆。</a>

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
                理財框架
            </th>
            <th>
                開源、節流<br>投資、風險控制
            </th>
            <th>
               <ul>
                    <li>剛出社會的新鮮人</li>
                    <li>想掌握理財觀念全貌的人</li>
                    <li>總覺得理財很難的人</li>
                </ul>
            </th>
        </tr>
        <tr>
            <th>
               勞工退休規劃
            </th>
            <th>
                勞保勞退、老後變現<br>老前整理、移轉節稅
            </th>
            <th>
                <ul>
                    <li>家中有退休/屆退休長輩的孝順子女</li>
                    <li>想儘早規劃未來的遠見人</li>
                    <li>擔心退休金不夠用的社會大眾</li>
                </ul>
            </th>
        </tr>
        <tr>
            <th>
                投資進階管道
            </th>
            <th>
                證券、加密貨幣<br>太陽能、天使投資
            </th>
            <th>
                <ul>
                    <li>對純被動收入好奇的人</li>
                    <li>想遠離看盤或沒時間看盤的人</li>
                    <li>怕被騙或是歸零的人</li>
                </ul>
            </th>
        </tr>
    </tbody>
</table>

## 外部優質課程連結

<Courses :modelValue="items"></Courses>

<script setup>

import Courses from '../components/courses.vue'
const items = [
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
]

</script>