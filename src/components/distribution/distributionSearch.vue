<template>
  <div>
    <div class="searchBox">
      <div class="backleft">
        <img class="searchLeft" src="@/assets/img/back.png" alt @click="toBack" />
      </div>
      <div class="inputBox">
        <input type="text" :maxlength="30" class="searchinput" ref="search" placeholder="请输入搜索关键字" v-model.trim="searchValue" />
      </div>
      <div @click="toSearch()" class="searchIcon" style="background: none">搜索</div>
    </div>

    <div>
      <dl class="searchKeywordsBox">
        <p style="color: #333; font-size: 15px; font-weight: bold; position: relative">
          最近搜索
          <a class="delWords" @click="confirm"></a>
        </p>
        <dd class="keywordsList" :class="isMore ? '' : 'pack-up'" v-if="historyData.length > 0">
          <div class="keywordItem" v-for="(item, index) in historyData" :key="index">
            <div class="keywordItem_content" @click="toHistorySearch(item)">{{ item }}</div>
          </div>
          <div class="keywordItem item more" v-if="allhistoryData.length > 8" :class="{ iconupDown: iconupDown == 1 ? 'classDown' : 'classup' }">
            <img src="@/assets/img/up.png" alt class="iconImg" v-if="isMore" @click="packUpMore(2)" />
            <img src="@/assets/img/down.png" alt class="iconImg" v-else @click="packUpMore(1)" />
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { cookie } from 'vux'
import { Dialog } from 'vant'

export default {
  components: { [Dialog.name]: Dialog },
  data() {
    return {
      tabSelected: 0, //tab选中  0 宝贝   1 店铺
      searchValue: '', // 搜索的内容
      historyData: [], // 搜索历史数据
      allhistoryData: [], // 所有历史数据
      isMore: false,
      iconupDown: 1,
    }
  },
  created() {
    document.body.removeAttribute('class', 'gray-bg')
    this.queryHistorySpu()
  },
  mounted() {
    this.$nextTick(function () {
      this.$refs.search.focus()
    })
  },
  methods: {
    // 是否删除
    confirm() {
      Dialog.confirm({
        title: '操作提示',
        message: '确定删除记录？',
      })
        .then(() => {
          this.onConfirm()
        })
        .catch(() => {
          // on cancel
        })
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
      this.$router.back()
    },
    onConfirm() {
      this.historyData = []
      // 当前选中的是商品 则清除商品数据
      if (this.tabSelected == 0) {
        cookie.remove('histore_search_spu')
      } else {
        // 清除店铺数据
        cookie.remove('histore_search_store')
      }
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
          path: '/distributionGoodsList',
          query: {
            queryString: this.searchValue,
            cateId: '',
          },
        })
      } else {
        // 搜索店铺
        this.putStoreToHistory()
        this.$router.replace({
          path: '/searchshoplist',
          query: { keyword: this.searchValue },
        })
      }
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
.searchBox {
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
    background: url('../../assets/img/distribution/search_goods.png') no-repeat 8px center #f2f2f2;
    background-size: 24px;
    .searchinput {
      position: absolute;
      top: 0;
      left: 35px;
      width: 235px;
      height: 100%;
      background-color: #f2f2f2;
      border: none;
    }
  }
  .searchIcon {
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
    font-size: 14px;
    color: #000;
  }
}
.searchKeywordsBox {
  padding: 20px 14px;
  overflow: hidden;
  .pack-up {
    height: 82.5px;
  }
  .keywordsList {
    width: 100%;
    .keywordItem {
      max-width: 100%;
      border-radius: 15px;
      padding: 0 8px;
      float: left;
      margin: 10px 10px 0 0;
      height: 30px;
      background: #f2f2f2;
      .keywordItem_content {
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        line-height: 32.5px;
        font-size: 13px;
        text-align: center;
        color: #666;
      }
    }
    .more {
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
        width: 12px;
        height: 12px;
        fill: currentColor;
        overflow: hidden;
      }
    }
  }
}
.delWords {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('../../assets/img/delete.png') no-repeat center;
  background-size: 100%;
  position: absolute;
  top: 3px;
  right: 0;
}
</style>
