<template>
    <div class="order-good-item">
        <div class="order-good-content">
            <div class="order-good-img">
                <img @click="togoodsdetail" :src="data.skuImage" alt="">
            </div>
            <div class="order-good-intro">
                <div class="order-good-name" @click="togoodsdetail">{{data.skuName}}</div>
                <div class="order-good-desc">{{data.skuSpecs}}</div>
            </div>
        </div>

        <div class="footer-healp-btn-list" >
            <span class="gery-btn" @click="toRefundPage" v-if="([0,3].includes(data.refundStatus*1) && data.canRefund && data.orderType != 10)" >申请退款</span>
            <span @click="torefundDetail" v-if="[1,3].includes(data.refundStatus*1)|| data.refundStatus == 2 " >{{refundTextMap[data.refundStatus]}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {
               return {
                skuImage:'',
                skuName:'',
                skuSpecs:''
              }
            }   
        },
    },
    data() {
        return {
          refundTextMap:{
          1: '退款中',
          2: '退款完成',
          3: '退款失败',
        },
        }
    },
    methods: {
      toRefundPage() {
        this.$router.push({
            path: '/refundorder',
            query: {
              orderSkuId:this.data.id,//订单商品ID
              orderId: this.data.orderId,//订单ID
              isMotorCar: true
            },
          })
      },
      // 退款详情
      torefundDetail() {
        this.$router.push({
          path:'/refundServerDetails',
          query:{
            id: this.data.backOrderId
          },
        })
      },
      togoodsdetail() {
        console.log('跳转信息', this.data)
        this.$router.push({
          path: '/motorCar/detail',
          query: {
            skuId: this.data.skuId,
          },
        })
      },
    }
}
</script>

<style lang="less" scoped>
.order-good-item {
  .order-good-content {
    display: flex;
    align-items: center;
    .order-good-img {
      width: 80px;
      height: 80px;
      background: #f6f6f6;
      border-radius: 9px;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .order-good-intro {
      margin-left: 8px;
      .order-good-name {
        font-size: 16px;
        color: #111;
        font-weight: bold;
        margin-bottom: 4px;
        line-height: 20px;
      }
      .order-good-desc {
        color: #c3c3c3;
        font-size: 13px;
      }
    }
  }
  .footer-healp-btn-list {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > span {
      height: 26px;
      color: #ff0a35;
      line-height: 15px;
      border: 1px solid #ff0a35;
      padding: 5px 12px;
      border-radius: 13px;
      margin-left: 8px;
      &.gery-btn {
        color: #999;
        border: 1px solid #999;
      }
    }
  }
}
</style>


