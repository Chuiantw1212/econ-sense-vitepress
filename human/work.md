# 人類學工作

## 線上/實體講座

### 簡報
<LazySlide shareLink="https://docs.google.com/presentation/d/1O8N_N0XFHW61heTHcb0cl1Aix3jWTiHr-gbGxsOTk6I/edit?usp=sharing">
    <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vS5XD1yRp_y4Ad3DfCnUUaZoG1NL8Y297WJfDEYBE008J8iS7PVPQALUgi-Rh-BHPHLByAZTlskc1fJ/pubembed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import LazySlide from '../components/lazySlide.vue'
import Books from '../components/books.vue'

const bookItems = [
    {
        id: '11100967723',
        name: '為工作而活：生存、勞動、追求幸福感，一部人類的工作大歷史',
        desc: `<p>原始社會物資匱乏，人類祖先卻能悠閒過活，每週只要工作15小時？
反觀現代社會技術發達，我們卻加班過勞、甚至害怕被未來AI取代！</p>

<p>是人類主宰工作，還是工作支配了生活？
大量湧現的工作真有存在意義嗎？
我們今天是否為了滿足社會的期待，導致人們為了忙碌而忙碌？</p>`
    },
]

</script>