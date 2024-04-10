---
outline: deep
---

# ESBI實踐

整理中

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTFV24HJWU-IEJKTd2tJZfrZiuDqv20JsvNbZjaiqJJX1yF5uQzHm9zwrrgzoLpUYJqZJCKc2Rn7pHe/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

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
    {
        id: '11100998677',
        name: '富爸爸，有錢有理【25週年紀念版】：掌握現金流象限，才能通往財富自由',
        desc: `<p>你位於象限的哪一邊，決定了你是否能擁有財務自由</p>
        <ul>
            <li>E：雇員（上班族）。</li>
            <li>S：自由工作者、專家（例如醫生或律師等），或者中小企業老闆。</li>
            <li>B：大型企業的老闆（公司員工數超過500人及以上）。</li>
            <li>I：投資者。</p></li>
        </ul>
`,
    },
]
</script>
