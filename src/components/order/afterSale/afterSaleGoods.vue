<template>
  <div class="boxwrapper" v-if="ComentListData">
    <div class="commentbox" v-for="(tes, i) in ComentListData" :key="i">

      <p class="storename serverBox" v-show="activedata != 1">
        <label class="serverCode">服务单号：{{ tes.backCode }}</label>
        <span class="serverStatus returnIcon" v-if="tes.type == '2'">退货</span>
        <span class="serverStatus exchangeIcon" v-else-if="tes.type == '3'">换货</span>
      </p>
      <!-- 申请售后列表 -->
      <div v-if="activedata == 1">
        <div class="sku-item" v-for="(temp, index) in moreList(tes)" :key="index">
          <div class="goodsbox">
            <img :src="temp.skuImage" alt="" class="goodsimg" @click="togoodsdetail(temp, tes)" />
            <div class="goodsInfoBox">
              <div class="goodsnamebox" @click="togoodsdetail(temp, tes)">
                <p class="good-title">{{ temp.skuName }}</p>
                <p class="good-support">{{ temp.skuSupport }}</p>
              </div>
              <p class="goodsNumBox">x{{ temp.num }}</p>
            </div>
          </div>
          <!-- 操作 -->
          <div class="goodsFooter" v-if="activedata == 1">
            <div class="goodsbox" v-if="tes.status == 4">
              <label class="colorfont" v-if="tes.status == 4" :key="i">
                <span
                  class="colorfont iconimg"
                  v-if="temp.num > temp.afterSaleNum && temp.afterSaleStatus == 1 && tes.overDueStatus == 0"
                  @click="toTabs(temp)"
                >
                  有{{ temp.afterSaleNum }}个商品已申请售后
                </span>
                <span
                  class="colorfont iconimg"
                  v-if="temp.num == temp.afterSaleNum && temp.afterSaleStatus == 1 && tes.overDueStatus == 0"
                  @click="toTabs(temp)"
                >
                  该商品已申请售后
                </span>
                <span class="tipBox colorfont" v-if="tes.overDueStatus == 1">该商品已超过售后期</span>
              </label>
              <span
                class="border_half apply"
                v-if="tes.status == 4 && tes.overDueStatus == 1 && tes.orderType != 12"
                @click="operationOrder(tes, 2, index)"
                :class="{ overTimeApply: tes.overDueStatus == 1 }"
              >
                申请售后
              </span>
              <span class="border_half apply" v-else-if="tes.status == 4 && temp.num != temp.afterSaleNum && tes.orderType != 12" @click="operationOrder(tes, 2, index)">申请售后</span>
            </div>
          </div>
        </div>
        <div class="more-bt" v-if="tes.more && tes.skuList.length > 3"><span @click="tes.more = !tes.more">显示更多{{ tes.skuList.length - 3 }}个商品<img :src="$oss + '/order/shouhou_liebiao_gengduo_xiangxia_jiantou.png'" :class="{ 'more-icon': !tes.more}" alt=""></span></div>

      </div>
      <!-- 处理中、申请记录列表 -->
      <div class="goodsbox" v-else>
        <img :src="tes.returnSku && tes.returnSku.skuImage" alt="" class="goodsimg" @click="togoodsdetail(tes.returnSku, tes)" />
        <div class="goodsInfoBox">
          <div class="goodsnamebox" @click="togoodsdetail(tes.returnSku, tes)">
            <p class="good-title">{{ tes.returnSku && tes.returnSku.skuName }}</p>
          </div>
          <p class="goodsNumBox">x{{ tes.returnSku && tes.returnSku.num }}</p>
        </div>
      </div>

      <div class="goodsExamine" v-if="activedata == 2 || activedata == 3" @click="toServerDeatail(tes)">
        <label class="examineTitle">{{ backOrderStatusMap[tes.status] }}</label>
        <p class="serverTips">{{ serverTips(tes) }}</p>
      </div>
      <!-- 操作 -->
      <div class="goodsFooter" v-if="activedata == 1">
        <div v-if="tes.status == 3" class="goodsbox">
          <span class="colorfont tipBox">该订单需确认收到商品后才可申请售后</span>
          <span class="border_half get_goods" @click="operationOrder(tes, 1)">确认收货</span>
        </div>
      </div>
      <div class="goodsOpration" v-else>
        <span class="border_half cancleApply" v-if="tes.status == 4 || tes.status == 6 || tes.status == 7 || tes.status == 13 || tes.status == 15" @click="operationOrder(tes, 3)">取消申请</span>
        <span class="border_half InvoiceSpan" @click="toInvoice(tes)" v-if="tes.status == 6 || tes.status == 15">填写发货单</span>
        <span class="border_half" @click="toInvoice(tes)" v-if="(tes.status == 7 || tes.status == 16)&&tes.backOrderType != 4">更改发货单</span>
        <!-- <span class="border_half InvoiceSpan" @click="toTabsResolved(tes)" v-if="(tes.status == 10 || tes.status == 8) && activedata != '3'">已解决</span> -->
        <span class="border_half editApply" v-if="tes.status == 4 || tes.status == 13" @click="updateApply(tes)">修改申请</span>
        <!-- 换货新增按钮 -->
        <span class="border_half" @click="operationOrder(tes, 4)" v-if="tes.status == 20 || tes.status == 21">查看物流</span>
        <span class="border_half get_goods" @click="operationOrder(tes, 5)" v-if="tes.status == 20 || tes.status == 21">确认收货</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ComentListData: {
      type: Array,
    },
    activedata: {
      type: String,
    },
  },
  components: {},
  data() {
    return {
      dialogshow: false, // 二次确认弹窗
      backOrderStatusMap: {
        1: '待审核',
        2: '已完成',
        3: '服务单关闭',
        4: '待审核',
        5: '服务单关闭',
        6: '请您发货',
        7: '待供应商收货',
        8: '完成',
        9: '服务单关闭',
        10: '完成',
        11: '服务单取消',
        12: '完成',
        13: '待审核',
        14: '服务单关闭',
        15: '请您发货',
        16: '待供应商收货',
        17: '服务单关闭',
        18: '待供应商换货',
        19: '退款完成',
        20: '待您确认收货',
        21: '待供应商换货',
        22: '完成',
      }
    }
  },
  methods: {
    // 修改申请
    updateApply(data) {
      console.log('修改申请', data)
      this.$router.push({
        path: '/applyAfterSale',
        query: {
          id: data.id,
          // overDueStatus: param.goodsInfo.overDueStatus,
          // skuInfo: JSON.stringify(data.returnSku),
        },
      })
    },
    // 操作
    operationOrder(data, textval, index) {
      console.log('申请', data)
      let param = {
        goodsInfo: data,
        orderid: data.orderId,
        dialogshow: true,
        isType: textval,
        index: index,
        id: data.id,
        receivingTime: data.receivingTime
      }
      this.$emit('operationOrder', param)
    },

    // 跳转申请记录
    toTabs(data) {
      console.log(data)
      this.$emit('toTabs', data)
    },
    toTabsResolved(data) {
      this.$emit('toTabsResolved', data)
    },
    // 去服务单详情
    toServerDeatail(data) {
      console.log('服务单详情', data)
      //退货详情
      if(data.type == '2') {
        this.$router.push({
          path: '/serverDetails',
          query: {
            id: data.id,
          },
        })
      } else if(data.type == '3') {
         //换货详情
        this.$router.push({
          path: '/exchangeServerDetails',
          query: {
            id: data.id,
          },
        })
      }

    },
    // 跳转填写发货单
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
    // 跳转商品详情
    togoodsdetail(item, order) {
      let { storeId, sourceType } = item
      // 如果是实体店订单，则修改storeId和sourceType
      if(order.orderType == 9) {
        storeId = order.buyStoreId
        sourceType = 2
      }
      // 如果是集采订单，跳转集采详情页面
      if(order.orderType == 14){
        this.$router.push({ path: '/collectionSpudetail', query: { id: item.skuId, storeId, enterpriseId: order.enterpriseId } })
        return
      }
      this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId, sourceType: sourceType || 1 } })
    },
    // 跳转店铺
    tostore(id) {
      this.$router.push('/storeindex?storeId=' + id)
    },

    moreList(data) {
      if(data.skuList.length > 3 && data.more) {
        return data.skuList.slice(0, 3)
      }
      return data.skuList
    },

    // 退货
    returnServerTips(data) {
      let status = +data.status,
        logList = data.logList,
        tipsMap = {
          4: logList[0].status == 12 ? '您的服务单修改成功，待商家审核中' : '您的服务单已申请成功，待商家审核中',
          6: '请您尽快发货并填写运单号',
          7: '您的退货商品已寄出，请耐心等待商家确认收货',
          8: '服务单已完成，感谢您对万顺的支持',
          5: '商家不同意服务单申请，服务单已关闭',
          9: logList[0].status == 13 ? '您未在规定的时间内寄出，服务单已关闭' : logList[0].status == 40 ? '商家无需您退货，且不同意退款，服务单已关闭' : '商家不同意服务单申请，服务单已关闭',
          11: '服务单已取消，如有需要可在售后申请页重新提交服务单'
        }
        return tipsMap[status]
    },

    // 换货
    exchangeServerTips(data) {
      let status = +data.status,
        logList = data.logList,
        tipsMap = {
          13: logList[0].status == 12 ? '您的服务单修改成功，待商家审核中' : '您的服务单已申请成功，待商家审核中',
          15: '请您尽快发货并填写运单号',
          16: '您的换货商品已寄出，请耐心等待商家确认收货',
          18: logList[0].status == 34 ? '请耐心等待商家邮寄新换货商品' : '您的换货商品商家已收到，请耐心等待商家邮寄新换货商品',
          11: '服务单已取消，如有需要可在售后申请页重新提交服务单',
          20: '新换货商品商家已发出，请注意查收',
          21: '您的反馈已经提交给商家，商家将核实物流信息后，重新发货',
          22: '服务单已完成，感谢您对万顺的支持',
          14: '商家不同意服务单申请，服务单已关闭',
          17: logList[0].status == 13 ? '您未在规定的时间内寄出，服务单已关闭' : '商家不同意服务单申请，服务单已关闭',
          19: '商家未及时寄件，系统为您退款',
        }
        return tipsMap[status]
    },

    // 服务提示语
    serverTips(data) {
      if(data.type == 2) {
        return this.returnServerTips(data)
      }else if(data.type == 3) {
        return this.exchangeServerTips(data)
      }
    }
  },
}
</script>

<style lang="less" scoped>
.boxwrapper {
  color: #000;
  padding: 0 10px;
  .commentbox {
    background-color: #fff;
    border-radius: 12px;
    margin-top: 10px;
    padding: 10px;
    .sku-item {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .storename {
      font-weight: bold;
      font-size: 0.6rem;
      display: flex;
      align-items: center;
      .storeimg {
        width: 0.64rem;
        height: 0.64rem;
      }
      .storeRightimg {
        width: 0.16rem;
        height: 0.4rem;
        margin-top: 0.08rem;
      }
      .name {
        display: inline-block;
        max-width: 8.4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 0.36rem 0 0.12rem;
      }
    }
    .serverBox {
      font-weight: normal;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .serverCode {
        color: #999;
      }
      .serverStatus {
        font-size: 13px;
        color: #FF0A35;
      }
    }
    .goodsbox {
      display: flex;
      align-items: center;
      width: 100%;
      overflow: hidden;
      .goodsimg {
        width: 74px;
        height: 74px;
        border-radius: 8px;
      }
      .goodsInfoBox {
        flex: 1;
        margin-left: 8px;
        display: flex;
        align-items: center;
        overflow: hidden;
        .goodsnamebox {
          flex: 1;
          overflow: hidden;
          .good-title {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-size: 13px;
            color: #191919;
            font-weight: bold;
          }
          .good-support {
            color: #E3903F;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 11px;
          }
        }
        .goodsNumBox {
          font-size: 13px;
          color: #999;
          margin-left: 4px;
        }
      }
    }
    .goodsExamine {
      padding: 10px 8px;
      padding-right: 4px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 13px;
      margin-top: 10px;
      margin-bottom: 10px;
      background-color: rgba(246, 246, 246, 0.5);
      line-height: 17px;
      .examineTitle {
        color: #191919;
        width: 78px;
        margin-right: 8px;
        display: inline-block;
        font-weight: 400;
      }
      .serverTips {
        color: #6E6E6E;
        padding-right: 24px;
        flex: 1;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png') no-repeat right top;
        background-size: 16px 16px;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        line-height: 15px;
        font-size: 11px;
        text-align: left;
      }
    }
    .goodsFooter {
      text-align: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goodsbox {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        span {
          font-size: 14px;
          width: 80px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          color: #e60113;
          display: inline-block;
          border-radius: 16px;
          position: relative;
          &::after {
            border-color: #C3C3C3;
          }
        }
        .colorfont {
          width: auto;
          font-size: 11px;
          color: #999;
        }
        .tipBox {
          width: auto;
          padding-left: 18px;
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/tip_icon.png') no-repeat left center;
          background-size: 14px;
        }
        .iconimg {
          display: inline-block;
          background: url('../../../assets/img/logistics-new.png') no-repeat right center;
          background-size: 16px;

          padding-right: 16px;
        }
        .border_half {
          border-color: #C3C3C3;
          color: #191919;
          font-size: 14px;

          &.get_goods {
            border-color: transparent;
            background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
            color: #FFFFFF;
            &::after {
              border-color: transparent;
            }
          }
        }

        .overTimeApply {
          color: #999;
          background: #eee;
        }
        .overTimeApply::after {
          border-color: transparent;
        }
      }
    }
    .goodsOpration {
      text-align: right;
      span {
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        display: inline-block;
        text-align: center;
        margin-right: 10px;
        color: #191919;
        &::after {
          border-color: #C3C3C3;
        }
      }
      span:last-child {
        margin-right: 0 !important;
      }
      .InvoiceSpan {
        color: #FF0A35;
      }
      .InvoiceSpan::after {
        border-color: #FF0A35;
      }
      .get_goods {
        border-color: transparent;
        background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
        color: #FFFFFF;
        border-radius: 19px;
        &::after {
          border-color: transparent;
        }
      }
    }
    .commentcontent {
      margin-top: 0.48rem;
      font-size: 0.52rem;
    }
  }
  .more-bt {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    text-align: center;
    color: #6E6E6E;
    span {
      position: relative;
      padding: 4px 10px;
      display: flex;
      align-self: center;
      justify-content: center;
      box-sizing: content-box;
      font-size: 13px;
      line-height: 17px;


      &::after {
        position: absolute;
        top: -50%;
        left: -50%;
        content: '';
        border-radius: 30px;
        width: 200%;
        height: 200%;
        border: 1px solid #C3C3C3;
        box-sizing: border-box;
        transform: scale(0.5);
      }
    }
    img {
      margin-left: 6px;
      width: 16px;
      height: 17px;
      vertical-align: middle;
    }
    .more-icon {
      transform: rotate(180deg);
    }
  }
}
</style>
