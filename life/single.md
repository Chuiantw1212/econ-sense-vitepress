---
outline: deep
---

# 單生狗生存手冊

開發中

## 投影片

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTvhDGQjUl2d1PQ4SHR1PHZv3AsWxtqMwAjLfqHceVXpYQWo0QUFr6k4j38gbxlzo3PgwueSzaAFoXI/embed?start=false&loop=false&delayms=3000" frameborder="0" width="100%" height="420" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## 講座評價

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
                <a href="https://map.dosw.gov.taipei/taipeiwelfare_map/all_new/elder_map.aspx" target="_blank">台北市銀髮族學習及活動地圖</a>
            </th>
            <th>台北市政府社會局所建置</th>
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
        image: '/life/carer.png',
        description: `隨著年齡增長，老化不只生理上的變化而已，而是各種問題的開始，這堂課讓你聰明的應對老化問題，學會維護身體的機能，使自己保持最佳狀態，應對各種生活和工作的挑戰，正常扮演社會與家庭的角色。`,
        name: '老化全方位應對手冊 | 機能維持 X 聰明就醫 X 照護策略 X 風險規劃',
        url: 'https://hiskio.com/courses/2133/about',
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
]
</script>