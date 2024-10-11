---
description: 《退休規劃(上)》涵蓋勞保勞退、公保公退、老後居住與資產變現，適合關注退休職場人士與計畫老後生活準備的人。
outline: deep
---

# 退休規劃(上)

《退休規劃(上)》探討勞保勞退、公保公退、老後居住和資產變現等重要議題，專為關注退休的職場人士、公務員以及正在為老後居住和資產變現做準備的人設計。這份內容將幫助您掌握退休規劃的核心知識，讓您為未來做好周全的準備。

## 簡報

<LazySlide :isImmediate="true" shareLink="https://docs.google.com/presentation/d/1k2jUNx0oeChEQuNQGEHy75xt3N7vIt8NH2VHR0BthAc/edit?usp=drive_link">
<iframe
src="https://docs.google.com/presentation/d/e/2PACX-1vS37SbGFgAkOGhOPFzPqUugcqy69HCJ6gpouzzTTKqe6gmMyx47uq8_itKfoDcQA7_KQe4_f22emw4X/embed?start=false&loop=false&delayms=3000"
width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true"
webkitallowfullscreen="true"></iframe>
</LazySlide>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQDgVvA9Py9t_HUcn3Pzsf0Jg-ktaKNweyzH98XDeBgvfpAiSE-_RrBuUbNfBVWBKFMExHYC-6ssWQ9/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

<!-- ## 活動照片

<Photos v-model="photoItems"></Photos> -->

## 外部資源

### 退休金流

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
                <a href="https://edesk.bli.gov.tw/me/#/na/login" target="_blank">
                   勞保局E化服務系統
                </a>
            </td>
            <td>查看個人勞保、勞退資料</td>
        </tr>
        <tr>
            <td>
                <a href="https://www.bli.gov.tw/0000002.html" target="_blank">
                   勞保局勞保業務專區
                </a>
            </td>
            <td>查詢詳細的勞保法規、條款項目、QA</td>
        </tr>
        <tr>
            <td>
                <a href="https://www.houseplus.com.tw/" target="_blank">
                   好實價
                </a>
            </td>
            <td>實價登錄網站，試算房地產買賣價格使用</td>
        </tr>
        <tr>
            <td>
                <a href="https://pip.moi.gov.tw/V3/B/SCRB0504.aspx" target="_blank">
                   社會住宅包租代管
                </a>
            </td>
            <td>內政部提供</td>
        </tr>
    </tbody>
</table>

<!-- ## 延伸閱讀

<Books :modelValue="bookItems"></Books> -->

<script setup>
import LazySlide from '../components/lazySlide.vue'
import Books from '../components/books.vue'
import Photos from '../components/photos.vue'

const bookItems = [
    {
        id: '11100764608',
        name: '當爸媽過了65歲：你一定要知道的醫療、長照、財務、法律知識',
        desc: `<p>一本寫給上班族的知老實用手冊
照顧父母，也為未來的自己做準備</p>

<p>關於「老」，我們知道的太少，準備的也太少。
不管是父母的，或是你自己的。
面對「老之將至」，你要倉皇的摸索，還是優雅的預習？</p>
`,
    },
]

const photoItems = [
    {
        src: "https://storage.googleapis.com/public.econ-sense.com/finance/retirement/727509.webp",
        alt: "過程",
    },
    {
        src: "https://storage.googleapis.com/public.econ-sense.com/finance/retirement/727522.webp",
        alt: "過程",
    },
    {
        src: "https://storage.googleapis.com/public.econ-sense.com/finance/retirement/727523.webp",
        alt: "過程",
    },
    {
       src: "https://storage.googleapis.com/public.econ-sense.com/finance/retirement/727516.webp",
        alt: "合照",
    },
]
</script>
