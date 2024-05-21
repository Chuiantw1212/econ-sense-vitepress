<template>
    <img v-if="modelValue" class="d-md-none"
        :src="`https://skillicons.dev/icons?i=${modelValue}&perline=8&theme=light`">
    <img v-if="modelValue" class="d-none d-md-block"
        :src="`https://skillicons.dev/icons?i=${modelValue}&perline=12&theme=light`">
</template>
<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
</script>
<style lang="scss" scoped>
.d-none {
    display: none;
}

.d-block {
    display: block;
}

@media screen and (min-width: 996px) {
    .d-md-block {
        display: block;
    }

    .d-md-none {
        display: none;
    }
}
</style>