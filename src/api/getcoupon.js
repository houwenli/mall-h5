import request from '@/utils/request';



/**
 * 通过优惠券码领取优惠券
 */
export function receiveCouponByCode(code) {
  return request({
    url: 'mycoupon/' + code,
    method: 'put'
  })
}

