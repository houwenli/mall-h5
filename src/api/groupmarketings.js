import request from '@/utils/request';


/**
 * 查询拼团促销图片信息
 *
 * @return 拼团促销图片信息
 */
export function queryGroupPic(storeId) {
  return request({
    url: 'group/pic/' + storeId,
    method: 'get',
  })
}

/**
 * 查询拼团促销分类列表
 *
 * @param storeId 店铺id
 * @return 返回拼团促销分类列表
 */
export function queryMarketingCateList(storeId) {
  return request({
    url: 'group/cate/' + storeId,
    method: 'get',
  })
}

/**
 * 分页查询拼团促销列表
 *
 * @param query 查询条件
 * @return 返回拼团促销列表
 */
export function queryGroupMarketingList(query) {
  return request({
    url: 'group',
    method: 'get',
    params: query
  })
}
