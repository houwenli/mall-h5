<template>
  <div :style="[style]" class="header-content">
    <template v-if="headerType == 1">
      <header-top-style1 :bgType="bgType"></header-top-style1>
    </template>
    <template v-else-if="headerType == 2"><header-top-style2 :bgType="bgType"></header-top-style2></template>

    <template v-else-if="headerType == 3"><header-top-style3 :bgType="bgType"></header-top-style3></template>

    <div>
      <div class="search-container">
        <div class="search-input-box">
          <div class="search-input-icon" @click="goSearchPage()"></div>
          <input class="search-input" type="text" disabled="true" @click="goSearchPage()" />
          <div class="search-button" @click="handleSearch()">搜索</div>
          <div class="swiper-word-box" v-if="hotWordList && hotWordList.length">
            <van-swipe
              class="swiper-word"
              vertical
              autoplay="3000"
              :show-indicators="false"
              :touchable="false"
              :current="hotWordCurrent"
              @change="changeHotWord"
            >
              <van-swipe-item v-for="(item, index) in hotWordList" :key="index" class="item" @click="goSearchPage()">
                {{ item }}
              </van-swipe-item>
            </van-swipe>
          </div>
          <div v-else class="default-placeholder" @click="goSearchPage()">请输入搜索关键字</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Swipe, SwipeItem } from 'vant'
  import headerTopStyle1 from './header-top-style1.vue'
  import headerTopStyle2 from './header-top-style2.vue'
  import headerTopStyle3 from './header-top-style3.vue'
  import { queryKeyword } from '@/api/seach'
  export default {
    props: {

      bgType: {
        type: [Number, String]
      },

      headerData: {
        type: Object
      },

      fromPage: {
        type: String,
        default: 'distributionIndex',
      },

      // 顶部类型   1：底部tab切换（分享购） 2：deeplink直接进入 3：分享页面进入
      headerType: {
        type: Number
      }
    },
    components: {
      // headerTopStyle1: () => import('./header-top-style1.vue'),
      // headerTopStyle2: () => import('./header-top-style2.vue'),
      // headerTopStyle3: () => import('./header-top-style3.vue'),
      headerTopStyle1,
      headerTopStyle2,
      headerTopStyle3,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
    },

    data() {
      return {
        hotWordList: [],
        hotWordCurrent: 0,
        isAutoPlay: true,
        lastHotWordCurrent: -1,
      }
    },
    computed: {
      style() {
        // 1: 浅色 2深色
        // let bgimg = this.headerData.headerBg.backgroundType == 1 ?
        // let background = `url(${bgimg}) no-repeat`
        let { backgroundType, bgImage, bgColor } = this.headerData
        let background = backgroundType == 1 ? `url(${bgImage})` : bgColor ? `linear-gradient(${bgColor}, ${bgColor})` : '#fff'
        return {
          'background-image': background,
          // backgroundSize: this.bgSize,
        }
      },
    },


    activated() {
      this.getHotKeys()
      this.hotWordCurrent = 0
    },

    methods: {
      /**
       * 查询热词
       */
      async getHotKeys() {
        let historyList = JSON.parse(localStorage.getItem('/distributionActivitysearchHistory')) || []

        // 调用接口
        try {
          let res = await queryKeyword()
          console.log(res, '-----------')
          if (res.code === 200) {
            let list = res.data || []

            let hotKeys = list.map((p) => p.name)

            historyList = historyList.concat(hotKeys)
          }
        } catch (error) {
          console.log('首页-查询搜索发现热词，失败', error)
          historyList = []
        }
        this.hotWordList = historyList
      },

      changeHotWord(index) {
        this.lastHotWordCurrent = this.hotWordCurrent
        this.hotWordCurrent = index
      },

      //首页热词搜索
      handleSearch() {
        if (this.hotWordList && this.hotWordList.length) {
          let name = this.hotWordList[this.hotWordCurrent] || ''
          this.$router.push({
            path: '/spulist',
            query: {
              paht: '/spulist',
              from: '/distributionActivity',
              promoteInfo: this.$route.query.promoteInfo,
              queryString: name,
            },
          })
        } else {
          this.$router.push({
            path: '/spulist',
            query: {
              path: '/spulist',
              from: '/distributionActivity',
              promoteInfo: this.$route.query.promoteInfo,
            },
          })
        }
      },
      goSearchPage() {
        let searchValue = this.hotWordList[this.hotWordCurrent] || ''
        if (this.hotWordList && this.hotWordList.length) {
          this.$router.push({
            path: '/search',
            query: {
              path: '/spulist',
              from: '/distributionActivity',
              promoteInfo: this.$route.query.promoteInfo,
              searchValue,
            },
          })
        } else {
          
          this.$router.push({
            path: '/search',
            query: {
              path: '/spulist',
              from: '/distributionActivity',
              promoteInfo: this.$route.query.promoteInfo,
              searchValue,
            },
          })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .header-content {
    overflow: hidden;
    position: fixed;
    z-index: 998;
    top: 0;
    right: 0;
    left: 0;
    background-size: 100% auto !important;
    background-color: #fff;
  }
  .search-container {
    width: 100%;
    height: 36px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .search-input-box {
      height: 32px;
      width: 100%;
      background: #fff;
      border-radius: 18px;
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid #ff1538;
      box-shadow: 0 0 0 0.5px #ffbcbb;

      .search-input-icon {
        margin: 0 8px;
        width: 16px;
        height: 16px;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-mall-h5-home-search-read-32.png') no-repeat center center;
        background-size: 16px 16px;
      }

      .search-input {
        flex: 1;
        height: 32px;
        border: 0;
        background: 0;
        color: #999999;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 32px;
      }

      .search-button {
        margin-right: 2px;
        width: 70px;
        height: 28px;
        background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
        border-radius: 18px;
        line-height: 28px;
        text-align: center;
        font-size: 13px;
        color: #fff;
      }

      .swiper-word-box {
        position: absolute;
        left: 40px;
        top: 0;
        height: 32px;
        width: 205px;
        display: flex;
        align-items: center;
        overflow: hidden;
        .swiper-word {
          width: 100%;
          height: 20px;
          overflow: hidden;
          .item {
            width: 100%;
            height: 20px;
            color: #6e6e6e;
            line-height: 20px;
            font-size: 14px;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .fade-in-item {
            animation: fadeIn 0.5s linear;
          }

          .fade-out-item {
            animation: fadeOut 0.5s linear;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }

            to {
              opacity: 0;
            }
          }
        }
      }

      .default-placeholder {
        position: absolute;
        left: 40px;
        top: 0;
        height: 36px;
        width: 125px;
        line-height: 36px;
        font-size: 14px;
        color: #c6c6c6;
      }
    }

    .message {
      width: 24px;
      height: 24px;
      z-index: 99;
      margin-left: 12px;

      .message-icon {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
