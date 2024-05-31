/**
 * 分类广告只会有如下这些组件
 */
export const categoryAdComponentsMap = [
  {
    loader: () => import('@/components/index/template/swipe/index.vue'),
    text: '轮播图',
    key: 'swipe'
  },
  {
    loader: () => import('@/views/home/components/group-2-image/index.vue'),
    text: '半屏双列图',
    key: 'group2Image'
  },
  {
    // 1-4列 - 特殊
    loader: () => import('@/views/home/components/group-image/index.vue'),
    text: '多列图',
    key: 'groupImage2'
  },
  {
    loader: () => import('../cube-image/index.vue'),
    text: '图片魔方',
    key: 'cubeImage'
  },
  {
    loader: () => import('@/components/index/template/SlideModule'),
    text: '滑动区块',
    key: 'slideModule'
  },
  {
    // 特殊处理-这里其实表达的意思是二级分类（二级分类和金刚区是一模一样的布局和配置）
    text: '金刚区',
    key: 'page-nav',
    loader: () => import('./second-category.vue')
  }
]


/**
 * 根据接口类型获取分类广告的组件
 * @param {Object} item
 */
export const getCategoryAdComponent = (item) => {
  let isgroupImage2 = ['单列图', '双列图', '三列图', '四列图'].includes(item.text)

  // 走统一逻辑处理
  if (isgroupImage2) {
    item.text = '多列图'
  }

  let p = categoryAdComponentsMap.find(p => p.text === item.text)

  if (p) {
    return p
  }
}