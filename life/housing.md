---
outline: deep
---

# 極簡全齡宅

## 銀髮宅改造全指南

<a href="https://www.crew.com.tw/" target="_blank">「老伴兒」</a>由擅長內容行銷的數位行銷團隊知行者創藝術行銷創建 (EN註：已歇業)，目的在為全球超高齡化趨勢下產生的社會現象動態提前做出準備，幫助更多台灣民眾認識當人年老時會遇見的情況藉以提醒銀髮族生活需要我們盡早行動。

<iframe src="https://storage.googleapis.com/public.econ-sense.com/%E9%8A%80%E9%AB%AE%E5%AE%85%E6%94%B9%E9%80%A0%E5%85%A8%E6%8C%87%E5%8D%97.pdf" width="100%" height="420"></iframe>

## 居家安全環境檢核表

來自<a href="https://www.hpa.gov.tw/Pages/TopicList.aspx?idx=0&nodeid=876" target="_blank">衛生福利部國民健康署</a>。

<iframe src="https://storage.googleapis.com/public.econ-sense.com/%E5%B1%85%E5%AE%B6%E5%AE%89%E5%85%A8%E7%92%B0%E5%A2%83%E6%AA%A2%E6%A0%B8%E8%A1%A8%EF%BC%88105%E5%B9%B4%E4%BD%BF%E7%94%A8%EF%BC%89.pdf" width="100%" height="420"></iframe>

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
                <a href="https://www.taaze.tw/index.html" target="_blank">
                   讀冊生活
                </a>
            </th>
            <th>賣二手書首選</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>

import Books from '../components/books.vue'
const bookItems = [
    {
        id: '11100859478',
        name: '後半輩子最想住的家：先做先贏！40歲開始規畫、50歲開心打造，好房子讓你笑著住到老',
        desc: `<p>│好房子，讓你笑著住到老│
40歲開始規畫、50歲開心打造！

</p>

<p>越住越年輕
給自己一個安心減齡的家
讓父母好用、自己未來也享受，別等「老了再說」！</p>`,
    },
]
</script>
