import { computed, reactive, toRefs } from "vue"
import { dateFormat } from '@/utils/date'
import { fetchBookList } from "@/api/book"
import { fetchBookStatistics } from "@/api/statistics"


export default function () {
  const DEFAULT_LIST = [{ id: '', name: '日常账本' }]
  const state = reactive({
    bookList: [],
    curBook: null,
    statisticsList: [],
    accountDate: dateFormat(new Date(), 'YYYY-MM')
  })

  const curBookItem = computed(() => {
    if (!state.bookList.length) return DEFAULT_LIST[0]
    return state.curBook || state.bookList[0]
  })

  const curBookId = computed(() => {
    return curBookItem.value.id
  })

  const apiParams = computed(() => {
    return {
      book_id: curBookId.value,
      date: state.accountDate
    }
  })

  const curDateData = computed(() => {
    const [year, month] =  state.accountDate.split('-')
    return {
      year,
      month
    }
  })

  const bookStatistics = computed(() => {
    const obj = {}
    state.statisticsList.forEach((item: any) => {
      obj[item.type_id] = item.totalAmount
    })
    return obj
  })

  const getBookList = async () => {
    const { data }: any = await fetchBookList()
    state.bookList = data
  }

  const getBookStatistics = async () => {
    if (!curBookId.value) return
    const { data }: any = await fetchBookStatistics(apiParams.value)
    state.statisticsList = data
  }



  return {
    curDateData,
    curBookItem,
    curBookId,
    apiParams,
    bookStatistics,
    ...toRefs(state),
    getBookList,
    getBookStatistics
  }
}