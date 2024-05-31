import request from '@/utils/request'

/**
 * 查询首单活动列表
 */
export function getSpuSpeicalAreaList(params) {
  return request({
    url: '/specialArea/getSpuSpeicalAreaList',
    method: 'get',
    params: params,
  })
}
/**
 * 查询首单活动营销信息
 */
export function getMarketingById(params) {
  return request({
    url: '/specialArea/getMarketingById',
    method: 'get',
    params: params,
  })
}
