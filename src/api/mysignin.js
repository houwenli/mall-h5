/**
 * 签到路由
 *
 * @author Caizize created on 2019/12/4
 */

import request from '@/utils/request'


/**
 * 查找签到积分规则
 *
 * @return 签到积分规则
 */
export function queryPointSignRule() {
  return request({
    url: 'pointsignrule',
    method: 'get'
  })
}

/**
 * 查找签到记录
 *
 * @param query 查询参数
 * @return 签到记录
 */
export function customerSignList(query) {
  return request({
    url: 'customersignlist',
    method: 'get',
    params: query
  })
}

/**
 * 判断今天是否签到
 *
 * @return 未签到返回1
 */
export function isTodaySign() {
  return request({
    url: 'istodaysign',
    method: 'get'
  })
}

/**
 * 签到
 *
 * @return 1：成功 -1：没有开启签到活动 -2：今天已签到
 */
export function signIn() {
  return request({
    url: 'signin',
    method: 'post'
  })
}
