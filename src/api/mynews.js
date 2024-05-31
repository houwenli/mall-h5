import request from '@/utils/request';

/**
 * 查询用户站内信信息
 */
export function queryMessages(params) {
  return request({
    url: 'letter',
    method: 'get',
    params: params
  })
}


/**
 * 更新站内信阅读状态
 */
export function updateMessageIsRead(id) {
  return request({
    url: 'letter/' + id,
    method: 'put',
  })
}

/**
 * 查询站内信信息列表
 */
 export function queryNews(params) {
  return request({
    url: 'station/letter/queryStationLettersByCustomerId',
    method: 'post',
    data: params,
  })
}

/**
 * 查询站内信未读数
 */
 export function queryNewsReadNums(params) {
  return request({
    url: 'station/letter/queryUnreadCountByGroup',
    method: 'get',
    params: params
  })
}

/**
 * 更新状态
 */
 export function updataNews(params) {
  return request({
    url: 'station/letter/updateStationLettersIsRead',
    method: 'get',
    params: params,
  })
}

/**
 * 按分组清空站内信
 */
 export function cleanStationNews(params) {
  return request({
    url: 'station/letter/cleanStationLetter',
    method: 'get',
    params: params
  })
}


/**
 * 删除站内信
 */
 export function deleteStationNews(params) {
  return request({
    url: 'station/letter/deleteStationLetter',
    method: 'get',
    params: params
  })
}