<template>
  <div style="height:100%;">

    <!-- <x-header @on-click-back="back()" :left-options="{backText: '',preventGoBack:true}">红包</x-header> -->

    <div class="couponlist" style="padding: 0 10px 10px">
      <div v-for="item in redEnvelopes" class="couponbox"
           :class="{selected : redEnvelopeCode&&redEnvelopeCode.code == item.code}"
           @click="selectItem(item)">
        <ul>
          <li><span>¥</span><i>{{ item.redEnvelope.price.toFixed(2)}}</i></li>
          <li>
            <p>平台红包</p>
            <p>部分店铺可用</p>
            <p>满{{item.redEnvelope.fullPrice}}元使用</p>
          </li>
        </ul>
        <div class="clearfix">
          <p class="fll">{{ item.redEnvelope.startTime.split(' ')[0] }}--{{ item.redEnvelope.endTime.split(' ')[0]
            }}</p>
        </div>
      </div>
    </div>

    <div style="padding: 10px">
      <x-button type="primary" @click.native="selectItem(null)">不使用红包</x-button>
    </div>

  </div>
</template>

<script>
  import {XHeader, XButton, Divider} from 'vux'

  export default {
    components: {
      XHeader, XButton, Divider
    },
    props: ["redEnvelopes", "redEnvelopeCode"],
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
      // 选择红包
      selectItem(data) {
        this.$emit('back', data);
      }
    }
  }
</script>
