<template>
  <view class="option-item" @tap="onTap">
    <view class="option-item-l">
      <view v-if="icon" class="option-item__icon ka-icon" :class="[icon]"></view>
      <image v-if="iconUrl" class="option-item__icon" :src="iconUrl" mode="scaleToFill"  />
      <view v-if="label" class="option-item__label"><text>{{ label }}</text></view>
      <slot name="content"></slot>
    </view>
    <view class="option-item-r">
      <slot name="value">
        <view class="option-item__val" v-if="val">{{ val }}</view>
      </slot>
      <a-icon class="option-item__arrow" name="arrow" size="12" color="#000" v-if="arrow"></a-icon>
    </view>
    <slot></slot>
  </view>
</template>

<script lang='ts' setup>

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  iconUrl: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  val: {
    type: String,
    default: ''
  },
  arrow: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['attack'])

const onTap = (e: Event) => {
  emits('attack', e)
}
</script>

<style scoped lang='scss'>
  .option-item {
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24rpx 16px 32rpx;
    width: 100%;
    background-color: #ffffff;
    border-bottom: 2rpx solid #f1f1f1;

    &-l, &-r {
      display: flex;
      align-items: center;
    }

    &__icon {
      width: 24px;
      height: 24px;
    }

    &__label {
      color: $uni-text-color;
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
    }

    &__icon + &__label {
      margin-left: 10px;
    }

    &__val {
      color: #AAA;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }

    &__arrow {
      width: 12px;
      height: 12px;
      transform: rotate(90deg);
    }

    &__val + &__arrow {
      margin-left: 4px;
    }
  }
</style>