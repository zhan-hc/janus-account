<template>
  <view class="mine">
    <view class="mine-fixed">
      <nav-bar background="transparent" color="#fff" title="笨鸟记账"></nav-bar>
      <view class="mine-user" @tap="handleLogin">
        <view v-if="userInfo.avatar_url" class="user-avatar">
          <image class="avatar-img" :src="userInfo.avatar_url" mode="aspectFit" />
        </view>
        <a-icon v-else class="user-avatar default" name="default-avatar" size="24" color="#fff"></a-icon>
        <view class="user-info">
          <text v-if="isLogin" class="user-name">{{ userInfo.name }}</text>
          <text v-else-if="!isLogin">未登录</text>
          <text v-if="!isLogin" class="user-desc">点击头像登录</text>
        </view>
      </view>
    </view>
    <option-item v-if="isLogin" label="用户管理" @attack="toUser"></option-item>
    <option-item v-if="isLogin" label="账本管理" @attack="toBook"></option-item>
    <option-item label="分享给好友">
      <template #content>
        <button class="item-content" open-type="share"></button>
      </template>
    </option-item>
    <option-item label="意见反馈">
      <template #content>
        <button class="item-content" open-type="feedback"></button>
      </template>
    </option-item>
    <tab-bar :activeIndex="3"></tab-bar>
  </view>
</template>

<script lang='ts' setup>
import { storeToRefs } from 'pinia'
import { fetchCodeLogin } from '@/api/login'
import { useUserStore } from '@/store/user'
import { updateUser } from '@/api/user'
import { getDefaultAvatar, getDefaultUserName } from '@/utils/user'

const store = useUserStore()
const { userInfo, isLogin }: any = storeToRefs(store)
const toBook = () => {
  uni.navigateTo({ url: '/subPackages/book/list' })
}

const toUser = () => {
  uni.navigateTo({ url: '/subPackages/user/index' })
}

const handleLogin = () => {
  if (isLogin.value) return
  uni.showLoading({
    title: '登录中' 
  })
  uni.getUserProfile({
    desc: '用于完善用户资料',
    lang: 'zh_CN',
    success: ({ userInfo }) => {
      // #ifdef MP-WEIXIN
      uni.login({
        success: async ({ code }) => {
          const { data: { token, refreshToken, userInfo: userData } }: any = await fetchCodeLogin(code)
          const [name, avatar_url] = [getDefaultUserName(), getDefaultAvatar(userInfo.gender)]
          store.setLoginInfo(token, refreshToken)
          store.setUserInfo({
            ...userData,
            name: userData.name || name,
            avatar_url: userData.avatar_url || avatar_url
          })
          if (!userData.name || !userData.avatar_url)
          await updateUserInfo({
            name: userData.name || name,
            avatar_url: userData.avatar_url || avatar_url
          })
        },
        fail: (err) => {
          console.log(err, 'err')
        },
        complete: () => {
          uni.hideLoading()
        }
      })
      // #endif
    },
    fail: (err) => {
      uni.hideLoading()
      console.log(err, 'err')
    },
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
  .mine {
    min-height: 100vh;
    background: #fff;
    &-fixed {
      background: linear-gradient(180deg, rgba(232, 56, 13, 1) 0%, rgba(243, 147, 79, 1) 99.48%), #fff;
      background-repeat: no-repeat;
    }
    &-user {
      display: flex;
      align-items: center;
      padding: 40rpx;
      height: 160rpx;
      box-sizing: border-box;
      .user-avatar {
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
        &.default {
          padding: 20rpx;
        }
      }
      .user-info {
        display: flex;
        flex-direction: column;
        margin-left: 28rpx;
        color: #fff;
      }
      .user-name {
        position: relative;
        font-size: 28rpx;
        color: #fff;
        .name-input {
          display: none;

        }
      }
      .user-desc {
        margin-top: 8rpx;
        font-size: 24rpx;
        color: #EBEBEB;
      }
    }
    .item-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>