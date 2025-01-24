import { http } from "@/service"

export const updateUser = (data: any) => {
  return http({
    url:'/user/updateUser',
    method:'post',
    data
  })
}