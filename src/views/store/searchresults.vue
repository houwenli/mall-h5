<template>
  <div class="content">
    <navbartop :title="$route.query.type == 1 ? '我的店铺' : '关注店铺'" @clickBack="$router.go(-1)" :isConfirm="true" class="navtop"></navbartop>
    <div class="searchBox">
      <div class="inputBox">
        <input ref="search" v-model.trim="value" type="text" :maxlength="30" class="searchinput" @focus="focus" placeholder="请输入搜索关键字" />
      </div>
    </div>
    <div class="result-sort">
      <li v-for="(item, index) in filterBoxList" class="box-flex" :key="index" :class="{ cur: filterItemIndex === index }" @click="getSearchList(item, index)">
        {{ item.filterBoxName }}
        <div class="sort-type" v-if="item.hasSort">
          <img v-if="filterItemIndex === index && priceSort === 1" style="height: 0.2rem; width: 0.28rem" src="@/assets/img/sort_up_select@2x.png" alt="" />
          <img v-else style="height: 0.2rem; width: 0.28rem" src="@/assets/img/sort_up@2x.png" alt="" />
          <img
            v-if="filterItemIndex === index && priceSort === 0"
            style="height: 0.2rem; width: 0.28rem; margin-top: 1px"
            src="@/assets/img/sort_down_select@2x.png"
            alt=""
          />
          <img v-else style="height: 0.2rem; width: 0.28rem; margin-top: 1px" src="@/assets/img/sort_down@2x.png" alt="" />
        </div>
      </li>
    </div>
    <spuList v-if="!isEmpty" :list="list" :config="config" @onLoad="onLoad" @toDetails="toDetails" :isOld="true" ></spuList>
    <van-empty v-else image="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/img_blank_page.png" image-size="160px" description="没有找到相关宝贝" class="no-valid">
      <slot></slot>
    </van-empty>
  </div>
</template>
<script>
  import navbartop from '@/components/commons/navBartop'
  import { Empty } from 'vant'
  import spuList from './spuList'
  import { searchWordsVisit } from '@/api/visit'
  import { pageAgencyStore } from '@/api/storeindex'
  export default {
    components: {
      spuList,
      navbartop,
      [Empty.name]: Empty,
    },
    data() {
      return {
        value: this.$route.query.queryString || '',
        list: [],
        config: {
          loading: false,
          finished: false,
          error: false,
        },
        sort: 1,
        pageNum: 1,
        pageSize: 10,
        isEmpty: false,
        filterBoxList: [
          {
            filterBoxName: '综合',
            hasSort: false,
          },
          {
            filterBoxName: '价格',
            hasSort: true,
          },
          {
            filterBoxName: '仅看有货',
            hasSort: false,
          },
        ], // 筛选条件列表
        filterItemIndex: 0, // 过滤的item
        priceSort: -1, // 综合过滤 0 综合过滤 1 价格从低到高 2 价格从高到低
        storeId: this.$route.query.storeId,
      }
    },
    created() {
      this.value && searchWordsVisit({
        searchName: this.value,
      })
    },
    methods: {
      getSearchList(item, index) {
        this.config.finished = false
        this.config.loading = true
        this.config.error = false
        this.isEmpty = false

        if (this.filterItemIndex === index) {
          this.priceSort = this.priceSort === 1 ? 0 : 1
        } else {
          this.filterItemIndex = index
          this.priceSort = 0
        }
        if (item.filterBoxName == '综合') {
          this.priceSort = -1
        }
        if (this.filterItemIndex == 0) {
          this.sort = 1
        } else if (this.filterItemIndex == 1 && this.priceSort == 1) {
          this.sort = 2
        } else if (this.filterItemIndex == 1 && this.priceSort == 0) {
          this.sort = 3
        } else if (this.filterItemIndex == 2) {
          this.sort = 4
        }
        this.onLoad(1)
      },
      toDetails(item) {
        let path = '/spudetail'
        let query = { id: item.id, storeId: item.storeId, sourceType: item.sourceType || 1 }
        if(item.goodsSource == 4) {
          path = '/motorCar/detail',
          query = {skuId: item.id,storeId: item.storeId,sourceType: 2}
        }
        this.$router.push({ path, query })
      },
      focus() {
        let { path, queryString, from } = this.$route.query
        this.$router.replace({
          path: '/shopSearch',
          query: {
            path,
            from,
            queryString,
          },
        })
        // this.$router.replace('search');
      },
      async onLoad(num) {
        let params = {
          pageNum: num || this.pageNum,
          pageSize: this.pageSize,
          sort: this.sort,
          spuName: this.value,
          storeId: this.storeId,
        }
        try {
          let res = await pageAgencyStore(params)
          if (num) {
            this.list = []
            this.pageNum = 1
          }
          if (res.code === 200) {
            let data = (res.data && res.data.list) || []
            this.list = this.list.concat(data)
            if (this.pageNum === 1 && this.list.length === 0) {
              this.isEmpty = true
            }
            this.pageNum++
            if (data.length < this.pageSize) {
              this.config.finished = true
            } else {
              this.config.loading = false
            }
          } else {
            this.config.error = true
            this.config.loading = false
          }
        } catch (error) {
          this.config.error = true
          this.config.loading = false
        }
      },
    },
  }
</script>
<style lang="less" scoped>
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
  }
  .sort-type {
    //position: absolute;
    //top: 0;
    //right: 0.8rem;
    height: 100%;
    margin-left: 0.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .result-sort {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 22px 8px 37px;
    position: unset;
    overflow: hidden;
    height: auto;
  }

  .result-sort li {
    border-bottom: 0;
    color: #000000;
    height: auto;
    width: auto;
  }

  .result-sort .cur {
    color: #e60113;
  }

  .sort-wrap li.cur {
    color: #e60113 !important;
  }

  .result-sort li:first-child .arrow {
    top: 1px;
    // vertical-align: middle;
  }

  .result-sort li:first-child .arrow:after {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0.16rem;
    transform: rotate(180deg);
    border-color: transparent transparent #e60113 transparent;
  }

  .result-sort li:first-child .firstNavli:after {
    border-color: transparent transparent #000 transparent;
  }

  .result-sort li:first-child .arrowactive {
    top: -0.12rem;
    // vertical-align: middle;
  }

  .result-sort li:first-child .arrowactive:after {
    transform: rotate(0deg);
  }
  .result-sort li:nth-child(2) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .no-valid {
    padding-top: 64px;
    /deep/ .van-empty__description {
      margin-top: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #000d1d;
    }
  }
</style>
