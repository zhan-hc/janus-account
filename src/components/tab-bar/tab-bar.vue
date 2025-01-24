<template>
  <view class="tab-bar__container">
    <view class="tab-bar__box">
      <view class="tab-bar__item" v-for="(item, i) in defaultTabBarList" :key="i"  :class="activeIndex === i ? 'tab-bar__item--active' : ''" @tap="handleTabClick(item, i)">
        <a-icon class="tab-bar__item-icon" :name="item.icon" :color="activeIndex === i ? '#FF643B' : '#A3A3A3'" size="36"></a-icon>
        <!-- <text>{{ item.name }}</text> -->
      </view>
    </view>
    <view class="tab-bar__safe"></view>
  </view>
</template>

<script lang='ts' setup>
import { defaultTabBarList } from '@/constant/tabBar'

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['mainClick'])


const handleTabClick = (item: any, i: number) => {
  i !== props.activeIndex && item.url && uni.switchTab({
    url: item.url
  })
}
</script>

<style scoped lang='scss'>
  .tab-bar{
    &__safe {
      height: calc(constant(safe-area-inset-bottom));
      height: calc(env(safe-area-inset-bottom));
      background: #fff;
    }
    &__container {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      z-index: 98;
      border-top: 1px solid #f5f5f5;
      box-shadow: 0px 0px 4px  rgba(0, 0, 0, 0.09);
    }
    &__box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 104rpx;
      background: #fff;
    }
    &__item {
      flex: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      color: #22222a;
      transition: all .3s ease-out;
      &--active {
      color: #FF643B;
      }
    }
  }

</style>