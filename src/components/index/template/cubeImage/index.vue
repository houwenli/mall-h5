<template>
  <!-- 图片魔方 -->
  <div data-desc="图片魔方" class="cube_image" :style="getStyle">
    <div class="title" v-if="String(validConifg.hasBackground) === '1'">
      <div v-if="Number(validConifg.showComTitle) === 1">{{ validConifg.comTitle }}</div>
    </div>

    <div class="cube-list-container" :style="getCubeListContainerHeight">
      <div class="cube-image-left-panel" :style="getLeftPanelStyle">
        <van-swipe class="my-swipe" :autoplay="3000" :duration="500" indicator-color="white" v-if='validConifg.styleImages.slideshowImageList.length'>
          <van-swipe-item v-for="(item, index) in validConifg.styleImages.slideshowImageList" :key="item.id">
            <img class="left-pic-item-pic" v-if="item.url" :src="item.url" @click="navigate(item, index)" />
            <img class="left-pic-item-pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png" />
          </van-swipe-item>
        </van-swipe>
        <img v-else class="cube-img-default-logo" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png" alt="">
      </div>
      <div class="cube-image-right-panel" >
        <div class="right-pic-item" :style="getSmallPicStyle">
          <img
            class="right-pic-item-pic"
            v-if="validConifg.styleImages.imgList[0].url"
            :src="validConifg.styleImages.imgList[0].url"
            @click="navigate(validConifg.styleImages.imgList[0], 5)"
          />
          <img v-else class="cube-img-default-logo" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png" />
        </div>
        <div class="right-pic-item" :style="getSmallPicStyle">
          <img
            class="right-pic-item-pic"
            v-if="validConifg.styleImages.imgList[1].url"
            :src="validConifg.styleImages.imgList[1].url"
            @click="navigate(validConifg.styleImages.imgList[1], 6)"
          />
          <img v-else class="cube-img-default-logo" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
import { routerPathName, toMiniAppDistribution } from '@/utils/utils'
import Cookies from 'js-cookie'
import { defaultCubeImageConfig } from './data.js'
import { fillFiledForConfig } from '@/views/home/helper/index.js'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'cubeImage',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  props: {
    config: {
      type: Object,
      default: () => { }
    },
  },

  computed: {
    validConifg () {
      let c = cloneDeep(this.config)
      // 拿到默认配置
      let d = defaultCubeImageConfig(1)


      /**后续-平台后台，字段标准化以后， 以下数据处理都不需要了 */

      c.styleImages = {
        slideshowImageList: [],
        imgList: []
      }

      c.styleImages.slideshowImageList = cloneDeep(c.list.slideshowImageList)

      if (c.list.imageRightUp) {
        c.styleImages.imgList.push(
          cloneDeep(c.list.imageRightUp)
        )
      }

      if (c.list.imageRightDown) {
        c.styleImages.imgList.push(cloneDeep(c.list.imageRightDown))
      }

      // 删除多余的字段
      delete c.list.slideshowImageList
      delete c.list.slideshowImageList
      delete c.list.imageRightUp
      delete c.list.imageRightDown

      // 将list里面的子配置字段，copy一份到d上 - 后续优化掉平台后台产出配置的地方，这里就可以不需要了
      Object.keys(c.list).forEach(key => {
        if (d.hasOwnProperty(key)) {
          d[key] = c.list[key]
        }
      })

      /**后续-平台后台，字段标准化以后， 以上数据处理都不需要了 end */

      // 再标准化字段
      let result = fillFiledForConfig(c, d)

      return result
    },

    getStyle () {
      let styles = {}

      if (String(this.validConifg.hasBackground) === '0') {
        styles.background = ''
        styles.padding = '0'
      }

      // 背景颜色 - 因为配置输出端，没有做数据清除的动作，这里的配置是有脏数据的
      if (String(this.validConifg.radio) === '1' && String(this.validConifg.hasBackground) === '1') {
        styles.background = this.validConifg.bgColor
        styles.paddingBottom = '12px'
        styles.paddingLeft = '12px'
        styles.paddingRight = '12px'
      }

      if (String(this.validConifg.radio) === '2') {
        styles.backgroundImage = `url(${this.validConifg.bgImage})`
        styles.backgroundRepeat = 'no-repeat'
        styles.backgroundSize = '100% 100%'
        styles.paddingBottom = '12px'
        styles.paddingLeft = '12px'
        styles.paddingRight = '12px'
      }

      return styles
    },

    getCubeListContainerHeight () {
      let height = ''

      if (Number(this.validConifg.hasBackground) === 0) {
        height = '232px'
      } else {
        height = '208px'
      }

      return {
        height
      }
    },

    getSmallPicStyle () {
      // 无背景场景
      if (String(this.validConifg.hasBackground) === '0') {
        return {
          height: '110px'

        }
      }

      return {
        height: '100px'
      }
    },

    /**
     * 左侧轮播图
     * 1、无背景，隐藏名称的情况下  width: 170
     * 2、其他情况 158
     */
    getLeftPanelStyle() {
      if (String(this.validConifg.hasBackground) === '0') {
        return {
          width: '49%'
        }
      } else{
        return "49%"
      }
    }
  },

  methods: {
    navigate (data, index) {
      console.log(data)
      // 流量分析埋点
      let params = {
        name: '图片魔方',
        image: data.url || '',
        url: data.link || '',
        type: 8,
        index,
        channel_source: Cookies.get('_wsf_role')
      }
      this.$store.dispatch('BURIED_POINT/advertVisitRequest', params)
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
.cube_image {
  box-sizing: border-box;
  border-radius: 12px;
  margin: 0 12px;


  .title {
    height: 40px;
    padding-top: 12px;
    box-sizing: border-box;
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
  }

  .cube-list-container {
    display: flex;
    justify-content: space-between;
  }

  .cube-image-left-panel {
	display: flex;	
    // width: 158px;
    width: 49%;
    // margin-right: 11px;
    background: #FBFBFB;
    border-radius: 8px;

    .cube-img-default-logo {
      margin: 0 auto;
    }

    .my-swipe {
      width: 100%;
    }
    .left-pic-item-pic {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 12px;
    }

    img[src=''] {
      opacity: 0;
    }
  }

  .cube-image-right-panel {
    display: flex;
    // flex: 1;
    width: 49%;
    flex-wrap: nowrap;
    flex-direction: column;
    justify-content: space-between;

    .right-pic-item {
      display: flex;
      align-content: center;
      justify-content: center;

      border-radius: 12px;
      overflow: hidden;
      // width: 158px;
      width: 100%;
      height: 100px;
      background: #FBFBFB;
      overflow: hidden;

      .right-pic-item-pic {
        width: 100%;
        max-height: 100%;
        border-radius: 12px;
      }

      img[src=''] {
        opacity: 0;
      }
    }
  }

  .cube-img-default-logo {
    width: 77px;
    height: 28px;
    align-self: center;
    border-radius: 0;
  }
}
</style>
