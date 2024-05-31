<template>
  <div style="height: 100%">

    <!-- <x-header :left-options="{showBack: false}">订单创建成功</x-header> -->

    <div class="shopcart_empty">
      <img style="width: 30%" src="../../assets/img/order.png">
      <div style="font-size: .65rem">订单创建成功!</div>
      <div v-if="money !=0.00" style="font-size: .55rem">货到付款<span
        style="color: #fa4b4b; margin-left: 5px">¥{{money}}</span></div>
      <div v-if="money ==0.00" style="font-size: .55rem">订单金额<span
        style="color: #fa4b4b; margin-left: 5px">¥{{money}}</span></div>
    </div>

    <div style="text-align: center; margin-top: 20px">
      <x-button @click.native="toOrder"
                style="display: inline-block; width: auto; font-size: 14px; padding: 4px 20px; margin: 0 5px">查看订单
      </x-button>
      <x-button link="/" style="display: inline-block; width: auto; font-size: 14px; padding: 4px 20px; margin: 0 5px">
        返回首页
      </x-button>
    </div>

    <div style="padding: 1rem; color: #999; font-size: .55rem">提示:商城不会以订单异常、系统升级为由,要求您点击任何链接进行退款操作。</div>

  </div>
</template>

<script>
  import {XHeader, XButton} from 'vux'

  export default {
    components: {XHeader, XButton},
    data() {
      return {
        money: this.$route.query.money, // 金额
      }
    },
    created: function () {
      document.body.removeAttribute('class', 'gray-bg')
    },
    methods: {
      toOrder() {
        this.$router.push({
          path: '/orderlist',
          query: {status: -1}
        })
      }
    }
  }
</script>
