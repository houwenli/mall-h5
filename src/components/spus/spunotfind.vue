<template>
  <div style="height: 100%">

    <div class="error_content">
      <img src="../../assets/img/no_goods.png" style="width: 40%; margin-bottom: 20px">
      <p>很抱歉，您查看的商品不存在<br>可能已下架或者被转移。</p>
      <div>您可以逛逛：
        <x-button @click.native="toIndex" mini type="primary" style="margin-left: 10px">商城首页</x-button>
      </div>
    </div>

  </div>
</template>

<script>
  import {XButton} from 'vux'

  export default {
    components: {XButton},
    data() {
      return {
        warnTipsVisible: false
      }
    },
    created: function () {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      // 跳转到商城首页
      toIndex() {
        this.$router.push({path: '/'});
      }
    }
  }
</script>
