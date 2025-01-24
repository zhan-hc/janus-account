import type { FAIL_MSG } from "@/constant/type/request";
import { apiDomain } from "@/config/domain";
import { fetchRefreshToken } from "@/api/login";
import { setCacheToken } from "@/utils/req";

const timeout = 10000; // 请求超时时间
let loadingCount = 0; // 控制 loading 多请求的计数

// 请求拦截
const httpInterceptor = {
    invoke(options: any) {
      const token = uni.getStorageSync('Authorization') || ''
      options.timeout = timeout
      const { url, loadingStatus, loadingText } = options
      if (loadingStatus !== false && loadingCount === 0) {
        uni.showLoading({ title: loadingText || '加载中', mask: true });
      }
      if (url.indexOf('http') !== 0) {
        options.url = apiDomain + url
      }
      
      if (token) {
        options.header = {
          ...options.header,
          Authorization: token
        }
      }
      
    },
    fail(err: FAIL_MSG) {
      uni.showToast({
        title: err.errMsg || '服务异常，请稍后重试',
        icon: "none",
      });
    },
    complete() {
      if (loadingCount <= 0) {
        uni.hideLoading();
      }
    }
};

uni.addInterceptor("request", httpInterceptor);


export const http = (data: string | any) => {
  return new Promise((resolve, reject) => {
    let options: any = {}
    if (typeof data === 'string') {
      options.url = data
    } else {
      options = data
    }
    uni.request({
      ...options,
      success: async (res: any) => {
        // 无感刷新换token
        if (res.data.code === 401) {
          uni.setStorageSync('Authorization', uni.getStorageSync('refreshToken'))
          const { data: { token, refreshToken } }: any = await fetchRefreshToken()
          setCacheToken(token, refreshToken)
          const newRes: any = await http(options)
          resolve(newRes)
        }
        resolve(res.data)
      },
      fail: (err: FAIL_MSG) => {
        reject(err)
      }
    })
  })
}

