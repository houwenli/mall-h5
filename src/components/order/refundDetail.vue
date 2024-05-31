<template>
  <div class="refundboxwrapper">
    <navBartop :title="'取消/退款进度'" :isConfirm="false" @clickBack="back" class="navtop"></navBartop>
    <div class="refundOrderbox">
      <div class="refundCode">
        <p class="ordercode">
          <label class="refundText">订单编号：</label>
          <span class="refundData">{{ orderCode }}</span>
        </p>
        <!-- <van-count-down :time="countDown" format="HH 时 mm 分" v-else class="ordercode">
          <template #default="timeData">
            <label class="refundText">取消/退款进度：</label>
            <span class="refundData refundstage">{{ logStatus | logStatusDict }}</span>
            <span>待商家审核,还剩</span>
            <span class="refundData refundstage">{{ timeData.hours }}时</span>
            <span class="refundData refundstage">{{ timeData.minutes }}分</span>
            <span class="refundData refundstage">{{ timeData.days }}天</span>
          </template>
        </van-count-down> -->
        <p class="ordercode" v-if="logStatus == 1">
          <label class="refundText">取消/退款进度：</label>
          <span class="refundData refundstage">{{ logStatus | logStatusDict }}</span>
          <span>
            待商家审核，预计最迟<van-count-down :time="countDown" >
              <template #default="timeData">
                  <span style="color: #e60113">{{ timeData.days }}天{{ timeData.hours }}时{{ timeData.minutes }}分{{ timeData.seconds }}秒</span>
              </template>
            </van-count-down>天之内为您审核</span>
        </p>
        <p v-else-if="logStatus === 3">
          <label class="refundText">拒绝原因：</label>
          <span class="refundData">{{ remark }}</span>
        </p>
        <p v-else class="ordercode">
          <label class="refundText">取消/退款进度：</label>
          <span class="refundData refundstage">{{ logStatus | logStatusDict }}</span>
        </p>
      </div>

      <!--      <div class="refundInfo" v-if="logStatus == 2">-->
      <!--        <label class="refundText">退款明细</label>-->
      <!--        <p class="refundData">万顺福钱包：￥10.00(预计2020年10月19日09时前到账）</p>-->
      <!--        <div class="refundTips">-->
      <!--          退款将返还您实际支付的金额。万顺福钱包、微信支付、支付宝支付等资产将原路返还，若返还失败，请前往钱包余额中查看退款。-->
      <!--        </div>-->
      <!--      </div>-->
    </div>

    <div class="refundDetailbox">
      <van-steps direction="vertical" active-color="#E60113" :active="0">
        <van-step v-for="(temp, i) in refundstagedata" :key="i">
          <h3>{{ temp.message }}</h3>
          <p>{{ temp.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import { CountDown, Step, Steps } from 'vant'
import { applyRefundPass, queryBackOrderLog } from '@/api/backorderlist'
import navBartop from '@/components/commons/navBartop'

export default {
  components: {
    navBartop,
    [CountDown.name]: CountDown,
    [Step.name]: Step,
    [Steps.name]: Steps,
  },
  data() {
    return {
      orderId: '',
      orderCode: '',
      cancelTime: '',
      logStatus: 1,
      countDown: 0,
      refundstagedata: [
        {
          message: '您的订单已取消。如您使用了优惠券等，请查看取消进度详情',
        },
        {
          message: '您的取消申请已提交',
        },
      ],
      remark: '',
    }
  },
  created() {
    this.orderId = this.$route.query.orderId || -1
    this.orderCode = this.$route.query.orderCode || -1
    this.cancelTime = this.$route.query.cancelTime || ''
    if (this.cancelTime) {
      this.refundstagedata = this.refundstagedata.map((el) => {
        el.createTime = this.cancelTime
        return el
      })
    }
    this.loadBackOrderLog()
  },
  methods: {
    loadBackOrderLog() {
      if (this.orderCode <= 0) {
        this.back()
        return
      }
      queryBackOrderLog({ orderCode: this.orderCode }).then((res) => {
        if (res.code == 200) {
          let that = this
          this.logStatus = res.data ? Number(res.data.status) : 11
          this.remark = res.data.remark ? res.data.remark : ''
          if (res.data.backOrderLogDescVOs) {
            this.refundstagedata = res.data.backOrderLogDescVOs
            if (res.data.status == 1) {
              let endTime = res.data.endTime.replace(/\-/g, '/')
              endTime = new Date(endTime).getTime()
              let nowTime = res.data.nowTime.replace(/\-/g, '/')
              nowTime = new Date(nowTime).getTime()
              if (endTime - nowTime > 0) {
                // this.countDown = endTime - nowTime
                //毫秒数向上取整转化成天
                let countDownTime = endTime - nowTime
                let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24))
                this.countDown = countDownDay
              }
              // setTimeout(
              //   function () {
              //     that.autoApplyRefundOrder()
              //   },
              //   this.countDown < 1000 ? 1000 : this.countDown
              // )
            }
          }
        }
      })
    },
    // 自动同意订单
    autoApplyRefundOrder() {
      applyRefundPass({ orderCode: this.orderCode }).then((res) => {
        this.loadBackOrderLog()
      })
    },
    back() {
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.refundboxwrapper {
  background-color: #f5f5f5;
  min-height: 100vh;

  .refundOrderbox {
    padding: 0 0.72rem;
    font-size: 0.56rem;
    background-color: #fff;
    margin-bottom: 0.48rem;

    .refundText {
      color: #666666;
      min-width: 80px;
    }

    .refundData {
      color: #333;

      /deep/ .van-count-down {
        display: inline-block;
        color: #e60113;
        font-size: 0.52rem;
      }
    }

    .refundCode {
      padding: 0.72rem 0;
      border-bottom: 1px solid #f6f6f6;

      .ordercode {
        margin-bottom: 0.36rem;
      }

      .refundstage {
        color: #e60113;
      }
    }

    .refundInfo {
      margin-top: 0.72rem;

      label {
        display: inline-block;
        margin-bottom: 0.16rem;
      }

      .refundTips {
        font-size: 0.48rem;
        margin-top: 0.36rem;
        color: #999;
        padding-left: 0.72rem;
        background: url('../../assets/img/icon_ak@2x.png') no-repeat top left;
        background-size: 0.64rem;
        padding-bottom: 0.8rem;
      }
    }
  }

  .refundDetailbox {
    padding: 0.4rem 0;
    background-color: #fff;
    font-size: 0.48rem;

    /deep/ .van-step {
      font-size: 0.48rem;
      color: #999;
    }

    /deep/ .van-steps--vertical {
      padding: 0 0 0 1.52rem;
    }

    /deep/ .van-step__icon--active {
      color: #e60113;
    }

    /deep/ .van-step__title--active h3 {
      color: #000;
      font-weight: bold;
    }

    /deep/ .van-step__title--active p {
      color: #000;
    }
  }
}
</style>
