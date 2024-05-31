<template>
<div data-desc="专题-热销商品-oddHotShopList" class="special-shopList"  v-if="pageList.length > 0">
	<van-list
      :finished="true"
      :immediate-check="false"
    >
      <ul class="sku-list clearfix">
        <li v-for="(item, index) in pageList" :key="index" class="sku-list-item" >
			<van-swipe-cell @open="open(index, item)">
				<oddProductList  :item="item" :key="pageList.length" :isStatus="true" :isCart="true"  @addShoppingCart="addShoppingCart"></oddProductList>
			</van-swipe-cell>
        </li>
      </ul>
    </van-list>
	<div class="bottom-flag" ref="bottomflag"></div>
</div>
</template>

<script>

import oddProductList from './oddProductList.vue'
import { addShoppingCart } from '@/api/spudetail' // 加入购物车接口
import { SwipeCell, List, Toast } from 'vant'

import { selectSpuDeleteBySpuIds } from '@/api/specialTopic/ranking';
import { debounce } from '@/utils/utils'
export default {
    components: {
		oddProductList,
		[SwipeCell.name]: SwipeCell,
		[List.name]: List,
		[Toast.name]: Toast,
	},
    data() {
		return {
			listQuery: {
				spuIds: [],
				pageSize: 10,
				pageNum: 1
			},
			pageList: [], //页面数据源
			loading: false, //正在加载
			finished: false, // 加载完成
		}
    },
	props: {
		floorSpuIds: {
			type: Array,
			default: () => [],
		}
	},
	computed:{

	},
    created() {
    },

	mounted() {
		// 滚动条的获取
		window.addEventListener('scroll', debounce(this.handleScroll), true)
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
    methods: {
		addShoppingCart(item) {
			let params = {
				skuId: item.id,
				num: 1,
				storeId: item.storeId,
				sourceType: item.sourceType,
			}
			addShoppingCart(params).then((res) => {
				if (res.code == 200) {
				switch (res.data) {
					case 0:
					Toast('加入购物车失败，请刷新后重试！')
					break
					case 1:
					Toast('成功加入购物车')
					// 重新查询购物车数量
					// this.queryCartCount()
					//重新调详情接口
					break
					case -1:
					Toast('库存不足')
					break
					case -2:
					Toast('商品不存在')
					break
					case -3:
					Toast('参数错误')
					break
					case -4:
					Toast('商品已下架')
					break
					case -5:
					Toast('达到商品限购数量')
					break
					case -6:
					Toast('预售商品不能加入购物车')
					break
					case -7:
					Toast('商品已过期')
					break
					default:
					Toast('加入购物车失败，请刷新后重试')
					break
				}
				}
			})
		},
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
		//获取数据
		getData() {
			this.loading = true
			try {
				selectSpuDeleteBySpuIds(this.listQuery).then((response) => {
					let list = response.data
					this.listQuery.pageNum++
					if (list.length > 0) {
						this.pageList = this.pageList.concat(list)
					}
					this.loading = false
				})
			} catch (error) {
				this.loading = false
				console.log(error)
			}
		},
		handleScroll(e) {
			let bottomObj = (this.$refs.bottomflag || {}).getBoundingClientRect() || {}
			let windowHeight = window.screen.height
			// 加载下一页
			if (bottomObj.top < windowHeight) {
				this.loadData()
			}
		}
	},
	filters: {
		filterFraction(val, make) {
			let len = (val + '').length
			switch (len) {
			case 3:
			case 4:
				if (make && val == 1000) {
				val= '999+'
				}else{
				val = parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) + '+'
				}
				break
			case 5:
			case 6:
			case 7:
				if (make) {
				val = '999+'
				} else {
				val = parseInt((val / 10000) * 10) / 10 + '万'
				}
				break
			default:
				break
			}
			return val
		},
		filterCoupons(type, val) {
			let va = parseInt(val * 10) / 10
			let couponsMap = {
			// '1': '满减' + va,
			'2': va + '折',
			'3': '立减' + va,
			}
			return couponsMap[type]
		},
    },

}
</script>

<style scoped lang="less">
.special-shopList{
	.sku-list-item{
		margin-top: 9.5px;
		border-radius: 15px;
		>img{
			position: absolute;
			z-index: 88;
			width: 106.8px;
			height: 44.3px;
			top: -11.5px;
			left: -3.5px;
		}
		>span{
			position: absolute;
			z-index: 99;
			top: -10px;
			left: 28px;
			font-size: 17px;
			font-family: Arial;
			font-weight: bold;
			color: #251811;
		}
		// 评价
		.shop-info-evaluate {
			position: absolute;
			z-index: 99;
			top: 12px;
			left: 106.5px;
			display: flex;
			overflow: hidden;
			// width: 100%;
			font-size: 11px;
			color: #999999;
			span{
				background: rgba(253, 246, 238, .1);
				padding: 0 5px;
				height: 16px;
				line-height: 16px;
				border-radius: 8px;
				margin-right: 5px;
				font-size: 10px;
				font-family: PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
	}
	.bottom-flag {
		width: 100%;
		height: 1px;
	}
}
</style>
