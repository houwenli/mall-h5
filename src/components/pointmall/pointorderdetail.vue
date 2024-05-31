<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">积分订单详情</x-header> -->

    <div style="padding-bottom: 59px">

      <group class="noTopBoderCells">
        <cell title="订单编号">{{pointOrder.code}}</cell>
      </group>

      <group class="noTopBoderCells settlementGroup" style="border-bottom: solid 3px #ffc927; margin-top: .6rem">
        <cell>
          <div class="addressInfoTitle" slot="title"><span>收货人: {{ pointOrder.receiver }}</span><span>{{ pointOrder.mobile }}</span>
          </div>
          <div slot="inline-desc" class="delivery_lite_info">
            <div><i></i></div>
            <p>{{ pointOrder.address }}</p>
          </div>
        </cell>
      </group>

      <group class="noTopBoderCells" style="margin-top: .6rem" v-if="pointOrder.status != '0'">
        <cell title="物流公司">{{ pointOrder.logisticsCompanyName }}</cell>
        <cell title="货运单号">{{ pointOrder.logisticsCode }}</cell>
      </group>

      <group class="noTopBoderCells" style="margin-top: .6rem">
        <cell title="商城自营"></cell>
        <cell v-if="!!pointOrder.skuDetail" class="spuListCell" style="padding: 1px 15px" is-link
              :link="{path: '/pointskudetail', query: {id: pointOrder.skuId}}">
          <ul slot="title" class="searchlist-normal clearfix cartSpuList" style="margin-top: 0">
            <li class="normal-list">
              <div class="pro-img"><img :src="pointOrder.skuDetail.pic"></div>
              <div class="product-info-box">
                <div class="product-name">{{ pointOrder.skuDetail.name }}</div>
                <div style="color: #999">x{{ pointOrder.num }}</div>
                <div class="product-price-m">
                  <em>积分 {{ pointOrder.skuDetail.point }}</em>
                </div>
              </div>
            </li>
          </ul>
        </cell>
        <cell title="支付方式">积分支付</cell>
      </group>

      <group class="noTopBoderCells cartPricebar" style="margin-top: .6rem">
        <cell title="积分总额">
          <span class="price">积分 {{ pointOrder.point }}</span>
        </cell>
        <cell title="下单时间"><span style="color: #666">{{ pointOrder.createTime }}</span></cell>
      </group>

    </div>

    <div class="fixBar" style="text-align: right; padding: 10px 15px" v-if="pointOrder.status == '1'">
      <span class="orderListBtn">
        <x-button mini plain type="primary" @click.native="toConfirmPointOrder(pointOrder.id)">确认收货</x-button>
      </span>
    </div>

  </div>
</template>

<script>
  import {XHeader, Group, Cell, CellFormPreview, XButton} from 'vux'

  import {
    queryPointOrderDetail, // 查询积分商城订单详情
    confirmReceiptPointOrder, // 积分商城订单确认收货
  } from '@/api/pointorder';

  export default {
    components: {
      XHeader, Group, Cell, CellFormPreview, XButton
    },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        pointOrder: {}, // 积分订单详情信息
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.queryPointOrderDetail(this.$route.query.pointOrderId)
    },
    methods: {
      // 查询积分订单详情
      queryPointOrderDetail(pointOrderId) {
        let that = this;
        queryPointOrderDetail(pointOrderId).then(res => {
          if (res.flag && res.data) {
            that.pointOrder = res.data;
          } else {
            // 返回积分订单列表
            this.toPointOrderList();
          }
        })
      },
      // 确认收货
      toConfirmPointOrder(pointOrderId) {
        let that = this;
        if (that.isProcess) {
          return;
        }
        that.$vux.confirm.show({
          title: '操作提示',
          content: '是否确认收货？',
          onConfirm() {
            that.isProcess = true;
            confirmReceiptPointOrder(pointOrderId).then(res => {
              that.isProcess = false;
              if (res > 0) {
                that.$vux.toast.text('确认收货成功', 'middle');
                that.queryPointOrderDetail(pointOrderId);
              } else {
                that.$vux.toast.text('确认收货失败', 'middle')
              }
            });
          }
        })
      },
      // 跳转到积分订单列表
      toPointOrderList() {
        // 积分订单
        this.$router.push({
          path: '/pointorderlist',
          query: {status: '-1'}
        })
      }
    }
  }
</script>
<style scoped>
.product-info-box,.product-price-m{
  line-height: 8px;
}
</style>
