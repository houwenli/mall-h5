<template>
  <div class="boxWrapper">
    <navBartop :title="'选择快递公司'" :isConfirm="false" @clickBack="back" class="navtop"></navBartop>
    <!-- 物流 -->
    <van-index-bar data-desc='物流公司组件' :sticky="false" class='anchor-list'>
      <van-index-anchor :index="name" v-for="(item, name) in allLogis" :key="name">
        <b>{{ name }}</b>
        <van-cell :title="temp" v-for="(temp, i) in item" :key="i" @click="logisActive(temp)" />
      </van-index-anchor>
    </van-index-bar>
  </div>
</template>

<script>
import navBartop from '@/components/commons/navBartop'
import { IndexBar, IndexAnchor } from 'vant'
import { queryAllLogisCompanyName } from '@/api/backorderlist'
export default {
  components: {
    navBartop,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
  },
  data() {
    return {
      allLogis: {},
    }
  },
  created() {
    this.getLogisList()
  },
  methods: {
    // 选择物流
    logisActive(data) {
      localStorage.setItem('logistics', data)
      this.$router.back()
      //   this.$router.push({
      //     path: '/invoice',
      //     query: {
      //       logistics: data,
      //       id: this.$route.query.id,
      //       returnSku: this.$route.query.returnSku,
      //     },
      //   })
    },
    // 查看详情
    getLogisList() {
      queryAllLogisCompanyName().then((res) => {
        if (res.code == 200) {
          this.allLogis = res.data
        }
      })
    },
    back() {
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.boxWrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 24px;

  background-color: #fff;
  background: #eee;
  ::v-deep .van-index-anchor {
    b {
      padding-left: 10px;
      font-size: 14px;
      font-weight: 600;
    }
  }
  /deep/ .van-index-bar__sidebar {
    right: 0.3rem;
  }
}

.anchor-list {
  flex: 1;
  overflow: auto;
}
</style>