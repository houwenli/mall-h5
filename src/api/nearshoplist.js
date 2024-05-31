/**
 * 附近店铺路由
 *
 * @author Caizize created on 2019/12/20
 */

import request from '@/utils/request'


/**
 * 根据定位查询附近店铺列表
 *
 * @param longitude 经度
 * @param latitude  纬度
 * @return 店铺信息
 */
export function queryNearShopList(longitude, latitude) {
  return request({
    url: 'nearshoplist/' + longitude + '/' + latitude,
    method: 'get',
  })
}
