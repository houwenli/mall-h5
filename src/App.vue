<template>
  <div ref="app" id="app" class="temp-android">
      <keep-alive>
        <router-view v-if="$route.meta.keepalive && isRouterAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepalive && isRouterAlive"></router-view>
  </div>
</template>

<script>
  // //判断数组中是否包含某字符串
  // Array.prototype.contains = function (needle) {
  //   for (i in this) {
  //     if (this[i].indexOf(needle) > 0) return i
  //   }
  //   return -1
  // }
  // import inobounce from 'inobounce'
  import { checkFreeSignIn } from '@/utils/hybrid'
  import { removeToken, getToken } from '@/utils/token'
  import Cookies from 'js-cookie'
  import { isWx } from '@/utils/utils'
  import { mapGetters } from 'vuex'
  export default {
    name: 'app',
    data() {
      return {
        fullscreen: false,
        scrollTop: 0,
        isRouterAlive: true,
        appData: ""
      }
    },
    provide() {
      return {
        reload: this.reload,
      }
    },
    computed: {
      ...mapGetters(['phoneType']),
    },
    // watch: {
    //   phoneType: {
    //     // 判断h5所处平台，为IOS则禁用IOS原生滑动橡皮筋效果
    //     handler: function(newV) {
    //       if (newV === 'IOS') {
    //         inobounce.enable()
    //       } else {
    //         inobounce.disable()
    //       }
    //     },
    //     immediate: true,
    //   },
    // },
    created() {
      this.$store.dispatch('setPhoneType')
      // 用户从乘客端或车主端端进入时,暂时还没有拿到getChannel()返回的参数,导致首页配置接口返回数据有误,延时操作是为了解决此问题
      setTimeout(() => {
        this.$store.dispatch('HOME_PAGE_CONFIG/queryMobileIndex') //加载首页配置数据
        this.$store.dispatch('HOME_PAGE_CONFIG/popupWindowConfig') //加载弹窗配置数据
        // 判断普通h5是否关闭了弹窗
        Cookies.set('distribution_PagePopUpWindow', Cookies.get('showedHomePagePopUpWindowDistribution'))
        Cookies.set('distribution_floatBtn', Cookies.get('floatBtnDistribution'))
      }, 500)

      if (
        (window.webkit || window.ws) &&
        !isWx() &&
        window.location.pathname !== '/pay' &&
        window.location.pathname !== '/wxPayInApp' &&
        window.location.pathname !== '/paysuccess' &&
        window.location.pathname !== '/nopaysuccess' &&
        window.location.pathname !== '/rechargSuccess'
      ) {
        removeToken()
      }

      let pathName = location.pathname
      if (
        pathName != '/privacyAgreement' &&
        pathName != '/userRegisterAreement' &&
        pathName != '/qrCodePay' &&
        pathName != '/qrCodePaySuccess' &&
        pathName != '/storePay' &&
        pathName != '/mobilePhoneAdv/index' &&
        pathName != '/smartentry' // 中转页不需要免密登录
      ) {
        checkFreeSignIn()
      }
      this.quickHideAddressBar()
    },
    mounted() {

      // 方案代号: H1001 用于修复ios的返回白屏问题
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual' //改为manual之后，就不会记录滚动位置
      }
      this.setWebFunny()
      // this.appData = JSON.parse(localStorage.getItem('appData')) || {}
      // if(this.appData.statusHeight) this.$refs.app.style.paddingTop  = (this.appData.statusHeight || 0) + 'px'
    },
    methods: {
      async setWebFunny() {
        let channelName = Cookies.get('_wsf_channel_name')
        if (getToken()) {
          if (!this.$store.getters.userId) {
            let userInfo = await this.$store.dispatch('user/getUserInfo')
          }
          window.localStorage.wmUserInfo = JSON.stringify({ userId: this.$store.getters.userId, userTag: channelName, projectVersion: 'V1.8.0' })
          //覆盖未登录uid
          this.$store.commit('SET_NOTLOGINUID', this.$store.getters.userId)
        } else {
          let userId = ''
          if (this.$store.getters.notLogInUid) {
            userId = this.$store.getters.notLogInUid
          } else {
            userId = '未登录-' + Math.floor(Math.random() * 1000000) + new Date().getTime()
            this.$store.commit('SET_NOTLOGINUID', userId)
          }
          window.localStorage.wmUserInfo = JSON.stringify({
            userId: userId,
            userTag: channelName,
            projectVersion: 'V1.8.0',
          })
        }
      },
      quickHideAddressBar() {
        setTimeout(function() {
          if (window.pageYOffset !== 0) return
          window.scrollTo(0, window.pageYOffset + 1)
        }, 1000)
      },
      reload() {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },
    },
    updated() {
      window.scroll(0, 0)
    },
    beforeDestroy() {
      localStorage.removeItem('showedHomePagePopUpWindow')
      localStorage.removeItem('floatBtnH5')
    },
    destroyed() {
      removeToken()
    },
  }
</script>

<style lang="less">
  #app {
    height: 100%;
    // 引入组件 inobounce 导致无法滚动，加上overflow属性
    // overflow: auto;
  }

  @import '~vux/src/styles/reset.less';
</style>
