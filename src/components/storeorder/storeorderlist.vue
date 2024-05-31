<template>
  <div style="height:100%;">

    <scroller
      :on-infinite="infinite"
      ref="scroller"
      :class="{scrollerNoData : pageList.length === 0}"
    >

      <x-header @on-click-back="backCustomerCenter()" :left-options="{backText: '',preventGoBack:true}">
        {{titleMap[listQuery.status]}}
      </x-header>

      <group v-for="(order,index) in pageList" :key="index" class="orderItem noTopBoderCells">
        <cell>
          <span slot="title">订单号：{{ order.orderCode }}</span>
          <span>{{orderStatus[order.status]}}</span>
        </cell>
        <ul class="searchlist-normal clearfix recordlist" style="margin-top: 0" @click="toStoreOrderDetail(order.id)">
          <li v-for="(orderSku,num) in order.storeOrderSkus" :key="num" class="normal-list">
            <div class="pro-img"><img :src="orderSku.skuImage"></div>
            <div class="product-info-box">
              <div class="product-name">{{orderSku.skuName}}</div>
              <div class="product-price-m">
                <em>¥{{formatPrice(orderSku.skuPrice)}}</em>
                <span style="float: right">x{{orderSku.num}}</span>
              </div>
            </div>
          </li>
        </ul>
        <cell style="margin-top: 10px">合计 ¥{{formatPrice(order.price)}}</cell>
        <cell>
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
        </cell>
      </group>

    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, XButton, Divider, Group, Cell} from 'vux'

  import {formatPrice} from '@/utils/utils';

  import {queryStoreOrderList} from '@/api/storeorderlist';
  import { Toast } from 'vant'

  export default {
    components: {
      XHeader, XButton, Divider, Group, Cell
    },
    data() {
      return {
        formatPrice: formatPrice, // 格式化金额
        isProcess: false, // 接口是否处理中
        listQuery: {
          status: this.$route.query.status, // 查询状态 -1 全部 1 待付款 2 待取货 6 待评价
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
        _done: null, //分页控件
        titleMap: {'-1': '全部订单', '1': '待付款订单', '2': '待取货订单', '6': '待评价订单'}, // 页面标题
        orderStatus: {'1': '待付款', '2': '待取货', '3': '已完成', '4': '交易关闭'}, // 订单状态
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      //下拉触发
      infinite(done) {
        this._done = done;
        //没有更多数据
        if (this.noMore) {
          //关闭无限加载
          this.$refs.scroller.finishInfinite(true);
          return;
        }
        //正在查询中  不请求
        if (this.loading) {
          done();
          return;
        }
        //设置正在查询中
        this.loading = true;
        //查询
        this.getData();
        done();
      },
      //获取数据
      getData() {
        queryStoreOrderList(this.listQuery).then(response => {
          let list = response.data;
          this.listQuery.pageNum++;
          if (list.length > 0) {
            this.pageList = this.pageList.concat(list);
          }
          this.loading = false;
          if (list.length < 10) {
            this.noMore = true;
          }
        });
      },
      // 跳转到门店订单详情页
      toStoreOrderDetail(orderId) {
        this.$router.push({path: '/storeorderdetail', query: {orderId: orderId}})
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
          this.$router.push({
            path: '/zhPay',
            query: { money: money, orderCode: orderCode, type: 3, serviceType: 100 },
          })  
          // this.$router.push({path: '/pay', query: {orderCode: orderCode, money: money, type: 3}})       
        }
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({path: '/home'})
      }
    }
  }
</script>
