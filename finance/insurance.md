---
outline: deep
---

# 醫生買保險

## 投影片

<iframe src="https://docs.google.com/presentation/d/1fsMJsPGFXrj9Hkl6Xgy8_Rpc47BuA_iP3oA8yBeiC8w/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT7aDOY_D_Qo454P3UDiInpgwyecwdd2zBzOPeSGXcJCZzyWi_ExeQkWEJduqdmBvabgSTLu2uLN5MF/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

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
            </th>
            <td></td>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Books from '../components/books.vue'
const bookItems = [
    {
        id: '11100900630',
        name: '醫生強烈建議你買的保險：醫療險、癌症險、意外險、長照險……買什麼險才真正有保障？突破業務員暗黑話術，靠自己買對保險',
        desc: `<ul>
<li>醫療險、癌症險、意外險、長照險……對一個家庭來說，最需要的都不是這些。</li>
<li>保了住院給付金，一旦住院就可領錢？別傻了，醫院根本不讓你住院。</li>
<li>罹癌、開刀後，卻發現保險不理賠？癌症險真的必要嗎？醫生用數字告訴你。</li>
<li>大多數人買的長照險，將來用不到；投資型保單？幾年後都賠錢。</li></ul>

<p>醫療險、癌症險、意外險、長照險……保險這麼多種，我到底該買什麼險？
專業醫生告訴你：你最需要也最好的保險，其實只有四個字。
教你突破業務員暗黑話術，靠自己買對保險。</p>`,
    },
]
</script>
