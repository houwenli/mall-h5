<template>
  <div style="height: 100%">

    <!-- <x-header :left-options="{showBack: false}">订单创建成功</x-header> -->

    <div class="shopcart_empty">
      <img style="width: 30%" src="../../assets/img/order.png">
      <div style="font-size: .65rem">订单创建成功!</div>
    </div>

    <div style="text-align: center; margin-top: 20px">
      <x-button @click.native="toPointOrderList"
                style="display: inline-block; width: auto; font-size: 14px; padding: 4px 20px; margin: 0 5px">查看积分订单
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
    created: function () {
      document.body.removeAttribute('class', 'gray-bg')
    },
    methods: {
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
