import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
/**
 * 半屏双列图数据结构
 */
export const defaultConfig = {
  title: '',
  styleText: '',
  icon:'',
  hasBackground:'',
  list: [
    {
      bgColor: '',
      bgImage: '',
      backgroundType: '',
      showComTitle: '',
      comTitle: '',
      picList: [
        {
          url: '',
          link: '',
        },
        {
          url: '',
          link: '',
        },
      ],
    },
    {
      bgColor: '',
      bgImage: '',
      backgroundType: '',
      showComTitle: '',
      comTitle: '',
      picList: [
        {
          url: '',
          link: '',
        },
        {
          url: '',
          link: '',
        },
      ],
    },
  ],
}

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
