<template>
    <div class="store-item" :class="{'choose-item': saveIndex == selectIndex}">        
        <div class="store-detail">
            <div class="store-img">
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-default.png" alt="">
            </div>
            <div class="detail-right">
                <div class="store-name">{{ storeItem.orgName }}</div>
                <div class="store-address">
                    <span class="distance" v-if="storeItem.distance">约{{ storeItem.distance  | filterDistance}}</span>
                    <span class="detail-address">{{ storeItem.address }}</span>
                </div>
            </div>
        </div>
        <div class="store-helper">          
            <div class="helper-item" @click.stop="openMap" v-if="storeItem.longitude && storeItem.latitude">
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/navigation.png" alt="">
                <span>导航</span>
            </div>
            <!-- <div class="helper-item" @click.stop="openCallCard">
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/phone-icon.png" alt="">
                <span>电话联系</span>
            </div> -->
        </div>
        <img class="checked-icon" v-if="saveIndex == selectIndex" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-checked.png" alt="">
    </div>
</template>

<script>

export default {
    props:{
        storeItem: {
            type: Object,
            default: ()=>{}
        },
        selectIndex: {
            type: [String, Number],
            default: ''
        },
        saveIndex: {
            type: [String, Number],
            default: ''
        }
    },
    
    components:{
        
    },
    data(){
        return {
        //    saveIndex: 0
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
    methods:{
        openMap(){
            this.$emit('openMap', this.storeItem)
        },
        openCallCard() {
            this.$emit('openCallCard', this.storeItem)
        }
    }
}
</script>

<style lang="less" scoped>
.store-item {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 10px;
    padding: 16px 16px 12px;
    position: relative;
    border: 1px solid transparent;
    &.choose-item {
        border: 1px solid #FF0A35 !important;
    }
    .store-detail {
        display: flex;
        align-items: center;
        padding-bottom: 12px;
        overflow: hidden;
        position: relative;
        &::after {
            content: '';
            width: 100%;
            height: 1px;
            position: absolute;
            left: 0;
            bottom: 0;
            background: #EAEAEA;
            opacity: 0.6;
        }
        .store-img {
            width: 60px;
            height: 60px;
            margin-right: 8px;
            >img {
                width: 100%;
            }
        }
        .detail-right {
            flex: 1;
            overflow: hidden;
            .store-name {
                color: #191919;
                font-size: 16px;
                line-height: 20px;
                width: 100%;
                font-weight: bold;
                overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
            }
            .store-address {
                font-size: 13px;
                color: #999;
                display: flex;
                .distance {
                    margin-right: 9px;
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        width: 1px;
                        height: 12px;
                        background: #c3c3c3;
                        right: -5px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .detail-address {
                    flex: 1;
                    font-weight: bold;
                    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
                }
            }
        }
    }
    .store-helper {
        padding-top: 12px;
        display: flex;
        justify-content: space-around;
        position: relative;
        .helper-item {
            // flex: 1;
            display: flex;           
            align-items: center;
            margin: 0 12px;
            >img {
                width: 20px;
                height: 20px;
                margin-right: 4px;
            }
            >span {
                color: #646A72;
                font-size: 12px;
            }
        }
        &::after {
            content: '';
            position: absolute;
            width: 1px;
            height: 16px;
            background: #EAEAEA;
            left: 50%;
            top: 13px;
            transform: translateX(-50%);
            opacity: 0.6;
        }
    }
    .checked-icon {
        position: absolute;
        top: -1px;
        right: -1px;
        width: 16px;
        height: 16px;
    }
}
</style>