import { useCommonStore } from "@/store/common";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export default function () {
  const commonStore = useCommonStore()
  const { screenInfo } = storeToRefs(commonStore)

  // 总自定义导航栏高度（即状态栏 + 导航栏高度）
  const navHeight = computed(() => {
    return screenInfo.value.navHeight + 'px'
  })

  // 状态栏高度
  const statusBarHeight = computed(() => {
    return screenInfo.value.statusBarHeight + 'px'
  })

  // 导航栏高度
  const navbarHeight = computed(() => {
    return screenInfo.value.navHeight - screenInfo.value.statusBarHeight + 'px'
  })

  // 内容高度
  const contentHeight = computed(() => {
    return screenInfo.value.contentHeight + 'px'
  })


  return {
    navHeight,
    navbarHeight,
    statusBarHeight,
    screenInfo,
    contentHeight
  }
}