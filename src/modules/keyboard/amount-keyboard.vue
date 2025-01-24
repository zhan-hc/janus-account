<template>
  <view class="keyboard">
    <view class="item" @tap="onClick('1')" hover-class="key-hover">1</view>
    <view class="item" @tap="onClick('2')" hover-class="key-hover">2</view>
    <view class="item" @tap="onClick('3')" hover-class="key-hover">3</view>
    <view class="item" @tap="onClick('4')" hover-class="key-hover">4</view>
    <view class="item" @tap="onClick('5')" hover-class="key-hover">5</view>
    <view class="item" @tap="onClick('6')" hover-class="key-hover">6</view>
    <view class="item" @tap="onClick('7')" hover-class="key-hover">7</view>
    <view class="item" @tap="onClick('8')" hover-class="key-hover">8</view>
    <view class="item" @tap="onClick('9')" hover-class="key-hover">9</view>
    <view class="item item-zero" @tap="onClick('0')" hover-class="key-hover">0</view>
    <view class="item item-del" @tap="onClick('del')"  hover-class="key-hover">
      <a-icon name="keyboard-del" size="20"></a-icon>
    </view>
    <view class="item item-point" @tap="onClick('.')" hover-class="key-hover">.</view>
    <view class="item item-confirm" :class="{ 'disabled': !amountVal }" @tap="onConfirm">完成</view>
  </view>
</template>

<script lang='ts' setup>
import { computed, ref } from "vue"


const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

  const emit = defineEmits(['confirm', 'update:modelValue'])
  const curVal = ref('')

  const amountVal = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    }
  })

  const onConfirm = () => {
    props.modelValue && emit('confirm')
  }

  const onClick = (keyCode: string) => {
    if (keyCode === '.') {
      if (!amountVal.value.length) {
        amountVal.value = '0.'
        return
      }
    }
    if (keyCode === 'del') {
      amountVal.value = amountVal.value.slice(0, -1)
      return
    } else {
      const pointIndex = amountVal.value.indexOf('.') 
      if (pointIndex === -1 && amountVal.value.length >= 10 && keyCode !== '.') {
        return
      } else if (pointIndex > -1 && amountVal.value.length - pointIndex >= 3) {
        return
      }
      amountVal.value += keyCode
    }
  }
</script>

<style scoped lang='scss'>
  .keyboard {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 80rpx;
    gap: 20rpx;
    padding: 20rpx;
    background: #f5f5f5;
    border-radius: 10rpx;
    .item {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 10rpx;
      font-weight: bold;
    }
    .key-hover {
      background: #ebedf0;
    }
    .item-zero {
      grid-row-start: 4;
      grid-column: 1 / 3;;  
    }
    .item-point {
      grid-row-start: 4;
      grid-column-start: 3;
    }
    .item-del {
      grid-column-start:4;
      grid-row-start:1;
    }
    .item-confirm {
      height: 240rpx;
      grid-column-start: 4;
      grid-row: 2 / 5;
      color: #fff;
      letter-spacing: 2rpx;
      background: $primary-color;
      &.disabled {
        opacity: .7;
      }
    }
  }
</style>