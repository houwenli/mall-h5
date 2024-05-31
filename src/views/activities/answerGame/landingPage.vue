<template>
  <div class="page-container">
    <header v-if="(isAndroid || isPhone) && !isH5" class="fixed-header">
      <div style="display: flex;">
        <div class="back" @click="goBack()"><img src="@/assets/img/back1@2x.png" alt="" /></div>
        <van-popover v-model="showPopover" trigger="click" :actions="actions" @select="handleSelect" placement="bottom"
          get-container=".search_box">
          <template #reference>
            <div class="search-middle">
              <i class="backimg"></i>
            </div>
          </template>
        </van-popover>
      </div>
      <div class="title">{{ '万顺福女神节' }}</div>
    </header>
    <div class="poster-container">
      <el-amap style="display: none" :plugin="plugin"></el-amap>
      <div class="second-box" style="display: flex;" v-if="isH5">
        <div @click="$router.replace({ path: '/' })" class="back-box"><img src="@/assets/img/fanhui.png" alt="" /></div>
        <van-popover v-model="showPopover" trigger="click" :actions="actions" @select="handleSelect" placement="bottom"
          get-container=".search_box">
          <template #reference>
            <div class="gengduo-box">
              <img src="@/assets/img/gengduo.png" alt="" />
            </div>
          </template>
        </van-popover>
      </div>
      <div class="share-box" @click="handleShare"> <img class="fenxiang-box"
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_fenxiang.png" />
        <div class="fenxiang-title">分享</div>
      </div>
      <van-share-sheet v-model="showShare" :options="options" @select="onSelect" @cancel="clonse"
        @click-overlay="clonse" />
    </div>
    <!-- 小游戏入口 -->
    <img class="game-enter" @click="getActivity()"
      src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_youxirukou.gif"
      alt="">

    <div class="goods-container-panel">
      <goodsPanel type="1" :list="goodsList[1]" :hasDiscount="true"></goodsPanel>
      <goodsPanel type="2" :list="goodsList[2]" :hasDiscount="true"></goodsPanel>
      <goodsPanel type="3" :list="goodsList[3]" :hasDiscount="true"></goodsPanel>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/token'
import { gameRecord, getCouponList, addRecord } from '@/api/activities/games.js'
import goodsPanel from './components/goods-panel.vue'
import { goodsList } from './data.js'
import { bargainVisit } from '@/api/visit.js'
import { setToken } from '@/utils/token'
// import { gameRecord } from '@/api/activities/games.js'
import mixins from '@/mixins/activities/distributionActivity.js'
export default {
  name: 'landingPage',
  // mixins: [mixins],
  components: {
    goodsPanel,
  },
  computed: {
    options() {
      if (this.isH5) {

        return [
          { name: '复制链接', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang_lianjie.png', type: 3 },

        ]

      } else {
        return [
          { name: '微信好友', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang-vxicon.png', type: 1 },
          { name: 'QQ好友', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang_QQ.png', type: 2 },
          { name: '复制链接', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang_lianjie.png', type: 3 },
        ]
      }
    },
    isH5() {
      return this.$store.state.userSource == 3
    }
  },
  data() {
    const self = this
    return {
      hasData: false,
      goodsList: goodsList,
      showPopover: false,
      actions: [
        { text: '首页', icon: require('@/assets/img/goodsDetail/index.png'), path: '' },
        { text: '购物车', icon: require('@/assets/img/goodsDetail/cart.png'), path: 'cart' },
        { text: '个人中心', icon: require('@/assets/img/goodsDetail/home.png'), path: 'home' },
        // { text: '我的收藏', icon: require('@/assets/img/goodsDetail/mycollectsku.png'), path: 'mycollectsku' },
        // { text: '浏览记录', icon: require('@/assets/img/goodsDetail/mybrowserecord.png'), path: 'mybrowserecord' },
      ],
      // isGameShow: false, //是否显示小游戏
      adcode: null,
      isPhone: false,
      isAndroid: false,
      showShare: false, //显示--分享面板
      shareType: -1,
      isAppEnter: 0,
      posterImg: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/share-img54.jpg',
      plugin: [
        {
          enableHighAccuracy: false, // 是否使用高精度定位，默认:true
          timeout: 5000, // 超过30秒后停止定位，默认：无穷大
          showButton: false, // 显示定位按钮，默认：true
          pName: 'Geolocation',
          events: {
            init: (o) => {
              self.GDinit(o, self) // 获取当前位置
            },
          },
        },
      ],
    }
  },
  created() {
    const { isAndroid, isPhone } = this.isMobile();
    this.isPhone = isPhone
    this.isAndroid = isAndroid
    //isAppEnter判断是否是从APP进入 是为1 否则为0
    this.isAppEnter = this.getQueryString() === 'isAppEnter=1' ? 1 : 0
    console.log(this.isAppEnter, ' this.isAppEnter');
  },
  mounted() {
    bargainVisit({
      // 页面埋点
      isBargain: 1,
    })
      .then((res) => { })
      .catch((e) => { })
    if (this.isWeChat) {
      const secScript = document.createElement('script')
      secScript.setAttribute('type', 'text/javascript')
      secScript.setAttribute('src', 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js')
      document.body.append(secScript)
    }
  },
  methods: {
    isMobile() {
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
    handleSelect(action, index) {
      if (!action.path) {
        this.$router.push({
          path: `/${action.path}`
        })
      } else {
        // 活动页-进入页面就种了token
        console.log('拿用户信息')
        console.log(getToken())
        if (!getToken()) {
          this.$router.push({ path: '/login', query: { url: `${location.pathname + location.search}` } })
          return
        } else {
          console.log('有登录信息=- 跳转到期望的页面')
          this.$router.push({
            path: `/${action.path}`
          })
        }
      }

    },
    //返回
    goBack() {
      //isAppEnter参数判断是否是从APP进入
      //从APP弹框或者占位广告进入时 点击返回 返回APP首页
      if (this.isAppEnter) {
        if (window.ws) {
          // android环境
          window.ws.finishActivity();
        } else if (window.webkit) {
          // ios环境
          window.webkit.messageHandlers.finishActivity.postMessage('');
        }
        //万顺福商城 或者H5进入时  点击返回 返回万顺福商城首页
      } else {
        this.$router.push({ path: '/' })
      }

    },
    getQueryString() {
      //拿到乘客deeplink配置的参数 isAppEnter=1
      let search = decodeURI(window.location.search)
      if (search) {
        let result = decodeURI(window.location.search).split('?')
        return result[1] ? result[1] : null
      }
    },
    // 查询当前经纬度
    GDinit(o) {
      o.getCurrentPosition((status, result) => {
        if (result.addressComponent && result.addressComponent.adcode) {
        }
        if (status === 'complete' && result.info === 'SUCCESS') {
          // 首先获取活动规则
          this.adcode = result.addressComponent.adcode || null
          // this.getActivity(adcode)
        } else {
          // this.getActivity()
        }
      })
    },
    async getActivity() {
      // let userInfo = await this.$store.dispatch('user/getUserInfo')
      let params = {
        //   areaCode: userInfo.flag === 1 ? JSON.parse(userInfo.data.registerIpJson).cityCode : null,
        areaCode: this.adcode,
      }
      await getCouponList(params)
        .then((res) => {
          this.activityId = res.data.id ? res.data.id : null
          this.activityRuleDescList = res.data.activityRuleDescList || []
          if (this.activityId && res.data.activityRuleDescList) {
            //有活动并且有卡券
            gameRecord()
              .then((res) => {
                if (res.code === 200) {
                  this.$router.push({
                    name: 'answerGame',
                    query: {
                      areaCode: this.adcode,
                    }
                  })
                }
              })
              .catch((err) => {
                console.log('err:', err)
              })

          } else {
            this.$router.push({
              name: 'noActivity',
            })
          }

        })
        .catch((err) => {
          console.log('err:', err)
        })
    },
    clonse() {
      this.showShare = false
    },
    async toMiniH5(platform, shareData) {
      shareData = JSON.stringify(shareData)
      console.log(`分享海报${platform === 1 ? 'ios' : '安卓'},shareData: `, shareData)
      if (platform === 2) {
        try {
          window.ws.wsShare(shareData)
        } catch (err) {
          console.log('安卓分享失败', err)
        }
      } else if (platform === 1) {
        try {
          window.webkit.messageHandlers.wsShare.postMessage(shareData)
        } catch (err) {
          console.log('ios分享失败', err)
        }
      }
      this.clonse()
    },
    sharePro(shareData) {
      if (window.ws) {
        //安卓
        this.toMiniH5(2, shareData)
      } else if (window.webkit) {
        //IOS
        this.toMiniH5(1, shareData)
      } else {
        console.log('APP分享失败')
      }
    },
    //分享方式  微信  海报
    onSelect(option) {
      switch (option.type) {
        case 1:
          let shareData = this.getShareData(option.type)
          this.sharePro(shareData)
          break
        case 2:
          let shareAata = this.getShareData(option.type)
          this.sharePro(shareAata)
          break;
        case 3:
          this.getShareLink()
          break;
        default:
          break
      }
    },
    getShareLink() {
      let baseUrl = window.location.origin
      let shareContent
      if (this.shareType == 5) {
        shareContent = `${baseUrl}/active/h5/GameLandingPage`
      } else {
        shareContent = `${baseUrl}/active/h5/GameLandingPage`
      }
      let input1 = document.createElement('input') // 直接构建input
      input1.value = shareContent // 设置内容
      document.body.appendChild(input1)
      input1.select() // 选择实例内容
      document.execCommand('Copy') // 执行复制
      console.log(input1.value)
      document.body.removeChild(input1) // 删除临时实例
      this.$toast.success('复制成功！')
      this.showShare = false
    },
    // 分享方式入参
    getShareData(key) {
      let share
      let baseUrl = window.location.origin
      /**
      * this.shareType-option.type
        //单品-微信好友-链接 1-1
        单品-分享海报-保存图片 3-3
        单品-分享海报-微信好友 3-4
        //列表-微信好友-链接 2-1
        列表-分享海报-保存图片 4-3
        列表-分享海报-微信好友 4-4
      */
      switch (key) {
        case 1:
          share = {
            imgUrl: this.posterImg,
            platformTag: 3, //3= 微信好友
            shareType: 1, //3=分享图片
            title: '万顺福女神节，最高88元优惠券等你来赢！',
            description: "首波优惠券来袭，答题来赢！",
            url: `${baseUrl}/active/h5/GameLandingPage`,
          }
          break
        case 2:
          share = {
            imgUrl: this.posterImg,
            platformTag: 1, //1=qq好友
            shareType: 1, //3=分享图片
            title: '万顺福女神节，最高88元优惠券等你来赢！',
            description: "首波优惠券来袭，答题来赢！",
            url: `${baseUrl}/active/h5/GameLandingPage`,
          }
          break
        case 6:
          share = {
            imgUrl: this.posterImg,
            platformTag: 4, // 4=朋友圈
            shareType: 3, //3=分享图片
          }
          break
        default:
          break
      }
      return { sharePlatformList: [share] }
    },
    handleShare() {
      this.showShare = true
      this.shareType == 5
    },
    //    首次进入调用活动参与记录接口
    async setGameRecord() {
      await gameRecord()
        .then((res) => { })
        .catch((err) => {
          console.log('err:', err)
        })
    },
    goTo() {
      // this.setGameRecord()
      // this.$router.push({
      //   name: 'answerGame',
      //   query: {
      //   }
      // })
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
  // justify-content: space-between;
  align-items: center;

  .back {
    margin-left: 12px;
    display: flex;
    align-items: center;

    img {
      width: 24px;
    }
  }

  .search-middle {
    margin-right: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    margin-left: 12px;

    // border: 1px solid rgba(151,151,151,0.2);														
    .backimg {
      display: block;
      background: url('../../../assets/img/gengduo.png') no-repeat center center;
      background-size: 100%;
      width: 18px;
      height: 21px;
    }

  }

  .title {
    text-align: center;
    color: #000;
    font-size: 18px;
    line-height: 44px;
    margin-left: 35px;
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

.share-box {
  position: fixed;
  width: 16.8vw;
  height: 7.4666666667vw;
  background: #000000;
  opacity: 0.4;
  top: 60%;
  right: 0px;
  border-bottom-left-radius: 14px;
  border-top-left-radius: 14px;
  color: #fff;
  display: flex;

  .fenxiang-title {
    margin-top: 5px;
    margin-left: 4px;
  }
}

/deep/ .van-popover__content {
  background-color: #fff !important;
}

.page-container {
  background: #FFD8D7;
  overflow-y: auto;
}

.poster-container {
  // margin-top: 44px;
  width: 100%;
  height: 294px;
  position: relative;
  // overflow: hidden;
  background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/luodiye_beijing.png');
  background-size: 100% 310px;
}

.back-box {
  width: 40px;
  height: 30px;
  // position: absolute;
  background: #fff;
  opacity: 0.8;
  top: 30px;
  left: 14px;
  border-radius: 15px;
  // border: 1px solid #000000;

  img {
    margin-left: 8px;
    width: 11px;
    margin-top: 5px;
    margin-left: 13px;
  }

}

.second-box {
  position: absolute;
  left: 16px;
  top: 26px;

  /deep/ .van-popover__wrapper {
    width: 40px;
    height: 30px;
    margin-left: 8px;
  }
}

.gengduo-box {
  background: #fff;
  opacity: 0.8;
  border-radius: 15px;

  img {
    width: 20px;
    margin-left: 9px;
    margin-top: 6px;
  }
}

.fenxiang-box {
  width: 18px;
  height: 16px;
  margin-left: 10px;
  margin-top: 6px;
}

.poster {
  width: 100%;
  // height: 430px;
  height: 310px;
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

/deep/ .van-share-sheet__cancel {
  background: #F8F8F8 !important;
}

.van-popup--bottom.van-popup--round {
  background-color: #F8F8F8;
}

/deep/ .van-share-sheet__options {
  justify-content: space-evenly;
}

.game-enter {
  display: block;
  width: 100%;
  height: 110px;
  margin-bottom: 20px;
}</style>
