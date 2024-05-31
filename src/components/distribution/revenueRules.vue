<template>
  <div class="boxWrapper">
    <navbartop :title="'收益规则解释'" @clickBack="backLastPage" :isConfirm="false" class="navtop"></navbartop>
    <div class="commomBox" v-for="(temp, i) in rules" :key="i">
      <h2>{{ temp.title }}</h2>
      <div class="" v-for="(res, q) in temp.ruleData" :key="q">
        <p>
          {{ q + 1 }}、
          <label class="title">{{ res.title }}</label>
          {{ res.comtent }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import navbartop from '@/components/commons/navBartop'
export default {
  components: {
    navbartop,
  },
  data() {
    return {
      rules: [
        {
          title: '一、订单状态',
          ruleData: [
            {
              title: '已下单：',
              comtent: '用户已下单，但暂未支付',
            },
            {
              title: '退换货审核周期：',
              comtent: '用户已下单，但暂未支付',
            },
            {
              title: '已下单：',
              comtent: '用户已签收订单，订单进入审核期，且会展示 剩余审核天数',
            },
          ],
        },
        {
          title: '二、订单收益',
          ruleData: [
            {
              title: '计佣金额：',
              comtent: '用户已下单，但暂未支付',
            },
            {
              title: '计佣金额：',
              comtent: '用户已下单，但暂未支付',
            },
            {
              title: '佣金比例：',
              comtent: '平台或商家给予推广者的推广奖励，具体 比例会因会员等级、促销活动等因素而变化；佣金构 成包括基础佣金和等级奖励佣金；',
            },
          ],
        },
      ],
    }
  },
  methods: {
    backLastPage() {
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.boxWrapper {
  background-color: #fff;
  font-size: 13px;
  color: #666;
  padding: 0 18px;
  .commomBox {
    padding-top: 30px;
    h2 {
      font-size: 14;
      font-weight: bold;
      margin-bottom: 12px;
      color: #000;
    }
    label {
      color: #000;
      margin-left: -4px;
      font-weight: bold;
    }
  }
}
</style>