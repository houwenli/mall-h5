/**
 * 附近门店路由
 *
 * @author Caizize created on 2019/12/26
 */

import request from '@/utils/request'


/**
 * 根据定位查询附近门店列表
 *
 * @param longitude 经度
 * @param latitude  纬度
 * @return 门店信息
 */
export function queryNearStoreList(longitude, latitude) {
  return request({
    url: 'nearstorelist/' + longitude + '/' + latitude,
    method: 'get',
  })
}
