<template>
    <template v-if="isLoaded">
        <slot>

        </slot>
    </template>
    <el-button v-else @click="isLoaded = true">點此載入投影片</el-button>
</template>
<script setup>
import { ref } from 'vue'
const isLoaded = ref(false)
</script>