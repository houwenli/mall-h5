/**
 * 搜索页接口
 */

import request from '@/utils/request'

/**
 * 搜索发现
 *
 * @param query 查询参数，不需要参数
 * @return 搜索发现
 */
export function queryKeyword(query) {
  return request({
    url: '/queryKeyword',
    method: 'post',
    params: query
  })
}

// 查询商品列表是否还有优惠劵
export function getSpuDiscountList(params){
    return request({
      url: '/spuDiscount/List',
      method: 'post',
      data: params,
    })
  }
