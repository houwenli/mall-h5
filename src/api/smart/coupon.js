import request from '@/utils/smartRequest'

/**
 * 注销账号
 */
export function QueryUserCouponList(params = {}) {
  return request({
    url: '/user/service/app/coupon/queryUserCouponList',
    method: 'post',
    data: params,
  })
}
