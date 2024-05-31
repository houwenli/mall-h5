import request from '@/utils/request';

/**
 * 查询订单评价详情
 */
export function queryEvaluationDetail(orderId) {
  return request({
    url: 'evaluation/' + orderId,
    method: 'get',
  })
}


