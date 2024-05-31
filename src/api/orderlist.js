/**
 * 订单列表路由
 *
 * @author Caizize created on 2019/12/9
 */

import request from '@/utils/request'
import smartRequest from '@/utils/smartRequest'

/**
 * 分页查询用户订单列表
 *
 * @param query 查询条件
 * @return 返回用户订单信息
 */
export function queryCustomerOrderList(query) {
  return request({
    url: 'orderlist',
    method: 'get',
    params: query,
  })
}

/**
 * 确认收货订单
 *
 * @param orderId 订单id
 * @return 成功返回>0 失败返回0
 */
export function confirmReceipt(orderId) {
  return request({
    url: 'receiptorder/' + orderId,
    method: 'put',
  })
}
/**
 * 判断是否有退款中的
 *
 * @param orderId 订单id
 * @return 成功返回>0 失败返回0
 */
export function judgeRefund(data) {
  return request({
    url: 'judgeRefund',
    method: 'post',
    data
  })
}

/**
 * 根据orderId反查万顺福大订单
 * @param {orderId} data 
 * @returns 
 */
export function selectWsOrderInfoByOrderId(params) {
  return request({
    url: '/selectWsOrderInfoByOrderId',
    method: 'get',
    params
  })
}

/**
 * 取消订单
 *
 * @param params.orderId 订单id
 * @param params.reason  取消原因
 * @return 1 成功 -1 订单不存在 -2 用户不匹配 0 失败
 */
export function cancelOrder(params) {
  return request({
    url: '/cancelorder',
    method: 'post',
    data: params,
    // url: 'cancelorder/' + orderId + '/' + reason,
    // method: 'put',
  })
}

/**
 * 查看物流
 *
 * @param orderId     订单id
 * @param callbackUrl 回调地址
 * @return H5查询物流的url
 */
export function getCheckLogisticsUrl(orderId, callbackUrl) {
  return request({
    url: 'checklogisticsurl?orderId=' + orderId + '&callbackUrl=' + callbackUrl,
    method: 'get',
  })
}

/**
 * 查询订单详情
 *
 * @param orderId 订单id
 * @return 返回订单详情
 */
// export function queryOrderDetail(orderId) {
//   return request({
//     url: 'orderdetail/' + orderId,
//     method: 'get',
//   })
// }

export function queryOrderDetail(orderId) {
  return request({
    url: 'order/detail',
    method: 'get',
    params: orderId,
  })
}

/**
 * 删除订单
 * @param orderId 订单id
 */
export function deleteOrder(orderId) {
  return request({
    // url: 'order/' + orderId,
    url: '/order',
    method: 'get',
    params: orderId,
    // method: 'delete',
  })
}

/**
 * 分页查询用户订单列表
 *
 * @param query 查询条件
 * @return 返回用户订单信息
 */
export function queryOrderList(query) {
  return request({
    url: 'orderSummary',
    method: 'get',
    params: query,
  })
}
/**
 * 查看发票信息
 *
 * @param orderId 订单id
 */
 export function getInvoicing(params) {
  return request({
    url: '/queryOrderAttr',
    method: 'get',
    params,
  })
}

/**
 * 再次购买
 *
 * @param params 再次购买参数
 * @return 返回确认订单信息
 */
export function settlementDetail(params) {
  return request({
    url: '/settlement',
    method: 'post',
    data: params,
  })
}

/**
 * 查询物流(新)
 *
 * @param params 查询物流参数
 */
export function getExpress(params) {
  return request({
    url: '/express',
    method: 'get',
    params,
  })
}

/**
 * 查询单间商品物流(新)
 *
 * @param params 查询物流参数
 */
export function getSingleExpress(params) {
  return request({
    url: '/order/sku/logistics',
    method: 'post',
    data: params,
  })
}

/**
 * 检查订单
 *
 * @param orderId 订单id
 */
export function checkOrder(orderId) {
  return request({
    url: `/order/checkOrder/${orderId}`,
    method: 'get',
  })
}

/**
 * 批量取消子订单
 *
 * @param orderId 订单id
 */
export function cancelOrderBatch(params) {
  return request({
    url: `/cancelOrderBatch`,
    method: 'post',
    data: params,
  })
}

/**
 * 支付成功，根据code查询订单金额、发放的优惠券
 *
 * @param orderId 订单id
 */
export function queryPayInfo(orderCode) {
  return request({
    url: `/order/queryPayInfo/${orderCode}`,
    method: 'get',
  })
}

// 获取取货信息 电动车
export function deliveryGoods(params) {
  return request({
    url: `/agencystore/deliveryGoods`,
    method: 'post',
    data: params,
  })
}

// 修改订单收货信息
export function updateReceiptInfo(params) {
  return request({
    url: `/updateReceiptInfo`,
    method: 'post',
    data: params,
  })
}

/**
 * 支付状态查询
 *
 * @param orderId 订单id
 */
export function payQuery(params) {
  return smartRequest({
    url: `/api/app/pay/service/payQuery`,
    method: 'post',
    data: params,
  })
}

/**
 * 支付状态查询
 *
 * @param orderId 订单id
 */
export function orderPayCheck(params) {
  return smartRequest({
    url: `/api/app/order/service/orderPayCheck`,
    method: 'post',
    data: params,
  })
}

