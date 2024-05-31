<template>
    <van-popup get-container="body" v-model="showcoupon" round close-icon="close" position="bottom" :style="{ height: '68.5%' }" class="freightwrapper" @click-overlay="closecoupon">
        <div class="coupon-container-wrapper">
            <p class="coupon-title">
                优惠
                <img src="@/assets/img/close-icon.png" alt="" @click="showcoupon = false" />
            </p>
            <div class="coupon-container" v-if="disCouponList.length || couponList.length || couponData.markingVo">
              <!-- 无优惠券有活动且不满住活动条件 -->
                <div class="after-price" v-if="(selectCouponCount>0 && couponData.markingVo) || (selectCouponCount>0 && !couponData.markingVo) || (!(selectCouponCount>0) && couponData.markingVo && (tiredPricingList || [1,2,3].includes(Number(couponData.markingVo.ruleType))) )">
                    <div class="text" v-if="haveActivity">¥{{ couponData.finalPrince }}</div>
                    <div class="text" v-else>¥{{ (beforeCouponPrice - sumSelectCouponDiscount).toFixed(2)}}</div>
                    <div class="real-price">预估到手</div>
                </div>

                <!-- 优惠看板 价格计算展示 -->
                <!-- style / class  有活动不满足活动条件且无优惠券 不展示-->
                <!-- v-if 情形一：有活动有优惠券， 情形二：无活动有优惠券，情形三：有活动无优惠券 （活动满足优惠条件） -->
                <div :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType)) && !(selectCouponCount>0)) ? 'detail-bubble-none' : 'detail-bubble'"
                  v-if="(selectCouponCount>0 && couponData.markingVo) || (selectCouponCount>0 && !couponData.markingVo) || (!(selectCouponCount>0) && couponData.markingVo && (tiredPricingList || [1,2,3].includes(Number(couponData.markingVo.ruleType))) )">
                <!-- <div class="detail-bubble" v-if="selectCouponCount>0 || couponData.markingVo"> -->
                    <div class="detail-bubble-title">当前购买可使用以下优惠</div>
                    <div class="reduce-tip" v-if="selectCouponCount>0 || couponData.markingVo">
                        <span :style="{ 'text-decoration': couponData.markingVo && [1,3].includes(Number(couponData.markingVo.ruleType)) ? 'line-through' : 'none' }" class="reduce-text">¥{{beforeCouponPrice}}</span>
                        <span :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType))) ? 'detail-bubble-none' : 'reduce-text' " v-if='haveActivity && couponData.markingVo'>
                          <span v-if="[4].includes(Number(couponData.markingVo.ruleType))">-</span>
                          <span v-if="[1,3].includes(Number(couponData.markingVo.ruleType))">→</span>
                          <span v-if="[2,5].includes(Number(couponData.markingVo.ruleType))">X</span>
                        </span>
                        <span :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType))) ? 'detail-bubble-none' : 'reduce-text' " v-if='haveActivity && couponData.markingVo'>
                          <span v-if="[1].includes(Number(couponData.markingVo.ruleType))">¥{{ couponData.markingVo.fixedPrice * couponData.num }}</span>
                          <span v-if="couponData.markingVo.ruleType == 2">{{ couponData.markingVo.fixedDiscount }}折</span>
                          <span v-if="[3].includes(Number(couponData.markingVo.ruleType))">¥{{ couponData.markingVo.fixedAmount * couponData.num }}</span>
                          <span v-if="[4].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList">¥{{ tiredPricingList.faceValue }}</span>
                          <span v-if="[5].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList">{{ tiredPricingList.faceValue }}折</span>
                        </span>

                        <template v-if="selectCouponCount>0">
                          <span class="reduce-text" v-if='haveActivity'>
                            <span v-if="[1,3].includes(Number(choosedCoupon[0].couponsType))">-</span>
                            <span v-if="[2].includes(Number(choosedCoupon[0].couponsType))">X</span>
                          </span>
                          <span class="reduce-text" v-else>-</span>
                          <span v-if='haveActivity'>
                            <span v-if="choosedCoupon[0].couponsType == 2">{{ choosedCoupon[0].faceValue }}折</span>
                            <span v-if="[1,3].includes(Number(choosedCoupon[0].couponsType))">¥{{ choosedCoupon[0].faceValue }}</span>
                          </span>
                          <span class="reduce-text" v-else>¥{{ sumSelectCouponDiscount }}</span>
                        </template>
                    </div>

                    <!-- 优惠看板 活动和券类型展示 -->
                    <div v-if="selectCouponCount>0 || couponData.markingVo" class="price-box">
                        <div class="estimate-card mr-15">
                            <div class="text">当前售价</div>
                            <div class="price">¥{{beforeCouponPrice}}</div>
                        </div>

                        <div :class="(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType))) ? 'detail-bubble-none' : 'estimate-card mr-3' " v-if="haveActivity && couponData.markingVo">
                            <div class="text" v-if="[1,3].includes(Number(couponData.markingVo.ruleType))">固定金额</div>
                            <div class="text" v-else>活动</div>
                            <div v-if="[1].includes(Number(couponData.markingVo.ruleType))" class="price">¥{{ couponData.markingVo.fixedPrice * couponData.num }}</div>
                            <div v-if="couponData.markingVo.ruleType == 2" class="price">{{ couponData.markingVo.fixedDiscount }}折</div>
                            <div v-if="[3].includes(Number(couponData.markingVo.ruleType))" class="price">¥{{ couponData.markingVo.fixedAmount * couponData.num }}</div>
                            <div v-if="[4].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList" class="price">满{{ tiredPricingList.amountLimitation }}减{{ tiredPricingList.faceValue }}</div>
                            <div v-if="[5].includes(Number(couponData.markingVo.ruleType)) && tiredPricingList" class="price">满{{ tiredPricingList.amountLimitation }}打{{ tiredPricingList.faceValue }}折</div>
                        </div>

                        <template v-if="selectCouponCount > 0">
                          <div class="estimate-card">
                              <div class="text">商品券</div>
                              <div class="price" v-if="isCheckBox">累计减{{ sumSelectCouponDiscount }}</div>
                              <template v-else>
                                  <div class="price" v-if="choosedCoupon[0].couponsType == 1">满{{choosedCoupon[0].amountLimitation}}减{{choosedCoupon[0].faceValue}}</div>
                                  <div class="price" v-if="choosedCoupon[0].couponsType == 2">{{choosedCoupon[0].faceValue}}折</div>
                                  <div class="price" v-if="choosedCoupon[0].couponsType == 3">满{{choosedCoupon[0].faceValue}}减{{choosedCoupon[0].faceValue}}</div>
                              </template>
                          </div>
                        </template>
                    </div>
                </div>

                <!-- 有活动不满足活动条件且无优惠券 不展示 -->
                <div :class="{'detail-bubble': !(couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType)) && !(selectCouponCount>0))}" v-else>
                  <div v-if="couponData.markingVo && !tiredPricingList && [4,5].includes(Number(couponData.markingVo.ruleType)) && !(selectCouponCount>0)"></div>
                  <div v-else>
                    <div class="detail-bubble-title">当前购买可使用以下优惠</div>
                    <div class="nonuse-content">不使用优惠券</div>
                  </div>
                    
                </div>

                <div class="activity-card" v-if="haveActivity && couponData.markingVo">
                  <div class="coupon-list-title">
                        <img class="ic_youhui" src="@/assets/img/ic_acitve.png" />
                        <span>活动</span>
                        <span class="gery-tip">活动仅限对当前商品生效，不可与其他商品叠加</span>
                  </div>

                  <div v-if="couponData.markingVo.ruleType == 2">
                    <div class="activity-item">
                      <span class="tag">{{ couponData.markingVo.fixedDiscount }}折</span>
                      <!-- <span class="tip-text">无门槛，打{{ couponData.markingVo.fixedDiscount }}折</span> -->
                      <span class="tip-text">满一件，打{{ couponData.markingVo.fixedDiscount }}折</span>
                    </div>
                  </div>

                  <div v-if="[1].includes(Number(couponData.markingVo.ruleType))">
                    <div class="activity-item">
                      <span class="tag">活动价</span>
                      <span class="tip-text">满一件，活动价{{ couponData.markingVo.fixedPrice }}元</span>
                    </div>
                  </div>

                  <div v-if="[3].includes(Number(couponData.markingVo.ruleType))">
                    <div class="activity-item">
                      <span class="tag">活动价</span>
                      <span class="tip-text">满一件，活动价{{ couponData.markingVo.fixedAmount }}元</span>
                    </div>
                  </div>

                  <div v-if="couponData.markingVo.ruleType == 4">
                    <div class="activity-item" v-for="(item,index) in couponData.markingVo.tiredPricingList" :key='index'>
                      <span class="tag">满{{ item.amountLimitation }}-{{ item.faceValue }}</span>
                      <span class="tip-text">【满减】满{{ item.amountLimitation }}元，总价减{{ item.faceValue }}元</span>
                    </div>
                  </div>

                  <div v-if="couponData.markingVo.ruleType == 5">
                    <div class="activity-item" v-for="(item,index) in couponData.markingVo.tiredPricingList" :key='index'>
                      <span class="tag">满{{ item.amountLimitation }}打{{ item.faceValue }}折</span>
                      <span class="tip-text">【满减】满{{ item.amountLimitation }}元，总价打{{ item.faceValue }}折</span>
                    </div>
                  </div>

                </div>

                <div v-if="couponList.length">
                    <div class="coupon-list-title">
                        <img class="ic_youhui" src="@/assets/img/ic_youhui.png" />
                        <span>优惠券</span>
                    </div>
                    <div v-for="(item, index) in couponList" :key="item.id" class="copun-use-item" @click="chooseCopun(item, index)">
                        <div class="left">
                            <div class="cost-money">
                                <div v-if="item.couponsType == 1 || item.couponsType == 3">
                                    <span class="coin">￥</span>
                                    <span class="price">{{item.faceValue}}</span>
                                </div>
                                <div v-if="item.couponsType == 2">
                                    <span class="price">{{item.faceValue}}</span>
                                    <span class="coin">折</span>
                                </div>
                                <p v-if="item.couponsType == 1" class="condition-price">满{{item.amountLimitation}}可用</p>
                                <p class="condition-price" v-if="item.couponsType == 3">满{{ item.faceValue }}元可用</p>
                            </div>
                            <div class="use-condition">
                                <p class="condition-price">{{item.spuName}}</p>
                                <p class="condition-time">{{ item.effectiveStartTime | filterTime }}-{{ item.effectiveEndTime | filterTime }}</p>
                            </div>
                        </div>
                        <div class="right">
                            <img v-if="item.checked" src="@/assets/img/copun-selected.png" alt="">
                            <img v-if="!disable && !item.checked" src="@/assets/img/copun-choose.png" alt="">
                        </div>
                        <span class="top-icon">商品券</span>
                        <span v-if="item.showAndIcon" class="and-icon">可叠加</span>
                    </div>
                    
                </div>
                <div v-if="disCouponList.length">
                    <div class="disabled-title">不可用优惠劵</div>
                    <div v-for="(item) in disCouponList" :key="item.id" class="copun-use-item no-use">
                        <div class="left">
                            <div class="cost-money">
                                <div v-if="item.couponsType == 1 || item.couponsType == 3">
                                    <span class="coin">￥</span>
                                    <span class="price">{{item.faceValue}}</span>
                                </div>
                                <div v-if="item.couponsType == 2">
                                    <span class="price">{{item.faceValue}}</span>
                                    <span class="coin">折</span>
                                </div>
                                <p v-if="item.couponsType == 1" class="condition-price">满{{item.amountLimitation}}可用</p>
                                <p class="condition-price" v-if="item.couponsType == 3">满{{ item.faceValue }}元可用</p>
                            </div>
                            <div class="use-condition">
                                <p class="condition-price">{{ item.spuName }}</p>
                                <p class="condition-time">{{ item.effectiveStartTime | filterTime }}-{{ item.effectiveEndTime | filterTime }}</p>
                                <p class="dis-reson">未到优惠券使用时间或结算金额不符合条件</p>
                            </div>
                        </div>
                        <div class="right">
                            <!-- <img src="@/assets/img/copun-choose.png" alt=""> -->
                        </div>
                        <span class="top-icon">商品券</span>
                    </div>
                    
                </div>
                
            </div>
            <div class="copun-empty" v-else>
                <img src="@/assets/img/copun-empty.png" alt="">
                <p>抱歉，您暂无优惠券可使用</p>
            </div>
            <div class="handle-sure-btn" @click="confirm">确定</div>
        </div>

    </van-popup>
</template>

<script>
import { getUserSpuCoupons } from '@/api/mycoupon'
import { queryDiscounts } from '@/api/shoppingcart'

export default {
    props: {
        haveActivity: {
            type: Boolean,
            default: false
        },
        isCheckBox: {
            type: Boolean,
            default: false
        },
        // 是否可以选择
        disable: {
          type: Boolean,
          default: false
        },
        // 是否刷新活动数据
        reloadActive: {
          type: Boolean,
          default: false
        }
    },
    data() {
        return {
            showcoupon: false,
            couponList: [],
            disCouponList: [],
            choosedCoupon: [],
            couponDiscount: 0,
            beforeCouponPrice: 0, // 优惠前价格

            couponData: {}, // 购物车优惠券数据
            tiredPricingList: null, // 最优活动数据
        }
    },
    computed: {
        selectCouponCount() {
            let list = this.couponList,
                num = 0;
            if (list && list.length > 0) {
                list.forEach(item => {
                    if (item.checked) {
                        num += 1;
                    }
                });
            }
            return num
        },
        sumSelectCouponDiscount() {
            let list = this.couponList,
                price = 0;
            if (list && list.length > 0) {
                list.forEach(item => {
                    if (item.checked) {
                        price += item.couponDiscount;
                    }
                });
            }
            return price
        },
        defaultSelect() {
            // let list = this.couponList,
            //     price = 0;
            // if (list && list.length > 0) {
            //     list.forEach(item => {
            //         if (item.checked) {
                        
            //         }
            //     });
            // }
            // return price
            return this.couponList.filter(item => item.checked)[0]
        },
    },
    filters: {
        filterTime(val) {
            return val.split(` `)[0].replace(/-/g, ".")
        },
    },
    methods: {
        closecoupon() {
            this.showcoupon = false
        },
        setShowPopup(spuParam) {
            this.showcoupon = true
            this.haveActivity ? this.getQueryDiscounts(spuParam) : this.getCopunList(spuParam)
            // this.getCopunList(spuParam)
            
            this.beforeCouponPrice = spuParam.skuList.reduce((prev, cur) => {
                return prev + Number(cur.beforeCouponPrice) * cur.num;
            }, 0).toFixed(2)
        },
        // 查询优惠列表
        getQueryDiscounts (spuParam) {
          // 刷新活动数据
          if(this.reloadActive) {this.tiredPricingList = null}

          let { skuList:spuDiscountBos, sourceType } = spuParam
          let param = {
            sourceType,
            spuDiscountBos
          }
          queryDiscounts(param).then((res) => {
            this.couponData = res.data
            // 选出最优活动
            if(res.data.markingVo && res.data.markingVo.tiredPricingList) { 
              let activeArray = res.data.markingVo.tiredPricingList.filter((item)=>{
                return res.data.price >= item.amountLimitation
              })
              if(activeArray.length > 0) { this.tiredPricingList = activeArray.sort((a, b) => { return b.amountLimitation - a.amountLimitation })[0] }
            }
            this.beforeCouponPrice = this.couponData.price

            // 优惠券处理
            let idList = spuParam.ids || []
            if(!this.disable &&!idList.length) {
                idList = res.data.couponList.filter(item=>item.checked).map(item=>item.id)
            }
            this.handleResult(res.data.couponList,idList)
          })
        },
        getCopunList(params) {
            const copunIds = params.ids || []
            getUserSpuCoupons(params.skuList).then((res) => {
              this.handleResult(res.data,copunIds)
            }).catch(err => {
                console.log(err)
            })
        },
        handleResult(data, copunIds) {
          const couponList = data.filter(item => item.usable) // 可用优惠券列表
          let spuArr = [] // 存放所有spuId,用于判断是否展示可叠加标签，多spu时需要展示逻辑
          this.choosedCoupon = [] // 当前弹窗已选择优惠券列表
          couponList.forEach(ele => {
              if (!spuArr.includes(ele.spuId)) {
                  spuArr.push(ele.spuId)
              }
              if (this.disable) {
                ele.checked && this.choosedCoupon.push(ele)
              } else {
                if (copunIds.length && copunIds.includes(ele.id)) {
                    this.choosedCoupon.push(ele)
                }
              }
              
          })
          const spuIds = this.choosedCoupon.map(item => item.spuId) // 用于判断是否展示可叠加标签
          this.couponList = couponList.map(item => {
              let showAndIcon = spuArr.length > 1 && !spuIds.includes(item.spuId), checked
              if (this.disable){
                checked = item.checked
              } else {
                checked = copunIds.includes(item.id)
              }
              return {
                  ...item,
                  showAndIcon,
                  checked
              }
          })
          this.disCouponList = data.filter(item => !item.usable)
          this.couponDiscount = this.choosedCoupon.reduce((prev, cur) => {
              return prev + Number(cur.couponDiscount);
          }, 0).toFixed(2)
          this.showcoupon = true
        },
        chooseCopun(item) {
            if(this.disable) {
              return
            }
            let spuArr = [] // 存放所有spuId,用于判断是否展示可叠加标签，多spu时需要展示逻辑
            this.couponList.forEach(ele => {
                if (!spuArr.includes(ele.spuId)) {
                    spuArr.push(ele.spuId)
                }
            })
            let copunIds = this.choosedCoupon.map(item => item.id) // 存放已选择的优惠券id，用于处理卡卷勾选逻辑（checked）
            let spuIndex = this.choosedCoupon.findIndex(selectedItem => selectedItem.spuId == item.spuId)
            if (!item.checked) {
                if (spuIndex > -1) {
                    this.choosedCoupon.splice(spuIndex, 1)
                    copunIds.splice(spuIndex, 1)
                }
                copunIds.push(item.id)
                this.choosedCoupon.push(item)
            } else {
                this.choosedCoupon.splice(spuIndex, 1)
                copunIds.splice(spuIndex, 1)
            }
            const spuIds = this.choosedCoupon.map(item => item.spuId) // 用于判断是否展示可叠加标签
            this.couponList.forEach(spu => {
                spu.checked = copunIds.includes(spu.id)
                spu.showAndIcon = spuArr.length > 1 && !spuIds.includes(spu.spuId)
            })

            this.couponDiscount = this.choosedCoupon.reduce((prev, cur) => {
                return prev + Number(cur.couponDiscount);
            }, 0).toFixed(2)

            // 商品详情切换优惠券重新赋值 券后价格
            if(this.haveActivity) {
              if( !this.choosedCoupon[0]) {
                this.couponData.finalPrince = this.couponData.price - this.couponData.marketingDiscount
              } else {
                this.couponData.finalPrince = this.choosedCoupon[0].afterCouponPrice
              }
            }
        },
        confirm() {
            if (!this.couponList.length) {
                this.showcoupon = false
                return
            }
            this.showcoupon = false
            this.$emit('coonfirmCoupun', {
                couponList: this.couponList,
                choosedCoupon: this.choosedCoupon,
                userCouponDiscount: this.couponDiscount,
                onlineRetailerCouponIds: this.choosedCoupon.map(item => {
                    return item.id
                })
            })

        },
    }
}
</script>

<style lang="less" scoped>
.freightwrapper {
  border-radius: 12px 12px 0 0;
  color: #000;
  /deep/ .van-popup__close-icon--top-right {
    top: 0.76rem;
    font-size: 0.72rem;
  }

  .coupon-container-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .coupon-title {
      position: relative;
      text-align: center;
      font-size: 16px;
      color: #000d1d;
      padding-top: 12px;
      font-weight: 400;
      > img {
        position: absolute;
        right: 12px;
        top: 13px;
        width: 27px;
        height: 20px;
      }
    }
  }
  .coupon-container {
    padding: 0 12px;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    .after-price {
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255, 10, 53, 0.08);
      width: fit-content;
      margin: 16px auto 4px;
      color: #ff0a35;
      text-align: center;
      .text {
        font-size: 15px;
        font-weight: bold;
        font-family: DINAlternate-Bold, DINAlternate;
      }
      .real-price {
        font-size: 11px;
      }
    }
    .detail-bubble {
      width: 351px;
      box-shadow: 0px 0px 0px 0.5px #ff0a35;
      // border: 1px solid #ff0a35;
      border-radius: 12px;
      padding: 13px;
      position: relative;
      margin: 9px auto 0;
      margin-bottom: 16px;
      .estimate-card {
        border-radius: 8px;
        border: 1px solid #ffb1b8;
        padding: 0;
        font-size: 9px;
        display: inline-block;
        color: #ff0a35;
        text-align: center;
        &.mr-15 {
          margin-right: 15px;
        }
        &.mr-3 {
          margin-right: 3;
        }
        .text {
          background: rgba(255, 10, 53, 0.08);
          padding: 2px 6px;
          line-height: 14px;
          border-radius: 8px 8px 0 0;
        }
        .price {
          padding: 2px 6px;
          line-height: 14px;
        }
      }
      .detail-bubble-title {
        font-size: 11px;
        color: #444;
        line-height: 15px;
        margin-bottom: 10px;
        text-align: center;
      }
      .reduce-tip {
        color: #ff0a35;
        font-weight: bold;
        margin-bottom: 2px;
        text-align: center;
        .reduce-text {
          margin-right: 13px;
          font-family: DIN Alternate Bold;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .price-box{
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      .detail-bubble-content {
        margin: 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: #e60113;
        line-height: 25px;
      }
      .nonuse-content {
        margin-top: 61px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: #999;
        line-height: 18px;
      }
      &::before {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #e60113;
      }
      &::after {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: -9px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
      }
    }
    .activity-card {
      margin-bottom: 16px;
      .activity-item {
        padding-left: 4px;
        margin-bottom: 12px;
        &:last-child {
          margin-bottom: 0;
        }
        .tag {
          color: #FF0A35;
          font-size: 10px;
          height: 18px;
          line-height: 18px;
          background: rgba(255,10,53,0.08);
          padding: 0px 6px;
          border-radius: 2px;
          display: inline-block;
        }
        .tip-text {
          color: #191919;
          font-size: 13px;
        }
      }
    }
    .empty-page {
      text-align: center;
      height: 100%;
      img {
        margin-top: 60px;
        width: 90px;
        height: 90px;
      }
      .nocoupon-txt {
        font-size: 14px;
        color: #999;
        margin-top: -3px;
        line-height: 20px;
      }
    }
    .couponlist {
      padding: 20px 0 60px;
      overflow-y: auto;
      height: 360px;
      .disabled-coupon {
        background: #f2f2f2;
      }
      .platform-coupon {
        background: #fef4f4;
      }
      .store-coupon {
        background: #fff7ee;
      }
      .coupon {
        margin-bottom: 10px;
        height: 98px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        .main-ticket {
          width: 251px;
          position: relative;
          padding: 26px 0 10px 18px;
          .coupon-detail {
            display: inline-flex;
            align-items: center;
            height: 38px;
            .disabled-color {
              color: #999 !important;
            }
            .store-color {
              color: #fe8c02;
            }
            .platform-color {
              color: #e60113;
            }
            .coupon-price {
              font-weight: 600;
              display: inline-flex;
              align-items: baseline;
              .text {
                font-size: 14px;
                line-height: 20px;
              }
              .price {
                margin: 0 4px;
                font-size: 32px;
                line-height: 38px;
              }
            }
            .coupon-info {
              margin-left: 12px;
              display: inline-flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: flex-start;
              .condition {
                color: #000;
                font-size: 14px;
                line-height: 20px;
                font-weight: 500;
              }
              .indate {
                color: #666;
                font-size: 11px;
                line-height: 16px;
              }
            }
          }
          .coupon-explain {
            white-space: nowrap;
            padding-top: 8px;
            font-size: 0;
            color: #666;
            line-height: 16px;
            span {
              font-size: 11px;
            }
          }

          .disabled-mark {
            background: #999;
          }
          .store-mark {
            background: #ffb760;
          }
          .platform-mark {
            background: #fe8993;
          }

          .main-mark {
            width: 50px;
            height: 18px;
            border-radius: 0 0 8px 0px;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
            line-height: 18px;
            font-size: 10px;
            color: #fff;
          }
        }
        .stub-ticket {
          width: 100px;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          .choosebox {
            width: 18px;
            height: 18px;
            margin-right: 18px;
          }
        }
      }
    }
  }
}
.copuned-item {
  margin: 20px 0;
  font-size: 14px;
  color: #000;
  line-height: 18px;
  > span {
    color: #e60113;
  }
}
.coupon-list-title {
  color: #222;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 12px;
  padding-left: 2px;
  display: flex;
  align-items: center;
  .ic_youhui {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  .gery-tip {
    font-size: 10px;
    color: #999;
    margin-left: 4px;
    font-weight: normal;
  }
}
.disabled-title {
  color: #6e6e6e;
  font-size: 13px;
  padding-left: 2px;
  margin: 12px 0;
}
.copun-use-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fef4f4;
  margin-top: 12px;
  padding: 30px 18px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  .and-icon {
    color: #fe8993;
    font-size: 10px;
    position: absolute;
    top: 8px;
    right: 8px;
  }
  &.no-use {
    background: #f2f2f2;
    .top-icon {
      color: #fff;
      font-size: 10px;
      position: absolute;
      top: 0;
      left: 0;
      width: 50px;
      height: 18px;
      background: url('~@/assets/img/copun-gery-icon-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
    }
    .left {
      .cost-money {
        color: #999;
      }
      .use-condition {
        .condition-price {
          color: #999;
        }
        .condition-time {
          color: #999;
        }
        .dis-reson {
          font-size: 11px;
          color: #999;
          // overflow: hidden; /*超出部分隐藏*/
          // text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: break-spaces; /*规定段落中的文本不进行换行 */
        }
      }
    }
  }
  .top-icon {
    color: #fff;
    font-size: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 18px;
    background: url('~@/assets/img/copun-icon-bg.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
  }
  .left {
    display: flex;
    overflow: hidden;
    align-items: center;
    flex: 1;
    .cost-money {
      color: #e60113;
      font-size: 14px;
      margin-right: 18px;
      font-weight: bold;
      text-align: center;
      .price {
        font-size: 32px;
        line-height: 38px;
      }
    }
    .use-condition {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;
      .condition-price {
        font-size: 14px;
        color: #000;
        font-weight: bold;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
      .condition-time {
        font-size: 11px;
        color: #666;
      }
    }
  }
  .right {
    position: relative;
    height: 100%;

    img {
      width: 18px;
      height: 18px;
    }
  }
}
.copun-empty {
  text-align: center;
  flex: 1;
  img {
    width: 90px;
    height: 90px;
    margin-top: 60px;
  }
  p {
    margin-top: 5px;
    font-size: 14px;
    color: #999;
  }
}
.copun-title {
  font-size: 16px;
  color: #000;
}
.handle-sure-btn {
  font-weight: 500;
  font-size: 16px;
  color: #FFF9E9;
  // background: #e60113;
  background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  margin: 16px;
}

.detail-bubble-none {
  display: none;
}
</style>


