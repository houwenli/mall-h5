import request from '@/utils/request';

/**
 * 查询商品分类，一级分类 id=0
 * @param {*} id
 * @returns
 */
export function getCategory(id=0) {
  return request({
    url: '/categorybyparentid',
    method: 'get',
    params: {parentId: id}
  })
}

/**
 * 查询一级分类下的广告
 * @param {String} id
 * @returns
 */
export const getCategoryAd = (id) => {
  return request({
    url: '/homeTemplateById',
    method: 'get',
    params: {id : id}
  })
}
