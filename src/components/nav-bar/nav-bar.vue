<template>
  <view class="nav-bar" :style="boxStyle">
    <view class="nav-var-status" :style="statusbarStyle"></view>
    <view v-if="!hasDefaultSlot" class="nav-bar-content" :style="contentStyle">
      <view v-if="title" class="nav-bar-title">{{ title }}</view>
    </view>
    <view v-else class="nav-bar-slot" :style="contentStyle">
      <slot></slot>
    </view>
  </view>
  <view class="nav-bar-block" :style="blockStyle"></view>
</template>

<script lang='ts' setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import useScreenStyle from "@/hooks/common/useScreenStyle";

const slots = defineSlots();
const hasDefaultSlot = !!slots.default;
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  background: {
    type: String,
    default: '#fff'
  },
  color: {
    type: String,
    default: '#000'
  }
})

const { navHeight, navbarHeight, statusBarHeight } = useScreenStyle()

const boxStyle = computed(() => {
  return {
    background: props.background
  }
})
const statusbarStyle = computed(() => {
  return {
    height: statusBarHeight.value,
  }
})
const blockStyle = computed(() => {
  return {
    width: '100%',
    height: navHeight.value,
    background: 'transparent'
  }
})

const contentStyle = computed(() => {
  return {
    height: navbarHeight.value,
    color: props.color
  }
})
</script>

<style scoped lang='scss'>
  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    &-status {
      background: transparent;
    }
    &-content {
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    &-slot {
      display: flex;
      align-items: center;
    }
    &-title {
      font-weight: bold;
      letter-spacing: 2rpx;
    }
  }
</style>