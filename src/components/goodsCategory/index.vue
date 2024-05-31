<template>
  <div class="goods-category-container">
    <div class="header_nav">
      <header-nav :showLogo="false"></header-nav>
    </div>
    <div class="first-level-wrapper">
      <div class="first-level-left">
        <first-level-item v-for="(item,index) in firstLever" @clickItem="chooseFirstLever(item,index)" :key="item.id" :item='item' :className="firstLeverId==item.id?'active first-level-item first-item'+index:'first-level-item first-item'+index">
        </first-level-item>
      </div>
      <div class="right-more" @click="showAllType=true">
        <span>全</span>
        <span>部</span>
        <img src="@/assets/img/goodsType/expandAll.png" alt="">
      </div>
    </div>

    <div class="main-container">
      <div class="left-bar">
        <div v-for="(item,index) in secondLever" :key="index" :class="secondId==item.id?'active second-level-item second-item'+index:'second-level-item second-item'+index" @click="chooseSecondLever(item,index)">{{item.name}}</div>
      </div>
      <div class="list-content">
        <!-- nav -->
        <filter-box :filterBoxList='filterBoxList' :loading='loading' @setSearchParmas='setSearchParmas'></filter-box>
        <div class="list-content-wrapper">
          <van-pull-refresh @touchstart.native='touchStart' @touchmove.native='touchMove' @touchend.native='touchEnd' v-model="refreshing" @refresh="onRefresh" :disabled='disabled' pulling-text="下拉至上一个分类">
            <template #loosing>
              <div>
                释放至上一个分类
              </div>
            </template>
            <van-list offset="5" v-model="loading" ref="goodsList" :immediate-check="false" :finished="finished" @load="onLoad(secondLever[secondIndex])">
              <div v-for="(item,index) in goodsList" :key="index" class="goods-list-itme" @click="tospudetail(item)">
                <img :src="item.url" alt="">
                <div class="right">
                  <p>{{item.name}}</p>
                  <p class="money">￥{{ item.isBatchSku == '1' ? item.lowestBatchPrice.toFixed(2) : item.finalPrice.toFixed(2) }}</p>
                </div>
              </div>
              <template #finished>
                <div :class="isEmpty?'empty-box':''">
                  <div v-if='isEmpty'>
                    <img src="@/assets/img/goodsType/empty.png" alt="">
                    <p>该类目暂无商品</p>
                    <p>上滑查看更多</p>
                  </div>
                  <div v-else>
                    <p class="tip-to-next">{{finishedText}}</p>
                  </div>
                </div>
              </template>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>
    <div class="tabs">
      <foot ref="footRef" title='分类' />
    </div>

    <!-- 全部分类展开弹窗 -->
    <van-popup overlay-class='all-type-overlay' v-model="showAllType" position="top" class="all-type-popup">
      <div class="header_nav">
        <header-nav :showLogo="false"></header-nav>
      </div>
      <p class="all-title">全部分类</p>
      <div class="all-type-wrappler">
        <first-level-item v-for="(item,index) in firstLever" @clickItem="chooseFirstLever(item,index)" :key="item.id" :item='item' :className="firstLeverId==item.id?'active all-type-item':'all-type-item'">
        </first-level-item>
      </div>
      <div class="all-close" @click='showAllType=false'>
        收起
        <span class="single"></span>
      </div>
    </van-popup>
  </div>
</template>
<script>
import filterBox from './filterBox.vue'
import firstLevelItem from './firstLeverItem.vue'
import { List as VanList, PullRefresh as VanPullRefresh, Popup as VanPopup} from 'vant'
import { getCategory } from '@/api/goodsCategory'
import { searchSpus } from '@/api/spulist'
import foot from '@/components/commons/foot'
import headerNav from '@/components/index/template/header'
export default {
  name: 'goodsCategory',
  components: {
    VanList,
    VanPullRefresh,
    foot,
    headerNav,
    VanPopup,
    firstLevelItem,
    filterBox
  },
  data() {
    return {
      firstLeverId: undefined,
      secondId: 0,
      secondIndex: 0,
      firstLever: [],
      secondLever: [],
      goodsList: [],
      loading: false,
      finished: false,
      showAllType: true,
      searchParam: {
        cateId: '-1', // 分类id
        pageNum: 0,
        pageSize: 10,
        sortItems: [], // 排序
        stockFilter: 1
      }, // 搜索的参数
      onBottom: false,
      isEmpty: false,
      filterBoxList: [
        {
          filterBoxName: '综合',
          hasSort: true,
        },
        {
          filterBoxName: '销量',
          hasSort: false,
        },
        {
          filterBoxName: '最新上架',
          hasSort: false,
        },
      ], // 筛选条件列表
      startouchY: 0,
      refreshing: false,
      curScrollTop: 0
    }
  },
  computed: {
    disabled() {
      const parentIndex = this.firstLever.findIndex(ele => ele.id == this.firstLeverId)
      return this.secondIndex == 0 && parentIndex == 0
    },
    finishedText() {
      const index = this.secondLever.findIndex(ele => ele.id == this.secondId)
      const parentIndex = this.firstLever.findIndex(ele => ele.id == this.firstLeverId)
      if (parentIndex == this.firstLever.length - 1 && index == this.secondLever.length - 1) {
        return '没有更多了'
      }
      return '上拉至下一分类'
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    // 获取上次滚动条位置
    const moveDom = this.getEleDom('.list-content-wrapper')
    moveDom.scrollTop = this.curScrollTop || 0
    // this.init();
  },
  beforeRouteLeave(to, from, next) {
    // 记录滚动条位置
    const moveDom = this.getEleDom('.list-content-wrapper')
    this.curScrollTop = moveDom.scrollTop || 0
    next()
  },
  methods: {
    init() {
      getCategory().then(res => {
        if (res.code == 200 && res.data) {
          this.firstLever = res.data.map(item => {
            return {
              ...item,
              name: item.name,
              id: item.id,
              url: item.url,
            }
          })
          this.firstLeverId = this.firstLever[0].id
          this.getSecondCategoryApi(this.firstLeverId)
        }
      })
    },
    getSecondCategoryApi(id) {
      getCategory(id).then(res => {
        if (res.code == 200 && res.data) {
          if (res.data.length) {
            this.secondLever = res.data.map(item => {
              return {
                ...item,
                name: item.name,
                id: item.id
              }
            })
            this.secondIndex = 0
            this.secondId = this.secondLever[0] && this.secondLever[0].id
            this.reset()
            this.onLoad(this.secondLever[0])
          } else {
            const parentIndex = this.firstLever.findIndex(ele => ele.id == this.firstLeverId)
            this.firstLeverId = this.firstLever[parentIndex + 1] && this.firstLever[parentIndex + 1].id
            if (this.firstLeverId) this.getSecondCategoryApi(this.firstLeverId)
          }
        }
      })
    },
    chooseFirstLever(item, index) {
      if (item.id == this.firstLeverId) {
        this.showAllType = false
        return
      }
      this.handleScroll(".first-item" + index, '.first-level-left', 'left')
      this.showAllType = false
      this.firstLeverId = item.id
      this.secondLever = []
      this.reset()
      this.getSecondCategoryApi(item.id)
    },
    chooseSecondLever(item, index) {
      this.handleScroll(".second-item" + index, '.left-bar', 'top')
      if (index == this.secondIndex) return
      this.secondId = item.id
      this.secondIndex = index
      this.reset()
      this.onLoad(item)
    },
    toNext() {
      this.loading = false
      this.finished = false
    },
    touchStart(event) {
      if (!this.finished) { return }
      this.startouchY = event.touches[0].pageY
    },
    touchMove(event) {
      if (!this.finished) { return }
      if (this.startouchY - event.changedTouches[0].pageY <= 0) return
      const dom = this.getEleDom('.list-content-wrapper')
      const clientHeight = dom.clientHeight;
      const scrollTop = dom.scrollTop;
      const scrollHeight = dom.scrollHeight;
      // +5是以防一些边界情况卡住
      if (clientHeight + scrollTop + 5 >= scrollHeight) {
        event.preventDefault()
        const relativeY = this.startouchY - event.changedTouches[0].pageY
        const moveDom = this.getEleDom('.van-pull-refresh')
        moveDom.style.bottom = relativeY + 'px'
      }
    },
    touchEnd(event) {
      const moveDom = this.getEleDom('.van-pull-refresh')
      moveDom.style.bottom = '0px'
      if (!this.finished) { return }
      const dom = this.getEleDom('.list-content-wrapper')
      const clientHeight = dom.clientHeight;
      const scrollTop = dom.scrollTop;
      const scrollHeight = dom.scrollHeight;
      // +5是以防一些边界情况卡住
      if (clientHeight + scrollTop + 5 < scrollHeight) return
      if (this.startouchY - event.changedTouches[0].pageY > 60) {
        this.toNext()
      }
    },
    onLoad(item) {
      if (this.onBottom) {
        const index = this.secondLever.findIndex(ele => ele.id == item.id)
        if (index < this.secondLever.length - 1) {
          this.chooseSecondLever(this.secondLever[index + 1], index + 1)
        } else {
          const parentIndex = this.firstLever.findIndex(ele => ele.id == this.firstLeverId)
          if (parentIndex < this.firstLever.length - 1) {
            this.chooseFirstLever(this.firstLever[parentIndex + 1], parentIndex + 1)
          } else {
            this.loading = false
            this.finished = true
            this.$vux.toast.text('已到最底部')
          }
        }
      } else {
        this.loading = true
        this.isEmpty = false
        searchSpus({ secondCateId: this.secondId, ...this.searchParam }).then(res => {
          const data = res.data && res.data.esSearchResponse && res.data.esSearchResponse.datas
          if (!data) {
            this.finished = true
            this.onBottom = true
            this.isEmpty = true
          } else {
            const list = data.map(ele => {
              return {
                ...ele,
                url: ele.url || require('@/assets/img/wsf_mall_logo.png'),
                name: ele.skuName
              }
            })
            this.goodsList = [...this.goodsList, ...list]
            if (+res.data.esSearchResponse.total < this.searchParam.pageSize || list.length < this.searchParam.pageSize || +res.data.esSearchResponse.total == this.goodsList.length) {
              this.finished = true
              this.onBottom = true
              if (+res.data.esSearchResponse.total == 0 && this.goodsList.length) {
                this.isEmpty = true
              }
            } else {
              this.searchParam.pageNum++
            }
          }
          this.$nextTick(() => {
            this.loading = false
            this.refreshing = false
          })
        })
      }

    },
    onRefresh() {
      // 上拉加载上一分类数据
      this.loading = true
      this.finished = false
      this.refreshing = false
      const index = this.secondLever.findIndex(ele => ele.id == this.secondId)
      if (index > 0) {
        this.chooseSecondLever(this.secondLever[index - 1], index - 1)
      } else {
        const parentIndex = this.firstLever.findIndex(ele => ele.id == this.firstLeverId)
        if (parentIndex > 0) {
          this.chooseFirstLever(this.firstLever[parentIndex - 1], parentIndex - 1)
        }
      }
    },
    reset() {
      this.loading = true
      this.goodsList = [];
      this.searchParam.pageNum = 0
      this.onBottom = false
      this.finished = false
    },
    // 跳转到商品详情页
    tospudetail(item) {
      this.$router.push({ path: '/spudetail', query: { id:item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
    },
    handleScroll(clsName, wrapperClass, type) {
      const element = this.getEleDom(clsName)
      const parentDom = this.getEleDom(wrapperClass)
      if (type == 'left') {
        const left = element.offsetLeft
        parentDom.scrollTo({
          left,
          behavior: 'smooth'
        });
      } else {
        const top = element.offsetTop
        parentDom.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
      // 这个方法的设置平滑属性兼容性不好，暂时不用这个方法
      // element.scrollIntoView()
    },
    getEleDom(domAttr) {
      return document.querySelector(domAttr)
    },
    // 设置搜索参数
    setSearchParmas(data) {
      this.searchParam.pageNum = 0
      this.searchParam.pageSize = 10
      this.searchParam.sortItems = []
      // 选中的第一个过滤
      if (data.filterItemIndex == 0) {
        // 选中价格过滤
        if (data.sortWrapIndex === 0) {
          // 价格从低到高
          this.searchParam.sortItems.push({ field: 'price', order: 0 })
        } else if (data.sortWrapIndex === 1)  {
          // 价格从高到低
          this.searchParam.sortItems.push({ field: 'price', order: 1 })
        } else {
          this.searchParam.sortItems = []
        }
      } else if (data.filterItemIndex == 1) {
        // 选中销量过滤
        this.searchParam.sortItems.push({ field: 'saleNum', order: 1 })
      } else if (data.filterItemIndex == 2) {
        // 最新上架
        this.searchParam.sortItems.push({ field: 'skuUpTime', order: 1 })
      }
      this.reset()
      this.onLoad(this.secondLever[this.secondIndex])
    }
  }
}
</script>

<style scoped lang="less">
.goods-category-container {
  display: flex;
  flex-direction: column;
  // height: 100%;
  height: 100vh;
  // overflow: hidden;
  .first-level-wrapper {
    background: url('../../assets/img/goodsType/topNavbg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    .right-more {
      width: 36px;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #ffffff 0%, #feeeec 100%);
      box-shadow: -2px 0px 12px 0px rgba(255, 67, 33, 0.08);
      > span {
        color: #333;
        font-size: 12px;
      }
      > img {
        width: 12px;
        margin-top: 4px;
      }
    }
    .first-level-left {
      flex: 1;
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      align-items: center;
      justify-items: center;
      padding: 0 8px;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
        background-color: transparent;
      }
    }
  }

  .main-container {
    overflow-y: auto;
    flex: 1;
    display: flex;
    background: #fff;
    .left-bar {
      width: 80px;
      font-size: 16px;
      overflow-y: auto;
      background: #f2f2f2;
      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        background-color: transparent;
      }
      .second-level-item {
        font-size: 12px;
        color: #333;
        height: 44px;
        padding: 4px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        white-space: wrap;
        text-align: center;
        &.active {
          background: #fff;
          position: relative;
          color: #e60113;
          &::before {
            content: '';
            position: absolute;
            background: #e60113;
            width: 2px;
            height: 22px;
            border-radius: 1px;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .list-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fff;
      .list-content-wrapper {
        flex: 1;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
          background-color: transparent;
        }
        .van-list {
          min-height: 64vh;
        }
        /deep/ .van-list__finished-text {
          line-height: 0px;
          min-height: 30px;
        }
        .tip-to-next {
          margin-top: 12px;
          line-height: 30px;
        }
        .van-pull-refresh {
          position: relative;
          min-height: 100%;
          /deep/ .van-pull-refresh__track {
            min-height: 100%;
          }
          .empty-box {
            width: 100%;
            height: 60vh;
            padding-top: 80px;
            img {
              width: 180px;
            }
            p {
              margin: auto;
              line-height: 20px;
              margin-top: 10px;
              font-size: 15px;
              color: #999;
              &:last-child {
                margin-top: 0;
              }
            }
          }
        }
      }

      .goods-list-itme {
        padding: 12px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f0f0f0;
        > img {
          width: 68px;
          height: 68px;
          margin-right: 18px;
        }
        .right {
          > p:first-child {
            font-size: 14px;
            color: #333;
            margin-bottom: 22px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 这里是超出几行省略 */
            overflow: hidden;
          }
          .money {
            color: #e60113;
            font-size: 16px;
          }
        }
      }
    }
  }
  .tabs {
    // height: 10px;
    height: 60px;
    background: #fff;
  }
  /deep/ .van-dropdown-menu__title {
    font-size: 12px;
    padding: 0 2px;
  }
  /deep/ .van-dropdown-menu__title::after {
    display: none;
  }
  /deep/ .van-dropdown-menu__bar {
    box-shadow: none;
    height: 42px;
  }
}

.is-bottom {
  width: 100%;
  height: 30px;
}
.all-type-popup {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  .all-type-wrappler {
    display: flex;
    flex-wrap: wrap;
    padding-left: 12px;
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      background-color: transparent;
    }
    
  }
  .all-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    margin-top: 12px;
    text-align: left;
    padding-left: 12px;
  }
  .all-close {
    border-top: 1px solid #f0f0f0;
    padding: 12px;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      width: 0;
      height: 0;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
      border-bottom: 4px solid #333;
      margin-left: 2px;
    }
  }
}
</style>