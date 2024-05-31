/**
 * 预约列表路由
 *
 * @author Caizize created on 2019/12/30
 */

import request from '@/utils/request'


/**
 * 分页查询门店预约订单列表
 *
 * @param query 分页帮助类
 * @return 门店预约订单列表
 */
export function queryReservationList(query) {
  return request({
    url: 'reservationlist',
    method: 'get',
    params: query
  })
}

/**
 * 取消门店预约
 *
 * @param id 门店预约id
 * @return 成功1 失败0
 */
export function cancelReservation(id) {
  return request({
    url: 'cancelreservation/' + id,
    method: 'put',
  })
}
