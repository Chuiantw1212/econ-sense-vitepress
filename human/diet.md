---
title: 人類學飲食: 從採獵採集到現代營養
description: 探索人類學飲食的演變，從遠古的狩獵採集生活方式到現代營養學的觀點。本文深入分析人類飲食習慣的歷史變遷及其對健康的影響。
---
# 人類學飲食: 從採獵採集到現代營養

## 線上/實體講座

### 簡報

<LazySlide shareLink="https://docs.google.com/presentation/d/1RJcxuoOUHHpseZQbcX-F2rleAvk42X8mPLcElW48StI/edit?usp=sharing">
    <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQI1ncyYWnKYvoM1kbgQCbswUZXI7VGmJHQRen1r3cQ2yESPA2hg8UypleCr6gJM1iMOeF4uX5DxuYW/pubembed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</LazySlide>

### 評價

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT-xkijLzAc5g9TGU3CW2A8aJynY_6-ffssLKbOcEr8f279lmwjMJ0UTxEdpligeUTUTdU0eCSB6BBh/pubhtml?widget=true&amp;headers=false" width="100%" height="420" ></iframe>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import LazySlide from '../components/lazySlide.vue'
import Books from '../components/books.vue'

const bookItems = [
    {
        id: '11100987995',
        name: '從叢林到文明，人類身體的演化和疾病的產生',
        desc: `<p>痠、痛、胖、病，都是演化惹的禍
文明帶來長壽，代價卻是大病小病纏身
哈佛明星級教授，顛覆我們對健康的認識</p>

<p>沒有人比李伯曼更瞭解人類的身體。
——《天生就會跑》作者麥杜格（ Christopher McDougall）</p>`
    },
]

</script>
