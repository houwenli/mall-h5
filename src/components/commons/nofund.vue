<template>
  <div class="box" v-if="noData">
    <navbartop :title="title" @clickBack="backLastPage"></navbartop>
    <div class="noDataBox">
      <img class="data_img" src="@/assets/img/cat_d@2x.png" mode="" />
      <div class="data_text">哇呜，商品链接已失效〜</div>
      <div class="data_otherPage" @click="goIndex">看看其他</div>
    </div>
  </div>
</template>

<script>
import navbartop from '@/components/commons/navBartop' // 导航栏
export default {
  data() {
    return {}
  },
  components: {
    navbartop,
  },
  props: {
    noData: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  methods: {
    goIndex() {
      this.$router.push('/')
    },
    // 返回
    backLastPage() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100vh;
  background: #ffffff;
}
.noDataBox {
  text-align: center;
  margin-top: 3.6rem;
}
.data_img {
  width: 3.6rem;
  height: 3.6rem;
}
.data_text {
  font-size: 0.56rem;
  color: #999;
  margin: 1.2rem auto 1rem;
}
.data_otherPage {
  margin: 0 auto;
  width: 4.4rem;
  height: 1.4rem;
  line-height: 1.4rem;
  background: #ffffff;
  border-radius: 0.72rem;
  border: 1px solid #666666;
  text-align: center;
  color: #000;
}
</style>