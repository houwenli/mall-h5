<template>
  <div style="height: 100%">

    <!-- <x-header :left-options="{backText: ''}">我的分销</x-header> -->

    <div style="text-align: center">
      <qrcode
        :value="registerUrl"
        type="img" :size="220" style="margin: 40px 0"></qrcode>
    </div>
    <div style="margin: 0 10%; color: #666; font-size: .55rem; word-break: break-all">
      {{registerUrl}}
    </div>


  </div>
</template>

<script>
  import {XHeader, Qrcode} from 'vux'

  export default {
    components: {XHeader, Qrcode},
    data() {
      return {
        registerUrl: '',//跳转地址
      }
    },
    created: function () {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.registerUrl = this.$route.query.basePath + 'register?recommendCode=' + this.$route.query.selfRecommendCode;
    }
  }
</script>
