<template>
  <div
    class="boxwrapper"
    ref="backTop"
    :style="[{ 'background-color': switchViewValue ? '#fff' : '#f5f5f5' }, { 'padding-top': storeInfoData ? '173px' : '92px' }]"
  >
    <div class="scrolltopBox" :class="[showTitle ? 'moveDown' : 'moveup']" :style="[{ 'z-index': filterBoxStyle ? '499' : '1001' }]">
      <!-- 搜索 -->
      <div class="searchBox">
        <div class="search-left-back" @click="toBack"></div>
        <div class="inputBox">
          <input type="text" class="searchinput" ref="search" placeholder="请输入搜索关键字" v-model="searchParam.queryString" @click="toSearch" />
        </div>
        <div class="searchIcon" :class="switchViewValue ? 'smallIcon' : 'bigIcon'" @click="switchViewValue = !switchViewValue"></div>
      </div>
      <!-- nav -->
      <ul class="navBox" :class="{ showWrap: sortWrapStyle }" :style="[{ 'z-index': filterBoxStyle ? '499' : '' }]">
        <template v-for="(item, index) in filterBoxList">
          <li class="navItem" :key="index" :class="{ cur: filterItemIndex === index }" @click="filterChoose(item, index)">
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
      </ul>
    </div>

    <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" :disabled="true">
      <!-- 商品列表 -->
      <van-list
        v-model="isUpLoading"
        :finished="upFinished"
        :immediate-check="false"
        :offset="300"
        finished-text="我是有底线的"
        @load="onLoadList"
        v-if="spus.length > 0"
      >
        <div :class="{ 'bg-gradient': !switchViewValue }"></div>
        <ul
          class="searchlist-normal-box"
          :class="{ 'searchlist-square-pic-box': !switchViewValue }"
          :style="[{ 'background-color': switchViewValue ? '#fff' : '#f5f5f5' }, { padding: switchViewValue ? '10px 11.5px 0' : '10px 9.5px 0' }]"
        >
          <li v-for="(item, e) in spus" :key="e" class="normal-list-box" @click="tospudetail(item)">
            <div class="goodsimg" :class="[switchViewValue ? 'listclass' : 'shuclass']">
              <img :src="item.url" style="text-align: center" />
              <!-- object-fit: contain; 防止图片变形 -->
            </div>
            <div
              class="product-info-box"
              :style="[
                { width: switchViewValue ? '202px' : '100%' },
                { margin: switchViewValue ? '' : '6.25px 0 0 7.5px' },
                { height: switchViewValue ? 'auto' : '98px' },
              ]"
            >
              <div class="product-name" :class="[switchViewValue ? '' : 'productname']">{{ item.skuName }}</div>
              <div
                class="product-price-m"
                :style="[{ 'margin-top': switchViewValue ? '44px' : '12px' }]"
                :class="[item.price > item.finalPrice && switchViewValue ? 'isactivetype' : item.price == item.finalPrice ? 'unfallprice' : 'unactivetype']"
              >
                <em>
                  ¥
                  <span class="price">{{ item.isBatchSku == '1' ? item.lowestBatchPrice.toFixed(2) : item.finalPrice.toFixed(2) }}</span>
                </em>
                <span class="oldPrice" v-if="item.price != item.finalPrice">¥{{ item.price }}</span>
              </div>

              <!-- <div class="store"> -->
              <div class="shareBox">
                <img class="shareImg" src="../../assets/img/distribution/share@2x.png" alt="" />
                赚 ¥
                <span style="font-size: 14px">{{ item.price }}</span>
              </div>
              <!-- </div> -->
            </div>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
    <!-- 无数据 -->
    <div v-if="spus.length === 0" style="padding: 38% 40px" class="noneDara">
      <div class="noneBox">
        <img src="@/assets/img/bge.png" alt />
      </div>
      <p class="none_p1">没有搜索结果</p>
      <p class="none_p2">没有找到相关宝贝</p>
    </div>
  </div>
</template>

<script>
import { isWx } from '@/utils/utils'
import { searchSpus } from '@/api/spulist'
// import { queryStoreInfo } from '@/api/storeindex'
import { List, PullRefresh } from 'vant'
export default {
  components: { [List.name]: List, [PullRefresh.name]: PullRefresh },
  data() {
    return {
      isWx: isWx(), // 判断是否是微信
      storeInfo: {}, // 店铺信息
      storeId: this.$route.query.storeId, // 店铺id
      showSearch: false, // 是否显示搜索
      searchParam: {
        attributes: [], // 过滤的属性
        cateId: '-1', // 分类id
        pageNum: 0,
        pageSize: 10,
        queryString: '', // 关键字搜索
        sortItems: [], // 排序
      }, // 搜索的参数
      filterBoxStyle: false, // 刷选窗显示隐藏的标记
      sortWrapStyle: false,
      filterItemName: '综合', //  第一个过滤的名称
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
      isStore: this.$route.query.storeId ? true : false, //是否是店铺商品搜索
      shopTopNavVisible: false,
      switchViewValue: true, // 大小图片
      sortWrapVisible: false,
      aggs: [], // 聚合数据
      spus: [], // 商品信息
      filterStore: false, // 涮选中的店铺过滤
      hasSku: false, // 涮选中的仅看有货过滤
      hasLoadAgg: false, // 是否加载过聚合数据
      noMore: false, //没有更多
      loading: false, //正在加载

      isUpLoading: false,
      isDownLoading: false,
      upFinished: false,

      startX: 0,
      startY: 0,
      showTitle: false,
      storeInfoData: '', //店铺信息
      nostore: false,
      documentScrollTop: 0,
      arrowshow: false, // 下拉三角菜单
      activenavli: false, // 是否选中第一个li
    }
  },
  created() {
    document.body.removeAttribute('class', 'gray-bg')
    // 设置查询的参数
    if (this.$route.query.queryString) {
      this.searchParam.queryString = this.$route.query.queryString
    }

    // 设置查询的分类
    if (this.$route.query.cateId) {
      this.searchParam.cateId = this.$route.query.cateId
    }

    // 设置店铺的分类
    if (this.$route.query.storeCateId) {
      this.searchParam.storeCateId = this.$route.query.storeCateId
    }

    // 是否是店铺搜索
    if (this.isStore) {
      this.searchParam.storeId = this.storeId
    }

    this.searchSpus()
  },
  methods: {
    // 筛选排序
    filterChoose(item, index) {
      if (this.loading) {
        return
      }
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
    // 设置搜索参数
    setSearchParmas() {
      this.searchParam.attributes = []
      this.searchParam.pageNum = 0
      this.searchParam.pageSize = 10
      this.searchParam.sortItems = []
      this.noMore = false
      this.spus = []
      // 选中的第一个过滤
      if (this.filterItemIndex == 0) {
        // 综合过滤
        this.searchParam.sortItems = []
      } else if (this.filterItemIndex == 1) {
        // 选中价格过滤
        if (this.sortWrapIndex === 1) {
          // 价格从低到高
          this.searchParam.sortItems.push({ field: 'price', order: 0 })
        } else {
          // 价格从高到低
          this.searchParam.sortItems.push({ field: 'price', order: 1 })
        }
      } else if (this.filterItemIndex == 2) {
        // 选中销量过滤
        this.searchParam.sortItems.push({ field: 'saleNum', order: 1 })
      }

      this.aggs.forEach((agg) => {
        if (agg.key == '品牌') {
          let checkedBrands = agg.childs.filter((child) => child.isChecked).map((child) => child.key)
          if (checkedBrands.length > 0) {
            this.searchParam.brandNames = checkedBrands
          } else {
            this.searchParam.brandNames = []
          }
        } else {
          // 属性
          let checkedAttrValues = agg.childs.filter((child) => child.isChecked).map((child) => child.key)
          console.log('我是循环内部:checkedAttrValues', checkedAttrValues)
          if (checkedAttrValues.length > 0) {
            console.log('我有值: checkedAttrValues', checkedAttrValues)
            let attribute = {}
            attribute.name = agg.key
            attribute.values = checkedAttrValues
            console.log('我生成了attribute', attribute)
            this.searchParam.attributes.push(attribute)
          } else {
            // this.searchParam.attributes = []
          }
        }
      })

      // 过滤是否有货
      if (this.hasSku) {
        this.searchParam.stockFilter = 0
      }

      // 过滤是否是自营
      if (this.filterStore) {
        this.searchParam.storeId = 0
      } else {
        // 如果店铺搜索则设置店铺id没有则删除属性
        if (this.isStore) {
          this.searchParam.storeId = this.storeId
        } else {
          delete this.searchParam.storeId
        }
      }
      this.searchSpus()
    },
    // 滚动吸顶
    handleScroll() {
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop) // 取绝对值
      // console.log(scorllTop, 'top')
      if (!this.storeInfoData) {
        if (scorllTop > 51) {
          if (scorllTop > this.documentScrollTop) {
            this.showTitle = true
          } else {
            this.showTitle = false
          }
        } else {
          this.showTitle = false
        }
      } else {
        if (scorllTop > 131) {
          if (scorllTop > this.documentScrollTop) {
            this.nostore = true
          } else {
            this.nostore = false
          }
        } else {
          this.nostore = false
        }
      }

      if (scorllTop > 125) {
        if (scorllTop > this.documentScrollTop) {
          this.showTitle = true
        } else {
          this.showTitle = false
        }
      } else {
        this.showTitle = false
      }

      this.documentScrollTop = JSON.parse(JSON.stringify(scorllTop))
    },
    onDownRefresh() {
      this.searchParam.pageNum = 0
      this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.isDownLoading = true
      // this.isUpLoading = true
      this.searchSpus() // 加载数据
    },
    onLoadList() {
      // this.isUpLoading = true
      this.searchParam.pageNum++
      this.searchSpus()
    },
    // 搜索商品
    searchSpus() {
      let _self = this
      setTimeout(
        () => {
          searchSpus(_self.searchParam).then((res) => {
            // console.log(res, '列表')
            this.loading = false //数据请成功后
            _self.isUpLoading = false
            _self.isDownLoading = false
            let spus = res.data.esSearchResponse.datas
            this.storeInfoData = res.data.storeInfo
            if (spus == null || spus.length === 0) {
              // 加载结束
              _self.upFinished = true
            }
            if (spus.length < this.searchParam.pageSize) {
              // 最后一页不足10条的情况
              _self.upFinished = true
            }
            // 处理数据
            if (_self.searchParam.pageNum === 0) {
              _self.spus = spus
            } else {
              _self.spus = _self.spus.concat(spus)
            }
          })
        },
        this.isDownLoading ? 600 : 0
      )
    },
    toBack() {
      this.$router.back()
    },
    // 跳转到搜索页面
    toSearch() {
      if (this.isStore) {
        this.$router.push({ path: '/distributionSearch', query: { storeId: this.storeId } })
      } else {
        this.$router.push({ path: '/distributionSearch' })
      }
    },
    // 跳转到商品详情页
    tospudetail(item) {
      this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
    },
    // 切换综合里面的过滤
    sortWrapTab(index) {
      this.sortWrapVisible = false
      // this.arrowshow = false
      this.activenavli = false
      this.filterItemIndex = 0
      this.sortWrapIndex = index
      if (index === 0) {
        this.filterItemName = '综合'
      }
      if (index === 1) {
        this.filterItemName = '价格升序'
      }
      if (index === 2) {
        this.filterItemName = '价格降序'
      }
      if (index === undefined) {
        this.filterItemName = '综合'
        this.filterItemIndex = ''
      }
    },
    // 是否显示全部
    // showAll(item) {
    //   item.isShowAll = !item.isShowAll
    // },
    // 选中属性值
    // checkAttributeValue(attrValue) {
    //   attrValue.isChecked = !attrValue.isChecked
    // },
    // 获取评价样式
    getStarClass(num) {
      return 'commstar_star star' + num + ' ' + (this.storeInfo.aveScore == num ? 'active' : '')
    },
  },
  watch: {
    switchViewValue: function (value) {
      if (!value && this.storeInfoData) {
        document.querySelector('body').setAttribute('style', 'background-color:#f5f5f5')
      } else {
        document.querySelector('body').removeAttribute('style')
      }
    },
    $route() {
      // 设置查询的参数
      if (this.$route.query.queryString) {
        this.searchParam.queryString = this.$route.query.queryString
      }

      // 设置查询的分类
      if (this.$route.query.cateId) {
        this.searchParam.cateId = this.$route.query.cateId
      }

      // 设置店铺的分类
      if (this.$route.query.storeCateId) {
        this.searchParam.storeCateId = this.$route.query.storeCateId
      }

      // 是否是店铺搜索
      if (this.isStore) {
        this.searchParam.storeId = this.storeId
      }
    },
  },
  mounted() {
    // 滚动条的获取
    window.addEventListener('scroll', this.handleScroll, true)
  },
  beforeDestroy() {
    // 销毁背景色
    document.querySelector('body').removeAttribute('style')
    document.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<style scoped lang="less">
.isactivetype {
  margin-top: 30px !important;
  margin-bottom: 5px !important;
}

.unactivetype {
  margin-bottom: 6px !important;
}
.unfallprice {
  margin-bottom: 0;
}
.boxwrapper {
  height: 100%;
  padding: 0;
  padding-top: 93px;
  .scrolltopBox {
    display: block;
    width: 100%;
    z-index: 1001;
    background-color: #fff;
    position: fixed;
    top: 0;
    .searchBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      .search-left-back {
        display: block;
        width: 24px;
        height: 24px;
        background: url('../../assets/img/back.png') no-repeat center;
        background-size: 24px;
        margin: 0 10px;
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
          width: 240px;
          height: 100%;
          background-color: #f2f2f2;
          border: none;
        }
      }
      .searchIcon {
        width: 30px;
        height: 35px;
        margin-right: 10px;
      }
      .smallIcon {
        background: url('../../assets/img/shu.png') no-repeat center center;
        background-size: 24px;
      }

      .bigIcon {
        background: url('../../assets/img/list.png') no-repeat center center;
        background-size: 24px;
      }
    }
    .navBox {
      position: unset;
      display: flex;
      width: 100%;
      height: 42px;
      background-color: #fff;
      overflow: hidden;
      z-index: 1001;
      top: 51px;
      .navItem {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        border-bottom: 0;
        color: #000000;
        font-size: 15px;
        .sort-type {
          height: 42px;
          margin-left: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
      .navItem.cur {
        color: #e60113;
      }
    }
  }
  .bg-gradient {
    background: linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
    background: -moz-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
    background: -webkit-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
    background: -webkit-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
    background: -o-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
    background: -ms-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 180px;
  }
  .searchlist-normal-box {
    padding: 10px 9.5px 0;
    background-color: #fff;
    .normal-list-box {
      display: flex;
      background-color: #fff;
      margin-bottom: 12px;
      border-radius: 5px;
      padding-top: 0;
      height: auto;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        max-width: 100%;
        border: none;
        border-radius: 5px;
      }
      .goodsimg {
        height: 140px;
        // width: 69%;
        margin-left: 0;
      }
      .listclass {
        width: 40.645%;
        width: 140px;
        border-radius: 5px;
        // overflow: hidden;
      }
      .shuclass {
        width: 100%;
        border-radius: 5px 5px 0 0;
        img {
          border-radius: 5px 5px 0 0;
        }
      }
      .product-info-box {
        margin-top: 3.75px;
        width: 58.3%;
        margin-top: 3.75px;
        margin-left: 10px;
        padding-right: 10px;
        position: relative;
        .product-name {
          color: #000;
          display: -webkit-box;
          font-size: 14px;
          line-height: 20px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-word;
        }
        .shareBox {
          width: 110px;
          color: #fff;
          font-size: 12px;
          padding: 0 10px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(90deg, #ff5b10 0%, #e60113 100%);
          border-radius: 13px;
          .shareImg {
            width: 11px;
            height: 11px;
            margin-right: 5px;
            border-radius: unset;
            position: unset;
          }
        }
        .product-price-m {
          font-size: 0;
          height: 20px;
          line-height: 20px;
          margin: -3px 10px 5px 0;
          overflow: hidden;
          width: 100%;
          line-height: 20px;
          .oldPrice {
            display: inline-block;
            font-size: 12px;
            text-decoration: line-through;
            color: #999;
            transform: scale(0.92);
            margin-left: 2px;
            margin-top: 1px;
          }
          em {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #e60113;
            margin-right: 3px;
            display: block;
            height: 20px;
            overflow: hidden;
            float: left;
            font-style: normal;
            .price {
              font-size: 17.5px;
              // font-size: 18px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: bold;
              float: none;
              color: #e93b3d;
            }
          }
        }
        .gray-pro-info {
          margin-top: 8px;
        }
      }
      .product-info-box:after {
        height: 0 !important;
      }
    }
  }
  .searchlist-square-pic-box {
    overflow: hidden;
    .normal-list-box {
      width: 47.4%;
      margin: 0px 1.3% 9px;
      border: 0;
      display: block;
      float: left;
      padding: 0;
      .goodsimg {
        width: 100%;
        height: 0;
        position: relative;
        padding-bottom: 100%;
        margin: 0;
        img {
          width: 100%;
          max-width: inherit;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .product-info-box {
        height: 83px;
        position: relative;
        // padding-right: 10px;
        // padding-right: 3%;
        .productname {
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
          width: 100%; /*需要配合宽度来使用*/
          display: block !important;
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }
}

.noneDara {
  background-color: #fff;
  text-align: center;

  .noneBox {
    img {
      margin-bottom: 35px;
    }
  }

  .none_p1 {
    font-size: 16px;
    color: #666;
    margin-bottom: 5px;
  }

  .none_p2 {
    font-size: 14px;
    color: #999;
  }
}
.noneDara:before {
  background: none;
}
.noneDara:after {
  background: none;
}

.moveDown {
  -webkit-transform: translate3d(0, -51px, 0);
  -moz-transform: translate3d(0, -51px, 0);
  -o-transform: translate3d(0, -51px, 0);
  transform: translate3d(0, -51px, 0);
  -webkit-animation: moveDown 0.35s;
  -moz-animation: moveDown 0.35s;
  -o-animation: moveDown 0.35s;
  animation: moveDown 0.35s;
}

@keyframes moveDown {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
}

@-moz-keyframes moveDown /* Firefox */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
}

@-webkit-keyframes moveDown /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
}

@-o-keyframes moveDown /* Opera */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
}

.moveup {
  -webkit-transform: translate3d(0, 0px, 0);
  -moz-transform: translate3d(0, 0px, 0);
  -o-transform: translate3d(0, 0px, 0);
  transform: translate3d(0, 0px, 0);
  -webkit-animation: moveup 0.35s;
  -moz-animation: moveup 0.35s;
  -o-animation: moveup 0.35s;
  animation: moveup 0.35s;
}

@keyframes moveup {
  from {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-moz-keyframes moveup /* Firefox */ {
  from {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-webkit-keyframes moveup /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-o-keyframes moveup /* Opera */ {
  from {
    -webkit-transform: translate3d(0, -51px, 0);
    -moz-transform: translate3d(0, -51px, 0);
    -o-transform: translate3d(0, -51px, 0);
    transform: translate3d(0, -51px, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}
</style>
