import request from '@/utils/request';

/**
 * 查询用户收货地址
 */
export function queryCustomerAddress() {
  return request({
    url: 'address',
    method: 'get',
  })
}
