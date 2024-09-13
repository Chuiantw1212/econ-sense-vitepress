---
outline: deep
---

# DiSC順勢溝通 (待定)

## 線上／實體說書

### 簡報

<ClientOnly>
    <iframe src="https://docs.google.com/presentation/d/10MFxs5wIvumV_iCDETE6ShkWWWcHxakMDYHDlNOluNk/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</ClientOnly>

### 評價

<ClientOnly>
    <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQh5jxy5hAIjI8ZS2l_QwDEk4XvNuzS3vDnvHPT5-VX54gXxR0dsZToe7SvBJWefepByHuX0_gPt4Ic/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>
</ClientOnly>

## 有關忘形老師

### 人際風格談溝通學習地圖

欲知詳情，付費後解鎖更多。請參加忘形老師的公開班。

<img src="https://storage.googleapis.com/public.econ-sense.com/life/communicate/172resizeTo344.webp" alt="disc" width="100%">

<!-- ![disc](https://storage.googleapis.com/public.econ-sense.com/life/communicate/downgrade.webp "disc") -->

### DiSC公開班

[![wanshing](https://storage.googleapis.com/public.econ-sense.com/life/communicate/disc.webp)](https://portaly.cc/wanshing/)

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: 'https://storage.googleapis.com/public.econ-sense.com/life/communicate/disc.webp',
        description: `張忘形：圖文故事/人際關係/溝通表達 培訓師`,
        name: '韶光心理學苑',
        url: 'https://portaly.cc/wanshing',
    },
]

const bookItems = [
    {
        id: '11100976055',
        name: '順勢溝通：一句話說到心坎裡！不消耗情緒，掌握優勢的39個對話練習',
        desc: `<p>如果表達像丟球，</p>
<p>那麼溝通就是接球，</p>
<p>如何完美接招，再做個好球給對方，</p>
<p>你需要「順勢溝通」的思考！</p>`,
    },
]
</script>