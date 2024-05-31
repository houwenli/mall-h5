<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">查看评价</x-header> -->

    <group style="margin-top: 10px">
      <cell>
        <div slot="title" style="height: 40px; line-height: 40px">
          <img width="60" height="60" style="float: left" :src="storeEvaluation.avatarPicture">
          <ul style="float: left; margin: 8px 0 0 10px; line-height: normal">
            <li>{{storeEvaluation.storeName}}</li>
            <li>
              <rater v-model="storeEvaluation.avgScore"
                     star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                     active-color="#f23030" :min="1" disabled></rater>
            </li>
          </ul>
        </div>
      </cell>
      <cell>
        <div slot="title">门店地址：{{storeEvaluation.companyAddress?storeEvaluation.companyAddress:'暂无'}}</div>
      </cell>
      <cell>
        <div slot="title">联系电话：{{storeEvaluation.phone?storeEvaluation.phone:'暂无'}}</div>
      </cell>
      <cell>
        <div slot="title">营业时间：{{storeEvaluation.businessTime?storeEvaluation.businessTime:'暂无'}}</div>
      </cell>
      <cell>
        <div slot="title">公交线路：{{storeEvaluation.busRoute?storeEvaluation.busRoute:'暂无'}}</div>
      </cell>
    </group>

    <group class="noTopBoderCells" style="margin-top: .6rem">
      <cell>
        <ul slot="title">
          <li>门店满意度</li>
          <li>
            <rater v-model="storeEvaluation.score"
                   star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
                   active-color="#f23030" :min="1" disabled></rater>
          </li>
        </ul>
      </cell>
      <cell :title="storeEvaluation.desc"></cell>
    </group>

  </div>
</template>

<script>
  import {XHeader, XButton, Group, Cell, Rater} from 'vux'

  import {queryStoreInfo, queryStoreEvaluation} from '@/api/storeorderevaluate';

  export default {
    components: {
      XHeader, XButton, Group, Cell, Rater
    },
    data() {
      return {
        storeEvaluation: {}, // 门店评价
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryStoreEvaluation(this.$route.query.orderCode);
    },
    methods: {
      queryStoreEvaluation(orderCode) {
        queryStoreEvaluation(orderCode).then(res => {
          if (res.flag && res.data) {
            this.storeEvaluation = res.data;
          }
        })
      }
    }
  }
</script>
