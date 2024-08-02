---
outline: deep
---


# 金錢類型測驗

## 題組
<el-card>
    <el-form>
        <el-row v-for="(questionGroup,index) in questionGroups">
            <el-col>
               {{index+1}}. {{questionGroup.title}}:
            </el-col>
            <el-col>
                <el-select v-model="answers[index]" placeholder="請選擇">
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
                <el-button type="primary" @click="onSubmit">送出</el-button>
            </div>
        </el-form-item>
    </el-form>
</el-card>

<h2 id="_工作者" tabindex="-1">工作者<a class="header-anchor" href="#工作者"
                aria-label="Permalink to &quot;工作者&quot;">&ZeroWidthSpace;</a></h2>
<el-card>
    <table class="table">
        <tbody>
            <tr>
                <td>
                    財務態度
                </td>
                 <td>
                    能夠賺到錢、就去做
                </td>
            </tr>
            <tr>
            </tr>
        </tbody>
    </table>
</el-card>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import econSelect from './components/econSelect.vue'
const questionGroups = ref([])
const answers = ref([])
interface IQuestionGroup {
    title: string,
    options: any[]
}
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
 //
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