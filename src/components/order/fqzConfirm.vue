<template>
  <van-dialog v-model="show" title="支付确认" show-cancel-button cancel-button-text="再想想" @confirm='confirm'>
    <div class="fqz-confrim-box">
      <div class="item">
        <span class="label">福气值已抵扣: </span>
        <span class="val">￥{{isWsorder.fqzPrice}}</span>
      </div>
      <div class="item">
        <span class="label">仍需支付: </span>
        <span class="val">￥{{isWsorder.orderFqzAmount || (isWsorder.totalAmount - isWsorder.fqzPrice).toFixed(2)}}</span>
      </div>
    </div>
  </van-dialog>
</template>

<script>
import { Dialog } from 'vant';
export default {
  props:{
    isWsorder: {
      default: ()=>{},
      type: Object
    }
  },
  data() {
    return {
      show: false,
      data: {}
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  methods: {
    confirm() {
      this.$emit('confirm', {
        ...this.isWsorder,
        money: this.isWsorder.orderFqzAmount || (this.isWsorder.totalAmount - this.isWsorder.fqzPrice).toFixed(2)
      })
    }
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-dialog__header {
  font-weight: bold;
}
.fqz-confrim-box {
  padding-top: 20px;
  padding-bottom: 30px;
  .item {
    display: flex;
    justify-content: center;
    font-size: 14px;
    color: #666;
    &:first-child {
      margin-bottom: 10px;
    }
    .val {
      color: #EA0213;
      font-weight: bold;
    }
  }
}
</style>