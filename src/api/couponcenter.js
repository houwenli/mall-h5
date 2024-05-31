import request from '@/utils/request';

/**
 * 分页查询优惠券
 */
export function getCouponList(params) {
  return request({
    url: 'coupon',
    method: 'get',
    params: params
  })
}


/**
 * 领取优惠券
 */
export function receiveCoupon(id) {
  return request({
    url: 'coupon/' + id,
    method: 'put'
  })
}

