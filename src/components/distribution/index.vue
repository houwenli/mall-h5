<template>
  <div class="boxWrapper">
    <header class="hearBox">
      <div class="searchBox">
        <img src="../../assets/img/distribution/whiteback@2x.png" @click="back" alt="" />
        <div class="search" @click="toSearch">
          <input type="text" class="searchContet" placeholder="请输入查询内容" />
        </div>
      </div>
    </header>

    <!-- banner -->
    <div class="bannerBox margin12">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(res, index) in images" :key="index">
          <img :src="res" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- nav导航 -->
    <div class="navBox">
      <router-link to="" class="routerBox">
        <img src="../../assets/img/distribution/sysj@2x.png" alt="" />
        <span>收益数据</span>
      </router-link>
      <router-link to="" class="routerBox">
        <img src="../../assets/img/distribution/txjl@2x.png" alt="" />
        <span>提现记录</span>
      </router-link>
      <router-link to="" class="routerBox">
        <img src="../../assets/img/distribution/symx@2x.png" alt="" />
        <span>收益明细</span>
      </router-link>
    </div>

    <!-- 为你推荐 -->
    <div class="recommendBox">
      <div class="queryBox bgcolor">
        <template v-for="(item, index) in filterBoxList">
          <li class="filterItem" :key="index" :class="{ isActivecolor: filterItemIndex === index }" @click="filterChoose(item, index)">
            {{ item.filterBoxName }}
            <div class="sort-type" v-if="item.hasSort">
              <img
                v-if="filterItemIndex === index && sortWrapIndex === 2"
                style="height: 5px; width: 7px"
                src="../../assets/img/sort_up_select@2x.png"
                alt=""
              />
              <img v-else style="height: 5px; width: 7px" src="../../assets/img/sort_up@2x.png" alt="" />
              <img
                v-if="filterItemIndex === index && sortWrapIndex === 1"
                style="height: 5px; width: 7px; margin-top: 1px"
                src="../../assets/img/sort_down_select@2x.png"
                alt=""
              />
              <img v-else style="height: 5px; width: 7px; margin-top: 1px" src="../../assets/img/sort_down@2x.png" alt="" />
            </div>
          </li>
        </template>
      </div>
      <Recommend :queryRcommendData="queryRcommendData"></Recommend>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Lazyload, Tabbar, TabbarItem } from 'vant'
import Recommend from './recommendGoods'
export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Lazyload.name]: Lazyload,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    Recommend,
  },
  data() {
    return {
      images: [
        'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/c779d5bed5cb57a090b4d5f5fc70abcd.jpg?imageView2/1/w/750',
        'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/5120950750f8945eeb50731c05e9ff69.jpg?imageView2/1/w/750',
        'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/7e9c5b223636ad524495cf4356bbdaae.jpg?imageView2/1/w/750',
      ],
      queryRcommendData: '',
      filterItemIndex: 0, // 过滤的item
      sortWrapIndex: 0, // 综合过滤 0 综合过滤 1 价格从低到高 2 价格从高到低
      filterBoxList: [
        {
          filterBoxName: '综合',
          hasSort: false,
        },
        {
          filterBoxName: '佣金',
          hasSort: false,
        },
        {
          filterBoxName: '价格',
          hasSort: true,
        },
        {
          filterBoxName: '销量',
          hasSort: false,
        },
      ], // 筛选条件列表
      searchParam: {
        pageNum: 0,
        pageSize: 10,
        queryString: '', // 关键字搜索
        sortItems: [], // 排序
      }, // 搜索的参数
    }
  },
  created() {
    document.body.setAttribute('class', 'gray-bg')
  },
  methods: {
    // 筛选排序
    filterChoose(item, index) {
      if (this.filterItemIndex === index) {
        if (!item.hasSort) {
          return
        }
        this.sortWrapIndex = this.sortWrapIndex === 1 ? 2 : 1
      } else {
        this.filterItemIndex = index
        this.sortWrapIndex = 1
      }
      this.setSearchParmas()
    },
    setSearchParmas() {
      // 选中的第一个过滤
      if (this.filterItemIndex == 0) {
        // 综合过滤
        this.searchParam.sortItems = []
      } else if (this.filterItemIndex == 1) {
        // 选中佣金过滤
        this.searchParam.sortItems.push({ field: 'commission', order: 1 })
      } else if (this.filterItemIndex == 2) {
        // 选中价格过滤
        if (this.sortWrapIndex === 1) {
          // 价格从低到高
          this.searchParam.sortItems.push({ field: 'price', order: 0 })
        } else {
          // 价格从高到低
          this.searchParam.sortItems.push({ field: 'price', order: 1 })
        }
      } else if (this.filterItemIndex == 3) {
        // 选中销量过滤
        this.searchParam.sortItems.push({ field: 'saleNum', order: 1 })
      }
      console.log('this.searchParam', this.searchParam)
    },
    back() {
      this.$router.back()
    },
    toSearch() {
      this.$router.push({
        path: 'distributionSearch',
        query: {},
      })
    },
  },
}
</script>

<style lang="less" scoped>
.bgcolor {
  background-color: #fff;
  color: #000;
  font-size: 14px;
}
.boxWrapper {
  .padding12 {
    padding: 0 12px;
  }
  .margin12 {
    margin: auto 12px;
  }
  .hearBox {
    width: 100%;
    height: 156px;
    background: linear-gradient(128deg, #ff2424 0%, #ff8566 100%); // linear-gradient(128deg, #ff2424 0%, #ff8566 100%);;
    border-radius: 0px 0px 10px 10px;
    .searchBox {
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 24px;
        height: 24px;
      }
      .search {
        width: 310px;
        height: 32px;
        border-radius: 16px;
        position: relative;
        padding-left: 15px;
        background: url('../../assets/img/search_goods.png') no-repeat 10px center;
        background-size: 24px;
        background-color: #ffffff;
        .searchContet {
          position: absolute;
          width: 246px;
          left: 40px;
          top: 0;
          height: 32px;
          border: none;
        }
      }
    }
  }
  .bannerBox {
    width: 351px;
    margin-top: -104px;
    /deep/ .van-swipe-item {
      width: 351px !important;
      height: 140px;
    }
    /deep/ .van-swipe__indicator {
      width: 8px;
      height: 4px;
      border-radius: 3px;
    }
    /deep/ .van-swipe__indicator--active {
      background-color: #e60113;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .navBox {
    display: flex;
    justify-content: space-around;
    margin: 20px auto;
    .routerBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 45px;
        height: 45px;
      }
      span {
        color: #666;
        font-size: 12px;
        margin-top: 4px;
      }
    }
  }
  .queryBox {
    border-radius: 10px 10px 0 0;
    height: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .filterItem {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      .sort-type {
        margin-left: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .isActivecolor {
    color: #e60113;
  }
}
</style>
