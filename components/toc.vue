<template>
    <table>
        <thead>
        <tr>
            <th colspan="2">
                <a style="white-space: nowrap;" href="./framework">
                理財框架</a>
            </th>
        </tr>
        <tr>
            <th>大綱</th>
            <th>誰適合參與</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>
                開源、節流<br>投資、風險控制
            </th>
            <th>
               <ul>
                    <li>剛出社會的新鮮人</li>
                    <li>想掌握理財觀念全貌的人</li>
                    <li>總覺得理財很難的人</li>
                </ul>
            </th>
        </tr>
        </tbody>
    </table>
</template>
<script setup>
// https://schema.org/Course
const props = defineProps({
    modelValue:{
        type: Array,
        required: true,
        default: ()=> [
            {
                url: '',
                name: '課程名稱',
                // hasPart
                // keywords
                // 

            }
        ]
    }
})
</script>