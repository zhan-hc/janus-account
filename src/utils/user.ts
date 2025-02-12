import { useUserStore } from "@/store/user"

// 重置登录态
export const resetLoginStatus = () => {
  const userStore = useUserStore()
  userStore.initUserInfo()
  uni.clearStorageSync()
  uni.switchTab({
    url: '/pages/mine/index',
    success: () => {
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })
    }
  })
}