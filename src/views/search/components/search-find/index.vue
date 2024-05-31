<template>
  <div class="container" v-if="list.length > 0">
    <div class="title-box">
      <div class="left">搜索发现</div>
      <div class="right" @click="refresh()">
        <div>换一批</div>
        <img
          :class="loading ? 'rotate-style refresh-icon' : 'refresh-icon'"
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search-refresh-icon.png"
        />
      </div>
    </div>
    <div class="search-tags">
      <!-- 个数每一页应该是一样的 -->
      <!-- tagList -->
      <div class="tag" v-for="(item, index) in list" :key="index" @click="toHistorySearch(item.name)">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
  import { queryKeyword } from '@/api/seach'
  // 搜索发现
  export default {
    name: 'search-find',
    data() {
      return {
        loading: false,
        list: [],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // 换一批
      refresh() {
        if (this.loading) return
        this.getData()
      },
      //   点击标签查详情
      toHistorySearch(value) {
        this.$emit('toSearch', value, 'find')
      },
      getData() {
        this.loading = true
        queryKeyword()
          .then((res) => {
            console.log(res.data, 'res')
            if (res.code === 200) {
              console.log('这里是搜索发现',res.data);
              this.list = res.data || []
              this.$emit('setFindData', this.list)
            }
          })
          .catch((error) => {
            console.error(error)
          })
        setTimeout(() => {
          // 防抖
          this.loading = false
        }, 500)
      },
    },
  }
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    box-sizing: border-box;
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // margin: 12px 0 0;     
      margin: 0;
      line-height: 1;
      margin-bottom: 8px;
      .left {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #111111;
      }

      .right {
        display: flex;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c5c5c5;
        align-items: center;
        .refresh-icon {
          width: 16px;
          height: 16px;
          margin-left: 3px;
        }
        .rotate-style {
          transition: all 0.5s;
          transform: rotate(360deg);
        }
      }
    }

    .search-tags {
      max-height: 78px;
      overflow: hidden;
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
        max-width: 237px;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
        word-break: break-all;
        margin-right: 12px;
        margin-bottom: 12px;
      }
    }
  }
</style>
