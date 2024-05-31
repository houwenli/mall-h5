<template>
  <div class="group-panel" :style="getStyle">
    <div v-if="config.hasBackground == '1'" class="title">
      <div v-if="config.showComTitle == '1'">{{ config.comTitle }}</div>
    </div>
    <!-- 动态组件 -->
    <components v-if="componentName" :is="componentName" :config="configData"></components>
  </div>
</template>

<script>
export default {
  name: 'group-image',
  components: {
    "style-1": () => import('./style-1.vue'),
    "style-2": () => import('./style-2.vue'),
    "style-3": () => import('./style-3.vue'),
    "style-4": () => import('./style-4.vue')
  },
  props: {
    config: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    // 浅拷贝 几列图截取几
    configData () {
      let data = this.config.list.slice(0,this.config.style)
      let obj = {
        ...this.config,
        list:data
      }
      return obj
    },
    /**
     * 根据配置返回组件名
     */
    componentName () {
      // 容错
      let styleType = this.config.style
      if (styleType === null || styleType === undefined) {
        console.warn('图文组件获取动态组件错误-group-image', this.config)
        return ''
      }

      if (![1, 2, 3, 4].includes(Number(styleType))) {
        console.warn('图文组件 获取组件类型错误 -group-image', styleType)
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
        //四列图背景高度与单、二、三列图不一致
        let height = this.config.style === 4 ? '126px' : '154px'

        if (String(this.config.backgroundType) === '0') {
          styles.background = this.config.bgColor || '#FFF'
          // styles.height = height
        }

        if (String(this.config.backgroundType) === '1') {
          // styles.height = height
          if(this.config.bgImage){
            styles.backgroundImage = `url(${this.config.bgImage})`
            styles.backgroundRepeat = 'no-repeat'
            styles.backgroundSize = '100% 100%'
          }else{
            styles.background = '#FFF'
          }
        }

        return styles
      }
    },
  }
</script>

<style lang="less" scoped>
// 这里只会有一些padding之类的东西

.group-panel {
  margin: 0 12px;
  border-radius: 16px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .title {
    height: 30px;
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
    // margin-bottom: 8px;

  }
}
</style>
