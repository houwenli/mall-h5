<template>
  <div style="height:100%;">

    <load-more style=" margin: 50% auto;" v-if="loading" tip="正在加载"></load-more>

    <!--结算页主页-->
    <div v-if="!loading">
      <div v-if="showIndex == 0">
        <div style="padding-bottom: 59px">

          <!--遍历每个门店的结算信息-->
          <group v-for="(storeSettlement,num) in orderSettlement.storeStoreSettlements" :key="num" class="noTopBoderCells"
                 style="margin-top: .6rem">
            <cell :title="storeSettlement.storeName"></cell>
            <cell v-if="storeSettlement.orderAllSkus.length === 1" class="spuListCell">
              <ul slot="title" class="searchlist-normal clearfix cartSpuList" style="margin-top: 0">
                <li class="normal-list">
                  <div class="pro-img"><img :src="storeSettlement.orderAllSkus[0].image"></div>
                  <div class="product-info-box">
                    <div class="product-name">{{storeSettlement.orderAllSkus[0].name}}</div>
                    <div style="color: #999">x{{storeSettlement.orderAllSkus[0].num}}</div>
                    <div class="product-price-m">
                      <em>¥{{storeSettlement.orderAllSkus[0].price.toFixed(2)}}</em>
                    </div>
                  </div>
                </li>
              </ul>
            </cell>
            <cell v-if="storeSettlement.orderAllSkus.length > 1" class="spuListCell" is-link
                  @click.native="toSkuList(storeSettlement.orderAllSkus,storeSettlement.allSkuNum)">
              <ul slot="title" class="overview">
                <li v-for="(sku,index) in storeSettlement.orderAllSkus" :key="index" v-if="index < 3"><img :src="sku.image"><em>{{sku.num}}件</em>
                </li>
                <li class="more"><i></i><i></i><i></i></li>
              </ul>
              <div>共{{storeSettlement.allSkuNum}}件商品</div>
            </cell>
            <cell title="支付方式" value="在线支付"></cell>
            <popup-picker title="取货时间" :data="pickUpData" v-model="storeSettlement.pickTime"></popup-picker>
            <x-textarea :max="64" placeholder="请填写订单备注" v-model="storeSettlement.remark" :height="50"
                        @on-blur="keyboardDown"></x-textarea>
          </group>

          <group class="noTopBoderCells" style="margin-top: .6rem">
            <cell title="发票信息" is-link @click.native="showInvoice()">
              {{this.invoice.invoice=='0'?'不需要发票':this.invoice.invoice=='1'?this.invoice.invoiceTitle:this.invoice.invoiceCompanyName}}
            </cell>
          </group>

          <group class="noTopBoderCells cartPricebar" style="margin-top: .6rem">
            <cell title="商品总额">
              <span class="price">￥{{this.orderSettlement.totalPrice.toFixed(2)}}</span>
            </cell>
          </group>

        </div>
        <div class="fixBar">
          <div class="total">
            <p style="padding: 0; line-height: 50px; font-weight: normal">实付金额：<strong>¥{{this.orderSettlement.totalPrice.toFixed(2)}}</strong>
            </p>
            <a class="buy" style="font-weight: normal" @click="submitOrder">提交订单</a>
          </div>
        </div>
      </div>
    </div>


    <!--结算页的更加商品页面-->
    <settlementskus :num="showMoreSkuNum" :skus="showMoreSkus" @back="skuListBack" v-if="showIndex==1"/>

    <!--发票-->
    <settlementinvoice :settlementInvoice="invoice" @back="invoiceBack" v-if="showIndex==3"/>

  </div>
</template>

<script>
  import {XHeader, Group, Cell, PopupPicker, XSwitch, XTextarea, CellFormPreview, LoadMore} from 'vux'
  import Uploader from 'vux-uploader-component'

  import {queryStoreSettlements, submitStoreOrder} from '@/api/storesettlement';
  import settlementskus from '@/components/settlement/settlementskus'
  import settlementinvoice from '@/components/settlement/settlementinvoice'
  import { Toast } from 'vant'

  const weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  export default {
    components: {
      XHeader,
      Group,
      Cell,
      PopupPicker,
      Uploader,
      XSwitch,
      XTextarea,
      CellFormPreview,
      LoadMore,
      settlementskus,
      settlementinvoice
    },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        showMoreSkuNum: 0,// 显示更多商品的商品总数
        showMoreSkus: [],// 显示更多商品的商品数据
        showIndex: 0,// 当前显示哪个页面 0 显示结算页主页    1 显示更多商品 3 显示发票
        loading: true, // 是否正在加载中
        // 订单结算信息
        orderSettlement: {},
        // 发票信息
        invoice: {
          invoice: '0', //  发票类型 0 不需要发票 1 普通增值税发票 2 增值税发票
          invoiceTitle: "", // 发票抬头
          invoiceContent: "1", // 发票内容 1 商品明细 2 商品类别
          invoiceTaxid: '', // 发票增值税号
          titleType: "1", // 发票抬头类型1 企业 2 个人
          invoiceCompanyName: "", //公司名称
          invoiceRegisterAddress: "", // 注册地址
          invoiceRegisterMobile: "", // 注册电话
          invoiceOpenBank: "", // 开户银行
          invoiceBankAccount: "" // invoiceBankAccount
        },
        pickUpData: [], // 取货时间
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.loadPickDate();
      this.queryStoreSettlements();
    },
    methods: {
      keyboardDown() {
        window.scrollTo(0,document.documentElement.scrollTop || document.body.scrollTop)
      },
      // 查询门店购物车
      queryStoreSettlements() {
        this.loading = true;

        queryStoreSettlements(this.$route.query.ids).then(res => {
          this.loading = false;
          this.orderSettlement = res;
          // 设置每个店铺的商品信息
          this.setStoreAllSkus();
          // 设置默认取货时间
          this.setDefaultPickUpTime();
        })
      },
      // 设置默认取货时间
      setDefaultPickUpTime() {
        this.orderSettlement.storeStoreSettlements.forEach(storeSettlement => {
          storeSettlement.pickTime = ['不设置取货时间'];
        })
      },
      // 设置每个店铺的所有单品
      setStoreAllSkus() {
        this.orderSettlement.storeStoreSettlements.forEach(storeSettlement => {
          let orderAllSkus = new Array();
          // 没有促销的单品
          if (storeSettlement.storeShoppingCartResponse.normalSkus && storeSettlement.storeShoppingCartResponse.normalSkus.length > 0) {
            storeSettlement.storeShoppingCartResponse.normalSkus.forEach(normalSku => {
              orderAllSkus.push({
                'image': normalSku.image,
                'name': normalSku.name,
                'num': normalSku.num,
                'price': normalSku.price
              });
            })
          }

          storeSettlement.orderAllSkus = orderAllSkus;
          storeSettlement.allSkuNum = orderAllSkus.map(sku => sku.num).reduce((x, y) => x + y);
        })
      },
      // 加载取货时间
      loadPickDate() {
        const datas = new Array();
        for (let i = 0; i < 15; i++) {
          datas.push(this.GetDateStr(i) + '[' + weekDay[new Date(this.GetDateStr(i)).getDay()] + ']')
        }
        datas.unshift('不设置取货时间');
        this.pickUpData.push(datas)
      },
      // 获得日期
      GetDateStr(AddDayCount) {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
      },
      // 显示更多商品组件
      toSkuList(skus, num) {
        this.showMoreSkus = skus;
        this.showMoreSkuNum = num;
        this.showIndex = 1;
      },
      // 更多商品组件返回
      skuListBack() {
        this.showIndex = 0;
      },
      // 显示发票
      showInvoice() {
        this.showIndex = 3;
      },
      // 发票返回
      invoiceBack(invoice) {
        this.showIndex = 0;
        this.invoice = JSON.parse(JSON.stringify(invoice));
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
      // 提交订单
      submitOrder() {
        if (this.isProcess) {
          return;
        }
        this.isProcess = true;

        submitStoreOrder(this.getSubOrderParams()).then(res => {
          this.isProcess = false;
          let appData = JSON.parse(localStorage.getItem('appData'))
          if(appData && appData.appScheme == 'wsf') {
            this.commonPay(res.orderMoney.toFixed(2), res.orderCode, appData)
          } else {
            this.$router.push({
              path: '/zhPay',
              query: { money: res.orderMoney.toFixed(2), orderCode: res.orderCode, type: 3, serviceType: 100 },
            })
            // this.$router.push({
            //   path: '/pay',
            //   query: {money: res.orderMoney.toFixed(2), orderCode: res.orderCode, type: 3}
            // })
          }
        }).catch(() => {
          this.isProcess = false;
        })
      },
      // 获得提交订单的参数
      getSubOrderParams() {
        let params = {};
        params.invoice = this.getInvoice();
        params.storeInfos = this.getStoreInfos();
        params.ids = this.orderSettlement.ids;
        return params;
      },
      // 获得发票信息
      getInvoice() {
        let invoice = {};
        invoice.type = this.invoice.invoice;
        invoice.title = this.invoice.invoiceTitle;
        invoice.content = this.invoice.invoiceContent;
        invoice.taxId = this.invoice.invoiceTaxid;
        invoice.titleType = this.invoice.titleType;
        invoice.invoiceCompanyName = this.invoice.invoiceCompanyName;
        invoice.invoiceRegisterAddress = this.invoice.invoiceRegisterAddress;
        invoice.invoiceRegisterMobile = this.invoice.invoiceRegisterMobile;
        invoice.invoiceOpenBank = this.invoice.invoiceOpenBank;
        invoice.invoiceBankAccount = this.invoice.invoiceBankAccount;
        return invoice;
      },
      // 获得每个店铺选择的信息
      getStoreInfos() {
        let storeinfos = new Array();
        this.orderSettlement.storeStoreSettlements.forEach(storeSettlement => {
          let storeinfo = {};
          storeinfo.storeId = storeSettlement.storeId;
          storeinfo.remark = storeSettlement.remark;
          storeinfo.pickUpTime = storeSettlement.pickTime[0];
          storeinfos.push(storeinfo);
        })

        return storeinfos;
      }

    }
  }
</script>
