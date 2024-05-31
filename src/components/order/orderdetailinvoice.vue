<template>
  <div style="height:100%;">
    <!-- <x-header :left-options="{ backText: '' }">发票信息</x-header> -->

    <group class="noTopBoderCells">
      <cell title="发票类型" :inline-desc="invoiceType[order.orderAttr.invoiceType]"></cell>
      <cell title="发票抬头" v-if="order.orderAttr.invoiceType == '1'" :inline-desc="order.orderAttr.invoiceTitle"></cell>
      <cell title="抬头类型" v-if="order.orderAttr.invoiceType == '1'" :inline-desc="invoiceTitleType[order.orderAttr.invoiceTitleType]"></cell>
      <cell title="单位名称" v-if="order.orderAttr.invoiceType == '2'" :inline-desc="order.orderAttr.invoiceCompanyName"></cell>
      <cell
        title="纳税人识别码"
        v-if="(order.orderAttr.invoiceType == '1' && order.orderAttr.invoiceTitleType == '1') || order.orderAttr.invoiceType == '2'"
        :inline-desc="order.orderAttr.invoiceTaxid"
      ></cell>
      <cell title="注册地址" v-if="order.orderAttr.invoiceType == '2'" :inline-desc="order.orderAttr.invoiceRegisterAddress"></cell>
      <cell title="注册电话" v-if="order.orderAttr.invoiceType == '2'" :inline-desc="order.orderAttr.invoiceRegisterMobile"></cell>
      <cell title="开户银行" v-if="order.orderAttr.invoiceType == '2'" :inline-desc="order.orderAttr.invoiceOpenBank"></cell>
      <cell title="银行账户" v-if="order.orderAttr.invoiceType == '2'" :inline-desc="order.orderAttr.invoiceBankAccount"></cell>
      <cell title="发票内容" v-if="order.orderAttr.invoiceType != '0'" :inline-desc="invoiceContent[order.orderAttr.invoiceContent]"></cell>
    </group>
  </div>
</template>

<script>
  import { XHeader, Group, Cell } from 'vux'

  import { queryOrderDetail } from '@/api/orderlist'

  export default {
    components: {
      XHeader,
      Group,
      Cell,
    },
    data() {
      return {
        invoiceType: { '0': '不开发票', '1': '增值税普票', '2': '增值税专票' }, // 发票类型
        invoiceContent: { '1': '商品明细', '2': '商品类别' }, // 发票内容
        invoiceTitleType: { '1': '企业', '2': '个人' }, // 发票抬头类型
        order: { orderAttr: {} }, // 订单详情信息
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg')
      this.queryOrderDetail(this.$route.query.orderId)
    },
    methods: {
      // 查询订单详情
      queryOrderDetail(orderId) {
        let that = this
        queryOrderDetail({ id: orderId }).then((res) => {
          if (res.flag && res.data) {
            that.order = res.data
          }
        })
      },
    },
  }
</script>
