---
outline: deep
---

# 我是照顧者

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vR1PYi7FxCz4yIF4VV2aoOG65uv1Hp8aF6KkiIrLmz77_1_qCH4DLkIidCvhqG6Ak-SDeyBeDyD-poh/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

<!-- <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4RgwEbm8mpZj2WjBHdBYYrNTzSfqWi64Qhc3FTB_l7ol9YO4Vf-E0IA88hD02mcp15GI5M-aBlhLS/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe> -->

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
                <a href="https://www.familycares.com.tw/try.php" target="_blank">長照自付額計算機</a>
            </th>
            <th>中華民國家庭照顧者關懷總會提供</th>
        </tr>
        <tr>
            <th>
                <a href="https://ltcpap.mohw.gov.tw/public/index.html" target="_blank">長照資源地圖</a>
            </th>
            <th>衛生福利部提供</th>
        </tr>
        <tr>
            <th>
                <a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0070059" target="_blank">長期照顧申請及給付辦法</a>
            </th>
            <th>全國法規資料庫，包含部分負擔比率表</th>
        </tr>
    </tbody>
</table>

<!-- ## 延伸閱讀 -->

<!-- <Books :modelValue="bookGroup"></Books> -->

<script setup>

import Books from '../components/books.vue'
const bookGroup = [
    {
        id: '11100992522',
        name: '電腦選購、組裝與維護自己來（超值附贈346分鐘影音講解）',
        desc: `<p>自己組裝電腦？應該很難吧！我又不是工程師等級的高手。(你應該也是這麼想的吧！）</p>

<p>本書以市場為導向，與您分享各種硬體選購技巧與經驗，同時還解答了一些新手容易產生的疑問。這些都是選購時最基本且必須具備的知識，即使硬體元件改朝換代，從本書中所學習到的原則、流程、方法、經驗等等，也依然能夠幫助您快速吸收新知，滿足電腦配置、選購、組裝與安裝的需求。</p>`,
    },
]
</script>
