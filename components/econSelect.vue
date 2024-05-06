<template>
    <select v-model="selectValue" class="form__select" :disabled="disabled" @change="handleChange()">
        <option :label="placeholder" value=""></option>
        <option v-for="(item) in options" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled" />
    </select>
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue'
const emits = defineEmits(['update:modelValue', 'change'])
interface IOptionItem {
    label: string
    value: any,
    disabled?: boolean,
}
const props = defineProps({
    modelValue: {
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array as PropType<IOptionItem[]>,
        default: () => {
            return []
        }
    },
    placeholder: {
        type: String,
        default: '請選擇'
    }
})

const selectValue = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    }
})

function handleChange() {
    emits('change', selectValue.value)
}
</script>
<style lang="scss" scoped>
.form__select {
    all: unset;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 130px;
    padding: 0 15px;

    &:disabled {
        background-color: rgb(245, 247, 250);
    }
}
</style>