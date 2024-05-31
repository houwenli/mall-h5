/**
 * 绑定新手机路由
 *
 * @author Caizize created on 2019/12/5
 */

import request from '@/utils/request'


/**
 * 重新绑定手机号码发送验证码
 *
 * @return 成功返回0  失败返回1
 */
export function sendOldMobileCode() {
  return request({
    url: 'bindnewmobile/sendoldcode',
    method: 'post'
  })
}

/**
 * 校验输入的验证码是否正确(重新绑定手机的第一个验证码)
 *
 * @param code   用户输入的验证码
 * @param mobile 用户原始手机号码
 * @return 成功返回0  失败返回-1
 */
export function validateOldMobileCode(code, mobile) {
  return request({
    url: 'bindnewmobile/validateoldcode/' + code + '/' + mobile,
    method: 'get'
  })
}

/**
 * 给绑定的新手机发送验证码
 *
 * @param mobile 新的手机号码
 * @return 0 成功 1 失败 -1 手机号码已经存在
 */
export function sendNewMobileCode(mobile) {
  return request({
    url: 'bindnewmobile/sendnewcode/' + mobile,
    method: 'post'
  })
}

/**
 * 用户绑定新的手机号码
 *
 * @param bindNewMobileRequest 绑定新手机号码
 * @return -1 参数错误 -2 没有凭证 -3 验证码错误 -4 手机号码已经存在 1 成功  0 失败
 */
export function bindNewMobile(bindNewMobileRequest) {
  return request({
    url: 'bindnewmobile/update',
    method: 'put',
    data: bindNewMobileRequest
  })
}
