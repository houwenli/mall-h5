<template>
  <div>
    <!-- 二次确认 -->
    <SecondConfirm
      :textp="titleTextMap[isType]"
      title=""
      :cancleText="cancleTextMap[isType]"
      :sureText="sureTextMap[isType]"
      textshow
      :dialogshow="dialogshow"
      @closeBack="dialogshow = false"
      @rightEvent="rightEvent"
    ></SecondConfirm>

    <!-- 福气值支付确认弹窗 -->
    <SecondConfirm
      :dialogshow="fqzConfirmDialog"
      title="支付确认"
      sureText="确认支付"
      cancleText="再想想"
      @rightEvent="confirmPay"
      @closeBack="fqzConfirmDialog = false"
    >
      <template #textp>
        <div class="fqz-confrim-box">
          <div class="item">
            <span class="label">福气值已抵扣:</span>
            <span class="val">￥{{ isWsorder.fqzPrice }}</span>
          </div>
          <div class="item">
            <span class="label">仍需支付:</span>
            <!-- <span class="val">￥{{ isWsorder.orderFqzAmount || (isWsorder.totalAmount - isWsorder.fqzPrice).toFixed(2) }}</span> -->
            <span class="val">￥{{ isWsorder.totalAmount }}</span>
          </div>
        </div>
      </template>
    </SecondConfirm>
  </div>
</template>
<script>
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import { confirmReceipt, judgeRefund, deleteOrder, selectWsOrderInfoByOrderId } from '@/api/orderlist'
  import { Toast } from 'vant'

  export default {
    components: { SecondConfirm },
    data() {
      return {
        titleTextMap: {
          1: '确认删除此订单？',
          2: '您是否收到该订单商品？',
          3: '非自营订单的发票由商家开具， 具体金额以实际开票为准。如有疑问，请联系商家。',
          4: '确认取消退款申请？',
          5: '订单中存在退款申请中商品，确认收货则默认撤销申请!',
        },
        cancleTextMap: {
          1: '取消',
          2: '未收货',
          3: '取消',
          4: '再想想',
        },
        sureTextMap: {
          1: '删除',
          2: '已收货',
          3: '联系商家',
          4: '确认',
        },

        dialogshow: false, // 二次确认弹窗

        isWsorder: {
          orderFqzAmount: 0,
          fqzPrice: 0,
          wsOrderCode: '',
          otalAmount: '',
          orderInfoVos: [],
        },
        fqzConfirmDialog: false,
        isType: '', // 1 删除弹窗  2 确认收货弹窗  3发票服务弹窗
      }
    },

    methods: {
      async orderOperation(data, text) {
        if (text == '删除订单' || text == '确认收货') {
          if (text == '删除订单') {
            this.isType = 1
          } else if (text == '确认收货') {
            try {
              let res = await judgeRefund({ orderId: data.id })
              if (res.code == 200) {
                //有退款
                if (res.data == 2002) {
                  this.isType = 5
                } else {
                  this.isType = 2
                }
              } else {
                this.$toast(res.msg)
                return
              }
            } catch (error) {
              console.log(error)
              return
            }
          }
          this.dialogshow = true
          this.orderid = data.id
        }

        if (text == '去支付') {
          this.goPay(data)
        }
      },

      // 二次确认右按钮
      rightEvent() {
        if (this.isType == 1) {
          let params = {
            orderId: this.orderid,
          }
          deleteOrder(params).then((res) => {
            if (res.code == 200) {
              this.$emit('confirmResearch')
            }
          })
        } else if (this.isType == 2 || this.isType == 5) {
          confirmReceipt(this.orderid).then((res) => {
            if (res.code == 200) {
              this.$toast('确认收货成功')
              this.$emit('confirmResearch')
            } else {
              this.$toast(res.description)
            }
          })
        }
        this.dialogshow = false // 关闭弹窗
      },
      commonPay(sendMoney, orderNo, appData, orderType){
        let payParams = {
          "configRequestParams": {
            uid: appData.userId, // 用户id
            businessType: 100, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
            amount: sendMoney* 100, // 待支付金额
            platform: 1 // 客户端 1.APP 2.微信小程序 3.H5
          },  // 拉取收银台参数
          "payRequestParams": {
            orderNo, // 智慧生活业务订单号
            userId: appData.userId, // 用户ID
            businessType: 100, // 业务类型
            paySceneType: orderType*1 === 14 ? 102 : 101
          }, // 收银台支付接口参数
          "showInfo": {
            amount: sendMoney* 100, // 展示金额
            businessTypeName: "电商优选", // 业务线名称
            expirationTimeStr: "" // 如果需要显示支付倒计时就传
          }
        }
        if (window.ws) {
          window.ws.appCashierPay(
            JSON.stringify(payParams)
          )
          window.appCashierPayResult  = (res) => {
            res = JSON.parse(res)
            if(res.payStatus == 'PAID'){
              sessionStorage.removeItem('wxzf_payResult')
              this.$router.push({
                path: '/paysuccess',
                query: { payResult: res },
              })
            } else {
              Toast(res.msg)
            }
          }
        } else if (window.webkit) {
          window.webkit.messageHandlers.appCashierPay.postMessage(payParams)
          window.appCashierPayResult = (res) => {
            if(res.payStatus == 'PAID'){
              sessionStorage.removeItem('wxzf_payResult')
              this.$router.push({
                path: '/paysuccess',
                query: { payResult: res },
              })
            } else {
              Toast(res.msg)
            }
          }
        } else {
          Toast('当前版本app不支持收银台支付，请升级app后重试')
        }
      },

      payhandle(item) {
        let appData = JSON.parse(localStorage.getItem('appData'))
        if(appData && appData.appScheme == 'wsf') {
          this.commonPay(item.price, item.masterOrderCode, appData, item.orderType)
        } else {
          this.$router.push({
            path: '/zhPay',
            query: { money: item.price, orderCode: item.masterOrderCode, type: 1, id: item.id, serviceType: 100,orderType:item.orderType },
          })
        }
      },

      // 去支付
      async goPay(item) {
        try {
          let res = await selectWsOrderInfoByOrderId({ orderId: item.id })
          if (res.code === 200) {
            let data = res.data
            this.isWsorder = data
            if (this.isWsorder.fqzPrice && this.isWsorder.fqzPrice > 0) {
              this.isWsorder.id = item.id
              this.isWsorder.orderCode = item.masterOrderCode
              this.isWsorder.orderType = item.orderType
              this.fqzConfirmDialog = true
            } else {
              this.payhandle(item)
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      // 福气值弹窗确认支付
      confirmPay() {
        this.fqzConfirmDialog = false
        // const money = this.isWsorder.orderFqzAmount || (this.isWsorder.totalAmount - this.isWsorder.fqzPrice).toFixed(2)
        const money = this.isWsorder.totalAmount
        let data = {
          orderCode: this.isWsorder.wsOrderCode,
          id: this.isWsorder.id,
          orderType: this.isWsorder.orderType,
          money: money,
          serviceType: 100,
          type: 1
        }
        let appData = JSON.parse(localStorage.getItem('appData'))

        if(appData && appData.appScheme == 'wsf') {
          this.commonPay(money.toFixed(2),  this.isWsorder.wsOrderCode, appData)
        } else {
          this.$router.replace({
            path: '/zhPay',
            query: data,
          })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .fqz-confrim-box {
    padding-bottom: 20px;
    .item {
      text-align: center;
      font-size: 14px;
      line-height: 16px;
      color: #666;
      &:first-child {
        margin-bottom: 10px;
      }
      .val {
        color: #ea0213;
        font-weight: bold;
      }
    }
  }
</style>
