<template>
    <template v-if="isLoaded">
        <slot>

        </slot>
    </template>
    <el-card v-else>
        為節省用戶流量，簡報採手動載入。
        <el-button @click="isLoaded = true">點此載入</el-button>
    </el-card>
</template>
<script setup>
import { ref } from 'vue'
const isLoaded = ref(false)
</script>