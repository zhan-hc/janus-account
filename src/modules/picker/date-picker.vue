<template>
  <picker
    class="date-picker"
    mode="date"
    :value="dateVal"
    :start="startDate"
    :end="endDate"
    :fields="fields"
    @cancel="onCancel"
    @change="onChange">
    <slot></slot>
  </picker>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  fields: {
    type: String,
    default: 'day'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'cancel'])

const dateVal = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    curDateVal.value = value
  }
})

const curDateVal = ref('')

const onChange = (e: any) => {
  emit('update:modelValue', e.detail.value)
  emit('change', e.detail.value)
}

const onCancel = () => {
  curDateVal.value = props.modelValue
  emit('cancel')
}

</script>

<style scoped lang='scss'>
  .date-picker {
    width: 100%;
    height: 100%;
  }
</style>