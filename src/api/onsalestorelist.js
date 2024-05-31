/**
 * 在售门店列表路由
 *
 * @author Caizize created on 2019/12/24
 */

import request from '@/utils/request'


/**
 * 根据id查询市信息
 *
 * @param cityId 市id
 * @return 市信息实体
 */
export function queryCityById(cityId) {
  return request({
    url: 'city/' + cityId,
    method: 'get',
  })
}

/**
 * 查询所有省市区信息
 *
 * @return 返回所有省市区信息
 */
export function queryAllAreas() {
  return request({
    url: 'areas',
    method: 'get',
  })
}

/**
 * 根据单品id和市id和定位查询在售门店列表
 *
 * @param query 在售门店查询参数实体
 * @return 门店信息
 */
export function queryOnSaleStoreList(query) {
  return request({
    url: 'onsalestorelist',
    method: 'get',
    params: query
  })
}
