---
outline: deep
---

# 職涯發展

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
                <a style="white-space: nowrap;" href="./software">
                軟體專案實務</a>
            </th>
            <th>
                從PMP到敏捷、理想敏捷<br>實務敏捷、角色盲點
            </th>
            <th>
               <ul>
                    <li>職場小白/轉職者，對軟體開發實務感到好奇的人</li>
                    <li>希望了解專案中角色個別困境的人</li>
                    <li>對專案管理有興趣的人與PMI相關持證人</li>
                </ul>
            </th>
        </tr>
          <tr>
            <th>
                <a style="white-space: nowrap;" href="./software">
                打造知識飛輪</a>
            </th>
            <th>
                制定目標、學習<br>輸出、優化
            </th>
            <th>
               <ul>
                    <li>想建立自己知識體系的人，包括學生和專家</li>
                    <li>渴望有效學習各方面知識的人</li>
                    <li>對講師內容創作充滿好奇心的人</li>
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
        image: '/career/daren.png',
        description: `「這裡是《大人學》課程報名網站。您可以在這裡參與我們優質的實體與線上課程，註冊學員也能下載豐富的學習資源。讓我們一同往成熟大人之路邁進！」`,
        name: '大人學',
        url: 'https://shop.darencademy.com/index/search/tag/PDU',
    },
]
</script>
