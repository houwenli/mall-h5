<template>
  <div style="height: 100vh" ref="boxwrapper" :class="[returntop ? 'backtopactive' : '']" class="boxWrapper">
    <!-- <x-header :left-options="{ backText: '', showBack: showBack }" style="border-radius: 0 0 10px 10px">
      购物车
      <a v-if="isLogin && shoppingCarts && shoppingCarts.length > 0" slot="right" style="color: #000" @click="handleEditType">
        <span v-if="!editType">编辑</span>
        <span v-if="editType">完成</span>
      </a>
    </x-header> -->
    <popup-picker ref="areasPicker" v-show="false" @on-change="addressChange" :data="areas" :columns="3" :show.sync="areasShow" v-model="addressValue" show-name></popup-picker>
    <div class="top-adress-edit" v-if="isLogin && shoppingCarts && shoppingCarts.length > 0">
      <div class="top-adress" @click="toSelectAddress">
        <!-- <van-icon name="location-o" /> -->
        <img class="adress-img" src="../../assets/img/adress-top.png" alt="">
        <div v-if="selectAddress" class="init-adress">{{ changeAdress(selectAddress) }}</div>
        <div v-else class="no-adress">请添加收货地址</div>

      </div>
      <a slot="right" style="color: #000" @click="handleEditType">
        <span v-if="!editType">编辑</span>
        <span v-if="editType">完成</span>
      </a>
    </div>

    <!-- 选择地址 -->
    <van-popup v-model="showAddress" round position="bottom">
      <template>
        <div class="addresspop">
          <div class="addresspop-close" @click="showAddress = false"></div>
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
                <div class="addresspop-location__address">{{ positionStreet }}</div>
              </div>
              <div class="addresspop-location__retry" @click.stop="toPosition">重新定位</div>
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

    <!-- 未登录-->
    <div v-if="!isLogin">
      <div class="shopcart_login_bar">
        <div style="height: 62px; padding-top: 35px; box-sizing: content-box">
          <img src="../../assets/img/cat_d@2x.png" alt="" style="width: 67px; height: 100%" />
        </div>
        <p style="height: 20px; line-height: 20px; font-size: 14px; color: #999; padding: 16px 0 15px; box-sizing: content-box">
          登录后可同步账户购物车中的商品
        </p>
        <van-button @click.native="toLogin()" type="danger" style="width: 80px; height: 30px; border-radius: 20px">登录</van-button>
      </div>
    </div>

    <!--登录-->
    <div v-if="isLogin">

      <load-more style="margin: 50% auto" v-if="loading" tip="正在加载"></load-more>

      <div v-if="!loading">
        <!--登录下购物车为空-->
        <div v-if="shoppingCarts == null || shoppingCarts.length == 0" class="shopcart_empty">
          <div style="height: 90px; padding-top: 21px; box-sizing: content-box">
            <img src="../../assets/img/cat_d@2x.png" alt="" style="width: 90px; height: 100%" />
          </div>
          <p style="height: 20px; line-height: 20px; font-size: 14px; color: #999; padding: 2px 0 15px; box-sizing: content-box">购物车是空的</p>
          <van-button @click.native="toIndex()" type="default" style="width: 80px; height: 30px; border-radius: 20px; border: 0.5px solid #666">
            去逛逛
          </van-button>
        </div>
        <!--购物车有数据-->
        <div v-if="shoppingCarts && shoppingCarts.length > 0" class="cart_tabbar">
          <!--购物车商品信息-->
          <div class="listContent">
              <!--遍历普通商品(没有满减瞒折满赠的商品)-->
              <div v-for="(shoppingCart, index) in shoppingCarts[0].validSpus" :key="index" class="cart_section">
                <div class="copun-item" :class="shoppingCart.checked ? 'selected' : ''" >
                  <div class="left" @click="clickStore(shoppingCart)">
                    <i class="icon_select"></i>
                    <label class="checkLabel">全选</label>
                    <!-- <span v-for="(tag,tagIndex) in shoppingCart.couponLabelList" :key="tagIndex">{{tag.text}}</span> -->
                  </div>
                  <div v-if="shoppingCart.haveCoupon" class="right" @click="handleCoupon(shoppingCart, index)">
                    <span>优惠</span>
                    <img src="@/assets/goods/icon-left.png" alt="">
                    <!-- <img src="@/assets/img/youhui-icon.webp" alt=""> -->
                  </div>
                </div>
                <div v-for="(sku, i) in shoppingCart.validSkus" :key="i" class="item">
                  <van-swipe-cell>
                    <div class="goods" :class="sku.checked ? 'selected' : ''">
                      <i v-if="sku.status == 0 || editType" @click="clickSku(sku)" class="icon_select"></i>
                      <i v-else class="icon_select"></i>
                      <div class="image-box" :class="sku.stock == 0 || sku.status == 2 ? 'skudisabled' : ''">
                        <img class="image" :src="sku.image" v-if="sku.status == 2" />
                        <img class="image" :src="sku.image" v-else-if="sku.status == 4" />
                        <img class="image" :src="sku.image" v-else @click="toSpuDetail(sku)" />
                        <div v-if="(sku.stock == 0 || sku.status == 3) && sku.status != 2" class="status" @click="toSpuDetail(sku)">
                          {{ sku.status == 3 ? '售罄' : sku.stock == 0 ? '无货' : null }}
                        </div>
                        <div v-if="sku.status == 2" class="status">下架</div>
                        <div v-if="sku.status == 4" class="status">失效</div>
                      </div>
                      <div class="goods-info">
                        <div>
                          <div class="name" :class="sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : ''" @click="toSpuDetail(sku)">
                            <i v-if="sku.isVirtual == '1'" class="mod_sign_tip"><span>虚拟</span></i>
                            {{ sku.name }}
                            </div>
                          <div class="select-goods">
                            <x-button
                              v-if="tabValue == 0"
                              @click.native="showAttr(sku, sku.cartId, i)"
                              plain
                              mini
                              type="primary"
                              class="cartGoodsBtn"
                              :disabled="sku.status == 2 || sku.status == 3 || sku.status == 4"
                            >
                              <p
                                style="max-width: 99px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
                                :class="sku.stock == 0 || sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : ''"
                              >
                                {{ sku.spec }}
                              </p>
                              <van-icon
                                name="arrow-down"
                                class="van-icon"
                                :class="sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : ''"
                              />
                            </x-button>
                          </div>
                          <p class="performate-point" v-if="sku.performanceScore && sku.performanceScore>0">
                              <span class="performate-point-label">绩效分:</span><span class="performate-point-num">{{sku.performanceScore}}</span>
                          </p>
                        </div>
                        <!-- 买送 -->
                        <!-- <div class="buyGiveboxwrapper" v-if="sku.marketingVos">
                          <div v-for="(item, index) in sku.marketingVos" :key="index">
                            <label class="buygivebox border_half" v-if="item.type == 12">{{ item.name }}</label>
                            <label class="activity-type" v-if="item.type == 16">{{ item.marketingAttr.label }}</label>
                            <label class="seckill-shops" v-if="item.type == 13">
                              <div class="buygivebox border_half">{{ item.isStart > 0 ? '秒杀' : '秒杀预告' }}</div>
                              <div :class="`seckill-count-down ${item.isStart > 0 ? 'start' : ''}`">
                                <div>距离{{ item.isStart > 0 ? '结束' : '开始' }}还剩</div>
                                <van-count-down :time="getCountDownTime(item)">
                                  <template #default="timeData">
                                    <span :class="`block ${item.isStart > 0 ? 'start' : ''}`" v-if="timeData.days > 0">
                                      {{ timeData.days * 24 + timeData.hours }}:{{ timeData.minutes | addZero}}:{{ timeData.seconds | addZero  }}
                                    </span>
                                    <span :class="`block ${item.isStart > 0 ? 'start' : ''}`" v-else>
                                      {{ timeData.hours | addZero}}:{{ timeData.minutes | addZero}}:{{ timeData.seconds | addZero }}
                                    </span>
                                  </template>
                                </van-count-down>
                                <div v-if="item.isStart > 0">(限购{{ item.panicBuy.limitNum }}件)</div>
                              </div>
                            </label>
                          </div>
                        </div> -->
                        <div class="goods_price">
                          <div :class="[sku.stock == 0 || sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : '','price-box']">
                            <p class="price" >¥<span class="price-yuan">{{ sku.oldPrice.toFixed(2).split('.')[0] }}.</span><span class="price-fen">{{ sku.oldPrice.toFixed(2).split('.')[1] }}</span></p>
                          </div>
                          <van-stepper
                            class="count_choose"
                            integer
                            @change="updateShoppingCartNum(sku)"
                            :disable-plus="sku.num == sku.stock"
                            v-model="sku.num"
                            :min="1"
                            :disabled="sku.stock == 0 || sku.status == 2 || sku.status == 3 || sku.status == 4"
                            ref="addNum"
                            :input-width="(sku.num + '').length > 3 ? (32 + ((sku.num + '').length - 3) * 8) + 'px' : '32px'"
                          />
                        </div>
                      </div>
                      <div class="afterCouponPrice" v-if="sku.afterCouponPrice && sku.afterCouponPrice != sku.oldPrice">
                        <!-- 预估到手价￥<span>{{sku.afterCouponPrice.toFixed(2)}}</span> -->
                        预估到手价¥<span class="price-yuan">{{ sku.afterCouponPrice.toFixed(2).split('.')[0] }}.</span><span class="price-fen">{{ sku.afterCouponPrice.toFixed(2).split('.')[1] }}</span>
                      </div>
                      <span class="fqz-price" v-if="sku.integralPoint > 0">
                        <span>
                          <span class="special">{{ sku.integralPoint }}</span>
                          福气值+<span>{{ sku.deductionAfterPrice }}</span>元
                        </span>
                      </span>
                      <div v-if="sku.marketingVos">
                        <template v-for="(i, k) in sku.marketingVos" >
                          <div :key="k" v-if="i.type == 2">
                            <div
                              style="height: 20px; line-height: 20px; display: flex; justify-content: space-between; align-items: center"
                              v-for="j in filterGiftSku(i.fullGiftList, sku.num * sku.price)"
                              :key="j.skuId"
                              @click="toSpuDetail(j)"
                            >
                              <p style="display: inline-block; max-width: 6.84rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                                赠品:
                                <span style="color: #999">{{ j.name }}</span>
                              </p>
                              <span style="color: #999">x{{ j.num }}</span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                    <template #right>
                      <van-button square text="删除" type="danger" class="delete-button" style="height: 100%" @click="deletAttr(sku.cartId)" />
                    </template>
                  </van-swipe-cell>
                  <div class="line-down"></div>
                </div>
              </div>
              <div v-if="inValidateList && inValidateList.length >0" class="cart_section">
                <div class="copun-item">
                  <div class="left">
                    <i class="icon_select icon_select_out"></i>
                    <label class="checkLabel">失效宝贝( {{inValidateList.length}} )</label>
                  </div>
                  <div class="right">
                    <span style="color:#FF450C;font-size: 11px;" @click="clearGoods()">清空失效宝贝</span>
                  </div>
                </div>
                <div v-for="(sku, index) in inValidateList" :key="index" class="item">
                  <van-swipe-cell>
                    <div class="goods" :class="sku.checked ? 'selected' : ''" style="height: auto;">
                      <i class="icon_select icon_select_out"></i>
                      <div class="image-box" :class="sku.stock == 0 || sku.status == 2 ? 'skudisabled' : ''">
                        <img class="image" :src="sku.image" v-if="sku.status == 2" />
                        <img class="image" :src="sku.image" v-else-if="sku.status == 4" />
                        <img class="image" :src="sku.image" v-else @click="toSpuDetail(sku)" />
                        <div v-if="(sku.stock == 0 || sku.status == 3) && sku.status != 2" class="status" @click="toSpuDetail(sku)">
                          {{ sku.status == 3 ? '售罄' : sku.stock == 0 ? '无货' : null }}
                        </div>
                        <div v-if="sku.status == 2" class="status">下架</div>
                        <div v-if="sku.status == 4" class="status">失效</div>
                      </div>
                      <!-- <p v-if="showStockWarning(sku)" class="image_tag">{{ showStockWarning(sku) }}</p> -->
                      <div class="goods-info">
                        <div>
                          <div class="name" :class="sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : ''" @click="toSpuDetail(sku)">
                            <i v-if="sku.isVirtual == '1'" class="mod_sign_tip"><span>虚拟</span></i>
                            {{ sku.name }}
                          </div>
                          <div class="select-goods">
                            <x-button
                              v-if="tabValue == 0"
                              @click.native="showAttr(sku, sku.cartId)"
                              plain
                              mini
                              type="primary"
                              class="cartGoodsBtn"
                              :disabled="sku.status == 2 || sku.status == 3 || sku.status == 4"
                            >
                              <p
                                style="max-width: 99px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
                                :class="sku.stock == 0 || sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : ''"
                              >
                                {{ sku.spec }}
                              </p>
                              <van-icon
                                name="arrow-down"
                                class="van-icon"
                                :class="sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : ''"
                              />
                            </x-button>
                          </div>
                          <!-- 万顺福商城重构二期(下单)项目-应产品刘雪雯要求失效商品不显示绩效分 -->
                          <!-- <p class="performate-point" v-if="sku.performanceScore">
                            <span class="performate-point-label">绩效分:</span><span class="performate-point-num">{{sku.performanceScore}}</span>
                          </p> -->
                        </div>
                        <div class="goods_price">
                          <div :class="sku.stock == 0 || sku.status == 2 || sku.status == 3 || sku.status == 4 ? 'skudisabled' : ''">
                            <!-- <span style="font-size: 20px">{{ sku.price.toFixed(2) }}</span> -->
                            <p class="price" >¥<span class="price-yuan">{{ sku.oldPrice.toFixed(2).split('.')[0] }}.</span><span class="price-fen">{{ sku.oldPrice.toFixed(2).split('.')[1] }}</span></p>
                          </div>

                          <van-stepper
                            class="count_choose"
                            integer
                            @change="updateShoppingCartNum(sku)"
                            :disable-plus="sku.num == sku.stock"
                            v-model="sku.num"
                            :min="1"
                            :disabled="sku.stock == 0 || sku.status == 2 || sku.status == 3 || sku.status == 4"
                            ref="addNum"
                            :input-width="(sku.num + '').length > 3 ? (32 + ((sku.num + '').length - 3) * 8) + 'px' : '32px'"
                          />
                        </div>

                      </div>
                      <div v-if="sku.marketingVos">
                        <template v-for="(i, k) in sku.marketingVos" >
                          <div :key="k" v-if="i.type == 2">
                            <div
                              style="height: 20px; line-height: 20px; display: flex; justify-content: space-between; align-items: center"
                              v-for="j in filterGiftSku(i.fullGiftList, sku.num * sku.price)"
                              :key="j.skuId"
                              @click="toSpuDetail(j)"
                            >
                              <p style="display: inline-block; max-width: 6.84rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                                赠品:
                                <span style="color: #999">{{ j.name }}</span>
                              </p>
                              <span style="color: #999">x{{ j.num }}</span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                    <template #right>
                      <van-button square text="删除" type="danger" class="delete-button" style="height: 100%" @click="deletAttr(sku.cartId)" />
                    </template>
                  </van-swipe-cell>
                  <div class="line-down"></div>
                </div>
              </div>
          </div>

          <!--购物车的底部-->
          <!-- 因为微信打开要距离底部有一个20px的安全距离,所以在微信打开的时候要距离底部要加上这个20px-->
          <!-- :style="{ bottom: this.safeArea ? (isIphoneX ? '82px' : '70px') : isIphoneX ? '62px' : '50px' }" -->
          <div
            class="fixBar flex-box-between"
            :style="{ bottom: footRefHeight + 'px' }"
            :class="[isAllCheck ? 'selected' : '',((fullReductionMoney>0 || totalMarketDiscount > 0) && totalPerformanceScore > 0 && !editType) ? 'threeHorizontal': '']"
          >
            <i @click="clickChooseAll()" class="icon_select select-all-btn">全选</i>
            <div class="flex-box">
              <div class="left">
                <div class="up">
                  <span v-if="!editType">合计</span>
                  <strong v-if="!editType">¥{{ allPrice.toFixed(2) }}</strong>
                </div>
                <div v-if="!editType && (fullReductionMoney>0 || totalMarketDiscount > 0)" class="special-total" @click="showCopunPriceDetail=true">
                  <span>已优惠¥{{ (fullReductionMoney + totalMarketDiscount).toFixed(2) }}</span>
                  <!-- <img src="@/assets/img/right-arrow.png" alt=""> -->
                  <img src="@/assets/goods/icon-down.png" alt="">
                </div>
                <!-- <div v-if="!editType && totalPerformanceScore > 0" class="special-total" @click="showCopunPriceDetail=true">
                  <span>绩效分{{ totalPerformanceScore }}分</span>
                  <img src="@/assets/goods/icon-down.png" alt="">
                </div> -->
              </div>

              <div v-if="!editType" class="total">
                <a v-if="typeNum > 0" @click="toSettement()" class="buy">
                  去结算
                  <em>({{ cartNum }})</em>
                </a>
                <a v-if="typeNum == 0" class="buy disabled">
                  去结算
                  <em></em>
                </a>
              </div>
              <div v-if="editType" class="btns">
                <div>
                  <van-button @click="toDeleteCart()" type="default" class="delet-btn">删除({{ cartNum }})</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-if="showCopunPriceDetail" v-model="showCopunPriceDetail" round position="bottom" :style="{ padding: '12px',paddingBottom: ((fullReductionMoney>0 || totalMarketDiscount > 0) && totalPerformanceScore > 0 && !editType) ? '172px' : '152px'  }" class="money-detail">
      <div class="money-detail-title">金额明细</div>
      <img class="closeIcon" src="@/assets/img/close-icon.png" alt="" @click="showCopunPriceDetail = false" />
      <div class="goods-actives">
        <div class="price-detail-item">
          <span class="label">商品总额</span>
          <span class="total-price">¥{{ beforeCopunAllPrice.toFixed(2) }}</span>
        </div>
        <div class="price-detail-item" v-if="totalMarketDiscount > 0">
          <span class="label">活动</span>
          <span class="copun-price">-¥{{ totalMarketDiscount.toFixed(2) }}</span>
        </div>
        <div class="price-detail-item" v-if="fullReductionMoney > 0">
          <span class="label">优惠券</span>
          <span class="copun-price">-¥{{ fullReductionMoney.toFixed(2) }}</span>
        </div>
      </div>
      <div class="achievements goods-actives" v-if="totalPerformanceScore > 0">
        <div class="price-detail-item">
          <span class="label">绩效分</span>
          <span class="total-price">{{ totalPerformanceScore }}</span>
        </div>
      </div>
      <div
        class="fixBar flex-box-between"
        :style="{ bottom: footRefHeight + 'px' }"
        :class="[isAllCheck ? 'selected' : '',((fullReductionMoney>0 || totalMarketDiscount > 0) && totalPerformanceScore > 0 && !editType) ? 'threeHorizontal': '']"
      >
        <i @click="clickChooseAll()" class="icon_select select-all-btn">全选</i>

        <div class="flex-box">
          <div class="left">
            <div class="up">
              <span v-if="!editType">合计</span>
              <strong v-if="!editType">¥{{ allPrice.toFixed(2) }}</strong>
            </div>
            <div v-if="!editType && (fullReductionMoney > 0 || totalMarketDiscount > 0)" class="special-total">
              <span>已优惠¥{{ (fullReductionMoney + totalMarketDiscount).toFixed(2) }}</span>
              <!-- <img src="@/assets/img/right-arrow.png" alt=""> -->
              <img src="@/assets/goods/icon-top.png" alt="">
            </div>
            <!-- <div v-if="!editType && totalPerformanceScore > 0" class="special-total">
              <span>绩效分{{ totalPerformanceScore }}分</span>
              <img src="@/assets/goods/icon-top.png" alt="">
            </div> -->
          </div>
          <div v-if="!editType" class="total">
            <a v-if="typeNum > 0" @click="toSettement()" class="buy">
              去结算
              <em>({{ cartNum }})</em>
            </a>
            <a v-if="typeNum == 0" class="buy disabled">
              去结算
              <em></em>
            </a>
          </div>
          <div v-if="editType" class="btns">
            <div>
              <van-button @click="toDeleteCart()" type="default" class="delet-btn">删除({{ cartNum }})</van-button>
            </div>
          </div>
        </div>
      </div>
      <foot title='购物车' ref="foot" />
    </van-popup>

    <!-- 热销商品 -->
    <div class="xq_wntj" ref="wntj">
      <shopList :title="'热销商品'" :titleImg="true"></shopList>
    </div>

    <!-- 属性选择弹窗 -->
    <van-sku
      v-model="showBase"
      :hide-stock="true"
      :sku="sku"
      :goods="goods_info"
      :initial-sku="initialSku"
      style="height: 400px"
      class="sku-box"
      @sku-selected="skuSelected"
    >
      <template #sku-header-price="props">
        <span class="fqz-price" v-if= "integralPoint > 0">
          <span>
            <span class="special">{{integralPoint }}</span>
            福气值+<span>{{ deductionAfterPrice }}</span>元
          </span>
        </span>

        <div class="van-sku__goods-price" v-else>
          <span class="van-sku__price-symbol" style="margin-top: 2px">￥</span>
          <div class="van-sku__price-num">
            <span>{{ props.price }}</span>
          </div>

        </div>

        <div class="performate-point performate-point-sku" v-if="(performanceScore && performanceScore > 0)">
            绩效分{{performanceScore}}
          </div>
      </template>
      <template #sku-stepper>
        <div class="van-sku-stepper-stock"></div>
      </template>
      <template #sku-actions="props">
        <div class="van-sku-actions">
          <van-button square size="large" type="danger" @click="changeAttr(props)">确定</van-button>
        </div>
      </template>
    </van-sku>

    <!-- 优惠券弹窗 -->
    <van-popup v-model="couponListVisible" closeable close-icon="close" round position="bottom" :style="{ height: '532px', padding: '16px 18px' }">
      <div class="copun-box">
          <div style="text-align: center; font-size: 0.64rem; color: #000; font-weight: 600">优惠</div>

          <div class="copun-list-wrapper">
            <p class="copun-title" v-if="couponList && couponList.length">可用</p>
            <div v-for="(item) in couponList" :key="item.id" class="copun-use-item">
              <div class="left">
                <div class="cost-money" v-if="item.couponsType == 1 || item.couponsType == 3">
                  <span class="coin">￥</span>
                  <span class="price" :class="{'bigPrice': item.faceValue>999}">{{item.faceValue}}</span>
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
              </div>
              <span class="top-icon">商品券</span>
            </div>
            <p class="copun-title dis-title" v-if="disCouponList && disCouponList.length">当前不可用</p>
            <div v-for="(item) in disCouponList" :key="item.id" class="copun-use-item no-use">
              <div class="left">
                <div class="cost-money" v-if="item.couponsType == 1 || item.couponsType == 3">
                  <span class="coin">￥</span>
                  <span class="price" :class="{'bigPrice': item.faceValue>999}">{{item.faceValue}}</span>
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
                  <!-- <p class="dis-reson">结算商品中没有该商品或结算金额不符合条件</p> -->
                </div>

              </div>

              <div class="right">
                <!-- <img src="@/assets/img/copun-choose.png" alt=""> -->
              </div>
              <span class="top-icon">商品券</span>
            </div>
          </div>
          <!-- <div class="handle-sure-btn">确认</div> -->
        </div>
    </van-popup>

    <coupun-popup ref="coupunPopup" haveActivity disable reloadActive @coonfirmCoupun='coonfirmCoupun'></coupun-popup>

    <!-- 回到顶部 -->
    <div class="backtop" ref="backtop" v-if="backtopshow" @click="backtop">
      <img src="@/assets/img/top@2x.png" class="imgtop" alt />
    </div>

    <van-dialog v-model="show" :showConfirmButton="false" class="delet-dialog">
      <p>确认要删除已选中的1件商品?</p>
      <div class="btn-box">
        <van-button type="default" class="cancle" @click="show = false">返回</van-button>
        <van-button type="danger" class="confirm" @click="handleDele">删除</van-button>
      </div>
    </van-dialog>
    <van-dialog v-model="show1" :showConfirmButton="false" class="delet-dialog">
      <p>确认要删除已选中的{{ cartNum }}件商品?</p>
      <div class="btn-box">
        <van-button type="default" class="cancle" @click="show1 = false">返回</van-button>
        <van-button type="danger" class="confirm" @click="handleDeleAll">删除</van-button>
      </div>
    </van-dialog>
    <van-dialog v-model="show2" :showConfirmButton="false" class="delet-dialog">
      <div class="onemore-box">
        <div class="onemore" v-for="(item, index) in nosku" :key="index">{{ item + '暂时无货，请重新选择！' }}</div>
      </div>
      <div class="btn-box1">
        <van-button type="default" class="cancle" @click="onemore">重新选择</van-button>
      </div>
    </van-dialog>

    <foot title='购物车' ref="foot" />

    <SecondConfirm title="您购买的商品已超出限购范围！" cancleText="我知道了" :dialogshow="showLimit" @closeBack="showLimit = false" :hideConfirmBtn="true">
      <template slot="textp">
        <!-- 秒杀商品限制 -->
        <div class="limit-skus-list">
          <div v-for="(item, index) in limitSkuList" :key="index" class="limit-item">
            <div class="limit-skus">
              <div class="limit-sku-image">
                <img style="width: 2.1rem; height: 1.68rem" :src="item.image + '?imageView2/1/w/105/h/84'" alt="" />
              </div>
              <div class="limit-sku-info">
                <div class="limit-sku-name text-clamp2">{{ item.name }}</div>
                <div class="limit-sku-num">限购{{ item.limitNumFromMarketing }}件</div>
              </div>
            </div>
          </div>
          <div v-for="(item, index) in limitFirstList" :key="index" class="limit-item">
            <div style="margin-bottom: 20px; padding-left: 1.12rem; color: #e60113; font-size: 12px" v-if="item.limitKind">限购{{ item.limitKind }}款</div>
            <div v-for="(sItem, idx) in item.specialAreaLimitList" :key="idx">
              <div class="limit-skus">
                <div class="limit-sku-image">
                  <img style="width: 2.1rem; height: 1.68rem" :src="sItem.image + '?imageView2/1/w/105/h/84'" alt="" />
                </div>
                <div class="limit-sku-info">
                  <div class="limit-sku-name text-clamp2">{{ sItem.name }}</div>
                  <div class="limit-sku-num">限购{{ sItem.marketingVos[0].specialArea.limitNum }}件</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </SecondConfirm>
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
          <div style="padding: 0.9rem 1.12rem 1.2rem" v-html="protocol"></div>
        </div>
      </div>
    </SecondConfirm>
    <van-overlay :z-index="999999999" v-if="showEmpty" :show="showEmpty" @click="showEmpty = false">
      <div class="wrapperCart" @click.stop>
          <div class="block">
              <p>确定要一键清空失效商品？</p>
              <div class="block-btn">
                  <van-button class="block-btn-cancel" @click="cancelEmpty">取消</van-button>
                  <van-button class="block-btn-confirm" color="#E60113" @click="confirmEmpty">确定</van-button>
              </div>
          </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import { Group, InlineXNumber, LoadMore, Picker, PopupHeader, Tab, Tabbar, TabbarItem, TabItem, XButton, XHeader, PopupPicker } from 'vux'
  import { Button, CountDown, Dialog, Icon, Popup, Sku, Stepper, SwipeCell, Toast } from 'vant'

  import {
    cartSummary,
    deleteCart,
    deleteStoreCart,
    queryCart,
    queryCartCount,
    queryStoreShoppingCarts,
    updateCartDec,
    updateShoppingCartNum
  } from '@/api/shoppingcart'
  import {queryAllAreas} from '@/api/spudetail'
  import { querySpu } from '@/api/spudetail'
  import { getUserSpuCoupons } from '@/api/mycoupon'
  import { visit } from '@/api/visit'
  import { getToken } from '@/utils/token'

  import foot from '@/components/commons/foot'
  import shopList from '@/components/commons/shopList'
  import { mapGetters } from 'vuex'
  import { checkLimitNumBeforeSettlement, checkSkuPanicBuyLimitNum } from '@/api/activities/seckill'
  import timeFormat from '@/utils/timeFormat'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import {deepClone} from '@/utils/utils'
  import Cookies from 'js-cookie'
  import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
  import { queryCustomerAddress } from '@/api/customeraddresslist' //查询用户收货地址
  import CoupunPopup from '@/components/commons/coupunPopup.vue'
  export default {
    mixins: [userRegistrationProtocol],
    components: {
      PopupPicker,
      XHeader,
      Group,
      XButton,
      Popup,
      Tabbar,
      TabbarItem,
      Tab,
      TabItem,
      InlineXNumber,
      PopupHeader,
      Picker,
      foot,
      LoadMore,
      [Button.name]: Button,
      [SwipeCell.name]: SwipeCell,
      [Icon.name]: Icon,
      [Stepper.name]: Stepper,
      [Sku.name]: Sku,
      [Dialog.name]: Dialog,
      [Toast.name]: Toast,
      [Dialog.Component.name]: Dialog.Component,
      [Popup.name]: Popup,
      [CountDown.name]: CountDown,
      shopList,
      SecondConfirm,
      CoupunPopup
    },
    data() {
      return {
        addressListData: [],
        rePosition: false,
        cityName: '',
        positionCityName: '',
        positionName: '',
        positionStreet: '',
        activeAddress: -1,
        showAddress: false,
        selectAddress: '',
        timeFormat,
        isProcess: false, // 接口是否处理中
        showBack: false, // 是否显示返回按钮
        loading: true, // 是否正在加载中
        isLogin: getToken() ? getToken() : false, // 判断是否登录
        // isLogin: window.isLogin,// 判断是否登录
        shoppingCarts: [], // 购物车
        copyShoppingCarts: [], // 购物车(备份，取消勾选的时候用于处理逻辑)
        allPrice: 0, // 总价格
        beforeCopunAllPrice: 0, // 优惠前的价格
        fullReductionMoney: 0, // 总的优惠金额
        totalMarketDiscount: 0, // 活动总优惠
        totalPerformanceScore: 0, // 总绩效分
        isAllCheck: false, // 购物车所有店铺的所有商品全部选中
        tabValue: 0, // 当前选中的是商城购物车还是门店购物车 0 商城购物车 1 门店购物车
        editType: false, // 编辑显示隐藏控制标签
        marketings: [], // 促销
        cartId: 0, // 当前选择的购物车id
        marketingPrice: new Map(), // 促销减去的价格
        skuType: new Array(), //  购物车中商品的类型
        show: false,
        show1: false,
        show2: false,
        nosku: [],
        id: null,

        backtopshow: false, // 回到顶部显示隐藏
        returntop: false, // 返回顶部
        sku: {
          tree: [],
          list: [],
        },
        goods_info: {
          picture: '',
        },
        typeNum: null,
        showBase: false, //sku的框的显示
        closeOnClickOverlay: true, //点击空白处关闭购物框
        initialSku: {},
        changeCartId: null, //更改规格的cartId
        performanceScore: 0,
        couponListVisible: false, // 领取优惠券弹窗显示隐藏标记
        couponList: [], //优惠券列表
        disCouponList:[], // 不可用优惠券列表
        chooseCoupon: {},
        storeId: null, //店铺id
        cartNum: 0,
        limitSkuList: [], // 超限秒杀商品集合
        limitFirstList: [], // 超限商品集合
        showLimit: false, // 展示弹窗
        inValidateList:[],
        showEmpty:false,
        showCopunPriceDetail: false,
        areasShow: false,
        areas: [], // 地区信息
        addressValue: [], // 选择省市区的值
        cartSkuId: '', // 商品详情页进去购物车页面需要选中
        integralPoint: 0, //福气值商品福气值数值
        deductionAfterPrice: 0, //福气值商品金额
      }
    },
    filters:{
      filterTime(val) {
        return val.split(` `)[0].replace(/-/g,".")
      },
      addZero(val) {
        return val < 10 ? '0' + val : val
      }
    },
    activated(){
     this.cartSkuId = localStorage.getItem('cartSkuId') || ''
     localStorage.removeItem('cartSkuId')
     this.initData() // 切换时初始化底部数据
     this.isLogin = getToken() ? true : false
     this.queryCartCount()
     this.queryCart()
     this.queryCustomerAddress()

      // 重新定位
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
        // this.calculateFreight()
      }
    },
    created() {
      // this.cartSkuId = this.$route.query.cartSkuId || ''

      this.cartSkuId = localStorage.getItem('cartSkuId') || ''
      localStorage.removeItem('cartSkuId')

      this.queryLoginStatus()
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      // 如果来自商品详情页 则显示返回按钮
      if (this.$route.query.from == 'spudetail') {
        this.showBack = false
      }
      this.queryCartCount()

      this.queryCustomerAddress()
      this.getLastAddr()

      // 查询地区信息
      this.areas.length === 0 && this.queryAllAreas()

      // 判断是否为ios11
      let u = navigator.userAgent
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
      if (isIOS) {
        if (screen.height == 812 && screen.width == 375) {
          //是iphoneX
          this.isIphoneX = true
        } else {
          //不是iphoneX
          this.isIphoneX = false
        }
      }
    },
    mounted() {
      let that = this
      setTimeout(function() {
        let data = {
          route: that.$route.path,
          routeName: '购物车',
          userId: that.$store.getters.userId,
        }
        visit(data)
      }, 2000)
      // 滚动条的获取
      window.addEventListener('scroll', that.handleScroll, true)
      that.handleScroll()
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    beforeRouteLeave(to, from, next) {
      // 记录离开时的滚动距离
      from.meta.scrollTop = document.documentElement.scrollTop
      next();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        document.documentElement.scrollTop = to.meta.scrollTop
      });
    },
    methods: {
      // 切换时候切换底部数据
      initData(){
        this.isAllCheck = false
        this.allPrice = 0
        this.fullReductionMoney = 0
        this.totalMarketDiscount = 0
      },
      // 输出符合条件的地址格式
      changeAdress(adress) {
        if(adress.includes(',')){
          let adressArr = adress.split(',')
          return adressArr.splice(1,adressArr.length).join('')
        } else {
          return adress && adress.includes('省') ? adress.split('省')[1] : adress
        }
      },
      coonfirmCoupun(params) {
        console.log(params, '优惠券弹框返回的数据')
      },
      // 查询所有的省市区
      queryAllAreas() {
        queryAllAreas().then((res) => {
          this.addressValue = []
          this.areas = res || []
          // if (this.addressValue && this.addressValue.length > 0) {
            // 计算运费
            // this.calculateFreight()
          // }
        })
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
      selectOther() {
        this.showAddress = false
        // this.areasShow = true

        //添加地址
        this.$router.push({
          path: '/customeraddressdetail',
          query: { type: '1' },
        })
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
        // this.calculateFreight()
      },
      // 查询用户地址
      async queryCustomerAddress() {
        if (getToken()) {
          await queryCustomerAddress().then((res) => {
            this.addressListData = res || []
            let num = 0
            res && res.map((item)=>{
              if (item.address == this.selectAddress){
                num++
              }
              if(item.isDefault == '1') {
                this.activeAddress = item.id
                this.selectAddress = item.address
                num++
              }
            })
            this.selectAddress = num > 0 ? this.selectAddress : ''
          })
          setTimeout(() => {
            let positionAddress = JSON.parse(localStorage.getItem('positionAddress'))
            if (positionAddress.id < 0) { this.selectAddress =  positionAddress.positionStreet }
          }, 300);
        }
      },
      toPosition() {
        this.$router.push({
          name: 'chooseMap'
        })
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
        // this.calculateFreight()
        this.showAddress = false
      },
      toSelectAddress() {
        this.showAddress = true
      },
      handleCoupon(spu, index) {
        this.storeId = spu.id
        const checked = spu.validSkus.filter(item=>{
          return item.checked
        })
        // 有选中 checked
        const finalyParams = checked.length > 0 ? checked : spu.validSkus
        const spuParams = finalyParams.map(skuItem=>{
          return {
            spuId: spu.spuId,
            skuId: skuItem.skuId,
            // num: skuItem.checked ? skuItem.num : 1,
            num: skuItem.num ,
            beforeCouponPrice: skuItem.price
          }
        })

        this.$refs.coupunPopup.setShowPopup({skuList: spuParams, sourceType: finalyParams[0].sourceType || 1 }) // sourceType 来源 1.商城 2.实体店 3.电动车

      },
      //优惠券列表
      queryCouponList(spuParams,index) {
        getUserSpuCoupons(spuParams).then((res)=>{
          const couponList = res.data.filter(item=>item.usable).map(item=>item)
          this.couponList = deepClone(couponList)
          this.disCouponList = res.data.filter(item=>!item.usable)
          this.couponListVisible = true
        }).catch(err=>{
          console.log(err)
        })
      },
      queryCartCount() {
        queryCartCount().then((res) => {
          if (res.code == 200) {
            this.typeNum = res.data
          }
        })
      },
      onemore() {
        this.show2 = false

        this.nosku = []
      },
      handleEditType() {
        this.editType = !this.editType
        if (this.editType && this.isAllCheck) {
          // 设置每个店铺和每个店铺的商品选中状态和全选的选中状态一致
          this.shoppingCarts[0].validSpus.map((store) => {
            store.checked = this.isAllCheck

            // 没有促销的商品
            store.validSkus.map((cart) => {
              if (cart.status == 0 || cart.status == 1 || this.editType) {
                cart.checked = this.isAllCheck
              }
            })
          })
        }
        if (!this.editType) {
          //设置每个店铺和每个店铺的商品选中状态和全选的选中状态一致
          this.shoppingCarts[0].validSpus.map((store) => {
            // 没有促销的商品
            store.validSkus.map((cart) => {
              if (cart.status == 2 || cart.status == 3 || this.editType) {
                cart.checked = false
              }
            })
          })
        }
        // 计算价格
        this.calculationPrice()
      },
      //左滑删除
      handleDele() {
        this.show = false
        deleteCart(this.id).then((res) => {
          if (res.code == 200) {
            this.queryCart(true)
            this.$refs.foot.queryCartCount()
          }
        })
      },
      //全选删除
      handleDeleAll() {
        let ids = this.getToDeleteIds()
        this.show1 = false
        if (this.tabValue == 0) {
          // 删除商城购物车
          deleteCart(ids.toString()).then(() => {
            this.allPrice = 0
            this.queryCart(false)
            this.$refs.foot.queryCartCount()
          })
        } else {
          // 删除门店购物车
          deleteStoreCart(ids.toString()).then(() => {
            this.allPrice = 0
            this.queryStoreShoppingCarts()

            this.showBase = false
            // this.isAllCheck = false
          })
        }
      },
      // 弹窗属性处理
      setTree(data){
          //弹窗属性
           this.sku.tree.forEach((item, index) => {
              if (index != 0) {
                item.v.forEach((temp, i) => {
                  temp.imgUrl = ''
                })
              } else {
                item.v.forEach((temp, i) => {
                  temp.imgUrl = data.images[0]
                  temp.previewImgUrl = data.images[0]
                })
              }
            })
      },
      // 属性弹框
      showAttr(sku, cartId) {
        this.changeCartId = cartId
        let data = {
          skuId: sku.skuId,
          storeId: sku.storeId,
          sourceType: sku.sourceType
        }
        querySpu(data).then((res) => {
          // console.log(res,'res------');
          if (res.flag == 1) {
            // this.sku = res.data.sku
            this.changeSkuId = sku.skuId
            this.changeStoreId = sku.storeId
            this.changeSourceType = sku.sourceType
            this.performanceScore = res.data.performanceScore
            this.sku.tree = res.data.sku.tree
            this.setTree(res.data)
            this.sku.list = res.data.list
            this.goods_info.picture = res.data.sku.tree[0].v[0].imgUrl ? res.data.sku.tree[0].v[0].imgUrl : res.data.sku.url
            this.initialSku = res.data.sku.initialSku

            this.sku.collection_id = res.data.list[0].id
            this.sku.price = res.data.sku.price.toFixed(2)

            this.integralPoint = res.data.integralPoint
            this.deductionAfterPrice = res.data.deductionAfterPrice

            // this.initialSku.selectedNum = 3
            console.log(this.sku, 'sku----sku')
            this.showBase = true
          }
        })
      },
      // 监听页面滚动
      handleScroll() {
        if (!this.$refs.boxwrapper) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.boxwrapper.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop)
        if (scorllTop > 2500) {
          this.backtopshow = true
        } else {
          this.backtopshow = false
        }
      },

      backtop() {
        if (this.backtopshow) this.returntop = true
        else this.returntop = false
      },
      deletAttr(id) {
        this.show = true
        this.id = id
      },
      //更改商品属性
      changeAttr(e) {
        let id = e.selectedSkuComb.id
        updateCartDec(this.changeCartId, id).then((res) => {
          this.queryCart(this.cartSkuId ? false : true)
          if (res.code != 200) {
            Toast(`${res.description}`)
          }
        })
        this.showBase = false
        // this.isAllCheck = false
      },
      // 查询登陆状态
      queryLoginStatus() {
        // 如果是登录 则查询购物车
        if (this.isLogin) {
          this.queryCart(false)
        }
      },

      // 查询购物车 isNeedKeepStatus表示是否需要保留购物车选中的状态
      queryCart(isNeedKeepStatus) {
        queryCart().then((res) => {
          // 老得购物车
          let oldCart = this.shoppingCarts
          const shoppingCarts = res.data.map((el,index) => {
            if(index == 0) {
              el.validSpus = el.validSpus.map((subEl) => {
                subEl.validSkus = subEl.validSkus.map(sku=>{
                  sku.oldNum = sku.num
                  return sku
                })
                subEl.couponLabelList = subEl.couponLabelList.map(tag=>{
                  return {
                    ...tag,
                    text: tag.couponsType == 3?`立减￥${tag.faceValue}` : tag.couponsType == 2 ?`${tag.faceValue}折` : `满￥${tag.amountLimitation}减￥${tag.faceValue}`
                  }
                })
                // 查询购物车列表手动添加storeId字段用于勾选时的判断
                subEl.storeId = subEl.validSkus[0].storeId
                return subEl
              }).filter(item=>item != undefined)
              return el
            }
          }).filter(item=>item != undefined)
          this.shoppingCarts = deepClone(shoppingCarts)

          if(this.cartSkuId && this.shoppingCarts && this.shoppingCarts.length>0){
            // this.$nextTick(()=>{
			isNeedKeepStatus= true
              let isTrue = false
              let arr = []
              this.shoppingCarts[0].validSpus.forEach(item=>{
                let isOnly = item.validSkus.some((cart) => {
                  return cart.skuId == this.cartSkuId
                })
                item.validSkus.forEach((cart) => {
                  if(isOnly){
                    arr = item.validSkus
                    item.checked = true
                    cart.checked = true
                    isTrue = true
                  } else {
                    isTrue = false
                    item.checked = false
                    cart.checked = false
                  }
                })
                // item.validSkus.forEach((cart) => {
                //   if (cart.skuId == this.cartSkuId) {
                //     arr = item.validSkus
                //     item.checked = true
                //     cart.checked = true
                //     isTrue = true
                //   }else {
                //     isTrue = false
                //     item.checked = false
                //     cart.checked = false
                //   }
                // })
                arr.forEach(cart=>{
                  cart.checked = true
                })
              })
              if(this.shoppingCarts[0].validSpus.length==1 && isTrue){
                this.isAllCheck = true
              } else {
                this.isAllCheck = false
              }

          }

          this.copyShoppingCarts = deepClone(shoppingCarts)
          this.inValidateList = res.data.length >0 ? res.data[0].invalidSkus :[]

          this.loading = false
          // 如果需要保留购物车选中的状态
          if (isNeedKeepStatus) {
            // 设置购物车的选中状态
			if(!this.cartSkuId){
				this.setOldData(oldCart, this.shoppingCarts)
			}
            // 计算价格
            this.calculationPrice()
          } else {
            this.cartNum = 0
          }
        })
      },
      // 设置购物车的选中状态
      setOldData(oldData, newData) {
        const storeIds = this.getChoosedStore(oldData)
        const skuIds = this.getChoosedSku(oldData)
        newData[0].validSpus.forEach((store) => {
          if (storeIds && storeIds.indexOf(store.spuId) != -1) {
            store.checked = true
          }
          // if(this.cartSkuId && store.skuId == this.cartSkuId){
          //   store.checked = true
          // }

          if (skuIds) {
            store.validSkus.forEach((cart) => {
              if (skuIds.indexOf(cart.skuId) != -1 || store.checked) {
                cart.checked = true
              }
            })

            store.marketings && store.marketings.forEach((market) => {
              market.skus.forEach((cart) => {
                if (skuIds.indexOf(cart.skuId) != -1) {
                  cart.checked = true
                }
              })
            })
          }
        })
      },
      // 获得店铺的选中状态
      getChoosedStore(oldData) {
        const ids = new Array()
        oldData[0].validSpus.forEach((store) => {
          if (store.checked) {
            ids.push(store.spuId)
          }
        })

        return ids
      },
      // 获得商品的选中状态
      getChoosedSku(oldData) {
        const ids = new Array()
        oldData[0].validSpus.forEach((store) => {
          store.validSkus.forEach((cart) => {
            if (cart.checked) {
              ids.push(cart.skuId)
              console.log(cart.name)
            }
          })

          store.marketings && store.marketings.forEach((market) => {
            market.skus.forEach((cart) => {
              if (cart.checked) {
                ids.push(cart.skuId)
              }
            })
          })
        })

        return ids
      },
      // 跳转到首页
      toIndex() {
        this.$router.push({ path: '/' })
      },
      // 跳转到登录页面
      toLogin() {
        let that = this
        if (Cookies.get('_wsf_role') == 1) {
          that.$store.commit('SET_REGISTRATIONPROTOCOL', true)
          return
        }
        that.$router.push({ path: '/login', query: { url: '/cart' } })
      },
      // 点击单品
      clickSku(sku) {
        sku.checked = !sku.checked

        // 如果不是选中 则把全选去除
        if (!sku.checked) {
          this.isAllCheck = false
        }

        // 设置店铺全选
        this.setStoreCheckAllValue(sku)
        // 设置购物车全选
        this.setCheckAllValue()
        // 计算价格
        this.calculationPrice()
      },
      // 点击店铺全选
      clickStore(shoppingCart) {
        shoppingCart.checked = !shoppingCart.checked
        // 如果不是选中 则把全选去除
        if (!shoppingCart.checked) {
          this.isAllCheck = false
        }

        // 设置购物车的选中状态
        this.shoppingCarts[0].validSpus.map((spu) => {
            // 因不同商家会有相同的spuId，所以此处判断加上storeId
          if (spu.spuId === shoppingCart.spuId && spu.storeId === shoppingCart.storeId) {
            // 全选的勾选框
            spu.checked = shoppingCart.checked
            // 没有促销的商品
            spu.validSkus.map((cart) => {
              if (cart.status == 0 || this.editType) {
                // 单个商品的勾选框
                cart.checked = shoppingCart.checked
              }
            })

            // 有促销的商品
            spu.marketings && spu.marketings.map((market) => {
              market.skus.map((cart) => {
                cart.checked = shoppingCart.checked
              })
            })
          }
        })

        // 设置购物车全选
        this.setCheckAllValue()
        // 计算价格
        this.calculationPrice()
      },
      // 点击全选
      clickChooseAll() {
        this.isAllCheck = !this.isAllCheck
        // 设置每个店铺和每个店铺的商品选中状态和全选的选中状态一致
        this.shoppingCarts[0].validSpus.map((spu) => {
          spu.checked = this.isAllCheck
          // 没有促销的商品
          spu.validSkus.map((cart) => {
            if (cart.status == 0 || this.editType) {
              cart.checked = this.isAllCheck
            }
            // cart.checked = this.isAllCheck
          })
          // 有促销的商品
          spu.marketings && spu.marketings.map((market) => {
            market.skus.map((cart) => {
              cart.checked = this.isAllCheck
            })
          })
        })
        // 计算价格
        this.calculationPrice()
      },
      // 设置店铺全选
      setStoreCheckAllValue(sku) {
        this.shoppingCarts[0].validSpus.map((spu) => {
          // 没有促销的商品
          let spuChecked = true
          spu.validSkus.map((cart) => {
            if(cart.skuId == sku.skuId) {
              if (!sku.checked) {
                spu.checked = false
              }
            }
            if(!cart.checked) {
              spuChecked = false
            }
          })
          spu.checked = spuChecked
        })
      },
      // 设置购物车所有店铺的全选
      setCheckAllValue() {
        let checkedAll = true
        this.shoppingCarts[0].validSpus.forEach((spu) => {
          if (!spu.checked) {
            checkedAll = false
          }
        })
        this.isAllCheck = checkedAll
      },
      // 更新购物车数量
      min(val) {},
      async updateShoppingCartNum(sku) {
        console.log(sku,'sku')
        if (sku.stock == 0 || sku.status == 2 || sku.status == 3) return
        if (sku.isBatchSku === '1' && sku.num < sku.limitBatchNum) {
          // 如果是起批商品 起批数量少于最低起批量 则直接返回
          sku.num = sku.limitBatchNum
          this.$vux.toast.text('必须购买最低起批量!', 'middle')
          return
        }
        // 首单活动加购校验
        if (sku.marketingVos && this.checkSkuIsFirstOrder(sku)) {
          let reqData = {
            isIgnoreCartNum: true,
            buyNowRequestList: [
              {
                skuId: sku.skuId,
                num: sku.num,
              },
            ],
          }
          let res = await this.checkLimit(reqData)
          if (res.data && res.data.limitNum) {
            if (res.data.hasBoughtNum) {
              // sku.num = sku.oldNum
              sku.num = res.data.limitNum - res.data.hasBoughtNum
              Toast({
                message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
              })
            } else {
              sku.num = res.data.limitNum
              Toast({
                message: `抱歉，该商品限购${res.data.limitNum}件`,
              })
            }
            return
          }
        }
        // 库存不足
        if (sku.num > sku.stock) {
          // 只有当新增的时候超过库存把当前的数量改成最多库存数量其他时候不管（有可能已经超过库存进行增减）
          // if (sku.num - sku.stock == 1) {
          this.$nextTick(()=> {
            sku.num = sku.stock
          })
          Toast({
            message: '商品库存不足',
          })
          return
          // }
        }
        // 抢购的时候限购
        if (sku.limitStock != -2 && sku.limitStock <= sku.num) {
          sku.num = sku.limitStock
          return
        }

        //设置商品起批的价格
        this.shoppingCarts[0].validSpus.map((store) => {
          // 没有促销的商品
          store.validSkus.map((cart) => {
            if (cart.cartId === sku.cartId) {
              cart.num = sku.num
              this.setBatchPrice(cart)
            }
          })

          // 有促销的商品
          store.marketings && store.marketings.map((mark) => {
            mark.skus.map((cart) => {
              if (cart.cartId === sku.cartId) {
                cart.num = sku.num
                this.setBatchPrice(cart)
              }
            })
          })
        })

		this.calculationPrice()

        let param = {
          id: sku.cartId,
          num: sku.num,
        }
        // 请求前校验
        if (sku.marketingVos && this.checkSkuIsSeckill(sku)) {
          let reqData = {
            isIgnoreCartNum: true,
            buyNowRequestList: [
              {
                skuId: sku.skuId,
                num: sku.num,
              },
            ],
          }
          let res = await this.checkLimit(reqData)
          if (res.data && res.data.limitNum) {
            if (res.data.hasBoughtNum) {
              // sku.num = sku.oldNum
              sku.num = res.data.limitNum - res.data.hasBoughtNum
              Toast({
                message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
              })
            } else {
              sku.num = res.data.limitNum
              Toast({
                message: `抱歉，该商品限购${res.data.limitNum}件`,
              })
            }
            return
          }
        }
        if (this.isProcess) {
          return
        }
        this.isProcess = true
        // 商城购物车
        updateShoppingCartNum(param).then((res) => {
          this.isProcess = false
          if (res.code == 200) {
            this.$storage.removeItem(sku.spuId) // 清除分销码信息
          } else {
            Toast(res.description)
            this.queryCart()
          }
        })
      },
      // 设置起批价格
      setBatchPrice(cart) {
        if (cart.isBatchSku == '1' && !!cart.skuBatchList) {
          for (let i = 0; i < cart.skuBatchList.length; i++) {
            if (cart.num < cart.skuBatchList[i].batchNum) {
              break
            }
            cart.price = cart.skuBatchList[i].batchPrice
          }
        }
      },
      // 删除购物车
      toDeleteCart() {
        let ids = this.getToDeleteIds()
        if (ids.length == 0) {
          Toast('你还没选择商品哦')
          return
        }
        this.show1 = true
      },
      /**
       * 获得要删除的购物车id
       */
      getToDeleteIds() {
        const ids = new Array()

        this.shoppingCarts[0].validSpus.forEach((store) => {
          // 没有促销的
          store.validSkus.forEach((cart) => {
            if (cart.checked) {
              ids.push(cart.cartId)
            }
          })

          // 有促销的
          store.marketings && store.marketings.forEach((market) => {
            market.skus.forEach((cart) => {
              if (cart.checked) {
                ids.push(cart.cartId)
              }
            })
          })
        })

        return ids
      },
      chooseCopun(item, index) {
        this.couponList.forEach((ele, i)=>{
          if(index == i) {
            if(!item.selected) {
              this.chooseCoupon = item
            } else {
              this.chooseCoupon = {}
            }
            item.selected = !item.selected
          } else {
            ele.selected = false
          }
        })

      },
      //计算价格
      calculationPrice() {
        // 选择的数量
        let chooseSum = 0
        // 总价格(减去优惠后的价格)
        let totalPrice = 0

        let numbers = 0
        let checkedSkuList = []
        this.shoppingCarts[0].validSpus.forEach((spu) => {
          spu.validSkus.forEach((cart) => {
            // 选中则将选中的数量加上
            if (cart.checked) {
              chooseSum = chooseSum + cart.num
              totalPrice = totalPrice + cart.num * cart.price
              numbers += 1
            }
            checkedSkuList.push({
                spuId: cart.spuId,
                skuId: cart.skuId,
                oldPrice: cart.oldPrice,
                num: cart.num || 1,
                checked: cart.checked,
                thirdCateId: cart.thirdCateId,
                sourceType: cart.sourceType,
                storeId:cart.storeId
              })
          })
        })
        this.cartNum = numbers
        cartSummary(checkedSkuList).then(res=>{
          let { totalMarketDiscount, totalPerformanceScore } = res.data
          this.beforeCopunAllPrice = res.data.totalOldPrice
          this.fullReductionMoney = res.data.totalCouponDiscount
          this.allPrice = res.data.totalPrice || 0
          this.totalMarketDiscount = totalMarketDiscount
          this.totalPerformanceScore = totalPerformanceScore
          res.data.spuSummaryList.forEach(item=>{
            this.shoppingCarts[0].validSpus.forEach((spu, spuIndex)=>{
              if(item.spuId == spu.spuId) {
                spu.couponLabelList = item.couponLabelList.map(tag=>{
                  return {
                    ...tag,
                    haveCoupon: item.haveCoupon,
                    text: tag.couponsType == 3?`立减￥${tag.faceValue}` : tag.couponsType == 2 ?`${tag.faceValue}折` : `满￥${tag.amountLimitation}减￥${tag.faceValue}`
                  }
                })
                spu.validSkus.forEach((sku,skuIndex)=>{
                  item.discountInfoList.forEach(disSku=>{
                    // 因不同商家会有相同的skuId，所以此处判断加上用storeId
                    if(sku.storeId == disSku.storeId && sku.skuId == disSku.skuId && (sku.sourceType == disSku.sourceType)) {
                      sku.afterCouponPrice = disSku.afterCouponPrice
                    }
                  })
                })
              }
            })
          })
        }).catch(err=>{})

      },
      // 跳转到结算页面
      async toSettement() {

        // 获得选中的购物车
        const ids = this.getChoosedShoppingCart()
        if (ids.length == 0) {
          this.$vux.toast.text('请选择商品!', 'middle')
          return
        }
        // 校验秒杀、首单活动商品
        let reqData = {
          ids: ids,
        }
        let hasLimit = await this.checkLimitSettlement(reqData)
        if (hasLimit.data.panicBuyLimitList && hasLimit.data.specialAreaLimitList) {
          this.showLimit = true
          this.limitSkuList = hasLimit.data.panicBuyLimitList
          this.limitFirstList = hasLimit.data.specialAreaLimitList
          return
        }
        if (hasLimit.data.panicBuyLimitList && hasLimit.data.panicBuyLimitList.length) {
          this.showLimit = true
          this.limitSkuList = hasLimit.data.panicBuyLimitList
          this.limitFirstList = []
          return
        }
        if (hasLimit.data.specialAreaLimitList && hasLimit.data.specialAreaLimitList.length) {
          this.showLimit = true
          this.limitFirstList = hasLimit.data.specialAreaLimitList
          this.limitSkuList = []
          return
        }
        //校验库存
        if (!this.validateSkum()) {
          return
        }

        // 实体和虚拟商品不能一起结算
        if (!this.isCanSettlement()) {
          this.$vux.toast.text('实体商品和虚拟商品不能同时!', 'middle')
          return
        }

        // 商城结算
        if (this.tabValue == 0) {
          this.$router.push({
            path: '/settlement',
            query: { params: JSON.stringify({ ids: ids, addressId: 0, skuInfo: '', isGroup: 0, groupId: 0 }) },
          })
        } else {
          // 门店结算
          this.$router.push({
            path: '/storesettlement',
            query: { ids: ids.toString() },
          })
        }
      },
      //获得选中的购物车的id
      getChoosedShoppingCart() {
        this.skuType = new Array()
        const ids = new Array()
        this.shoppingCarts[0].validSpus.forEach((store) => {
          store.validSkus.forEach((cart) => {
            if (cart.checked) {
              ids.push(cart.cartId)
              this.skuType.push(cart.isVirtual)
            }
          })

          store.marketings && store.marketings.forEach((market) => {
            market.skus.forEach((cart) => {
              if (cart.checked) {
                ids.push(cart.cartId)
                this.skuType.push(cart.isVirtual)
              }
            })
          })
        })
        return ids
      },
      // 校验商品是否有库存
      validateSkum() {
        let validate = true
        let message = ''
        this.shoppingCarts[0].validSpus.forEach((store) => {
          store.validSkus.forEach((cart) => {
            if (cart.checked) {
              if (cart.stock == 0) {
                validate = false
                this.nosku.push(cart.name)
                this.show2 = true
              } else if (cart.num > cart.stock) {
                validate = false
                message = `购物车有库存不足商品`
                this.$vux.toast.text(message, 'middle')
              } else if (cart.limitStock != -2 && cart.num > cart.limitStock) {
                validate = false
                message = '购物车有限购数量商品'
                this.$vux.toast.text(message, 'middle')
              }
            }
          })

          store.marketings && store.marketings.forEach((market) => {
            market.skus.forEach((cart) => {
              if (cart.checked) {
                if (cart.stock == 0) {
                  validate = false
                  message = '购物车有无货商品'
                } else if (cart.num > cart.stock) {
                  validate = false
                  message = '购物车有库存不足商品'
                } else if (cart.limitStock != -2 && cart.num > cart.limitStock) {
                  validate = false
                  message = '购物车有限购数量商品'
                }
              }
            })
          })
        })

        return validate
      },
      // 判断是否可以结算 如果结算的商品中有实体和虚拟的 那不能结算
      isCanSettlement() {
        return !(this.skuType.filter((x) => x == '0').length != 0 && this.skuType.filter((x) => x == '1').length != 0)
      },
      // 跳转到商品详情
      toSpuDetail(item) {
        this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
      },
      // 切换购物车
      changeCart() {
        this.isAllCheck = false
        this.loading = true
        this.allPrice = 0
        this.fullReductionMoney = 0
        this.cartId = 0
        this.marketingPrice = new Map()
        this.skuType = new Array()
        this.editType = false

        // 商城购物车
        if (this.tabValue == 0) {
          this.queryCart(false)
        } else {
          // 门店购物车
          this.queryStoreShoppingCarts()
        }
      },
      // 查询门店购物车
      queryStoreShoppingCarts() {
        queryStoreShoppingCarts().then((res) => {
          this.shoppingCarts = res
           if(this.shoppingCarts && this.shoppingCarts.length>0 && this.cartSkuId){
            let isTrue = false
            let arr = []
            this.shoppingCarts[0].validSpus.forEach(item=>{
              item.validSkus.forEach((cart) => {
                if (cart.skuId == this.cartSkuId) {
                  arr = item.validSkus
                  item.checked = true
                  isTrue = true
                }
              })
              arr.forEach(cart=>{
                cart.checked = true
              })
            })
            console.log(this.shoppingCarts[0].validSpus,'wwwwwwwwwwww2');
            if(this.shoppingCarts[0].validSpus.length==1 && isTrue){
              this.isAllCheck = true
            }
          }
          this.loading = false
        })
      },
      filterGiftSku(giftskus, price) {
        console.log('giftskus', giftskus)
        console.log('price', price)
        let tempArr = giftskus.filter((e) => {
          return price >= e.fullPrice
        })
        return tempArr.length > 0 ? tempArr[0].giftSkuInfos : []
      },
      // 检查数据
      checkLimit(reqData) {
        return checkSkuPanicBuyLimitNum(reqData).then((res) => {
          return res
        })
      },
      // 检查数据
      checkLimitSettlement(reqData) {
        return checkLimitNumBeforeSettlement(reqData).then((res) => {
          return res
        })
      },
      // 检查该sku是否为秒杀商品活动且正在秒杀活动时间段
      checkSkuIsSeckill(sku) {
        if (!sku.marketingVos) return false
        let isSeckillSkuIdx = sku.marketingVos.findIndex((el) => {
          // 兼容ios
          el.startTime = el.startTime.replace(/-/g, '/')
          el.countTime = new Date().getTime() - new Date(el.startTime).getTime()
          return el.type == 13 && el.countTime >= 0 && el.countTime <= 3600000
        })
        return isSeckillSkuIdx >= 0
      },
      // 检查该sku是否为 首单 商品活动
      checkSkuIsFirstOrder(sku) {
        if (!sku.marketingVos) return false
        let isFirst = sku.marketingVos.map((item) => item.type).includes('16')
        return isFirst
      },
      // 计算倒计时
      getCountDownTime(sku) {
        sku.startTime = sku.startTime.replace(/-/g, '/')
        let countTime = new Date(sku.startTime).getTime() - new Date().getTime()
        sku.countDownTime = countTime > 0 ? countTime : countTime + 3600000
        sku.isStart = countTime > 0 ? 0 : 1
        console.log('sku: ', sku)
        return sku.countDownTime
      },
      skuPriceInt(data, name) {
        console.log(data, 's----s')
        // return
        let price = 0
        if (data) {
          price = data.toString()
          sessionStorage.setItem('skuPrice', price)
        } else {
          price = sessionStorage.getItem('skuPrice')
          if (!price) {
            return
          }
        }
        console.log(price, 'price----price')
        if (name == 'sku') {
          price = price.toFixed(2).split('.')[0]
        } else if (name == 'spec') {
          price = price.split('.')[0]
        }

        return price
      },
      skuPriceFloat(data, name) {
        let price = '00'
        if (data) {
          price = data.toString()
          sessionStorage.setItem('skuPrice_r', price)
        } else {
          price = sessionStorage.getItem('skuPrice_r')
          if (!price) {
            return
          }
        }
        if (name == 'sku') {
          price = price.toFixed(2).split('.')[1]
        } else if (name == 'spec') {
          price = price.split('.')[1]
        }
        return price
      },
      skuSelected(data) {
        console.log(data, 'data--------')
        if(data.selectedSkuComb && data.selectedSkuComb.id && this.changeSkuId != data.selectedSkuComb.id) {
          let params = {
            skuId: data.selectedSkuComb.id,
            storeId: this.storeId,
            sourceType: this.sourceType
          }
          querySpu(params).then((res) => {
            console.log(res,'res------');
            if (res.flag == 1) {
              // this.sku = res.data.sku
              this.changeSkuId = data.selectedSkuComb.id
              this.performanceScore = res.data.performanceScore
              this.integralPoint = res.data.integralPoint
              this.deductionAfterPrice = res.data.deductionAfterPrice
              this.setTree(res.data)
            }
          })
        }

      },
      // 清空失效商品时的二次确认框
      clearGoods() {
        this.showEmpty = true
      },
      // 获取一键清空的数据
      getClearGoods() {
        const ids = new Array()
        this.inValidateList.forEach((itemSku,indexSku)=>{
          if(itemSku.status != 0) {
            ids.push(itemSku.cartId)
          }
        })
        return ids
      },
      // 确认清空失效商品
      confirmEmpty() {
        let ids = this.getClearGoods()
        if (this.tabValue == 0) {
          // 删除商城购物车
          deleteCart(ids.toString()).then(() => {
            this.allPrice = 0
            this.queryCart(false)
            this.$refs.foot.queryCartCount()
          })
        } else {
          // 删除门店购物车
          deleteStoreCart(ids.toString()).then(() => {
            this.allPrice = 0
            this.queryStoreShoppingCarts()
            this.showBase = false
          })
        }
        this.showEmpty = false
      },
      // 取消清空 - 不清空
      cancelEmpty() {
        this.showEmpty = false
      }
    },

    watch: {
      backtopshow(value) {
        if (!value) this.returntop = false
      },
      shoppingCarts: {
        handler(newVal, oldvalue) {
          newVal.forEach((item) => {
            item.validSkus.forEach((sItem) => {
              if (sItem.marketingVos) {
                sItem.marketingVos.forEach((cItem) => {
                  if (cItem.type == 16) {
                    sItem['avtivityLabel'] = cItem.marketingAttr.label || ''
                  }
                })
              }
            })
          })
        },
        // immediate: true,
        deep: true,
      },
      showBase(val) {
        console.log(val, 'showBase')
        if (!val) {
          sessionStorage.removeItem('skuPrice')
          sessionStorage.removeItem('skuPrice_r')
        }
      },
    },
    computed: {
        ...mapGetters(['phoneType']),
       footRefHeight() {
        let height = this.phoneType==='IOS'? 80: 50
        if (this.$refs.foot && this.$refs.foot.$el.firstChild.offsetHeight) {
          height = this.$refs.foot.$el.firstChild.offsetHeight
        }
        return height
      },
      registrationProtocolIsShow() {
        return this.$store.getters.getRegistrationProtocol
      },
      //显示库存警告
      showStockWarning() {
        return (sku) => {
          // 没有库存
          if (sku.stock == 0) {
            return '无货'
          } else if (sku.num > sku.stock) {
            return '库存不足'
          } else if (sku.stock <= 10) {
            // 存在限购
            if (sku.limitStock != -2) {
              return '限购' + sku.limitStock + '件'
            } else {
              return '仅剩' + sku.stock + '件'
            }
          } else {
            // 存在限购商品
            if (sku.limitStock != -2) {
              return '限购' + sku.limitStock + '件'
            } else {
              return ''
            }
          }
        }
      },
      performanceScoreTotal() {
        let list = this.shoppingCarts
        if (!list || list.length < 1) {
          return 0
        } else {
          let score = 0
          list.forEach((item) => {
            item.validSkus.forEach((n) => {
              if (n.checked == true && n.performanceScore && n.performanceScore > 0) {
                score += n.performanceScore * n.num
              }
            })
          })
          return score
        }
      },
      safeArea() {
        let ua = navigator.userAgent.toLowerCase() //获取判断用的对象
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          //在微信中打开
          return true
        }
        return false
      },
    },
  }
</script>
<style lang="less" scoped>
.listContent{
  overflow: hidden;
  background-color:#f6f6f6 ;
  padding-bottom: 20px;
}
  .boxWrapper{
    /deep/ .van-dialog__footer{
      display: none;
    }
    /deep/ .van-button__text{
      border:unset;
      padding:unset;
    }
  }
  /deep/.dialog {
    padding: 0.9rem 0rem 1.2rem !important;
  }
  .activity-type {
    margin-right: 0.32rem;
    color: #ffffff;
    text-align: center;
    font-size: 0.48rem;
    transform: scale(0.833);
    padding: 0rem 0.12rem;
    border-radius: 0.08rem;
    background: -webkit-linear-gradient(left, #fe5229, #ff8b40);
  }
  .buygivebox {
    padding: 0rem 0.12rem;
    color: #e60113;
    position: relative;
    display: inline-block;
    font-size: 0.48rem;
    transform: scale(0.833);
    box-sizing: content-box;
    line-height: 0.78rem;
    height: 0.68rem;
    margin: 0.12rem 0.16rem 0.2rem -0.08rem;
  }

  .buygivebox::after {
    // top: -51%;
    border-radius: 0.12rem;
    border: 1px solid #e60113;
  }

  .xq_wntj {
    background-color: #f6f6f6;
    padding: 0 0.48rem 110px;

    /deep/ .guess-warp .guess-title {
      font-family: PingFangSC-Medium, PingFang SC;
      text-align: center;
      font-weight: bold;
      font-size: 0.64rem;
      height: 18px;
      line-height: 18px;
      box-sizing: content-box;
    }
  }

  .van-icon {
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
  }

  .count_choose {
    height: 22px;
    // border: 1px solid #eeeeee;
    // border-radius: 11px;
    /deep/ .van-stepper__minus,
    /deep/ .van-stepper__plus {
      background: none;
      width: 20px;
      height: 20px;
    }

    /deep/ .van-stepper__input {
      min-width: 22px;
      font-size: 13px;
      line-height: 22px;
      height: 22px;
      color: #191919;
      font-weight: bold;
      // border-left: 1px solid #eee;
      // border-right: 1px solid #eee;
      // background: #fff;
      margin: 0;
      padding: 0 4px;
      background: #F6F6F6;
      border-radius: 4px;
    }

    /deep/ .van-stepper__minus::before,
    /deep/ .van-stepper__plus::before {
      width: 8px;
      height: 2px;
    }

    /deep/ .van-stepper__minus::after,
    /deep/ .van-stepper__plus::after {
      width: 2px;
      height: 8px;
    }

    /deep/ .van-stepper__minus--disabled {
      color: #C3C3C3;
    }
  }

  .btns {
    /deep/ .delet-btn {
      min-width: 82px;
      height: 30px;
      border-radius: 19px;
      margin: 10px 16px 10px 0;
    }
  }

  .deletDialog {
    background: #000 !important;

    /deep/ .van-dialog__content {
      background: #000 !important;
    }
  }

  //商品置灰
  .skudisabled {
    color: #bababa !important;

    .image {
      opacity: 0.3;
    }

    .cartGoodsBtn {
      color: #C3C3C3 !important;
    }

    /deep/ .van-stepper__minus,
    /deep/ .van-stepper__input,
    /deep/ .van-stepper__plus {
      color: #bababa;
    }
  }

  .cartGoodsBtn {
    color: #999 !important;
    margin-top: 2px;
    padding-right: 24px !important;
    padding-left: 8px;
    position: relative;

    .van-icon {
      position: absolute;
      top: 4px;
      right: 10px;
      &::before {
        display: inline-block;
        width: 10px;
        height: 6px;
        content: '';
        background: url(~@/assets/img/icon_more.png) no-repeat;
        background-size: 10px;
      }
    }
  }

  .van-sku-actions .van-button--danger {
    background: #e60113;
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

  .van-dialog.deletDialog {
    background: #000;
  }

  .backtopactive {
    position: fixed;
    top: 0;
  }

  .deletDialog {
    /deep/ .van-dialog__message {
      background: #000 !important;
    }

    /deep/ .van-dialog__message {
      background: #000 !important;
    }
  }

  .delet-dialog {
    width: 316px;
    min-height: 155px;

    p {
      text-align: center;
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      font-weight: 500;
      padding-top: 45px;
      box-sizing: content-box;
    }

    .onemore {
      text-align: left;
    }

    .onemore-box {
      max-height: 500px;
      overflow: scroll;
      padding: 45px 30px 0;
    }

    .btn-box,
    .btn-box1 {
      padding: 30px 39px;
      display: flex;
      justify-content: space-between;

      .van-button {
        border-radius: 15px;
        width: 104px;
        height: 30px;
        font-size: 12px;
      }

      .cancle {
        border: 1px solid #e60113;
        color: #e60113;
      }
    }

    .btn-box1 {
      display: flex;
      justify-content: center;
    }
  }

  .sku-box {
    /deep/.van-sku-row__item-img{
        display: none;
    }
    /deep/ .van-sku__goods-price {
      display: flex;
      align-items: center;
      height: 28px;
      .van-sku__price-num {
        display: inline-flex;
        font-size: 25px;
        line-height: 28px;
        .float {
          font-size: 18px;
          margin-top: 2px;
        }
      }
    }

    /deep/ .van-sku-header-item {
      margin-top: 0;
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

    /deep/ .van-hairline--bottom::after {
      border-bottom-width: 0px;
    }
    .fqz-price{
        color: #FE3040;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        line-height: 20px;
      .special{
        font-size: 30px;
        font-family: DINAlternate, DINAlternate;
        font-weight: bold;
        line-height: 34px;
      }
    }
  }

  .couponlist {
    .coupon-hint {
      line-height: 19px;
      margin-top: 20px;
      text-align: center;
      color: #999;
      font-size: 13px;
      .markedness {
        color: #e71021;
      }
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
      position: relative;
      .top-round-corner {
        background-color: #fff;
        position: absolute;
        top: -8px;
        right: 96px;
        transform: translate(50%, 0);
        height: 14px;
        width: 14px;
        border-radius: 0 0 50% 50%;
        z-index: 2;
      }
      .bottom-round-corner {
        background-color: #fff;
        position: absolute;
        bottom: -8px;
        right: 96px;
        transform: translate(50%, 0);
        height: 14px;
        width: 14px;
        border-radius: 50% 50% 0 0;
        z-index: 2;
      }
      .main-ticket {
        width: 251px;
        position: relative;
        padding: 26px 0 10px 18px;
        .coupon-detail {
          display: inline-flex;
          align-items: center;
          height: 38px;
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
        border-left: 1px dashed #faccd0;
        width: 100px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .stub-mark {
          width: 52px;
          height: 50px;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 1;
        }
        .platform-btn {
          background: #e60113;
        }
        .store-btn {
          background: #fe8c02;
        }
        .get-coupon-button {
          width: 76px;
          height: 30px;
          border-radius: 15px;
          line-height: 30px;
          text-align: center;
          font-size: 12px;
          color: #fff;
          z-index: 2;
        }
      }
    }
  }

  .couponlist {
    .couponbox-left {
      width: 247px;
      display: inline-block;
      height: 86px;
      padding: 16px 0 16px 12px;
    }

    .couponbox-right {
      display: inline-block;
      width: 94px;
      height: 86px;

      .couponbox-right-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .nolingqu {
          width: 60px;
          height: 24px;
          background: #e60113;
          border-radius: 14px;
          line-height: 24px;
          color: #ffffff;
          text-align: center;
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

  .fixBar {
    display: flex;
    align-items: center;
    height: 60px;
    .select-all-btn {
      position: relative;
      margin-right: 8px;
      font-size: 13px;
      color: #191919;
      font-weight: 400;
      &.icon_select {
        position: relative;
      }
    }
    .left {
      // display: flex;
      // flex-direction: column;
      display: flex;
      flex: 1;
      flex-direction: column;
      font-display: swap;
      justify-content: center;
      position: relative;
      text-align: right;
      padding-right: 4px;
      .up {
        color: #191919;
        // padding-top: 10px;
        font-weight: bold;
        // text-align: left;
        font-size: 15px;
        // margin-left: 0;
        // display: flex;
        // justify-content: flex-start;
        span{
          font-size: 13px;
          font-weight: 500;
        }
      }
      .special-total {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          font-size: 11px;
          color: #FF0A35;
          font-weight: 400;
        }
        >img {
          width: 16px;
          height: 16px;
          margin-left: 2px;
        }
      }
    }

  }
  .threeHorizontal {
    // height: 80px;
  }
  .fixBar .total {
    position: static;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .flex-box {
    display: flex;
  }
  .flex-box-between{
    padding: 10px 0;
    justify-content: space-between;
  }

  .fixBar .total .buy {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
    background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
    font-size: 16px;
    font-weight: 500;
    width: 130px;
    height: 40px;
    em {
      font-size: 16px;
    }
  }

  .fixBar .icon_select:after {
    left: 21px;
  }

  .fixBar .icon_select {
    padding-top: 15px;
  }

  // 秒杀标签
  .seckill-shops {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .seckill-count-down {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 0.4rem;
      line-height: 0.64rem;
      color: #000;

      & /deep/ .van-count-down {
        line-height: 0.64rem;
      }

      .block {
        height: 0.64rem;
        font-size: 0.4rem;
        line-height: 0.64rem;
        color: #000;
      }

      .start {
        color: #e60113;
      }
    }

    .start {
      color: #e60113;
    }
  }
  .limit-skus-list {
    max-height: 10.4rem;
    margin-top: 1.2rem;
    box-sizing: content-box;
    overflow: auto;
    .limit-skus {
      padding: 0 1.12rem;
    }
    .limit-item::after {
      content: '';
      height: 0.4rem;
      background-color: #f2f2f2;
      width: 100%;
      display: inline-block;
      margin-bottom: 18px;
    }
    .limit-item:last-child::after {
      display: none;
    }
  }
  .limit-skus {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    .limit-sku-image {
      width: 2.4rem;
      height: 2.4rem;
      margin-right: 0.4rem;
      background: #ffffff;
      border-radius: 0.2rem;
      border: 0.04rem solid #eeeeee;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .limit-sku-info {
      height: 2.4rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .limit-sku-name {
        font-size: 0.48rem;
        font-weight: 400;
        color: #666666;
        line-height: 0.64rem;
      }
      .limit-sku-num {
        font-size: 0.48rem;
        font-weight: 400;
        color: #e60113;
        line-height: 0.64rem;
      }
    }
  }
  .performance-part {
    display: inline-block;
    margin-top: 8px;
    margin-bottom: 4px;
    padding-right: 3px;
    height: 22px;
    background: #fcf0f2;
    border-radius: 11px;
    line-height: 22px;
    padding: 0 10px;
    font-size: 13px;
    color: #e60113;
  }
  .performate-point {
    margin-top: 8px;
    display: inline-block;
    border-radius: 4px;
    background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
    font-size: 11px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #008864;
    line-height: 14px;
    .performate-point-label {
      background: url(~@/assets/img/jixiao.png) left center no-repeat;
      padding-left: 14px;
      background-size: 14px;
    }
    .performate-point-num {
      font-size: 10px;
      font-family: ArialMT;
    }
  }
  .performate-point-sku {
    margin: 7px auto;
    margin-left: 0;
    margin-top: 8px;
  }
  .afterCouponPrice {
    margin-top: 1px;
    color: #FF0A35;
    font-size: 11px;
    font-weight: 600;
    line-height: 15px;
    .price-yuan {
      font-size: 13px;
      font-weight: bold;
      line-height: 17px;
    }
    .price-fen {
      font-size: 13px;
      font-weight: bold;
      line-height: 15px;
    }
    // span {
    //   vertical-align: text-bottom;
    //   line-height: 17px;
    //   font-size: 13px;
    //   font-weight: 600;
    // }
  }
  .coupon-button {
    width: 32px;
    height: 16px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/img/activity/coupon01@2x.png');
    background-repeat: no-repeat;
    background-size: 100%;
    color: #e60113;
    font-size: 10px;
  }
  .goods .goods_price {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .price {
      font-size: 12px;
      color: #191919;
      font-weight: bold;
      .price-yuan {
        font-size: 16px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        line-height: 20px;
      }
      .price-fen {
        font-size: 13px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        line-height: 17px;
      }
    }
  }
  .goods {
    color: #191919;
    min-height: 100px;
    height: auto;
    .image-box {
      width: 102px;
      height: 102px;
      border-radius: 8px;
    }
    .goods-info {
      min-height: 102px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .name {
      line-height: 17px;
      height: auto;
      font-weight: 500;
      color: #191919;
      font-size: 13px;
    }
    .fqz-price{
      font-size: 11px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #FE3040;
      line-height: 15px;
    }
  }
  .price-detail-item {
    display: flex;
    justify-content: space-between;
    // margin-top: 24px;
    font-size: 13px;
    .label {
      color: #000;
    }
    .total-price {
      color: #000;
      // font-weight: bold;
    }
    .copun-price{
      color: #E60113;
      // font-weight: bold;
    }
  }
  .copun-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0 0 0;
    color: #E60113;
    font-size: 13px;
    padding: 0 12px 0 44px;
    position: relative;

    .left {
      flex: 1;
      height: 18px;
      line-height: 18px;
      overflow: hidden;
      margin-right: 4px;
      display: flex;
      flex-wrap: wrap;
      // height: 22px;
      >span {
        border: 1px solid #E60113;
        border-radius: 2px;
        padding: 0 4px;
        margin-left: 8px;
        line-height: 20px;
      }
      .checkLabel {
        font-size: 13px;
        font-weight: 400;
        color: #191919;
      }
      .icon_select {
        height: 100%;
      }
    }
    .right {
      display: flex;
      align-items: center;
      color: #FF450C;
      font-size: 13px;
      height: 18px;
      line-height: 18px;
      img {
        width: 16px;
        height: 16px;
        // margin-left: 6px;
      }
    }
  }
  .item {
    // padding-bottom: 12px;
    padding: 12px 0;
    box-sizing: content-box;
  }
  .cart_section{
    width: 359px;
    background: #FFFFFF;
    border-radius: 8px;
    margin: 10px auto;
    .item:last-child {
      .line-down{
        display: none;
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
          >p:first-child {
            font-size: 18px;
            font-weight: bold;
          }
        }
        .choose-detail {
          border: 1px solid #E60113;
          margin-top: 12px;
          border-radius: 14px;
          height: 212px;
          padding: 24px 52px 32px;
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
              >p:first-child {
                font-size: 18px;
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
          font-size: 14px;
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
    &.dis-title {
      margin-top: 12px;
      margin-bottom: 6px;
    }
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
  .line-down{
    position: relative;
    top: 12px;
    left: 42px;
    width: 100%;
    height: 1px;
    background: #EEEEEE;
  }
  .select-goods{
    margin-top: 2px;
  }
  .top-adress-edit {
    display: flex;
    justify-content: space-between;
    background-color: #f6f6f6;
    padding: 10px 8px 0 8px;
    font-size: 13px;
    font-weight: 400;
    color: #444444;
    line-height: 22px;
    align-items: center;
    .top-adress{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 25px;
      background: #FFFFFF;
      border-radius: 14px;
      padding: 0 8px 0 6px;
      .adress-img{
        width: 16px;
        height: 16px;
      }
      .no-adress{
        color: #999999;
      }
      .init-adress{
        color: #444444;
        margin-left: 2px;
      }
    }
  }
  .money-detail{
    background: #F6F6F6;
    .money-detail-title{
      text-align: center;
      font-size: 16px;
      color: #000;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .closeIcon {
      position: absolute;
      right: 12px;
      top: 13px;
      width: 27px;
      height: 20px;
    }
    .goods-actives{
      background: #FFFFFF;
      border-radius: 12px;
      padding: 13px 12px;
      .price-detail-item{
        margin-bottom: 19px;
      }
      .price-detail-item:last-child{
        margin-bottom: 0;
      }
    }
    .achievements{
      margin-top: 10px;
    }
  }

  .address-dialog {
    padding-top: 16px;
    .address-title {
      text-align: center;
      font-size: 14px;
      padding-bottom: 8px;
      color: #666;
    }
    .address-item {
      padding: 12px 0;
      margin: 0 12px;
      display: flex;
      align-items: center;
      padding-left: 28px;
      background: url('~@/assets/goods/shopCart.png') left center no-repeat;
      background-size: 20px;
      .address-street {
        margin-left: 4px;
        display: inline-block;
        width: 191px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        vertical-align: bottom;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
      }
      .address-tag {
        padding: 1px 2px;
        background-color: #E60113;
        border-radius: 2px;
        color: #fff;
        font-size: 10px;
        line-height: 10px;
      }
      .address-name {
        line-height: 20px;
        font-size: 14px;
      }
      .rePosition {
        width: 76px;
        height: 30px;
        line-height: 30px;
        background-color: #F0F1F5;
        font-size: 12px;
        text-align: center;
        color: #000;
        border-radius: 15px;
      }
      .flex-left {
        flex: 1;
      }
    }
    .address-list {
      // height: 50vh;
      height: 200px;
      overflow-y: scroll;
    }
    .no-address {
      display: flex;
      // height: 50vh;
      height: 200px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .add-address-box {
      position: relative;
      padding: 5px 16px;
      // padding-bottom: 40px;
      &::before {
        position: absolute;
        left: -50%;
        top: 0;
        display: block;
        content: '';
        height: 1px;
        width: 200%;
        background-color: #F2F2F2;
        transform: scale(0.5);
      }
      .add-address {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background-color: #E60113;
        font-size: 14px;
        font-weight: 600;
        border-radius: 19px;
      }
    }

    .address-active {
      // background-image: url('~@/assets/img/cat_Selected@2x.png');
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwpJREFUWEfFl11Ik1EYx39HybktDItCCEFKEqyQlFlQQUjUhVBGSBqGklYE2ewmxUpNIrWSBCvygyCoLLqQAu+ioqulGYTYTVJERFJQYc2lpSfO3um+3rl3U9m5POf5+D/fzxEYPJLMpZit+QjyQGSBXAMkedjHQLwH+QbJU1zOPsHb30ZEi3BE0pSdTnx8NZJiBNZw9O53iRNBD1NTLWLi9chcPCEBSNJNmJc3ImQVkGBIcTDRJFK04fpeJxiZ0JOhC0BabSlIeoEtUSoOZHMg2CecA6OBD0EApDVnIzKuD0hdIOUzYj4hpvOFc3DIV64fAI/l/Yug3AcEub6emAXgjrkl+fkCuj2UAx2M/9gxkxNeAObcFoQ8vcBu1xcnxSXh6q9Wj24AnlIbnke26ysSAsr2wvZsOFznSzPJ1NR6VaIaAIutC6hYUOsz0qCjDmwboP0e1LQFiu8W4wNHhKfDjRpuMuFQKqtPFEPDcTAlQP0NaL0dzKWalcuZIqTZdgDB/XByDb2vWAZdDbB7q0ZefRWu9YRmlRQJabF1AEcNKZiLKCsDHlyG1BSNqv46XNGx3F9Gp5CWXAfIzfMCUJCnWW5J1MTox1xHhXipPPAVWKkLYPUqWJsKLwZD41PxbrJDXJxG8+gZlNTAtDRi0zcF4A9gCqJWceyqh+QkaLsDjTfh7z9/snPHoKbcezf0DvLKYVyJNHQmQgO4eBLsJV4pr4ah7Cx8+KzdXaiEU4e87z/HYFup992QftwAQoegtgLO+OTnLyfYm2Fdmr/lUsLBanisOnlER4UgTBKqGDdXgarvUOdWL1Q2RaRZI9aSMHwZlu6B9lqI9ySar6qPX8BWBE5XFADoNN6I9u+E7vOQsMSrSLm+wA5PHNEoV6tbUWStWFXG3WYwe4pGlZyKfTRnphUr3oiGkZpsD1sh0QSbCiPNel+o2jByA9A2X+PjOCcTCnfpTTijvvAfx24QsVxI3ABivZK5QWjreGyW0pngxXQt94KI4cdkFkQsv2a+tRSzz2lgQS/W9/w/mskuOvDweK0AAAAASUVORK5CYII=);
    }
  }
    .icon_select:after {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAsZJREFUWEfNl01oE1EQx//zssFSGz/AQ71KxUP9uIhIkldcMagpCgWL9qJY8KiIgr158FZBET2JUNFLhQoK0qhEupK3W4p48aMHsXhVRPAjtUSyeSOvJDXGpEnayHavbz5+O29m3gyhwc9xnI5wONzLzHsB7ACwCcCaovoPAB8AvCKiiXw+P27b9mwjpqmekOM4XaFQaIiIBgCsBuADeMfMM0KIr0Zfa72eiLoAbAFgAfjJzKOFQmHYtu2ZxXzUBEilUqsikcglIjprjDJzSghxZ25uLp1IJL5XM5pOp9e2t7cntNYniChpYJn5WjabvZhMJn9V06kK4DhOp2VZDwDsBvCUiM7H4/HpetEqP3ddt5uZrwDYD2DK9/0+27Y/Vdr4B2BycnJboVAYB7BRCHEuFovdaMZxpazneae11lcBfAyFQr3RaPRNucxfAMU/fwEgAqBfSvlsOc5LukqpfQDGAGR9399VHokFgOKdPwewE8DBVjmvgHgM4GU2m91TyokFAKXUMIALQogzyw17ragVr+M6gMtSyiEjNw9gSi0cDk8zsyOlPNCKsNeyoZR6QkR2Pp/vNiU6D5DJZG4JIQYBbG8225uFNdUB4LXWeqSnp+cUmQ5nWZYpjwkp5eFmDS5FXin1CIDt+34nua57lJnvCSH6Y7HY/aUYbFbH87wjWusxIjpGSqmbAAZzudyGWh2uWQf15E3HbGtr+wJgxABMAeiQUm6tp9jKc6XUWwCzBuAzAE9K2ddKB/VsKaVMq48ZgBwRjcbj8ZP1lFp57rrubWYeWBEAgVxBJpN5SETRFZGEwZZh4I2orBWbh+hQKzN9kQfpTysO/DFaEc+xgQh0IDEAgY9kxasw43gwQ2kpYwMdy0sQgS4mJYgqq9m4EOJug6vZcSLqXfJqVt5Aai2nAN4T0Tcjy8zrAGxu6XJa2cX+13r+GzvS19aP6g1jAAAAAElFTkSuQmCC);
      top: 50%;
      transform: translateY(-50%);
    }
  .selected .icon_select:after {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwpJREFUWEfFl11Ik1EYx39HybktDItCCEFKEqyQlFlQQUjUhVBGSBqGklYE2ewmxUpNIrWSBCvygyCoLLqQAu+ioqulGYTYTVJERFJQYc2lpSfO3um+3rl3U9m5POf5+D/fzxEYPJLMpZit+QjyQGSBXAMkedjHQLwH+QbJU1zOPsHb30ZEi3BE0pSdTnx8NZJiBNZw9O53iRNBD1NTLWLi9chcPCEBSNJNmJc3ImQVkGBIcTDRJFK04fpeJxiZ0JOhC0BabSlIeoEtUSoOZHMg2CecA6OBD0EApDVnIzKuD0hdIOUzYj4hpvOFc3DIV64fAI/l/Yug3AcEub6emAXgjrkl+fkCuj2UAx2M/9gxkxNeAObcFoQ8vcBu1xcnxSXh6q9Wj24AnlIbnke26ysSAsr2wvZsOFznSzPJ1NR6VaIaAIutC6hYUOsz0qCjDmwboP0e1LQFiu8W4wNHhKfDjRpuMuFQKqtPFEPDcTAlQP0NaL0dzKWalcuZIqTZdgDB/XByDb2vWAZdDbB7q0ZefRWu9YRmlRQJabF1AEcNKZiLKCsDHlyG1BSNqv46XNGx3F9Gp5CWXAfIzfMCUJCnWW5J1MTox1xHhXipPPAVWKkLYPUqWJsKLwZD41PxbrJDXJxG8+gZlNTAtDRi0zcF4A9gCqJWceyqh+QkaLsDjTfh7z9/snPHoKbcezf0DvLKYVyJNHQmQgO4eBLsJV4pr4ah7Cx8+KzdXaiEU4e87z/HYFup992QftwAQoegtgLO+OTnLyfYm2Fdmr/lUsLBanisOnlER4UgTBKqGDdXgarvUOdWL1Q2RaRZI9aSMHwZlu6B9lqI9ySar6qPX8BWBE5XFADoNN6I9u+E7vOQsMSrSLm+wA5PHNEoV6tbUWStWFXG3WYwe4pGlZyKfTRnphUr3oiGkZpsD1sh0QSbCiPNel+o2jByA9A2X+PjOCcTCnfpTTijvvAfx24QsVxI3ABivZK5QWjreGyW0pngxXQt94KI4cdkFkQsv2a+tRSzz2lgQS/W9/w/mskuOvDweK0AAAAASUVORK5CYII=);
  }

  // 失效宝贝
  .icon_select_out:after {
    position: absolute;
    // left: 50%;
    top: 50%;
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    margin-left: -10px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoFJREFUWEfNlz2MEkEUx//DAktg8UiICckdcBGKS4yxU0MCcS25ykrt1drK6yzszsrWj97rrI7SNUDIaWeMCQUYvi4hmkvAXS587DLmbViCKPeRIHPTbLI7895v/2/mvTcMZxyapikej2ebc34HwHUAVwBcmiz/BeA7gC+MsQ+j0WhfVVXjLKbZaZM0TUtKkrTDGHsAIEDzZVmG1+uFJEn2csuyMBwOMRgMHHM9zvk7y7J2VVWtnORjIUAul5ODweBzxtgTzrlXURSEQiHQ03E8b5hADMNAp9Oxn4yxIef8pa7rz7LZ7JRudt0/ATRNi7jd7vcAbgUCAUQiEfh8vtPE+uN7v99Hu91Gr9ej9wemad5VVbU9b+QvgFKpdM2yrH0AUXIcDofP5Xh+8tHRkQ0CoClJ0nYqlfq6UIHJn392uVzRaDRqy72MQeFoNpsYj8dN0zRvzCoxVWAS848kezweX5pz5wcIol6v2+HQdf22syemAIVCYRfA02XIvki1mXC8SKfTOzTPBqCj5vF4vvn9fu/m5uYyVF9oo1ar4fj4eDgaja7SEbUB8vn8G8bYw0Qice7dfl5aOh3VahWc87eZTOYRowzndrvbiqIEKParGLQXDMPomaYZYcVi8R7nfG9jYwNra2ur8I9ut4tWq0WJ6j4rFAqvADze2tpamOGWTUUZs1wuk9nXBHAgy/LNZDK5bD8n2qtUKlQ7PhHAj2AweDkWi60UoNFoQNf1nwTQD4VC8vr6+koBDg8PqWgNLgSA8BAI34Rij6HwRCQ8FQsvRheiHBOE0IaEAIS3ZJNQUDsupil1CoHQttyBEHoxcSCEXs1m67Kwy+l8c/C/rue/AUoX2tbv2eSEAAAAAElFTkSuQmCC);
    background-size: 18px;
  }


  .addresspop {
		background-color: #F6F6F6;
		height: 488px;
		// overflow: hidden;
		// position: relative;
    display: flex;
    flex-direction: column;
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
			// position: absolute;
			// top: 46px;
			// bottom: 48px;
			// left: 0;
			// right: 0;
      flex: 1;
		}
		&-location {
			width: 351px;
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
				// margin: 0 0 0 10px;
			}
		}
		&-list {
			width: 351px;
			background-color: #FFFFFF;
			margin: 10px auto 0;
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
				width: 14px;
				height: 14px;
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
			padding: 4px 0;
			background-color: #fff;
			// position: absolute;
			// left: 0;
			// bottom: 0;
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
  .boxWrapper/deep/ .van-sku-header__goods-info {
    justify-content: flex-start;
  }
  .boxWrapper/deep/ .van-image__img{
    border-radius: 8px;
  }
  .boxWrapper/deep/ .van-sku-row__item--active {
    border: 1px solid #FF0A35;
    color: #FF0A35;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .boxWrapper/deep/.van-sku-row__item-name{
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191919;
  }
  .boxWrapper/deep/.van-sku-row__item--disabled{
    background-color: #f2f2f2;
    color: #bababa;
  }
  .boxWrapper/deep/ .van-sku-row__title {
    padding-bottom: 8px;
  }
  .boxWrapper/deep/ .van-sku-row {
    margin: 0 16px 4px 16px;
  }
  .boxWrapper/deep/ .van-sku-actions .van-button {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFF9E9;
  }
  .price-box{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
