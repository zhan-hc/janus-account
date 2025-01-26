<template>
   <view class="empty" :style="boxStyle">
      <image class="empty-img" :src="`${imgBaseUrl}/img/empty-state.png`" mode="scaleToFill" />
      <text class="empty-text">{{ text }}</text>
    </view>
</template>

<script lang='ts' setup>
import { imgBaseUrl } from '@/config/domain'

const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  boxStyle: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang='scss'>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #a9a9a9;
    padding-top: 20rpx;
    text-align: center;
    &-img {
      width: 200rpx;
      height: 200rpx;
    }
    &-text {
      margin-top: 20rpx;
      font-size: 24rpx;
    }
  }
</style>