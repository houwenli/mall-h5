import request from '@/utils/request'

/**
 * 用户参与游戏记录 一共调用3次 
 * 1.进入游戏首页调用一次claimNum：0
 * 2.点击开始游戏的时候调用 claimNum: 0,id:取2中返回的data作为id,
 * 3.确认领券的时候调用 claimNum: 取领取优惠券的sendNumber,id跟2一样
 */
export function addRecord(params) {
  return request({
    url: '/bargainGame/addRecord',
    method: 'POST',
    data: params,
  })
}
/**
 * 首次进入新建用户参与游戏记录在游戏首页调用一次
 */
export function gameRecord(params) {
  return request({
    url: '/bargainGame/user',
    method: 'POST',
    params: params,
  })
}
/**
 * 查询游戏题目
 */
export function getQuestionsList(params) {
  return request({
    url: '/bargainGame/randomQuestion',
    method: 'get',
    params: params,
  })
}
/**
 * 查询优惠券，返回的id威null表示活动失效
 */
export function getCouponList(params) {
  return request({
    url: '/bargainGame/getCouponList',
    method: 'POST',
    params: params,
  })
}
/**
 * 领取优惠券
 */
export function receiveCoupons(params) {
  return request({
    url: '/addCouponDistribute',
    method: 'POST',
    data: params,
  })
}
/**
 * 查询我的优惠券
 */
export function getMyCouponList(params) {
  return request({
    url: '/bargainGame/myCouponList',
    method: 'POST',
    params: params,
  })
}
/**
 * 查询排行榜
 */
export function rankedList(params) {
  return request({
    url: '/bargainGame/rankedList',
    method: 'get',
    params: params,
  })
}
/**
 * 点赞
 */
export function giveALike(params) {
  return request({
    url: '/bargainGame/giveALike',
    method: 'POST',
    params: params,
  })
}
/**
 * 取消点赞
 */
export function cancelLike(params) {
  return request({
    url: '/bargainGame/cancelLike',
    method: 'POST',
    params: params,
  })
}
