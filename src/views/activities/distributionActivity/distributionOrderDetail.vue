<template>
  <div class="distributeion-order-detail">
    <navbartop :title="$route.meta.title" @clickBack="toBack" :isConfirm="true" class="navtop"></navbartop>
    <p class="detail-title">分销奖励</p>
    <div class="detail-item-box">
      <div class="detail-item">
        <span>结算状态:</span>
        <span class="status">{{detailData.commissionStatus | transStatus}}</span>
      </div>
      <div class="detail-item" v-if="(detailData.commissionStatus!=3)">
        <span>佣金:</span>
        <span>{{detailData.advanceCommission}}</span>
      </div>
      <div class="detail-item" v-if="detailData.commissionStatus!=3 && detailData.performanceScore && detailData.performanceScore>0">
        <span>绩效分:</span>
        <span>{{detailData.performanceScore}}</span>
      </div>
    </div>
    <p class="detail-title">订单信息</p>
    <div class="detail-item-box">
      <div class="detail-item">
        <span>购买时间:</span>
        <span class="buy-time">{{detailData.createTime}}</span>
      </div>
      <div class="detail-item">
        <span>用户手机号:</span>
        <span>{{detailData.buyPhone | getTransPhone}}</span>
      </div>
      <div class="detail-item">
        <span>订单号:</span>
        <span>{{detailData.distributionOrderCode}}</span>
      </div>
      <div class="detail-item">
        <span>商品名称:</span>
        <span class="product-name">{{detailData.skuName}}</span>
      </div>
      <div class="detail-item item-pic">
        <span>商品图片:</span>
        <img :src="detailData.skuImage" alt="商品图片">
      </div>
      <div class="detail-item">
        <span>实付金额:</span>
        <span>{{detailData.payAmount}}</span>
      </div>
      <div class="detail-item">
        <span>购买数量:</span>
        <span>{{detailData.buyCount}}</span>
      </div>
      <div class="detail-item" v-if="detailData.backNum">
        <span>退款数量:</span>
        <span>{{detailData.backNum}}</span>
      </div>
      <div class="detail-item">
        <span>计佣金额:</span>
        <span>{{detailData.commissionAmount}}</span>
      </div>
    </div>
    <div class="close-tip" v-if="detailData.commissionStatus == 3">用户申请退款</div>

  </div>
</template>

<script>
import navbartop from '@/components/commons/navBartop'
import { distributionOrderDetail } from '@/api/activities/distributionActivity'
import { appBack } from '@/utils/utils'

export default {
  data() {
    return {
      detailData: {}
    }
  },
  components:{
    navbartop
  },
  filters:{
    transStatus(val) {
      const obj={
        1: '待结算',
        2: '已结算',
        3: '已关闭'
      }
      return obj[val]
    },
    getTransPhone(val) {
      if(val) {
        return `${val.substring(0, 3)}****${val.substr(val.length - 4)}`
      } else {
        '-'
      }

    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      distributionOrderDetail({
        id: this.$route.query.id,
        distributionOrderCode: this.$route.query.distributionOrderCode
      }).then(res=>{
        this.detailData = res.data
      })
    },
    //返回上一页
    toBack() {
      appBack(this)
    },
  }
}
</script>

<style lang="less" scoped>
.distributeion-order-detail {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 16px;
  .detail-title {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    padding-left: 16px;
    padding-top: 16px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .detail-item-box {
    background: #fff;
    padding: 16px;
    border-radius: 10px;
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      margin-bottom: 24px;
      font-size: 14px;
      color: #000;
      line-height: 20px;
      .buy-time {
        color: #999999;
      }
      &.item-pic {
        align-items: center;
      }
      &:last-child{
        margin-bottom: 0;
      }
      .status {
        color: #E60113;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 3px;
      }
      >span:last-child {
        margin-left: 24px;
        flex: 1;
        // overflow: hidden; /*超出部分隐藏*/
        // text-overflow: ellipsis; /* 超出部分显示省略号 */
        // white-space: nowrap; /*规定段落中的文本不进行换行 */
        text-align: right;
        &.product-name {
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-word;
        }
      }
    }
  }
  .close-tip {
    font-size: 14px;
    text-align: center;
    color: #999;
    margin-top: 20px;
  }
}
</style>