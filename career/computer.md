---
outline: deep
---

# 電腦DIY

探索電腦DIY的世界，深入主要元件、次要元件、其他周邊以及組裝的核心主題。這份資訊特別適合價格敏感型消費者，想親手組裝或修繕電腦的人，以及對於自己的電腦與工程師的電腦有好奇心的人。透過深入了解電腦元件和組裝過程，我們將助您打破組裝電腦的障礙，讓您更了解並掌握個人電腦的結構和性能。讓我們一同進入DIY的領域，體驗電腦組裝的樂趣與挑戰。

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTdQHkjPNm977-lTeNTnn39hpXFkUoORxER1nc6ou0QeVqT0X_WAg3nk_cUmUelf6CXnQwECUbefuMZ/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4RgwEbm8mpZj2WjBHdBYYrNTzSfqWi64Qhc3FTB_l7ol9YO4Vf-E0IA88hD02mcp15GI5M-aBlhLS/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

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
                <a href="https://www.coolpc.com.tw/evaluate.php" target="_blank">原價屋</a>
            </th>
            <th>組裝電腦的好地方，大本營在八德路上</th>
        </tr>
          <tr>
            <th>
                <a href="https://pcpartpicker.com/" target="_blank">PC Part Picker</a>
            </th>
            <th>檢查自己的組裝沒問題的好網站</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>

import Books from '../components/books.vue'
const bookItems = [
    {
        id: '11100992522',
        name: '電腦選購、組裝與維護自己來（超值附贈346分鐘影音講解）',
        desc: `<p>自己組裝電腦？應該很難吧！我又不是工程師等級的高手。(你應該也是這麼想的吧！）</p>

<p>本書以市場為導向，與您分享各種硬體選購技巧與經驗，同時還解答了一些新手容易產生的疑問。這些都是選購時最基本且必須具備的知識，即使硬體元件改朝換代，從本書中所學習到的原則、流程、方法、經驗等等，也依然能夠幫助您快速吸收新知，滿足電腦配置、選購、組裝與安裝的需求。</p>`,
    },
]
</script>
