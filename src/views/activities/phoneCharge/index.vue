<template>
  <div style="height: 100%">
    <navbartop :title="'手机充值'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <div class="phone-charge">
      <div class="center">
        <topContacts :key="refresh" v-if="numberList && numberList.length != 0" @selectContacts="selectContacts" :list="numberList" :textNum="textNum"/>
        <!-- 输入手机号,弹出输入框 -->
        <div class="phone">
          <div class="charge-num">
            <div class="charge-num-input">
              <van-field
                v-model="telPhone"
                type="tel"
                boder="false"
                maxlength="13"
                placeholder="请输入手机号码"
                @input="onCallInput"
                @paste="onCallInput"
                @blur="onBlur"
              ></van-field>
              <img @click="toManage" class="charge-num-img" :src="`${$oss}/phoneCharge/contacts.png`" alt="" />
            </div>
            <p class="phone-area">
              {{ phoneTag }}
              <span v-if="area">（{{ area }}）</span>
            </p>
          </div>
        </div>
        <!-- 选择充值面额 -->
        <div class="amount">
          <!-- 暂时没有慢充，所以不展示tab -->
          <!-- <van-tabs v-model="active" @change="changeTab" class="tab-warp" title-active-color="#191919" title-inactive-color="#999999">
        <van-tab v-for="item in tabList" :key="item.value" :title="item.label" :name="item.value"> -->
          <!-- 缺省图 -->
          <!-- <div v-if="!haveData" class="nodata">
          <img class="nodata-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/img_blank_history%402x.png" alt="" />
          <span class="nodata-tips">暂无合适面额，请检查手机号</span>
        </div> -->
          <div class="amount-list">
            <div class="amount-top" v-if="haveData">
              <div
                class="top-up-amount"
                :class="[{ 'actived-style': actived === index }]"
                v-for="(item, index) in topUpList"
                :key="item.id"
                @click="onChoose(item, index)"
              >
                <span class="face-value">{{ fenToYuan(item.rechargeAmount, 'rechargeAmount') }}元</span>
                <span v-if="item.realPayAmount !== item.rechargeAmount && item.rechargeAmount > item.realPayAmount" class="price">
                  优惠{{ prePrice(item) }}元
                </span>
              </div>
            </div>
            <p class="top-up-tips" v-if="haveData">
              {{ tips }}
            </p>
          </div>
          <!-- 充值记录 -->
          <div class="foot">
            <div @click="toRechargeRecord">充值记录</div>
            <div class="line"></div>
            <div @click="toTips">温馨提示</div>
          </div>
          <!-- </van-tab>
      </van-tabs> -->
        </div>
      </div>
      <!-- 充值按钮 -->
      <div class="foot-btn">
        <!-- <van-button class="pay-btn" color="linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%)" block @click="area ? toPay() : ''">
          立即充值
          <em v-if="checkVal && checkVal.realPayAmount && area">({{ fenToYuan(checkVal.realPayAmount, 'realPayAmount') }})</em>
        </van-button> -->
        <!-- <integral-popup
          ref="integralPopup"
          :useIntegral.sync="useIntegral" 
          :integralMoney.sync="integralMoney" 
          :integralCfgId.sync="integralCfgId"
          amountUnit="fen"
          :always-show="false"
          :businessType="businessTypeEnum.recharge"
          :orderLastTotalPrice="orderLastTotalPrice">
        </integral-popup> -->

        <van-button :loading="payLoadding" class="pay-btn" color="linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%)" block @click="toPay()">
          立即充值
          <em v-if="checkVal && checkVal.realPayAmount">({{ fenToYuan(checkVal.realPayAmount - integralMoney, 'realPayAmount') }})</em>
        </van-button>
      </div>
      <!-- <van-popup
      class="popup"
      :class="{ 'popup-nohistory': phontList && phontList.length < 1 }"
      v-model="showPopup"
      position="top"
      :overlay-style="{ background: ' #000D1D', opacity: 0.5 }"
    >
      <div class="popup-input">
        <van-field v-model="telPhone" type="digit" :maxlength="11" class="filed" @change="onChange">
          <template #right-icon>
            <img class="filed-icon" @click="onEmpty" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/close%402x.png" alt="" />
          </template>
        </van-field>
      </div>
      -->
    </div>
  </div>
</template>

<script>
  import { isMobilePhone } from '@/utils/validate'
  import { Toast } from 'vant'
  import Big from 'big.js'
  import { getMobileArea, queryPhoneFeeConfig, createOrder, queryRechargeOrderList, selectCustomerCommonPhoneListAndAdd } from '@/api/phoneCharge'
  import navbartop from '@/components/commons/navBartop' // 导航栏
  import topContacts from './component/topContacts.vue'
  import integralPopup from '@/components/integralPopup' // 积分弹窗
  import { appBack } from '@/utils/utils'
  import { getToken } from '@/utils/token'
  import Cookies from 'js-cookie'
  import { getLocation } from '@/utils/location'
  import { BUSINESS_TYPE } from '@/constants/order'
  const appVersion = require('@/../package.json').version
  export default {
    inject: ['reload'],
    components: {
      navbartop,
      topContacts,
      integralPopup
    },
    data() {
      return {
        tel: '',
        telPhone: '',
        area: '',
        textNum: '',
        // tabList: [
        //   { label: '快充', value: 1 },
        //   { label: '慢充', value: 2 },
        // ],
        value: '',
        phoneTag: '充值号码', //充值提示
        show: false,
        Big,
        phontList: [],
        topUpList: [],
        numberList: [],
        active: 1,
        actived: -1,
        checkVal: {
          id: '',
        },
        id: null,
        isConfig: false,
        refresh: new Date().getTime(),
        payLoadding: false,

        useIntegral: 0,
        integralMoney: 0,
        integralCfgId: null,
        businessTypeEnum: Object.freeze(BUSINESS_TYPE),
      }
    },

    computed: {
      tips() {
        const topUpPrompt = '*预计10分钟内到账，请留意运营商短信'
        return topUpPrompt
      },
      haveData() {
        return this.topUpList && this.topUpList.length
      },
      
      orderLastTotalPrice({checkVal}) {
        return checkVal ? checkVal.realPayAmount : 0
      }
    },

    methods: {
      selectContacts(val) {
        this.isConfig = false
        this.textNum = val.mobile
        this.telPhone = this.getPhone(this.textNum)
        this.checkVal = {
          id: '',
        }
        this.phoneTag='充值号码'
        this.getMobileConfig()
      },
      // 优惠价
      prePrice(item) {
        return Big(this.fenToYuan(item.rechargeAmount, 'rechargeAmount'))
          .minus(this.fenToYuan(item.realPayAmount, 'realPayAmount'))
          .toFixed(2)
      },
      backLastPage() {
        appBack(this)
      },
      fenToYuan(data, type) {
        if (!parseInt(data)) {
          return '0.00'
        }
        if (type === 'realPayAmount') {
          return (Math.round((data / 100) * 100) / 100).toFixed(2)
        } else {
          return (Math.round((data / 100) * 100) / 100).toFixed(0)
        }
      },
      // 是否为手机号
      isPhone(val) {
        const text = val.replace(/\s*/g, '')
        if (!val || !isMobilePhone(text)) {
          this.phoneTag = !val ? '号码不能为空' : '号码不正确'
          this.isConfig = true
          let params = {
            cityCode: 0,
            rechargeType: 1,
          }
          this.queryPhoneFeeConfig(params)
          return false
        }
        this.isConfig = false
        this.phoneTag = "充值号码"
        return true
      },
      // 处理手机号
      formatPhone(val) {
        if (val) {
          const matches = /^(\d{3})(\d{4})(\d{4})$/.exec(val)
          if (matches) {
            return matches[1] + ' ' + matches[2] + ' ' + matches[3]
          }
        }
        return val
      },
      // 输入事件
      onCallInput(event) {
        let value = event.replace(/\D/g, '').substr(0, 11) // 不允许输入非数字字符，超过11位数字截取前11位
        setTimeout(() => {
          this.textNum = value
          this.telPhone = this.getPhone(value)
        })
      },
      // 手机号处理成344格式
      getPhone(value) {
        if (value) {
          let len = value.length
          if (len > 3 && len < 8) {
            value = value.replace(/^(\d{3})/g, '$1 ')
          } else if (len >= 8) {
            value = value.replace(/^(\d{3})(\d{4})/g, '$1 $2 ')
          }
          return value
        }
        return ''
      },
      onBlur() {
        if (this.telPhone) {
          this.textNum = this.telPhone.replace(/\s+/g, '')
        } else {
          this.textNum = ''
          this.actived = -1
        }
        if (!this.isPhone(this.textNum)) {
          this.topUpList = []
          this.area = ''
          this.actived = -1
          return
        }
        this.getMobileConfig()
      },
      // 切换tab
      // changeTab(val) {
      //   this.active = val
      //   this.getMobileConfig()
      // },
      //去常用联系人页
      toManage() {
        if(getToken()) {
          this.$router.push({ name: 'oftenPhone', query: { id: this.id } })
        } else {
          this.$router.push({ 
            path: '/login',
            query: { 
              url:'/phoneCharge'
            }
          })
        }
      },
      // 查看充值记录
      toRechargeRecord() {
        if(getToken()) {
          this.$router.push({ path: '/rechargRecord' })
        } else {
          this.$router.push({ 
            path: '/login',
            query: { 
              url:'/phoneCharge'
            }
          })
        }
      },
      // 查看温馨提示
      toTips() {
        if(getToken()) {
          this.$router.push({ path: '/warmReminder' })
        } else {
          this.$router.push({ 
            path: '/login',
            query: { 
              url:'/phoneCharge'
            }
          })
        }
      },
      // 清空第一条以外的历史充值号码
      onHistory() {
        this.phontList = this.phontList.filter((v, i) => i == 0)
      },
      // 选择充值面额
      onChoose(val, index) {
        this.actived = index
        this.checkVal = val
        if(!getToken() && this.actived >= 0) {
          this.$router.push({ 
            path: '/login',
            query: { 
              url:'/phoneCharge'
            }
          })
          return
        }
        
        // 检查积分使用临点
        if (this.integralMoney > this.orderLastTotalPrice) {
          this.$nextTick(() => this.$refs.integralPopup.checkIntegralNum(this.useIntegral))
        }
      },
      commonPay(sendMoney, orderNo, appData){         
        let payParams = {
          "configRequestParams": {
            uid: appData.userId, // 用户id
            businessType: 200, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
            amount: sendMoney, // 待支付金额
            platform: 1 // 客户端 1.APP 2.微信小程序 3.H5
          },  // 拉取收银台参数
          "payRequestParams": {
            orderNo, // 智慧生活业务订单号                   
            userId: appData.userId, // 用户ID
            businessType: 200, // 业务类型   
            paySceneType: 201                                                     
          }, // 收银台支付接口参数
          "showInfo": {
            amount: sendMoney, // 展示金额
            businessTypeName: "话费充值", // 业务线名称
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


      async toPay() {
        // 选中的面额最终支付以售价为准
        if (!this.isPhone(this.textNum)) return
        // 手机号没问题就去确认支付页进行支付
        try {
          this.payLoadding = true
          let orderingPort = Cookies.get('_wsf_channel_name')
          // 智慧生活的接口新增公共参数
          let appData
          try {
            appData = JSON.parse(localStorage.getItem('appData'))
          } catch(e) {
            appData = {}
          }
          const {
            appVersion: appVersionSmart,
            softVersion,
          } = appData || {}

          let orderingArea = ''
          
          await getLocation(true).then(async res => {
            let { areaCode, citycode } = res
            orderingArea = citycode || areaCode.slice(0,4) + '00'
          }).catch(error => {
            console.log(error)
          })
          
          let info = this.checkVal.id ? this.checkVal : this.topUpList[0]
          let res = await createOrder({
            phoneFeeConfigId: info.id,
            rechargePhone: this.textNum,
            integralPoint: this.useIntegral,
            integralCfgId: this.integralCfgId,
            
            rewardBo: {
              orderingPort,
              orderingVersion: appVersionSmart || softVersion || appVersion,
              orderingEquipment: '',
              orderingArea
            }
          })

          const { code, data } = res
          if (code === 200) {
            
            if(data.needPay === 1) {

              this.$router.replace({
                path: '/paysuccess',
                query: { 
                  agentType: 'HTML', 
                  payResult: JSON.stringify({ 
                    paidMoney: data.orderIntegralMoney, 
                    payStatus: 'PAID', 
                    businessType: BUSINESS_TYPE.recharge,
                    orderCode: data.orderNo
                  }) },
              })

              return
            }
            
            let appData = JSON.parse(localStorage.getItem('appData'))
            this.payLoadding = false
            if(appData && appData.appScheme == 'wsf') {
              this.commonPay(data.orderIntegralMoney, data.orderNo, appData)   
              this.$refs.integralPopup.getConfig()
            } else {
              this.$router.push({
                path: '/zhPay',
                query: { money: this.fenToYuan(data.orderIntegralMoney, 'realPayAmount'), orderCode: data.orderNo,   serviceType: 200 },
              })  
              // this.$router.push({
              //   path: '/payConfirm',
              //   query: {
              //     realPayAmount: this.fenToYuan(info.realPayAmount, 'realPayAmount'),
              //     orderCode: res.data,
              //     area: this.area,
              //     rechargeAmount: this.fenToYuan(info.rechargeAmount, 'rechargeAmount'),
              //   },
              // }) 
            }
            
          } else {
            this.reload()
            this.payLoadding = false
            Toast(res.msg)
          }
        } catch (error) {
          this.payLoadding = false
          Toast(error.msg)
        }
      },
      // 查询电话费配置
      async queryPhoneFeeConfig(params) {
        try {
          let data = await queryPhoneFeeConfig(params)
          this.topUpList = data.data || []
          // this.topUpList = []
          if (!this.isConfig) this.onChoose(this.topUpList[0], 0)
        } catch (error) {
          console.log(error)
        }
      },
      async getMobileConfig() {
        try {
          const mobileTypeName = {
            1: '移动',
            2: '联通',
            3: '电信',
          }
          let res = await getMobileArea({ mobile: this.textNum }) // 查询手机号和归属地
          let areaVal = res.data || {}
          if (areaVal.provName && areaVal.mobileCode) {
            this.area = areaVal.provName + areaVal.cityName + mobileTypeName[areaVal.mobileCode]
          } else if (!areaVal.mobileCode) {
            // Toast('未发现对应运营商，请核对是否正确')
            this.area = ''
          } else {
            this.area = ''
          }
          if (res && res.code === 200) {
            const params = {
              cityCode: Number(areaVal.cityCode),
              rechargeType: 1,
            }
            this.queryPhoneFeeConfig(params)
          }
        } catch (error) {
          console.log(error)
        }
      },
      //查询常用联系人
      async selectCustomerCommonPhoneListAndAdd(val) {
        try {
          let res = await selectCustomerCommonPhoneListAndAdd({})
          if (res && res.code == 200) {
            this.numberList = res.data
            this.refresh = new Date().getTime()
            this.id = res.data[0].id
            // 第一次进来时
            if (val && this.numberList.length > 0) {
              this.selectContacts(this.numberList[0])
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
    },
    mounted() {
      //APP获取token可能较慢
      setTimeout(() => {
        if(getToken()){
          this.selectCustomerCommonPhoneListAndAdd('one')
        } else {
          let params = {
            cityCode: 0,
            rechargeType: 1,
          }
          this.queryPhoneFeeConfig(params)
        }
      }, 500);
    },
  }
</script>

<style lang="less" scoped>
  @import './component/style/index.less';
  .integral-popup {
    background-color: #f6f6f6;
    border-radius: 8px;
    margin-top: 4px;
    /deep/.van-cell {
      padding: 0 12px;
      height: 32px;
    }
  }
</style>
