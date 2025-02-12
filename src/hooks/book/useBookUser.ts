import { bookUser, fetchBookItem } from "@/api/book";
import { computed, reactive, toRefs } from "vue";

export default function () {
  const state = reactive({
    bookId: '',
    bookItem: null,
    bookUserList: []
  })

  const bookMasterItem = computed(() => {
    return state.bookUserList.find(item => item.master)
  })

  const getBookInfo = async () => {
    if (!state.bookId) return
    const { data }: any = await fetchBookItem(state.bookId)
    data && (state.bookItem = data)
  }

  const getBookUserList = async () => {
    if (!state.bookId) return
    const { data }: any = await bookUser(state.bookId)
    data.length && (state.bookUserList = data.sort(item => item.master ? -1 : 1))
  }

  return {
    ...toRefs(state),
    bookMasterItem,
    getBookInfo,
    getBookUserList
  }
}