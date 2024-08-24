---
description: 《網站初學須知》涵蓋網站演進歷程、新手自學要點與個人經驗分享，適合網站初學者、待轉職工程師與PM。
outline: deep
---

# 網站初學須知

《網站初學須知》為初學者提供了全面的學習指南，內容涵蓋網站技術的演進歷史、自學的基本須知，以及個人早期學習經驗的分享。無論是想了解網站基本概念的初學者，準備轉職成工程師的學習者，還是需要與工程師有效溝通的專案經理，這份指南都將為您奠定堅實的基礎。

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTWoH-9ATrPJwCIL27NuWaFpREmdcpVNGb_DkK5B5RKNcptjoXCKG7ooma38nM1-w5gD-s7F0MVZtGn/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

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
                <a href="https://www.tiobe.com/tiobe-index/" target="_blank">TIOBE Index</a>
            </td>
            <td>觀察語言的全球使用趨勢</td>
        </tr>
        <tr>
            <td>
                <a href="https://web-frameworks-benchmark.netlify.app/" target="_blank">Web Framework Benchmark</a>
            </td>
            <td>選擇第一個前端框架時可以參考</td>
        </tr>
        <tr>
            <td>
                <a href="https://caniuse.com/" target="_blank">Can I Use?</a>
            </td>
            <td>瀏覽器的相容性檢查，自從2022 IE絕種後使用率已大幅下滑，但2024時我們仍有Safari要面對。</td>
        </tr>
        <tr>
            <td>
                <a href="https://db-engines.com/en/ranking/" target="_blank">DB Engines</a>
            </td>
            <td>選擇第一個前端框架時可以參考</td>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>

import Books from '../components/books.vue'
const bookItems = [
    {
        id: '11100912049',
        name: '軟體開發人員職涯發展成功手冊',
        desc: `<p>你快速上手新語言，掌握面試訣竅，一舉拿下夢想中的程式開發工作</p>
<p>暢銷書作家JOHN SONMEZ繼《Soft Skills軟實力：軟體開發人員的生存手冊》最新力作！</p>`,
    },
]
</script>
