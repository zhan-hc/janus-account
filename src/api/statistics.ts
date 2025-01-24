import { http } from "@/service"

export const fetchBookStatistics = (data: { book_id: string, date: string }) => {
  return http({
    url: '/book/bookStatistics',
    method:'post',
    data
  })
}

export const fetchCategoryStatistics = (data: any) => {
  return http({
    url: '/book/category/statistics',
    method:'post',
    data
  })
}

export const fetchAllStatistics = () => {
  return http({
    url: '/book/all/statistics',
    method:'post'
  })
}

export const fetchMonthStatistics = (year: string) => {
  return http({
    url: '/book/month/statistics',
    method:'post',
    data: { year }
  })
}