<template>
  <div>

    <!-- <x-header :left-options="{backText: ''}">门店详情</x-header> -->

    <div class="store_box">
      <div class="store_img"><img :src="storeInfo.avatarPicture"></div>
      <h1>{{storeInfo.storeName}}</h1>
      <rater style="margin-top: 5px" v-model="storeInfo.aveScore"
             star="<svg class='icon' aria-hidden='true'><use xlink:href='#icon-xingxing'></use></svg>"
             active-color="#f23030" :min="1" disabled></rater>
    </div>

    <group style="margin-top: 10px">
      <cell title="门店信息"></cell>
      <cell>
        <div slot="title">联系电话：{{storeInfo.contactPhone}}</div>
      </cell>
      <cell>
        <div slot="title">营业时间：{{storeInfo.businessTime}}</div>
      </cell>
      <cell>
        <div slot="title">公交线路：{{storeInfo.busRoutes}}</div>
      </cell>
    </group>

  </div>
</template>

<script>
  import {XHeader, Group, Cell, Badge, Popup, InlineXNumber, Rater} from 'vux'

  import {queryStoreInfo} from '@/api/storedetail';

  export default {
    components: {XHeader, Group, Cell, Badge, Popup, InlineXNumber, Rater},
    data() {
      return {
        storeInfo: {},// 门店信息
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.queryStoreInfo(this.$route.query.storeId)
    },
    methods: {
      // 查询门店信息详情
      queryStoreInfo(storeId) {
        let that = this;
        queryStoreInfo(storeId).then(res => {
          if (res.flag && res.data) {
            that.storeInfo = res.data;
          }
        })
      }
    }
  }
</script>
