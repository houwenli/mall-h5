<template>
    <div data-desc="热销商品-轮播" class="carousel-panel" v-if='carouselData.length'>
        <div class="carousel">
            <div id="carousel-container" class="carousel-container">
                <div class="carousel-every" v-for="(item, index) in carouselData" :key="index"
                    :class="item.newClass ? 'new-class': ''"
                    @click="goSkuDetail(item)">
                    <div class="carousel-every__bg">
                        <div class="carousel-every__img-bg">
                            <img class="carousel-every__img" :src="item.url">
                            <p class="carousel-every__desc">{{ item.desc }}</p>
                        </div>
                    </div>
                    <p class="carousel-price">
                        ￥<span class="carousel-price__int">{{ item.priceInt }}</span>.{{ item.priceDecimal }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Carousel from '../../common/carousel/oneByOne'
import { throttle, getSplitPrice } from '@/utils/utils'
import { selectSpuDeleteBySpuIds } from '@/api/specialTopic/ranking';
export default {
    components: {

    },
    data() {
        return {
            queryForm: {
                spuIds: []
            },
            carouselData: [],
            carouselShowNum: 4,
        }
    },
    computed:{

    },
    props: {
        config: {
			type: Object,
			default: () => {},
		}
    },
    created() {
        this.getRecommendList()
    },

    mounted() {
    },

    watch: {

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
        // 获取主推商品列表
        getRecommendList() {
            this.queryForm.spuIds = this.config.mainSpuIds || [];
            selectSpuDeleteBySpuIds(this.queryForm).then(res => {
                if (res.code === 200) {
                    this.carouselData = res.data.map(item => {
                        let salesVolume = item.skuLable && item.skuLable.baseLabel && item.skuLable.baseLabel.salesVolume
                        let desc = ''
                        if (salesVolume && Number(salesVolume) > 9999) {
                            desc = `热销${Math.floor(Number(salesVolume) / 10000) + '万'}件`;
                        } else {
                            desc = `热销${salesVolume}件`;
                        }

                        const priceObj = getSplitPrice(item.price);
                        const {
                            int: priceInt,
                            decimal: priceDecimal
                        } = priceObj;


                        return {
                            ...item,
                            desc,
                            priceInt,
                            priceDecimal,
                        }
                    })

                    this.createCarousel()
                }
            })
        },

        // 创建轮播
        createCarousel() {
            // 拼接数据
            this.carouselInit(this.carouselData, this.carouselShowNum);
            this.$nextTick(() => {
                // 获取当前容器
                let container = document.getElementById('carousel-container');

                // 获取容器内元素
                let carouselList = document.getElementsByClassName('carousel-every') || [];

                if (container && carouselList.length > 0) {
                    // 调用轮播实例
                    let carousel = new Carousel(container, carouselList, {
                        loop: {
                            use: true,
                            showNum: this.carouselShowNum
                        }
                    });
                    carousel.carouselTouchListen(this.touchEffect);
                    // 初始时状态
                    this.touchEffect(this.carouselShowNum)
                }

            })
        },

        carouselInit(data, showNum) {
            if (data.length <= showNum) {
                return
            }
            // 拼接数据，前后拼上showNum条数据，前面拼后四个，后面拼前4个，这个是无限轮播的关键
            data = [
                ...data.slice(data.length - showNum),
                ...data,
                ...data.slice(0, showNum)
            ]

            this.carouselData = data.concat()
        },

        touchEffect(index) {
           // 当前元素两边元素样式变动
           this.carouselData = this.carouselData.map((item, carouselIndex) => {
                if (carouselIndex == index + 1 || carouselIndex == index + 2) {
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
        }
    }
}
</script>

<style scoped lang="less">
    .carousel-panel {
        overflow: hidden;
        height: 100px;
    }
    .new-class {
        transform: translateY(12px);
    }
    .carousel {
        width: 100%;
    }
    .carousel-container {
        display: flex;
    }
    .carousel-every {
        width: 88px;
        height: 88px;
        background: linear-gradient(90deg, #C782EB 0%, #CA59E5 46%, #A158E5 100%);
        border-radius: 20px;
        margin-left: 5px;
        transition: all 50ms;
    }
    .carousel-every__bg{
        width: 88px;
        height: 63px;
        background: #FFFFFF;
        border-radius: 20px 20px 10px 10px;
        position: relative;
    }
    .carousel-every__img-bg {
        display: flex;
    }
    .carousel-every__img {
        width: 70px;
        height: 55px;
        margin: 4px auto 0;
    }
    .carousel-every__desc {
        width: 77px;
        height: 15px;
        line-height: 15px;
        background: #E75C95;
        border-radius: 7px;
        text-align: center;
        font-size: 9px;
        color: #FAFAFA;
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
    }
    .carousel-price {
        line-height: 24px;
        font-size: 11px;
        color: #FAFAFA;
        font-weight: bold;
        font-family: PingFang SC;
        text-align: center;
    }
    .carousel-price__int {
        font-family: DIN Alternate;
        font-size: 18px;
    }
</style>
