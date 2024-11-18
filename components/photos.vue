<template>
    <div class="photos">
        <img class="photo" v-for="(item, index) in modelValue" :src="item.src" :alt="item.alt || '圖片'"></img>
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
    align-items: center;
}

.photo {
    width: auto;
    height: 100%;
}

@media screen and (min-width: 768px) {

    .photo {
        width: calc(50% - 8px);
    }
}
</style>