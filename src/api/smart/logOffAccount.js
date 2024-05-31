import request from '@/utils/smartRequest'

/**
 * 注销账号
 */
export function logoutApp(params) {
  return request({
    url: '/user/service/user/deleteUserApp',
    method: 'post',
    data: params,
  })
}
