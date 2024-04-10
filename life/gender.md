---
outline: deep
---

# 直男的兩性研究

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSFhBZ8zuW6Mucd5Ay7dd-QVFsAqmwJd8PNSPgZsS8Z77DQw1CHKpcgaXJ1RJPBT7UDx7oYZcp68WOp/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

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
                <a href="https://shopee.tw/search?keyword=%E5%87%B1%E5%88%97%E7%8F%AD%E8%88%87%E5%A5%B3%E5%B7%AB%20%E5%A9%A6%E5%A5%B3%20%E8%BA%AB%E9%AB%94%E8%88%87%E5%8E%9F%E5%A7%8B%E7%A9%8D%E7%B4%AF" target="_blank">
                   凱列班與女巫：婦女、身體與原始積累
                </a>
            </th>
            <th>蝦皮商場，簡體中文書。</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup>
import Books from '../components/books.vue'

const bookItems = [
    {
        id: '11100918482',
        name: '新．斷捨離【10週年全新增訂版】：斷絕不需要的東西，捨棄多餘的廢物，脫離對物品的執著，改變650萬人的史上最強人生整理術再進化！',
        desc: `<p>扔掉一件無用之物，就多出一點空間。</p>
<p>扔掉一件多餘之物，就免去一樣負擔。</p>
<p>扔掉一件無益之物，就恢復一絲清爽。</p>
<p>然後，你的人生將煥然一新！</p>`,
    },
    {
        id: '11100892979',
        name: '零雜物裝修術',
        desc: `<p>徹底擊退！打造簡約舒適好宅的兩大敵人：預算少、雜物多。
輕鬆享受！少揹一些房貸、少花一些裝修費、少做一些惱人的家事，過更輕盈自在的生活。</p>

<p>想以真正省錢的方式打造好宅，不是在工法或材質上錙銖必較！
本書從源頭抓起，讓你節省購屋預算和裝修費用，
還告訴你如何使用房子才能久住不亂，否則花再多錢裝修都是枉然……</p>`,
    },
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