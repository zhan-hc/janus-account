<template>
</template>
<script setup lang="ts">
import { onLaunch} from "@dcloudio/uni-app";
import { geScreenHeight } from '@/utils/view'
import { useCommonStore } from "./store/common";

onLaunch(() => {
  const commonStore = useCommonStore()
  // #ifdef MP-WEIXIN
  uni.hideTabBar({})
  commonStore.getScreenInfo()
  // #endif
});
</script>
<style>
@import url("./static/style/global.css");
@import url("./static/icon/iconfont.css");
</style>
style
