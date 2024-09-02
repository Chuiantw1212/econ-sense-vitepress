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
}

.photo {
    width: 100%;
    height: auto;
    background-size: cover;
    background-position: center;
}

@media screen and (min-width: 768px) {

    .photo {
        width: calc(50% - 8px);
    }
}
</style>