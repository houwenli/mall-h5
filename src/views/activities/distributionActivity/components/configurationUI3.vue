<template>
  <!--  v-if="isShowHomePageConfig" -->
  <div ref="contentTop" class="home_page" :style="[pageNavStyle]">
    <div class="header_nav">
      <header-nav ref="headerNav" :headerData="headerBg" :headerType="headerType" :bgType="bgType"></header-nav>
    </div>
    <div class="content wrap-content-main">
      <div ref="backTop">
        <!-- <header-swiper :listData="headerSwiperData" :showIndicators="false" @swiperChange="swiperChange" class="header_swiper_div"></header-swiper> -->

        <!-- 分销首页配置 -->
        <distributionAppletTemplateVue :contentList="contentList"></distributionAppletTemplateVue>

        <div class="mobile-template">
          <shop-list
            @shareComm="
              (item) => {
                $refs.distributionShare.shareComm(1, item)
              }
            "
          ></shop-list>
        </div>
      </div>
    </div>

    <!-- 浮动按钮 -->
    <!-- <template v-if="floatBtnData.isShow">
      <div class="float_button" v-show="floatBtnH5">
        <van-icon @click="floatButtonFun()" :name="floatBoxCloseIcon" size="20px"></van-icon>
        <div class="content">
          <img v-if="floatBtnData.floatBtnBgImage" @click="navigate(floatBtnData)" :src="floatBtnData.floatBtnBgImage" />
          <img v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/dae7a941e28fc339bd5991257778a99c.png" />
        </div>
      </div>
    </template> -->

    <!-- 分享 -->
    <img class="img_top" src="@/assets/img/WeChat@2x.png" @click.stop="$refs.distributionShare.shareComm(2, null)" v-if="!isSharedPage" />
    <!-- 回到顶部  -->
    <img class="img_to_top" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png" v-if="isshowtop" @click.stop="backtopActive" />
    <!-- 分享弹框 -->
    <distributionShare ref="distributionShare"></distributionShare>

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
  </div>
</template>

<script>
  import { Group, Tabbar, TabbarItem, XInput, Badge } from 'vux'
  import floatBoxCloseIcon from '@/assets/img/float-box-close.png'
  import { mobileIndex, queryUnReadMessagecount } from '@/api/index'
  import { queryDistributionHomeTemplate } from '@/api/activities/distributionActivity'
  import { getUserActivity, getDeliered } from '@/api/mycoupon'
  import { customerDetail, queryPerformanceFlag, queryIsAllowDistribution } from '@/api/home'
  import shopList from './distributionSpuList.vue'
  import mobiletemplate from '@/components/index/mobiletemplate'

  import foot from '@/components/commons/foot'

  import closeImg from '@/assets/img/post-close.png'

  import defaultNoticeIcon from '@/assets/img/nav_copy@2x.png'

  import { visit } from '@/api/visit'
  import { getToken } from '@/utils/token'
  import Cookies from 'js-cookie'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
  import mixins from '@/mixins/activities/distributionActivity.js'

  import headerNav from './header.vue'
  import HeaderSwiper from '../template/header/header-swiper.vue'
  import popUpWindows from '../template/popUpWindows'
  import distributionAppletTemplateVue from './distribution-applet-template.vue'

  // ---------------------
  import { mapGetters } from 'vuex'
  import { throttle, routerPathName, toMiniAppDistribution } from '@/utils/utils'
  import distributionShare from '@/views/activities/distributionActivity/components/distributionShare.vue'

  import { genNewLink } from '../data'

  export default {
    name: 'configurationUI3',
    mixins: [userRegistrationProtocol, mixins],
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
      headerNav,
      popUpWindows,
      HeaderSwiper,
      distributionShare,
      distributionAppletTemplateVue,
    },
    data() {
      return {
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

        isSharedPage: false, //购买人/推荐人

        popupWindowIsShow: '',
        contentList: [],
        phoneType: '',
        // headerData: {},
        headerBg: {},
        pageNavBg: {},
        floatBtnData: '',
        scorllTop: '',
        isShowHomePageConfig: '',
        pageNavData: '',
        headerType: 1, // 顶部类型   1：底部tab切换（分享购） 2：deeplink直接进入 3：分享页面进入
        bgType: 2, // 主题 1 浅  2深
      }
    },
    computed: {
      // ...mapGetters('MOBILE_INDEX', ['pagesConfig']),

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

      pageNavStyle() {
        let { backgroundType, bgImage, bgColor } = this.pageNavBg
        let background = backgroundType == 1 ? `url(${bgImage}) no-repeat` : bgColor ? bgColor : '#fff'
        return {
          background,
          // backgroundSize: this.bgSize,
        }
      },
      // headerSwiperData() {
      //   return this.headerData.slideshowImageList
      // },
    },
    created() {
      this.isSharedPage = !!this.$route.query.promoteInfo
      this.$store.dispatch('setDistributionPer', !this.isSharedPage)
      document.body.removeAttribute('class', 'gray-bg')

      if (this.isLogin) {
        this.contMsg()
      }

      // if (this.isLogin && this.$route.query.isShowCoupon && !this.isApp) {
      //   setTimeout(() => {
      //     this.getPlatformCoupon()
      //   }, 500)
      // }

      // this.$store.dispatch('DISTRIBUTION_ACTIVITY/queryMobileIndex') //加载配置数据
    },
    watch: {
      isshowtop(value) {
        if (!value) this.returntop = false
      },
      isShowHomePageConfig(newVal) {
        console.log(newVal)
      },
      // $route(now, old) {
      //   if(now.name=='distributionActivity'){
      //     this.$refs.headerNav.unreadMessage()
      //   }
      // }
      // pagesConfig: {
      //   handler(nv, ov) {
      //     if (nv) {
      //       const { layOutObj } = nv
      //       const topObj = layOutObj && layOutObj.find((item) => item.type === 'topStyle')
      //       const noticeObj = layOutObj && layOutObj.find((item) => item.type === 'noticeStyle')
      //       let topOpacity = (topObj && topObj.opacity) || 0
      //       const dealTopOpacity = (100 - ~~topOpacity) / 100

      //       if (topObj && topObj.image) {
      //         this.topStyleObj = {
      //           backgroundImage: topObj && topObj.image && `url(${topObj && topObj.image})`,
      //           opacity: dealTopOpacity || 1,
      //           backgroundSize: '100% 100%',
      //           backgroundRepeat: 'no-repeat',
      //         }
      //       } else {
      //         this.topStyleObj = {
      //           background: '#fff',
      //           opacity: dealTopOpacity || 1,
      //         }
      //       }

      //       this.noticeIconObj = {
      //         backgroundImage: (noticeObj && noticeObj.image && `url(${noticeObj && noticeObj.image})`) || `url(${defaultNoticeIcon})`,
      //       }
      //       this.saveNoticeImage = (noticeObj && noticeObj.image && `url(${noticeObj && noticeObj.image})`) || `url(${defaultNoticeIcon})`
      //     }
      //   },
      //   immediate: true,
      //   deep: true,
      // },
    },
    mounted() {
      // this.showActivityPost()
      this.queryMobileIndex()
      this.$nextTick(function() {
        setTimeout(() => {
          this.floatBtnH5 = +Cookies.get('floatBtnH5')
          console.log(this.floatBtnH5, 'this.floatBtnH5')
        }, 500)
        // 滚动条的获取
        window.addEventListener('scroll', this.handleScroll, true)
      })
    },
    methods: {
      queryHeaderType() {
        if (this.$route.query.promoteInfo) {
          this.headerType = 3
        } else if (this.$route.query.deepLink) {
          this.headerType = 2
        } else {
          this.headerType = 1
        }
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
        // scrollToHeight = Math.abs(scorllTop - 44) //   缓存页面滚动的值
        scorllTop = Math.abs(scorllTop) // 取绝对值
        // this.searchBoxStyle.background = scorllTop > 7 ? '#ffffff' : 'transparent'
        // this.noticeIconObj.backgroundImage = scorllTop > 7 ? `url(${defaultNoticeIcon})` : this.saveNoticeImage

        if (scorllTop >= 500) this.isshowtop = true
        else this.isshowtop = false
      }, 500),
      // 回到顶部
      backtopActive() {
        if (this.isshowtop) this.returntop = true
        else this.returntop = false
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
        queryDistributionHomeTemplate().then((res) => {
          if (res.code === 200) {
            let data = JSON.parse(res.data.contentJson)
            // this.$store.commit('MOBILE_INDEX/UPDATE_PAGES_CONFIG', res.data) //使用仓库存储数据
            let contentList = data.contentList || []
            genNewLink.call(this, contentList)
            this.contentList = contentList

            let headerData = data.headerData || {}
            this.headerBg = headerData.headerBg || {}
            this.pageNavBg = headerData.pageNavBg || {}
            this.bgType = headerData.theme || 1
            // this.tabData = data.tabData
            this.isShowHomePageConfig = true
            // if (Cookies.get('h5_floatBtn') !== undefined && Cookies.get('h5_floatBtn') == 0) return
            // this.floatBtnData = data.floatBtnData
            // if (this.floatBtnData.isShow) {
            //   Cookies.set('floatBtnH5', 1)
            // } else {
            //   Cookies.set('floatBtnH5', 0)
            // }
          }
        })
      },
      // 跳转到我的消息页面
      toMyNews() {
        console.log('3333333')
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
            console.log(num, 'num------')
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
        this.$store.dispatch('HOME_PAGE_CONFIG/filtration', { isShow: false })
      },
      navigate(data) {
        console.log(data, 'data')
        // 流量分析埋点
        let params = {
          name: '浮动按钮',
          type: 11,
          image: data.floatBtnBgImage || '',
          url: data.floatBtnLink || '',
          channel_source: Cookies.get('_wsf_role'),
        }
        this.$store.dispatch('BURIED_POINT/advertVisitRequest', params)
        if (!data || !data.floatBtnLink) return
        let isLivePage =
          data.floatBtnLink.indexOf('pages/livePlayer/livePlayer') !== -1 ||
          data.floatBtnLink.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1
        if (isLivePage) {
          toMiniAppDistribution(data.floatBtnLink)
        } else {
          routerPathName(data.floatBtnLink)
        }
      },
      // 查询用户是否有分销权限
      queryIsAllowDistribution() {
        queryIsAllowDistribution().then((res) => {
          console.log('是否分销有权限', res)
          console.log('state.isD-- 前--', this.$store.getters.getDistribution)
          if (res.code == 200) {
            this.$store.commit('OPERATION_DISTRIBUTION', res.data)
            console.log('getDistribution----', this.$store.getters.getDistribution)
          }
        })
      },
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.handleScroll)
    },
    activated() {
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
      setTimeout(() => {
        let data = {
          route: this.$route.path,
          routeName: '首页',
          userId: this.$store.getters.userId,
        }
        visit(data)
      }, 2000)

      this.queryHeaderType()
    },
  }
</script>
<style scoped lang="less">
  .home_page {
    width: 100%;
    padding-bottom: 92px;
    background-size: 100% auto !important;
    // height: 100vh;
    // padding-bottom: 60px;
    // display: flex;
    // flex-wrap: wrap;
    // flex-direction: column;
    // overflow-x: hidden;
    .header_nav {
      width: 100%;
      padding-top: 80px;
    }
    .content {
      width: 100%;
    }
    .mobile-template {
      padding-top: 10px;
    }
    .tabs {
      width: 100%;
    }
    .returntopBox {
      z-index: 5;
      width: 100%;
      .returntop {
        width: 1.6rem;
        height: 1.6rem;
        position: fixed;
        bottom: 110px;
        right: 0.48rem;
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
    .header_swiper_div {
      height: 184px;
      overflow: hidden;
      /deep/.van-swipe-item img {
        height: 100%;
        margin-top: -44px;
      }
    }
    .img_top {
      width: 40px;
      height: 40px;
      position: fixed;
      right: 12px;
      bottom: 140px;
      right: 0px;
      z-index: 999;
    }
    .img_to_top {
      width: 40px;
      height: 40px;
      position: fixed;
      right: 12px;
      bottom: 88px;
      right: 0px;
      z-index: 999;
    }
  }
</style>
