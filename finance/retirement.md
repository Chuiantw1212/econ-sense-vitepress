---
outline: deep
---

# 勞工退休規劃
探索跨領域的勞工退休規劃，涵蓋金融、醫療和法律等多元內容。從勞保、勞退、老後變現、老前整理到移轉節稅，這個分享將帶您深入了解全面的退休規劃內容。無論您關心財務安全、尋求全面的退休計劃，或是想了解退休前後跨領域規劃的重要性，這份懶人包式的分享將為您提供核心知識，讓您在退休規劃上更有把握。讓我們一同打造貼心且全面的退休規劃。

## 投影片

<iframe
src="https://docs.google.com/presentation/d/e/2PACX-1vR3dFAEAcS7-utuE-RIRKm-nz5kUWdM4VJc2njEos01vLX4kqCXrXWMqoLTaBfzqXLoUG3ov5cfdrcA/embed?start=false&loop=false&delayms=3000"
width="100%" height="569" allowfullscreen="true" mozallowfullscreen="true"
webkitallowfullscreen="true"></iframe>

## 安心手冊範例

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQQMDRSSS7lVSRJyYtL2yWM8V4i2Z9OSyz4QIaMFvOO0K-Rb-gyDLJG5dygSMrg5vTpAnshIYl49gpA/pubhtml?widget=true&amp;headers=false" width="100%" height="569" allowfullscreen="true" mozallowfullscreen="true"
webkitallowfullscreen="true"></iframe>

## 外部資源
### 退休金與財產清冊
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
                <a href="https://edesk.bli.gov.tw/me/#/na/login" target="_blank">
                   勞保局E化服務系統
                </a>
            </th>
            <th>查看個人勞保、勞退資料</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.bli.gov.tw/0000002.html" target="_blank">
                   勞保局勞保業務專區
                </a>
            </th>
            <th>查詢詳細的勞保法規、條款項目、QA</th>
        </tr>
        <tr>
            <th>
                <a href="https://rfa.pension.org.tw/RetireComputer-Person" target="_blank">
                   FUN心退
                </a>
            </th>
            <th>中華民國退休金協會的退休金計算機</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.etax.nat.gov.tw/etwmain/etw108w" target="_blank">
                   財政部電子稅務文件
                </a>
            </th>
            <th>查詢財產資料</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.ba.org.tw/PublicInformation/BusinessDetail/31?AspxAutoDetectCookieSupport=1" target="_blank">
                   銀行商業同業公會
                </a>
            </th>
            <th>查詢遺忘的銀行帳號資料</th>
        </tr>
        <tr>
            <th>
                <a href="https://investor.twse.com.tw" target="_blank">
                   投資人個人資料查詢系統
                </a>
            </th>
            <th>查詢遺忘的證券帳號資料</th>
        </tr>
        <tr>
            <th>
                <a href="https://tax.nat.gov.tw/alltax-declare.html?id=31" target="_blank">
                   財政部金融遺產
                </a>
            </th>
            <th>一站查詢金融遺產</th>
        </tr>
    </tbody>
</table>

### 數位資產、保險、醫療、法務
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
                <a href="https://support.google.com/accounts/answer/3036546?sjid=9983159482626828160-AP" target="_blank">
                   Google閒置帳號管理員
                </a>
            </th>
            <th>一定月數以後，讓親屬取得帳號權限</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.facebook.com/help/99133559431313?helpref=hc_fnav" target="_blank">
                   Facebook紀念帳號設定
                </a>
            </th>
            <th>讓指定親屬可以申請取得紀念帳號</th>
        </tr>
        <tr>
            <th>
                <a href="https://www.moj.gov.tw/2204/2528/2529/2530/2533/12401/" target="_blank">
                   法務部
                </a>
            </th>
            <th>意定監護契約範本</th>
        </tr>
        <tr>
            <th>
                <a href="https://hpcod.mohw.gov.tw/HospWeb/RWD/PageType/acp/introduction.aspx" target="_blank">
                   衛生福利部
                </a>
            </th>
            <th>預定醫療決定推廣頁面</th>
        </tr>
    </tbody>
</table>

## 延伸閱讀

<Books :modelValue="bookGroup"></Books>

<script setup>

import Books from '../components/books.vue'
const bookGroup = [
    {
        id: '11100764608',
        name: '當爸媽過了65歲：你一定要知道的醫療、長照、財務、法律知識',
        desc: `<p>一本寫給上班族的知老實用手冊</p>
<p>照顧父母，也為未來的自己做準備</p>
<p>關於「老」，我們知道的太少，準備的也太少。</p>
<p>不管是父母的，或是你自己的。</p>
<p>面對「老之將至」，你要倉皇的摸索，還是優雅的預習？</p>
`,
    },
]
</script>