import router from './router'
import Cookies from "js-cookie";
import store from '@/store/store.js'
import {
  isLogin
} from '@/api/home'
import {
  getToken
} from '@/utils/token' // get token from cookie

import { SYSPLATFORM, USER_SOURCE } from './constants/userinfo'
import { getPlatform, showOrHideStatusBar } from './utils/hybrid'
import { getUsersource } from '@/utils/utils'


// 是否已经查询是否登录
let hasQueryLogin = false

// 不需要拦截的路径
const whiteList = ['/login', '404']

// 路由拦截器
router.beforeEach(async (to, from, next) => {
  // 显示app头部
  if (![USER_SOURCE.smartLife, USER_SOURCE.wsmall].includes(getUsersource())) {
    showOrHideStatusBar(true)
  }

  // 页面进来时重置接口401状态
  store.dispatch('RES_INTERCEPTOR/altApiNoAuthStatus', false)

  // todo 如果需要维护打开这个就好了,会检测路由自动跳转 升级中敬请期待 页面
  // if (to.query.platform <= 2 && !to.path.includes('/construction')) {
  //   next({
  //     path: '/construction'
  //   })
  //   return
  // }

  // 如果没有查询是否登录 则查询是否登录
  // if (!hasQueryLogin) {
  //   await isLogin().then(res => {
  //     window.isLogin = res
  //     hasQueryLogin = true
  //   })
  // }

  // 路由的页面是否需要登录 如果不需要登录则直接放童 需要则判断当前是否登录
  if (to.meta.auth) {
    // 判断是不是从app跳转，app进入就直接进入页面，通过接口401走免密登录
    let platform = getPlatform()
    if (platform == SYSPLATFORM.android || platform == SYSPLATFORM.ios) {
      if (to.meta.title) {
        // 设置标签名称
        document.title = to.meta.title
      }
      next();
      return
    }
    // console.log('需要登录', getToken());
    // debugger;
    //  根据token判断用户是否登录
    if (getToken()) {
      if (to.meta.title) {
        // 设置标签名称
        document.title = to.meta.title
      }
      next()
    } else { // 没有登录
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        if (to.meta.title) {
          // 设置标签名称
          document.title = to.meta.title
        }
        next();
      } else {
        // 如果是从乘客端进入的不执行相关跳转操作
        if(Cookies.get("_wsf_role") == 1) {
          // store.commit('SET_REGISTRATIONPROTOCOL', true)
          next()
          return
        }
        if (to.meta.title) {
          // 设置标签名称
          document.title = to.meta.title
        }
        // 跳转到登录页面
        next({
          path: '/login',
          query: {
            url: to.fullPath
          }
        })
      }
    }

    // 判断用户是否登录
    // if (window.isLogin) {
    //   next()
    // } else {
    //   // 跳转到登录页面
    //   next({path: '/login', query: {url: to.fullPath}})
    // }
  } else {
    if (to.meta.title) {
      // 设置标签名称
      document.title = to.meta.title
    }
    next()
  }
})
