---
outline: deep
---

# 國中必修課

學習中......

## 外部資源

<table>
    <thead>
        <tr>
            <th>名稱</th>
            <th>說明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>
                <a href="https://www.yory.school/holland/quiz" target="_blank">
                   YORI的何綸碼測驗
                </a>
            </th>
            <th>Holland 興趣測驗將人與環境分成六大類型：R-實作型、I-研究型、A-藝術型、S-社會型、E-企業型及C-事務型。你可以輸入興趣何倫碼前兩碼，來查詢適合你的職涯發展領域與相關職務。</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>

import Books from '../components/books.vue'
const bookItems = [
    {
        id: '11100874320',
        name: '黑馬思維：哈佛最推崇的人生計畫，教你成就更好的自己',
        desc: `<p>一個從小罹患過動症，高中中輟，
不到二十歲就結婚生子，曾靠修籬笆維生的人，
後來成了哈佛博士與暢銷書作家。
一個從四所大學五度休學，忍受不了朝九晚五生活，
開車賣二手書度日的人，
後來成為知名的神經科學家。
他們是怎麼辦到的？
成為出人意料的黑馬之後，他們最想做的是什麼事？</p>
`,
    },
    {
        id: '11100918401',
        name: 'MBTI，你的職業性格是什麼？：發現自己的優勢，規劃最適生涯',
        desc: `<p>解讀自己，接受自己，
找到最適合自己的生涯路！</p>

<p>全球500強HR都在用的MBTI分析系統，
是一種沒有任何偏見的工具，
能指引你妥善利用自己的性格優勢，
在職涯中找到最準確的角色，
真正享受每個階段的工作與人生。</p>
`,
    },
]
</script>
