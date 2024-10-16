---
description: 《合理的理想職涯》協助新鮮人和轉職者選擇關鍵字、尋找合適職務，量化現有與未來職務的適性差異。
outline: deep
head:
  - - meta
    - name: og:image
      property: og:image
      content: /career/holland.webp
  - - meta
    - name: og:url
      property: og:url
      content: /career/holland.html
---

# NLP的理想職涯

1. 選擇適合自己的關鍵字
2. 尋找合適職務
   * 新鮮人：找出自己適合的大方向去探索
   * 轉職者：量化比對自己現在與將來職務適性的差異

<Holland></Holland>

## 簡報

<LazySlide shareLink="https://docs.google.com/presentation/d/1TBWOkeOPewxkEKfwwb85ocU4xS6rQ0NcYQrKB7YSpUU/edit?usp=sharing">
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRIsOs04yETGtGkNzM0FLHc4-Z0lbELBJnfE7YQiNC8VyxSCfu52p6hkoCOpcKphqgD-ip-MIVAhcFx/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

<!-- <iframe title="presentation" src="https://docs.google.com/presentation/d/1LXJlqRZL6ICsTg8QUVA0pDMY9eH7gSUA4MLqgoScAHw/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe> -->

## 講座評價

<iframe src="https://docs.google.com/spreadsheets/d/1K083vkWl1wKAKkLOga1G0Qvazeyu7KM_VxbhdypPsEU/pubhtml?widget=true&amp;headers=false" width="100%" height="420"></iframe>

## 外部優質課程

<Courses :modelValue="courseItems"></Courses>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup lang="ts">
import LazySlide from '../components/lazySlide.vue'
import Holland from '../components/riasec.vue'
import Courses from '../components/courses.vue'
import Books from '../components/books.vue'

const courseItems = [
    {
        image: '/career/springTime.png',
        description: `「探索潛意識，聆聽內心的回聲，擁抱真實，成為你心靈的騎象人。」
助人 NLP 國際認證課程・心理學專業培訓課程・沙龍活動體驗`,
        name: '韶光心理學苑',
        url: 'https://springtimenlp.com/',
    },
    {
        image: '/career/education.png',
        description: `人生設計心理諮商專業團隊成立於2010年，總部亞洲職業生涯發展中心位於香港，於北京、上海與成都設有分中心，由海內外一流心理、教育與商業諮詢碩博士組成。
結合臨床實務經驗與數據分析技術, 提供中英文專業心理諮商、情感與伴侶諮詢、職業生涯諮詢、企業內部訓練、線上/線下課程、學校生涯輔導、專業人員訓練…等服務，為來談者找理想的人生方向。`,
        name: '人生設計卡課程',
        url: 'https://www.accupass.com/organizer/detail/2003200357258690657700',
    },
]

const bookItems = [
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
]
</script>
