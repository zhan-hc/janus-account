<template>
    <uni-popup ref="popRef" background-color="#fff" :isMaskClick="false" borderRadius="16px 16px 0 0" :wrapStyle="popWrapStyle">
      <view class="popup-header">
        <tab-list ref="tabRef" v-model:active="activeVal" :list="accountTypes" @change="getAccountData"></tab-list>
        <a-icon class="popup-close" name="close" size="18" color="#c8c9cc" @tap="handlerClose"></a-icon>
      </view>
      <view class="popup-content">
        <view class="popup-input">
          <view class="amount-unit">¥</view>
          <view class="amount-input">{{ amount }}</view>
        </view>
        <view class="popup-icons">
          <swiper class="icon-swiper" circular indicator-dots :interval="0" :duration="500">
            <swiper-item v-for="(item, index) in swiperTypeList" :key="index">
              <view class="icon-list">
                <view
                  :key="icon.id"
                  class="icon-item"
                  v-for="icon in item"
                  :class="{ 'icon-item--active': categroyId === icon.id }"
                  @click="handlerCategroyClick(icon)"
                >
                  <!-- <image :src="icon.url" class="icon-img" mode="scaleToFill" /> -->
                  <a-icon  class="icon-img" :color="categroyId === icon.id ? '#fff': '#707070'" :name="icon.value" size="20"></a-icon>
                  <text class="icon-name">{{ icon.name }}</text>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>
        <view class="popup-other">
          <view class="other-block amount-remark" @tap="remarkShow = true">{{remark || '添加备注...'}}</view>
          <date-picker v-model="accountDate" title="选择日期" :endDate="curDate">
            <view class="other-block amount-date">{{ accountDate === curDate ? '今天' : accountDate }}</view>
          </date-picker>
          <view v-if="operate === 'edit'" class="other-block btn-delete" @tap="handlerDelete">删除</view>
        </view>
        <amount-keyboard v-model="amount" class="popup-keyboard" @confirm="handleKeep"></amount-keyboard>
        <input-pop v-model="remark" v-model:show="remarkShow" title="添加备注" placeholder="请输入备注..." :autoFocus="true"/>
      </view>
    </uni-popup>
</template>

<script lang='ts' setup>
import { computed, nextTick, ref, watch } from 'vue'
import { fetchDictList } from '@/api/common'
import type { PopMethods } from '@/constant/type/component'
import { splitArray } from '@/utils/array'
import { dateFormat } from '@/utils/date'
import { accountTypeCode, accountTypes } from '@/constant/account'
import InputPop from '@/modules/popup/input-pop.vue'
import TabList from '@/components/tab-list/tab-list.vue'
import AmountKeyboard from '@/modules/keyboard/amount-keyboard.vue'
import DatePicker from '@/modules/picker/date-picker.vue'

const props = defineProps({
  operate: {
    type: String,
    default: 'add' // 'add', 'edit'
  },
  show: {
    type: Boolean,
    default: false
  },
  categroyId: {
    type: String,
    default: ''
  },
  typeId: {
    type: String,
    default: ''
  },
})

const curDate = dateFormat(new Date(), 'YYYY-MM-DD')
const emit = defineEmits(['update:show', 'accountClick','tabChange', 'update:categroyId', 'update:typeId', 'confirm', 'delete'])
const activeVal = ref(props.typeId)
const amountRef = ref(null)
const popRef = ref<PopMethods | null>(null)
const tabRef = ref(null)
const remarkShow = ref(false)
const accountTypeList = ref([])
const amount = ref('')
const remark = ref('')
const accountDate = ref(curDate)

const popWrapStyle = computed(() => {
  return {
    // height: '60vh',
    overflowY: 'scroll'
  }
})

const swiperTypeList = computed(() => {
  return splitArray(accountTypeList.value, 10)
})
watch(() => props.show, (value) => {
  if (value) {
    onOpen()
  } else {
    onClose()
  }
})

const onOpen = async () => {
  if (props.operate === 'add') {
    initData()
  } else {
    activeVal.value = props.typeId
  }
  getAccountData(activeVal.value, props.operate === 'add')
  popRef.value?.open('bottom')
  setTimeout(() => {
    tabRef.value?.moveLine(0, true)
  }, 100);
  props.typeId === accountTypeCode.income && setTimeout(() => {
    tabRef.value?.moveLine(1)
  }, 200);
}

const onClose = () => {
  popRef?.value?.close()

}

const initData = () => {
  activeVal.value = props.typeId
  amount.value = ''
  remark.value = ''
  accountDate.value = curDate
  emit('update:categroyId', '')
}

  const getAccountData = async (value: string, isInit = true) => {
    if (isInit) {
      emit('update:categroyId', null)
      emit('tabChange', activeVal.value)
    }
    fetchDictList(value).then(({ data }: any) => {
      accountTypeList.value = data
    })
    
  }

const handlerClose = () => {
  emit('update:show', false)
}

const handlerDelete = () => {
  uni.showModal({
    title: '提示',
    content: '确认删除当前账单吗？',
    success: function (res) {
      if (res.confirm) {
        emit('delete')
      }
    }
  })
}

const handlerCategroyClick = (item: any) => {
  emit('update:categroyId', item.id)
}

const handleKeep = () => {
  if (!amount.value) {
    uni.showToast({
      title: '请输入金额',
      icon: 'none'
    })
    return
  }
  if (!props.categroyId) {
    uni.showToast({
      title: '请选择分类',
      icon: 'none'
    })
    return
  }
  emit('update:typeId', activeVal.value)
  emit('confirm', {
    amount: amount.value,
    accountDate: accountDate.value,
    remark: remark.value
  })
}

const setParams = (data: { amount: string, date: string, remark: string }) => {
  amount.value = data.amount
  accountDate.value = dateFormat(data.date, 'YYYY-MM-DD')
  remark.value = data.remark
}
defineExpose({
  setParams
})
</script>

<style scoped lang='scss'>
  .popup {
    &-header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 96rpx;
    }
    &-close {
      position: absolute;
      top: 28rpx;
      right: 28rpx;
    }
    &-content {
      padding: 0 32rpx;
    }
    &-input {
      display: flex;
      align-items: center;
      padding: 40rpx 0 12rpx;
      border-bottom: 2rpx solid #ccc;
      .amount {
        &-unit {
          font-weight: bold;
          font-size: 48rpx;
        }
        &-input {
          flex: 1;
          flex-shrink: 0;
          margin-left: 20rpx;
          font-size: 64rpx;
          font-weight: bold;
          height: 68rpx;
        }
      }
    }
    &-icons {
      .icon-swiper {
        height: 332rpx;
      }
      .icon-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        .icon-item {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          font-size: 24rpx;
          margin-top: 20rpx;
          .icon-img {
            width: 80rpx;
            height: 80rpx;
            padding: 20rpx;
            box-sizing: border-box;
            background: #F5F5F5;
            border-radius: 50%;
          }
          .icon-name {
            margin-top: 12rpx;
          }
        }
        .icon-item--active {
            .icon-img {
              background: linear-gradient(180deg, rgba(232, 56, 13, 1) 0%, rgba(243, 147, 79, 1) 99.48%), rgba(0, 0, 0, 1);
            }
          }
      }
    }
    &-other {
      display: flex;
      align-items: center;
      gap: 20rpx;
      .other-block {
        padding: 8rpx 20rpx;
        background: #F5F5F5;
        color: 	#696969;
        border-radius: 6rpx;
        font-size: 24rpx;
      }
      .btn-delete {
        color: #fff;
        background: #f56c6c;
        letter-spacing: 2rpx;
      }
      .amount {
        &-remark {
          flex: 1;
          flex-shrink: 0;
        }
      }
    }
    &-keyboard {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40rpx;
    }
  }
</style>