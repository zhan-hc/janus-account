<template>
  <view class="bill">
    <nav-bar background="linear-gradient(180deg, rgba(232, 56, 13, 1) 0%, rgba(243, 147, 79, 1) 99.48%)" color="#fff" title="账单"></nav-bar>
    <view class="bill-filter">
      <date-picker v-model="accountDate" title="选择日期" fields="year" @change="changePicker">
        <view class="picker-box">
          <view class="picker-text">{{ accountDate }}</view>
          <a-icon class="caret" name="caret" color="#000" size="16"></a-icon>
        </view>
      </date-picker>
    </view>
    <view class="all-statistics">
      <text class="item-value">{{`￥ ${formatMoney(totalBalance, 2)}`}}</text>
      <text class="item-label">总结余</text>
    </view>
    <view class="bill-statistics">
      <view class="statistics-item">
        <text class="item-label">总收入</text>
        <text class="item-value">{{`￥ ${formatMoney(totalIncome, 2)}`}}</text>
      </view>
      <view class="statistics-item">
        <text class="item-label">总支出</text>
        <text class="item-value">{{`￥ ${formatMoney(totalExpense, 2)}`}}</text>
      </view>
    </view>
    <empty v-if="!isLogin" text="暂无账单数据"></empty>
    <scroll-view v-else scroll-y class="bill-table" :style="tableStyle">
      <view class="table-item">
        <view class="table-header">月份</view>
        <view class="table-header">收入</view>
        <view class="table-header">支出</view>
        <view class="table-header">结余</view>
      </view>
      <view class="table-item" v-for="(item, i) in tableList" :key="i">
        <view class="table-row">{{ item.month }}</view>
        <view class="table-row">{{ formatMoney(item.income, 2) }}</view>
        <view class="table-row">{{ formatMoney(item.expense, 2) }}</view>
        <view class="table-row">{{ formatMoney(item.income - item.expense, 2) }}</view>
      </view>
    </scroll-view>
    <tab-bar :activeIndex="2"></tab-bar>
  </view>
</template>

<script lang='ts' setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'
import { onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref, toRefs } from "vue";
import { getTypeCurDate } from '@/utils/date'
import { formatMoney, transformMonthData } from '@/utils/amount'
import { fetchAllStatistics, fetchMonthStatistics } from "@/api/statistics";
import { accountTypeCode } from "@/constant/account";
import useScreenStyle from "@/hooks/common/useScreenStyle"
import DatePicker from '@/modules/picker/date-picker.vue'


const store = useUserStore()
const { isLogin }: any = storeToRefs(store)
const accountDate = ref(getTypeCurDate('year'))
const state = reactive({
  totalIncome: 0,
  totalExpense: 0,
  totalBalance: 0,
  tableList: []
})

const { totalIncome, totalExpense, totalBalance, tableList } = toRefs(state)

const { navHeight, contentHeight } = useScreenStyle()
const tableStyle = computed(() => {
  return {
    height: `calc(${contentHeight.value} - ${navHeight.value} - 398rpx)`,
  }
})

const changePicker = async () => {
  await getStaticData()
}

const getStaticData = async () => {
  const { data }: any = await fetchAllStatistics()
  state.totalIncome = data.find((item: any) => item.type_id === accountTypeCode.income).totalAmount
  state.totalExpense = data.find((item: any) => item.type_id === accountTypeCode.expense).totalAmount
  state.totalBalance = state.totalIncome - state.totalExpense
  const { data: tableData }: any = await fetchMonthStatistics(accountDate.value)
  state.tableList = transformMonthData(tableData, accountDate.value)
}

onShow(async () => {
  if (isLogin.value) {
    await getStaticData()
  }
})
</script>

<style scoped lang='scss'>
  .bill {
    min-height: 100vh;
    background: #F5F5F5;
    &-filter {
      display: flex;
      align-items: center;
      margin-top: 20rpx;
      padding: 0 20rpx;
      height: 42rpx;
      box-sizing: border-box;
      .picker-box {
        display: flex;
        justify-content: center;
        align-items: center;
        .picker-text {
          font-weight: 500;
        }
        .caret {
          margin-left: 6rpx;
        }
      }
    }
    .all-statistics {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 136rpx;
      margin: 20rpx;
      padding: 20rpx 0;
      border-radius: 24rpx;
      box-sizing: border-box;
      .item-value {
        font-size: 48rpx;
        font-weight: bold;
      }
      .item-label {
        margin-top: 12rpx;
        color: #615C5C;
        font-size: 24rpx;
      }
    }
    &-statistics {
      display: flex;
      align-items: center;
      gap: 40rpx;
      padding: 0 40rpx;
      height: 136rpx;
      box-sizing: border-box;
      .statistics-item {
        flex: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 24rpx;
        font-weight: 500;
        letter-spacing: 2rpx;
        color: #fff;
        padding: 20rpx 0;
        &:first-child {
          background: #2BB272;
        }
        &:nth-child(2) {
          background: #FF643B;
        }
        &:nth-child(3) {
          background: #8234F8;
        }
        .item-value {
          margin-top: 12rpx;
        }
      }
    }
    &-table {
      margin-top: 20rpx;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      .table-item {
        display: flex;
        .table-header {
          flex: 1;
          font-weight: 500;
          font-size: 20rpx;
          text-align: center;
          color: #615C5C;
          padding: 20rpx 0;
          border-bottom: 2rpx solid #f1f1f1;
        }
        .table-row {
          flex: 1;
          font-size: 24rpx;
          font-weight: bold;
          text-align: center;
          padding: 20rpx 0;
          border-bottom: 2rpx solid #f1f1f1;
        }
      }
    }
  }
</style>