<template>
  <pop-default ref="popRef" :title="title" @close="onClose">
    <input ref="inputRef" class="pop-input" :type="inputType" v-model="inputVal" cursor-color="#dcdcdc" :placeholder="placeholder" :focus="inputFocus">
    <view class="popup-btn" @tap="onConfirm">完成</view>
  </pop-default>
</template>

<script lang='ts' setup>
import { computed, ref, watch } from 'vue'
import type { PopMethods } from '@/constant/type/component'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  inputType: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  autoFocus: {
    type: Boolean,
    default: false
  }
})

const inputVal = ref(props.modelValue)
const inputFocus = ref(false)

const emit = defineEmits(['update:show', 'update:modelValue', 'confirm', 'open', 'close'])

const popRef = ref<PopMethods | null>(null)
const inputRef = ref(null)

watch(() => props.show, (value) => {
  if (value) {
    emit('open')
    setTimeout(() => {
      inputVal.value = props.modelValue
    }, 100)
    popRef.value?.open('bottom')
    props.autoFocus && (inputFocus.value = true)
  } else {
    emit('close')
    popRef.value?.close()
  }
})

const onClose = () => {
  inputVal.value = props.modelValue
  emit('update:show', false)
}

const onConfirm = () => {
  emit('update:show', false)
  emit('update:modelValue', inputVal.value)
  emit('confirm')
}
</script>

<style scoped lang='scss'>
  .pop-input {
    align-self: flex-start;
  }
  .popup-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 640rpx;
    height: 64rpx;
    margin-top: 40rpx;
    color: #fff;
    background: #FF643B;
    border-radius: 20rpx;
    letter-spacing: 2rpx;
  }
</style>