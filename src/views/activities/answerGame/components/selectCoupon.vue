<template>
  <van-popup v-model="isShow" :close-on-click-overlay="false" class="select-popup">
   
    <div class="gift-dialog-container">
      <div class="top-box"></div>
    <img class="my-head"
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/touxiang-biankuang.png" />
      <div class="bottom-box">
        <div class="coupon-list">
          <div v-for="(item, index) in couponList" :key="index" @click="selectCoupon(item)" class="coupon-item">
            <div class="left">
              <div class="coupon-img">
                <img :src="item.url" />
              </div>
              <div class="info">
                <p class="goods-name">{{ item.showName }}</p>
                <p class="goods-title">{{ item.packCouponTimeLimitTxt.split(" ")[0] }}</p>
                <p class="goods-time">{{ item.packCouponTimeLimitTxt.split(" ")[1] }}</p>
              </div>
            </div>
            <div class="right">
              <div class="goods-pire">
                <div class="pire-box" v-if="item.couponsType == 1 || item.couponsType == 3">
                  <div class="pire-icon">￥</div>
                  <div class="pire">{{ item.faceValue / 100 }}</div>
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
        <div class="confirm" @click="itemCoupon && receive()" v-if="itemCoupon">
          <div class="button-Mask" v-if="!itemCoupon"></div>
          <p>确认领取</p>
        </div>
        <div class="button-Mask" v-if="!itemCoupon">
          <p>确认领取</p>
        </div>
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
        this.couponList = deepClone(newVal)
        this.couponList = this.couponList.splice(0, 3)
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
    close() {
      // this.$emit('closeCoupon',false)
      this.isShow = false
    },
    selectCoupon(coupon) {
      coupon.isMask = false
      this.itemCoupon = coupon
      this.couponList.forEach((item, index) => {
        console.log(item.giftId, coupon.giftId)
        if (item.giftId != coupon.giftId) {
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
            addRecord(paramsRecord).then((res) => { })
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
.top-box {
  background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/tiaozhan_guang.png');
  background-size: 100% 100%;
  height: 356px;
  width: 375px;
  position: absolute;
  top: 2px;
  z-index: -1;
  top: -30px;
}
.my-head{
  position: absolute;
  width: 87px;
  height: 96px;
  top: 66px;
  left: 139px;
  z-index: -1;
  top: 33px;
}
.van-popup {
  // height: 100vh;
  // flex-direction: column;
}

.bottom-box {
  height: 413px;
  margin-top: 275px;
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
    // margin-top: 265px;
    width: 309px;
    margin: 0 auto;

    // padding-top: 265px;
    .coupon-item {
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_quan.png  ') no-repeat;
      background-size: 306px 100px;
      margin-top: 10px;
      display: flex;
      height: 100px;
      position: relative;
      width: 306px;
      border-radius: 5px;
      overflow: hidden;

      .mask {
        // background: rgba(0, 0, 0, 0.5) !important;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/youhuiquan_mengban.png') no-repeat;
        background-size: 306px 100px;
        height: 100%;
        position: absolute;
        width: 100%;
      }

      .left {
        flex: 1;
        // padding: 5px;
        display: flex;

        .coupon-img {
          min-width: 89px;
          max-width: 89px;
          height: 89px;
          border-radius: 5px;
          margin-left: 5px;
          margin-top: 5px;
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

        .goods-title {
          // margin-top: 13px;
          margin-top: 6px;
          margin-left: 6px;
          color: #E23E87;
          line-height: 16px;
        }

        .goods-name {
          height: 38px;
          font-size: 13px;
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
          margin-top: 9px;
          margin-left: 6px;
          padding-right: 22px;
        }

        .goods-time {
          // margin-top: 13px;
          margin-left: 6px;
          font-size: 10px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #E23E87;
          padding-bottom: 5px;
        }

        img {
          height: 100%;
          background: #FFEDED;
          border-radius: 20px;
        }
      }
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

          .pire-box {
            display: flex;
            align-items: center;

            .pire-icon {
              font-size: 10px;
              font-weight: bold;
              color: #F54695;
              margin-bottom: 12px;
            }

            .pire {
              font-size: 30px;
              font-family: Arial;
              font-weight: bold;
              color: #F54695;
            }
          }

          .pire {
            font-size: 30px;
            font-family: Arial;
            font-weight: bold;
            color: #F54695;
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
        color: #4C4A4B;
      }
    }
  }

  .confirm {
    position: relative;
    width: 227px;
    height: 71px;
    margin: 0 auto;
    margin-top: 20px;
    background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_xiayiti.png') no-repeat;
    background-size: 227px 71px;
    display: flex;
    align-items: center;
    justify-content: center;

    p {

      font-size: 25px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #FFFFFF;
      margin-top: 9px;
      text-shadow: 0px 1px 1px #000000;
    }

    .button-Mask {
      width: 220px;
      height: 58px;
      border-radius: 29px;
      background: #CDCDCD;
      opacity: 0.5;
      border-radius: 24px;

      p {
        font-size: 25px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #7A7A7A;
      }
    }
  }
}

.button-Mask {
  width: 220px;
  height: 58px;
  border-radius: 29px;
  background: #CDCDCD;
  opacity: 0.5;
  border-radius: 30px;
  margin-top: 35px;
  // margin: 0 auto;
  margin-left: 78px;
  text-align: center;

  p {
    font-size: 25px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #7A7A7A;
    line-height: 57px;
  }
}

.gift-dialog-container {
  background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_tiaozhanchenggong.png');
  background-size: 100% 100%;
  // position: relative;
  // margin-top: 44px;
  width: 100%;
  height: 728px;
  margin-top: -20px;
  position: absolute;
  top: 41px;
  .guanbi-box {
    position: absolute;
    width: 31px;
    height: 34.5px;
    right: 17px;
    top: 125px;
  }

}</style>
