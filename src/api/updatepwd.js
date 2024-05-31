/**
 * 修改密码路由
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
    url: 'updatepwd/sendcode',
    method: 'post',
  })
}

/**
 * 修改密码
 *
 * @param updatePwdBean 修改密码实体
 * @return -1 参数错误  -2 验证码错误 -3 用户不匹配 0 失败 1 成功
 */
export function updatePassword(updatePwdBean) {
  let data = updatePwdBean
  return request({
    url: 'updatepwd/update',
    method: 'put',
    data,
  })
}
