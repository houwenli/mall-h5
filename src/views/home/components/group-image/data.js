import { routerPathName, toMiniAppDistribution } from '@/utils/utils'

/**
 * config 字段结构
 * style---- 1单列图 2双列图  3三列图  4四列图
 * hasBackground---- 1-有背景 0-无背景
 * backgroundType---- 1取bgImage字段 0取bgColor字段
 * showComTitle---- 0隐藏名称 1显示名称
 * url---- 图片地址
 * link---- 图片跳转路由地址
 */

export const testConfig = [
  {
    title: '图文',
    style: 1,
    styleText: '单列图',
    hasBackground: 1,
    bgColor: '#FFFFFF',
    bgImage: '',
    backgroundType: 0,
    showComTitle: 1,
    comTitle: '标题+背景单列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: '',
      },
    ],
  },
  {
    title: '图文',
    style: 1,
    styleText: '单列图',
    hasBackground: 1,
    bgColor: '#FFFFFF',
    bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/b522d4d2232b368e24ed1e18bed1349f.jpg',
    backgroundType: 1,
    showComTitle: 0,
    comTitle: '背景单列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: '',
      },
    ],
  },
  {
    title: '图文',
    style: 1,
    styleText: '单列图',
    hasBackground: 0,
    bgColor: '#FFFFFF',
    bgImage: '',
    backgroundType: 0,
    showComTitle: 0,
    comTitle: '无标题+无背景单列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/cf21792a1400c11c7e607e7e9d5b1eee.png',
        link: '',
      },
    ],
  },
  {
    title: '图文',
    style: 2,
    styleText: '双列图',
    hasBackground: 1,
    bgColor: '#FFFFFF',
    bgImage: '',
    backgroundType: 0,
    showComTitle: 1,
    comTitle: '标题+背景双列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
    ],
  },
  {
    title: '图文',
    style: 2,
    styleText: '双列图',
    hasBackground: 1,
    bgColor: '#FFFFFF',
    bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/b522d4d2232b368e24ed1e18bed1349f.jpg',
    backgroundType: 1,
    showComTitle: 0,
    comTitle: '无标题-背景图:双列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
    ],
  },
  {
    title: '图文',
    style: 2,
    styleText: '双列图',
    hasBackground: 0,
    bgColor: '#FFFFFF',
    bgImage: '',
    backgroundType: 0,
    showComTitle: 0,
    comTitle: '无标题+无背景双列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
    ],
  },
  {
    style: 3,
    comTitle: '标题+背景:三列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4852f1921859719acab1dda2104e08f2.png',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4df30dea65a75ad6112cb157044f1669.png',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/706c20f975f7fbc6e6023abfe1969fd5.png',
        link: '',
      },
    ],
    showComTitle: 1,
    backgroundType: 0,
    bgColor: '#FFFFFF',
    hasBackground: 1,
  },
  {
    style: 3,
    comTitle: '无标题-背景图:三列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4852f1921859719acab1dda2104e08f2.png',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4df30dea65a75ad6112cb157044f1669.png',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/706c20f975f7fbc6e6023abfe1969fd5.png',
        link: '',
      },
    ],
    showComTitle: 0,
    backgroundType: 1,
    bgColor: '#ff0000',
    bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/b522d4d2232b368e24ed1e18bed1349f.jpg',
    hasBackground: 1,
  },
  {
    style: 3,
    comTitle: '无标题-无背景图:  三列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4852f1921859719acab1dda2104e08f2.png',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4df30dea65a75ad6112cb157044f1669.png',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/706c20f975f7fbc6e6023abfe1969fd5.png',
        link: '',
      },
    ],
    showComTitle: 0,
    backgroundType: 1,
    bgColor: '#ff0000',
    bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/b522d4d2232b368e24ed1e18bed1349f.jpg',
    hasBackground: 0,
  },
  {
    title: '图文',
    style: 4,
    styleText: '四列图',
    hasBackground: 1,
    bgColor: '#FFFFFF',
    bgImage: '',
    backgroundType: 0,
    showComTitle: 1,
    comTitle: '标题+背景-->四列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
    ],
  },
  {
    title: '图文',
    style: 4,
    styleText: '四列图',
    hasBackground: 1,
    bgColor: '#FFFFFF',
    bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/b522d4d2232b368e24ed1e18bed1349f.jpg',
    backgroundType: 1,
    showComTitle: 0,
    comTitle: '无标题+背景图-->四列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
    ],
  },
  {
    title: '图文',
    style: 4,
    styleText: '四列图',
    hasBackground: 0,
    bgColor: '#FFFFFF',
    bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/b522d4d2232b368e24ed1e18bed1349f.jpg',
    backgroundType: 1,
    showComTitle: 0,
    comTitle: '无标题+无背景四列图',
    list: [
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
        link: '',
      },
      {
        url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
        link: '',
      },
    ],
  },
]

export const halfScreenConfig = [
  {
    title: '图文',
    styleText: '半屏双列图',
    list: [
      {
        hasBackground: 1,
        bgColor: '#FFFFFF',
        bgImage: '',
        backgroundType: 0,
        showComTitle: 1,
        comTitle: '标题+背景-半屏双列图',
        picList: [
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
            link: '',
          },
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
            link: '',
          },
        ],
      },
      {
        hasBackground: 1,
        bgColor: '#FFF0F5',
        bgImage: '',
        backgroundType: 0,
        showComTitle: 1,
        comTitle: '标题+背景-半屏双列图',
        picList: [
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
            link: '',
          },
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
            link: '',
          },
        ],
      },
    ],
  },
  {
    title: '图文',
    styleText: '半屏双列图',
    list: [
      {
        hasBackground: 1,
        bgColor: '#FFF0F5',
        bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4852f1921859719acab1dda2104e08f2.png',
        backgroundType: 1,
        showComTitle: 0,
        comTitle: '无标题-背景图',
        picList: [
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
            link: '',
          },
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
            link: '',
          },
        ],
      },
      {
        hasBackground: 1,
        bgColor: '#FFFFFF',
        bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4852f1921859719acab1dda2104e08f2.png',
        backgroundType: 1,
        showComTitle: 0,
        comTitle: '无标题-背景图',
        picList: [
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
            link: '',
          },
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
            link: '',
          },
        ],
      },
    ],
  },
  {
    title: '图文',
    styleText: '半屏双列图',
    list: [
      {
        hasBackground: 0,
        bgColor: '#FFF0F5',
        bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4852f1921859719acab1dda2104e08f2.png',
        backgroundType: 1,
        showComTitle: 0,
        comTitle: '无标题-无背景',
        picList: [
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
            link: '',
          },
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
            link: '',
          },
        ],
      },
      {
        hasBackground: 0,
        bgColor: '#FFFFFF',
        bgImage: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/4852f1921859719acab1dda2104e08f2.png',
        backgroundType: 1,
        showComTitle: 0,
        comTitle: '无标题-无背景',
        picList: [
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/328bbf893f792f03a54408b3b7a7ebf0.jpeg',
            link: '',
          },
          {
            url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/de6c4d93a3805b3ce3f323f7974e6f78.jpeg',
            link: '',
          },
        ],
      },
    ],
  },
]

/**
 * 统一的路径跳转
 * @param {Object} data
 * @returns
 */
export const toPage = (data) => {
  if (!data || !data.link) return

  let isLivePage = data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1

  if (isLivePage) {
    toMiniAppDistribution(data.link)
  } else {
    routerPathName(data.link)
  }
}
