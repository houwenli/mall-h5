<template>
<div class="special-shopList">
	<van-list
      v-if="pageList.length > 0"
      v-model="loading"
      :finished="true"
      :immediate-check="false"
    >
      <ul v-if="pageList.length > 0" class="sku-list clearfix">
        <li v-for="(item, index) in pageList" :key="index" class="sku-list-item" :style="bgStyle(index)">		
			<img :src="index>3 ?bgImage[3] :bgImage[index]" alt="">
			<span>TOP{{ index + 1 }}</span>
			<!-- 商品评论 好评率 -->
            <div class="shop-info-evaluate">
              <span v-if="item.skuLable.baseLabel.comment">{{ item.skuLable.baseLabel.comment | filterFraction(1) }}评论</span>
              <span v-if="item.skuLable.baseLabel.applauseRate * 1">
              
                {{ item.skuLable.baseLabel.applauseRate }}%好评
              </span>
              <span v-if="item.skuLable.baseLabel.salesVolume" class="">               
                热销{{ item.skuLable.baseLabel.salesVolume | filterFraction(1) }}
              </span>
            </div>

			<van-swipe-cell @open="open(index, item)">
				<specialProductList  :item="item" :key="pageList.length" :isStatus="true" :isCart="true"  @addShoppingCart="addShoppingCart"></specialProductList>         
			</van-swipe-cell>
        </li>
      </ul>
    </van-list>
</div>
</template>

<script>
// import { queryBrowseRecords } from '@/api/mybrowserecord'
import specialProductList from './specialProductList.vue'
import { addShoppingCart } from '@/api/spudetail' // 加入购物车接口
import { SwipeCell, List, Toast } from 'vant'

import { selectSubjectRanking } from '@/api/specialTopic/ranking';
export default {
    components: { 
		specialProductList,
		[SwipeCell.name]: SwipeCell,
		[List.name]: List, 
		[Toast.name]: Toast,
	},
	props: {
		moduleData: {
			type: Object,
			default: () => {},
		},
		tabInfo: {
			type: Object,
			default: () => {},
		},
		config: {
			type: Object,
			default: () => {},
		}
	},
    data() {
		return {
			
			listQuery: {
				pageNum: 0, // 当前页码
				pageSize: 10, // 每页显示记录数
			},
			pageList: [], //页面数据源
			loading: false, //正在加载
			finished: false,
			bgColor: {
				0: "linear-gradient(111deg, #615042 0%, #B7966E 100%)",
				1: "linear-gradient(111deg, #413F40 0%, #828699 100%)",
				2: "linear-gradient(111deg, #27211A 0%, #81624F 100%)",
				3: "linear-gradient(111deg, #282828 0%, #2A2827 100%)"
			},
			bgImage: {
				0: 'https://wsjc-web.wsecar.com/wsf-mall/paihangbang/tags1.png',
				1: 'https://wsjc-web.wsecar.com/wsf-mall/paihangbang/tags2.png',
				2: 'https://wsjc-web.wsecar.com/wsf-mall/paihangbang/tags3.png',
				3: 'https://wsjc-web.wsecar.com/wsf-mall/paihangbang/tags4.png'
			}
		}
    },
	computed:{
	
	},
    created() {
    },
	
	watch: {
		// pageList:{
		// 	handler(newVal, oldVal) {
		// 		this.pageList.map((item,index)=>{
		// 			this.pageList[index].status=item.sku.status
		// 		})
		// 	},
		// 	deep: true,
		// 	immediate: true,
		// },
		tabInfo: {
			handler: function () {
				// 是否有更多标识初始化
				this.hasMore = true;
				this.listQuery = Object.assign({}, this.listQuery, {
					id: this.moduleData.id,
					secondCateId: this.tabInfo.id || '',
					topRule: parseInt(this.config.topRule),
					pageNum: 0, // 页码初始化
				})
				this.getData();
			},
			immediate: true
		}
	},
    methods: {
		// 处理主推商品
		dealRecoSkuList() {
			const {
				topSpuNum
			} = this.config

			this.$emit('altRecoSkuList', this.pageList.slice(0, topSpuNum))
		},
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
		bgStyle(index){
			if(index>3){
				return {
					'background-image': this.bgColor[3],				
					'background-repeat': 'no-repeat',
					'background-size': 'cover',
				}
			} else {
				return {
					'background-image': this.bgColor[index],				
					'background-repeat': 'no-repeat',
					'background-size': 'cover',
				}
			}
		},		
		onLoad() {
			// this.getData()
		},
		//获取数据
		getData() {
			try {
				selectSubjectRanking(this.listQuery).then((response) => {
					let list = response.data
					if (list.length > 0) {
						this.pageList = list;
						if (this.listQuery.pageNum == 0) {
							// 选取主推商品
							this.dealRecoSkuList();
						}					
					}
					this.loading = false
					this.listQuery.pageNum++
					if (this.listQuery.pageNum >= response.totalPage) {
						this.finished = true
					}
				})
			} catch (error) {
				console.log(error)
			}
		},
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
		margin-top: 26.5px;
		border-radius: 9px;
		padding: 38.5px 6px 6px;
		position: relative;
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
}
</style>
