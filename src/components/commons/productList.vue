<template>
  <div v-if="data" class="shop-card">
    <div @click="toDetails(item)">
      <div class="layout">
        <!-- 商品主图 -->
        <div class="shop-img" ref="shopImg">
          <img v-if="data.baseLabel.url" :src="data.baseLabel.url" alt="" style="height: 100%; width: 100%;" />
          <img
            v-else
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAAFWBAMAAADAgaiwAAAAFVBMVEX7+/vt7e3w8PD19fXz8/P5+fn39/ejJ1KzAAADyElEQVR42u3dT3PSQBiA8Xe0m/sm2LNE8Iyu5dy0qedQCGcQ4ft/BHezZSWmUqrTLMw8v5mi1Dg8De/mz/SAGGO2tZy7emk7xabKJVi61qlcho1tXcllSIxcym4V2ciNXIq5XMoIiCRSyaVQtL4JJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOXl3Xlf9jXh5y31Q/VyLL3aGtvL2hfk4qiX2c2KrOv9vKeaHHImt9aCAdPbXqptXk+cMzre992qz31uLIfv2q9fUzrQttVfLYe+v69a2JtiZy1Xvr7NWtS+O+l5lvvbe+e3XrWgc9t1693Jq2W2f7bb7mBx7k7b0/obW2tJXVVvW436a1g8fy9pITWufGD2dmjLmReK1iHFtlpWZv2mot9G+ZLCK0do9cHyQ4bB20W68it/rVPjmpNWm1fjKm6LE1LLBy7/5Yq9qYL9oaNK23IrM+W7snhKrTengcVX5PNq2jsux3vw5f17rw20SZ10S/3Jo7vlUVPjpK6+MJrfVut6tdYth8EqW1OKHVLafrpjUZPk1DjNZEn9DqvjJXqELiMELr48utPmzgvhZ6LzUHppX0odAdzx9fUx2edKQ9tIYRyL3hkVZnMIzZ6kcgOzwtpEda1zFbv2jn42Hr4EjrImKr2q8mb/1Ca6a0NwqPg2Ffre98QmuhZcdaC39TM25mx7hLraKP1u4IKNtmC4+0ykx/b/7HY28z0B0BVTpPF93H7gsGy0itV37FtE9fH3+36u716zaJ1LoOZ0ilg9vQmv259G9EJFKrn0+9al/FTlqtWaGdjXYGVau17O04EEYgrDKv2rf602o4ADirVuu9/1l6aQ0j4P/upeJ7jL+8/vA0F01cGmEGuiPQtLRW2sT3j780773f+Dpa6/vQZoUldB1alcucuKqHpx/mNlrrzB9OQ7g3Dq3NTUCV+CUlqrBJ0VoXpbOShiq9u4l7Yu+v3MvP9cA2pn6Tuc4ktC7arefwcbCLzyKzB/F+jMVSG2PM6kw/DzaEXNCH6f6dqqTrLF9ludv205ps/uuF1PJbOa2kJ2pTltP6X0PzkS3t0/wuHd3vXtdbL83dUI9upHf1z1yneWm2pwTX9eabuzvP77cSh30/tbbBo/vp1v+Su0PVy40pbaaV2tCYmrfVcsl5WZbG2RjHPstdpDeyofG5dZ3rI9xkn9Mpod6Z8s7txcBPR2l2tZwnVe8sM3WP9blGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAi/ULMvopqX0wGS4AAAAASUVORK5CYII="
            alt=""
            style="height: 100%; width: 100%; object-fit: cover"
          />
          <!-- 商品状态 -->
          <div v-if="isStatus">
            <div class="sell-out" v-if="item.status == '1'">
              <span class="sell-out-text">下架</span>
            </div>
            <div class="sell-out" v-if="item.status == '2'">
              <span class="sell-out-text">无货</span>
            </div>
            <div class="sell-out" v-if="item.status == '3'">
              <span class="sell-out-text">售罄</span>
            </div>
            <div class="sell-out" v-if="item.status == '4'">
              <span class="sell-out-text">失效</span>
            </div>
          </div>
        </div>
        <!-- 内容 -->
        <div class="shop-info" :class="{ 'disable-status': isStatus }">
          <div>
            <!-- 商品名称 -->
            <div class="shop-info-name">{{ data.baseLabel.name }}</div>
            <!-- 商品副标题-->
            <!-- <div class="shop-info-title" v-if="data.baseLabel.subTitle">{{ data.baseLabel.subTitle }}</div> -->

            <!-- 商品标签-->
            <div class="shop-info-goodstags"  v-if="data.goodsTagList && data.goodsTagList.length">
              <div v-for="(item, index) in data.goodsTagList.slice(0,2)" :key="index">	
                <span>
                  {{ item.tagName }}
                </span>		
              </div>			
            </div>

            <!-- 商品评论 好评率 -->
            <div class="shop-info-evaluate">
              <span v-if="data.baseLabel.comment">{{ data.baseLabel.comment | filterFraction(1) }}评论</span>
              <label v-if="data.baseLabel.applauseRate * 1">
                <span v-if="data.baseLabel.comment">|</span>
                {{ data.baseLabel.applauseRate }}%好评
              </label>
              <label v-if="data.baseLabel.salesVolume" class="">
                <span v-if="data.baseLabel.applauseRate * 1 || data.baseLabel.comment">|</span>
                {{ data.baseLabel.salesVolume | filterFraction(1) }}人已买
              </label>
            </div>
          </div>
          <div>
          <!-- 活动 -->
          <div class="shop-info-active" v-if="isMarkIngLabel && item.sourceType != 2">
            <label>
              <img src="@/assets/img/goodsDetail/pai_hot.png" />
              <span>
                <!-- {{ data.markIngLabel[0].label }} -->
                {{ data.thematicLabel.subjectLabel }}
              </span>
              <img src="@/assets/img/goodsDetail/pai_arrow.png" />
            </label>
          </div>

          <!-- 优惠券和活动 -->
          <div class="shop-coupon-activty">
            <div v-for="(item, index) in couponShowlist" :key="index" class="shop-coupon-activty-item" v-html="item.showFaceValue"></div>
          </div>


            <!-- 商品价格 -->
            <div class="shop-info-price" v-if="!storeId">
              <!-- 券后价  -->
              <div v-if="afterCouponPrice" class="info-price">
                <span class="explain">券后</span>
                <span class="unit">¥</span>
                <span class="price">{{ setPrice(afterCouponPrice)[0] }}</span>
                <span class="decimal" v-if="afterCouponPrice < 10000">.{{ setPrice(afterCouponPrice)[1] }}</span>
                <!-- <div class="tag">{{ data.couponLable.couponsType | filterCoupons(data.couponLable.faceValue) }}</div> -->
              </div>
              <div v-else class="info-price">
                <!-- 实售价 ( 活动价 > 万顺售价 ) -->
                <template v-if="item.sourceType != 2">
                  <div class="info-price">
                    <span class="unit">¥</span>
                    <span class="price">{{ setPrice(data.finalPrice || data.baseLabel.price)[0] }}</span>
                    <span class="decimal">.{{ setPrice(data.finalPrice || data.baseLabel.price)[1] }}</span>
                  </div>
                  <!-- 原价 （划线价)  实售价取值拼团价或活动价时展示 -->
                  <div class="info-price oldPrice" v-if="isLinePice">
                    <div class="line"></div>
                    <span class="unit">¥</span>
                    <span class="price">{{ setPrice(data.baseLabel.price)[0] }}</span>
                    <span class="decimal">.{{ setPrice(data.baseLabel.price)[1] }}</span>
                  </div>
                </template>
                <template v-else>
                  <!-- 原价 （划线价)  实售价取值拼团价或活动价时展示 -->
                  <div class="info-price">
                    <span class="unit">¥</span>
                    <span class="price">{{ setPrice(data.baseLabel.price)[0] }}</span>
                    <span class="decimal">.{{ setPrice(data.baseLabel.price)[1] }}</span>
                  </div>
                </template>
              </div>
            </div>
            <div class="shop-info-price" v-else>
              <div class="info-price">
                <span class="unit">¥</span>
                <span class="price">{{ setPrice(data.baseLabel.price)[0] }}</span>
                <span class="decimal">.{{ setPrice(data.baseLabel.price)[1] }}</span>
              </div>
            </div>
            <!-- 商品绩效分-->
            <div class="shop-info-fraction">
              <!-- 有优惠券时,原价 -->
              <label v-if="afterCouponPrice">
                <span class="info-price oldPrice">
                  <span class="unit">¥</span>
                  <span class="price">{{ setPrice(data.finalPrice || data.baseLabel.price)[0] }}</span>
                  <span class="decimal">.{{ setPrice(data.finalPrice || data.baseLabel.price)[1] }}</span>
                </span>
              </label>
              <label v-if="isPerformanceScoreLa" class="fraction">
                <img src="@/assets/img/jixiao.png" />
                <span class="performate-point">绩效分:{{ data.performanceScoreLabel.performanceScore | filterFraction }}分</span>
              </label>
            </div>

            <!-- 加入购物车标识-->
            <div
              class="add-shopping"
              v-if="isCart && (item.status == '0') && item.isGift != '1'"
              @click.stop="$emit('addShoppingCart', item)"
            ></div>

          </div>
        </div>
      </div>
      <!-- 分销分享按钮 -->
      <div v-if="$route.query.from == '/distributionActivity' && !$route.query.promoteInfo" class="share-earn-bt" @click.stop="$emit('shareComm', item)">
        <div class="share-earn-price-box">
          <span class="share-earn-label">预估佣金</span><span class="share-earn-price share-earn-price-yuan">{{ item.commissionAmount ? item.commissionAmount.toFixed(2).split('.')[0] : '0' }}</span><span class="share-earn-price share-earn-price-fen">{{ item.commissionAmount ? '.' + item.commissionAmount.toFixed(2).split('.')[1] : '.00' }}</span>
        </div>
        <div class="share-earn-bg">分享赚</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatPrice } from '@/utils/utils'
  import { Overlay } from 'vant'

  export default {
    name: 'goodItem',
    inject: ['reload'],
    components: {
      [Overlay.name]: Overlay,
    },
    props: {
      item: {
        type: Object,
        default: () => {},
      },
      detailShow: {
        type: Boolean,
      },
      //是否是【我的店铺】列表页
      storeId: {
        default: '',
      },
      //是否展示商品状态
      isStatus: {
        type: Boolean,
        default: false,
      },
      //是否展示购物车图标
      isCart: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        show: true,
        formatPrice,
        data: this.item.skuLable,
        couponsMap: {
          '1': '满减',
          '2': '折扣',
          '3': '立减',
        },
      }
    },
    computed: {
      afterCouponPrice(){
        let checkedCoupon = null
        if (this.item.skuLable && this.item.skuLable.couponLable) {
          checkedCoupon = this.item.skuLable.couponLable.find(ele=>{ return ele.checked })
        }
        return checkedCoupon && checkedCoupon.afterCouponPrice
      },
      couponShowlist(){
        let obj = this.data && this.data || []
        let couponlist = []
        // 活动和优惠券标签，最多显示3个标签
				if(obj.markIngLabel && obj.markIngLabel.length){
					if([1, 3].includes(obj.markIngLabel[0].ruleType)){
						// 固定金额和自定义规则: 只显示优惠券标签，最多显示2个按照优惠力度由大到小排列
						couponlist =  obj.couponLable ? obj.couponLable.slice(0,2) : []
					} else if(obj.markIngLabel[0].ruleType == 2){
						// 固定折扣活动: 显示活动标签为【XX折】+1个优惠券标签，按照优惠力度由大到小排列
						if(obj.markIngLabel && obj.markIngLabel[0].fixedDiscount){				
							couponlist.push({ showFaceValue: `<span style='font-weight:bold;'>${obj.markIngLabel[0].fixedDiscount}</span>折` })
						}		
						if(obj.couponLable){								
							couponlist = [...couponlist, ...obj.couponLable.slice(0,1)]
						}
					} else if([4, 5].includes(obj.markIngLabel[0].ruleType)){
						// 满减或满折活动，商品参加满减或满折活动，显示活动标签为2个，取基数较小的2个标签，显示为【满200减20】，【满300减30】或【满200打8折】，【满300打7折】
						if(obj.markIngLabel && obj.markIngLabel[0].tiredPricingList.length){
							couponlist =  obj.markIngLabel[0].tiredPricingList
							couponlist.forEach(item=>{
								if(obj.markIngLabel[0].ruleType == 4){
									item.showFaceValue = `满<span style='font-weight:bold;'>${item.amountLimitation}</span>减<span style='font-weight:bold;'>${item.faceValue}</span>`
								} else {
									item.showFaceValue = `满<span style='font-weight:bold;'>${item.amountLimitation}</span>打<span style='font-weight:bold;'>${item.faceValue}</span>折`
								}
							})
              couponlist = couponlist.slice(0, 1)
						} 
            if(obj.couponLable){								
							couponlist = [...couponlist, ...obj.couponLable.slice(0,1)]
						}
					}				
				} else {
          couponlist =  obj.couponLable ? obj.couponLable.slice(0,1) : []
        }
        couponlist.forEach(item=>{
          if(item.couponsType==2){
            item.showFaceValue = `<span style='font-weight:bold;'>${item.faceValue}</span>折`
          }  else if(item.couponsType==3){
            item.showFaceValue = `立减<span style='font-weight:bold;'>${item.faceValue}</span>元`
          }
        })
        return couponlist
      },
      // 卡券信息
      isCouponLable() {
        return (
          this.data && this.data.couponLable && this.data.couponLable.afterCouponPrice && this.data.couponLable.couponsType && this.data.couponLable.faceValue
        )
      },
      // 活动信息
      isMarkIngLabel() {
        return this.data && this.data.thematicLabel && this.data.thematicLabel.subjectLabel
      },
      // 绩效分信息
      isPerformanceScoreLa() {
        return this.data && this.data.performanceScoreLabel && this.data.performanceScoreLabel.performanceScore
      },
      // 划线价
      isLinePice() {
        return this.data.finalPrice && this.data.baseLabel.price != this.data.finalPrice
      },
    },
    watch: {
      item: {
        handler(newVal, oldVal) {
          this.item = newVal
        },
      },
      deep: true,
      immediate: true,
    },
    filters: {
      filterFraction(val, make) {
        let len = (val + '').length
        switch (len) {
          case 3:
          case 4:
            if (make && val == 1000) {
              val= '999+'
            }else{
              val = parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) + '+'
            }         
            break
          case 5:
          case 6:
          case 7:
            if (make) {
              val = '999+'
            } else {
              val = parseInt((val / 10000) * 10) / 10 + '万'
            }
            break
          default:
            break
        }
        return val
      },
      filterCoupons(type, val) {
        let va = parseInt(val * 10) / 10
        let couponsMap = {
          // '1': '满减' + va,
          '2': va + '折',
          '3': '立减' + va,
        }
        return couponsMap[type]
      },
    },
    methods: {
      //详情
      toDetails(item) {
        let id = item.skuId || item.id
        if (id !== 0 && !id) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        } else {
          if(item.goodsSource == 4) {
            this.$router.push({ path: '/motorCar/detail', query:{skuId: id} })
            return
          }
          if (this.$route.query.from=='/distributionActivity') {
            const isDistribution = !this.$route.query.promoteInfo
            return  this.$router.push({ path: '/spudetail', query: { sourceType: item.sourceType || 1,id: item.skuId, isDistribution, promoteInfo: this.$route.query.promoteInfo } })
          }
          if (this.storeId) {
            this.$router.push({ path: '/spudetail', query: { id, storeId: this.storeId, sourceType: 2 } })
          } else if (this.detailShow) {
            this.$router.push({ path: '/spudetail', query: { id, storeId: item.storeId, sourceType: item.sourceType || 1 } })
            this.reload()
          } else {
            this.$router.push({ path: '/spudetail', query: { id, storeId: item.storeId, sourceType: item.sourceType || 1 } })
          }
        }
      },
      // 价格展示处理
      setPrice(val) {
        return this.formatPrice(val).split('.')
      },
    },
  }
</script>

<style lang="less" scoped>
  .shop-card {
    position: relative;
    margin-bottom: 10px;
    overflow: hidden;
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    z-index: 2;
    .layout {
      display: flex;
      padding: 8px;
      padding-bottom: 6px;
    }
    .shop-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 8px;
      overflow: hidden;
      width: calc(~'100% - 130px');
      min-height: 130px;
      text-align: left;
      background-color: #fff;
      // 商品名称
      .shop-info-name {
        color: #000000;
        text-align: left;
        max-height: 38px;
        line-height: 19px;
        font-size: 13px;
        font-weight: bold;
        /* 超出两行隐藏 */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      // 副标题
      .shop-info-title {
        margin: 0 0 2px;
        color: #e3903f;
        text-align: left;
        font-size: 11px;
        height: 15px;
        /* 超出隐藏 */
        overflow: hidden;
      }

	  // 商品标签
	  .shop-info-goodstags{
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      margin-top: 6px;
      span{
        display: block;
        margin-right: 4px;
        border-radius: 4px;
        // border-image: linear-gradient(90deg, rgba(255, 95, 46, 1), rgba(255, 10, 53, 1)) 1 1;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FF0A35;
        line-height: 10px;
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        padding: 0 6px;
      }
      >div {
        border: 0.5px solid transparent;
        padding: 1px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 4px;
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, rgba(255, 95, 46, 1), rgba(255, 10, 53, 1));
      }
      >div:last-of-type{
        span{
          margin-right: 0;
        }
      }
	  }
      // 评价
      .shop-info-evaluate {
        display: flex;
        overflow: hidden;
        width: 100%;
        font-size: 11px;
        color: #999999;
        label > span {
          padding: 0 4px;
        }
      }
      // 绩效分
      .shop-info-fraction {
        display: flex;
        // height: 14px;
        line-height: 15px;
        font-size: 10px;
        .fraction {
          display: flex;
          align-items: center;
          padding: 0 4px 0 0;
          color: #008864;
          background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
          border-radius: 4px;
          img {
            vertical-align: text-bottom;
            width: 14px;
            height: 14px;
          }
        }
      }
      // 商品价格
      .shop-info-price {
        display: flex;
        align-items: center;
        height: 24px;
        line-height: 24px;
        color: #ff0a35;
        font-weight: bold;
        font-size: 20px;
        .explain {
          font-weight: 400;
        }
        .tag {
          height: 18px;
          line-height: 18px;
          border-radius: 0 9px 9px 0;
          padding: 0px 6px 0px 8px;
          font-size: 10px;
          font-weight: 400;
          color: #fff;
          background-image: url('../../assets/img/youhuiquan.png');
          background-size: 100% 100%;
        }
      }
      .shop-info-price,
      .shop-info-fraction {
        // 价格
        .unit,
        .decimal,
        .explain {
          font-size: 11px;
          font-weight: bold;
        }
        .price,
        .decimal {
          font-family: 'AlternateBold';
        }
        .oldPrice {
          position: relative;
          font-size: 13px;
          color: #c3c3c3;
          // transform: scale(0.92);
          margin-left: 2px;
          .unit {
            font-size: 10px;
          }
          .line {
            width: 100%;
            height: 1px;
            background-color: #999999;
            position: absolute;
            top: 49%;
          }
          .price {
            font-size: 13px;
          }
        }
        .info-price {
          display: flex;
          -webkit-box-align: end;
          align-items: baseline;
        }
      }
      // 购买人数
      .shop-info-buy {
        font-size: 10px;
        color: #c3c3c3;
      }
      // 活动
      .shop-info-active {
        background: #FFEDF0;
        display: inline-block;
        //background: linear-gradient(90deg, #fff9e9 0%, #ffe8f4 76%, #f4faff 100%);
        border-radius: 7px;
		    margin-bottom: 6px;
        label {
        display: flex;
        align-items: center;
        }
        img:first-of-type {
          width: 10px;
          height: 10px;
          margin-right: 2px;
        }
        img:last-of-type {
          width: 16px;
          height: 16px;
        }
        span {
          display: inline-block;
          // line-height: 14px;
          font-size: 10px;
          color: #ff0a35;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
	  // 活动和优惠券显示
	  .shop-coupon-activty{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		// margin-bottom: 6px;
    margin-top: 6px;
		&-item{
			background: #FFEEE9;
			border-radius: 4px;
			font-size: 10px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FF450C;
			line-height: 14px;
			padding: 2px 6px;
			margin-right: 4px;
			margin-bottom: 6px;
		}
		&-item:last-of-type{
			margin-right: 0;
		}
	  }
    }
    .shop-img {
      background-color: #fff;
      height: 130px;
      width: 130px;
      position: relative;
      .sell-out {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.2rem;
        height: 2.2rem;
        background-color: #000000;
        opacity: 0.7;
        border-radius: 50%;
        .sell-out-text {
          color: #ffffff;
        }
      }
      img {
        border-radius: 8px;
      }
    }
  }
  // 商品状态 --收藏页面
  .disable-status {
    color: #bababa;
  }
  .add-shopping {
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: 24px;
    height: 24px;
    background: url('../../assets/img/cat_o@2x.png') no-repeat center center;
    background-size: 100%;
    opacity: 0.9;
  }

  .share-earn-bt {
    margin: 0 8px 8px 8px;
    height: 32px;
    background: #F5F5F5;
    border-radius: 19px;
    background-color:rgba(246, 246, 246, 0.8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .share-earn-price-box {
      display: flex;
      align-items: flex-end;
      padding-left: 138px;
    }
    .share-earn-label {
      font-size: 11px;
      line-height: 11px;
      padding-right: 2px;
      vertical-align: baseline;
      color: #6e6e6e;
    }
    .share-earn-price {
      font-size: 16px;
      line-height: 15px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #ff450c;
    }
    .share-earn-price-fen {
      font-size: 13px;
      line-height: 13px;
    }
    .share-earn-bg {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100%;
      background-image: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      border-radius: 100px;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 19px;
    }
  }
</style>
