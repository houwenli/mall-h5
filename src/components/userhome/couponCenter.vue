<template>
  <div class="coupon-center-page" v-if="pageState == 'common'">
    <van-nav-bar title="领券中心" left-arrow @click-left="onClickLeft" class="topbox" />
    <div class="bottom-button" @click="goMycoupon()">
      <span>已领取优惠券的详细信息可在</span>
      <span class="bright-colored">“我的-优惠券”</span>
      <span>中查看</span>
      <img class="arrow-right" src="../../assets/img/activity/arrow-right@2x.png" alt="" />
    </div>
    <div class="coupon-center-bg">
      <img src="../../assets/img/activity/banner@2x.png" alt="" />
    </div>
    <div class="coupon-center-list">
      <div class="coupon" v-for="(item, index) in list" :key="index">
        <span class="top-round-corner"></span>
        <span class="bottom-round-corner"></span>
        <div class="main-ticket">
          <div class="main-mark">
            平台券
          </div>
          <div class="coupon-detail">
            <div class="coupon-price">
              <span class="text" v-if="item.type != 2">￥</span>
              <span class="price" v-if="item.type == 2">{{ parseInt(item.discountRate * 100) / 10 }}</span>
              <span class="price" v-else>{{ item.price }}</span>
              <span class="text" v-if="item.type == 2">折</span>
            </div>
            <div class="coupon-info">
              <div class="condition" v-if="item.type != 0">满{{ item.fullPrice }}可用</div>
              <div class="indate" v-if="item.validityType == 0">
                {{ timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }}-{{
                  timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd')
                }}
              </div>
              <div class="indate" v-else>领券后{{ item.validityRelativeDaysNum }}天</div>
            </div>
          </div>
          <div class="coupon-explain">
            <span v-if="item.permittedType == 0">全</span>
            <span>平台</span>
            <span v-if="item.permittedType == 2">部分</span>
            <span v-if="item.permittedType == 1">部分分类</span>
            <span>商品可用，</span>
            <span v-if="item.exclusionType == 1">不</span>
            <span>可与店铺券叠加使用</span>
          </div>
        </div>
        <div class="stub-ticket">
          <img class="stub-mark" v-if="item.webFlag == 2 || item.webFlag == 3" src="../../assets/img/activity/ylq02@2x.png" alt="" />
          <img class="stub-mark" v-else-if="item.webFlag == 1" src="../../assets/img/activity/yqw@2x.png" alt="" />
          <button class="get-coupon-button platform-btn" v-if="item.webFlag == 0 || item.webFlag == 3" @click="getCoupon(item.id)">立即领取</button>
        </div>
      </div>
    </div>
  </div>
  <div class="empty-page" v-else-if="pageState == 'empty'">
    <van-nav-bar title="领券中心" left-arrow @click-left="onClickLeft" class="topbox" />
    <img src="../../assets/img/Discount_bg@2x.png" alt="" />
    <p class="nocoupon-txt">哇喔，说好的券呢</p>
  </div>
</template>
<script>
  import { NavBar, Button, List, PullRefresh, Toast } from 'vant'
  import { getUserActivity } from '@/api/mycoupon'
  import timeFormat from '@/utils/timeFormat'
  import { receiveCoupon } from '@/api/mycoupon'
  import { debounce } from '@/utils/utils'
  export default {
    components: { [NavBar.name]: NavBar, [Button.name]: Button, [List.name]: List, [PullRefresh.name]: PullRefresh, [Toast.name]: Toast },
    data() {
      return {
        pageState: null,
        loading: false,
        timeFormat,
        listQuery: {
          type: 2, //0注册送，1定向送，2购买前送，3购买后（支付成功）
        },
        list: [],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      goMycoupon() {
        this.$router.push('/mycoupon')
      },
      getList() {
        getUserActivity(this.listQuery)
          .then((res) => {
            if (res.code == 200) {
              if (res.data) {
                this.list = res.data.platformCouponVoList
                this.pageState = this.list && this.list.length > 0 ? 'common' : 'empty'
              } else {
                this.list = []
                this.pageState = 'empty'
              }
            }
          })
          .catch((err) => {
            this.pageState = 'empty'
          })
      },
      // 返回
      onClickLeft() {
        if (this.backUrl) {
          this.$router.push({ path: this.backUrl })
        } else {
          this.$router.go(-1)
        }
      },
      getCoupon: debounce(function(id) {
        if (this.loading) {
          return
        }
        this.loading = true
        receiveCoupon(id)
        .then((res) => {
          if (res.code == 200) {
            Toast(`领取${res.data == 1 ? '成功' : '失败'}`)
            this.getList()
          } else {
            Toast(res.description)
          }
        })
        .finally(() => {
          this.loading = false
        })
      }, 100),
    },
  }
</script>
<style lang="less" scoped>
  .coupon-center-page {
    .topbox {
      /deep/ .van-icon {
        color: #464646;
        font-size: 0.92rem;
      }
      /deep/ .van-nav-bar__title {
        color: #000;
        font-size: 0.68rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    height: 100%;
    background: #f65946;

    .bottom-button {
      z-index: 10;
      position: fixed;
      bottom: 38px;
      left: 12px;
      width: 351px;
      background: linear-gradient(270deg, #ffc276 0%, #ffdc99 100%);
      border-radius: 18px;
      color: #943a0d;
      font-size: 13px;
      text-align: center;
      line-height: 36px;
      height: 36px;
      .bright-colored {
        color: #f65946;
      }
      .arrow-right {
        width: 5px;
        height: 11px;
      }
    }
    .coupon-center-bg {
      height: 175px;
      background: #ffffff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .coupon-center-list {
      padding: 0 12px 130px;
      background: #f65946;
      .coupon {
        margin-bottom: 10px;
        height: 98px;
        border-radius: 8px;
        overflow: hidden;
        background: #fef4f4;
        display: flex;
        position: relative;
        .top-round-corner {
          background-color: #f65946;
          position: absolute;
          top: -8px;
          right: 99px;
          transform: translate(50%, 0);
          height: 14px;
          width: 14px;
          border-radius: 0 0 50% 50%;
          z-index: 2;
        }
        .bottom-round-corner {
          background-color: #f65946;
          position: absolute;
          bottom: -8px;
          right: 99px;
          transform: translate(50%, 0);
          height: 14px;
          width: 14px;
          border-radius: 50% 50% 0 0;
          z-index: 2;
        }
        .main-ticket {
          width: 251px;
          position: relative;
          padding: 26px 0 10px 18px;
          .coupon-detail {
            display: inline-flex;
            align-items: center;
            height: 38px;
            .coupon-price {
              font-weight: 600;
              color: #e60113;
              display: inline-flex;
              align-items: baseline;
              .text {
                font-size: 14px;
                line-height: 20px;
              }
              .price {
                margin: 0 4px;
                font-size: 32px;
                line-height: 38px;
              }
            }
            .coupon-info {
              margin-left: 12px;
              display: inline-flex;
              flex-direction: column;
              justify-content: space-between;
              .condition {
                color: #000;
                font-size: 14px;
                line-height: 20px;
                font-weight: 500;
              }
              .indate {
                color: #666;
                font-size: 11px;
                line-height: 16px;
              }
            }
          }
          .coupon-explain {
            white-space: nowrap;
            padding-top: 8px;
            font-size: 0;
            color: #666;
            line-height: 16px;
            span {
              font-size: 11px;
            }
          }

          .main-mark {
            width: 50px;
            height: 18px;
            background: #fe8993;
            border-radius: 0 0 8px 0px;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
            line-height: 18px;
            font-size: 10px;
            color: #fff;
          }
        }
        .stub-ticket {
          border-left: 1px dashed #faccd0;
          width: 100px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .stub-mark {
            width: 52px;
            height: 50px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
          }
          .get-coupon-button {
            width: 76px;
            height: 30px;
            background: #e60113;
            border-radius: 15px;
            line-height: 30px;
            text-align: center;
            font-size: 12px;
            color: #fff;
            z-index: 2;
          }
        }
      }
    }
  }
  .empty-page {
    background: #f5f5f5;
    text-align: center;
    .topbox {
      /deep/ .van-icon {
        color: #464646;
        font-size: 0.92rem;
      }
      /deep/ .van-nav-bar__title {
        color: #000;
        font-size: 0.68rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    height: 100%;
    img {
      margin-top: 160px;
      width: 90px;
      height: 90px;
    }
    .nocoupon-txt {
      font-size: 14px;
      color: #999;
      margin-top: -3px;
      height: 20px;
      line-height: 20px;
    }
  }
</style>
