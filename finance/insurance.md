---
title: 不買保險的保險觀
description: 探討醫療與財務規劃中的關鍵險種，包括健保與醫療險、癌症險、長照險、儲蓄險等，並解析如何選擇合適的保單。適合保險新手、不確定是否需要投保的人，以及對自己已有保單感到疑惑的人。從基本概念到實務經驗，協助受眾理解醫療與保險的核心知識。
outline: deep
head:
  - - meta
    - name: og:image
      property: og:image
      content: /finance/insurance.jpeg
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 簡報

<LazySlide shareLink="https://docs.google.com/presentation/d/1fsMJsPGFXrj9Hkl6Xgy8_Rpc47BuA_iP3oA8yBeiC8w/edit?usp=drive_link">
    <iframe title="Google Slides" src="https://docs.google.com/presentation/d/1fsMJsPGFXrj9Hkl6Xgy8_Rpc47BuA_iP3oA8yBeiC8w/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

## 講座評價

<iframe title="Google Sheets" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT7aDOY_D_Qo454P3UDiInpgwyecwdd2zBzOPeSGXcJCZzyWi_ExeQkWEJduqdmBvabgSTLu2uLN5MF/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

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
            <td>
                <a href="https://finfo.tw/" target="_blank">
                   Finfo保險DIY
                </a>
            </td>
            <td>自行規劃保險的平台</td>
        </tr>
        <tr>
            <td>
                <a href="https://www.nhi.gov.tw/ch/cp-6015-0907b-3023-1.html" target="_blank">
                   健保統計專區
                </a>
            </td>
            <td>健保署網站</td>
        </tr>
        <tr>
            <td>
                <a href="https://hpcod.mohw.gov.tw/HospWeb/RWD/PageType/acp/introduction.aspx" target="_blank">
                   預立醫療決定推廣頁面
                </a>
            </td>
            <td>衛生福利部</td>
        </tr>
        <tr>
            <td>
                <a href="https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=242&pid=1282">中老年身心社會生活狀況長期追蹤調查</a>
            </td>
            <td>衛生福利部國民健康署</td>
        </tr>
        <tr>
            <td>
                <a href="https://www.bli.gov.tw/0004766.html">勞工保險給付業務</a>
            </td>
            <td>勞動部勞工保險局</td>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import LazySlide from '../components/lazySlide.vue'
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
     {
        id: '11101051569',
        name: '關於癌症，我們是否治療太多，知道太少︰從疾病、醫療到全人健康，與10位專家的深度對話',
        desc: `<p>面對生病的恐懼與未知，
除了交給醫生，我們還能做什麼？
這場「癌細胞究竟是什麼」的探索之旅，
也許沒有答案，卻看見了生命的希望。</p>
<p>
癌症跟我們想的不一樣！
一場偶然的契機，開啟了曾寶儀和林明謙拍攝紀錄片《交換禮物》，探索「癌症」與「療癒」的旅程。
「每部紀錄片都有它的命」，走著走著，這成了一場認識身體、反思生命的歷程。
</p>
`,
    },
]
</script>
