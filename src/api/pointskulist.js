/**
 * 积分商城商品列表路由
 *
 * @author Caizize created on 2020/4/20
 */

import request from '@/utils/request'

/**
 * 分页查询积分商品信息
 */
export function queryPointSkuList(params) {
  return request({
    url: 'point/skulist',
    method: 'get',
    params: params
  })
}

/**
 * 查询所有积分商品分类
 */
export function queryAllPointCates() {
  return request({
    url: 'point/type',
    method: 'get'
  })
}

/**
 * 查询促销设置
 */
export function queryMarketingSetting() {
  return request({
    url: 'marketingsetting',
    method: 'get',
  })
}
