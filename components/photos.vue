<template>
    <div class="photos">
        <img class="photo" v-for="(item, index) in modelValue" :src="item.src" :alt="item.alt || '圖片'">
    </div>
</template>
<script setup>
const props = defineProps({
    modelValue: {
        type: Array,
        default: []
    }
})
</script>
<style lang="scss" scoped>
.photos {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.photo {
    width: 100%;
}

@media screen and (min-width: 996px) {

    .photo {
        width: calc(50% - 8px);
    }
}
</style>