<template>
    <table v-for="(item, index) in props.items" :key="index">
        <thead>
            <tr>
                <th colspan="2" class="d-md-none">
                    <a :href="item.url">
                        {{ item.name }}</a>
                </th>
            </tr>
            <tr>
                <th class="d-none d-md-table-cell">名稱</th>
                <th>大綱</th>
                <th>誰適合參與</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th class="d-none d-md-table-cell">
                    <a style="white-space: nowrap;" href="./computer">
                        {{ item.name }}</a>
                </th>
                <th>
                    <ol>
                        <li v-for="(keyword, keywordIndex) in item.keywords" :key="keywordIndex">{{ keyword }}</li>
                    </ol>
                </th>
                <th>
                    <ul>
                        <li v-for="(audience, audienceIndex) in item.audience" :key="audienceIndex">{{ audience }}</li>
                    </ul>
                </th>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
// https://schema.org/DigitalDocument
const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => [
            {
                url: './framework',
                name: '課程名稱',
                keywords: ['開源', '節流', '投資', '風險控制'],
                audience: ['剛出社會的新鮮人', '想掌握理財觀念全貌的人', '總覺得理財很難的人'],
            }
        ]
    }
})
</script>