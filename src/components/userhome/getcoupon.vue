<template>
  <div style="height: 100%">

    <!-- <x-header :left-options="{backText: ''}">券码领券</x-header> -->

    <group style="margin-top: 1.176em">
      <x-input title="优惠券码" v-model="code" placeholder="请填写优惠券码"></x-input>
    </group>

    <div class="weui-btn-area">
      <x-button type="primary" @click.native="receive">领取</x-button>
    </div>

    <popup v-model="warnTipsVisible" position="top" :show-mask="false">
      <div class="warn-toptips">{{errorMsg}}</div>
    </popup>

  </div>
</template>

<script>
  import {XHeader, Group, XInput, XButton, Popup} from 'vux'
  import {
    receiveCouponByCode,//通过优惠券码领取优惠券
  } from '@/api/getcoupon'


  export default {
    components: {XHeader, Group, XInput, XButton, Popup},
    data() {
      return {
        isProcess: false, // 接口是否处理中
        code: '',//验证码
        warnTipsVisible: false,//错误信息展示标记
        errorMsg: '请填写正确券码',//错误消息
      }
    },
    created: function () {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      receive() {
        if (this.code == '') {
          this.warnTipsVisible = true;
          return;
        }
        if (this.isProcess) {
          return;
        }
        this.isProcess = true;
        receiveCouponByCode(this.code).then(response => {
          this.isProcess = false;
          if (response == 1) {
            document.cookie = 'enable=true';
            this.$router.push({path: '/mycoupon'});
          } else if (response == -2) {
            this.errorMsg = '活动已过期';
          } else if (response == -3) {
            this.errorMsg = '优惠券已领完';
          } else if (response == -4) {
            this.errorMsg = '用户领取的优惠券已达上限';
          } else if (response == -5) {
            this.errorMsg = '优惠券不存在或已失效';
          } else if (response == -6) {
            this.errorMsg = '该优惠券已被领取';
          } else if (response == -7) {
            this.errorMsg = '优惠券不存在';
          } else {
            this.errorMsg = '请填写正确券码';
          }
          this.warnTipsVisible = true;
        })
      }
    },
    watch: {
      warnTipsVisible(val) {
        if (val) {
          setTimeout(() => {
            this.warnTipsVisible = false
          }, 1000)
        }
      }
    }
  }
</script>
