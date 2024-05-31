<template>
  <div class="boxWrapper" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <div class="scroll-content">
      <!-- 申请售后流程 -->
      <serverDetailsTop
        :server-detail="serverDetail"
        :status-steps="statusSteps"
        :show-steps="showSteps"
        :server-status-tips-map="serverStatusTipsMap"
        :server-log="serverLog"
        :desc="desc"
        @finishTime="finishTime"
        @toRefundDetail="toRefundDetail"
      ></serverDetailsTop>

      <!-- 商品信息 -->
      <goodsInfo :server-detail="serverDetail"></goodsInfo>

      <!-- <div class="goodsBox bgcolor">
        <p class="title">商品信息</p>
        <div class="returnGoodsBox" v-if="serverDetail.type != 1 ? serverDetail.returnSku : serverDetail.refundSku">
          <img :src="serverDetail.type != 1 ? serverDetail.returnSku.skuImage : serverDetail.refundSku.skuImage" alt="" />
          <div class="goods_right">
            <div class="goods_right_top">
              <p class="overline">{{ serverDetail.type != 1 ? serverDetail.returnSku.skuName : serverDetail.refundSku.skuName }}</p>
              <p class="goodsNum transformS">
                <span>申请数量：{{ serverDetail.num }}</span>
              </p>
            </div>
            <p class="goodsPrice">
              <span>单价：</span>
              ¥{{ serverDetail.type != 1 ? serverDetail.returnSku.unitPrice.toFixed(2) : serverDetail.refundSku.unitPrice.toFixed(2) }}
            </p>
          </div>
        </div>
        <div class="customerService">
          <span @click="toService">联系客服</span>
        </div>
      </div> -->

      <!-- 商品退货明细 -->
      <returnDetails :server-detail="serverDetail" mode="refund"></returnDetails>
    </div>
    <!-- 底部 -->
    <footer class="footerBox" v-if="serverDetail.status == 1">
      <span class="border_half" @click="cancleApply(serverDetail)">
        取消申请
      </span>
    </footer>
    <!-- 二次确认 -->
    <SecondConfirm
      :textp="'是否取消退款申请？'"
      textshow
      title=""
      :cancleText="'否'"
      :sureText="'是'"
      :dialogshow="dialogshow"
      @closeBack="dialogshow = false"
      @rightEvent="rightEvent"
      class="SecondConfirmbox"
    ></SecondConfirm>
  </div>
</template>

<script>
  import serverDetailsTop from './component/serverDetailsTop.vue'
  import returnDetails from '@/components/order/afterSale/component/returnDetails'
  import goodsInfo from '@/components/order/afterSale/component/goodsInfo'
  import SecondConfirm from '@/components/commons/SecondConfirm'

  import { queryBackOrderDetail, cancleApplySale } from '@/api/backorderlist'
  import { Step, Steps, Toast, CountDown } from 'vant'
  export default {
    components: {
      serverDetailsTop,
      returnDetails,
      goodsInfo,
      SecondConfirm,
      [Steps.name]: Steps,
      [Step.name]: Step,
      [CountDown.name]: CountDown,
    },
    data() {
      return {
        dialogshow: false,
        id: this.$route.query.id,
        serverDetail: {},
        countDown: '',
      }
    },

    computed: {
      serverStatusTipsMap({ serverDetail }) {
        return {
          1: {
            start: `您的退款申请已提交${serverDetail.backOrderType != 4? '，待卖家审核中还剩下':''}`,
            showTime: serverDetail.backOrderType != 4,
          },
          2: {
            start: '您的退款申请商家已同意，待平台审核通过发放退款金额即可',
          },
          3: {
            start: '您的退款申请商家已拒绝，请注意查收商品',
          },
          11: {
            start: '服务单已取消，如有需要可在订单详情页重新提交申请',
          }
        }
      },
      desc({ serverDetail }) {
        return serverDetail.desc
      },

      serverLog({ serverDetail }) {
        let finished = false,
          content = { 1: '待审核', 2: '审核通过', 3: '审核拒绝' }[+serverDetail.status] || '已取消'
        return {
          finished,
          content,
        }
      },

      statusSteps({ serverDetail }) {
        if (serverDetail.status == 11) {
          return [
            {
              status: 11,
              label: '服务单已取消',
              icon: 'shouhou_quxiao.png',
            },
          ]
        }
        return [
          {
            status: 1,
            label: '提交申请',
            otherStatus: 1,
          },
          {
            status: 1,
            label: '供应商审核',
          },
          {
            status: serverDetail.status == 1 || serverDetail.status == 2 ? 2 : 3,
            label: `审核${serverDetail.status == 1 || serverDetail.status == 2 ? '通过' : '拒绝'}`
            // label: '完成',
          },
        ]
      },

      showSteps({ serverDetail }) {
        let status = +serverDetail.status
        return [1, 2, 3, 11].includes(status)
      },
    },

    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.getDetail()
    },
    methods: {
      // 弹窗左按钮
      closeBack(data) {
        this.dialogshow = false
      },
      // 弹窗右按钮
      rightEvent(data) {
        let param = {
          id: this.serverDetail.id,
        }
        cancleApplySale(param).then((res) => {
          if (res.code == 200) {
            this.dialogshow = false
          } else {
            this.dialogshow = false
            Toast(res.description)
          }
          this.getDetail()
        })
      },

      // 取消申请
      cancleApply(data) {
        this.dialogshow = true
      },
      
      back() {
        this.$router.go(-1)
      },
      // 倒计时结束
      finishTime() {
        this.getDetail()
      },
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
      // 退款详情进度
      toRefundDetail() {
        // let data = {
        //   type: this.serverDetail.type,
        //   logisticsCompany: this.serverDetail.logisCompanyName,
        //   orderCode: this.serverDetail.orderCode,
        //   logisticsCode: this.serverDetail.logisticsCode,
        //   waybillCode: this.serverDetail.waybillCode,
        //   customerName: this.serverDetail.contactMobile.substring(this.serverDetail.contactMobile.length - 4, this.serverDetail.contactMobile.length),
        // }
        this.$router.push({
          path: '/returnGoodsSteps',
          query: {
            id: this.serverDetail.id,
            type: 'refundServerDetailsSteps',
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .boxWrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-bottom: 1px;
    .scroll-content {
      overflow-y: scroll;
      flex: 1;
    }

    .footerBox {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      background-color: #fff;
      span {
        margin: 8px 0;
        margin-right: 12px;
        margin-bottom: calc(~'8px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
        margin-bottom: calc(~'8px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
        font-size: 14px;
        color: #191919;
        position: relative;
        display: inline-block;
        padding: 0 0.48rem;
        height: 32px;
        line-height: 32px;
        &::after {
          border-color: #c3c3c3;
        }
      }
    }
  }
</style>
