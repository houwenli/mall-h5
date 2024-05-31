/**
 * 用户注册路由
 *
 * @author Caizize created on 2019/12/2
 */

import request from '@/utils/request'

/**
 * 校验手机号码是否存在
 *
 * @param mobile 手机号码
 * @return 存在返回>0  不存在返回0
 */
export function checkMobileExist(mobile) {
  return request({
    url: 'checkmobileexist/' + mobile,
    method: 'get'
  })
}

/**
 * 发送短信验证码
 *
 * @param mobile 手机号码
 * @return 0 成功 1 失败 -1 手机号码已经存在
 */
export function sendSmsCode(mobile) {
  return request({
    url: 'sendmobilecode/' + mobile,
    method: 'post'
  })
}

/**
 * 用户注册
 *
 * @param registerData 用户注册实体
 */
export function register(registerData) {
  return request({
    url: 'register',
    method: 'post',
    data: registerData
  })
}
