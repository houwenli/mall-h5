<template>
    <div class="more-store-contaier">
        <div v-if="storeList.length > 0">
            <van-pull-refresh v-model="isDownLoading" disabled :success-text="success">                    
                <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" finished-text="我也是有底线的"  @load="onLoadList">     
                                 
                    <div v-for="(item, index) in storeList" :key="index"  @click="goDetails(item)" class="more-store-contaier-item">
                        <div class="more-store-contaier-item-adress">
                            <div class="more-store-contaier-item-adress-content">
                                <div class="store-name">{{ item.simpleName }}</div>
                                <div class="store-tag">
                                    <span v-for="(ele, index2) in introList" :key="index2">{{ ele.name }}</span>
                                </div>
                            </div>
                            <img src="" alt="">
                        </div>
                        <div class="stores-second-line">
                            <div  class="detail-address">营业时间：{{item.openStartTime?(item.openStartTime + '-' + item.openEndTime) :"09:00-23:30"}}</div>  
                            <div class="store-address">                            
                                <div class="distance">
                                    <span>约{{item.distance | filterDistance}}|{{item.address}}</span>                                                   
                                </div>
                                <div class="distance-empty">

                                </div>
                            </div>
                                                     
                        </div>

                        <div class="navigation-box">
                            <div class="helper-item" @click.stop="openMap({})">
                                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_nav.png" alt="">
                                <span>导航</span>
                            </div>
                            <div class="helper-item" @click.stop="openCallCard({})">
                                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_call.png" alt="">
                                <span>电话</span>
                            </div>
                        </div>

                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
         <div v-if="storeList.length == 0 && upFinished" class="noData">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/no_position.png" />
            <p class="noData-p" v-if='!noPosition'>暂无门店~</p>
            <p class="noData-p" v-if='noPosition'>您当前未开启位置权限，开启后为您展示您所在地的在售车型</p>
            <span v-if='noPosition && $store.state.userSource != 3' class="get-position" @click="toSetLocation">去设置</span>
        </div>
        <NavigationCard ref="navigationCard"></NavigationCard>
		<CallCard ref='callCard'></CallCard>
       
    </div>
</template>

<script>
import { nearStations } from '@/api/motorCar.js'
import { getToken } from '@/utils/token'
import NavigationCard from '../elecBike/component/navigationCard.vue';
import CallCard from '../elecBike/component/callCard.vue';
export default {
    components: {
       NavigationCard,
       CallCard
    },
    data() {
        return {
            isDownLoading: true,  //  否处于加载状态
            success: '刷新成功',
            isUpLoading: true, //  否处于加载状态
            upFinished: false,
            storeList: [],
            longitude: '',
            latitude: '',
            noPosition: false,
            introList: [
                {
                    name: '营业中'
                },
                {
                    name: '售车'
                },
                {
                    name: '换电'
                },
                
            ]
            
        }
    },
 
    created() {
        this.getList()
    },
    methods: {
        openMap(item) {
            if (this.$store.state.userSource == 3) {
                this.$refs.navigationCard.show = true
                this.$refs.navigationCard.item = item
            } else {
                
                if (window.ws) {
                    // android环境
                    window.ws.openMapNavi(item.address, item.latitude, item.longitude);
                } else if (window.webkit) {
                    // ios环境
                    const params = {
                        endAddr: item.enterpriseAgencyAddressVo.address,
                        endLat: item.enterpriseAgencyAddressVo.latitude+'',
                        endLon: item.enterpriseAgencyAddressVo.longitude+''
                    }
                    console.log(params)
                    window.webkit.messageHandlers.openMapNavi.postMessage(params);
                }
            }
        },
        openCallCard(item) {
            if (getToken()) {
                this.$refs.callCard.showCallCard = true
                this.$refs.callCard.item = item

            } else {
                this.$router.push('/login?url=' + location.pathname + location.search)
            }
        },
        goDetails(item){
            this.$router.push({
                path: '/elecBike/morestoreDetail',
                query: {
                    item: JSON.stringify(item)
                }
            })
        },
        //商品列表
        getList() {
            nearStations({
                cityCode: 440300,
                longitude: this.longitude || 114.40852,
                latitude: this.latitude || 30.476683,
                spuId: "7371",
                
            }).then(res => {              
                if (res.code == 200) {
                    let data = res.data.map((item, index) => {
                        return {
                            ...item                            
                        }
                    })
                    if (data.length == 0) {
                        // 数据全部加载完成
                        this.upFinished = true                        
                    } else {                           
                        this.storeList = this.storeList.concat(data)                           
                    }
                }
                this.isUpLoading = false                   
            })
            .catch((err) => {
                this.isUpLoading = false                  
            })
        },
        //下拉加载
        onLoadList() { 
            this.params.pageNum++          
            this.getList()
        },             
    },
    filters:{
      filterDistance(val) {
        if(val){
          if(val > 1000){
            return (val/1000).toFixed(1) + 'km'
          } else {
            val = String(val)
            let index = val.indexOf('.')
            if(index>-1){
              return val.slice(0, index) + 'm'
            } else {
              return val + 'm'
            }
          }
        } else {
          return ''
        }
      }
    },
}
</script>

<style lang="less" scoped>
.more-store-contaier{
    background: #F7F8FB;
    padding: 8px;
    height: 100%;
    .more-store-contaier-item{
        background: #FFFFFF;
        border-radius: 8px;
        padding: 16px 16px 0 16px;
        .more-store-contaier-item-adress{
            display: flex;
            justify-content: space-between;
            &-content{
                display: flex;
                flex-direction: column;
                .store-name{
                    line-height: 19px;
                    font-size: 15px;
                    font-family: PingFangTC-Medium, PingFangTC;
                    font-weight: 500;
                    color: #333333;
                }
                .store-tag{
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #093EE2;    
                    margin-top: 8px;               
                    span{
                        border-radius: 2px;
                        padding: 2px 8px;
                        background: rgba(9,62,226,0.1);
                        margin-right: 8px;
                    }
                }
            }
            img{
                width: 56px;
                height: 56px;
                background: #D8D8D8;
                border-radius: 8px;
            }
        }
        .stores-second-line {
            .detail-address {
                font-size: 13px;
                font-family: PingFangTC-Regular, PingFangTC;
                font-weight: 400;
                color: #666666;
                line-height: 17px;
            }  
            .store-address {  
                display: flex;                
                margin-top: 8px;
                .distance {
                    flex: 1;
                    font-size: 13px;
                    font-family: PingFangTC-Regular, PingFangTC;
                    font-weight: 400;
                    color: #666666;
                    line-height: 17px;                                        
                }
                .distance-empty{
                    width: 89px;
                }
            }
            
        }
        .navigation-box {
            margin-top: 12px;
            padding: 11px;
            display: flex;
            position: relative;
            border-top:  1px solid #EBEDF0;;
            .helper-item {
            
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 24px;
                > img {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
                > span {
                    color: #646a72;
                    font-size: 12px;
                }
            }
        }
    }
}

</style>

