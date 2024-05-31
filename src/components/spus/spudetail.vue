<template>
  <div v-if="spu" class="boxwrapper" ref="boxwrpper" :class="[returntop ? 'backtopactive' : '']">
    <!--地图定位-->
    <!-- <el-amap :plugin="plugin"></el-amap> -->
    <div v-if="loading">
      <nofund :noData="true" :title="'商品详情'" v-if="noDetail"></nofund>
      <div v-if="spu">
        <load-more style="margin: 50% auto" tip="正在加载"></load-more>
      </div>
    </div>
    <div v-else>
      <div>
        <div id="headerwrapper" class="headerwrapper defaultimg">
          <!-- header1 -->
          <header class="headerbox">
            <goods-search ref="headerNav" :shareflag="shareflag" @toIndex="toIndex" @toBack="toBack"></goods-search>
          </header>
          <header id="headerbox" class="headerbox headerbox-tab">
            <group class="search-group">
              <tab v-model="spuTabIndex" custom-bar-width="2.4rem" class="header-tabBar">
                <tab-item @click.native="toPage">
                  <span class="header-tabBar-item">
                    商品
                  </span>
                </tab-item>
                <tab-item @click.native="toPage">
                  <span class="header-tabBar-item">
                    详情
                  </span>
                </tab-item>
                <tab-item @click.native="toPage">
                  <span class="header-tabBar-item">
                    评价
                  </span>
                </tab-item>
                <tab-item @click.native="toPage">
                  <span class="header-tabBar-item">
                    优选
                  </span>
                </tab-item>
              </tab>
            </group>
            <!-- <div class="carbox" v-if="!isDistribution && !$route.query.promoteInfo">
              <div @click="toCart" class="header-cart-icon">
                <badge :text="carNum" class="car" :class="[carActive == 2 ? 'car2' : carActive == 3 ? 'car3' : '']"></badge>
              </div>
            </div> -->
          </header>
        </div>

        <div ref="spuPage" style="padding-top: 0px; position: relative;">
          <div :style="newUiImgList.length > 1 ? 'background: #fff;' : ''">
            <van-swipe width="100%" class="my-swipe" indicator-color="white" @change="onChange" loop>
              <van-swipe-item v-for="(item,index) in carouselPics" :key="index">
                 <img
                  src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2c523a830be84b6436fa80fffc125a16.png"
                  v-if="current == 0 && spu.spuVideo && isPlayer"
                  @click="playVideo()"
                  alt=""
                  class="iconPlay"
                />
                <video
                  :controls="controlsShow"
                  style="object-fit: unset"
                  :src="spu.spuVideo"
                  :poster="spuVideoPic"
                  webkit-playsinline="true"
                  x-webkit-airplay="true"
                  playsinline="true"
                  x5-video-player-type="h5"
                  x5-video-orientation="h5"
                  x5-video-player-fullscreen="true"
                  preload="none"
                  class="bannerVideo"
                  v-if="current == 0 && spu.spuVideo"
                  @ended="endVideo()"
                  id="videoBanner"
                  :key="videoKey"
                ></video>
                <img :src="item.img" alt="" @click="openImg()" style="width:100%;height:100%" />
              </van-swipe-item>

              <template #indicator>
                <div class="custom-indicator">
                  <span>
                    {{ current + 1 }}/{{ carouselPics.length }}
                  </span>
                </div>
              </template>
            </van-swipe>
          </div>

          <!-- 飞入购物车的商品 -->
          <transition appear @before-appear="beforeEnter" @after-appear="afterEnter" v-if="showFlySpu">
            <div class="fly_spuImg">
              <img :src="carouselPics[0].img" alt width="100%" style="border-radius: 50%" />
            </div>
          </transition>

          <!-- 秒杀促销信息 -->
          <seckillBanner v-if="seckillScene.length > 0" :seckillScene="seckillScene[0]" />

          <!-- sku属性选择小图 -->
          <div class="img-box" v-if="newUiImgList.length > 1">
            <div  class="img-box-contaier-left">
              <span>
                {{ newUiImgList.length }}种
              </span>
              <span>
                可选
              </span>
            </div>

            <div class="img-box-contaier">
              <div v-for="(stepItem,index) in newUiImgList" :key="index" :class="['level_menu',selectProId ==stepItem.id && stepItem.imgUrl? 'ui-active' : '']" @click="uiSkuSelected(stepItem, index)">
                <img :src="stepItem.imgUrl" alt="" v-if="stepItem.imgUrl">
              </div>
            </div>
          </div>

          <!-- 价格和促销-->
          <div class="details-colortype">
            <div class="fourth-cells">
              <div class="fourth-cell">
                <div class="product-price price_p">
                  <div class="left-price-wraaper">
                    <span class="spu_price" v-if="shelvesStatus == '1'">

                      <span class="fqz-price" v-if="spu.integralPoint > 0">
                        <span>
                          <span class="special">{{ spu.integralPoint }}</span>
                          福气值+<span>{{ spu.deductionAfterPrice }}</span>元
                        </span>
                      </span>

                      <span class="spu_price_btn_yuan" v-else>
                        <span class="spu_price_btn_icon">¥</span>
                        <span class="spu_price_btn_pre_price">{{ setPrice(spu.price)[0] }}</span>
                        <span class="spu_price_btn_dian_price">.{{ setPrice(spu.price)[1] }}</span>
                      </span>


                      <span class="spu_price_btn" v-if="spu.afterCouponPrice && spu.afterCouponPrice>0">
                        <span class="spu_price_btn_text">券后</span>
                        <span class="spu_price_btn_icon">¥</span>
                        <span class="spu_price_btn_pre_price">{{ setPrice(spu.afterCouponPrice)[0] }}</span><span class="spu_price_btn_dian_price">.{{ setPrice(spu.afterCouponPrice)[1] }}</span>
                      </span>


                      <!--有促销价或者用户价格则显示原价  但是预售不显示原价-->
                      <span class="active-price">
                        <div v-if="spu.oldPrice != spu.price && !spu.afterCouponPrice">
                          <span class="line"></span>
                          <span class="spu_price_btn_icon">¥</span>
                          <span class="spu_price_btn_pre_price">{{ setPrice(spu.oldPrice)[0] }}</span>
                          <span class="spu_price_btn_dian_price">.{{ setPrice(spu.oldPrice)[1] }}</span>
                        </div>
                      </span>

                    </span>
                    <span class="no-price" v-else>暂无报价</span>
                  </div>

                  <div class="icons-wrap" v-if='!isDistribution && !$route.query.promoteInfo'>
                    <span class="favouritebox">
                      <label>{{ favoriteText }}</label>
                      <img src="@/assets/img/goodsDetail/favourite2_2.png" alt v-if="!favourite" @click="favouriteChange" />
                      <img src="@/assets/img/goodsDetail/favourite2_1.png" alt v-else @click="favouriteChange" />
                    </span>
                  </div>
                </div>





                <!-- <div class="activebox-main">
                  <div class="activebox" v-if="spu.marketingVos && spu.marketingVos.length > 0 && shelvesStatus == '1'">
                    <template v-for="(active, activeIndex) in spu.marketingVos">
                      <label class="downpricebox" v-if="active.type == 1" :key="activeIndex">
                        <img src="../../assets/img/icon_pc@2x.png" class="pricedownimg" alt="" />
                        <span class="downprice">{{ active.fall.price }}元</span>
                      </label>
                      <label v-if="active.type == 16" class="activity-type" :key="activeIndex">
                        <div class="text">{{ active.marketingAttr.label }}</div>
                      </label>

                      <label class="buygivebox border_half" v-if="active.type == 12" :key="activeIndex">
                        {{ active.name }}
                      </label>

                      <template v-if="active.type == 13 && active.panicBuy.isShow > 0">
                        <label v-if="!active.seckillIsStart" :key="activeIndex">
                          <span class="seckill-old-price">¥{{ spu.oldPrice.toFixed(2) }}</span>
                        </label>
                        <label v-else class="seckill-notice" :key="activeIndex">
                          <div class="seckill-notice-icon">秒杀预告</div>
                          <div class="seckill-notice-info">
                            {{ `${active.startDate} 秒杀价 ¥${active.panicBuy.price.toFixed(2)} ` }}
                          </div>
                        </label>
                      </template>
                    </template>
                  </div>
                  <div v-if="(spu.performanceScore&&spu.performanceScore>0 && !isDistribution && !$route.query.promoteInfo)" class="activebox-score">
                  </div>
                    <img src="@/assets/img/goodsDetail/ji.png" alt=""><span>绩效：</span><span>{{ spu.performanceScore | filterFraction }}</span>
                </div> -->

                <div data-desc="活动标签" class="copun-item" v-if="spu.haveCoupon && couponShowlist.length > 0" @click="showCouponList">
                  <div class="left">
                    <span class="copun-icon" v-for="(tag,index) in couponShowlist" :key="index">
                      {{ tag.text }}
                    </span>
                  </div>
                  <div class="right">
                    <span>查看</span>
                    <img src="@/assets/img/goodsDetail/pai_arrow.png" alt="">
                  </div>
                </div>

                <!-- 本期排行榜 -->
                <!-- <div class="product-pai" v-if="spu.marketingVos && spu.marketingVos.length > 0 && shelvesStatus == '1'">    -->
                <!-- 这是取活动的，230320，修改为取专题 -->
                <div class="product-pai" v-if="false">
                  <img src="@/assets/img/goodsDetail/pai_hot.png" alt="">
                  <span>
                      <div class="activebox">
                        <template v-for="(active, activeIndex) in spu.marketingVos">
                          <label class="downpricebox" v-if="active.type == 1" :key="activeIndex">
                            <img src="../../assets/img/icon_pc@2x.png" class="pricedownimg" alt="" />
                            <span class="downprice">{{ active.fall.price }}元</span>
                          </label>
                          <!-- <label v-if="active.type == 16" class="activity-type" :key="activeIndex">
                            <div class="text">{{ active.marketingAttr.label }}</div>
                          </label> -->
                          <label v-if="active.type == 16" class="activity-type" :key="activeIndex">
                            <div class="text">{{ active.name }}</div>
                          </label>
                          <!-- 买送-->
                          <label class="buygivebox border_half" v-if="active.type == 12" :key="activeIndex">
                            {{ active.name }}
                          </label>
                          <!-- 秒杀-->
                          <template v-if="active.type == 13 && active.panicBuy.isShow > 0">
                            <label v-if="!active.seckillIsStart" :key="activeIndex">
                              <span class="seckill-old-price">¥{{ spu.oldPrice.toFixed(2) }}</span>
                            </label>
                            <label v-else class="seckill-notice" :key="activeIndex">
                              <div class="seckill-notice-icon">秒杀预告</div>
                              <div class="seckill-notice-info">
                                {{ `${active.startDate} 秒杀价 ¥${active.panicBuy.price.toFixed(2)} ` }}
                              </div>
                            </label>
                          </template>
                        </template>
                        <!-- 直降 -->
                      </div>
                  </span>
                  <img src="@/assets/img/goodsDetail/pai_arrow.png" alt="" @click="goToActive">
                </div>

                <!-- <div v-if="(spu.performanceScore&&spu.performanceScore>0 && !isDistribution && !$route.query.promoteInfo)" class="activebox-score">
                  <img src="@/assets/img/goodsDetail/ji.png" alt=""><span>绩效分：</span><span>{{ spu.performanceScore | filterFraction }}</span>
                </div> -->
                <!-- 专题 -->
                <div class="active" v-if="spu.skuLable && spu.skuLable.thematicLabel && spu.skuLable.thematicLabel.subjectLabel" @click="toThematic(spu.skuLable.thematicLabel)">
                  <div class="active-content">
                    <img class="active-hot" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-actity.png" alt=""/>
                    <div class="active-word">{{ spu.skuLable.thematicLabel.subjectLabel }}</div>
                  </div>
                  <img class="active-check" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-red.png" alt=""/>
                </div>
                <div data-desc='标签' class="tag-pannel" v-if="spu.skuLable && spu.skuLable.goodsTagList && spu.skuLable.goodsTagList.length > 0">
                  <div class="tag-list">
                    <div class="tag-every" v-for="tags in spu.skuLable.goodsTagList" :key="tags.id">
                      <div class="tag-inner">
                        {{ tags.tagName }}
                      </div>
                    </div>
                  </div>
                  <div class="expression" v-if="performanceScore>0">
                    <div class="performance">
                      <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" alt="">
                      <div class="num-pannel">绩效分:<span class="num">{{ performanceScore }}</span></div>
                    </div>
                  </div>
                </div>

                <div class="product-title">
                  {{ spu.name }}
                  <img v-if="sellOut === 1 && shelvesStatus == '1'" class="soldout" src="@/assets/img/cat_soldout@2x.png" alt="" />
                </div>
                <!-- 商品副标题 -->
                <!-- <div class="product-sub">{{ spu.subTitle }}</div> -->

                <div v-if="this.spu.isBatchSku != 1" class="clearfix product-price">
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

          <!--运费-->
          <group class="chooseInfo" label-align="left">
            <van-cell
              title="已选"
              is-link
              :value="chosenSpecAndNum"
              value-align="left"
              v-if="spu.sellOut == 1 || spu.stock == 0 || spu.shelvesStatus == 0 || spu.shelvesStatus == 2 || spu.isGift == 1"
              class="address-icon-wrap-cell"
            >
              <!-- 使用 right-icon 插槽来自定义右侧图标 -->
              <template #right-icon>
                <img src="@/assets/img/goodsDetail/choose_arrow.png" alt="" style="width:6px;height:6px">
                <!-- <van-icon name="search" class="chooseInfo-search-icon" /> -->
              </template>
            </van-cell>

            <van-cell title="已选" is-link @click.native="toShowSpecValues(1, 0, 0)" :value="chosenSpecAndNum" value-align="left" class="chose-icon-wrap-cell two-line-ellipsis" v-else>
              <template #right-icon>
                <img src="@/assets/img/goodsDetail/choose_arrow.png" alt="" style="width:16px; height:16px;margin-top:1px">
              </template>
            </van-cell>

            <popup-picker ref="areasPicker" v-show="false" @on-change="addressChange" :data="areas" :columns="3" :show.sync="areasShow" v-model="addressValue" show-name>
            </popup-picker>
            <van-cell
              title="送至"
              is-link
              :value="selectAddress || '请选择你的收货地址'"
              value-align="left"
              @click.native="toSelectAddress"
              class="address-icon-wrap-cell aress-icon"
            >
              <div slot="title">
                <div class="address-icon-wrap">送至</div>
              </div>
              <template #right-icon>
                <img src="@/assets/img/goodsDetail/choose_arrow.png" alt="" style="width:16px; height:16px;margin-top:1px">
              </template>
            </van-cell>
            <van-cell value-align="left" class="chose-icon-wrap-cell" v-if="spu.sku.goodsSource != 5"
              :value="freight.toFixed(2) != 0.0 ? freight.toFixed(2) + '元' : '免运费'">
              <div slot="title">运费</div>
              <!-- {{ freight.toFixed(2) != 0.0 ? freight.toFixed(2) + '元' : '免运费' }} -->
            </van-cell>

            <div class="activity-desc-box" v-if="services.length>0">
              <div :class="['activity-desc',newDescBoxHeight >25 && isUnFold ? 'activity-desc-three-line':  newDescBoxHeight <=27 ?
                'activity-desc-one-line' : 'activity-desc-two-line'
              ]"
              v-if="services" ref="descBox">
                <div v-for="(item, index) in services" :key="index" class="activity-desc-contaier">
                  <span>
                    <img src="@/assets/img/goodsDetail/check.png" alt="">
                  </span>
                  <span>{{item}}</span>
                </div>
              </div>
            </div>
            <!-- 占位查询高度 -->
            <template v-if="true">
              {{descBoxHeight}}
            </template>
            <div class="activity-desc-btn-contaier"  v-if="services && newDescBoxHeight>51">
              <div
                class="activity-desc-btn"
                @click="isUnFold = !isUnFold"
                >
                  <img :src="isUnFold ? require('@/assets/img/goodsDetail/up_arrow.png'): require('@/assets/img/goodsDetail/down_arrow.png')" alt="">
              </div>
            </div>
          </group>



          <div ref="detailPage" style="position: relative; top: -3.5rem"></div>

          <!-- 商品详情   min-height: 85vh;-->
          <div class="goods-title">
            <img :src="`${this.$smartImg}/detail/2023-09-25/left-icon.png`" alt="">
            <span>宝贝详情</span>
            <img :src="`${this.$smartImg}/detail/2023-09-25/right-icon.png`" alt="">
          </div>




          <!-- 商品介绍 -->
          <div class="tab-details tab-introduce" v-if="spu.detail || spu.video || (spu.mobileImageUrlList && spu.mobileImageUrlList.length > 0)">
            <div class="tab-details-contaier tab-details-contaier-introduce">
              <img src="@/assets/img/goodsDetail/introduce.png" alt="">
              <span>商品介绍</span>
            </div>

            <div :class="['clearfix', 'tab-introduce-contaier', ]"
              :style="trueImgHeight>=500 ? 'height: 500px;overflow: hidden;' : 'height: auto;'"
              ref="imgHeight" id="imgHeight">
              <!-- 新详情 -->
              <div v-if="spu.detail">
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
                <div v-html="spu.detail" class="richText"></div>
              </div>
              <!-- 旧详情 -->
              <div v-else>
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
                <span class="spu-desc" v-html="spu.mobileDesc" v-if="spu.detailIsNew == 0"></span>
                <div class="tab-introduce-contaier">
                  <template v-for="(item, index) in spu.mobileImageUrlList">
                    <img :src="item" alt="" :key="index" width="100%" />
                  </template>
                </div>
              </div>
            </div>
            <div class="tab-introduce-contaier-box" v-if="firstImgHeight>500">
              <div
                class="activity-desc-btn"
                @click="handleImgUnFold"
                >
                  <img :src="trueImgHeight>=500 ? require('@/assets/img/goodsDetail/down_arrow.png') : require('@/assets/img/goodsDetail/up_arrow.png')" alt="">
              </div>
            </div>
          </div>


          <div class="tab-details" ref="detailBox" v-if="spu.video || (spuAttributeValuesdata && spuAttributeValuesdata.length>0) ||
           (allspuAttributeValuesdata && allspuAttributeValuesdata.length>0)">
            <div class="tab-details-contaier">
              <img src="@/assets/img/goodsDetail/spu.png" alt="">
              <span>商品规格</span>
            </div>
            <div class="clearfix" style="margin-bottom: 3px">
              <table class="table-border" width="100%">
                <tbody v-if="!showup">
                  <tr v-for="(attribute, index) in spuAttributeValuesdata" :key="index">
                    <td>
                      <span style="color: #999; font-size:11px; transform: scale(0.91);">
                        {{ attribute.attributeName }}
                      </span>
                    </td>
                    <td>
                      <span style="color: #999;font-size:11px; transform: scale(0.91);">{{ attribute.attributeValue }}</span>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(attribute, index) in allspuAttributeValuesdata" :key="index">
                    <td>
                      <span style="color: #999;font-size:11px; transform: scale(0.91);">
                        {{ attribute.attributeName }}
                      </span>
                     </td>
                    <td>
                      <span style="color: #999;font-size:11px; transform: scale(0.91);">{{ attribute.attributeValue }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="allspuAttributeValuesdata.length > 7"
                class="activity-desc-tab-btn tab-details-rule"
                @click="showdown"
                >
                <img :src="showup ? require('@/assets/img/goodsDetail/up_arrow.png'): require('@/assets/img/goodsDetail/down_arrow.png')" alt="">
              </div>
            </div>
          </div>

          <!--商品评价-->
          <div ref="assessPage" style="position: relative; top: -3.5rem"></div>
          <div ref="commentBox" :style="isDistribution? 'marginBottom: 16px' : 'marginBottom: 0'">
            <!-- <h5 v-if="commentSummarize.allCommentCount <= 0" class="commenbox-h5">
              暂无评论
            </h5> -->
            <group class="commenbox">
              <cell
                title=""
                :value="'暂时还没有评价哦~'"
                value-align="left"
                v-if="commentSummarize.allCommentCount <= 0"
                class="noneComment"
              ></cell>
              <div  v-else class="coment-answer">
                <section>
                  <div class="coment-answer-left">
                    <span>{{ commenttitle }}</span>
                    <span>({{ commentSummarize.allCommentCount | filterComment }}) </span>
                  </div>
                  <div class="coment-answer-right" v-if="!(comments.length==1 && comments[0].score<5 || comments.length==0) &&
                    !(comments.length==2  && comments[0].score<5  && comments[1].score<5)">
                    <span>
                      好评度{{ commentHandle(commentSummarize.goodCommentCount / commentSummarize.allCommentCount) }}
                    </span>
                  </div>
                </section>
              </div>

              <div class="assess-wrapper" v-if="commentSummarize.allCommentCount > 0" @click="toMoreComments">
                <group :class="['friends-item',commentSummarize.allCommentCount > 2 ? 'friends-item-line': '']" v-for="(item, index) in comments" :key="index">
                  <cell class="pl_header">
                    <div slot="title" class="header">
                    <img v-if="item.customerImage" :src="item.customerImage" class="pl_headerimg" alt />
                    <img src="../../assets/img/Avatar_default.png" alt v-else class="pl_headerimg" />


                    <section>
                      <main>
                        <div class="username" v-if="item.isAnonymous == 0">
                          <span v-if="item.relename">
                          {{
                            item.relename.length > 1
                            ? item.relename.charAt(0) + '****' + item.relename.charAt(item.relename.length - 1)
                            : item.relename.charAt(0) + '****'
                          }}
                          </span>
                          <span v-else>
                          {{
                            item.customerName.length > 1
                            ? item.customerName.charAt(0) + '****' + item.customerName.charAt(item.customerName.length - 1)
                            : item.customerName.charAt(0) + '****'
                          }}
                          </span>
                        </div>
                        <div class="username" v-else>
                          <span v-if="item.relename">
                          {{ '*****' + item.relename.charAt(item.relename.length - 1) }}
                          </span>
                          <span v-else>
                          {{ '*****' + item.customerName.charAt(item.customerName.length - 1) }}
                          </span>
                        </div>
                        <div class="ping-list">
                          <img :src="item.score >= '1' ? require('@/assets/img/goodsDetail/ping_1.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                          <img :src="item.score >= '2' ? require('@/assets/img/goodsDetail/ping_2.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                          <img :src="item.score >= '3' ? require('@/assets/img/goodsDetail/ping_3.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                          <img :src="item.score >= '4' ? require('@/assets/img/goodsDetail/ping_4.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                          <img :src="item.score >= '5' ? require('@/assets/img/goodsDetail/ping_5.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="">
                        </div>
                      </main>
                      <span class="pl_header_footer">{{ item.createTime.split(' ')[0] }}</span>

                    </section>
                    </div>
                  </cell>
                  <cell :title="item.comment" class="commentContent" @click.native="toMoreComments"></cell>

                  <div class="sku_sx">{{ item.skuSpecName }}</div>

                  <div class="comments-img" v-if="item.commentPics.length > 0">
                    <div class="previewerImg" v-for="(element, imgIndex) in item.commentPics" :key="imgIndex">
                    <img v-if="element.url" :src="element.url" @click.stop="showImg(item.commentPics, imgIndex)" />
                    </div>
                  </div>

                  <custom-comment :commentData="item.commentReplies" :paddingStyle="{ padding: '0' }" :keys="'detail'"></custom-comment>
                </group>
              </div>

              <div class="coment-answer-btn" v-if="commentSummarize.allCommentCount >2"  @click="toMoreComments">
                查看全部评价
              </div>

            </group>
          </div>

          <!-- 热销商品 -->
          <!--推荐-->
          <div ref="recommend" style="position: relative; top: -3.5rem"></div>
          <!-- <div class="xq_wntj" style="margin-top: 20px" v-if="(!isDistribution && !$route.query.promoteInfo)"> -->
          <div class="xq_wntj" style="margin-top: 20px">
            <shopList :title="'热销商品'" :detailShow="detailShow" :skuId="skuId" :isDistribution="isDistribution" :botTip="'见底啦~不如去'"></shopList>
          </div>
          <!-- 首页逛逛 -->
          <!-- <div class="go-home" @click="$router.push({ path: '/' })">
            <span>
              首页逛逛
            </span>
          </div> -->
        </div>

        <div class="tips" v-if="spu.isGift == 1 && shelvesStatus == '1'">抱歉，该商品为赠品不支持单独购买</div>
        <!-- 底部的购买 -->
        <section class="actionbar footerbox">
          <span class="sell-out" v-if="shelvesStatus !== '1'">抱歉，该商品已下架</span>
          <span class="sell-out" v-else-if="spu.tabooStatus && isDistribution">该商品暂不支持分销，换个商品试试吧</span>
          <div class="action-list">
            <ul class="action-other">
              <li class="action-other-li" @click="callUp">
                <img src="@/assets/img/goodsDetail/people.png" alt />
                <span class="action-other-li-text">客服</span>
              </li>

              <li class="action-other-li" v-if='!isDistribution && !$route.query.promoteInfo' @click="handleShare">
                <img src="@/assets/img/goodsDetail/share.png" alt />
                <span class="action-other-li-text">分享</span>
              </li>
            </ul>
            <div class="footer-btn flex1">
            <a
              v-if="(isVirtual == 0 && !sellOut && spu.isGift != 1 && shelvesStatus == '1' && !isDistribution && !$route.query.promoteInfo)"
              @click="toShowSpecValues(1, 0, 1)"
              class="yellow-btn font-size16"
            >
              加入购物车
            </a>
            <a
              v-if="((isVirtual == 0 && sellOut) || spu.isGift == 1 || shelvesStatus != '1') && !isDistribution && !$route.query.promoteInfo"
              class="yellow-btn font-size16 yellow-btn-disabled"
            >
              加入购物车
            </a>
            <a v-if="isDistribution" @click.prevent="distributionShare()" class="yellow-btn" :class="[spu.tabooStatus?'yellow-btn-disabled':'',]">
              <div v-if="isDistribution && (spu.preCommission || spu.preCommission === 0)" class="share_price">
                <div class="font-size11">
                  预估佣金
                </div>
                  <div class="spu_price_btn_icon">¥</div>
                  <div class="spu_price_btn_pre_price">{{ setPrice(spu.preCommission)[0] }}</div>
                  <div class="spu_price_btn_dian_price">.{{ setPrice(spu.preCommission)[1] }}</div>
              </div>
              <span class="font-size13">立即分享</span>
            </a>
            <a
              v-if="!sellOut && spu.isGift != 1 && shelvesStatus == '1'"
              @click="toShowSpecValues(1, 0, 2)"
              class="red-btn"
              :class="{'btn-disabled':isDistribution&&spu.tabooStatus, 'distriFooterCommon': isDistribution }"
            >
              <p>{{ isShowCouPri ? '领券购买' : '立即购买' }}</p>
              <p v-if="isShowCouPri">券后{{ discountsPrice ? discountsPrice.toFixed(2) : '' }}元</p>
            </a>
            <a v-if="sellOut || spu.isGift == 1 || shelvesStatus != '1'" class="red-btn red-btn-disabled" >
              立即购买
            </a>
            </div>
          </div>
        </section>
      </div>

      <van-popup v-model="couponListVisible" closeable close-icon="close" round position="bottom" :style="{ height: '21.28rem', padding: '0.64rem 0.72rem' }">
        <div class="copun-box">
          <div style="text-align: center; font-size: 0.64rem; color: #000; font-weight: 600">优惠</div>

          <div class="copun-list-wrapper">
            <div class="copun-detail-box">
              <div class="real-price">
                <p>¥{{  chooseCoupon && chooseCoupon.id ?chooseCoupon.afterCouponPrice.toFixed(2) : spu.price.toFixed(2) }}</p>
                <p>预估到手</p>
              </div>
              <div class="choose-detail">
                <p class="choose-title">当前购买可使用以下优惠</p>
                <p v-if="chooseCoupon && chooseCoupon.id" class="reduce-detail">
                  <span v-if="chooseCoupon.couponsType == 1 || chooseCoupon.couponsType == 3">¥{{chooseCoupon.beforeCouponPrice.toFixed(2)}} - ¥{{ chooseCoupon.faceValue }}</span>
                  <span v-if="chooseCoupon.couponsType == 2">¥{{chooseCoupon.beforeCouponPrice.toFixed(2)}} * {{ chooseCoupon.faceValue }}折</span>
                </p>
                <div v-if="chooseCoupon && chooseCoupon.id" class="choose-detail-wrapper">
                  <div>
                    <p>¥{{chooseCoupon.beforeCouponPrice.toFixed(2)}}</p>
                    <p>当前售价</p>
                  </div>
                  <div>
                    <p v-if="chooseCoupon.couponsType == 1">满{{chooseCoupon.amountLimitation}}减{{chooseCoupon.faceValue}}</p>
                    <p v-if="chooseCoupon.couponsType == 2">{{chooseCoupon.faceValue}}折</p>
                    <p v-if="chooseCoupon.couponsType == 3">满{{chooseCoupon.faceValue}}减{{chooseCoupon.faceValue}}</p>
                    <p>商品券</p>
                  </div>
                </div>
                <p class="no-use-tip" v-else>不使用优惠券</p>
              </div>

            </div>

            <p class="copun-title" v-if="couponList && couponList.length">可用</p>
            <div v-for="(item, index) in couponList" :key="item.id" class="copun-use-item" @click="chooseCopun(item, index)">
              <div class="left">
                <div class="cost-money" v-if="item.couponsType == 1 || item.couponsType == 3">
                  <span class="coin">￥</span>
                  <span class="price" :class="{'bigPrice':item.faceValue>999}">{{item.faceValue}}</span>
                </div>
                <div class="cost-money" v-if="item.couponsType == 2">
                  <span class="price">{{item.faceValue}}</span>
                  <span class="coin">折</span>
                </div>
                <div class="use-condition">
                  <p class="condition-price" v-if="item.couponsType == 1">满{{item.amountLimitation}}可用</p>
                  <p class="condition-price" v-if="item.couponsType == 2 ">无门槛</p>
                  <p class="condition-price" v-if="item.couponsType == 3">满{{ item.faceValue }}元可用</p>
                  <p class="condition-time">{{ item.effectiveStartTime | filterTime }}-{{ item.effectiveEndTime | filterTime }}</p>
                </div>
              </div>
              <div class="right">
                <img v-if="item.checked" src="@/assets/img/copun-selected.png" alt="">
                <img v-else src="@/assets/img/copun-choose.png" alt="">
              </div>
              <span class="top-icon">商品券</span>
            </div>
            <p class="copun-title" v-if="disCouponList && disCouponList.length">当前不可用</p>
            <div v-for="(item) in disCouponList" :key="item.id" class="copun-use-item no-use">
              <div class="left">
                <div class="cost-money" v-if="item.couponsType == 1 || item.couponsType == 3">
                  <span class="coin">￥</span>
                  <span class="price" :class="{'bigPrice':item.faceValue>999}">{{item.faceValue}}</span>
                </div>
                <div class="cost-money" v-if="item.couponsType == 2">
                  <span class="price" >{{item.faceValue}}</span>
                  <span class="coin">折</span>
                </div>
                <div class="use-condition">
                  <p class="condition-price" v-if="item.couponsType == 1">满{{item.amountLimitation}}可用</p>
                  <p class="condition-price" v-if="item.couponsType == 2 ">无门槛</p>
                  <p class="condition-price" v-if="item.couponsType == 3">满{{ item.faceValue }}元可用</p>
                  <p class="condition-time">{{ item.effectiveStartTime | filterTime }}-{{ item.effectiveEndTime | filterTime }}</p>
                  <!-- <p class="dis-reson">结算商品中没有该商品或结算金额不符合条件</p> -->
                </div>
              </div>

              <div class="right">
                <img src="@/assets/img/copun-choose.png" alt="">
              </div>
              <span class="top-icon">商品券</span>
            </div>
          </div>
          <div class="handle-sure-btn" @click="sureCopun">确认</div>
        </div>

      </van-popup>

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
        @open-preview="previewImg"
        :hide-selected-text="true"
      >
      <!--去掉 reset-selected-sku-on-hide  关闭弹窗保留sku选择-->
        <template #sku-header-price="props">

          <div class="spu_price">
            <span class="fqz-price" v-if="spu.integralPoint > 0">
              <span>
                <span class="special">{{ spu.integralPoint }}</span>
                福气值+<span>{{ spu.deductionAfterPrice }}</span>元
              </span>
            </span>

            <span class="spu_price_btn_yuan" v-else>
              <span class="spu_price_btn_icon">¥</span>
              <span class="spu_price_btn_pre_price">{{ skuPriceInt(props.price, 'spec') }}</span>
              <span class="spu_price_btn_dian_price">.{{ skuPriceFloat(props.price, 'spec') }}</span>
            </span>

            <span class="spu_price_btn" v-if="spu.afterCouponPrice && spu.afterCouponPrice>0">
              <span class="spu_price_btn_text">券后</span>
              <span class="spu_price_btn_icon">¥</span>
              <span class="spu_price_btn_pre_price">{{ setPrice(spu.afterCouponPrice)[0] }}</span><span class="spu_price_btn_dian_price">.{{ setPrice(spu.afterCouponPrice)[1] }}</span>
            </span>


            <span class="active-price">
              <div v-if="spu.oldPrice != spu.price && !spu.afterCouponPrice" style="position: relative">
                <span class="line"></span>
                <span class="spu_price_btn_icon">¥</span>
                <span class="spu_price_btn_pre_price">{{ setPrice(spu.oldPrice)[0] }}</span>
                <span class="spu_price_btn_dian_price">.{{ setPrice(spu.oldPrice)[1] }}</span>
              </div>
            </span>
          </div>
          <div class="expression" v-if="performanceScore>0">
            <div class="performance">
              <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" alt="">
              <div class="num-pannel">绩效分:<span class="num">{{ performanceScore }}</span></div>
            </div>
          </div>

          <div class="van-sku-header-item">{{ selectAttribute(selectedSku) }}</div>

        </template>
        <template #sku-stepper="props">
          <div class="van-sku-stepper-stock">
            <div class="van-sku__stepper-title">数量</div>
            <van-stepper
              class="van-stepper van-sku__stepper"
              @change="numChange($event, props)"
              v-model="num"
              integer
              :min="minNum"
              :max="props.selectedSkuComb ? props.selectedSkuComb.stock_num : 0"
              :input-width="(num + '').length > 3 ? (((num + '').length - 3) * 2.14 + 7.2) + 'vw' : '7.2vw'"
            />
            <div
              v-if="spu.marketingVos && spu.marketingVos[0] && spu.marketingVos[0].type == 13 && !spu.marketingVos[0].seckillIsStart"
              style="float: right; color: #e60113; padding-right: 0.8rem"
            >
              限购{{ spu.marketingVos[0].panicBuy.limitNum }}件
            </div>
            <div
              v-if="isSpecialArea"
              style="float: right; color: #e60113; padding-right: 0.8rem"
            >
              限购{{ spu.marketingVos.filter((item) => item.type == '16')[0].specialArea.limitNum }}件
            </div>
          </div>
        </template>

        <template #sku-actions="props">
          <!-- <p style="text-align: center; height: 0.56rem; line-height: 0.56rem; color: #999" v-if="couponName && props.price">
            当前商品可使用
            <span style="color: #e60113">{{ couponName }}</span>
            店铺优惠券
          </p> -->
          <!---start 不是虚拟商品不显示加入购物车 skuDetail.isVirtual == 0-->
          <div class="footer-btn padding12 isPhone-bottom" v-if="isFrom == 0">
            <div
              v-if="(spu.isVirtual == 0 && !isDistribution && !$route.query.promoteInfo)"
              @click="addShoppingCart(props)"
              class="yellow-btn"
              :class="sellOut || spu.isGift == 1 ? 'yellow-btn-disabled' :''"
            >
              加入购物车
            </div>
            <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
            <div
              @click="buyNow(props)"
              class="red-btn"
              :class="{ 'red-btn-disabled': sellOut || spu.isGift == 1}"
            >
              {{ isShowCouPri ? '领券购买' : '立即购买' }}
            </div>
          </div>
          <!--end 不是虚拟商品不显示加入购物车-->
          <!-- isVirtual 是否是虚拟商品 0否 1是 -->
          <div class="footer-btn padding12 isPhone-bottom" v-if="isFrom == 1">
            <div
              v-if="spu.isVirtual == 0"
              @click="addShoppingCart(props)"
              class="yellow-btn"
              :class="{'red-btn-disabled' : sellOut || spu.isGift == 1 }"
            >
              {{ isShowCouPri ? '确定' : '加入购物车' }}
            </div>
          </div>
          <div  class="footer-btn padding12 isPhone-bottom" v-if="isFrom == 2">
            <div
              @click="buyNow(props)"
              class="red-btn"
              :class="{ 'red-btn-disabled': sellOut || spu.isGift == 1 }"
            >
              {{ isShowCouPri ? '领券购买' : '立即购买' }}
            </div>
          </div>
        </template>
      </van-sku>

      <!--评论放大图-->
      <div v-for="(item, index) in comments" :key="index">
        <previewer :list="item.commentPics" ref="previewer" :options="options(index)"></previewer>
      </div>


      <div class="backcart" v-if="!isDistribution && !$route.query.promoteInfo" @click="toCart" ref="backcart">
        <span></span>
        <div>
          <img src="@/assets/img/goodsDetail/bottom_cart.png" alt />
          <div class="backcart-box">
            <span :class="[carActive == 1? 'car1' : carActive == 2 ? 'car2' : carActive == 3 ? 'car3' : '']">
              <span>{{ carNum }}</span>
            </span>

          </div>
         </div>
      </div>

      <coupun-popup ref="couponUnit" @coonfirmCoupun='coonfirmCoupun' :haveActivity="true"></coupun-popup>

      <!-- 回到顶部 -->
      <div class="backtop" v-if="backtopshow" @click="backtop">
        <img src="@/assets/img/goodsDetail/go_top.png" alt />
        <span>顶部</span>
      </div>
    </div>

    <van-share-sheet
      v-model="showSharePopup"
      class="custome-share"
      title="分享图片至"
      :close-on-click-overlay="true"
      :lock-scroll="false"
      :options="shareSheetOptions"
      @select="onSelectShare"
      @cancel="onCancelShare"
      @click-overlay="clonse"
    ></van-share-sheet>

    <!-- 海报展示 -->
    <div v-show="posterShow" class="saveImg">
      <van-image :src="posterImg" />
    </div>

    <div class="share-poster-loading" v-show="showLoading == true">
      <van-loading color="#fff" size="0.96rem" vertical>加载中...</van-loading>
    </div>
    <div class="share-poster-container" ref="shareCard" v-show="showShareType == 2 && showSharePopup == true">
      <div class="share-card-wrap">
        <div class="goods-img">
          <img v-if="postMainImg" :src="postMainImg" alt="" />
        </div>
        <div class="goods-info">
          <div class="info">
            <div class="goods-price">
              ￥
              <span>{{ spu.price ? spu.price.toFixed(2) : '' }}</span>
            </div>
            <div class="hint-text">价格具有时效性</div>
            <div class="goods-name">{{ postSpuName }}</div>
          </div>
          <div class="qrcode-wrap" v-if="showQrcode">
            <div id="qrcode" ref="qrcode"></div>
            <img :src="qrCodeImgUrl" class="qrcodeImg" />
            <p class="tip">-长按或扫码购买-</p>
          </div>
        </div>
        <div class="brand">
          <img src="@/assets/img/wsf_logo@2x.png" class="logo" />
        </div>
      </div>
    </div>
    <SecondConfirm
      title="用户注册协议"
      cancleText="先浏览看看"
      sureText="同意"
      :dialogshow="registrationProtocolIsShow"
      @closeBack="$store.commit('SET_REGISTRATIONPROTOCOL', false)"
      @rightEvent="hasPayPasswordDialogFun"
    >
      <div slot="textp">
        <div class="registration-protocol">
          <div v-html="protocol"></div>
        </div>
      </div>
    </SecondConfirm>
    <van-popup v-model="showAddress" round position="bottom">
      <template>
        <div class="addresspop">
          <div class="addresspop-close" @click="addresspopClose"></div>
          <div class="addresspop-title">
            配送至
          </div>
          <div class="addresspop-content">
            <div class="addresspop-location">
              <div class="addresspop-location__icon"></div>
              <div class="addresspop-location__content">
                <div class="addresspop-location__content-top">
                  <div class="addresspop-location__desc">{{rePosition ? '上次定位' : '当前定位'}}</div>
                  <div class="addresspop-location__address-detail">{{ positionName }}</div>
                </div>
                <div class="addresspop-location__address" v-if="positionStreet">{{ positionStreet }}</div>
              </div>
              <!--
                UI 3 期暂时注释，UI4期整体完善
                @click.stop="toPosition" -->
              <div class="addresspop-location__retry" style="opacity: 0">重新定位</div>
            </div>
            <div v-if="addressListData.length == 0" class="addresspop-empty">
              <div class="addresspop-empty__flag">
              </div>
              <div class="addresspop-empty__desc">暂无设置收货地址～</div>
            </div>
            <div v-else class="addresspop-list">
              <div v-for="(item, index) in addressListData"
                :key="index"
                class="addresspop-list__every"
                @click="onSelectAddress(item.address+item.detailAddress, item.id, item.address)"
                :class="index == 0 ? 'addresspop-list__every-first' : ''"
                >
                <div :class="
                  activeAddress == item.id
                  ? 'addresspop-list__checked'
                  : 'addresspop-list__check'
                "></div>
                <div class="addresspop-list__content">
                  <div class="addresspop-list__address-detail">
                    {{ item.detailAddress }}
                  </div>
                  <div class="addresspop-list__address">
                    {{ item.address }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="addresspop-add">
            <div class="addresspop-add__btn" @click="selectOther">
              添加收货地址
            </div>
          </div>
        </div>
      </template>
    </van-popup>
  </div>
  <div v-else class="empty-page">
    <div class="empty-page-header">
      <i v-if="shareflag" @click="toIndex"></i>
      <i v-else @click="toBack"></i>
    </div>
    <img class="empty-page-img" :src="emptyImg" mode="" />
    <div class="empty-page-text">抱歉，链接已失效〜</div>
    <div v-if="shareflag" class="empty-page-btn" @click="toIndex">看看其他</div>
    <div  v-else class="empty-page-btn" @click="toBack">看看其他</div>
  </div>
</template>

<script>
  import { Badge, Cell, Clocker, cookie, Divider, Group, InlineXNumber, LoadMore, PopupPicker, Previewer, Swiper, SwiperItem, Tab, TabItem } from 'vux'

  import {
    addAttention,
    addBrowseRecord,
    addShoppingCart,
    calculatefreight,
    cancelAttention,
    queryAllAreas,
    querySkuComments,
    querySkuSpecs,
    querySpu,
    querySpuSpecs,
  } from '@/api/spudetail'
  // import { getUserSpuCoupons } from '@/api/mycoupon'
  import { queryDiscounts } from '@/api/shoppingcart'
  import { getCreateShareCode, getShareCode } from '@/api/activities/distributionActivity'

  import QRCode from 'qrcode'
  import html2canvas from 'html2canvas'
  import { checkSkuPanicBuyLimitNum, querySeckillSceneSpuDetail } from '@/api/activities/seckill'
  import { getjssdk } from '@/api/wx'
  import { queryCartCount } from '@/api/shoppingcart'
  import { queryCommentSummarize } from '@/api/comments'
  import { isDistribution } from '@/api/home'
  import { visit, detailsVisit } from '@/api/visit'
  import { getToken } from '@/utils/token'
  import shopList from '@/components/commons/shopList'
  import { Button, Icon, Popup, Rate, Sku, Stepper, Toast, Loading, ImagePreview, Swipe, SwipeItem } from 'vant'
  import wx from 'weixin-js-sdk'
  import seckillBanner from '../../views/spu/spuDetail/modules/seckillBanner'
  import { getDate, deepClone, formatPrice, isMobile, appBack } from '@/utils/utils'
  import logoImg from '@/assets/img/wsf-logo.png'
  import emptyImg from '@/assets/img/cat_d@2x.png'
  import CustomComment from '@/components/commons/CustomComment'
  import timeFormat from '@/utils/timeFormat'
  import Cookies from 'js-cookie'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
  import nofund from '@/components/commons/nofund'
  import { queryCustomerAddress } from '@/api/customeraddresslist' //查询用户收货地址
  import goodsSearch from '@/components/index/template/header/goodsSearch.vue'
  import smoothscroll from 'smoothscroll-polyfill';
  import { movePointRight } from '@/utils/number'
  import CoupunPopup from '@/components/commons/coupunPopup.vue'
  import { getUsersource } from '@/utils/utils'
  import { smartOpenDeepLink } from '@/utils/hybrid'
  import { getLocationByQQMap, getLocation } from '@/utils/location'

  export default {
    mixins: [userRegistrationProtocol],
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
      Clocker,
      [Icon.name]: Icon,
      [Toast.name]: Toast,
      [Rate.name]: Rate,
      [Stepper.name]: Stepper,
      [Sku.name]: Sku,
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Loading.name]: Loading,
      [ImagePreview.name]: ImagePreview,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      shopList,
      seckillBanner,
      CustomComment,
      SecondConfirm,
      CoupunPopup,
      nofund,
      goodsSearch
    },
    data() {
      const self = this
      return {
        videoKey: Date.now(),
        spuVideoPic:'',
        timeFormat,
        isVirtual: 0,
        shareflag: this.$route.query.shareflag ? this.$route.query.shareflag : false,
        delPrice: false,
        skuLimitNum: 0,
        showLoading: false,
        emptyImg: emptyImg,
        postMainImg: null,
        postSpuName: null,
        logoImg: logoImg,
        showQrcode: true,
        shareImgUrl: '',
        qrCodeImgUrl: '',
        showShareType: -1,
        showSharePopup: false,

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
        currentSelected: 0, // 拼团的时候用于判断是选择的拼团还是非拼团 0 非拼团 1 拼团
        sourceFrom: 1, // 判断底部是否显示确定 0 显示 1 不显示
        minNum: 1, //购买的最低数量
        isProcess: false, // 接口是否处理中
        loading: true, // 加载中
        spuTabIndex: 0, // 当前tab的选中  0 商品 1 评价 2 详情 3 推荐
        carouselPics: [], // 轮播图片
        spu: {}, // 商品信息
        services: '', // 服务主持
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
        comments: [], // 评价
        addressValue: [], // 选择省市区的值
        carNum: 0, // 购物车总数
        isRefreshSpec: true, //是否更新商品规格，默认为true，防止点击规格重新查询并渲染页面造成闪烁
        showup: false, // 显示商品规格展开、收起
        spuAttributeValuesdata: '', // 截取商品规格
        allspuAttributeValuesdata: '', // 所有商品规格
        isFrom: 0, //0:加入购物车和立即购买； 1：加入购物车；  2：立即购买
        downOrup: '展开', // 展开收起
        commentSummarize: '', //好评率
        commenttitle: '', // 评论标题
        backtopshow: false, // 回到顶部显示隐藏
        sku: {
          list: [],
        },
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
        storeId: null, //店铺id
        couponList: [], //优惠券列表
        disCouponList:[], // 不可用优惠券列表
        chooseCoupon: {},
        copyChooseCoupon: {},
        spuPrice: null, //券前价格
        couponName: null, //可用最优优惠券的名字
        shopList: {
          shoppingCartList: [], //所有勾选的商品 用于计算最优
        },
        discountsPrice: null, //优惠价格
        isShowCouPri: false, //是否展示券后价格
        skuId: this.$route.query.id ? this.$route.query.id : '', //商品id
        showGuide: false, //微信或者浏览器引导
        recommendToken: '', // 推荐码（分销码）

        spuId: this.$route.query.spuId || this.$route.query.id  || '',

        activity: this.$route.query.activity ? this.$route.query.activity : 0, // 活动状态  0 - 普通商品  13 - 秒杀专区商品
        seckillScene: [], // 秒杀场次
        saveLimitNum: 1,
        showActiveType: [], // 规格显示划线价

        flag: false,
        noDetail: false,
        current: 0, // 自定义指示器
        controlsShow: false, // 视频控制器
        isPlayer: true,
        isDistribution: this.$route.query.isDistribution && !!JSON.parse(this.$route.query.isDistribution), // 是否是分销商品详情页面
        isLogin: getToken() ? getToken() : false, // 判断是否登录
        isH5: this.$store.state.userSource == 3,
        posterShow: false, //显示--海报展示
        posterImg: '', //海报图片
        distrInfo: {}, // 分销员信息
        selectAddress: '',
        positionName: '',
        positionStreet: '',
        cityName: '',
        positionCityName: '',
        activeAddress: -1,
        showAddress: false,
        rePosition: false,
        addressListData: [],
        areasShow: false,
        specValueId: '', // 当前选择的图片id
        newUiImgList: [

        ],
        // spuNewUiImgList: [
        // ], // 如果第一次进来去spu图片
        // firstFrom: true, // 是否是首次进入
        // isMoreThan2Line: false, // 服务信息是否超过2行
        isUnFold: false,
        newDescBoxHeight: 17,
        isCanClick: false, // 切换按钮能否点击
        selectProId: '', // 切换分类时选中的id
        isPhone: false,
        trueImgHeight: 0, // 详情图片区域高度
        firstImgHeight: 0, // 详情图片区域是否折叠
        ids: [],
        selectedSku: {},
        cartSkuId: this.$route.query.id ? this.$route.query.id : '', // 商品详情页进去购物车页面需要选中
        isMobile: false
      }
    },

    created() {
      const { isPhone } = isMobile();
      this.isPhone = isPhone
      this.isMobile = isMobile().isMobile
      smoothscroll.polyfill()
      this.$storage.clearOld()
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.loading = true
      this.querySpuDetail(this.skuId)
      this.queryCartCount()

      this.queryCustomerAddress()
	    this.getLastAddr()
      window.resetSpudetail = this.resetData

      // 埋点
      detailsVisit({
        skuId: this.skuId
      })
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
      this.handleScroll()
      // 获取定位
      this.getPositon()
    },
    activated() {
      window.scrollTo(0, 0)
      this.backtopshow = false
      let positionAddress = JSON.parse(sessionStorage.getItem('positionAddress'))
      if(positionAddress) {
        this.positionName = positionAddress.positionName
        this.positionStreet = positionAddress.positionStreet

        let reg = /.+?(省|市|自治区|自治州|县|区)/g;
        this.cityName = this.positionCityName = positionAddress.cityname

        // this.selectAddress = `${positionAddress.positionStreet}${positionAddress.positionName}`
        this.selectAddress = `${positionAddress.positionStreet}`
        this.selectAddress=  this.selectAddress.match(reg).join('')

        this.rePosition = true
        this.showAddress = false
        this.activeAddress = -1
        sessionStorage.removeItem('positionAddress')
        localStorage.setItem('positionAddress', JSON.stringify({
          selectAddress: this.selectAddress,
          id: -1,
          cityName: this.cityName,
          positionStreet: this.positionStreet,
          positionName: this.positionName,
          positionCityName: this.positionCityName
        }))
        this.calculateFreight()
      }
      // this.positionStreet =
      // if(positionAddress) {
      //   this.positionStreet =
      // }
    },

    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    // 兼容原生优惠券跳转电动车详情 goodsSource == 4时拦截跳转电动车详情页面
    beforeRouteEnter(to, from, next) {
      const goodsSource = to.query.goodsSource
      let urlType = {
        '4': '/motorCar/detail', // 两轮车商品详情
      }
      let jumpParams = {
        path: urlType[goodsSource],
        query: to.query
      }
      if (!goodsSource || !urlType[goodsSource]) return next()
      next(jumpParams)
    },
    beforeRouteUpdate (to, from, next) {
      if(from.path === '/spudetail') {
        this.loading = true
        this.skuId = to.query.id
        this.querySpuDetail(this.skuId)
        this.queryCartCount()
        this.queryCustomerAddress()
        this.getLastAddr()

        // 埋点
        detailsVisit({
          skuId: this.skuId
        })
      }
      next()
    },
    beforeRouteLeave(to, from, next) {
      if(to.name != 'chooseMap') {
          let key =
          this.$vnode.key || this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : "");
          let cache = this.$vnode.parent.componentInstance.cache;
          let keys = this.$vnode.parent.componentInstance.keys;
          if (cache[key]) {
            this.$destroy();
            delete cache[key];
            let index = keys.indexOf(key);
            if (index > -1) {
              keys.splice(index, 1);
            }
          }
        }
      next()
    },
    watch: {
      token(newVal) {
        if (newVal) {
          this.queryCartCount()
        }
      },
      backtopshow(value) {
        if (!value) this.returntop = false
      },
      // $route(to, from) {
      //   if (this.$route.query.id) {
      //     document.getElementsByTagName('body')[0].className = 'gray-bg'
      //     this.loading = true
      //     this.querySpuDetail(this.$route.query.id)
      //     this.queryCartCount()
      //   }
      // },
    },
    methods: {
      handleImgUnFold(){
        this.trueImgHeight = this.trueImgHeight>=500 ? '0' : 500
      },
      rollEffect(index) {
        this.$nextTick(() => {
          // 获取父盒子元素
          let levelMenusBox = document.getElementsByClassName('img-box-contaier')[0]
          if(!levelMenusBox) return
          // 获取一级菜单dom列表
          let levelMenus = document.getElementsByClassName('level_menu') || []
          // 动态获取元素的margin-right距离
          let marginRight = window.getComputedStyle(levelMenus[0]).marginRight.split('px')[0]

          let levelWidths = []
          // 遍历获取每个一级菜单的宽度
          for(let item of levelMenus) {
            let elWidth = window.getComputedStyle(item).width.split('px')[0]
            levelWidths.push((elWidth * 1 + marginRight * 1).toFixed(4) * 1)
          }

          // 获取第一个元素到当前点击元素的宽度list
          let elWidths = levelWidths.splice(0, index)
          // 计算所有元素的宽度
          let deviation = index > 0 && elWidths.reduce((preValue,curValue) => preValue + curValue)
          // 计算父盒子滚动距离
          let scrollLeft = index === 0 ? 0 : deviation - elWidths[elWidths.length - 1]

          levelMenusBox.scroll({
            top: 0,
            left: scrollLeft,
            behavior: "smooth", //滚动条平滑滚动
          });

        })
      },
      goToActive(){
        location.href = (location.origin + `/firstOrder?id=${this.spu.marketingVos[0].id}&pageType=detail`)
      },
      // 价格展示处理
      setPrice(val) {
        return formatPrice(val).split('.')
      },
      uiSkuSelected(ele, index){
        this.trueImgHeight = 0
        if(this.isCanClick) return
        if(!ele.imgUrl) return
        this.skuId = ele.id
        this.num = 1
        if (!this.$refs.vansku.selectedSkuComb) return
        if (this.skuId == this.$refs.vansku.selectedSkuComb.id) return
        this.rollEffect(index)
        this.querySpuDetail(this.skuId)
      },
      handleData(dataList){
        // 处理图片数据，12个为一组
        let newDataList = []
        let current = 0
        if(dataList && dataList.length>0){
          for(let i=0;i<=dataList.length-1;i++){
            if(i%12 !== 0 || i === 0 ){
              if(!newDataList[current]){
                newDataList.push([dataList[i]])
              }else{
                newDataList[current].push(dataList[i])
              }
            }else{
              current++
              newDataList.push([dataList[i]])
            }
          }
        }
        return [...newDataList]
      },
      resetData(){
        this.$storage.clearOld()
        document.getElementsByTagName('body')[0].className = 'gray-bg'
        this.querySpuDetail(this.skuId)
        this.queryCartCount()
        this.queryCustomerAddress()
      },
      // 是否有上一次本地缓存选择地址
      getLastAddr() {
        let address = JSON.parse(localStorage.getItem('positionAddress'))
        if(address) {
          this.activeAddress = address.id
          let reg = /.+?(省|市|自治区|自治州|县|区)/g;
          let adress = address.selectAddress.match(reg)
          this.selectAddress = adress.join('')
          // this.selectAddress = address.selectAddress,
          this.cityName = address.cityName
          this.positionStreet = address.positionStreet
          this.positionName = address.positionName
          this.positionCityName = address.positionCityName
        }
      },
      onChange(index) {
        this.current = index
        if (index == 0) {
          this.controlsShow = false
          this.isPlayer = true
        }
      },
      visitFun(properties) {
        let data = {
          route: this.$route.path,
          routeName: '商品详情页',
          userId: this.$store.getters.userId,
        }
        visit(data, properties)
      },
      // 生成图片
      createImg() {
        this.$nextTick(function() {
          let w = this.$refs['shareCard'].offsetWidth,
          h = this.$refs['shareCard'].offsetHeight
          console.log('w: ', w, 'h: ', h)
          html2canvas(this.$refs['shareCard'], {
            allowTaint: true,
            logging: true,
            scale: 2,
            dpi: 300,
          }).then((canvas) => {
            let url = canvas.toDataURL('image/png')
            this.shareImgUrl = url
            //延时关闭loading
            this.$nextTick(() => {
              this.showLoading = false
            })
          })
        })
      },
      // 分享
      handleShare() {
        // 方案代号: H1002 用于修复html2canvas的截屏问题
        window.pageYoffset = 0
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

        // 能力检测: 是否为内嵌H5且为新版本系统
        this.showGuide = Boolean(window.webkit && window.webkit.messageHandlers.wsShare) || Boolean(window.ws && window.ws.wsShare)
        this.showShareType = 1
        this.showSharePopup = true
      },
      getBase64(url, callback) {
        let Img = new Image(),
          dataURL = '',
          miniImgUrl = `${url}?imageView2/1/w/446`
        Img.crossOrigin = 'Anonymous'
        Img.setAttribute('crossOrigin', 'Anonymous')
        Img.src = miniImgUrl + '?v=' + Math.random()
        Img.onload = function() {
          let canvas = document.createElement('canvas'),
            width = Img.width,
            height = Img.height
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(Img, 0, 0, width, height)
          dataURL = canvas.toDataURL('image/png')
          return callback ? callback(dataURL) : null
        }
      },
      async onSelectShare(option) {
        let baseUrl = window.location.origin,
          shareData
        let skuName = this.spu.name
        this.postSpuName =  this.spu.shareMsg || skuName
        if (this.postSpuName.length > 30) {
          this.postSpuName = this.postSpuName.substr(0, 30) + '…'
        }
        let iconImgUrl = `${this.spu.shareImage}?imageView2/1/w/60`
        let shareflag = 'share'
        switch (option.type) {
          //微信
          case 1:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  url: `${baseUrl}/spudetail?id=${this.spu.id}&storeId=${this.spu.storeId}&sourceType=${Number(this.$route.query.sourceType) || 1}&spuId=${this.spu.spuId}&shareflag=${shareflag}`,
                  title: this.spu.name,
                  imgUrl: iconImgUrl,
                  description: this.spu.shareMsg || this.spu.name,
                  shareType: 1,
                  platformTag: 3,
                },
              ],
            }
            if (this.showShareType == 2) {
              shareData.sharePlatformList[0]['imgBase64'] = this.shareImgUrl
              shareData.sharePlatformList[0]['shareType'] = 3
            }
            this.goAppShareFun(shareData)
            break
          //qq
          case 2:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  url: `${baseUrl}/spudetail?id=${this.spu.id}&spuId=${this.spu.spuId}&storeId=${this.spu.storeId}&sourceType=${Number(this.$route.query.sourceType) || 1}&shareflag=${shareflag}`,
                  title: this.spu.name,
                  imgUrl: this.spu.shareImage,
                  description: this.spu.shareMsg || this.spu.name,
                  shareType: 1,
                  platformTag: 1,
                },
              ],
            }
            if (this.showShareType == 2) {
              shareData.sharePlatformList[0]['imgBase64'] = this.shareImgUrl
              shareData.sharePlatformList[0]['shareType'] = 3
            }
            this.goAppShareFun(shareData)
            break
          //复制链接
          case 3:
            this.clickFun()
            const promoteInfo = JSON.stringify(this.$store.getters.distrInfo)
            let shareContent
            if(promoteInfo) {
              shareContent = `${baseUrl}/spudetail?id=${this.spu.id}&spuId=${this.spu.spuId}&storeId=${this.spu.storeId}&sourceType=${Number(this.$route.query.sourceType) || 1}&shareflag=${shareflag}&promoteInfo=${promoteInfo}`
            } else {
              shareContent = `${baseUrl}/spudetail?id=${this.spu.id}&spuId=${this.spu.spuId}&storeId=${this.spu.storeId}&sourceType=${Number(this.$route.query.sourceType) || 1}&shareflag=${shareflag}`
            }
            let input1 = document.createElement('input') // 直接构建input
            input1.value = shareContent // 设置内容
            document.body.appendChild(input1)
            input1.select() // 选择实例内容
            document.execCommand('Copy') // 执行复制
            document.body.removeChild(input1) // 删除临时实例
            this.$toast.success('复制成功！')
            this.showSharePopup = false
            break
          //生成海报
          case 4:
            this.showShareType = 2
            this.showLoading = true
            this.postMainImg = this.spu.shareImage
            QRCode.toDataURL(`${baseUrl}/spudetail?id=${this.spu.id}&storeId=${this.spu.storeId}&sourceType=${Number(this.$route.query.sourceType) || 1}`, (err, url) => {
              this.qrCodeImgUrl = url
            })
            await this.getBase64(this.postMainImg, (dataUrl) => {
              this.postMainImg = dataUrl
              this.createImg()
            })
            break
          //保存图片
          case 5:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  imgBase64: this.shareImgUrl,
                  platformTag: 5,
                },
              ],
            }
            this.goAppShareFun(shareData)
            break
          //朋友圈
          case 6:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  url: `${baseUrl}/spudetail?id=${this.spu.id}&spuId=${this.spu.spuId}&shareflag=${shareflag}&storeId=${this.spu.storeId}&sourceType=${Number(this.$route.query.sourceType) || 1}`,
                  title: this.spu.name,
                  imgUrl: this.spu.shareImage,
                  imgBase64: this.shareImgUrl,
                  description: this.spu.shareMsg || this.spu.name,
                  shareType: 3,
                  platformTag: 4,
                },
              ],
            }
            this.goAppShareFun(shareData)
            break

          case 11:
            shareData = {
              sharePlatformList: [
                {
                  imgUrl: this.posterImg,
                  platformTag: 3, //3= 微信好友
                  shareType: 3, //3=分享图片
                }
              ]
            }
            this.goAppShareFun(shareData)
            break
          case 12:
          shareData = {
            sharePlatformList: [
              {
                  imgUrl: this.posterImg,
                  platformTag: 4, // 4=朋友圈
                  shareType: 3, //3=分享图片
                }
              ]
            }
            this.goAppShareFun(shareData)
          break
          case 13:
          shareData = {
              sharePlatformList: [
              {
                shareType: 3,
                imgUrl: this.posterImg,
                platformTag: 5, //5= 保存图片
              }
            ]
          }
          this.goAppShareFun(shareData)
          break
          default:
            break
        }
      },
      clickFun() {
        let params = {
          type: 0,
          id: this.spu.spuId,
        }
        this.$store.dispatch('BURIED_POINT/shareVisitRequest', params)
      },
      goAppShareFun(shareData) {
        this.showSharePopup = false
        this.showShareType = -1
        shareData = JSON.stringify(shareData)
        this.posterShow = false
        console.log(JSON.stringify(shareData),'普通商品分享log')
        if (window.ws) {
          // android环境
          window.ws.wsShare(shareData)
        } else if (window.webkit) {
          // ios环境
          window.webkit.messageHandlers.wsShare.postMessage(shareData)
        }
      },
      onCancelShare() {
        this.showShareType = 1
        this.shareImgUrl = ''
        this.posterShow = false
      },
      chooseCopun(item, index) {
        this.couponList.forEach((ele, i)=>{
          if(index == i) {
            if(!item.checked) {
              this.chooseCoupon = item
            } else {
              this.chooseCoupon = {}
            }
            item.checked = !item.checked
          } else {
            ele.checked = false
          }
        })

      },
      // 监听页面滚动
      handleScroll() {
        if (!this.$refs.boxwrpper) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.boxwrpper.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop)
        let headerdom = document.getElementById('headerwrapper')
        let headerbox = document.getElementById('headerbox')

        if (!headerdom || !headerdom.classList) {
          return
        }
        if (scorllTop > 10) {
          headerdom.style.position ='fixed'
          headerbox.style.display = 'block'
          // headerbox.style.minHeight = '38px';
          headerbox.style.height = '38px';
        } else {
          headerdom.style.position ='fixed'
          headerbox.style.display = 'none'
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
        // let detailBox = this.$refs.detailBox.getBoundingClientRect().top - 44 // 盒子距顶部高度
        // if (detailBox <= 0) this.backtopshow = true
        if (scorllTop >= 2500) this.backtopshow = true
        else this.backtopshow = false

        // 处理顶部tab切换
        this.dealTabChange();
      },
      // 回到顶部
      backtop() {
        // if (this.backtopshow) this.returntop = true
        // else this.returntop = false
        this.returntop = this.backtopshow
      },
      beforeEnter(el) {
        el.style.opacity = 0
      },
      //获取顶部距离
      getTop(element) {
        let realTop = element.offsetTop;
        let parent = element.offsetParent;
        while (parent !== null) {
        realTop += parent.offsetTop;
        parent = parent.offsetParent;
        }
        return realTop;
      },
      afterEnter(el) {
        // const offsetH = document.documentElement.offsetHeight || document.body.offsetHeight
        const offsetW = document.documentElement.offsetWidth || document.body.offsetWidth
        const offsetH = this.getTop(this.$refs.backcart)
        // 设置小球移动的位移
        setTimeout(() => {
          // el.style.transform = `translate3d(${offsetW / 2 - 20}px,-${offsetH / 2 - 20}px,0)`
          el.style.transform = `translate3d(${offsetW - 42}px, ${offsetH - 136}px,0)`
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
      getPositon(){
        let that = this
        getLocation(true).then(result => {
          console.log(result,'result===========================a');
          let { province, city, district, township, neighborhood, areaCode, longitude, latitude } = result
          if(!(JSON.parse(localStorage.getItem('positionAddress')) || {}).positionStreet) {
            that.longitude = longitude
            that.latitude = latitude
            that.positionStreet = `${province}${city}${district}${township}`
            that.positionName = `${neighborhood}`
            that.positionCityName =  areaCode.slice(0,4) + '00'
            that.selectAddress = `${province},${city},${district}`
            that.cityName = areaCode.slice(0,4) + '00'
            that.calculateFreight()
          }
          // 定位经纬度
          if(!(JSON.parse(localStorage.getItem('posiotionLonAndLat')))) {
            let posiotionLonAndLat = {
              lat: latitude,
              lng: longitude,
              areaCode: areaCode
            }
            localStorage.setItem('posiotionLonAndLat', JSON.stringify(posiotionLonAndLat))
          }
        })
      },
      // 查询当前经纬度
      GDinit(o) {
        let that = this
        console.log(o,'o=====================1');
        o.getCurrentPosition((status, result) => {
          console.log(status, result,'o=====================2');
          if (status === 'complete' && result.info === 'SUCCESS') {
            if(!(JSON.parse(localStorage.getItem('positionAddress')) || {}).positionStreet) {
              that.longitude = result.position.getLng()
              that.latitude = result.position.getLat()
              let { province, city, district, township, neighborhood, adcode } = result.addressComponent
              that.positionStreet = `${province}${city}${district}${township}`
              that.positionName = `${neighborhood}`
              that.positionCityName =  adcode.slice(0,4) + '00'
              let reg = /.+?(省|市|自治区|自治州|县|区)/g;

              that.selectAddress = result.formattedAddress.match(reg)
              that.selectAddress = that.selectAddress.join('')

              that.cityName = adcode.slice(0,4) + '00'
              that.calculateFreight()
            }
            // 定位经纬度
            if(!(JSON.parse(localStorage.getItem('posiotionLonAndLat')))) {
              let { lat, lng } = result.position
              let posiotionLonAndLat = {
                lat,
                lng,
                areaCode: result.addressComponent.adcode
              }
              localStorage.setItem('posiotionLonAndLat', JSON.stringify(posiotionLonAndLat))
            }
            //获取定位地址填入默认送货地址
            // this.setLocationAdress(result.addressComponent)
          } else {
            console.log(status, result,'eeeeeeeeeeeeeeeeeeeew');
            // Toast('定位失败,请刷新后重试')
          }
        })
      },
      toSelectAddress() {
        this.showAddress = true
      },
      // 展开收起商品规格
      showdown() {
        this.showup = !this.showup
        if (this.showup) {
          this.downOrup = '收起'
        } else {
          this.downOrup = '展开'
        }
      },
      // 查询商品详情信息
      // 新增一个参数，区分初始化和后续修改
      querySpuDetail(id,params = {
        isInit: true
      }) {
        // 切换sku视频不持续播放
        this.isPlayer = true
        this.controlsShow = false
        let querySpuDetail = ''
        // 活动状态 activity 0 - 不同商品  13 - 秒杀专区
        if (this.activity == 13) {
          querySpuDetail = querySeckillSceneSpuDetail({ skuId: id, startTime: this.$route.query.startTime }).then((res) => {
            return res
          })
        } else {
          let data = {
            spuId: this.spuId,
            skuId: id,
            storeId: this.$route.query.storeId,
            commFlag: this.isDistribution ? 1 : 2,
            sourceType: Number(this.$route.query.sourceType) || 1
          }
          if (this.recommendToken) {
            data['shareCode'] = this.recommendToken
          }
          querySpuDetail = querySpu(data).then((res) => {
            let { spuId, id, storeId } = res.data
            this.visitFun({ spuId, skuId: id, storeId })
            return res
          })
        }
        this.isCanClick = true
        querySpuDetail.then(async (res) => {
          this.isCanClick = false
          this.loading = false
          this.shopList.shoppingCartList = []
          this.couponName = null
          this.spu = res.data
          this.spu.couponLabelList = this.spu.couponLabelList && this.spu.couponLabelList.map(tag=>{
            return {
              ...tag,
              text: tag.couponsType == 3?`立减￥${tag.faceValue}` : tag.couponsType == 2 ?`${tag.faceValue}折` : `满￥${tag.amountLimitation}减￥${tag.faceValue}`
            }
          })

          // 虚拟商品是否显示值赋值，刚进来时候数据未加载先显示加入购物车按钮
          this.isVirtual = this.spu.isVirtual
          if (res.data.marketingVos) {
            // 判断规则中显示划线价 1 13 16
            let istypeShow = this.spu.marketingVos.map((temp) => {
              if ((temp.type == 1 || temp.type == 16) && this.spu.price < this.spu.oldPrice) {
                return true
              } else if (temp.type == 13) {
                return '13'
              } else {
                return false
              }
            })
            this.sku.list = res.data.list
            this.goods_info.picture = res.data.sku.url ? res.data.sku.url : null

            // 如果传进去id和返回id不一致，重置initialSku
            let initSkuid = res.data && res.data.sku && res.data.sku.id || ''
            if (initSkuid != id || params.isInit) {
              this.initialSku = res.data.sku.initialSku
            }
            this.sellOut = res.data.sellOut
            this.shelvesStatus = res.data.shelvesStatus

            if (istypeShow.includes('13')) {
              this.spu.marketingVos.map((item) => {
                let startTime = new Date(item.startTime).getTime()
                let nowDate = new Date().getTime()
                if (startTime > nowDate) {
                  this.showActiveType = []
                } else {
                  this.showActiveType = istypeShow
                }
              })
            } else {
              this.showActiveType = istypeShow
            }

            res.data.marketingVos.forEach((item) => {
              if (item.type == 16) {
                this.delPrice = true
              }
            })
          } else {
            this.showActiveType = []
          }
          if (!this.spu) {
            return
          }
          // 获取jssdk
          this.getjssdk(window.location.href.split('#')[0])
          this.sku.tree = deepClone(res.data.sku.tree)
          //弹窗属性
          this.sku.tree.forEach((item, index) => {
            item.v.forEach((temp, i) => {
              temp.imgUrl = ''
            })
            // if (index != 0) {
            //   item.v.forEach((temp, i) => {
            //     temp.imgUrl = ''
            //   })
            // } else {
            //   item.v.forEach((temp, i) => {
            //     temp.previewImgUrl = res.data.images[0]
            //   })
            // }
          })

          this.sku.list = res.data.list
          // this.goods_info.picture = this.sku.tree[0].v[0].imgUrl ? this.sku.tree[0].v[0].imgUrl : res.data.sku.url

          // 取Sku image 作为规格弹窗头部图片显示
          this.goods_info.picture = res.data.sku.url

          /***   滑动选择区域数据处理  ***/
          let firstList =  deepClone(this.sku.list)
          let newList = firstList || []
          // 库存是否为0
          if(newList && newList.length > 0){
            newList = newList.filter(item=>{
              if(item){
                return item.imgUrl && item.stock_num > 0
              }
            })
          }
          this.newUiImgList = newList

          console.log(this.spuNewUiImgList,'this.newUiImgList');

          // 如果传进去id和返回id不一致，重置initialSku
          let initSkuid = res.data && res.data.sku && res.data.sku.id || ''
          if (initSkuid != id || params.isInit ) {
            this.initialSku = res.data.sku.initialSku
          }
          this.sellOut = res.data.sellOut
          this.shelvesStatus = res.data.shelvesStatus
          this.allspuAttributeValuesdata = res.data.spuAttributeValues || []
            if (this.allspuAttributeValuesdata.length > 7) {
              this.spuAttributeValuesdata = res.data.spuAttributeValues.slice(0, 7)
            } else {
              this.spuAttributeValuesdata = res.data.spuAttributeValues
            }
          // 检查秒杀
          if (res.data.marketingVos && res.data.marketingVos.length > 0 && res.data.marketingVos[0].type == 13) {
            this.seckillScene = res.data.marketingVos.filter((i) => {
              if (i.type == 13) {
                i.startTime = i.startTime.replace(/-/g, '/')
                i.panicBuy.startTime = i.panicBuy.startTime.replace(/-/g, '/')
                i.panicBuy.endTime = i.panicBuy.endTime.replace(/-/g, '/')
                i.startDate = getDate(i.startTime)
              }
              if (new Date().getTime() < new Date(i.panicBuy.startTime).getTime()) {
                i.countTime = new Date(i.panicBuy.startTime).getTime() - new Date().getTime()
                i.countText = '开始'
                i.seckillIsStart = true
              } else {
                i.countTime = new Date(i.panicBuy.endTime).getTime() - new Date().getTime()
                i.countText = '结束'
                i.seckillIsStart = false
              }
              return i.type == 13 && i.countTime > 0 && i.panicBuy.isShow > 0
            })
          } else {
            this.seckillScene = []
          }

          this.sourceFrom = 1
          this.storeId = res.data.storeId

          this.spuPrice = res.data.price

          // 使用公共优惠券弹窗，不需要调用接口
          // const spuParam = {
          //   sourceType: this.$route.query.sourceType || 1,
          //   spuDiscountBos: [{
          //     spuId: this.spu.sku.spuId,
          //     skuId: this.spu.sku.id,
          //     num: 1,
          //   }]
          // }


          // queryDiscounts(spuParam).then(res=>{
          //   let { data = {} } = res || {}
          //   let couponList = data.couponList || []
          //   this.couponList = couponList.filter(item=>item.usable)
          //   this.disCouponList = couponList.filter(item=>!item.usable)
          //   this.couponList.forEach(item=>{
          //     if(item.checked) {
          //       this.chooseCoupon = deepClone(item)
          //       this.copyChooseCoupon = deepClone(item)
          //       this.spu.afterCouponPrice = item.afterCouponPrice
          //     }
          //   })

          // })

          this.shopList.shoppingCartList.push({ num: 1, skuId: res.data.sku.id })
          this.skuId = res.data.sku.id
          // 设置收藏
          this.favourite = this.spu.hasAtten
          if (this.favourite) this.favoriteText = '已收藏'
          else this.favoriteText = '收藏'
          // 查询商品的所有规格信息
          if (this.isRefreshSpec == true) {
            this.querySpuSpecs(this.spu.spuId)
          }
          this.isRefreshSpec = true

          // 查询地区信息
          this.areas.length === 0 && this.queryAllAreas()

          // 加载数量
          this.loadNum()

          // 查询评价
          this.querySkuComments()

          // 好评率
          this.queryCommentSummarize()

          // 添加浏览记录
          this.addBrowseRecord()
          this.calculateFreight()
		      // 设置轮播图片
          if (this.spu.images) {
            this.carouselPics = this.spu.images.map((image) => {
              image = image.split('?')[0]
              let imgUrl = image.split('/')
              let img = imgUrl.join('/')
              img += '?imageView2/1/w/750'
              return { img }
            })

          //若有视频，则获取sku第一张作为封面
          if (this.spu.spuVideo) {
              this.spuVideoPic = this.spu.images[0] || ''
              this.carouselPics.unshift({ img: this.spuVideoPic })
              this.videoKey = Date.now()
          }
          }
          if (this.spu.spuServiceSupports.length > 0) {
            this.services = this.spu.spuServiceSupports
              .map((support) => {
                if (support.serviceSupport) {
                  return support.serviceSupport.name
                }
              })
              // .join(',')
          }
          if(this.spu.video || (this.spu.mobileImageUrlList && this.spu.mobileImageUrlList.length > 0)||this.spu.detail){
            this.$nextTick(()=>{
              setTimeout(()=>{
                let height = 0
                height = this.$refs.imgHeight.offsetHeight
                this.firstImgHeight = this.trueImgHeight = height
              },500)
            })

          }

        }).catch(err=> {
          console.log(err);
          console.log('进入报错,导致spu=null')
          this.spu = null
        }).catch(()=>{
          this.isCanClick = false
        })
      },
      sureCopun(){
        this.copyChooseCoupon = deepClone(this.chooseCoupon)
        this.spu.afterCouponPrice = this.copyChooseCoupon && this.copyChooseCoupon.id ? this.copyChooseCoupon.afterCouponPrice : 0
        this.couponListVisible = false
      },
      // 添加浏览记录
      addBrowseRecord() {
        if (this.isProcess) {
          return
        }
        this.isProcess = true
        let params = {
          skuId: this.spu.id,
          storeId: this.spu.storeId,
          sourceType: this.$route.query.sourceType || 1
        }
        addBrowseRecord(params).then((res) => {
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
        return str
          .replace(reLeft, '')
          .replace(reRight, '')
          .replace(reSplitter, splitter)
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

      // 查询所有的省市区
      queryAllAreas() {
        queryAllAreas().then((res) => {
          this.addressValue = []
          this.areas = res || []
          // if (this.addressValue && this.addressValue.length > 0) {
            // 计算运费
            this.calculateFreight()
          // }
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
        // this.addressValue.length &&
          let addressValue = ''
          for (const item of this.areas) {
            if (this.cityName == item.name || this.cityName == item.cityCode || this.cityName == item.value) {
              addressValue = item.value.split('-')[1]
              break
            }
          }
          addressValue &&
          calculatefreight(this.spu.id, this.spu.storeId, addressValue, this.num).then((res) => {
            this.freight = res.data
          })
      },
      selectOther() {
        this.showAddress = false
        this.areasShow = true
      },
      // 地区发生改变
      addressChange(val) {
        // 当选择地址为空的时候不执行下面的方法
        if(!val || val && val.length == 0) {
          return false
        }

        // 计算运费
        this.activeAddress = -2
        this.cityName = this.addressValue[1]
        let reg = /.+?(省|市|自治区|自治州|县|区)/g;
        this.selectAddress = this.$refs.areasPicker.getNameValues()
        this.selectAddress=  this.selectAddress.match(reg).join('')

        this.areasShow = false
        localStorage.setItem('positionAddress', JSON.stringify({
          selectAddress: this.selectAddress,
          id: -2,
          cityName: this.cityName,
          positionStreet: this.positionStreet,
          positionName: this.positionName,
          positionCityName: this.positionCityName
        }))
        this.calculateFreight()
      },
      // 改变购买数量
      async numChange(val, e) {
        if (!val) return
        let isActivity = this.spu.marketingVos && (this.spu.marketingVos.map((item) => item.type).includes('16') || this.spu.marketingVos.map((item) => item.type).includes('13'))
        if (isActivity) {
          if (this.num > this.skuLimitNum) {
            let isIgnore = this.isFrom == 1 ? false : true
            let res = await this.checkLimit(e.selectedSkuComb.id, this.num, isIgnore)
            if (res.data && res.data.limitNum) {
              if (res.data.hasBoughtNum) {
                this.num = this.saveLimitNum
                this.skuLimitNum = this.saveLimitNum
                Toast({
                  message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
                })
              } else {
                this.num = this.saveLimitNum
                this.skuLimitNum = this.saveLimitNum
                Toast({
                  message: `抱歉，该商品限购${res.data.limitNum}件`,
                })
              }
              return
            } else {
              this.saveLimitNum = val
            }
          }
        }

        // 计算运费
        this.calculateFreight()
      },
      // 收藏或者取消收藏商品
      favouriteChange() {
        if (getToken()) {
          // 收藏或者取消收藏商品
          let params = {
            skuId: this.spu.id,
            sourceType: this.$route.query.sourceType || 1,
            storeId: this.spu.storeId
          }
          if (this.spu.hasAtten) {

            cancelAttention(params).then((res) => {
              if (res.code == 200) {
                this.favourite = false
                this.spu.hasAtten = false
                this.favoriteText = '收藏'
                Toast('已取消收藏')
              }
            })
          } else {
            addAttention(params).then((res) => {
              if (res.code == 200) {
                this.favourite = true
                this.spu.hasAtten = true
                this.favoriteText = '已收藏'
                Toast('收藏成功')
              }
            })
          }
        } else {
          if (Cookies.get('_wsf_role') == 1) {
            this.$store.commit('SET_REGISTRATIONPROTOCOL', true)
            return
          }
          this.$router.push('/login?url=' + location.pathname + location.search)
        }
      },
      toBack() {
        // 如果是小游戏返回上一页
        if(this.$route.query.isGame === 'true'){
            this.$router.push({ name: 'answerGame'})
            return
        }
        appBack(this)
        // if(this.spuId) {

        //   if (window.ws) {
        //     // android环境
        //     window.ws.finishActivity();
        //   } else if (window.webkit) {
        //     // ios环境
        //     window.webkit.messageHandlers.finishActivity.postMessage('');
        //   } else {
        //     this.$router.go(-1)
        //   }
        // } else {
        //   this.$router.go(-1)
        // }
      },
      toIndex() {
        if(this.$route.query.type && this.$route.query.type==='driversDay'){
          this.$router.go(-1);
        }
        else if(this.$route.query.isGame){
          this.$router.push({
              name: 'answerGame',
           })
        }
        else{
          if(this.isDistribution){
            this.$router.push({ path: '/distributionActivity' })
          } else {
            this.$router.go(-1)
          }
          // this.$router.push({ path: '/' })
        }
      },
      // 联系客服
      toService() {
        let that = this
        if (getToken()) {
          let data = {
            skuId: that.skuId,
            storeId: this.spu.storeId,
            sourceType: this.$route.query.sourceType || 1
          }
          querySpu(data).then((res) => {
            let storeServiceConfig = undefined,
              options = {},
              data = undefined
            data = res.data
            storeServiceConfig = res.data.storeServiceConfig
            //  过滤值为空的字段
            Object.keys(storeServiceConfig).forEach((key) => {
              if (storeServiceConfig[key]) {
                if (key == 'staffId') {
                  options.staffid = storeServiceConfig[key]
                } else {
                  options[key] = storeServiceConfig[key]
                }
              }
            })
            ysf('config', {
              ...options,
              success: function() {
                that.productFun(data)
              },
            })
          })
        } else {
          if (Cookies.get('_wsf_role') == 1) {
            this.$store.commit('SET_REGISTRATIONPROTOCOL', true)
            return
          } else {
            this.$router.push('/login?url=' + location.pathname + location.search)
          }
        }
      },
      productFun(data) {
        ysf('product', {
          show: 1, //1为打开， 其他参数为隐藏（包括非零元素
          title: data.name,
          desc: data.shareMsg,
          picture: data.images[0],
          note: `￥${data.price}`,
          url: `https://m.wsfmall.com/spudetail?id=${data.id}`, // 跳转客户端商品详情页面
          sendByUser: 0, //自动发送卡片
          tags: [
            {
              label: '查看商品详情', // 按钮名字
              url: `https://m.wsfmall.com/spudetail?id=${data.id}`, // 跳转客户端商品详情页面
            },
          ],
          success: function() {
            ysf('open') //打开客服窗口
          },
          error: function() {
            console.warn('连接客服失败')
          },
        })
      },
      async distributionShare() {
        // 分销商品不支持分享
        if(this.spu.tabooStatus) {
          return false
        }

        if(!this.isLogin) {
          this.$router.push({ path: '/login', query: { url: `${location.pathname+location.search}` }})
          return
        }
        if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId) {
          await this.ifDistribution()
        } else {
          let data = {
              customerId: this.$store.getters.distrInfo.customerId || '', //关联商城用户ID
              mobile: this.$store.getters.distrInfo.mobile || '', //电话号码
              promoteId: this.$store.getters.distrInfo.promoteId || '', //关联推广员ID
              promoteType: this.$store.getters.distrInfo.promoteType || '', //推广员类型（1-推广员 2-车主）
              id: this.$store.getters.distrInfo.id || '', //分销员ID
            }
            this.distrInfo = data
        }
        if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId) {
          this.$router.push({ path: '/promoter', query: { url: `${location.pathname+location.search}` }})
          return
        }
        if(this.isH5) {
          this.showGuide = false
          this.showShareType = 1
          this.showSharePopup = true
        } else {
          this.showShareType = 5
          this.getCreateShareCode()
        }
      },
      async getCreateShareCode(val) {
        this.$toast.loading({
          message: '正在生成海报中…',
          forbidClick: true,
          duration: 5000,
        })
        let params = {
          width: 40,
          autoColor: false,
          lineColor: "",
          isHyaline: false,
          suncode: '',
          page: 'productModule/pages/skuDetail/skuDetail',
          scene: '',
          goodsImgUrl: this.spu.shareImage,
          goodsName: this.spu.name,
          price: this.spu.price,
        }
        try {
          let data = await this.getShareCode(this.spu)
          if (data.code == 200 && data.data.data) {
            //推广码
            params.suncode = data.data.data
            //跳转参数
            params.scene = 'n=' + this.spu.skuNo + '&c=' + params.suncode
            //获取海报
            let res = await getCreateShareCode(params)
            if (res.code == 200) {
              this.posterImg = res.data.wsSunCodeUrl
              this.posterShow = true
              this.showSharePopup = true
              this.$toast.clear()
            } else {
              this.$toast('生成海报失败')
            }
          } else {
            this.$toast((data.data && data.data.description) || '生成海报失败')
          }
        } catch (error) {
          this.$toast.clear()
        }
      },
      async ifDistribution() {
        if (!this.$store.getters.userId) {
          await this.$store.dispatch('user/getUserInfo')
        }
        let params = {
          userId: this.$store.getters.userId,
          userPhone: this.$store.getters.userInfo.mobile,
        }
        try {
          let res = await isDistribution(params)
          if (res.data.code == 1) {
            let isDistribution = res.data.isDistribution
            if (isDistribution == 1) {
              //是分销-推广员
              let data = {
                customerId: res.data.customerId || '', //关联商城用户ID
                mobile: res.data.mobile || '', //电话号码
                promoteId: res.data.promoteId || '', //关联推广员ID
                promoteType: res.data.promoteType || '', //推广员类型（1-推广员 2-车主）
                id: res.data.id || '', //分销员ID
              }
              this.distrInfo = data
              this.$store.dispatch('setDistrInfo', data)
            }
            //页面跳转 1 是推销员  0 不是推销员
          } else {
            //-1 接口有误
          }
        } catch (error) {
          //-1 接口有误
        }
      },
      //获取推广码
      getShareCode(val) {
        let params = {
          spuId: val.spuId,
          recommendUserType: this.distrInfo.promoteType,
          phone: this.distrInfo.mobile,
          buyNowFlag: false,
          customerId: this.distrInfo.promoteId,
        }
        return new Promise((resolve, reject) => {
          getShareCode(params)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 显示规格值弹窗
      async toShowSpecValues(sourceFrom, currentSelected, type) {
        // 分销商品不支持分销
        if(this.spu.tabooStatus) {
          return false
        }

        console.log('打开弹窗');
        if (this.sellOut === '') return // 0正常 1售罄
        if(this.isDistribution || this.$route.query.promoteInfo) {
          if(!this.isLogin) {
            this.$router.push({ path: '/login', query: { url: `${location.pathname+location.search}` }})
            return
          }
          // 分享出去的不需要到推广员注册页面
          if(!this.$route.query.promoteInfo) {
            if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId) {
                await this.ifDistribution()
            } else {
              let data = {
                  customerId: this.$store.getters.distrInfo.customerId || '', //关联商城用户ID
                  mobile: this.$store.getters.distrInfo.mobile || '', //电话号码
                  promoteId: this.$store.getters.distrInfo.promoteId || '', //关联推广员ID
                  promoteType: this.$store.getters.distrInfo.promoteType || '', //推广员类型（1-推广员 2-车主）
                  id: this.$store.getters.distrInfo.id || '', //分销员ID
                }
              this.distrInfo = data
            }
            if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId) {
              this.$router.push({ path: '/promoter', query: { url: `${location.pathname+location.search}` }})
              return
            }
          }
        }
        this.isFrom = type
        this.showBase = true

        this.sourceFrom = sourceFrom
        this.currentSelected = currentSelected
      },
      // 查询商品的评价
      querySkuComments() {
        querySkuComments(this.spu.id,-1).then((res) => {
          this.comments = res.data
        })
      },
      // 查询评价概括
      queryCommentSummarize() {
        queryCommentSummarize(this.spu.id, 0).then((res) => {
          this.commentSummarize = res
          // this.commenttitle = '评价 (' + res.allCommentCount + ')'
          this.commenttitle = '评价'
        })
      },
      // 显示评价大图
      showImg(list, imgIndex) {
        let imgList = list.map((item) => {
          return item.url
        })
        ImagePreview({
          images: imgList,
          showIndex: true,
          loop: false,
          startPosition: imgIndex,
        })
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
          this.$refs.detailPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        if (this.spuTabIndex === 2) {
          this.$refs.assessPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        if (this.spuTabIndex === 3) {
          this.$refs.recommend.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }

        // tab缓动大概700ms
        this.cancelScroll = true;
        setTimeout(() =>{
            this.cancelScroll = false;
        }, 700);

      },
      dealTabChange() {
        // 防止tab事件和滚动事件交叉
        if (this.cancelScroll) {
          return
        }
        if (this.$refs.spuPage.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 0
        }
        if (this.$refs.detailPage.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 1
        }
        if (this.$refs.assessPage.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 2
        }
        if (this.$refs.recommend.getBoundingClientRect().top < 1) {
          this.spuTabIndex = 3
        }
      },
      // 跳转到购物车
      toCart() {
        localStorage.setItem('cartSkuId', this.cartSkuId)
        // 智慧生活
        if(getUsersource() == 11) {
          smartOpenDeepLink('wsf://app/pagehome?tab=shopcart')
          return
        }
        // 其他app，跳转壳子
        if(getUsersource() != 4) {
          window.location.href = `${process.env.SMART_PAGE_DOMAIN}/shopCart`
          return
        }
        this.$router.push({ path: '/cart', query: { from: 'spudetail' } })
        // this.$router.push({ path: '/cart', query: { from: 'spudetail', cartSkuId: this.cartSkuId } })
      },
      // 立即购买
      async buyNow(e) {
        console.log('立即购买-----购买数量 -------', this.num, e)
        if (!e.selectedSkuComb || !e.selectedSkuComb.id) {
          Toast({
            message: '请选择完整的商品规格！',
            position: 'bottom',
          })
          return
        }
        if(this.$route.query.sourceType != 2) {
          let res = await this.checkLimit(e.selectedSkuComb.id, this.num)
          if (res.data && res.data.limitNum) {
            if (res.data.hasBoughtNum) {
              // this.num = res.data.limitNum - res.data.hasBoughtNum
              this.skuLimitNum = res.data.limitNum - res.data.hasBoughtNum
              Toast({
                message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
              })
            } else {
              // this.num = res.data.limitNum
              this.skuLimitNum = res.data.limitNum
              Toast({
                message: `抱歉，该商品限购${res.data.limitNum}件`,
              })
            }
            return
          }
        }
        if(this.$route.query.promoteInfo || this.isDistribution) {
          this.distrInfo = this.$route.query.promoteInfo ? JSON.parse(this.$route.query.promoteInfo) : this.distrInfo
          let data = await this.getShareCode(this.spu)
          this.recommendToken = data.data.data
        }
        let paramData = {
          skuId: e.selectedSkuComb.id,
          recommendToken: this.recommendToken,
          num: this.num,
          sourceType: this.$route.query.sourceType || 1,
          storeId: this.spu.storeId
        }
        this.$router.push({
          path: '/settlement',
          query: {
            params: JSON.stringify({
              ids: [],
              addressId: 0,
              buyNowRequestList: [paramData],
              isGroup: 0,
              groupId: 0,
              temp: 1,
              againBuy: 0, // 再次购买
            }),
          },
        })
      },
      openImg() {
        let imgList = this.carouselPics.map(item=>{
          return item.img
        })
        ImagePreview({
          images: imgList,
          closeable: true
        });
      },
      clonse() {
        this.posterShow = false
        this.posterImg = ''
      },
      skuSelected(skuValue) {
        // 属性必选
        // if(!skuValue.selectedSkuComb){
        //     this.$refs.vansku.selectedSku=this.selectedSku
        // }else{
        //     this.selectedSku = skuValue.selectedSku
        // }
        this.selectedSku = skuValue
        this.trueImgHeight = 0
        let currendId  = skuValue.selectedSkuComb && skuValue.selectedSkuComb.id || ''
        //根据skuid来判断
        this.selectProId=currendId
        if(currendId){
          this.newUiImgList.forEach((item, index)=>{
            if(currendId == item.id){
             this.rollEffect(index)
            }
          })
        }
        this.num = 1
        if (!this.$refs.vansku.selectedSkuComb) return
        if (this.skuId == this.$refs.vansku.selectedSkuComb.id) return
        let id = this.$refs.vansku.selectedSkuComb.id
        this.skuId = this.$refs.vansku.selectedSkuComb.id
        this.spuNewUiImgList = []
        this.querySpuDetail(id, {
          isInit: false
        })
      },
      // 加入购物车
      async addShoppingCart(e) {
        this.isProcess = true
        console.log('加入购物车-----', e)
        if (getToken()) {
          if (!e.selectedSkuComb || !e.selectedSkuComb.id) {
            Toast('请选择完整的商品规格！')
            return
          }
          let isIgnore = false
          let source = this.$route.query.sourceType
          if(source != 2) {
            let res = await this.checkLimit(e.selectedSkuComb.id, this.num, isIgnore)
            if (res.data && res.data.limitNum) {
              if (res.data.hasBoughtNum) {
                this.num = this.saveLimitNum
                this.skuLimitNum = this.saveLimitNum
                Toast({
                  message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
                })
              } else {
                this.num = this.saveLimitNum
                this.skuLimitNum = this.saveLimitNum
                Toast({
                  message: `抱歉，该商品限购${res.data.limitNum}件`,
                })
              }
              return
            }
          }
          let param = {
            skuId: e.selectedSkuComb.id,
            num: this.num,
            sourceType: source,
            storeId: this.spu.storeId
          }
          this.cartSkuId = e.selectedSkuComb.id
          addShoppingCart(param).then((res) => {
            if (res.code == 200) {
              switch (res.data) {
                case 0:
                  Toast({
                    message: '加入购物车失败，请刷新后重试！',
                  })
                  break
                case 1:
                  this.$storage.removeItem(this.spu.spuId) // 清除分销码信息
                  Toast({
                    message: '成功加入购物车',
                  })
                  this.showBase = false
                  this.showFlySpu = true
                  // 重新查询购物车数量
                  this.queryCartCount()

                  //重新调详情接口
                  break
                case -1:
                  Toast({
                    message: '库存不足！',
                  })
                  break
                case -2:
                  Toast({
                    message: '商品不存在！',
                  })
                  break
                case -3:
                  Toast({
                    message: '参数错误！',
                  })
                  break
                case -4:
                  Toast({
                    message: '商品已下架！',
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
                  })
                  break
                case -7:
                  Toast({
                    message: '商品已过期！',
                  })
                  break
                default:
                  Toast({
                    message: '加入购物车失败，请刷新后重试！',
                  })
                  break
              }
              setTimeout(() => {
                this.isProcess = false
              }, 1000)
            }
          })
        } else {
          if (Cookies.get('_wsf_role') == 1) {
            this.$store.commit('SET_REGISTRATIONPROTOCOL', true)
            return
          }
          this.$router.push('/login?url=' + location.pathname + location.search)
        }
      },
      // 判断微信
      isWeixin() {
        let ua = window.navigator.userAgent.toLowerCase()
        return ua.match(/MicroMessenger/i) == 'micromessenger'
      },
      getjssdk(url) {
        if (!this.isWeixin()) return
        getjssdk(window.encodeURIComponent(url)).then((res) => {
          if (res.code == 200) {
            let { name: title, shareMsg: desc } = this.spu
            let shareflag = 'share'
            let link = `${location.origin}/spudetail?id=${this.spu.id}&storeId=${this.spu.storeId}&sourceType=${Number(this.$route.query.sourceType) || 1}&shareflag=${shareflag}` // 分享标识`
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
                  window.console.log('设置成功')
                  // 设置成功
                },
              })
              // // 分享到朋友圈及分享到QQ空间
              wx.updateTimelineShareData({
                title, // 分享标题
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl, // 分享图标，
                success: () => {
                  // 设置成功
                },
              })
            })
            wx.error(function(res) {
              console.log('err', res)
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            })
          }
        })
      },
      checkLimit(skuId, num, isIgnore = true) {
        let reqData = {
          isIgnoreCartNum: isIgnore,
          buyNowRequestList: [
            {
              num,
              skuId,
              sourceType: this.$route.query.sourceType || 1,
              storeId: this.spu.storeId
            },
          ],
        }
        return checkSkuPanicBuyLimitNum(reqData).then((res) => {
          return res
        })
      },
      skuPriceInt(data, name) {
        let price = 0
        if (data) {
          price = data
          if (name == 'sku') {
            price = price.toFixed(2).split('.')[0]
          } else if (name == 'spec') {
            sessionStorage.setItem('lastPrice', price)
            price = price && price.split('.')[0]
          }
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice ? lastPrice.split('.')[0] : 0
        }
        return price
      },
      skuPriceFloat(data, name) {
        let price = '00'
        if (data) {
          price = data
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice
        }
        if (name == 'sku') {
          price = price.toFixed(2).split('.')[1]
        } else if (name == 'spec') {
          sessionStorage.setItem('lastPrice', price)
          price = price.split('.')[1]
        } else {
          let lastPrice = sessionStorage.getItem('lastPrice')
          price = lastPrice ? lastPrice.split('.')[1] : '00'
        }
        return price
      },
      previewImg(data) {},
      // 开始播放
      playVideo() {
        document.getElementById('videoBanner').play()
        this.controlsShow = true
        this.isPlayer = false
      },
      // 播放结束
      endVideo() {
        this.controlsShow = true
      },
      showCouponList() {
        this.chooseCoupon = deepClone(this.copyChooseCoupon)
        this.couponList.forEach(ele=>{
          ele.checked = this.chooseCoupon && this.chooseCoupon.id && ele.id == this.chooseCoupon.id
        })
        // this.couponListVisible = true
        let obj = {
					spuId: this.spu.spuId,
					skuId: this.spu.id,
					num: 1,
					beforeCouponPrice: this.spu.price,
				}
        const params = {
          skuList: [obj],
          sourceType: Number(this.$route.query.sourceType) || 1, // sourceType 来源 1.商城 2.实体店 3.电动车
          ids: this.ids
        }
        this.$refs.couponUnit.setShowPopup(params)
      },
      toPosition() {
        this.$router.push({
          name: 'chooseMap'
        })
      },
      // 查询用户地址
      queryCustomerAddress() {
        if (getToken()) {
          queryCustomerAddress().then((res) => {
            this.addressListData = res || []
          })
        }
      },
      onSelectAddress(val, id, cityName) {
        let reg = /.+?(省|市|自治区|自治州|县|区)/g;
        let adress = val.match(reg)
        this.selectAddress = adress.join('')
        this.activeAddress = id
        if(id != -1) {
          this.cityName = cityName.split(',')[1]
        }else {
          this.cityName = cityName
        }
        localStorage.setItem('positionAddress', JSON.stringify({
          selectAddress: val,
          id,
          cityName: this.cityName,
          positionStreet: this.positionStreet,
          positionName: this.positionName,
          positionCityName: this.positionCityName
        }))
        this.calculateFreight()
        this.showAddress = false
      },
      addresspopClose() {
        this.showAddress = false
      },

      coonfirmCoupun(coupon) {
        let {
          userCouponDiscount,
          onlineRetailerCouponIds,
          choosedCoupon
        } = coupon || {}
        if (choosedCoupon[0]) {
          this.spu.afterCouponPrice = choosedCoupon[0].afterCouponPrice
        } else {
          this.spu.afterCouponPrice = 0
        }
        if(onlineRetailerCouponIds.length){
          this.ids = onlineRetailerCouponIds
        }
      },
      // 去到专题活动页面
      toThematic(item) {
        this.$router.push({ path: '/ranking', query: { id: item.id, spuId: this.spu.spuId } })
      },

      // 已选中的规格
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
            this.canBuy = false
            return `请选择 ${arr.join(' ')}`
        }
        if(!val.selectedSkuComb) {
          return ''
        }
        selectAttributeName = val.selectedSkuComb.name
        return `已选${selectAttributeName},${this.num}个`
      },

      // 商品图片加载完成，判断当前需不需要展开
      goodsListItemImg() {
        let height = 0
        height = this.$refs.imgHeight.offsetHeight
        this.firstImgHeight = this.trueImgHeight = height
      }
    },

    computed: {
      // imgsHeight(){
      //   this.$nextTick(()=>{
      //     let height = 0
      //     if(this.spu.video || (this.spu.mobileImageUrlList && this.spu.mobileImageUrlList.length > 0)){

      //       height = this.$refs.imgHeight.offsetHeight

      //       this.firstImgHeight = this.trueImgHeight = height

      //       return height
      //     }
      //     return 0
      //   })
      // },
      isSpecialArea(){
          return this.spu.marketingVos &&
                 this.spu.marketingVos.map((item) => item.type).includes('16') &&
                 this.spu.marketingVos.filter((item) => item.type == '16')[0] &&
                 this.spu.marketingVos.filter((item) => item.type == '16')[0].specialArea &&
                 this.spu.marketingVos.filter((item) => item.type == '16')[0].specialArea.limitNum > 0
      },
      commentHandle() {
        return function(val) {
          let _val = val + ''
          return `${ movePointRight(_val.substring(0, _val.indexOf('.') + 3, 2), 2)}%`
        }
      },
      descBoxHeight(){
        this.$nextTick(() => {
          if(this.$refs.descBox){
            const height = this.$refs.descBox.scrollHeight;
            this.newDescBoxHeight = height
            return height
          }
        })
      },
      token() {
        return this.$store.getters.token
      },
      registrationProtocolIsShow() {
        return this.$store.getters.getRegistrationProtocol
      },
      //当前选择的规格值和数量
      chosenSpecAndNum: function() {
        let specTexts = ''
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.current=0
        if (!this.spu.skuSpecValues) {
          return specTexts
        }
        for (let i = 0; i < this.spu.skuSpecValues.length; i++) {
          specTexts += this.spu.skuSpecValues[i].valueRemark + ' '
        }
        this.specValueId = this.spu.skuSpecValues[0].specValueId
        return specTexts.substring(0, specTexts.length - 1) + ' ' + this.num + '个'
      },
      shareSheetOptions() {
        if (this.showShareType == 2) {
          return [
            {
              name: '保存图片',
              icon: require('@/assets/img/icon-save.png'),
              type: 5,
            },
            { name: '微信好友', icon: require('@/assets/img/WeChat@2x.png'), type: 1 },
            { name: '朋友圈', icon: require('@/assets/img/icon-circle.png'), type: 6 },
            // { name: 'QQ好友', icon: require('@/assets/img/QQ@2x.png'), type: 2 },
          ]
        } else if(this.showShareType == 5) {
          return [
            { name: '微信好友', icon: 'wechat', type: 11 },
            { name: '朋友圈', icon: require('@/assets/img/icon-circle.png'), type: 12 },
            { name: '海报下载', icon: require('@/assets/img/icon-save.png'), type: 13 },
          ]
        } else {
          // 旧版本能力检测兼容
          if (!this.showGuide) {
            return [{ name: '复制链接', icon: require('@/assets/img/copy@2x.png'), type: 3 }]
          } else {
            return [
              { name: '微信好友', icon: require('@/assets/img/WeChat@2x.png'), type: 1 },
              { name: '生成海报', icon: require('@/assets/img/pt@2x.png'), type: 4 },
              { name: '复制链接', icon: require('@/assets/img/copy@2x.png'), type: 3 },
              // { name: 'QQ好友', icon: require('@/assets/img/QQ@2x.png'), type: 2 },
            ]
          }
        }
      },
      couponShowlist(){
        let obj = this.spu || {};
        let couponlist = []


        let markIngLabel = (obj.skuLable || {}).markIngLabel || []
        // 活动标签
        let actCouponMap = []
				if(markIngLabel && markIngLabel.length) {

          let curActive = markIngLabel[0] || {}
          let tiredPricingList = curActive.tiredPricingList || [];

          // 重新组装活动优惠信息
          if([1, 3].includes(curActive.ruleType)) {
            // 固定金额和自定义规则: 不展示活动优惠券
            actCouponMap = []
          } else if(curActive.ruleType == 2) {
            // 固定折扣活动
            actCouponMap.push({
              text: curActive.fixedDiscount + '折'
            })
          } else if([4, 5].includes(curActive.ruleType)) {
            actCouponMap = tiredPricingList.map(item => {
              if(curActive.ruleType == 4){
                return {
                  text: '满' + item.amountLimitation + '减' + item.faceValue
                }
              } else {
                return {
                  text: '满' + item.amountLimitation + '打' + item.faceValue + '折'
                }
              }
            })
          }
				}

        let couponLabelList = obj.couponLabelList || []
        // 如果有优惠券，展示最多两个活动标签，最多两个优惠券标签
        if(couponLabelList.length > 0) {
          couponlist = [...actCouponMap.slice(0, 2), ...couponLabelList.slice(0, 2)]
        } else {
          // 如果没有优惠券，展示最多3个活动标签
          couponlist = actCouponMap.slice(0, 3)
        }

        return couponlist
      },
      performanceScore() {
        let skuLable = this.spu && this.spu.skuLable || {}
        let performanceScoreLabel = skuLable.performanceScoreLabel || {}
        return performanceScoreLabel.performanceScore || 0
      }
    },
    filters:{
      filterTime(val) {
        return val.split(` `)[0].replace(/-/g,".")
      },
      filterFraction(val, make) {
        let len = (val + '').length
        switch (len) {
          case 3:
          case 4:
            val = parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) + '+分'
            break
          case 5:
          case 6:
          case 7:
            if (make) {
              val = '999+分'
            } else {
              val = parseInt((val / 10000) * 10) / 10 + '万分'
            }
            break
          default:
            val = val + '分'
            break
        }
        return val
      },
      filterComment(val, make) {
        console.log(val, make,'val, make');
        if(val<=100){
          return val + '条'
        }else if(val > 100 && val < 999){
          let baiwei=parseInt(val/100);
          return baiwei + '00+条'
        } else {
          return '999+条'
        }
      },
    }
  }
</script>

<style lang="less" scoped>
 @import "~@/assets/css/spudetail.less";
 @import "~./imgUi.less";

 .action_width {
  width: 90px;
 }
 .richText{
  padding: 14px 12px 4px;
  /deep/ img {
        max-width: 100%;
  }
  /deep/ table{
    border-bottom: solid 1px #000;
    border-left: solid 1px #000;
    min-width: 100%;
    td{
      border-top: solid 1px #000;
      border-right: solid 1px #000;
    }
  }
  /deep/ em{
    font-style: italic;
  }
  /deep/ ol{
    li{
      list-style-type: decimal;
      list-style-position: inside;
    }
  }
  /deep/ ul{
    list-style-type: disc;
    li{
      list-style-type: inherit;
      list-style-position: inside;
    }
  }
  /deep/ blockquote{
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 40px;
    margin-inline-end: 40px;
  }
  /deep/ video{
    max-width: 100%;
  }
  /deep/ p{
    word-break: break-word;
  }
 }
 .boxwrapper {
  padding-bottom: 54px;
 }
 .saveImg {
  width: 100vw;
  height: 50vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  .van-image {
    position: absolute;
    top: 80px;
    width: 65vw;
    height: 50vh;
    z-index: 2200;
    /deep/.van-image__img {
      border-radius: 10px;
    }
  }
}
 .left-price-wraaper {
  display: flex;
  align-items: flex-end;
 }
 .performate-point {
    display: inline-block;
    margin-left: 8px;
    margin-bottom: 4px;
    border: 1px solid #fd302c;
    border-radius: 2px;
    padding: 1px 4px;
    color: #fd302c;
    font-size: 10px;
    font-weight: normal;
    line-height: 12px;
    &.isblock {
      // display: block;
      margin-bottom: 15px;
      margin-left: 0;
    width: fit-content;
    }
  }

  .copun-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    .copun-icon{
        height: 24px;
        background: rgba(254,48,64,0.1);;
        border-radius: 4px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #FE3040;
        line-height: 17px;
        padding: 0px 6px
    }
    .right {
      display: flex;
      align-items: center;
      color: #FF450C;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  // .details-colortype .fourth-cell .spu_price {
  .spu_price {
    color: #FE3040;
    font-size: 0.64rem;
    font-weight: bold;
    display: flex;
    .fqz-price {
      font-size: 16px;
      font-weight: bold;
      .special {
        font-size: 30px;
      }
    }
    .spu_price_btn_yuan{
      display: flex;
      align-items: baseline;
      height: 28px;
      line-height: 28px;
      >.spu_price_btn_icon{
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
      }
      >.spu_price_btn_pre_price{
        font-size: 30px;
        font-family: AlternateBold;
        font-weight: bold;
        white-space: nowrap;
      }
      >.spu_price_btn_dian_price{
        font-size: 16px;
        font-family: AlternateBold;
        font-weight: bold;
      }
    }
    .coin {
      font-size: 18px;
      font-weight: bold;
    }
    .spu_price_btn {
      display: flex;
      margin-left: 4px;
      padding: 2px 8px;
      color: #fff;
      font-weight: normal;
      width: fit-content;
      height: 28px;
      line-height: 24px;
      background: #FF450C;
      border-radius: 15px 15px 15px 2px;
      align-items: baseline;
      .spu_price_btn_text{
        font-size: 11px;
        font-weight: bold;
        color: #FFFFFF;
      }
      .spu_price_btn_icon{
        font-size: 13px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #FFFFFF;
      }
      .spu_price_btn_pre_price{
        font-size: 20px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #FFFFFF;
        // line-height: 26px;
      }
      .spu_price_btn_dian_price{
        font-size: 13px;
        font-family: AlternateBold;
        font-weight: bold;
        color: #FFFFFF;
      }
    }
    .active-price {
      // color: #999999;
      // font-size: 14px;
      // position: relative;
      // margin-left: 4px;
      // display: block;
      display: flex;
      align-items: baseline;
      height: 20px;
      line-height: 20px;
      margin-top: 8px;
      margin-left: 3px;
      >div{
        display: flex;
        position: relative;
        align-items: baseline;
        .spu_price_btn_icon{
          font-size: 11px;
          font-family: AlternateBold;
          font-weight: bold;
          color: #C3C3C3;
        }
        .spu_price_btn_pre_price{
          font-size: 16px;
          font-family: AlternateBold;
          font-weight: bold;
          color: #C3C3C3;
        }
        .spu_price_btn_dian_price{
          font-size: 11px;
          font-family: AlternateBold;
          font-weight: bold;
          color: #C3C3C3;
        }
        .line {
          width: 100%;
          height: 1px;
          background-color: #999999;
          position: absolute;
          top: 50%;
        }
      }
    }
  }
  .copun-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .copun-list-wrapper {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 12px;
      .copun-detail-box {
        text-align: center;
        .real-price {
          display: inline-block;
          background: #FFE4E7;
          border: 1px solid #FFB1B8;
          border-radius: 4px;
          padding: 10px 16px;
          color: #E60113;
          font-size: 12px;
          margin-top: 24px;
          min-width: 100px;
          >p:first-child {
            font-size: 18px;
            font-weight: bold;
          }
        }
        .choose-detail {
          border: 1px solid #E60113;
          margin-top: 12px;
          border-radius: 14px;
          padding: 24px 52px 32px;
          height: 212px;
          .choose-title {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            margin-bottom: 16px;
          }
          .reduce-detail {
            font-size: 18px;
            color: #E60113;
            font-weight: bold;
            margin-bottom: 16px;
          }
          .choose-detail-wrapper {
            display: flex;
            justify-content: space-between;
            >div {
              background: #FFE4E7;
              border: 1px solid #FFB1B8;
              border-radius: 4px;
              padding: 10px 6px;
              color: #E60113;
              font-size: 12px;
              min-width: 100px;
              margin-right: 12px;
              >p:first-child {
                font-size: 16px;
                font-weight: bold;
              }
            }
          }
          .no-use-tip {
            margin-top: 60px;
            color: #999;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
  .copun-use-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FEF4F4;
    margin-top: 12px;
    padding: 30px 18px;
    border-radius: 10px;
    position: relative;
    &.no-use {
      background: #F2F2F2;
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
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
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
      align-items: center;
      .cost-money {
        color: #E60113;
        font-size: 14px;
        margin-right: 18px;
        font-weight: bold;
        .price {
          font-size: 32px;
          line-height: 38px;
          &.bigPrice {
            font-size: 22px;
          }
        }
      }
      .use-condition {
        flex: 1;
        overflow: hidden;
        .condition-price {
          font-size: 12px;
          color: #000;
          font-weight: bold;
        }
        .condition-time {
          font-size: 11px;
          color: #666;
        }
      }

    }
    .right {
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .copun-title {
    font-size: 16px;
    color: #000;
    padding-left: 8px;
  }
  .handle-sure-btn {
    font-size: 14px;
    color: #fff;
    background: #E60113;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
  }
  .spu-desc {
    word-break: break-all;
  }
  .addresspop {
		background-color: #F6F6F6;
		height: 522px;
		overflow: hidden;
		position: relative;
		&-close {
			width: 27px;
			height: 20px;
			background-size: 100% 100%;
			background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
			position: absolute;
			right: 12px;
			top: 12px;
		}
		&-title {
			text-align: center;
			font-size: 16px;
			line-height: 46px;
		}
		&-content {
			position: absolute;
			top: 46px;
			bottom: 82px;
			left: 0;
			right: 0;
			overflow: scroll;
		}
		&-location {
			width: 351px;
      height: 65px;
			background-color: #FFFFFF;
			margin: 0 auto;
			display: flex;
			align-items: center;
			border-radius: 12px;
			padding: 12px 0;
			&__icon {
				width: 16px;
				height: 16px;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-location-2x.png);
				margin: 10px;
			}
			&__content {
				width: 257px;
			}
			&__content-top {
				display: flex;
				align-items: center;
			}
			&__desc {
				width: 48px;
				height: 14px;
				line-height: 14px;
				text-align: center;
				border-radius: 2px;
				background-color: rgba(255, 231, 235, 0.5);
				font-size: 10px;
				color: #FF0A35;
        display: flex;
        align-items: center;
			}
			&__address-detail {
				width: 205px;
				line-height: 20px;
				color: #191919;
				font-size: 16px;
				font-weight: bold;
				margin: 0 0 0 4px;
			}
			&__address {
				width: 257px;
				line-height: 17px;
				font-size: 13px;
				color: #999;
				margin: 4px 0 0 0;
			}
			&__retry {
				font-size: 10px;
				color: #FF0A35;
				margin: 0 0 0 10px;
			}
		}
		&-list {
			width: 351px;
			background-color: #FFFFFF;
			margin: 10px auto 20px;
			display: flex;
			align-items: center;
			flex-direction: column;
			border-radius: 12px;
			padding: 12px 0;
			&__every {
				width: 100%;
				display: flex;
				align-items: center;
				margin: 20px 0 0;
			}
			&__every-first {
				margin-top: 0;
			}
			&__check {
				width: 16px;
				height: 16px;
				border-radius: 50%;
				border: 1px solid #c3c3c3;
				margin: 10px;
			}
			&__checked {
				width: 16px;
				height: 16px;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png);
				margin: 10px;
			}
			&__content {
				width: 307px;
			}
			&__address-detail {
				width: 100%;
				line-height: 20px;
				font-size: 16px;
				font-weight: bold;
				color: #191919;
			}
			&__address {
				width: 100%;
				font-size: 13px;
				color: #999999;
				margin-top: 4px;
			}
		}
		&-add {
			width: 100%;
			padding: 4px 0 38px;
			background-color: #fff;
			position: absolute;
			left: 0;
			bottom: 0;
			&__btn {
				width: 351px;
				height: 40px;
				line-height: 40px;
				background-image: linear-gradient(
					90deg,
					rgba(255, 95, 46, 1) 0,
					rgba(255, 10, 53, 1) 100%
				);
				border-radius: 20px;
				margin: 0 auto;
				text-align: center;
				color: #FFF9E9;
				font-size: 16px;
			}
		}
		&-empty {
			&__flag {
				width: 160px;
				height: 160px;
				margin: 72px auto 0;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-blank-2x.png);
			}
			&__desc {
				line-height: 17px;
				font-size: 13px;
				text-align: center;
				color: #444444;
				margin-top: 8px;
			}
		}
	}

  .active {
    width: 327px;
    height: 32px;
    background-image: linear-gradient(90deg, #F4FAFF 0%, #FFF2F2 50%, #FFF9E9 100%);
    border-radius: 16px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .active-content {
      display: flex;
      align-items: center;
    }
    .active-hot {
      width: 24px;
      height: 24px;
    }
    .active-word {
      color: #FF450C;
      font-size: 13px;
      width: 230px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 8px;
    }
    .active-check {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
  .tag-pannel {
    display: flex;
    margin-bottom: 10px;
    .tag-list {
      display: flex;
    }
    .tag-every {
      // border: 1px solid #FF5F2E;
      border: 1px solid transparent;
      overflow: hidden;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      padding: 1px;

      border-radius: 4px;
      font-size: 10px;
      line-height: 10px;
      margin-right: 4px;
      background: rgba(255,190,12,0.1);
      .tag-inner {
        font-weight: 400;
        padding: 3px 6px;
        border-radius: 4px;
        color: #FF450C;
        line-height: 17px;
        font-size: 13px;
      }
    }
  }
  .performance {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
    border-radius: 4px;
    img {
      width: 16px;
      height: 16px;
    }
    .num-pannel {
      color: #008864;
      font-size: 11px;
      .num {
        font-size: 11px;
        font-weight: bold;
      }
    }
  }

  .boxwrapper /deep/ .van-sku-header__goods-info {
    justify-content: flex-start;
  }
  .sku-box {
    height: 440px;
    padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
    padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
    /deep/ .van-sku-header__img-wrap{
      img{
        object-fit:fill !important;
      }
    }

    /deep/ .van-sku-header-item {
      font-size: 13px;
      color: #999;
    }
    /deep/.van-sku-row__item-img{
      display: none;
    }
    /deep/ .van-sku-row__title {
      font-size: 13px;
      color: #191919;
      padding-bottom: 8px;
    }

    /deep/ .van-sku-row__item--active {
      box-shadow: 0px 0px 0px 0.5px #FF450C;
      color: #FF450C;
    }
    /deep/ .van-sku-row__item--active::before {
      background: rgba(255, 69, 12, 0.06);
      opacity: 1;
    }

    /deep/ .van-sku-row__item-name {
      font-weight: 400;
      padding: 6px 12px 5px;
      line-height: 17px
    }

    /deep/ .van-sku-stepper-stock {
      padding: 4px 16px;
    }

    /deep/ .van-popup__close-icon {
      top: 15px;
      right: 12px;
      width: 27px;
      height: 20px;
      background: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;

      &::before {
          display: none;
      }
    }
    /deep/ .van-sku-header__img-wrap {
      width: 102px;
      height: 102px;
    }
    /deep/ .van-sku-header__img-wrap img {
      border-radius: 8px;
    }

    /deep/ .van-stepper__minus, /deep/ .van-stepper__plus {
      height: 14px;
      width: 14px;
      background-color: transparent;
    }
    /deep/ .van-stepper__input {
      width: 27px;
      height: 22px;
      background-color: #F6F6F6;
      font-size: 13px;
      font-weight: bold;
      color: #191919;
      margin: 0 7px;
      border-radius: 4px;
      font-family: DINAlternate-Bold, DINAlternate;
    }

    /deep/ .van-hairline--bottom::after {
      border: none;
    }
  }

  .chooseInfo /deep/ .two-line-ellipsis {
    height: auto;
    .van-cell__value {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      white-space: unset;
      height: auto;
      max-height: 34px;
    }
  }

.flex1{
    flex:1
}
.footer-btn{
    display: flex;
    gap: 5px;
    .yellow-btn{
        flex: 1;
        height: 40px;
        text-align: center;
        background: #FFBE0C;
        border-radius: 20px;
        color: #FFFFFF;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .share_price{
            display: flex;
            line-height: 17px;
        }
        .spu_price_btn_icon .spu_price_btn_dian_price{
            font-size:10px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight:bold;
        }
        .spu_price_btn_pre_price{
            font-size:13px;
            font-weight:bold;
        }
        .font-size11{
            font-size:11px;
        }
        .font-size13{
            font-size: 13px;
        }
    }
    .red-btn{
        flex: 1;
        background: linear-gradient(270deg, #FE3040 0%, #FF8011 100%);
        border-radius: 20px;
        height: 40px;
        color: #FFFFFF;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        font-weight: 500;
    }
    .font-size16{
        font-size: 16px;
        font-weight: 500;
    }
    .yellow-btn-disabled{
        border: 1px solid #EEEEEE;
        color: #C3C3C3;
        background: none;
    }
    .red-btn-disabled{
        background: #EEEEEE;
        color: #C3C3C3;
    }
}
.padding12{
    padding: 0px 12px;
    gap: 11px;
}

</style>
@/utils/location
