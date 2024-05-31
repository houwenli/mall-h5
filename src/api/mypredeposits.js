/**
 * 预存款路由
 *
 * @author Caizize created on 2019/12/10
 */

import request from '@/utils/request'


/**
 * 查询用户预存款总额
 *
 * @return 用户预存款总额
 */
export function queryAllPredeposit() {
  return request({
    url: 'customer/predeposit/total',
    method: 'get',
  })
}

/**
 * 分页查询用户预存款记录
 *
 * @param query 查询参数
 * @return 用户预存款记录
 */
export function queryPredeposits(query) {
  return request({
    url: 'customer/predeposits',
    method: 'get',
    params: query
  })
}
