import request from '@/utils/smartRequest'

/**
 * 获取收银台列表
 */
export function getPayList(params = {}) {
  return request({
    url: '/api/app/pay/service/cashDesk',
    method: 'post',
    data: params,
  })
}

// 收银台支付
export function orderPay(params = {}) {
    return request({
      url: '/api/app/order/service/orderPay',
      method: 'post',
      data: params,
    })
}

// 获取小程序 URL Link
export function wxSmallUrlLink(params = {}) {
    return request({
      url: '/api/app/pay/service/wxSmallUrlLink',
      method: 'post',
      data: params,
    })
}


// 获取openid
export function getOpenId(params = {}) {
  return request({      
      url: '/api/app/pay/service/wxOpenId',
      method: 'post',
      data: params,
  });
}

/** @description 查询用户积分及积分抵扣配置 */
export function getIntegralAccountAndCfg(params = {}) {
  return request({
      url: '/user/service/app/integral/getIntegralAccountAndCfg',
      method: 'post',
      data: params,
  })
}