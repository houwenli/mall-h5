<template>
    <div class="carousel-panel" :style="{ backgroundImage : 'url(' + bgImg + ')' }">
        <div class="carousel">
            <div id="carousel-container" class="carousel-container">
                <div v-for="(item, index) in carouselData" :key="index" 
                    class="carousel-every"
                    :class="item.newClass ? 'new-class': ''"
                    @click="goSkuDetail(item)"
                >
                    <div class="carousel-every__crown"
                        :class="index <= 2 ? carouselClass[index] : carouselClass.other">{{ index + 1 }}</div>
                    <div class="carousel-every__bg">
                        <img class="carousel-every__img" :src="item.url">
                        <p class="carousel-every__desc">热销{{ (item.skuLable && item.skuLable.baseLabel && item.skuLable.baseLabel.salesVolume) | saleNumCount }}件</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
	
</template>

<script>
import Carousel from '../../common/carousel'
export default {
    data() {
		return {
			carouselData: [],
            // 类名策略
            carouselClass: {
                0: 'carousel-every__first',
                1: 'carousel-every__second',
                2: 'carousel-every__third',
                other: 'carousel-every__other'
            },
		}
    },
    
    props: {
        recoSkuList: {
			type: Array,
			default: () => [],
		},
        config: {
			type: Object,
			default: () => {},
		}
    },
   
    filters: {     
        saleNumCount(val) {
            if (val && Number(val) > 9999) {
                return Math.floor(Number(val) / 10000) + '万'
            } else {
                return val
            }
        }
	},

    computed: {
        // 取背景图片
        bgImg () {
            return this.config && this.config.advAndrankImgUrl || 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/bg-img.png'
        }
    },

    watch: {
        // 数据渲染了再去计算，mounted中不一定能获取到子元素
        recoSkuList() {
            this.carouselData = this.recoSkuList

            this.$nextTick(() => {
                // 获取当前容器
                let container = document.getElementById('carousel-container');

                // 获取容器内元素
                let carouselList = document.getElementsByClassName('carousel-every') || [];
                
                // 调用轮播实例
                let carousel = new Carousel(container, carouselList);
                if (carouselList.length > 3) {
                    carousel.carouselTouchListen(this.touchEffect);
                }
                // 初始时状态
                this.touchEffect(0)
                
            })
        }
    },

    created() {

    },
    mounted() {
        
    },
    methods: {
        // 跳商详
        goSkuDetail(item) {
            let id = item.id || ''
            if (!id) {
                this.$vux.toast.text('缺少参数', 'middle')
                return
            } else {
                this.$router.push({ path: '/spudetail', query: { id, storeId: this.storeId, sourceType: item.sourceType || 1 } })
            }
        },
        touchEffect(index) {
			// 当前元素两边元素样式变动
            this.carouselData = this.carouselData.map((item, carouselIndex) => {
                if (carouselIndex == index + 1) {
                    return {
                        ...item,
                        newClass: true
                    }
                } else {
                    return {
                        ...item,
                        newClass: false
                    }
                }
            })
		},
    },
}
</script>

<style scoped lang="less">
    .carousel-panel {
        width: 375px;
        height: 350px;
        padding-top: 135px;
        background-size: 100% 100%;
    }
    .new-class {
        margin-top: -15px;
    }
    .carousel {
        width: 100%;
        overflow: hidden;
        padding: 15px 10px 0 22px;
        .carousel-container {
            display: flex;
        }
        .carousel-every {
            margin-right: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 50ms;
        }
        .carousel-every__crown {
            width: 35.5px;
            height: 26px;
            background-size: 100% 100%;
            line-height: 32px;
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            font-family: Arial;
            margin-bottom: 2px;
        }
        .carousel-every__first {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank1.png');
            color: #C6781A;
        }
        .carousel-every__second {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank2.png');
            color: #667090;
        }
        .carousel-every__third {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank3.png');
            color: #C6781A;
        }
        .carousel-every__other {
            background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/rank-other.png');
            color: #80766F;
        }
        .carousel-every__bg {
            width: 100px;
            height: 129px;
            background: linear-gradient(-90deg, #A17B55 0%, #e1cbac 100%);
            border-radius: 15px;
        }
        .carousel-every__img {
            width: 97px;
            height: 97px;
            background: #FFFFFF;
            border-radius: 15px;
            display: block;
            margin: 2px auto 0;
        }
        .carousel-every__desc {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 30px;
        }
    }
</style>
