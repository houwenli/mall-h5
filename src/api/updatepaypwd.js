/**
 * 修改支付密码路由
 *
 * @author Caizize created on 2019/12/5
 */

import request from '@/utils/request'

/**
 * 发送短信验证码
 *
 * @return 0 成功 1 失败
 */
export function sendSmsCode() {
  return request({
    url: 'updatepaypwd/sendcode',
    method: 'post',
  })
}

/**
 * 修改密码
 *
 * @param updatePayPwdBean 修改支付密码实体
 * @return -1 参数错误  -2 验证码错误 -3 用户不匹配 0 失败 1 成功
 */
export function updatePayPassword(updatePayPwdBean) {
  let data = updatePayPwdBean
  return request({
    url: 'updatepaypwd/update',
    method: 'put',
    data,
  })
}
