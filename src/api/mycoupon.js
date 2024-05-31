import request from '@/utils/request'

/**
 * 查询优惠券
 */
export function queryCoupons(params) {
  return request({
    url: 'mycoupon',
    method: 'get',
    params: params,
  })
}

/**
 * 查询【已领取未使用】的优惠券列表（无分页）
 */
export function queryUserCoupons() {
  return request({
    url: '/coupon/user/queryUserCoupons',
    method: 'get',
  })
}

/**
 * 查询【已过期/已使用】的优惠券列表（分页）
 */
export function pageUserCoupons(params) {
  return request({
    url: '/coupon/user/pageUserCoupons',
    method: 'get',
    params: params,
  })
}

/**
 * 条件分页查询个人中心平台优惠券
 */
export function pagePlatformCoupon(params) {
  return request({
    url: '/platformCouponCode/selectPage',
    method: 'get',
    params: params,
  })
}

/**
 * 查询用户活动
 */
export function getUserActivity(params) {
  return request({
    url: '/userActivity/getUserActivity',
    method: 'post',
    data: params,
  })
}

/**
 * 领取优惠券
 */
export function receiveCoupon(id) {
  return request({
    url: `/platformCouponCode/receive/${id}`,
    method: 'get',
  })
}

/**
 * 根据券码id查询券详情
 */
export function getCouponDetail(id) {
  return request({
    url: `/platformCouponCode/getDetail/${id}`,
    method: 'get',
  })
}
/**
 * 查询用户活动自动发放到券包的优惠券
 */
export function getDeliered(type) {
  return request({
    url: `/platformCouponCode/getDeliered/${type}`,
    method: 'get',
  })
}

// // 查询商品列表是否还有优惠劵
// export function getSpuDiscountList(params){
//   return request({
//     url: '/spuDiscount/List',
//     method: 'post',
//     data: params,
//   })
// }
 // 2023/06/12-万顺福商城重构二期(下单)项目-后端刘欢让废弃删除此接口
export function getSpuDiscountList(params){
  return {}
}

// 查询优惠券列表
export function queryUserCouponList(params){
  return request({
    url: '/queryUserCouponList',
    method: 'post',
    data: params,
  })
}

// 优惠券-列表查询(按spu)
export function getUserSpuCoupons(params){
  return request({
    url: '/spuDiscount/userCoupons',
    method: 'post',
    data: params,
  })
}