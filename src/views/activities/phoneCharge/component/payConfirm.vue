<template>
  <div :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <navbartop :title="'万顺福收银台'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <div class="pay-confirm">
      <!-- <p>充值金额</p> -->
      <p class="moneybox">
        <span class="unit">¥</span>
        {{ money }}
      </p>
      <!-- 归属地加面额 -->
      <p>{{ payInfo }}</p>
    </div>
    <!-- 支付方式 -->
    <div class="paybox">
      <div class="wechatbox" @click="paway(2)">
        微信支付
        <img src="@/assets/img/cat_Selected@2x.png" alt="" class="nochoose" v-if="payType == 2" />
        <img src="@/assets/img/cat_ns@2x.png" alt="" class="nochoose" v-else />
      </div>
      <div class="zfbbox" @click="paway(1)" v-show="aliPayUse()">
        支付宝
        <img src="@/assets/img/cat_Selected@2x.png" alt="" class="nochoose" v-if="payType == 1" />
        <img src="@/assets/img/cat_ns@2x.png" alt="" class="nochoose" v-else />
      </div>
    </div>

    <div class="footer">
      <div class="footbtnbox" @click="confirmPay">
        <span v-if="payType == 1 || payType == 2">{{ payType == 1 ? '支付宝支付 ¥' : '微信支付 ¥' }}{{ subMoney }}</span>
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
    <SecondConfirm
      :title="'确认要离开收银台？'"
      :cancleText="'继续支付'"
      :sureText="'确认离开'"
      :textshow="textshow"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
    ></SecondConfirm>
  </div>
</template>

<script>
import { Toast, Field } from 'vant'
import navbartop from '@/components/commons/navBartop'
import SecondConfirm from '@/components/commons/SecondConfirm'
import { queryPaySet, alipay, wechatofficialaccountpayparm, wechatH5PayParm } from '@/api/pay'
import { isWx } from '@/utils/utils'
import Cookies from 'js-cookie'
export default {
  components: {
    navbartop,
    SecondConfirm,
    [Toast.name]: Toast,
    [Field.name]: Field,
  },
  data() {
    return {
      hintDialogText: '',
      hintDialogShow: false,
      payType: 2, // 支付类型 1 支付宝 2 微信 3 预存款
      isWx: isWx(), // 判断是否微信浏览器
      money: '', // 订单金额
      orderCode: this.$route.query.orderCode, // 订单code
      type: 1, // 订单类型 1 普通订单 3 门店订单
      paySet: {}, //支付设置,
      payPassword: '', // 支付密码
      dialogshow: false,
      textshow: false,
      payPasswordFlag: 0, // 是否设置了支付密码
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.queryPaySet()
      .then((res) => {
        if (this.$store.state.userSource == 2) {
          return
        }
      })
      .catch((err) => {
        if (this.$store.state.userSource == 2) {
          return
        }
      })
  },
  mounted() {
    this.money = Number(this.$route.query.realPayAmount).toFixed(2)
  },
  computed: {
    // 显示支付金额
    subMoney() {
      return this.money
    },
    payInfo() {
      if(this.$route.query.rechargeAmount) {
        return this.$route.query.area + this.$route.query.rechargeAmount + '元'
      }
      return ''
    }
  },
  methods: {
    // 继续支付
    closeBack() {
      this.dialogshow = false
    },
    // 确认离开
    rightEvent() {
      if (this.$route.query.fromSource) {
        this.$router.back()
      } else {
        this.$router.push({
          path: '/phoneCharge',
          query: { status: -1 },
        })
      }
    },
    // 支付方式
    paway(data) {
      this.payType = data
    },

    // 返回
    backLastPage() {
      this.dialogshow = true
      this.textshow = true
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
          navigator.userAgent.toLowerCase().toString().indexOf('qqbrowser') < 0 &&
          ua.match(/QQ/i) != 'qq'
        )
      }
    },
    // 判断是否可以使用微信
    wxPayUse() {
      // 后台开启了微信支付
      return this.paySet.wechatPaySet && this.paySet.wechatPaySet.isUse == '1'
    },
    // 查询支付设置
    queryPaySet() {
      return new Promise((resolve, reject) => {
        queryPaySet()
          .then((res) => {
            this.paySet = res.data
            this.payPasswordFlag = res.data.payPasswordFlag
            resolve()
          })
          .catch((err) => reject())
      })
    },
    // 确认支付
    confirmPay() {
      if (this.payType != 1 && this.payType != 2) {
        return Toast('请选择支付方式')
      }
      if (this.payType == '1') {
        // 支付宝支付
        this.aliPay()
      } else if (this.payType == '2') {
        // 在微信里使用公众号支付
        if (this.isWx) {
          this.wechatofficialPay()
        } else {
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
        payTypes: [2],
        accessType: 2, // h5的为2
        type: this.type,
        orderCode: this.orderCode,
        rechargeOrder: 1, //是否为充话费，0否，1是
      }
      if (channel) {
        reqData.channel = channel
      }
      localStorage.setItem('wxzf_id', this.orderCode)
      wechatH5PayParm(reqData).then((res) => {
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
          default:
            Toast(res.msg)
            break
        }
      })
    },
    // 公众号支付
    wechatofficialPay() {
      let params = {
        payTypes: [2],
        accessType: 1,
        type: this.type,
        orderCode: this.orderCode,
        rechargeOrder: 1, //是否为充话费，0否，1是
      }

      wechatofficialaccountpayparm(params).then((res) => {
        switch (res.code) {
          case 200:
            this.callPay(res.data)
            break
          case -3:
            Toast(res.msg)
            this.toOrderList()
            break
          default:
            Toast(res.msg)
            break
        }
      })
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
            console.log("话费充值确认支付时触发，去到结果页")
            that.toPaySuccess()
          }
        }
      )
    },

    // 支付宝支付
    aliPay() {
      let reqData = {
        payTypes: [3],
        type: this.type,
        orderCode: this.orderCode, //选择的面额的订单号
        rechargeOrder: 1, //是否为充话费，0否，1是
      }
      alipay(reqData).then((res) => {
        // 调起阿里支付
        if (res.code == 200) {
          const div = document.createElement('div')
          div.innerHTML = res.data
          document.body.appendChild(div)
          document.forms[0].submit()
          document.body.removeChild(div)
          // TODO
          if (this.$store.getters.phoneType == 'IOS') {
            setTimeout(() => {
              this.toPaySuccess()
            }, 3000)
          }
        } else {
          // 支付错误 跳转到话费充值首页
          this.toOrderList()
          Toast(res.msg)
        }
      })
    },
    // 跳转到支付成功页面
    toPaySuccess() {
      let spuId = this.$route.query.spuId
      // 跳转到支付成功页面
      this.$router.push({
        path: '/rechargSuccess',
        query: { type: this.type, orderCode: this.orderCode },
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
          this.$router.push({
            path: '/phoneCharge',
            query: { status: -1 },
          })
        },
      })
    },
    // 跳转到话费充值页
    toOrderList() {
      this.$router.push({
        path: '/phoneCharge'
      })
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
@import './style/payConfirm.less';
</style>
