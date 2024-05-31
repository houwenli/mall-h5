import axios from 'axios'
import Vue from 'vue'
import Cookies from 'js-cookie'
import { getToken, setToken, removeToken } from '@/utils/token'
import { isWx } from '@/utils/utils'
import { checkFreeSignIn, judgeOpenAppLogin } from '@/utils/hybrid'
import { app } from '@/main'
import { debounce } from '@/utils/utils'
import wx from 'weixin-js-sdk'
import store from '@/store/store'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
})
const getChannel = () => {
  return Cookies.get('_wsf_channel_code')
}
const appVersion = require('../../package.json').version
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否有token 有token就在头里面设置token
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['X-Token'] = 'Bearer ' + getToken()
    }
    let isWxBrowser  = isWx()
    if(isWxBrowser) {
      config.headers['CHANNEL-SOURCE'] = 4
    } else {
      config.headers['CHANNEL-SOURCE'] = getChannel() || 2
    }
    if (!getChannel()) {
      if(isWxBrowser) {
        Cookies.set('_wsf_channel_code', 4)
        Cookies.set('_wsf_channel_name','万顺福公众号')
      }else{
        Cookies.set('_wsf_channel_code', 2)
        Cookies.set('_wsf_channel_name','万顺福h5')
      }
    }
    config.headers['Content-Type'] = 'application/json'

    if (appVersion) {
      config.headers['X-Version'] = appVersion
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
  // config => {
  //   config.headers['Content-Type'] = 'application/json';
  //   config.headers['cache-control'] = 'no-chache';
  //   return config
  // },
)

let loginAgain = debounce(async (params) => {
  await checkFreeSignIn(false)
  app.$children[0].reload()
}, 500, false)

// 响应拦截器
service.interceptors.response.use(
  (response = {}) => {
    // 判断请求头是否有newtoken,有则替换登录接口返回的token
    response.headers.newtoken ? setToken(response.headers.newtoken) : null
    // response.headers.newtoken ? setToken(response.data.data) : null;
    return response.data
  },
  async (error) => {
    let status = 0
    try {
      status = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        return Promise.reject(error)
      }
      if (error.toString().indexOf('Error: Network Error') !== -1) {
        return Promise.reject(error)
      }
    }
    console.log('status', status)
    // 未登录
    if (status == 401) {
      if (store.getters.isApiNoAuth) {
        return
      }

      store.dispatch('RES_INTERCEPTOR/altApiNoAuthStatus', true);

      console.log(error)
      // 跳转到登陆页面
      removeToken()

      // 判断是否需要跳转app的原生页面
      if (judgeOpenAppLogin()) {
        return
      }
      
      // return
      // console.log('需要返回的url', location.pathname + location.search)
    //   if (Cookies.get('_wsf_role') == 1) {
      if(store.state.userSource != 3) {
        // store.commit('SET_REGISTRATIONPROTOCOL', true)
        loginAgain()
        return
      } 
      if (window.__wxjs_environment === 'miniprogram') {
        wx.miniProgram.redirectTo({url:`/pages/quickLogin/quickLogin?webViewBackUrl=${window.location.href}`})
        return
      }
      window.location = '/login?url=' + location.pathname + location.search
    } else if (status == 888) {
      // 微信未授权
      localStorage.setItem("LOG888",true)
      if (window.__wxjs_environment === 'miniprogram') {
        wx.miniProgram.redirectTo({url:`/pages/quickLogin/quickLogin?webViewBackUrl=${window.location.href}`})
        return
      }
      window.location = error.response.data.replace('state=', 'state=' + encodeURIComponent(window.location.href))
    } else {
      if (error.response.data && error.response.data.description) {
        Vue.$vux.toast.text(error.response.data.description, 'middle')
      } /* else {
        Vue.$vux.toast.text('网络错误', 'middle')
      } */
    }
    return Promise.reject(error.response)
  }
)

export default service
