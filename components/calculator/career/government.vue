<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="薪俸點" required>
                        <econSelect v-model="career.monthlyBasicSalary" :options="payOptions">
                        </econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="薪俸額">
                        <el-text>{{ Number(career.monthlyBasicSalary).toLocaleString() }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
                        <li>
                            資料更新日期113(2024)年
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive } from 'vue'
import { pointOfPayOptions, payOptions } from './config.js'
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
    profile: {
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