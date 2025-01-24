import { http } from "@/service"

export const fetchBookList = () => {
  return http({
    url: '/book/bookList'
  })
}
export const addbook = (data: any) => {
  return http({
    url: '/book/addbook',
    method:'post',
    data
  })
}

export const updateBook = (data: any) => {
  return http({
    url: '/book/updateBook',
    method:'post',
    data
  })
}

export const deleteBook = (data: any) => {
  return http({
    url: '/book/deleteBook',
    method:'dalete',
    data
  })
}

export const checkBookPermission = (id: string) => {
  return http({
    url: `/book/checkBookPermission?id=${id}`
  })
}