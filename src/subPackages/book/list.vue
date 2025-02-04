<template>
  <view class="book">
    <view class="book-tip">
      <view class="tip-text">
        <text>通过编辑可以对账本进行拖拽，来更改账本的展示顺序</text>
        <text>首页默认展示第一个账本的记账数据</text>
        </view>
      <text class="tip-btn" @tap="changeSort">{{ tipText }}</text>
    </view>
    <m-drag :item-height="50" :list="bookList" :dragStatus="dragStatus">
      <template #default="{ item }">
        <view class="book-item">
          <view class="book-icon">
            <a-icon name="account" size="14 " color="#fff"></a-icon>
          </view>
          <text class="item-text">{{item.name}}</text>
          <a-icon v-if="item.master" name="edit" color="#222226" size="22" @tap="onEdit(item)"></a-icon>
          <a-icon v-if="item.master" name="delete" color="#FF4500" @tap="onDelete(item)" size="22" style="margin-left: 20rpx;"></a-icon>
        </view>
      </template>
    </m-drag>
    <view class="book-add" @tap="handleAdd">
      <a-icon name="plus" color="#fff" size="20"></a-icon>
    </view>
    <input-pop v-model="bookName" v-model:show="bookShow" title="添加账本" placeholder="请输入账本名称..." @confirm="handleOerateBook"/>
  </view>
  </template>

<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue'
import { addBook, deleteBook, updateBook, updateBookSort } from '@/api/book'
import useBook from '@/hooks/book/useBook'
import InputPop from '@/modules/popup/input-pop.vue'

const bookName = ref('')
const bookShow = ref(false)
const popType = ref('add')
const dragStatus = ref(false)
const { curBook, curBookItem, curBookId, bookList, getBookList } = useBook()

const tipText = computed(() => {
  return dragStatus.value ? '完成' : '编辑'
})

const handleAdd = () => {
  bookName.value = ''
  bookShow.value = true
  popType.value = 'add'
}

const changeSort = async () => {
  if (dragStatus.value) {
    const len = bookList.value.length
    const apiList = bookList.value.map((item, i) => {
      return {
        id: item.id,
        sort: len - i
      }
    })
    await updateBookSort({ bookList: JSON.stringify(apiList) })
  }
  dragStatus.value = !dragStatus.value
  await getBookList()
}

const onEdit = (item: any) => {
  if (!item.master) return
  popType.value = 'edit'
  curBook.value = item
  bookName.value = item.name
  bookShow.value = true
}
const onDelete = (item: any) => {
  uni.showModal({
    title: '提示',
    content: `确认删除账本【${item.name}】及其对应的记账数据吗？`,
    success: async function (res) {
      if (res.confirm) {
        await deleteBook({
          id: item.id
        })
        await getBookList()
      }
    }
  })
}


const handleOerateBook = async () => {
  const apiList = [addBook, updateBook]
  const index = popType.value === 'add' ? 0 : 1
  const params: { name: string, id?:string } = {
    name: bookName.value
   }
   if (index) {
    params.id = curBook.value.id
   }
   const { code }: any = await apiList[index](params)
   if (code === 200) {
    uni.showToast({
      title: '添加账本成功',
      icon: 'success'
    })
   }
   bookName.value = ''
   curBook.value = null
   await getBookList()

}


onMounted(async () => {
  await getBookList()
})
</script>

<style scoped lang='scss'>
.book {
  padding-bottom: constant(safe-area-inset-bottom + 40rpx);
  padding-bottom: env(safe-area-inset-bottom + 40rpx);
  &-add {
    position: fixed;
    bottom: 20vh;
    right: 60rpx;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    background: $primmary-linear-color;
    border-radius: 50%;
    box-sizing: border-box;
  }
  &-tip {
    display: flex;
    align-items: center;
    padding: 20rpx 32rpx;
    font-size: 24rpx;
    color: #ccc;
    .tip-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .tip-btn {
      font-size: 28rpx;
      color: $primary-color;
      margin-left: 20rpx;
    }
  }
  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    height: 96rpx;
    padding: 0 32rpx;
    font-size: 32rpx;
    border-bottom: 2rpx solid #f5f5f5;
    box-sizing: border-box;
    .item-text {
      margin-left: 12rpx;
      flex: 1;
      flex-shrink: 0;
      width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: $primary-color;
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
  }
}
  
</style>