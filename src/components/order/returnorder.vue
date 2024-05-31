<template>
  <div style="height:100%;">
    <!-- <x-header :left-options="{backText: ''}">申请退货</x-header> -->

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <span slot="title">订单编号：{{order.orderCode}}</span>
      </cell>
      <cell class="orderPrice">
        <!-- <span slot="title"> -->
        <span style="color:#232326">订单金额：</span>
        <span style="color: red">{{formatPrice(order.price)}}</span>
        <!-- </span> -->
      </cell>
    </group>

    <group title="退货商品" class="noTopBoderCells" style="margin-top: .6rem">
      <ul class="searchlist-normal clearfix recordlist" style="margin-top: 0">
        <li v-for="orderSku in chooseSkus" class="normal-list" style="height: 112px">
          <div class="pro-img">
            <img :src="orderSku.skuImage" />
          </div>
          <div class="product-info-box product-info-box-order">
            <div class="product-name">{{orderSku.skuName}}</div>
            <div>{{orderSku.skuSpecs}}</div>
            <div class="product-price-m">
              <em>¥{{formatPrice(orderSku.unitPrice)}}</em>
              <span style="margin-left: 20px">x{{orderSku.returnNum}}</span>
              <inline-x-number
                class="count_choose"
                style="float: right"
                :min="0"
                :max="orderSku.returnNum > 99 ? 99 : orderSku.returnNum"
                v-model="orderSku.chooseNum"
                @click.native="calculateReturnMoney"
              ></inline-x-number>
            </div>
          </div>
        </li>
      </ul>
    </group>

    <checklist
      title="选择退货原因"
      label-position="left"
      :options="returnorderReasonList"
      v-model="returnorderReasonValue"
      :max="1"
      required
    ></checklist>

    <checklist
      title="申请凭证"
      label-position="left"
      :options="certificateList"
      v-model="certificateRadioValue"
      :max="1"
    ></checklist>

    <group
      v-if="certificateRadioValue[0] !== '0'"
      class="noTopBoderCells"
      style="margin-top: .6rem"
    >
      <cell style="padding: 0">
        <uploader
          slot="inline-desc"
          title="上传凭证(最多上传三张)"
          :url="uploadApi"
          :headers="headers"
          limit="3"
          name="image"
          v-model="choosePics"
          :multiple="true"
          :withCredentials="true"
          @on-success="onSuccess"
        ></uploader>
      </cell>
    </group>

    <div class="weui-cells__title">
      退款金额：
      <span style="color: red">{{formatPrice(returnMoney)}}</span>
    </div>

    <group title="原因说明" class="noTopBoderCells" style="margin-top: .6rem; margin-bottom: 71px">
      <x-textarea
        :max="200"
        placeholder="请填写退货原因"
        :height="50"
        @on-blur="keyboardDown"
        v-model="desc"
      ></x-textarea>
    </group>

    <div class="footer_btn">
      <x-button type="primary" @click.native="applyReturnOrder">提交退货申请</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Checklist, Group, Cell, XTextarea, InlineXNumber } from 'vux'

import Uploader from 'vux-uploader-component'

import { formatPrice } from '@/utils/utils'

import { queryOrderForReturn, applyReturnOrder } from '@/api/backorderlist'
import { setToken, getToken, removeToken } from '@/utils/token'

export default {
  components: {
    XHeader,
    XButton,
    Checklist,
    Group,
    Cell,
    XTextarea,
    InlineXNumber,
    Uploader,
  },
  data() {
    return {
      uploadApi: process.env.UPLOAD_API, // 上传图片api
      headers: {
        Authorization: 'Bearer ' + getToken(),
      }, // 认证的头部
      isProcess: false, // 接口是否处理中
      formatPrice: formatPrice, // 格式化金额
      order: '', // 订单实体
      returnorderReasonValue: ['5'], // 退款原因
      returnorderReasonList: [
        { key: '5', value: '不想买了' },
        { key: '6', value: '商品质量问题' },
        { key: '7', value: '收到商品与描述不符' },
        { key: '8', value: '其他' },
      ], // 退款原因列表
      certificateRadioValue: ['0'], // 申请凭证
      certificateList: [
        { key: '0', value: '没有任何凭证' },
        { key: '1', value: '有发票' },
        { key: '2', value: '有质检报告' },
      ], // 凭证选项
      choosePics: [], // 上传凭证列表
      returnMoney: 0, // 退款金额
      chooseSkus: [], // 选择的单品
      desc: '', // 原因说明
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.queryOrderForReturn(this.$route.query.orderId)
  },
  methods: {
    keyboardDown() {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    },
    // 查询订单详情
    queryOrderForReturn(orderId) {
      let that = this
      queryOrderForReturn(orderId).then((res) => {
        if (res.flag && res.data) {
          that.order = res.data
          that.chooseSkus = res.data.orderSkus
          that.chooseSkus.forEach((sku) => (sku.chooseNum = 1))
          that.calculateReturnMoney()
        }
      })
    },
    // 上传图片成功回调
    onSuccess(res, fileItem) {
      fileItem.picurl = res.url
    },
    // 计算退款金额
    calculateReturnMoney() {
      this.returnMoney = this.chooseSkus.reduce((prev, sku) => {
        return prev + sku.unitPrice * sku.chooseNum
      }, 0)
    },
    // 申请退货
    applyReturnOrder() {
      let that = this
      if (!that.returnorderReasonValue || that.returnorderReasonValue.length === 0) {
        that.$vux.toast.text('请选择退货原因', 'middle')
        return
      }
      if (!that.certificateRadioValue || that.certificateRadioValue.length === 0) {
        that.$vux.toast.text('请选择是否有凭证', 'middle')
        return
      }
      if (!that.desc) {
        that.$vux.toast.text('请填写原因说明', 'middle')
        return
      }
      if (that.chooseSkus.every((sku) => sku.chooseNum == 0)) {
        that.$vux.toast.text('请选择退货商品', 'middle')
        return
      }
      // 获取选择退货单品
      let returnSkus = that.chooseSkus
        .filter((sku) => sku.chooseNum > 0)
        .map((chooseSku) => {
          let returnSku = {}
          returnSku.skuId = chooseSku.skuId
          returnSku.selfprice = chooseSku.unitPrice
          returnSku.num = chooseSku.chooseNum
          return returnSku
        })
      // 获取选择申请凭证
      let pics = []
      if (that.choosePics && that.choosePics.length > 0) {
        pics = that.choosePics.map((pic) => pic.picurl)
      }
      let applyReturnParams = {
        orderId: that.$route.query.orderId,
        reason: that.returnorderReasonValue[0],
        desc: that.desc,
        credential: that.certificateRadioValue[0],
        returnSkus: returnSkus,
        pics: pics.join(',').toString(),
      }
      if (that.isProcess) {
        return
      }
      that.isProcess = true
      applyReturnOrder(applyReturnParams).then((res) => {
        that.isProcess = false
        if (res == 1) {
          that.$vux.toast.text('申请退货成功', 'middle')
          that.$router.go(-1)
        } else if (res == -1) {
          that.$vux.toast.text('订单状态错误', 'middle')
        } else if (res == -2) {
          that.$vux.toast.text('退货失败，已经超过可以退货时间', 'middle')
        } else {
          that.$vux.toast.text('申请退货失败', 'middle')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.orderPrice {
  text-align: left;
  /deep/ .weui-cell__ft {
    width: 100%;
    text-align: left;
  }
}
</style>