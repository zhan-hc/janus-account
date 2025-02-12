<template>
  <view class="mine">
    <view class="mine-fixed">
      <nav-bar :backShow="false" background="transparent" color="#fff" title="笨鸟记账"></nav-bar>
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
import { useUserStore } from '@/store/user'
import useLogin from '@/hooks/common/useLogin'

const store = useUserStore()
const { userInfo, isLogin }: any = storeToRefs(store)
const { handleLogin } = useLogin()

const toBook = () => {
  uni.navigateTo({ url: '/subPackages/book/list' })
}

const toUser = () => {
  uni.navigateTo({ url: '/subPackages/user/index' })
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