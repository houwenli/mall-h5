<template>
  <div class="page-container">
    <header v-if="!isH5" class="fixed-header">
      <div class="back" @click="$router.replace({ path: '/' })"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">{{ $route.meta.title }}</div>
      <div class="more"></div>
    </header>
    <div class="main-container">
      <div v-if="isH5" @click="$router.replace({ path: '/' })" class="back-box"><img src="@/assets/img/back1@2x.png"
          alt="" /></div>
      <div class="top-box">
        <div class="fun-button">
          <div class="img-ranking">
            <img @click="goTo('ranking')"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/shouye_paihangbang.png" />
            <p>排行榜</p>
          </div>

          <div class="img-coupons">
            <img @click="goTo('myCoupon')"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/shouye_youhuiquan.png" />
            <p>优惠券</p>
          </div>

        </div>
      </div>
      <div class="entrance">
        <div class="begin-box">
          <div class="start-button-click" @click="goTo('answer')"></div>
          <!-- 开始游戏按钮 -->
          <img class="game-start-button"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/shouye_kaishiyouxi.png" />

          <img class="shouzhi-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/youxishouye_shouzhi.png" />
        </div>

      </div>
      <div class="description">
        <div class="activity-explain">
          <div class="info">
            <div  v-for="(item, index) in activityRuleDescList" :key="index" v-show="item"> {{ item }}</div>
          </div>
        </div>
        <div class="activity-gift">
          <div class="title">
            <span>
              活动礼品
            </span>
          </div>
          <p class="info-tow">此次活动有折扣券和立减券两种券，每个商品都有对应的优惠券。</p>
          <div class="gift-box">
            <div class="left-box">立减大礼包</div>
            <img
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-giftbox-dynamics.jpg" />
            <div class="right-box">折扣大礼包</div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="isNotActivity" :close-on-click-overlay="false">
      <img class="receivedFail"
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/isNotActivity.png" />
    </van-popup>
    <ranking :isRanking="isRanking" @close="close"></ranking>
    <myCoupon :isMyCoupon="isMyCoupon" @closed="closed" @closeMyCoupn="closeMyCoupn"></myCoupon>
</div>
</template>

<script>

import { gameRecord, getCouponList, addRecord } from '@/api/activities/games.js'
import ranking from './components/ranking.vue'
import myCoupon from './components/myCoupon.vue'
export default {
  name: 'answerGame',
  components: {
    ranking,
    myCoupon
  },

  data() {
    const self = this
    return {
      isRanking: false,//排行榜显示
      isMyCoupon: false,//我的优惠券显示
      activityId: null,
      openCoupon: false,
      isNotActivity: false, //是否没有活动
      activityRuleDescList: [], //活动说明
      id: null,
      isH5: this.$store.state.userSource == 3,
    }
  },
  created() {
    if (localStorage.getItem('openCouponType')) {
      this.isMyCoupon = true
      localStorage.removeItem('openCouponType')
    }
    this.adcode=this.$route.query.areaCode
    this.getActivity()
  },
  mounted() {

    this.addRecord()
  },
  methods: {
    closeMyCoupn(val) {

    },
    close(val) {
      this.isRanking = val
    },
    closed(val) {
      this.isMyCoupon = val
      delete this.$route.query.openCoupon
    },
    // 首次进入调用活动参与记录接口
    //   async setGameRecord() {
    //     await gameRecord()
    //       .then((res) => {})
    //       .catch((err) => {
    //         console.log('err:', err)
    //       })
    //   },
    // 第一次添加活动记录
    addRecord() {
      let params = {
        claimNum: 0,
        nodeType: 1,
      }
      addRecord(params)
        .then((res) => {
          if (res.code === 200) {
            //  需要拿到data作为后两次次接口的id
            this.id = res.data
          }
        })
        .catch((err) => {
          console.log('err:', err)
        })
    },
    async getActivity() {
      // let userInfo = await this.$store.dispatch('user/getUserInfo')
      let params = {
        areaCode: this.adcode,
      }
      await getCouponList(params)
        .then((res) => {
          this.activityId = res.data.id ? res.data.id : null
          this.activityRuleDescList = res.data.activityRuleDescList || []

        })
        .catch((err) => {
          console.log('err:', err)
        })
    },
    async goTo(name) {
      if (name === 'answer') {
        let params = {
          activityId: this.activityId,
        }
        await getCouponList(params)
          .then((res) => {
            if (res.data.cardCouponList !== null && res.data.cardCouponList.length !== 0) {
              let paramsRecord = {
                claimNum: 0,
                id: this.id,
                nodeType: 2,
              }
              addRecord(paramsRecord)
                .then((res) => {
                  this.$router.push({
                    name,
                    query: {
                      activityId: this.activityId,
                      id: this.id,
                    }
                  })
                    .catch((err) => {
                      console.log('err:', err)
                    })

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
      } else if (name === 'ranking') {
        this.isRanking = true
      } else {
        this.isMyCoupon = true
      }
    },
  },
}
</script>

<style lang="less" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, #481d03 0%, #130600 100%);
  // height: 100%;
}

.fixed-header {
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

  .receivedFail {}

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

.main-container {
  background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/uniapp_shouye_beijing.jpg');
  background-size: 100% 100%;
  // overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;

  .back-box {
    width: 50px;
    height: 28px;
    position: absolute;
    background: #fff;
    opacity: 0.8;
    top: 30px;
    left: 14px;
    border-radius: 15px;

    img {
      margin-left: 8px;
      width: 27px;
    }

  }

  .top-box {
    height: 375px;

    .fun-button {
      position: absolute;
      z-index: 21;
      bottom: 431px;
      right: 5px;
      text-align: center;

      .img-ranking {
        img {
          width: 45.5px;
          height: 46px;
        }

        p {
          color: #ffffff;
          margin: -6px 0px 13px 0px;
          ;
        }
      }

      .img-coupons {
        img {
          width: 45.5px;
          height: 46px;
        }

        p {
          color: #ffffff;
          margin: -8px 0px 0 0px;
          ;
        }
      }
    }
  }

  position: relative;

  .game-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
  }

  .entrance {
    min-height: 58%;

    .headline {
      width: 60%;
      position: absolute;
      left: 10px;
      top: 10px;
      right: 0;
      margin: 0 auto;

      .text-box {
        width: 60%;
      }

      img {
        width: 100%;
      }
    }



    .begin-box :hover {

      transition: scale(1.2);
      /*以1位单位放大和缩小*/

      transition: 0.9s
    }

    .begin-box {
      position: relative;
      width: 220px;
      height: 93px;
      margin: 0px auto;
      transition: 0.5s;
      /*缩放动画特效时间*/
      transition: scale(1.2);
      /*以1位单位放大和缩小*/
      transition: 0.9s;

      @keyframes fadenum {
        0% {
          transform: scale(1);
        }

        25% {
          transform: scale(0.8);
        }

        50% {
          transform: scale(1);
        }

        75% {
          transform: scale(0.8);
        }
      }

      @keyframes shouzhiButton {
        0% {
          transform: translateY(0px) scale(1);
        }

        25% {
          transform: translateY(20px) scale(0.7);
        }

        50% {
          transform: translateY(0px) scale(1);
        }

        75% {
          transform: translateY(20px) scale(0.7);
        }
      }

      .start-button-click {
        position: absolute;
        background: none;
        width: 100%;
        height: 63px;
        border-radius: 32px;
        z-index: 20;
        top: 50%;
        transform: translate(0, -50%);
      }

      .game-start-button {
        width: 225px;
        height: 70px;
        margin: auto;
        z-index: 100;
        animation: fadenum 10s ease-in-out infinite;
        -webkit-animation: fadenum 10s ease-in-out infinite;
      }

      .shouzhi-img {
        position: absolute;
        width: 65px;
        height: 63px;
        bottom: -18px;
        right: -10px;
        z-index: 15;
        animation: shouzhiButton 10s ease-in-out infinite;
        -webkit-animation: shouzhiButton 10s ease-in-out infinite;
      }
    }
  }

  .description {
    width: 371.5px;
    height: 331.5px;
    background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/shouye_huodongshuoming.png');
    background-size: 100% 100%;
    margin-top: 2px;
    z-index: 10;

    .activity-explain {
      .title {
        display: flex;
        align-items: center;
        justify-content: center;

        .explain-text {
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #a75236;
          text-align: center;
          margin: 0px 16px;
        }

        img {
          width: 40px;
          height: 13px;
        }
      }
    }

    .info {
      color: #000000;
      color: #000000;
      margin-top: 50px;
      margin-left: 16px;
      line-height: 16px;
      margin-bottom: 18px;

      div {
        display: inline;
        align-items: center;
        flex-direction: row;
        word-break: break-all;
        display: flex;
        width: 347px;
        font-size: 12px;
        // display: flex; 
        &:before {
          content: '';
          margin-right: 5.5px;
          display: inline;
          width: 4px;
          height: 4px;
          border-radius: 100%;
          background: #FE6DAE;
          display: inline-block;
          margin-bottom: 1px;
        }
      }
    }
  }

  .activity-gift {
    margin-left: 38px;
    width: 300px;

    .title {
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      // font-size: 14px;
      // font-weight: 700;
      color: #FE6DAE;
      text-align: center;
      margin: 8px 0px;
      position: relative;

      & span:before,
      & span:after {
        content: '';
        position: absolute;
        top: 50%;
        width: 308px;
        //   background: #a75236;
        background: linear-gradient(56deg, #FE6DAE 0%, #fefaf9 100%);
        opacity: 0.33;
        width: 30%;
        height: 1px;
      }

      & span:before {
        left: 7%;
        background: linear-gradient(270deg, #FE6DAE 0%, #fefaf9 100%);
      }

      & span:after {
        right: 7%;
        background: linear-gradient(90deg, #FE6DAE 0%, #fefaf9 100%);
      }
    }

    .info-tow {
      margin-bottom: 8px;
      color: #000000;
      font-size: 12px;
    }

    .gift-box {
      width: 304px;
      height: 43px;
      background-color: #FFDCEC;
      border-radius: 22px;
      display: flex;
      justify-content: space-between;

      img {
        width: 112px;
        height: 80px;
        margin-top: -27px;
      }

      .left-box {
        text-align: center;
        line-height: 38px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #FFFFFF;
        width: 92px;
        height: 39px;
        background: linear-gradient(90deg, #F94998 0%, #F9A849 100%);
        border-radius: 19px;
        margin-left: 2px;
        margin-top: 2px;
      }

      .right-box {
        text-align: center;
        line-height: 38px;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #FFFFFF;
        margin-right: 2px;
        margin-top: 2px;
        width: 92px;
        height: 39px;
        background: linear-gradient(90deg, #F94998 0%, #F9A849 100%);
        border-radius: 19px;
      }
    }
  }
}

.van-popup {
  background: none;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 15px;
  overflow-x: hidden;

  img {
    width: 100%;
    margin-top: 201px;
  }

  .big-text {
    font-size: 36px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    line-height: 40px;
  }

  .small-text {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    margin-top: 18px;
  }
}</style>
