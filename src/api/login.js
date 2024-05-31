import request from '@/utils/request'

// 智慧生活request
import smartRequest from '@/utils/smartRequest'
// import AES from '@/utils/AES'
/**
 * 登陆
 * @param params 登陆参数
 */
export function login(params) {
  // let data = AES.encrypt(params)
  let data = params
  return request({
    url: 'login',
    method: 'put',
    data,
  })
}

/**
 * 绑定账号
 * @param params 绑定参数
 */
export function bindaccount(params) {
  // let data = AES.encrypt(params)
  let data = params
  return request({
    url: 'bindaccount',
    method: 'put',
    data,
  })
}
/**
 * 绑定账号
 * @param params 绑定参数
 */
export function getlogininfo() {
  return request({
    url: 'getlogininfo',
    method: 'get',
  })
}

/**
 * 免密登录接口
 * @param phoneNo 手机号
 * @param channelType 渠道号前4位 渠道来源
 * @param timeStamp 当前时间戳
 * @param sign md5签名校验值
 */
export function noAuthLogin(params) {
  return request({
    url: 'unAuthLogin',
    method: 'post',
    data: params,
  })
}

/**
 * 免密登录接口升级版
 * @param phoneNo 手机号
 * @param channelType 渠道号前4位 渠道来源
 * @param timeStamp 当前时间戳
 * @param sign md5签名校验值
 * @param wscarLoginParam JSON字符串 {token,deviceId}
 */
export function unAuthLoginV1(params) {
  return request({
    url: 'unAuthLoginV1',
    method: 'post',
    data: params,
  })
}
/**
 * 短信验证码登录-获取验证码
 * @param mobilePhone 手机号
 */
export function getcode(params) {
  return request({
    url: '/get/verification/code',
    method: 'post',
    data: params,
  })
}

/**
 * 短信验证码登录-验证码登录
 * @param mobilePhone 手机号
 * @param code 手机号
 */
export function codelogin(params) {
  return request({
    url: '/verification/code/login',
    method: 'post',
    data: params,
  })
}

/**
 * 免密登录升级版本-智慧生活
 */
export function unAuthLoginSmart(params) {
  return smartRequest({
    url: '/user/service/user/unAuthLogin',
    method: 'post',
    data: params,
  })
}

/**
 * 登录升级版本-智慧生活
 */
export function signInSignUpApp(params) {
  return smartRequest({
    url: '/user/service/user/signInSignUpApp',
    method: 'post',
    data: params,
  })
}

/**
 * 获取验证码升级版本-智慧生活
 */
export function getcodeSmart(params) {
  return smartRequest({
    url: '/api/app/finance/service/sms/code/send',
    method: 'post',
    data: params,
  })
}