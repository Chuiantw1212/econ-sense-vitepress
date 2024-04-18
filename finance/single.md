---
outline: deep
---

# 單生狗生存手冊

開發中

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTvhDGQjUl2d1PQ4SHR1PHZv3AsWxtqMwAjLfqHceVXpYQWo0QUFr6k4j38gbxlzo3PgwueSzaAFoXI/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallow fullscreen="true"></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_9nCrCu57umhDM93B81VU8UnEipxdSG1YDKjIPiPPc33vOCOC4hTfwavJZxjllyD2lnbkl5wbXY_Q/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

## 老人安養信託定型化契約參考範

此為節錄重點版，完整版請見 <a href="https://www.trust.org.tw/tw/old-disability/trust/5" target="_blank">高齡者身心障礙者信託相關資訊</a>
。這也是為什麼信託我是在這個主題介紹，反正最終都是要選一個可信任的人託付，有家庭成員的人選擇會比一個人終老更多。就一個一定會成立家庭的人來說，比起使用安養信託，然後選一個法人監察人，直接轉給配偶子女，讓他們來照顧自己會更合理。

<iframe src="https://storage.googleapis.com/public.econ-sense.com/%E8%80%81%E4%BA%BA%E5%AE%89%E9%A4%8A%E4%BF%A1%E8%A8%97%E5%AE%9A%E5%9E%8B%E5%8C%96%E5%A5%91%E7%B4%84%E5%8F%83%E8%80%83%E7%AF%84%E6%9C%AC.pdf" width="100%" height="420"></iframe>

## 外部資源

### 財務準備
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
                <a href="https://www.trust.org.tw/tw/old-disability/trust/2?i=0" target="_blank">高齡者身心障礙者信託相關資訊</a>
            </th>
            <th>中華民國信託業商業同業公會製作</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.trust.org.tw/sinopac/risk-assessment/#idLinkStart" target="_blank">信託公會高齡風險評估試算表網頁版</a>
            </th>
            <th>中華民國信託業商業同業公會製作</th>
        </tr>
    </tbody>
</table>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: '/finance/pingho.jpeg',
        description: `服務團隊專業、貼近客戶需求
為全方位服務的綜合法律事務所，具良好溝通能力
深耕於各專業領域，長期為客戶提供精品式法律服務`,
        name: '品和法律事務所',
        url: 'https://www.facebook.com/clclawofficetw',
    },
]

const bookItems = [
    {
        id: '14100099633',
        name: '結婚滅亡：超單身時代來臨，不婚是罪大惡極嗎？',
        desc: `<p>本書探討單身時代的各種社會現象，
以豐富的數據為基礎，
剖析社會問題與結婚CP值，
從各個角度探討現今單身時代中的「婚姻」、「家庭」、「社群」、「幸福」議題，
以全新觀點看待，探討現代年輕人的幸福道路！</p>`,
    },
    {
        id: '11101021141',
        name: '安養信託1＋2【套組】',
        desc: `<p>讓你安享晚年、拒當下流老人，
退休金持續放大，擁有晚美人生的必備讀物！</p>
<ul>
    <li>《安養信託：放大你的退休金，打造晚美人生》</li>
    <li>《安養信託（實例篇）：樂享晚美人生，讓親情不變調》</li>
</ul>`,
    },
]
</script>