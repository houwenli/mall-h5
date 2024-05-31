/**
 * 用户积分路由
 *
 * @author Caizize created on 2019/12/3
 */

import request from '@/utils/request'


/**
 * 分页查询用户积分
 *
 * @param query 查询参数
 * @return 用户积分列表
 */
export function queryPoints(query) {
  return request({
    url: 'customer/points',
    method: 'get',
    params: query
  })
}

/**
 * 查询用户总积分
 *
 * @return 用户总积分
 */
export function queryAllPoints() {
  return request({
    url: 'customer/points/total',
    method: 'get',
  })
}
