<template>
  <div :style="{ overflow: confirmShow ? 'hidden' : '', height: '100%' }">
    <div class="search-group">
      <div class="backleft">
        <img class="search-left" src="@/assets/img/back.png" alt @click="toBack" />
      </div>
      <!-- <x-input ref="search" placeholder="请输入搜索关键字" v-model.trim="searchValue" class="search-input" style="margin-left: 0" :max="30">
        <i class="goods-search" slot="label" style="padding:0 10px;display:block;margin: -1.5px 3px 0;"></i>
      </x-input> -->
      <div class="inputBox">
        <input ref="search" type="text" :placeholder="type=='gift'? '在结果中搜索商品':'请输入搜索关键字'" class="input" v-model.trim="searchValue" @keyup.enter="toSearch()" :maxlength="50" />
      </div>
      <div @click="toSearch()" class="search-icon" style="background: none">搜索</div>
    </div>

    <div style="padding-top: 50px">
      <!-- <tab v-model="tabSelected">
        <tab-item @on-item-click="changeSearch">宝贝</tab-item>
        <tab-item @on-item-click="changeSearch">店铺</tab-item>
      </tab>-->
      <dl class="search-keywords">
        <dt style="color: #333; font-size: 15px; font-weight: bold">
          搜索历史
          <a class="del_words" @click="delHistoryData"></a>
        </dt>
        <div v-if="historyData.length === 0" style="margin: 0.8rem 0; font-size: 0.48rem; color: #999999">无搜索历史</div>
        <dd class="keywords-list" :class="isMore ? '' : 'pack-up'">
          <div class="keywordItem" v-for="(item, index) in historyData" :key="index">
            <div class="keywordItem_content" @click="toHistorySearch(item)">{{ item }}</div>
          </div>
          <div class="keywordItem item more" v-if="allhistoryData.length > 8" :class="{ iconupDown: iconupDown == 1 ? 'classDown' : 'classup' }">
            <img src="@/assets/img/up.png" alt class="icon" v-if="isMore" @click="packUpMore(2)" />
            <img src="@/assets/img/down.png" alt class="icon" v-else @click="packUpMore(1)" />
          </div>
        </dd>
      </dl>
    </div>

    <!-- 二次确认 -->
    <SecondConfirm
      :title="'确认删除搜索历史？'"
      :cancleText="'取消'"
      :sureText="'确认'"
      :dialogshow="confirmShow"
      @closeBack="confirmShow = false"
      @rightEvent="rightEvent"
    ></SecondConfirm>
  </div>
</template>

<script>
import { Group, XInput } from 'vux'
import { cookie } from 'vux'
import SecondConfirm from './SecondConfirm'
export default {
  components: { Group, XInput, SecondConfirm },
  data() {
    return {
      tabSelected: 0, //tab选中  0 宝贝1 店铺
      confirmShow: false,
      searchValue: '', // 搜索的内容
      historyData: [], // 搜索历史数据
      allhistoryData: [], // 所有历史数据
      storeId: this.$route.query.storeId, // 店铺id
      isMore: false,
      iconupDown: 1,
      type:'',
    }
  },
  created() {
    console.log(this.$route.query,'this.$route.query++++++++++++++');
    if(this.$route.query && this.$route.query.type == 'gift') {
      this.type = 'gift'
    }
    console.log(this.$route.query.storeIds,'this.$route.query.storeds');
    document.body.removeAttribute('class', 'gray-bg')
    if(this.$route.query && this.$route.query.searchValue) {
      this.searchValue = this.$route.query.searchValue
    }
    this.queryHistorySpu()
  },
  mounted() {
    this.$nextTick(function () {
      this.$refs.search.focus()
    })
  },
  methods: {
    delHistoryData() {
      if (this.historyData.length > 0) {
        this.confirmShow = true
      }
    },
    rightEvent() {
      this.historyData = []
      // 当前选中的是商品 则清除商品数据
      if (this.tabSelected == 0) {
        cookie.remove('histore_search_spu')
      } else {
        // 清除店铺数据
        cookie.remove('histore_search_store')
      }
      this.confirmShow = false
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
      let spus = cookie.get('histore_search_spu')
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
    // 查询店铺搜索历史
    queryHistoryStore() {
      let stores = cookie.get('histore_search_store')
      if (stores) {
        this.historyData = stores.split(',').filter((store) => store != '')
        this.historyData = this.historyData.reverse().slice(0, 20)
      }
    },
    toBack() {
      // this.$router.push('/')
      this.$router.back();
    },
    // 历史搜索
    toHistorySearch(value) {
      this.searchValue = value
      this.toSearch()
    },
    // 搜索
    toSearch() {
      // 搜索商品
      console.log(this.storeId, 'this.storeId+--+',this.$route.query.storeIds)
      // if (this.tabSelected == 0) {
      this.putSpuToHistory()
      let query = {
          queryString: this.searchValue,
          cateId: '',
          storeId: this.storeId,
        }
        if(this.$route.query.type && this.$route.query.type==='gift'){
          query.storeids = this.$route.query.storeIds
          query.type = 'gift'
          query.cardPrice = this.$route.query.cardPrice
        }
      this.$router.replace({
        path: '/spulist',
        query
      })
      // } else {
      //   // 搜索店铺
      //   this.putStoreToHistory()
      //   this.$router.replace({
      //     path: '/searchshoplist',
      //     query: { keyword: this.searchValue },
      //   })
      // }
    },
    // 将商品放入搜索历史
    putSpuToHistory() {
      // 加入搜索历史
      if (this.searchValue) {
        let searchHistory = cookie.get('histore_search_spu')
        // 存在搜索纪录
        if (searchHistory) {
          // 判断当前搜索的词是否已经在历史纪录中
          if (searchHistory.split(',').indexOf(this.searchValue) == -1) {
            searchHistory += this.searchValue + ','
          }
        } else {
          searchHistory = this.searchValue + ','
        }
        cookie.set('histore_search_spu', searchHistory)
      }
    },
    // 将店铺放入搜索历史
    putStoreToHistory() {
      // 加入搜索历史
      if (this.searchValue) {
        let searchHistory = cookie.get('histore_search_store')
        // 存在搜索纪录
        if (searchHistory) {
          // 判断当前搜索的词是否已经在历史纪录中
          if (searchHistory.split(',').indexOf(this.searchValue) == -1) {
            searchHistory += this.searchValue + ','
          }
        } else {
          searchHistory = this.searchValue + ','
        }
        cookie.set('histore_search_store', searchHistory)
      }
    },
    changeSearch() {
      this.historyData = []
      // 搜索商品
      if (this.tabSelected == 0) {
        this.queryHistorySpu()
      } else {
        // 搜索店铺
        this.queryHistoryStore()
      }
    },
  },
}
</script>

<style scoped lang="less">
.search-input {
  border-radius: 0.9rem;
  height: 1.28rem;
  border: none;
  /deep/ .weui-icon-clear {
    padding-right: 0.2rem;
  }
  /deep/ .search-input input {
    vertical-align: middle;
  }
}
.search-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .backleft {
    margin: 0.28rem 0 0 0.6rem;
    width: 1.2rem;
    height: 1.2rem;
    .search-left {
      width: 0.96rem;
      height: 0.96rem;
    }
  }
  .inputBox {
    position: relative;
    width: 11.2rem;
    height: 1.28rem;
    border-radius: 16px;
    padding-left: 1.44rem;
    background: url('../../assets/img/search_goods.png') no-repeat 0.32rem center;
    background-size: 0.96rem;
    background-color: #ededed;
    .input {
      background-color: #ededed;
      width: 8.76rem;
      height: 100%;
    }
    input::-webkit-input-placeholder {
      color: #9d9d9d;
      font-size: 0.56rem;
    }
    input:-moz-placeholder {
      color: #9d9d9d;
      font-size: 0.56rem;
    }
    input::-moz-placeholder {
      color: #9d9d9d;
      font-size: 0.56rem;
    }
    input::-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #9d9d9d;
      font-size: 0.56rem;
    }
  }
  .search-left-arrow:before {
    border-color: #696969;
  }
  /deep/ .search-input[data-v-54bbe03f] .weui-icon-clear {
    display: none;
  }
}
.search-keywords {
  .pack-up {
    height: 3.3rem;
    // overflow: hidden;
  }
}
.search-keywords .keywords-list {
  overflow: unset;
}
.search-keywords .keywords-list .keywordItem {
  max-width: 100%;
  border-radius: 0.6rem;
  padding: 0 0.32rem;
  .keywordItem_content {
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    line-height: 1.3rem;
  }
}
.search-keywords .keywords-list .more {
  margin: 0.4rem 0.4rem 0 0;
  height: 1.2rem;
  width: 1.2rem;
  background: #f2f2f2;
  font-size: 0.52rem;
  line-height: 1.25rem;
  padding: 0 0.3rem;
  text-align: center;
  color: #666;
  border-radius: 0.6rem;
}
.del_words {
  width: 0.64rem;
  height: 0.64rem;
  background: url('../../assets/img/delete.png') no-repeat center;
  background-size: 100%;
}
.search-icon {
  width: 1.28rem;
  font-size: 0.56rem;
  color: #000;
}
.goods-search {
  width: 0.96rem;
  height: 0.96rem;
  background: url('../../assets/img/search_goods.png') no-repeat center;
  background-size: 100%;
}
</style>
