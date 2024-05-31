<template>
  <div class="boxwrapper" ref="boxwrpper" :class="[returntop ? 'backtopactive' : '']">
    <!--地图定位-->
    <el-amap :plugin="plugin"></el-amap>
    <load-more style="margin: 50% auto" v-if="loading" tip="正在加载"></load-more>
    <div v-else>
      <div v-if="showIndex == 0">
        <div id="headerwrapper" class="headerwrapper defaultimg">
          <!-- header1 -->
          <header class="headerbox">
            <div class="search-left" @click="toBack">
              <span class="iconback">
                <i class="backimg"></i>
              </span>
            </div>
            <group class="search-group">
              <tab v-model="spuTabIndex" custom-bar-width="2.4rem" class="header-tabBar">
                <tab-item @click.native="toPage">商品</tab-item>
                <tab-item @click.native="toPage">评价</tab-item>
                <tab-item @click.native="toPage">详情</tab-item>
              </tab>
            </group>
            <div class="carbox">
              <div @click="toCart" class="header-cart-icon">
                <badge :text="carNum" class="car" :class="[carActive == 2 ? 'car2' : carActive == 3 ? 'car3' : '']"></badge>
              </div>
            </div>
          </header>
        </div>

        <div ref="spuPage" style="margin-bottom: 2rem; padding-top: 0px; position: relative">
          <swiper :list="carouselPics" :aspect-ratio="1" :show-desc-mask="false" :show-dots="carouselPics.length > 1" dots-position="center"></swiper>

          <!-- 售罄 -->
          <div v-if="sellOut === 1" class="soldout"><img src="@/assets/img/cat_soldout@2x.png" alt="" /></div>


          <!-- 飞入购物车的商品 -->
          <transition appear @before-appear="beforeEnter" @after-appear="afterEnter" v-if="showFlySpu">
            <div class="fly_spuImg">
              <img :src="carouselPics[0].img" alt width="100%" style="border-radius: 50%" />
            </div>
          </transition>

          <!-- 价格和促销-->
          <div class="details-colortype">
            <div class="fourth-cells">
              <div class="fourth-cell">
                <div v-if="isShowPrice()" class="product-price price_p">
                  <span class="spu_price" v-if="shelvesStatus == '1'">
                    <span style="font-size: 18px; margin-top: 7px">¥</span>
                    <span style="font-size: 1.2rem">{{ spu.price ? spu.price.toFixed(2) : 0 }}</span>
                    <span class="spu_price_btn" v-if="isShowCouBtn">
                      <div>
                        <span>券后¥</span>
                        <span class="couPrice">{{ discountsPrice ? discountsPrice.toFixed(2) : '' }}</span>
                      </div>
                    </span>
                  </span>
                  <span class="no-price" v-else>暂无报价</span>

                  <div class="icons-wrap">
                    <!-- Todo 分享按钮隐藏 -->
                    <div class="icon-share" @click="handleShare">
                      <img src="@/assets/img/icon-share@2x.png" alt />
                      <p>分享</p>
                    </div>
                    <span class="favouritebox">
                      <img src="@/assets/img/favourite2_2.png" alt v-if="!favourite" @click="favouriteChange" />
                      <img src="@/assets/img/favourite2_1.png" alt v-else @click="favouriteChange" />
                      <label>{{ favoriteText }}</label>
                    </span>
                  </div>
                </div>
                <!--有促销价或者用户价格则显示原价  但是预售不显示原价-->
                <div style="color: #999999; font-size: 0.48rem; margin: -0.32rem 0 0.14rem">
                  <del v-if="(spu.marketingPrice || spu.memberPrice) && preMarketing == null && shelvesStatus == '1'">¥{{ spu.oldPrice.toFixed(2) }}</del>
                </div>
                <div class="activebox" v-if="spu.marketingVos && shelvesStatus == '1'">
                  <!-- 直降 -->
                  <template v-for="r in spu.marketingVos">
                      <label class="downpricebox" v-if="r.type == 1"  :key="r.id">
                      <img src="../../assets/img/icon_pc@2x.png" class="pricedownimg" alt="" />
                      <span class="downprice">{{ r.fall.price }}元</span>
                  </label>
                  </template>
                  
                  <!-- 买送-->
                  <template v-for="r in spu.marketingVos">
                    <label class="buygivebox border_half" v-if="r.type == 12"  :key="r.id">
                      {{ r.name }}
                    </label>
                  </template>
                </div>

                <div class="product-title">
                  {{ spu.name }}
                </div>
                <div class="product-sub">{{ spu.subTitle }}</div>

                <div v-if="this.spu.isBatchSku == 1" class="product-price clearfix">
                  <div v-for="(item, index) in this.spu.skuBatchList" :key="index" style="margin-right: 0.4rem" class="fll">
                    <p>
                      <span>¥{{ item.batchPrice.toFixed(2) }}</span>
                    </p>
                    <del v-if="spu.marketingPrice" style="margin: 0; display: block">¥{{ item.oldBatchPrice.toFixed(2) }}</del>
                    <p style="font-size: 0.56rem">{{ item.batchInterval }}件</p>
                  </div>
                </div>

              </div>


            </div>
          </div>



          <!-- 优惠券-->
          <group style="margin-top: 0.4rem" class="coupons" v-if="couponList.length > 0 || fullGift">
            <cell
              value=""
              @click.native="couponListVisible = true"
              style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start"
            >
              <div class="coupons-title">优惠</div>
              <div class="coupons-content">
                <div class="promotion-item" v-if="couponList.length > 0">
                  <!-- <span style="color: #000;font-weight: bold;margin-left: -4px;">优惠</span> -->
                  <span style="height: 14px; line-height: 11px; border-radius: 2px; border: 1px solid #e60113; display: inline-block; margin-left: 18px">
                    <span style="font-size: 12px; color: #e60113; transform: scale(0.83); height: 13.25px; line-height: 13.25px; display: inline-block">
                      领券
                    </span>
                  </span>

                  <span style="margin-left: 0.48rem">
                    <template v-for="(item, index) in couponList">
                      <i :key="index" v-if="index <= 2">
                      <span style="transform: scale(0.83); display: inline-block; height: 19.27px; line-height: 19.27px" v-if="item.type == 1">
                        满{{ item.couponFull.fullPrice }}减{{ item.couponFull.price }}
                      </span>
                    </i>
                    </template>
                  </span>
                </div>
                <p style="height: 14px; line-height: 14px; display: flex; align-items: center" v-if="fullGift">
                  <!-- <span style="color: #000;font-weight: bold;" v-if="couponList.length == 0">优惠</span> -->
                  <span style="height: 14px; line-height: 11px; border-radius: 2px; border: 1px solid #e60113; display: inline-block; margin-left: 18px">
                    <span style="font-size: 12px; color: #e60113; transform: scale(0.83); height: 13.25px; line-height: 13.25px; display: inline-block">
                      赠品
                    </span>
                  </span>
                  <span style="max-width: 9.5rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-left: 0.48rem; color: #000">
                    {{ giftName }}
                  </span>
                </p>
              </div>
            </cell>
          </group>



          <!--运费-->
          <group style="margin-top: 0.4rem" class="chooseInfo" label-align="left">
            <!-- <cell :title="chosenSpecAndNum" is-link @click.native="toShowSpecValues(1, 0)"></cell> -->
            <cell title="已选" is-link @click.native="toShowSpecValues(1, 0, 0)" :value="chosenSpecAndNum" value-align="left"></cell>
            <popup-picker @on-change="addressChange()" :data="areas" :columns="3" v-model="addressValue" show-name class="location">
              <div slot="title">
                <div class="address-icon-wrap">送至</div>
              </div>
            </popup-picker>
            <cell value-align="left">
              <div slot="title">运费</div>
              {{ freight.toFixed(2) != 0.0 ? freight.toFixed(2) + '元' : '免运费' }}
            </cell>
            <cell value-align="left" :value="services" v-if="services">
              <div slot="title">服务</div>

            </cell>
          </group>

          <div ref="assessPage" style="position: relative; top: -1.36rem"></div>
          <!--商品评价-->
          <div style="margin-top: 0.4rem" ref="commentBox">
            <group class="commenbox">
              <span class="commom_shu"></span>
              <cell
                title="暂无评价"
                is-link
                @click.native="toMoreComments"
                :value="'(' + commentSummarize.allCommentCount + ')'"
                value-align="left"
                v-if="commentSummarize.allCommentCount <= 0"
                class="noneComment"
              ></cell>
              <!-- title="评价" -->
              <cell
                :title="commenttitle"
                is-link
                @click.native="toMoreComments"
                :value="'(' + commentSummarize.allCommentCount + ')'"
                value-align="left"
                v-else
                class="pl_box hasComment"
              >
                <span class="pl_hpd">好评度{{ (commentSummarize.goodCommentCount / commentSummarize.allCommentCount).toFixed(2) * 100 + '%' }}</span>
              </cell>

              <div class="assess-wrapper" v-if="commentSummarize.allCommentCount > 0">
                <group class="friends-item" v-for="(item, index) in comments" :key="index">
                  <!-- <cell :value="item.createTime" title="评论"> -->
                  <cell class="pl_header">
                    <div slot="title" class="header">
                      <img v-if="item.customerImage" :src="item.customerImage" class="pl_headerimg" alt />
                      <img src="../../assets/img/Avatar_default.png" alt v-else class="pl_headerimg" />
                      <div class="username">{{ item.relename ? item.relename : item.customerName.substr(0, 3) + '****' + item.customerName.substr(7) }}</div>
                      <div class="commstar commstarList">
                        <a class="commstar_star star1" :class="item.score <= '1' ? 'active' : ''"></a>
                        <a class="commstar_star star2" :class="item.score > '1' && item.score <= '2' ? 'active' : ''"></a>
                        <a class="commstar_star star3" :class="item.score > '2' && item.score <= '3' ? 'active' : ''"></a>
                        <a class="commstar_star star4" :class="item.score > '3' && item.score <= '4' ? 'active' : ''"></a>
                        <a class="commstar_star star5" :class="item.score > '4' && item.score <= '5' ? 'active' : ''"></a>
                      </div>
                    </div>
                  </cell>
                  <cell :title="item.comment" class="commentContent" @click.native="toMoreComments"></cell>

                  <div class="comments-img" v-if="item.commentPics.length > 0">
                    <div class="previewerImg" v-for="(element, imgIndex) in item.commentPics" :key="imgIndex">
                      <img :src="element.url" @click.native="showImg(index, imgIndex)" />
                    </div>
                  </div>

          <!--店铺评价-->
          <div class="shop-detail">
            <div class="shop-main">
              <div class="shop-logo">
                <img :src="spu.storeScore.storeInfo.avatarPicture" v-if="spu.storeScore.storeInfo.avatarPicture" />
                <img src="../../assets/img/shopIcon.png" v-else />
              </div>
              <div class="shop-name">
                <p class="name">{{ spu.storeName }}</p>
                <p class="shop_gz">{{ spu.storeScore.storeInfo.followNum }}人关注</p>
                <p class="shop_star">
                  <span>
                    <i>综合体验</i>
                    <van-rate v-model="ratestar" class="retebox" readonly />
                  </span>
                </p>
              </div>
              <div class="gostorebox">
                <span class="gostore" @click="gostore(spu.storeScore.storeInfo)">进店</span>
              </div>
            </div>

          </div>



          <div ref="detailPage" style="position: relative; top: -1.64rem"></div>

          <!-- 商品详情   min-height: 85vh;-->
          <div class="tab-details" style="margin-top: 0.4rem" ref="detailBox">
            <p class="xq_title">
              <span class="xq"></span>
              <span style="vertical-align: top">详情</span>
            </p>
            <p class="xq_spjs" v-if="spu.video">商品介绍</p>
            <!-- 商品介绍 -->
            <div>
              <div class="clearfix">
                <video
                  controls
                  v-if="spu.video"
                  style="width: 100%; height: 9rem; object-fit: fill"
                  :src="spu.video"
                  :poster="spu.videoPic"
                  webkit-playsinline="true"
                  x-webkit-airplay="true"
                  playsinline="true"
                  x5-video-player-type="h5"
                  x5-video-orientation="h5"
                  x5-video-player-fullscreen="true"
                  preload="auto"
                ></video>
                <span v-html="spu.mobileDesc"></span>
              </div>
            </div>
          </div>
          <!-- 商品规格 -->
          <div class="tab-details xq_spgg" style="margin-top: 0.4rem">
            <p class="xq_spjs">商品规格</p>
            <div class="clearfix">
              <table class="table-border" width="100%">
                <tbody v-if="!showup">
                <tr v-for="(attribute, index) in spuAttributeValuesdata" :key="index">
                  <td style="color: #999">{{ attribute.attributeName }}</td>
                  <td style="color: #666">{{ attribute.attributeValue }}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr v-for="(attribute, index) in allspuAttributeValuesdata" :key="index">
                  <td style="color: #999">{{ attribute.attributeName }}</td>
                  <td style="color: #666">{{ attribute.attributeValue }}</td>
                </tr>
                </tbody>
              </table>
              <div class="updownBox" v-if="allspuAttributeValuesdata.length > 7">
                <p class="updown">
                  <span class="up" :class="[showup ? 'upimg' : 'downimg']" @click="showdown">{{ downOrup }}</span>
                  <!-- <img src="@/assets/img/down.png" alt="" /> -->
                </p>
              </div>
            </div>
          </div>

          <!-- 热销商品 -->
          <div class="xq_wntj" style="margin-top: 0.4rem">
            <shopList :title="'热销商品'" :detailShow="detailShow"></shopList>
          </div>
        </div>

        <div class="tips" v-if="spu.isGift == 1 && shelvesStatus == '1'">抱歉,该商品不支持单独购买</div>
        <!-- 底部的购买 -->
        <section class="actionbar footerbox">
          <span class="sell-out" v-if="shelvesStatus !== '1'">抱歉，该商品已下架</span>
          <div class="action-list">
            <ul class="action-other">
              <li class="item favourite" @click="gostore(spu.storeScore.storeInfo)">
                <img src="@/assets/img/Shop2.png" alt />
                店铺
              </li>
              <li class="item service" @click="callUp">
                <img src="@/assets/img/service2.png" alt />
                客服
              </li>
            </ul>

            <a
              v-if="preMarketing == null && groupMarketing == null && !sellOut && spu.isGift != 1 && shelvesStatus == '1'"
              @click="toShowSpecValues(1, 0, 1)"
              class="item footerCommon"
            >
              加入购物车
            </a>
            <a
              v-if="(preMarketing == null && groupMarketing == null && sellOut) || spu.isGift == 1 || shelvesStatus != '1'"
              class="item footerCommon btn-disabled"
            >
              加入购物车
            </a>

            <a
              v-if="groupMarketing == null && !sellOut && spu.isGift != 1 && shelvesStatus == '1'"
              @click="toShowSpecValues(1, 0, 2)"
              class="item addtocart footerCommon buy"
            >
              <!-- {{ preMarketing && preMarketing.type == '7' ? '支付定金' : '立即购买11111' }} -->
              <p>{{ isShowCouPri ? '领券购买' : '立即购买' }}</p>
              <p v-if="isShowCouPri">券后{{ discountsPrice ? discountsPrice.toFixed(2) : '' }}元</p>
            </a>
            <a v-if="(groupMarketing == null && sellOut) || spu.isGift == 1 || shelvesStatus != '1'" class="item addtocart footerCommon buy btn-disabled">
              {{ preMarketing && preMarketing.type == '7' ? '支付定金' : '立即购买' }}
            </a>

            <a v-if="groupMarketing != null" class="item addtocart footerCommon" @click="toShowSpecValues(0, 0)">
              <p>¥{{ spu.price ? spu.price.toFixed(2) : 0 }}</p>
              <p>单独购买</p>
            </a>
            <a v-if="groupMarketing != null" class="item buy footerCommon" @click="toShowSpecValues(0, 1)">
              <p>¥{{ groupMarketing.groupMarketing.price ? groupMarketing.groupMarketing.price.toFixed(2) : 0 }}</p>
              <p>发起拼单</p>
            </a>
          </div>
        </section>
      </div>

      <!--商品组合列表-->
      <combination v-if="showIndex == 1" :spu="spu" :combination="combinations" @back="combinationBack" />

      <!--促销详情-->
      <!-- <popup v-model="promotionVisible" height="60%" position="bottom" style="background: #fff; padding: 0.6rem 0">
        <div style="text-align: center; font-size: 0.56rem; color: #666">促销</div>
        <div class="extra-info" style="background: none; padding: 0 0.8rem">
          <ul class="promotion-info">
            <li v-for="(item, index) in spu.marketings" :key="index">
              <ul v-if="item.type == '2'" style="width: 100%">
                <li v-for="(fullGift, num) in item.fullGifts" :key="num">
                  <i>{{ marketType[item.type] }}</i>
                  满{{ fullGift.fullPrice.toFixed(2) }}赠
                  <ul class="clearfix" style="width: 100%; padding-left: 1.96rem; margin-top: 0.2rem">
                    <li class="clearfix" v-for="(giftSkuInfo, i) in fullGift.giftSkuInfos" :key="i">
                      <div style="width: 90%" class="text-clamp1 fll">{{ giftSkuInfo.sku.name }}</div>
                      <div style="width: 10%; text-align: right" class="flr">×{{ giftSkuInfo.num }}</div>
                    </li>
                  </ul>
                </li>
              </ul>
              <div v-if="item.type != '2'">
                <i>{{ marketType[item.type] }}</i>
                {{ item.marketingDesc }}
              </div>
            </li>
          </ul>
        </div>
      </popup> -->

      <!--拼单订单列表-->
      <!-- <popup v-if="groupMarketing" v-model="groupOrderListShow" height="60%" position="bottom" style="background: #fff; padding: 0.6rem 0">
        <div style="text-align: center; font-size: 0.56rem; color: #666">正在拼团</div>
        <div v-for="(groupOrder, index) in groupOrderInfos" :key="index" v-if="index <= 9" class="pin_box clearfix">
          <div class="pin_info">
            <img alt :src="groupOrder.customerPic" />
            <p>{{ groupOrder.customerName }}</p>
          </div>
          <div class="pin_right">
            <ul>
              <li>
                还差
                <span>{{ groupMarketing.groupMarketing.groupNum - groupOrder.groupMemberOrders.length - 1 }}人</span>
                拼成
              </li>
              <li>
                剩余
                <clocker format="%H : %M : %S" :time="getGroupBuyEndTime(groupOrder.payTime)"></clocker>
              </li>
            </ul>
            <div class="pinList_btn" @click="toGroupDetail(groupOrder)">去拼单</div>
          </div>
        </div>
        <divider style="margin: 0 1.6rem">仅显示10个正在拼单的人</divider>
      </popup> -->

      <!-- 拼团详情-->
      <!-- <popup
        v-if="currentGroupOrder != null && groupMarketing"
        v-model="groupOrderDetailShow"
        position="top"
        style="top: 50%; margin-top: -4rem; overflow: scroll"
        is-transparent
      >
        <div style="width: 80%; margin: 0 auto; background: #fff; position: relative; border-radius: 0.16rem">
          <div class="pin_close" @click="groupOrderDetailShow = false"></div>
          <ul class="pin_main">
            <li style="font-size: 0.6rem">参与{{ currentGroupOrder.customerName }}的拼团</li>
            <li style="color: #666">
              仅剩
              <em style="color: #d00">{{ groupMarketing.groupMarketing.groupNum - 1 - currentGroupOrder.groupMemberOrders.length }}个</em>
              名额，
              <clocker format="%H : %M : %S" :time="getGroupBuyEndTime(currentGroupOrder.payTime)"></clocker>
              后结束
            </li>
            <li class="clearfix" style="text-align: center; margin-top: 0.4rem">
              <div class="pin_user">
                <img :src="currentGroupOrder.customerPic" />
                <span>拼主</span>
              </div>
              <div v-for="(member, index) in currentGroupOrder.groupMemberOrders" :key="index" class="pin_user">
                <img :src="member.customerPic" />
              </div>
              <div v-for="(n, i) in groupMarketing.groupMarketing.groupNum - 1 - currentGroupOrder.groupMemberOrders.length" :key="i" class="pin_user no_user">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE2NTBERUY5RjJDNDExRTc4MTgzRTcyRUU4MUQ0RjZCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE2NTBERUZBRjJDNDExRTc4MTgzRTcyRUU4MUQ0RjZCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTY1MERFRjdGMkM0MTFFNzgxODNFNzJFRTgxRDRGNkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTY1MERFRjhGMkM0MTFFNzgxODNFNzJFRTgxRDRGNkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4i9Cd/AAAEtUlEQVR42uydXYgWVRyHz7u6rqGJG9mmWKIoLpkF4UVJwhIKJoF4I36AiKw3KiReFCbddFNIIEWhRFGBISoisSFGiQuKoN74AbtIiZCZu22CktSuH/v6+zNHcrczs++qF7PnPA/82HdnxoGd88yZ/zkz71ipVqsO0qWCAAjAUUAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAgMdJe3v7UJuMU15RXlbmKc3KE8qzyhilT+lWLul4nK5UKh36fEq5UrTTlpaWEX/sRkcueL2yXFmlLFCeLNi2SXlJjb/U/35eaVO+UX6J9QDVRdz4Lyh7lW+VJUM0foi5ynvKT8paBBhZvKX8oCxTRj3ivqYpXys7lLGxHagYLwHzla+UZwq26dG1vkPd/V/6fEdp1O/T9ftMq4ty/s1mf7y2KLcRoJw8p3yR1/jW6PqxUw192CRQ/rHF/sxutAJR27Rq/ZKc/W9SLivbuQSUcESjvKPMyVm/Ww27WD8/U35Vbvgz2XqAm75hD2qbZZJggz5fz9nPu8rrCFA+Xi0o1r5TWn0jF6LGvyUJdtr2+nwjsMlTytux1AMxCWDDvfGB5Wd9z9A3zP0dkAgf5Kx7w48SEKAkTFUWBpbfVT5X/njI/e5Sjuf0Aq8hQHmwGb7ZgeUX1I1/P6BQqFSKC4mB661I3J+z6YsIUB5s+FYfuJ4fU4P+WVMFmS+GTQTdCiyfgQDlYV5Oox6ptcHtnkhOrivXAnJNYh6gPOzxQ7spSpMax2qCiWrkczVU/UNt0h/qAbTvHgQoD4d8jAaX3f2zYVrXI3T997EJotDE0u8IUE76HmLIV8Qil906HkwnNUD82CVlfWC5zRyeRIC4sd7xQxee8DmKAHFjTwl9rKwJrLOC0CaX/kWAeBv/I5fN94dGDDY7+HNM3RwMbPztocb3I4Yf9WOby6aYESAynlY+cdnzgyHsIdGNvgB0CBAXk132FNGbOevP+HrgYmx/ODVAdmfvy4LGt4p/pXIh1qFOlNQww2fYDaRPXfbUcAh7sNQeJOmO9TjVJdz4hj36tTpU7St2f2FdzI2feg1gEzxbcwTa7bIZwN7YD0KqNYD93Wtd9m2gwWd/m+8ZelM5ECliX/ZYEWj8Lp399tTv3ymdCSliD5BMCXT9NhTsTOlApCpA6IFOewS8LcVrYYp/86zA8t9iHesjwKCeXpkQWH4tpWt/ysPAsS7wrR4VgFddRDd56AGKpZ8YWJ7ku3JS7AFu6mzf57IvdvT6S0KDRgAnEGCEMsz3HFk3/76DpIeBEFMPMIybP0APAKkXgc+7/14eVX1gbsBqg4MumxBCgIiLwGZdMna4/78MSrupdqYmQIqXgH4XnvC569dRAyRAtcZlCAAIEBuVnNpntMt/SSRFYETYuwHtDaH1D1zz6/zy28mdDfx/AWmDAAiAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgApeKeAAMA8gDs9JNDPv8AAAAASUVORK5CYII="
                />
              </div>
            </li>
            <li>
              <div class="pin_btn" @click="toJoinGroup()">参与拼单</div>
            </li>
          </ul>
        </div>
      </popup> -->

      <!--选择优惠券的弹窗-->
      <!-- <popup
        v-model="couponListVisible"
        height="60%"
        position="bottom"
        style="padding: .6rem; background: #f7f7f7"
      >
        <div style="text-align: center; font-size: 0.56rem; color: #666">优惠券</div>
        <div class="couponlist" v-if="spu.coupons">
          <div
            v-for="(item, index) in spu.coupons"
            :key="index"
            class="couponbox"
            :class="item.runOut ? 'disabledCoupon' : ''"
          >
            <ul>
              <li>
                <span>¥</span>
                <i>{{ item.type == 1 ? item.couponFull.price.toFixed(2) : item.couponFall.price.toFixed(2) }}</i>
              </li>
              <li>
                <p>{{ item.storeId == 0 ? '商城自营' : item.storeName }}</p>
                <p>{{ item.type == 1 ? '满' + item.couponFull.fullPrice + '元使用' : '使用立减' }}</p>
              </li>
            </ul>
            <div class="clearfix">
              <p class="fll">{{ item.startTime.split(' ')[0] }} -- {{ item.endTime.split(' ')[0] }}</p>
              <p class="flr">
                <span
                  class="quan_btn"
                  @click="item.runOut ? '' : receiveCoupon(item.id)"
                >{{ item.runOut ? '已领完' : '立即领取' }}</span>
              </p>
            </div>
          </div>
        </div>
      </popup> -->
      <van-popup v-model="couponListVisible" closeable close-icon="close" round position="bottom" :style="{ height: '532px', padding: '0.64rem 0.72rem' }">
        <div style="text-align: center; font-size: 16px; color: #000; font-weight: 600">优惠</div>
        <div style="height: 475px; overflow: scroll">
          <p style="padding: 20px 0 18px; color: #999999; font-size: 14px" v-if="fullGift">促销</p>
          <div class="gift" v-if="fullGift">
            <div v-for="(item, index) in fullGift.fullGiftList" :key="index">
              <div class="gift-box">
                <p>
                  <span style="width: 29px; height: 14px; line-height: 11px; border-radius: 2px; border: 1px solid #e60113; display: inline-block">
                    <span style="font-size: 12px; color: #e60113; transform: scale(0.83); height: 13.25px; line-height: 13.25px; display: inline-block">
                      赠品
                    </span>
                  </span>
                  <span style="font-size: 14px; color: #e60113; margin-left: 6px">
                    <span v-if="item.fullPrice">满{{ item.fullPrice }}赠</span>
                    (赠完为止)
                  </span>
                </p>
                <div class="gift-contentbox" v-if="item.giftSkuInfos.length <= 2">
                  <div class="gift-detail" v-for="(i, k) in item.giftSkuInfos" :key="k">
                    <div class="gift-img">
                      <img :src="i.url" alt="" style="width: 100%; height: 100%" @click="toSpuDetail1(i)" />
                      <div class="gift-num">x{{ i.num }}</div>
                    </div>
                    <div class="gift-dec">
                      <div class="gift-txt">{{ i.name }}</div>
                    </div>
                  </div>
                </div>
                <div class="gift-contentbox2" v-else>
                  <div class="gift-img" v-for="(i, k) in item.giftSkuInfos" :key="k">
                    <img :src="i.url" alt="" style="width: 100%; height: 100%" @click="toSpuDetail1(i)" />
                    <div class="gift-num">x{{ i.num }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p style="padding: 24px 0 18px; color: #999999; font-size: 14px" v-if="couponList.length > 0">优惠券</p>
          <div class="couponlist">
            <div v-for="(item, index) in couponList" :key="index" class="couponbox" :class="item.runOut ? 'disabledCoupon' : ''">
              <div class="couponbox-left">
                <ul>
                  <li>
                    <span class="rmb">¥</span>
                    <span class="price">{{ item.type == 1 ? item.couponFull.price : item.couponFall.price }}</span>
                    <span style="font-size: 13px" v-if="item.type == 1">满{{ item.couponFull.fullPrice }}可用</span>
                    <span style="font-size: 13px" v-if="item.type == 2">满{{ item.couponFall.fullPrice }}可用</span>
                  </li>
                </ul>
                <div class="clearfix">
                  <p style="margin-top: 13px">{{ item.startTime.split(' ')[0] }} - {{ item.endTime.split(' ')[0] }}</p>
                </div>
              </div>
              <div style="" class="couponbox-right">
                <div class="couponbox-right-content">
                  <p v-if="item.isReceive == 0" @click="item.runOut ? '' : receiveCoupon(item.id)" class="nolingqu">立即领取</p>
                  <div v-if="item.isReceive == 1" class="lingqu">
                    已领取
                    <img src="../../assets/img/Received1@2x.png" class="yiling" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>

      <!--选规格值的弹窗-->
      <!-- <popup
        v-model="spuSpecShow"
        height="21.28rem"
        position="bottom"
        style="background: #fff;border-radius: 0.4rem 0.4rem 0 0;"
      >
        <div style="position: relative;height: 100%;padding: .72rem 0 2.72rem; overflow: scroll">
          <div class="spec-menu-top">
            <div class="spec-first-pic">
              <img v-if="spu.images" :src="spu.images[0]" />
            </div>
            <div style="width:8.92rem">
              <div v-if="preMarketing == null || preMarketing.type == '8'" class="spec-price">
                <span style="font-size: 0.72rem;">¥</span>
                <span>
                  {{
                  spu.isBatchSku == '1'
                  ? spu.skuBatchList[0].batchPrice.toFixed(2)
                  : currentSelected == 0
                  ? spu.price.toFixed(2)
                  : groupMarketing.groupMarketing.price.toFixed(2)
                  }}
                </span>

                <del
                  v-if="(spu.memberPrice || spu.marketingPrice) && preMarketing == null"
                  style="font-size: 0.48rem;color: #999;font-weight: normal;margin-left: 0.4rem;vertical-align: middle"
                >¥{{ spu.isBatchSku == '1' ? spu.skuBatchList[0].oldBatchPrice.toFixed(2) : spu.oldPrice.toFixed(2) }}</del>
              </div>
              <div v-if="preMarketing != null && preMarketing.type == '7'" class="spec-price">
                <span style="color: #666">定金:</span>
                ¥{{ (preMarketing.preSale.depositPre * spu.oldPrice).toFixed(2) }}&nbsp;
                <span
                  style="color: #666"
                >尾款:</span>
                ¥{{ ((1 - preMarketing.preSale.depositPre) * spu.oldPrice).toFixed(2) }}
              </div>
              <div class="spec-code">商品编码:{{ spu.id }}</div>
            </div>
            <div style="position: fixed;right: 0.72rem;bottom: 19.72rem;">
              <img
                src="../../assets/img/close@2x.png"
                alt
                style="width:0.64rem;heigth:0.64rem"
                @click="spuSpecShow = false"
              />
            </div>
          </div>
          <div class="spuSpecs">
            <div class="prod-spec">
              <div class="nature-container" v-if="specs">
                <dl v-for="(spec, index) in specs" :key="index" class="pro-spec">
                  <dt class="multy-spec">{{ spec.name }}</dt>
                  <dd>
                    <a
                      @click="
                        specValue.checked
                          ? ''
                          : specValue.isActive
                          ? changeSpecValue(spec.id, specValue.id)
                          : specs.length === 1
                          ? ''
                          : handleDisableClick(specValue.id)
                      "
                      v-for="(specValue, i) in spec.specValues"
                      :key="i"
                      class="a-item"
                      :class="{ selected: specValue.checked, disabled: !specValue.isActive }"
                    >{{ specValue.name }}</a>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="goods-number">
              <h2 style="font-size: 0.56rem;color: #000;font-weight: 600;">数量</h2>
              <van-stepper @click.native="numChange()" v-model="num" :min="minNum" :max="99" />
            </div>
          </div>
          <section class="popBox">
            <div v-if="groupMarketing == null && isFrom == 0" class="action-list">
              <a v-if="preMarketing == null" @click="addShoppingCart" class="addtocart0">加入购物车</a>
              <a
                class="buy0"
                @click="buyNow"
              >{{ preMarketing && preMarketing.type == '7' ? '支付定金' : '立即购买' }}</a>
            </div>
            <div
              v-if="groupMarketing == null && isFrom == 1 && preMarketing == null"
              class="action-list"
            >
              <a @click="addShoppingCart" class="addtocart1">加入购物车</a>
            </div>
            <div v-if="groupMarketing == null && isFrom == 2" class="action-list">
              <a
                class="buy1"
                @click="buyNow"
              >{{ preMarketing && preMarketing.type == '7' ? '支付定金' : '立即购买' }}</a>
            </div>

            <div v-if="groupMarketing != null && sourceFrom == 0" class="action-list">
              <a class="item addtocart" @click="confirmSku()">确定</a>
            </div>

            <div v-if="groupMarketing != null && sourceFrom == 1" class="action-list">
              <a
                class="item addtocart"
                @click="
                  () => {
                    sourceFrom = 0
                    currentSelected = 0
                  }
                "
              >
                <p>¥{{ spu.price.toFixed(2) }}</p>
                <p>单独购买</p>
              </a>
              <a
                class="item buy"
                @click="
                  () => {
                    sourceFrom = 0
                    currentSelected = 1
                    currentGroupOrder = null
                  }
                "
              >
                <p>¥{{ groupMarketing.groupMarketing.price.toFixed(2) }}</p>
                <p>发起拼单</p>
              </a>
            </div>
          </section>
        </div>
      </popup>-->

      <van-sku
        v-model="showBase"
        class="sku-box"
        :sku="sku"
        :hide-stock="true"
        :goods="goods_info"
        reset-stepper-on-hide
        :initial-sku="initialSku"
        :close-on-click-overlay="closeOnClickOverlay"
        @sku-selected="skuSelected"
        @buy-clicked="buyNow"
        @add-cart="addShoppingCart"
        ref="vansku"
        style="height: 400px"
      >
        <template #sku-header-price="props">
          <div class="van-sku__goods-price">
            <span class="van-sku__price-symbol">￥</span>
            <span class="van-sku__price-num">{{ props.price ? props.price : '0' }}</span>
            <span class="spu_price_btn" v-if="isShowCouBtn && props.price">
              <div>
                <span style="display: inline-block">券后¥</span>
                <span class="couPrice">{{ discountsPrice ? discountsPrice.toFixed(2) : '' }}</span>
              </div>
            </span>
          </div>
        </template>
        <template #sku-stepper="props">
          <div class="van-sku-stepper-stock">
            <div class="van-sku__stepper-title">数量</div>
            <van-stepper
              class="van-stepper van-sku__stepper"
              @click.native="numChange()"
              v-model="num"
              integer
              :min="minNum"
              :max="props.selectedSkuComb ? props.selectedSkuComb.stock_num : 0"
            />
          </div>
        </template>

        <template #sku-actions="props">
          <p style="text-align: center; height: 14px; line-height: 14px; color: #999" v-if="couponName && props.price">
            当前商品可使用
            <span style="color: #e60113">{{ couponName }}</span>
            店铺优惠券
          </p>

          <div class="van-sku-actions two" v-if="isFrom == 0">
            <van-button square size="large" type="warning" @click="addShoppingCart(props)" :class="sellOut || spu.isGift == 1 ? 'btn-disabled' : ''">
              加入购物车
            </van-button>
            <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
            <van-button square size="large" type="danger" @click="buyNow(props)" :class="sellOut || spu.isGift == 1 ? 'btn-disabled' : ''">
              {{ isShowCouPri ? '领券购买' : '立即购买' }}
            </van-button>
          </div>
          <div class="van-sku-actions" v-if="isFrom == 1">
            <van-button square size="large" type="warning" @click="addShoppingCart(props)" :class="sellOut || spu.isGift == 1 ? 'btn-disabled' : ''">
              {{ isShowCouPri ? '确定' : '加入购物车' }}
            </van-button>
          </div>
          <div class="van-sku-actions" v-if="isFrom == 2">
            <van-button square size="large" type="danger" @click="buyNow(props)" :class="sellOut || spu.isGift == 1 ? 'btn-disabled' : ''">
              {{ isShowCouPri ? '领券购买' : '立即购买' }}
            </van-button>
          </div>
        </template>
      </van-sku>
      <!-- disable-stepper-input  数字框左右的数字框可以按 里面的数字不能手动输入 -->
      <!-- <van-button block type="primary" @click="showBase = true">11111</van-button> -->
      <!-- 自定义 sku-header-price -->

      <!--评论放大图-->
      <div v-for="(item, index) in comments" :key="index">
        <previewer :list="item.commentPics" ref="previewer" :options="options(index)"></previewer>
      </div>

      <!-- 回到顶部 -->
      <div class="backtop" ref="backtop" v-if="backtopshow" @click="backtop">
        <img src="@/assets/img/top@2x.png" class="imgtop" alt />
      </div>
    </div>

    <van-popup v-model="showGuide" class="guide-popup">
      <!-- 微信引导图过大，防止点击不能关闭 -->
      <img src="@/assets/img/weixin-guide.png" v-if="isWeixin()" class="weixin-guide" @click="showGuide = false" />
      <img src="@/assets/img/browser-guide.png" v-else class="browser-guide" />

      <!-- 调用分享组件 -->
      <!-- <share-index></share-index> -->
    </van-popup>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  Badge,
  Tab,
  TabItem,
  Swiper,
  SwiperItem,
  Divider,
  InlineXNumber,
  Previewer,
  PopupPicker,
  LoadMore,
  Clocker,
  dateFormat,
  cookie,
} from 'vux'

import {
  querySpu,
  queryRecommend,
  querySpuSpecs,
  querySkuSpecs,
  queryAllAreas,
  receiveCoupon,
  calculatefreight,
  addAttention,
  cancelAttention,
  queryPanicBuyMarketing,
  queryPreSaleRule,
  queryGroupOrders,
  querySkuComments,
  addShoppingCart,
  addBrowseRecord,
  queryCombination,
  checkIsInGroup,
  queryCouponList, //优惠券列表
} from '@/api/spudetail'
import { getjssdk } from '@/api/wx'
import { queryCartCount, receiveCoupons, bestCoupon } from '@/api/shoppingcart'
import { queryCommentSummarize } from '@/api/comments'
// 抢购倒计时
let panicInterval
import { setToken, getToken, removeToken } from '@/utils/token'
import combination from '@/components/spus/combination'
import shopList from '@/components/commons/shopList'
import { Icon, Toast, Rate, Stepper, Sku, Button, Popup } from 'vant'
import wx from 'weixin-js-sdk'
export default {
  components: {
    Group,
    Cell,
    Badge,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Divider,
    InlineXNumber,
    Previewer,
    PopupPicker,
    LoadMore,
    combination,
    Clocker,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [Rate.name]: Rate,
    [Stepper.name]: Stepper,
    [Sku.name]: Sku,
    [Button.name]: Button,
    [Popup.name]: Popup,

    shopList,
    // shareIndex: () => import('@/components/share/index'),
  },
  data() {
    const self = this
    return {
      couponData: {
        couponIdList: [], //领取的优惠券id集合
      },
      showFlySpu: false, //飞入购物车的商品
      plugin: [
        {
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 30000, // 超过30秒后停止定位，默认：无穷大
          zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          showButton: false, // 显示定位按钮，默认：true
          pName: 'Geolocation',
          events: {
            init: (o) => {
              self.GDinit(o, self) // 获取当前位置
            },
          },
        },
      ],
      longitude: -1, // 经度
      latitude: -1, // 纬度
      showIndex: 0, // 当前显示哪个页面 0 显示详情页 1 显示商品组合页面
      currentGroupOrder: null, // 当前选择的拼团订单
      groupOrderInfos: null, // 拼团订单信息
      currentSelected: 0, // 拼团的时候用于判断是选择的拼团还是非拼团 0 非拼团 1 拼团
      sourceFrom: 1, // 判断底部是否显示确定 0 显示 1 不显示
      groupMarketing: null, // 拼团促销
      panicBuyMarketing: null, // 抢购信息
      preMarketing: null, // 预售信息
      minNum: 1, //购买的最低数量
      marketType: {
        1: '直降',
        2: '满赠',
        3: '抢购',
        4: '满减',
        5: '满折',
        6: '包邮',
        7: '定金预售',
        8: '全款预售',
        9: '试用',
        10: '拼团',
      }, // 促销类型
      isProcess: false, // 接口是否处理中
      loading: true, // 加载中
      spuTabIndex: 0, // 当前tab的选中  0 商品 1 评价 2 详情
      carouselPics: [], // 轮播图片
      spu: {}, // 商品信息
      serviceTip: '', // 售后服务
      services: '', // 服务主持
      recommendSpus: [], // 推荐的商品信息
      spuSpecShow: false, // 商品规格显示隐藏标记
      specs: [], // 商品下的规格信息
      allskus: [], //商品下所有的单品
      specPathInfo: {}, // 规格值的路径 用于计算规格值的激活
      specSplitter: '\u2299', // 分隔符
      num: 1, // 选择商品的数量
      areas: [], // 地区信息
      freight: 0, //运费
      favourite: false, // 是否收藏
      favoriteText: '收藏',
      skuDetailTab: 0, //商品详情里面的介绍和规格的切换 0 介绍 1 规格
      couponListVisible: false, // 领取优惠券弹窗显示隐藏标记
      groupOrderDetailShow: false, // 批团详情显示隐藏标记
      groupOrderListShow: false, // 拼团订单列表显示隐藏标记
      promotionVisible: false, // 促销详情显示隐藏标记
      rulesVisible: false, // 预售规则显示隐藏规则
      comments: [], // 评价
      addressValue: [], // 选择省市区的值
      carNum: 0, // 购物车总数
      hasCombination: false, // 是否有商品组合
      combinations: [], // 商品组合
      preSaleRule: '', // 预售规则
      isRefreshSpec: true, //是否更新商品规格，默认为true，防止点击规格重新查询并渲染页面造成闪烁

      showup: false, // 显示商品规格展开、收起
      spuAttributeValuesdata: '', // 截取商品规格
      allspuAttributeValuesdata: '', // 所有商品规格
      isFrom: 0, //0:加入购物车和立即购买； 1：加入购物车；  2：立即购买
      downOrup: '展开', // 展开收起
      commentSummarize: '', //好评率
      commenttitle: '', // 评论标题
      ratestar: 5, // 店铺综合评价
      backtopshow: false, // 回到顶部显示隐藏
      sku: {},
      // goods_id: '946755',
      goods_info: {
        picture: '',
      },
      showBase: false, //sku的框的显示
      closeOnClickOverlay: true, //点击空白处关闭购物框
      initialSku: {},
      returntop: false, // 返回顶部
      carActive: false, // 购物车
      detailShow: true,
      sellOut: 0, //0未售罄  1已售罄
      shelvesStatus: '', // 0下架 1上架 2违规下架
      isfirst: false,
      storeId: null, //店铺id
      couponList: [], //优惠券列表
      spuPrice: null, //券前价格
      couponPrice: null, //券后最优价格
      couponName: null, //可用最优优惠券的名字
      shopList: {
        shoppingCartList: [], //所有勾选的商品 用于计算最优
      },
      discountsPrice: null, //优惠价格
      isShowCouBtn: false, //是否展示券后按钮
      isShowCouPri: false, //是否展示券后价格

      bestCouponInfo: [], //最优优惠券信息
      skuId: this.$route.query.id ? this.$route.query.id : '', //商品id
      showGuide: false, //微信或者浏览器引导

      fullGift: null, //满赠
      giftName: null, //赠品名

      recommendToken: this.$route.query.shareCode ? this.$route.query.shareCode : '', // 推荐码（分销码）

      spuId: this.$route.query.spuId ? this.$route.query.spuId : '',
    }
  },
  created() {
    this.$storage.clearOld()
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.loading = true
    this.querySpuDetail(this.skuId)
    this.queryCartCount()

    if (this.recommendToken) {
      this.$storage.setItem({ spuId: this.spuId, recommendToken: this.recommendToken })

      this.$router.push({
        path: '/spudetail',
        query: {
          id: this.skuId,
        },
      })
    }
  },
  mounted() {
    // 滚动条的获取
    window.addEventListener('scroll', this.handleScroll, true)
    this.handleScroll()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    backtopshow(value) {
      if (!value) this.returntop = false
    },
    $route(to, from) {
      if (this.$route.query.id) {
        document.getElementsByTagName('body')[0].className = 'gray-bg'
        this.loading = true
        this.querySpuDetail(this.$route.query.id)
        this.queryCartCount()
      }
    },
  },
  methods: {
    //优惠券列表
    queryCouponList(storeId) {
      queryCouponList(storeId).then((res) => {
        this.couponList = res.data
      })
    },

    // 监听页面滚动
    handleScroll() {
      if (!this.$refs.boxwrpper) return
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.boxwrpper.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop)
      let headerdom = document.getElementById('headerwrapper')
      if (!headerdom.classList) {
        return
      }
      if (scorllTop < 10) {
        headerdom.classList.add('headershow0', 'backwhite0', 'carWhite0')
        headerdom.classList.remove(
          'headershow1',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow10',
          'backwhite1',
          'backwhite2',
          'backwhite3',
          'backwhite4',
          'backwhite5',
          'carWhite1',
          'carWhite2',
          'carWhite3',
          'carWhite4',
          'carWhite5',
          'defaultimg'
        )
      } else if (scorllTop >= 10 && scorllTop < 30) {
        headerdom.classList.add('headershow1', 'backwhite1', 'carWhite1')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow10',
          'backwhite0',
          'backwhite2',
          'backwhite3',
          'backwhite4',
          'backwhite5',
          'carWhite0',
          'carWhite2',
          'carWhite3',
          'carWhite4',
          'carWhite5',
          'defaultimg'
        )
      } else if (scorllTop >= 30 && scorllTop < 50) {
        headerdom.classList.add('headershow2', 'backwhite2', 'carWhite2')
        headerdom.classList.remove(
          'headershow0',
          'headershow1',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow10',
          'backwhite0',
          'backwhite1',
          'backwhite3',
          'backwhite4',
          'backwhite5',
          'carWhite0',
          'carWhite1',
          'carWhite3',
          'carWhite4',
          'carWhite5'
        )
      } else if (scorllTop >= 50 && scorllTop < 70) {
        headerdom.classList.add('headershow3', 'backwhite3', 'carWhite3')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow1',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow10',
          'backwhite0',
          'backwhite1',
          'backwhite2',
          'backwhite4',
          'backwhite5',
          'carWhite0',
          'carWhite1',
          'carWhite2',
          'carWhite4',
          'carWhite5'
        )
      } else if (scorllTop >= 70 && scorllTop < 90) {
        headerdom.classList.add('headershow4', 'backwhite4', 'carWhite4')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow1',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow10',
          'backwhite0',
          'backwhite1',
          'backwhite2',
          'backwhite3',
          'backwhite5',
          'carWhite0',
          'carWhite1',
          'carWhite2',
          'carWhite3',
          'carWhite5'
        )
      } else if (scorllTop >= 90 && scorllTop < 110) {
        headerdom.classList.add('headershow5', 'backwhite5', 'carWhite5')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow1',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow10',
          'backwhite0',
          'backwhite1',
          'backwhite2',
          'backwhite3',
          'backwhite4',
          'carWhite0',
          'carWhite1',
          'carWhite2',
          'carWhite3',
          'carWhite4'
        )
      } else if (scorllTop >= 130 && scorllTop < 150) {
        headerdom.classList.add('headershow6')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow1',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow10',
          'backwhite5',
          'carWhite5'
        )
      } else if (scorllTop >= 170 && scorllTop < 190) {
        headerdom.classList.add('headershow7')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow1',
          'headershow8',
          'headershow9',
          'headershow10'
        )
      } else if (scorllTop >= 190 && scorllTop < 210) {
        headerdom.classList.add('headershow8')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow1',
          'headershow9',
          'headershow10'
        )
      } else if (scorllTop >= 210 && scorllTop < 230) {
        headerdom.classList.add('headershow9')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow1',
          'headershow10'
        )
      } else if (scorllTop >= 230) {
        headerdom.classList.add('headershow10')
        headerdom.classList.remove(
          'headershow0',
          'headershow2',
          'headershow3',
          'headershow4',
          'headershow5',
          'headershow6',
          'headershow7',
          'headershow8',
          'headershow9',
          'headershow1',
          'backwhite0',
          'backwhite1',
          'backwhite2',
          'backwhite3',
          'backwhite4',
          'backwhite5',
          'carWhite0',
          'carWhite1',
          'carWhite2',
          'carWhite3',
          'carWhite4',
          'carWhite5'
        )
      }
      // 评价盒子距离顶部的高度
      let detailBox = this.$refs.detailBox.getBoundingClientRect().top - 44 // 盒子距顶部高度
      if (detailBox <= 0) this.backtopshow = true
      else this.backtopshow = false
    },
    // 回到顶部
    backtop() {
      if (this.backtopshow) this.returntop = true
      else this.returntop = false
    },
    beforeEnter(el) {
      el.style.opacity = 0
    },
    afterEnter(el) {
      const offsetH = document.documentElement.offsetHeight || document.body.offsetHeight
      const offsetW = document.documentElement.offsetWidth || document.body.offsetWidth

      // 设置小球移动的位移
      setTimeout(() => {
        el.style.transform = `translate3d(${offsetW / 2 - 20}px,-${offsetH / 2 - 20}px,0)`
        // 增加贝塞尔曲线
        el.style.transition = 'transform 0.8s cubic-bezier(0.3, -0.25, 0.7, -0.15)'
        el.style.transition = 'transform 0.8s linear'
        this.showFlySpu = false
        // 设置透明度
        el.style.opacity = 1
      }, 500)
    },
    options(itemIndex) {
      return {
        getThumbBoundsFn(index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.friends-item')[itemIndex].querySelectorAll('.previewerImg')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width,
          }
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        },
      }
    },
    // 查询当前经纬度
    GDinit(o) {
      let that = this
      o.getCurrentPosition((status, result) => {
        if (status === 'complete' && result.info === 'SUCCESS') {
          that.longitude = result.position.getLng()
          that.latitude = result.position.getLat()
          //获取定位地址填入默认送货地址
          this.setLocationAdress(result.addressComponent)
        } else {
          Toast('定位失败,请刷新后重试')
        }
      })
    },
    // 展开收起商品规格
    showdown() {
      this.showup = !this.showup
      if (this.showup) {
        this.downOrup = '收起'
        // this.spuAttributeValuesdata = this.allspuAttributeValuesdata
      } else {
        this.downOrup = '展开'
        // this.querySpuDetail(this.$route.query.id)
      }
    },
    // 查询商品详情信息
    querySpuDetail(id) {
       let data = {
          skuId: id,
        }
      querySpu(data).then((res) => {
        this.loading = false
        this.shopList.shoppingCartList = []
        this.couponName = null
        this.spu = res.data
        // 获取jssdk
        this.getjssdk(window.location.href.split('#')[0])
        this.sku.tree = res.data.sku.tree
        this.sku.list = res.data.list
        this.goods_info.picture = res.data.images ? res.data.images[0] : null
        this.initialSku = res.data.sku.initialSku
        this.sellOut = res.data.sellOut
        this.shelvesStatus = res.data.shelvesStatus
        this.allspuAttributeValuesdata = res.data.spuAttributeValues

        //满赠
        if (res.data.marketingVos) {
          this.fullGift = res.data.marketingVos.filter((i) => {
            return i.type == 2
          })[0]
        } else {
          this.fullGift = null
        }
        if (this.fullGift) {
          if (this.fullGift.fullGiftList[0].fullPrice) {
            this.giftName = `满${this.fullGift.fullGiftList[0].fullPrice}赠 ` + this.fullGift.fullGiftList[0].giftSkuInfos[0].name
          } else {
            this.giftName = this.fullGift.fullGiftList[0].giftSkuInfos[0].name
          }
        } else {
          this.giftName = null
        }
        if (res.data.spuAttributeValues.length > 7) {
          this.spuAttributeValuesdata = res.data.spuAttributeValues.slice(0, 7)
        } else {
          this.spuAttributeValuesdata = res.data.spuAttributeValues
        }
        this.sourceFrom = 1
        this.storeId = res.data.storeId

        this.spuPrice = res.data.price

        //优惠券列表
        this.queryCouponList({ storeId: this.storeId })

        this.shopList.shoppingCartList.push({ num: 1, skuId: res.data.sku.id })
        this.skuId = res.data.sku.id
        bestCoupon(this.shopList).then((res) => {
          this.discountsPrice = res.data.discountsPrice
          this.isShowCouBtn = res.data.fullReductionMoney
          if (res.data.fullReductionMoney && res.data.storeSummaryList[0].isReceive == 0) this.isShowCouPri = true
          this.bestCouponInfo = res.data.storeSummaryList

          if (res.data.fullReductionMoney) {
            this.couponName = '满' + res.data.storeSummaryList[0].coupon.couponFull.fullPrice + '减' + res.data.storeSummaryList[0].coupon.couponFull.price
          }
        })
        // 设置收藏
        this.favourite = this.spu.hasAtten
        if (this.favourite) this.favoriteText = '已收藏'
        else this.favoriteText = '收藏'
        // 查询商品的所有规格信息
        if (this.isRefreshSpec == true) {
          this.querySpuSpecs(this.spu.spuId)
        }
        this.isRefreshSpec = true

        // 查询商品推荐
        this.queryRecommend(this.spu.typeId)

        // 查询地区信息
        this.queryAllAreas()

        // 检查预售
        // this.checkPreSale()

        // 加载数量
        this.loadNum()

        // 查询拼团促销
        // this.findgroupMarketing()

        // 查询拼团订单
        // if (this.groupMarketing != null) {
        //   this.queryGroupOrders(this.groupMarketing.id, this.spu.id)
        // }

        // 查询抢购促销
        // this.queryPanicBuyMarketing()

        // 查询商品组合
        // this.queryCombination()

        // 查询评价
        this.querySkuComments()

        // 好评率
        this.queryCommentSummarize()

        // 添加浏览记录
        this.addBrowseRecord()

        //找

        // 设置轮播图片
        if (this.spu.images) {
          this.carouselPics = this.spu.images.map((image) => {
            image = image.split('?')[0]
            let imgUrl = image.split('/')
            imgUrl[imgUrl.length - 1] = escape(imgUrl[imgUrl.length - 1])
            let img = imgUrl.join('/')
            return { img }
          })
        }
        // this.serviceTip = '由' + this.spu.storeName + '直接销售和发货，并提供售后服务'
        // this.serviceTip = '店铺发货&售后 · 7天无理由退货'
        this.services = this.spu.spuServiceSupports
          .map((support) => {
            return support.serviceSupport.name
          })
          .join(' · ')
      })
    },
    //查询商品组合
    queryCombination() {
      queryCombination(this.spu.id).then((res) => {
        if (res.hasCombination && res.spuDetails && res.spuDetails.length > 0) {
          this.hasCombination = true
          this.combinations = res.spuDetails
        } else {
          this.combinations = []
        }
      })
    },
    // 添加浏览记录
    addBrowseRecord() {
      if (this.isProcess) {
        return
      }
      this.isProcess = true
      addBrowseRecord(this.spu.id).then((res) => {
        this.isProcess = false
        // 没有添加成功 则添加到cookie中
        if (res.flag == -1) {
          let skus = cookie.get('browseDates')
          let browSkus = new Array()
          // 浏览纪录中有纪录
          if (skus) {
            browSkus = JSON.parse(skus)
          }

          browSkus.push({
            skuId: this.spu.id,
            typeId: this.spu.typeId,
          })

          if (browSkus.length > 30) {
            browSkus.shift()
          }
          cookie.set('browseDates', JSON.stringify(browSkus))
        }
      })
    },
    // 查询购物车数量
    queryCartCount() {
      queryCartCount().then((res) => {
        if (res.code == 200) {
          if (res.data > 99) {
            this.carNum = '99+'
            this.carActive = 3
          } else if (res.data > 9 && res.data < 100) {
            this.carActive = 2
            this.carNum = res.data
          } else {
            this.carActive = 1
            this.carNum = res.data
          }
        }
      })
    },
    // 查询抢购促销
    queryPanicBuyMarketing() {
      queryPanicBuyMarketing(this.spu.id).then((res) => {
        if (res.flag == 1) {
          this.panicBuyMarketing = res.data
          // 秒杀倒计时
          this.panicCountDown()
        } else {
          this.panicBuyMarketing = null
        }
      })
    },
    // 查询拼团订单
    queryGroupOrders(marketingId, skuId) {
      queryGroupOrders(marketingId, skuId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.groupOrderInfos = res.data
        }
      })
    },
    // 查询拼团促销
    findgroupMarketing() {
      if (this.spu.marketings && this.spu.marketings.length > 0) {
        const groups = this.spu.marketings.filter((marketing) => marketing.type == '10')
        if (groups && groups.length > 0) {
          this.groupMarketing = groups[0]
        } else {
          this.groupMarketing = null
          this.currentSelected = 0
          this.currentGroupOrder = null
          this.groupOrderInfos = null
        }
      } else {
        this.groupMarketing = null
        this.currentSelected = 0
        this.currentGroupOrder = null
        this.groupOrderInfos = null
      }
    },
    // 查询单品下的规格信息
    querySpuSpecs(spuId) {
      querySpuSpecs(spuId).then((res) => {
        this.specs = this.findChecked(res, this.spu)
        this.querySkuSpecs(spuId)
      })
    },
    // 加载数量
    loadNum() {
      // 如果是起批商品 则设置最低起批量
      if (this.spu.isBatchSku == '1') {
        this.num = this.spu.skuBatchList[0].batchNum
        this.minNum = this.num
      } else {
        this.minNum = 1
      }
    },
    // 找出当前单品选中的规格
    findChecked(specs, spu) {
      specs.forEach((spec) => {
        spec.specValues.forEach((specValue) => {
          if (spu.skuSpecValues) {
            spu.skuSpecValues.forEach((skuSpecValue) => {
              if (spec.id == skuSpecValue.specId && specValue.id == skuSpecValue.specValueId) {
                specValue.checked = true
              }
            })
          }
        })
      })
      return specs
    },
    // 查询商品下所有单品的规格信息
    querySkuSpecs(spuId) {
      querySkuSpecs(spuId).then((res) => {
        this.allskus = res
        this.specActiveInit()
      })
    },
    // 设置规格值激活
    specActiveInit() {
      this.specPathInfo = {}
      this.buildResult()
      this.updateStatus(this.getSelectedItem())
    },
    //更新所有规格值是否激活的状态
    updateStatus(selected) {
      let specs = this.specs
      let that = this
      let pathInfo = this.specPathInfo
      for (let i = 0; i < specs.length; i++) {
        let data = specs[i].specValues
        let copy = selected.slice()
        for (let j = 0; j < data.length; j++) {
          let item = data[j].id + '(' + data[j].name + ')'
          data[j].isActive = true
          if (selected[i] == item) continue
          copy[i] = item
          let curr = that.trimSplitter(copy.join(this.specSplitter))
          data[j].isActive = !!pathInfo[curr]
        }
      }
      this.specs = JSON.parse(JSON.stringify(specs))
    },
    // 去除分隔符
    trimSplitter(str) {
      // ⊙abc⊙ => abc
      // ⊙a⊙⊙b⊙c⊙ => a⊙b⊙c
      let splitter = this.specSplitter
      let reLeft = new RegExp('^' + splitter + '+', 'g')
      let reRight = new RegExp(splitter + '+$', 'g')
      let reSplitter = new RegExp(splitter + '+', 'g')
      return str.replace(reLeft, '').replace(reRight, '').replace(reSplitter, splitter)
    },
    //获取当前选中的规格值
    getSelectedItem() {
      let specs = this.specs
      let result = []
      let that = this
      specs.forEach((spec) => {
        let checkedSpecValue = that.getCheckedSpecValue(spec)
        result.push(checkedSpecValue ? checkedSpecValue.id + '(' + checkedSpecValue.name + ')' : '')
      })
      return result
    },
    // 获得选中的规格值
    getCheckedSpecValue(spec) {
      let checkedSpecValue = null
      spec.specValues.forEach((specValue) => {
        if (specValue.checked) {
          checkedSpecValue = specValue
        }
      })
      return checkedSpecValue
    },
    //生成所有子集是否可选、库存状态 map
    buildResult() {
      let that = this
      let items = this.allskus
      let allKeys = this.getAllSkusPath()
      let res = this.specPathInfo
      for (let i = 0; i < allKeys.length; i++) {
        let curr = allKeys[i]
        let skuId = items[i].id
        let values = curr.split(that.specSplitter)
        let allSets = this.powerSet(values)
        // 每个组合的子集
        for (let j = 0; j < allSets.length; j++) {
          let set = allSets[j]
          let key = set.join(that.specSplitter)
          if (res[key]) {
            res[key].skuIds.push(skuId)
          } else {
            res[key] = {
              skuIds: [skuId],
            }
          }
        }
      }
    },
    //取得集合的所有子集「幂集」
    powerSet(arr) {
      let ps = [[]]
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0, len = ps.length; j < len; j++) {
          ps.push(ps[j].concat(arr[i]))
        }
      }
      return ps
    },
    // 获得所有单品的规格值
    getAllSkusPath() {
      let allskus = this.allskus
      let that = this
      let result = []
      allskus.forEach((sku) => {
        let values = []
        sku.skuSpecValues.forEach((skuSpecValue) => {
          values.push(skuSpecValue.specValueId + '(' + skuSpecValue.valueRemark + ')')
        })
        sku.path = values.join(that.specSplitter)
        result.push(sku.path)
      })
      return result
    },
    // 查询商品推荐
    queryRecommend(typeId) {
      queryRecommend(typeId).then((res) => {
        this.recommendSpus = res.datas
      })
    },
    // 查询商品详情
    toSpuDetail(skuId) {
      this.loading = true
      this.querySpuDetail(skuId)
    },
    toSpuDetail1(item) {
      this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
      this.couponListVisible = false
    },

    //点击没有激活规格值触发的事件
    handleDisableClick(specValueId) {
      this.specs.forEach((spec) => {
        spec.specValues.forEach((specValue) => {
          if (specValue.id == specValueId) {
            specValue.isActive = true
            specValue.checked = true
          } else {
            specValue.checked = false
          }
        })
      })
      this.updateStatus(this.getSelectedItem())
    },
    // 切换规格值
    changeSpecValue(specId, specValueId) {
      let skuId = this.getSkuId(this.getChosenSpec(specId, specValueId), this.allskus)
      // 如果单品id存在 则查询单品信息
      if (skuId) {
        if (panicInterval) {
          clearInterval(panicInterval)
        }
        this.isRefreshSpec = false
        this.querySpuDetail(skuId)
      } else {
        this.updateStatus(this.getSelectedItem())
      }
    },
    // 获得当前选中的规格信息
    getChosenSpec(specId, specValueId) {
      let response = []
      let that = this
      this.specs.forEach((spec) => {
        if (spec.id == specId) {
          response.push(specValueId)
          spec.specValues.forEach((specValue) => {
            specValue.checked = specValue.id == specValueId
          })
        } else {
          let checkedSpecValue = that.getCheckedSpecValue(spec)
          response.push(checkedSpecValue ? checkedSpecValue.id : '')
        }
      })
      this.specs = that.specs
      return response.join(',') + ','
    },
    // 规格规格值获得对应的单品id
    getSkuId(chooseSpec, allskus) {
      for (let i = 0; i < allskus.length; i++) {
        let skuSpeValue = ''
        for (let j = 0; j < allskus[i].skuSpecValues.length; j++) {
          skuSpeValue += allskus[i].skuSpecValues[j].specValueId + ','
        }
        if (chooseSpec == skuSpeValue) {
          return allskus[i].id
        }
      }
    },
    // 领取优惠券
    receiveCoupon(id) {
      this.couponData.couponIdList = []
      this.couponData.couponIdList.push(id)
      if (this.isProcess) {
        return
      }
      this.isProcess = true
      receiveCoupons(this.couponData).then((res) => {
        this.isProcess = false
        if (res.data == 1) {
          Toast('领取成功')
          this.queryCouponList({ storeId: this.storeId })
          this.querySpuDetail(this.skuId)
        } else {
          Toast(`${res.description}`)
        }
      })
    },
    // 查询所有的省市区
    queryAllAreas() {
      queryAllAreas().then((res) => {
        this.addressValue = []
        this.areas = res
        if (this.addressValue && this.addressValue.length > 0) {
          // 计算运费
          this.calculateFreight()
        }
      })
    },

    //获取定位地址填入默认送货地址
    setLocationAdress(locationInfo) {
      queryAllAreas().then((res) => {
        let addressList = res
        if (locationInfo) {
          //获取定位地址填入默认送货地址
          let province = locationInfo.province,
            city = locationInfo.city,
            district = locationInfo.district
          for (let i in addressList) {
            if (province.indexOf(addressList[i].name) != -1) {
              this.addressValue.splice(0, 1, addressList[i].value)
            }
            if (city == addressList[i].name) {
              this.addressValue.splice(1, 1, addressList[i].value)
            }
            if (district == addressList[i].name) {
              this.addressValue.splice(2, 1, addressList[i].value)
            }
          }
        } else {
          this.addressValue.push(addressList[0].value)
          this.addressValue.push(addressList[1].value)
          this.addressValue.push(addressList[2].value)
        }
      })
    },

    // 计算运费
    calculateFreight() {
      this.addressValue.length &&
      calculatefreight(this.spu.id, this.spu.storeId, this.addressValue[1].split('-')[1], this.num).then((res) => {
        this.freight = res.data
      })
    },
    // 地区发生改变
    addressChange() {
      // 计算运费
      this.calculateFreight()
    },
    // 改变购买数量
    numChange() {
      // 计算运费
      this.calculateFreight()
    },
    // 收藏或者取消收藏商品
    favouriteChange() {
      if (this.spu.hasAtten) {
        cancelAttention(this.spu.id).then((res) => {
          if (res.code == 200) {
            this.favourite = false
            this.spu.hasAtten = false
            this.favoriteText = '收藏'
          }
        })
      } else {
        addAttention(this.spu.id).then((res) => {
          if (res.code == 200) {
            this.favourite = true
            this.spu.hasAtten = true
            this.favoriteText = '已收藏'
            Toast('收藏成功')
          }
        })
      }
    },
    toBack() {
      this.$router.go(-1)
      // this.reload()
    },
    // 显示拼团订单详情
    toGroupDetail(data) {
      checkIsInGroup(data.groupId).then((res) => {
        if (res == 1) {
          this.groupOrderDetailShow = true
          this.groupOrderListShow = false
          this.currentGroupOrder = data
        } else {
          Toast({
            message: '您已在此团中',
            position: 'bottom',
          })
        }
      })
    },
    // 进入店铺
    gostore(stoteInfo) {
      if (stoteInfo && stoteInfo.id) {
        this.$router.push({
          path: '/storeindex',
          query: { storeId: stoteInfo.id },
        })
      } else this.$router.push({ path: '/' })
    },
    // 联系客服
    toService() {
      window.ysf('open')
      // if (!this.spu.storeScore.storeInfo.serviceQQ) {
      // } else {
      //   if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      //     let newLink = window.open()
      //     newLink.location.href =
      //       'mqqwpa://im/chat?chat_type=wpa&uin=' + this.spu.storeScore.storeInfo.serviceQQ + '&version=1&src_type=web&web_src=bjhuli.com'
      //   } else {
      //     let newLink = window.open()
      //     newLink.location.href = 'http://wpa.qq.com/msgrd?v=3&uin=' + this.spu.storeScore.storeInfo.serviceQQ + '&site=qq&menu=yes"'
      //   }
      // }
    },
    // 是否展示价格
    isShowPrice() {
      // 不是起批商品并且不是抢购商品和不是定金预售商品则返回true 显示价格 否则不显示价格
      return this.spu.isBatchSku == '0' && this.panicBuyMarketing == null && (this.preMarketing == null || this.preMarketing.type == '8')
    },
    panicCountDown() {
      if (panicInterval) {
        clearInterval(panicInterval)
      }
      if (this.panicBuyMarketing != null) {
        panicInterval = setInterval(this.countDown, 1000)
      }
    },
    // 秒杀倒计时
    countDown() {
      let panicbuy = this.panicBuyMarketing
      let now = new Date().getTime()
      let startTime = new Date(panicbuy.startTime.replace(/\-/g, '/')).getTime()
      let endTime = new Date(panicbuy.endTime.replace(/\-/g, '/')).getTime()
      let time = (startTime - now) / 1000
      // 如果限时折扣已经开始，则计算距限时折扣结束时间
      if (now - startTime > 0) {
        time = (endTime - now) / 1000
      }
      // 获取天、时、分、秒
      panicbuy.day = parseInt(time / (60 * 60 * 24))
      panicbuy.hour = parseInt((time % (60 * 60 * 24)) / 3600)
      panicbuy.minute = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
      panicbuy.second = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
      this.panicBuyMarketing = JSON.parse(JSON.stringify(panicbuy))
    },
    // 判断秒杀是否开始
    isPanicBuyStart(startTime) {
      return new Date() > new Date(startTime.replace(/\-/g, '/'))
    },
    // 检查预售
    checkPreSale() {
      if (this.spu.marketings && this.spu.marketings.length > 0) {
        const marketings = this.spu.marketings.filter((marketing) => marketing.type == '7' || marketing.type == '8')
        if (marketings && marketings.length > 0) {
          this.preMarketing = marketings[0]
          this.loadPreSaleRule()
        } else {
          this.preMarketing = null
        }
      } else {
        this.preMarketing = null
      }
    },
    // 查询预售规则
    loadPreSaleRule() {
      queryPreSaleRule().then((res) => {
        if (!!res.flag && res.data) {
          this.preSaleRule = res.data.preSaleRule
        }
      })
    },
    // 显示规格值弹窗
    toShowSpecValues(sourceFrom, currentSelected, type) {
      if (this.sellOut === '') return // 0正常 1售罄
      // this.spuSpecShow = true
      this.isFrom = type

      this.showBase = true

      this.sourceFrom = sourceFrom
      this.currentSelected = currentSelected
      this.currentGroupOrder = null
    },
    // 参与拼团
    toJoinGroup() {
      this.spuSpecShow = true
      this.sourceFrom = 0
      this.groupOrderDetailShow = false
      this.currentSelected = 1
    },
    // 查询商品的评价
    querySkuComments() {
      querySkuComments(this.spu.id).then((res) => {
        this.comments = res.data
      })
    },
    // 查询评价概括
    queryCommentSummarize() {
      queryCommentSummarize(this.spu.id).then((res) => {
        this.commentSummarize = res
        this.commenttitle = '评价 (' + res.allCommentCount + ')'
      })
    },
    // 显示评价大图
    showImg(index, imgIndex) {
      let that = this
      that.$refs.previewer[index].show(imgIndex)
    },
    // 去商品评价
    toMoreComments() {
      this.$router.push({
        path: '/comments',
        query: { id: this.spu.id },
      })
    },
    // 顶部tab切换
    toPage() {
      if (this.spuTabIndex === 0) {
        this.$refs.spuPage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
      if (this.spuTabIndex === 1) {
        this.$refs.assessPage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
      if (this.spuTabIndex === 2) {
        this.$refs.detailPage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    },
    // 跳转到购物车
    toCart() {
      this.$router.push({ path: '/cart', query: { from: 'spudetail' } })
    },
    // 判断是否选择了所有的规格
    specAllChose() {
      return this.getSelectedItem().indexOf('') < 0
    },
    // 立即购买
    buyNow(e) {
      if (getToken()) {
        if (!e.selectedSkuComb.id) {
          Toast({
            message: '请选择完整的商品规格！',
            position: 'bottom',
          })
          return
        }
        this.couponData.couponIdList = []
        //存在最优优惠券没领取
        this.bestCouponInfo.forEach((item) => {
          if (item.isReceive == 0) {
            this.couponData.couponIdList.push(item.couponId)
          }
        })
        if (this.couponData.couponIdList.length > 0) {
          receiveCoupons(this.couponData).then((res) => {
            if (res.code == 200) {
              Toast({
                message: `已为你自动领取1张店铺优惠券，下单更优惠`,
                icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///1b5b7a92a5ae0b4f77d6ff8641c034a6.png',
              })
            } else {
              Toast(`${res.description}`)
            }
          })
        }
        this.recommendToken = this.$storage.getItem(this.spu.spuId)
        console.log('分销码', this.recommendToken)
        let paramData = {
          skuId: e.selectedSkuComb.id,
          recommendToken: this.recommendToken,
          num: this.num,
        }
        this.$router.push({
          path: '/settlement',
          query: {
            params: JSON.stringify({
              ids: [],
              addressId: 0,
              // skuInfos: [e.selectedSkuComb.id + ',' + this.num],
              buyNowRequestList: [paramData],
              isGroup: 0,
              groupId: 0,
              temp: 1,
              againBuy: 0, // 再次购买
            }),
          },
        })
      } else {
        this.$router.push('/login')
      }
    },
    // 显示商品组合页面
    toCombination() {
      this.showIndex = 1
    },
    // 商品组合返回
    combinationBack() {
      this.showIndex = 0
    },
    skuSelected(skuValue) {
      this.isfirst = !this.isfirst

      let id = this.$refs.vansku.selectedSkuComb.id
      this.skuId = this.$refs.vansku.selectedSkuComb.id
      if (this.isfirst) {
        this.querySpuDetail(id)
      }
    },
    // 加入购物车
    addShoppingCart(e) {
      if (!e.selectedSkuComb.id) {
        Toast({
          message: '请选择完整的商品规格！',
          // position:'bottom'
        })
        return
      }

      if (this.isProcess) {
        return
      }
      this.isProcess = true
      let param = {
        skuId: e.selectedSkuComb.id,
        num: this.num,
        recommendToken: this.recommendToken,
      }
      addShoppingCart(param).then((res) => {
        this.isProcess = false
        if (res.code == 200) {
          switch (res.data) {
            case 0:
              Toast({
                message: '加入购物车失败，请刷新后重试！',
                // position:'bottom'
              })
              break
            case 1:
              this.$storage.removeItem(this.spu.spuId) // 清除分销码信息
              Toast({
                message: '成功加入购物车',
                // position:'bottom'
              })
              // this.spuSpecShow = false
              this.showBase = false
              this.showFlySpu = true
              // 重新查询购物车数量
              this.queryCartCount()

              //重新调详情接口
              break
            case -1:
              Toast({
                message: '库存不足！',
                // position:'bottom'
              })
              break
            case -2:
              Toast({
                message: '商品不存在！',
                // position:'bottom'
              })
              break
            case -3:
              Toast({
                message: '参数错误！',
                // position:'bottom'
              })
              break
            case -4:
              Toast({
                message: '商品已下架！',
                // position:'bottom'
              })
              break
            case -5:
              Toast({
                message: '达到商品限购数量！',
                // position:'bottom'
              })
              break
            case -6:
              Toast({
                message: '预售商品不能加入购物车！',
                // position:'bottom'
              })
              break
            case -7:
              Toast({
                message: '商品已过期！',
                // position:'bottom'
              })
              break
            default:
              Toast({
                message: '加入购物车失败，请刷新后重试！',
                // position:'bottom'
              })
              break
          }
        }
      })
    },
    //确认商品 拼团的时候用
    confirmSku() {
      // 非拼团 加入购物车
      if (this.currentSelected == 0) {
        this.addShoppingCart()
      } else if (this.currentSelected == 1) {
        // 拼团 去结算页面
        if (!this.specAllChose()) {
          Toast('请选择完整的商品规格！')
          return
        }

        // 判断是否限购
        if (this.groupMarketing.groupMarketing.limitNum != 0 && this.num > this.groupMarketing.groupMarketing.limitNum) {
          Toast({ message: '此商品限购' + this.groupMarketing.groupMarketing.limitNum + '件', position: 'bottom' })
          return
        }

        this.$router.push({
          path: '/settlement',
          query: {
            params: JSON.stringify({
              ids: '',
              addressId: 0,
              skuInfo: this.spu.id + ',' + this.num,
              isGroup: 1,
              groupId: this.currentGroupOrder ? this.currentGroupOrder.groupId : '',
            }),
          },
        })
      }
    },
    // 获得团购的结束时间
    getGroupBuyEndTime(payTime) {
      return new Date(new Date().getTime() + (new Date(payTime.replace(/\-/g, '/')) - new Date() + 86400000))
    },
    // 跳转到更多门店
    toMoreStore() {
      this.$router.push({
        path: '/onsalestorelist',
        query: {
          skuId: this.spu.id,
          cityId: this.addressValue[1].split('-')[1],
          districtId: this.addressValue[2].split('-')[1],
          spuId: this.spu.spuId,
        },
      })
    },
    // 跳转到门店商品详情
    toStoreSpuDetail(storeId) {
      this.$router.push({
        path: '/storespudetail',
        query: {
          skuId: this.spu.id,
          storeId: storeId,
          spuId: this.spu.spuId,
        },
      })
    },
    // 跳转到店铺首页
    toStoreIndex(storeId) {
      if (storeId !== 0 && !storeId) {
        return
      }
      if (storeId == '0') {
        this.$router.push({ path: '/' })
      } else {
        this.$router.push({
          path: '/storeindex',
          query: { storeId: storeId },
        })
      }
    },
    // 跳转分享页
    goTo(url) {
      this.$router.push(`/share?id=${this.$route.query.id}`)
    },
    // 分享
    handleShare() {
      // const { url, title, content, ico } = this.shareData
      if (window.ws) {
        // app环境
        let { name: title, subTitle: content } = this.spu
        let url = `${location.origin}/spudetail?id=${this.spu.id}`
        let ico = this.spu.images[0]
        window.ws.shareDrivierThird(url, title, content, ico, 2)
      } else {
        // this.goTo()      // 去分享页面
        // 微信或者普通浏览器
        this.showGuide = true
      }
    },
    // 判断微信
    isWeixin() {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    getjssdk(url) {
      if (!this.isWeixin()) return
      // console.log('url', url)
      // console.log('spu', this.spu)
      getjssdk(url).then((res) => {
        if (res.code == 200) {
          let { name: title, subTitle: desc } = this.spu
          let link = `${location.origin}/spudetail?id=${this.spu.id}`
          let imgUrl = this.spu.images[0]
          let { appId, timestamp, nonceStr, signature } = res.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 需要使用的JS接口列表
          })

          wx.ready(() => {
            console.log('wx ready')
            //需在用户可能点击分享按钮前就先调用
            // 分享给朋友 分享到QQ
            wx.updateAppMessageShareData({
              title, // 分享标题
              desc, // 分享描述
              link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl, // 分享图标
              success: () => {
                // 设置成功
              },
            })
            // // 分享到朋友圈及分享到QQ空间
            wx.updateTimelineShareData({
              title, // 分享标题
              link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl, // 分享图标
              success: () => {
                // 设置成功
              },
            })
          })
          wx.error(function (res) {
            console.log('err', res)
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          })
        }
      })
    },
  },

  computed: {
    //当前选择的规格值和数量
    chosenSpecAndNum: function () {
      let specTexts = ''
      if (!this.spu.skuSpecValues) {
        return specTexts
      }
      for (let i = 0; i < this.spu.skuSpecValues.length; i++) {
        specTexts += this.spu.skuSpecValues[i].valueRemark + ' '
      }
      return specTexts.substring(0, specTexts.length - 1) + ' ' + this.num + '个'
    },
  },
}
</script>

<style lang="less" scoped>
.soldout {
  position: absolute;
  right: 2.92rem;
  top: 14.6rem;
  width: 2.8rem;
  height: 2.8rem;
  img {
    width: 100%;
    height: 100%;
  }
}

.fly_spuImg {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  margin-left: -2rem;
  margin-top: -2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  img {
    animation: 1.5s mymove ease-in-out;

    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
@keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(0.6);
  }
  75% {
    transform: scale(0.3);
  }
  100% {
    transform: scale(0.1);
  }
}
.boxwrapper {
  /deep/ .weui-cell_access .weui-cell__ft:after {
    border-color: #999;
    border-width: 1.2px 1.2px 0 0;
    margin-top: -0.12rem;
  }
}
.headerwrapper {
  position: fixed;
  top: 0;
  min-height: 1.76rem;
  width: 100%;
  z-index: 2;

  // opacity: 0;
  .headerbox {
    position: relative;
    width: 100%;
    min-height: 1.76rem;
    // border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    background: transparent;
    border-color: transparent;
    background: hsla(0, 0%, 100%, 0);
    border-color: hsla(0, 0%, 90%, 0);
    // opacity: 0;
    .search-left {
      position: absolute;
      width: 1.6rem;
      height: 1.76rem;
      text-align: center;
      .back {
        width: 0.8rem;
        height: 0.8rem;
        margin-top: 0.48rem;
        font-size: 0.8rem;
      }
      .iconback {
        display: inline-block;
        width: 1.6rem;
        height: 1.76rem;
        .backimg {
          display: inline-block;
          background: url('../../assets/img/back_1@2x.png') no-repeat center center;
          background-size: 100%;
          width: 1.2rem;
          height: 1.2rem;
          margin-top: 0.24rem;
          margin-left: 0.3rem;
        }
      }
    }
    .search-group {
      position: absolute;
      margin: 0 2.8rem;
      width: 9.4rem;
      background-color: unset;
      visibility: hidden;
      /deep/ .weui-cells:after {
        content: unset;
      }
      /deep/ .weui-cells {
        background-color: unset;
      }
      /deep/ .vux-tab {
        background-color: unset;
      }
    }
    .carbox {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
      width: 1.6rem;
      height: 1.76rem;
      margin-right: 0.2rem;
    }
    .header-cart-icon {
      // background-color: #666;
      // padding: 5px;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 0.8rem;
      // margin: 7px 5px 0 0;
      position: absolute;
      top: 0.32rem;
      right: 0.24rem;
      margin: unset;
      background: url('../../assets/img/cat_1@2x.png') no-repeat center center;
      background-size: 100%;
      .car {
        position: absolute;
        right: -0.16rem;
        padding: 0 0.18rem;
        line-height: 15px;
        height: 15px;
        border-radius: 7.5px;
      }
      .car2 {
        padding: 0 0.1rem;
      }
      .car3 {
        right: -0.4rem;
        padding: 0 0.06rem;
        transform: scale(0.88);
      }
    }
    /deep/ .weui-cells {
      height: 1.76rem;
      font-weight: bold;
    }
    /deep/ .fourth-cells:after {
      content: unset;
    }
    /deep/ .vux-tab {
      height: 1.44rem;
    }
    /deep/ .vux-tab .vux-tab-item {
      line-height: 1.52rem;
      color: #000;
    }
    /deep/ .vux-tab-item.vux-tab-selected {
      color: #e60113;
      border-bottom: 0.12rem solid #e60113;
    }
    /deep/ .vux-tab-bar-inner {
      background-color: #e60113;
      width: 1.24rem !important;
      border-radius: 0.06rem;
    }
  }
  .header-tabBar {
    /deep/ .vux-tab-container {
      height: 1.76rem;
    }
  }
}
.backwhite0 .headerbox .search-left .iconback .backimg {
  background: url('../../assets/img/back@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 1;
}
.backwhite1 .headerbox .search-left .iconback .backimg {
  background: url('../../assets/img/back@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.9;
}
.backwhite2 .headerbox .search-left .iconback .backimg {
  background: url('../../assets/img/back@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.8;
}
.backwhite3 .headerbox .search-left .iconback .backimg {
  background: url('../../assets/img/back@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.7;
}
.backwhite4 .headerbox .search-left .iconback .backimg {
  background: url('../../assets/img/back@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.6;
}
.carWhite0 .headerbox .carbox .header-cart-icon {
  background: url('../../assets/img/cat@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 1;
}
.carWhite1 .headerbox .carbox .header-cart-icon {
  background: url('../../assets/img/cat@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.9;
}
.carWhite2 .headerbox .carbox .header-cart-icon {
  background: url('../../assets/img/cat@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.8;
}
.carWhite3 .headerbox .carbox .header-cart-icon {
  background: url('../../assets/img/cat@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.7;
}
.carWhite4 .headerbox .carbox .header-cart-icon {
  background: url('../../assets/img/cat@2x.png') no-repeat center center;
  background-size: 100%;
  opacity: 0.6;
}
.defaultimg .headerbox {
  .search-left .iconback .backimg {
    background: url('../../assets/img/back@2x.png') no-repeat center center;
    background-size: 100%;
  }
  .header-cart-icon {
    background: url('../../assets/img/cat@2x.png') no-repeat center center;
    background-size: 100%;
  }
}
.boxwrapper .headershow0 .headerbox {
  background: transparent;
  border-color: transparent;
  background: hsla(0, 0%, 100%, 0);
  border-color: hsla(0, 0%, 90%, 0);
}
.boxwrapper .headershow1 .headerbox {
  background: hsla(0, 0%, 100%, 0.1);
  border-color: hsla(0, 0%, 90%, 0.1);
}
.boxwrapper .headershow2 .headerbox {
  background: hsla(0, 0%, 100%, 0.2);
  border-color: hsla(0, 0%, 90%, 0.2);
}
.boxwrapper .headershow3 .headerbox {
  background: hsla(0, 0%, 100%, 0.3);
  border-color: hsla(0, 0%, 90%, 0.3);
}
.boxwrapper .headershow4 .headerbox {
  background: hsla(0, 0%, 100%, 0.4);
  border-color: hsla(0, 0%, 90%, 0.4);
}
.boxwrapper .headershow5 .headerbox {
  background: hsla(0, 0%, 100%, 0.5);
  border-color: hsla(0, 0%, 90%, 0.5);
}
.boxwrapper .headershow6 .headerbox {
  background: hsla(0, 0%, 100%, 0.6);
  border-color: hsla(0, 0%, 90%, 0.6);
}
.boxwrapper .headershow7 .headerbox {
  background: hsla(0, 0%, 100%, 0.7);
  border-color: hsla(0, 0%, 90%, 0.7);
}
.boxwrapper .headershow8 .headerbox {
  background: hsla(0, 0%, 100%, 0.8);
  border-color: hsla(0, 0%, 90%, 0.8);
}
.boxwrapper .headershow9 .headerbox {
  background: hsla(0, 0%, 100%, 0.9);
  border-color: hsla(0, 0%, 90%, 0.9);
}
.boxwrapper .headershow10 .headerbox {
  background: #fff;
  border-color: #e5e5e5;
}
.boxwrapper .headershow0 .headerbox .search-group {
  opacity: 0;
  visibility: hidden;
}
.boxwrapper .headershow1 .headerbox .search-group {
  opacity: 0.1;
  visibility: unset;
}
.boxwrapper .headershow2 .headerbox .search-group {
  opacity: 0.2;
  visibility: unset;
}
.boxwrapper .headershow3 .headerbox .search-group {
  opacity: 0.3;
  visibility: unset;
}
.boxwrapper .headershow4 .headerbox .search-group {
  opacity: 0.4;
  visibility: unset;
}
.boxwrapper .headershow5 .headerbox .search-group {
  opacity: 0.5;
  visibility: unset;
}
.boxwrapper .headershow6 .headerbox .search-group {
  opacity: 0.6;
  visibility: unset;
}
.boxwrapper .headershow7 .headerbox .search-group {
  opacity: 0.7;
  visibility: unset;
}
.boxwrapper .headershow8 .headerbox .search-group {
  opacity: 0.8;
  visibility: unset;
}
.boxwrapper .headershow9 .headerbox .search-group {
  opacity: 0.9;
  visibility: unset;
}
.boxwrapper .headershow10 .headerbox .search-group {
  opacity: 1;
  visibility: unset;
}
.spu_price_btn {
  display: inline-block;
  width: auto;
  min-width: 110px;
  height: 26px;
  background: linear-gradient(90deg, #ec5f2a 0%, #e60113 100%);
  border-radius: 100px;
  color: #fff;
  font-size: 0.48rem;
  padding: 0.12rem 0.12rem;
  box-sizing: border-box;
  margin-left: 0.2rem;
  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .couPrice {
    font-size: 20px;
  }
}
.details-colortype {
  font-family: PingFangSC-Medium, PingFang SC;
  border-radius: 0px 0px 0.4rem 0.4rem;
  .fourth-cell {
    padding: 0.64rem 0.61rem 0.8rem;
    .spu_price {
      color: #e60113;
      font-size: 0.64rem;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
    .no-price {
      font-weight: bold;
    }
    .price_p {
      position: relative;
      display: flex;
      justify-content: space-between;

      .icons-wrap {
        display: flex;
      }

      .icon-share {
        display: flex;
        align-items: center;
        flex-direction: column;
        align-items: center;
        margin-right: 1rem;
        img {
          width: 0.88rem;
          height: 0.88rem;
          object-fit: cover;
        }
        p {
          font-size: 0.48rem;
          color: #666;
          transform: scale(0.75);
        }
      }

      .favouritebox {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 1.44rem;
        text-align: center;
        img {
          width: 0.88rem;
          height: 0.88rem;
        }
        label {
          font-size: 0.48rem;
          color: #666666;
          transform: scale(0.75);
          -webkit-transform: scale(0.75);
        }
      }
    }
    .activebox {
      display: flex;
      align-items: center;
      margin-bottom: 0.48rem;
      .downpricebox {
        display: inline-block;
        position: relative;
        margin-right: 0.16rem;
        width: 2.2rem;
        height: 0.56rem;
        .pricedownimg {
          position: absolute;
          width: 2.2rem;
          height: 0.56rem;
        }
        .downprice {
          // display: inline-block;
          position: absolute;
          right: -0.16rem;
          width: 1.36rem;
          text-align: center;
          color: #fff;
          font-size: 0.48rem;
          transform: scale(0.76);
          height: 0.56rem;
          display: flex;
          align-items: center;
          justify-content: center;
          display: inline-block;
          margin-top: -0.06rem;
        }
      }
      .buygivebox {
        padding: 0rem 0.12rem;
        color: #e60113;
        position: relative;
        display: inline-block;
        font-size: 0.48rem;
        transform: scale(0.833);
        height: 0.68rem;
        margin-left: -0.08rem;
        margin-right: 0.16rem;
      }
      .buygivebox::after {
        // top: -51%;
        border-radius: 0.08rem;
        border: 1px solid #e60113;
      }
    }
    .product-title {
      color: #000;
      padding-right: 0;
      font-weight: 600;
    }
    .product-sub {
      color: #888;
      padding: 0.4rem 0 0 0;
    }
  }
  /deep/ .fourth-cells:after {
    content: unset;
  }
}
.chooseInfo {
  border-radius: 0.4rem;
  overflow: hidden;
  /deep/ .address-icon-wrap {
    // background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAABR0lEQVR4Ae2VNVpFUQyEg1U0uNToLtgC7pS4a01NzRLwDbCKV70Gq9AGdw+ZCs25x0ryfXM1M/+TI4T6L+6jHFGLaFm0zf10A+Eaz/AOPXFgA9QgYXsiTtAeev1B85TJ/bSgAhTBA6870BamQH1+Rg4RMlwGyF4oEBnIsgG2GEIOuJ865FwO4RrPDP0tNsBlFTZJBT/78cwAXbYBbisDoUPz4J0C3LYZnTeKuVzz4J3yIW9sgCcRgSc2wM1YPymybP7D2YiDZjYZOEj50ngXYVrcIct2WVuEKUTIINvicSoV02UA8BIZrnvgWABwjFyLNyhLjCkPWApe352+VhtAiu7gCd3x+22B6KUYxf20lgRDD8UqnqFcCUwbYGn0UMziIaqU8LM/gGd4FwxQVqE6ATx9gT3hWTSAMoh6BPQO4To6QIHOQT7eD5P3GWQRxAoNAAAAAElFTkSuQmCC)
    //   no-repeat 1.84rem 0.12rem;
    background: url('../../assets/img/region@2x.png') no-repeat 1.8rem 0.15rem;
    background-size: 0.64rem;
    padding-right: 1.26rem;
    padding-left: unset;
    font-weight: bold;
  }
  /deep/ .weui-cell {
    height: 2rem;
  }
  /deep/ .weui-cells:before {
    content: unset;
  }
  /deep/ .weui-cells:after {
    content: unset;
  }
  /deep/ .weui-cell:before {
    width: 92%;
    left: 4%;
  }
  /deep/ .vux-cell-box:not(:first-child):before {
    width: 92%;
    left: 4%;
  }
  /deep/ .vux-label {
    color: #000;
    font-weight: bold;
    margin-right: 0.72rem;
  }
  /deep/ .vux-popup-picker-select {
    text-align: left !important;
    margin-left: 0.2rem;
  }
  /deep/ .weui-cell__ft {
    color: #000;
  }
  /deep/ .vux-cell-value {
    color: #000;
  }
}
.commenbox {
  position: relative;
  .commom_shu {
    display: inline-block;
    position: absolute;
    left: 0.6rem;
    top: 0.72rem;
    width: 0.12rem;
    height: 0.56rem;
    background-color: #e60113;
    border-radius: 0.12rem;
  }
  .pl_box {
    /deep/ .weui-cell__ft.vux-cell-align-left {
      text-align: right;
      color: #666;
      font-size: 0.48rem;
      font-weight: 400;
    }
  }
  /deep/ .weui-cell:before {
    content: unset;
  }
  .friends-item {
    margin-top: 0;
    border-bottom: 1px solid #f2f2f2;
    margin: 0 0.6rem;
    /deep/ .weui-cell {
      padding: 0px 0px;
      margin-top: 0.16rem;
    }
    .pl_header {
      /deep/ .vux-label {
        width: 100%;
        padding: 0.16rem 0;
      }
      .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .commstar.commstarList {
          margin-top: unset;
        }
        .username {
          display: inline-block;
          font-size: 0.52rem;
          color: #000;
          font-weight: 100;
          width: 69%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .pl_headerimg {
        display: inline-block;
        width: 1.24rem;
        height: 1.24rem;
        border-radius: 50%;
      }
    }
    .commentContent {
      /deep/ .vux-label {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        width: 100%;
        font-weight: 400;
        font-size: 0.56rem;
        color: #000;
        margin-bottom: 0.44rem;
      }
    }
    .comments-img {
      height: 4.8rem;
      padding-bottom: 0.8rem;
      overflow: scroll;
      flex-wrap: nowrap;
      display: flex;
      .previewerImg {
        width: 4rem;
        height: 4rem;
        margin-right: 0.16rem;
        border-radius: 0.2rem;
        flex-shrink: 0;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.2rem;
        }
      }
    }
    .sku_sx {
      font-size: 0.48rem;
      color: #999;
      padding-bottom: 0.56rem;
    }
  }
  .friends-item:last-child {
    border-bottom: 0;
  }
  .moveComment {
    text-align: center;
    .allcomment {
      border: 1px solid #999;
      border-radius: 0.6rem;
      font-size: 0.48rem;
      margin-bottom: 1.04rem;
      display: inline-block;
      height: 1.16rem;
      width: 4.6rem;
      text-align: center;
      line-height: 1.08rem;
      margin-top: 0.16rem;
    }
  }
  /deep/ .weui-cells {
    border-radius: 0.4rem;
  }
  /deep/ .weui-cell {
    padding: 0.52rem 0.6rem;
    color: #000;
    font-weight: bold;
    padding-left: 0.96rem;
  }
  /deep/ .weui-cells:before {
    content: unset;
  }
  /deep/ .weui-cells:after {
    content: unset;
  }
  /deep/ .weui-cell__ft.vux-cell-align-left {
    color: #000;
    padding-left: 0.16rem;
  }
}
.shop-detail {
  border-radius: 0.4rem;
  height: 4rem;
  .shop-main {
    height: 100%;
    padding: 0.48rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .shop-logo {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 0.2rem;
      border: 1px solid #dddddd;
      img {
        width: 2.08rem;
        height: 2.08rem;
        margin: 0.16rem 0 0 0.16rem;
      }
    }
    .shop-name {
      .name {
        color: #000;
        font-size: 0.6rem;
        font-weight: bold;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .shop_gz {
        color: #999;
        font-size: 0.48rem;
        margin-top: 0.16rem;
      }
      .shop_star {
        font-size: 0.48rem;
        color: #000;
        span {
          transform: scale(0.9);
          display: inline-block;
          margin-left: -5%;
          display: flex;
          align-content: center;
        }
        .retebox {
          margin-top: 0.08rem;
          margin-left: 0.08rem;
          /deep/ .van-rate__icon {
            font-size: 0.48rem;
          }
          /deep/.van-rate__item:not(:last-child) {
            padding-right: 0.08rem;
          }
        }
      }
    }
    .gostorebox {
      margin-right: 0.2rem;
      .gostore {
        color: #e60113;
        height: 1.04rem;
        border-radius: 0.52rem;
        border: 1px solid #e60113;
        font-size: 0.52rem;
        padding: 0.14rem 0.72rem;
      }
    }
  }
}
.tab-details {
  border-radius: 0.4rem;
  padding: 0.72rem 0.48rem;
  .xq_title {
    height: 0.96rem;
    line-height: 0.96rem;
    .xq {
      width: 0.12rem;
      height: 0.56rem;
      margin-top: 0.2rem;
      margin-right: 0.12rem;
      background-color: #e60113;
      border-radius: 0.08rem;
      display: inline-block;
    }
    font-size: 0.6rem;
    font-weight: bold;
    color: #000;
  }
  .xq_spjs {
    font-size: 0.56rem;
    color: #666;
    height: 1.4rem;
    line-height: 1.4rem;
  }
}
.xq_spgg {
  padding-top: 0.4rem;
}
.updownBox {
  text-align: center;
  font-size: 0.52rem;
  color: #333;
  .updown {
    .up {
      display: inline-block;
      padding: 0.12rem 0.6rem;
      margin-top: 0.6rem;
    }
    .downimg {
      background: url('../../assets/img/down.png') no-repeat right center;
      background-size: 0.56rem auto;
    }
    .upimg {
      background: url('../../assets/img/up.png') no-repeat right center;
      background-size: 0.56rem auto;
    }
  }
}
.xq_wntj {
  background-color: #f5f5f5;
  padding: 0 0.48rem;
  /deep/ .guess-warp .guess-title {
    font-family: PingFangSC-Medium, PingFang SC;
    text-align: center;
    font-weight: bold;
    font-size: 0.56rem;
  }
}
.popBox {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
  background: #fff;
  .action-list {
    width: 100%;
    height: 2rem;
    padding: 0.2rem 0.72rem;
    display: flex;
    justify-content: space-between;
    .buy0,
    .addtocart0 {
      width: 6.52rem;
    }
    .buy0,
    .buy1 {
      background: #ffa000;
    }
    .addtocart0,
    .addtocart1 {
      background: #e60113;
    }
    .buy1,
    .addtocart1 {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .buy0,
    .addtocart0,
    .buy1,
    .addtocart1 {
      height: 1.6rem;
      line-height: 1.6rem;
      border-radius: 0.8rem;
      text-align: center;
      font-size: 0.56rem;
      color: #ffffff;
    }
  }
}
.footerbox {
  // position: relative;
  .sell-out {
    display: inline-block;
    background-color: #000000;
    opacity: 0.7;
    color: #ffffff;
    height: 1.6rem;
    line-height: 1.6rem;
    font-size: 0.56rem;
    text-align: center;
    top: -1.6rem;
    width: 100%;
    position: absolute;
  }
  .action-list {
    // border-top: 1px solid rgba(0, 0, 0, 0.08);
    .action-other {
      border-top: unset;
      width: 28%;
      margin-left: 0.12rem;
      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        border-right: unset;
        color: #666;
        font-size: 0.48rem;
        transform: scale(0.84);
        img {
          width: 0.8rem;
          height: 0.8rem;
          margin-bottom: 0.16rem;
        }
      }
    }
    .footerCommon {
      height: 1.6rem;
      line-height: 1.6rem;
      text-align: center;
      font-size: 0.52rem;
      font-weight: bold;
      color: #fff;
      margin: 0 0.2rem;
      border-radius: 0.8rem;
      background-color: #e60113;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .buy {
      background-color: #ffa000;
      margin-right: 0.32rem;
    }
    .btn-disabled {
      background-color: #f2f2f2 !important;
      color: #bababa !important;
    }
  }
}
.footerbox:before {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  // border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.goods-number {
  /deep/ .van-stepper__input {
    width: 1.92rem;
    background: #fff;
  }
  /deep/ .van-stepper__minus,
  .van-stepper__plus {
    width: 1.2rem;
    height: 1.2rem;
  }
}
.backtop {
  position: fixed;
  top: 70%;
  right: 0.48rem;
  height: 1.6rem;
  width: 1.6rem;
  z-index: 99;
  .imgtop {
    width: 100%;
    height: 100%;
  }
}
.backtopactive {
  position: fixed;
  top: 0;
}
.van-sku-actions {
  padding: 6px 16px 8px;
}
.van-sku-actions .van-button--warning {
  background: #e60113;
}
.van-sku-actions .van-button--danger {
  background: #ffa000;
}
.van-sku-actions .van-button--warning.btn-disabled,
.van-sku-actions .van-button--danger.btn-disabled {
  background-color: #f2f2f2 !important;
  color: #bababa !important;
}
// .van-sku-actions .van-button--danger.btn-disabled {
//   background-color: #f2f2f2 !important;
//   color: #bababa !important;
// }

.two {
  display: flex;
  justify-content: space-between;
  .van-button {
    border-radius: 20px;
    width: 6.52rem;
  }
}
.sku-box {
  /deep/ .van-stepper__input {
    width: 48px;
    background: #fff;
  }
  /deep/ .van-stepper__minus,
  /deep/ .van-stepper__plus {
    height: 30px;
    width: 30px;
  }
  /deep/ .van-sku-row__item {
    border-radius: 13px;
  }
  /deep/ .van-sku-row__item-name {
    padding: 7px 10px;
    line-height: 14px;
    height: 28px;
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 340px;
  }
  /deep/ .van-sku__goods-price {
    display: flex;
    align-items: center;
  }
}
.coupons {
  /deep/ .vux-no-group-title {
    border-radius: 10px;
  }
}
.couponlist {
  .couponbox {
    width: 100%;
  }
  .couponbox-left {
    width: 9.88rem;
    display: inline-block;
    height: 86px;
    padding: 16px 0 16px 12px;
  }
  .couponbox-right {
    display: inline-block;
    width: 3.76rem;
    height: 86px;
    .couponbox-right-content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .nolingqu {
        // width: 60px;
        padding: 0 10px;
        height: 24px;
        background: #e60113;
        border-radius: 14px;
        line-height: 24px;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .lingqu {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .yiling {
          width: 36px;
          height: 29px;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
}

.guide-popup {
  background: transparent;
  .browser-guide {
    width: 13rem;
  }
  .weixin-guide {
    width: 15rem;
  }
}
.gift {
  width: 13.56rem;
  // height: 7.84rem;
  background: #f5f5f5;
  border-radius: 0.4rem;
  padding: 0.48rem;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.gift-contentbox2 {
  height: 2rem;
  width: 12.6rem;
  margin-top: 0.4rem;
  display: flex;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
  .gift-img {
    width: 2rem;
    height: 2rem;
    position: relative;
    border-radius: 3px;
    margin-right: 0.2rem;
    flex-shrink: 0;
    .gift-num {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 0.8rem;
      height: 0.54rem;
      line-height: 0.54rem;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 3px;
      transform: scale(0.75);
      font-size: 12px;
      color: #fff;
    }
  }
}
.gift-contentbox {
  height: 2rem;
  width: 12.6rem;
  margin-top: 0.4rem;
  display: flex;
  justify-content: space-between;
  .gift-img {
    width: 1.92rem;
    height: 1.92rem;
    position: relative;
    border-radius: 3px;
    .gift-num {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 0.8rem;
      height: 0.54rem;
      line-height: 0.54rem;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 3px;
      transform: scale(0.75);
      font-size: 12px;
      color: #fff;
    }
  }
  .gift-detail {
    width: 6.2rem;
    height: 2rem;
    border-radius: 3px;
    border: 1px solid #fecacd;
    display: flex;
    box-sizing: border-box;

    .gift-dec {
      width: 4.2rem;
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .gift-txt {
        width: 3.2rem;
        height: 1.28rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: rap;
        word-break: break-all;
        line-height: 0.64rem;
        color: #666;
      }
    }
  }
}
.tips {
  position: fixed;
  width: 100%;
  height: 40px;
  bottom: 50px;
  background: #000;
  color: #fff;
  opacity: 0.7;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}
.gift-box {
  padding-bottom: 0.8rem;
}
.coupons {
  /deep/ .weui-cell__ft {
    display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: flex-start;
  }
}
.coupons-title {
  display: inline-block;
  color: #000;
  font-weight: 600;
}
.coupons-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
</style>
