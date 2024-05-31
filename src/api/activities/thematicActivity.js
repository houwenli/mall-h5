import request from '@/utils/request'

/**
 * 查询活动页
 */
export function selectPerformanceSkuBySpuId(params) {
  return request({
    url: '/selectPerformanceSkuBySpuId',
    method: 'post',
    data: params,
  })
}
export function selectActivityCustomized(params) {
  return request({
    url: '/selectActivityCustomized',
    method: 'post',
    data: params,
  })
}