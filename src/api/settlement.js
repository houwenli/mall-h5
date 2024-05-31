import request from '@/utils/request'

/**
 * 查询结算信息
 * @param params 查询参数
 */
export function querySettlements(params) {
  return request({
    url: 'settlement',
    method: 'post',
    data: params,
  })
}

/**
 * 提交订单
 * @param params 参数
 */
export function submitOrder(params) {
  return request({
    url: 'order',
    method: 'post',
    data: params,
  })
}

/**
 * 结算时，用户切换店铺券，自动重新将平台券分类
 * @param params 参数
 */
export function checkPlatformCoupon(params) {
  return request({
    url: '/checkPlatformCoupon',
    method: 'post',
    data: params,
  })
}

// 福气值换算接口
export function getFqzPrice(params) {
  return request({
    url: '/getFqzPrice',
    method: 'post',
    data: params,
  })
}

// 福气值比例
export function getFqzPriceConfig(params) {
  return request({
    url: '/getFqzPriceConfig',
    method: 'get',
    data: params,
  })
}
