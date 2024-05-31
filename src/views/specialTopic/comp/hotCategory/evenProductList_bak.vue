<template>
  <div class="guess-warp">
    <!-- 是否有title -->
    <div class="guess-title" v-if="title">
      <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/hot_commodity.png" />
    </div>
    <!-- 是否有筛选条件 -->
    <div class="result-sort" v-if="filterShow">
      <li v-for="(item, index) in filterBoxList" class="box-flex" :key="index" :class="{ cur: filterItemIndex === index }" @click="filterChoose(item, index)">
        {{ item.filterBoxName }}
        <div class="sort-type" v-if="item.hasSort">
          <img v-if="filterItemIndex === index && priceSort === 1" style="height: 0.2rem; width: 0.28rem" src="@/assets/img/sort_up_select@2x.png" alt="" />
          <img v-else style="height: 0.2rem; width: 0.28rem" src="@/assets/img/sort_up@2x.png" alt="" />
          <img v-if="filterItemIndex === index && priceSort === 0" style="height: 0.2rem; width: 0.28rem; margin-top: 1px" src="@/assets/img/sort_down_select@2x.png" alt="" />
          <img v-else style="height: 0.2rem; width: 0.28rem; margin-top: 1px" src="@/assets/img/sort_down@2x.png" alt="" />
        </div>
      </li>
      <!-- <div class="wbox-flex" :class="{ cur: filterGoods }" @click="onlyGoods()">仅看有货</div> -->
    </div>
    <!-- 是否有列表信息 -->
    <div v-if="!isOld">
      <waterfall class="waterfall" ref="waterfall" :data="shopList" :storeId="storeId" :isEmpty="isEmpty"  :noMore="noMore" :detailShow="detailShow" :botTip="botTip"/>
    </div>
    <div v-else>
      <template v-if="!isEmpty">
        <div class="guess-list" :class="{'store-index': storeId}">
          <goodItem v-for="(item, index) in shopList" ref='goodItem' :item='item' :storeId="storeId" :isIndex='isIndex' :key="index" :detailShow="detailShow"></goodItem>
        </div>
        <div class="guess-load-more-tips" v-if="noMore" ref="backTop">
          没有更多数据
        </div>
        <div class="guess-load-more-tips" v-else ref="backTop">正在加载中...</div>
      </template>
      <van-empty v-else image="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/img_blank_page.png" image-size="160px" description="没有找到相关宝贝" class="no-valid">
      </van-empty>
    </div>
  </div>
</template>

<script>
import { isWx } from '@/utils/utils'
import { debounce, formatPrice } from '@/utils/utils'
// import { getRecommendList } from '@/api/home' //分页查询为你推荐
import { queryAdvertSet } from '@/api/index' //查询热销榜单和热销广告
import { getSpuDiscountList } from '@/api/mycoupon' //查询热销榜单和热销广告
import { pageAgencyStore } from '@/api/storeindex'
import goodItem from '../common/evenActiveGoodItem.vue'
import waterfall from '../common/evenActiveWaterfall.vue'

import { selectSpuDeleteBySpuIds } from '@/api/specialTopic/ranking';


import { Empty } from 'vant'
let isxhr = false
// 注： 该组件不可重复通用， H5端， UI差异化比较大， 通用性差， 应单独自己业务自己处理商品展示列表
export default {
  inject: ['reload'],
  name: 'shopList',
  props: {
    homePageShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
    },
    // 是否是UI2期未修改的列表
    isOld:{
      type: Boolean,
      default: false
    },
    isIndex: {
      type: Boolean,
      default: false
    },
    isWaterfall: {
      type: Boolean,
      default: false
    },
    storeId: {
      default: '',
    },
    searchNewSpu: {
      type: Number,
      default: 0,
    },
    detailShow: {
      type: Boolean,
    },
    titleImg: {
      type: Boolean,
      default: false,
    },
    filterShow: {
      type: Boolean,
      default: false,
    },
    orderCode: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    },
    botTip:{
      type: String,
      default: ''
    },
    floorSpuIds: {
			type: Array,
			default: () => [],
		}
  },
  components:{
    goodItem,
    waterfall,
    [Empty.name]: Empty
  },
  data() {
    return {
      emptyImg: require('@/assets/img/bge.png'),
      isEmpty: false, // 列表是否为空
      isWx: isWx(), // 判断是否是微信
      shopList: [],
      leftData:[],
      rightData: [],
      formatPrice: formatPrice, // 格式化金额
      listQuery: {
        pageNum: this.storeId ? 1 : 0, // 当前页码
        pageSize: 10, // 每页显示记录数
        stockFilter: -1,
        sort: 1,
        spuName: ''
      },
      noMore: false, //没有更多
      loading: false, //正在加载
      isProcess: false, // 接口是否处理中
      imgHeight: 0, // 屏幕宽度
      isStoreShopList: !!this.storeId, // 是否为商品列表
      isDetail: this.detailShow,
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
      filterGoods: false,
      hotAdvertSetVos: [], // 热销广告 和// 销售榜单
    }
  },	
  watch: {
    searchNewSpu(data) {
      this.filterItemIndex = 0
      this.priceSort = -1
      this.filterGoods = false
      this.listQuery.stockFilter = -1
    },
    floorSpuIds: {
      handler(newVal, oldVal) {
        this.listQuery.spuIds = this.floorSpuIds;
        this.getData()
      },
      deep: true,
      immediate: true,
    }
  },
  created() {
    isxhr = false
    window.resetRecommendData = this.resetData
  },
  async mounted() {
    // window.addEventListener('scroll', this.scrollBottom, true)
     // 查询热销榜单和热销广告
    if(this.isIndex) {
      try {
        const channelType = this.$store.state.userSource == 1 ? 4 : this.$store.state.userSource == 2 ? 5 : 2
        // 一期遗留问题，热销广告一级显示 -- 要求：只在首页展示
        const list = this.homePageShow ? await queryAdvertSet({channelType}) : []
        this.hotAdvertSetVos = list.data.map(item=>{
          if(item.hotAdvertSet) {
            return {...item.hotAdvertSet, type: 'advert'}
          }
          if(item.listSaleSet) {
            return {...item.listSaleSet, type: 'sale'}
          }
        }).filter(item=>item)
        // 按照从大到小的顺序排列，到时候插入的时候先插入下标大的数据，才能正确的插入
        this.hotAdvertSetVos = this.hotAdvertSetVos.sort(this.sortBy('location'))
      } catch (error) {
        console.log(error)
      }

    }

    // this.getData()
    window.onresize = () => {
      return (() => {
        this.setImgHeight()
      })()
    }
  },
  methods: {
    onSearch(value) {
      this.shopList = []
      this.listQuery.pageNum = 1
      if (this.noMore) {
        this.noMore = false
      }
      this.listQuery.spuName = value
      this.getData()
    },
    sortBy (field) {
      //根据传过来的字段进行排序
      return (x, y) => {
        return y[field] - x[field]
      }
    },
    onlyGoods() {
      this.filterGoods = !this.filterGoods
      if (this.filterGoods) {
        this.listQuery.stockFilter = 1
      } else {
        this.listQuery.stockFilter = -1
      }
      if (this.noMore) {
        this.noMore = false
      }
      this.shopList = []
      this.listQuery.pageNum = 0
      this.getData()
    },
    // 筛选排序
    filterChoose(item, index) {
      // console.log(item, 'item')
      // console.log(index, 'index')
      // console.log(this.filterItemIndex, 'this.filterItemIndex')
      // this.isUpLoading = false
      // this.isDownLoading = false
      // this.upFinished = false
      // if (this.loading) {
      //   return
      // }
      // if (item.filterBoxName != '综合') {
      //   this.shopList = []
      // }
      this.shopList = []
      this.listQuery.pageNum = this.storeId ? 1 : 0
      if (this.noMore) {
        this.noMore = false
      }

      if (this.filterItemIndex === index) {
        // console.log(item.hasSort)
        // if (!item.hasSort) {
        //   return
        // }
        this.priceSort = this.priceSort === 1 ? 0 : 1
      } else {
        this.filterItemIndex = index
        this.priceSort = 0
      }
      if (item.filterBoxName == '综合') {
        this.priceSort = -1
      }

      if(this.filterItemIndex == 0) {
				this.listQuery.sort = 1;
			} else if(this.filterItemIndex == 1 && this.priceSort == 1) {
				this.listQuery.sort = 2;
			} else if(this.filterItemIndex == 1 && this.priceSort == 0) {
				this.listQuery.sort = 3;
			} else if(this.filterItemIndex == 2) {
				this.listQuery.sort = 4;
			}
      this.getData()
    },
    resetData() {
      console.log('免密登录时是否触发-------1-------->')
      this.listQuery.pageNum = this.storeId ? 1 : 0
      this.noMore = false
      this.$emit('resetRecommendData')
      // 免密登陆之后标记， 将list情况
      this.dataRset = true
      this.getData()
    },
    // 查询热销榜单和热销广告
    // queryAdvertSet(){
    //   queryAdvertSet().then(res=>{
    //     console.log(res)
    //   })
    // },
    getData: function () {
      if (this.noMore) {
        return
      }
      if (this.storeId) {
        this.listQuery.storeId = this.storeId
        this.listQuery.onlyQueryNewSpu = this.searchNewSpu

        this.listQuery.priceSort = this.priceSort
        let postMethod = pageAgencyStore
        postMethod(this.listQuery).then((response) => {
          let list = response.data.list || []
          if(this.listQuery.pageNum === 1 || this.listQuery.pageNum === 0 || this.dataRset) {
            this.shopList = []
            this.dataRset = false
          }
          this.listQuery.pageNum++

          if (list.length > 0) {
            this.shopList = this.shopList.concat(list)
            if(this.isWaterfall) {
              this.formatData(list)
            }
            this.setImgHeight()
          }
          this.$nextTick(() => {
            this.loading = false
          })
          if (list.length < 10) {
            this.noMore = true
          }
          if(this.shopList.length == 0) {
            this.isEmpty = true
          }
        })
      } else {
        let routePath = {
          '/':1, //首页底部的热销商品
          '/spudetail':2,  //商品详情页
          '/cart':3, //购物车
          '/home':4, //个人中心
          '/paysuccess':5, //支付后回调页
          '/orderlist':6, //订单列表
          '/orderdetail':7, //:订单详情页
          '/ranking':3, //:订单详情页
        }
        let params = {
          orderCode:this.orderCode || '',
          skuId:this.skuId || '',
          pageType:routePath[this.$route.path],
          pageNum:this.listQuery.pageNum,
          pageSize:this.listQuery.pageSize,
          spuIds: this.listQuery.spuIds,
        }

        // 首页-查询入参加上一级分类id入参 （其他界面不需要这个入参）
        if (this.$route.path === '/') {
          let {classifyActiveTab, topCategoryList} = this.$store.state.HOME_PAGE_CONFIG

          topCategoryList = topCategoryList || []

          // 点击的是首页的话，这firstCateId 传空
          if (topCategoryList[classifyActiveTab] && topCategoryList[classifyActiveTab].id !== undefined) {
            params.firstCateId = Number(topCategoryList[classifyActiveTab].id)
            params.pageType = 9
          }
        }

        try {
          selectSpuDeleteBySpuIds(params).then(async(response) => {
            let list = response.data
            if(this.listQuery.pageNum === 0 || this.dataRset) {
              this.shopList = []
              this.dataRset = false
            }
            this.listQuery.pageNum++
            if (list.length > 0) {
              if(this.isIndex) {
                this.hotAdvertSetVos.forEach(item=>{
                  const pageAdvertSetVos = Math.ceil(item.location / 10)
                  if(pageAdvertSetVos == this.listQuery.pageNum) {
                    // 将热销广告和热销榜单插入热销商品中
                    list.splice(item.location - 1, 0, item);
                  }
                })
              }
              this.shopList = this.shopList.concat(list)
              if(this.isWaterfall) {
                this.formatData(list)
              }
              if(!this.isIndex) {
                this.setImgHeight()
              }
              this.handleCouponList(list)
            }
            this.loading = false
            if (list.length < 10) {
              this.noMore = true
            }
          })
        } catch (error) {
          console.log(error)
        }

      }
    },
    async handleCouponList(list) {
      try {
        const getPopupParam = list.map(ele=>{
          return {
            skuId: ele.id,
            beforeCouponPrice: ele.finalPrice
          }
        })
        const res = await getSpuDiscountList(getPopupParam) || {}
        if(res.data) {
          this.shopList = this.shopList.map(item=>{
            let afterCouponPrice = '', couponLabelList=item.couponLabelList || []
            res.data.forEach(ele=>{
              if(item.id == ele.skuId) {
                afterCouponPrice = ele.afterCouponPrice
                couponLabelList = ele.couponLabelList
              }
            })
            couponLabelList = couponLabelList.map(tag=>{
              return {
                ...tag,
                text: tag.couponsType == 3?`立减￥${tag.faceValue}` : tag.couponsType == 2 ?`${tag.faceValue}折` : `满￥${tag.amountLimitation}减￥${tag.faceValue}`
              }
            })
            return {
              ...item,
              afterCouponPrice,
              couponLabelList
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    setImgHeight() {
      this.$nextTick(() => {
        try {
          let imgBox = this.$refs.waterfall.$refs.goodList[0].$refs.shopImg
          let wImgbox = imgBox.getBoundingClientRect().width
          this.imgHeight = wImgbox
        } catch (error) {
          console.log('setImgHeight: ', error)
        }
      })
    },
    scrollBottom() {
      if(this.noMore) {
        return false
      }
      let scorllTop,ref,fallRef
      if(!this.isOld){
        ref = this.$refs.waterfall
        fallRef=this.$refs.waterfall&&this.$refs.waterfall.$refs.backTop
      }else{
        ref = this.$refs.backTop
      }
      try {
        if (!ref) {
          return
        }
        scorllTop =(!this.isOld ? fallRef : ref).getBoundingClientRect().top // 加载盒子距顶部高度
      } catch (error) {
        console.log('scrollBottom: ', error)
      }

      const windowHeight = window.screen.height // 可视区高度
      // console.log('可视区高度', windowHeight)
      if (scorllTop > 210) {
        if (scorllTop <= windowHeight) {
          if (!this.loading && isxhr) {
            this.loading = true
            // 请求的数据未加载完成时
            this.getData()
          }
          isxhr = true
        }
      }
      // if (scorllTop <= windowHeight) {
      //   // const windowHeight = window.screen.height
      //   // const contentHeight = el.clientHeight
      //   // const toBottom = contentHeight - windowHeight - scrollTop
      //   // if (toBottom < 10 && !this.finished && !this.loading) {
      //   if (!this.finished && !this.loading) {
      //     this.loading = true
      //     // 请求的数据未加载完成时
      //     this.getData()
      //   }
      // }
    },
    formatData(data) {
      let i = 0;
      while (i <data.length) {
        this.leftData.push(data[i++]);
        if (i < data.length) {
          this.rightData.push(data[i++]);
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('srcoll', this.scrollBottom)
  },
}
</script>

<style scoped lang="less">
.guess-warp {
  font-size: 0.64rem;
  color: #000000;
  line-height: 0.64rem;
}
.guess-title{
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  img{
    height: 16px;
    width: 249px;
  }
}

.guess-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  // margin-top: 8px;
  padding-bottom: 20px;
  &.store-index {
    margin-top: 0;
  }
  &.store-index::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 64px;
    width: 100%;
    background-image: linear-gradient(rgba(255,255,255, 1), rgba(255,255,255,0));
  }
}

.guess-load-more-tips {
  position: relative;
  z-index: 2;
  padding: 0.4rem 0;
  text-align: center;
  color: #888888;
  margin-bottom: 30px;

  // 没有数据的场景
  .no-data-pic {
    display: inline-block;
    width: 95px;
    height: 99px;
  }
  .no-result-text {
    color: #666;
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .no-goods-text {
    font-size: 14px;
    color: #999;
  }
}
.sort-type {
  height: 100%;
  margin-left: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.box-flex {
  line-height: 20px;
  color: #000;
  font-size: 14px;
}
.result-sort {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 22px 10px 37px;
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
    color: #000D1D;
  }
}
</style>
