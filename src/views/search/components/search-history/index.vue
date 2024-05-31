<template>
  <div v-if="historyList.length > 0">
    <div class="container">
      <div class="title-box">
        <div class="text">搜索历史</div>
        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search-delete-icon.png" @click="openDialog()" />
      </div>
      <div class="search-tags">
        <div class="tag" v-for="(item, index) in historyList" :key="index" @click="toHistorySearch(item)">{{ item }}</div>
        <div class="put-away-iocn" @click="putAway()" v-if="historyData.length > 8">
          <img :class="isPutAway ? '' : 'putAway'" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search-open-arrow-icon.png" />
        </div>
      </div>
    </div>
    <SecondConfirm
      :title="'确认删除搜索历史？'"
      :cancleText="'取消'"
      :sureText="'确认'"
      :dialogshow="confirmShow"
      @cancel="confirmShow = false"
      @confirm="confirm"
    ></SecondConfirm>
  </div>
</template>

<script>
  import SecondConfirm from './SecondConfirm'
  export default {
    name: 'search-history',
    components: { SecondConfirm },
    data() {
      return {
        confirmShow: false,
        historyData: [],
        isPutAway: true,
        from: this.$route.query.from || ''
      }
    },
    mounted() {
      this.historyData = JSON.parse(localStorage.getItem(this.from + 'searchHistory')) || []
    },
    computed: {
      historyList() {
        if (this.historyData.length === 0) return []
        if (this.isPutAway) {
          return this.historyData.filter((item, index) => index < 8)
        } else {
          return this.historyData
        }
      },
    },
    methods: {
      putAway() {
        this.isPutAway = !this.isPutAway
      },
      confirm() {
        this.historyData = []
        localStorage.removeItem(this.from + 'searchHistory')
        this.confirmShow = false
        this.$emit('update')
      },
      // 历史搜索
      toHistorySearch(value) {
        this.$emit('toSearch', value)
      },
      //   确认删除弹窗
      openDialog() {
        console.log(this.historyData, typeof this.historyData.length, '11')
        if (this.historyData.length > 0) {
          this.confirmShow = true
          console.log(this.confirmShow, 'this.confirmShow')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .container {
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 16px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #111111;
      line-height: 1;
      margin-bottom: 8px;
      img{
        width: 16px;
        height: 16px;
      }
    }
  }
  .search-tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12px;
    .tag {
      display: inline-block;
      padding: 4px 12px;
      color: #111111;
      background: #f2f2f2;
      border-radius: 14px;
      text-align: center;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      margin-right: 12px;
      max-width: 237px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      margin-bottom: 12px;
      img {
        width: 8px;
        height: 8px;
      }
    }
    .put-away-iocn {
      background: #f2f2f2;
      border-radius: 14px;
      padding: 9px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 8px;
        height: 8px;
      }
    }
    .putAway {
      transform: rotateX(180deg) !important;
    }
  }
</style>
