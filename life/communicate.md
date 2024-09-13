---
outline: deep
---

# DiSC順勢溝通

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: '/life/springTime.png',
        description: `韶光心理學苑（Springtime Psychology Academy,簡稱SPA）由許庭韶諮商心理師所創立，集結NLP與心理學相關的專業人士，希冀能將助人NLP的觀點，搭配心理學的知識，透過淺顯易懂的活動體驗，幫助人們可以擁有更多的彈性思維與技巧方法面對人生困境！`,
        name: '韶光心理學苑',
        url: 'https://www.accupass.com/organizer/detail/2008300219423146378210/',
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