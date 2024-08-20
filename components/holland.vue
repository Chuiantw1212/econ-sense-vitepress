<template>
    <el-card>
        <el-checkbox-group v-model="selectedValues">
            <el-checkbox v-for="(item, index) in datasets" :key="index" :label="item.label" :value="item.value" />
        </el-checkbox-group>
    </el-card>
</template>
<script setup lang="ts">
import { ref, } from 'vue'
const selectedValues = ref([])
const datasets = [
    {
        label: '機械/電子',
        value: ['R']
    },
    {
        label: '建築/木工',
        value: ['R']
    },
    {
        label: '交通/機械操作',
        value: ['R']
    },
    {
        label: '體力/手工勞動',
        value: ['R']
    },
    {
        label: '軍警消防',
        value: ['R']
    },
    {
        label: '農業',
        value: ['R']
    },
    {
        label: '自然/戶外',
        value: ['R']
    },
    {
        label: '動物照顧',
        value: ['R', 'S']
    },
    {
        label: '競技',
        value: ['R', 'E']
    },
    {
        label: '工程',
        value: ['R',]
    },
    {
        label: '物理科學',
        value: ['I',]
    },
    {
        label: '生命科學',
        value: ['I',]
    },
    {
        label: '醫學',
        value: ['I',]
    },
    {
        label: '社會科學',
        value: ['I', 'S']
    },
    {
        label: '人文科學',
        value: ['I', 'A']
    },
    {
        label: '數學/統計',
        value: ['I', 'C']
    },
    {
        label: '資訊科技',
        value: ['C']
    },
    {
        label: '視覺藝術',
        value: ['A']
    },
    {
        label: '應用藝術與設計',
        value: ['A']
    },
    {
        label: '表演藝術',
        value: ['A']
    },
    {
        label: '音樂',
        value: ['A']
    },
    {
        label: '自由書寫',
        value: ['A']
    },
    {
        label: '媒體',
        value: ['A']
    },
    {
        label: '烹飪',
        value: ['A', 'S']
    },
    {
        label: '教學/教育',
        value: ['S']
    },
    {
        label: '社會服務',
        value: ['S']
    },
    {
        label: '醫療服務',
        value: ['I', 'S']
    },
    {
        label: '宗教活動',
        value: ['S', 'E']
    },
    {
        label: '對人服務',
        value: ['S',]
    },
    {
        label: '專業諮詢',
        value: ['S', 'E']
    },
    {
        label: '商業發起',
        value: ['E']
    },
    {
        label: '銷售',
        value: ['E']
    },
    {
        label: '行銷/廣告',
        value: ['A', 'E']
    },
    {
        label: '金融',
        value: ['E', 'C']
    },
    {
        label: '會計',
        value: ['C']
    },
    {
        label: '人力資源',
        value: ['S', 'C']
    },
    {
        label: '辦公室工作',
        value: ['C']
    },
    {
        label: '管理/行政',
        value: ['E']
    },
    {
        label: '公開演講',
        value: ['E']
    },
    {
        label: '政治',
        value: ['E']
    },
    {
        label: '法律',
        value: ['E']
    },
]
</script>