<template>
    <Profile></Profile>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Profile from './profile.vue'
import { ElMessage, ElMessageBox, } from 'element-plus'

const { VITE_BASE_URL } = (import.meta as any).env
const isSelectReady = ref<boolean>(false)
const metadata = ref('')

onMounted(() => {
    setSelecOptionSync()
})

async function setSelecOptionSync() {
    if (isSelectReady.value) {
        return
    }
    try {
        const bankConfigPromises = [
            fetch(`http://localhost:8888/api/v1/metadata`)
        ]
        const bankConfigRes = await Promise.all(bankConfigPromises)
        isSelectReady.value = true
    }
    catch (error) {
        // https://element-plus.org/en-US/component/message-box.html#message-box
        ElMessageBox.alert(error.msssage || 'Google Cloud App Engine無回應', {
            confirmButtonText: '回講座排程',
            callback: () => {
                // backToCalendar()
            },
        })
    }
}
</script>