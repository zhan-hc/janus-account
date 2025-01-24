<template>
  <view class="mine">
    <view class="mine-fixed">
      <nav-bar background="transparent" color="#fff" title="笨鸟记账"></nav-bar>
      <view class="mine-user" @tap="handleLogin">
        <button v-if="userInfo.avatar_url" class="user-avatar" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
          <image class="avatar-img" :src="userInfo.avatar_url" mode="scaleToFill" />
        </button>
        <a-icon v-else class="user-avatar default" name="default-avatar" size="24" color="#fff"></a-icon>
        <view class="user-info">
          <text v-if="isLogin" class="user-name">{{ userInfo.name }}</text>
          <text v-else-if="!isLogin">未登录</text>
          <text v-if="!isLogin" class="user-desc">点击头像登录</text>
        </view>
      </view>
    </view>
    <option-item v-if="isLogin" label="修改昵称" @attack="nameShow = true"></option-item>
    <option-item label="分享给好友">
      <template #content>
        <button class="item-content" open-type="share"></button>
      </template>
    </option-item>
    <input-pop v-model="nickName" v-model:show="nameShow" inputType="nickname" title="修改名称" placeholder="请输入名称..." @confirm="updateName" @open="popOpen"/>
    <tab-bar :activeIndex="3"></tab-bar>
  </view>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { fetchCodeLogin } from '@/api/login'
import { updateUser } from '@/api/user'
import { useUserStore } from '@/store/user'
import InputPop from '@/modules/popup/input-pop.vue'

const store = useUserStore()
const { userInfo, isLogin }: any = storeToRefs(store)
const nickName = ref('')
const nameShow = ref(false)

const popOpen = () => {
  nickName.value = userInfo.value.name
}
const updateName = async () => {
  await updateUserInfo({
    name: nickName.value
  })
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
          store.setLoginInfo(token, refreshToken)
          store.setUserInfo({
            ...userData,
            name: userData.name || userInfo.nickName,
            avatar_url: userData.avatar_url || userInfo.avatarUrl
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
  const { data }:any = await updateUser(params)
  store.setUserInfo(data)
}

const chooseAvatar = async (e:any) => {
  const imgurl = e.detail.avatarUrl
  await updateUserInfo({
    avatar_url: imgurl
  })
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
        &.default {
          padding: 20rpx;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
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