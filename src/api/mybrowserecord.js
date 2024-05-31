/**
 * 浏览记录路由
 *
 * @author Caizize created on 2019/12/10
 */

import request from '@/utils/request'


/**
 * 分页查询用户浏览记录
 *
 * @return 用户浏览记录
 */
export function queryBrowseRecords(query) {
  return request({
    url: 'customer/getBrowseRecords',
    method: 'get',
    params: query
  })
}

/**
 * 删除多个用户浏览记录
 *
 * @return 用户浏览记录
 */
export function deleteBrowse(data) {
  return request({
    url: 'customer/deleteBrowseRecords',
    method: 'post',
    data
  })
}

/**
 * 删除用户浏览记录（物理删除）
 *
 * @return 用户预存款记录
 */
export function deleteBrowseRecords() {
  return request({
    url: 'customer/browserecord',
    method: 'delete',
  })
}

/**
 * 查询浏览记录(未登录状态下)
 *
 * @param skuIds 单品id
 * @return 用户浏览记录
 */
export function queryBrowseRecordBySkuIds(skuIds) {
  return request({
    url: 'customer/browserecordsbyskuids?skuIds=' + skuIds,
    method: 'get',
  })
}

/**
 * 删除浏览记录
 *
 * @param skuIds 单品id
 * @return 用户浏览记录
 */
 export function deleteBrowseRecord(skuIds) {
  return request({
    url: 'customer/deleteBrowseRecordById/' + skuIds,
    method: 'get',
  })
}
