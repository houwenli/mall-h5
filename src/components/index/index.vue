<template>
  <!--
    1、 打开一级分类弹窗，禁止底部滚动的思路是， 将整个容器 fixed定位， 禁用滚动
    2、内容区域是不能套div  加overflow-y: scroll 的， 必须让滚动容器盒子是 home_page这个div 不然背景图就无法很好的处理
   -->
  <div class="home_page" :class='{"fixed-paeg-container": isOpenCategoryPanel}' v-if="isShowHomePageConfig" :style="getPageStyle"  ref='scrollViewRef'>
    <!-- 顶部导航 分类里面有公共的组件-->
   <!-- <headerNav :showLogo="showLogo" :bgColorIndex="bgColorIndex" :isInTop="isInTop" /> -->
      <!-- 搜索框 -->
      <searchBox />

      <!-- 内容区域 start -->
        <!-- 一级分类 -->
        <classify @setScrollViewScroll='setScrollViewScroll' @on-update-goods-list='onUpdateGoodsList' @loadingFun="loadingFun" ref="classify" />

        <!-- 金刚区 -->
        <div v-if="isLoading" class="loading-style">
          <div class="loading-style-box">
            <header>
              <span></span>
              <span></span>
              <span></span>
            </header>
            <footer>加载中...</footer>
          </div>
        </div>
        <div v-else  :class="{'active-bg': classifyActiveTab == 0}" class="home-page-content">

          <div data-desc='内容' ref="backTop"  class="home-content" :class='{"homg-content-bg": classifyActiveTab !== 0}'>
              <!-- 一级分类下面的分类广告 -->
              <categoryAd v-if='classifyActiveTab !== 0'/>
              <!-- 目前暂时未使用-这是顶部的一个轮播 -->
              <!-- <header-swiper :listData="headerSwiperData" :showIndicators="false" @swiperChange="swiperChange"></header-swiper> -->

              <!-- 循环读取配置 -->
              <!--- 加:key="Date.now()" 防止一级菜单来回切换导致报模块width错误 --->
              <div class="list-group-item" v-show='classifyActiveTab === 0' v-for="element in contentList" :key="element._uuid">
                <template v-if='element.text === "金刚区"'>
                  <!-- 金刚区 -->
                  <pageNav :config="element"/>
                </template>

                <template v-if="element.text === '轮播图'">
                  <swipe :config="element"></swipe>
                </template>

                <template v-if='element.text === "半屏双列图"'>
                  <group2Image :config='element' />
                </template>

                <!-- 1-4列图 -->
                <template v-if='showGroupImageComponent(element)'>
                  <groupImage2 :config="element" ></groupImage2>
                </template>

                <template v-if="element.text === '滑动区块'">
                  <slideModule :config="element" />
                </template>
                <template v-if="element.text === '图片魔方'">
                  <cubeImage :config="element" />
                </template>
                <template v-if="element.text === '秒杀'">
                  <seckill :listData="element.list"></seckill>
                </template>
                <template v-if="element.text === '分销'">
                  <distribution :listData="element.list"></distribution>
                </template>
                <template v-if="element.text === '公告'">
                  <notice-bar :key='noticeBarKey' :listData="element"></notice-bar>
                </template>
                <template v-if="element.text === '辅助空白'">
                  <blank :listData="element"></blank>
                </template>
              </div>

              <!-- 循环读取配置end -->
              <div data-desc='商品列表' class="home-goods-list-container" :class='{"backend-bg": classifyActiveTab !== 0}'>
                <img v-show='classifyActiveTab !== 0' class="home-recommond-for-you-pic" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search-for-recommand-pic-new.png" alt="">
                <!-- 商品列表 -->
                <shopList isWaterfall isIndex :key='refreshGoodListKey'/>
              </div>
          </div>
        </div>

    <!-- 内容区域 end -->

    <!-- 底部导航栏 -->
    <div class="tabs">
      <foot ref="footRef" title='首页' @tabChange="tabChange" />
    </div>
    <!-- 浮动按钮 -->
    <template v-if="floatBtnData.showConfig && showFloat">
      <div class="float_button" v-show="floatBtnH5">
        <van-icon @click="floatButtonFun()" :name="floatBoxCloseIcon" size="20px"></van-icon>
        <div class="content">
          <img v-if="floatBtnData.url" @click="navigate(floatBtnData)" :src="floatBtnData.url" />
          <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/dae7a941e28fc339bd5991257778a99c.png" />
        </div>
      </div>
    </template>
    <!-- 弹框 -->
    <pop-up-windows v-if="showedHomePagePopUpWindow" :popupWindowConfigData="popupWindowConfigData"></pop-up-windows>

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop" @click.capture="backtopActive" >
      <img src="@/assets/img/goodsDetail/go_top.png" alt />
        <span>顶部</span>
    </div>

    <div class="index-poster-mask" v-if="showPost" @touchmove="stopTouch($event)">
      <div class="index-poster-container">
        <img :src="modalPost" @click="goThematicActivity()" />
        <div class="close-btn" @click="closePost"><img :src="closeImg" mode="" /></div>
      </div>
    </div>
    <div class="userActivity-container" v-if="showUserActivity" :style="{ bottom: footRefHeight + 'px' }">
      <div class="sign-in-gift">
        <img class="coupon-img" src="@/assets/img/activity/coupon_icon@2x.png" alt="" />
        <span class="sign-in-gift-text">登录享优惠，注册即送新人大礼包</span>
      </div>
      <button class="sign-in-btn" @click="$router.push({ path: '/register' })">
        注册领券
      </button>
    </div>
    <SecondConfirm
      title="用户注册协议"
      cancleText="先浏览看看"
      sureText="同意"
      :dialogshow="registrationProtocolIsShow"
      @closeBack="$store.commit('SET_REGISTRATIONPROTOCOL', false)"
      @rightEvent="hasPayPasswordDialogFun"
    >
      <div slot="textp">
        <div class="registration-protocol">
          <div v-html="protocol"></div>
        </div>
      </div>
    </SecondConfirm>
    <!-- <SecondConfirm
      title="恭喜您获得新人大礼包"
      sureText="立即查看"
      :dialogshow="discountGiftDialog"
      :isNeedTouchClose="true"
      :columnButton="true"
      :showCloseDialogBtn="true"
      @rightEvent="discountGiftConfirm"
      @handleCloseDialog="discountGiftDialog = false"
    >
      <div class="discount-gift-container" slot="textp">
        <div class="discount-gift-text">以下优惠券已发放到您的账户中</div>
        <div class="discount-gift-list">
          <div class="discount-gift-coupon" v-for="(item, index) in platformCouponList" :key="index">
            <span class="top-round-corner"></span>
            <span class="bottom-round-corner"></span>
            <div class="stub-ticket">
              <div class="content">
                <span class="text" v-if="item.type != 2">￥</span>
                <span class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : skuPriceInt(item.price) }}</span>
                <span class="text" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</span>
                <span class="text" v-else>折</span>
              </div>
            </div>
            <div class="main-ticket">
              <div class="content">
                <div class="title" v-if="item.type != 0">满{{ item.fullPrice }}可用</div>
                <div class="title" v-else>无门槛</div>
                <div class="cate">
                  <template v-if="item.permittedType == 0">全平台商品可用</template>
                  <template v-else-if="item.permittedType == 1">平台部分商品可用</template>
                  <template v-else-if="item.permittedType == 2">限平台部分品类商品</template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecondConfirm> -->
  </div>
</template>

<script>
  import smoothscroll from 'smoothscroll-polyfill';
  import { Group, Tabbar, TabbarItem, XInput, Badge } from 'vux'
  import floatBoxCloseIcon from '@/assets/img/float-box-close.png'
  import { mobileIndex, queryUnReadMessagecount } from '@/api/index'
  import { getUserActivity, getDeliered } from '@/api/mycoupon'
  import { customerDetail, queryPerformanceFlag, queryIsAllowDistribution } from '@/api/home'
  import shopList from '../commons/shopList'
  import mobiletemplate from '@/components/index/mobiletemplate'

  import foot from '@/components/commons/foot'

  import closeImg from '@/assets/img/post-close.png'

  import defaultNoticeIcon from '@/assets/img/nav_copy@2x.png'

  import { visit } from '@/api/visit'
  import { getToken } from '@/utils/token'
  import Cookies from 'js-cookie'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
  // ---------------------
  // 暂时不用
  // import headerNav from './template/header'
  import swipe from './template/swipe/index.vue'
  import HeaderSwiper from './template/header/header-swiper.vue'
  import pageNav from '@/views/home/components/pageNav/index.vue'
  // 魔方组件
  // import cubeImage from './template/cubeImage/index.vue'
  import cubeImage from '../../views/home/components/cube-image/index.vue'
  import blank from './template/blank'
  // 废弃
  // import groupImage from './template/groupImage'
  import slideModule from './template/SlideModule'
  import seckill from './template/seckill'
  import distribution from './template/distribution'
  import noticeBar from './template/noticeBar'
  import popUpWindows from './template/popUpWindows'

  // 1-4列图
  import groupImage2 from '../../views/home/components/group-image/index.vue'
  // 半屏双列图
  import group2Image from '../../views/home/components/group-2-image/index.vue'

  // 一级分类
  import classify from '@/views/home/components/classify/index.vue'
  import searchBox from '@/views/home/components/searchBox/index.vue'

  // ---------------------
  import { mapGetters, mapState } from 'vuex'
  import { throttle, routerPathName, toMiniAppDistribution } from '@/utils/utils'
  let scrollToHeight = 0
  import {fillFiledForConfig, adaptergroupImageConfig} from '@/views/home/helper/index.js'
  import { defaultPageNavBgConfig } from './data.js'
  // 分类广告
  import categoryAd from '@/views/home/components/category-ad/index.vue'

  export default {
    name: 'homePageConfig',
    mixins: [userRegistrationProtocol],
    components: {
      Group,
      Tabbar,
      TabbarItem,
      XInput,
      Badge,
      mobiletemplate,
      foot,
      SecondConfirm,
      shopList,
      // headerNav,  电商UI优化需求，暂时不用
      swipe,
      pageNav,
      cubeImage,
      blank,
      // groupImage,
      slideModule,
      seckill,
      distribution,
      noticeBar,
      popUpWindows,
      HeaderSwiper,
      groupImage2,
      group2Image,
      classify,
      searchBox,
      categoryAd
    },
    data() {
      return {
        showedHomePagePopUpWindow: 0,
        floatBtnH5: 0,
        floatBoxCloseIcon,
        platformCouponList: [],
        discountGiftDialog: false,
        showUserActivity: false,
        isLogin: getToken() ? getToken() : false, // 判断是否登录
        offsetHeight: '500px',
        closeImg: closeImg,
        showPost: false,
        modalPost: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/11fbbff13640169d358050f7c96d948e.gif', // 专区活动
        hadMsg: false, //是否有新消息
        returntop: false,
        isshowtop: false,
        defaultNoticeIcon,
        topStyleObj: {},
        noticeIconObj: {
          backgroundImage: `url(${defaultNoticeIcon})`,
        },
        searchBoxStyle: {
          background: 'transparent',
        },
        saveNoticeImage: undefined, //存储保存到消息图标,
        bgColorIndex: '0',
        isInTop: true,
        showLogo: true,

        refreshGoodListKey: 0,
        noticeBarKey: 0,
        // 下拉刷新
        refreshLoading: false,
        // 控制在下拉刷新的时候，让searchBox 重新渲染 - 重新调用热词的接口
        // refreshHotKey: 0,

        refreshTimer: null,

        isOpenCategoryPanel: false,
        isLoading: false,
        curScrollTop: 0,
        classifyScrollLeft:0,
        showFloat: true, // 默认显示
      }
    },
    computed: {
      ...mapGetters('MOBILE_INDEX', ['pagesConfig']),
      ...mapGetters([
        'popupWindowIsShow',
        'contentList',
        'headerData',
        'floatBtnData',
        'popupWindowConfigData',
        'scorllTop',
        'isShowHomePageConfig',
      ]),

      ...mapState({
        pageNavBg: state => {
          let headerData = state.HOME_PAGE_CONFIG.headerData || {}

          let c = fillFiledForConfig(headerData.pageNavBg, defaultPageNavBgConfig)

          return c
        },
        // 一级分类 当前是哪一个高亮
        classifyActiveTab: state => state.HOME_PAGE_CONFIG.classifyActiveTab
      }),

      registrationProtocolIsShow() {
        return this.$store.getters.getRegistrationProtocol
      },
      footRefHeight() {
        let height = 50
        if (this.$refs.footRef && this.$refs.footRef.$el.firstChild.offsetHeight) {
          height = this.$refs.footRef.$el.firstChild.offsetHeight
        }
        return height
      },
      isApp() {
        let flag = false
        if ((window.ws && window.ws.wsShare) || (window.webkit && window.webkit.messageHandlers.wsShare)) {
          flag = true
        }
        return flag
      },
      headerSwiperData() {
        return this.headerData.slideshowImageList
      },

      /**
       * 获取页面的背景图片配置
       */
      getPageStyle() {
        let { backgroundType, bgImage, bgColor } = this.pageNavBg
        let c = {}
        if (String(backgroundType) === '1') {
          // 默认为图片， 但是没传背景图的话，就设置为白色
          if (bgImage === '') {
            c.background = '#fff'
          } else {
            c.backgroundImage = `url(${bgImage})`
          }
        } else {
          c.background = bgColor
        }

        return c
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg')
      /* setTimeout(() => {
        let data = {
          route: this.$route.path,
          routeName: '首页',
          userId: this.$store.getters.userId,
        }
        visit(data)
      }, 2000) */

      if (this.isLogin) {
        this.contMsg()
      }
      smoothscroll.polyfill()

      // if (this.isLogin && this.$route.query.isShowCoupon && !this.isApp) {
      //   setTimeout(() => {
      //     this.getPlatformCoupon()
      //   }, 500)
      // }
    },
    watch: {
      // isshowtop(value) {
      //   if (!value) this.returntop = false
      // },
      pagesConfig: {
        handler(nv, ov) {
          if (nv) {
            const { layOutObj } = nv
            const topObj = layOutObj && layOutObj.find((item) => item.type === 'topStyle')
            const noticeObj = layOutObj && layOutObj.find((item) => item.type === 'noticeStyle')
            let topOpacity = (topObj && topObj.opacity) || 0
            const dealTopOpacity = (100 - ~~topOpacity) / 100

            if (topObj && topObj.image) {
              this.topStyleObj = {
                backgroundImage: topObj && topObj.image && `url(${topObj && topObj.image})`,
                opacity: dealTopOpacity || 1,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }
            } else {
              this.topStyleObj = {
                background: '#fff',
                opacity: dealTopOpacity || 1,
              }
            }

            this.noticeIconObj = {
              backgroundImage: (noticeObj && noticeObj.image && `url(${noticeObj && noticeObj.image})`) || `url(${defaultNoticeIcon})`,
            }
            this.saveNoticeImage = (noticeObj && noticeObj.image && `url(${noticeObj && noticeObj.image})`) || `url(${defaultNoticeIcon})`
          }
        },
        immediate: true,
        deep: true,
      },
    },
    beforeRouteLeave(to, from, next) {
      // 记录滚动条位置
      this.curScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      // 记录分类滚动条位置
      this.classifyScrollLeft = this.getEleDom('.home-level-menu-box').scrollLeft  || 0
      next()
    },
    mounted() {
      // this.showActivityPost()
      // this.queryMobileIndex()
      this.$nextTick(function() {
        setTimeout(() => {
          this.showedHomePagePopUpWindow = +Cookies.get('showedHomePagePopUpWindow')
          this.floatBtnH5 = +Cookies.get('floatBtnH5')
        }, 500)
        // 滚动条的获取
        window.addEventListener('scroll', this.handleScroll, true)
      })

      this.onRefresh()
    },
    methods: {
      tabChange(index){
        this.$refs.classify.onUpdateActive(index)
        this.backtopActive()
      },
      swiperChange(data) {
        this.bgColorIndex = data
      },
      skuPriceInt(price) {
        let intPrice = 0,
          floatPrice = 0
        if (!price) {
          price = 0
        } else {
          price = price.toFixed(2).split('.')[0]
        }
        return price
      },
      skuPriceFloat(price) {
        let intPrice = 0,
          floatPrice = 0
        if (!price) {
          price = 0
        } else {
          price = price.toFixed(2).split('.')[1]
        }
        return price
      },
      discountGiftConfirm() {
        this.discountGiftDialog = false
        this.$router.push({ path: '/mycoupon', query: { type: 2 } })
      },
      getUserActivity() {
        this.isLogin = getToken()
        if (!this.isLogin) {
          getUserActivity({ type: 0 }).then((res) => {
            if (res.data && res.data.platformCouponVoList && res.data.platformCouponVoList.length > 0 && !this.isApp) {
              this.showUserActivity = true
            }
          })
        } else {
          this.showUserActivity = false
        }
      },
      getPlatformCoupon() {
        // 不显示新人礼包
        getDeliered(0).then((res) => {
          if (res.code == 200 && res.data && res.data.length > 0) {
            this.platformCouponList = res.data
            this.discountGiftDialog = true
          }
        })
      },
      //活动专题页
      goThematicActivity() {
        this.showPost = false
        // this.$router.push({ name: 'ThematicActivity' })
        // this.$router.push({ name: 'WomenActive' })
        //   145
        this.$router.push({ name: 'FirstOrder', query: { id: 145 } })
      },
      //展示活动海报
      showActivityPost() {
        //todo: 暂时解决免密登录没有拿到token先调用接口
        setTimeout(() => {
          queryPerformanceFlag().then((res) => {
            if (res.data == 1) {
              if (this.$store.getters.getThematicPost) {
                return
              } else {
                this.$store.dispatch('setThematicPost', true)
                this.showPost = true
              }
            }
          })
        }, 1000)
      },
      closePost() {
        this.showPost = false
      },
      stopTouch(event) {
        event.preventDefault()
      },
      // 监听滚动
      handleScroll: throttle(function() {
        if (!this.$refs.backTop) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
        // this.isInTop = scorllTop > 0
        if (scorllTop <= -80) {
          this.showLogo = false
        } else {
          this.showLogo = true
        }
        scrollToHeight = Math.abs(scorllTop - 44) //   缓存页面滚动的值
        scorllTop = Math.abs(scorllTop) // 取绝对值
        this.searchBoxStyle.background = scorllTop > 7 ? '#ffffff' : 'transparent'
        this.noticeIconObj.backgroundImage = scorllTop > 7 ? `url(${defaultNoticeIcon})` : this.saveNoticeImage


        if (scorllTop >= 2500) this.isshowtop = true
        else this.isshowtop = false
      }, 500),

      // 回到顶部
      backtopActive() {
        let timer = setInterval(function(){
          let osTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
          let ispeed = Math.floor(-osTop / 5);
          document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;

          if(osTop === 0){
            clearInterval(timer);
          }
        },30)
      },
      // 查询首页配置
      queryMobileIndex() {
        mobileIndex().then((res) => {
          if (res.code === 200) {
            this.$store.commit('MOBILE_INDEX/UPDATE_PAGES_CONFIG', res.data) //使用仓库存储数据
          }
        })
      },
      // 跳转到我的消息页面
      toMyNews() {
        // fromFlag 跳转标记，1 从首页跳转 2 从个人中心跳转
        this.$router.push({ path: '/mynews', query: { fromFlag: '1' } })
      },
      // 查询未读消息
      contMsg() {
        queryUnReadMessagecount().then((res) => {
          if (res.code == 200) {
            let num = 0
            res.data.filter((ele) => {
              if (ele.receiverType == 2) {
                num += ele.count
              }
            })
            this.hadMsg = num > 0
            // this.hadMsg = temp
          }
        })
      },
      // 跳转到搜索页面
      toSearch() {
        this.$router.push({ path: '/search' })
      },
      // 关闭悬浮图标
      floatButtonFun() {
        this.$store.dispatch('HOME_PAGE_CONFIG/filtration', { showConfig: false })
      },
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
          data.link.indexOf('pages/livePlayer/livePlayer') !== -1 ||
          data.link.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
        if (isLivePage) {
          toMiniAppDistribution(data.link)
        } else {
          routerPathName(data.link)
        }
      },
      // 查询用户是否有分销权限
      queryIsAllowDistribution() {
        queryIsAllowDistribution().then((res) => {
          // console.log('是否分销有权限', res)
          // console.log('state.isD-- 前--', this.$store.getters.getDistribution)
          if (res.code == 200) {
            this.$store.commit('OPERATION_DISTRIBUTION', res.data)
            // console.log('getDistribution----', this.$store.getters.getDistribution)
          }
        })
      },

      /**
       * 禁用页面滚动
       */
      setScrollViewScroll(status,index) {
        // index === 0 首页只能在左边第一位
        this.showFloat = Number(index) === 0
        this.isOpenCategoryPanel = status
        this.noticeBarKey = Date.now()
      },

      adaptergroupImageConfig(item) {
        return adaptergroupImageConfig(item)
      },

      showGroupImageComponent (item)  {
        return ['单列图', '双列图', '三列图', '四列图'].includes(item.text)
      },
      loadingFun(isLoading){
        this.isLoading = isLoading
      },

      /**
       * 根据选择的一级分类-重新查询商品列表
       * 通过刷新key的方式实现商品分类的更新，商品分类组件里面已经处理了入参字段
       */
      onUpdateGoodsList() {
        this.refreshGoodListKey = Date.now()
        this.noticeBarKey = Date.now()
      },

      /**
       * 将一些定时器的逻辑，需要更新页面视图的逻辑都集中到这里
       */
      onRefresh() {
        let updateHotKeysHandle = () => {
          this.refreshHotKey = Date.now()
        }

        // this.refreshTimer = window.setInterval(updateHotKeysHandle, 2000)

        // this.$once('hook:beforeDestroy', ()=> {
        //   if (this.refreshTimer) {
        //     window.clearInterval(updateHotKeysHandle)
        //     this.refreshTimer = null
        //   }
        // })
      },
      getEleDom(domAttr) {
        return document.querySelector(domAttr)
      },
    },

    beforeDestroy() {
      document.removeEventListener('scroll', this.handleScroll)
    },
    activated() {
      //分类滚动条位置
      this.classifyScrollLeft!=0?this.getEleDom('.home-level-menu-box').scrollLeft = this.classifyScrollLeft:''
      // 获取上次滚动条位置
      this.isLogin = getToken()
      if (this.isLogin) {
        this.queryIsAllowDistribution()
      } else {
        this.$store.commit('OPERATION_DISTRIBUTION', false)
      }
      if (this.isLogin && this.$route.query.isShowCoupon && !this.isApp) {
        setTimeout(() => {
          this.getPlatformCoupon()
        }, 500)
      }
      // this.getUserActivity()
      this.$nextTick(() => {
        if (this.curScrollTop !== 0) {
          document.documentElement.scrollTo(0, this.curScrollTop)
          document.body.scrollTop = this.curScrollTop
        }
      })
      setTimeout(() => {
        let data = {
          route: this.$route.path,
          routeName: '首页',
          userId: this.$store.getters.userId,
        }
        visit(data)
      }, 2000)
    },
    deactivated() {
      this.$store.dispatch('HOME_PAGE_CONFIG/setScorllTop', scrollToHeight)
    }
  }
</script>
<style scoped lang="less">
  .home_page {
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    background: #F5F5F8;
    background-repeat: no-repeat;
    background-size: 100% auto;
    // background-position-y: -22px;

    // 当一级分类在非 【首页】 类目直接用这样颜色盖住全局的底图
    .backend-bg {
      background: #F5F5F8;
    }
    .tabs {
      width: 100%;
    }
    .returntopBox {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: fixed;
      bottom: 88px;
      right: 12px;
      width: 40px;
      height: 40px;
      z-index: 99;
      opacity: 0.8;
      background: #191919;
      border-radius: 20px;
      >img {
        margin-top: 4px;
        width: 14px;
        height: 18px;
      }
      span{
        font-size: 11px;
        font-weight: 400;
        color: #FFFFFF;
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
    .index-poster-mask {
      background: rgba(0, 0, 0, 0.7);
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      .index-poster-container {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 400px;
        background-color: transparent;
        border-radius: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
        .close-btn {
          width: 24px;
          height: 24px;
          position: absolute;
          left: 50%;
          bottom: -52px;
          transform: translate(-50%, 0);
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .userActivity-container {
      position: fixed;
      z-index: 999;
      // bottom: 50px;
      width: 100%;
      height: 40px;
      background: rgba(0, 0, 0, 0.7);
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      .sign-in-gift {
        display: inline-flex;
        align-items: center;
        .coupon-img {
          width: 20px;
          height: 20px;
        }
        .sign-in-gift-text {
          margin-left: 10px;
          font-size: 14px;
        }
      }
      .sign-in-btn {
        width: 76px;
        height: 28px;
        background: #e60113;
        border-radius: 19px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
    }
    .discount-gift-container {
      .discount-gift-text {
        text-align: center;
        font-size: 14px;
        color: #666;
        margin: 8px 0;
      }
      .discount-gift-list {
        height: 280px;
        overflow-y: auto;

        .discount-gift-coupon {
          position: relative;
          width: 100%;
          background: #fef4f4;
          border-radius: 10px;
          display: flex;
          height: 70px;
          margin-top: 8px;
          .top-round-corner {
            background-color: #fff;
            position: absolute;
            top: -8px;
            left: 105px;
            transform: translate(-50%, 0);
            height: 14px;
            width: 14px;
            border-radius: 0 0 50% 50%;
            z-index: 2;
          }
          .bottom-round-corner {
            background-color: #fff;
            position: absolute;
            bottom: -8px;
            left: 105px;
            transform: translate(-50%, 0);
            height: 14px;
            width: 14px;
            border-radius: 50% 50% 0 0;
            z-index: 2;
          }
          .stub-ticket {
            width: 105px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-right: 1px dashed #faccd0;
            .content {
              display: inline-flex;
              align-items: baseline;
              color: #e60113;
              font-weight: 600;
              .text {
                font-size: 14px;
                line-height: 20px;
              }
              .price {
                font-size: 30px;
                line-height: 38px;
              }
            }
          }
          .main-ticket {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            .content {
              margin-left: 18px;
              .title {
                font-size: 14px;
                font-weight: 500;
                color: #000;
                line-height: 20px;
              }
              .cate {
                margin-top: 2px;
                color: #666;
                line-height: 16px;
                font-size: 11px;
              }
            }
          }
        }
      }
    }
  }
.home-page-content{
  width: 100vw;
  // padding-top: 8px;
  margin-top: 4px;
  border-radius: 12px 12px 0 0;
  background: #F5F5F8;
}
.active-bg {
  padding-top: 4px;
  margin-top: 0px;
  background: none;
}
.home-content {
  height: 100%;
  background-position: center;
  background-size:cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
}

// 当一级分类不是选择首页的时候，就需要加这个背景，将全局的底图给覆盖住
.homg-content-bg {
  border-radius: 12px;
  background: #F5F5F8;
  .home-goods-list-container{
    border-radius: 12px;
  }
}

// 组件配置盒子
.list-group-item {
  margin: 12px 0;
  width: 100vw;
  overflow: hidden;
}
.list-group-item:nth-child(1) {
  margin: 0 0 12px 0;
}

// 商品列表
.home-goods-list-container {
  width: 100%;
  margin-bottom: 60px;
  padding: 0 12px 0 12px;
  box-sizing: border-box;
  overflow: hidden;
}

// 将整个页面给固定起来
.fixed-paeg-container {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.home-recommond-for-you-pic {
  display: block;
  width: 249px;
  height: 16px;
  margin: 0 auto 12px auto;
}
.loading-style{
  margin-top: 4px;
  height: 500px;
  max-height: 600px;
  background: #F5F5F8;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  .loading-style-box{
    padding-top: 185px;
    display: flex;
    align-items: center;
    flex-direction: column;
    header{
      width: 80px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      span{
        background: #DE3A38;
        border-radius: 50%;
      }
      span:nth-of-type(1){
        width: 10px;
        height: 10px;
      }
      span:nth-of-type(2){
        width: 16px;
        height: 16px;
        margin: 0 11px;
      }
      span:nth-of-type(3){
        width: 10px;
        height: 10px;
      }
    }
    footer{
      width: 80px;
      text-align: center;
      font-size: 10px;
      color: #90969E;
    }
  }
}
</style>
