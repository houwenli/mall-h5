<template>
  <div class="coupon" v-if="list && list.length != 0">
    <div v-for="(item, index) in list" :key="index" class="coupon-item flex">
      <!-- 左上方角标 -->
      <img :src="cornerMarkMap[1]" class="coupon-item__cornerMark" />
      <div class="coupon-item__left flex">
        <img v-if="item.url || ''" :src="item.url || ''" class="coupon-item__img" />
        <div v-else class="coupon-item__img--empty flex">
          <img :src="`${smartImg}/component-no-pic-default.png`" />
        </div>
        <div>
          <span class="coupon-title">{{ item.commodityName || '' }}</span>
          <!-- 优惠信息 -->
          <div class="coupon-price flex">
            <!-- 券类型 1:满减 2:折扣 3:立减 -->
            <span class="symbol" v-if="item.couponsType != 2">￥</span>
            <span class="int-price">{{ item._faceValue }}</span>
            <span class="float-price" v-if="item.couponsType == 2">折</span>
            <!-- 使用条件 -->
            <span class="condition">{{ item._condition }}</span>
          </div>
          <!-- 使用期限 -->
          <div class="coupon-time">{{ item._time }}</div>
        </div>
      </div>
      <div class="coupon-item__right" @click="toIndex(item)">
        <div class="coupon-item__right--text">立即使用</div>
        <div class="coupon-item__right--bal"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        smartImg: this.$smartImg,
        cornerMarkMap: {
          1: `${this.$smartImg}/coupon/dianshang-tag.png`, //电商
          2: `${this.$smartImg}/coupon/huandian-tag.png`, //换电
        },
      }
    },
    methods: {
      toIndex(val) {
        this.$emit('toIndex', val)
      },
    },
  }
</script>

<style scoped lang="less">
  .flex {
    display: flex;
    align-items: center;
    align-content: center;
  }
  .coupon {
    padding: 0 8px;
    padding-bottom: calc(~'constant(safe-area-inset-bottom) + 18px'); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(~'env(safe-area-inset-bottom) + 18px'); /* 兼容 iOS >= 11.2 */
    &-item {
      position: relative;
      justify-content: space-between;
      margin-top: 8px;
      padding: 12px;
      height: 96px;
      border-radius: 12px;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/coupon/coupon-bg.png') top right no-repeat;
      background-size: 80px 47px;
      background-color: #fff;
    }
    &-item__cornerMark {
      position: absolute;
      top: 0;
      left: 0;
      width: 37px;
      height: 18px;
    }
    &-item__left {
      .coupon-title {
        flex: 1;
        font-size: 13px;
        font-weight: 600;
        color: #191919;
        height: 20px;
        line-height: 20px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden; //溢出内容隐藏
        text-overflow: ellipsis; //文本溢出部分用省略号表示
        display: -webkit-box; //特别显示模式
        -webkit-line-clamp: 1; //行数
        line-clamp: 1;
        -webkit-box-orient: vertical; //盒子中内容竖直排列
      }
      .coupon-price {
        align-items: flex-end;
        margin-top: 6px;
        span {
          display: inline-block;
        }
        .symbol {
          font-family: DINAlternate-Bold, DINAlternate;
          font-size: 12px;
          font-weight: bold;
          color: #ff450c;
          line-height: 16px;
        }
        .condition {
          margin-left: 4px;
          padding-bottom: 1px;
          font-size: 11px;
          font-weight: 400;
          color: #999999;
          line-height: 15px;
        }
        .int-price {
          font-family: DINAlternate-Bold, DINAlternate;
          font-size: 24px;
          font-weight: bold;
          color: #ff450c;
          line-height: 26px;
        }
        .float-price {
          font-family: DINAlternate-Bold, DINAlternate;
          font-size: 12px;
          font-weight: 600;
          color: #ff450c;
          line-height: 16px;
        }
      }
      .coupon-time {
        display: inline-block;
        padding: 0 4px;
        margin-top: 7px;
        height: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 11px;
        font-weight: 400;
        color: #4684ff;
        line-height: 16px;
        background: #e7f8f4;
        border-radius: 8px;
        text-align: center;
      }
    }
    &-item__img,
    &-item__img--empty {
      margin-right: 4px;
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      border-radius: 7px;
    }
    &-item__img--empty {
      justify-content: center;
      background: rgba(180, 183, 186, 0.2);
      border-radius: 16rpx;
      img {
        width: 26px;
        height: 14px;
      }
    }
    &-item__right {
      position: relative;
      margin-left: 7px;
      flex-shrink: 0;
    }
    &-item__right--text {
      position: relative;
      z-index: 2;
      padding: 0 9px;
      height: 30px;
      line-height: 30px;
      background: linear-gradient(90deg, #ff450c 0%, #ff0a35 100%);
      border-radius: 17px;
      text-align: center;
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
    }
    &-item__right--bal {
      position: absolute;
      top: -3px;
      left: -8px;
      content: '';
      width: 86px;
      height: 46px;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/coupon/btn-bg.png') center center no-repeat;
      background-size: 100% 100%;
    }
  }
  u-loadmore {
    /deep/ u-line {
      display: none;
    }
  }
</style>
