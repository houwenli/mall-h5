import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes'
import { routerPush } from './routerIntercept'

// 拦截push方法
routerPush(Router)

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes
})
