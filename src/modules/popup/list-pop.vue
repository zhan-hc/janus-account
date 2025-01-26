<template>
  <pop-default ref="popRef" :title="title" @close="onClose" :wrapStyle="popStyle">
    <scroll-view scroll-y style="max-height: 50vh">
      <view v-if="!slots.default">
        <view v-for="(item, i) in list" :key="i" class="pop-item" @tap="onTap(item)">
          <text class="item-text">{{ item.name }}</text>
          <a-icon
            v-if="item.id === activeVal"
            name="tick"
            color="#FF643B"
          />
        </view>
      </view>
      <view v-else v-for="(item, i) in list" :key="i" :style="itemStyle">
        <slot :item="item" :index="i" :itemClick="onTap" :isActive="item.id === activeVal">
        </slot>
      </view>
    </scroll-view>
    <view class="popup-btn" @tap="onConfirm">完成</view>
  </pop-default>
</template>

<script lang='ts' setup>
import { computed, ref, useSlots, watch } from 'vue'
import type { PopMethods } from '@/constant/type/component'
import useScreenStyle from '@/hooks/common/useScreenStyle'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  },
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  itemStyle: {
    type: Object,
    default: () => ({})
  }
})

const slots = useSlots()
const curActiveItem = computed(() => {
  return props.list.find((item: any) => item.id === activeVal.value)
})

const activeVal = ref(props.modelValue)
const inputFocus = ref(false)

const emit = defineEmits(['update:show', 'update:modelValue', 'confirm', 'open', 'close'])

const popRef = ref<PopMethods | null>(null)
const inputRef = ref(null)
const { navHeight } = useScreenStyle()

const popStyle = computed(() => {
  return {
    maxHeight: `calc(100vh - ${navHeight.value})`,
  }
})

watch(() => props.show, (value) => {
  if (value) {
    emit('open')
    setTimeout(() => {
      activeVal.value = props.modelValue
    }, 100)
    popRef.value?.open('bottom')
  } else {
    emit('close')
    popRef.value?.close()
  }
})

const onTap = (item: any) => {
  activeVal.value = item.id
}

const onClose = () => {
  activeVal.value = props.modelValue
  emit('update:show', false)
}

const onConfirm = () => {
  emit('update:show', false)
  emit('confirm', curActiveItem.value)
}
</script>

<style scoped lang='scss'>
  .pop-content {
    align-self: flex-start;
  }
  .pop-item {
    width: 100%;
    display: flex;
    align-items: center;
    height: 76rpx;
    font-size: 28rpx;
    border-bottom: 2rpx solid #f5f5f5;
    .item-text {
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .popup-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 640rpx;
    height: 64rpx;
    margin: 40rpx 0 32rpx;
    color: #fff;
    background: #FF643B;
    border-radius: 20rpx;
    letter-spacing: 2rpx;
  }
</style>