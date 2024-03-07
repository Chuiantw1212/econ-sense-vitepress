---
outline: deep
---

# 職涯發展 - 工程師專區

歡迎來到我的職涯發展分享，這裡是我個人工作經驗的統整。

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
                <a style="white-space: nowrap;" href="./computer">
                電腦DIY</a>
            </th>
            <th>
                主要元件、次要元件<br>其他周邊、組裝
            </th>
            <th>
               <ul>
                    <li>價格敏感型消費者</li>
                    <li>想自己組裝/修繕電腦的人</li>
                    <li>總感覺自己被店家宰羊的人</li>
                </ul>
            </th>
        </tr>
    </tbody>
</table>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

<script setup>
import Courses from '../components/courses.vue'

const courseItems = [
    {
        image: '/career/learnWeb.png',
        description: `LearnWeb Taiwan 旨在交流網頁領域相關資訊與技術，包含但不限於「前端」/「後端」/「UI、UX」/「PM」等職務相關內容，我們不定時會舉辦工作坊、講座、純聊天場，也歡迎剛入門與想學習網頁技術的朋友加入！`,
        name: 'LearnWeb-Taiwan',
        url: 'https://learnweb.tw/',
    },
]
</script>
