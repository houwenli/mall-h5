<template>
  <div style="height:100%; padding-bottom: 20px">

    <!-- <x-header :left-options="{backText: ''}">查看评价</x-header> -->

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="40" height="40" src="../../assets/img/shopIcon.png"><span
          style="vertical-align: text-bottom; margin-left: 20px">{{evaluation.storeComment.storeName}}</span>
        </div>
      </cell>
      <cell class="raterCell" style="padding: 10px 15px 2px" title="描述相符">
        <rater v-model="evaluation.storeComment.descScore"
               star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
               active-color="#f23030" :min="1" disabled></rater>
      </cell>
      <cell class="raterCell noTopBoderCell" style="padding: 2px 15px" title="卖家服务">
        <rater v-model="evaluation.storeComment.sellerScore"
               star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
               active-color="#f23030" :min="1" disabled></rater>
      </cell>
      <cell class="raterCell noTopBoderCell" style="padding: 2px 15px 10px" title="物流服务">
        <rater v-model="evaluation.storeComment.logisticsScore"
               star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
               active-color="#f23030" :min="1" disabled></rater>
      </cell>
    </group>

    <group v-for="(item,index) in evaluation.comments" :key="index" class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="60" height="60" style="float: left" :src="item.sku.url">
          <ul style="float: left; margin: 8px 0 0 10px; line-height: normal">
            <li>商品满意度</li>
            <li>
              <rater v-model="item.score"
                     star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                     active-color="#f23030" :min="1" disabled></rater>
            </li>
          </ul>
        </div>
      </cell>
      <cell :title="item.comment !== '' ? item.comment : ''">
        <span v-if="item.comment === ''" slot="inline-desc">您没有填写评价内容</span>
      </cell>
      <cell v-if="item.commentPics.length !== 0" style="padding: 0">
        <uploader
          slot="inline-desc"
          :readonly=true
          title="晒单图片"
          v-model="item.commentPics"
          limit="5"
          :multiple=true
        ></uploader>
      </cell>
      <cell v-if="item.commentPics.length === 0">
        <span slot="inline-desc">您没有上传晒单图片</span>
      </cell>
    </group>

  </div>
</template>

<script>
  import {XHeader, XButton, Group, Cell, Rater} from 'vux'
  import Uploader from 'vux-uploader-component'

  import {
    queryEvaluationDetail,//查询订单评价详情
  } from '@/api/evaluationorderdetail'


  export default {
    components: {
      XHeader, XButton, Group, Cell, Uploader, Rater
    },
    data() {
      return {
        orderId: this.$route.query.orderId,//订单Id
        evaluation: {
          storeComment: {}
        },//评价详情
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.getData();
    },
    methods: {
      getData() {
        queryEvaluationDetail(this.orderId).then(res => {
          this.evaluation = res.data;
        });
      },
    }
  }
</script>
