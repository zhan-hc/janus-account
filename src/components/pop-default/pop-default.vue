<template>
  <uni-popup ref="popRef" background-color="#fff" borderRadius="16px 16px 0 0" :wrapStyle="wrapStyle">
    <view class="popup-header">
      <view class="header-left" @tap="handlerClose">
        <a-icon class="arrow" name="arrow" size="16" color="#000"></a-icon>
        <text class="header-text">{{ title }}</text>
      </view>
      <a-icon class="popup-close" name="close" size="18" color="#c8c9cc" @tap="handlerClose"></a-icon>
    </view>
    <view class="popup-content">
      <slot></slot>
    </view>
  </uni-popup>
</template>

<script lang='ts' setup>
import { computed, ref, watch } from 'vue'
import type { PopMethods } from '@/constant/type/component'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  wrapStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const popRef = ref<PopMethods | null>(null)

const open = async (direction: string) => {
  popRef.value?.open(direction)
}

const close = () => {
  popRef?.value?.close()
}

const handlerClose = () => {
  emit('close')
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang='scss'>
  .popup {
    padding-bottom: 40rpx;
    &-header {
      position: relative;
      display: flex;
      align-items: center;
      height: 96rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      font-weight: bold;
      .header-left {
        display: flex;
        align-items: center;
        .arrow {
          transform: rotate(-90deg);
        }
      }
      .header-text {
        margin-left: 12rpx;
      }
    }
    &-close {
      position: absolute;
      top: 28rpx;
      right: 28rpx;
    }
    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 32rpx;
    }
  }
</style>