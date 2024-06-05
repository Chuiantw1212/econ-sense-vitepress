---
description: 減少使用現金卻花更多錢？奇怪到底都花到哪去？為現代人設計的存錢守則！不知不覺就有節餘
outline: deep
---

# 理財框架

減少使用現金卻花更多錢？奇怪到底都花到哪去？為現代人設計的存錢守則！不知不覺就有節餘

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQmCUJNXjyzyGaPc6_NXyjwmAshXjLOjfcG-fJrUb7XdVdEZhI2w_dD0WI0vwmf_cfOmoy3zKsNlTpz/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vS-dd3TtGo9ZL7PyKHDVIRIBC0TvbzSP6rrjnQZTtQ_pyZJw7pDIR1opRm8f-ZaShvJb-0OKIA_5U0Z/pubhtml?widget=true&amp;headers=false" width="100%" ></iframe>

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
                <a href="https://www.pension.org.tw/index.php/2018-10-03-15-11-09/2019-02-13-00-01-00" target="_blank">
                   勞退基金歷年收益
                </a>
            </th>
            <th>中華民國退休金協會的整理</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/taxation-scope/which-income/QOzOq69" target="_blank">
                   勞退自提免繳稅
                </a>
            </th>
            <th>財政部說明自提不計入所得</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-knowledge/WDNAx2Y" target="_blank">
                   勞退一次領稅務範例
                </a>
            </th>
            <th>財政部試算一次請領稅務</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.einvoice.nat.gov.tw/APCONSUMER/BTC501W/" target="_blank">
                   電子發票整合平台
                </a>
            </th>
            <th>可申請手機載具</th>
        </tr>
        <tr>
            <th>
                <a href="https://moneybook.com.tw/" target="_blank">
                   麻布記帳
                </a>
            </th>
            <th>適合管理資產的自動記帳工具</th>
        </tr>
         <tr>
            <th>
                <a href="https://www.ecloudlife.com/w/" target="_blank">
                   雲端發票
                </a>
            </th>
            <th>適合管理收支的自動記帳工具</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Books from '../components/books.vue'
const bookItems = [
    {
        id: '11100923100',
        name: '行動支付時代的金錢整理術',
        desc: `<p>減少使用現金卻花更多錢？奇怪到底都花到哪去
為現代人設計的存錢守則！不知不覺就有節餘

<ol>
<li>行動支付、電子錢包、信用卡，全部都要當成隱形負債。</li>
<li>需要跟想要有分清楚嗎？支付習慣改變後的腦衝花錢最可怕。</li>
<li>錢包晚安曲：換成小錢包就存得了錢！並在一天的尾聲整理它。</li>
<li>偷學怦然心動的整理魔法：丟棄囤積雜物也能改善家庭財務。</li>
<li>有計畫性的浪費：別讓存錢成為痛苦，正確的浪費才是幸福。</li></ol>
`,
    },
]
</script>
