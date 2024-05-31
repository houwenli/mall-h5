import request from '@/utils/request'

/**
 * 查询支付设置
 */
export function queryPaySet(type) {
  return request({
    url: type == 'insurance' ? 'queryAllPaySet' : 'payset',
    method: 'get',
  })
}

/**
 * 查询用户预存款总额
 */
export function queryAllPredeposit() {
  return request({
    url: '/customer/predeposit/total',
    method: 'get',
  })
}

/**
 * 查询用户预存款总额
 */
export function queryUserAsset() {
  return request({
    url: '/queryUserAsset',
    method: 'get',
  })
}

/**
 * 预存款支付
 * @param params 支付参数
 */
export function prePay(params) {
  return request({
    url: '/toPay',
    method: 'post',
    data: params,
  })
}

/**
 * 支付宝支付
 */
export function alipay(params,type) {
  return request({
    url: type == 'insurance' ? '/insuranceToPay' : '/toPay',
    method: 'post',
    data: params,
  })
}

/**
 * 获取微信公众号支付的参数
 * @param params 参数
 */
export function wechatofficialaccountpayparm(params,type) {
  return request({
    url: type == 'insurance' ? '/insuranceToPay' : '/toPay',
    method: 'post',
    data: params
  })
}

/**
 * 微信h5支付
 * @param params
 */
export function wechatH5PayParm(params,type) {
  return request({
    url: type == 'insurance' ? '/insuranceToPay' : '/toPay',
    method: 'post',
    data: params,
  })
}


/**
 * 收银台获取支付方式
 * @param params
 */
export function getPayList(params,type) {
  return request({
    url: '/pay/service/cashDesk',
    method: 'post',
    data: params,
  })
}