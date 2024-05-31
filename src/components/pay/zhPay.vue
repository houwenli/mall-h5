<template>
  <div :style="{ overflow:  'hidden' }" class="zh-pay">
    <div class="pay-wraper">
      <top-header v-if="businessType !== 'insurance' && !isCollection && !naviHidden" class="nav-top" :title="'万顺福收银台'" @clickBack="backLastPage"></top-header>
      <div class="totalPricebox">
        <p class="moneybox">
          <span>¥</span>
          <span class="unit">{{ setPrice(money)[0] }}</span>
          <span class="unit">.{{ setPrice(money)[1] }}</span>
        </p>
        <div class="order-business">{{ serviceEnum[serviceType] }}</div>
      </div>

      <!-- 支付方式 -->
      <div class="main-box">
        <!-- 余额支付 -->
        <div class="payway" v-if="passengerEmpower && (balancePay || mixedPay)">
          <div class="payway-list" v-if="preMoney == 0">
            <div>
              <div class="payway-every">
                <div class="payway-every__left">
                  <img class="payimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/payment_wallet%402x.png" />
                  <span class="wallet">余额支付（{{ preMoney }}元）</span>
                </div>
                <div class="pay">
                  <img class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_disabled.png" />
                </div>
              </div>
            </div>
          </div>
          <div class="payway-list" @click="selectBalancePayWay()" v-else>
            <div>
              <div class="payway-every">
                <div class="payway-every__left">
                  <img class="payimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/payment_wallet%402x.png" />
                  <span class="wallet">余额支付（{{ preMoney }}元）</span>
                </div>
                <div class="pay" v-if="!mixedPay">
                  <div v-if="preMoney >= money">
                    <img class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-select.png" v-show="!wxPayWay" />
                    <img class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-def.png"  v-show="wxPayWay" />
                  </div>
                  <img class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_disabled.png" v-else />
                </div>
                <div class="pay" v-else>
                  <img class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-select.png"  v-show="balancePayWay === true" />
                  <img class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-def.png"  v-show="balancePayWay === false" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 三方支付方式 -->
        <div class="payway" v-if="detailsList && detailsList.length>0">
          <div class="payway-list">
            <div v-for="item in detailsList" :key="item.payChannelType" class="payway-list-box">
              <div class="payway-every" @click="paway(item.payChannelType, item)">
                <div class="payway-every__left">
                  <img class="payimg" :src="imgList[item.payChannelType]" mode="" />
                  <span class="wallet">{{ payWay[item.payChannelType] }}</span>
                </div>
                <div class="payway-every__right">
                  <div class="select-falg" :class="{'selected': payChannelType == item.payChannelType }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="footer">
        <a id="public-web-jump-button" href="javascript:" class="weui-btn weui-btn_primary weui-btn_loading">
          <div class="footbtnbox" @click="confirmPay">
            <span v-if="balancePay || payChannelType == 1 || payChannelType == 2" id="public-web-jump-button-loading"
              class="weui-primary-loading weui-primary-loading_transparent">
              立即支付
            </span>
            <span v-else>请选择支付方式</span>
          </div>
        </a>
      </div>
    </div>

    <!-- 二次确认 -->
    <SecondConfirm
    :title="hintDialogText"
      cancleText="我知道了"
      :dialogshow="hintDialogShow"
      @closeBack="hintDialogShow = false"
      :hideConfirmBtn="true"
    ></SecondConfirm>
    <SecondConfirm :title="'确认要离开收银台？'" :cancleText="'继续支付'" :sureText="'确认离开'" :textp="'下单后30分钟订单将被取消，请尽快支付'"
      :textshow="textshow" :dialogshow="dialogshow" @closeBack="closeBack" @rightEvent="rightEvent"></SecondConfirm>
    <!-- 支付密码 -->
    <SecondConfirm title="确定使用余额支付" cancleText="取消" sureText="确认支付" :dialogshow="payPasswordDialog" @closeBack="
  payPasswordDialog = false
      payPassword = ''
    " @rightEvent="prePay">
      <!-- <div class="paypassword" slot="textp">
        <van-field v-show="passwordInput" v-model="payPassword" type="password" :maxlength="16" placeholder="请输入支付密码" clearable />
      </div> -->
    </SecondConfirm>
    <!-- <SecondConfirm
      title="您还未设置支付密码"
      cancleText="取消"
      sureText="去设置"
      :dialogshow="hasPayPasswordDialog"
      @closeBack="hasPayPasswordDialog = false"
      @rightEvent="$router.push('/updatepaypwd')"
    ></SecondConfirm> -->
  </div>
</template>

<script>
import { Toast, Field } from 'vant'
import topHeader from '@/components/order/components/topHeader'
import SecondConfirm from '@/components/commons/SecondConfirm'
import { prePay, alipay, wechatofficialaccountpayparm, wechatH5PayParm, queryUserAsset } from '@/api/pay'
import { isWx, formatPrice, yuanToFen } from '@/utils/utils'
import Cookies from 'js-cookie'
import { selectOneByCondition } from '@/api/personalinfo'
import { regFenToYuan } from '@/utils/utils'
import { getPayList, orderPay, wxSmallUrlLink } from '@/api/smart/pay.js'
import { orderPayCheck } from '@/api/orderlist'
import { getToken } from '@/utils/token'
import { getOpenId } from '@/views/storePay/service'
import { getUsersource } from '@/utils/utils'
import { smartOpenDeepLink } from '@/utils/hybrid'

let paySceneTypeEnum = {
  100: 101, // 普通订单
  200: 201, //
  300: 102, // 集采订单
  600: 401  //保险业务承运险订单
}
export default {
  components: {
    topHeader,
    SecondConfirm,
    [Toast.name]: Toast,
    [Field.name]: Field
  },
  data() {
    const self = this;
    return {
      isCollection: Number(this.$route.query.orderType) === 14,
      businessType: '',
      hintDialogText:'',
      hintDialogShow:false,
      isProcess: false, // 接口是否处理中

      balanceLowType: false, // 判断是否预存款不足 true 不足 false 足
      passwordInput: false, // 是否显示预存款的输入密码
      isWx: isWx(), // 判断是否微信浏览器
      money: Number(this.$route.query.money), // 订单金额
      orderCode: this.$route.query.orderCode, // 订单code
      type: this.$route.query.type, // 订单类型 1 普通订单 3 门店订单
      paySet: {}, //支付设置,
      preMoney: 0, // 预存款
      balancePayAmount:0,
      payPassword: '', // 支付密码
      balancePay: false, // 余额支付
      dialogshow: false,
      textshow: false,
      payPasswordFlag: 0, // 是否设置了支付密码
      payPasswordDialog: false, // 打开支付密码弹窗
      hasPayPasswordDialog: false, // 打开引导设置支付密码的弹窗
      serviceEnum: {
        100: '电商优选',
        200: '话费充值',
        300: '换电业务',
        400: '票务业务',
        500: '酒店民宿',
        600: '保险业务'
      },
      serviceType: this.$route.query.serviceType, // 业务类型
      // 后台反馈这个字段没用，需要赋默认值00000
      cityCode: '00000',// 城市code
      detailsList:[], // 收银台配置列表
      imgList: {
        1: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/zfb-pay.png',
        2: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/wx-pay.png',
      },
      payWay: {
        1: '支付宝支付',
        2: '微信支付'
      },
      payChannelType: '', // 默认支付方式, 第三方支付类型：1.支付宝，2.微信
      wxPayWay: true,
      mixedPay: false, // 是否支持混合支付
      cashDeskId: '', // 收银台id
      payChannelId: '', // 渠道商ID（收银台带入）
      channelType: '', // 	商户类型：1直连 2间连
      balancePayWay: false, // 余额大于支付金额 或 余额小于支付金额 并且余额大于0 为true
      passengerEmpower: 1, // 查询用户是否关联万顺宝余额且授权
      timer: null,
      setTimer: null,
      userInfo: {}, // 用户信息
      startDate: '' // 获取支付时间为调起收银台的时间
    }
  },
  async created() {
    this.userInfo = this.$store.getters.userInfo
    if (!this.userInfo.id) {
      const { data } =  await this.$store.dispatch('user/getUserInfo')
      this.userInfo = data
    }

    // 2023-3-24 接 樊 要求 频闭余额支付
    // this.getAuthorize(1)

    // 获取微信code回调后删除地址code改存本地，换取openId后删除
    if (this.isWx && this.$route.query.code) {
      sessionStorage.setItem('WXCODE', this.$route.query.code)
      let zfInfo = JSON.parse(sessionStorage.getItem('ZhPayRoute'))
      console.log(zfInfo,'zfInfozfInfozfInfozfInfo');
      this.$router.replace({
        path: this.$route.path,
        query: { ...zfInfo }
      })
    }
    this.money = Number(this.$route.query.money)
    this.businessType = this.$route.query.businessType
    this.orderCode = this.$route.query.orderCode
    this.type = this.$route.query.type
    this.serviceType = this.$route.query.serviceType

    this.getZhPayList()

    if(sessionStorage.getItem('zh_pay_time')){
      this.startDate = sessionStorage.getItem('zh_pay_time')
      this.loadOrderDetail(this.orderCode)
    }


    // 微信公众号支付获取openId
    if (this.isWx && sessionStorage.getItem('WXCODE')) {
      this.getOpenId()
    }
  },
  computed: {
    payWayType() {
      // balancePayWay  - 余额大于支付金额 或 余额小于支付金额 并且余额大于0 为true [是否可以余额支付]
			if(this.balancePayWay && !this.wxPayWay) {
				return 0 // 余额支付
			} else if(!this.balancePayWay && this.wxPayWay) {
				return 1 // 三方支付
			} else if(this.balancePayWay && this.wxPayWay){
        if(!this.mixedPay){
          return this.preMoney < this.money ? 1 : 3
        } // 不支持混合支付，金额大于余额则为三方支付，否则可以选择三方支付或则余额支付
				return 2 // 有余额并且有三方支付 为混合支付
			}
		},
    naviHidden(){
      //是否使用APP原生导航
      return this.$route.query.naviHidden && this.$route.query.naviHidden==0
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
    this.timer = null;
    clearTimeout(this.setTimer)

    if(!this.isWx && this.$store.getters.phoneType == 'IOS'){

    } else {
      sessionStorage.removeItem('zh_pay_time')
    }
  },
  methods: {
    // 余额支付方式
    selectBalancePayWay(val) {
      if(!this.wxPayWay || (this.preMoney < this.money && !this.mixedPay) || (this.mixedPay && !this.detailsList.length)) return
      this.balancePayWay = !this.balancePayWay;
      if(this.balancePayWay == true && this.preMoney >= this.money) {
        this.wxPayWay = false
        this.payChannelType = ''
      }
    },
    // 获取收银台配置
    getZhPayList(){
      let params = {
        uid: this.userInfo.id, // 用户id
        businessType: this.serviceType, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
        amount: yuanToFen(this.money), // 待支付金额
        platform: 3 // 客户端 1.APP 2.微信小程序 3.H5
      }
      getPayList(params)
        .then((res) => {
          if (res.code === 200) {
            let result  = res.data || []
            this.detailsList  = result.detailsList || []
            // 如果在微信浏览器中是不支持支付宝支付的
            // userSource-2车主端，车主端是qq浏览器内核
            if(!this.aliPayUse() &&  this.detailsList.length>0){
              this.detailsList =  this.detailsList.filter(item=>{
                return item.payChannelType !=1
              })
            }
            this.balancePay = result.balancePay // 是否支持余额支付
            this.mixedPay = result.mixedPay // 是否支持混合支付
            this.cashDeskId = result.cashDeskId // 收银台id
            // let filterList = this.detailsList.filter((item)=>{
            //   return item.payChannelType == this.payChannelType
            // })
            this.payChannelType = this.detailsList.length > 0 ? this.detailsList[0].payChannelType : ''
            this.payChannelId = this.detailsList.length > 0 ? this.detailsList[0].payChannelId : ''
            this.channelType  = this.detailsList.length > 0 ? this.detailsList[0].channelType : ''
          }
        })
      .catch((err) => {
        this.$toast(err.data.description || err.data.msg);
        this.detailsList  =  []
        this.balancePay = false // 是否支持余额支付
        this.mixedPay = false // 是否支持混合支付
      })
    },
    // 价格展示处理
    setPrice(val) {
      return formatPrice(val).split('.')
    },
    // 获取用户余额授权
    getAuthorize(num) {
      let { passengerId, id } = this.$store.getters.userInfo
      // 防止刷新延迟
      if(!id && num < 3) {
        setTimeout(() => {
          this.getAuthorize(++num)
        }, 4);
        return false
      }
      let params = {
        passengerId,
        phone: this.phone,
      }
      selectOneByCondition(params)
        .then((res) => {
          if (res.code === 200) {
            let data = res.data
            this.passengerEmpower = data.id && data.passengerEmpowerStatus
            if (data.passengerId && data.passengerEmpowerStatus === 1) {
              // this.balancePay = true
              this.queryAllmoney()
            } else {
              this.wxPayWay = true
              this.balancePayWay = false
            }
          }
        })
        .catch((err) => {
        })
    },
    // 继续支付
    closeBack() {
      this.dialogshow = false
    },
    // 确认离开
    rightEvent() {
      window.clearInterval(this.timer)
      this.timer = null;
      clearTimeout(this.setTimer)
      if(this.$route.query.fromSource){
        this.$router.back()
      } else {
        // 智慧生活
        if(getUsersource() == 11) {
          smartOpenDeepLink('wsf://app/orderList')
          return
        }
        // 其他app，跳转壳子
        if(getUsersource() != 4) {
          window.location.replace(`${process.env.SMART_PAGE_DOMAIN}/myOrder?status=0`)
          return
        }
        this.$router.replace({
          path: '/orderlist',
          query: { status: -1 },
        })
      }
    },
    // 支付方式
    paway(data, item) {
      this.payChannelId = item.payChannelId
      this.channelType = item.channelType
      this.payChannelType = data

      if(!this.balancePayWay || +this.preMoney < +this.money) return
      this.wxPayWay = !this.wxPayWay;
      if(this.wxPayWay == true && this.preMoney >= this.money) {
        this.balancePayWay = false
      }
      // if (+this.preMoney >= +this.money) {
      //   this.balancePay = false
      // }
    },


    // 返回
    backLastPage() {
      window.clearInterval(this.timer)
      this.timer = null;
      clearTimeout(this.setTimer)
      this.dialogshow = true
      this.textshow = true
    },

    //查询余额总额
    async queryAllmoney() {
      let res = await queryUserAsset().catch()
      if (res.code === 200) {
        // if(this.$store.state.userSource != 2) {
        //   this.balancePay = true
        // }
        let data = res.data
        this.preMoney = regFenToYuan(data.balance)
        this.balancePayAmount = data.balance
        if (this.preMoney == 0) {
          this.balancePay = false
          this.wxPayWay = true
        } else if (+this.preMoney < +this.money) {
          // this.balancePay = true
          this.wxPayWay = true
        } else {
          // this.balancePay = true
          this.wxPayWay = true
        }
      }
    },
    getDateTime () {
      var date = new Date();
      var sign2 = ":";
      var year = date.getFullYear() // 年
      var month = date.getMonth() + 1; // 月
      var day = date.getDate(); // 日
      var hour = date.getHours(); // 时
      var minutes = date.getMinutes(); // 分
      var seconds = date.getSeconds() //秒
      // 给一位数的数据前面加 “0”
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      this.startDate =  year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
      console.log(this.startDate,'eeeeeeee');
      sessionStorage.setItem('zh_pay_time', this.startDate)
    },
    // 判断是否可以使用支付宝
    aliPayUse() {
      // let ua = navigator.userAgent.toLowerCase()
      return (
        !this.isWx
        // &&
        // navigator.userAgent
        //   .toLowerCase()
        //   .toString()
        //   .indexOf('qqbrowser') < 0 &&
        // ua.match(/QQ/i) != 'qq'
      )
    },

    // 确认支付
    async confirmPay() {
      sessionStorage.removeItem('zh_pay_time')
      let params = {
        orderNo: this.orderCode, // 智慧生活业务订单号
        payType: this.channelType == 1 && this.isWx ? 3 : 5, // 	支付方式:0余额 1 支付宝app支付 2 微信app支付 3 微信公众号支付 4微信小程序支付 5微信H5支付 6支付宝H5支付 7支付宝扫码支付 8微信扫码支付 9云闪付wap支付 10云闪付app控件支付 11京东wap支付 12京东APP支付 13云闪付扫码支付 14微信免密支付 15百度支付 16支付宝小程序支付 17云闪付小程序支付 18招行APP支付 19招行H5支付
        userId: this.userInfo.id, // 用户ID
        businessType: this.serviceType, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
        cashDeskId: this.cashDeskId, //	收银台ID（收银台带入）
        openId: '', // 微信小程序支付必传
        mixedPay: this.mixedPay && this.payWayType == 2 ? true : false,
        paySceneType: this.$route.query.orderType * 1 === 14 ? 102 : paySceneTypeEnum[this.serviceType], // 支付场景 paySceneType	支付场景 101电商订单；201充值订单
        payChannelId: this.payChannelId, // 渠道id
        cityCode: this.cityCode,
        agentType: 'HTML'
      }


      if (!this.balancePay && this.payChannelType != 1 && this.payChannelType != 2) {
        return Toast('请选择支付方式')
      }
      this.getDateTime()
      // 进入页面获取支付状态
      if (!this.timer) {
        this.timer = setTimeout(() => {
          if(this.startDate){
            this.loadOrderDetail(this.orderCode)
          }
        }, 3000)
      }
      if (this.balancePay && this.payChannelType != 1 && this.payChannelType != 2) {
        // this.payPasswordDialog = true
      } else if (this.payChannelType == '1') {
        // 支付宝支付 channelType 直连 - 1 间连 - 2
        params.payType = 6
        this.aliPay(params)
      } else if (this.payChannelType == '2') {
        // 在微信里使用公众号支付
        // channelType 商户类型：1直连 2间连
        console.log(this.channelType,'wwwweeeeeeeeeeerrrrrrrrrr');
        if(this.channelType == 1) {
          if (this.isWx) {
            let { money, orderCode, type, id, serviceType } = this.$route.query
            sessionStorage.setItem(
              'ZhPayRoute',
              JSON.stringify({
                money,
                orderCode,
                type,
                id,
                serviceType
              })
            )
            sessionStorage.setItem(
              'ZhPayParams',
              JSON.stringify(params)
            )
            this.getCode()
          } else {
            // 在h5里面使用微信支付
            this.wechatH5Pay(params)
          }
        } else {
          // 间连走易票联的支付
          // pages/yplPay/yplPay
          // let path = `/phoneChargeModule/pages/homePage/homePage?url=${process.env.SMART_API_SERVE}/api/app/order/service/orderPay&token=${getToken()}&data={"payChannelId":${this.payChannelId},"cityCode":${this.cityCode},"businessType":${this.serviceType},"payType":5,"agentType":"HTML","mixedPay":${this.mixedPay && this.payWayType == 2 ? true : false},"cashDeskId":${this.cashDeskId},"orderNo":${this.orderCode},"paySceneType":${paySceneTypeEnum[this.serviceType]},"userId":${userInfo.id}}&softVersion=1.0.0`
          // console.log(path,'path============');
          // TODO 先使用女王节的页面，上线的时候需要替换为/pages/yplPay/yplPay
          let path = `/productModule/pages/thematicActivity/womensDay/womensDay`
          let query = `url=${process.env.SMART_API_SERVE}/api/app/order/service/orderPay&token=${getToken()}&fromPage=h5&payChannelId=${this.payChannelId}&cityCode=${this.cityCode}&businessType=${this.serviceType}&payType=5&agentType=HTML&mixedPay=${this.mixedPay && this.payWayType == 2 ? true : false}&cashDeskId=${this.cashDeskId}&orderNo=${this.orderCode}&paySceneType=${paySceneTypeEnum[this.serviceType]}&userId=${this.userInfo.id}&softVersion=1.0.0`
          wxSmallUrlLink({path, query}).then((res) => {
            console.log(window,res,'eeeeeeeeeeeeeeee===跳转');
            window.location.href = res.data
          }).catch((error)=>{
            return Toast(error.data.msg)
          })
        }
      }
    },
    getOpenId(){
      let openidParams = {
        code: sessionStorage.getItem('WXCODE'),
      }
      sessionStorage.removeItem('WXCODE')
      try {
        getOpenId(openidParams).then((res)=>{
          console.log(res,'resresresresresresresresopenid');
          if (res.code === 1) {
            let data = res.data
            let params = JSON.parse(sessionStorage.getItem('ZhPayParams'))
            this.wechatofficialPay(params, data.openid.replace(/\"/g, ''))
          }
        })
      } catch (error) {
        console.log(error)
      }

    },
    // 获取code
    getCode() {
      sessionStorage.setItem('getOpenId', 'getOpenId')
      window.location.replace(`https://m.wsfmall.com/static/html/jump.html?backUrl=${window.location.origin}${window.location.pathname}`)
    },
    openWeapp(onBeforeJump) {
        var c = window.c
        const res =  c.callFunction({
          name: 'public',
          data: {
            action: 'getUrlScheme',
          },
        })
        console.warn(res)
        if (onBeforeJump) {
          onBeforeJump()
        }
        location.href = res.result.openlink
    },
    // 微信h5支付
    wechatH5Pay(params) {
      let channel = this.getChannel()
      if(this.businessType == 'insurance'){
        params.insuranceOrder = 1 // 保险支付新增参数
        params.token = this.$route.query.token // 保险支付新增参数
      }
      if (channel) {
        params.channel = channel
      }
      orderPay(params).then((res) => {
        console.log(res,'resresres1');
        switch (res.code) {
          case 200:
            if (this.$store.getters.phoneType == 'IOS') {
              // form.action =  res.data.payResult + "&redirect_url="  + encodeURIComponent(location.origin + `/smartLifeBack?userSource=${this.checkChannel(channel)}`)
              // setTimeout(()=>{
              //   this.$router.push({
              //     path: '/paysuccess',
              //     query: {
              //       agentType: 'HTML',
              //       iosZhiPayResult: JSON.stringify({
              //         orderNo: this.orderCode,
              //         orderType: paySceneTypeEnum[this.serviceType],
              //         startDate: this.startDate})
              //     }
              //   })
              // },3000)

              const alink = document.createElement('a')
              alink.href = res.data.payResult + "&redirect_url="  + encodeURIComponent(location.origin + `/smartLifeBack?userSource=${this.checkChannel(channel)}`)
              alink.click();

            }  else {
              var form = document.createElement('form');
              document.body.appendChild(form);
              form.method = "post";
              form.action =  res.data.payResult;
              form.submit();
              document.body.removeChild(form);
            }
            break
          case -3:
            Toast(res.msg)
            this.toOrderList()
            break
          case -21:
            this.queryAllmoney()
            Toast(res.msg)
            break
          default:
            Toast(res.msg)
            break
        }
      }).catch(error=>{
        console.log(error,'resresres2');

      })
    },

    checkChannel(channel) {
      let userSource = ''
      let typeCode = `${channel}`.substring(0, 4)
      switch (typeCode) {
        // 万顺叫车乘客端
        case '1010':
        case '1050':
        case '1020':
          userSource = 'passenger'
          break
        // 万顺叫车车主端
        case '2010':
        case '2050':
          userSource = 'driver'
          break
        // 万顺云办公
        case '3010':
        case '5050':
          userSource = 'work'
          break
        // 万顺叫车代驾端
        case '6010':
          userSource = 'valetDriving'
          break
      }
      return userSource
    },

    // 公众号支付
    wechatofficialPay(params, openId) {
      if(this.businessType == 'insurance'){
        params.insuranceOrder = 1 // 保险支付新增参数
        params.token = this.$route.query.token // 保险支付新增参数
      }

      orderPay({...params, openId}).then(
        (res) => {
          switch (res.code) {
            case 200:
              this.callPay(JSON.parse(res.data.payResult))
              break
            case -3:
              Toast(res.msg)
              this.toOrderList()
              break
            case -21:
              this.queryAllmoney()
              Toast(res.msg)
              break
            default:
              Toast(res.msg)
              break
          }
        }
      )
    },
    /**
     * 调起支付
     */
    callPay(params) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: params.appId, //公众号名称，由商户传入
          timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: params.nonceStr, //随机串
          package: params.package,
          signType: params.signType, //微信签名方式：
          paySign: params.sign, //微信签名
        },
        function (res) {
          // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            // that.toPaySuccess()
            this.loadOrderDetail(this.orderCode)
          }
        }
      )
    },

    // 支付宝支付
    aliPay(params){
      orderPay(params).then((res) => {
        // if ( this.balancePay && res.code == -21) {
        //   this.queryAllmoney()
        //   Toast(res.msg)
        //   return
        // }
        console.log(res,'ali=======================');
        // 调起阿里支付
        if (res.code == 200) {
          if(this.channelType == 1){
            // 直连
            const div = document.createElement('div')
            div.innerHTML =res.data.payResult
            document.body.appendChild(div)
            document.forms[0].submit()
            document.body.removeChild(div)
          } else {
            // 间连
            const alink = document.createElement('a')
            alink.href = res.data.payResult
            console.log(res.data.payResult,'alink.href=============');
            alink.click();
          }
        } else {
          Toast(res.msg)
          // // 延迟一会让toast提示完整
          // setTimeout(() => {
          //   // 支付错误 跳转到订单列表页面
          //   this.toOrderList()
          // }, 2000)
        }
      }).catch(err=>{
        console.log(err,'err=============');
      })
    },
    async loadOrderDetail(outTradeNo, num = 0) {
      let res = await orderPayCheck({orderNo: outTradeNo, orderType: this.$route.query.orderType * 1 === 14 ? 102 :paySceneTypeEnum[this.serviceType], startDate: this.startDate}).catch((err) => {
      })
      console.log(res,'成功支付2======================');
      if (res && res.code == 200) {
        let money = res.data ? res.data.paidMoney ? res.data.paidMoney.toFixed(2) : '': '';
        let orderType = res.data ? res.data.payStatus ? res.data.payStatus : '': '';
        if(orderType == 'PAID' || orderType == 'FAILED') {
          window.clearInterval(this.timer)
          this.timer = null;
          clearTimeout(this.setTimer)
          sessionStorage.removeItem('zh_pay_time')
          if(this.$route.query.paysuccessCallbackUrl){
            console.log('跳转到保险记录--------')
            window.location.replace(`${process.env.SMART_PAGE_DOMAIN}${this.$route.query.paysuccessCallbackUrl}`)
            return
          }
          // 跳转到支付成功页面
          this.$router.push({
            path: '/paysuccess',
            query: {
              agentType: 'HTML',
              payResult: JSON.stringify({
                type: this.type,
                orderCode: this.orderCode,
                id: this.$route.query.id,
                businessType: 100,
                paidMoney: money,
                payStatus: orderType,
                orderType: this.$route.query.orderType, //集采订单用orderType === 14判断
              })
            },
          })
        } else {
          if(sessionStorage.getItem('zh_pay_time') && num < 6){
            this.setTimer = setTimeout(() => {
              if(num==5){
                sessionStorage.removeItem('zh_pay_time')
              }
              this.loadOrderDetail(outTradeNo, ++num)
            }, 2000)
          }
        }
      }
    },
    // 钱包支付
    async prePay() {
      let res = await queryUserAsset().catch()
      if (res.code === 200) {
        let data = res.data
        if(regFenToYuan(data.balance) < +this.preMoney) {
          this.isProcess = false
          this.payPasswordDialog = false
          Toast('余额变动，已刷新页面')
          // this.balancePay = true
          this.preMoney = regFenToYuan(data.balance)
          this.balancePayAmount = data.balance
          if (this.preMoney == 0) {
            this.balancePay = false
          } else if (+this.preMoney < +this.money) {
            this.balancePay = true
          } else {
            this.balancePay = true
          }
          return
        }

      }
      // if (!this.payPassword) {
      //   Toast('请输入支付密码!')
      //   return
      // }
      if (+this.preMoney < +this.money) {
        this.payPasswordDialog = false
        return Toast('万顺宝余额不足')
      }
      if (this.isProcess) {
        return
      }
      this.isProcess = true
      let params={
        payTypes:[0],
        accessType:null,
        type:this.type,
        orderCode:this.orderCode
      }
      try {
        let res = await prePay(params)
        switch (res.code) {
          case 200:
            this.toPaySuccess()
            break
          case -3:
            Toast(res.msg)
            this.toOrderList()
            break
          case -21:
            this.queryAllmoney()
            Toast(res.msg)
            break
          case -31:
            this.hintDialogShow=true
            this.hintDialogText='亲爱的用户，为保证您的余额使用安全，本月余额支付额度已被限制，请您使用其他支付方式。给您造成的不便敬请谅解。如有疑问，请联系当地分公司或客服4006424888！'
            break
          case -32:
            this.hintDialogShow=true
            this.hintDialogText='亲爱的用户，为保证您的余额使用安全，本月余额支付额度已被限制，请您使用其他支付方式。给您造成的不便敬请谅解。如有疑问，请联系当地分公司或客服4006424888！'
            break
          default:
            Toast(res.msg)
            break
        }
      } catch (error) {
        console.log(error)
      }
      this.isProcess = false
      this.payPasswordDialog = false
    },
    // 跳转到支付成功页面
    toPaySuccess() {
      // 跳转到支付成功页面
      this.$router.push({
        path: '/paysuccess',
        query: {
          agentType: 'HTML',
          payResult: JSON.stringify({
            type: this.type,
            orderCode: this.orderCode,
            id: this.$route.query.id,
            businessType: 100,
            orderType: this.$route.query.orderType, //集采订单用orderType === 14判断
            // paidMoney: money,
            // payStatus: orderType
          })
        }
      })
    },
    showTips() {
      let that = this
      this.$vux.confirm.show({
        title: '确定离开支付?',
        content: '下单后24小时订单将被取消,请尽快支付!',
        confirmText: '确认离开',
        cancelText: '继续支付',
        onConfirm() {
          that.toOrderList()
        },
      })
    },
    // 跳转到订单列表
    toOrderList() {
      if(this.businessType == 'insurance'){
        // 保险逻辑处理
        return
      }
      // 跳转到普通订单列表
      if (this.type == 1) {
        // 智慧生活
        if(getUsersource() == 11) {
          smartOpenDeepLink('wsf://app/orderList')
          return
        }
        // 其他app，跳转壳子
        if(getUsersource() != 4) {
          window.location.href = `${process.env.SMART_PAGE_DOMAIN}/myOrder?status=0`
          return
        }
        this.$router.push({
          path: '/orderlist',
          query: { status: -1 },
        })
      } else if (this.type == 3) {
        // 跳转到全部订单列表
        this.$router.push({
          path: '/storeorderlist',
          query: { status: -1 },
        })
      }
    },
    back() {
      this.showTips()
    },
    // 查询channel状态
    getChannel() {
      let channel = Cookies.get('_wsf_channel')
      // let channel
      if (!channel || channel == '1020') {
        let role = Cookies.get('_wsf_role')
        let platform
        const ua = navigator.userAgent.toLowerCase()
        if (/iPhone|iPad|iPod|iOS/i.test(ua)) {
          platform = 2
        } else if (/Android/i.test(ua)) {
          platform = 1
        } else {
          platform = 0
        }

        if (role == 1 && platform == 1) {
          channel = 1010
        } else if (role == 2 && platform == 1) {
          channel = 2010
        } else if (role == 1 && platform == 2) {
          channel = 1050
        } else if (role == 2 && platform == 2) {
          channel = 2050
        }
      }
      return channel
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .dialog {
  width: 236px;
}
.totalPricebox {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #191919;
  font-size: 13px;
  height: 228px;
  background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/2023-09-25/pay.png);
  background-size: 100% 100%;
  padding-top: 61px;
  .moneybox {
    color: #191919;
    font-size: 0;
    font-family: DINAlternate-Bold, DINAlternate;
    line-height: 30px;
    span {
      font-size: 20px;
      font-weight: bold;
    }
    .unit {
      font-size: 36px;
      font-weight: bold;
    }
  }
}

.tips {
  padding-top: 12px;
  padding-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #191919;
  line-height: 17px;
}
.zh-pay{
  height: 100%;
  .pay-wraper{
    height: 100%;
    background: #F6F6F6;
  }
}
.main-box{
  height: 100%;
  overflow-y: scroll;
  padding: 0px 12px;
  position: relative;
  top: -26px;
  .paybox {
    background: #FFFFFF;
    border-radius: 12px;
    padding: 14px 8px;
    margin: 0 0 12px;
    div {
      height: 52px;
      line-height: 52px;
      padding-left: 40px;
      color: #000;
      position: relative;
      .nochoose {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -0.4rem;
      }
    }

    .wallet {
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/payment_wallet%402x.png') no-repeat left center;
      background-size: 20px;

      span {
        color: #999;
      }
    }

    .zfbbox {
      padding-bottom: 4px;
      box-sizing: content-box;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/zfb-pay.png') no-repeat left center;
      background-size: 32px;
    }

    .wechatbox {
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/wx-pay.png') no-repeat left center;
      background-size: 32px;
    }
  }
}

.paypassword {
  margin-top: 0.48rem;

  /deep/ .van-cell {
    border-radius: 0.4rem;
    padding: 0.4rem 0.72rem;
  }

  /deep/ .van-field__label {
    color: #000;
  }
}

.footer {
  width: 100%;
  background: #fff;
  padding: 4px 12px;
  padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
  position: fixed;
  bottom: 0;
  text-align: center;

  .footbtnbox {
    height: 40px;
    line-height: 40px;
    background:  linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    border-radius: 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
  }
}

.disableWallet {
  opacity: 0.3;
}
/deep/.top-header{
//   background: #FFBE0C !important;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/2023-09-25/pay_header.png) !important;
    background-size: 100% 100% !important;
  .search-left{
    border: none !important;
    background: transparent !important;
  }
  .title-wrapper{
    color: #191919;
  }
}
.payway {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 14px 16px 0px 16px;
  margin-bottom: 12px;
  .payway-title {
    height: 22px;
    font-size: 18px;
    font-weight: 600;
    color: #191919;
    line-height: 22px;
  }
  .payway-every {
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding-bottom: 14px;
    .pay {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0px;
      .payimg {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
      .radioimg {
        width: 16px;
        height: 16px;
      }
    }
  }
  .payway-list-box:not(:last-child){
    .payway-every{
      border-bottom: 1px solid #EEE;
    }
  }
  .payway-list-box:last-child{
    padding-top: 14px;
    padding-bottom: 0;
    .payway-every{
      border-bottom: none;
    }
  }

  .payway-every__left {
    display: flex;
    align-items: center;
    justify-content: center;
    .payimg {
      width: 32px;
      height: 32px;
    }
    .wallet {
      font-size: 16px;
      font-weight: 400;
      color: #191919;
      line-height: 22px;
      margin-left: 8px;
    }
  }
  .payway-every__right {
    display: flex;
    align-items: center;
    justify-content: center;
    .select-falg {
      width: 16px;
      height: 16px;
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-def.png);
      background-size: 100% 100%;
    }
    .select-falg.selected {
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/2023-09-25/cart-sku-select.png);
    }
  }
}
</style>
