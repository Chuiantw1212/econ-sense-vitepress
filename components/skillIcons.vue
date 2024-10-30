<template>
    <img v-if="modelValue" class="d-md-none"
        :src="`https://skillicons.dev/icons?i=${modelValue}&perline=8&theme=light`">
    <img v-if="modelValue" class="d-none d-md-block"
        :src="`https://skillicons.dev/icons?i=${modelValue}&perline=12&theme=light`">
    <!-- <div class="skillicons">
        <img v-for="(icon, index) in icons" height="48" width="48" :src="`https://cdn.simpleicons.org/${icon}`" />
    </div> -->
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
// const icons = computed(() => {
//     const icons = props.modelValue.split(',')
//     return icons
// })
</script>
<style lang="scss" scoped>
.d-none {
    display: none;
}

.d-block {
    display: block;
}

.skillicons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
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