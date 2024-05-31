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
            <div class="main-card-wrapper">
                <basic-card :spu="spu" :shelvesStatus="shelvesStatus" :sellOut="sellOut"></basic-card>
                <swiper-control :newUiImgList="newUiImgList" :initialSku='initialSku'
                    :skuId="skuId" :spu='spu' :sku="sku" :list='storeList' :storeIndex="storeIndex" :miniAdressInfo="miniAdressInfo"></swiper-control>
                <!-- 自提门店 -->
                <stores-card :spu="spu" :list='storeList' :storeIndex="storeIndex" @setList='setList' :haveNear="true" :storeMin="false" :miniAdressInfo="miniAdressInfo"></stores-card>
                <div ref="detailPage" style="position: relative; top: -2.64rem"></div>
                <!-- 商品详情 -->
                <div class="goods-title">
                    <img src="@/assets/img/goodsDetail/left_quan.png" alt="">
                    <span>商品详情</span>
                    <img src="@/assets/img/goodsDetail/right_quan.png" alt="">
                </div>
                <good-intro-card :spu="spu" v-if="spu"></good-intro-card>
                <car-params-card :spu="spu" v-if="spu"></car-params-card>
            </div>

        </div>
        <!-- 底部按钮 -->
        <div class="footer-box">
            <good-footer :initialSku='initialSku' :newUiImgList='newUiImgList' :skuId="skuId" :spu='spu' :sku="sku" :list='storeList' :storeIndex="storeIndex"
                :miniAdressInfo="miniAdressInfo"></good-footer>
        </div>

        <el-amap :plugin="plugin" v-show='false'></el-amap>
    </div>
    <div v-else class="empty-page">
        <div class="empty-page-header">
            <i @click="toBack"></i>
        </div>
        <img class="empty-page-img" :src="emptyImg" mode="" />
        <div class="empty-page-text">抱歉，链接已失效〜</div>
        <!-- <div class="empty-page-btn" @click="toBack">看看其他</div> -->
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

import { queryNearbyStores } from '@/api/motorCar.js'
import emptyImg from '@/assets/img/cat_d@2x.png'


import {
    appQueryDetail,
} from '@/api/motorCar'
const { isPhone } = isMobile();
let adreeInfo = JSON.parse(sessionStorage.getItem('motorPotionParams'))
export default {
    provide() {
        return {
            appQueryDetail: this.querySpuDetail,
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
            positionFail: false,
            miniAdressInfo: {}, // 分享出去的经纬度通过链接传参
            fromSource: '',
            adreeInfo
        }
    },
    async created() {
        this.skuId = this.$route.query.id
        this.fromSource = this.$route.query.fromSource
        if(this.fromSource == 'mini'){
            this.miniAdressInfo = {
                latitude: this.$route.query.latitude,
                longitude: this.$route.query.longitude,
                cityCode: this.$route.query.cityCode,
            }
            sessionStorage.setItem('motorPotionParams', JSON.stringify({
                latitude: this.$route.query.latitude,
                longitude: this.$route.query.longitude,
                cityCode: this.$route.query.cityCode,
            }))
            console.log(this.miniAdressInfo,'dwwwwwww');
        } else {
            this.miniAdressInfo = JSON.parse(sessionStorage.getItem('motorPotionParams'))
        }
        if (sessionStorage.getItem('motorPotionParams') || this.miniAdressInfo) {
            await this.querySpuDetail({ id: this.skuId,init: true })
            try {
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
            await this.querySpuDetail({ id: this.skuId, init: true })
            this.getNearStore()
        },
        // 查询当前经纬度
        async GDinit(o) {
            if (sessionStorage.getItem('motorPotionParams')) {
                return
            }
            let that = this
            await this.querySpuDetail({ id: this.skuId,init: true })
            that.getNearStore()
        },
        getNearStore() {
            let paramsInfo =  this.fromSource == 'mini' ? this.miniAdressInfo : adreeInfo
            queryNearbyStores({
                // cityCode: 420100,
                // longitude: this.longitude || 114.40852,
                // latitude: this.latitude || 30.476683,
                ...paramsInfo,
                currentPageNum: 1,
                pageSize: 10
            }).then(res => {
                this.storeList = res.data.map((item, index) => {
                    return {
                        ...item
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
                this.$router.back()
            }
        },
        //获取详情 throttle
        async querySpuDetail(params) {
            try {
                let paramsInfo =  this.fromSource == 'mini' ? this.miniAdressInfo : adreeInfo
                const apiQueryParams ={
                    id: params.id || '',
                    // cityCode:  440300,
                    // longitude: 114.40852,
                    // latitude:  30.476683,
                    ...paramsInfo
                }
                const res = await appQueryDetail(apiQueryParams)
                this.spu = res.data
                // this.shelvesStatus = res.data.shelvesStatus
                // this.sellOut = res.data.sellOut
                this.skuId = res.data.id
                // this.sku.list = res.data.list.map(item => item)

                // 车架商品从一个车架有多个版本选择变成一个车架只有一个版本，反参去掉了原来的versionVos字段，先注释以免后面改为多个

                // this.sku.list = res.data.versionVos && res.data.versionVos.map(item => {
                //     return {
                //         ...{
                //             id: item.id, // skuValueId：规格值 id
                //             name: item.versionName, // skuValueName：规格值名称
                //             imgUrl: item.imageUrl, // 规格类目图片，只有第一个规格类目可以定义图片
                //             previewImgUrl: item.imageUrl, // 用于预览显示的规格类目图片
                //             s1: item.id, // 规格类目 k_s 为 s1 的对应规格值 id
                //             stock_num: 3,
                //         },
                //     }
                // })


                // let treeList = res.data.versionVos && res.data.versionVos.map(item => {
                //     return {
                //         ...{
                //             id: item.id, // skuValueId：规格值 id
                //             name: item.versionName, // skuValueName：规格值名称
                //             imgUrl: item.imageUrl, // 规格类目图片，只有第一个规格类目可以定义图片
                //             previewImgUrl: item.imageUrl, // 用于预览显示的规格类目图片

                //         },
                //         largeImageMode: true
                //     }
                // }) || []
                this.sku.list = [
                  {
                    id: this.skuId,
                    imgUrl: this.spu.imageUrl,
                    s1: this.skuId,
                    stock_num: 3,
                  }
                ]

                this.sku.tree =  [
                    {
                        k: '车架型号', // skuKeyName：规格类目名称
                        k_id: '1005',
                        k_s: 's1', // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                        v: [
                          {
                            imgUrl: this.spu.imageUrl,
                            id: this.skuId,
                          }
                        ],
                        largeImageMode: true, //  是否展示大图模式
                    }
                ]
                if(params.init) {
                    // this.initialSku = (this.spu.sku && this.spu.sku.initialSku) || {}
                    // this.initialSku = this.spu.versionVos || []
                    this.initialSku = {
                        s1: this.skuId,
                    }

                }
                // this.hanldeCopun() // 处理优惠券展示
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
            if (this.spu.imageUrls) {
                this.carouselPics = this.spu.imageUrls.map((image) => {
                    image = image.split('?')[0]
                    let imgUrl = image.split('/')
                    let img = imgUrl.join('/')
                    img += '?imageView2/1/w/750'
                    return { img }
                })

                if (this.spu.spuVideo) {
                    this.spuVideoPic = this.spu.imageUrls[0] || ''
                    this.carouselPics.unshift({ img: this.spuVideoPic })
                    this.videoKey = Date.now()
                }
            }
        },
        handleSkuList() {
            // let firstList = deepClone(this.sku.list)
            // let newList =firstList || []
            // if (newList && newList.length > 0) {
            //     newList = newList.filter((item) => {
            //         if (item) {
            //             return item.imgUrl && item.stock_num > 0
            //         }
            //     })
            //     this.newUiImgList = newList
            // }
            this.newUiImgList = this.spu.versionVos||[]
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
      padding: 0 12px 60px;
    }
  }
  .footer-box {
    position: relative;
    width: 100%;
    height: 48px;
    background: #fff;
    padding: 4px 12px;
    bottom: 0;
    z-index: 1;
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
