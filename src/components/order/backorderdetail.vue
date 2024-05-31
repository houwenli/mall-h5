<template>
  <div style="height:100%; padding-bottom: .6rem">
    <!-- <x-header :left-options="{ backText: '' }">进度详情</x-header> -->

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <span slot="title">{{ backOrder.backCode }}</span>
        <span>{{ backorderstatus[backOrder.status] }}</span>
      </cell>
    </group>

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <ul class="searchlist-normal clearfix recordlist" style="margin-top: 0">
        <!-- <li v-for="(orderSku,index) in backOrder.orderSkus" :key="index" class="normal-list" style="height: 112px"> -->
        <li v-for="(orderSku, index) in backOrder.orderSkus" :key="index" class="normal-list" style="height: auto">
          <div class="pro-img"><img :src="orderSku.skuImage" /></div>
          <div class="product-info-box product-info-box-order">
            <div class="product-name">{{ orderSku.skuName }}</div>
            <div>{{ orderSku.skuSpecs }}</div>
            <div class="product-price-m">
              <em>¥{{ formatPrice(orderSku.unitPrice) }}</em>
              <span style="float: right">x{{ orderSku.returnNum }}</span>
            </div>
          </div>
        </li>
      </ul>
    </group>

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell :title="backOrder.type == '1' ? '退款原因' : '退货原因'">{{ backReason[backOrder.reason] }}</cell>
      <cell title="退货方式" v-if="backOrder.type == '2'">快递</cell>
      <cell title="凭据类型" v-if="backOrder.type == '2'">{{ proofType[backOrder.credential] }}</cell>
      <cell title="问题说明">
        <span slot="inline-desc">{{ backOrder.desc }}</span>
      </cell>
      <cell style="padding: 0" v-if="backOrder.type == '2'">
        <uploader slot="inline-desc" :readonly="true" title="问题凭证" v-model="imageList" limit="3"></uploader>
      </cell>
    </group>

    <group class="noTopBoderCells" style="margin-top: .6rem" v-for="(backOrderLog, i) in backOrder.backOrderLogs" :key="i">
      <cell>
        <span slot="title">{{ backOrderLog.createTime }}</span>
        <span>{{ getBackOrderLogTitle(backOrderLog) }}</span>
      </cell>
      <cell>
        <span slot="title">{{ backOrderLog.message ? backOrderLog.message : '' }}</span>
      </cell>
    </group>
  </div>
</template>

<script>
  import { XHeader, Checklist, Group, Cell } from 'vux'

  import Uploader from 'vux-uploader-component'

  import { formatPrice } from '@/utils/utils'

  import { queryBackOrderDetail } from '@/api/backorderlist'

  export default {
    components: {
      XHeader,
      Checklist,
      Group,
      Cell,
      Uploader,
    },
    data() {
      return {
        formatPrice: formatPrice, // 格式化金额
        backorderstatus: {
          '1': '退款申请',
          '2': '退款成功',
          '3': '退款拒绝',
          '4': '退货申请',
          '5': '退货拒绝',
          '6': '待用户填写物流',
          '7': '待商家收货',
          '8': '退货完成',
          '9': '退货失败',
        }, // 退单状态
        backReason: {
          '1': '不想买了',
          '2': '收货人信息有误',
          '3': '未按指定时间发货',
          '4': '其他',
          '5': '不想买了',
          '6': '商品质量问题',
          '7': '收到商品与描述不符',
          '8': '其他',
        }, // 退单原因
        proofType: {
          0: '没有任何凭证',
          1: '有发票',
          2: '有质检报告',
        }, // 凭证依据
        backOrderLogTitle: {
          '1': '退款申请',
          '2': '退款成功',
          '3': '退款拒绝',
          '4': '退货申请',
          '5': '退货拒绝',
          '6': '待用户填写物流',
          '7': '待商家收货',
          '8': '退货完成',
          '9': '退货失败',
        }, // 退单状态
        backOrder: {}, // 退单信息
        imageList: [], // 凭证图片列表
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryBackOrderDetail(this.$route.query.id)
    },
    methods: {
      // 查询退单详情
      queryBackOrderDetail(id) {
        let that = this
        queryBackOrderDetail(id).then((res) => {
          if (res.flag && res.data) {
            that.backOrder = res.data
            // 申请凭证图片列表
            if (res.data.picsLists && res.data.picsLists.length > 0) {
              that.imageList = res.data.picsLists.map((pic) => {
                let image = {}
                image.url = pic
                return image
              })
            }
          }
        })
      },
      // 获取退单操作日志
      getBackOrderLogTitle(backOrderLog) {
        let that = this
        if (backOrderLog.status == '1') {
          return '申请退款审核(操作:顾客)'
        } else if (backOrderLog.status == '2') {
          return '退款' + that.backOrder.backPrice.toFixed(2) + '元成功(操作:平台)'
        } else if (backOrderLog.status == '3') {
          return '退款审核不通过(操作:平台)'
        } else if (backOrderLog.status == '4') {
          return '申请退货审核(操作:顾客)'
        } else if (backOrderLog.status == '5') {
          return '拒绝退货(操作:平台)'
        } else if (backOrderLog.status == '6') {
          return '审核通过(操作:平台)'
        } else if (backOrderLog.status == '7') {
          return '填写快递信息(操作:顾客)'
        } else if (backOrderLog.status == '8') {
          return '退款' + that.backOrder.realBackPrice.toFixed(2) + '元成功(操作:平台)'
        } else if (backOrderLog.status == '3') {
          return '拒绝退货(操作:平台)'
        } else {
          return ''
        }
      },
    },
  }
</script>
