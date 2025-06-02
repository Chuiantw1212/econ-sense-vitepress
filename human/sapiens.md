# 說書: 人類大歷史

我們活在一個充滿選擇的時代，但這些選擇真的讓我們更自由嗎？

讀完哈拉瑞的《人類大歷史》，我最大的感觸是：人類所謂的進步，往往只是換了一種方式受困。
農業革命讓我們有了穩定糧食，卻也讓人類第一次被土地綁住；工業革命讓我們加速連結世界，卻也讓時鐘成為我們生活的主宰。

哈拉瑞說，歷史不是一條通往幸福的直線。它是一連串「看似合理，實則代價巨大的決定」，一步步讓我們成為文明的俘虜。
從農業到國家，從金錢到宗教，從時間制度到現代焦慮，這本書像是一面鏡子，讓我們看見自己早已習以為常的現代生活，背後其實蘊藏著深層的不自由。

這篇心得，正是我從書中提取出來的幾條主線，搭配自己的觀察與思考，嘗試整理出屬於這個世代的提問：
我們真的是在「進步」嗎？還是只是走得比較快的困獸之路？

## 線上/實體講座

### 簡報
<LazySlide shareLink="https://docs.google.com/presentation/d/1BE34m9-DTWIVGHNOGnMv0-BVuioM33G1fCKsvkEe2R8/edit?usp=sharing">
    <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vScrdcYzDXvdhj_n3HN0hCWAr3WcrcxzF41kOeBwtPs4raiLhJG_H08PPMWL_Pwelf40grEZo7SrJty/pubembed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420px" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import LazySlide from '../components/lazySlide.vue'
import Books from '../components/books.vue'

const bookItems = [
    {
        id: '11100833200',
        name: '人類大歷史：從野獸到扮演上帝',
        desc: `<p>《人類大歷史》為什麼能夠在國際暢銷書榜上爆衝？
原因很簡單，它處理的是歷史的大問題、現代世界的大問題，
而且，它的寫作風格是刻骨銘心的生動。你會愛上它！</p>
<p>——戴蒙（Jared Diamond），普立茲獎巨著《槍炮、病菌與鋼鐵》作者</p>`,
    },
]

</script>