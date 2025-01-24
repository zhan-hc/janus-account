<template>
  <view class="chart">
    <nav-bar background="linear-gradient(180deg, rgba(232, 56, 13, 1) 0%, rgba(243, 147, 79, 1) 99.48%)" color="#fff" title="图表"></nav-bar>
    <view class="chart-filter">
      <date-picker v-model="accountDate" title="选择日期" :fields="curDateType" @change="changePicker">
        <view class="picker-box">
          <view class="picker-text">{{ accountDate }}</view>
          <a-icon class="caret" name="caret" color="#000" size="16"></a-icon>
        </view>
      </date-picker>
      <view class="filter-right">
        <view 
          class="filter-item"
          v-for="item in dateType" 
          :key="item.value" 
          :class="{'active': item.value === curDateType}" 
          @tap="changeType(item, 'dateType')"
        >
          {{ item.label }}
        </view>
      </view>
    </view>
    <view class="filter-type">
      <view 
        class="type-item"
        v-for="item in accountTypes" 
        :key="item.value" 
        :class="{'active': item.value === curTypeId}" 
        @tap="changeType(item, 'accountType')"
      >
        {{ item.name }}
      </view>
    </view>
    <view style="width:750rpx; height:750rpx"><l-echart ref="chartRef"></l-echart></view>
    <tab-bar :activeIndex="1"></tab-bar>
  </view>
</template>

<script lang='ts' setup>
import { storeToRefs } from 'pinia'
import { onShow } from '@dcloudio/uni-app';
import { accountTypeText, dateType, dateTypeText } from '@/constant/account';
import { computed, onMounted, ref, type Ref } from 'vue'
import { accountTypes } from '@/constant/account';
import { getDateObj, getTypeCurDate } from '@/utils/date'
import { useUserStore } from '@/store/user'
import { fetchCategoryStatistics } from '@/api/statistics';
import useBook from '@/hooks/book/useBook'
import DatePicker from '@/modules/picker/date-picker.vue'

const echarts = require('../../static/js/echarts.min.js');
const chartRef = ref(null)
const curDateType: Ref<'year' | 'month' | 'day'> = ref('year')
const curTypeId = ref(accountTypes[0].value)
const store = useUserStore()
const { isLogin }: any = storeToRefs(store)
const {  curBook, curBookId, bookList, getBookList } = useBook()

const accountDate = ref(getTypeCurDate('year'))
const getOptions = (data: any = [], name: string = '记账分类统计') => {
  return {
    legend: {
      top: 'bottom'
    },
    series: [
      {
        name,
        type: 'pie',
        radius: [15, 375 / 4],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        label: {
          // 设置标签显示内容
          formatter: '{b}: {d}%' 
        },
        data
      }
    ]
  }
}

const changePicker = async () => {
  await getStaticData(accountDate.value)
}

const changeType = async (item: any, type: 'dateType' | 'accountType') => {
  if (type === 'dateType') {
    curDateType.value = item.value
    accountDate.value = getTypeCurDate(curDateType.value)
  } else if (type === 'accountType') {
    curTypeId.value = item.value
  }
  await getStaticData()
}

const getStaticData = async (curDateStr?: string) => {
  const { data }: any = await fetchCategoryStatistics({
      book_id: curBookId.value,
      type_id: curTypeId.value,
      ...getDateObj(curDateType.value, curDateStr)
    })
    const pieData = data.map((item: any) => {
      return {
        value: item.totalAmount,
        name: item.category.name
      }
    })
      // 组件能被调用必须是组件的节点已经被渲染到页面上
      setTimeout(async()=>{
          if(!chartRef.value) return
          const myChart = await chartRef.value.init((echarts))
          myChart.setOption(getOptions(pieData, `${curDateStr || `今${dateTypeText[curDateType.value]}`}的${accountTypeText[curTypeId.value]}分类统计`))
      },300)
}

onShow(async () => {
  if (isLogin.value) {
    await getBookList()
    await getStaticData()
  }
})

</script>

<style scoped lang='scss'>
  .chart {
    min-height: 100vh;
    background:#f5f5f5;
    &-filter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 48rpx;
      height: 56rpx;
      margin-top: 20rpx;
      box-sizing: border-box;
      padding: 0 20rpx;
      .filter-right {
        display: flex;
        width: 360rpx;
        height: 56rpx;
      }
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
    .filter-type {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin-top: 20rpx;
      padding: 0 20rpx;
      box-sizing: border-box;
      .type-item {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 64rpx;
        font-weight: 500;
        padding: 0 40rpx;
        font-size: 28rpx;
        color: #8C8C8C;
        background: #E7EAF3;
        margin-right: 20rpx;
        border-radius: 20rpx;
        &:last-child {
          margin-right: 0;
        }
        &.active {
          background: $primary-color;
          color: #fff;
        }
      }
    }
    .filter-item {
      flex: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      font-size: 28rpx;
      color: #8C8C8C;
      background: #E7EAF3;
      &.active {
        background: $primary-color;
        color: #fff;
      }
      &:first-child {
        border-radius: 24rpx 0 0 24rpx;
      }
      &:nth-child(3) {
        border-radius:  0 24rpx 24rpx 0;
      }
    }
  }
</style>