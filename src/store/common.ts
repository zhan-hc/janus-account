import { ref } from 'vue'
import { defineStore } from 'pinia'
import { geScreenHeight } from '@/utils/view'

export const useCommonStore = defineStore('common', () => {
  const screenInfo = ref(uni.getStorageSync('screenInfo') || {})

  const getScreenInfo = () => {
    screenInfo.value =  geScreenHeight()
    uni.setStorageSync('screenInfo', screenInfo.value)
  }
  return {
    screenInfo,
    getScreenInfo
  }
})