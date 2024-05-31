<template>
  <div class="contentBox">
    <navbartop :title="'搜索商品'" @clickBack="$router.go(-1)" :isConfirm="true" class="navtop"></navbartop>
    <div class="searchBox">
      <div class="inputBox">
        <input ref="search" v-model.trim="searchValue" type="text" :maxlength="30" class="searchinput" placeholder="请输入搜索关键字" />
      </div>
      <div class="searchIcon" style="background: none" @click="toSearch()">搜索</div>
    </div>

    <div>
      <dl class="searchKeywordsBox">
        <p class="textStyle">
          搜索历史
          <a class="delWords" @click="confirm"></a>
        </p>
        <dd v-if="historyData.length > 0" class="keywordsList" :class="isMore ? '' : 'pack-up'">
          <div v-for="(item, index) in historyData" :key="index" class="keywordItem">
            <div class="keywordItem_content" @click="toHistorySearch(item)">{{ item }}</div>
          </div>
          <div v-if="allhistoryData.length > 8" class="keywordItem item more" :class="{ iconupDown: iconupDown == 1 ? 'classDown' : 'classup' }">
            <img v-if="isMore" src="@/assets/img/up.png" alt class="iconImg" @click="packUpMore(2)" />
            <img v-else src="@/assets/img/down.png" alt class="iconImg" @click="packUpMore(1)" />
          </div>
        </dd>
        <p v-else class="no-history">暂无搜索记录</p>
      </dl>
    </div>
    <SecondConfirm
      :title="'操作提示'"
      :cancleText="'取消'"
      :sureText="'确认'"
      :textp="'确定删除记录？'"
      :textshow="true"
      :dialogshow="dialogshow"
      @closeBack="dialogshow = false"
      @rightEvent="onConfirm"
    ></SecondConfirm>
  </div>
</template>

<script>
  import navbartop from '@/components/commons/navBartop'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  export default {
    name: 'searchPath',
    components: { SecondConfirm, navbartop },
    data() {
      return {
        tabSelected: 0, //tab选中  0 宝贝   1 店铺
        searchValue: this.$route.query.queryString || '', // 搜索的内容
        historyData: [], // 搜索历史数据
        allhistoryData: [], // 所有历史数据
        isMore: false,
        iconupDown: 1,
        dialogshow: false,
      }
    },
    created() {
      this.queryHistorySpu()
    },
    mounted() {
      this.$nextTick(function() {
        this.$refs.search.focus()
      })
    },
    methods: {
      // 是否删除
      confirm() {
        this.dialogshow = true
      },
      // 超过10条数据展开收起
      packUpMore(num) {
        // console.log(this.isMore)
        this.isMore = this.isMore ? !this.isMore : true
        if (num === 1) {
          this.iconupDown = 1
          this.historyData = this.allhistoryData
        } else {
          this.iconupDown = 2
          this.queryHistorySpu()
        }
      },
      // 查询商品搜索历史
      queryHistorySpu() {
        let spus = localStorage.getItem(this.$route.query.from + 'histore_search_spu')
        if (spus) {
          this.historyData = spus.split(',').filter((spu) => spu != '')
          this.allhistoryData = this.historyData.reverse().slice(0, 20)
          let data = this.historyData
          if (this.allhistoryData.length > 8) {
            this.historyData = data.slice(0, 8)
          } else {
            this.historyData = data
          }
          // this.historyData = this.historyData.reverse().slice(0, 20)
        }
      },
      toBack() {
        this.$router.back()
      },
      onConfirm() {
        this.historyData = []
        // 当前选中的是商品 则清除商品数据
        if (this.tabSelected == 0) {
          localStorage.removeItem(this.$route.query.from + 'histore_search_spu')
        } else {
          // 清除店铺数据
          localStorage.removeItem(this.$route.query.from + 'histore_search_store')
        }
        this.dialogshow = false
      },
      // 历史搜索
      toHistorySearch(value) {
        this.searchValue = value
        this.toSearch()
      },
      // 搜索
      toSearch() {
        // 搜索商品
        if (this.tabSelected == 0) {
          this.putSpuToHistory()
          this.$router.replace({
            path: this.$route.query.path,
            query: {
              ...this.$route.query,
              queryString: this.searchValue,
              cateId: '',
              from: this.$route.query.from,
              path: this.$route.query.path,
            },
          })
        }
      },
      // 将商品放入搜索历史
      putSpuToHistory() {
        // 加入搜索历史
        if (this.searchValue) {
          let searchHistory = localStorage.getItem(this.$route.query.from + 'histore_search_spu')
          // 存在搜索纪录
          if (searchHistory) {
            // 判断当前搜索的词是否已经在历史纪录中
            let arr = searchHistory.split(',')
            let index = arr.indexOf(this.searchValue)
            if (index >= 0) {
              arr.splice(index, 1)
              arr.push(this.searchValue)
            } else {
              arr.push(this.searchValue)
            }
            searchHistory = arr.join(',')
          } else {
            searchHistory = this.searchValue + ','
          }
          localStorage.setItem(this.$route.query.from + 'histore_search_spu', searchHistory)
        }
      },
      // 将店铺放入搜索历史
      putStoreToHistory() {
        // 加入搜索历史
        if (this.searchValue) {
          let searchHistory = localStorage.getItem(this.$route.query.from + 'histore_search_store')
          // 存在搜索纪录
          if (searchHistory) {
            // 判断当前搜索的词是否已经在历史纪录中
            if (searchHistory.split(',').indexOf(this.searchValue) == -1) {
              searchHistory += this.searchValue + ','
            }
          } else {
            searchHistory = this.searchValue + ','
          }
          localStorage.setItem(this.$route.query.from + 'histore_search_store', searchHistory)
        }
      },
      changeSearch() {
        this.historyData = []
        // 搜索商品
        this.queryHistorySpu()
      },
    },
  }
</script>

<style scoped lang="less">
  .contentBox {
    background: #fff;
    height: 100vh;
  }
  .searchBox {
    padding-left: 12px;
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;
    .backleft {
      margin: 0 10px;
      width: 24px;
      height: 24px;
      .searchLeft {
        width: 24px;
        height: 24px;
      }
    }
    .inputBox {
      height: 35px;
      border-radius: 18px;
      font-size: 14px;
      width: 100%;
      position: relative;
      margin-right: 10px;
      background: url('~@/assets/img/search_grey@2x.png') no-repeat 8px center #f2f2f2;
      background-size: 24px;
      .searchinput {
        position: absolute;
        top: 0;
        left: 35px;
        width: 235px;
        height: 100%;
        background-color: #f2f2f2;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
    }
    .searchIcon {
      width: 40px;
      height: 40px;
      line-height: 40px;
      margin-right: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #000;
      font-weight: 400;
    }
  }
  .searchKeywordsBox {
    padding: 30px 16px 20px 12px;
    overflow: hidden;
    .pack-up {
      height: 82.5px;
    }
    .keywordsList {
      padding-right: 10px;
      width: 100%;
      .keywordItem {
        max-width: 221px;
        border-radius: 14px;
        float: left;
        margin: 8px 6px 0 0;
        height: 30px;
        background: #f2f2f2;
        .keywordItem_content {
          max-width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          padding: 8px 13px 7px;
          font-size: 12px;
          line-height: 12px;
          text-align: center;
          color: #666;
        }
      }
      .more {
        position: relative;
        margin: 10px 10px 0 0;
        height: 30px;
        width: 30px;
        background: #f2f2f2;
        font-size: 13px;
        line-height: 31.25px;
        padding: unset;
        text-align: center;
        color: #666;
        border-radius: 15px;
        .iconImg {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -6px;
          margin-left: -6px;
          width: 12px;
          height: 12px;
          fill: currentColor;
          overflow: hidden;
        }
      }
    }
  }
  .textStyle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 3px;
    color: #000;
    font-size: 16px;
    font-weight: bold;
    position: relative;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .delWords {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/img/delete.png') no-repeat center;
    background-size: 100%;
  }
  .no-history {
    font-size: 12px;
    color: #999;
  }
</style>
