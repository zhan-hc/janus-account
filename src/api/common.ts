import { http } from "@/service"

export const fetchDictList = (id: string) => {
  return http({
    url: `/dict/dictList?id=${id}`
  })
}