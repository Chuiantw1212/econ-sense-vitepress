<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
                        <li>長照費用統計：<a href="https://dep.mohw.gov.tw/DOS/lp-5095-113-xCat-y111.html" target="_blank">老人狀況調查</a></li>
                    </ul>
                    <table class="table">
                        <tr>
                            <th>參考標的</th>
                            <th>資產配置</th>
                            <th>來源網址</th>
                        </tr>
                        <tr>
                            <td>AOA</td>
                            <td>股8債2</td>
                        </tr>
                    </table>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive } from 'vue'
import Chart from 'chart.js/auto';
import econSelect from '../../econSelect.vue'
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    config: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
})

const career = computed(() => {
    return props.modelValue
})


</script>