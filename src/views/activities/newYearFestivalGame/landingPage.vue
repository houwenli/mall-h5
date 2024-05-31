<template>
  <div class="page-container">
    <header v-if="(isAndroid && !isAppEnter && !isWeChat) || (isPhone && !isWeChat)" class="fixed-header">
      <div class="back" @click="$router.push({ path: '/' })"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">{{ $route.meta.title }}</div>
      <div class="more"></div>
    </header>

    <div class="poster-container">
      <!-- 海报 -->
      <img
        class="poster"
        :style="{ marginTop: (isAndroid && !isAppEnter && !isWeChat) || (isPhone && !isWeChat) ?  '44px': '0'}"
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-poster-2x.png"
      />
      <!-- 衔接过渡的图 -->
      <img class="bg-xian-jie" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-xian-jie-2x.png" alt="">
    </div>
    <!-- 小游戏入口 -->
    <img class="game-enter" v-if="isGameShow" @click="goTo()" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/yuan-xiao-luo-di-ye-game-enter-2x.gif" alt="">

    <div class="goods-container-panel">
      <goodsPanel type="1" :list="goodsList[1]" :hasDiscount="isGameShow"></goodsPanel>
      <goodsPanel type="2" :list="goodsList[2]" :hasDiscount="isGameShow"></goodsPanel>
      <goodsPanel type="3" :list="goodsList[3]" :hasDiscount="isGameShow"></goodsPanel>
    </div>
  </div>
</template>

<script>
  import goodsPanel from './components/goods-panel.vue'
  import { goodsList } from './data.js'
  import { bargainVisit } from '@/api/visit.js'
  import { setToken } from '@/utils/token'
  import { gameRecord } from '@/api/activities/games.js'
  import wx from 'weixin-js-sdk'

  export default {
    name: 'landingPage',
    components: {
      goodsPanel,
    },
    data() {
      return {
        hasData: false,
        goodsList: goodsList,
        isWeChat: false,
        isGameShow: false, //是否显示小游戏
        isAppEnter:0,//是否从app中进入
        isPhone: false,
        isAndroid: false,
      }
    },
    created() {
        // 从app进入游戏落地页不需要title，配置deeplink加上参数判断是否从app进from=app_home
        // wsjc://730/webview?url=https://m-test.wsfmall.com/active/h5/GameLandingPage?from=app_home
        this.isWeChat = window.__wxjs_environment === 'miniprogram'           
        const {  isAndroid, isPhone } = this.isMobile();
        this.isPhone = isPhone
        this.isAndroid = isAndroid
        this.isAppEnter = this.getQueryString() === 'app_home' ? 1 : 0       

        // this.isAppEnter = this.getQueryString() === 'app_home' ? 1 : 0
        console.log('解析到的',this.getQueryString(),typeof this.getQueryString())
        if (this.isWeChat) {
            if(this.getQueryString()){
                setToken(this.getQueryString())
                this.setGameShow()
            } else {
                // this.$router.push('/login')
                wx.miniProgram.redirectTo({url:`/pages/quickLogin/quickLogin?webViewBackUrl=${window.location.href}`})
            }           
        }else{
            this.setGameShow()
        }
    },
    mounted() {             
      bargainVisit({
        // 页面埋点
        isBargain: 1,
      })
        .then((res) => {})
        .catch((e) => {})
      if (this.isWeChat) {
        const secScript = document.createElement('script')
        secScript.setAttribute('type', 'text/javascript')
        secScript.setAttribute('src', 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js')
        document.body.append(secScript)
      }
    },
    methods: {
      isMobile(){
        const ua = navigator.userAgent,
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isChrome = /(?:Chrome|CriOS)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isWexin = ua.toLowerCase().indexOf('micromessenger') !== -1,
            isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isTablet: isTablet, // 平板
            isPhone: isPhone,
            isAndroid: isAndroid,
            isPc: isPc,
            isMobile: isPhone || isAndroid,
            isWexin
        }
      },
      getQueryString() {
        let reg = new RegExp('(^|&)' + '?' + '=([^&]*)(&|$)')
        let result = decodeURI(window.location.search.substr(1)).match(reg)
        return result ? unescape(result[2]) : null
      },
      async setGameShow() {
        let userInfo = await this.$store.dispatch('user/getUserInfo')
        this.isGameShow = userInfo.data.passengerEmpowerStatus ? true : false
      },
    //    首次进入调用活动参与记录接口
      async setGameRecord() {
        await gameRecord()
          .then((res) => {})
          .catch((err) => {
            console.log('err:', err)
          })
      },
      goTo() {
      this.setGameRecord()
        this.$router.push({
          name: 'answerGame',
          query:{
            isAppEnter:(this.isAndroid && !this.isAppEnter && !this.isWeChat) || (this.isPhone && !this.isWeChat)?1:0,
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .fixed-header {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .back {
      margin-left: 12px;

      img {
        width: 24px;
      }
    }

    .title {
      text-align: center;
      color: #000;
      font-size: 18px;
      line-height: 44px;
    }

    .more {
      width: 28px;
      height: 20px;
      line-height: 20px;
      margin-right: 20px;
      color: #333;
      font-size: 14px;
    }
  }
  .page-container {
    background: rgb(226, 40, 42);
    overflow-y: auto;
  }

  .poster-container {
    position: relative;
    overflow: hidden;
  }
  .poster {
    width: 100%;
    // height: 430px;
    height: 474px;
    display: block;
    margin: 0;
  }

  // 衔接层
  .bg-xian-jie {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
  }

  .game-enter {
    display: block;
    width: 100%;
    height: 110px;
    margin-bottom: 20px;
  }

</style>
