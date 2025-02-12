import { setCacheToken } from '@/utils/req'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(Boolean(uni.getStorageSync('Authorization')) || false)
  const userInfo = ref(uni.getStorageSync('userInfo') || {})
  const token = ref(uni.getStorageSync('Authorization') || '')

  const setLoginStatus = (status: boolean) => {
    isLogin.value = status
  }
  const setUserInfo = (info: any) => {
    userInfo.value = info
    uni.setStorageSync('userInfo', info)
    if (info.id) {
      setLoginStatus(true)
    }
  }

  const initUserInfo = () => {
    userInfo.value = {}
    isLogin.value = false
    token.value = ''
  }
  const setLoginInfo = (authToken: string, refreshToken: string) => {
    token.value = authToken
    setCacheToken(authToken, refreshToken)
  }
  return {
    token,
    isLogin,
    userInfo,
    setUserInfo,
    setLoginInfo,
    initUserInfo,
    setLoginStatus
  }
})