<template>
  <!-- 详情 -->
  <div style="height: 100%">
    <navbartop :title="'订单详情'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <div class="record-details">
      <!-- 充值状态 -->
      <div class="info record">
        <div class="record-status">
          <img class="img-url" :src="statusImg" alt="" />
          <span class="text">{{ statusText }}</span>
          <div v-if="info.rechargeStatus === 1" class="recharge-text">{{ rechargeText }}</div>
        </div>

        <div v-for="item in recordList" :key="item.id" class="info-for" :class="{'for-record': item.value ==  'rechargeAmount'}">
          <span class="info-gray">{{ item.label }}</span>
          <span class="info-black">
            {{ getVal(info[item.value], item.value) }}
            <span v-if="item.value === 'rechargeAmount'">元</span>
          </span>
        </div>
        <div v-for="(item, inx) in recordPriceList" :key="item.id" class="info-for">
          <span class="info-black">{{ item.label }}</span>
          <span class="info-black" :class="{ 'info-red': item.value === 'realPayAmount' && inx == recordPriceList.length - 1}">
            <span v-if="item.value === 'realPayAmount'">￥</span>{{ getVal(info[item.value], item.value) }}
          </span>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="info order">
        <div v-for="(item, i) in orderList" :key="item.id" class="info-for">
          <span class="info-gray">{{ item.label }}</span>
          <span class="info-black">
            {{ getVal(info[item.value], item.value) }}
            <!-- 复制订单号 -->
            <img
              v-if="item.value === 'orderNo' && info[item.value]"
              class="right-img"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/ic_copy%402x.png"
              @click="onCopy(info[item.value])"
              alt=""
            />
          </span>
        </div>
        <!-- 联系客服 -->
        <div class="info-customer">
          <img class="customer-image" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/Customer%20service%402x.png" alt="" />
          <span class="customer-text">客服电话：4006424888</span>
        </div>
      </div>
      <!-- 退款情况  只有充值失败展示 -->
      <div v-if="info.rechargeStatus === 3" class="info refund">
        <div v-for="item in refundList" :key="item.id" class="info-for">
          <span class="info-black">{{ item.label }}</span>
          <span class="info-black" :class="{ 'info-red': item.value === 'refundAmount' }">
            <span v-if="item.value === 'refundAmount'">￥</span>{{ getVal(info[item.value], item.value) }}</span>
        </div>
        <div class="system-reson">由于系统原因导致充值失败，已自动将该充值款原路退回您的账户，请您注意查收~</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { queryRechargeOrderDetail } from '@/api/phoneCharge'
import navbartop from '@/components/commons/navBartop' // 导航栏
import {getUsersource} from '@/utils/utils'
import { smartOpenDeepLink } from '@/utils/hybrid'
import { appBack } from '@/utils/utils'
export default {
  components: {
    navbartop,
  },
  data() {
    return {
      orderNo: '',
      info: {},
      recordList: [
        { id: 1, label: '充值号码', value: 'rechargePhone' },
        { id: 2, label: '充值面额', value: 'rechargeAmount' },
      ],
      recordPriceList: [
        { id: 3, label: '商品总价', value: 'realPayAmount' },
        { id: 4, label: '实付金', value: 'realPayAmount' },
      ],
      orderList: [
        { id: 5, label: '订单编号', value: 'orderNo' },
        { id: 6, label: '支付方式', value: 'mixedPayChannel' },
        { id: 7, label: '交易流水号', value: 'payTradeSerialNo' },
        { id: 8, label: '付款时间', value: 'payTime' }
      ],
      refundList: [
        { id: 10, label: '退款总金额', value: 'refundAmount' },
        { id: 11, label: '退款方式', value: 'backtracking' },
      ],
    }
  },
  mounted() {
    this.orderNo = this.$route.query.orderNo

    // 延时调用，防止token未获取到
    setTimeout(() => {
      this.onSearch()
    }, 500);
  },
  computed: {
    statusImg() {
      // 1充值中,2充值成功，3充值失败
      const imgUrl = {
        0: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/In_payment%402x.png',
        1: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/In_payment%402x.png',
        2: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/pay_success%402x.png',
        3: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/failure%402x.png',
      }
      return imgUrl[this.info.rechargeStatus]
    },
    statusText() {
      const text = {
        0: '充值中',
        1: '充值中',
        2: '充值成功！',
        3: '充值失败！',
      }
      return text[this.info.rechargeStatus]
    },
    channel() {
      return {
        '1': '微信',
        '2': '支付宝',
        '3': '福气值'
      }
    },
    rechargeText() {
      return `预计付款完成后${this.info.rechargeType === 1 ? '10分钟' : '72小时'}左右到账，请关注短信～`
    }
  },
  methods: {
    onCopy(code) {
      let oInput = document.createElement('input')
      oInput.value = code
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      Toast('复制成功')
      oInput.remove()
    },
    // 查询详情信息
    async onSearch() {
      try {
        let res = await queryRechargeOrderDetail({ orderNo: this.orderNo })
        if (res.code === 200) {
          this.info = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    getVal(val, type) {
      if (['refundAmount','rechargeAmount','realPayAmount'].includes(type)) return this.fenToYuan(val)
      if (type === 'mixedPayChannel') return val
      if( type === 'serialNo')  return this.info.rechargeStatus === 3 ? this.info.refundTradeSerialNo : this.info.payTradeSerialNo
      if( type === 'backtracking') {
        return `原路退回(${this.info.mixedPayChannel})`
      }
      if (val) return val
      return '-'
    },
    fenToYuan(data) {
      if (!parseInt(data)) {
        return '0.00'
      }
      return (Math.round((data / 100) * 100) / 100).toFixed(2)
    },
    backLastPage() {
      if(getUsersource() == 11) {
        smartOpenDeepLink('wsf://app/orderList?finish=1')
      } else {
        appBack(this)
        // this.$router.push({ path: '/rechargRecord' })
      }
    }
  },
}
</script>

<style lang="less" scoped>
@import './style/recordDetails.less';
</style>