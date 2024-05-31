<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">订单详情</x-header> -->

    <div style="padding-bottom: 59px">

      <group class="noTopBoderCells">
        <cell title="订单编号">{{order.orderCode}}</cell>
      </group>

      <group class="noTopBoderCells" v-if="order.status == '2'">
        <cell title="取货码">{{order.writeOffCode}}</cell>
      </group>

      <group class="noTopBoderCells" style="margin-top: .6rem">
        <cell :title="order.storeName"></cell>
        <cell v-for="(orderSku,index) in order.storeOrderSkus" :key="index" class="spuListCell" style="padding: 1px 15px" is-link
              :link="{path: '/spudetail', query: {id: orderSku.skuId}}">
          <ul slot="title" class="searchlist-normal clearfix cartSpuList" style="margin-top: 0">
            <li class="normal-list">
              <div class="pro-img"><img :src="orderSku.skuImage"></div>
              <div class="product-info-box">
                <div class="product-name">{{orderSku.skuName}}</div>
                <div style="color: #999">x{{orderSku.num}}</div>
                <div class="product-price-m">
                  <em>¥{{formatPrice(orderSku.skuPrice)}}</em>
                </div>
              </div>
            </li>
          </ul>
        </cell>
        <cell title="支付方式">{{order.realPayType}}</cell>
        <cell title="订单备注">
          <span slot="inline-desc">{{order.storeOrderAttr.remark}}</span>
        </cell>
      </group>

      <group class="noTopBoderCells" style="margin-top: .6rem">
        <cell title="发票信息" is-link :link="{path: '/storeorderdetailinvoice', query: {orderId: order.id}}">
          {{invoiceType[order.storeOrderAttr.invoiceType]}}
        </cell>
      </group>

      <group class="noTopBoderCells cartPricebar" style="margin-top: .6rem">
        <cell title="商品总额">
          <span class="price">￥{{formatPrice(order.originalPrice)}}</span>
        </cell>
        <cell-form-preview :list="priceList"></cell-form-preview>
        <cell title="下单时间"><span style="color: #666">{{order.createTime}}</span></cell>
      </group>

    </div>

    <div class="fixBar" style="text-align: right; padding: 10px 15px">
      <span class="orderListBtn">
            <x-button mini plain v-if="order.status=='1'"
                      :link="{path: '/cancelstoreorder', query: {orderId: order.id}}">取消订单</x-button>
            <x-button v-if="order.status == '1'" mini plain type="primary"
                      @click.native="toPay(order.orderCode,order.price)">支付</x-button>
            <x-button v-if="order.status == '3' && order.evaluationStatus == '0'" mini plain type="primary"
                      :link="{path: '/storeorderevaluate', query: {storeId: order.storeId,orderCode:order.orderCode}}">评价晒单</x-button>
            <x-button mini plain v-if="order.status=='3' && order.evaluationStatus != '0'"
                      :link="{path: '/storeorderevaluatedetail', query: {storeId: order.storeId,orderCode:order.orderCode}}">查看评价</x-button>
          </span>
    </div>

  </div>
</template>

<script>
  import {XHeader, Group, Cell, CellFormPreview, XButton} from 'vux'

  import {formatPrice} from '@/utils/utils';

  import {queryStoreOrderById} from '@/api/storeorderlist';
  import { Toast } from 'vant'

  export default {
    components: {
      XHeader, Group, Cell, CellFormPreview, XButton
    },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        order: {storeOrderAttr: {}}, // 订单详情信息
        formatPrice: formatPrice, // 格式化金额
        priceList: [], // 价格列表
        invoiceType: {'0': '不开发票', '1': '增值税普票', '2': '增值税专票'}, // 发票类型
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.queryStoreOrderById(this.$route.query.orderId)
    },
    methods: {
      // 查询门店订单详情
      queryStoreOrderById(orderId) {
        let that = this;
        queryStoreOrderById(orderId).then(res => {
          if (res.flag && res.data) {
            that.order = res.data;
            that.priceList = [];
            let redEnvelopePrice = {};
            redEnvelopePrice.label = '优惠';
            redEnvelopePrice.value = '-￥' + (res.data.redEnvelopePrice ? res.data.redEnvelopePrice.toFixed(2) : '0.00');
            that.priceList.push(redEnvelopePrice);
            let price = {};
            price.label = '实付金额';
            price.value = '￥' + res.data.price.toFixed(2);
            that.priceList.push(price);
          }
        })
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
      // 跳转到支付页面
      toPay(orderCode, money) {                
        let appData = JSON.parse(localStorage.getItem('appData'))
        if(appData && appData.appScheme == 'wsf') {
          this.commonPay(money, orderCode, appData)          
        } else {
          // this.$router.push({path: '/pay', query: {orderCode: orderCode, money: money, type: 3}}) 
          this.$router.push({
            path: '/zhPay',
            query: { money: money, orderCode: orderCode, type: 3, serviceType: 100 },
          })  
        }
      },
    }
  }
</script>
