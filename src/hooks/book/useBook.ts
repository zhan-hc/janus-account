import { computed, reactive, toRefs } from "vue"
import { dateFormat } from '@/utils/date'
import { fetchBookList } from "@/api/book"
import { fetchBookStatistics } from "@/api/statistics"


export default function () {
  const state = reactive({
    bookList: [{ id: '', name: '日常账本' }],
    curBook: null,
    statisticsList: [],
    accountDate: dateFormat(new Date(), 'YYYY-MM')
  })

  const curBookItem = computed(() => {
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
    data.length && (state.bookList = data)
  }

  const getBookStatistics = async () => {
    if (!curBookId.value) return
    console.log(curBookId.value, 'curBookId.value')
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