<template>
    <div v-if="isLoaded" ref="slideWrap">
        <slot>

        </slot>
        <a :href="downloadLink">點此下載</a>
    </div>
    <el-card v-else class="card">
        為節省用戶流量，簡報採手動載入。
        <template #footer>
            <div class="card__footer">
                <el-button @click="isLoaded = true">點此線上瀏覽</el-button>
                <el-button @click="loadAndDownload()">點此下載</el-button>
            </div>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import { ref, defineProps, useTemplateRef, onMounted } from 'vue'
const isLoaded = ref(false)
const downloadLink = ref('')
const slideWrap = useTemplateRef<Element>('slideWrap')
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    shareLink: {
        type: String,
        default: ''
    }
})
onMounted(() => {
    let fileId = props.shareLink.replace('https://docs.google.com/presentation/d/', '')
    fileId = fileId.replace('/edit?usp=sharing', '')
    downloadLink.value = `https://docs.google.com/presentation/d/${fileId}/export/pptx`
})
// methods
function loadAndDownload() {
    const link = document.createElement('a')
    link.href = downloadLink.value
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link);
}
</script>
<style lang="scss" scoped>
.card {
    text-align: center;

    .card__footer {
        display: flex;
        justify-content: center;
    }
}
</style>