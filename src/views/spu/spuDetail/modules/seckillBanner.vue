<template>
  <div class="seckill-banner-wrap">
    <div class="seckill-banner">
      <img
        class="seckill-banner-img"
        src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///df7adde5c78b7867466db0d68756c32d.png?imageView2/1/w/190/h/44"
        alt=""
      />
      <div class="seckill-count-time-info">
        <div class="seckill-count-time-title">{{ `距${seckillScene.countText}还剩` }}</div>
        <div class="seckill-count-time-wrap">
          <van-count-down :time="seckillScene.countTime" style="display: flex;justify-content: center;align-items: center;">
            <template #default="timeData">
              <span class="block" v-if="timeData.days > 0">{{ timeData.days * 24 + timeData.hours }}</span>
              <span class="block" v-else>{{ timeData.hours &lt; 10 ? '0' + timeData.hours : timeData.hours }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes &lt; 10 ? '0' + timeData.minutes : timeData.minutes }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds &lt; 10 ? '0' + timeData.seconds : timeData.seconds }}</span>
            </template>
          </van-count-down>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { CountDown } from 'vant'
  export default {
    name: 'SeckillBanner',
    props: ['seckillScene'],
    components: {
      [CountDown.name]: CountDown,
    },
    data() {
      return {
        countTime: 12330123, // 倒计时时间
      }
    },
  }
</script>

<style lang="less" scoped>
  .seckill-banner-wrap {
    background-color: #fff;
  }
  .seckill-banner {
    box-sizing: content-box;
    height: 56px;
    padding: 0 18px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: url('https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//uat/6868489be0a240d8445cab9ffa28ac50.png?imageView2/1/w/750/h/112') no-repeat
      center;
    background-size: 375px 56px;
    .seckill-banner-img {
      width: 95px;
      height: 22px;
    }
    .seckill-count-time-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: #ffffff;
      .seckill-count-time-title {
        font-size: 12px;
        transform: scale(0.83);
      }
      .seckill-count-time-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .colon {
          display: inline-block;
          padding: 0 0.04rem;
          height: 0.64rem;
          line-height: 0.6rem;
          color: #fff;
        }
        .block {
          width: 20px;
          height: 22px;
          display: inline-block;
          background-color: #fff;
          border-radius: 4px;
          color: #e60113;
          line-height: 22px;
          font-size: 10px;
          font-weight: 500;
          text-align: center;
        }
      }
    }
  }
</style>
