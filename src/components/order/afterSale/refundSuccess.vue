<template>
  <div class="boxWrapper">
    <van-nav-bar title="提交成功" class="navtop" />
    <div class="scroll-container">
      <div class="applyAfterBox bgcolor">
        <strong class="applyAfter_title">退款服务单申请成功</strong>
        <p class="applyAfter_tips" v-if="serverDetail.backOrderType!=4">
          预计
          <span class="colorRed">
            <van-count-down :time="countDown" format="DD天HH时mm分ss秒" />
          </span>
          内为您审核，请保持手机畅通，耐心等待
        </p>
        <p v-else>正在为您审核，请保持手机畅通，耐心等待</p>
        <div class="operationBox">
          <span @click="toDetail()">查看详情</span>
          <span @click="toList()">订单列表</span>
        </div>
      </div>
      <div class="serverBox bgcolor">
        <label class="title">服务类型</label>
        <span class="value">退款</span>
      </div>
    </div>
  </div>
</template>

<script>
  import navBartop from '@/components/commons/navBartop'
  import { queryBackOrderDetail } from '@/api/backorderlist'
  import { CountDown } from 'vant'
  import { getUserSource, smartOpenDeepLink } from '@/utils/hybrid.js'
  import { USER_SOURCE } from '@/constants/userinfo.js'

  export default {
    components: {
      navBartop,
      [CountDown.name]: CountDown,
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.getDetail()
    },
    data() {
      return {
        serverDetail: '',
        startTime: '',
        endTime: '',
        changeTime: '',
        id: this.$route.query.id ? this.$route.query.id : '',
        countDown: '',
      }
    },
    methods: {
      // 查询详情
      getDetail() {
        let param = {
          id: this.id,
        }
        queryBackOrderDetail(param).then((res) => {
          if (res.code == 200) {
            this.serverDetail = res.data
            let endTime = this.serverDetail.endTime ? this.serverDetail.endTime.replace(/\-/g, '/') : ''
            endTime = new Date(endTime).getTime()
            let nowTime = this.serverDetail.nowTime ? this.serverDetail.nowTime.replace(/\-/g, '/') : ''
            nowTime = new Date(nowTime).getTime()
            if (endTime - nowTime > 0) {
              this.countDown = endTime - nowTime
            }
          }
        })
      },
      //查看详情
      toDetail() {
        this.$router.replace({
          path: '/refundServerDetails',
          query: {
            id: this.id,
          },
        })
      },
      /**
       * 订单列表
       * 如果在智慧生活app中，则直接跳转到智慧生活App的订单列表； 其他app或者纯h5,跳转到H5自己的订单列表
       */
      toList() {
        let appData = JSON.parse(localStorage.getItem('appData')) || {}
        let { channel } = appData
        let userSource = getUserSource(channel)

        // 智慧生活APP内嵌H5场景
        if (userSource == USER_SOURCE.smartLife) {
          // 直接调回到app的订单列表
          smartOpenDeepLink('wsf://app/orderList?finish=1')
          return
        }

        // 跳以前H5自己的订单列表
        this.$router.replace({
          path: '/orderlist',
        })
      },
      back() {
        this.$router.back()
      },
    },
  }
</script>

<style lang="less" scoped>
  .boxWrapper {
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    height: 100%;
    /deep/ .van-nav-bar__content {
      height: 44px;
      font-size: 16px;
      color: #191919;
    }
    .scroll-container {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }
    /deep/ .van-nav-bar {
      color: #000;
      height: 2rem;
      font-size: 0.72rem;
    }
    /deep/ .van-hairline--bottom::after {
      border-bottom: 0;
    }
    .bgcolor {
      background-color: #fff;
    }
    .applyAfterBox {
      padding: 24px 24px 16px;
      color: #191919;
      text-align: center;
      border-radius: 8px;
      .applyAfter_title {
        display: inline-block;
        margin: 0 auto 12px;
        padding-left: 24px;
        font-size: 16px;
        text-align: center;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/apply-success.png') no-repeat left;
        background-size: 16px;
      }
      .applyAfter_tips {
        font-size: 13px;
        color: #6e6e6e;
        margin: 0 auto;
        text-align: left;
        .colorRed {
          display: inline-block;
          /deep/ .van-count-down {
            display: inline-block;
            color: #ff0a35;
            font-size: 13px;
            font-weight: bold;
          }
        }
      }
      .operationBox {
        margin-top: 12px;
        span {
          position: relative;
          display: inline-block;
          width: 80px;
          height: 32px;
          line-height: 32px;
          border-radius: 16px;
          position: relative;
          margin-right: 20px;
          text-align: center;
          color: #ff0a35;
          font-size: 14px;
          &:last-child {
            margin-right: 0;
          }
          &::after {
            position: absolute;
            top: -50%;
            left: -50%;
            content: '';
            display: block;
            width: 200%;
            height: 200%;
            transform: scale(0.5);
            border: 1px solid #ff0a35;
            border-radius: 999px;
            box-sizing: border-box;
          }
        }
      }
    }
    .serverBox {
      margin-top: 10px;
      border-radius: 8px;
      padding: 14px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: #191919;
      .value {
        font-size: 11px;
      }
    }
  }
</style>
