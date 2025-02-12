import { http } from "@/service"

export const addInvite = (data: any) => {
  return http({
    url:'/invite/add',
    method:'post',
    data
  })
}

export const findInvite = (inviteId: string) => {
  return http({
    url:'/invite/find',
    method:'post',
    data: {
      invite_id: inviteId
    }
  })
}

export const agreeInvite = (data: any) => {
  return http({
    url:'/invite/agree',
    method:'post',
    data
  })
}