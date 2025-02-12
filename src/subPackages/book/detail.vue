<template>
  <div class="detail">
    <view class="detail-item">
      <text class="item-name">{{ bookItem?.name }}</text>
      <view v-if="isBookMaster" class="item-share">
        <a-icon name="share" size="22"></a-icon>
        <button class="btn-share" open-type="share"></button>
      </view>
    </view>
    <view class="detail-tip">
      <text>右边的分享按钮可以邀请好友共同记账（仅限账本主人）</text>
    </view>
    <view class="detail-label">账本成员</view>
    <view class="user-item" v-for="item in bookUserList" :key="item.id">
      <image class="user-avatar" :src="item?.user?.avatar_url" mode="scaleToFill" />
      <text class="user-name">{{ item?.user?.name }}</text>
      <text v-if="bookMasterItem.user_id === item.user_id" class="user-tag">主人</text>
      <a-icon v-if="isBookMaster && userInfo.id !== item.user_id" name="delete" color="#FF4500" @tap.stop="onDelete(item)" size="22" style="margin-left: 20rpx;"></a-icon>
    </view>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from "vue";
import { storeToRefs } from 'pinia'
import { imgBaseUrl } from "@/config/domain";
import { onLoad, onShareAppMessage, onShow } from "@dcloudio/uni-app";
import { deleteBookUser } from "@/api/book";
import { addInvite, agreeInvite, findInvite } from '@/api/invite'
import { useUserStore } from '@/store/user'
import useLogin from '@/hooks/common/useLogin'
import useBookUser from '@/hooks/book/useBookUser'

const inviteId = ref('')

const store = useUserStore()
const { handleLogin } = useLogin()
const { userInfo, isLogin }: any = storeToRefs(store)
const { bookId, bookItem, bookMasterItem, bookUserList, getBookInfo, getBookUserList } = useBookUser()

const isBookMaster = computed(() => {
  return bookMasterItem.value && bookMasterItem.value.user_id === userInfo.value.id
})
const onDelete = (item: any) => {
  uni.showModal({
    title: '提示',
    content: `确认删除账本成员【${item.user.name}】吗？`,
    success: async function (res) {
      if (res.confirm) {
        await deleteBookUser({
          user_id: item.user_id,
          book_id: bookId.value
        })
        uni.showToast({
          title: '删除成功',
          icon: 'none'
        })
        await getData()
      }
    }
  })
}

const getData = async () => {
  await getBookInfo()
  await getBookUserList()
}

const handleInvite = async () => {
  await getData()
  if (inviteId.value) {
    const { data }: any = await findInvite(inviteId.value)
    if (!data) {
      uni.switchTab({ url: '/pages/index/index' })
      return
    }
    if (data.user_id === userInfo.value.id) return
    // 如果邀请链接还未失效并且当前账号不是邀请账本主人则提示邀请对话框
    if (!data.invitee_user_id && data.user_id !== userInfo.value.id) {
      uni.showModal({
        title: '提示',
        content: `账本主人${bookMasterItem.value?.user.name}邀请您共同记账！您同意加入吗？`,
        success: async function (res) {
          if (res.confirm) {
            await agreeInvite({
              invite_id: inviteId.value,
              book_id: bookId.value
            })
            await getData()
          } else {
            uni.switchTab({ url: '/pages/index/index' })
          }
        }
      })
    } else if (data.invitee_user_id) {
      if (data.invitee_user_id !== userInfo.value.id) {
        uni.showModal({
          title: '提示',
          content: '该邀请链接已失效！请联系账本主人重新邀请！',
          success: async function (res) {
            uni.switchTab({ url: '/pages/index/index' })
          }
        })
      } else if (!bookUserList.value.find(item => item.user_id === userInfo.value.id)) { // 防止成员被踢 但还能看到账本信息
        uni.switchTab({ url: '/pages/index/index' })
      }
    }
  }
}

onShareAppMessage(async () => {
  const { data }: any = await addInvite({ book_id: bookId.value })
  return {
    title: `${userInfo.value.name}邀请你来一起记账`,
    path: `/subPackages/book/detail?book_id=${bookId.value}&invite_id=${data.id}`,
    imageUrl: `${imgBaseUrl}/img/account-top.png`
  }
})

onLoad(({ book_id, invite_id }) => {
  bookId.value = book_id
  inviteId.value = invite_id
})

onShow(async () => {
  if (!isLogin.value) {
    uni.showModal({
      title: '提示',
      content: '您还未登录，是否静态默认登录？',
      success: async function (res) {
        if (res.confirm) {
          await handleLogin(async () => {
            await handleInvite()
          })
        } else {
          uni.switchTab({ url: '/pages/index/index' })
        }
      }
    })
    return
  }
  await handleInvite()
})

</script>

<style scoped lang='scss'>
  .detail {
    display: flex;
    flex-direction: column;
    &-tip {
      padding: 20rpx;
      font-size: 24rpx;
      color: #808080;
    }
    &-label {
      padding: 20rpx;
      font-size: 28rpx;
      color: #808080;
    }
    &-item {
      display: flex;
      align-items: center;
      padding: 20rpx 20rpx 0;
      .item-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .item-share {
        position: relative;
      }
      .btn-share {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .user-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      border-bottom: 2rpx solid #f1f1f1;
      box-sizing: border-box;
      .user-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
      .user-name {
        flex: 1;
        margin-left: 10rpx;
        font-size: 24rpx;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .user-tag {
        color: $primary-color;
        font-size: 20rpx;
      }
    }
  }
</style>