<template>
</template>
<script setup lang="ts">
import { onLaunch} from "@dcloudio/uni-app"
import { useCommonStore } from "./store/common"

const updateApp = () => {
  const updateManager = uni.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate, 'onCheckForUpdate')
  });

  updateManager.onUpdateReady(function (res) {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    });

  });
  updateManager.onUpdateFailed(function(res) {
    // 新的版本下载失败
    console.log('download error')
    uni.showModal({
      title: '提示',
      content: '新版小程序下载失败\n请自行退出程序，手动卸载本程序，再运行',
      confirmText: "知道了"
    })
  })
}

onLaunch(() => {
  const commonStore = useCommonStore()
  // #ifdef MP-WEIXIN
  uni.hideTabBar({})
  commonStore.getScreenInfo()
  updateApp()
  // #endif
});
</script>
<style>
@import url("./static/style/global.css");
@import url("./static/icon/iconfont.css");
</style>
style
