<template>
  <div class="group-panel" :style="getStyle">
    <div class="title" v-if="config.hasBackground === '1' && config.showComTitle === '1'">{{ config.comTitle }}</div>
    <!-- 动态组件 -->
    <components v-if="componentName" :is="componentName" :config="config"></components>
  </div>
</template>

<script>
import {testConfig} from './data.js'
// 魔方图片
export default {
  name: 'cube-image',
  components: {
    "style-1": () => import('./style-1.vue'),
    "style-2": () => import('./style-2.vue'),
    "style-3": () => import('./style-3.vue'),
    "style-4": () => import('./style-4.vue'),
    "style-5": () => import('./style-5.vue')
  },
  props: {
    config: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {}
  },
  computed: {
    /**
     * 根据配置返回组件名
     */
    componentName () {
      // 容错
      let styleType = this.config.style
      if (styleType === null || styleType === undefined) {
        console.warn('图文组件获取动态组件错误-cube-image', this.config)
        return ''
      }

      if (![1, 2, 3, 4, 5].includes(Number(styleType))) {
        console.warn('图文组件 获取组件类型错误 -cube-image', styleType)
        return
      }

        return `style-${this.config.style}`
      },
      getStyle() {
        let styles = {}
        // 没有背景
        if (Number(this.config.hasBackground) === 0) {
          return {
            padding: '0px',
          }
        }
        //图背景高度
        // let height = this.config.style === 4 ? '126px' : '154px'

        if (String(this.config.hasBackground) === '0') {
          styles.background = this.config.bgColor || '#FFF'
          // styles.height = height
        }

        if (String(this.config.hasBackground) === '1') {
          // styles.height = height
          if(this.config.bgImage){
            styles.backgroundImage = `url(${this.config.bgImage})`
            styles.backgroundRepeat = 'no-repeat'
            styles.backgroundSize = '100% 100%'
          }else{
            styles.background = this.config.bgColor || '#FFF'
          }
        }
        return styles
      }
    },

}
</script>

<style lang="less" scoped>
.group-panel {
  margin: 0 12px;
  border-radius: 16px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .title {
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
    margin-bottom: 8px;

  }
}
</style>
