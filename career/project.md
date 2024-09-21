---
description: 深入探索軟體專案實務，從PMP到敏捷，解析角色盲點。適合職場新手、專案管理者和PMI持證人士。了解專案管理實務，探索角色挑戰，全面理解軟體專案運作。
outline: deep
---

# 軟體專案實務

探索「軟體專案實務」，深入從PMP到敏捷、理想敏捷、實務敏捷，以及專案中可能存在的角色盲點。這門課程特別適合三類受眾：首先，對軟體開發實務感到好奇的職場小白或轉職者；其次，希望理解專案中角色個別困境的人；最後，對專案管理有興趣並擁有PMI相關持證的人。透過這裡的分享，我們將一同深入專案管理實務，探索各種角色的挑戰，讓您更全面地理解軟體專案的運作。

## 簡報

<iframe
 src="https://docs.google.com/presentation/d/e/2PACX-1vSqT9z3iCbJo3qiO4UcEnwaLhrTXh49Ea4odLtx9hqwK_upOO3kvFvwM0_l6nLf-2pKFqkXMpFxcM9y/embed?start=false&loop=false&delayms=3000"
width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true"
webkitallowfullscreen="true"></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxLBco_B9XCPn9zKnGb9aoOSYP8IRkyqoU2lJhpJdRAAR0WLPs6nEtq0igY65NzlvqcRIMqaegIcPG/pubhtml?widget=true&amp;headers=false" width="100%" height="420" ></iframe>

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
            <td>
                <a href="https://www.facebook.com/itdogcom" target="_blank">
                   Dog Com
                </a>
            </td>
            <td>IT狗優質粉專</td>
        </tr>
        <tr>
            <td>
                <a href="https://www.pmi.org.tw/?post_type=tribe_events" target="_blank">
                   PMI Taiwan
                </a>
            </td>
            <td>學習專案管理的好地方</td>
        </tr>
    </tbody>
</table>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Books from '../components/books.vue'
import Courses from '../components/courses.vue'

const bookItems = [
    {
        id: '11100157020',
        name: '人月神話：軟體專案管理之道',
        desc: `<p>有些書，對於讀者和作者就像是年金一樣，可以年年分紅。《人月神話》就是這樣一本書……年輕的軟體工程師、缺錢的研究生、懶惰的程式設計老手，常問我哪一本電腦書最好：「如果我被困在荒島上，只能帶一本電腦書，應該選哪一本？」這問題很荒謬，但他們堅持要答案。假如你真的被放逐到這樣的小島上，應該陪伴你的是《人月神話》。</p>
`,
    },
    {
        id: '11100829103',
        name: '精實創業：用小實驗玩出大事業（2017書衣新版）',
        desc: `<p>★「精實創業」的關鍵概念？</p>
<p>最小可行產品（MVP）：產品或服務不要等到「完美」才推出，只要服務堪用就應該讓消費者使用。當初dropbox的第一版產品只不過是一段影片說明，就可以聽到眾多使用者的迴響。當初google只能搜尋專業技術網站，但使用者都已經知道她的優點。</p>
<p>軸轉（Pivot）：快速推出產品、快速更新，可以讓我們真的知道產品是否讓大家滿意，一旦確認做出來的東西不是大家所需要的，就應該立刻修改方向，這就是軸轉。當初flickr是一個線上遊戲網站，經過「軸轉」，將子計畫改成主計畫，就成為全世界最知名的照片分享服務。Twitter原本是線上廣播，也是經過「軸轉」，成為改變世界的新服務。</p>
`,
    },
]


const courseItems = [
    {
        image: '/career/daren.png',
        description: `「這裡是《大人學》課程報名網站。您可以在這裡參與我們優質的實體與線上課程，註冊學員也能下載豐富的學習資源。讓我們一同往成熟大人之路邁進！」`,
        name: '大人學',
        url: 'https://shop.darencademy.com/index/search/tag/PDU',
    },
]
</script>
