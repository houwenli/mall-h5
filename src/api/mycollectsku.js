import request from '@/utils/request';

/**
 * 查询用户收藏的单品信息
 */
export function queryAttentions(params) {
  return request({
    url: 'attention',
    method: 'get',
    params: params
  })
}

/**
 * 分页查询会员关注的商品信息
 * @param pageNum 当前页
 * @param pageSize 每页显示的记录数
 * @return 商品列表
 */
export function queryAttentionSku(params) {
  return request({
    url: '/attention/queryAttentionSku',
    method: 'post',
    data: params
  })
}

/**
 * 分页查询会员关注的商品信息
 * @param pageNum 当前页
 * @param pageSize 每页显示的记录数
 * @return 商品列表
 */
export function queryAttentionStore(params) {
  return request({
    url: '/attention/queryAttentionStore',
    method: 'post',
    data: params
  })
}
