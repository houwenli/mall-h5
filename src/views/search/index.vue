<template>
  <div class="search-page-container">
    <div class="search-page-bg"></div>
    <!-- 搜索框 -->
    <div class="search-group">
      <img class="search-left" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search-toback-black-icon.png" alt @click="toBack()" />
      <div class="inputBox">
        <img class="left-icon" src="https://wsjc-web.wsecar.com/wsf-mall/home/search.png" />
        <input
          ref="search"
          type="text"
          :placeholder="placeholderText ? placeholderText : '请输入搜索关键字'"
          class="input"
          v-model.trim="searchValue"
          @keyup.enter="toSearch()"
          :maxlength="50"
        />
        <div ref="searchBtn" @click="toSearch()" class="search-icon">搜索</div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="search-content-container">
      <search-history @toSearch="toSearch" @update="getHistory"></search-history>
      <searchFind ref="searchFind" @toSearch="toSearch" @setFindData="setFindData"></searchFind>
      <recommandGoods></recommandGoods>
    </div>
  </div>
</template>

<script>
  import searchHistory from './components/search-history'
  import searchFind from './components/search-find'
  import recommandGoods from './components/recommand-goods'

  export default {
    components: { searchHistory, searchFind, recommandGoods },
    data() {
      return {
        searchValue: '', // 搜索的内容
        searchHistory: [], // 搜索历史数据
        placeholderText: '',
        isMore: false,
        type: '',
        number: 0,
        time: null,
        searchFind: [], //搜索发现
        isInput: false,
        // 当前滚动的索引 - 在点击搜索时取值
        currentSwipeIndex: 0,
        from: this.$route.query.from || '' // 进入来源
      }
    },
    // 进入页面之前
    beforeRouteEnter(to, from, next) {
      console.log(from, to)
      if (from.path === '/' || from.path === '/spulist' || from.path === '/distributionActivity'){
        sessionStorage.setItem('searchPlaceholder', to.query.searchValue)
      }
      next((vm) => {
        // 不从首页和搜索页进来
        if (from.path !== '/' && from.path !== '/spulist' && from.path !== '/distributionActivity') {
            vm.searchValue = to.query.searchValue
        }
      })
    },

    created() {
      this.placeholderText = sessionStorage.getItem('searchPlaceholder') || ''
      // 获取搜索历史数据
      this.getHistory()
      this.$nextTick(function() {
        this.$refs.search.focus()
      })
    },
    methods: {
      //搜索发现
      setFindData(list) {
        this.searchFind = list
      },
      //搜索历史
      getHistory() {
        this.searchHistory = JSON.parse(localStorage.getItem(this.from + 'searchHistory')) || []
      },
      // 搜索商品
      toSearch(value,type) {
        // value 有值表示 从搜索历史中和搜索发现中点击查询
        if (value) {
          this.searchValue = value
        } else if (!this.searchValue) {
          // 如果搜索框没有值 采用 默认值placeholderText
          this.searchValue = this.placeholderText
        }
        // 搜索发现不存入搜索历史
        if(type !== 'find'){
            this.putSpuToHistory()
        }
        let query = {
          ...this.$route.query,
          queryString: this.searchValue,
          cateId: '',
          storeId: this.storeId,
        }
        if (this.$route.query.type && this.$route.query.type === 'gift') {
          query.storeids = this.$route.query.storeIds
          query.type = 'gift'
          query.cardPrice = this.$route.query.cardPrice
        }
        this.$router.replace({
          path: '/spulist',
          query,
        })
      },
      // 将商品放入搜索历史
      putSpuToHistory() {
        if (!this.searchValue) return
        // 加入搜索历史
        let searchHistory = JSON.parse(localStorage.getItem(this.from+'searchHistory')) || []
        // 判断当前搜索的词是否已经在历史纪录中
        if (searchHistory.find((item) => item === this.searchValue) === undefined) {
          searchHistory.unshift(this.searchValue)
          searchHistory = JSON.stringify(searchHistory)
          localStorage.setItem(this.from + 'searchHistory', searchHistory)
        }
      },
      toBack() {
        this.$router.back()
      },
    },
  }
</script>

<style scoped lang="less">
  .input-swipe {
    display: flex;
    flex-direction: column;
    div {
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
  .search-page-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .search-group {
    display: flex;
    align-items: center;
    padding: 12px;
    background: none;

    position: static !important;
    .search-left {
      width: 20px;
      height: 20px;
    }

    .inputBox {
      background: #f2f2f2;
      border-radius: 19px;
      width: 100%;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 2px 0px 8px;
      margin-left: 12px;
      .left-icon {
        width: 16px;
        height: 16px;
      }
      .input {
        flex: 1;
        padding: 0px 12px 0px 8px;
        height: 100%;
        line-height: 33px;
        background: #f2f2f2;
      }
      .input::-webkit-input-placeholder {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c6c6c6;
        background: #f2f2f2;
      }
      .input::-moz-placeholder {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c6c6c6;
        background: #f2f2f2;
      }
      .inputinput::-ms-input-placeholder {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c6c6c6;
        background: #f2f2f2;
      }
      .search-icon {
        width: 62px;
        height: 28px;
        border-radius: 19px;
        color: #fff;
        justify-content: space-around;
        align-items: center;
        margin: 0px !important;
        font-size: 14px;
        font-weight: 400;
        background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%) !important;
      }
    }
  }
  .search-content-container {
    flex: 1;
    background: #f8f8f8;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 12px;
    overflow-y: scroll;
  }

  .search-page-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 66px;
    z-index: -1;
    background: linear-gradient(to bottom,rgba(255, 255, 255, 1), rgba(248, 248, 248, 1));
  }
</style>
