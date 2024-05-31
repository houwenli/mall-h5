<template>
	<div>
		<rankList :recoSkuList="recoSkuList" :config="config"></rankList>
		<div class="special-goods"  :style="{
			backgroundImage: 'url(' + bgImg + ')',
			backgroundColor: bgColor
		}">	
			<div class="special-goods-contaier">
				<div class="special-goods-hearer" v-if="configList.length > 0">
					<div v-for="(item, index) in configList" :key="index" 
						:class="['special-goods-hearer-box', active == index ? 'special-goods-hearer-active' : '']"
						@click="tabClick(item, index)">
						<span :class="[active == index ? 'special-goods-text-active' : '']">{{ item.name }}</span>							
					</div>
				</div>
				<specialShopList @altRecoSkuList="altRecoSkuList" :tabInfo="tabInfo" :moduleData="moduleData" :config="config"></specialShopList>
			</div>	
		
		</div>
	</div>
</template>

<script>
import specialShopList from './specialShopList.vue'
import shopList from '@/components/commons/shopList'
import rankList from './rankList.vue'

import { selectRankingSecondCate } from '@/api/specialTopic/ranking';
export default {
    components: { specialShopList, shopList, rankList },
    data() {
		return {
			// 分类tab数据
			active: 0,
			tabInfo: {}, // 当前分类数据，传递给商品列表组件
			configList: [],

			// 头部主推商品
			recoSkuList: [],
		}
    },
	props: {
		moduleData: {
			type: Object,
			default: () => {},
		},
		config: {
			type: Object,
			default: () => {},
		},
	},
   
	computed: {
		// 取背景样式
		bgImg() {
			return this.config.backImgUrl ? `url(${this.config.backImgUrl})` : '';
		},
		bgColor() {
			return this.config.backColorValue || '';
		}
	},

    created() {
		this.init();
    },
    methods: {
		init() {
			this.getTabList().then(ret => {
				// tabInfo要设置初始值
				this.tabInfo = this.configList[0] || {}
			})
		},

		// 获取分类tab
		getTabList() {
			return new Promise((resolve, reject) => {
				let param = {
					id: this.moduleData.id
				}
				selectRankingSecondCate(param).then(res => {
					const {
						code,
						data = []
					} = res || {}
					if (code === 200) {
						if (data.length > 1) {
							this.configList = data || [];
							// 第一个是总榜，添加上去
							this.configList.unshift({
								name: '总榜',
								id: ''
							})
						}
						resolve(true);
					} else {
						reject(false);
					}
				}).catch(err => {
					reject(false);
				})
			})
			
		},

		altRecoSkuList(recoSkuList) {
			this.recoSkuList = recoSkuList;
		},

		tabClick(item, index){
			this.active = index
			this.tabInfo = item || {}

			this.rollEffect(this.active)
		}, 
		rollEffect(index) {
			this.$nextTick(() => {
				// 获取父盒子元素
				let levelMenusBox = document.getElementsByClassName('special-goods-hearer')[0]
				// 获取一级菜单dom列表
				let levelMenus = document.getElementsByClassName('special-goods-hearer-box') || []
				// 动态获取元素的margin-right距离
				let marginRight = window.getComputedStyle(levelMenus[0]).marginRight.split('px')[0]

				let levelWidths = []
				// 遍历获取每个一级菜单的宽度
				for(let item of levelMenus) {
					let elWidth = window.getComputedStyle(item).width.split('px')[0]
					levelWidths.push((elWidth * 1 + marginRight * 1).toFixed(4) * 1)
				}

				// 获取第一个元素到当前点击元素的宽度list
				let elWidths = levelWidths.splice(0, index)
				// 计算所有元素的宽度
				let deviation = index > 0 && elWidths.reduce((preValue,curValue) => preValue + curValue)
				// 计算父盒子滚动距离
				let scrollLeft = index === 0 ? 0 : deviation - elWidths[elWidths.length - 1]

				levelMenusBox.scroll({
					top: 0,
					left: scrollLeft,
					behavior: "smooth", //滚动条平滑滚动
				});
			})
		},   
    },
}
</script>

<style scoped lang="less">
.special-goods{	
	height: 100%;
	&-contaier{
		padding: 15px 6px;
		.special-goods-hearer{		
			width: 100%;
			overflow-x: scroll;
			overflow-y: hidden;
			height: 40px;
			background: rgba(252, 232, 217, .3);		
			border-radius: 20px;
			display: flex;
			align-items: center;
			padding: 7px 4px;
			>.special-goods-hearer-box{			
				height: 26px;			
				border-radius: 13px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 14px;
				font-size: 15px;
				font-family: PingFang SC;
				font-weight: 300;
				color: #F2E1CE;				
			}
			&-active{
				border: 1px solid #FFFFFF;
				background: linear-gradient(0deg, #F7D4B5 0%, #FDF6EE 100%);
				border-radius: 13px;		
				text-shadow: 0px 1px 0px #FFFFFF;		
						
			}
			.special-goods-text-active{
				font-size: 15px;
				font-weight: 500;
				color: #532900;			
				min-width: 59px;
				text-align: center;
				padding: 0 15px;
			}
			span{
				//min-width: 59px;	
				white-space: nowrap;
				text-align: center;
				// padding: 0 15px;
				padding: 0;
			}
			span:first-of-type{
				padding: 0 15px;
			}
		}		
		.special-goods-hearer::-webkit-scrollbar {display:none}
	}	
}
</style>
