import request from '@/utils/request'


 /**
  * @param {number} channelSource 渠道来源
  * @param {string} route 访问路由
  * @param {number} userId 	用户id（此字段可以不传，但是前提条件是登录了必须带上token请求头）
  * @param {string} routeName 路由名称
  * @param {string} properties 属性（值为json格式）此数据前端需要进行编码 	[{"spuId":100,"skuId":1000000,"storeId":555},{"spuId":100,"skuId":1000000,"storeId":555}]
  *
  * 浏览量、访客量上报
  *文档地址 https://wiki.wsecar.cn/pages/viewpage.action?pageId=8916006
  */
 export function visit(data,properties=undefined) {
   let params = data
   if(properties){
    properties = JSON.stringify(properties)
    properties = encodeURIComponent(properties)
    params.properties = properties
   }
   return request({
     url: 'visit',
     method: 'get',
     params
   })
 }

/**
 * 年货节活动-埋点
 */
 export const bargainVisit = (data) => {
  return request({
    url: 'bargainVisit',
    method: 'get',
    params: data
  })
 }

/**
 * 商品详情-埋点
 */
export const detailsVisit = (data) => {
  return request({
    url: '/spu/click',
    method: 'post',
    data
  })
 }

/**
 * 搜索页搜索词埋点
 * params: {searchName}
 */
export const searchWordsVisit = (data) => {
  return request({
    url: '/spu/searchSpu',
    method: 'post',
    data
  })
}