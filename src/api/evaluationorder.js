import request from '@/utils/request';

/**
 * 查询订单详情
 */
export function queryOrderForEvaluation(orderId) {
  return request({
    url: 'evaluation/order/' + orderId,
    method: 'get',
  })
}


/**
 * 添加订单评论
 */
export function addOrderEvaluation(evaluationParams) {
  return request({
    url: 'evaluation',
    method: 'post',
    data: evaluationParams
  })
}







