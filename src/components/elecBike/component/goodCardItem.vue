<template>
    <div class="good-card-item" @click="goDetails">
        <!-- 商品地址信息 -->
        <div class="good-detail-address">
            <div class="store-adress">
                <div class="store-adress-shop flex" @click.stop="openMoreStore">
                    <span class="store-adress-title">{{ item.enterpriseAgencyAddressVo.orgName }}</span>
                    <span class="store-adress-store flex">
                        更多门店
                        <img :src="`${this.$oss}/electric-vehicle/arrow.png`" alt="" />
                    </span>
                </div>
                <div class="flex">                     
                    <div class="store-adress-position">
                        <div class="store-adress-name">
                            <img :src="`${this.$oss}/electric-vehicle/shop.png`" alt="">
                            <span>{{ item.enterpriseAgencyAddressVo.address }}</span>
                        </div>
                        <div class="store-adress-distance" v-if="item.enterpriseAgencyAddressVo.distance">
                            <img :src="`${this.$oss}/electric-vehicle/coordinate.png`" alt="">
                            <span>约{{ item.enterpriseAgencyAddressVo.distance | filterDistance }}</span>
                        </div>
                    </div>
                    <img class="store-adress-icon" :src="`${this.$oss}/electric-vehicle/navigation.png`" @click.stop="openMap(item.enterpriseAgencyAddressVo)" />                   
                </div>
            </div>  
        </div>
        <!-- 商品图片 -->
        <div class="img-list-wrapper">
            <!-- 多张轮播 -->
            <van-swipe class="my-swipe" @change="onChange" loop style="height:327px;" :autoplay="3000"  v-if='imageUrl'>
                <van-swipe-item v-for="(item, index) in imageUrl" :key="index">
                    <img :src="item" alt="" class="my-swipe-img" />
                </van-swipe-item>
            </van-swipe>
            <!-- 单张显示 -->
            <div v-else class="img-box">
                <img :src="item.url" alt="">
            </div>
        </div>
        <!-- 商品介绍 -->
        <div class="good-detail-box">
            <div class="name">{{ item.motorcycleTypeName }}</div>
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
import PriceBox from './priceBox.vue'
import NavigationCard from './navigationCard.vue';
import { getToken } from '@/utils/token'
import CallCard from './callCard.vue';
import StoreItem from './store-item.vue'
import { queryNearbyStores } from '@/api/motorCar.js'

export default {
    props: {
        item: {
            type: Object,
            default: () => { }
        },
		
    },
    inject: {
        setStoreIndex: {
            default: () => { }
        }
    },
    components: {
        PriceBox,
		NavigationCard,
		CallCard,
		StoreItem
    },
    data() {
        return {
            current: 0,
			showAll: false,
			storeList: [],
            choosedItem: {},
			longitude: '',
			latitude: '',
            imageUrl: [],
            isDownLoading: true,  //  否处于加载状态
            isUpLoading: true, //  否处于加载状态
            upFinished: false,
            success: '刷新成功',
            params: {
                currentPageNum: 1,
                pageSize: 10  
            },
            storeIndex: 0,
            saveIndex: 0
        }
    },
	mounted(){
        this.imageUrl = this.item.imageUrls ? this.item.imageUrls : []
	},
	watch: {
		// storeIndex(val) {
        //     if (this.storeList.length) {
        //         this.choosedItem = this.storeList[val]             
        //     }
        // },
	},
    methods: {
        //下拉加载
        onLoadList() {           
            this.params.currentPageNum++           
            this.getNearStore()
        },
		getNearStore() {
            let adreeInfo = JSON.parse(sessionStorage.getItem('motorPotionParams'))
            console.log(adreeInfo, 'wdwzccc');
            queryNearbyStores({
                // cityCode: 420100,
                // longitude: this.longitude || 114.40852,
                // latitude: this.latitude || 30.476683,   
                ...adreeInfo, 
                ...this.params                                       
            }).then(res => {
                this.isDownLoading = false
                let data = res.data || []
                data = data.map((item, index) => {
                    return {
                        ...item,
                        checked: this.storeIndex == index
                    }
                }) || []
               
                if (data.length == 0) {
                    // 数据全部加载完成
                    this.upFinished = true                    
                } else {                           
                    this.storeList = this.storeList.concat(data)                           
                }
                this.isUpLoading = false                             
            }).catch(err => {
                this.isUpLoading = false  
                console.log(err)             
            })
        },
		//选择提车门店
        chooseStore(item, index) {           
            this.choosedItem = item
            this.$listeners['setData'] && this.$emit('setData', this.choosedItem, 'choosedItem')
            this.showAll = false
            this.saveIndex = index || 0
            // this.setStoreIndex(index)
        },
		openMoreStore() {           
            this.showAll = true
            this.getNearStore()
        },
		goDetails(){
			this.$emit('goDetails')
		},
		goToMore(){
			this.$router.push({
                path: '/elecBike/morestore'               
            })
		},
		openCallCard(item) {           
            if (getToken()) {
                this.$refs.callCard.showCallCard = true
                this.$refs.callCard.item = item

            } else {
                this.$router.push('/login?url=' + location.pathname + location.search)
            }
        },
		openMap(ele) {   
            console.log(ele,'itemitemitemitem');        
            if (this.$store.state.userSource == 3) {
                this.$refs.navigationCard.show = true
                this.$refs.navigationCard.item = ele
            } else {                
                if (window.ws) {
                    // android环境
                    window.ws.openMapNavi(ele.address, ele.latitude, ele.longitude);
                } else if (window.webkit) {
                    // ios环境
                    const params = {
                        endAddr: ele.address,
                        endLat: ele.latitude+'',
                        endLon: ele.longitude+''
                    }
                    console.log(params)
                    window.webkit.messageHandlers.openMapNavi.postMessage(params);
                }
            }
        },
        onChange(index) {
            this.current = index
        },
        toBuy(item) {
            this.$router.push({
                path: '/motorCar/detail',
                query: {
                    skuId: item.skuId
                }
            })
        }
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
.flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.good-card-item {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 8px;
  /deep/ .van-swipe__indicator{
    opacity: 0.09;
    background-color: #191919;
  }
  /deep/ .van-swipe__indicator--active{
    background: #191919;
    opacity: 0.3;
  } 
  .my-swipe{
    border-radius: 12px;
  }
  .my-swipe-img{
    width:100%;
    height:327px;
    border-radius: 12px;
   
  }
  .img-list-wrapper {
    width: 100%;
    height: 327px;
    position: relative;
    padding: 0 12px;
    .img-box {
      width: 100%;
      height: 100%;
      > img {
        border-radius: 12px;
        width: 100%;
        height: 100%;
      }
    }

    .custom-indicator {
      position: absolute;
      width: 33px;
      height: 20px;
      right: 12px;
      bottom: 12px;
      text-align: center;
      background: rgba(25, 25, 25, 0.8);
      border-radius: 12px;
      span {
        display: block;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        color: #fff;
        margin-top: 4px;
      }
    }
  }

}
.good-detail-box {
    padding: 8px 12px 12px;
    .name{
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #111111;
        line-height: 20px;
    }
}
.good-detail-address{
    padding: 12px;
    background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/electric-vehicle/background.png');
    background-size: 100% 100%;
}
.store-adress {
    &-shop{
        padding-bottom: 10px;
    }
    &-title {
        display: flex;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #191919;
        line-height: 22px;
    }
    &-store{
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
        img{
            width: 16px;
            height: 16px;
        }
    }
    &-position{
        overflow: hidden;
    }
    &-distance, &-name {
        display: flex;
        align-items: center;
        span{
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 251px;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
        }
        img{
        width: 12px;
        height: 12px;
        margin-right: 4px;
        }
    }
    &-distance{
        margin-top: 4px;
    }
    &-icon {
        width: 32px;
        height: 32px;
        margin-right: 16px;
    }
}
// 门店弹窗
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
    border-radius: 12px 12px 0 0;
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


