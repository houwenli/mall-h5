<template>
  <div class="boxWrapper" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <div class="scroll-content">
      <!-- 申请售后流程 -->
      <serverDetailsTop
        :server-detail="serverDetail"
        :status-steps="statusSteps"
        :showDayTime="showDayTime"
        :showSteps="showSteps"
        :server-status-tips-map="serverStatusTipsMap"
        :server-log="serverLog"
        :desc="desc"
        @finishTime="finishTime"
        @toRefundDetail="toRefundDetail"
      ></serverDetailsTop>
      <!-- 寄回信息 -->
      <returnInfo :server-detail="serverDetail" mode="exchange"></returnInfo>

      <!-- 商品信息 -->
      <goodsInfo :server-detail="serverDetail"></goodsInfo>

      <!-- 商品退货明细 -->
      <returnDetails :server-detail="serverDetail" mode="exchange"></returnDetails>
    </div>

    <!-- 删除服务单 -->
    <!-- <div style="text-align: center" v-if="serverDetail.status != 4 && serverDetail.status != 6 && serverDetail.status != 7">
      <span class="cancleOrder border_half" @click="deleteCoder">删除服务单</span>
    </div> -->

    <!-- 底部 -->
    <footer class="footerBox" v-if="['10', '18', '19'].indexOf(serverDetail.status) == -1">
      <span
        class="border_half cancleApply"
        v-if="serverDetail.status == 4 || serverDetail.status == 6 || serverDetail.status == 7 || serverDetail.status == 13 || serverDetail.status == 15"
        @click="openConfirm(1)"
      >
        取消申请
      </span>
      <span class="border_half" @click="toInvoice(serverDetail)" v-if="serverDetail.status == 6 || serverDetail.status == 15">填写发货单</span>
      <span class="border_half footer-bnt-redcolor" @click="toInvoice(serverDetail)" v-if="(serverDetail.status == 7 || serverDetail.status == 16)&&serverDetail.backOrderType != 4">
        更改发货单
      </span>
      <span class="border_half" v-if="serverDetail.status == 4 || serverDetail.status == 13" @click="updateApply(serverDetail)">
        修改申请
      </span>
      <span class="border_half" v-if="['3', '5', '9', '12', '11', '14', '17', '22'].includes(serverDetail.status)" @click="deleteCoder()">
        删除服务单
      </span>
      <span class="border_half" @click="toTracesOrder(serverDetail)" v-if="serverDetail.status == 20 || serverDetail.status == 21">查看物流</span>
      <span class="border_half" @click="openConfirm(2)" v-if="serverDetail.status == 20 || serverDetail.status == 21">确认收货</span>
    </footer>

    <!-- 二次确认 -->
    <SecondConfirm
      :title="titieTextMap[confirmType]"
      :cancleText="cancleTextMap[confirmType]"
      :sureText="sureTextMap[confirmType]"
      :textp="textpMap[confirmType]"
      textshow
      :dialogshow="dialogshow"
      @closeBack="closeBack"
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
  import {
    queryBackOrderDetail,
    querySaleApplyList,
    dealApplyOverDue,
    dealFillLogisticsOverDue,
    deleteBackOrder,
    cancleApplySale,
    auditReceipt,
    checkOrderTraces,
  } from '@/api/backorderlist'
  import { Step, Steps, Toast } from 'vant'
  import { exchangeServerStatusDict } from '@/utils/dict'
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
        confirmType: 0,
        textpMap: {
          1: '确认取消售后申请？',
          2: '您是否收到该订单商品？',
          3: '根据物流显示商品已签收，请仔细核实商品状态，否则商家可能会拒绝重新邮寄'
        },
        titieTextMap: {
          // 1: '确认取消售后申请？',
          // 2: '您是否收到该订单商品？',
          1: '',
          2: '',
          3: '确认申请重新邮寄',
        },
        cancleTextMap: {
          1: '返回',
          2: '未收货',
          3: '再想想',
        },
        sureTextMap: {
          1: '确认取消',
          2: '已收货',
          3: '提交',
        },
        exchangeServerStatusDict,
        dialogshow: false,
        active: 3, // 售后流程
        id: this.$route.query.id,
        serverDetail: {},
        showDayTime: [16, 21],
        payChannelType: {
          1: '钱包支付',
          2: '微信支付',
          3: '支付宝支付',
          4: '银联支付',
        },
      }
    },
    computed: {
      statusSteps({ serverDetail }) {
        let status = +serverDetail.status
        if (status === 11) {
          return [
            {
              status: status,
              label: '服务单已取消',
              icon: 'shouhou_quxiao.png',
            },
          ]
        } else if ([14, 17].includes(status)) {
          return [
            {
              status: status,
              label: '服务单已关闭',
              icon: 'shouhou_guanbi.png',
            },
          ]
        }
        return [
          {
            status: 13,
            label: '提交申请',
          },
          {
            status: 15,
            label: '供应商审核',
          },
          {
            status: 16,
            label: '供应商收货',
          },
          {
            // 如果状态是20、和21待收货状态， 则需要大于完成22状态
            status: status > 19 && status < 22 ? 23 : 18,
            label: '供应商发货',
          },
          {
            status: status > 18 && status != 19 ? 22 : 19,
            label: '完成',
          },
        ]
      },

      desc({ serverDetail }) {
        let status = +serverDetail.status,
          backOrderLogs = serverDetail.backOrderLogs || [{}],
          descMap = {
            11: '服务单已取消，如有需要可在售后申请页重新提交服务单',
            13: `申请原因: ${serverDetail.reason}`,
            14: `关于原因：${backOrderLogs[0].rawMessage}`,
            15: backOrderLogs[0].rawMessage || '商家审核通过，请您及时寄出换货商品',
            16: serverDetail.acceptStation,
            18: serverDetail.receiveStatus == 1 ? '商家已收货，等待商家发货' : '商家未收到货，请及时与商家沟通',
            19: `您的服务单${serverDetail.backCode}财务已退款，请您注意查收`,
            20: '换货商品已发出，等待收货',
            22: '换货商品已签收',
            21: '未收到货，申请重新发货',
            17: backOrderLogs[0].status == 13 ? '您未在规定的时间内寄出商品，服务单已关闭，如有需要可在售后申请页重新提交服务单' : backOrderLogs[0].message,
          }

        return descMap[status]
      },

      showSteps({ serverDetail }) {
        let status = +serverDetail.status
        return [11, 14, 13, 15, 16, 18, 17].includes(status) || serverDetail.status >= 19
      },

      serverLog({ serverDetail }) {
        let status = +serverDetail.status,
          finished = false,
          content = ''
        if ([11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(status)) {
          content = (exchangeServerStatusDict.filter((item) => item.value == status) || [{}])[0].label || ''

          if (status === 20 && serverDetail.backOrderLogs[0].status == 24) {
            content = '商家重新寄出'
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

      serverStatusTipsMap({ serverDetail }) {
        return {
          11: {
            start: '服务已取消\n如有需要可在售后申请页重新提交服务单',
          },
          13: {
            // start: `${serverDetail.backOrderLogs ? serverDetail.backOrderLogs[0].message : ''}，预计最迟`,
            // end: '天之内为您审核',
            start:
              serverDetail.backOrderLogs && serverDetail.backOrderLogs[0].status == 12
                ? `您的服务单已修改成功，待商家审核中${serverDetail.backOrderType==4?'':'，还剩'}`
                : `您的服务单已申请成功，待商家审核中${serverDetail.backOrderType==4?'':'，还剩'}`,
            showTime: serverDetail.backOrderType!=4,
            //第三方供应商不显示时间，文案略有区别
          },
          14: {
            start: '服务单已关闭，如有需要可在售后申请页重新提交服务单',
          },
          15: {
            start: '您的服务单商家已审核完成，请您尽快发货，如未及时发货将在',
            end: '后关闭',
            showTime: true,
          },
          16: {
            start: `您的换货商品已寄出，${serverDetail.backOrderType==4?'':'商家最迟将在'}`,
            end: `${serverDetail.backOrderType==4?'请您耐心等待商家确认收货':'天内确认收货，请您耐心等待'}`,
            showTime:  serverDetail.backOrderType!=4
          },
          17: {
            start: '服务单已关闭，如有需要可在售后申请页重新提交服务单',
          },
          18: {
            start: `${
              serverDetail.receiveStatus == 1
                ? '您的换货商品已确认收货，等待商家寄出换货商品，如商家未在'
                : '您的换货商品商家未收到，请核实物流信息，商家仍旧会寄出换货商品，请耐心等待商家发货'
            }`,
            end: serverDetail.receiveStatus == 1 ? '后重新换货邮寄，系统将自动退款' : '',
            showTime: serverDetail.receiveStatus == 1,
          },
          19: {
            start: '服务单已完成，商家未及时寄件，系统为您退款',
          },
          20: {
            start: `您的换货商品商家已寄出，请在`,
            end: '后收货，系统将自动确认收货',
            showTime: true,
          },
          21: {
            start: '您的反馈已经提交给商家，商家将核实物流信息后，重新发货',
          },
          22: { start: '服务单已完成，感谢您对万顺的支持' },
        }
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
      closeBack() {
        if(this.serverDetail.backOrderType == 4){
          //第三方供应商，直接关闭弹窗即可
          this.dialogshow = false
          return
        }
        if (this.confirmType == 2) {
          checkOrderTraces({ backOrderId: this.serverDetail.id })
            .then((res) => {
              if (res.code === 200) {
                this.noReceipt()
              } else {
                this.$nextTick(() => {
                  this.confirmType = 3
                  this.dialogshow = true
                })
              }
            })
            .catch((err) => {
              this.$nextTick(() => {
                this.confirmType = 3
              })
            })
        }
        this.dialogshow = false
      },
      noReceipt() {
        let param = {
          id: this.serverDetail.id,
          isReceipt: 0,
        }
        auditReceipt(param).then((res) => {
          if (res.code == 200) {
            this.dialogshow = false
            Toast('操作成功')
            this.getDetail()
          } else {
            Toast(res.description)
          }
        })
      },
      // 弹窗右按钮
      rightEvent(data) {
        switch (this.confirmType) {
          case 1:
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
            break
          case 2:
            let data = {
              id: this.serverDetail.id,
              isReceipt: 1,
            }
            auditReceipt(data).then((res) => {
              this.dialogshow = false // 关闭弹窗
              if (res.code == 200) {
                Toast('确认收货成功')
                this.getDetail()
              } else {
                Toast(res.description)
              }
            })
            break
          case 3:
            this.noReceipt()
            break
          default:
            break
        }
      },

      openConfirm(type) {
        // 取消申请 & 确认收货 二次弹框
        this.confirmType = type
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

      // 倒计时结束
      finishTime() {
        let param = {
          id: this.serverDetail.id,
        }
        // if (this.serverDetail.status == 13) {
        //   dealApplyOverDue(param).then((res) => {
        //     if (res.code == 200) {
        //       this.getDetail()
        //     }
        //   })
        // } else
        if (this.serverDetail.status == 15) {
          dealFillLogisticsOverDue(param).then((res) => {
            if (res.code == 200) {
              this.getDetail()
            }
          })
        } else if (this.serverDetail.status == 20) {
          param.isReceipt = 1
          auditReceipt(param).then((res) => {
            if (res.code == 200) {
              this.dialogshow = false
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
      // 换货详情进度
      toRefundDetail(data) {
        this.$router.push({
          path: '/returnGoodsSteps',
          query: {
            id: this.serverDetail.id,
            logistics: JSON.stringify(data),
            postType: this.serverDetail.status < 19 ? 0 : 1,
          },
        })
      },
      //查看物流
      toTracesOrder(params) {
        this.$router.push({
          path: '/tracesOrder',
          query: {
            backOrderId: params.id,
            postType: 1,
            from: 'backOrder',
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

    .cancleOrder {
      display: inline-block;
      margin: 1.2rem auto 4rem;
      width: 3.18rem;
      height: 0.96rem;
      line-height: 0.96rem;
      border-radius: 0.48rem;
      text-align: center;
      color: #666;
      position: relative;
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
        color: #fff;
        margin-left: 12px;
        background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
      }
      .editOrderCode::after {
        border-color: transparent;
      }
      .editApply {
        margin-left: 12px;
      }
      .footer-bnt-redcolor {
        background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
        border-radius: 19px;
        color: #fff;
        &::after {
          display: none;
        }
      }
    }
    .goodsInfoDiv {
      font-size: 0.52rem;
      margin-top: 0.6rem;
      .goodsInfo_title {
        display: inline-block;
        width: 2.48rem;
        color: #666;
      }
      .goodsInfo_value {
        color: #000;
      }
    }
  }
</style>
