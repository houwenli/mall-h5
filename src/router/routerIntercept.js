import { routes } from './routes'
import { judgeOpenAppLogin } from '@/utils/hybrid'
import { getUsersource } from '@/utils/utils'
import { USER_SOURCE } from '@/constants/userinfo'

// router拦截，改写一些方法
export const routerPush = (VueRouter) => {
  let originPush = VueRouter.prototype.push

  VueRouter.prototype.push = function (location, onComplete, onAbort) {
    let url = ''
    // 做一下兼容，有可能传递过来的是字符串
    if (typeof location == 'string') {
      // 获取不带参数url
      url = location.split('?')[0] || ''
    } else {
      url = (location.path || '').split('?')[0] || ''
    }

    let pushRoute = routes.find(item => {
      return item.path == url
    })

    let meta = pushRoute && pushRoute.meta
    let usersource = getUsersource()
    // 判断是否需要登陆
    if (meta && meta.auth) {
      // 判断是否需要跳转app的原生页面
      if (judgeOpenAppLogin()) {
        return
      }
    }
    // 智慧生活app中，跳转登录页面也需要做拦截
    else if(usersource == USER_SOURCE.smartLife && url == '/login') {
      if (judgeOpenAppLogin()) {
        return
      }
    }

    if (onComplete && onAbort) {
      originPush.call(
        this,
        location,
        onComplete,
        onAbort
      )
    } else {
      originPush.call(
        this,
        location,
        () => {},
        () => {},
      )
    }
  
  }
}