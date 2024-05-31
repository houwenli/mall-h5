<template>
    <div class="stores-card" >
        <div @click="openAllStore">       
            <div class="stores-card-wrapper">
                <div class="stores-first-line">
                    <span class="store-title">自提门店</span>
                    <div class="stores-more"  v-if="haveNear">
                        <span>附近门店</span>
                        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
                    </div>
                </div>

                <div class="stores-second-line">

                    <div class="store-address">
                        <div class="basic-address">
                            {{choosedItem && choosedItem.orgName}}
                            <span class="nearist" v-if="storeMin && saveIndex==0">最近</span>
                        </div>
                        <div class="distance" v-if="storeMin">
                            <span v-if="choosedItem.distance">约{{choosedItem.distance | filterDistance}}</span>
                            <img v-if='haveChoose' @click.native="openAllStore" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
                        </div>
                    </div>
                    <div class="detail-address">{{choosedItem.address}}</div>
                    <div v-if="haveTime" class="detail-address">营业时间：{{choosedItem.openStartTime?(choosedItem.openStartTime + '-' + choosedItem.openEndTime) :"09:00-23:30"}}</div>
                    <img class="right-bg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-item-bg.png" alt="">

                </div>

                <div v-if='haveNavigation' class="navigation-box">
                    <div class="helper-item" @click="openMap(storeInfo)">
                        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/navigation.png" alt="">
                        <span>导航到店</span>
                    </div>
                    <div class="helper-item" @click="openCallCard(storeInfo)">
                        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/phone-icon.png" alt="">
                        <span>联系门店</span>
                    </div>
                </div>
            </div>
        </div>
        <van-popup get-container="body" class="store-popup" v-model="showAll" round position="bottom">
            <div class="store-popup-title">选择提车门店<img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="showAll=false"></div>
            <div class="store-box">
                <van-pull-refresh v-model="isDownLoading" disabled :success-text="success">                    
                    <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" finished-text="更多门店正在筹备中，敬请期待"  @load="onLoadList"> 
                        <store-item @openMap='openMap' @openCallCard='openCallCard' v-for="(item, index) in storeList" :key='index' :storeItem="item"
                         @click.native="chooseStore(item, index)" :selectIndex="index" :saveIndex="saveIndex"></store-item>
                    </van-list>
                </van-pull-refresh>
                <!-- <p class="more-tip">更多门店正在筹备中，敬请期待</p> -->
            </div>
        </van-popup>
        <navigation-card ref="navigationCard"></navigation-card>

        <call-card ref='callCard'></call-card>
    </div>
</template>
<script>
import NavigationCard from './navigationCard.vue';
import StoreItem from './store-item.vue'
import CallCard from './callCard.vue';
import { getToken } from '@/utils/token'

import { queryNearbyStores } from '@/api/motorCar.js'
// let adreeInfo = JSON.parse(sessionStorage.getItem('motorPotionParams'))
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        },
        haveNavigation: {
            type: Boolean,
            default: false
        },
        haveTime: {
            type: Boolean,
            default: false
        },
        haveNear: {
            type: Boolean,
            default: false
        },
        //展示最近和距离
        storeMin: { 
            type: Boolean,
            default: true
        },
        haveDisTance: {
            type: Boolean,
            default: false
        },
        haveChoose: {
            type: Boolean,
            default: false
        },
        // storeIndex: {
        //     type: Number,
        //     default: 0
        // },
        storeInfo: {
            type: Object,
            default: () => { }
        },
        miniAdressInfo: {
            type: Object,
            default: ()=>{}
        }
    },
    inject: {
        setStoreIndex: {
            default: () => { }
        }
    },
    components: {
        StoreItem,
        NavigationCard,
        CallCard
    },
    filters: {
        filterDistance(val) {
            if (val) {
                if (val > 1000) {
                    return (val / 1000).toFixed(1) + 'km'
                } else {
                    val = String(val)
                    let index = val.indexOf('.')
                    if (index > -1) {
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
    watch: {      
        miniAdressInfo: {
            deep: true,
            immediate: true,
            handler(val){
                console.log(val,'wdddddddda');
                this.adreeInfo = val
            }
        }
    },
    created(){       
        this.getChoose()
    },
    data() {
        return {
            showAll: false,
            storeList: [],
            choosedItem: {},
            isDownLoading: true,  //  否处于加载状态
            isUpLoading: true, //  否处于加载状态
            upFinished: false,
            success: '刷新成功',
            params: {
                currentPageNum: 1,
                pageSize: 10  
            },            
            storeIndex: 0,
            saveIndex: 0,
            adreeInfo: {}
        }
    },
    methods: {
        //下拉加载
        onLoadList() { 
            console.log('调用了--==========================',this.params.currentPageNum); 
                          
            this.getNearStore()
        },
        getChoose() {  
            console.log('dddddddddddddddddddddddddddddddddddddd');
            queryNearbyStores({               
                ...this.adreeInfo,   
                ...this.params,                                                 
            }).then(res => {              
                let data = res.data || []               
                this.choosedItem = data[0] || {}                                          
            }).catch(err => {              
                console.log(err)             
            })
        },
		getNearStore() {          
            queryNearbyStores({                   
                ...this.adreeInfo,   
                ...this.params,                                                 
            }).then(res => {
                this.isDownLoading = false
                let data = res.data || []  
                console.log(data,'wwwwwwwwwww');                                                
                if (data.length == 0) {
                    // 数据全部加载完成
                    this.upFinished = true                    
                } else {   
                    this.params.currentPageNum++ 
                    this.storeList = this.storeList.concat(data)                         
                }                                                                          
                this.isUpLoading = false                                           
            }).catch(err => {
                this.isUpLoading = false  
                console.log(err)             
            })
        },
        openAllStore() {
            this.showAll = true          
            this.getNearStore()
        },
        //选择提车门店
        chooseStore(item, index) {           
            this.choosedItem = item
            this.$listeners['setData'] && this.$emit('setData', this.choosedItem, 'choosedItem')
            this.showAll = false
            // sessionStorage.setItem('elec-select-index',index)
            this.saveIndex = index || 0
            // this.setStoreIndex(index)
        },
        openMap(item) {
            console.log(item,'附近门店-定位地址');
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
                        endAddr: item.address,
                        endLat: item.latitude+'',
                        endLon: item.longitude+''
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



    }
}
</script>

<style lang="less" scoped>
.stores-card {
  background: #fff;
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  .stores-card-wrapper {
    color: #999;
    font-size: 13px;
    position: sticky;
    .stores-first-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .store-title {
        color: #191919;
        font-size: 16px;
        line-height: 20px;
        font-weight: bold;
      }
      .stores-more {
        color: #c3c3c3;
        font-size: 13px;
        display: flex;
        align-items: center;
        > img {
          width: 16px;
          height: 16px;
        }
      }
    }

    .stores-second-line {
      position: relative;
      border-radius: 12px;
      padding: 10px 12px;
      &::after {
        content: '';
        position: absolute;
        width: 200%;
        height: 200%;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        border-color: #ff450c;
        border-width: 1px;
        border-style: solid;
        transform: scale(0.5, 0.5);
        border-radius: 24px;
        box-sizing: border-box;
        pointer-events: none;
      }
      .store-address {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        position: relative;
        z-index: 3;

        .basic-address {
          color: #ff450c;
          font-size: 15px;
          font-weight: bold;
          line-height: 19px;
          .nearist {
            color: #191919;
            font-size: 13px;
            margin-left: 2px;
            font-weight: normal;
          }
        }
        .distance {
          color: #ff450c;
          font-size: 13px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 5;
          > img {
            width: 16px;
            height: 16px;
          }
        }
      }
      .detail-address {
        color: #999;
        font-size: 13px;
        line-height: 17px;
        position: relative;
        z-index: 3;
      }
      .right-bg {
        position: absolute;
        height: 60px;
        right: 0;
        bottom: 0;
      }
    }
    .navigation-box {
      padding-top: 8px;
      display: flex;
      position: relative;
      .helper-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 20px;
          height: 20px;
          margin-right: 4px;
        }
        > span {
          color: #646a72;
          font-size: 12px;
        }
      }
      &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 16px;
        background: #eaeaea;
        left: 50%;
        top: 13px;
        transform: translateX(-50%);
        opacity: 0.6;
      }
    }
  }
}
.store-popup {
  // background: #F6F6F6;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  .store-popup-title {
    text-align: center;
    color: #000d1d;
    font-size: 16px;
    line-height: 22px;
    position: relative;
    padding-top: 12px;
    padding-bottom: 12px;
    background: #F6F6F6;
    // background: #fff;
    > img {
      position: absolute;
      right: 24px;
      top: 15px;
      height: 20px;
      width: 27px;
    }
  }
  .store-box {
    background: #f6f6f6;
    // border-radius: 12px 12px 0 0;
    position: relative;
    padding: 12px 16px;
    flex: 1;
    overflow-y: auto;
    .more-tip {
      margin-top: 16px;
      color: #999;
      font-size: 13px;
      text-align: center;
      line-height: 17px;
    }
  }
}
</style>