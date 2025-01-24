<template>
  <view class="tab-list">
    <view 
      class="tab-item"
      v-for="(item, i) in list"
      :key="item.value"
      :id="`tab_${i}`"
      :class="{'tab-item--active': active === item.value}"
      @tap="changeTab(item, i)"
    >
      {{ item.name }}
    </view>
    <image src="@/static/img/tab-line.png" mode="scaleToFill"  class="tab-line" :style="{transform: `translateX(${offset}px)`}"/>
  </view>
</template>

<script lang='ts' setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, getCurrentInstance, nextTick, ref } from 'vue'

const props = defineProps({
  active: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  }
})
const vm = getCurrentInstance()
const firstOffsetLeft = ref(0) // 第一个元素的offsetLeft
const offset = ref(0) // 偏移固定量

const emits = defineEmits(['clickLeft', 'change', 'update:active'])

const onClickLeft = (e: any) => {
  emits('clickLeft', e)
}

const moveLine = (index: number, init = false) => {
  const query = uni.createSelectorQuery().in(vm?.proxy);
  query.select(`#tab_${index}`).boundingClientRect();
  query.select('.tab-line').boundingClientRect();
  query.exec(([curTab, tabLine])=> {
    if (curTab && tabLine) {
      init && (firstOffsetLeft.value = curTab.left)
      const activeOffsetLeft = (curTab.width - tabLine.width) / 2 // 获取active块距离当前tab的左边距
      offset.value = curTab.left - firstOffsetLeft.value + activeOffsetLeft
    }
  })
  
}

const activeIndex = computed(() => {
  return props.list.findIndex((item: any) => item.value === props.active)
})

const changeTab = (item: any, i: number) => {
  emits('update:active', item.value)
  emits('change', item.value)
  moveLine(i)
}

onLoad(() => {
  nextTick(() => {
    moveLine(activeIndex.value, true)
  })
})

defineExpose({
  moveLine
})
</script>

<style scoped lang='scss'>
  .tab {
  &-list {
    display: flex;
    align-items: center;
    height: 100%;
    color: #000;
    font-family: "PingFang SC";
    font-size: 12px;
    font-weight: 400;
  }
  &-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 108rpx;
    text-align: center;
    transition-duration: 0.2s;
    &--active {
      font-size: 14px;
      font-weight: 500;
    }
  }
  &-line {
    width: 64rpx;
    height: 24rpx;
    position: absolute;
    bottom: 0;
    transition-duration: 0.2s;
  }
}
</style>