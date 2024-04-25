# 一生財務試算

<script setup>
import { onMounted } from 'vue'
onMounted(async()=>{
    console.log(import.meta.env) // "123"
    let baseURL = ''
    if(import.meta.env.MODE==='development'){
        console.log('?')
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/select`)
        // const result = await axios.request({
        //     baseURL:import.meta.env.VITE_BASE_URL,
        //     url:'/select'
        // })
        console.log(res)
    }
})
</script>
