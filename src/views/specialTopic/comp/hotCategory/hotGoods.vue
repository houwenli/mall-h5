<template>
	<div class="hot-goods">
		<!-- 背景图、规则 -->
		<div class="hot-goods-box" @click="toDetails" :style="{ backgroundImage : 'url(' + advBgImg + ')' }">
		</div>

		<div class="hot-goods-contaier-panel" :style="getStyle">
			<hotCarousel :config="config"></hotCarousel>

			<!-- 楼层 -->
			<div class="hot-goods-contaier" v-for="(item, index) in shopList" :key="index">
				<div class="hot-goods-contaier-header">
					<span class="text">{{ item.floorTitle }}</span>
				</div>
				<!-- 不要关注名字，取反了 -->
				<evenHotShopList v-if="index % 2 !== 0" :floorSpuIds="item.floorSpuIds"></evenHotShopList>
				<oddHotShopList v-if="index % 2 === 0" :floorSpuIds="item.floorSpuIds"></oddHotShopList>
			</div>

			<!-- 楼层tab -->
			<!-- <div class="hot-goods-tab">
				<div v-for="(item, index) in shopList" :key="index"
					:class="['hot-goods-tab-item', active == index ? 'hot-goods-tab-active' : '']"
					@click="tabClick(item, index)">
					<span>{{ item.name }}</span>
				</div>
			</div> -->


			<!-- <van-tabs v-model="active" scrollspy @click="tabClick">
				<van-tab v-for="(item, index) in shopList" :key="index" :title="item.name"  class="hot-goods-contaier" >

					<div class="hot-goods-contaier-header">
						<span class="text">{{ item.name }}</span>
					</div>

					<oddHotShopList v-if="index === 0"></oddHotShopList>


					<evenHotShopList v-if="index === 1"></evenHotShopList>

					<oddHotShopList v-if="index === 2"></oddHotShopList>

				</van-tab>
			</van-tabs> -->
		</div>



	</div>
</template>

<script>
import oddHotShopList from './oddHotShopList.vue'
import evenHotShopList from './evenHotShopList.vue'
import hotCarousel from './hotCarousel.vue'
  import { getToken } from '@/utils/token'

export default {
    components: { oddHotShopList, evenHotShopList, hotCarousel },
    data() {
		return {
			active: 0,
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
    getStyle() {
      let c = {
        backgroundImage:  this.mainBgImg,
        backgroundColor: this.mainBgColor,
      }

      // 可能存在没有token的情况，没有token - 没有登录就屏蔽掉这块的元素，避免大块空白
      if (!getToken()) {
        c.display = 'none'
      }

      return c
    },
		shopList () {
			let {
				floorContents = []
			} = this.config;
			// 处理楼层信息
			return floorContents.sort((pre, next) => {
				return pre.floorNum - next.floorNum
			})
		},
		// 取背景图片
        advBgImg () {
            return this.config && this.config.advAndrankImgUrl || 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/paihangbang/bg.png'
        },
		// 取背景样式
		mainBgImg() {
			return this.config.backImgUrl ? `url(${this.config.backImgUrl})` : '';
		},
		mainBgColor() {
			return this.config.backColorValue || '';
		}
	},

    created() {

    },
    methods: {
		// tabClick(name,title){
		// 	this.active = name
		// },

		//详情
		toDetails() {
			let id = this.config.link || ''
			if (id !== 0 && !id) {
				this.$vux.toast.text('缺少参数', 'middle')
				return
			} else {
				this.$router.push({ path: '/spudetail', query: { id, sourceType: 1 } })
			}
		},
    },
}
</script>

<style scoped lang="less">
.hot-goods-contaier-panel {
	padding: 20px 0 39px;
}
.hot-goods{
	height: 100%;
	width: 100%;
	&-box{
		height: 225px;
		// background: url('~@/assets/img/specialTopic/bg.png')  no-repeat;
		background-size: 100% 100%;
	}
	&-tab{
		padding: 19px 12px 0;
		display: flex;
		box-sizing: border-box;
		&-item{
			flex: 1;
			font-size: 15px;
			font-family: PingFang SC;
			font-weight: 300;
			color: #FFFFFF;
			text-align: center;
			padding: 11px 0;
		}
		&-active{
			font-weight: bold;
			position: relative;
			border-radius: 18px;
			border: 1px solid #FFFFFF;
		}
	}

	/deep/ .van-tabs{
		>div{
			padding: 19px 12px 0;
		}
		.van-tab{
			font-size: 15px;
			font-family: PingFang SC;
			font-weight: 300;
			color: #FFFFFF;
			padding: 11px 0;
		}
		.van-tabs__wrap{
			height: auto;
		}
		.van-tabs__nav{
			background: transparent;
		}
		.van-tabs__content{
			padding-top: 0;
		}
		.van-tabs__line{
			background-color: transparent;
			.van-tabs__wrap{
				height: auto;
			}
		}
		.van-tab--active{
			font-weight: bold;
			border-radius: 18px;
			border: 1px solid #FFFFFF;
		}
		.van-tabs__nav--line{
			padding-bottom: 0;
			height: auto;
		}

	}
	&-contaier{
		padding: 15px 12px 0;
		&-header{
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 17px;
			.text{
				font-size: 18px;
				font-family: Source Han Sans CN;
				font-weight: bold;
				color: #FFFFFF;
			}

		}
	}
}
</style>
