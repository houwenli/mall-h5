<template>
  <!-- 滑动区块组件 -->
  <div data-desc="滑动区块组件" class="slide_module" :style="getStyle">
    <div class="title" v-if="validConfig.showComTitle == 1"> {{validConfig.comTitle}}</div>
    <div class="image_list">
      <div class="img_item" v-for="(item, index) in validConfig.list" :key="index">
        <div @click.stop="navigate(item, index)" class="image" :style="getSingleItemStyle(item)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
import Cookies from 'js-cookie'
import { defaultSlideModuleConfig } from './data.js'
import { fillFiledForConfig } from '@/views/home/helper/index.js'

// 滑动组件
export default {
  name: 'SlideModule',
  props: {
    config: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    validConfig () {

      // let c = fillFiledForConfig(this.config, defaultSlideModuleConfig)

      // c.bgImageData = this.config.list.bgImageData
      // c.sildeshowList = this.config.list.sildeshowList

      // return c
      return this.config
    },
    getStyle () {
      return {
        backgroundImage: this.validConfig.bgImage ? `url(${this.validConfig.bgImage})` :'',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: this.validConfig.bgColor?this.validConfig.bgColor:'',
        padding:this.validConfig.bgImage || this.validConfig.comTitle || this.validConfig.bgColor? '' : '0'
      }
    }
  },

  methods: {
    /**
     * 单个图片的样式
     */
    getSingleItemStyle (item) {
      // 默认的占位图
      let defaultUrl = 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png'

      return {
        'background-image': item.url ? `url(${item.url})` : `url(${defaultUrl})`,
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center'
      }
    },

    navigate (data, index) {
      // 流量分析埋点
      if (index !== undefined) {
        let params = {
          name: "滑动区块",
          type: 7,
          image: data.url || '',
          url: data.link || '',
          index,
          channel_source: Cookies.get('_wsf_role')
        }
        this.$store.dispatch('BURIED_POINT/advertVisitRequest', params)
      }
      if (!data || !data.link) return
      let isLivePage = data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
      if (isLivePage) {
        toMiniAppDistribution(data.link)
      } else {
        routerPathName(data.link)
      }
    },
  },
}
</script>

<style scoped lang="less">
.slide_module {
  // padding: 1.84rem 0.4rem 0 0.4rem;
  position: relative;
  border-radius: 12px;
  // background-color: #fff;
  margin: 0 12px;
  padding: 43px 10px 12px 10px;
  box-sizing: border-box;
  .title{
    position:absolute;
    top : 12px;
    font-size: 15px;
    font-weight: 600;
    color: #222222;
  }
  .image_list {
    display: flex;
    overflow: auto;
    -ms-overflow-style: none; /* IE 10+ */
    scrollbar-width: none; /* Firefox */
    // padding-bottom: 5.5px;
    .img_item {
      box-sizing: border-box;
      margin-right: 8px;
      text-align: center;
      .image {
        width: 88px;
        height: 88px;
        border-radius: 0.4rem;
      }
    }
    .img_item:last-child {
      margin-right: 0rem;
    }
  }
  .image_list::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
