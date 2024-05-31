/**
 * 忘记密码路由
 *
 * @author Caizize created on 2019/12/3
 */

import request from '@/utils/request'
/**
 * 发送短信验证码
 *
 * @param mobile 手机号码
 * @return 0 成功 -1 失败
 */
export function sendSmsCode(mobile) {
  return request({
    url: 'forgetpwd/sendmobilecode/' + mobile,
    method: 'post',
  })
}

/**
 * 修改密码
 *
 * @param forgetPwdRequest 修改密码请求实体
 */
export function updatePassword(forgetPwdRequest) {
  let data = forgetPwdRequest
  return request({
    url: 'forgetpwd/updatepwd',
    method: 'put',
    data,
  })
}

/**
 * 校验验证码
 *
 * @param mobilePhone 修改密码请求实体
 * @param code 修改密码请求实体
 */
export function verificationCode(formdata) {
  return request({
    url: '/forgetpwd/check/verificationCode',
    method: 'post',
    data: formdata
  })
}

/**
 * 注册发送短信验证码
 *
 * @param mobile 手机号码
 * @return 0 成功 -1 失败
 */
export function sendSmsCoderegister(mobile) {
  return request({
    url: '/sendmobilecode/' + mobile,
    method: 'post',
  })
}
