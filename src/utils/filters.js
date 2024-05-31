import Vue from 'vue'

// 注册过滤器
import * as dict from '@/utils/dict'

Object.keys(dict).forEach(key => {
  Vue.filter(key, function(value) {
    const idx = dict[key].findIndex(item => item.value == value)
    return idx >= 0 ? dict[key][idx].label : ''
  })
})

