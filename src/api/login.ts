import { http } from "@/service"

export const fetchCodeLogin = (code: string) => {
  return http({
    url:'/login/code',
    method:'post',
    data: { code }
  })
}

export const fetchRefreshToken = () => {
  return http({
    url:'/login/refreshToken',
    method:'post'
  })
}