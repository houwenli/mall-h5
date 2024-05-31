<template>
  <div class="boxWrapper" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <div class="scroll-content">
      <!-- 申请售后流程 -->
      <serverDetailsTop
        :server-detail="serverDetail"
        :status-steps="statusSteps"
        :show-steps="showSteps"
        :show-day-time="showDayTime"
        :server-status-tips-map="serverStatusTipsMap"
        :server-log="serverLog"
        :desc="desc"
        @finishTime="finishTime"
        @toRefundDetail="toRefundDetail"
      ></serverDetailsTop>

      <!-- 寄回信息 -->
      <returnInfo :server-detail="serverDetail"></returnInfo>

      <!-- 退回金额 -->
      <div class="bgcolor returnMoney" v-if="serverDetail.status == 8 || serverDetail.status == 12">
        <div class="title">
          <strong>退回金额:</strong>
          <strong class="return-price">¥{{ serverDetail.realBackPrice }}</strong>
        </div>
        <div class="pay-Type" v-for="item in serverDetail.backWayPrices" :key="item.id">
          <p>
            {{ payChannelType[item.backChannel] }}:
            <span>（预计1-5个工作日到账）</span>
          </p>
          <strong class="disabled-price">¥{{ item.backPrice }}</strong>
        </div>
      </div>
      <!-- 商品信息 -->
      <goodsInfo :server-detail="serverDetail"></goodsInfo>

      <!-- 商品退货明细 -->
      <returnDetails :server-detail="serverDetail"></returnDetails>
    </div>

    <!-- 删除服务单 -->
    <!-- <div style="text-align: center" v-if="serverDetail.status != 4 && serverDetail.status != 6 && serverDetail.status != 7">
      <span class="cancleOrder border_half" @click="deleteCoder">删除服务单</span>
    </div> -->

    <!-- 底部 -->
    <footer class="footerBox" v-if="['10', '18', '19'].indexOf(serverDetail.status) == -1">
      <span class="border_half cancleApply" v-if="['4', '6', '7', '13', '15', '16'].includes(serverDetail.status)" @click="cancleApply(serverDetail)">
        取消申请
      </span>
      <span class="border_half" @click="toInvoice(serverDetail)" v-if="serverDetail.status == 6">填写发货单</span>
      <span class="border_half footer-bnt-redcolor" @click="toInvoice(serverDetail)" v-if="serverDetail.status == 7&&serverDetail.backOrderType != 4">更改发货单</span>
      <span class="border_half" v-if="serverDetail.status == 4" @click="updateApply(serverDetail)">修改申请</span>
      <span class="border_half" v-if="['3', '5', '8', '9', '11', '12', '14', '17', '22'].includes(serverDetail.status)" @click="deleteCoder()">
        删除服务单
      </span>
    </footer>

    <!-- 二次确认 -->
    <SecondConfirm
      textshow
      title=""
      :textp="this.id_del ? '是否确认删除服务单？' : '确认取消售后申请？'"
      :cancleText="this.id_del ? '取消' : '返回'"
      :sureText="this.id_del ? '确认' : '确认取消'"
      :dialogshow="dialogshow"
      @closeBack="dialogshow = false"
      @rightEvent="rightEvent"
      class="SecondConfirmbox"
    ></SecondConfirm>
  </div>
</template>

<script>
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import serverDetailsTop from './component/serverDetailsTop.vue'
  import returnInfo from '@/components/order/afterSale/component/returnInfo'
  import returnDetails from '@/components/order/afterSale/component/returnDetails'
  import goodsInfo from '@/components/order/afterSale/component/goodsInfo'
  import { queryBackOrderDetail, querySaleApplyList, dealApplyOverDue, dealFillLogisticsOverDue, deleteBackOrder, cancleApplySale } from '@/api/backorderlist'
  import { Step, Steps, Toast } from 'vant'
  import { serverStatusDict } from '@/utils/dict'
  export default {
    components: {
      SecondConfirm,
      [Steps.name]: Steps,
      [Step.name]: Step,
      serverDetailsTop,
      returnInfo,
      returnDetails,
      goodsInfo,
    },
    data() {
      return {
        serverStatusDict,
        id_del: '',
        dialogshow: false,
        active: 3, // 售后流程
        id: this.$route.query.id,
        serverDetail: {},
        showDayTime: [7],
        payChannelType: {
          0: '万顺宝余额',
          2: '微信',
          3: '支付宝',
          9: '福气值支付',
        },
      }
    },
    computed: {
      serverStatusTipsMap({ serverDetail }) {
        return {
          4: {
            start:
              serverDetail.backOrderLogs && serverDetail.backOrderLogs[0].status == 12
                ? `您的服务单已修改成功，待商家审核中${serverDetail.backOrderType==4?'':'，还剩'}`
                : `您的服务单已申请成功，待商家审核中${serverDetail.backOrderType==4?'':'，还剩'}`,
            showTime:  serverDetail.backOrderType!=4,
          },
          6: {
            start: '您的服务单商家已审核完成，请您尽快发货，如未及时发货将在',
            end: '后关闭',
            showTime: true,
          },
          7: {
            start: `您的退货商品已寄出，${serverDetail.backOrderType==4?'':'商家最迟将在'}`,
            end: `${serverDetail.backOrderType==4?'请您耐心等待商家确认收货':'天内确认收货，请您耐心等待'}`,
            showTime:  serverDetail.backOrderType!=4,
          },
          5: {
            start: '服务单已关闭，如有需要可在售后申请页重新提交服务单',
          },
          9: {
            start: '服务单已关闭，如有需要可在售后申请页重新提交服务单',
          },
          8: {
            start: `服务单${serverDetail.backCode}已完成，感谢您对万顺的支持`,
          },
          12: {
            start: `服务单${serverDetail.backCode}已完成，感谢您对万顺的支持`,
          },
          11: {
            start: '服务已取消\n如有需要可在售后申请页重新提交服务单',
          },
        }
      },

      statusSteps({ serverDetail }) {
        if (serverDetail.status == 5 || serverDetail.status == 9) {
          return [
            {
              status: serverDetail.status,
              label: '服务单已关闭',
              icon: 'shouhou_guanbi.png',
            },
          ]
        } else if (serverDetail.status == 11) {
          return [
            {
              status: serverDetail.status,
              label: '服务单已取消',
              icon: 'shouhou_quxiao.png',
            },
          ]
        }
        return [
          {
            status: 4,
            label: '提交申请',
          },
          {
            status: 6,
            label: '供应商审核',
          },
          {
            status: 7,
            label: '供应商收货',
          },
          {
            status: 8,
            label: '供应商处理',
            otherStatus: 11,
          },
          {
            status: serverDetail.status == 12 ? 12 : 8,
            label: '完成',
          },
        ]
      },

      desc({ serverDetail }) {
        let status = +serverDetail.status,
          backOrderLogs = serverDetail.backOrderLogs || [{}],
          descMap = {
            4: `申请原因：${serverDetail.reason}`,
            6: backOrderLogs[0].rawMessage || '商家审核通过，请您及时寄出退货商品',
            7: serverDetail.acceptStation,
            8: `您的服务单财务已退款，请您注意查收`,
            12: '您的服务单财务已退款，请您注意查收',
            11: '',
            5: backOrderLogs[0].message,
            9: backOrderLogs[0].status == 13 ? '您未在规定的时间内寄出商品，服务单已关闭，如有需要可在售后申请页重新提交服务单' : backOrderLogs[0].message,
          }

        return descMap[status]
      },

      serverLog({ serverDetail }) {
        let status = +serverDetail.status,
          finished = false,
          content = ''
        if ([4, 6, 7, 8, 5, 9, 11, 12].includes(status)) {
          content = (serverStatusDict.filter((item) => item.value == status) || [{}])[0].label || ''

          if ([5, 9, 11].includes(serverDetail.status)) {
            finished = true
          }
        } else {
          content = serverDetail.backOrderLogs ? serverDetail.backOrderLogs[0].message : ''
          finished = true
        }
        return {
          finished,
          content,
        }
      },

      showSteps({ serverDetail }) {
        let status = +serverDetail.status
        return [4, 6, 5, 7, 8, 9, 11, 12].includes(status)
      },
    },

    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.getDetail()
    },
    methods: {
      // 删除订单
      deleteCoder() {
        let param = {
          id: this.serverDetail.id,
        }
        deleteBackOrder(param).then((res) => {
          if (res.code == 200) {
            this.$router.push({
              path: '/backorderlist',
              query: {
                // activedata: 3,
              },
            })
          }
        })
      },
      // 修改申请
      updateApply(data) {
        console.log('修改申请', data)
        this.$router.push({
          path: '/applyAfterSale',
          query: {
            id: data.id,
          },
        })
      },
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
            this.getDetail()
          } else {
            Toast(res.description)
          }
        })
      },

      // 取消申请
      cancleApply(data) {
        this.dialogshow = true
      },
      // 跳转至填写服务单页面
      toInvoice(data) {
        console.log('更改/填写服务单', data)
        this.$router.push({
          path: '/invoice',
          query: {
            id: data.id,
            // backCode: data.backCode,
            // createTime: data.createTime,
            // returnSku: JSON.stringify(data.returnSku),
          },
        })
      },

      back() {
        this.$router.back()
      },
      // 倒计时结束
      finishTime() {
        let param = {
          id: this.serverDetail.id,
        }
        // if (this.serverDetail.status == 4) {
        //   dealApplyOverDue(param).then((res) => {
        //     if (res.code == 200) {
        //       this.getDetail()
        //     }
        //   })
        // }
        if (this.serverDetail.status == 6) {
          dealFillLogisticsOverDue(param).then((res) => {
            if (res.code == 200) {
              this.getDetail()
            }
          })
        }
      },
      // 查询详情
      getDetail() {
        let param = {
          id: this.id,
        }
        queryBackOrderDetail(param).then((res) => {
          if (res.code == 200) {
            this.serverDetail = res.data
          }
        })
      },
      // 退款详情进度
      toRefundDetail(data) {
        this.$router.push({
          path: '/returnGoodsSteps',
          query: {
            id: this.serverDetail.id,
            logistics: JSON.stringify(data),
            postType: 0,
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .boxWrapper {
    width: 100%;
    height: 100%;
    padding-bottom: 1px;
    display: flex;
    flex-direction: column;
    .scroll-content {
      flex: 1;
      overflow-y: scroll;
    }
    .navtop {
      /deep/ .topbox {
        z-index: 10;
      }
    }
    .bgcolor {
      background-color: #fff;
      border-radius: 12px;
      margin: 0 10px;
      margin-top: 10px;
      padding: 16px 12px;
    }

    .returnMoney {
      margin-top: 18px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // font-weight: bold;
        font-size: 13px;
        font-weight: 400;
      }
      .pay-Type {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: right;
        font-size: 14px;
        margin-top: 0.6rem;
        color: #666666;
        .disabled-price {
          color: #000000;
        }
        span {
          font-size: 10px;
          color: #999999;
        }
      }
      .return-price {
        color: #e60113;
        font-size: 14px;
        span {
          font-size: 0.48rem;
        }
      }
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
      .editOrderCode {
        color: #e60113;
        margin-left: 0.4rem;
      }
      .editOrderCode::after {
        border-color: #e60113;
      }
      .editApply {
        margin-left: 0.4rem;
      }
      .footer-bnt-redcolor {
        background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
        border-radius: 19px;
        color: #fff;
        &::after {
          display: none;
        }
      }
    }
  }
</style>
