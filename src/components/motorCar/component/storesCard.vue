<template>
    <div class="stores-card" v-if='choosedItem && choosedItem.name'>
        <div class="stores-card-wrapper">
            <div class="stores-first-line">
                <span class="store-title">自提门店</span>
                <div class="stores-more" @click="openAllStore" v-if="haveNear">
                    <span>附近门店</span>
                    <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
                </div>
            </div>

            <div class="stores-second-line">

                <div class="store-address">
                    <div class="basic-address">
                        {{choosedItem && choosedItem.name}}
                        <span class="nearist" v-if="haveNear && storeIndex==0 &&(!storeInfo||!storeInfo.name)">最近</span>
                    </div>
                    <div class="distance" v-if="haveDisTance">
                        <span>约{{choosedItem.distance | filterDistance}}</span>
                        <img v-if='haveChoose' @click="openAllStore" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
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
        <van-popup get-container="body" class="store-popup" v-model="showAll" round position="bottom">
            <div class="store-popup-title">选择提车门店<img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="showAll=false"></div>
            <div class="store-box">
                <store-item @openMap='openMap' @openCallCard='openCallCard' v-for="(item, index) in storeList" :key='index' :storeItem="item" @click.native="chooseStore(item, index)"></store-item>
                <p class="more-tip">更多门店正在筹备中，敬请期待</p>
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
        haveDisTance: {
            type: Boolean,
            default: false
        },
        haveChoose: {
            type: Boolean,
            default: false
        },
        storeIndex: {
            type: Number,
            default: 0
        },
        storeInfo: {
            type: Object,
            default: () => { }
        },
        list: {
            type: Array,
            default: () => []
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
        list: {
            handler(val) {
                this.storeList = val.map(item => item);
                this.choosedItem = this.storeList[this.storeIndex] || {}
                this.$listeners['setData'] && this.$emit('setData', this.choosedItem, 'choosedItem')
            },
            deep: true,
            immediate: true
        },
        storeIndex(val) {
            if (this.storeList.length) {
                this.choosedItem = this.storeList[val]
                this.$listeners['setData'] && this.$emit('setData', this.choosedItem, 'choosedItem')
            }
        },
        storeInfo: {
            handler(val) {
                if (val && val.name) {
                    this.choosedItem = val
                }
            },
            deep: true,
            immediate: true
        }

    },
    data() {
        return {
            showAll: false,
            storeList: [],
            choosedItem: {},
        }
    },
    methods: {
        openAllStore() {
            this.showAll = true
        },
        //选择提车门店
        chooseStore(item, index) {
            this.storeList.forEach(item => {
                item.checked = false
            })
            item.checked = true
            this.choosedItem = item
            this.$listeners['setData'] && this.$emit('setData', this.choosedItem, 'choosedItem')
            this.showAll = false
            this.setStoreIndex(index)
        },
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
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  .stores-card-wrapper {
    color: #999;
    font-size: 13px;

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