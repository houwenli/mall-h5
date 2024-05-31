<template>
  <div class="search">   
		<div class="search_box">
			<div class="search_box-left">
				<div class="search-left" @click="toIndex" v-if="shareflag">					
					<i class="backhomeimg"></i>				
				</div>
				<div class="search-left" @click="toBack" v-else>				
					<i class="backimg"></i>				
				</div>

				
				<van-popover v-model="showPopover" trigger="click" :actions="actions" @select="handleSelect" placement="bottom" get-container=".search_box">
					<template #reference>
						<div class="search-middle">							
							<i class="backimg"></i>							
						</div>
					</template>
				</van-popover>
				
			</div>		

			<div v-if="showSearch" class="search_input" @click="toSearchGoodsList">
				<img src="@/assets/img/goodsDetail/search.png" />
				<div class="search_text">搜索万顺商品</div>			
			</div>		
		</div>
	
  </div>
</template>
<script>
import { getHotKeysList } from './data.js'
import { getToken } from '@/utils/token'
import {getUsersource} from '@/utils/utils'
import { smartOpenDeepLink } from '@/utils/hybrid'
export default {
	components: {
	
	},
	props: {
		shareflag: {
			type: [Boolean, String],
			default: false
		},
		
		// 是否显示搜索框
		showSearch: {
			type: Boolean,
			default: true
		}		
	},
	computed: { 
	
	},
	data() {
		return {						 
			hotKeys: [],// 热词
			keywordIndex: 0,
			showPopover: false,
			actions: [
				{
					text: '首页',
					icon: require('@/assets/img/goodsDetail/index.png'),
					urls: {
						h5: '',
						smartH5: 'home',
						smartApp: 'home',
					},
				},
				{
					text: '购物车',
					icon: require('@/assets/img/goodsDetail/cart.png'),
					urls: {
						h5: 'cart',
						smartH5: 'shopCart',
						smartApp: 'shopcart',
					},
				},
				{
					text: '个人中心',
					icon: require('@/assets/img/goodsDetail/home.png'),
					urls: {
						h5: 'home',
						smartH5: 'my',
						smartApp: 'mine',
					},
				},
      ],
			isLogin: getToken() ? getToken() : false, // 判断是否登录
		}
	},
	mounted() {
		this.getHotKeys()
	},
	methods: {  
		handleSelect(action) {
			let usersource = getUsersource() //判断那个端
			if (!this.isLogin) {
				//未登录
				if (usersource == 11) {
					//智慧生活APP
					smartOpenDeepLink('wsf://app/login')
				} else {
					this.$router.push({ path: '/login', query: { url: `${location.pathname + location.search}` } })
					return
				}
			} else {
				switch (usersource) {
					case 4:
						//电商H5
						this.$router.push({
							path: `/${action.urls.h5}`,
						})
						break
					case 11:
						//智慧生活APP
						smartOpenDeepLink(`wsf://app/pagehome?tab=${action.urls.smartApp}`)
						break
					default:
						//其他APP内嵌智慧生活H5
						window.location.href = `${process.env.SMART_PAGE_DOMAIN}/${action.urls.smartH5}`
						break
				}
			}
    },
		/**
		 * 查询热词
		*/
		async getHotKeys () {
			this.hotKeys = await getHotKeysList()
		},
		toIndex(){
			this.$emit('toIndex')
		},   
		toBack(){
			this.$emit('toBack')
		},   
		// 跳转到搜索页面
		toSearchGoodsList () {		
			// let text = ''
			// if (this.hotKeys.length) {
			// 	text = this.hotKeys[this.keywordIndex]
			// }
			this.$router.push({
				path: '/search',
				// query: {
				// 	searchValue: text
				// }
			})
		},
	},
}
</script>

<style scoped lang="less">
.search {
	width: 100%;	
	padding: 6px 12px;
	// background: #FFFFFF;
	.search_box {	
	
		display: flex;
		align-items: center;					
				
		.search_box-left{					
			width: 84px;
			height: 32px;
			display: flex;			
			align-items: center;
			.search-left {
				margin-right: 8px;	
				width: 32px;
				height: 32px;	
				display: flex;
				align-items: center;	
				justify-content: center;
				border-radius: 8px;
				border: 1px solid rgba(151,151,151,0.2);	
				background: rgba(255,255,255,0.9);																	
				.backimg {
					display: block;
					background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/detail/icon-left.png') no-repeat center center;
					background-size: 100%;
					width: 24px;
					height: 24px;
				}
				.backhomeimg{
					display: block;
					background: url('https://wsjc-web.wsecar.com/wsf-mall/skuDetail/homePage.png') no-repeat center center;
					background-size: 100%;
					width: 16px;
					height: 16px;
				}

			
			}
			.search-middle {							
				margin-right: 12px;		
				width: 32px;	
				height: 32px;	
				display: flex;
				align-items: center;	
				justify-content: center;
				background: rgba(255,255,255,0.9);
				border-radius: 8px;
				border: 1px solid rgba(151,151,151,0.2);														
				.backimg {
					display: block;
					background: url('../../../../assets/img/goodsDetail/more.png') no-repeat center center;
					background-size: 100%;
					width: 16px;
					height: 16px;				
				}
				
			}
		}	
		.search_input {		
			flex: 1;
			height: 32px;
			background: rgb(255,255,255);
			opacity: 0.9;			
			border: 0.5px solid rgba(151,151,151,0.2);
			border-radius: 19px;
			padding-left: 8px;			
			display: flex;
			align-items: center;	
			box-sizing: border-box;
			img{
				width: 16px;
			}					
			.search_text{
				opacity: 1;
				font-size: 14px;				
				font-weight: 400;
				color: #999999;
				margin-left: 8px;
				font-family: PingFangSC-Regular, PingFang SC;			
				padding-top: 1.5px;
			}
			
		}
		
	}
}
/deep/ .van-popup {
	top: 48px;
	.van-popover__arrow{
		margin-left: -6px !important;
	
	}		
 	.van-popover__content{
		.van-popover__action{
			height: auto !important;;
			padding: 10px 12px !important;; 
			.van-hairline--bottom::after{
				border: none;
			}
		}
	}
}
</style>
