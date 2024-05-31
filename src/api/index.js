/**
 * 首页路由
 *
 * @author Caizize created on 2020/1/2
 */

import request from '@/utils/request'


/**
 * 查询h5首页配置信息
 *
 * @param 
 * @return 返回h5首页
 */
export function mobileIndex() {
  return request({
    url: 'home/template/queryIndexHomeTemplate',
    method: 'get',
  })
}

/**
 * 首页弹窗
 *
 * @param 
 * 
 */
 export function selectListPopupWindowConfig() {
  return request({
    url: '/popup/window/config/selectListPopupWindowConfig',
    method: 'get',
  })
}

/**
 * 查询用户未读的站内信
 */
export function queryUnReadMessagecount(params) {
  return request({
    url: 'station/letter/queryUnreadCountByGroup',
    method: 'get',
    params: params
  })
}

/**
 * 查询热销榜单和热销广告
 */
 export function queryAdvertSet(data) {
  return request({
    url: '/home/template/queryAdvertSet',
    method: 'post',
    data
  })
}