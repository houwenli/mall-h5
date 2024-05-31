<template>
    <div class="motor-car-index-page">
        <navbartop :title="'万顺电动车'" @clickBack="backLastPage"></navbartop>
        <van-pull-refresh v-model="isLoading" disabled :success-text="success">
            <div v-if='showPage'>
                <div v-if="list.length">
                    <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="我也是有底线的" @load="onLoad">
                        <good-card-item v-for="(item, index) in list" :item="item" :key="index" @click.native="goDetails(item)"></good-card-item>
                    </van-list>
                </div>
                <div v-else class="noData">
                    <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/no_position.png" />
                    <p class="noData-p" v-if='!noPosition'>您当前所在地暂未开通售卖电动车业务，敬请期待~</p>
                    <p class="noData-p" v-if='noPosition'>您当前未开启位置权限，开启后为您展示您所在地的在售车型</p>
                    <span v-if='noPosition && $store.state.userSource != 3' class="get-position" @click="toSetLocation">去设置</span>
                </div>
            </div>
            
        </van-pull-refresh>

        <el-amap :plugin="plugin"></el-amap>
    </div>
</template>

<script>
import GoodCardItem from './component/goodCardItem.vue'
import { elecSpus } from '@/api/motorCar.js'
// import { getSpuDiscountList } from '@/api/mycoupon'
import navbartop from '@/components/commons/navBartop' // 导航栏
import { appBack }  from '@/utils/utils'

export default {
    components: {
        GoodCardItem,
        navbartop
    },
    data() {
        return {
            list: [],
            success: '刷新成功',
            isLoading: true, // 是否正在加载中, 下拉刷新
            loading: true,
            finished: false,
            params: {
                pageNum: 0,
                pageSize: 10
            },
            defUrl: require('@/assets/img/shop_default.png'),
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
            longitude: '',
            latitude: '',
            cityCode: '',
            noPosition: false,
            showPage: false
        }
    },
    inject:['reload'],
    created() {
        document.addEventListener("visibilitychange", ()=> {
            this.reload()
        });
    },
    methods: {
        backLastPage() {
            appBack(this)  
        },
        goDetails(item) {
            this.$router.push({
                path: '/motorCar/detail',
                query: {
                    skuId: item.skuId
                }
            })
         },
         toSetLocation() {
            if (window.ws) {
            // android环境
                window.ws.openLocationAuthority();
            } else if (window.webkit) {
            // ios环境
                window.webkit.messageHandlers.openLocationAuthority.postMessage('');
            }
         },
        //下拉加载
        async onLoad() {
            this.getList()
        },
        //商品列表
        getList() {
            elecSpus({
                ...this.params, cityCode: this.cityCode || 420100,
                longitude: this.longitude || 114.40852,
                latitude: this.latitude || 30.476683,
                sourceType: 3
            })
                .then((res) => {
                    if (res.code == 200) {
                        let data = res.data.list.map(item => {
                            return {
                                ...item,
                                oldPrice: item.price
                            }
                        }) || []
                        if (data.length == 0) {
                            // 数据全部加载完成
                            this.finished = true
                            this.params.pageNum -= 1

                        } else {
                            this.params.pageNum += 1
                            this.list = this.list.concat(data)
                            this.handleCouponList(data)
                        }
                    }
                    this.loading = false
                    this.showPage = true
                })
                .catch((err) => {
                    this.loading = false
                    this.showPage = true
                })
        },
        // 查询当前经纬度
        GDinit(o) {
            if(sessionStorage.getItem('motorPotionParams')) {
                let motorPotionParams = JSON.parse(sessionStorage.getItem('motorPotionParams')) || {}
                this.longitude = motorPotionParams.longitude
                this.latitude = motorPotionParams.latitude
                this.cityCode = motorPotionParams.cityCode
                this.getList()
                return 
            }
            let that = this
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
                    this.noPosition = false
                    //获取定位地址填入默认送货地址
                    this.getList()
                } else {
                    // this.getList()
                    this.$toast('定位失败,请刷新后重试')
                    this.noPosition = true
                    this.loading = false
                    this.showPage = true
                }
            })

        },
        async handleCouponList(list) {
            // try {
            //     const getPopupParam = list.map(ele => {
            //         return {
            //             skuId: ele.id,
            //             beforeCouponPrice: ele.price,
            //             spuId: ele.spuId
            //         }
            //     })
            //     const res = await getSpuDiscountList(getPopupParam) || {}
            //     if (res.data) {
            //         this.list = this.list.map(item => {
            //             let afterCouponPrice = '', couponLabelList = item.couponLabelList || []
            //             res.data.forEach(ele => {
            //                 if (item.id == ele.skuId) {
            //                     afterCouponPrice = ele.afterCouponPrice
            //                     couponLabelList = ele.couponLabelList
            //                 }
            //             })
            //             couponLabelList = couponLabelList.map(tag => {
            //                 return {
            //                     ...tag,
            //                     text: tag.couponsType == 3 ? `立减￥${tag.faceValue}` : tag.couponsType == 2 ? `${tag.faceValue}折` : `满￥${tag.amountLimitation}减￥${tag.faceValue}`
            //                 }
            //             })
            //             return {
            //                 ...item,
            //                 afterCouponPrice,
            //                 couponLabelList
            //             }
            //         })
            //     }
            // } catch (error) {
            //     console.log(error)
            // }
        },
    }
}
</script>

<style lang="less" scoped>
.motor-car-index-page {
  background: #f6f6f6;
  min-height: 100vh;
  padding: 12px;
  /deep/.navbarbox .topbox {
    left: 0;
  }
  .noData {
    padding-top: 140px;
    > img {
      width: 160px;
      height: 160px;
      margin-bottom: 8px;
      margin: auto;
      display: block;
    }
    .noData-p {
      color: #444;
      font-size: 13px;
      line-height: 17px;
      text-align: center;
      padding: 0 68px;
    }
    .get-position {
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 20px;
      height: 36px;
      width: 96px;
      color: #ffffff;
      font-size: 16px;
      line-height: 20px;
      display: block;
      margin: 10px auto 0;
      padding: 8px 0;
      text-align: center;
    }
  }
}
</style>

