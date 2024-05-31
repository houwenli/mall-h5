import request from '@/utils/request';

/**
 * 查询所有手机分类
 */
export function queryCategory() {
  return request({
    url: 'category',
    method: 'get',
  })
}
