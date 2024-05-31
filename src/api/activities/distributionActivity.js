

import request from '@/utils/request'
import smartRequest from '@/utils/smartRequest'
/**
* 注册推广员
*
*/
export function regpromoteRegister(params) {
  return request({
    url: '/distributionRegister/promoteRegister',
    method: 'post',
    data: params
  })
}
/**
* 获取实体店
*
*/
export function getOrgList(params) {
  return request({
    url: '/distributionRegister/selectOrgByCondition',
    method: 'post',
    data: params
  })
}

//获取商品列表
export function getList(params) {
  return request({
    url: '/searchMarketSpuForDistribution',
    method: 'post',
    data: params
  })
}
//获取分销订单列表
export function getDisList(params) {
  return request({
    url: '/distributionOrder/myPage',
    method: 'post',
    data: params
  })
}
//获取商品详情
export function getQuerySpuDetail(params) {
  return request({
    url: '/distributionSpu/querySpuDetail',
    method: 'post',
    data: params
  })
}
//生成单个海报
export function getCreateShareCode(params) {
  return request({
    url: '/share/createShareCode',
    method: 'post',
    data: params
  })
}
//生成商品列表海报
export function getListShareCode(params) {
  return request({
    url: '/share/createSpuListShareCode',
    method: 'post',
    data: params
  })
}
//获取推广码
export function getShareCode(params) {
  return request({
    url: '/share/shareCode',
    method: 'post',
    data: params
  })
}

//获取推广佣金
export function queryUserCommission(params) {
  return request({
    url: '/distributionUser/queryUserCommission',
    method: 'post',
    data: params
  })
}

//获取订单详情
export function distributionOrderDetail(params) {
  return request({
    url: '/distributionOrder/detail',
    method: 'post',
    data: params
  })
}
 /**
  * 查询配置信息
  *
  * @param 
  * @return 
  */
  export function queryDistributionHomeTemplate() {
    return request({
      url: '/home/template/queryDistributionHomeTemplate',
      method: 'get',
    })
  }


  /**
 * 获取推广订单列表
 */
export function findPromoteOrders(params) {
  return smartRequest({
    url: '/api/app/finance/service/order/toPromoteOrder',
    method: 'post',
    data: params,
  })
}

  /**
 * 获取推广订单佣金
 */
  export function Userminequery(params) {
    return smartRequest({
      url: '/user/service/app/mine/userminequery',
      method: 'post',
      data: params,
    })
  }

