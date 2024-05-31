<template>
  <div class="detailwrapper" ref="backTop" :class="[returntop ? 'backtopactive' : '']" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <div class="header">
      <div class="nav" id="headerwrapper">
        <detail-header>
          <div class="nav-title">
            <img :src="titleImg" alt="" class="nav-title__img"/>
            <span class="nav-title__word">{{ titleWord }}</span>
          </div>
        </detail-header>
      </div>
      <div class="content">
        <div class="content-status" v-if="order.status == '1'">
          <div class="content-status__desc">
            <span>应付金额：</span>
            <span>￥{{ (order.price && order.price.toFixed(2)) || '0.00' }}</span>
          </div>
          <div class="content-status__desc">
            <span>支付剩余：</span>
            <van-count-down :time="countdown" format="mm分ss秒"></van-count-down>
          </div>
        </div>

        <div class="content-status" v-if="order.status == '2' && (!order.backOrderLogVO || order.backOrderLogVO && order.backOrderLogVO.status != '1')">
          <div class="content-status__desc">您的订单正在快马加鞭出库中</div>
        </div>
        <div class="content-status" v-if="order.status == '3' && (!order.backOrderLogVO || order.backOrderLogVO && order.backOrderLogVO.status != '1')">
          <div class="content-status__desc">您的订单正在快马加鞭向您赶来</div>
        </div>
        <!-- cancelStatus 1:用户自行取消 2: 定时任务取消（超时） -->
        <div class="content-status" v-if="order.status == '5' && order.cancelStatus == 2">
          <div class="content-status__desc">取消原因：超时未支付</div>
        </div>
        <div class="topay" v-if="order.status == 1" @click="opeationOreder(order, '去支付')">去支付</div>
        <!-- <div class="topay" v-else-if="order.status == 5 || order.status == 6 || order.status == 7" @click="opeationOreder(order, '再次购买')">再次购买</div> -->
      </div>
    </div>
    <div class="main">
      <!-- 订单状态信息 -->
      <div class="orderstatus">
        <van-notice-bar v-if="showNotice" left-icon="volume-o" :text="order.signContent">
          <template #left-icon>
              <img src="@/assets/img/info-new.png" class="left-icon" alt="" />
          </template>
        </van-notice-bar>
        <!-- 退单相关 -->
        <div class="orderstatus-every orderstatus-logistics"
          v-if="(order.backOrderLogVO != null&& order.oldRefund==1)"
          @click="torefundDetail(order,1)">
          <div class="orderstatus-logistics__info">
            <div class="orderstatus-logistics__title">
              {{
                order.backOrderLogVO
                  ? order.backOrderLogVO.backOrderLogDescVOs[0].message
                  : '取消/退款进度：您的订单已取消。如您使用了优惠券等，请查看取消进度详情。'
              }}
            </div>
            <div class="orderstatus-logistics__time">{{ order.backOrderLogVO ? order.backOrderLogVO.backOrderLogDescVOs[0].createTime : '' }}</div>
          </div>
          <img src="@/assets/img/logistics-new.png" class="right-icon" alt="" />
        </div>
        <!-- 物流相关 -->
        <div class="orderstatus-every orderstatus-logistics"
          v-if="order.orderType != 7 && (order.status == 2 || order.status == 3 || order.status == 4||order.status == 6) && order.splitLogistics == 0"
          @click="toCheckLogistics(order, 1)">
          <div class="orderstatus-logistics__info">
            <div class="orderstatus-logistics__title">
              <img src="@/assets/img/receipt-new.png" alt="" />
              <span v-if="order.status == 2">您提交了订单，请等待发货</span>
              <span v-if="order.status == 3">{{ order.kdniaoTrackVO && order.kdniaoTrackVO.tracesList ? order.kdniaoTrackVO.tracesList[0].acceptStation : '正在等待揽收' }}</span>
              <span v-if="order.status == 4 && order.deliverGoodsMode != 2">您的订单已签收，感谢您在万顺福购物，欢迎您再次光临!</span>
              <span v-if="order.status == 4 && order.deliverGoodsMode == 2">您的订单需要自行去门店提货,请尽快前往实体店门店提货,感谢您在万顺福购物,欢迎您再次光临!</span>
              <span v-if="order.status == 6">您的订单已取消!</span>
            </div>
            <!-- <div class="orderstatus-logistics__desc">xxxx</div> -->
            <!-- 2022.12.30推荐商品项目中提出改时间不准确，先注释掉 -->
            <div class="orderstatus-logistics__time">{{ order.createTime }}</div>
          </div>
          <img src="@/assets/img/logistics-new.png" class="right-icon" alt="" v-if="order.status == 2 || order.status == 3 || (order.status == 4 && order.deliverGoodsMode != 2)" />
        </div>
        <!-- 收货地址 -->
        <div class="orderstatus-every" v-if="order.orderAttr">
          <div class="orderstatus-every__info">
            <img class="orderstatus-every__img" src="@/assets/img/detail-location.png">
            <div class="orderstatus-every__content">
              <div class="orderstatus-every__name"><span class="name">{{ order.orderAttr.receiptName ? order.orderAttr.receiptName : '' }}</span> {{ order.orderAttr.receiptMobile | phoneSubstr }}</div>
              <div class="orderstatus-every__address">{{ order.orderAttr.receiptAddress && order.orderAttr.receiptAddress.replace(/\,/g, '') }}{{ order.orderAttr.receiptDetailAddress }}</div>
            </div>
            <div class="orderstatus-every__altaddress" v-if="order.status == '1' && order.receiptUpdateNum < 1" @click="toaddressList()">修改</div>
          </div>
        </div>
      </div>
      <!-- 商品信息 -->
      <sku-list :order="order"></sku-list>
      <!-- 订单详情信息 -->
      <div class="orderdetail module-com">
        <div class="orderdetail-every">
          <label>订单编号</label>
          <div v-if="from == 'smartApp'" class="orderdetail-every__value">
            <span>{{ order.orderNo }}</span><span class="orderdetail-every__copy" @click="copyOrderCode(order.orderNo)">复制</span>
          </div>
          <div v-else class="orderdetail-every__value">
            <!-- 已取消或者待支付 -->
            <template v-if="order.status == '1' || order.status == '5'">
              <span>{{ order.masterOrderCode }}</span><span class="orderdetail-every__copy"  @click="copyOrderCode(order.masterOrderCode)">复制</span>
            </template>
            <template v-else>
              <span>{{ order.orderCode }}</span><span class="orderdetail-every__copy"  @click="copyOrderCode(order.orderCode)">复制</span>
            </template>
          </div>
        </div>
        <div class="orderdetail-every">
          <label>下单时间</label>
          <div class="orderdetail-every__value">
            <span>{{ order.createTime }}</span>
          </div>
        </div>
        <div v-if="order.status != '1' && order.status != '5'">
          <div class="orderdetail-every">
            <label>支付方式</label>
            <div class="orderdetail-every__value">
              <span v-if="!order.mixedPayChannelName">/</span>
              <span v-else>{{ order.mixedPayChannelName }}</span>
            </div>
          </div>
          <div class="orderdetail-every">
            <label>支付时间</label>
            <div class="orderdetail-every__value">
              <span>{{ order.payTime }}</span>
            </div>
          </div>
          <div class="orderdetail-every" v-if="order.orderType != 7">
            <label>配送方式</label>
            <div class="orderdetail-every__value">
              <template v-if="order.orderAndLogisticsList && order.orderAndLogisticsList.length > 0">
                <p v-for="(item, index) in order.orderAndLogisticsList" :key="index">{{ item.logisticsCompany }} {{ item.waybillCode }}</p>
              </template>
              <p v-else>快递运输</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 订单价格信息 -->
      <div class="orderprice module-com">
        <div class="orderprice-every" v-if="order.originalPrice">
          <label>商品总额</label>
          <div class="orderprice-every__value">
            <span>¥{{ order.originalPrice.toFixed(2) }}</span>
          </div>
        </div>
        <div class="orderprice-every">
          <label>运费</label>
          <div class="orderprice-every__value">
            <span>{{ order.freightPrice > 0 ? '+¥' + order.freightPrice.toFixed(2) : '+¥0.00' }}</span>
          </div>
        </div>

        <div class="orderprice-every" v-if="order.orderTotalIntegralPoint > 0">
          <label>福气值</label>
          <div class="orderprice-every__value">
            <span class="orderprice-every__value-red">-{{ order.orderTotalIntegralPoint }}</span>
          </div>
        </div>

        <div class="orderprice-every"  v-if="order.activityPrice && order.activityPrice > 0">
          <label>活动</label>
          <div class="orderprice-every__value">
            <span class="orderprice-every__value-red">-¥{{ order.activityPrice.toFixed(2) }}</span>
          </div>
        </div>
        <div class="orderprice-every" v-if="order.retailerCouponPrice && order.retailerCouponPrice > 0">
          <label>优惠券</label>
          <div class="orderprice-every__value">
            <span class="orderprice-every__value-red">-¥{{ order.retailerCouponPrice.toFixed(2) }}</span>
          </div>
        </div>
        <div class="orderprice-every" v-if="order.performanceScore && order.performanceScore > 0">
          <label>绩效分</label>
          <div class="orderprice-every__value">
            <span class="orderprice-every__value-red">{{ order.performanceScore }}</span>
          </div>
        </div>
        <div class="orderprice-every" v-if="order.valueCardPrice>0">
          <label>礼品卡抵扣</label>
          <div class="orderprice-every__value">
            <span>-¥{{ order.valueCardPrice }}</span>
          </div>
        </div>
        <div class="orderprice-final">
          {{ order.status == 1 || order.status == 5 ? '应付款' : '实付款' }}：
          <span>￥{{ (order.price && order.price.toFixed(2)) || '0.00' }}</span>
        </div>
      </div>
    </div>
    <div class="footer" :class="{ iscancle: order.status == 4 || order.status == 5 || order.status == 6 || order.status == 7 ? true : false,'needButtomSpace': isIOS }">
      <span
        class="footer-com"
        v-if="order.status == 4 || order.status == 5 || order.status == 6 || order.status == 7"
        @click="opeationOreder(order, '删除订单')"
      >
        删除订单
      </span>
      <span class="footer-com" v-if="order.status != 5 && order.status != 6 && order.status != 7 && order.invoiceFlag!=1" @click="opeationOreder(order, '发票服务')">
        发票服务
      </span>
      <span class="footer-com" v-if="order.status != 5 && order.status != 6 && order.status != 7 &&order.invoiceFlag==1" @click="Invoicinged()">
        查看发票
      </span>
      <span class="footer-com" v-if="order.status == 1" @click="opeationOreder(order, '取消订单')">取消订单</span>
      <!-- <span class="footer-com" v-if="order.status == 2 || order.status == 3 || order.status == 6 || order.status == 7" @click="opeationOreder(order,'申请退款')">申请退款</span> -->
      <!-- <span class="footer-com" v-if="order.canRefund" @click="opeationOreder(order, '申请退款')">
        申请退款
      </span> -->
      <!-- <span class="footer-com" v-if="!order.canRefund && (order.status == 2 || order.status == 3)">退款中</span> -->
      <span class="footer-com footer-pay" v-if="order.status == 3" @click="opeationOreder(order, '确认收货')">
        确认收货
      </span>
      <span class="footer-com footer-pay" v-if="(order.orderType != 7 && order.status == 4) || order.status == 5 || order.status == 6 || order.status == 7" @click="opeationOreder(order, '再次购买')">
        再次购买
      </span>
      <span class="footer-com footer-pay" v-if="order.status == 1" @click="opeationOreder(order, '去支付')">去支付</span>
      <!-- <span class="footer-com" v-if="order.backOrderLogVO && order.backOrderLogVO.status == 1" @click="opeationOreder(order, '取消申请')">取消申请</span> -->
    </div>
    <!-- 热销商品 -->
    <div class="xq_wntj" style="margin-top: 0.4rem">
      <shopList v-if="orderCode" :title="'热销商品'" :titleImg="true" :orderCode="orderCode"></shopList>
    </div>

    <!-- 回到顶部 -->
    <div class="backtop" v-if="isshowtop" @click="backtop">
      <img src="@/assets/img/goodsDetail/go_top.png" alt />
      <span>顶部</span>
    </div>
    <!-- 二次确认弹窗 -->
    <SecondConfirm
      :title="titleTextMap[isType]"
      :cancleText="cancleTextMap[isType]"
      :sureText="sureTextMap[isType]"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
    ></SecondConfirm>


    <SecondConfirm
      :title="discountOrderType == 'cancelOrder' ? '以下订单需一起取消' : '以下订单需一起付款'"
      :cancleText="discountOrderType == 'cancelOrder' ? '直接买了' : '取消'"
      :sureText="discountOrderType == 'cancelOrder' ? '取消订单' : '付款'"
      :dialogshow="discountOrderDialog"
      :isNeedTouchClose="true"
      @closeBack="discountOrderCancel"
      @rightEvent="discountOrderConfirm"
      @handleCloseDialog="discountOrderDialog = false"
    >
      <div class="discount-order-container" slot="textp">
        <div class="order-auto-box">
          <div class="discount-order" v-for="(item, index) in discountOrderData.orderList" :key="index">
            <div class="discount-order-info">
              <div class="left-part">{{ item.storeName }}</div>
              <div class="right-part">￥{{ item.price }}</div>
            </div>
            <div class="discount-order-count">(共{{ item.orderSkus && item.orderSkus.length }}件)</div>
          </div>
        </div>
        <div class="order-total-box">
          <span class="text">订单合计金额：</span>
          <span class="symbol">￥</span>
          <span class="price">{{ discountOrderData.totalPrice }}</span>
        </div>
      </div>
    </SecondConfirm>

    <!-- 弹出层 -->
    <ordercancelpopup :isShowPoup="isShowPoup" :isShowCatSwitch="isVirtual" @closePoup="closePoup" @submitPoup="submitPoup"></ordercancelpopup>
    <orderAllpopup :isorderShowPoup.sync="isorderShowPoup" @input="isorderShowPoup = false" :isWsorder="isWsorder"></orderAllpopup>
    <orderSecondConfirm ref="orderSecondConfirm"></orderSecondConfirm>

  </div>
</template>

<script>
  import { Toast, Icon, CountDown, NoticeBar } from 'vant'
  import shopList from '@/components/commons/shopList'
  import navBartop from '@/components/commons/navBartop'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import ordercancelpopup from './ordercancelpopup'
  import { cancleApplySale } from '@/api/backorderlist'
  import orderAllpopup from './orderAllpopup.vue'
  import orderSecondConfirm from '@/components/order/components/orderSecondConfirm'
  import { judgeRefund } from '@/api/orderlist'
  import {
    queryOrderDetail,
    confirmReceipt,
    getCheckLogisticsUrl,
    deleteOrder,
    cancelOrder,
    settlementDetail,
    selectWsOrderInfoByOrderId,
    checkOrder,
    cancelOrderBatch,
  } from '@/api/orderlist'
  import detailHeader from './orderdetail/header'
  import skuList from './orderdetail/skuList'
  import action from './orderdetail/mixins/action'
  let appData = JSON.parse(localStorage.getItem('appData'))
  import { appBack }  from '@/utils/utils'
  export default {
    mixins: [action],
    components: {
      shopList,
      orderAllpopup, // 订单合并成大订单弹窗
      navBartop, // 顶部nav
      ordercancelpopup, // 取消弹出层
      SecondConfirm, // 二次确认
      [Icon.name]: Icon,
      [CountDown.name]: CountDown,
      [NoticeBar.name]: NoticeBar,
      detailHeader,
      skuList,
      orderSecondConfirm
    },
    data() {
      return {
        titleTextMap: {
          1: '确认删除此订单？',
          2: '您是否收到该订单商品？',
          3: '非自营订单的发票由商家开具， 具体金额以实际开票为准。如有疑问，请联系商家。',
          4: '确认取消退款申请？',
          5: '订单中存在退款申请中商品，确认收货则默认撤销申请!'
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
        discountOrderData: {},
        discountOrderDialog: false,
        discountOrderType: '',
        skuId: null,
        orderCode: '',
        order: {}, // 订单详情 order.status: 1 待付款/2 待发货/3 待收货/4 已完成/5 取消订单/6 退款通过/7 退货通过
        isopen: false, //  展开收起 此功能再虚拟商品迭代去掉，与卡密操作展开收起有冲突
        isshowtop: false, // 回到顶部
        returntop: false, // 返回顶部类
        isType: '', // 1 删除弹窗  2 确认收货弹窗  3发票服务弹窗
        dialogshow: false,
        isShowPoup: false, // 弹出层
        setTimer: null, // 定时器
        timeInteval: null, // 倒计时函数
        countdown: 1800, // 倒计时
        camiloList: [],
        isOpenCamilo: true, //权益卡密收起功能
        isVirtual: false, //虚拟商品标识
        isIOS:false,
        isorderShowPoup: false,
        isWsorder: {},
        from: this.$route.query.from
      }
    },
    computed: {
      performanceScoreTotal() {
        if (!this.order || !this.order.orderSkuWithMarketings) {
          return 0
        } else {
          let list = this.order.orderSkuWithMarketings,
            point = 0
          list.forEach((item) => {
            if (item.performanceScore && item.performanceScore > 0) {
              let num = item.performanceScore * item.num
              point = point + num
            }
          })
          return point
        }
      },
      // 是否显示疫情管控提示
      showNotice() {
        return (this.order.status == 2 || this.order.status == 3) && this.order.signType == 1
      },
      // 标题图片链接
      titleImg () {
        const imgArr = {
          1: `${this.$oss}/order/time_flag.png`,
          2: `${this.$oss}/order/time_flag.png`,
          3: `${this.$oss}/order/time_flag.png`,
          4: `${this.$oss}/order/finish-flag.png`,
          5: `${this.$oss}/order/cancel_flag.png`,
          6: `${this.$oss}/order/cancel_flag.png`,
          7: `${this.$oss}/order/cancel_flag.png`,
        }
        return imgArr[this.order.status] || `${this.$oss}/order/time_flag.png`
      },
      // 标题文案
      titleWord () {
        let titleWord = ''
        if (this.order.status == 1) {
          titleWord = '等待付款'
        }
        if (this.order.status == 2) {
          titleWord = this.order.backOrderLogVO && this.order.backOrderLogVO.status == '1' ? '退款申请中' : '正在出库'
        }
        if (this.order.status == 3) {
          titleWord = this.order.backOrderLogVO && this.order.backOrderLogVO.status == '1' ? '退款申请中' : '等待收货'
        }
        if (this.order.status == 4) {
          titleWord = '完成'
        }
        if (this.order.status == 5 || this.order.status == 6 || this.order.status == 7) {
          titleWord = '已取消'
        }
        return titleWord
      }
    },
    watch: {
      isshowtop(value) {
        if (!value) this.returntop = false
      },
      '$route' (to, from) {
        if(to.path == from.path && from.path == "/orderdetail"){
          this.queryOrderDetail()
        }
      }
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
    },
    created() {
      sessionStorage.removeItem('wxzf_payResult')
      if (this.$store.getters.phoneType == 'Android') {
        this.isIOS = false
      } else {
        this.isIOS = true
      }
      console.log(this.$store.getters.phoneType,'手机类型----------*****');
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryOrderDetail()
      // this.settime()
      this.setTimer = setInterval(this.queryOrderDetail, 60000)
    },
    methods: {
      Invoicinged(){
      this.$router.push({
            path: '/Invoicinged',
            query: {
              id: this.order.id,
              price:this.order.price
            },
          })
      },
       //申请退款
      async orderOperation(data, text) {
        if (text == '申请退款') {
          this.$router.push({
            path: 'refundorder',
            query: {
              orderSkuId:data.id,//订单商品ID
              orderId: data.orderId,//订单ID
            },
          })
        }
      },
      // 规格过滤
      filterSkuSpecs(data) {
        console.log('JSON.parse(data)', JSON.parse(data))
        return JSON.parse(data)
      },
      // 查询订单详情
      queryOrderDetail() {
        let that = this
        queryOrderDetail({ id: this.$route.query.orderId }).then((res) => {
          if (res.code == 200) {
            this.order = res.data
            this.skuId = res.data.orderSkuWithMarketings[0].skuId
            this.orderCode = res.data.orderCode
            if (this.order.status == 1) {
              let overtime = new Date(this.order.createTime.replace(/-/g, '/')).getTime() + 1800000
              let time = overtime - new Date().getTime()
              this.countdown = time
              if (this.countdown < 0) {
                that.autoSubmit({ addCart: false, reason: '订单超时自动取消' })
              }

              // if (overtime - new Date().getTime() > 0) {
              //   let h = parseInt((time / 60 / 60) % 24)
              //   let m = parseInt((time / 60) % 60)
              //   let s = parseInt(time % 60)
              //   h = h > 9 ? h : '0' + h
              //   m = m > 9 ? m : '0' + m
              //   this.timedown = '剩' + h + '小时' + m + '分' + '自动关闭'
              // }
            } else {
              // 其他订单状态取消主接口轮询
              clearInterval(this.setTimer)
            }
            if (this.order.orderType == 7) {
              this.camiloList = this.order.virtualCardKeyList
            }
          }
        })
      },
      // 自动取消订单
      autoSubmit(data) {
        let orderIdList = this.order.orderDetailVos.map(item => item.id);
        let params = {
          orderIdList,
          addCart: data.addCart,
          reason: data.reason,
        }
        cancelOrderBatch(params).then((res) => {
          if (res.code == 200) {
            this.queryOrderDetail()
            // 取消主接口轮询
            clearInterval(this.setTimer)
          }
        })
      },
      // 提交取消订单
      submitPoup(data) {
        if (this.discountOrderType == 'cancelOrder' && this.discountOrderData.orderIdList && this.discountOrderData.orderIdList.length > 0) {
          let params = {
            orderIdList: this.discountOrderData.orderIdList,
            addCart: data.addCart,
            reason: data.reason,
          }
          cancelOrderBatch(params).then((res) => {
            if (res.code == 200) {
              Toast('取消成功')
              this.isShowPoup = false
              this.discountOrderType = ''
              this.discountOrderData = {}
              appBack(this)
            } else {
              Toast(res.description)
            }
          })
        } else {
          let orderIdList = this.order.orderDetailVos.map(item => item.id);
          let params = {
            orderIdList,
            addCart: data.addCart,
            reason: data.reason,
          }
          cancelOrderBatch(params).then((res) => {
            if (res.code == 200) {

              Toast('取消成功')
              this.isShowPoup = false
              appBack(this)
            } else {
              Toast(res.description)
            }
          })
          // Toast("提交成功，正在为您取消订单")
        }
      },
      // 关闭弹出层
      closePoup(data) {
        this.isShowPoup = data
      },
      // 弹窗左按钮
      closeBack(data) {
        this.dialogshow = false // 关闭弹窗
      },
      // 弹窗右按钮
      rightEvent(data) {
        // 删除订单
        if (this.isType == 1) {
          let params = {
            orderId: this.order.id,
          }
          deleteOrder(params).then((res) => {
            if (res.code == 200) {
              // 智慧生活app- 从订单列表进来的-点击删除订单-仍旧返回订单列表
              // 如果是H5进来的，则返回H5的订单列表
              appBack(this)
            }
          })
        } else if (this.isType == 2||this.isType == 5) {
          confirmReceipt(this.order.id).then((res) => {
            if (res.code == 200) {
              Toast('确认收货成功')
              appBack(this)
            } else {
              // Toast('确认收货失败')
              Toast(res.description)
            }
          })
        } else if (this.isType == 3) {
          window.ysf('open')
          // let a = document.createElement('a')
          // a.setAttribute('href', 'tel:0755-23061865')
          // a.click()
          // a.remove()
        } else if (this.isType == 4) {
          let param = {
            id: this.order.backOrderLogVO.backOrderId,
          }
          cancleApplySale(param).then((res) => {
            if (res.code == 200) {
              Toast('取消申请成功')
              this.$router.back()
            } else {
              Toast(res.description)
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
            paySceneType: orderType*1 === 14 ? 102 : 101 //102集采 101电商
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
      //合并支付/取消订单 确认按钮
      discountOrderConfirm() {
        if (this.discountOrderType == 'cancelOrder') {
          //取消订单 走填写取消原因逻辑
          this.discountOrderDialog = false
          this.isShowPoup = true
        } else if (this.discountOrderType == 'goPayOrder') {
          //付款 跳转支付页面
          if(appData && appData.appScheme == 'wsf') {
            this.commonPay(this.discountOrderData.totalPrice, this.discountOrderData.masterOrderCode, appData)
          } else {
            this.$router.push({
              path: '/zhPay',
              query: { money: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, type: 1, id: this.discountOrderData.orderIdList[0], serviceType: 100 },
            })
            // this.$router.push({
            //   path: '/pay',
            //   query: {
            //     id: this.discountOrderData.orderIdList[0],
            //     money: this.discountOrderData.totalPrice,
            //     orderCode: this.discountOrderData.masterOrderCode,
            //     type: 1,
            //   },
            // })
          }
        }
      },
      //合并支付/取消订单 取消按钮
      discountOrderCancel() {
        if (this.discountOrderType == 'cancelOrder') {
          //直接买了 跳转支付页面
          if(appData && appData.appScheme == 'wsf') {
            this.commonPay(this.discountOrderData.totalPrice, this.discountOrderData.masterOrderCode, appData)
          } else {
            this.$router.push({
              path: '/zhPay',
              query: { money: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, type: 1, id: this.discountOrderData.orderIdList[0], serviceType: 100 },
            })
            // this.$router.push({
            //   path: '/pay',
            //   query: {
            //     id: this.discountOrderData.orderIdList[0],
            //     money: this.discountOrderData.totalPrice,
            //     orderCode: this.discountOrderData.masterOrderCode,
            //     type: 1,
            //   },
            // })
          }
        } else if (this.discountOrderType == 'goPayOrder') {
          //取消 关闭弹窗
          this.discountOrderDialog = false
          this.discountOrderType = ''
          this.discountOrderData = {}
        }
      },
      // 订单操作
      async opeationOreder(data, text) {
        console.log(data, text)
        if (text == '删除订单' || text == '确认收货' || text == '发票服务' || text == '取消申请') {
          if (text == '删除订单') {
            this.isType = 1
          } else if (text == '确认收货') {
            try {
              //判断是否有退款中的商品
              let res=await judgeRefund({orderId:data.id})
              if(res.code == 200){
                //有退款
                if (res.data == 2002){
                  this.isType = 5
                }else{
                  this.isType =2
                }
              }else{
                Toast(res.msg)
                return
              }
            } catch (error) {
              console.log(error);
              return
            }
          } else if (text == '发票服务') {
            this.isType = 3
          } else if (text == '取消申请') {
            this.isType = 4
          }
          this.dialogshow = true
        }
        if (text == '取消订单') {
          if (data.platformCouponCode) {
            checkOrder(data.id).then((res) => {
              this.discountOrderType = 'cancelOrder'
              if (res.data && res.data.orderList.length > 0) {
                this.discountOrderData = res.data
                this.discountOrderDialog = true
              } else {
                this.isShowPoup = true
                this.isVirtual = data.orderType == 7
              }
            })
          } else {
            this.isShowPoup = true
            this.isVirtual = data.orderType == 7
          }
        }
        if (text == '申请退款') {
          this.$router.push({
            path: 'refundorder',
            query: {
              orderId: data.id,
              money: data.price,
              orderCode: data.orderCode,
            },
          })
        }
        if (text == '去支付') {
          this.$refs.orderSecondConfirm.orderOperation(data, '去支付')
        }
        if (text == '再次购买') {
          // 订单详情改成大订单
          let bigOrderList = this.order.orderDetailVos || [];
          let skuInfos = [];
          if (bigOrderList && bigOrderList.length > 0) {

            bigOrderList.forEach(bigOrder => {
              let list = bigOrder.orderSkuWithMarketings;
              if (list && list.length) {
                list.forEach(n => {
                  skuInfos.push(`${n.skuId},${n.num},${bigOrder.storeId},${data.orderType == 14 ? 5 : bigOrder.sourceType}`)
                })
              }
            })
          }
          console.log(skuInfos);
          let params = JSON.stringify({
            ids: [],
            addressId: 0,
            skuInfos: skuInfos,
            isGroup: 0,
            groupId: 0,
            temp: 1, //  判断是否从详情页进入   1 详情  0购物车
            againBuy: 1, // 再次购买
            enterpriseId: data.orderType == 14 ? data.enterpriseId : null,
            orderType: data.orderType
          })
          this.$router.push({
            path: '/settlement',
            query: {
              params: params,
            },
          })
          // settlementDetail(params).then((res) => {
          //   this.$router.push({
          //     path: '/settlement',
          //     query: {
          //       params: params,
          //     },
          //   })
          // })
        }
      },
      // 复制订单编号
      copyOrderCode(code) {
        let oInput = document.createElement('input')
        oInput.value = code
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        Toast('复制成功')
        oInput.remove()
      },
      // 复制卡密
      copyCamilo(code) {
        console.log('复制卡密code：', code)
        let oInput = document.createElement('input')
        oInput.value = code
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        Toast('复制成功')
        oInput.remove()
      },
      // 修改收货地址
      toaddressList() {
        // 正常情况没有orderAttr就不会有修改地址按钮
        if (!this.order.orderAttr) {
          return
        }

        let {
          receiptAddress: addressValue,
          receiptDetailAddress: detailAddress,
          receiptMobile: mobile,
          receiptName: name,
        } = this.order.orderAttr || {}
        // 拼装参数数据
        let params = {
          name,
          mobile,
          detailAddress,
          addressValue,
        }
        params.orderIdList = (this.order.orderDetailVos || []).map(item => {
          return item.id
        })

        this.$router.push({
          path: '/ordereditaddress',
          query: {
            orderdetail: JSON.stringify(params)
          },
        })
      },
      back() {
        this.$router.back()
      },
      // 跳转至店铺
      tostore(storeId) {
        this.$router.push({ path: '/storeindex', query: { storeId: storeId } })
      },
      confirmPay(data) {
        if(appData && appData.appScheme == 'wsf') {
          this.commonPay(data.money, data.masterOrderCode, appData)
        } else {
          this.$router.push({
            path: '/zhPay',
            query: { money: data.money, orderCode: data.masterOrderCode, type: 1, id: data.id, serviceType: 100 },
          })
          // this.$router.push({
          //   path: '/pay',
          //   query: {
          //     id: data.id,
          //     money: data.money,
          //     orderCode: data.masterOrderCode,
          //     type: 1,
          //   },
          // })
        }
      },
      // 监听滚动
      handleScroll() {
        if (!this.$refs.backTop) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop) // 取绝对值
        // 顶部top淡入淡出
        let headerdom = document.getElementById('headerwrapper')
        if (!headerdom || !headerdom.classList) {
          return
        }
        if (scorllTop < 10) {
          headerdom.classList.add('headershow0')
          headerdom.classList.remove('headershow1', 'headershow2', 'headershow3', 'headershow4', 'headershow5')
        } else if (scorllTop >= 10 && scorllTop < 35) {
          headerdom.classList.add('headershow1')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow3', 'headershow4', 'headershow5')
        } else if (scorllTop >= 35 && scorllTop < 60) {
          headerdom.classList.add('headershow2')
          headerdom.classList.remove('headershow0', 'headershow1', 'headershow3', 'headershow4', 'headershow5')
        } else if (scorllTop >= 60 && scorllTop < 85) {
          headerdom.classList.add('headershow3')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow1', 'headershow4', 'headershow5')
        } else if (scorllTop >= 85 && scorllTop < 110) {
          headerdom.classList.add('headershow4')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow1', 'headershow3', 'headershow5')
        } else if (scorllTop >= 110) {
          headerdom.classList.add('headershow5')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow1', 'headershow3', 'headershow4')
        }
        // 回到顶部
        if (scorllTop >= 2500) this.isshowtop = true
        else this.isshowtop = false
      },
      // 回到顶部
      backtop() {
        if (this.isshowtop) this.returntop = true
        else this.returntop = false
      },
      // 展开收起
      open() {
        this.isopen = !this.isopen
      },
      // 展开收起
      openCamilo() {
        this.isOpenCamilo = !this.isOpenCamilo
      },
    },
    beforeDestroy() {
      clearInterval(this.setTimer)
      clearInterval(this.timeInteval)
    },
  }
</script>

<style lang="less" scoped>
  .detailwrapper {
    padding-top: 44px;
  }
  .header {
    .nav{
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 5;
    }
    .nav-title {
      display: flex;
      align-items: center;
      height: 44px;
      line-height: 44px;
      width: 100%;
      text-align: center;
      justify-content: center;
      margin-right: 84px;
    }
    .nav-title__img {
      width: 25px;
      height: 25px;
    }
    .nav-title__word {
      font-size: 20px;
      color: #FF0A35;
      font-weight: 500;
      margin-left: 4px;
    }

    .content {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: 4px;
    }
    .content-status {
      font-size: 13px;
      font-weight: 500;
      color: #191919;
      height: 17px;
      line-height: 17px;
      display: flex;
      align-items: center;
      .van-count-down {
        color: #191919;
        font-size: 13px;
        margin: 0;
      }
    }
    .content-status__desc {
      display: flex;
      margin: 0 10px;
    }

    .topay {
      width: 104px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #FF0A35;
      box-shadow: 0px 4px 16px 0px rgba(86,2,16,0.1);
      border-radius: 16px;
      font-size: 13px;
      font-weight: 400;
      color: #FFFFFF;
      margin-top: 16px;
    }

    .headershow0 {
      background-color: rgba(255, 255, 255, 0);
    }
    .headershow1 {
      background-color: rgba(255, 255, 255, 0.2);
    }
    .headershow2 {
      background-color: rgba(255, 255, 255, 0.4);
    }
    .headershow3 {
      background-color: rgba(255, 255, 255, 0.6);
    }
    .headershow4 {
      background-color: rgba(255, 255, 255, 0.8);
    }
    .headershow5 {
      background-color: rgba(255, 255, 255, 1);
    }
  }

  .main {
    .orderstatus {
      margin-top: 16px;
      padding: 16px 12px;
      background-color: #fff;
      border-radius: 12px;
      .van-notice-bar {
        width: 351px;
        height: 28px;
        background: rgba(255, 69, 12, 0.05);
        box-shadow: 0px 1px 2px 0px rgba(58,0,12,0.1);
        border-radius: 8px;
        padding-left: 0;
        img {
          width: 20px;
          height: 20px;
          margin-left: 8px;
        }
        .van-notice-bar__wrap {
          margin-left: 4px;
          font-size: 13px;
          font-weight: 500;
          color: #FF450C;
          line-height: 17px;
          text-shadow: 0px 1px 2px rgba(75,56,0,0.1);
        }
      }
      &-every {
        width: 100%;
        margin-top: 10px;
      }
      &-every:first-of-type {
        margin-top: 0px;
      }

      &-every__info {
        display: flex;
        align-items: center;
      }
      &-every__img {
        width: 20px;
        height: 20px;
      }
      &-every__content {
        width: 273px;
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        margin-left: 8px;
      }
      &-every__name {
        font-size: 13px;
        font-weight: 500;
        color: #191919;
        height: 17px;
        line-height: 17px;
        display: flex;
        .name {
          max-width: 200px;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-right: 8px;
        }
      }
      &-every__address {
        margin-top: 8px;
      }
      &-every__altaddress {
        width: 42px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 13px;
        box-shadow: 0 0 0 0.5px #C3C3C3;
        margin-left: 8px;
        color: #6E6E6E;
      }

      &-logistics {
        padding: 8px;
        background: rgba(246, 246, 246, 0.5);
        border-radius: 8px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &-logistics__info {
        width: 300px;
      }
      &-logistics__title {
        display: flex;
        align-items: center;
        line-height: 17px;
        font-size: 13px;
        font-weight: 400;
        color: #191919;
        img {
          width: 16px;
          height: 17px;
          margin-right: 4px;
        }
      }
      &-logistics__desc {
        width: 311px;
        font-size: 11px;
        line-height: 15px;
        font-weight: 400;
        color: #999999;
        margin-top: 4px;
      }
      &-logistics__time {
        height: 15px;
        line-height: 15px;
        font-size: 11px;
        font-weight: 400;
        color: #999999;
        margin-top: 4px;
      }
      .right-icon {
        width: 16px;
        height: 16px;
      }
    }

    .module-com {
      width: 351px;
      background: #FFFFFF;
      border-radius: 12px;
      margin: 10px auto 0;
    }
    .orderdetail {
      padding: 6px 0;
      &-every {
        display: flex;
        justify-content: space-between;
        line-height: 17px;
        font-size: 13px;
        font-weight: 400;
        color: #191919;
        padding: 10px 10px 9px 10px;
      }
      &-every__value {
        max-width: 237px;
        word-break: break-all;
      }
      &-every__copy {
        display: inline-block;
        width: 38px;
        height: 17px;
        line-height: 17px;
        text-align: center;
        background: #F7F7F7;
        border-radius: 9px;
        font-size: 11px;
        font-weight: 400;
        color: #444444;
        margin-left: 4px;
      }
    }
    .orderprice {
      padding: 6px 0;
      &-every {
        display: flex;
        justify-content: space-between;
        line-height: 17px;
        font-size: 13px;
        font-weight: 400;
        color: #191919;
        padding: 10px 10px 9px 10px;
      }
      &-every__value {
        max-width: 237px;
        word-break: break-all;
      }
      &-every__value-red {
        color: #FF0A35;
      }
      &-final {
        line-height: 17px;
        font-size: 13px;
        font-weight: 500;
        color: #191919;
        padding: 7px 10px 10px;
        text-align: right;
        span {
          height: 24px;
          line-height: 24px;
          font-size: 20px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #FF0A35;
        }
      }
    }
  }

  .footer {
    height: 48px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 99;
    &-com {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #191919;
      position: relative;
      margin-left: 12px;
      border-radius: 16px;
      box-shadow: 0 0 0 0.5px #C3C3C3;
      padding: 0 12px;
    }
    &-pay {
      background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
      color: #FFFFFF;
      box-shadow: none;
    }
  }
  .needButtomSpace{
    padding-bottom: 42px;
    height: 82px;
  }

  .xq_wntj {
    padding: 0 0.48rem;
    text-align: center;
    /deep/ .guess-warp {
      .guess-title {
        height: 0.72rem;
        line-height: 0.72rem;
        margin: 1.2rem 0 0.48rem;
        padding: unset;
      }
    }
  }

  .backtopactive {
    position: fixed;
    top: 0;
  }

  .discount-order-container {
    .order-auto-box {
      overflow-y: auto;
      height: 260px;
      .discount-order {
        padding-top: 20px;
        .discount-order-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 24px;
          color: #000;
          font-size: 14px;
          .left-part {
            max-width: 203px;
          }
          .right-part {
            font-weight: 500;
          }
        }
        .discount-order-count {
          color: #666;
          line-height: 24px;
          font-size: 14px;
        }
      }
    }
    .order-total-box {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-top: 20px;
      .text {
        color: #000;
        font-size: 14px;
        line-height: 16px;
      }
      .symbol {
        font-size: 11px;
        color: #e60113;
        font-weight: 500;
      }
      .price {
        color: #e60113;
        font-size: 18px;
        font-weight: 600;
        line-height: 18px;
      }
    }
  }

  .backtop {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: fixed;
    bottom: 88px;
    right: 12px;
    width: 40px;
    height: 40px;
    z-index: 99;
    opacity: 0.8;
    background: #191919;
    border-radius: 20px;
    >img {
      width: 14px;
      height: 18px;
    }
    span{
      font-size: 11px;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .fqz-confirm {
    /deep/ .van-button--default {
      background-color: transparent;
    }
  }
</style>
