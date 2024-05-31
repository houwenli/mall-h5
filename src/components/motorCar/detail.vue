<template>
    <div class="motor-car-page boxwrapper" v-if='spu' ref="boxwrpper">
        <div class="top-header" id="headerwrapper">
            <div class="headerbox top-back-btn">
                <div class="search-left" @click="toBack">
                    <i class="backimg"></i>
                </div>
            </div>

            <div v-if='showNavigation' id="headerbox" class="headerbox headerbox-tab">
                <detail-tab ref='detailTab' :tabList='tabList' @toPage='toPage'></detail-tab>
            </div>
        </div>
        <div class="good-main-box" ref="spuPage" style="padding-top: 0px; position: relative;">
            <div ref="goodPic" style="position: relative; top: -2.64rem"></div>
            <div :style="newUiImgList.length > 1 ? 'background: #fff;' : ''">
                <img-swiper :spu="spu" :carouselPics="carouselPics" :spuVideoPic="spuVideoPic" ref="imgSwiper"></img-swiper>
            </div>
            <swiper-control :newUiImgList="newUiImgList" v-if="newUiImgList.length > 1"></swiper-control>
            <div class="main-card-wrapper">
                <basic-card :spu="spu" :shelvesStatus="shelvesStatus" :sellOut="sellOut"></basic-card>
                <!-- 自提门店 -->
                <stores-card v-if='spu.spuId' haveNear :spu="spu" :list='storeList' :storeIndex="storeIndex" @setList='setList'></stores-card>
                <div ref="detailPage" style="position: relative; top: -2.64rem"></div>
                <!-- 商品详情 -->
                <div class="goods-title">
                    <img src="@/assets/img/goodsDetail/left_quan.png" alt="">
                    <span>商品详情</span>
                    <img src="@/assets/img/goodsDetail/right_quan.png" alt="">
                </div>
                <good-intro-card :spu="spu"></good-intro-card>
                <car-params-card :spu="spu"></car-params-card>
            </div>

        </div>
        <!-- 底部按钮 -->
        <div class="footer-box">
            <good-footer :initialSku='initialSku' :newUiImgList='newUiImgList' :skuId="skuId" :spu='spu' :sku="sku" :list='storeList' :storeIndex="storeIndex"></good-footer>
        </div>

        <el-amap :plugin="plugin" v-show='false'></el-amap>
    </div>
    <div v-else class="empty-page">
        <div class="empty-page-header">
            <i @click="toBack"></i>
        </div>
        <img class="empty-page-img" :src="emptyImg" mode="" />
        <div class="empty-page-text">抱歉，链接已失效〜</div>
        <div class="empty-page-btn" @click="toBack">看看其他</div>
    </div>
</template>

<script>
// TEST:
import { deepClone, isMobile } from '@/utils/utils'
import ImgSwiper from './component/imgSwiper.vue'
import SwiperControl from './component/swiperControl.vue'
import BasicCard from './component/basicCard.vue'
import StoresCard from './component/storesCard.vue'
import GoodIntroCard from './component/goodIntroCard.vue'
import CarParamsCard from './component/carParamsCard.vue'
import GoodFooter from './component/goodFooter.vue'
import DetailTab from './component/detailTab.vue'
import handleTabStyle from './component/handleTabStyle.js'

import { nearStations } from '@/api/motorCar.js'
import emptyImg from '@/assets/img/cat_d@2x.png'


import {
    querySpu,
} from '@/api/spudetail'
const { isPhone } = isMobile();

export default {
    provide() {
        return {
            querySpu: this.querySpuDetail,
            selectProId: () => this.selectProId,
            setStoreIndex: this.setStoreIndex,
            setAfterPrice: this.setAfterPrice
        }
    },
    components: {
        ImgSwiper,
        SwiperControl,
        BasicCard,
        StoresCard,
        GoodIntroCard,
        CarParamsCard,
        GoodFooter,
        DetailTab
    },
    data() {
        return {
            spuVideoPic:'',
            newUiImgList: [],
            carouselPics: [], // 轮播图片
            sku: {
                list: [],
                // tree: []
            },
            selectProId: '', // 切换分类时选中skuId
            skuId: '',
            isPhone,
            showNavigation: false,
            tabList: [
                {
                    title: '商品',
                    name: '0'
                },
                {
                    title: '详情',
                    name: '1'
                }
            ],
            spu: {},//详情信息
            shelvesStatus: '',
            storeIndex: 0,
            sellOut: 0,
            storeId: '',
            storeList: [],
            emptyImg,
            longitude: '',
            latitude: '',
            cityCode: '',
            plugin: [
                {
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: 10000, // 超过30秒后停止定位，默认：无穷大
                    zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    showButton: false, // 显示定位按钮，默认：true
                    pName: 'Geolocation',
                    events: {
                        init: (o) => {
                            this.GDinit(o, this) // 获取当前位置
                        },
                    },
                },
            ],
            getStoreLoading: true,
            initialSku: {},
            positionFail: false
        }
    },
    async created() {
        this.skuId = this.$route.query.skuId
        this.storeId = this.$route.query.storeId
        
        if (sessionStorage.getItem('motorPotionParams')) {
            await this.querySpuDetail({ skuId: this.skuId,init: true })
            try {
                let motorPotionParams = JSON.parse(sessionStorage.getItem('motorPotionParams')) || {}
                this.longitude = motorPotionParams.longitude
                this.latitude = motorPotionParams.latitude
                this.cityCode = motorPotionParams.cityCode
                this.getNearStore()
                window.resetSpudetail = this.resetData
            } catch (error) {
                console.log(error)
            }
        }
    },
    mounted() {
        // 滚动条的获取    
        window.addEventListener('scroll', this.handleScroll, true)
        this.handleScroll()
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        async resetData() {
            await this.querySpuDetail({ skuId: this.skuId, init: true })
            this.getNearStore()
        },
        // 查询当前经纬度
        async GDinit(o) {
            if (sessionStorage.getItem('motorPotionParams')) {
                return
            }
            let that = this
            await this.querySpuDetail({ skuId: this.skuId,init: true })
            o.getCurrentPosition((status, result) => {
                if (status === 'complete' && result.info === 'SUCCESS') {
                    that.longitude = result.position.getLng()
                    that.latitude = result.position.getLat()
                    let { adcode } = result.addressComponent
                    that.cityCode = adcode.slice(0, 4) + '00'
                    const motorString = JSON.stringify({
                        longitude: that.longitude,
                        latitude: that.latitude,
                        cityCode: that.cityCode
                    })
                    sessionStorage.setItem('motorPotionParams', motorString)
                    that.getNearStore()
                    window.resetSpudetail = that.resetData
                } else {
                    // that.getNearStore()
                    // window.resetSpudetail = that.resetData
                    this.$toast('定位失败,请刷新后重试')
                    this.getStoreLoading = false
                    this.positionFail = true
                }
            })

        },
        getNearStore() {
            nearStations({
                cityCode: this.cityCode || 420100,
                longitude: this.longitude || 114.40852,
                latitude: this.latitude || 30.476683,
                spuId: this.spu.spuId,
                storeId: this.storeId
            }).then(res => {
                this.storeList = res.data.map((item, index) => {
                    return {
                        ...item,
                        checked: this.storeIndex == index
                    }
                })
                this.getStoreLoading = false
            }).catch(err => {
                console.log(err)
                this.getStoreLoading = false
            })
        },
        handleScroll() {
            if (!this.$refs.spuPage) return

            let scorllTop = this.$refs.spuPage.scrollTop
            let headerdom = document.querySelector('#headerwrapper');
            if (!headerdom || !headerdom.classList) {
                return
            }

            this.showNavigation = scorllTop > 10
            this.$nextTick(() => {
                if (this.showNavigation) {
                    const target = this.$refs.detailPage;
                    const clientRect = target.getBoundingClientRect();
                    if (clientRect.y <= 50 && this.$refs.detailTab) {
                        this.$refs.detailTab.active = this.tabList[1].name
                    } else {
                        this.$refs.detailTab.active = this.tabList[0].name
                    }
                }
            })
            // 处理顶部不同位置样式
            handleTabStyle(scorllTop, headerdom)
        },
        toPage(name) {
            const tabPositionRefs = {
                '0': 'goodPic',
                '1': 'detailPage',
                // '2': 'recommend',
            }
            this.$refs[tabPositionRefs[name]].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        },
        setList(val) {
            this.storeList = val.map(item => item)
        },
        setAfterPrice(price) {
            this.spu.afterCouponPrice = price
        },
        toBack() {
            if(this.$route.query.spuId) {
                if (window.ws) {
                    // android环境
                    window.ws.finishActivity();
                } else if (window.webkit) {
                    // ios环境
                    window.webkit.messageHandlers.finishActivity.postMessage('');
                }
                } else {
                this.$router.go(-1)
            }
        },
        //获取详情 throttle
        async querySpuDetail(params) {
            try {
                const apiQueryParams ={
                    skuId: params.skuId || '',
                    spuId: this.$route.query.spuId,
                    batterySettingId: params.batterySettingId,
                    sourceType: this.$route.query.sourceType || 1,
                    commFlag: 2
                }
                if(this.storeId) {
                    apiQueryParams.storeId = this.storeId
                }
                const res = await querySpu(apiQueryParams)
                this.spu = res.data
                this.shelvesStatus = res.data.shelvesStatus
                this.sellOut = res.data.sellOut
                this.skuId = res.data.id
                this.sku.list = res.data.list.map(item => item)
                this.sku.tree = res.data.sku && res.data.sku.tree.map(item => {
                    return {
                        ...item,
                        largeImageMode: item.k_s == 's1'
                    }
                })
                
                this.sku.tree.forEach((item, index) => {
                    if (index != 0) {
                        item.v.forEach((temp, i) => {
                            temp.imgUrl = ''
                        })
                    } else {
                        item.v.forEach((temp, i) => {
                            temp.previewImgUrl = temp.imgUrl
                        })
                    }
                })
                if(params.init) {
                    this.initialSku = (this.spu.sku && this.spu.sku.initialSku) || {}
                }
                this.hanldeCopun() // 处理优惠券展示
                this.handlerSwiperImgList() // 处理轮播图数据
                this.handleSkuList() // 处理skuList数据
            } catch (error) {
                console.log(error)
                this.spu = null
            }

        },
        handleSelectId() {
            const index = this.newUiImgList.findIndex(item => item.id == this.skuId);
            if (index > -1) this.selectProId = this.newUiImgList[index].id
        },
        handlerSwiperImgList() {
            if (this.spu.images) {
                this.carouselPics = this.spu.images.map((image) => {
                    image = image.split('?')[0]
                    let imgUrl = image.split('/')
                    let img = imgUrl.join('/')
                    img += '?imageView2/1/w/750'
                    return { img }
                })

                if (this.spu.spuVideo) {
                    this.spuVideoPic = this.spu.images[0] || ''
                    this.carouselPics.unshift({ img: this.spuVideoPic })
                    this.videoKey = Date.now()
                }
            }
        },
        handleSkuList() {
            let firstList = deepClone(this.sku.list)
            let newList =firstList || []
            if (newList && newList.length > 0) {
                newList = newList.filter((item) => {
                    if (item) {
                        return item.imgUrl && item.stock_num > 0
                    }
                })
                this.newUiImgList = newList
            } 
            this.handleSelectId()
        },
        hanldeCopun() {
            this.spu.couponLabelList =
                this.spu.couponLabelList &&
                this.spu.couponLabelList.map((tag) => {
                    return {
                        ...tag,
                        text:
                            tag.couponsType == 3
                                ? `立减￥${tag.faceValue}`
                                : tag.couponsType == 2
                                    ? `${tag.faceValue}折`
                                    : `满￥${tag.amountLimitation}减￥${tag.faceValue}`,
                    }
                })
        },
        setStoreIndex(index) {
            this.storeIndex = index
        }
    },
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/spudetail.less';

.motor-car-page {
  background: #f6f6f6;
  height: 100%;
  display: flex;
  flex-direction: column;
  .good-main-box {
    flex: 1;
    overflow-y: auto;
    .main-card-wrapper {
      padding: 0 12px;
    }
  }
  .footer-box {
    width: 100%;
    height: 48px;
    background: #fff;
    padding: 4px 12px;
  }

  .top-header {
    width: 100%;
    position: fixed;
    top: 0;
    min-height: 44px;
    z-index: 22;
    .top-back-btn {
      padding: 6px 12px 0;
    }
    .headerbox-tab {
      padding-bottom: 6px;
    }

    .search-left {
      margin-right: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid rgba(151, 151, 151, 0.2);
      background: rgba(255, 255, 255, 0.9);

      .backimg {
        display: block;
        background: url('~@/assets/img/goodsDetail/left_arrow.png') no-repeat center center;
        background-size: 100%;
        width: 16px;
        height: 16px;
      }
    }
  }
  .goods-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto 10px;
    img {
      width: 19px;
      height: 5px;
    }
    span {
      font-size: 16px;
      font-family: AlternateBold;
      font-weight: 600;
      color: #191919;
      line-height: 22px;
      margin: 0 3px;
    }
  }

  .recommon-list {
    background-color: #f5f5f5;
    padding: 0 0.48rem;

    /deep/ .guess-warp .guess-title {
      font-family: PingFangSC-Medium, PingFang SC;
      text-align: center;
      font-weight: bold;
      font-size: 0.56rem;
    }
  }
}
.empty-page {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 4.56rem;
  position: relative;

  &-header {
    position: absolute;
    left: 0;
    top: 0;
    height: 1.76rem;
    padding-left: 0.4rem;
    display: flex;
    align-items: center;

    i {
      border-radius: 50%;
      display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      background: url('~@/assets/img/back@2x.png') no-repeat center center;
      background-size: 100%;
    }
  }

  &-img {
    width: 3.6rem;
    height: 3.6rem;
  }

  &-text {
    font-size: 0.56rem;
    color: #999;
    line-height: 0.8rem;
    margin: 0.24rem 0 0.6rem;
  }

  &-btn {
    width: 3.6rem;
    height: 1.2rem;
    border-radius: 0.8rem;
    border: 1px solid #666;
    color: #000;
    font-size: 0.56rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
