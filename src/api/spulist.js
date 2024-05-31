import request from '@/utils/request';

/**
 * 搜索商品
 * @param params 搜索参数
 */
// export function searchSpus(params) {
//   return request({
//     url: 'searchspu',
//     method: 'post',
//     data: params
//   })
// }
/**
 * 搜索商品(待店铺)
 * @param params 搜索参数
 */
export function searchSpus(params) {
  return request({
    url: 'searchSpuAndStore',
    method: 'post',
    data: params
  })
}

/**
 * 搜索聚合
 * @param params 请求参数
 */
export function searchAggregations(params) {
  return request({
    url: 'searchaggregations',
    method: 'post',
    data: params
  })
}
