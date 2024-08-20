---
outline: deep
description: 概念取自《金錢性格》，根據DiSC理論調整。DiSC類型均等價，了解他人類型幫助理解優先性及差異。
---

# 金錢性格測驗

概念取自金錢性格一書，並根據DISC理論以及本人理解進行調整。

1. DiSC所有類型和優先性都具有同等價值，每個人都是所有四種類型的混合體。
2. 瞭解他人的DiSC類型可以幫助你了解他們的優先性以及他們與你有哪些不同。

## 測驗題組

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

## D掌控型

### 金錢類型

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
                遇到壓力時
            </td>
            <td>
                可能會縮限視野，忽視追逐財富所要付出的代價，一直工作到倒下為止
            </td>
        </tr>
        <tr>
            <td>
                代表動物
            </td>
            <td>
                老虎
            </td>
        </tr>
    </tbody>
</table>

### 財務習慣建議

<el-card>
    <h4>1. 九宮格法</h4>
    <p>用九宮格法拓展視野，在行動之前評估平衡的代價。</p>
    <table class="table table--center">
        <tbody>
            <tr>
                <td>
                    學習
                </td>
                <td>
                    心靈
                </td>
                <td>
                    社交
                </td>
            </tr>
            <tr>
                <td>
                    事業
                </td>
                <td>
                    家庭
                </td>
                <td>
                    休閒
                </td>
            </tr>
            <tr>
                <td>
                    理財
                </td>
                <td>
                    健康
                </td>
                <td>
                    公益
                </td>
            </tr>
        </tbody>
    </table>
    <h4>2. 主動休息</h4>
    <p>把"不事生產"強制休息，當成任務執行。</p>
    <h4>3. 財務自動化</h4>
    <p>擺脫繁瑣細節，讓自己更能無後顧之憂地賺錢。</p>
</el-card>

## I影響型

### 金錢類型

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
                遇到壓力時
            </td>
            <td>
                可能會超支，在沒有深思的情況下衝動做出決定，並循環原有的行為模式
            </td>
        </tr>
        <tr>
            <td>
                代表動物
            </td>
            <td>
                孔雀
            </td>
        </tr>
    </tbody>
</table>

### 財務習慣建議

<el-card>
    <h4>1. 投資房地產當包租公/婆</h4>
    <p>每個房客不只是房客，也是個獨一無二的故事。如果故事不動聽，就該漲房租了。</p>
    <h4>2. 找專家配合</h4>
    <p>或是任何一個能幫你算錢、做長期計畫、知道你哪些錢千萬不能花的人。動腦這麼麻煩的事情，交給別人就好。</p>
    <h4>3. 待辦與獎勵清單</h4>
    <p>建立待辦清單，時刻提醒自己永遠做最重要的事，並在達成之後，給自己滿足的獎勵。</p>
</el-card>

## S沈穩型

### 金錢類型

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
                遇到壓力時
            </td>
            <td>
                可能會低估通膨的風險，放棄或逃避所有財務決策責任，並依賴錯誤的人
            </td>
        </tr>
        <tr>
            <td>
                代表動物
            </td>
            <td>
                無尾熊
            </td>
        </tr>
    </tbody>
</table>

### 財務習慣建議

<el-card>
    <h4>1. 提撥勞動退休金</h4>
    <p>強迫儲蓄，幫自己準備好退休金，老了無後顧之憂，而且報酬率比定存跟儲蓄險高。</p>
    <h4>2. 專款專用</h4>
    <p>設定月收入10%為上限的專用金，用來公益、買禮物等等。照顧自己的同時，實踐價值觀。</p>
    <h4>3. 慎選人脈</h4>
    <p>把自己放在對的社交圈。好的社交圈是開放的、平等互助的、是輕鬆無壓力的。</p>
</el-card>

## C嚴謹型

### 金錢類型

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
                遇到壓力時
            </td>
            <td>
                可能會分析癱瘓，著迷於財務相關的完美公式，忽視了現實的千變萬化
            </td>
        </tr>
        <tr>
            <td>
                代表動物
            </td>
            <td>
                貓頭鷹
            </td>
        </tr>
    </tbody>
</table>

### 財務習慣建議

<el-card>
    <h4>1. 量力而為，適可而止</h4>
    <p>主動投資打贏市場的機率只有17%。完美是理想，而不是目標。時間、精力也是很重要的成本，請把投資ETF納入考量。</p>
    <h4>2. 接納事物的變化</h4>
    <p>執著於一成不變的計畫、過度計畫，與完全不計畫是同等有害的。</p>
    <h4>3. 在財務上幫助他人</h4>
    <p>智者的終極挑戰，是用他人能接受的方式，去給予對方所需要的幫助。</p>
</el-card>

## 意見回饋

<iframe src="https://docs.google.com/forms/d/e/1FAIpQLScBbn71sbRWIZSzsP8EXYBlqy7XxDcziy44daup4wiJVN3LoQ/viewform?embedded=true" width="100%" height="500" marginheight="0" marginwidth="0">Loading…</iframe>

## 延伸閱讀

<Books :modelValue="bookItems"></Books>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import econSelect from '../components/econSelect.vue'
import Books from '../components/books.vue'

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
    const total = questionGroups.value.length + 4
    const d = answers.value.filter(value => value==='d').length + 1
    const i = answers.value.filter(value => value==='i').length + 1
    const s = answers.value.filter(value => value==='s').length + 1
    const c = answers.value.filter(value => value==='c').length + 1
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

.table--center {
    * {
        text-align: center;
    }
}
</style>
