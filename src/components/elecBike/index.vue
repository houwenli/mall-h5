<template>
    <div class="motor-car-index-page-contaier">
        <navbartop :title="'电动车'" @clickBack="backLastPage"></navbartop>
        <div class="swipe" data-desc='电动车宣传轮播图' v-if="list.length > 0">
            <van-swipe class="my-swipe" height="100%" :width="swipeWidth" :autoplay="3000" :duration="500" indicator-color="#DE3A38" :show-indicators='true' >
            <van-swipe-item v-for="(item,index) in configList" :key="item.id">
                <img v-if="item.url" @click="navigate(item,index)" :src="item.url" />
                <img v-else @click="navigate(item,index)" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/zhanwei.png" />
            </van-swipe-item>
            </van-swipe>
        </div>

        <div class="motor-car-index-page">
            <!-- <div class="hot-box">
                <div class="hot-box-title">热销推荐</div>
                <div class="columns-container" data-desc='电动车热销推荐三列图'>
                    <div class="item" v-for="(item, index) in hotList" :key="index" @click="toPage(item)" >
                        <img v-if="item.url" class="pic" :src="item.url" alt="" />
                        <img class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
                        <div>热销推荐三列图title</div>
                    </div>
                </div>
            </div> -->
            <div v-if="list.length > 0">
                <van-pull-refresh v-model="isDownLoading" disabled :success-text="success">
                    <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" finished-text="暂无更多~"  @load="onLoadList">

                        <good-card-item v-for="(item, index) in list" :item="item" :key="index" @goDetails="goDetails(item)"></good-card-item>

                    </van-list>
                </van-pull-refresh>
            </div>
            <div v-if="list.length == 0 && upFinished" class="noData">
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/no_position.png" />
                <p class="noData-p" v-if='!noPosition'>您当前所在地暂未开通售卖电动车业务，敬请期待~</p>
                <p class="noData-p" v-if='noPosition'>您当前未开启位置权限，开启后为您展示您所在地的在售车型</p>
                <span v-if='noPosition && $store.state.userSource != 3' class="get-position" @click="toSetLocation">去设置</span>
            </div>
        </div>
        <el-amap :plugin="plugin"  style="display:none"></el-amap>
    </div>
</template>

<script>
import GoodCardItem from './component/goodCardItem.vue'
import { getElecBike } from '@/api/motorCar.js'
import navbartop from '@/components/commons/navBartop' // 导航栏
import { Swipe, SwipeItem } from 'vant'
import { routerPathName } from '@/utils/utils'
import {  getLocation } from '@/utils/location'
import { appBack } from '@/utils/utils'
import { call } from '@/utils/hybrid'
import { result } from 'lodash-es'

export default {
    components: {
        GoodCardItem,
        navbartop,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
    },
    data() {
        const self = this;
        return {
            list: [],
            success: '刷新成功',
            isDownLoading: true,  //  否处于加载状态
            isUpLoading: true, //  否处于加载状态
            upFinished: false,
            params: {
                pageNum: 0,
                pageSize: 10,
                lastId: null,
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
                            self.isGetAothor = true
                            console.log(o,'ooooooooo');
                            self.GDinit(o, self) // 获取当前位置
                        },
                    },
                },
            ],
            longitude: '',
            latitude: '',
            cityCode: '',
            noPosition: false,
            showPage: false,
            swipeHeight: 0,
            swipeWidth: 0,
            configList: [
                {
                    url: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/motor_swiperA.png'
                },
                {
                    url: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/motor_swiperS.png'
                }
            ],
            hotList: [
                {
                    url: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/zhanwei.png'
                },
                {
                    url: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/zhanwei.png'
                },
                {
                    url: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/zhanwei.png'
                }
            ],
            isGetAothor: '' // 是否获取到定位权限
        }
    },
    // inject:['reload'],
    created() {
        let that = this
        this.swipeWidth = '100%'
        navigator.geolocation.getCurrentPosition(result => {
            // 这里说明开启了app定位
            setTimeout(()=>{
                if(!this.isGetAothor ){
                    this.getPositon()
                }
            },500)
        }, e=> {
            // 这里说明未开启app定位
            that.$toast('定位失败,请刷新后重试')
            that.noPosition = true
            that.loading = false
            that.showPage = true
            that.list = []
            that.upFinished = true

        })

    },
    methods: {
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
                console.log(result,status,'resultresultresultresult');
                // that.longitude = 114.40852
                // that.latitude = 30.476683
                // that.cityCode = 420100
                // const motorString = JSON.stringify({
                //     longitude: that.longitude,
                //     latitude: that.latitude,
                //     cityCode: that.cityCode
                // })
                // sessionStorage.setItem('motorPotionParams', motorString)
                // that.noPosition = false
                // that.getList()

                if (status === 'complete' && result.info === 'SUCCESS') {
                    that.isGetAothor = true
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
                    that.noPosition = false
                    //获取定位地址填入默认送货地址
                    that.getList()
                } else {
                    that.$toast('定位失败,请刷新后重试')
                    that.noPosition = true
                    that.loading = false
                    that.showPage = true
                    that.list = []
                    that.upFinished = true
                }
            })

        },
        async getPositon(){
            let that = this
            if(sessionStorage.getItem('motorPotionParams')) {
                let motorPotionParams = JSON.parse(sessionStorage.getItem('motorPotionParams')) || {}
                this.longitude = motorPotionParams.longitude
                this.latitude = motorPotionParams.latitude
                this.cityCode = motorPotionParams.cityCode
                this.getList()
                return
            }
            // that.longitude = 114.40852
            // that.latitude = 30.476683
            // that.cityCode = 420100

            // if(!(sessionStorage.getItem('motorPotionParams'))) {
            //     const motorString = JSON.stringify({
            //         longitude: that.longitude,
            //         latitude: that.latitude,
            //         cityCode: that.cityCode
            //     })
            //     sessionStorage.setItem('motorPotionParams', motorString)
            // }

            // that.noPosition = false
            // that.getList()


            getLocation(true).then(result => {
                console.log(result,'result===========================a');
                let {  areaCode, longitude, latitude } = result
                that.longitude = longitude
                that.latitude = latitude
                that.cityCode = areaCode ? areaCode.slice(0,4) + '00' : ''
                that.noPosition = false
                // 定位经纬度

                const motorString = JSON.stringify({
                    longitude: that.longitude,
                    latitude: that.latitude,
                    cityCode: that.cityCode
                })
                sessionStorage.setItem('motorPotionParams', motorString)

                if(longitude && latitude){
                    that.noPosition = false
                    that.getList()
                } else {
                    that.$toast('定位失败,请刷新后重试')
                    that.noPosition = true
                    that.loading = false
                    that.showPage = true
                    that.list = []
                    that.upFinished = true
                }
            }).catch(error=>{
                console.log(error,'error=====');
                that.$toast('定位失败,请刷新后重试')
                that.noPosition = true
                that.loading = false
                that.showPage = true
                that.list = []
                that.upFinished = true
            })


        },
        // async getPositon(){
        //     let that = this
        //     // that.longitude = 114.40852
        //     // that.latitude = 30.476683
        //     // that.cityCode = 420100

        //     // if(!(sessionStorage.getItem('motorPotionParams'))) {
        //     //     const motorString = JSON.stringify({
        //     //         longitude: that.longitude,
        //     //         latitude: that.latitude,
        //     //         cityCode: that.cityCode
        //     //     })
        //     //     sessionStorage.setItem('motorPotionParams', motorString)
        //     // }

        //     // that.noPosition = false
        //     // that.getList()

        //     //判断是啥机型
        //     if (window.ws) {
        //         getLocation(1).then(result => {
        //             console.log(result,'result===========================a');
        //             let {  areaCode, longitude, latitude } = result
        //             that.longitude = longitude
        //             that.latitude = latitude
        //             that.cityCode = areaCode ? areaCode.slice(0,4) + '00' : ''
        //             that.noPosition = false
        //             // 定位经纬度
        //             if(!(sessionStorage.getItem('motorPotionParams'))) {
        //                 const motorString = JSON.stringify({
        //                     longitude: that.longitude,
        //                     latitude: that.latitude,
        //                     cityCode: that.cityCode
        //                 })
        //                 sessionStorage.setItem('motorPotionParams', motorString)
        //             }
        //             if(longitude && latitude){
        //                 that.getList()
        //             } else {
        //                 that.list = []
        //                 that.noPosition = true
        //                 that.upFinished = true
        //             }

        //         }).catch(error=>{
        //             console.log(error,'error=====');
        //             that.noPosition = true
        //             that.list = []
        //             that.upFinished = true
        //         })
        //     } else if (window.webkit) {

        //         this.$bridge.callhandler("getLocation", {}, (result) => {
        //             console.log('原生app定位结果', result)
        //             let {  areaCode, longitude, latitude } = result
        //             that.longitude = longitude
        //             that.latitude = latitude
        //             that.cityCode = areaCode ? areaCode.slice(0,4) + '00' : ''
        //             that.noPosition = false
        //             // 定位经纬度
        //             if(!(sessionStorage.getItem('motorPotionParams'))) {
        //                 const motorString = JSON.stringify({
        //                     longitude: that.longitude,
        //                     latitude: that.latitude,
        //                     cityCode: that.cityCode
        //                 })
        //                 sessionStorage.setItem('motorPotionParams', motorString)
        //             }
        //             if(longitude && latitude){
        //                 that.getList()
        //             } else {
        //                 that.list = []
        //                 that.noPosition = true
        //                 that.upFinished = true
        //             }

        //         }).catch(error=>{
        //             that.noPosition = true
        //             that.list = []
        //             that.upFinished = true
        //             console.log('执行app定位方法失败',error);
        //         })
        //     }

        // },
        navigate(data){
            if(!data || !data.link) return
            routerPathName(data.link)
        },
        backLastPage() {
            appBack(this)
        },
        goDetails(item) {
            this.$router.push({
                path: '/elecBike/detail',
                query: {
                    id: item.id
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
        onLoadList() {
            this.params.pageNum++
            this.params.lastId = this.list[this.list.length-1].id
            this.getList()
        },
        //商品列表
        getList() {
            getElecBike({
                ...this.params,
                // longitude: 114.40852,
                // latitude: 30.476683,
                // cityCode: 420100
                longitude: this.longitude,
                latitude: this.latitude,
                cityCode: this.cityCode
            })
            .then((res) => {
                if (res.code == 200) {
                    let data = res.data || []
                    if (data.length == 0) {
                        // 数据全部加载完成
                        this.upFinished = true

                    } else {
                        this.list = this.list.concat(data)
                    }
                }
                // else {
                //     this.list = []
                //     this.noPosition = true
                //     this.upFinished = true
                // }
                this.isUpLoading = false
            })
            .catch((err) => {
                console.log(err,'errerrerrerr');
                // this.list = []
                // this.noPosition = true
                // this.upFinished = true
                this.isUpLoading = false
            })
        }

    }
}
</script>

<style lang="less" scoped>
.motor-car-index-page-contaier{
    background: #f6f6f6;
    height: 100vh;
    overflow-y: scroll;
    // min-height: 100vh;
}
.motor-car-index-page {
    padding: 0 12px 12px;
    // border-radius: 8px;
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
.swipe {
    height: 100px;
    box-sizing: border-box;
    margin: 12px 12px 8px 12px;
    .my-swipe {
        width: 100%;
        // 加上这个， 在手机上滑动屏幕到swipe只有的一点点的时候，就不会有问题
        height: 100%;
        border-radius: 8px;
        img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 8px;
        }
    }
    /deep/.van-swipe__indicator{
        width: 12px;
        height: 3px;
        background: #FFBCBB;
        border-radius: 2px;
    }
}
.columns-container {
    display: flex;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    .item {
        flex: 1;
        height: 100%;

        overflow: hidden;
        margin-right: 11px;

        &:last-child {
        margin-right: 0;
        }
        .pic {
            width: 100%;
            height: 102px;
            border: none;
            border-radius: 12px;
        }

        img[src=''] {
        opacity: 0;
        }
    }
}
.hot-box{
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 8px 12px;
    margin-bottom: 8px;
    .hot-box-title{
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 4px;
    }
}
</style>

