---
outline: deep
---

# 下班創業

整理中

## 投影片

## 講座評價

## 外部資源

<!-- <table>
    <thead>
        <tr>
            <th>名稱</th>
            <th>說明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>
                <a href="https://www.pmi.org.tw/?post_type=tribe_events" target="_blank">
                   PMI Taiwan
                </a>
            </th>
            <th>學習專案管理的好地方</th>
        </tr>
    </tbody>
</table> -->

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: '/finance/niea.png',
        description: `新創學院，台灣創業課程第一品牌，是您創業路上的圓夢導師。四十幾年來，淬煉出八大課程：行銷、財務、職能、經管、法律、投資、創業、人資，將全方位打造創業者DNA，讓「創業」不再是夢：`,
        name: 'NiEA新創學院',
        url: 'https://www.accupass.com/organizer/detail/2003200357258690657700',
    },
]

const bookItems = [
    {
        id: '11100708828',
        name: '三年後，你的工作還在嗎？：掌握關鍵職能，迎向工匠、總管與行腳商人的時代！',
        desc: `<p>隨著時代快速變化，大企業崩解，就業市場已經進入混戰時期。</p>
<p>用功讀書、取得高學歷，不再是領高薪、進熱門產業的優先門票。</p>
<p>你要的是人生職能重新抓周！</p>
<p>快速建立三種新時代的新職能思維和能力，迎接未來的世界！</p>
`,
    },
]
</script>
