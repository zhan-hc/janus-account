export const setCacheToken = (token: string, refreshToken: string) => {
  uni.setStorageSync('Authorization', token)
  uni.setStorageSync('refreshToken', refreshToken)
}