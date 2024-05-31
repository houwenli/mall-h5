<template>
    <div class="morestore-detail">
        <div v-for="(item, index) in storeList" :key="index"  class="more-store-contaier-item">
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

       
        <div  class="elec-bikebox-box">
            <div class="elec-bikebox-box-item" v-for="(item, index) in elecBikeList" :key="index">
                <div class="elec-bikebox-box-item-img">
                    <img :src="item.src" alt="">
                </div>
                <span class="elec-bikebox-box-item-name">
                    {{ item.name }}
                </span>
                <div class="elec-bikebox-box-item-price">
                    <span>¥</span>
                    <span>
                        {{ item.price }}
                    </span>
                </div>
            </div>
        </div>

       
        <NavigationCard ref="navigationCard"></NavigationCard>
		<CallCard ref='callCard'></CallCard>
    </div>
</template>

<script>
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
            storeList: [],
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
                
            ],
            elecBikeList: [
                {
                    src: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_nav.png',
                    name: 'xxx智能电动车',
                    price: '999'
                },
                {
                    src: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_nav.png',
                    name: 'xxx智能电动车',
                    price: '999'
                },
                {
                    src: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_nav.png',
                    name: 'xxx智能电动车',
                    price: '999'
                }
            ]
            
        }
    },
 
    created() {
        this.storeList = [JSON.parse(this.$route.query.item)]
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
.morestore-detail{
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
    .elec-bikebox-box{
        display: flex;           
        flex-wrap: wrap;  
        width: 100%;
        margin-top: 8px;
      
       .elec-bikebox-box-item{                     
            width: ~"calc(50% - 5px)";
            height: 191px;
            background: #FFFFFF;
            border-radius: 4px;        
            padding: 8px; 
            &-img{
                width: 100%;
                height: 100px;
                background: #D8D8D8;
                border-radius: 8px;
            }
            &-name{
                display: block;
                font-size: 15px;
                font-family: PingFangTC-Medium, PingFangTC;
                font-weight: 500;
                color: #333333;
                line-height: 19px;
                margin-top: 12px;
            }
            &-price{
                margin-top: 12px;
                span:first-child{
                    font-size: 13px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #F26229;
                    line-height: 18px;
                }
                span:last-child{
                    font-size: 24px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #F26229;
                    line-height: 24px;
                }
            }
        }
        .elec-bikebox-box-item:nth-child(odd){
            margin-right: 10px;
            margin-bottom: 8px;
        }        
    }
}

</style>

