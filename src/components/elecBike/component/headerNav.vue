<template>
    <div class="header-nav" :class="{'long-bg': data.status == '1'}">
        <div class="top-header">
            <div class="search-left" @click="toBack">
                <i class="backimg"></i>
            </div>
        </div>
        <div class="status-text-box">
            <img v-if="[5,6,7].includes(data.status * 1) && (!data.backOrderLogVO || data.backOrderLogVO.status != 2)" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/order_ic_tishi.png" alt="">
            <img v-if="[1,3,2].includes(data.status * 1) && (!data.backOrderLogVO || data.backOrderLogVO.status != 2)" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/order_ic_wait.png" alt="">
            <img v-if="[4].includes(data.status * 1) || (data.backOrderLogVO && data.backOrderLogVO.status == 2)" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ok.png" alt="">
            <span v-if="data.backOrderLogVO && data.backOrderLogVO.status == 2">退款成功</span>
            <span v-else-if="data.backOrderLogVO && data.backOrderLogVO.status == 1">已申请退款，待商家审核</span>
            <span v-else-if="data.status == 5 && data.cancelStatus == 1">用户主动取消</span>
            <span v-else-if="data.status == 5 && data.cancelStatus == 2">超时未支付，已取消</span>
            <span v-else>{{ statuText[data.status] }}</span>
        </div>
        <div class="time-reduce-bxo" v-if="data.status == '1'">
            剩余
            <van-count-down :time="countdown" />支付关闭
        </div>
    </div>
</template>
<script>
const statuText = {
    5: '超时未支付，已取消',
    1: '等待支付',
    4: '交易完成',
    2: '请前往门店取车',
    3: '请前往门店取车',
    6: '用户主动取消',
    7: '用户主动取消'
}
import { CountDown } from 'vant'
export default {
    props: {
        countdown: {
            type: Number,
            default: 30 * 60 * 60 * 1000
        },
        data: {
          type: Object,
          default: ()=>{}
        }
    },
    components: {
        [CountDown.name]: CountDown,
    },
    data() {
        return {
            statuText,
            time: 30 * 60 * 60 * 1000,
        }
    },
    watch: {
        countdown(value) {
            if (value == 0) {
                this.$emit('timeOutCancle')
            }
        },
    },
    methods: {
        toBack() {
            this.$router.go(-1)
        },
    }
}
</script>

<style lang="less" scoped>
.header-nav {
  height: 124px;
  background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/bg.png') no-repeat;
  background-size: 100% auto;
  position: relative;
  padding-top: 68px;
  &::after {
    content: '';
    width: 100%;
    height: 20px;
    background: #f6f6f6;
    border-radius: 10px;
    position: absolute;
    bottom: -10px;
    left: 0;
  }
  &.long-bg {
    height: 164px;
    padding-top: 78px;
  }
  .top-header {
    padding: 6px 12px;
    position: fixed;
    top: 0;
    min-height: 44px;
    z-index: 22;

    .search-left {
      margin-right: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      border: 1px solid rgba(151, 151, 151, 0.2);
      background: rgba(255, 255, 255, 0.9);

      .backimg {
        display: block;
        background: url('~@/assets/img/goodsDetail/left_arrow.png') no-repeat center center;
        background-size: 100%;
        width: 16px;
        height: 16px;
      }
    }
  }
  .status-text-box {
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    > img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
  .time-reduce-bxo {
    margin-top: 3px;
    color: #fff;
    font-size: 13px;
    display: flex;
    justify-content: center;
    .van-count-down {
      color: #fff;
      font-size: 13px;
      margin-left: 4px;
      margin-right: 4px;
    }
  }
}
</style>

