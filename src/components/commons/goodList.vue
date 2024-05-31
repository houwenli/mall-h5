<template>
  <div v-if="item" class="shop-card">
    <advert v-if="item.type == 'advert'" :data="item"></advert>
    <saleSetVos v-else-if="item.type == 'sale'" :data="item"></saleSetVos>
    <div v-else @click="toDetails(item)">
      <div v-if="data" class="layout">
        <!-- 商品主图 -->
        <div class="shop-img" ref="shopImg">
          <img v-if="data.baseLabel&&data.baseLabel.url" :src="item.url" alt="" style="height: 100%; width: 100%;object-fit: cover" />
          <img
            v-else
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAAFWBAMAAADAgaiwAAAAFVBMVEX7+/vt7e3w8PD19fXz8/P5+fn39/ejJ1KzAAADyElEQVR42u3dT3PSQBiA8Xe0m/sm2LNE8Iyu5dy0qedQCGcQ4ft/BHezZSWmUqrTLMw8v5mi1Dg8De/mz/SAGGO2tZy7emk7xabKJVi61qlcho1tXcllSIxcym4V2ciNXIq5XMoIiCRSyaVQtL4JJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOXl3Xlf9jXh5y31Q/VyLL3aGtvL2hfk4qiX2c2KrOv9vKeaHHImt9aCAdPbXqptXk+cMzre992qz31uLIfv2q9fUzrQttVfLYe+v69a2JtiZy1Xvr7NWtS+O+l5lvvbe+e3XrWgc9t1693Jq2W2f7bb7mBx7k7b0/obW2tJXVVvW436a1g8fy9pITWufGD2dmjLmReK1iHFtlpWZv2mot9G+ZLCK0do9cHyQ4bB20W68it/rVPjmpNWm1fjKm6LE1LLBy7/5Yq9qYL9oaNK23IrM+W7snhKrTengcVX5PNq2jsux3vw5f17rw20SZ10S/3Jo7vlUVPjpK6+MJrfVut6tdYth8EqW1OKHVLafrpjUZPk1DjNZEn9DqvjJXqELiMELr48utPmzgvhZ6LzUHppX0odAdzx9fUx2edKQ9tIYRyL3hkVZnMIzZ6kcgOzwtpEda1zFbv2jn42Hr4EjrImKr2q8mb/1Ca6a0NwqPg2Ffre98QmuhZcdaC39TM25mx7hLraKP1u4IKNtmC4+0ykx/b/7HY28z0B0BVTpPF93H7gsGy0itV37FtE9fH3+36u716zaJ1LoOZ0ilg9vQmv259G9EJFKrn0+9al/FTlqtWaGdjXYGVau17O04EEYgrDKv2rf602o4ADirVuu9/1l6aQ0j4P/upeJ7jL+8/vA0F01cGmEGuiPQtLRW2sT3j780773f+Dpa6/vQZoUldB1alcucuKqHpx/mNlrrzB9OQ7g3Dq3NTUCV+CUlqrBJ0VoXpbOShiq9u4l7Yu+v3MvP9cA2pn6Tuc4ktC7arefwcbCLzyKzB/F+jMVSG2PM6kw/DzaEXNCH6f6dqqTrLF9ludv205ps/uuF1PJbOa2kJ2pTltP6X0PzkS3t0/wuHd3vXtdbL83dUI9upHf1z1yneWm2pwTX9eabuzvP77cSh30/tbbBo/vp1v+Su0PVy40pbaaV2tCYmrfVcsl5WZbG2RjHPstdpDeyofG5dZ3rI9xkn9Mpod6Z8s7txcBPR2l2tZwnVe8sM3WP9blGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAi/ULMvopqX0wGS4AAAAASUVORK5CYII="
            alt=""
            style="height: 100%; width: 100%; object-fit: cover"
          />
        </div>
        <!-- 内容 -->
        <div class="shop-info" :class="{ 'disable-status': isStatus }">
          <!-- 商品名称 -->
          <div class="shop-info-name" v-if="data.baseLabel">{{ data.baseLabel.name }}</div>
          <!-- 商品副标题-->
          <!-- <div class="shop-info-title" v-if="data.baseLabel.subTitle">{{ data.baseLabel.subTitle }}</div>		  -->

		   		<!-- 商品标签-->
					<div class="shop-info-goodstags"  v-if="data.goodsTagList && data.goodsTagList.length">
						<div v-for="(item, index) in data.goodsTagList.slice(0,2)" :key="index" class="column-info-goodstags-item">
								{{ item.tagName }}
						</div>
					</div>

          <!-- 商品评论 好评率 -->
          <div class="shop-info-evaluate" v-if="data.baseLabel && data.baseLabel.comment">
            <span>{{ data.baseLabel.comment | filterFraction(1) }}评论</span>
            <span v-if="data.baseLabel.applauseRate * 1">
              <span></span>{{ data.baseLabel.applauseRate }}%好评
            </span>
          </div>
          <!-- 商品绩效分-->
          <div class="shop-info-fraction" v-if="isPerformanceScoreLa">
            <img src="@/assets/img/jixiao.png" />
            <span class="performate-point">绩效分:{{ data.performanceScoreLabel.performanceScore | filterFraction }}分</span>
          </div>

          <!-- 优惠券和活动 -->
					<div class="shop-coupon-activty" v-if="couponShowlist && couponShowlist.length">
						<div v-for="(item, index) in couponShowlist" :key="index" class="shop-coupon-activty-item" v-html="item.showFaceValue">
						</div>
					</div>

          <!-- 商品价格 -->
          <div class="shop-info-price" v-if="!storeId">
            <span class="fqz-price" v-if="item.integralPoint > 0">
                <span class="price">{{ item.integralPoint }}</span>
                福气值+<span class="price">{{ item.deductionAfterPrice }}</span>元
            </span>
            <!-- 券后价  -->
            <div class="price" v-else-if="isCouponLable">
              <span class="explain">券后</span>
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(afterCouponPrice)[0] }}</span>
              <span class="decimal" v-if="afterCouponPrice < 10000">.{{ setPrice(afterCouponPrice)[1] }}</span>
              <!-- <div class="tag">{{ data.couponLable.couponsType | filterCoupons(data.couponLable.faceValue) }}</div> -->
            </div>
            <!-- 实售价 ( 活动价 > 万顺售价 ) -->
            <div class="price" v-else>
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(data.finalPrice || data.baseLabel.price)[0] }}</span>
              <span class="decimal">.{{ setPrice(data.finalPrice || data.baseLabel.price)[1] }}</span>
            </div>
            <!-- 原价 （划线价)  实售价取值拼团价或活动价时展示 -->
            <span class="price oldPrice" v-if="isLinePice">
              <div class="line"></div>
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(data.baseLabel.price)[0] }}</span>
              <strong class="decimal">.{{ setPrice(data.baseLabel.price)[1] }}</strong>
            </span>
          </div>
          <div class="shop-info-price" v-else>
            <div class="price">
              <span class="unit">¥</span>
              <span>{{ setPrice(data.baseLabel.baseLabel.price)[0] }}</span>
              <span class="decimal">.{{ setPrice(data.baseLabel.baseLabel.price)[1] }}</span>
            </div>
          </div>
          <!-- 购买人数 -->
          <div class="shop-info-buy" v-if="isCouponLable || data.baseLabel.salesVolume">
            <span class="price oldPrice" v-if="isCouponLable">
              <span class="unit">¥</span>
              <span class="intPice">{{ setPrice(data.finalPrice || data.baseLabel.price)[0] }}</span>
              <strong class="decimal">.{{ setPrice(data.finalPrice || data.baseLabel.price)[1] }}</strong>
            </span>
            <span v-if="data.baseLabel.salesVolume">{{ data.baseLabel.salesVolume | filterFraction(1) }}人已买</span>
          </div>
          <!-- 活动 -->
          <div class="shop-info-active" v-if="isMarkIngLabel" :class="{ 'not-margin': !(isCouponLable || data.baseLabel.salesVolume) }">
            <img class="hot-icon" :src="hotIcon" />
            <span class="active-text">
              <!-- {{ data.markIngLabel[0].label }} -->
              {{ data.thematicLabel.subjectLabel }}
            </span>
            <img class="arrow-right-icon" :src="arrowRightIcon" />
          </div>

          <!-- 分销分享按钮 -->
          <div v-if="showSharebt" class="share-earn-bt" @click.stop="$emit('shareComm', item)">
            <div class="share-earn-label">预估佣金</div>
            <div>
              <span class="share-earn-price share-earn-price-yuan">{{ item.commissionAmount ? item.commissionAmount.toFixed(2).split('.')[0] : '0' }}</span><span class="share-earn-price share-earn-price-fen">{{ item.commissionAmount ? '.' + item.commissionAmount.toFixed(2).split('.')[1] : '.00' }}</span>
            </div>
          </div>
				</div>
			</div>
    </div>
  </div>
</template>
<script>
  import { formatPrice } from '@/utils/utils'
  import saleSetVos from './saleSetVos.vue'
  import advert from './advert.vue'
  import { Overlay } from 'vant'

  export default {
    name: 'goodItem',
    inject: ['reload'],
    components: {
      saleSetVos,
      advert,
      [Overlay.name]: Overlay,
    },
    props: {
      item: {
        type: Object,
        default: () => {},
      },
      //热销榜单
      isIndex: {
        type: Boolean,
        default: false,
      },
      detailShow: {
        type: Boolean,
      },
      //是否是【我的店铺】列表页
      storeId: {
        default: '',
      },
      //分享分销商品信息
      promoteInfo: {
        type: Object,
        default: () => {},
      },
      //是否展示商品状态
      isStatus: {
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
        hotIcon: this.$smartImg + '/home/icon_sl_huodong.png',
		arrowRightIcon: this.$smartImg + '/home/icon_sl_right.png'
      }
    },
    computed: {
      afterCouponPrice(){
        let couponLable = this.data.couponLable || [];
        let coupon = couponLable.find(ele=>{ return ele.checked })
        return coupon && coupon.afterCouponPrice
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
						// if(obj.couponLable){
						// 	couponlist = [...couponlist, ...obj.couponLable.slice(0,1)]
						// }
					} else if([4, 5].includes(obj.markIngLabel[0].ruleType)){
						// 满减或满折活动，商品参加满减或满折活动，显示活动标签为2个，取基数较小的2个标签，显示为【满200减20】，【满300减30】或【满200打8折】，【满300打7折】
						if(obj.markIngLabel && obj.markIngLabel[0].tiredPricingList.length){
							// couponlist =  obj.markIngLabel[0].tiredPricingList.slice(0, 2)
							couponlist =  obj.markIngLabel[0].tiredPricingList.slice(0, 1)
							couponlist.forEach(item=>{
								if(obj.markIngLabel[0].ruleType == 4){
									item.showFaceValue = `满<span style='font-weight:bold;'>${item.amountLimitation}</span>减<span style='font-weight:bold;'>${item.faceValue}</span>`
								} else {
									item.showFaceValue = `满<span style='font-weight:bold;'>${item.amountLimitation}</span>打<span style='font-weight:bold;'>${item.faceValue}</span>折`
								}
							})
						} else if(obj.couponLable){
							couponlist = [...obj.couponLable.slice(0,1)]
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
        return this.data && this.data.couponLable && this.data.couponLable.length!=0 && this.data.couponLable[0].afterCouponPrice
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
        return this.data.finalPrice && this.data.baseLabel.price != this.data.finalPrice && !this.data.couponLable
      },

      // 显示分销分享按钮
      showSharebt() {
        return this.$route.path != '/search' && this.$route.query.from == '/distributionActivity' && !this.$route.query.promoteInfo
      }
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
        if (this.$route.path === '/' && this.data && this.data.thematicLabel && this.data.thematicLabel.templateCode == 107) {
          this.$router.push({ path: '/ranking', query: { id: item.skuLable.thematicLabel.id, spuId: item.spuId } })
          return
        }

        let id = item.id || item.skuId || ''
        if (id !== 0 && !id) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        } else {
          let path = '/spudetail'
          let query = { id, storeId: this.storeId, sourceType: 2 }
          if(item.goodsSource == 4) {
            path = '/motorCar/detail',
            query = {skuId: id}
            if(this.storeId) {
              query = {skuId: id, sourceType: 2, storeId: this.storeId,}
            }
          } else {
            if (this.$route.query.from=='/distributionActivity') {
              const isDistribution = this.showSharebt
              return  this.$router.push({ path: '/spudetail', query: { sourceType: item.sourceType || 1,id, isDistribution, promoteInfo: this.$route.query.promoteInfo } })
            }
            if (this.detailShow) {
              query = { id, storeId: item.storeId, sourceType: item.sourceType || 1 }
              this.$router.push({ path, query })
              this.reload()
            } else if(!this.storeId){
              query = { id, storeId: item.storeId, sourceType: item.sourceType || 1 }
            }
          }
            this.$router.push({ path, query })
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
    z-index: 2;
    width: calc(~'100% - 5.5px');
    border-radius: 12px;
    margin-bottom: 10px;
    overflow: hidden;
    .shop-info {
      position: relative;
      padding: 5px 8px 10px 8px;
      width: 100%;
      text-align: left;
      background-color: #fff;
      overflow: hidden;
      // 商品名称
      .shop-info-name {
        margin-bottom: 4px;
        color: #000000;
        text-align: left;
        max-height: 42px;
        font-size: 14px;
        // font-weight: bold;
        /* 超出两行隐藏 */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      // 副标题
      .shop-info-title {
        margin-bottom: 6px;
        color: #e3903f;
        text-align: left;
        font-size: 11px;
        height: 16px;
        // font-weight: bold;
        /* 超出隐藏 */
        overflow: hidden;
      }
	  // 商品标签
	  .shop-info-goodstags{
      display: flex;
      align-items: center;
		margin-bottom: 4px;
        flex-wrap: wrap;
		.column-info-goodstags-item{
		margin-right: 4px;
		border-radius: 4px;
		background-color: #fDF8E6;
		font-size: 10px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FF450C;
		line-height: 14px;
		padding: 0px 6px;
		}
		&:last-of-type {
			margin-right: 0;
		}
	}
      // 评价
      .shop-info-evaluate {
        margin-bottom: 6px;
        display: flex;
        overflow: hidden;
        width: 100%;
        font-size: 11px;
        color: #999999;
        span:nth-child(2) {
          display: flex;
          align-items: center;
          span {
           margin: 0 4px;
           width: 1px;
           height: 12px;
           background-color: #C3C3C3;
          }
        }
      }
      // 绩效分
      .shop-info-fraction {
        display: flex;
        align-items: center;
        padding: 0 4px 0 0;
        margin-bottom: 5px;
        overflow: hidden;
        font-size: 11px;
        color: #008864;
        background: linear-gradient(90deg, #ecfffc 0%, #f4faff 100%);
        border-radius: 4px;
        img {
          width: 16px;
          height: 16px;
        }
      }
      .shop-info-price,
      .shop-info-buy {
        display: flex;
        -webkit-box-align: end;
        align-items: baseline;
        .intPice {
          font-weight: bold;
        }
        .unit,
        .decimal,
        .explain {
          font-size: 10px;
          font-weight: bold;
          font-family: 'AlternateBold';
        }
        .price {
          display: flex;
          -webkit-box-align: end;
          align-items: baseline;
        }
        .oldPrice {
          position: relative;
          font-size: 13px;
          color: #c3c3c3;
          transform: scale(0.92);
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
        }
      }
      // 价格
      .shop-info-price {
        display: flex;
        align-items: baseline;
        line-height: 24px;
        color: #FF450C;
        font-weight: bold;
        font-size: 20px;
        margin-top: 4px;
        .fqz-price {
          display: flex;
          font-size: 10px;
          align-items: baseline;
          font-weight: 400;
          .price{
            font-size: 20px;
            font-weight: bold;
          }
    }
        .explain {
          font-weight: 400;
        }
        .tag {
          height: 18px;
          line-height: 18px;
          border-radius:0  9px 9px 0;
          padding: 0px 6px 0px 8px;
          color: #fff;
          font-size: 10px;
          font-weight: 400;
          background-image: url('../../assets/img/youhuiquan.png');
          background-size: 100% 100%;
        }
        .afterCouponPrice {
          display: flex;
        }
      }
      // 购买人数
      .shop-info-buy {
        display: flex;
        font-size: 10px;
        color: #c3c3c3;
        .oldPrice {
          margin: 0 4px 0 0;
        }
        .intPice {
          margin-left: 2px;
        }
      }
      // 活动
      .shop-info-active {
        height: 24px;
		background: #FFEDF0;
		border-radius: 14px;
		background: #FFEDF0;
		margin-top:8px;
		// padding: 0 8rpx;
		display: flex;
		align-items: center;
		line-height: 24px;
		font-size: 10px;
		background: linear-gradient(to right, #F4FAFF 0%, #FFE8E8 10%, #FFF9E9 71%, #fef1e9 100%);
		.active-text {
			flex: 1;
			font-size: 10px;
			color: #FF0A35;
			line-height: 15px;

			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
		.hot-icon {
			flex-shrink: 0;
			width: 16px;
			height: 16px;
			margin:0px 3px 0px 4px;
		}
		.arrow-right-icon {
			flex-shrink: 0;
			width: 6px;
			height: 6px;
			margin-right: 8px;
		}
      }
      .not-margin{
        margin-top: 0px;
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
		}
		&-item:last-of-type{
			margin-right: 0;
		}
	  }
    }
    .shop-img {
      background-color: #fff;
      // width: 172px;
      width: 100%;
      height: 170px;
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

  // 分销商品
  .distribution_div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .distribution_gain {
      background: linear-gradient(290deg, rgba(254, 103, 128, 0.12) 0%, rgba(255, 22, 61, 0.12) 100%);
      border-radius: 2px;
      color: #fd302c;
      padding: 0 4px;
      line-height: 14px;
      font-size: 10px;
    }

    .distribution_buy {
      font-size: 12px;
      width: 60px;
      // height: 20px;
      background: #fd302c;
      border-radius: 4px;
      color: #ffffff;
      line-height: 12px;
      padding: 4px 0;
      text-align: center;
      font-weight: bold;
    }
  }
  .share-earn-bt {
    position: relative;
    margin-top: 8px;
    overflow: hidden;
    padding-left: 8px;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    height: 32px;
    border-radius: 16px;
    font-size: 11px;
    color: #6e6e6e;
    background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/share_earn_bg.png') no-repeat;
    background-size: 100% 100%;
    white-space: nowrap;
    .share-earn-label {
      font-size: 11px;
      line-height: 15px;
      padding-right: 2px;
      vertical-align: baseline;
    }
    .share-earn-price {
      font-size: 16px;
      line-height: 20px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #ff450c;
    }
    .share-earn-price-fen {
      font-size: 13px;
      line-height: 15px;
    }
    .share-earn-bg {
      position: absolute;
      right: 8px;
      font-weight: 600;
      line-height: 32px;
      font-size: 13px;
      color: #fff;
      text-align: center;
    }
  }
</style>
