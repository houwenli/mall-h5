import request from '@/utils/smartRequest'

/**
 * 获取个人信息收集清单
 */
export function collectUserInfo4CheckApp(data) {
  return request.post('/user/service/user/collectUserInfo4CheckApp', data)
}
