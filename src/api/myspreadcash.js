import request from '@/utils/request';

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



