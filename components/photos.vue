<template>
    <div class="photos">
        <div class="photo" v-for="(item, index) in modelValue" :style="{ 'background-image': `url(${item.src})` }"
            :alt="item.alt || '圖片'"></div>
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
    height: 258px;
    background-size: cover;
}

@media screen and (min-width: 996px) {

    .photo {
        width: calc(50% - 8px);
    }
}
</style>