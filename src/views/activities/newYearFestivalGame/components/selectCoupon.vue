<template>
  <van-popup v-model="isShow" :close-on-click-overlay="false" class="select-popup">
    <div class="gift-dialog-container">
      <div class="headline">
        <div class="head">
          <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-doll-header.png" />
        </div>
        <img class="headline-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-success.png" />
        <div id="svga-container" class="light"></div>
      </div>
      <p class="title-big">恭喜您挑战成功！</p>
      <p class="title-small">您可以选择一张优惠券</p>
      <div class="coupon-list">
        <div v-for="(item, index) in couponList" :key="index" @click="selectCoupon(item)" class="coupon-item">
          <div class="left">
            <div class="coupon-img">
              <img :src="item.url" />
            </div>
            <div class="info">
              <p class="goods-name">{{ item.showName }}</p>
              <p class="goods-time">{{ item.packCouponTimeLimitTxt }}</p>
            </div>
          </div>
          <div class="right">
            <div class="goods-pire">
              <div v-if="item.couponsType == 1 || item.couponsType == 3">
                <span class="pire-icon">￥</span>
                <span class="pire">{{ item.faceValue / 100 }}</span>
              </div>
              <div v-else>
                <span class="pire">{{ item.faceValue / 100 }}</span>
                <span class="pire-type">折</span>
              </div>
            </div>
            <div class="goods-rule">{{ item.couponUseInfoTxt }}</div>
          </div>
          <div class="mask" v-if="item.isMask"></div>
        </div>
      </div>
      <div class="confirm" @click="itemCoupon && receive()">
        <div class="button-Mask" v-if="!itemCoupon"></div>
        <p>确认领取</p>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import { receiveCoupons, addRecord } from '@/api/activities/games.js'
  import { deepClone } from '@/utils/utils'
  import SVGA from 'svgaplayerweb'
  export default {
    name: 'selectCoupon',
    props: {
      isShow: {
        type: Boolean,
        default: true,
      },
      activityId: {
        type: [Number, String],
        default: null,
      },
      listData: {
        type: Array,
        default: () => [],
      },
      id: {
        type: [Number, String],
        default: null,
      },
    },
    watch: {
      listData: {
        deep: true,
        immediate: true,
        handler(newVal) {
          console.log(newVal, '监听')
          this.couponList = deepClone(newVal)
        },
      },
    },
    data() {
      return {
        itemCoupon: null, //选中的卡券
      }
    },
    mounted() {
      this.loadSVGA()
    },

    methods: {
      loadSVGA() {
        let player = new SVGA.Player('#svga-container')
        let parser = new SVGA.Parser()

        parser.load('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/svga-header-bg-shim.svga', (videoItem) => {
          console.log(videoItem)

          player.setVideoItem(videoItem)
          player.startAnimation()
        })
      },
      selectCoupon(coupon) {
        coupon.isMask = false
        this.itemCoupon = coupon
        this.couponList.forEach((item, index) => {
          console.log(item.giftId, coupon.giftId)
          if (item.giftId != coupon.giftId) {
            console.log('改变了')
            // item.isMask = true
            this.$set(item, 'isMask', true)
            this.$forceUpdate()
          }
        })
        console.log(this.couponList, 'this.couponList')
      },
      async receive() {
        let params = {
          activityId: this.itemCoupon.activityId,
          couponId: this.itemCoupon.id,
          sendNumber: this.itemCoupon.sendNumber,
        }
        await receiveCoupons(params)
          .then((res) => {
            if (res.code === 200) {
              // 领券成功才有记录
              let paramsRecord = {
                claimNum: this.itemCoupon.sendNumber,
                id: this.id,
                nodeType: 3,
              }
              addRecord(paramsRecord).then((res) => {})
              this.$emit('updateComponentName', 'receivedSuccessfully', this.itemCoupon)
            } else {
              this.$emit('updateComponentName', 'receivedFail')
            }
          })
          .catch((err) => {
            console.log('err:', err)
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .van-popup {
    height: 100vh;
    flex-direction: column;
  }
  .select-popup {
    .headline {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 235px;
      width: 100%;
      .headline-img {
        width: 100%;
        position: relative;
        bottom: 35px;
        left: 50%;
        transform: translate(-50%, 0%);
        z-index: 20;
      }
      .light {
        position: absolute;
        bottom: 35px;
        height: 100%;
        width: 100%;
        overflow: hidden;
        z-index: 0;
      }
      .head {
        background: #ffffff;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid #fd7040;
        position: absolute;
        border-radius: 50%;
        width: 87px;
        height: 87px;
        padding: 4px;
        bottom: 120px;
        z-index: 30;
        img {
          width: 65px;
          position: relative;
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translate(-50%, 0%);
        }
      }
    }
    .title-big {
      font-size: 30px;
      font-family: Source Han Sans CN;
      font-weight: 800;
      color: #ffffff;
      line-height: 33px;
      text-align: center;
      margin: 0px 0px 9px 0px;
    }
    .title-small {
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      line-height: 28px;
      text-align: center;
      margin-bottom: 40px;
    }
    .coupon-list {
      width: 309px;

      .coupon-item {
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupon-bgc.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 10px;
        display: flex;
        height: 88px;
        position: relative;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;
        .mask {
          background: rgba(0, 0, 0, 0.5) !important;
          height: 100%;
          position: absolute;
          width: 100%;
        }

        .left {
          flex: 1;
          padding: 5px;
          display: flex;
          .coupon-img {
            min-width: 79px;
            max-width: 79px;
            height: 79px;
            border-radius: 5px;
            margin-right: 10px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .goods-name {
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #000000;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden; //溢出内容隐藏
            text-overflow: ellipsis; //文本溢出部分用省略号表示
            display: -webkit-box; //特别显示模式
            -webkit-line-clamp: 2; //行数
            line-clamp: 2;
            -webkit-box-orient: vertical; //盒子中内容竖直排列
          }
          .goods-time {
            font-size: 10px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #000000;
          }
          img {
            height: 100%;
            background: #8f8f8f;
            border-radius: 5px;
          }
        }
        // & .left:before {
        //   content: '';
        //   position: absolute;
        //   top: 50%;
        //   //   background: #a75236;
        //   background: #00ff62;
        //   width: 5px;
        //   height: 5px;
        // }
        .right {
          border-radius: -5px;
          width: 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .goods-pire {
            display: flex;
            height: 26px;
            line-height: 26px;
            .pire-icon {
              font-size: 10px;
              font-weight: bold;
              color: #ffffff;
            }
            .pire {
              font-size: 22px;
              font-family: Arial;
              font-weight: bold;
              color: #ffffff;
            }
            .pire-type {
              font-size: 12px;
              font-family: Source Han Sans CN;
              font-weight: bold;
              color: #ffffff;
            }
          }
        }
        .goods-rule {
          font-size: 10px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #ffffff;
        }
      }
    }
    .confirm {
      position: relative;
      margin: 0 auto;
      margin-top: 24px;
      width: 144px;
      height: 49px;
      background: linear-gradient(0deg, #feede6 0%, #fff7f1 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ea3f53;
      .button-Mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0.5;
        border-radius: 24px;
      }
    }
  }

  .gift-dialog-container {
    overflow: auto;
    padding: 30px;
  }
</style>
