---
description: 從學渣到黑馬，我的成長故事揭示了教育體制中的挑戰，反思《傷仲永》與現代教養方式，帶你探索如何喚醒每個人的潛力，成為不被忽視的黑馬。
outline: [2,3]
---

# 我是學渣，也是黑馬：突破原生家庭限制，自我成長的成功故事

這是從學渣到黑馬的成長故事，揭示如何突破原生家庭的限制，重新教養自己。透過反思教育體制的問題及《傷仲永》的啟示，探索如何在不利環境中培養自我潛力，找到屬於自己的發展方向。本故事鼓勵面對困境，實踐自我成長之路。

## 線上/實體講座

### 簡報

<LazySlide :isImmediate="true" shareLink="https://docs.google.com/presentation/d/1Tyw9GaK-FKUAondugENEesE9EDLR0DUlxXzGMoNoa0g/edit?usp=sharing">
    <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRu072hiqHksXUj0ve-VUUY8f2ZnI-OXqIFMgZKLis7-BcScvYzm3PueTAhK7pIm5kumwEMdw3v9ow2/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

### 評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRSH6fnws8Ewhmo22CQ9BSmhDI3sd8bxCzH3eNcWLPUbE-D2LsFFn5t8CAPp0nNWMB1CpRYBfH0UUZN/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

## 孩子跟父母相似度

<Heredity></Heredity>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup lang="ts">
import LazySlide from '../components/lazySlide.vue'
import Heredity from '../components/heredity.vue'
import Books from '../components/books.vue'

const bookItems = [
    {
        id: '11100874320',
        name: '黑馬思維：哈佛最推崇的人生計畫，教你成就更好的自己',
        desc: `<p>一個改變無數人生涯抉擇的權威研究：
哈佛大學「黑馬計畫」，
兩位曾中輟休學的「黑馬教授」，
指引你找到面對未來的最佳路徑，
成為最優秀的自己！</p>
`,
    },
    {
        id: '11100988640',
        name: '數據、真相與人生：前Google資料科學家用大數據，找出致富、職涯與婚姻的人生解答',
        desc: `<p>最會說故事的資料科學家，
用最幽默的語句、最驚奇的發現，
告訴你大數據不只是工作的利器，更是讓人生升級的工具！</p>
<p>在健康狀況、未來收入、教育程度……等方面，父母對子女的影響都出奇地小！
孟母三遷是對的？！選對小孩的成長環境，就能讓孩子的未來收入成長12％！
你讓孩子接觸到哪些人，比起為他做的任何決定，更可能改變他的一生。</p>
`,
    },
]
</script>
