<template>
  <div class="refundboxwrapper">
    <navBartop
      :title="'进度详情'"
      :isConfirm="false"
      @clickBack="back"
      @clickRight="clickRight"
      :isRight="showLogistics"
      rightText="查看物流"
      class="navtop"
      :outStyle="outStyle"
    ></navBartop>
    <!-- 进度详情-基本信息 -->
    <!-- <div class="goodsReturnBox" v-if="type === 'refundServerDetailsSteps'">
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">订单编号:</label>
        <span class="goodsInfo_value">{{ serverDetail.orderCode }}</span>
      </div>
      <div class="goodsInfoDiv" v-if="status == 1">
        <label class="goodsInfo_title">退款进度:</label>
        <span class="goodsInfo_value">
          <van-count-down :time="countDown" @finish="finishTime">
            <template #default="timeData">
              退款申请中，待商家审核，还剩
              <span style="color: #e60113;font-weight: bold;">{{ timeData.days }}天{{ timeData.hours }}时{{ timeData.minutes }}分</span>
            </template>
          </van-count-down>
        </span>
      </div>
      <div class="goodsInfoDiv" v-else>
        <label class="goodsInfo_title">退款进度:</label>
        <span class="goodsInfo_value">{{ status == 2 ? '退款申请已通过' : status == 11 ? '退款申请已取消' : '退款申请已拒绝' }}</span>
      </div>
      <div class="goodsInfoDiv" v-if="status == 3">
        <label class="goodsInfo_title">拒绝原因:</label>
        <span class="goodsInfo_value">{{ serverDetail.message }}</span>
      </div>
    </div> -->
    <!-- 进度详情 -->
    <!-- <div class="refundDetailbox" :style="{ 'margin-top': type === 'refundServerDetailsSteps' ? 0 : null }"> -->
    <div class="refundDetailbox">
      <van-steps direction="vertical" active-color="#191919" :active="0">
        <van-step v-for="(temp, i) in refundstagedata" :key="i">
          <strong>{{ temp.logType }}</strong>
          <h3>{{ temp.message }}</h3>
          <p>{{ temp.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
  import { Step, Steps, CountDown } from 'vant'
  import { queryBackOrderDetail } from '@/api/backorderlist'
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
        refundstagedata: [],
        status: '',
        backOrderId: '',
        logistics: {},
        serverDetail: {},
        type: this.$route.query.type || 'returnGoodsSteps', // 'returnGoodsSteps'：换货和退货 'refundServerDetailsSteps': 退款
        outStyle:{
          background: 'linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%)'
        }
      }
    },
    created() {
      this.getDetail()
      // this.logistics = JSON.parse(this.$route.query.logistics)
    },
    computed: {
      showLogistics() {
        return this.status == '7' || this.status == '8' || this.status == '9' || this.status == '10' || this.status == '12' || this.status >= 16
      },
    },
    methods: {
      // 倒计时结束
      finishTime() {
        this.getDetail()
      },

      getDetail() {
        let param = {
          id: this.$route.query.id,
        }
        queryBackOrderDetail(param).then((res) => {
          if (res.code == 200) {
            this.refundstagedata = res.data.backOrderLogs
            this.status = res.data.status
            this.backOrderId = res.data.id

            this.serverDetail = res.data

            //倒计时
            if (this.type === 'refundServerDetailsSteps') {
              let endTime = this.serverDetail.endTime ? this.serverDetail.endTime.replace(/\-/g, '/') : ''
              endTime = new Date(endTime).getTime()
              let nowTime = this.serverDetail.nowTime ? this.serverDetail.nowTime.replace(/\-/g, '/') : ''
              nowTime = new Date(nowTime).getTime()
              if (endTime - nowTime > 0) {
                if (this.serverDetail.status == 7) {
                  //向上取整转化成天
                  let countDownTime = endTime - nowTime
                  let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24))
                  this.countDown = countDownDay
                } else {
                  this.countDown = endTime - nowTime
                }
              }
            }
          }
        })
      },
      clickRight() {
        // 查看物流
        this.$router.push({
          path: '/tracesOrder',
          query: {
            backOrderId: this.serverDetail.id,
            postType: this.$route.query.postType,
            from: 'backOrder',
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
  .refundboxwrapper {
    background-color: #f5f5f5;
    min-height: 100%;
    overflow: hidden;
    .navbarbox {
      height: 72px;
      background: linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%);
    }
    /deep/ .topbox {
      background: linear-gradient(225deg, #ff5f2e 0%, #ff0a35 100%);
      // background: transparent;
      height: 44px !important;
      z-index: 3;
      .van-nav-bar__title {
        color: #fff !important;
        font-weight: 600;
        font-size: 20px;
      }
      .van-nav-bar__text {
        color: #fff;
      }
      .van-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background-color: rgba(30, 30, 30, 0.2);
        border-radius: 8px;
        &::before {
          // display: none;
          content: '';
          width: 20px;
          height: 20px;
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/arrow-back-white-2x.png') no-repeat;
          background-size: 20px;
        }

        // display: none;
      }
    }

    .refundDetailbox {
      position: relative;
      z-index: 2;
      margin: 0 12px;
      margin-top: -20px;
      margin-bottom: 10px;
      border-radius: 8px;
      padding: 0.4rem 0;
      padding-right: 10px;
      background-color: #fff;
      top: 44px;
      /deep/ .van-step {
        margin-bottom: 12px;
        padding: 8px;
        border-radius: 8px;
        font-size: 11px;
        color: #999;
        background-color: #f6f6f6;
        h3 {
          padding: 4px 0;
          color: #999;
          line-height: 15px;
        }
        p {
          line-height: 15px;
        }
        strong {
          font-size: 13px;
          font-weight: 400;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
      }

      /deep/ .van-steps--vertical {
        padding: 0 0 0 30px;
      }

      /deep/ .van-step__icon--active {
        color: #e60113;
      }

      /deep/ .van-step__title--active p {
        color: #999;
      }
      /deep/ .van-step__circle {
        width: 7px;
        height: 7px;
        border: 2px solid #f7f7f7;
        box-sizing: content-box;
      }

      /deep/ .van-step__icon--active::before {
        content: '';
        width: 7px;
        height: 7px;
        border: 2px solid #ffe6ea;
        box-sizing: content-box;
        background-color: #ff0a35;
        border-radius: 50%;
      }
      /deep/ .van-step__circle-container {
        top: 50%;
      }
      /deep/ .van-step__line {
        display: none;
      }
      /deep/ .van-step {
        &::before,
        &::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
          left: -15px;
          width: 1px;
          height: 50%;
          background-color: #eee;
          transform: scale(1) translateX(-50%);
        }
        &::after {
          top: 50%;
          height: calc(~'50% + 12px');
        }

        &:first-of-type::before,
        &:last-of-type::after {
          display: none;
        }
      }
    }
  }
  .goodsReturnBox {
    position: relative;
    z-index: 2;
    background-color: #fff;
    padding: 0 12px;
    padding-bottom: 16px;
    margin-bottom: 10px;
    margin-top: -20px;
    border-radius: 12px;
    line-height: 17px;
    overflow: hidden;
    .goodsInfoDiv {
      margin-top: 16px;
      font-size: 13px;
      display: flex;
      color: #191919;
      .goodsInfo_title {
        margin-right: 40px;
        display: inline-block;
      }
      .goodsInfo_value {
        flex: 1;
        text-align: right;
        .van-count-down {
          // font-size: 12px;
        }
      }
    }
  }
</style>
