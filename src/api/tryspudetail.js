/**
 * 试用商品详情路由
 *
 * @author Caizize created on 2020/1/8
 */

import request from '@/utils/request'


/**
 * 根据试用促销id查询试用商品详情
 *
 * @param tryId 试用促销id
 * @return 试用商品详情
 */
export function queryTrySpuDetail(tryId) {
  return request({
    url: 'tryspudetail/' + tryId,
    method: 'get',
  })
}

/**
 * 查看店铺评分
 *
 * @param storeId 店铺id
 * @return 店铺信息
 */
export function queryStoreScore(storeId) {
  return request({
    url: 'storescore/' + storeId,
    method: 'get',
  })
}

/**
 * 根据试用促销id查询试用申请
 *
 * @param tryId 试用促销id
 * @return 试用申请实体
 */
export function queryTrySkuApply(tryId) {
  return request({
    url: 'tryskuapplybytryid/' + tryId,
    method: 'get',
  })
}

/**
 * 申请试用
 *
 * @param trySkuApply 试用申请实体
 * @return 1：成功 -1：活动还没有开始 -2：活动已经结束 -3：您已申请过 -4活动不存在 -5 申请人数已达上限
 */
export function applyTrySku(trySkuApply) {
  return request({
    url: 'applytrysku',
    method: 'post',
    data: trySkuApply
  })
}

/**
 * 分页查询试用报告
 *
 * @param query 查询参数
 * @return 试用报告集合
 */
export function queryTryReportList(query) {
  return request({
    url: 'tryreportlist',
    method: 'get',
    params: query
  })
}

/**
 * 查询试用促销规则信息
 */
export function queryTryRule() {
  return request({
    url: 'try/rule',
    method: 'get'
  })
}
