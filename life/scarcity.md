---
description: 深入研究匱乏心理學，探討新文明病、認知匱乏、匱乏循環及寬鬆主題。適合玩過財富流、對借貸好奇、對心理學有興趣者。透過研究，討論新文明病、認知匱乏、打破匱乏循環方法，助您創造更寬鬆的生活。
outline: deep
---

# 匱乏心理學

深入研究匱乏心理學，探討新文明病、認知匱乏、匱乏循環以及打造寬鬆等核心主題。這份分享特別適合那些曾玩過財富流卻渴望更深入了解精力的人，對於缺錢時為何不應該借貸感到好奇的人，以及對基本心理學有興趣的人。透過深入研究，我們將討論新文明病的現象，揭示認知匱乏的本質，並提供實用方法打破匱乏循環，助您創造更自由、寬鬆的生活。讓我們一同深入，了解心理學如何影響我們的生活和決策。

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQOMxzKsjo0S-18dohhv0YykyG3Y3Cxn03MgJOomFNZWOAqwZF5wFnyR9e8e3t5xpKnlMNovViS4mC1/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true"
webkitallowfullscreen="true"
></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRvifrIVGU8_0nr3dP5cK9quVEOb2FoBMHAQhnxra1gJIu_Mo1fZ8eDI0UzpWCxvQLdv9hiH4Z_2OGN/pubhtml?widget=true&amp;headers=false"  width="100%" height="420"></iframe>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: '/life/springTime.png',
        description: `探索潛意識，聆聽內心的回聲，擁抱真實，成為你心靈的騎象人。`,
        name: '韶光心理學苑',
        url: 'https://springtimenlp.com/',
    },
]

const bookItems = [
    {
        id: '11100905774',
        name: '匱乏經濟學：為什麼擁有的老是比想要的少？面對匱乏感最強烈的時刻，你該如何做聰明抉擇？',
        desc: `<p>行為經濟學是認知心理學與經濟學的新領域，探討人在什麼認知之下做了什麼決定，不管是在臉書上按了「讚」，還是決定購買（或不買）某個東西，都有心理學的基礎，也有經濟學的意義。《匱乏經濟學》以行為經濟學的最新研究、令人印象深刻的有趣案例，提供了理解的新方式，也告訴個人與組織要如何管理匱乏。</p>`,
    },
    {
        id: '11100977275',
        name: '直覺陷阱：擺脫認知偏誤，擁有理性又感性的30個超強心理素質',
        desc: `<p>你的直覺充滿陷阱！
個人的認知偏誤，在在都影響到我們對外界人事物的判斷，
一旦判斷失準，可能就會造成生活素質受到影響，甚至影響到心理健康度。
本書30個章節當中所提出的各種效應與現象，幾乎都是現代人常常會犯的認知偏誤。
認知偏誤本身並不可怕，可怕的是大家不知道自己具有認知偏誤。</p>`,
    },
]
</script>
