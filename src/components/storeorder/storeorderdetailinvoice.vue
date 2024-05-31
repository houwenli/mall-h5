<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">发票信息</x-header> -->

    <group class="noTopBoderCells">
      <cell title="发票类型" :inline-desc='invoiceType[order.storeOrderAttr.invoiceType]'></cell>
      <cell title="发票抬头" v-if="order.storeOrderAttr.invoiceType=='1'" :inline-desc='order.storeOrderAttr.invoiceTitle'></cell>
      <cell title="抬头类型" v-if="order.storeOrderAttr.invoiceType=='1'"
            :inline-desc='invoiceTitleType[order.storeOrderAttr.invoiceTitleType]'></cell>
      <cell title="单位名称" v-if="order.storeOrderAttr.invoiceType=='2'"
            :inline-desc='order.storeOrderAttr.invoiceCompanyName'></cell>
      <cell title="纳税人识别码"
            v-if="(order.storeOrderAttr.invoiceType == '1' && order.storeOrderAttr.invoiceTitleType == '1') || order.storeOrderAttr.invoiceType == '2'"
            :inline-desc='order.storeOrderAttr.invoiceTaxid'></cell>
      <cell title="注册地址" v-if="order.storeOrderAttr.invoiceType=='2'"
            :inline-desc='order.storeOrderAttr.invoiceRegisterAddress'></cell>
      <cell title="注册电话" v-if="order.storeOrderAttr.invoiceType=='2'"
            :inline-desc='order.storeOrderAttr.invoiceRegisterMobile'></cell>
      <cell title="开户银行" v-if="order.storeOrderAttr.invoiceType=='2'" :inline-desc='order.storeOrderAttr.invoiceOpenBank'></cell>
      <cell title="银行账户" v-if="order.storeOrderAttr.invoiceType=='2'"
            :inline-desc='order.storeOrderAttr.invoiceBankAccount'></cell>
      <cell title="发票内容" v-if="order.storeOrderAttr.invoiceType!='0'"
            :inline-desc='invoiceContent[order.storeOrderAttr.invoiceContent]'></cell>
    </group>

  </div>
</template>

<script>
  import {XHeader, Group, Cell} from 'vux'

  import {queryStoreOrderById} from '@/api/storeorderlist';

  export default {
    components: {
      XHeader, Group, Cell
    },
    data() {
      return {
        invoiceType: {'0': '不开发票', '1': '增值税普票', '2': '增值税专票'}, // 发票类型
        invoiceContent: {'1': '商品明细', '2': '商品类别'}, // 发票内容
        invoiceTitleType: {'1': '企业', '2': '个人'}, // 发票抬头类型
        order: {storeOrderAttr: {}}, // 订单详情信息
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg');
      this.queryStoreOrderById(this.$route.query.orderId)
    },
    methods: {
      // 查询订单详情
      queryStoreOrderById(orderId) {
        let that = this;
        queryStoreOrderById(orderId).then(res => {
          if (res.flag && res.data) {
            that.order = res.data;
          }
        })
      },
    }
  }
</script>
