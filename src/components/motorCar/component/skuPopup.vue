<template>
    <van-sku ref="vansku" v-model="showAll" class="sku-box" :sku="sku" :hide-stock="true" :goods="goods_info" reset-stepper-on-hide :initial-sku="initialSku" :close-on-click-overlay="true" hide-selected-text @sku-selected="skuSelected">
        <template #sku-header="scope">
            <div class="buy-popup-top">
                <div class="pre-attr-box">
                    <price-box :spu="spu"></price-box>
                    <!-- 已选属性 -->
                    <div class="attr">{{ selectAttribute(scope) }}</div>
                </div>
            </div>
        </template>
        <template #extra-sku-group>
            <div class="van-sku-group-container extra-sku-group">
                <div class="van-sku-row van-hairline--bottom">
                    <div class="van-sku-row__title">电池类型</div>
                    <span v-for="item in batteryList" :key="item.batterySettingId" class="van-sku-row__item" :class="{ 'van-sku-row__item--active': item.batterySettingId == batterySettingId }" @click="selectBattery(item)">
                        <div class="van-sku-row__item-name">{{ item.batteryModel }}</div>
                    </span>
                </div>
            </div>
        </template>
        <template #sku-stepper>
            <!-- 自提门店 -->
            <stores-card haveDisTance haveChoose :spu="spu" :list='list' :storeIndex="storeIndex" @setData="setData"></stores-card>
        </template>
        <template #sku-messages>
            <div class="other-card">
                <!-- 优惠券 -->
                <copun-item ref="copunItem" @setData="setData" :spu="spu"></copun-item>
                <!-- 订单备注 -->
                <order-note @setData="setData"></order-note>
                <!-- 发票 -->
                <invoiec-item @setData="setData"></invoiec-item>
            </div>
        </template>
        <template #sku-actions="props">
            <!-- 小计明细 -->
            <buy-bottom-card :chooseCoupon='chooseCoupon' @openDetail='openDetail' :spu="spu" @pay="pay($event,props)"></buy-bottom-card>
        </template>
    </van-sku>
</template>

<script>
import StoresCard from './storesCard.vue'
import CopunItem from './copunItem.vue'
import OrderNote from './orderNote.vue'
import InvoiecItem from './invoiecItem.vue'
import BuyBottomCard from './buyBottomCard.vue'
import PriceBox from './priceBox.vue'
import { Sku, Toast } from 'vant'
import { submitOrder } from '@/api/settlement'
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
            type: String,
            default: ''
        },
        list:{
            type: Array,
            default: ()=>[]
        },
        initialSku: {
          type: Object,
          default: () => { }
        }
    },
    inject: [
        'querySpu',
        'reload'
    ],
    components: {
        StoresCard,
        CopunItem,
        OrderNote,
        InvoiecItem,
        BuyBottomCard,
        PriceBox,
        [Sku.name]: Sku,
    },
    watch: {
        sku: {
            handler(val) {
                this.goods_info = {
                    picture: val.tree && val.tree[0] && val.tree[0].v[0].imgUrl ? val.tree[0].v[0].imgUrl : (this.spu.sku && this.spu.sku.url) || ''
                }
            },
            deep: true,
            immediate: true
        }
    },
   
    computed: {
        batteryList() {
            const list = this.spu.spuBatteryVos && this.spu.spuBatteryVos.map(item=>item) || []
            if(this.spu.liveSalesType == 2 || this.spu.liveSalesType ==3) {
                list.push({
                    batteryModel: "不含电池",
                    batterySettingId: "-1",
                })
            }
           
            return list
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
            batterySettingId: '',
            chooseCoupon: {},
            select:{
              id: ''
            }
        }
    },
    methods: {
        setData(item, name) {
            this[name] = item
        },
        selectBattery(item) {
            if (this.batterySettingId == item.batterySettingId) {
                this.batterySettingId = ''
            } else {
                this.batterySettingId = item.batterySettingId
            }
            this.querySpu({ skuId: this.skuId, batterySettingId: this.batterySettingId != '-1'? this.batterySettingId:'' })
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
            if (this.batterySettingId) {
                const index = this.batteryList.findIndex(item => item.batterySettingId == this.batterySettingId)
                selectAttributeName = selectAttributeName + `、${this.batteryList[index].batteryModel}`
            }
            return val.selectedSkuComb ? `已选${selectAttributeName}` : ''
        },
        skuSelected: debounce(function (skuValue) {
            console.log(skuValue, this.skuId,this.initialSku)
            if (!skuValue.selectedSkuComb) {
              this.select= {}
              return
            }
            this.select = skuValue
            if (this.skuId == skuValue.selectedSkuComb.id) return
            let id = skuValue.selectedSkuComb.id
            this.price = parseFloat((skuValue.selectedSkuComb.price / 100).toPrecision(12))
            this.querySpu({ skuId: id, batterySettingId: this.batterySettingId != '-1'? this.batterySettingId:''})
        }, 500,false),
        openDetail() {
            this.$emit('openDetail')
        },
        commonPay(sendMoney, orderNo, appData){           
          let payParams = {
              "configRequestParams": {
                uid: appData.userId, // 用户id
                businessType: 100, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
                amount: sendMoney* 100, // 待支付金额
                platform: 1 // 客户端 1.APP 2.微信小程序 3.H5
              },  // 拉取收银台参数
              "payRequestParams": {
                orderNo, // 智慧生活业务订单号                   
                userId: appData.userId, // 用户ID
                businessType: 100, // 业务类型   
                paySceneType: 101                                                     
              }, // 收银台支付接口参数
              "showInfo": {
                amount: sendMoney* 100, // 展示金额
                businessTypeName: "电商优选", // 业务线名称
                expirationTimeStr: "" // 如果需要显示支付倒计时就传
              }
          }     
          if (window.ws) {
          window.ws.appCashierPay(
              JSON.stringify(payParams)              
          )     
          window.appCashierPayResult  = (res) => {
            res = JSON.parse(res) 
            if(res.payStatus == 'PAID'){
              sessionStorage.removeItem('wxzf_payResult') 
              this.$router.push({
                path: '/paysuccess',
                query: { payResult: res },
              })
            } else {
              Toast(res.msg)
            }
          }         
          } else if (window.webkit) {
          window.webkit.messageHandlers.appCashierPay.postMessage(payParams)            
          window.appCashierPayResult = (res) => {
            if(res.payStatus == 'PAID'){
              sessionStorage.removeItem('wxzf_payResult') 
              this.$router.push({
                path: '/paysuccess',
                query: { payResult: res },
              })
            } else {
              Toast(res.msg)
            }
          }         
          } else {
            Toast('当前版本app不支持收银台支付，请升级app后重试')
          }
        },
        //支付
        pay(money, e) {
          console.log(e)
            if (!e.selectedSkuComb || !e.selectedSkuComb.id) {
                this.$toast({
                    message: '请选择完整的商品规格！',
                    position: 'bottom',
                })
                return
            }
            if (!this.choosedItem || !this.choosedItem.idNumber) {
              return this.$toast('请选择门店')
            }
            if (!this.batterySettingId) {
                return this.$toast('请选择电池类型')
            }
            const invoiceList = this.invoiceList.map(item=>{
              return {
                ...item,
                storeId: this.spu.storeId
              }
            })
            const storeInfos = this.storeInfos.map(item=>{
              return {
                ...item,
                storeId: this.spu.storeId
              }
            })
            let param = {
                //发票
                invoiceList,
                //备注
                storeInfos,
                //商品信息
                buyNowRequestList: [
                    {
                        skuId: this.skuId,//商品ID
                        recommendToken: '',
                        num: 1,
                        sourceType: 3,
                        storeId: this.choosedItem.idNumber,//店铺ID
                        batterySettingId: this.batterySettingId != '-1'? this.batterySettingId:''// 电池id
                    },
                ],
                ids: [],
                source: 2,//来源
                orderType: '12'
            }
            if(this.$route.query.storeId) {
              param.priceType = 1
            }
            if (this.chooseCoupon.id) {
              console.log(this.chooseCoupon.id)
                param.onlineRetailerCouponIds = [this.chooseCoupon.id]
            }
            console.log('这个是入参', param);
            // 节流
            if (this.isProcess) {
                return
            }
            this.isProcess = true
            submitOrder(param)
                .then((res) => {
                    this.isProcess = false
                    if (res.code == 4105) {
                        this.$toast('商品信息发生改变，为您刷新页面！')
                        this.querySpu({ skuId: this.skuId, batterySettingId: this.batterySettingId != '-1'? this.batterySettingId:'' })
                        return
                    }
                    if (res.code == -1) {
                        this.$toast(res.msg)
                        this.reload()
                        return
                    }
                    // needPay  -1：赠品库存不足无法支付   0：需要支付 跳转到支付页面  13: 秒杀超出限制   
                    if (res.needPay == 0) {
                        this.showAll = false
                        // 跳转到支付页面                                                
                        let appData = JSON.parse(localStorage.getItem('appData'))
                        if(appData && appData.appScheme == 'wsf') {
                          this.commonPay(res.orderMoney, res.orderCode, appData)
                        } else {
                          this.$router.push({
                            path: '/zhPay',
                            query: { money: res.orderMoney, orderCode: res.orderCode, type: 1, id: this.orderId, serviceType: 100 },
                          })
                          // this.$router.push({
                          //   path: '/pay',
                          //   query: { money: res.orderMoney, orderCode: res.orderCode, type: 1, id: res.orderId },
                          // })
                        }                                             
                    } else {
                        this.showAll = false
                        // 跳转到支付成功页面
                        this.$router.push({
                            path: '/paysuccess',
                            query: { type: 1, orderCode: res.orderCode, id: res.orderId, businessType: 100 },
                        })
                    }
                })
                .catch(() => {
                    this.isProcess = false
                })
        },
    }
}
</script>

<style lang="less" scoped>
.sku-box {
  background-color: #f6f6f6;
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
    }
  }

  .other-card {
    background: #fff;
    border-radius: 12px;
    padding: 10px 12px;
    margin: 10px 0 0;
  }
  /deep/ .van-popup__close-icon {
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
        .van-sku-row__image-item {
          width: 103px;
          height: 103px;
        }
        .van-sku-row__image-item:last-of-type {
          margin-right: 0;
        }
      }
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
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      img {
        object-fit: fill !important;
      }
    }
    .van-sku-row__item {
      color: #191919;
      padding: 0 16px;
      border-radius: 14px;
      line-height: 28px;
      border: 1px solid #f6f6f6;
      &::before {
        background-color: #f6f6f6;
        opacity: 1;
      }
      .van-sku-row__item-name {
        padding: 0;
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
    .van-sku-row__image-item-name {
      padding: 0;
      height: 22px;
      font-size: 13px;
      color: #191919;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #F6F6F6;
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
          pointer-events: none;
        }
      .van-sku-row__image-item-name {
        color: #ff0a35;
        background: #FFE7EB !important;
      }
    }
  }
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
</style>


