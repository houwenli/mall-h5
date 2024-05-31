<template>
  <div data-desc='确认订单' class="settle-page" style="height: 100%">
    <!-- 导航栏 -->
    <navbartop :title="'确认订单'" @clickBack="backLastPage"></navbartop>
    <div class="sroll-wrapper">
      <!--收货地址-->
      <settlementaddress :orderSettlement="orderSettlement" @toAddress="toAddress"></settlementaddress>
      <!-- 店铺商品信息 -->
      <div v-if="orderSettlement">
        <settlementgoods ref="settlementGoods" @changeCopun='changeCopun' :orderSettlement="orderSettlement" :isOldPriceBuy="isOldPriceBuy" @changGoodsNum="changGoodsNum"></settlementgoods>
        <div class="bless-wrpper">
          <div class="">
            <van-cell title="商品金额" :value="totolGoodPrice"/>
            <van-cell title="运费" :value="orderTotalFright"/>
            <van-cell class="red" v-if="orderSettlement.orderDiscountPrice>0" title="活动" :value="orderDiscountPrice"/>
            <van-cell class="red" v-if="orderSettlement.sumUserCouponDiscount>0" title="优惠券" :value="sumUserCouponDiscount"/>

            <integral-popup
              ref="integralPopup"
              :businessType="businessTypeEnum.mall"
              :useIntegral.sync="useIntegral"
              :integralMoney.sync="integralMoney"
              :integralCfgId.sync="integralCfgId"
              :orderLastTotalPrice="orderLastTotalPrice"
              :sumUserCouponDiscount="orderSettlement.sumUserCouponDiscount"
              @saveIntegral="calcPrice">
            </integral-popup>

            <van-cell class="red"  title="福气值" :value="fqzDiscount" v-if="!isOldPriceBuy && orderSettlement.orderTotalIntegralPoint > 0" />
            <van-cell class="red"  title="福气值" value="无可用" v-if="isOldPriceBuy && orderSettlement.orderTotalIntegralPoint > 0" />
          </div>

          <p class="totalpricebox">
            <strong>合计
            <span>¥
              <span class="font-din" v-if="!isOldPriceBuy && orderSettlement.orderTotalIntegralPoint > 0">{{ orderSettlement.orderTotalDeductionAfterPrice }}</span>
              <span class="font-din" v-else>{{ orderSettlement.orderLastTotalPrice }}</span>
            </span></strong>
          </p>
        </div>
      </div>
    </div>

    <!-- 底部结算 -->
    <div class="bottomBtn">
      <div class="total">
        <div class="total-wrapper">
          <div class="total_p">
            <span class="goodsNum">共{{ goodsTotalNum }}件,</span>

            <span>合计</span>
            <span>¥
              <span class="font-din" v-if="!isOldPriceBuy && orderSettlement.orderTotalIntegralPoint > 0">{{ orderSettlement.orderTotalDeductionAfterPrice }}</span>
              <span class="font-din" v-else>{{ orderSettlement.orderLastTotalPrice }}</span>
            </span>
            <div class="copunDisMoney" v-if="allDiscountPrice>0">共减¥{{ allDiscountPrice }}</div>
          </div>
        </div>
        <a class="buy" @click="submitOrder">提交订单</a>
      </div>
    </div>
    <!-- 赠品库存不足弹窗 -->
    <van-popup v-model="isStockShow" style="width: 84%" class="stockPopupBox">
      <div>
        <h2>很遗憾，您本单购买的以下赠品已赠完 是否继续提交订单</h2>
        <div class="giveGoodsBox">
          <div class="givegoods" v-for="temp in noStockData" :key="temp.id">
            <img :src="temp.url" />
            <div class="goodsTitle">
              <p class="doubleoverline">
                {{ temp.name }}
              </p>
            </div>
          </div>
        </div>
        <div class="buyBox">
          <span class="No commonspan border_half" @click="No">否</span>
          <span class="Yes commonspan border_half" @click="Yes">是</span>
        </div>
      </div>
    </van-popup>

    <SecondConfirm title="您购买的商品已超出限购范围！" cancleText="我知道了" :dialogshow="showLimit" @closeBack="showLimit = false" :hideConfirmBtn="true">
      <template slot="textp">
        <!-- 秒杀商品限制 -->
        <div class="limit-skus-list">
          <div v-for="(item,index) in limitSkuList" :key="index" class="limit-item">
            <div class="limit-skus">
              <div class="limit-sku-image">
                <img style="width: 2.1rem; height: 1.68rem" :src="item.image + '?imageView2/1/w/105/h/84'" alt="" />
              </div>
              <div class="limit-sku-info">
                <div class="limit-sku-name text-clamp2">{{ item.name }}</div>
                <div class="limit-sku-num">限购{{ item.limitNumFromMarketing }}件</div>
              </div>
            </div>
          </div>
          <!-- 首单商品限制 -->
          <div v-for="(item,index) in limitFirstList" :key="index" class="limit-item">
            <div style="margin-bottom: 20px; padding-left: 1.12rem; color: #e60113; font-size: 12px" v-if="item.limitKind">限购{{ item.limitKind }}款</div>
            <div v-for="(sItem, idx) in item.specialAreaLimitList" :key="idx">
              <div class="limit-skus">
                <div class="limit-sku-image">
                  <img style="width: 2.1rem; height: 1.68rem" :src="sItem.image + '?imageView2/1/w/105/h/84'" alt="" />
                </div>
                <div class="limit-sku-info">
                  <div class="limit-sku-name text-clamp2">{{ sItem.name }}</div>
                  <div class="limit-sku-num">限购{{ sItem.marketingVos[0].specialArea.limitNum }}件</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </SecondConfirm>
  </div>
</template>

<script>
import SecondConfirm from '@/components/commons/SecondConfirm'
import { Toast, Popup } from 'vant'
import { querySettlements, submitOrder, getFqzPriceConfig } from '@/api/settlement'
import { visit } from '@/api/visit'
import settlementaddress from '@/components/settlement/settlementaddress' // 地址
import settlementgoods from '@/components/settlement/settlementgoods' // 商品
import navbartop from '@/components/commons/navBartop' // 导航栏
import integralPopup from '@/components/integralPopup' // 积分弹窗
import { getUsersource, appBack } from '@/utils/utils'
import { BUSINESS_TYPE } from '@/constants/order'
// 第一次的初始值（在第一次进入结算页的时候赋值）
let firstValue = {}

export default {
  components: {
    navbartop,
    settlementaddress,
    settlementgoods,
    [Toast.name]: Toast,
    [Popup.name]: Popup,
    SecondConfirm,
    integralPopup
  },
  inject: ['reload'],
  computed:{
    // 总商品金额
    totolGoodPrice() {
      return `¥${(this.orderSettlement.orderTotalPrice*1 || 0).toFixed(2)}`
    },
    // 总运费
    orderTotalFright() {
      return `¥${(this.orderSettlement.orderTotalFright*1 || 0).toFixed(2)}`
    },
    // 活动总优惠
    orderDiscountPrice() {
      return `-¥${(this.orderSettlement.orderDiscountPrice*1 || 0).toFixed(2)}`
    },
    // 优惠券总优惠
    sumUserCouponDiscount() {
      return `-¥${(this.orderSettlement.sumUserCouponDiscount*1 || 0).toFixed(2)}`
    },
    // 总共减去
    allDiscountPrice() {
      return ((Number(this.orderSettlement.sumUserCouponDiscount) || 0) + ((Number(this.orderSettlement.orderDiscountPrice)) || 0) + this.integralMoney).toFixed(2)
    },
    // 福气值抵扣
    fqzDiscount() {
      return `-${this.orderSettlement.orderTotalIntegralPoint}`
    }
  },
  data() {
    return {
      isProcess: false, // 接口是否处理中
      payType: ['0'], // 支付方式
      params: {
        ids: '', // 购物车id
        addressId: 0, // 收获地址id
        skuInfos: '', // 单品信息 立即购买的时候使用
        buyNowRequestList: [],
        isGroup: 0, // 是否是拼团
        groupId: 0, // 团购id
      }, // 请求参数
      orderSettlement: {}, // 订单结算信息
      redEnvelopeCode: null, // 选中的红包
      canUseRedEnvelope: [], // 可以使用的红包
      // 发票信息
      invoice: {
        invoice: '0', //  发票类型 0 不需要发票 1 普通增值税发票 2 增值税发票
        invoiceTitle: '', // 发票抬头
        invoiceContent: '1', // 发票内容 1 商品明细 2 商品类别spuId
        invoiceTaxid: '', // 发票增值税号
        titleType: '1', // 发票抬头类型1 企业 2 个人
        invoiceCompanyName: '', //公司名称
        invoiceRegisterAddress: '', // 注册地址
        invoiceRegisterMobile: '', // 注册电话
        invoiceOpenBank: '', // 开户银行
        invoiceBankAccount: '', // invoiceBankAccount
      },
      invoiceList: [], // 发票信息
      goodsTotalNum: '', // 商品总件数
      isStockShow: false, // 库存弹窗
      noStockGiftIds: [], // 赠品库存ids
      orderSkuFullGiftMap: {}, // 提交赠品信息
      noStockData: [], //  赠品库存不足
      outTimer: '', // 定时器ID
      spuId: '',
      limitSkuList: [], // 秒杀超限商品集合
      limitFirstList: [], // 活动超限商品集合
      hasMarketingSku: null, // 是否拥有秒杀商品
      showLimit: false, // 展示弹窗
      showSetBlessing: false,
      useBless: '0',
      blessMoney: 0,
      reduceMoney: 0,
      ratio: 0,
      fqzCfgId: '',
      autofocus: false,
      timeout:null,

      useIntegral: 0,
      businessTypeEnum: Object.freeze(BUSINESS_TYPE),
      integralMoney: 0,
      orderLastTotalPrice: 0,
      integralCfgId: null,
			isSubmitOne: false,//  福气值订单是否提交过一次
			isOldPriceBuy: 0 // 是否是原价购买
    }
  },
  mounted() {
    this.$store.dispatch('user/getUserInfo')

    document.getElementsByTagName('body')[0].className = 'gray-bg'
    // 获取参数
    this.params = JSON.parse(this.$route.query.params)
    if (this.params.skuInfos && this.params.skuInfos.length) {
      let list = this.params.skuInfos,
        buyNowRequestList = []
      list.forEach((n) => {
        let _tempArr = n.split(',')
        let _tempObj = {
          skuId: _tempArr[0],
          num: _tempArr[1],
          storeId: _tempArr[2],
          sourceType: _tempArr[3]
        }
        buyNowRequestList.push(_tempObj)
      })
      this.params.buyNowRequestList = buyNowRequestList
    }
    let addressId = localStorage.getItem('addressId')
    if (addressId) {
      this.params.addressId = addressId
    }
    this.querySettlements(true)
  },
  methods: {
    //计算订单总绩效
    performanceScoreOrderTotal(list) {
      if (!list || list.length < 1) {
        return 0
      } else {
        let score = 0
        list.forEach((item) => {
          item.shoppingCartResponse.normalSkus.forEach((n) => {
            if (n.performanceScore && n.performanceScore > 0) {
              score = n.performanceScore * n.num + score
            }
          })
        })
        return score
      }
    },
    // 不买
    No() {
      this.isStockShow = false
      this.noStockGiftIds = []
    },
    // 继续购买买
    Yes() {
      let ids = this.noStockData.map((res) => {
        return res.id
      })
      this.noStockGiftIds = ids
      this.submitOrder()
    },
    // 提交订单
    submitOrder() {
      let that = this
      // 判断是否有收货地址
      if (!that.orderSettlement.customerAddress) {
        Toast('请选择收货地址!')
        return false
      }
      if (this.limitSkuList && this.limitSkuList.length > 0) {
        this.showLimit = true
        return
      }
      that.confirmOrder()
    },
    // 确定订单
    confirmOrder() {
      // 节流
      if (this.isProcess) {
        return
      }
      this.isProcess = true
      // 提交订单
      submitOrder(this.getSubmitOrderParams())
        .then((res) => {
          localStorage.removeItem('addressId')
          this.isProcess = false
          if (res.code == 4105) {
            Toast('商品信息发生改变，为您刷新页面！')
            this.querySettlements()
            return
          }
          if (res.code == 4109) {
            Toast(res.msg)
            // 禁止分销
            this.params.buyNowRequestList[0].recommendToken = null
            this.querySettlements()
            return
          }
          if(res.code == 4107 || res.code == 4108){
            Toast(res.msg)
            setTimeout(() => {
              // 智慧生活app再来一单无库存时返回智慧生活订单列表
              if(getUsersource() == 11) {
                if (this.$store.getters.phoneType == 'IOS') {
                  window.webkit.messageHandlers.finishActivity.postMessage('')
                } else {
                  window.ws.finishActivity()
                }
              } else {
                this.$router.back(-1)
              }
            }, 2000)
            return
          }
					// 福气值不足时
					if(res.code == 80001) {
						this.isOldPriceBuy = 1
						Toast('福气值不足，按原价购买')
						this.querySettlements()
            return
          }
          if(res.code == -1) {
            Toast(res.msg)
            this.reload()
            return
          }

          // needPay  -1：赠品库存不足无法支付   0：需要支付 跳转到支付页面  13: 秒杀超出限制
          if (res.needPay == -13) {
            if (res.skuLimitVo.panicBuyLimitList && res.skuLimitVo.specialAreaLimitList) {
              this.showLimit = true
              this.limitSkuList = res.skuLimitVo.panicBuyLimitList
              this.limitFirstList = res.skuLimitVo.specialAreaLimitList
              return
            }
            if (res.skuLimitVo.panicBuyLimitList && res.skuLimitVo.panicBuyLimitList.length) {
              this.showLimit = true
              this.limitSkuList = res.skuLimitVo.panicBuyLimitList
              this.limitFirstList = []
              return
            }
            if (res.skuLimitVo.specialAreaLimitList && res.skuLimitVo.specialAreaLimitList.length) {
              this.showLimit = true
              this.limitFirstList = res.skuLimitVo.specialAreaLimitList
              this.limitSkuList = []
              return
            }
          } else if (res.needPay == -1) {
            this.noStockData = res.noStockGifts
            this.isStockShow = true
          } else if (res.needPay == 0) {
            this.$storage.removeItem(this.spuId) // 清除分销码信息
            this.setLocalAddr()

            const money = res.orderFqzMoney
            let appData = JSON.parse(localStorage.getItem('appData'))
            if(appData && appData.appScheme == 'wsf') {
              this.commonPay(money.toFixed(2),  res.orderCode, appData)
              this.$refs.integralPopup.getConfig()
            } else {
              this.$router.replace({
                path: '/zhPay',
                query: { money: money.toFixed(2), orderCode: res.orderCode, type: 1, id: res.orderId, serviceType: 100, orderType: this.params.orderType },
              })
            }
            this.isStockShow = false
          } else {
              // 不需要支付 跳转到支付成功页面
              /* this.$router.push({
                path: '/nopaysuccess',
                query: { money: res.orderMoney.toFixed(2) },
              }) */
              this.setLocalAddr()
              // 跳转到支付成功页面
              this.$router.replace({
                path: '/paysuccess',
                query: {
                  agentType: 'HTML',
                  payResult: JSON.stringify({
                    paidMoney: ~~(res.orderFqzMoney * 100).toPrecision(12),
                    payStatus: 'PAID',
                    orderCode: res.orderCode,
                    id: res.orderId,
                    businessType: 100,
                    orderType: this.params.orderType,
                    unit: 'yuan'
                  }) },
              })
            }
        })
        .catch(() => {
          this.isProcess = false
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
          console.log(res,'webkit=======================');
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
     // 设置本地提交订单地理位置信息
    setLocalAddr() {
      try {
        let {address, detailAddress, id } = this.orderSettlement.customerAddress
        let tempAddre = JSON.parse(localStorage.getItem('positionAddress')) || {}
        localStorage.setItem('positionAddress', JSON.stringify({
          ...tempAddre,
          selectAddress: address + detailAddress,
          id,
          cityName: address.split(',')[1],
        }))
      } catch (error) {
        console.log(error);
      }
    },
    // 商品数量改变
    changGoodsNum(param){
        if (this.timeout !== null) clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            if(!param.num) return
      let goodsNum = param.num // 商品数量
      this.params.buyNowRequestList[0].num = goodsNum
      this.clearBless()
      this.querySettlements()
        }, 1000);
    },
    // 返回
    clearBless() {
      this.useBless = ''
      this.blessMoney = 0
      this.reduceMoney = 0
    },
    changeCopun(){
      this.clearBless()
    },
    backLastPage() {
      clearTimeout(this.outTimer)
      localStorage.removeItem('addressId')
      appBack(this)

    },
    // 查询结算信息
    querySettlements(isFirstEnter=false) {
      querySettlements(JSON.stringify(this.params)).then((res) => {
        if (res.code == 4107) {
          Toast(res.description)
          setTimeout(() => {
            appBack(this)
          }, 2000)
          return
        }
        if(res.code == 3002 ) {
          return this.$toast('获取结算信息失败')
        }
        if(res.code == -1 ) {
          return this.$toast(res.msg)
        }
        if(isFirstEnter) {
          let data = {
            route: this.$route.path,
            routeName: '结算页',
            userId: this.$store.getters.userId,
          }
          let storeSettlements = res.storeSettlements,
          properties = []
          storeSettlements.forEach((item) => {
            for (let i = 0; i < item.shoppingCartResponse.normalSkus.length; i++) {
              let obj = {
                spuId: item.shoppingCartResponse.normalSkus[i].spuId,
                skuId: item.shoppingCartResponse.normalSkus[i].skuId,
                storeId: item.storeId,
              }
              properties.push(obj)
            }
          })
          visit(data, properties)
        }

        res.storeSettlements.map((item, index) => {
          item.invoiceList = {
            storeId: item.storeId, // 店铺id
            type: '0', //  发票类型 0 不需要发票 1 普通增值税发票 2 增值税发票
            title: '', // 发票抬头
            content: '1', // 发票内容 1 商品明细 2 商品类别
            taxId: '', // 发票增值税号
            titleType: '1', // 发票抬头类型1 企业 2 个人
            invoiceCompanyName: '', //公司名称
            invoiceRegisterAddress: '', // 注册地址
            invoiceRegisterMobile: '', // 注册电话
            invoiceOpenBank: '', // 开户银行
            invoiceBankAccount: '', // invoiceBankAccount
            invoicePhone: '', // 收票人手机
            invoiceMail: '', // 收票人邮箱
          }
        })
        this.orderSettlement = res

        // 记录后端返回最后订单价格，不包含 优惠券和积分抵扣
        this.orderLastTotalPrice = res.orderLastTotalPrice

        this.$refs.settlementGoods.showPlatformItem = null
        // 刚进来时候的结算信息
        firstValue = JSON.parse(JSON.stringify(res))
        // 计算价格
        this.calcPrice()
        // 设置每个店铺的商品信息
        this.setStoreAllSkus()
        // 计算结算商品数
        this.totalgoods()

        this.limitSkuList = res.limitSkuList
        if (this.limitSkuList && this.limitSkuList.length > 0) {
          this.showLimit = true
        }
        this.hasMarketingSku = res.hasMarketingSku
        // 设置收货地址id
        if (this.orderSettlement.customerAddress) {
          this.params.addressId = this.orderSettlement.customerAddress.id
        }
        // 赠品信息
        let skuId, gift
        this.orderSettlement.storeSettlements.map((item, index) => {
          item.shoppingCartResponse.normalSkus.map((temp, index) => {
            let giftPrict = temp.price * temp.num
            skuId = temp.skuId
            this.spuId = temp.spuId
            if (temp.marketingVos) {
              temp.marketingVos.map((r, index) => {
                if (r.type == 2) {
                  gift = r.fullGiftList.filter((el) => {
                    return giftPrict >= el.fullPrice
                  })
                  this.orderSkuFullGiftMap[skuId] = gift[0]
                }
              })
            }
          })
        })
      })
    },
    //计算结算商品数
    totalgoods() {
      let temp = 0
      let num = this.orderSettlement.storeSettlements.map((item, index) => {
        return (temp += item.skuNum)
      })
      this.goodsTotalNum = temp
    },
    // 设置每个店铺的所有单品
    setStoreAllSkus() {
      this.orderSettlement.storeSettlements.forEach((storeSettlement) => {
        let orderAllSkus = new Array()
        // 没有促销的单品
        if (storeSettlement.shoppingCartResponse.normalSkus && storeSettlement.shoppingCartResponse.normalSkus.length > 0) {
          storeSettlement.shoppingCartResponse.normalSkus.forEach((normalSku) => {
            orderAllSkus.push({
              image: normalSku.image,
              name: normalSku.name,
              num: normalSku.num,
              price: normalSku.price,
              stock: normalSku.stock,
              isGift: false,
            })
          })
        }
        //有促销的单品
        if (storeSettlement.shoppingCartResponse.marketings && storeSettlement.shoppingCartResponse.marketings.length > 0) {
          storeSettlement.shoppingCartResponse.marketings.forEach((marketing) => {
            marketing.skus.forEach((sku) => {
              orderAllSkus.push({
                image: sku.image,
                name: sku.name,
                num: sku.num,
                price: sku.price,
                stock: sku.stock,
                isGift: false,
              })
            })
            // 如果促销是满赠
            if (marketing.marketingType == '2' && marketing.fullMarketingId != -1) {
              marketing.fullGifts
                .filter((fullgift) => fullgift.id == marketing.fullMarketingId)[0]
                .giftSkuInfos.forEach((gift) => {
                  orderAllSkus.push({
                    image: gift.sku.url,
                    name: gift.sku.name,
                    num: gift.num,
                    stock: gift.sku.stock,
                    price: 0,
                    isGift: true,
                  })
                })
            }
          })
        }
        storeSettlement.orderAllSkus = orderAllSkus
        storeSettlement.allSkuNum = orderAllSkus.map((sku) => sku.num).reduce((x, y) => x + y)
      })
    },
    keyboardDown() {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    },
    // 计算价格主要计算 优惠券和积分以及运费
    calcPrice() {
      //  使用积分的金额  （目前主要是平台的金额）
      let pointMoney = 0

      // 包邮减去的价格
      let freeShipPrice = 0
      // 使用优惠券的总价格
      let couponPrice = this.orderSettlement.sumUserCouponDiscount || 0
      // 主要计算包邮的费用 和积分的费用
      this.orderSettlement.storeSettlements.forEach((storeSettlement) => {
        // 店铺一共优惠的价格
        let discountPrice = storeSettlement.totalDiscountPrice
        // 如果选择了优惠券则设置优惠券的优惠金额
        if (storeSettlement.userCouponDiscount && storeSettlement.userCouponDiscount>0) {
          // 优惠券的价格
          let couponLastPrice = storeSettlement.userCouponDiscount

          // 如果优惠券减去的价格比订单的价格大则减去的价格试用订单的价格 防止出现负数
          if (couponLastPrice > storeSettlement.totalPrice) {
            couponLastPrice = storeSettlement.totalPrice
          }
          storeSettlement.userCouponDiscount = couponLastPrice
          discountPrice = discountPrice + couponLastPrice
        }
        //  店铺商品数改变
        // storeSettlement.originTotalPrice = storeSettlement.shoppingCartResponse.normalSkus[0].num * storeSettlement.shoppingCartResponse.normalSkus[0].price
        // 店铺的总金额 ＝ 原始金额－优惠 （优惠券和积分）
        const storePrice = storeSettlement.originTotalPrice - discountPrice

        // 店铺最后不算运费的价格
        storeSettlement.storePrice = storePrice
        // 店铺最后不算运费的价格拷贝,计算红包的时候使用
        storeSettlement.storePriceCopy = storePrice
      })
      // 所有优惠的金额
      if (JSON.stringify(firstValue) == '{}') {
        firstValue = this.orderSettlement
      }
      this.orderSettlement.sumUserCouponDiscount = couponPrice
      // this.orderSettlement.orderDiscountPrice = firstValue.orderDiscountPrice + couponPrice + pointMoney
      // 总的运费
      this.orderSettlement.orderTotalFright = firstValue.orderTotalFright - freeShipPrice

      // 礼卡金额
      let giftMoney = this.orderSettlement.giftMoney || 0
      // 结算的最后金额＝ 后端返回的最后结算金额 － 前端优惠金额（优惠券和积分） － 免费的包邮 - 平台优惠券金额 - 福气值积分抵扣
      this.orderSettlement.orderLastTotalPrice = (firstValue.orderLastTotalPrice - couponPrice - pointMoney - freeShipPrice - giftMoney - this.integralMoney).toFixed(2) > 0 ?
      (firstValue.orderLastTotalPrice - couponPrice - pointMoney - freeShipPrice - giftMoney - this.integralMoney).toFixed(2) : 0
      // 拷贝一份价格 方便后面红包使用
      this.orderSettlement.orderDiscountPriceCopy = this.orderSettlement.orderDiscountPrice
      this.orderSettlement.orderTotalFrightCopy = this.orderSettlement.orderTotalFright
      // 拷贝一份除开福气值的总额  后面超额会用来判断界限
      this.orderSettlement.orderLastTotalPriceCopy = (firstValue.orderLastTotalPrice - couponPrice - pointMoney - freeShipPrice - giftMoney).toFixed(2) > 0 ?
      (firstValue.orderLastTotalPrice - couponPrice - pointMoney - freeShipPrice - giftMoney).toFixed(2) : 0
      // 只要价格发生变动 就取消红包的使用
      this.redEnvelopeCode = null

      // 检测积分是否超界
      this.$nextTick(() => {
        this.integralMoney > this.orderLastTotalPrice && this.$refs.integralPopup.checkIntegralNum(this.useIntegral)
      })
    },
    // 跳转到收货地址页面
    toAddress() {
      this.params.toaddresstype = 1
      this.$router.push({
        path: '/customeraddresslist',
        query: { from: 'settlement', params: JSON.stringify(this.params) },
      })
    },
    // 获得提交订单的参数
    getSubmitOrderParams() {
      let params = {}
      // 发票
      let list = this.orderSettlement.storeSettlements.map((item, index) => {
        if (item.invoiceList.type != '0') {
          return item.invoiceList
        }
      })
      for (let i in list) {
        if (list[i] == undefined) {
          list.splice(i, 1)
          i -= i
        }
      }
      if (list[0] == undefined) {
        list = []
      }
      params.addressId = this.orderSettlement.customerAddress.id
      // params.invoice = this.getInvoice()
      params.invoiceList = list
      params.integralPoint = this.useIntegral // 积分
      params.integralCfgId = this.integralCfgId
      params.storeInfos = this.getStoreInfos()
      params.ids = this.params.ids
      if (this.hasMarketingSku) {
        params.hasMarketingSku = this.hasMarketingSku
      }
      // params.skuInfos = this.orderSettlement.skuInfos
      params.buyNowRequestList = this.params.buyNowRequestList
      params.redEnvelopeCode = this.redEnvelopeCode ? this.redEnvelopeCode.code : ''
      params.isGroup = this.params.isGroup
      params.groupId = this.params.groupId
      params.orderSkuFullGiftMap = this.orderSkuFullGiftMap
      params.noStockGiftIds = this.noStockGiftIds
      params.orderToken = this.orderSettlement.orderToken
      params.source = 2
      params.platformCouponCode = this.orderSettlement.platformCouponCode
      params.valueCardCodeId = this.orderSettlement.valueCardCodeId

			// 福气值订单是否提交过一次
			params.isOldPriceBuy = this.isOldPriceBuy

      const idsList = []
      this.orderSettlement.storeSettlements.forEach(item=>{
        item.onlineRetailerCouponIds && item.onlineRetailerCouponIds.forEach(ele=>{
          idsList.push(ele)
        })
      })
      params.onlineRetailerCouponIds = idsList
      //判断用户订单来源
      let userSource = localStorage.getItem('userSource')
      // let userSource = this.$store.getters.getUserSource
      if (userSource && userSource == 1) {
        params.source = 6
      } else if (userSource && userSource == 2) {
        params.source = 5
      } else {
        if (this.isWeiXin()) {
          params.source = 4
        }
      }

      let posiotionLonAndLat = JSON.parse(localStorage.getItem('posiotionLonAndLat'))
      if(posiotionLonAndLat) {
        posiotionLonAndLat.lon = posiotionLonAndLat.lng
        Object.assign(params, posiotionLonAndLat)
      }

      let appData = JSON.parse(localStorage.getItem('appData'))
      if (appData) {
        params.deviceId = appData.deviceId;
        params.softVersion = appData.softVersion;
        params.sysVersion = appData.sysVersion
      }

      if(this.params.enterpriseId){
        // 集采需要传这些参数
        params.enterpriseAgencyId = this.params.enterpriseId
        params.entPurOrderType = 1
        params.sourceType = 5
      }
      return params
    },
    isWeiXin() {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    // 获得发票信息
    getInvoice() {
      let invoice = {}
      invoice.type = this.invoice.invoice
      invoice.title = this.invoice.invoiceTitle
      invoice.content = this.invoice.invoiceContent
      invoice.taxId = this.invoice.invoiceTaxid
      invoice.titleType = this.invoice.titleType
      invoice.invoiceCompanyName = this.invoice.invoiceCompanyName
      invoice.invoiceRegisterAddress = this.invoice.invoiceRegisterAddress
      invoice.invoiceRegisterMobile = this.invoice.invoiceRegisterMobile
      invoice.invoiceOpenBank = this.invoice.invoiceOpenBank
      invoice.invoiceBankAccount = this.invoice.invoiceBankAccount
      return invoice
    },
    // 获得每个店铺选择的信息
    getStoreInfos() {
      let storeinfos = new Array()
      this.orderSettlement.storeSettlements.forEach((storeSettlement) => {
        let storeinfo = {}
        storeinfo.storeId = storeSettlement.storeId
        storeinfo.couponCode = ''
        if (storeSettlement.choosedCoupon) {
          storeinfo.couponCode = storeSettlement.choosedCoupon.code
        }
        storeinfo.payType = storeSettlement.choosedPayType
        storeinfo.usePoints = storeSettlement.usePoints
        storeinfo.remark = storeSettlement.remark
        storeinfos.push(storeinfo)
      })

      return storeinfos
    },
  },
}
</script>

<style scoped lang="less">
.font-din {
    font-family: DINAlternate-Bold, DINAlternate;
}
.settle-page {
  display: flex;
  flex-direction: column;
  /deep/.navbarbox .topbox {
    position: static;
  }
  .sroll-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    margin-bottom: 75px;
    /deep/ .van-cell__right-icon {
        color: #999;
        right: 0px;
        font-size: 12px;
      }
  }
}
/deep/.dialog {
  padding: 0.9rem 0rem 1.2rem !important;
}
.product-info-box,
.product-price-m {
  line-height: 0.32rem;
}
.bottomBtn {
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 75px;
  width: 100%;
  .total {
    width: 100%;
    display: flex;
    height: 75px;
    justify-content: flex-end;
    padding: 10px 12px 25px;
    align-items: center;
    position: static;
    .total-wrapper {
      margin-right: 4px;
    }
    .total_p {
      color: #191919;
      font-size: 15px;
      font-weight: bold;
      .goodsNum {
        color: #999;
        font-size: 10px;
        font-weight: normal;
      }
      .copunDisMoney {
        font-size: 11px;
        color: #FF0A35;
        line-height: 16px;
        height: fit-content;
        font-weight: normal;
        text-align: right;
      }
    }
  }
  .buy {
    color: #FFF9E9;
    width: 110px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
    font-size: 16px;
    font-weight: bold;
    border-radius: 20px;
    margin-right: 0;
  }
  .buy-disabled {
    background-color: #f2f2f2;
    color: #bababa;
  }
}
.bottomBtn:before {
  border-bottom: 1px solid #f4f4f4;
}
.stockPopupBox {
  padding: 1.2rem 0.84rem;
  background-color: #fff;
  border-radius: 0.4rem;
  color: #000;
  h2 {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .giveGoodsBox {
    max-height: 8.16rem;
    overflow-y: scroll;
    .givegoods {
      margin-top: 0.72rem;
      display: flex;
      img {
        width: 2rem;
        height: 2rem;
        border-radius: 0.12rem;
      }
      .goodsTitle {
        color: #666;
        font-size: 13px;
        width: 8.32rem;
        margin-left: 0.4rem;
        display: flex;
        align-items: center;
      }
    }
  }
  .buyBox {
    margin-top: 1.2rem;
    display: flex;
    justify-content: space-around;
    .commonspan {
      width: 4.16rem;
      height: 1.2rem;
      line-height: 1.2rem;
      text-align: center;
      color: #e60113;
      background-color: #fff;
      position: relative;
      font-weight: bold;
      font-size: 0.48rem;
    }
    .commonspan::after {
      border-color: #e60113;
    }
    .Yes {
      color: #fff;
      background-color: #e60113;
      border-radius: 0.64rem;
    }
  }
}
.limit-skus-list {
  max-height: 10.4rem;
  margin-top: 1.2rem;
  box-sizing: content-box;
  overflow: auto;
  .limit-skus {
    padding: 0 1.12rem;
  }
  .limit-item::after {
    content: '';
    height: 0.4rem;
    background-color: #f2f2f2;
    width: 100%;
    display: inline-block;
    margin-bottom: 18px;
  }
  .limit-item:last-child::after {
    display: none;
  }
}
.limit-skus {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  .limit-sku-image {
    width: 2.4rem;
    height: 2.4rem;
    margin-right: 0.4rem;
    background: #ffffff;
    border-radius: 0.2rem;
    border: 0.04rem solid #eeeeee;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .limit-sku-info {
    height: 2.4rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .limit-sku-name {
      font-size: 0.48rem;
      font-weight: 400;
      color: #666666;
      line-height: 0.64rem;
    }
    .limit-sku-num {
      font-size: 0.48rem;
      font-weight: 400;
      color: #e60113;
      line-height: 0.64rem;
    }
  }
}
.bless-wrpper {
  margin-top: 12px;
  border-radius: 10px;
  overflow: hidden;
  .van-cell {
    padding: 10px 12px;
    padding-right: 30px;
    font-size: 13px;
  }
  /deep/.van-cell__title, /deep/.van-cell__value, /deep/.van-cell__right-icon {
    line-height: 17px;
    height: 17px;
  }
  /deep/ .cell__value {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #191919;
  }
  /deep/.van-cell__value {
    color: #191919;
  }

  .red {
    /deep/ .van-cell__value {
      color: #FF0A35;
      font-size: 13px;
    }
  }
  .no-use {
    /deep/ .van-cell__value {
      color: #999;
      font-size: 11px;
    }
  }
  .have-right-icon {
    font-size: 11px;
    &.van-cell {
      padding-right: 12px;
    }
  }
  .van-cell::after {
    display: none;
  }
  .totalpricebox {
      color: #191919;
      font-size: 15px;
      text-align: right;
      padding: 8px 28px 12px 0;
      position: relative;
      background: #fff;
      span {
        color: #FF0A35;
      }
    }
    .totalpricebox::before {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 12px;
      top: 0;
      left: 12px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
}
.bless-popup {
  padding: 0;
  border-radius: 10px 10px 0 0;
  background: #f6f6f6;
  .top {
    position: relative;
    padding: 12px 0;
    .bless-num {
      color: #000D1D;
      font-size: 16px;
      text-align: center;
      >span {
        color: #444;
        font-size: 11px;
      }
    }
    .close {
      position: absolute;
      right: 12px;
      top: 13px;
      width: 27px;
      height: 20px;
    }
  }
  .input-container {
    background: #fff;
    padding: 36px 20px 24px 24px;
    .b-tip {
      color: #999;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .bless-input-wrapper {
      display: flex;
      align-items: center;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid #eee;
      .get-all {
        color: #FF0A35;
        font-size: 13px;
      }
    }
  }
  .tip {
    font-size: 13px;
    color: #444;
    text-align: left;
    margin-top: 8px;
    .money {
      color: #FF0A35;
    }
  }
  .bless-input {
    height: 40px;
    background: #fff;
    border-radius: 10px;
    width: 100%;
    text-align: left;
    padding: 0 12px;
    font-size: 16px;
    flex: 1;
    /deep/ .van-field__control {
      height: 36px;
      text-align: left;
    }
  }
  .btn {
    background: #fff;
    padding: 0 12px 12px;
    .btn-wrapper {
      text-align: center;
      height: 40px;
      background: #e60113;
      border-radius: 20px;
      font-size: 14px;
      color: #fff;
      line-height: 40px;
    }
  }
}
</style>
