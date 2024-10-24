---
description: 深入探索電腦DIY，包括主要元件、次要元件、周邊和組裝。適合價格敏感型消費者、DIY愛好者和想了解組裝過程的用戶。探索電腦DIY，增強您在硬體領域的自信。
outline: deep
---

# 電腦DIY：了解主要元件、周邊設備及組裝步驟的實用分享

「電腦DIY」專區介紹電腦組裝的基本知識，從主要元件、次要元件到周邊設備的選擇，讓您了解硬體配置的價值與功能。這個分享特別適合價格敏感的消費者、希望自行組裝電腦的初學者，以及想更深入了解電腦硬體原理的人，幫助您輕鬆掌握電腦DIY的樂趣。

## 簡報

<LazySlide shareLink="https://docs.google.com/presentation/d/13hB-bRyf2LtKsBIStpQtPvJngS4v9uNLGmoE3UUyA-8/edit?usp=drive_link">
<iframe title="presentation" src="https://docs.google.com/presentation/d/e/2PACX-1vTdQHkjPNm977-lTeNTnn39hpXFkUoORxER1nc6ou0QeVqT0X_WAg3nk_cUmUelf6CXnQwECUbefuMZ/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

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
            <td>
                <a href="https://www.coolpc.com.tw/evaluate.php" target="_blank">原價屋</a>
            </td>
            <td>組裝電腦的好地方，大本營在八德路上</td>
        </tr>
          <tr>
            <td>
                <a href="https://pcpartpicker.com/" target="_blank">PC Part Picker</a>
            </td>
            <td>檢查自己的組裝沒問題的好網站</td>
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
        id: '11100992522',
        name: '電腦選購、組裝與維護自己來（超值附贈346分鐘影音講解）',
        desc: `<p>自己組裝電腦？應該很難吧！我又不是工程師等級的高手。(你應該也是這麼想的吧！）</p>

<p>本書以市場為導向，與您分享各種硬體選購技巧與經驗，同時還解答了一些新手容易產生的疑問。這些都是選購時最基本且必須具備的知識，即使硬體元件改朝換代，從本書中所學習到的原則、流程、方法、經驗等等，也依然能夠幫助您快速吸收新知，滿足電腦配置、選購、組裝與安裝的需求。</p>`,
    },
]
</script>
