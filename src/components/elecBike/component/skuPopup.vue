<template>
    <van-sku ref="vansku" v-model="showAll" class="sku-box" :sku="sku" :hide-stock="true"
	 :goods="goods_info" reset-stepper-on-hide  :initial-sku="initialSku" :close-on-click-overlay="true" hide-selected-text
	 :disable-soldout-sku="false" get-container="body" position="bottom">
        <template #sku-header="scope">
            <div class="buy-popup-top">
                <div class="pre-attr-box">
                    <div class="pre-attr-box-title">{{ spu.motorcycleTypeName }}</div>
                </div>
            </div>
        </template>
        <template #extra-sku-group>
			<!-- <div class="van-sku-group-container extra-sku-group">
                <div class="van-sku-row van-hairline--bottom">
                    <div class="van-sku-row__title">颜色</div>
                    <span v-for="item in initialSku" :key="item.id" class="van-sku-row__item" :class="{ 'van-sku-row__item--active': item.id == carId }" @click="selectCar(item)">
                        <div class="van-sku-row__item-name">{{ item.versionName }}</div>
                    </span>
                </div>
            </div> -->
            <div class="van-sku-group-container extra-sku-group" v-if="batteryList && batteryList.length>0">
                <div class="van-sku-row van-hairline--bottom">
                    <div class="van-sku-row__title">电池类型</div>
					<div class="van-sku-row__item-box">
						<span v-for="item in batteryList" :key="item.id" class="van-sku-row__item" :class="{ 'van-sku-row__item--active': item.id == batteryId }" @click="selectBattery(item.id)">
							<div class="van-sku-row__item-name">{{ item.batteryName }}</div>
						</span>
					</div>
                </div>
            </div>
        </template>
        <template #sku-stepper>
            <!-- 自提门店 -->
            <stores-card haveDisTance haveChoose :spu="spu" :list='list' :storeIndex="storeIndex" @setData="setData" :miniAdressInfo="miniAdressInfo"></stores-card>
        </template>
		<!-- 优惠券 订单备 发票-->
        <!-- <template #sku-messages>
            <div class="other-card">
                <copun-item ref="copunItem" @setData="setData" :spu="spu"></copun-item>
                <order-note @setData="setData"></order-note>
                <invoiec-item @setData="setData"></invoiec-item>
            </div>
        </template>         -->
    </van-sku>
</template>

<script>
import StoresCard from './storesCard.vue'
import CopunItem from './copunItem.vue'
import OrderNote from './orderNote.vue'
import InvoiecItem from './invoiecItem.vue'

import PriceBox from './priceBox.vue'
import { Sku, Toast } from 'vant'
import { debounce } from '@/utils/utils'
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        },
        sku: {
            type: Object,
            default: () => { }
        },
        storeIndex: {
            type: Number,
            default: 0
        },
        skuId: {
            type: [String,Number],
            default: ''
        },
        list:{
            type: Array,
            default: ()=>[]
        },
        initialSku: {
          	type: Object,
            default: ()=>{}
        },
		s1: {
            type: String,
            default: ''
        },
		miniAdressInfo: {
            type: Object,
            default: ()=>{}
        }
    },
	data() {
        return {
            isProcess: false, // 接口是否处理中
            showAll: false,
            selectBatteryName: '', // 选择的电池类型名字
            goods_info: {},
            //门店信息
            choosedItem: {},
            //发票
            invoiceList: [],
            //备注
            storeInfos: [],
            chooseCoupon: {},
            select:{
              id: ''
            },
			carId: this.s1 || '',
            batteryId:'',//选择的电池id
        }
    },
    inject: [
        'appQueryDetail',
        'reload'
    ],
    components: {
        StoresCard,
        CopunItem,
        OrderNote,
        InvoiecItem,
        PriceBox,
        [Sku.name]: Sku,
    },
    watch: {
        sku: {
            handler(val) {
                this.goods_info = {
                    picture: val.tree[0].v[0].imgUrl
                }
            },
            deep: true,
            immediate: true
        }
    },
    created(){
      this.batteryId = this.batteryList && this.batteryList.length ? this.batteryList[0].id : ''
    },
    computed: {
        batteryList() {
          return this.spu.batteryGoodsVos && this.spu.batteryGoodsVos.filter(item=>item.status!=2) || []
        }
    },
    methods: {
		selectCar(item){
			this.carId = item.id
			this.appQueryDetail({ id: this.carId })
		},
        setData(item, name) {
            this[name] = item
        },
        selectBattery(id) {
            if (this.batteryId == id) {
                this.batteryId = ''
            } else {
                this.batteryId = id
            }
        },
        selectAttribute(val) {
            let arr = [],
                index = 0,
                selectAttributeName = ''
            for (const key in val.selectedSku) {
                if (!val.selectedSku[key]) {
                    arr.push(this.sku.tree[index].k)
                }
                index++
            }

            if (arr.length > 0) {
                return `请选择 ${arr.join(' ')}`
            }
            if (val && val.selectedSkuComb) {
                selectAttributeName = `${val.selectedSkuComb.name
                    .split('/')
                    .map(item => `“${item}”`)
                    .join('、')}`
            }

            if (this.selectBatteryName) {
                selectAttributeName = selectAttributeName + `、“${this.selectBatteryName}”`
            }
            if (this.versionId) {
                const index = this.batteryList.findIndex(item => item.versionId == this.versionId)
                selectAttributeName = selectAttributeName + `、${this.batteryList[index].batteryModel}`
            }
            return val.selectedSkuComb ? `已选${selectAttributeName}` : ''
        },
         skuSelected: debounce(async function (skuValue) {
			console.log(skuValue,'skuValueskuValue');
			if(this.carId === skuValue.skuValue.id) return
			this.carId = skuValue.skuValue.id
			await this.appQueryDetail({ id: this.carId })
			this.versionId = this.batteryList && this.batteryList.length > 0 ?this.batteryList[0].versionId : ''
			this.batteryName = skuValue.skuValue.name
        }, 500,false),
    }
}
</script>

<style lang="less" scoped>
.sku-box {
 background: #F6F6F6;
  .buy-popup-top {
    position: relative;
    padding: 16px 12px 0;
    > img {
      position: absolute;
      right: 24px;
      top: 15px;
      height: 20px;
      width: 27px;
    }
    .pre-attr-box {
      .attr {
        font-size: 13px;
        color: #999;
        margin-top: 4px;
      }

	  .pre-attr-box-title{
		width: ~"calc(100% - 36px)";
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 36px;
	  }
    }
  }

  .other-card {
    background: #fff;
    border-radius: 12px;
    padding: 10px 12px;
    margin: 10px 0 0;
  }
  /deep/ .van-popup__close-icon {
	position: absolute;
    width: 27px;
    height: 20px;
    background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png') no-repeat;
    background-size: 100%;
    &::before {
      display: none;
    }
  }
  /deep/ .van-sku-messages {
    display: none;
  }
  /deep/ .stores-card {
    margin: 10px 0 0 0;
  }

  /deep/ .van-sku-body {
    padding: 0 12px 12px 12px;
	overflow-y: scroll;
  }
  /deep/ .van-sku-group-container {
    padding: 8px 12px 0;
    background-color: #fff;
    border-radius: 12px;
    margin-top: 10px;
    &.extra-sku-group {
      margin-top: -17px;
      padding-top: 16px;
    }
    .van-sku-row {
      margin: 0;
    }
    .van-sku-row__scroller {
      margin: 0;
      .van-sku-row__row {
		// flex-wrap: wrap;
        .van-sku-row__image-item {
          width: 103px;
          height: 103px;
		  img{
			width: 100%;
			height: 100%;
		  }
        }
		.van-sku-row__image-item:nth-child(3n){
			// margin-right: 0
		}
        .van-sku-row__image-item:last-of-type {
          margin-right: 0;
        }
      }
    }
	.van-sku-row__indicator-wrapper{
		// display: none;
	}
    .van-hairline--bottom::after {
      display: none;
    }
    .van-sku-row__title {
      margin-top: 4px;
      padding-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #191919;
      line-height: 17px;
    }
    .van-sku-row__image-item-img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		img {
			object-fit: fill !important;
		}
    }
	.van-sku-row__item-box{
		display: flex;

		flex-wrap: wrap;
		.van-sku-row__item:nth-child(3n){
			margin-right: 0;
		}
	}

    .van-sku-row__item {
      color: #191919;
      padding: 6px 16px;
      border-radius: 14px;
      border: 1px solid #f6f6f6;
	  width: ~"calc((100% - 18px)/3)";
	  margin-right: 9px;
      &::before {
        background-color: #f6f6f6;
        opacity: 1;
      }
      .van-sku-row__item-name {
        padding: 0;
		word-break: keep-all;
      }
      &.van-sku-row__item--active {
        border: 1px solid transparent;
        position: relative;
        color: #ff0a35;
        &::before {
          background-color: rgba(255, 231, 235, 0.5);
        }
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
          border-radius: 28px;
          box-sizing: border-box;
          pointer-events: none;
        }
      }
    }

    .van-sku-row__row {
      padding: 0;
    }
    .van-sku-row__image-item-img-icon {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 14px;
		height: 14px;
		background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/scalse-icon.png") no-repeat;
		background-size: 100%;
		&::before {
			display: none;
		}
    }
    .van-sku-row__image-item {
      width: 103px;
      border-radius: 12px;
      margin-right: 9px;
    }
    .van-sku-row__image-item--active {
      border-color: transparent;
      position: relative;
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
          pointer-events: none;      }
    }
  }
//   .pop-bike-color{
// 	width: ~"calc(50% - 9px)";
// 	height: 104px;
// 	display: flex;

// 	border-radius: 12px;
// 	.pop-bike-color-img{
// 		display: flex;
// 		flex-direction: column;
// 		img{
// 			width: 100%;
// 			height: 100%;
// 		}
// 	}
//   }
  .sku-messages {
    margin-top: 10px;
    padding: 4px 12px;
    .van-cell--clickable {
      padding: 0;
      align-items: center;
      line-height: 36px;
      overflow: hidden;
      .van-cell__title {
        font-size: 13px;
        color: #191919;
        flex: none;
        flex-shrink: 0;
        width: 100px;

        span {
          font-weight: 600;
        }
      }
      .van-cell__value {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 13px;
        color: #6e6e6e;
      }
      .search-icon {
        width: 16px;
        height: 16px;
        img {
          height: 100%;
        }
      }
    }
    .filled .van-cell__value {
      color: #191919;
    }
  }
}

/deep/.van-sku-actions{
  display: none;
}
</style>


