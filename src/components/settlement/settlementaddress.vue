<template>
  <div>
    <!--收货地址-->
    <div class="addressInfoBox" @click="toAddress" v-if="orderSettlement.customerAddress">
      <p class="defaultAddress">
        <span class="default" v-if="orderSettlement.customerAddress.isDefault == 1">默认</span>
        {{ orderSettlement.customerAddress.address.replace(/,/g, '') }}
      </p>
      <div class="address_sx">
        <span>{{ orderSettlement.customerAddress.detailAddress }}</span>
        <img src="@/assets/img/more-icon.png" class="img_goaddress" alt="" />
      </div>
      <div class="address_user">
        <span class="address_shr">{{ orderSettlement.customerAddress.name }}</span>
        <span>{{ orderSettlement.customerAddress.mobile | phoneSubstr }}</span>
      </div>
    </div>
    <div v-else class="addressInfoBox" @click="toAddress">
      <div class="address_sx">
        <span>请添加收货地址</span>
        <img src="@/assets/img/more-icon.png" class="img_goaddress" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderSettlement: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  methods: {
    toAddress() {
      this.$emit('toAddress')
    },
  },
}
</script>

<style lang="less" scoped>
.addressInfoBox {
  border-radius: 8px;
  padding: 12px 10px;
  color: #000;
  font-size: 0.56rem;
  background: url('../../assets/img/Order_bg@2x.png') no-repeat bottom;
  background-size: 100%;
  background-color: #fff;
  .defaultAddress {
    font-size: 13px;
    color: #191919;
    .default {
      display: inline-block;
      color: #fff;
      background: #FF0A35;
      border-radius: 4px;
      padding: 1px 4px;
      font-size: 10px;
      margin-left: -0.1rem;
    }
    // font-size: 14px;
  }
  .address_sx {
    font-size: 18px;
    font-weight: bold;
    margin-top: 8px;
    margin-bottom: 10px;
    line-height: 22px;
    color: #191919;
    position: relative;
    span {
      width: 100%;
    }
    .img_goaddress {
      width: 16px;
      height: 16px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .address_user {
    overflow: hidden;
    font-size: 13px;
    color: #191919;
   
    .address_shr {
      margin-right: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 5.6rem;
    }
  }
}
</style>
