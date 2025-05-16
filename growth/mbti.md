# MBTI內在世界建構法

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vT66yvXkfLnVLqu-jTDr4qck6778FoUkCwNWLe8KjeTlqRl41Lo_tMvcYSzvS6k6SBmysFjfFerjJnQ/pubembed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 線上/實體講座

### 簡報

<LazySlide shareLink="https://docs.google.com/presentation/d/1GXdwsp7Ir00nO6nZrGMiAYRVRu4rlgl4AQk2NzmRz2Q/edit?usp=sharing">
<iframe title="Google Slides" src="https://docs.google.com/presentation/d/e/2PACX-1vT66yvXkfLnVLqu-jTDr4qck6778FoUkCwNWLe8KjeTlqRl41Lo_tMvcYSzvS6k6SBmysFjfFerjJnQ/pubembed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

### 評價

<iframe title="Google Sheets" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR-Eok3tvUqW09znrEGKMJZIOPNYhgjTeikTD6TcY1ifhpqgLmxHyPWLpwyjutj6QUXNQ_Y3xF2DcbH/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

<!-- ## 外部優質課程

<Courses :modelValue="courseItems"></Courses> -->

<!-- ## 延伸閱讀

<Books :modelValue="bookItems"></Books> -->

<script setup>
import LazySlide from '../components/lazySlide.vue'
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: 'https://storage.googleapis.com/public.en-chu.com.firebasestorage.app/life/carer/%E5%AE%B6%E7%85%A7%E7%B8%BD%E6%9C%83.webp',
        description: `中華民國家庭照顧者關懷總會(家總)成立於85年，其倡議目標為發展多元且充足的長照資源，讓家庭有選擇權，以及對自願選擇成為家庭照顧者，提供符合需求的支持性服務。`,
        name: '中華民國家庭照顧者關懷總會',
        url: 'https://www.youtube.com/@familycaretw/videos',
    },
    {
        image: 'https://storage.googleapis.com/public.en-chu.com.firebasestorage.app/life/carer/%E8%80%81%E5%8C%96%E7%B7%9A%E4%B8%8A%E8%AA%B2.webp',
        description: `隨著年齡增長，老化不只生理上的變化而已，而是各種問題的開始，這堂課讓你聰明的應對老化問題，學會維護身體的機能，使自己保持最佳狀態，應對各種生活和工作的挑戰，正常扮演社會與家庭的角色。`,
        name: '老化全方位應對手冊 | 機能維持 X 聰明就醫 X 照護策略 X 風險規劃',
        url: 'https://hiskio.com/courses/2133/about',
    },
]

const bookItems = [
    {
        id: '11100858406',
        name: '陪爸媽安心到老︰醫療決策、長照資源、陪伴技巧，一本完解不慌亂',
        desc: `<p>衰老和死亡是一條單向道，沒人可以真正準備好
嬰兒潮世代逐漸老去，子女愈生愈少
你可能必須獨自面對父母的老、衰、死</p>

<p>提早「知老」、「認老」、「備老」
必要時讓你不致慌亂、不知如何是好
多一分了解，就多一份心安和坦然
何況照護父母，也是為照護明天的自己，預做準備！</p>`,
    },
    {
        id: '11100864506',
        name: '【圖解】生活自立支援照護指南',
        desc: `<p>約束、尿布及不當餵食等照護方式，
不僅無助於被照護者的功能恢復，
甚至會導致失能狀況惡化。
透過照護者技巧性的引導與專業性的照護，
可提升被照護者的自主生活能力，重拾自信與尊嚴。
何況照護父母，也是為照護明天的自己，預做準備！</p>`,
    },
]
</script>