<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">发表评价</x-header> -->

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="40" height="40" src="../../assets/img/shopIcon.png"><span
          style="vertical-align: text-bottom; margin-left: 20px">{{storeName}}</span>
        </div>
      </cell>
      <cell class="raterCell" style="padding: 10px 15px 2px" title="描述相符">
        <rater v-model="orderInfo.storeComment.descScore"
               star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
               active-color="#f23030" :min="1"></rater>
      </cell>
      <cell class="raterCell noTopBoderCell" style="padding: 2px 15px" title="卖家服务">
        <rater v-model="orderInfo.storeComment.sellerScore"
               star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
               active-color="#f23030" :min="1"></rater>
      </cell>
      <cell class="raterCell noTopBoderCell" style="padding: 2px 15px 10px" title="物流服务">
        <rater v-model="orderInfo.storeComment.logisticsScore"
               star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
               active-color="#f23030" :min="1"></rater>
      </cell>
    </group>

    <group v-for="(item,index) in orderInfo.comments" :key="index" class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="60" height="60" style="float: left" :src="item.skuImage">
          <ul style="float: left; margin: 8px 0 0 10px; line-height: normal">
            <li>商品满意度</li>
            <li>
              <rater v-model="item.score"
                     star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                     active-color="#f23030" :min="1"></rater>
            </li>
          </ul>
        </div>
      </cell>
      <x-textarea v-model="item.comment" :max="200" placeholder="写下购买体会和使用感受来帮助其他小伙伴" :height="50"
                  @on-blur="keyboardDown"></x-textarea>
      <cell style="padding: 0">
        <uploader
          slot="inline-desc"
          :headers="headers"
          :url="uploadApi"
          name="image"
          title="添加晒单图片(最多上传五张)"
          v-model="item.commentPics"
          :multiple="true"
          :withCredentials="true"
          limit="5"
          @on-success="onSuccess"
          @on-delete="onDelete"
        ></uploader>
      </cell>
    </group>

    <check-icon :value.sync="agreeCheck" style="margin: 10px 0 81px 10px; font-size: 14px">匿名评价</check-icon>

    <div class="footer_btn">
      <x-button type="primary" @click.native="save">发表评价</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Group, Cell, XTextarea, Rater, CheckIcon } from 'vux'
import Uploader from 'vux-uploader-component'
import { setToken, getToken, removeToken } from '@/utils/token'

import {
  queryOrderForEvaluation, // 查询订单详情
  addOrderEvaluation, // 添加订单评论
} from '@/api/evaluationorder'

import {
  isEmpty, // 是否为空
} from '@/utils/validate'

export default {
  components: {
    XHeader,
    XButton,
    Group,
    Cell,
    XTextarea,
    Uploader,
    Rater,
    CheckIcon,
  },
  data() {
    return {
      uploadApi: process.env.UPLOAD_API, // 上传图片api
      headers: {
        Authorization: 'Bearer ' + getToken(),
      }, // 认证的头部
      isProcess: false, // 接口是否处理中
      orderId: this.$route.query.orderId, // 订单Id
      agreeCheck: false, // 是否匿名   1 是  0否
      storeName: '商城自营', // 店铺名称
      orderInfo: {
        storeComment: {
          descScore: 5,
          sellerScore: 5,
          logisticsScore: 5,
        },
      }, // 订单详情
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.getOrderInfo()
  },
  methods: {
    // 上传图片成功回调
    onSuccess(res, file) {
      file.url = res.data
    },
    // 删除图片
    onDelete(deleteItem, cb) {
      cb && cb()
      console.log(1111)
    },
    // 发表评论
    save() {
      for (let i = 0; i < this.orderInfo.comments.length; i++) {
        this.orderInfo.comments[i].isAnonymous = this.agreeCheck == true ? '1' : '0'
        if (isEmpty(this.orderInfo.comments[i].comment)) {
          this.$vux.toast.text('请填写评价', 'middle')
          return
        }
      }
      if (this.isProcess) {
        return
      }
      this.isProcess = true

      addOrderEvaluation(this.orderInfo).then((res) => {
        this.isProcess = false
        if (res == 1) {
          this.$router.go(-1)
        } else if (res == -1) {
          this.$vux.toast.text('订单不存在', 'middle')
        } else if (res == -2) {
          this.$vux.toast.text('订单状态错误', 'middle')
        } else {
          this.$vux.toast.text('评价失败 请稍后重试', 'middle')
        }
      })
    },
    // 获取订单信息
    getOrderInfo() {
      queryOrderForEvaluation(this.orderId).then((res) => {
        if (res.flag && res.data) {
          this.storeName = res.data.storeName
          let orderSku = new Array()
          for (let i = 0; i < res.data.orderSkus.length; i++) {
            let sku = {
              skuId: res.data.orderSkus[i].skuId,
              skuImage: res.data.orderSkus[i].skuImage,
              score: 5,
              comment: '',
              isAnonymous: '0',
              commentPics: [],
            }
            orderSku.push(sku)
          }
          this.orderInfo = {
            orderId: this.orderId,
            storeComment: {
              descScore: 5,
              sellerScore: 5,
              logisticsScore: 5,
            },
            comments: orderSku,
          }
        }
      })
    },
    keyboardDown() {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    },
  },
}
</script>
