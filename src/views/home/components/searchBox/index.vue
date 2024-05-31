<template>
  <div class="searchBox"  data-desc="搜索" @touchmove.stop.prevent>
    <div class="search-container" :style="getStyle">
      <div class="title-container" data-desc="标题">
        <template v-if="(appData && appData.appScheme === 'wsf')">
          <div class="title-preference">
            <img class="back_icon" @click="appBack" src="../../../../assets/img/whiteBack.png" alt="">
            <img class="goods_icon" src="../../../../assets/img/wsf_goods.png" alt="">
          </div>
        </template>
        <template v-else>
          <!-- 标题图片 -->
          <div data-desc="标题图片" class="title-pic">
            <img class="center" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-logo-white.png" alt="" />
          </div>
          <!-- 关闭图标 -->
          <!-- 无返回时占位 -->
          <div v-if="env == ENV.noApp" class="left"></div>
          <!-- 智慧生活app关闭 -->
          <img v-if="env == ENV.smartLife" class="left" data-desc="关闭图标" @click="toNext" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-close.png" alt="" />
          <!-- 其他app返回 -->
          <img v-if="env == ENV.otherApp" class="left" data-desc="返回图标" @click="toSmartlife" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart-mall-back.png" alt="" />

          <!-- 页眉广告 -->
          <div data-desc="页眉广告" class="right" :key='refreshKey'>
            <!-- 禁用在手机上拖拽 -->
            <van-swipe style="width: 100%; height: 100%;" vertical autoplay="3000" :show-indicators="false" :touchable="false" v-if="config.smallAdList.length">
              <van-swipe-item v-for="(item, index) in config.smallAdList" :key="index">
                <img class="ad-img-pic" :src="item.url" @click="toAdPage(item)" />
              </van-swipe-item>
            </van-swipe>
          </div>
        </template>
      </div>

      <div class="search-content" data-desc="搜索框">
        <div class="left">
          <!-- 搜索图标 -->
          <img class="home-search-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-mall-h5-home-search-read-32.png" @click="onSearch" />
          <div class="home-search-input-palcehoder-text" @click="onSearch" :key='refreshKey'>
            <van-swipe v-if="hotKeys.length" vertical autoplay="3000" duration="500" :show-indicators="false" @change="onChange">
                <van-swipe-item ref="swiper" v-for="(tag, index) in hotKeys" :key="index" ><transition name="hotKeys"><span v-show="keywordIndex==index">{{ tag.length > 14 ? tag.substr(0, 14) + '...' : tag}}</span></transition></van-swipe-item>
            </van-swipe>
            <div v-else>请输入搜索关键词</div>
          </div>
          <div class="search-btn" @click="toSearchGoodsList()">搜索</div>
        </div>
        <!-- 消息 -->
        <!-- unreadMessageNum > 0 && -->
        <img class="home-search-notice-icon" @click="toMyNews" :src="config.iconMassageUrl" v-if="config.iconMassageUrl" />
        <img class="home-search-notice-icon-placeholder" @click="toMyNews" v-else src='https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/5416eb3222d73b6e6dfb5bcd0d77c9d5.png'/>
      </div>
    </div>

    <!-- 占位 -->
    <!-- 场景1：从智慧生活app进 height:88px 计算成vw
         场景2：从叫车或者单独进 height:112px 计算成vw
    -->
    <div class="search-container-placeholder"  :style="{'height': (appData && appData.appScheme === 'wsf') ? '23.4666667vw' :'29.8666667vw'}"></div>
  </div>
</template>

<script>
// 定义环境枚举值，目前只用区分，智慧生活app，非智慧生活app，非app
const ENV = {
  smartLife: Symbol(),
  otherApp: Symbol(),
  noApp: Symbol(),
}
// 首页顶部搜索框
import { queryNewsReadNums } from '@/api/mynews'
import { getToken } from '@/utils/token'
import { routerPathName, toMiniAppDistribution, getUsersource } from '@/utils/utils'
import { getHotKeysList, defaultConfig } from './data.js'
import { fillFiledForConfig } from '../../helper/index.js'
import { mapState } from 'vuex'
import { smartOpenDeepLink } from '@/utils/hybrid'
import { USER_SOURCE } from '@/constants/userinfo'
export default {
  name: 'searchBox',

  data () {
    return {
      // 热词
      hotKeys: [],
      keywordIndex: 0,
      // 未读消息数量
      unreadMessageNum: 0,

      refreshKey: 0,
      appData: JSON.parse(localStorage.getItem('appData')),

      // 环境信息，是否app内嵌
      ENV,
    }
  },

  computed: {
    ...mapState({
      config: state => {
        let c = fillFiledForConfig(state.HOME_PAGE_CONFIG.headerData, defaultConfig)

        return c
      }
    }),

    /**
     * 顶部背景图，搜索框到顶部
     */
    getStyle () {
       /**
        * 场景1：从智慧生活app进 height:88px 计算成vw
        * 场景2：从叫车或者单独进 height:112px 计算成vw
        */
        let height = '29.8666667vw'
        if(this.appData && this.appData.appScheme === 'wsf'){
            height = '23.4666667vw'
        }
      let { backgroundType, bgImage, bgColor } = this.config.headerBg
      if (String(backgroundType) === '1') {
        return {
          height,
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% auto'
        }
      }

      if (String(backgroundType) === '0') {
        return {
          height,
          background: bgColor
        }
      }

      return {
        height
      }
    },
    // 获取环境判断，左上角按钮展示
    // 非智慧生活app环境 展示返回按钮，回到智慧生活外层壳子
    // 智慧生活app环境 展示关闭按钮，回到智慧生活app
    // 非app环境，不展示左上角按钮
    env () {
      let userSource = getUsersource()
      if (!userSource || userSource == USER_SOURCE.wsmall) {
        return ENV.noApp
      }
      if(userSource == USER_SOURCE.smartLife) {
        return ENV.smartLife
      } else {
        return ENV.otherApp
      }
    }
  },

  /**
   * 首页是缓存了的，处理热词这里需要重新调用一次
   */
  activated () {
    this.getHotKeys()

    // 整个首页被缓存了，每次点击页眉广告，跳进去，再返回，vant的 swipe 高度变了
    this.refreshKey = Date.now()
  },

  mounted () {
    this.getHotKeys()

    if (getToken()) {
      this.unreadMessage()
    }
  },

  methods: {
    appBack(){
      smartOpenDeepLink('wsf://app/pagehome?tab=home')
    },
    nextHotKeys(){
      console.log('=====128719271928====');
    },
    /**
     * 查询热词
     */
    async getHotKeys () {
      this.hotKeys = await getHotKeysList()
    },

    /**
     * 查询未读消息
     *
     * 看是否要做 有消息才显示icon的逻辑
     */
    async unreadMessage () {
      try {
        let res = await queryNewsReadNums()

        if (res.code === 200) {
          this.unreadMessageNum = res.data.reduce((total, item) => {
            return total + (item.receiverType == 2 ? item.count : 0)
          }, 0)
        }
      } catch (error) {
        console.log('查询未读消息报错', error)
      }
    },

    /**
     * 根据条件返回万顺叫车app或者去到下载页
     */
    toNext () {
      // let userSource = this.$store.getters.getUserSource
      // console.log(userSource, 'userSource')
      // if (userSource && userSource != 3) {  //返回app
        if (window.ws) {
          // android环境
          window.ws.finishActivity();
        } else if (window.webkit) {
          // ios环境
          window.webkit.messageHandlers.finishActivity.postMessage('');
        }
      // } else if (userSource && userSource == 3) { //自主登录
      //   window.location.href = "https://s.wsecar.com/p/uRLj"
      // }
    },

    /**
     * 返回智慧生活h5壳子
     */
    toSmartlife() {
      window.location.href = `${process.env.SMART_PAGE_DOMAIN}/home`
    },

    /**
     * 跳转到搜索页面
     */
    onSearch () {
      let text = ''
      if (this.hotKeys.length) {
        text = this.hotKeys[this.keywordIndex]
      }
      this.$router.push({
        path: '/search',
        query: {
          searchValue: text
        }
      })
    },

    /**
     * 跳转到搜索商品列表页面
     * @param {String} cateId 一级分类id
     */
    toSearchGoodsList (cateId) {
      let text = ''
      if (this.hotKeys.length) {
        text = this.hotKeys[this.keywordIndex]
      }

      this.$router.push({
        path: '/spulist',
        query: {
          queryString: text,
          cateId: cateId || ''
        }
      })
    },

    /**
     * 跳转到我的消息页面
     */
    toMyNews () {
      // fromFlag 跳转标记，1 从首页跳转 2 从个人中心跳转
      this.$router.push({
        path: '/mynews',
        query: {
          fromFlag: '1'
        }
      })
    },

    onChange (index) {
      this.keywordIndex = index
    },

    toAdPage (item) {
      if (!item.link) return

      let isLivePage = item.link.indexOf('pages/livePlayer/livePlayer') !== -1 || item.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
      if (isLivePage) {
        toMiniAppDistribution(item.link)
      } else {
        routerPathName(item.link)
      }
    }
  }
}
</script>

<style>
.hotKeys-leave,.hotKeys-enter-to {
    opacity: 1
}
.hotKeys-leave-active,.hotKeys-enter-active  {
    transition: all .5s;
}
.hotKeys-leave-to ,.hotKeys-enter{
  opacity: 0
}

.home_page {
  --top-search-height: 88px;

  /* 页眉的宽度和高度，必须设置成变量 */
  --header-width: 94px;
  --header-height: 44px;
}
</style>
<style lang="less" scoped>
.search-container-placeholder {
  width: 100%;
  // height: 144px;
  // 设计稿是144px  但是H5是需要减掉顶部的电量通知区域
  height: var(--top-search-height);
}
.search-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 88px;
  padding: 0 12px;
  box-sizing: border-box;
  z-index: 100;
}
.title-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  .left {
    width: 20px;
    height: 20px;
  }

  .title-pic {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: -1;
  }
  .center {
    width: 48px;
    margin-top: 2px;
  }

  // 页眉广告
  .right {
    width: 94px;
    height: 44px;
    overflow: hidden;
  }
  .title-preference {
    display: flex;
    align-items: center;
    .back_icon {
      width: 20px;
      height: auto;
      margin-right: 5px;
    }
    .goods_icon {
      width:86px;
      height: auto;
    }
  }
}
.search-content {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;

  // height: 52px;
  padding-top: 12px;
  box-sizing: border-box;

  .left {
    display: flex;
    align-items: center;
    border: 1px solid #FFBCBB;
    width: 315px;
    height: 36px;
    position: relative;
    background: #fff;
    border-radius: 18px;
    .home-search-icon {
      width: 16px;
      height: 16px;
      margin-left: 12px;
    }

    .search-btn {
      padding: 8px 0;
      line-height: 1;
      width: 62px;
      margin-right: 3px;
      border-radius: 19px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
    }

    .home-search-input-palcehoder-text {
      flex: 1;
      margin:1.5px 0 0 12px;
      font-weight: 400;
      color: #444444;
      overflow: hidden;

      .van-swipe-item {
        font-size: 14px;
        color: #6E6E6E;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
      .van-swipe{
        height: 20px;
        line-height: 20px;
      }
    }
  }
}

.home-search-notice-icon,
.home-search-notice-icon-placeholder {
  width: 24px;
  height: 24px;
}

// 页眉广告
.ad-img-pic {
  max-width: 100%;
  max-height: 100%;
}
</style>
