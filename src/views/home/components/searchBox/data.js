import { queryKeyword } from '@/api/seach'
import { cloneDeep } from 'lodash-es'

/**
 * 1、有历史缓存，无热词，就展示历史缓存
 * 2、无历史缓存，有热词，展示热词
 * 3、有历史缓存、有热词，先展示历史缓存，再展示热词
 */
export const getHotKeysList = async () => {
  let historyList = JSON.parse(localStorage.getItem('searchHistory')) || []

  // 调用接口
  try {
    let res = await queryKeyword()

    if (res.code === 200) {
      let list = res.data || []

      let hotKeys = list.map(p => p.name)

      return historyList.concat(hotKeys)
    }
  } catch (error) {
    console.log('首页-查询搜索发现热词，失败', error)
    return []
  }
}

/**
 * 当前组件所需要的默认配置
 */
export const defaultConfig = {
  headerBg: {
    bgColor: '',
    bgImage: '',
    // 0 背景颜色， 1背景图片
    backgroundType: ''
  },
  // 消息图标
  iconMassageUrl: '',
  slideshowImageList: [],
  // 页眉广告
  smallAdList: []
}