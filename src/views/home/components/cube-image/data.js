import Cookies from 'js-cookie'
import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
import store from '../../../../store/store'
/**
 {
  "title":"图文",
  "text":"图片魔方",
  "style":"Number类型 对应的是 code   1-5 对应的魔方风格1-5",
  "icon":"/static/img/magic@2x.2f4366d.png",
  "hasBackground":"1-有背景/0-无背景",
  "bgColor":"背景色",
  "bgImage":"背景图片url",
  "backgroundType":"0 --背景颜色   1-背景图片",
  "showComTitle":"0隐藏名称-1显示名称",
  "comTitle":"组件标题",
   "slideImageList": [
     {
          "url":"图片地址",
          "link":"跳转地址"
     }
   ],
  "list":[
      {
          "url":"图片地址",
          "link":"跳转地址"
      }
  ],
  "id":"u141787542"
}
 */

export const testConfig = [
  {
    title: '图文',
    text: "图片魔方",
    style: 2,
    icon: "/static/img/magic@2x.2f4366d.png",
    hasBackground: '1',
    bgColor: '#FFFFFF',
    bgImage: '',
    backgroundType: 0,
    showComTitle: '1',
    comTitle: '魔方风格1',
    slideImageList: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: '',
      }
    ],
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: 'http://mdev2.wsfmall.com/firstOrder?id=1048',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: 'http://mdev2.wsfmall.com/firstOrder?id=1048',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: 'http://mdev2.wsfmall.com/firstOrder?id=1048',
      }
    ],
  },
]


/**
 * 统一的路径跳转
 * @param {Object} data
 * @returns
 */
export const toPage = (data, index) => {
  console.log(data, index)
  // 流量分析埋点
  // let params = {
  //   name: '图片魔方',
  //   image: data.url || '',
  //   url: data.link || '',
  //   type: 8,
  //   index,
  //   channel_source: Cookies.get('_wsf_role')
  // }
  // store.dispatch('BURIED_POINT/advertVisitRequest', params)
  if (!data || !data.link) return
  let isLivePage = data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
  if (isLivePage) {
    toMiniAppDistribution(data.link)
  } else {
    routerPathName(data.link)
  }
}