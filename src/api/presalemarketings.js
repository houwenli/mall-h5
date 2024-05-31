import request from '@/utils/request';


/**
 * 查询预售促销图片信息
 *
 * @return 预售促销图片信息
 */
export function queryPreSalePic(storeId) {
  return request({
    url: 'presale/pic/' + storeId,
    method: 'get',
  })
}

/**
 * 查询预售促销分类列表
 *
 * @param storeId 店铺id
 * @return 返回预售促销分类列表
 */
export function queryMarketingCateList(storeId) {
  return request({
    url: 'presale/cate/' + storeId,
    method: 'get',
  })
}

/**
 * 分页查询预售促销列表
 *
 * @param query 查询条件
 * @return 返回预售促销列表
 */
export function queryPreSaleList(query) {
  return request({
    url: 'presale',
    method: 'get',
    params: query
  })
}
