/**
 * 门店订单列表路由
 *
 * @author Caizize created on 2019/12/30
 */

import request from '@/utils/request'


/**
 * 分页查询门店订单
 *
 * @param query 查询条件
 * @return 门店订单集合
 */
export function queryStoreOrderList(query) {
  return request({
    url: 'storeorderlist',
    method: 'get',
    params: query
  })
}

/**
 * 取消门店订单
 *
 * @param orderId 门店订单id
 * @param reason  取消原因
 * @return 1成功，否则失败
 */
export function cancelStoreOrder(orderId, reason) {
  return request({
    url: 'cancelstoreorder/' + orderId + '/' + reason,
    method: 'put',
  })
}

/**
 * 查询门店订单详情
 *
 * @param orderId 门店订单id
 * @return 门店订单详情
 */
export function queryStoreOrderById(orderId) {
  return request({
    url: 'storeorderdetail/' + orderId,
    method: 'get',
  })
}
