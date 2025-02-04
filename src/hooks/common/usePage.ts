import { computed, toRefs } from "vue";
import { reactive } from "vue";

export default function (size = 10, no = 1) {
  const state = reactive({
    pageSize: size,
    pageNo: no,
  })

  const pageParams = computed(() => {
    return {
      pageSize: state.pageSize,
      pageNo: state.pageNo
    }
  })

  const pageReset = ()  => {
    state.pageSize = size
    state.pageNo = no
  }

  const pageNoStep = (step = 1) => {
    state.pageNo += step
  }

  return {
    ...toRefs(state),
    pageParams,
    pageReset,
    pageNoStep
  }
}