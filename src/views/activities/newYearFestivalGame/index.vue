<template>
  <div class="page-container">
    <!--地图定位-->
    <el-amap style="display: none" :plugin="plugin"></el-amap>
    <header class="fixed-header" v-if="isAppEnter">
      <div class="back" @click="$router.replace({ path: '/' })"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">{{ $route.meta.title }}</div>
      <div class="more"></div>
    </header>
    <div class="main-container">
      <img class="game-bg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-home-backgrounde.png" alt="" />

      <div class="entrance">
        <!-- <div class="headline"> -->
        <!-- <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-bgc-text2.png" /> -->
        <!-- <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-bgc-text1.png" /> -->
        <!-- </div> -->
        <div class="begin-box">
          <div class="start-button-click" @click="goTo('answer')"></div>
          <!-- 开始游戏按钮 -->
          <img class="game-start-button" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-buttom-bgc.gif" />

          <img class="shouzhi-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-home-shouzhi.gif" />
        </div>

        <div class="fun-button">
          <div class="img-ranking">
            <img @click="goTo('ranking')" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-home-rankingList.png" />
          </div>
          <div class="img-coupons">
            <img @click="goTo('myCoupon')" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-home-view-coupons.png" />
          </div>
        </div>
      </div>
      <div class="description">
        <div class="activity-explain">
          <div class="title">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-home-leftIcon.png" />
            <div class="explain-text">
              活动说明
            </div>
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-home-rightIcon.png" />
          </div>
          <div class="info">
            <div v-for="(item, index) in activityRuleDescList" :key="index">{{ item }}</div>
          </div>
        </div>
        <div class="activity-gift">
          <div class="title">
            <span>
              活动礼品
            </span>
          </div>
          <p class="info">此次活动有折扣券和立减券两种券，每个商品都有对应的优惠券。</p>
          <div class="gift-box">
            <div class="img-box">
              <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-giftbox-dynamics.jpg" />
              <div class="gift-text">立减大礼包</div>
            </div>
            <div class="img-box">
              <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-giftbox-dynamics.jpg" />
              <div class="gift-text">折扣大礼包</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="isNotActivity" :close-on-click-overlay="false">
      <img class="receivedFail" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupons-empty.png" />
      <p class="big-text">券已发完</p>
      <p class="small-text">抱歉！您来晚了~</p>
    </van-popup>
  </div>
</template>

<script>
  import { gameRecord, getCouponList, addRecord } from '@/api/activities/games.js'
  export default {
    name: 'answerGame',
    data() {
      const self = this
      return {
        activityId: null,
        isNotActivity: false, //是否没有活动
        activityRuleDescList: [], //活动说明
        id: null,
        isWeChat: false,
        isAppEnter: 0, //是否显示title
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
      this.isAppEnter = Number(this.$route.query.isAppEnter)
      this.isWeChat = window.__wxjs_environment === 'miniprogram'
    },
    mounted() {
      //   this.setGameRecord()
      this.addRecord()
    },
    methods: {
      // 查询当前经纬度
      GDinit(o) {
        o.getCurrentPosition((status, result) => {
          if (result.addressComponent&&result.addressComponent.adcode) {
            console.log(result.addressComponent.adcode, '=================')
          }
          if (status === 'complete' && result.info === 'SUCCESS') {
            // 首先获取活动规则
            let adcode = result.addressComponent.adcode || null
            this.getActivity(adcode)
          } else {
            this.getActivity()
          }
        })
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
      async getActivity(code) {
        // let userInfo = await this.$store.dispatch('user/getUserInfo')
        let params = {
          //   areaCode: userInfo.flag === 1 ? JSON.parse(userInfo.data.registerIpJson).cityCode : null,
          areaCode: code,
        }
        await getCouponList(params)
          .then((res) => {
            this.activityRuleDescList = res.data.activityRuleDescList || []
            this.activityId = res.data.id ? res.data.id : null
          })
          .catch((err) => {
            console.log('err:', err)
          })
      },
      async goTo(name) {
        console.log('点击了')
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
                  .then((res) => {})
                  .catch((err) => {
                    console.log('err:', err)
                  })
                this.$router.push({
                  name,
                  query: {
                    activityId: this.activityId,
                    id: this.id,
                    isAppEnter: this.isAppEnter,
                  },
                })
              } else {
                this.isNotActivity = true
                setTimeout(() => {
                  this.isNotActivity = false
                }, 2000)
              }
            })
            .catch((err) => {
              console.log('err:', err)
            })
        } else {
          this.$router.push({
            name,
            query: {
              activityId: this.activityId,
              id: this.id,
              isAppEnter: this.isAppEnter,
            },
          })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
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
    // background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-hom-backgrounde.jpg');
    // background-size: 100% 100%;
    overflow: auto;
    background: #f6e1c2;
    flex: 1;
    display: flex;
    flex-direction: column;

    position: relative;
    .game-bg {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 0;
    }
    .entrance {
      min-height: 58%;
      display: flex;
      flex-direction: column-reverse;
      justify-content: space-between;
      position: relative;
      margin: 0px 9px;
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
      .fun-button {
        position: absolute;
        z-index: 21;
        bottom: 30px;
        right: 5px;
        .img-ranking {
          img {
            width: 61px;
            height: 54px;
          }
        }
        .img-coupons {
          img {
            width: 61px;
            height: 66px;
          }
        }
      }

      .begin-box {
        position: relative;
        width: 220px;
        margin: 0px auto;
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
          width: 100%;
        }

        .shouzhi-img {
          position: absolute;
          width: 129px;
          bottom: -42px;
          right: -45px;
          z-index: 15;
        }
      }
    }
    .description {
      flex: 1;
      margin-top: 12px;
      padding: 23px 27px;
      background: #fefaf9;
      border-radius: 10px;
      margin: 9px;
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
        color: rgb(189, 86, 2);
        div {
          display: flex;
          align-items: center;
          flex-direction: row;
          &:before {
            content: '';
            margin-right: 10px;
            display: inline;
            width: 5px;
            height: 5px;
            border-radius: 100%;
            background: rgb(189, 86, 2);
          }
        }
      }
    }
    .activity-gift {
      .title {
        font-size: 14px;
        font-weight: 700;
        color: rgb(189, 86, 2);
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
          background: linear-gradient(56deg, #a75236 0%, #fefaf9 100%);
          opacity: 0.33;
          width: 30%;
          height: 1px;
        }
        & span:before {
          left: 7%;
          background: linear-gradient(270deg, #a75236 0%, #fefaf9 100%);
        }
        & span:after {
          right: 7%;
          background: linear-gradient(90deg, #a75236 0%, #fefaf9 100%);
        }
      }
      .info {
        margin-bottom: 8px;
      }
      .gift-box {
        display: flex;
        justify-content: space-between;
        .img-box {
          background: #ffeded;
          border-radius: 10px;
          width: 148px;
          height: 70px;
          display: flex;
          align-items: center;
          img {
            width: 68px;
          }
          .gift-text {
            color: #e43225ff;
            font-weight: Bold;
            font-size: 12px;
            margin-right: 10px;
          }
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
  }
</style>
