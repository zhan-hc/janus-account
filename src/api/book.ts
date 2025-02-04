import { http } from "@/service"

export const fetchBookList = () => {
  return http({
    url: '/book/bookList'
  })
}
export const addBook = (data: any) => {
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

export const updateBookSort = (data: any) => {
  return http({
    url: '/book/updateBookSort',
    method:'post',
    data
  })
}

export const deleteBook = (data: any) => {
  return http({
    url: '/book/deleteBook',
    method:'DELETE',
    data
  })
}

export const checkBookPermission = (id: string) => {
  return http({
    url: `/book/checkBookPermission?id=${id}`
  })
}