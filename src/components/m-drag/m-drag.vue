<template>
  <scroll-view class="m-drag" scroll-y :style="{ height: itemHeight * state.newList.length + 'px' }">
    <view
      v-for="(item, index) in state.newList"
      :key="index"
      class="m-drag-item"
      :class="{ active: state.currentIndex === index }"
      :style="{
        top: state.itemYList[index].top + 'px'
      }"
    >
      <slot :item="item" />
      <view v-show="dragStatus" class="icon" @touchstart="touchStart($event, index)" @touchmove.stop.prevent="touchMove" @touchend="touchEnd">
        <i class="lines" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
  import { reactive, watch } from 'vue'
  const emits = defineEmits(['change'])
  const props = defineProps({
    // 每一项item高度
    itemHeight: {
      type: Number,
      required: true
    },
    // 数据列表
    list: {
      type: Array,
      required: true
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    dragStatus: {
      type: Boolean,
      default: true
    },
  })

  const state = reactive({
    // 数据
    newList: [],
    // 记录所有item的初始坐标
    initialItemYList: [],
    // 坐标数据
    itemYList: [],
    // 记录当前手指的垂直方向的坐标
    touchY: 0,
    // 记录当前操作的item数据
    currentItemY: {},
    // 当前操作的item的下标
    currentIndex: -1
  })

  watch(
    () => props.list,
    (val) => {
      if (!val?.length) return
      // 获取数据列表
      state.newList = val
      // 获取所有item的初始坐标
      state.initialItemYList = getItemsY()
      // 初始化坐标
      state.itemYList = getItemsY()
    },
    {
      immediate: true
    }
  )

  /** @初始化各个item的坐标 **/
  function getItemsY() {
    return props.list.map((item, i) => {
      return {
        left: 0,
        top: i * props.itemHeight
      }
    })
  }

  /** @开始触摸 */
  function touchStart(event, index) {
    // 只读
    if (props.readonly) return
    // H5拖拽时，禁止触发ios回弹
    h5BodyScroll(false)
    const [{ pageY }] = event.touches

    // 记录数据
    state.currentIndex = index
    state.touchY = pageY
    state.currentItemY = state.itemYList[index]
  }

  /** @手指滑动 **/
  function touchMove(event) {
    // 只读
    if (props.readonly) return
    const [{ pageY }] = event.touches
    const current = state.itemYList[state.currentIndex]
    const prep = state.itemYList[state.currentIndex - 1]
    const next = state.itemYList[state.currentIndex + 1]
    // 获取移动差值
    state.itemYList[state.currentIndex] = {
      top: current.top + (pageY - state.touchY)
    }
    // 记录手指坐标
    state.touchY = pageY
    // 向下移动（超过下一个的1/2就进行换位）
    if (next && current.top > next.top - props.itemHeight / 2) {
      changePosition(state.currentIndex + 1)
    } else if (prep && current.top < prep.top + props.itemHeight / 2) {
      // 向上移动（超过上一个的1/2就进行换位）
      changePosition(state.currentIndex - 1)
    }
  }

  /** @手指松开 */
  function touchEnd() {
    // 只读
    if (props.readonly) return
    // 传给父组件新数据
    emits('change', state.newList, state.newList[state.currentIndex])
    // 将拖拽的item归位
    state.itemYList[state.currentIndex] = state.initialItemYList[state.currentIndex]
    state.currentIndex = -1
    // H5开启ios回弹
    h5BodyScroll(true)
  }

  /** @交换位置 **/
  // index 需要与第几个下标交换位置
  function changePosition(index) {
    console.log(index)
    // 记录当前拖拽的item数据
    const tempItem = state.newList[state.currentIndex]
    // 设置原来位置的item
    state.newList[state.currentIndex] = state.newList[index]
    // 将临时存放的数据设置好
    state.newList[index] = tempItem

    // 调整位置item
    state.itemYList[index] = state.itemYList[state.currentIndex]
    state.itemYList[state.currentIndex] = state.currentItemY

    // 改变当前操作的的下标
    state.currentIndex = index

    // 记录新位置的数据
    state.currentItemY = state.initialItemYList[state.currentIndex]
  }

  // h5 ios回弹
  function h5BodyScroll(flag) {
    // #ifdef H5
    document.body.style.overflow = flag ? 'initial' : 'hidden'
    // #endif
  }
</script>

<style scoped lang="scss">
  .m-drag {
    position: relative;
    width: 100%;
    ::-webkit-scrollbar {
      display: none;
    }
    .m-drag-item {
      position: absolute;
      left: 0;
      right: 0;
      transition: all ease 0.25s;
      display: flex;
      align-items: center;
      > :deep(view:not(.icon)) {
        flex: 1;
      }
      .icon {
        padding: 30rpx;
        .lines {
          background: #e0e0e0;
          width: 20px;
          height: 2px;
          border-radius: 100rpx;
          margin-left: auto;
          position: relative;
          display: block;
          transition: all ease 0.25s;
          &::before,
          &::after {
            position: absolute;
            width: inherit;
            height: inherit;
            border-radius: inherit;
            background: #e0e0e0;
            transition: inherit;
            content: '';
            display: block;
          }
          &::before {
            top: -14rpx;
          }
          &::after {
            bottom: -14rpx;
          }
        }
      }
      // 拖拽中的元素，添加阴影、关闭动画、层级置顶
      &.active {
        box-shadow: 0 0 14rpx rgba(0, 0, 0, 0.08);
        transition: initial;
        z-index: 1;
        .icon .lines {
          background: #2e97f9;
          &::before,
          &::after {
            background: #2e97f9;
          }
        }
      }
    }
  }
</style>
