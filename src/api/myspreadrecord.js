import request from '@/utils/request';

/**
 * 分页查询用户 佣金/提现 记录
 */
export function queryRecords(params, url) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}


/**
 * 增加用户提现记录
 */
export function addWithdrawRecord(params) {
  return request({
    url: 'withdraw',
    method: 'post',
    params: params
  })
}


/**
 * 根据用户id查询用户个人信息
 */
export function queryCustomerPersonalInfo() {
  return request({
    url: 'customer/personalinfo',
    method: 'get',
  })
}
