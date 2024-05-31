import request from '@/utils/request';

/**
 * 查询商品的评论概括
 * @param skuId 单品id
 */
export function queryCommentSummarize(skuId) {
  return request({
    url: 'commentsummarize/' + skuId,
    method: 'get',
  })
}

/**
 * 查询单品评价
 * @param skuId 单品id
 */
export function querySkuComments(skuId, type, params) {
  return request({
    url: 'comments/' + skuId + '/' + type + '/1',
    method: 'get',
    params: params
  })
}

/**
 * 添加订单商品评价
 * @param params 添加商品评论实体
 */
export function addEvaluation(params) {
  return request({
    url: '/orderSku/evaluation',
    method: 'post',
    data: params,
  })
}

/**
 * 查询用户待评价商品
 * @param params.pageNum 页签
 * @param params.pageSize 添加商品评论实体
 */
export function unevaluatedList(query) {
  return request({
    url: '/unevaluated',
    method: 'get',
    params: query,
  })
}

/**
 * 查询用户已评价商品
 * @param params 添加商品评论实体
 */
export function evaluatedList(query) {
  return request({
    url: '/comment/customer',
    method: 'get',
    params: query,
  })
}

