---
outline: deep
---

# 軟體專案理想與實務

## 投影片
<iframe
 src="https://docs.google.com/presentation/d/e/2PACX-1vSqT9z3iCbJo3qiO4UcEnwaLhrTXh49Ea4odLtx9hqwK_upOO3kvFvwM0_l6nLf-2pKFqkXMpFxcM9y/embed?start=false&loop=false&delayms=3000"
width="100%" height="569" allowfullscreen="true" mozallowfullscreen="true"
webkitallowfullscreen="true"></iframe>

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
                <a href="https://www.facebook.com/itdogcom" target="_blank">
                   Dog Com
                </a>
            </th>
            <th>IT狗優質粉專</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.pmi.org.tw/?post_type=tribe_events" target="_blank">
                   PMI Taiwan
                </a>
            </th>
            <th>學習專案管理的好地方</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookGroup"></Books>

<script setup>

import Books from '../components/books.vue'
const bookGroup = [
    {
        id: '11100157020',
        name: '人月神話：軟體專案管理之道',
        desc: `<p>有些書，對於讀者和作者就像是年金一樣，可以年年分紅。《人月神話》就是這樣一本書……年輕的軟體工程師、缺錢的研究生、懶惰的程式設計老手，常問我哪一本電腦書最好：「如果我被困在荒島上，只能帶一本電腦書，應該選哪一本？」這問題很荒謬，但他們堅持要答案。假如你真的被放逐到這樣的小島上，應該陪伴你的是《人月神話》。</p>
`,
    },
    {
        id: '11100671260',
        name: '無瑕的程式碼（番外篇）：專業程式設計師的生存之道',
        desc: `<p>在職場上，不可避免地會被要求趕工、加功能，即便大師也不例外，遇到這些情況，你必須學會Say No，同樣地，你也必須學會Say Yes，只有謹慎地Say Yes，別人才會對你有所尊重，相信你是一位專業人士，如此當你在Say No時，才會更有分量，更能說服對方。</p>

<p>本書作者Bob大叔，Robert C. Martin，是一位軟體大師，也是一位著名作家，其著作《Agile Software Development: Principles, Patterns, and Practices》曾獲得有IT奧斯卡獎之稱──Jolt震撼年度大獎。</p>`
    }
]
</script>