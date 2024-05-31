/**
 * 专题----排行榜
 */

import request from '@/utils/request'

/**
 * 根据专题id查专题详情
 *
 */
export function selectSubjectById(query) {
    return request({
        url: '/subject/selectSubjectById',
        method: 'post',
        data: query
    })
}

/**
 * 排行专题-查询二级分类
 *
 */
export function selectRankingSecondCate(query) {
    return request({
        url: '/subject/ranking/selectRankingSecondCate',
        method: 'post',
        data: query
    })
}

/**
 * 排行专题-查询专题内商品排行
 *
 */
export function selectSubjectRanking(query) {
    return request({
        url: '/subject/ranking/selectSubjectRanking',
        method: 'post',
        data: query
    })
}

/**
 * 品类热销-根据spuids查详情
 *
 */
export function selectSpuDeleteBySpuIds(query) {
    return request({
        url: '/subject/categoryHot/selectSpuDeleteBySpuIds',
        method: 'post',
        data: query
    })
}

/**
 * 万顺福-专题自定义商品查询
 * 
 * @param {*} subjectId 模板ID
 * @param {*} recommendNum 专题自定义推荐商品数量
 */
export function getCustomPageSpuList(params) {
    return request({
      // url: 'recommend/spus',
      url: 'subject/customPageSpuAnalysis',
      method: 'post',
      data: params,
    })
  }
  
  /**
   * 万顺福-单页商品查询
   * 
   * @param {*} spuId 商品ID
   * 
   */
  export function getsiglePageSpuList(params) {
    return request({
      // url: 'recommend/spus',
      url: 'subject/simplePageSpuAnalysis',
      method: 'post',
      data: params,
    })
  }