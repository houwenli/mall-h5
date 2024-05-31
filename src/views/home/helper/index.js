/**
 * 只在当前业务场景试用的函数 - 所以不需要放到全局的utils中
 */

import { cloneDeep } from 'lodash-es'

/**
 * 容错-对接口错误字段格式或者字段缺失的问题导致页面报错进行兜底
 * @param {Object} fields 接口字段
 * @param {Object} defaultConfig 前端定义的默认字段
 */
 export const fillFiledForConfig = (fields, defaultConfig) => {
  // 因为fields是vuex中的引用对象，避免vuex中动态添加字段造成额外的问题，拷贝一份
  let c = cloneDeep(fields) || {}

  Object.keys(defaultConfig).forEach(key => {
    if (c.hasOwnProperty(key)) {
      // 判断数据格式是否一致
      let t1 = Object.prototype.toString.call(c[key])
      let t2 = Object.prototype.toString.call(defaultConfig[key])

      // 数据结构不一致
      if (t1 !== t2) {
        console.warn('后台返回的数据结构和前端需要的结构不一致', '期望：key的值', defaultConfig[key], c[key])
        c[key] = defaultConfig[key]
      }
    } else {
      // 补齐字段
      c[key] = defaultConfig[key]
    }
  })

  return c
}

/**
 * 1-4列图-默认的数据结构
 */
 const defaultGroupImageConfig = {
  text: '',
  title: '',
  // 对应的是 code   1--单列图 2双列图  3三列图  4四列图
  style: '',
  // 这个最好不用 - 仅仅用来做debug看接口用的 单列图
  styleText: '',
  // 1-有背景/0-无背景
  hasBackground: '',
  // 背景色
  bgColor: '',
  // 背景图片url
  bgImage: '',
  // 背景类型 决定取上面的哪个字段展示， 到底是背景颜色还是背景图片
  backgroundType: '',
  // 0隐藏名称-1显示名称
  showComTitle: '',
  // 组件标题
  comTitle: '',
  list: []
}

/**
 * 将1-4列图数据处理成标准数据结构 - 平台后台接口待优化 - 废弃
 * @param {Object} item
 */
export const adaptergroupImageConfig = (item) => {
  let c = {}

  let fn = (index) => {
    let t = item.list[index]

    Object.keys(defaultGroupImageConfig).forEach(key => {
      c[key] = t[key]
    })

    c.title = item.title
    c.text = item.text
    c.styleText = item.text

    c.list = t.list
  }

  switch (item.text) {
    case "单列图":
      fn(0)
      break;
    case "双列图":
      fn(1)
      break
    case "三列图":
      fn(2)
      break;
    default: "四列图"
      fn(3)
      break;
  }

  return c
}

export const showGroupImageComponent = (item) => {
  return ['单列图', '双列图', '三列图', '四列图'].includes(item.text)
}