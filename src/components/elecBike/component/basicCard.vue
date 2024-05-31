<template>
    <div class="basic-card">
        <div class="price-item">
            <!-- <div class="left-price-wraaper">
                <price-box :spu="spu" v-if="shelvesStatus == '1'"></price-box>
                <span class="no-price" v-else>暂无报价</span>
            </div> -->
        </div>
        <div class="product-title">
            {{ spu.motorcycleTypeName }}
            <img v-if="sellOut === 1 " class="soldout" src="@/assets/img/cat_soldout@2x.png" alt="" />
        </div>
        <div class="attr-box">
            <div class="attr-item" v-for="(item,index) in getAttrList" :class="{'first-line': index<3 && getAttrList.length>3}" :key='index'>
                <span class="label">{{ item.attributeName }}</span>
                <span class="value">{{ item.attributeValue }}</span>
            </div>
            <div class="more" v-if="getAllAttrList.length>5">
                <div class="more-wrapper" @click="openAllBasic()">
                    <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_more_icon.png" alt="">
                    <span>更多参数</span>
                </div>
            </div>
        </div>
        <van-popup get-container="body" class="basic-popup" v-model="showAll" round position="bottom">
            <div class="basic-popup-title">车型参数 <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="showAll=false"></div>
            <div class="basic-popup-content">
                <div class="basic-popup-table">
                    <table class="table-border" width="100%">
                        <tbody>
                            <tr v-for="(attribute, index) in getAllAttrList" :key="index">
                                <td>
                                    <span>
                                        {{ attribute.attributeName }}
                                    </span>
                                </td>
                                <td>
                                    <span>{{ attribute.attributeValue }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </van-popup>
    </div>
</template>

<script>
import PriceBox from './priceBox.vue'
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        },
        shelvesStatus: {
            type: String,
            default: ''
        },
        sellOut: {
            type: Number,
            default: 0
        }
    },
    components:{
      PriceBox
    },	
    computed: {
		attrList(){
			return [
				{
					attributeName: '使用推荐',
					attributeValue: this.spu.recommendUse
				},
				{
					attributeName: '最高时速',
					attributeValue: this.spu.maxSpeed
				},
				{
					attributeName: '整车重量',
					attributeValue: this.spu.vehicleWeight
				},
				{
					attributeName: '整车尺寸',
					attributeValue: this.spu.vehicleSize
				},
				{
					attributeName: '电机',
					attributeValue: this.spu.electricalMachinery
				},
				{
					attributeName: '定位',
					attributeValue: this.spu.gps
				},
				{
					attributeName: '开锁方式',
					attributeValue: this.spu.unlockMethod
				},
				{
					attributeName: '电池名称',
					attributeValue: this.spu.batteryName
				},
        {
					attributeName: '电池容量',
					attributeValue: this.spu.batteryCapacity
				},
				{
					attributeName: '理论续航',
					attributeValue: this.spu.theoreticalRange
				}
			]
		},
        getAttrList() {          
            return this.attrList.slice(0, 5) || []
        },
        getAllAttrList() {
          	return this.attrList || []
        }
    },
    data() {
        return {
            favoriteText: '收藏',
            showAll: false			
        }
    },

    methods: {
        openAllBasic() {
            this.showAll = true
        }
    }
}
</script>

<style lang="less" scoped>
.basic-card {
  background: #fff;
  margin-top: 10px;
  padding: 14px 12px;
  border-radius: 12px;
  .price-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-price-wraaper {
      display: flex;
      align-items: flex-end;
    }

  }
  .product-title {
    padding-right: 0;
    overflow: visible;
    position: relative;
    font-size: 16px;
    color: #111111;
    line-height: 22px;
    margin-top: 8px;
    font-weight: bold;
    .soldout {
      position: absolute;
      right: -0.32rem;
      top: -0.4rem;
      width: 2.8rem;
      height: 2.8rem;
    }
  }
  .small-title {
    font-size: 13px;
    line-height: 17px;
    color: #E3903F;
    margin-top: 6px;
  }
  .attr-box {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
  
    & > div {
      text-align: left;
    }
    .attr-item {
      display: flex;
      flex-direction: column;
      width: ~"calc((100% - 24px)/3)";
      margin-right: 12px;
      .label {
        color: #c3c3c3;
        font-size: 13px;
        margin-bottom: 8px;
        word-break: break-all;
      }
      .value {
        color: #191919;
        font-size: 13px;
        word-break: break-all;
      }
      &.first-line {
        margin-bottom: 12px;
      }
    }
    .attr-item:nth-child(3n){
      margin-right: 0;
    }
    .more {
      margin-top: 4px;
      .more-wrapper {
        background: #f2f2f2;
        color: #444;
        font-size: 13px;
        padding: 4px 12px;
        display: flex;
        align-items: center;
        height: 26px;
        border-radius: 13px;
        span {
          line-height: 17px;
        }
      }
      img {
        width: 16px;
        margin-right: 2px;
      }
    }
  }
  
}
.basic-popup {
    padding: 12px 24px 24px;
    max-height: 80vh;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    .basic-popup-content {
      flex: 1;
      overflow-y: auto;
    }
    .basic-popup-title {
      text-align: center;
      color: #000d1d;
      font-size: 16px;
      line-height: 22px;
      position: relative;
      margin-bottom: 24px;
      > img {
        position: absolute;
        right: 0;
        top: 0;
        height: 20px;
        width: 27px;
      }
    }
    
  }
</style>