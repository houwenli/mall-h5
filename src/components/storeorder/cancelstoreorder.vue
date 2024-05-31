<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">取消订单</x-header> -->

    <checklist title="选择取消原因" label-position="left" :options="commonReasonList" v-model="reasonValue"
               :max="1" required></checklist>

    <div class="footer_btn">
      <x-button type="primary" @click.native="cancelStoreOrder">取消订单</x-button>
    </div>

  </div>
</template>

<script>
  import {XHeader, XButton, Checklist} from 'vux'

  import {cancelStoreOrder} from '@/api/storeorderlist';

  export default {
    components: {
      XHeader, XButton, Checklist
    },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        reasonValue: ['1'], // 取消原因
        commonReasonList: [
          {key: '1', value: '不想买了'},
          {key: '2', value: '商品价格较贵'},
          {key: '3', value: '价格波动'},
          {key: '4', value: '商品缺货'},
          {key: '5', value: '重复下单'},
          {key: '6', value: '发票信息有误/发票未开'},
          {key: '7', value: '其他原因'},
        ] // 取消原因列表
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      // 取消门店订单
      cancelStoreOrder() {
        let that = this;
        if (!that.reasonValue || that.reasonValue.length === 0) {
          that.$vux.toast.text('请选择原因', 'middle');
          return;
        }
        if (that.isProcess) {
          return;
        }
        that.isProcess = true;
        cancelStoreOrder(that.$route.query.orderId, that.reasonValue[0]).then(res => {
          that.isProcess = false;
          if (res == 1) {
            that.$vux.toast.text('取消成功', 'middle');
            that.$router.go(-1);
          } else {
            that.$vux.toast.text('取消失败', 'middle');
          }
        })
      }
    }
  }
</script>
