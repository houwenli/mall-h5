<template>
  <van-popup v-model="isShow" :close-on-click-overlay="false" class="sussess-popup">
    <div class="box">
      <div class="top">
        <!-- <p class="text">恭喜您！领取成功</p> -->
        <div class="coupon">
          <div class="left">
            <div class="right-top"></div>
            <div class="right-bottom"></div>
            <div class="coupon-img">
              <img :src="successCoupon.url" />
            </div>
            <div class="info">
              <p class="goods-name">{{ successCoupon.showName }}</p>
              <p class="goods-title">{{ successCoupon.packCouponTimeLimitTxt.split(" ")[0] }}</p>
              <p class="goods-time">{{  successCoupon.packCouponTimeLimitTxt.split(" ")[1] }}</p>
            </div>
      
          </div>
          <div class="right">
            <div class="left-top"></div>
            <div class="left-bottom"></div>
            <div class="goods-pire">
              <div class="pire-box" v-if="successCoupon.couponsType == 1 || successCoupon.couponsType == 3">
                <div class="pire-icon">￥</div>
                <div class="pire">{{ successCoupon.faceValue / 100 }}</div>
              </div>
              <div v-else>
                <span class="pire">{{ successCoupon.faceValue / 100 }}</span>
                <span class="pire-type">折</span>
              </div>
            </div>
            <div class="goods-rule">{{ successCoupon.couponUseInfoTxt }}</div>
            <div class="goods-use"  @click="goGoodsDetail()"></div>
          </div>
        </div>
      </div>

      <div class="button">
        <div class="restart" @click="goTo('again')">再玩一次</div>
        <div class="view-coupons" @click="goTo('coupon')">我的优惠券</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import { bargainVisit } from '@/api/visit.js'
  export default {
    name: 'selectCoupon',
    props: {
      isShow: {
        type: Boolean,
        default: true,
      },
      successCoupon: {
        type: Object,
        default: () => {},
      },
      activityId: {
        type: [Number, String],
        default: null,
      },
    },
    methods: {
      goTo(name) {
        this.$router.push({name:'answerGame',} )
        if(name==='coupon'){
          localStorage.setItem('openCouponType','openCoupon' )
        }
      },
      goGoodsDetail() {
        // 埋点
        bargainVisit({
          // 具体商品
          isBargain: 0,
          skuId: this.successCoupon.skuId,
          spuId: this.successCoupon.spuId,
        })
          .then(() => {})
          .catch((e) => {})
        this.$router.push({
          path: '/spudetail',
          query: { isGame: 'true', spuId: this.successCoupon.spuId, storeId: this.successCoupon.storeId, sourceType: this.successCoupon.sourceType || 1 },
        })
      },
    },
  }
</script>

<style lang="less" scoped>

  .van-popup {
    height: 100vh;
  }
  .sussess-popup {
    .box {
      background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingqu_guang.png') ;
      background-size: 375px 469px;
      height: 469px;
      width: 100%;;
      // margin-top: 200px;
      position: relative;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      padding: 0px 15px;
      margin-top: -113px;
      .light {
        width: 311px;
        height: 300px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -67%);
      }
      .doll {
        width: 106px;
        height: 141px;
        position: absolute;
        left: 50%;
        top: -100px;
        transform: translate(-50%, 0%);
      }
      .containert {
        width: 100%;
        position: absolute;
        left: 50%;
        top: -5px;
        transform: translate(-50%, 0%);
      }
      .top {
        height: 100px;
        width: 324px;
        z-index: 10;
        margin-top: 184px;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_quan.png  ') no-repeat;
        background-size: 324px 100px;
        .text {
          font-size: 21px;
          font-family: Source Han Sans CN;
          font-weight: 800;
          color: #fe4748;
          text-align: center;
        }
        .coupon {
          margin-top: 10px;
          display: flex;
          // height: 69px;

          .left {
            padding: 0px 8px 9px 8.5px;
            display: flex;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            position: relative;
            .coupon-img {
              background: #FFEDED;
              height: 89px;
              width: 89px; 
              margin-top: -5px;
              margin-left: -4px;
              border-radius: 5px;
              // margin-right: 10px;
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
              padding-left: 5px;
              width: 124px;
            }
            .goods-title{
            // margin-top: 13px;
            margin-top: 13px;
            font-size: 12px;
            font-family: Source Han Sans CN;
            // margin-left: 6px;
            color: #E23E87 ;
            line-height: 16px;
          }
            .goods-name {
              height: 31px;
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
              padding-right: 22px;
              line-height: 16px;
            }
            .goods-time {
              font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #E23E87 ;
            padding-bottom: 4px;
            }
            img {
              height: 100%;
              background: #8f8f8f;
              border-radius: 20px;
            }
          }
          .right {
            // background: #ffffff;
            width: 88px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            position: relative;
            margin-top: -10px;
            // margin-left: 11px;
            .goods-pire {
              display: flex;
              color: #fe4947;
              height: 26px;
              line-height: 26px;
            .pire-box{
              display: flex;
              align-items: center;
              .pire-icon {
              font-size: 10px;
              font-weight: bold;
              color: #F54695 ;
              margin-bottom: 12px;
              // vertical-align: super
            }
              .pire {
              font-size: 30px;
              font-family: Arial;
              font-weight: bold;
              color: #F54695 ;
            }
          }
            .pire {
              font-size: 30px;
              font-family: Arial;
              font-weight: bold;
              color: #F54695 ;
            }
              .pire-type {
                font-size: 12px;
                font-family: Source Han Sans CN;
                font-weight: bold;
              }
            }
          }
          .goods-rule {
          font-size: 12px;
          font-weight: 500;
          color: #4C4A4B;
        }
        .goods-use{
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lijishiyong.png') ;
          background-size: 84px 30px;
          width: 84px;
          height: 30px;
        }
        }
      }
      .button {
        display: flex;
        z-index: 10;
        flex-direction: column;
        margin-bottom: 39px;
        div {
          width: 144px;
          height: 49px;
          border-radius: 24px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .restart {
          width: 227px;
          height:71px;
          margin: 0 auto;
          margin-top: 45px;
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_xiayiti.png') no-repeat;
          background-size: 227px 71px;
          margin-bottom: 24px;
          font-size: 25px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 9px;
          text-shadow: 0px 1px 1px #000000;
        }
        .view-coupons {
        border: 1px solid #ffffff;
        font-size: 25px;
        font-family: Source Han Sans CN;
        font-weight: 300;
        color: #FFFFFF;
        margin-bottom: 17px;
        width: 221px;
        margin-left: 8px;
        height: 58px;
        border-radius: 29px;
        // font-size: 25px;
        width: 227px;
        }
      }
    }
  }
</style>
