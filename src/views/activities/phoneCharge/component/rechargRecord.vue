<template>
  <!-- 充值记录 -->
  <div style="height: 100%">
    <navbartop :title="'充值记录'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <div class="recharg-record">
      <!-- <van-search class="search" v-model="searchValue" show-action clearable placeholder="输入商品名称" @search="onSearch">
        <template #left-icon>
              <div class="search-icon-img">
                  <img src="@/assets/img/search_goods.png" alt="" />
              </div>
          </template>
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search> -->
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="success"> -->
      <div v-if="!haveData" class="nodata">
        <img class="nodata-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/img_blank_history%402x.png" alt="" />
        <span class="nodata-tips">暂无充值记录</span>
      </div>
      <div v-else>
        <!-- <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad"> -->
        <div class="commodity" v-for="item in recordList" :key="item.id">
          <div class="commodity-title" @click="toDetail(item.orderNo)">
            <span class="title-left">{{ getVal(item.orderType, 'orderType') }}</span>
            <span :style="`color: ${{ '0': '#FF8000', '1': '#FF8000', '2': '#08B638', '3': '#DE3A38' }[item.rechargeStatus + '']}`">
              {{ getStatus(item.rechargeStatus) }}
            </span>
          </div>
          <div class="commodity-info" @click="toDetail(item.orderNo)">
            <p v-for="it in infoList" :key="it.id" class="info">
              <span class="info-left" :class="{ 'actual-payment': it.value === 'realPayAmount' }">{{ it.label }}</span>
              <span class="info-right" :class="{ 'right-red': it.value === 'realPayAmount' }">
                <span v-if="it.value === 'realPayAmount'">￥</span>
                {{ getVal(item[it.value], it.value) }}
                <span v-if="it.value === 'rechargeAmount'">元</span>
              </span>
            </p>
          </div>
          <div class="commodity-btn">
            <!-- 充值成功的订单可以删除 -->
            <van-button v-if="item.rechargeStatus === 2" class="btn-round del" round plain color="#999999" @click="onDelete(item.orderNo)">删除订单</van-button>
            <van-button class="btn-round" round plain color="#FF0A35" @click="onBuy">再次购买</van-button>
          </div>
        </div>
        <!-- </van-list> -->
      </div>
      <!-- </van-pull-refresh> -->
      <SecondConfirm
        :title="'是否删除该订单？'"
        :cancleText="'取消'"
        :sureText="'确定'"
        :textshow="textshow"
        :dialogshow="dialogshow"
        @closeBack="closeBack"
        @rightEvent="rightEvent"
      ></SecondConfirm>
    </div>
  </div>
</template>

<script>
import { queryRechargeOrderList, deleteRechargeOrder } from '@/api/phoneCharge'
import { Toast } from 'vant'
import SecondConfirm from '@/components/commons/SecondConfirm'
import navbartop from '@/components/commons/navBartop' // 导航栏
import { appBack } from '@/utils/utils'
export default {
  components: {
    SecondConfirm,
    navbartop
  },
  data() {
    return {
      searchValue: '',
      recordList: [],
      infoList: [
        { id: 1, label: '充值号码', value: 'rechargePhone' },
        { id: 2, label: '充值面额', value: 'rechargeAmount' },
        { id: 3, label: '付款时间', value: 'payTime' },
        { id: 4, label: '实付款', value: 'realPayAmount' },
      ],
      isLoading: true,
      success: '刷新成功',
      loading: false,
      finished: false,
      params: {
        pageNum: 0,
      },
      dialogshow: false,
      textshow: false,
      orderNo: '',
    }
  },
  computed: {
    haveData() {
      return this.recordList && this.recordList.length
    },
    chargeType() {
      return {
        1: '话费充值'
      }
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    fenToYuan(data) {
      if (!parseInt(data)) {
        return '0.00'
      }
      return (Math.round((data / 100) * 100) / 100).toFixed(2)
    },
    getVal(val, type) {
      if (val) {
        if (type === 'rechargeAmount' || type === 'realPayAmount') return this.fenToYuan(val)
        if(type === 'orderType') return this.chargeType[val]
        return val
      }
      return '-'
    },
    getStatus(data) {
      const status = {
        0: '充值中',
        1: '充值中',
        2: '充值成功',
        3: '充值失败-自动退款',
      }
      return status[data]
    },
    async onSearch() {
      try {
        let res = await queryRechargeOrderList({})
        this.recordList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    toDetail(data) {
      this.$router.push({ path: '/recordDetails', query: { orderNo: data } })
    },
    // 再次购买话费
    onBuy() {
      this.$router.push('phoneCharge')
    },
    // 删除充值订单
    onDelete(val) {
      this.dialogshow = true
      this.orderNo = val
    },
    // 取消
    closeBack() {
      this.dialogshow = false
    },
    // 确认删除
    async rightEvent() {
      try {
        let res = await deleteRechargeOrder({ orderNo: this.orderNo })
        if (res.code === 200) {
          Toast('删除成功')
        } else {
          Toast('删除失败')
        }
        this.onSearch()
        this.dialogshow = false
      } catch (error) {
        console.log(error)
      }
    },
    backLastPage() {
      appBack(this)
    },
  },
}
</script>

<style lang="less" scoped>
@import './style/rechargRecord.less';
</style>