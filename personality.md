---
outline: deep
---


# 金錢類型測驗

主要內容取自金錢性格一書，並根據DISC理論以及本人主觀解釋進行調整。
1. DiSC所有類型和優先性都具有同等價值，每個人都是所有四種類型的混合體。
2. 瞭解他人的DiSC類型可以幫助你了解他們的優先性以及他們與你有哪些不同。

## 題組
<el-card>
    <el-form>
        <el-row v-for="(questionGroup,index) in questionGroups">
            <el-col>
               {{index+1}}. {{questionGroup.title}}:
            </el-col>
            <el-col>
                <el-select v-model="answers[index]" placeholder="請選擇" :disabled="result.length">
                    <el-option
                        v-for="item in questionGroup.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-col>
            <el-col>
                <br>
            </el-col>
        </el-row>
        <el-form-item>
            <div>
                <el-button type="primary" @click="onSubmit()" :disabled="result.length">送出</el-button>
            </div>
        </el-form-item>
    </el-form>
     <table v-if="result.length" class="table">
        <tbody>
            <tr>
                <td>
                    D掌控型
                </td>
                <td>
                    I影響型
                </td>
                <td>
                    S沈穩型
                </td>
                <td>
                    C嚴謹型
                </td>
            </tr>
            <tr>
                <td v-for="(precentage) in result">
                    {{precentage}}%
                </td>
            </tr>
        </tbody>
    </table>
</el-card>

<h2 id="_D掌控型" tabindex="-1">D掌控型<a class="header-anchor" href="#D掌控型"
                aria-label="Permalink to &quot;D掌控型&quot;">&ZeroWidthSpace;</a></h2>
<el-card>
    <template #header>
        <div class="card-header">
            金錢類型
        </div>
    </template>
    <table class="table">
        <tbody>
            <tr>
                <td>
                    財務態度
                </td>
                 <td>
                    能夠賺到錢，就去做
                </td>
            </tr>
            <tr>
                <td>
                    金錢特質
                </td>
                <td>
                    務實
                </td>
            </tr>
            <tr>
                <td>
                    金錢口號
                </td>
                <td>
                    努力工作讓你無往不利。緩慢且穩定的進行能讓你贏得最終的勝利
                </td>
            </tr>
            <tr>
                <td>
                    信念體系
                </td>
                <td>
                    我有價值，因為我付出了很多努力
                </td>
            </tr>
            <tr>
                <td>
                    優點
                </td>
                <td>
                    勤奮、一貫、忠誠、以事實為導向、以舒緩的腳步長期深耕、以及遵守規則
                </td>
            </tr>
            <tr>
                <td>
                    缺點
                </td>
                <td>
                    死板、過於謹慎，因為因長時間工作或過度工作而疲憊不堪，可能會為了完成工作而忽略自己的理想
                </td>
            </tr>
            <tr>
                <td>
                    你如何賺錢
                </td>
                <td>
                    個人努力、積蓄、房地產
                </td>
            </tr>
            <tr>
                <td>
                    遇到壓力時
                </td>
                <td>
                    可能會縮限視野，忽視追逐財富所要付出的代價，一直工作到倒下為止
                </td>
            </tr>
            <tr>
                <td>
                    代表性精神動物
                </td>
                <td>
                    老虎
                </td>
            </tr>
        </tbody>
    </table>
</el-card>

<h2 id="_I影響型" tabindex="-1">I影響型<a class="header-anchor" href="#I影響型"
                aria-label="Permalink to &quot;I影響型&quot;">&ZeroWidthSpace;</a></h2>
<el-card>
    <template #header>
        <div class="card-header">
            金錢類型
        </div>
    </template>
    <table class="table">
        <tbody>
            <tr>
                <td>
                    財務態度
                </td>
                 <td>
                    創造它，並加以體現
                </td>
            </tr>
            <tr>
                <td>
                    金錢特質
                </td>
                <td>
                    理想主義
                </td>
            </tr>
            <tr>
                <td>
                    金錢口號
                </td>
                <td>
                    如果我能夠夢想，我就能做到。我能展現自己的成功
                </td>
            </tr>
            <tr>
                <td>
                    信念體系
                </td>
                <td>
                    我有能力創造我想要的
                </td>
            </tr>
            <tr>
                <td>
                    優點
                </td>
                <td>
                    思想開放、靈活、適應性強、果斷、樂觀、善於解決問題、敢冒險
                </td>
            </tr>
            <tr>
                <td>
                    缺點
                </td>
                <td>
                    持否認態度、匆忙做出決定、容易受到快速致富計畫的影響、可能不喜歡處理資料、可能純粹基於情緒做出決定
                </td>
            </tr>
            <tr>
                <td>
                    你如何賺錢
                </td>
                <td>
                    企業家精神、獨創性、身體力行、夢想生意和投資的新方法
                </td>
            </tr>
            <tr>
                <td>
                    遇到壓力時
                </td>
                <td>
                    可能會超支，在沒有深思的情況下衝動做出決定，並循環原有的行為模式
                </td>
            </tr>
            <tr>
                <td>
                    代表性精神動物
                </td>
                <td>
                    孔雀
                </td>
            </tr>
        </tbody>
    </table>
</el-card>

<h2 id="_S沈穩型" tabindex="-1">S沈穩型<a class="header-anchor" href="#S沈穩型"
                aria-label="Permalink to &quot;S沈穩型&quot;">&ZeroWidthSpace;</a></h2>
<el-card>
    <template #header>
        <div class="card-header">
            金錢類型
        </div>
    </template>
    <table class="table">
        <tbody>
            <tr>
                <td>
                    財務態度
                </td>
                 <td>
                    積累它、建立它、與人合作
                </td>
            </tr>
            <tr>
                <td>
                    金錢特質
                </td>
                <td>
                    合作
                </td>
            </tr>
            <tr>
                <td>
                    金錢口號
                </td>
                <td>
                    經由合作來獲得成功，照顧你所愛的人
                </td>
            </tr>
            <tr>
                <td>
                    信念體系
                </td>
                <td>
                    我有價值的原因是因為我對你的關心
                </td>
            </tr>
            <tr>
                <td>
                    優點
                </td>
                <td>
                    人際交往能力、與他人有聯繫、也是良好的聯繫者、團隊合作者、開發者、理解、同情心以及足智多媒
                </td>
            </tr>
            <tr>
                <td>
                    缺點
                </td>
                <td>
                    傾向把自己放在最後、可能容易受騙、可能成為拯教他們財富損失的角色、可能對投資反應情緒化、自己無法接受他人的幫助
                </td>
            </tr>
            <tr>
                <td>
                    你如何賺錢
                </td>
                <td>
                    透過他們的門路、經驗和關係，建立長期基礎的耐心；藉由穩定和安全的投資
                </td>
            </tr>
            <tr>
                <td>
                    遇到壓力時
                </td>
                <td>
                    可能會低估通膨的風險，放棄或逃避所有財務決策責任，並依賴錯誤的人
                </td>
            </tr>
            <tr>
                <td>
                    代表性精神動物
                </td>
                <td>
                    無尾熊
                </td>
            </tr>
        </tbody>
    </table>
</el-card>

<h2 id="_C嚴謹型" tabindex="-1">C嚴謹型<a class="header-anchor" href="#C嚴謹型"
                aria-label="Permalink to &quot;C嚴謹型&quot;">&ZeroWidthSpace;</a></h2>
<el-card>
    <template #header>
        <div class="card-header">
            金錢類型
        </div>
    </template>
    <table class="table">
        <tbody>
            <tr>
                <td>
                    財務態度
                </td>
                 <td>
                    勤思善學
                </td>
            </tr>
            <tr>
                <td>
                    金錢特質
                </td>
                <td>
                    有智慧的
                </td>
            </tr>
            <tr>
                <td>
                    金錢口號
                </td>
                <td>
                    我能想辦法成功；對於一些洞察者來說：教育是成功的關鍵
                </td>
            </tr>
            <tr>
                <td>
                    信念體系
                </td>
                <td>
                    我的聰明才智是成功的關鍵
                </td>
            </tr>
            <tr>
                <td>
                    優點
                </td>
                <td>
                    視野開活、有邏輯性、洞察力強、有智慧的、有鑒別力、能獲取和運用知識
                </td>
            </tr>
            <tr>
                <td>
                    缺點
                </td>
                <td>
                    評判性、可能過於依賴過去的結果、傾向於過度思考、可能會因為過於簡單或其他人都在做而放棄一個想法或投資某件事
                </td>
            </tr>
            <tr>
                <td>
                    你如何賺錢
                </td>
                <td>
                    思考領導、根據自己欣賞的專家意見進行投資、在競爭中智勝
                </td>
            </tr>
            <tr>
                <td>
                    遇到壓力時
                </td>
                <td>
                    可能會分析癱瘓，著迷於財務相關的完美公式，忽視了現實的千變萬化
                </td>
            </tr>
            <tr>
                <td>
                    代表性精神動物
                </td>
                <td>
                    貓頭鷹
                </td>
            </tr>
        </tbody>
    </table>


</el-card>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import econSelect from './components/econSelect.vue'
import Books from './components/books.vue'

const questionGroups = ref([])
const answers = ref([])
const result = ref([])
interface IQuestionGroup {
    title: string,
    options: any[]
}
const bookItems = [
    {
        id: '11100936637',
        name: '金錢性格：找出你的生財天賦',
        desc: `<p>試過各種投資理財法，仍然無法財務自由？
不是你沒財運，而是不夠了解自己的「生財天賦」，
其實，有些人適合存股，有些人卻適合創業，
找出你的「金錢性格」，就能順勢致富！</p>`,
    },
]
// hooks
onMounted(async () => {
    const response = await fetch("/personality.json");
    const jsonFile:IQuestionGroup[] = await response.json();
    jsonFile.forEach((questionGroup:IQuestionGroup) => {
        shuffle(questionGroup.options)
    })
    questionGroups.value = jsonFile
});
// methods
function onSubmit() {
    const total = questionGroups.value.length
    const d = answers.value.filter(value => value==='a').length
    const i = answers.value.filter(value => value==='b').length
    const s = answers.value.filter(value => value==='c').length
    const c = answers.value.filter(value => value==='d').length
    result.value = [d,i,s,c]
    result.value = result.value.map(value => {
        return Number(value / total * 100).toFixed(1)
    })
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
</script>
<style lang="scss" scoped>
.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular) !important;
        background: white !important;
    }
}
</style>