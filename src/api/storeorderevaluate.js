/**
 * 门店评价路由
 *
 * @author Caizize created on 2019/12/30
 */

import request from '@/utils/request'


/**
 * 根据店铺id查询店铺信息
 *
 * @param storeId 店铺id
 * @return 店铺信息
 */
export function queryStoreInfo(storeId) {
  return request({
    url: 'storeinfo/' + storeId,
    method: 'get',
  })
}

/**
 * 添加门店评分
 *
 * @param storeEvaluation 门店评价实体类
 * @return 1成功 0失败
 */
export function addStoreEvaluation(storeEvaluation) {
  return request({
    url: 'storeevaluation',
    method: 'post',
    data: storeEvaluation
  })
}

/**
 * 查询门店评分详情
 *
 * @param orderCode 订单编号
 * @return 评分信息
 */
export function queryStoreEvaluation(orderCode) {
  return request({
    url: 'storeevaluation/' + orderCode,
    method: 'get',
  })
}
