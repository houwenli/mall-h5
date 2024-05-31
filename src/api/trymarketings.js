import request from '@/utils/request';


/**
 * 查询试用促销图片信息
 *
 * @return 试用促销图片信息
 */
export function queryTryPic(storeId) {
  return request({
    url: 'try/pic/' + storeId,
    method: 'get',
  })
}

/**
 * 查询试用促销分类列表
 *
 * @param storeId 店铺id
 * @return 返回试用促销分类列表
 */
export function queryMarketingCateList(storeId) {
  return request({
    url: 'try/cate/' + storeId,
    method: 'get',
  })
}

/**
 * 分页查询试用促销列表
 *
 * @param query 查询条件
 * @return 返回试用促销列表
 */
export function queryTryMarketingList(query) {
  return request({
    url: 'try',
    method: 'get',
    params: query
  })
}
