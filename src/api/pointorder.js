/**
 * 积分商城订单路由
 *
 * @author Caizize created on 2020/4/21
 */

import request from '@/utils/request'

/**
 * 分页查询用户积分商城订单列表
 *
 * @param query 查询条件
 * @return 返回用户积分商城订单列表
 */
export function queryPointOrderList (query) {
  return request({
    url: 'pointmallorderlist',
    method: 'get',
    params: query
  })
}

/**
 * 积分商城订单确认收货
 *
 * @param id 积分商城订单id
 * @return 成功返回>0 失败返回0
 */
export function confirmReceiptPointOrder (id) {
  return request({
    url: 'receiptpointmallorder/' + id,
    method: 'put',
  })
}

/**
 * 查询积分商城订单详情
 *
 * @param id 积分商城订单id
 * @return 返回积分商城订单详情
 */
export function queryPointOrderDetail(id) {
  return request({
    url: 'pointmallorderdetail/' + id,
    method: 'get',
  })
}
