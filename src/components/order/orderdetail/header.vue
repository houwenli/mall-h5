<template>
<div class="search">   
    <div class="search_box">
        <div class="search_box-left">			
            <div class="search-left" @click="goBack()">				
                <i class="backimg"></i>				
            </div>			
            <van-popover v-model="showPopover" trigger="click" :actions="actions" @select="handleSelect" placement="bottom">
                <template #reference>
                    <div class="search-middle">							
                        <i class="backimg"></i>							
                    </div>
                </template>
            </van-popover>			
        </div>

        <slot>
            <div class="search_box-right">
                <span>我的订单</span>
            </div>
        </slot>   			
    </div>	
</div>
</template>
<script>

import { getToken } from '@/utils/token'
import { getUsersource, appBack } from '@/utils/utils'
import { smartOpenDeepLink } from '@/utils/hybrid'
export default {
    components: {	
    },
    props: {		
    },
    computed: { 	
    },
    data() {
        return {
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
        goBack(){	
            appBack(this)				           
            // if (window.ws) {
            //     // android环境
            //     window.ws.finishActivity();
            // } else if (window.webkit) {
            //     // ios环境
            //     window.webkit.messageHandlers.finishActivity.postMessage('');
            // } else {
            //     this.$router.back()
            // }
        }		
    },
}
</script>

<style scoped lang="less">
.search {
    width: 100%;	
    padding: 0 12px;
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
                    background: url('~@/assets/img/goodsDetail/left_arrow.png') no-repeat center center;
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
                    background: url('~@/assets/img/goodsDetail/more.png') no-repeat center center;
                    background-size: 100%;
                    width: 16px;
                    height: 16px;				
                }
                
            }
        }	
        .search_box-right{
            flex: 1;
            text-align: center;			
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            span{
                width: 100%;
                margin-left: -84px;
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
    