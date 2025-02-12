import { http } from "@/service"

export const keepAccount = (data: any) => {
  return http({
    url: '/book/keepAccount',
    method:'post',
    data
  })
}

export const upateAccount = (data: any) => {
  return http({
    url: '/book/upateAccount',
    method:'post',
    data
  })
}
export const deleteAccount = (data: any) => {
  return http({
    url: '/book/deleteAccount',
    method:'delete',
    data
  })
}

export const fetchAccountList = (data: any) => {
  return http({
    url: '/book/v2/accountList',
    method:'post',
    data
  })
}