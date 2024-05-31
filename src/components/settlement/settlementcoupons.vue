<template>
  <div style="height:100%;">

    <!-- <x-header @on-click-back="back()" :left-options="{backText: '',preventGoBack:true}">可用优惠券</x-header> -->

    <div class="couponlist" style="padding: 0 10px 10px">
      <div v-for="item in storeSettlement.canUseCouponInfo" class="couponbox"
           :class="{selected : storeSettlement.choosedCoupon?storeSettlement.choosedCoupon.code == item.code:false}"
           @click="selectItem(item,storeSettlement)">
        <ul>
          <li><span>¥</span><i>{{ item.lastPrice}}</i></li>
          <li>
            <p>{{ item.storeName }}</p>
            <p v-if="item.type == '2'">使用立减</p>
            <p v-if="item.type != '2'">满{{item.fullPrice}}元使用</p>
          </li>
        </ul>
        <div class="clearfix">
          <p class="fll">{{ item.startTime.split(' ')[0] }} -- {{ item.endTime.split(' ')[0] }}</p>
        </div>
      </div>
    </div>

    <div style="padding: 10px">
      <x-button type="primary" @click.native="selectItem(null,storeSettlement)">不使用优惠券</x-button>
    </div>
  </div>
</template>

<script>
  import {XHeader, XButton, Divider} from 'vux'

  export default {
    components: {
      XHeader, XButton, Divider
    },
    props: ["storeSettlement"],

    data() {
      return {}
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      // 返回结算页主页面
      back() {
        this.$emit('back');
      },
      // 选择优惠券
      selectItem(data, storeSettlement) {
        storeSettlement.choosedCoupon = data;
        this.back();
      }
    }
  }
</script>
