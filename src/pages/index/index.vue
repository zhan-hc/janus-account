<template>
  <view class="index">
    <view class="index-fixed">
      <nav-bar background="transparent" color="#fff">
        <view class="index-header">
          <view class="header-book" @tap="bookShow = true">
            <text>{{ curBookItem.name}}</text>
            <a-icon class="caret" name="caret" color="#fff" size="16"></a-icon>
          </view>
        </view>
      </nav-bar>
      <view class="index-summary">
        <view class="summary-item">
          <text class="item-label">{{curDateData.year}}</text>
          <view class="item-value">
            <text>{{curDateData.month}}</text>
            <a-icon class="caret" name="caret" color="#000" size="18"></a-icon>
          </view>
          <date-picker v-model="accountDate" title="选择日期" :endDate="curDate" fields="month" @change="getAccountList">
            <view class="date-block"></view>
          </date-picker>
        </view>
        <view class="summary-item">
          <text class="item-label">收入</text>
          <text class="item-value income">{{ `￥ ${formatMoney(bookStatistics[accountTypeCode.income], 2)}` }}</text>
        </view>
        <view class="summary-item">
          <text class="item-label">支出</text>
          <text class="item-value expense">{{ `￥ ${formatMoney(bookStatistics[accountTypeCode.expense], 2)}` }}</text>
        </view>
      </view>
    </view>
    <view class="index-block" :style="fixedStyle"></view>
    <scroll-view scroll-y class="index-content" :style="contentStyle" v-if="accountList.length" >
      <view class="account-list" v-for="(data, i) in accountList" :key="i">
        <view class="account-summary">
          <text class="account-time">{{ data.date }}</text>
          <text v-if="data.income" class="account-income">{{`收入：${formatMoney(data.income, 2)}`}}</text>
          <text v-if="data.expense" class="account-expense">{{`支出：${formatMoney(data.expense, 2)}`}}</text>
        </view>
        <view class="account-item"
          v-for="item in data.list"
          :key="item.id"
          :class="item.type_id === accountTypeCode.income ? 'income' : 'expense'"
          @tap="handleAccount('edit', item)"
        >
          <a-icon  class="item-icon" color="#fff" :name="item?.category?.value" size="16"></a-icon>
          <view class="item-info">
            <text class="item-category">{{ item?.category?.name }}</text>
            <view class="item-name">
              <text>{{item?.user?.name}}</text>
              <text v-if="item?.remark">{{ `-${item?.remark}` }}</text>
            </view>
          </view>
          <text class="item-amount">{{`￥ ${formatMoney(item.amount, 2)}`}}</text>
        </view>
      </view>
    </scroll-view>
    <empty v-else :boxStyle="contentStyle" text="暂无记账数据"></empty>
    <view class="index-plus" @tap="handleAccount('add')">
      <a-icon name="plus" size="24" color="#fff"></a-icon>
    </view>
    <list-pop v-model="curBookItem.id" v-model:show="bookShow" :list="bookList" title="选择账本" @confirm="bookConfirm"></list-pop>
    <account-pop
      ref="accountPopRef"
      v-model:show="show"
      v-model:categroyId="categoryId"
      v-model:typeId="typeId"
      :operate="popOperate"
      @confirm="accountConfirm"
      @delete="accountDelete"
    ></account-pop>
    <tab-bar :activeIndex="0"></tab-bar>
  </view>
</template>

<script lang='ts' setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { imgBaseUrl } from '@/config/domain'
import { dateFormat } from '@/utils/date'
import { formatMoney } from '@/utils/amount'
import { useUserStore } from '@/store/user'
import { onShow } from '@dcloudio/uni-app'
import { accountTypeCode } from '@/constant/account'
import useBook from '@/hooks/book/useBook'
import useAccount from '@/hooks/account/useAccount'
import useScreenStyle from "@/hooks/common/useScreenStyle"
import listPop from '@/modules/popup/list-pop.vue'
import AccountPop from '@/modules/popup/account-pop.vue'
import DatePicker from '@/modules/picker/date-picker.vue'

const show = ref(false)
const bookShow = ref(false)
const popOperate = ref('add')
const accountPopRef = ref(null)
const curEditItem = ref(null)
const curDate = dateFormat(new Date(), 'YYYY-MM')
const store = useUserStore()
const { isLogin }: any = storeToRefs(store)
const { navHeight, contentHeight } = useScreenStyle()
const { typeId, categoryId, accountList, getAccountList, handleKeepAccount, handleUpateAccount, handleDeleteAccount } = useAccount()
const { curDateData, accountDate, curBook, curBookItem, curBookId, apiParams, bookList, bookStatistics,
        getBookList, getBookStatistics
      } = useBook()

const fixedStyle = computed(() => {
  return {
    height: `calc(${navHeight.value} + 362rpx)`,
  }
})

const contentStyle = computed(() => {
  return {
    height: `calc(${contentHeight.value} - ${navHeight.value} - 362rpx)`,
    background: '#fff'
  }
})

const bookConfirm = async (book: any) => {
  curBook.value = book
  await initAccountData()
} 

const accountDelete = async (item: any) => {
  await handleDeleteAccount({
    id: curEditItem.value.id,
      book_id: curBookId.value,
  })
  await initAccountData()
  show.value = false
}
const accountConfirm = async ({ amount, accountDate: date, remark }: any) => {
  if (popOperate.value === 'add') {
    await handleKeepAccount({
      amount,
      remark,
      account_time: date,
      book_id: curBookId.value,
      type_id: typeId.value,
      category_id: categoryId.value
    })
  } else {
    await handleUpateAccount({
      id: curEditItem.value.id,
      amount,
      remark,
      account_time: date,
      book_id: curBookId.value,
      type_id: typeId.value,
      category_id: categoryId.value
    })
  }
  await initAccountData()
  show.value = false
}

const handleAccount = (type: 'add' | 'edit', item?: any) => {
  if (!isLogin.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/mine/index'
      })
    }, 1000)
    return
  }
  popOperate.value = type
  if (type === 'edit') {
    curEditItem.value = item
    categoryId.value = item.category_id
    typeId.value = item.type_id
    accountPopRef.value?.setParams({
      amount: String(item.amount),
      date: item.account_time,
      remark: item.remark
    })
  }
  show.value = true
}

const initAccountData = async () => {
  typeId.value = accountTypeCode.expense
  categoryId.value = null
  await getBookStatistics()
  await getAccountList(apiParams.value)
}
const init = async () => {
  if (isLogin.value) {
    await getBookList()
    await initAccountData()
  }
}

onShow(async () => {
  await init()
})
</script>

<style scoped lang='scss'>
  .index {
    min-height: 100vh;
    background: url($account-url + '/img/account-top.png'), #f5f5f5;
    background-repeat: no-repeat;
    background-size: 100% auto;
    overflow-y: scroll;
    &-fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }
    &-plus {
      z-index: 99;
      position: fixed;
      bottom: calc(144rpx + constant(safe-area-inset-bottom));
      bottom: calc(144rpx + env(safe-area-inset-bottom));
      right: 40rpx;
      width: 90rpx;
      height: 90rpx;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: $primary-color;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    &-header {
      height: 56rpx;
      padding: 0 20rpx;
      background: transparent;
      box-sizing: border-box;
      .header-book {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        letter-spacing:2rpx;
        font-weight: bold;
        color: #fff;
        .caret {
          margin-left: 6rpx;
        }
      }
    }
    &-summary {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 164rpx;
      margin-top: 200rpx;
      border-radius: 40rpx 40rpx 0 0;
      background: #fff;
      // margin: 0 auto;
      padding: 20rpx 20rpx;
      border-top: 1rpx solid #f1f1f1;
      box-sizing: border-box;
      .summary-item {
        position: relative;
        flex: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .date-block {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .item-label {
          font-size: 28rpx;
          font-weight: bold;
          letter-spacing: 4rpx;
          // color: #f5f5f5;
        }
        .item-value {
          display: flex;
          align-items: center;
          margin-top: 12rpx;
          font-size: 36rpx;
          font-weight: bold;
          &.income {
            color: #FF643B;
          }
          &.expense {
            color: #2BB272;
          }
          // color: #fff;
          .icon-caret {
            margin-left: 6rpx;
          }
        }
      }
    }
    &-content {
      font-size: 24rpx;
      color: #a9a9a9;
      overflow: scroll;
      padding-bottom: calc(constant(safe-area-inset-bottom) + 124rpx);
      padding-bottom: calc(env(safe-area-inset-bottom) + 124rpx);
      background: #fff;
      .account-list {
        display: flex;
        flex-direction: column;
        background: #fff;
        &:not(:first-child) {
          .account-summary {
            margin-top: 20rpx;
          }
        }
      .account-summary {
          display: flex;
          align-items: center;
          height:56rpx;
          padding:0 20rpx;
          border-bottom: 1rpx solid #f1f1f1;
          border-top: 1rpx solid #f1f1f1;
          box-sizing: border-box;
          .account-time {
            flex: 1;
            flex-shrink: 0;
          }
          .account-expense {
            margin-left: 40rpx;
          }
        }
        .account-item {
          display: flex;
          align-items: center;
          padding: 20rpx 20rpx;
          font-size: 28rpx;
          color: #222226;
          background: #fff;
          width: 100%;
          border-radius: 10px;
          margin: 10px auto 0;
          border-bottom: 1rpx solid #f1f1f1;
          box-sizing: border-box;
          &:last-child {
            border-bottom: none;
          }
          // box-shadow: 4px 4px 4px rgba(0,0,0,0.07);
          &.income {
            .item-amount {
              color: #FF643B;
            }
          }
          &.expense {
            .item-amount {
              color: #2BB272;
            }
          }
          .item-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            padding: 10rpx;
            background: linear-gradient(180deg, rgba(232, 56, 13, 1) 0%, rgba(243, 147, 79, 1) 99.48%), rgba(0, 0, 0, 1);
          }
          .item-info {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            margin-left: 32rpx;
          }
          .item-category {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 24rpx;
          }
          .item-name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 20rpx;
            color: #a3a3a3;
          }
          .item-remark {
            font-size: 24rpx;
            margin-left: 20rpx;
            color: #a3a3a3;
          }
          .item-amount {
            margin-left: 20rpx;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>