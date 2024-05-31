<template>
  <div class="refundboxwrapper">
    <navBartop
      :title="'进度详情'"
      :isConfirm="false"
      @clickBack="back"
      rightText="查看物流"
      class="navtop"
    ></navBartop>
    <!-- 进度详情-基本信息 -->
    <div class="goodsReturnBox">
      <div class="goodsInfoDiv">
        <label class="goodsInfo_title">订单编号:</label>
        <span class="goodsInfo_value">{{serverDetail.orderCode}}</span>
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
        <span class="goodsInfo_value">{{status == 2?'退款申请已通过':status == 11?'退款申请已取消':'退款申请已拒绝'}}</span>
      </div>
      <div class="goodsInfoDiv" v-if="status == 3">
        <label class="goodsInfo_title">拒绝原因:</label>
        <span class="goodsInfo_value">{{serverDetail.message}}</span>
      </div>
    </div>
    <!-- 进度详情-进度线 -->
    <div class="refundDetailbox">
      <van-steps direction="vertical" active-color="#E60113" :active="0">
        <van-step v-for="(temp, i) in refundstagedata" :key="i">
          <template #active-icon>
            <div class="activeIcon"><span></span></div>
          </template>
          <template #inactive-icon>
            <div class="inactiveIcon"><span></span></div>
          </template>
          <!-- <strong>{{ temp.logType }}</strong> -->
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
        countDown: '',
        refundstagedata: [],
        status: '',
        backOrderId: '',
        serverDetail: {},
      }
    },
    created() {
      this.getDetail()
    },
    methods: {
      // 倒计时结束
      finishTime() {
        this.getDetail()
      },
      //获取详情
      getDetail() {
        let param = {
          id: this.$route.query.id,
        }
        queryBackOrderDetail(param).then((res) => {
          if (res.code == 200) {
            this.serverDetail = res.data
            this.refundstagedata = res.data.backOrderLogs
            this.status = res.data.status
            this.backOrderId = res.data.id
            //倒计时
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
        })
      },
      //返回
      back() {
        this.$router.back()
      },
    },
  }
</script>

<style lang="less" scoped>
  .refundboxwrapper {
    border-radius: 10px 10px 0px 0px;
    background-color: #f5f5f5;
    min-height: 100vh;
    .goodsReturnBox {
      background-color: #fff;
      border-radius: 0px 0px 10px 10px;
      padding: 8px 18px 20px 18px;
      margin-bottom: 12px;
      .goodsInfoDiv {
        font-size: 12px;
        margin-top: 12px;
        display: flex;
        .goodsInfo_title {
          display: inline-block;
          width: 2.48rem;
          color: #666;
        }
        .goodsInfo_value {
          color: #000;
          font-weight: bold;
          .van-count-down {
            font-size: 12px;
          }
        }
      }
    }
    .refundDetailbox {
      min-height: calc(~'100vh - 148px');
      border-radius: 10px 10px 0px 0px;
      padding: 14px 18px 24px 0;
      background-color: #fff;
      font-size: 0.48rem;
      .activeIcon {
        width: 13px;
        height: 13px;
        background: #ffd8db;
        border-radius: 7.5px;
        text-align: center;
        span {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 4.5px;
          background: #e60113;
        }
      }
      .inactiveIcon {
        width: 9px;
        height: 9px;
        border-radius: 4.5px;
        background: #eeeeee;
      }
      /deep/ .van-step {
        font-size: 0.48rem;
        color: #999;
      }
      /deep/ .van-step--vertical:not(:last-child)::after{
        border:none
      }
      /deep/ .van-step--vertical{
        padding: 10px 10px 30px 0;
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
        color: #999999;
      }
    }
  }
</style>
