<template>
  <div :style="[getPageStyle]" class="page-box">
    <div class="header-container" :style="getHeaderBgStyle">
      <div style="display: flex">
        <div class="config-icon" @click="goBack">
          <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt="" />
        </div>
        <!-- <div class="config-icon">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-more.png" alt="" />
      </div> -->
      </div>
      <div class="header-title">{{ config.pageTitle }}</div>
      <div class="placeholder"></div>
    </div>

    <div v-for="(element, index) in contentList" :key="element.id" class="list-group">
      <div v-if="index <= renderIndex || renderIndex === -1" class="list-group-item">
        <template v-if="element.text === '轮播图'">
          <swipe :config="element"></swipe>
        </template>

        <template v-else-if="element.text === '半屏双列图'">
          <group2Image :config="element" />
        </template>

        <!-- 1-4列图 -->
        <template v-else-if="showGroupImageComponent(element)">
          <groupImage2 :config="element" isShowComTitle></groupImage2>
        </template>

        <template v-else-if="element.text === '滑动区块'">
          <slideModule :config="element" />
        </template>
        <template v-else-if="element.text === '图片魔方'">
          <cubeImage :config="element" />
        </template>

        <template v-else-if="element.text === '公告'">
          <notice-bar :listData="element"></notice-bar>
        </template>
        <template v-else-if="element.text === '辅助空白'">
          <blank :listData="element"></blank>
        </template>
        <template v-else-if="['单列商品', '双列商品', '三列商品'].includes(element.text)">
          <singleListProducts
            :listData="element"
            :index="index"
            :goodsParticipateNum.sync="goodsParticipateNum"
            :renderProductNum.sync="renderProductNum"
            @finished="onFinished"
          ></singleListProducts>
        </template>
      </div>
    </div>

    <!-- 浮动按钮 -->
    <template v-if="floatBtnData.showConfig && showFloat">
      <div class="float_button">
        <van-icon @click="showFloat = false" :name="floatBoxCloseIcon" size="20px"></van-icon>
        <div class="content">
          <img v-if="floatBtnData.url" @click="navigate(floatBtnData)" :src="floatBtnData.url" />
          <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/dae7a941e28fc339bd5991257778a99c.png" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import swipe from '@/components/index/template/swipe/index.vue'
  import group2Image from '@/views/home/components/group-2-image/index.vue'
  import slideModule from '@/components/index/template/SlideModule/index.vue'
  import cubeImage from '@/views/home/components/cube-image/index.vue'
  import noticeBar from '@/components/index/template/noticeBar/index.vue'
  import blank from '@/components/index/template/blank/index.vue'
  import groupImage2 from '@/views/home/components/group-image/index.vue'
  import singleListProducts from './components/listProducts/index.vue'
  import floatBoxCloseIcon from '@/assets/img/float-box-close.png'

  import { routerPathName, toMiniAppDistribution, appBack } from '@/utils/utils'
  import Cookies from 'js-cookie'
  export default {
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        },
      },

      moduleData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    components: {
      swipe,
      group2Image,
      slideModule,
      cubeImage,
      noticeBar,
      blank,
      groupImage2,
      singleListProducts,
      // pageNav: (resolve) => require(['@/views/home/components/pageNav/index.vue'], resolve),
      // swipe: (resolve) => require(['@/components/index/template/swipe/index.vue'], resolve),
      // group2Image: (resolve) => require(['@/views/home/components/group-2-image/index.vue'], resolve),
      // slideModule: (resolve) => require(['@/components/index/template/SlideModule/index.vue'], resolve),
      // cubeImage: (resolve) => require(['@/views/home/components/cube-image/index.vue'], resolve),
      // seckill: (resolve) => require(['@/components/index/template/seckill/index.vue'], resolve),
      // distribution: (resolve) => require(['@/components/index/template/distribution/index.vue'], resolve),
      // noticeBar: (resolve) => require(['@/components/index/template/noticeBar/index.vue'], resolve),
      // blank: (resolve) => require(['@/components/index/template/blank/index.vue'], resolve),
      // groupImage2: (resolve) => require(['@/views/home/components/group-image/index.vue'], resolve)
    },

    data() {
      return {
        finishedList: [],
        renderIndex: -1,
        renderProductNum: 0,
        floatBoxCloseIcon,
        showFloat: true // 浮动按钮默认显示
      }
    },

    computed: {
      goodsParticipateNum() {
        console.log(this.moduleData)
        let data = this.moduleData || {}
        return data.goodsParticipateNum
      },

      contentList({ config }) {
        return config.contentList
      },

      floatBtnData({ config }) {
        return config.floatBtnData || {}
      },

      /**
       * 获取页面的背景图片配置
       */
      getPageStyle({ config }) {
        let { headerData } = config,
          { pageNavBg } = headerData,
          { backgroundType, bgImage = '', bgColor } = pageNavBg
        if (String(backgroundType) === '1') {
          // 默认为图片， 但是没传背景图的话，就设置为白色
          if (bgImage === '') {
            return { background: '#fff' }
          }

          return {
            backgroundImage: `url(${bgImage})`,
          }
        }

        if (String(backgroundType) === '0') {
          return {
            background: bgColor,
          }
        }

        return {}
      },

      getHeaderBgStyle({ config }) {
        if (String(config.headerData.headerBg.backgroundType) === '1') {
          return {
            'background-image': 'url(' + config.headerData.headerBg.bgImage + ')',
          }
        } else {
          return {
            'background-color': config.headerData.headerBg.bgColor,
          }
        }
      },
    },

    created() {
      this.config.contentList.forEach((item, index) => {
        // 记录下拉加载索引位置
        if (['单列商品', '双列商品', '三列商品'].includes(item.text)) {
          this.finishedList.push(index)
        }
      })
      this.renderIndex = this.finishedList.length > 0 ? this.finishedList[0] : -1
    },

    methods: {
      navigate(data) {
        // 流量分析埋点
        let params = {
          name: '浮动按钮',
          type: 11,
          image: data.url || '',
          url: data.link || '',
          channel_source: Cookies.get('_wsf_role'),
        }
        this.$store.dispatch('BURIED_POINT/advertVisitRequest', params)
        if (!data || !data.link) return
        let isLivePage =
          data.link.indexOf('pages/livePlayer/livePlayer') !== -1 || data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
        if (isLivePage) {
          toMiniAppDistribution(data.link)
        } else {
          routerPathName(data.link)
        }
      },

      //返回
      goBack() {       
        appBack(this)
      },

      showGroupImageComponent(item) {
        return ['单列图', '双列图', '三列图', '四列图'].includes(item.text)
      },

      onFinished() {
        this.finishedList.shift()
        this.renderIndex = this.finishedList.length > 0 ? this.finishedList[0] : -1
      },
    },
  }
</script>
<style lang="less" scoped>
  .header-container {
    position: fixed;
    top: 0;
    width: 100%;
    height: 44px;
    padding-left: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    z-index: 10;
    background-size: 100% auto;
    .config-icon {
      margin-right: 8px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .header-title {
      flex: 1;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #000;
      font-size: 18px;
    }
    .placeholder {
      width: 40px;
    }
  }
  .page-box {
    min-height: 100vh;
    width: 100%;
    padding-top: 56px;
    // overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    // overflow-y: scroll;
    background: #f6f6f6;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  .list-group-item {
    padding-bottom: 10px;
    width: 100vw;
    overflow: hidden;
  }
  .list-group:first-of-type .list-group-item {
    padding-top: 10px;
  }
  /deep/ .shop-card {
    margin-top: 10px;
    margin-bottom: 0 !important;
    &:first-child {
      margin-top: 0;
    }
  }
  .float_button {
    width: 2.4rem;
    height: 2.4rem;
    position: fixed;
    bottom: 160px;
    right: 0.4rem;
    z-index: 2;
    i {
      font-size: 0.56rem;
      color: #999;
      z-index: 2;
      position: absolute;
      top: -1rem;
      right: 0;
    }
    .content {
      position: relative;
      width: 2.4rem;
      height: 2.4rem;
      background: transparent;
      img {
        width: 2.4rem;
        height: 2.4rem;
        display: block;
      }
    }
  }
</style>
