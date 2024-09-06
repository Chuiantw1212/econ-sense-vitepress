---
# description: 深入探索軟體專案實務，從PMP到敏捷，解析角色盲點。適合職場新手、專案管理者和PMI持證人士。了解專案管理實務，探索角色挑戰，全面理解軟體專案運作。
outline: deep
---

# 軟體職涯入門

## 投影片

<iframe src="https://docs.google.com/presentation/d/1E7SV-aL5n4jSFpAllj23Tt5TrRnYjtfhNQL-DR0D9fo/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%"  height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRC9l9PeG5_xm6STaHDLibjsTNwz8VuaomjRdeWL9wa_8dn4mEBLeAbE4YszFAVR36qo3gv2OfhR2Ix/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

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

<!-- <Courses :modelValue="courseItems"></Courses> -->

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Books from '../components/books.vue'
import Courses from '../components/courses.vue'

const bookItems = [
    {
        id: '11100912049',
        name: '軟體開發人員職涯發展成功手冊',
        desc: `<p>讓你快速上手新語言，掌握面試訣竅，一舉拿下夢想中的程式開發工作</p>
<ul>
    <li>應該學JavaScript、C#、Python還是C++？本書會教你如何決定最適合自己學習的程式語言，以及如何有效地掌握程式語言。</li>
    <li>取得電腦科學學位是否有其必要性，或者根本是浪費時間？本書會教你如何在背負最低學貸的情況下，拿到聲譽最高的大學學位。</li>
    <li>教你如何應付緊迫盯人的控制狂主管，以及如何輔佐主管達成他的目標，讓你成為團隊裡的MVP。</li>
    <li>雖然面試官告訴你，「在這裡工作，大家都穿得很休閒，尤其是開發團隊，他們都穿拖鞋上班。」所以，你該怎麼穿？本書會教你如何穿出個人的職場魅力。</li>
    <li>教你一位專業開發人員應該必備哪些技術能力。多數開發人員都缺少一些關鍵能力，為什麼大學沒教，因為他們預期你已經「知道」。</li>
</ul>`,
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
