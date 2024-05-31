import request from '@/utils/request'
import smartRequest from '@/utils/smartRequest'
/**
 * 根据手机号获取归属地
 * @param params 手机号参数
 */
export function getMobileArea(params) {
  return smartRequest({
    url: '/api/app/applet/service/customer/getMobileArea',
    method: 'post',
    data: params,
  })
}

/**
 * 查询电话费配置
 * @param params 城市编码，充值方式
 */
export function queryPhoneFeeConfig(params) {
  return smartRequest({
    url: '/api/app/applet/service/rechargeOrder/phoneFee/queryPhoneFeeConfig',
    method: 'post',
    data: params,
  })
}

/**
 * 创建充值话费订单
 * @param params 话费配置ID参数
 */
export function createOrder(params) {
  return smartRequest({
    url: '/api/app/applet/service/rechargeOrder/phoneFee/createOrder',
    method: 'post',
    data: params,
  })
}

/**
 * 查询订单状态
 * @param params 订单号
 */
export function queryOrderStatus(params) {
  return smartRequest({
    url: '/api/app/applet/service/rechargeOrder/phoneFee/queryOrderStatus',
    method: 'post',
    data: params,
  })
}

/**
 * 查询充值订单记录
 * @param params
 */
export function queryRechargeOrderList(params) {
  return smartRequest({
    url: '/api/app/applet/service/rechargeOrder/phoneFee/queryRechargeOrderList',
    method: 'post',
    data: params,
  })
}

/**
 * 查询充值订单详情
 * @param params 充值订单号
 */
export function queryRechargeOrderDetail(params) {
  return smartRequest({
    url: '/api/app/applet/service/rechargeOrder/phoneFee/queryRechargeOrderDetail',
    method: 'post',
    data: params,
  })
}

/**
 * 删除充值订单
 * @param params 充值订单号
 */
export function deleteRechargeOrder(params) {
  return smartRequest({
    url: '/api/app/applet/service/rechargeOrder/phoneFee/deleteRechargeOrder',
    method: 'post',
    data: params,
  })
}

/**
 * 查询服务说明
 * @param params
 */
export function queryRechargeDescription(params) {
  return smartRequest({
    url: '/api/app/applet/service/rechargeOrder/phoneFee/queryRechargeDescription',
    method: 'post',
    data: params,
  })
}

/**
 * 查常用联系人（如果没有,添加本人注册手机号）
 * @param params
 */
export function selectCustomerCommonPhoneListAndAdd(params) {
  return request({
    url: '/rechargeOrder/commonPhone/selectCustomerCommonPhoneListAndAdd',
    method: 'post',
    data: params,
  })
}

/**
 * 常用联系人详情
 * @param params
 */
export function selectCustomerCommonPhoneById(params) {
  return request({
    url: '/rechargeOrder/commonPhone/selectCustomerCommonPhoneById',
    method: 'post',
    data: params,
  })
}
/**
 * 添加常用联系人
 * @param params
 */
export function addCustomerCommonPhone(params) {
  return request({
    url: '/rechargeOrder/commonPhone/addCustomerCommonPhone',
    method: 'post',
    data: params,
  })
}
/**
 * 修改常用联系人
 * @param params
 */
export function updateCustomerCommonPhone(params) {
  return request({
    url: '/rechargeOrder/commonPhone/updateCustomerCommonPhone',
    method: 'post',
    data: params,
  })
}
/**
 * 删除常用联系人
 * @param params
 */
export function deleteCustomerCommonPhone(params) {
  return request({
    url: '/rechargeOrder/commonPhone/deleteCustomerCommonPhone',
    method: 'post',
    data: params,
  })
}