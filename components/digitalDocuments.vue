<template>
    <table v-for="(item, index) in props.items" :key="index">
        <thead>
            <tr>
                <th class="d-md-none">
                    <a :href="`${item.url}.html`">
                        {{ item.name }}</a>
                </th>
                <th class="d-md-none" :style="`width:11em;text-align:center;`">
                    實踐度：
                    <template v-for="number in item.rating" :key="number">
                        ★
                    </template>
                </th>
            </tr>
            <tr>
                <th class="d-none d-md-table-cell"><a :href="`${item.url}.html`">
                        {{ item.name }}</a></th>
                <th class="d-none d-md-table-cell">實踐度：
                    <template v-for="number in item.rating" :key="number">
                        ★
                    </template>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="d-md-none">
                <th colspan="2">
                    <p>大綱</p>
                    <ol>
                        <li v-for="(keyword, keywordIndex) in item.keywords" :key="keywordIndex">{{ keyword }}</li>
                    </ol>
                </th>
            </tr>
            <tr>
                <th class="d-none d-md-table-cell" :style="`width:16em;`">
                    <p>大綱</p>
                    <ol>
                        <li v-for="(keyword, keywordIndex) in item.keywords" :key="keywordIndex">{{ keyword }}</li>
                    </ol>
                </th>
                <th colspan="2">
                    <p>誰適合參與</p>
                    <ul>
                        <li v-for="(audience, audienceIndex) in item.audience" :key="audienceIndex">{{ audience }}</li>
                    </ul>
                </th>
            </tr>
        </tbody>
    </table>
    <p>★★★ 完全實踐、★★ 部分實踐、★ 學習筆記</p>
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
                rating: 1,
            }
        ]
    }
})
</script>