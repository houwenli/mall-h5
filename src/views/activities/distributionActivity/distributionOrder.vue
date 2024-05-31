<template>
  <div class="distributionOrder">
    <navbartop :title="$route.meta.title" @clickBack="toBack" :isConfirm="true" class="navtop"></navbartop>
    <div class="top-card">
      <div class="top-card_top">
        <div class="money">
          <p class="money-title">已结算佣金(元)</p>
          <p class="money-val">
            {{ allIncomeCommission | regFenToYuan }}
          </p>
        </div>
        <div class="toGetMoney" v-if="!isH5" @click="share()">
          <span>提现</span>
        </div>
      </div>
      <div class="top-card_bot">
        <div class="unpaid">
          <p class="unpaid-title">待结算佣金(元)</p>
          <p class="unpaid-val">
            ¥{{ toBeSettledCommission | regFenToYuan }}
          </p>
        </div>
      </div>
      <div class="top-card--rule" @click="toRuleDetail">
        <span>规则说明</span>
      </div>
    </div>
    <distrOrder></distrOrder>
    <img class="img_to_top" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png" v-if="showToTop" @click.stop="toPageTop" />
  </div>
</template>

<script>
  import { Userminequery } from '@/api/activities/distributionActivity'
  import navbartop from '@/components/commons/navBartop'
  import distrOrder from './components/distrOrder.vue'
  import { throttle, appBack } from '@/utils/utils'
  import { smartOpenDeepLink } from '@/utils/hybrid'
  import { regFenToYuan } from '@/utils/utils'

  export default {
    components: {
      distrOrder,
      navbartop,
    },
    filters: {
      regFenToYuan(price) {
        return regFenToYuan(price)
      },
    },
    data() {
      return {
        allIncomeCommission: 0,
        toBeSettledCommission: 0,
        miniAppletUserName: process.env.POP_APPLET_ID, // 小程序原始Id
        showToTop: false,
      }
    },
    computed: {
      isH5() {
        return this.$store.state.userSource == 3
      }
    },
    created() {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.scrollHandle, true)
      })
    },
    mounted() {
      setTimeout(this.getQueryUserCommission, 100)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.scrollHandle, true)
    },
    methods: {
      //查看收益
      share() {
        // 尝试拉起小程序
        // if (window.ws) {
        //   this.toMiniApp(2)
        // } else if (window.webkit) {
        //   this.toMiniApp(1)
        // } else {
        //   console.log('APP拉起小程序失败')
        // }

        smartOpenDeepLink('wsf://app/wallet')
      },
      // 分享H5
      async toMiniApp(platform) {
        //判断是否为生成环境
        let miniprogramType
        if (process.env.NODE_ENV == 'production') {
          miniprogramType = 0
        } else {
          miniprogramType = 2
        }
        console.log(miniprogramType)
        //APP分享方法得入参
        let shareData = {
          sharePlatformList: [
            {
              userName: this.miniAppletUserName, // 分销小程序原始ID
              path: `pages/index/index`, //小程序路径
              miniprogramType: miniprogramType, //小程序 —— 0=正式版，1=测试版，2=体验版
              platformTag: 7, //7 =启动小程序
            },
          ],
        }
        shareData = JSON.stringify(shareData)

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
      },
      toRuleDetail() {
        this.$router.push('/distributionRule')
      },
      //返回上一页
      toBack() {
        appBack(this)
      },
      getQueryUserCommission() {
        Userminequery()
          .then((res) => {
            let mineAssetVo = res.data.mineAssetVo || {}

            this.allIncomeCommission = mineAssetVo.removeAdjustSettledAmount
            this.toBeSettledCommission = mineAssetVo.personalAgencyUnsettledAmount
          })
          .catch((err) => {
            console.log(err)
          })
      },
      scrollHandle: throttle(function(e) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        this.showToTop = scrollTop > 500
      }, 500),
      toPageTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .distributionOrder {
    background: #f6f6f6;
  }
  .top-card {
    position: relative;
    background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/commission_card_bg.png') no-repeat;
    background-size: 100% 162px;
    height: 162px;
    border-radius: 0px 0px 10px 10px;
    margin: 12px;
    margin-bottom: 4px;
    padding: 16px 12px;
    &--rule {
      position: absolute;
      top: 16px;
      right: -4px;
      width: 60px;
      height: 23px;
      line-height: 23px;
      text-align: center;
      background: linear-gradient(270deg, #ffffff 0%, #fff9cd 100%);
      box-shadow: -3px 2px 4px 0px #ffbf18;
      border-radius: 100px 0px 0px 100px;
      font-size: 11px;
      color: #999999;
    }
    &--rule::before {
      content: '';
      position: absolute;
      right: 0;
      bottom: -8px;
      width: 0;
      height: 0;
      border-color: transparent #ff9b75;
      border-width: 0 0 8px 4px;
      border-style: solid;
    }
  }
  .top-card_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 34px 12px 0;
    // 已结算佣金
    .money {
      color: #191919;
      .money-title {
        font-size: 13px;
      }
      .money-val {
        margin-top: 8px;
        font-size: 24px;
        line-height: 20px;
        font-weight: bold;
        font-family: DINAlternate-Bold, DINAlternate;
      }
    }
    // 提现规则
    .toGetMoney {
      width: 76px;
      height: 28px;
      background: #191919;
      border-radius: 20px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      text-align: center;
      color: #ffffff;
      line-height: 28px;
    }
  }
  .top-card_bot {
    margin-top: 26px;
    .unpaid {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 0 12px;
      width: 100%;
      height: 29px;
      color: #191919;
      background: rgba(251, 251, 251, 0.24);
      border-radius: 8px;
      &-title {
        font-size: 13px;
        line-height: 17px;
      }
      &-val {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
  .img_to_top {
    width: 40px;
    height: 40px;
    position: fixed;
    bottom: 60px;
    right: 0px;
  }
</style>
