---
outline: deep
---

# 國中必修課

學習中......

## 投影片

<!-- ## Holland興趣碼速查

<select name="pets" id="pet-select">
  <option value="">--Please choose an option--</option>
  <option v-for="(item,index) in hollandItems" :key="index" :value="item.value">{{item.text}}</option>
</select>

你的Holland維度是 I:17 E:14 ...... -->

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

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
            <th>
                <a href="https://www.16personalities.com/tw/%E6%80%A7%E6%A0%BC%E6%B8%AC%E8%A9%A6" target="_blank">
                   MBTI人格評量
                </a>
            </th>
            <th>邁爾斯-布里格斯類型指標（英語：Myers-Briggs Type Indicator，简称MBTI，或譯麥布二氏心理類型量表）是人格類型學中一種內省的自我報告問卷，它表明人們天生在感知和決策的方式上存在不同心理偏好。</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.yory.school/holland/quiz" target="_blank">
                   YORI的何綸碼測驗
                </a>
            </th>
            <th>Holland 興趣測驗將人與環境分成六大類型：R-實作型、I-研究型、A-藝術型、S-社會型、E-企業型及C-事務型。你可以輸入興趣何倫碼前兩碼，來查詢適合你的職涯發展領域與相關職務。</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: '/career/education.png',
        description: `人生設計心理諮商專業團隊成立於2010年，總部亞洲職業生涯發展中心位於香港，於北京、上海與成都設有分中心，由海內外一流心理、教育與商業諮詢碩博士組成。
結合臨床實務經驗與數據分析技術, 提供中英文專業心理諮商、情感與伴侶諮詢、職業生涯諮詢、企業內部訓練、線上/線下課程、學校生涯輔導、專業人員訓練…等服務，為來談者找理想的人生方向。`,
        name: '人生設計心理諮商所',
        url: 'https://www.accupass.com/organizer/detail/2003200357258690657700',
    },
]

const bookItems = [
    {
        id: '11100874320',
        name: '黑馬思維：哈佛最推崇的人生計畫，教你成就更好的自己',
        desc: `<p>一個從小罹患過動症，高中中輟，
不到二十歲就結婚生子，曾靠修籬笆維生的人，
後來成了哈佛博士與暢銷書作家。
一個從四所大學五度休學，忍受不了朝九晚五生活，
開車賣二手書度日的人，
後來成為知名的神經科學家。
他們是怎麼辦到的？
成為出人意料的黑馬之後，他們最想做的是什麼事？</p>
`,
    },
    {
        id: '11100918401',
        name: 'MBTI，你的職業性格是什麼？：發現自己的優勢，規劃最適生涯',
        desc: `<p>解讀自己，接受自己，
找到最適合自己的生涯路！</p>

<p>全球500強HR都在用的MBTI分析系統，
是一種沒有任何偏見的工具，
能指引你妥善利用自己的性格優勢，
在職涯中找到最準確的角色，
真正享受每個階段的工作與人生。</p>
`,
    },
     {
        id: '11101023916',
        name: '【牛津通識課16】智力：測量人類思維及能力的有效方式',
        desc: `<p>為什麼有的人就是比較聰明？
邏輯好的人語言能力也會比較好嗎？
可以用智力測驗預判一個人的工作能力嗎？
智力跟健康及長壽也有關聯嗎？</p>

<p>打開牛津大學出版社最受歡迎通識讀本，
用最簡明的方式認識難解的人類智力謎團。</p>
`,
    },
]

const hollandItems = [
    {
        text: '市場研究數據分析師',
        value: 'ICE',
    },
    {
        text: '資訊/網路工程師',
        value: 'IRC',
    },
    {
        text: '測試/系統工程師',
        value: 'CIR',
    },
    {
        text: '會計師',
        value: 'CIE',
    },
    {
        text: '金融交易員/分析師',
        value: 'CES',
    },
    {
        text: '商業諮詢/企業管理顧問',
        value: 'ECI',
    },
    {
        text: '創業家/企業家/商人',
        value: 'EIS',
    },
    {
        text: '建築師/設計師/美術動畫',
        value: 'ARE',
    },
    {
        text: '家教/學校老師/補教老師',
        value: 'SIE',
    },
    {
        text: '講師/企業培訓師',
        value: 'SIE',
    },
]
</script>
