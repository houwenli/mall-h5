<template>
  <div class="boxWrapper">
    <van-nav-bar title="提交成功" class="navtop" />
    <div class="scroll-container">
      <div class="applyAfterBox bgcolor">
        <strong class="applyAfter_title">售后服务单申请成功</strong>
        <p class="applyAfter_tips"  v-if="serverDetail.backOrderType!=4">
          预计
          <span class="colorRed" v-if="serverDetail.status == 4 || serverDetail.status == 13">
            <van-count-down :time="countDown" format="DD 天 HH 时 mm 分 ss 秒" />
            <!-- {{ countDown }} -->
          </span>
          内为您审核，请保持手机畅通，耐心等待
        </p>
        <p v-else>正在为您审核，请保持手机畅通，耐心等待</p>
        <div class="operationBox">
          <span @click="toDetail()">查看详情</span>
          <span @click="toList()">售后主页</span>
        </div>
      </div>

      <div class="serverBox bgcolor">
        <p>
          <label class="title">服务类型</label>
          <span>{{ serverDetail.type == '1' ? '退款' : serverDetail.type == '2' ? '退货' : '换货' }}</span>
        </p>
        <p>
          <label class="title">返件方式:</label>
          <span>{{ serverDetail.backType == '1' ? '自行寄回' : '' }}</span>
        </p>
      </div>
      <div class="serverBox bgcolor">
        <p>
          <label class="title">联系人:</label>
          <span>{{ serverDetail.contactName }}</span>
        </p>
        <p>
          <label class="title">联系电话:</label>
          <span v-if="serverDetail.contactMobile" class="font-13">{{ serverDetail.contactMobile | phoneSubstr }}</span>
        </p>
      </div>
      <div class="serverBox bgcolor" v-if="serverDetail.type == '3' && serverDetail.addressVo">
        <p class="mb9">
          <span class="header">收货地址 <span>（该地址是卖家换货邮寄给您的地址）</span></span>
        </p>
        <p class="no-flex">

          <span>{{ serverDetail.addressVo.name }}</span>
          <span>{{ serverDetail.addressVo.mobile }}</span>
          <!-- <span>sdfsdfsdfs</span>
          <span>撒旦发射点发射点</span> -->
        </p>
        <p class="flex_p">
          <span class="value">{{ serverDetail.addressVo.address + serverDetail.addressVo.detailAddress }}</span>
          <!-- <span class="value">撒旦飞洒地方撒旦发射点发</span> -->
        </p>
      </div>
      <!-- 提示 -->
      <div class="tipsBox">
        <p>服务单审核通过后，请在7天内完成发货并在服务单详情页内填写运单号，否则服务单将会自动关闭。您可在服务单详情页查看商品寄回地址。</p>
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
          let endTime = this.serverDetail.endTime.replace(/\-/g, '/')
          endTime = new Date(endTime).getTime()
          let nowTime = this.serverDetail.nowTime.replace(/\-/g, '/')
          nowTime = new Date(nowTime).getTime()
          if (endTime - nowTime > 0) {
            this.countDown = endTime - nowTime
            //向上取整转化成天
            // let countDownTime = endTime - nowTime
            // let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24))
            // this.countDown = countDownDay
          }
        }
      })
    },
    toDetail() {
      if(this.serverDetail.type == 3) {
        this.$router.push({
          path: '/exchangeServerDetails',
          query: {
            id: this.id,
          },
        })
      } else {
        this.$router.push({
          path: '/serverDetails',
          query: {
            id: this.id,
          },
        })
      }
    },
    toList() {
      let appData = JSON.parse(localStorage.getItem('appData')) || {}
      let { channel } = appData
      let userSource = getUserSource(channel)

      // 智慧生活APP内嵌H5场景
      if (userSource == USER_SOURCE.smartLife) {
        // 直接调回到app的订单列表
        smartOpenDeepLink('wsf://app/orderList?type=80&finish=1')
        return
      }

      // 跳以前H5自己的退换售后
      this.$router.push({
        path: '/backorderlist',
        query: {
          activedata: 3,
        },
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
      color: #6E6E6E;
      margin: 0 auto;
      text-align: left;
      .colorRed {
        display: inline-block;
        /deep/ .van-count-down {
          display: inline-block;
          color: #FF0A35;
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
          line-height: 32px;
          position: relative;
          margin-right: 20px;
          text-align: center;
          color: #FF0A35;
          font-size: 14px;
          &:last-child {
            margin-right: 0;
          }
          &::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            border: 1px solid #FF0A35;
            border-radius: 999px;
            transform: scale(0.5);
            box-sizing: border-box;
          }
        }
      }
  }
  .serverBox {
    margin-top: 10px;
    border-radius: 8px;
    padding: 14px 12px;
    p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #191919;
      margin-bottom: 19px;
      &:last-child {
        margin-bottom: 0;
      }
      &.no-flex {
        justify-content: flex-start;
        margin-bottom: 4px;
        font-weight: bold;
      }
      &.mb9 {
        margin-bottom: 9px;
      }
      .header {
        color: #191919;
        font-size: 13px;
        >span {
          color: #999;
          font-size: 11px;
        }
      }
      >span {
        font-size: 11px;
      }
    }

    .flex_p {
      display: flex;
      flex-wrap: nowrap;
      // padding-right: 40px;
      // background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png') no-repeat right center;
      // background-size: 16px 16px;
      color: #6E6E6E;
      font-size: 13px;
      .value {
        padding-left: 0;
      }
    }
  }
  .tipsBox {
    padding: 10px 12px;
    margin-top: 10px;
    background: #fff;
    color: #6E6E6E;
    border-radius: 8px;
    p {
      padding-left: 20px;
      font-size: 11px;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/tip-icon.png') no-repeat left 2px;
      background-size: 14px;
    }
  }
  .font-13 {
    font-size: 13px;
  }
}
</style>
