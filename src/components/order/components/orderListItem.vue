<template>
  <div class="orderwrapper">
    <header class="ordertop">
      <span class="orderstatus">
        <span :class="{ ordercancel: [4, 5, 6, 7].includes(orderItem.status) }">
          <span>{{ orderStatusText }}</span>
          <img
            v-if="[4, 5, 6, 7].includes(orderItem.status)"
            :src="`${$oss}/order/delete_icon.png`"
            class="orderdeleteimg"
            alt=""
            @click="orderOperation(orderItem, '删除订单')"
          />
        </span>
      </span>
    </header>

    <div v-for="(logistics, index) in orderList" :key="index">
      <div class="logistics" @click.stop="toCheckLogistics(logistics)" v-if="logistics.kdniaoTrackVO && logistics.kdniaoTrackVO.tracesList && [2, 3].includes(orderItem.status)">
        <div class="logistics-box">
          <div class="logistics-status">{{ logistics.kdniaoTrackVO.tracesList[0].action }}</div>
          <div class="logistics-content">{{ logistics.kdniaoTrackVO.tracesList[0].acceptStation }}</div>
          <div class="logistics-time logistics-content">{{ logistics.kdniaoTrackVO.tracesList[0].acceptTime }}</div>
        </div>
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png" class="logistics-icon" />
      </div>
      <main class="orderbox" v-for="sku in logistics.skus" :key="sku.id">
        <div class="goodsbox">
          <span v-if="orderItem.orderType == 7" class="virtual_tag">虚拟</span>
          <div>
            <img
              src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
              alt=""
              class="goodsimg"
              @click="toOrderDetail(orderItem)"
              v-lazyload="sku.skuImage"
            />
            <!-- 赠品图片 -->
            <img :src="r.url" v-for="(r, i) in sku.giftSkuInfos" :key="i" alt="" class="goodsimg" @click="toOrderDetail(orderItem)" />
          </div>
          <div class="goodsname" @click="toOrderDetail(orderItem)">
            {{ sku.skuName }}
          </div>
        </div>
        <div class="buy-num">x{{ sku.num }}</div>
      </main>
    </div>
    <div class="order-collapse" v-if="orderSkuMore">
      <button class="collapse-bt" @click="toOrderDetail(orderItem)">
        查看更多
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png" class="logistics-icon" />
      </button>
    </div>

    <div class="buy-price-box" @click="toOrderDetail(orderItem)">
      <div class="performate-point" v-if="orderItem.performanceScore > 0">
        <img src="@/assets/img/jixiao.png" />
        <span>绩效分:{{ orderItem.performanceScore | filterFraction }}分</span>
      </div>
      <div class="buy-price">
        <span>{{ [2, 3].includes(orderItem.status) ? '实付' : '应付' }}</span>
        <span class="price-icon font-din">¥</span>
        <span class="price-yuan font-din">{{ parseInt(orderItem.price) }}</span>
        <span class="price-fen font-din">
          .{{
            parseFloat(orderItem.price)
              .toFixed(2)
              .split('.')[1]
          }}
        </span>
      </div>
    </div>
    <footer class="orderfooter">
      <div v-if="orderItem.status == 1 && remainingTime > 0" class="remaining-time">
        <img class="remaining-time-icon" :src="`${$oss}/order/ic_time.png`" alt="" />
        <van-count-down :time="remainingTime" :auto-start="false" format="支付剩余 mm分ss秒"></van-count-down>
      </div>
      <div style="flex: 1">
        <span v-if="orderItem.status == 4 && orderItem.evaluationStatus != 1" class="evaluate" @click="orderOperation(orderItem, '评价晒单')">评价晒单</span>
        <span
          v-if="[4, 5, 6, 7].includes(orderItem.status) || ([2, 3].includes(orderItem.status) && orderItem.orderType != 12)"
          class="order_status"
          @click="orderOperation(orderItem, '再次购买')"
        >
          {{ orderItem.orderType != 12 ? '再次购买' : '重新下单' }}
        </span>
        <span v-if="orderItem.status == 1" @click="orderOperation(orderItem, '去支付')">去支付</span>
        <span v-if="orderItem.status == 3 && orderItem.orderType != 12" class="order_s3" @click="orderOperation(orderItem, '确认收货')">确认收货</span>
      </div>
    </footer>
  </div>
</template>

<script>
  import { CountDown, Toast } from 'vant'

  export default {
    components: {
      [CountDown.name]: CountDown,
    },
    props: {
      orderItem: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    directives: {
      lazyload: {
        bind(el, binding) {
          let image = new Image()
          image.src = binding.value
          image.onload = function() {
            el.src = binding.value
          }
        },
      },
    },
    filters: {
      filterFraction(val, make) {
        let len = (val + '').length
        switch (len) {
          case 3:
          case 4:
            if (make && val == 1000) {
              val = '999+'
            } else {
              val = parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) + '+'
            }
            break
          case 5:
          case 6:
          case 7:
            if (make) {
              val = '999+'
            } else {
              val = parseInt((val / 10000) * 10) / 10 + '万'
            }
            break
          default:
            break
        }
        return val
      },
    },
    data() {
      return {
        orderStatusMap: {
          1: '等待付款',
          2: '正在出库',
          3: '等待收货',
          4: '已完成',
          5: '已取消',
          6: '已取消',
          7: '已取消',
        }, // 订单状态
        motorSatusMap: {
          1: '等待支付',
          2: '请前往门店取车',
          3: '请前往门店取车',
          4: '已完成',
          5: '已取消',
          6: '已取消',
          7: '已取消',
        }, // 电动车订单状态
        more: true,
      }
    },
    computed: {
      orderStatusText({ orderItem }) {
        if (orderItem.backStatus == 1 && (orderItem.status == 2 || orderItem.status == 3)) {
          return '退款申请中'
        }

        if (orderItem.orderType == 12) {
          return this.motorSatusMap[orderItem.status]
        } else {
          return this.orderStatusMap[orderItem.status]
        }
      },

      // 订单列表
      orderList() {
        let { orderAndLogisticsList, status } = this.orderItem

        let arr = orderAndLogisticsList.map((item) => {
            return {
              ...item,
            }
          }),
          length = arr.length,
          arrLength = 0
        if (arr.length > 1) {
          for (let index = 0; index < length; index++) {
            const item = arr[index]

            // 非发货收货阶段，按商品个数展示，   发货收货阶段按物流个数展示
            if (status != 2 && status != 3) {
              if (!arr[index]) {
                break
              }
              let length = item.skus.length
              // 删除多余的sku
              if (length + arrLength > 3) {
                item.skus = item.skus.slice(0, 3 - arrLength)
                // 有0个的代表已经满足三个了已经不需要显示了，删除后续的
                if (item.skus.length === 0) {
                  arr = arr.slice(0, index)
                }
              }
              arrLength += item.skus.length
            } else {
              if (index < 3) {
                item.skus = [item.skus[0]]
              } else {
                // 超过三个删除
                arr = arr.slice(0, 3)
                break
              }
            }
          }
        } else {
          arr[0].skus = arr[0].skus.slice(0, 3)
        }
        return arr
      },

      orderSkuMore() {
        // 显示的订单商品数量
        let showOrderNum = this.orderList.reduce((pre, item) => {
          return pre + item.skus.length
        }, 0)
        // 显示的订单商品数量 是否和返回的一致，不一致则显示查看更多按钮
        return showOrderNum !== this.orderItem.skus.length
      },

      remainingTime({ orderItem }) {
        let buyTime = new Date(orderItem.createTime.replace(/-/g, '/'))
        let endTime = 30 * 60 * 1000
        let nowTime = new Date().getTime()
        return endTime - (nowTime - buyTime)
      },
    },
    methods: {
      // 查看物流
      toCheckLogistics(data) {
        let query = {
          id: this.orderItem.id,
          type: 0,
        }
        if (this.orderList.length > 1) {
          query = {
            id: data.skus[0].orderSkuId,
            type: 2
          }
        }
        this.$router.push({
          path: '/tracesOrder',
          query
        })
      },

      // 跳转到订单详情页
      toOrderDetail(temp) {
        //12:电动车
        if (temp.orderType && temp.orderType == 12) {
          this.$router.push({ path: '/motorCar/orderDetail', query: { orderId: temp.id, backStatus: temp.backStatus } })
        } else {
          this.$router.push({ path: '/orderdetail', query: { orderId: temp.id, backStatus: temp.backStatus } })
        }
      },
      commonPay(sendMoney, orderNo, appData){
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
            paySceneType: 101
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
      async goToPay(data) {
        let appData = JSON.parse(localStorage.getItem('appData'))
        if(appData && appData.appScheme == 'wsf') {
          this.commonPay(data.price, data.masterOrderCode, appData)
        } else {
          this.$router.push({
            path: '/zhPay',
            query: { money: data.price, orderCode: data.masterOrderCode, type: 1, id: data.id, serviceType: 100 },
          })
          // this.$router.push({
          //   path: '/pay',
          //   query: {
          //     id: data.id,
          //     money: data.price,
          //     orderCode: data.masterOrderCode,
          //     type: 1,
          //   },
          // }) 
        }
      },

      // 再次购买
      buyAgain(data) {
        if (data.orderType && data.orderType == 12) {
          this.$router.push({
            path: '/motorCar/detail',
            query: {
              skuId: data.skus[0].skuId,
            },
          })
        } else {
          let skuInfos = data.skus.map((res, index) => {
            // orderType 14集采订单 sourceType传5
            return `${res.skuId},${res.num},${res.storeId},${data.orderType * 1 === 14 ? 5 : res.sourceType}`
          })
          let obj = {
            ids: [],
            addressId: 0,
            skuInfos: skuInfos,
            isGroup: 0,
            groupId: 0,
            temp: 1, //  判断是否从详情页进入   1 详情  0购物车
            againBuy: 1, // 再次购买
          }
          if(data.orderType * 1 === 14){
            obj.enterpriseId = data.enterpriseId
            obj.orderType = data.orderType
          }
          let params = JSON.stringify(obj)
          this.$router.push({
            path: '/settlement',
            query: {
              params: params,
            },
          })
        }
      },

      // 去评价
      goEvaluate(item) {
        this.$router.push({ path: '/evaluate', query: { orderIds: item.orderIds.join(',') } })
      },

      orderOperation(item, type) {
        switch (type) {
          case '再次购买':
            this.buyAgain(item)
            break
          case '评价晒单':
            this.goEvaluate(item)
            break
          default:
            this.$emit('orderOperation', item, type)
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .orderwrapper {
    position: relative;
    padding: 12px;
    border-radius: 8px;
    background-color: #fff;
    margin: 0 8px;
    margin-top: 10px;
    .ordertop {
      padding-bottom: 4px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .orderstatus {
        // color: #e60113;
        font-size: 13px;
        color: #ff0a35;
        line-height: 17px;
        .ordercancel {
          color: #6e6e6e;
          display: flex;
          align-items: center;
        }
        .orderdeleteimg {
          margin-left: 8px;
          width: 15px;
          height: 15px;
        }
        .orderfinish {
          .orderfinish_dImg {
            position: absolute;
            top: 0.64rem;
            right: 0.72rem;
          }
          .orderfinishimg {
            position: absolute;
            top: 0;
            right: 2.32rem;
            width: 2.4rem;
            height: 2rem;
          }
        }
      }
    }
    .orderbox {
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #000;
      .buy-num {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
        line-height: 17px;
      }
      .goodsbox {
        display: flex;
        align-items: center;
        overflow-x: scroll;
        position: relative;
        .virtual_tag {
          width: 1.2rem;
          height: 0.64rem;
          line-height: 0.64rem;
          background: #e95762;
          border-radius: 0.2rem 0.4rem 0.4rem 0rem;
          opacity: 0.8;
          color: #ffffff;
          font-size: 0.4rem;
          text-align: center;
          position: absolute;
          top: 0;
        }
        .goodsimg {
          display: block;
          width: 74px;
          height: 74px;
          border-radius: 8px;
          margin-right: 8px;
        }
        .moreImg:last-child {
          padding-right: 3.5rem;
        }
        .goodsname {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          width: 218px;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #191919;
          line-height: 17px;
        }
      }
      .goodsprice {
        font-size: 0.68rem;
        font-weight: bold;
        // width: 5.8rem;
        text-align: right;
        span {
          font-size: 0.48rem;
          transform: scale(0.92);
        }
        .point {
          color: #e60113;
          font-size: 13px;
          width: 100%;
          text-align: right;
          font-weight: normal;
        }
      }
      .moregoods_price {
        position: absolute;
        right: 0;
        height: 3.2rem;
        background-color: #fff;
        opacity: 0.95;
        width: 4.32rem;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
        text-align: right;
        padding-right: 0.72rem;
        .goodsnum {
          font-size: 0.48rem;
          transform: unset;
          color: #666;
          font-weight: 400;
        }
      }
    }
    .logistics {
      display: flex;
      align-items: center;
      margin-top: 8px;
      padding: 8px;
      padding-right: 4rpx;
      border-radius: 8px;
      background-color: rgba(246, 246, 246, 0.5);
    }
    .logistics-box {
      flex: 1;
    }
    .logistics-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
    .logistics-status {
      padding-left: 20px;
      display: flex;
      align-items: center;
      height: 17px;
      font-size: 13px;
      color: #191919;
      line-height: 17px;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/logistics.png') left center no-repeat;
      background-size: 16px 17px;
    }
    .logistics-content {
      margin-top: 4px;
      line-height: 15px;
      font-size: 11px;
      color: #6e6e6e;
    }
    .logistics-time {
      color: #999999;
    }
    .order-collapse {
      text-align: center;
      padding: 10px 0 16px 0;
      .collapse-bt {
        display: inline-flex;
        align-items: center;
        border-radius: 15px;
        border: 0.5px solid #c3c3c3;
        padding: 4px 6px 4px 12px;
        color: #6e6e6e;
        font-size: 13px;
        line-height: 1;
        background-color: #fff;
        &::after {
          display: none;
        }
      }
    }
    .buy-price-box {
      text-align: right;
      .buy-price {
        display: inline-block;
        font-size: 0;
        line-height: 1;
        color: #191919;
        span {
          display: inline-block;
          font-size: 11px;
          font-weight: bold;
          &:first-of-type {
            vertical-align: super;
          }
        }
        .price-yuan {
          font-size: 20px;
          line-height: 24px;
        }
        .price-icon {
          margin-left: 4px;
        }
      }
      .performate-point {
        margin-right: 15px;
        display: inline-flex;
        align-items: center;
        vertical-align: sub;
        padding: 0 4px 0 0;
        overflow: hidden;
        font-size: 11px;
        color: #008864;
        background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
        border-radius: 4px;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
    .orderfooter {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      text-align: right;
      .remaining-time {
        position: absolute;
        left: 0;
        bottom: 6px;
        display: flex;
        align-items: center;
        padding: 0 6px;
        text-align: left;
        height: 20px;
        font-size: 11px;
        background-color: #ffe7eb;
        color: #ff0a35;
        border-radius: 12px;
        .van-count-down {
          color: #ff0a35;
          font-size: 11px;
          line-height: 1;
        }
        .remaining-time-icon {
          margin-right: 2px;
          width: 12px;
          height: 13px;
        }
      }
      span {
        display: inline-block;
        height: 32px;
        width: 80px;
        text-align: center;
        line-height: 32px;
        font-size: 14px;
        background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%);
        color: #fff;
        // border: 1px solid #666;
        border-radius: 19px;
        margin-left: 12px;
        box-sizing: border-box;
        &:first-of-type {
          margin-top: 16px;
          &::before {
            pointer-events: none;
            content: '';
            position: absolute;
            left: -50%;
            top: 8px;
            display: block;
            background-color: #eee;
            width: 200%;
            height: 1px;
            scale: 0.5;
          }
        }
      }
      .order_status {
        border: 0.5px solid #ff0a35;
        background: #fff;
        color: #ff0a35;
      }
      .evaluate {
        background: #fff;
        border: 0.5px solid #c3c3c3;
        color: #191919;
      }
      .order_s3 {
        background-color: #e60113;
        border-color: #e60113;
        color: #fff;
      }
      // span:last-chlid{
      //   margin-left: 0.4rem;
      // }
    }
  }
</style>
