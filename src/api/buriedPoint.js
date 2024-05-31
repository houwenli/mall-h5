import request from '@/utils/request';

/**
 * 广告位埋点
 * @param {*} params
 * @returns
 */
export function advertVisit(params) {
  return request({
    url: 'advertVisit',
    method: 'get',
    params
  })
}
/**
 * 分享埋点
 * @param {*} params
 * @returns
 */
export function shareVisit(params) {
  return request({
    url: 'shareVisit',
    method: 'get',
    params
  })
}

