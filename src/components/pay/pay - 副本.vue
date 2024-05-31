<template>
  <div :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <!-- <navbartop :title="'万顺福收银台'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop> -->
    <top-header v-if="businessType !== 'insurance'" class="nav-top" :title="'万顺福收银台'" @clickBack="backLastPage"></top-header>
    <div class="totalPricebox">
      <p>订单金额</p>
      <p class="moneybox">
        <span class="unit">¥</span>
        <span>{{ setPrice(money)[0] }}</span>
        <span class="unit">.{{ setPrice(money)[1] }}</span>
      </p>
    </div>

    <!-- 支付方式 -->
    <div class="paybox" v-if="showYuEPay">
      <div class="wallet disableWallet" v-if="this.preMoney == 0">
        万顺宝余额支付
        <span>({{ preMoney }}元)</span>
        <img :src="$oss + '/order/can_choose.png'" alt="" class="nochoose" v-if="yuEPay" />
        <img :src="$oss + '/order/no_choose.png'" alt="" class="nochoose" v-else />
      </div>
      <div class="wallet" @click="selectyuEpay(3)" v-else>
        万顺宝余额支付
        <span>({{ preMoney }}元)</span>
        <img :src="$oss + '/order/can_choose.png'" alt="" class="nochoose" v-if="yuEPay" />
        <img :src="$oss + '/order/no_choose.png'" alt="" class="nochoose" v-else />
      </div>
    </div>
    <div class="paybox">
      <h3 class="tips">第三方支付方式</h3>

      <!-- <div class="wallet" :class="{ disableWallet: this.preMoney == 0 || this.preMoney < this.money }" v-if="this.preMoney == 0 || this.preMoney < this.money">
        我的钱包
        <span>({{ preMoney.toFixed(2) }}元)</span>
        <img src="@/assets/img/cat_Selected@2x.png" alt="" class="nochoose" v-if="payType == 3" />
        <img src="@/assets/img/cat_ns@2x.png" alt="" class="nochoose" v-else />
      </div>
      <div class="wallet" @click="paway(3)" v-else>
        我的钱包
        <span>({{ preMoney.toFixed(2) }}元)</span>
        <img src="@/assets/img/cat_Selected@2x.png" alt="" class="nochoose" v-if="payType == 3" />
        <img src="@/assets/img/cat_ns@2x.png" alt="" class="nochoose" v-else />
      </div> -->
      <div class="wechatbox" @click="paway(2)">
        微信支付
        <img :src="$oss + '/order/can_choose.png'" alt="" class="nochoose" v-if="payType == 2" />
        <img :src="$oss + '/order/no_choose.png'" alt="" class="nochoose" v-else />
      </div>
      <div class="zfbbox" @click="paway(1)" v-show="aliPayUse()">
        支付宝
        <img :src="$oss + '/order/can_choose.png'" alt="" class="nochoose" v-if="payType == 1" />
        <img :src="$oss + '/order/no_choose.png'" alt="" class="nochoose" v-else />
      </div>
    </div>

    <div class="footer">
      <div class="footbtnbox" @click="confirmPay">
        <span v-if="yuEPay || payType == 1 || payType == 2">
          {{ payType == 1 ? '支付宝支付 ¥' : payType == 2 ? '微信支付 ¥' : '万顺宝余额支付 ¥' }}{{ subMoney }}
        </span>
        <span v-else>请选择支付方式</span>
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
// import { XHeader, XButton, Checklist, Group, Cell, Checker, CheckerItem, XInput } from 'vux'
import { Button, Toast, CellGroup, Switch, Field, Stepper } from 'vant'
import topHeader from '@/components/order/components/topHeader'
import SecondConfirm from '@/components/commons/SecondConfirm'
import { queryPaySet, queryAllPredeposit, prePay, alipay, wechatofficialaccountpayparm, wechatH5PayParm, queryUserAsset } from '@/api/pay'
import { isWx, formatPrice } from '@/utils/utils'
import Cookies from 'js-cookie'
import { selectOneByCondition } from '@/api/personalinfo'
import { regFenToYuan } from '@/utils/utils'
export default {
  components: {
    // XHeader,
    // XButton,
    // Checklist,
    // Group,
    // Cell,
    // Checker,
    // CheckerItem,
    // XInput,
    topHeader,
    SecondConfirm,
    [Toast.name]: Toast,
    [Field.name]: Field,
  },
  data() {
    return {
      businessType: this.$route.query.businessType,
      hintDialogText:'',
      hintDialogShow:false,
      isProcess: false, // 接口是否处理中
      commonList: [],
      payType: 2, // 支付类型 1 支付宝 2 微信 3 预存款
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
      yuEPay: false, // 余额支付
      showYuEPay: false, // 显示余额支付
      dialogshow: false,
      textshow: false,
      payPasswordFlag: 0, // 是否设置了支付密码
      payPasswordDialog: false, // 打开支付密码弹窗
      hasPayPasswordDialog: false, // 打开引导设置支付密码的弹窗
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.queryPaySet(this.businessType)
      .then((res) => {
        if(this.$store.state.userSource == 2) {
          return
        }
        // 2023-3-24 接 樊 要求 频闭余额支付
        // this.getAuthorize(1)
      })
      .catch((err) => {
        if(this.$store.state.userSource == 2) {
          return
        }
        // 2023-3-24 接 樊 要求 频闭余额支付
        // this.getAuthorize(1)
      })

    // this.queryAllPredeposit()
  },
  computed: {
    // 显示支付金额
    subMoney() {
      if (this.yuEPay && this.payType != 0) {
        return Math.round((this.money - this.preMoney) * 100) / 100
      } else {
        return this.money
      }
    },
  },
  // watch: {
  //   payType(data) {
  //     if (data == 3) {
  //       if (this.preMoney == 0) {
  //         this.payType = this.aliPayUse() ? 1 : 2
  //         Toast('钱包没钱了')
  //         this.passwordInput = false
  //       } else if (this.preMoney < this.money) {
  //         this.payType = this.aliPayUse() ? 1 : 2
  //         Toast('钱包余额不足')
  //         this.passwordInput = false
  //       }
  //     }
  //   },
  // },
  methods: {
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
            if (data.passengerId && data.passengerEmpowerStatus === 1) {
              // this.showYuEPay = true
              this.queryAllmoney()
            }
            // else {
            //   this.payType = this.aliPayUse() ? 1 : 2
            // }
          }
          // else {
          //   this.payType = this.aliPayUse() ? 1 : 2
          // }
        })
        .catch((err) => {
          // this.payType = this.aliPayUse() ? 1 : 2
        })
    },
    // 继续支付
    closeBack() {
      this.dialogshow = false
    },
    // 确认离开
    rightEvent() {
      if(this.$route.query.fromSource){
        this.$router.back()
      } else {
        this.$router.push({
          path: '/orderlist',
          query: { status: -1 },
        })
      }
    },
    // 支付方式
    paway(data) {
      if (+this.preMoney >= +this.money) {
        this.yuEPay = false
      }
      this.payType = data
      // if (this.payType == 3) this.passwordInput = true
      // else this.passwordInput = false
    },

    // 选择余额支付
    selectyuEpay() {
      this.yuEPay = !this.yuEPay
      if (+this.preMoney >= +this.money && this.yuEPay) {
        // 取消第三方支付
        this.payType = 0
      }
    },

    // 返回
    backLastPage() {
      this.dialogshow = true
      this.textshow = true
    },

    //查询余额总额
    async queryAllmoney() {
      let res = await queryUserAsset().catch()
      if (res.code === 200) {
        if(this.$store.state.userSource != 2) {
          this.showYuEPay = true
        }
        let data = res.data
        this.preMoney = regFenToYuan(data.balance)
        this.balancePayAmount = data.balance
        if (this.preMoney == 0) {
          this.yuEPay = false
        } else if (+this.preMoney < +this.money) {
          this.yuEPay = true
        } else {
          this.yuEPay = true
          this.payType = 0
        }
      }
    },

    //查询预存款总额
    queryAllPredeposit() {
      queryAllPredeposit().then((res) => {
        this.preMoney = res
        if (this.preMoney == 0) {
          // Toast('钱包没钱了')
          this.passwordInput = false
        } else if (+this.preMoney < +this.money) {
          // Toast('钱包余额不足')
          this.passwordInput = false
        } else {
          this.passwordInput = true
        }
        this.balanceLowType = parseFloat(this.preMoney) < parseFloat(this.money)
      })
    },
    // 判断是否可以使用支付宝
    aliPayUse() {
      // 后台开启了支付宝支付，并且不是在微信和QQ里
      if ((window.ws && window.ws.wsShare) || (window.webkit && window.webkit.messageHandlers.wsShare)) {
        return this.paySet.aliPaySet && this.paySet.aliPaySet.isUse == '1'
      } else {
        let ua = navigator.userAgent.toLowerCase()
        return (
          !this.isWx &&
          this.paySet.aliPaySet &&
          this.paySet.aliPaySet.isUse == '1' &&
          navigator.userAgent
            .toLowerCase()
            .toString()
            .indexOf('qqbrowser') < 0 &&
          ua.match(/QQ/i) != 'qq'
        )
      }
    },
    // 判断是否可以使用微信
    wxPayUse() {
      // 后台开启了微信支付
      return this.paySet.wechatPaySet && this.paySet.wechatPaySet.isUse == '1'
    },
    // 判断是否可以使用预存款
    prePayUse() {
      // 后台开启了预存款支付
      return this.paySet.prePaySet && this.paySet.prePaySet.isUse == '1'
    },
    // 查询支付设置
    queryPaySet() {
      return new Promise((resolve, reject) => {
        queryPaySet(this.businessType)
          .then((res) => {
            this.paySet = res.data
            this.payPasswordFlag = res.data.payPasswordFlag
            // this.setDefaultPay();
            resolve()
          })
          .catch((err) => reject())
      })
    },
    // 设置默认的支付方式
    // setDefaultPay() {
    //   // 如果在微信 开启了微信支付 则默认使用微信支付
    //   if (this.isWx) {
    //     if (this.paySet.wechatPaySet && this.paySet.wechatPaySet.isUse == '1') {
    //       this.payType = '2'
    //     } else {
    //       this.payType = '3'
    //     }
    //   } else {
    //     // 在h5里面 首先判断是否开启了支付宝 如果开启了支付包 则默认选中支付宝支付
    //     if (this.paySet.aliPaySet && this.paySet.aliPaySet.isUse == '1') {
    //       this.payType = '1'
    //     } else if (this.paySet.wechatPaySet && this.paySet.wechatPaySet.isUse == '1') {
    //       // 判断是否开启了微信支付 如果开启 则默认微信支付
    //       this.payType = '2'
    //     } else {
    //       this.payType = '3'
    //     }
    //   }
    // },
    //二次查询余额是否变动
    // confirmMoney() {
    //   let res = await queryUserAsset().catch()
    // },
    // 确认支付
    confirmPay() {
      if (!this.yuEPay && this.payType != 1 && this.payType != 2) {
        return Toast('请选择支付方式')
      }
      if (this.yuEPay && this.payType != 1 && this.payType != 2) {
        // 预存款支付 --- 钱包
        // if (this.payPasswordFlag > 0) {
        this.payPasswordDialog = true
        // } else {
        //   this.hasPayPasswordDialog = true
        // }
      } else if (this.payType == '1') {
        // 支付宝支付
        this.aliPay()
      } else if (this.payType == '2') {
        // 在微信里使用公众号支付
        if (this.isWx) {
          this.wechatofficialPay()
        }
        else {
        // 在h5里面使用微信支付
        this.wechatH5Pay()
        }
      }
    },
    // 微信h5支付
    wechatH5Pay() {
      let channel = this.getChannel()
      // isMixedPay 是否混合支付
      let reqData = {
        payTypes:this.yuEPay ? [0,2] : [2],
        accessType:2,
        type: this.type,
        orderCode: this.orderCode,
        orderId: this.$route.query.id,
        isMixedPay: this.yuEPay ? 1 : 0,
        balancePayAmount: this.balancePayAmount,
       }
       if(this.businessType == 'insurance'){
         reqData.insuranceOrder = 1 // 保险支付新增参数
         reqData.token = this.$route.query.token // 保险支付新增参数
       }
      if (channel) {
        reqData.channel = channel
      }
      localStorage.setItem('wxzf_id', this.orderCode)
      wechatH5PayParm(reqData,this.businessType).then((res) => {
        switch (res.code) {
          case 200:
            let form = ''
            form += '<form id="wechatpay_form" action="' + res.data.mwebUrl + '"  method="post" >'
            form += '</form>'
            document.body.innerHTML = form
            document.forms[0].submit()
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
      })
    },
    // 公众号支付
    wechatofficialPay() {
      let params={
        payTypes:this.yuEPay ? [0,2] : [2],
        accessType:1,
        type:this.type,
        orderCode:this.orderCode,
        orderId: this.$route.query.id,
        isMixedPay: this.yuEPay ? 1 : 0,
      }
      if(this.businessType == 'insurance'){
        params.insuranceOrder = 1 // 保险支付新增参数
        params.token = this.$route.query.token // 保险支付新增参数
      }

      wechatofficialaccountpayparm(params,this.businessType).then(
        (res) => {
          switch (res.code) {
            case 200:
              this.callPay(res.data)
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
      let that = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: params.appid, //公众号名称，由商户传入
          timeStamp: params.time_stamp, //时间戳，自1970年以来的秒数
          nonceStr: params.nonce_str, //随机串
          package: params.package_,
          signType: params.sign_type, //微信签名方式：
          paySign: params.pay_sign, //微信签名
        },
        function (res) {
          // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            that.toPaySuccess()
          }
        }
      )
    },

    // 支付宝支付
    aliPay() {
      let reqData={
        payTypes:this.yuEPay ? [0,3] : [3],
        accessType:2,
        type:this.type,
        orderCode:this.orderCode,
        orderId: this.$route.query.id,
        isMixedPay: this.yuEPay ? 1 : 0,
        balancePayAmount: this.balancePayAmount,
      }
      if(this.businessType == 'insurance'){
        reqData.insuranceOrder = 1 // 保险支付新增参数
        reqData.token = this.$route.query.token // 保险支付新增参数
      }
      alipay(reqData,this.businessType).then((res) => {
        if ( this.yuEPay && res.code == -21) {
          this.queryAllmoney()
          Toast(res.msg)
          return
        }
        // 调起阿里支付
        if (res.code == 200) {
          const div = document.createElement('div')
          div.innerHTML = res.data
          document.body.appendChild(div)
          document.forms[0].submit()
          document.body.removeChild(div)
          // TODO
          if (this.$store.getters.phoneType == 'IOS') {
            setTimeout(()=>{
              this.toPaySuccess()
            },3000)
          }
        } else {
          // 支付错误 跳转到订单列表页面
          this.toOrderList()
          Toast(res.msg)
        }
      })
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
          this.showYuEPay = true
          this.preMoney = regFenToYuan(data.balance)
          this.balancePayAmount = data.balance
          if (this.preMoney == 0) {
            this.yuEPay = false
          } else if (+this.preMoney < +this.money) {
            this.yuEPay = true
            this.payType = 2
          } else {
            this.yuEPay = true
            this.payType = 0
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
      let spuId = this.$route.query.spuId
      // 跳转到支付成功页面
      this.$router.push({
        path: '/paysuccess',
        query: { type: this.type, orderCode: this.orderCode, id: this.$route.query.id, businessType: 100 },
      })
    },
    keyboardDown() {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    },
    // showInput() {
    //   if (this.balanceLowType === false) {
    //     this.passwordInput = true
    //   }
    // },
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
  margin: 10px;
  height: 100px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #191919;
  font-size: 13px;
  border-top: 1px solid #f9f9f9;

  // margin-top: 2px;
  .moneybox {
    color: #FF0A35;
    font-size: 0;
    font-family: DINAlternate-Bold, DINAlternate;
    span {
      font-size: 30px;
      font-weight: bold;
    }
    .unit {
      font-size: 16px;
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

.paybox {
  margin: 0 10px;
  background: #ffffff;
  padding: 0 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  div {
    height: 36px;
    line-height: 36px;
    padding-left: 28px;
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
    background: url('../../assets/img/icon_mypredeposits.png') no-repeat left center;
    background-size: 20px;

    span {
      color: #999;
    }
  }

  .zfbbox {
    padding-bottom: 4px;
    box-sizing: content-box;
    background: url('../../assets/img/ali_pay.png') no-repeat left center;
    background-size: 20px;
  }

  .wechatbox {
    background: url('../../assets/img/WeChat@2x.png') no-repeat left center;
    background-size: 20px;
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
    background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
  }
}

.disableWallet {
  opacity: 0.3;
}
</style>
