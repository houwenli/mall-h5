<template>
  <van-popup v-model="isMyCoupon" :close-on-click-overlay="false" class="select-popup">
  <div class="paged-container">
    <img class="youhuiquan-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/youhuiquan_top.png" @click="close" />
    <img class="guanbi-box" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/paihangbang_guanbi.png" @click="close" />
    <div class="main-container">
     <div class="among-box">
      <div class="coupon-list"  :style="{height:`${boxHeight*0.74}px`}">
        <div class="coupon-box" v-for="(item, index) in couponList" :key="index">
        <div class="mask"  v-if="item.unavailableReasonList"></div>
        <div class="coupon-item" >
          <div class="left">
            <div class="coupon-img">
              <img :src="item.url" />
            </div>
            <div class="info">
              <p class="goods-name">{{ item.commodityName }}</p>
              <div>
                <p class="goods-title">有效期至</p>
                <p v-if="item.effectiveEndTime" class="goods-time">{{ item.effectiveEndTime.split(' ')[0] }}</p>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="pire-boxs" v-if="item.couponsType == 1 || item.couponsType == 3">
              <div class="pire-icon">￥</div>
              <div class="pire">{{ item.faceValue / 100 }}</div>
            </div>
            <div v-else class="prie-box">
              <span class="pire">{{ item.faceValue / 100 }}</span>
              <span class="pire-type">折</span>
            </div>
            <p class="condition" v-if="item.couponsType == 1">满{{ item.amountLimitation / 100 }}元可用</p>
            <p class="condition" v-if="item.couponsType == 2">无门槛</p>
            <p class="condition" v-if="item.couponsType == 3">满{{ item.faceValue / 100 }}元可用</p>
            <div class="goods-use"  @click="goGoodsDetail(item)"></div>
          </div>
          <!-- 不可用优惠券加图层置灰 -->
        
        </div>
            <div clas="unuse-box">
        <div v-if="item.unavailableReasonList" class="unuse" >不可用原因：{{ item.unavailableReasonList.join('、') }}</div>
      </div>
      </div>
    <div v-if="isShow" class="img-box">
      <img class="receivedFail" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_wuquan.png" />
      <div class="text">
        <p>您还没有优惠券</p>
        <p>游戏挑战成功即有机会领取</p>
      </div>
      <div class="restart" @click="goAnswer"></div>
    </div>
  </div>

  </div>
    </div>

  </div>
</van-popup>
</template>

<script>
  import { getMyCouponList } from '@/api/activities/games.js'
  import { bargainVisit } from '@/api/visit.js'
  export default {
    name: 'myCoupon',
    props:{
    isMyCoupon: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        couponList: [],
        isShow: false,
        boxHeight:''
      }
    },
      watch:{
      isMyCoupon(val) {
      if (val) {
       
       if(val===true){
        this.selectCoupon()
    }
       }
      }
    },
    created() {
      this.selectCoupon()
      this.boxHeight=document.body.clientHeight

    },
    methods: {
      goAnswer(){
        // this.$router.push({
        //          name: 'answer',
        //           query: {
        //             activityId: this.activityId,
        //             id: this.id,
        //           },
        //         })\
this.close()
      },
      goGoodsDetail(item) {
        // 埋点
        bargainVisit({
          // 具体商品
          isBargain: 0,
          skuId: item.skuId,
          spuId: item.spuId,
        })
          .then(() => {})
          .catch((e) => {})

        // 跳转到微信小程序原生详情页面
        if (window.__wxjs_environment === 'miniprogram') {
          console.log('/productModule/pages/skuDetail/skuDetail?spuId=' + item.spuId)
          window.wx.miniProgram.navigateTo({
            url: '/productModule/pages/skuDetail/skuDetail?spuId=' + item.spuId,
          })
          return
        }

        this.$router.push({
          path: '/spudetail',
          query: { isGame: 'true', spuId: item.spuId, storeId: item.storeId, sourceType: item.sourceType || 1 },
        })
      },
      close(){
        this.$emit('closed',false)
      },
      selectCoupon() {
        getMyCouponList()
          .then((res) => {
            if (res.code === 200) {
              this.couponList = res.data.userCouponList || []
              console.log(this.isShow,'55555');
              this.isShow = res.data.userCouponList ? false : true
            }
          })
          .catch((error) => {
            console.error(error)
          })
      },
    },
    goTo(name) {
      this.$router.replace({
        name,
        query: {
          activityId: this.$route.query.activityId,
          id: this.$route.query.id,
        },
      })
    },
  }
</script>

<style lang="less" scoped>
.img-box{
  text-align: center;
  // margin-top: -517px;
  .restart {
      background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/shouye_kaishiyouxi.png');
      background-size: 100% 100%;
      width: 239px;
      height: 80px;
      margin: 0 auto;
      text-align: center;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }
  .receivedFail {
      width: 174px;
      height: 133px;
    }
    img {
      width: 100%;
    }
    .text {
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #999999;
      text-align: center;
      margin-bottom: 27px;
    }

}
  .paged-container {
    height: 100%;
    width: 100%;
  }
  .youhuiquan-img{
    position: absolute;
    width: 197px;
    height: 70px;
    top: 62px;
    left: 97px;
  }
  .guanbi-box{
      width: 31px;
      height: 34.5px;
      position: relative;
      left: 311px;
      top: 3px;
      left: 326px;
      top: 82px;
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
    // height: 637px;
    width: 348px;
    background: #FBA5CC;
    border-radius: 15px;
    // background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/wodeyouhuiquan_bg.png');
    // background-size: 348px 677px;
    padding: 10px 9px;
    margin-top: 60px;
.among-box{
  width: 338px;
// height: 617px;
background: #E23E87;
border-radius: 15px;
padding-top: 8px;
margin-left: -4px;
padding-bottom: 10px;


}
    .coupon-list {
      margin-top: 285px;
      width: 334px;
      // height: 602px;
      background: #F7F3F7;
      box-shadow: 0px 3px 2px 0px rgba(0,0,0,0.16);
      border-radius: 15px;
      margin: 0 auto;
      // padding-top: 275px;
      // margin-top: 63px;
      overflow-y: auto;
      overflow-x: clip;
      padding-top: 28px;
    padding-left: 7px;
      .coupon-box{
        width: 324px;
        // height: 128px;
        position: relative;
        overflow: hidden;
        border-radius:24px;
        margin-bottom: 10px;
        padding-bottom: 5px;
      }
      .unuse-box{
        text-align: center;
      }
      .unuse{
          margin-left: 115px;
          // margin-top: 11px;
          margin-top: 5px;
          }
          .mask {
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/bukeyong_mengban.png') no-repeat;
          height: 100%;
          position: absolute;
          width: 100%;
          z-index: 10;
          background-size: 329px 128px;
        }
      .coupon-item {
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lingquan_quan.png  ') no-repeat;
        background-size: 324px 100px;
        // margin-top: 10px;
        display: flex;
        height: 100px;
        position: relative;
        width: 324px;
        border-radius: 5px;
        overflow: hidden;


        .left {
          // flex: 1;
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
            width: 132px;
          }
          .goods-title{
            // margin-top: 13px;
            margin-top: 6px;
            margin-left: 6px;
            color: #E23E87 ;
            line-height: 16px;
          }
          .goods-name {
            height: 31px;
            font-size: 13px;
            font-family: Arial;
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
           line-height: 16px;
          }
          .goods-time {
            // margin-top: 13px;
            margin-left: 6px;
            font-size: 12px;
            // font-family: Source Han Sans CN;
            font-weight: 400;
            color: #E23E87 ;
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
          // justify-content: center;
          .goods-use{
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/lijishiyong.png') ;
          background-size: 84px 30px;
          width: 84px;
          height: 30px;
        }
        .pire-boxs{
              display: flex;
              align-items: center;
              margin-bottom: -10px;
            .pire-icon {
              font-size: 10px;
              font-weight: bold;
              color: #F54695 ;
              margin-bottom: 12px;
            }
            .pire {
              font-size: 30px;
              font-family: Arial;
              font-weight: bold;
              color: #F54695 ;
            }
          }
          .prie-box{
            display: flex;
            height: 26px;
            line-height: 26px;
            .pire-icon {
              font-size: 10px;
              font-weight: bold;
              color: #F54695 ;
              margin-bottom: 12px;
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
              color: #ffffff;
            }
          }
           

        }
        .goods-rule {
          font-size: 12px;
          // font-family: Source Han Sans CN;
          font-weight: 500;
          color: #4C4A4B;
        }
      }
    }
  }
  .van-popup {
    height: 100vh;
  }
  .popup {
    background: none;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px 40px;

    
  }
</style>
