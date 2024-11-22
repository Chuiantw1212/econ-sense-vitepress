---
description: 深入探索軟體專案實務，從PMP到敏捷，解析角色盲點。適合職場新手、專案管理者和PMI持證人士。了解專案管理實務，探索角色挑戰，全面理解軟體專案運作。
outline: deep
---

# 軟體專案實務：從PMP到敏捷的深入解析與實踐

「軟體專案實務」適合職場小白、轉職者及PMI持證者，課程涵蓋從PMP到敏捷的完整架構，並深入探討理想與實務敏捷的差異。課程還分析專案中角色盲點，幫助您全面理解軟體專案運作及各角色的挑戰，提升專案管理技能。

## 從PMP到敏捷

### PMP金三角的核心概念

PMP金三角是傳統專案管理的核心框架，由**範疇（Scope）**、**時間（Time）** 和 **成本（Cost）** 三大要素構成，三者互相影響，形成穩定的平衡關係，同時影響到**品質（Quality）**，因品質是這三個要素平衡的結果。

1. **範疇（Scope）**  
   定義專案的工作內容和交付成果，通常包含詳細的需求規範與範疇說明。

2. **時間（Time）**  
   包括專案的計劃排程、里程碑和關鍵路徑。透過時間管理確保專案能按時完成。

3. **成本（Cost）**  
   涵蓋專案的資金預算與資源配置，目標是在可控範圍內實現最優結果。

4. **品質（Quality）**  
   表示交付成果是否滿足需求與期望，會受到範疇、時間和成本的限制。例如，若為了縮短工期或降低預算而擴大範疇，可能會導致品質的妥協。

金三角的核心在於，當一個要素改變（如範疇擴大），其他要素（如時間或成本）必然受到影響，甚至影響品質。例如，一位油漆工刷一間房子需三天，若要在1.5天內完成，需增加人力至兩人，這是典型的時間與成本轉換：縮短工期增加了成本。反之，若減少人力以節省成本，卻要求快速完成，可能導致塗層不均等品質問題。因此，專案經理需在時間、成本與品質間權衡，達成目標並維持合理品質。

## 簡報

<LazySlide shareLink="https://docs.google.com/presentation/d/1NuG7ObTRMwNXZs76CeU0B73nYg-tbGtFH2mXtkAoLx0/edit?usp=drive_link">
    <iframe
    src="https://docs.google.com/presentation/d/e/2PACX-1vSqT9z3iCbJo3qiO4UcEnwaLhrTXh49Ea4odLtx9hqwK_upOO3kvFvwM0_l6nLf-2pKFqkXMpFxcM9y/embed?start=false&loop=false&delayms=3000"
    width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true"
    webkitallowfullscreen="true"></iframe>
</LazySlide>

## 講座評價

<iframe title="Google Sheets" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxLBco_B9XCPn9zKnGb9aoOSYP8IRkyqoU2lJhpJdRAAR0WLPs6nEtq0igY65NzlvqcRIMqaegIcPG/pubhtml?widget=true&amp;headers=false" width="100%" height="420" ></iframe>

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
import LazySlide from '../components/lazySlide.vue'
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
