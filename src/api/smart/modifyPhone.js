import request from '@/utils/smartRequest'

/**
 * 修改手机号
 */
export function modifyUserInfoApp(params) {
  return request({
    url: '/user/service/user/modifyUserInfoApp',
    method: 'post',
    data: params,
  })
}
/**
 * 手机号是否已注册
 */
export function modifyUserInfo4CheckApp(params) {
  return request({
    url: '/user/service/user/modifyUserInfo4CheckApp',
    method: 'post',
    data: params,
  })
}
/**
 * 发送短信验证码
 */
export function send(params) {
  return request({
    url: '/api/app/finance/service/sms/code/send',
    method: 'post',
    data: params,
  })
}
/**
 * 登出
 */
export function logoutApp(params) {
  return request({
    url: '/user/service/user/logoutApp',
    method: 'post',
    data: params,
  })
}
