<template>
  <div>
    <navbartop :title="$route.meta.title" @clickBack="toBack" :isConfirm="true" class="navtop"></navbartop>
    <div class="dis-rule">
      <p>1. 每笔订单按照一定比例进行返佣，最终以入账金额为准。</p>
      <p>2. 订单佣金结算需等待该订单完结后，以该订单最终实付价格进行佣金结算，订单最终实付价格不包含<span>已退货、退款商品</span>。</p>
      <p>3. 推广后用户下单生成一条正向待结算佣金流水，若用户退款、退货则按照退款比例生成一条负向的待结算佣金流水。</p>
      <p>4. 佣金结算后点击【提现】到“我的账户”进行提现</p>
    </div>
    
  </div>
</template>

<script>
import navbartop from '@/components/commons/navBartop'
export default {
  data() {
    return {

    }
  },
  components:{
    navbartop
  },
  methods:{
    //返回上一页
    toBack() {
      this.$router.go(-1)
      // this.reload()
    },
  }
}
</script>

<style lang="less" scoped>
.dis-rule {
  color: #333;
  font-size: 14px;
  line-height: 18px;
  padding: 16px;
  >p {
    margin-bottom: 16px;
    span {
      font-weight: bold;
    }
  }
}
</style>