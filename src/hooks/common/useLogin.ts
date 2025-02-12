import { storeToRefs } from 'pinia'
import { fetchCodeLogin } from '@/api/login'
import { useUserStore } from '@/store/user'
import { updateUser } from '@/api/user'
export default function () {
  const store = useUserStore()
  const { isLogin }: any = storeToRefs(store)

  const handleLogin = (cb = () => {}) => {
    if (isLogin.value) return
    uni.showLoading({
      title: '登录中' 
    })
    // #ifdef MP-WEIXIN
    uni.login({
      success: async ({ code }) => {
        const { data: { token, refreshToken, userInfo: userData } }: any = await fetchCodeLogin(code)
        store.setLoginInfo(token, refreshToken)
        store.setUserInfo(userData)
        cb()
      },
      fail: (err) => {
        console.log(err, 'err')
      },
      complete: () => {
        uni.hideLoading()
      }
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
  return {
    handleLogin,
    updateUserInfo
  }
}