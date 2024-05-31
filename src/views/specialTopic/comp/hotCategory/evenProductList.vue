<template>
  <div class="guess-warp"  v-if="pageList.length > 0">
    <!-- 是否有title -->
    <div class="guess-title" v-if="title">
      <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/hot_commodity.png" />
    </div>
    
    <!-- 列表信息 -->
    <div>
      <waterfall class="waterfall" ref="waterfall" :data="pageList" :isEmpty="isEmpty"  :noMore="finished" :botTip="botTip"/>
    </div>

    <div class="bottom-flag" ref="bottomflag"></div>
  </div>
</template>

<script>
import { debounce } from '@/utils/utils'
// import { getRecommendList } from '@/api/home' //分页查询为你推荐
import { getSpuDiscountList } from '@/api/mycoupon' //查询优惠券信息
import waterfall from '../common/evenActiveWaterfall.vue'

import { selectSpuDeleteBySpuIds } from '@/api/specialTopic/ranking';

// 注： 该组件不可重复通用， H5端， UI差异化比较大， 通用性差， 应单独自己业务自己处理商品展示列表
export default {
  name: 'pageList',
  props: {
    title: {
      type: String,
    },
    titleImg: {
      type: Boolean,
      default: false,
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
    waterfall,
  },
  data() {
    return {
      isEmpty: false, // 列表是否为空

      listQuery: {
				spuIds: [],
				pageSize: 10,
				pageNum: 1
			},
			pageList: [], //页面数据源
			loading: false, //正在加载
			finished: false, // 加载完成
      debounceScrollBottom: debounce(this.scrollBottom),
    }
  },	
  watch: {
    floorSpuIds: {
      handler(newVal, oldVal) {
        // 获取第一页数据
        this.loadData()
      },
      deep: true,
      immediate: true,
    }
  },
  created() {
  },
  async mounted() {
    window.addEventListener('scroll', this.debounceScrollBottom, true)
    
  },
  methods: {
    loadData() {
      // 正在加载
      if (this.loading) {
				return
			}

			// 加载完成
			if (this.finished) {
				return
			}
			// 获取当前查询的spuIds
			let {pageSize, pageNum} = this.listQuery
			let spuIds = this.floorSpuIds.slice((pageNum - 1) * pageSize, pageNum * pageSize);
			this.listQuery.spuIds = spuIds;

			if (spuIds.length < pageSize) {
				this.finished = true
			}
			this.getData()
    },
    getData: function () {
      this.loading = true
      try {
        selectSpuDeleteBySpuIds(this.listQuery).then(async(response) => {
          let list = response.data
          this.listQuery.pageNum++
          if (list.length > 0) {
            this.pageList = this.pageList.concat(list)
            this.handleCouponList(list)
          }
          this.loading = false
        })
      } catch (error) {
        this.loading = false
        console.log(error)
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
          this.pageList = this.pageList.map(item=>{
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
    scrollBottom() {
      let bottomObj = (this.$refs.bottomflag || {}).getBoundingClientRect() || {}
			let windowHeight = window.screen.height
			// 加载下一页
			if (bottomObj.top < windowHeight) {
				this.loadData()
			}
    },
  },
  beforeDestroy() {
    window.removeEventListener('srcoll', this.debounceScrollBottom)
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
.bottom-flag {
  width: 100%;
  height: 1px;
}
</style>
