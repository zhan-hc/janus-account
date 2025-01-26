<template>
  <view class="user">
    <view class="user-info">
      <view class="user-avatar">
        <image class="avatar-img" :src="userInfo.avatar_url" mode="aspectFit" />
      </view>
      <text class="user-name">{{ userInfo.name }}</text>
    </view>
    <option-item class="user-option" label="修改头像" @attack="avatarShow = true"></option-item>
    <option-item class="user-option" label="修改昵称" @attack="nameShow = true"></option-item>
    <list-pop v-slot="{ item, itemClick, isActive }" v-model="avatarUrl" v-model:show="avatarShow" :itemStyle="{display: 'inline-block'}" :list="avatarList" title="修改头像" @confirm="avatarConfirm">
      <view class="avatar-item" @tap="itemClick(item)" :class="{'active' : isActive }">
        <image class="avatar-img" :src="item.id" mode="scaleToFill" />
      </view>
    </list-pop>
    <input-pop v-model="nickName" v-model:show="nameShow" inputType="nickname" title="修改名称" placeholder="请输入名称..." @confirm="updateName" @open="popOpen"/>
  </view>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { imgUrl } from '@/config/domain'
import { updateUser } from '@/api/user'
import { useUserStore } from '@/store/user'
import listPop from '@/modules/popup/list-pop.vue'
import InputPop from '@/modules/popup/input-pop.vue'

const store = useUserStore()
const { userInfo }: any = storeToRefs(store)
const nickName = ref('')
const nameShow = ref(false)
const avatarShow = ref(false)
const avatarUrl = ref(userInfo.value.avatar_url)
const avatarList = new Array(5).fill(0).map((item, i) => {
  return {
    id: `${imgUrl}/blog/avatar/avatar${i + 1}.png`,
    name: `头像${i + 1}`,
  }
})
const popOpen = () => {
  nickName.value = userInfo.value.name
}

const updateName = async () => {
  await updateUserInfo({
    name: nickName.value
  })
}

const avatarConfirm = (item: any) => {
  avatarUrl.value = item.id
  updateUserInfo({
    avatar_url: avatarUrl.value
  })
}

const updateUserInfo = async (params: any) => {
  const { data, code }:any = await updateUser(params)
  if (code === 200) {
    uni.showToast({
      title: '更改信息成功',
      icon: 'success'
    })
   }
  store.setUserInfo(data)
}
</script>

<style scoped lang='scss'>
.user {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
  &-option {
    border-top: 2rpx solid #f1f1f1;
  }
  &-avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
    box-sizing: border-box;
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transform: scale(1.3);
    }
  }
  &-info {
    display: flex;
    align-items: center;
    padding: 40rpx;
  }
  &-name {
    position: relative;
    margin-left: 28rpx;
    font-size: 28rpx;
    .name-input {
      display: none;

    }
  }
  .avatar-item {
    width: 96rpx;
    height: 96rpx;
    margin-left: 32rpx;
    border-radius: 50%;
    border: 8rpx solid #fff;
    box-sizing: border-box;
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transform: scale(1.3);
    }
    &.active {
      border: 8rpx solid $primary-color;
    }
  }
}
</style>