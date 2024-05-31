<template>
  <!-- 温馨提示页 -->
  <div style="height: 100%">
    <navbartop :title="'温馨提示'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <div class="phone-charge">
      <div class="tips">
        <div class="tips=text" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import navbartop from '@/components/commons/navBartop' // 导航栏
import { queryRechargeDescription } from '@/api/phoneCharge'
import { appBack } from '@/utils/utils'
export default {
  components: {
    navbartop,
  },
  data() {
    return {
      content: '',
    }
  },
  mounted() {
    this.getTips()
  },
  methods: {
    async getTips() {
      let res = await queryRechargeDescription({})
      this.content = res.data.content
    },
    backLastPage() {
      appBack(this)
    },
  },
}
</script>

<style lang="less" scoped>
.phone-charge {
  height: 100%;
  width: 100%;
  background: #fafafb;
  padding: 12px 15px 0 17px;
  .tips {
    .tips-text {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000d1d;
      line-height: 29px;
    }
  }
  /deep/ .img{
    width:100%;
  }
}

</style>