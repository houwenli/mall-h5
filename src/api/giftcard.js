import request from '@/utils/request';



/**
 * 分页查看礼卡列表
 */
export function valueCardCodeSelectPage(params) {
  return request({
    url: `valueCardCode/selectPage/${params.type}/${params.pageNum}/${params.pageSize}`,
    method: 'get'
  })
}

/**
 *
 * @param {string} cardKey 卡密
 * @returns
 */
 export function valueCardCodeBanding(cardKey) {
  return request({
    url: `valueCardCode/banding?cardKey=${cardKey}`,
    method: 'get'
  })
}

/**
 * 个人中心-查询礼卡统计信息
 * @returns
 */
export function valueCardCodeCount() {
  return request({
    url: `valueCardCode/count`,
    method: 'get'
  })
}

/**
 *
 * @param {string} valueCardCodeId 礼品卡id
 * @returns
 */
export function giftUsageLog(valueCardCodeId) {
  return request({
    url: `valueCardCode/selectRecordByCodeId/${valueCardCodeId}`,
    method: 'get'
  })
}

