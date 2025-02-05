/**
* 获取屏幕头部，底部，可现实内容（中间区域）高度
*/
export function geScreenHeight () {
 //系统信息
 const systemInfo = uni.getWindowInfo()
 //胶囊位置
 const capsuleInfo = uni.getMenuButtonBoundingClientRect()
 // 状态栏高度
 const statusBarHeight = systemInfo.statusBarHeight
 //导航栏高度
 const navHeight = systemInfo.statusBarHeight + capsuleInfo.height + (capsuleInfo.top - statusBarHeight) * 2
 //tabbar高度    
 const tabbarHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom
 //可实现内容高度（中间区域）
 const contentHeight = systemInfo.screenHeight-navHeight
 const safeAreaHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom
  return {
    statusBarHeight,
    navHeight,
    tabbarHeight,
    safeAreaHeight,
    contentHeight
  }
}