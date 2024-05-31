<template>
  <div style="height:100%;margin-top: 46px" class="coupon-page">
    <!-- <x-header @on-click-back="backCustomerCenter()" :left-options="{ backText: '', preventGoBack: true }">优惠券</x-header> -->
    <div class="header">
      <div class="comments-header">
        <div class="comments-header-left" @click="toBack">
          <img src="../../assets/img/back1@2x.png" alt style="width:0.96rem;height:0.96rem" />
        </div>
        <div class="comments-header-title">
          <div class="coupon-radio-box">
            <div class="coupon-radio" :class="{ active: couponType == 1 }" @click="changeCouponType(1)">店铺券({{ pageCount.storeUsableCount }})</div>
            <div class="coupon-radio" :class="{ active: couponType == 2 }" @click="changeCouponType(2)">平台券({{ pageCount.platformUsableCount }})</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" @click="goCouponCenter()">
      <img class="coupon-icon" src="../../assets/img/activity/coupon_icon02@2x.png" alt="" />
      <span>领取更多优惠券</span>
      <img class="go-icon" src="../../assets/img/activity/jt@2x.png" alt="" />
    </div>
    <van-tabs v-model="active" sticky @click="changeTab">
      <van-tab :title="`可使用(${couponType == 1 ? pageCount.storeUsableCount : pageCount.platformUsableCount})`" name="a">
        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="active == 'a'" disabled> -->
        <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" :offset="100" finished-text="" @load="onLoad">
          <!-- <div class="couponlist" style="padding:0.48rem" v-if="usableList.length > 0">
          <div v-for="(item, index) in usableList" :key="index" style="margin-top: 0.48rem;">
            <div class="couponbox1-head">
              <img src="../../assets/img/cat_shop@2x.png" alt="" style="width: 0.64rem;height: 0.64rem;margin-right: 3px;" />
              <span>{{ item.storeName }}</span>
              <img src="../../assets/img/cat_more@2x.png" alt="" style="width: 4px;height: 10px;margin-left: 4px;" />
            </div>
            <div v-for="(i, tabIndex) in item.couponList" :key="tabIndex" class="couponbox1">
              <div class="couponbox1-content">
                <div class="couponbox1-content-left">
                  <div class="img-box">
                    <img :src="i.imageUrl" alt="" style="width:100%;height:100%" />
                  </div>
                  <div class="goodscontent">
                    <div style="height: 100%;display: flex;flex-direction: column;">
                      <div class="price">
                        <span style="font-size: 0.48rem;">¥</span>
                        <span style="font-size: 0.96rem;font-weight: 600;height: 1.04rem;line-height: 1.04rem;display: inline-block;" v-if="i.type == 1">
                          {{ i.couponFull.price }}
                        </span>
                        <span style="font-size: 0.96rem;font-weight: 600;height: 1.04rem;line-height: 1.04rem;display: inline-block;" v-if="i.type == 2">
                          {{ i.couponFall.price }}
                        </span>
                        <span style="margin-left: 4px;" v-if="i.type == 1">满{{ i.couponFull.fullPrice }}可用</span>
                        <span style="margin-left: 4px;" v-if="i.type == 2">{{ i.name }}</span>
                      </div>
                      <div class="dec">限{{ item.storeName }}使用</div>
                      <p style="height: 0.48rem;line-height: 0.48rem;color: #999;margin-top: 6px;">
                        {{ formatTime(i.startTime) }} - {{ formatTime(i.endTime) }}
                      </p>
                    </div>
                  </div>
                </div>

                <span class="btn-box" @click="gostore(item.storeId)">
                  去使用
                </span>
              </div>
            </div>
          </div>
        </div> -->
          <div class="coupon-list" style="padding: 10px 12px; height: 100%;" v-if="pageList && pageList.length > 0">
            <template v-for="(item, index) in pageList">
              <div class="coupon-container" :key="index" v-if="couponType == 1">
                <div class="coupon-card">
                  <span class="top-round-corner"></span>
                  <span class="bottom-round-corner"></span>
                  <div class="main-ticket store-padding">
                    <div class="coupon-name">限购【{{ item.storeName }}】店铺商品</div>
                    <div class="coupon-indate">{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</div>
                  </div>
                  <div class="stub-ticket useful-store-ticket">
                    <div class="coupon-price">
                      <span class="symbol">￥</span>
                      <span class="int-price">{{ skuPriceInt(item.couponFull.price) }}</span>
                      <span class="float-price">{{ '.' + skuPriceFloat(item.couponFull.price) }}</span>
                    </div>
                    <div class="coupon-condition">满{{ item.couponFull.fullPrice }}元可用</div>
                    <div class="coupon-use-button store-button" @click="gostore(item.storeId)">去使用</div>
                  </div>
                </div>
              </div>

              <div class="coupon-container" :key="index" v-else>
                <div class="coupon-card">
                  <span class="top-round-corner"></span>
                  <span class="bottom-round-corner"></span>
                  <div class="main-ticket platform-padding">
                    <div class="coupon-name">
                      <span v-if="item.permittedType == 0">
                        全平台商品可用
                      </span>
                      <span v-else-if="item.permittedType == 1">
                        {{ `限${item.permittedCatesString}类商品可用` }}
                      </span>
                      <span v-else-if="item.permittedType == 2">
                        平台部分商品可用
                      </span>
                    </div>
                    <div class="coupon-indate">{{ formatTime(item.validityStartTime) }} - {{ formatTime(item.validityEndTime) }}</div>
                    <div class="coupon-explain" @click="changeExpand(index)">
                      <span>使用说明</span>
                      <img class="coupon-explain-icon" v-show="item.isExpand" src="../../assets/img/activity/more01@2x.png" alt="" />
                      <img class="coupon-explain-icon" v-show="!item.isExpand" src="../../assets/img/activity/more02@2x.png" alt="" />
                    </div>
                  </div>
                  <div class="stub-ticket useful-platform-ticket">
                    <div class="coupon-price">
                      <span class="symbol" v-if="item.type != 2">￥</span>
                      <span class="int-price" v-if="item.type != 2">{{ skuPriceInt(item.price) }}</span>
                      <span class="int-price" v-else>{{ parseInt(item.discountRate * 100) / 10 }}</span>
                      <span class="float-price" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</span>
                      <span class="float-price" v-else>折</span>
                    </div>
                    <div class="coupon-condition" v-if="item.type != 0">满{{ item.fullPrice }}元可用</div>
                    <div class="coupon-use-button platform-button" @click="goUseCoupon(item.id)">去使用</div>
                  </div>
                </div>
                <div class="coupon-detail" v-if="item.isExpand">
                  <template v-if="item.description">
                    <div v-html="item.description"></div>
                  </template>
                  <template v-else>
                    <p class="default-text">
                      <span v-if="item.permittedType == 0">
                        1. 全平台商品可用
                      </span>
                      <span v-else-if="item.permittedType == 1">
                        {{ `1. 限${item.permittedCatesString}类商品可用` }}
                      </span>
                      <span v-else-if="item.permittedType == 2">
                        1. 平台部分商品可用
                      </span>
                    </p>
                    <p class="default-text">{{ `2. ${item.exclusionType == 1 ? '不' : ''}可与店铺券叠加使用` }}</p>
                  </template>
                </div>
              </div>
            </template>
          </div>

          <div v-else style="text-align: center;margin-top: 125px;">
            <img src="../../assets/img/Discount_bg@2x.png" alt="" style="width: 90px;height: 90px;" />
            <p class="nocoupon-txt">您目前没有可使用的优惠券</p>
          </div>
        </van-list>
        <!-- </van-pull-refresh> -->
      </van-tab>
      <van-tab :title="`已使用(${couponType == 1 ? pageCount.storeUsedCount : pageCount.platformUsedCount})`" name="b">
        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="active == 'b'" disabled> -->
        <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" :offset="100" finished-text="" @load="onLoad">
          <!-- <div class="couponlist" style="padding: 0.48rem" v-if="usedList.length > 0"> -->
          <!-- <div v-for="(item, index) in usedList" class="couponbox2" :key="index">
                <div class="couponbox1-content">
                  <div class="couponbox1-content-left">
                    <div class="img-box">
                      <img src="../../assets/img/Discount_f@2x.png" alt="" style="width: 1.68rem;height: 1.48rem;margin: 0.68rem 0.56rem 0.64rem;" />
                    </div>
                    <div class="goodscontent">
                      <div style="height: 100%;display: flex;flex-direction: column;">
                        <div class="price">
                          <span style="font-size: 0.48rem;">¥</span>
                          <span style="font-size: 0.96rem;font-weight: 600;height: 1.04rem;line-height: 1.04rem;display: inline-block;" v-if="item.type == 1">
                            {{ item.couponFull.price }}
                          </span>
                          <span style="font-size: 0.96rem;font-weight: 600;height: 1.04rem;line-height: 1.04rem;display: inline-block;" v-if="item.type == 2">
                            {{ item.couponFall.price }}
                          </span>
                          <span style="margin-left: 4px;" v-if="item.type == 1">满{{ item.couponFull.fullPrice }}可用</span>
                          <span style="margin-left: 4px;" v-if="item.type == 2">{{ item.name }}</span>
                        </div>
                        <div class="dec">限{{ item.storeName }}使用</div>
                        <p style="height: 0.48rem;line-height: 0.48rem;color: #999;margin-top: 6px;">
                          {{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <img src="../../assets/img/Received@2x.png" alt="" style="width: 2.5rem;height: 2.5rem;" />
                </div>
              </div> -->
          <div class="coupon-list" style="padding: 10px 12px; height: 100%;" v-if="pageList && pageList.length > 0">
            <template v-for="(item, index) in pageList">
              <div class="coupon-container" :key="index" v-if="couponType == 1">
                <div class="coupon-card">
                  <span class="top-round-corner"></span>
                  <span class="bottom-round-corner"></span>
                  <img class="mark-img" src="../../assets/img/activity/ysy@2x.png" alt="" />
                  <div class="main-ticket store-padding">
                    <div class="coupon-name unuseful-text">限购【{{ item.storeName }}】店铺商品</div>
                    <div class="coupon-indate unuseful-text">{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</div>
                  </div>
                  <div class="stub-ticket unuseful-stub-ticket">
                    <div></div>
                    <div class="coupon-price">
                      <span class="symbol">￥</span>
                      <span class="int-price">{{ skuPriceInt(item.couponFull.price) }}</span>
                      <span class="float-price">{{ '.' + skuPriceFloat(item.couponFull.price) }}</span>
                    </div>
                    <div class="coupon-condition">满{{ item.couponFull.fullPrice }}元可用</div>
                    <div></div>
                  </div>
                </div>
              </div>

              <div class="coupon-container" :key="index" v-else>
                <div class="coupon-card">
                  <span class="top-round-corner"></span>
                  <span class="bottom-round-corner"></span>
                  <img class="mark-img platform-position" src="../../assets/img/activity/ysy@2x.png" alt="" />
                  <div class="main-ticket platform-padding">
                    <div class="coupon-name unuseful-text">
                      <span v-if="item.permittedType == 0">
                        全平台商品可用
                      </span>
                      <span v-else-if="item.permittedType == 1">
                        {{ `限${item.permittedCatesString}类商品可用` }}
                      </span>
                      <span v-else-if="item.permittedType == 2">
                        平台部分商品可用
                      </span>
                    </div>
                    <div class="coupon-indate unuseful-text">{{ formatTime(item.validityStartTime) }} - {{ formatTime(item.validityEndTime) }}</div>
                    <div class="coupon-explain" @click="changeExpand(index)">
                      <span>使用说明</span>
                      <img class="coupon-explain-icon" v-show="item.isExpand" src="../../assets/img/activity/more01@2x.png" alt="" />
                      <img class="coupon-explain-icon" v-show="!item.isExpand" src="../../assets/img/activity/more02@2x.png" alt="" />
                    </div>
                  </div>
                  <div class="stub-ticket unuseful-stub-ticket">
                    <div></div>
                    <div class="coupon-price">
                      <span class="symbol">￥</span>
                      <span class="int-price" v-if="item.type != 2">{{ skuPriceInt(item.price) }}</span>
                      <span class="int-price" v-else>{{ parseInt(item.discountRate * 100) / 10 }}</span>
                      <span class="float-price" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</span>
                      <span class="float-price" v-else>折</span>
                    </div>
                    <div class="coupon-condition" v-if="item.type != 0">满{{ item.fullPrice }}元可用</div>
                    <div></div>
                  </div>
                </div>
                <div class="coupon-detail" v-if="item.isExpand">
                  <template v-if="item.description">
                    <div v-html="item.description"></div>
                  </template>
                  <template v-else>
                    <p class="default-text">
                      <span v-if="item.permittedType == 0">
                        1. 全平台商品可用
                      </span>
                      <span v-else-if="item.permittedType == 1">
                        {{ `1. 限${item.permittedCatesString}类商品可用` }}
                      </span>
                      <span v-else-if="item.permittedType == 2">
                        1. 平台部分商品可用
                      </span>
                    </p>
                    <p class="default-text">{{ `2. ${item.exclusionType == 1 ? '不' : ''}可与店铺券叠加使用` }}</p>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <!-- </div> -->
          <div v-else style="text-align: center;margin-top: 125px;">
            <img src="../../assets/img/Discount_bg@2x.png" alt="" style="width: 90px;height: 90px;" />
            <p class="nocoupon-txt">您目前没有已使用的优惠券</p>
          </div>
        </van-list>
        <!-- </van-pull-refresh> -->
      </van-tab>
      <van-tab :title="`已失效(${couponType == 1 ? pageCount.storeFailedCount : pageCount.platformFailedCount})`" name="c">
        <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="active == 'c'" disabled> -->
        <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" :offset="100" finished-text="" @load="onLoad">
          <!-- <div class="couponlist" style="padding: 0.48rem" v-if="usedList.length > 0">
              <div v-for="(item, index) in usedList" class="couponbox2" :key="index">
                <div class="couponbox1-content">
                  <div class="couponbox1-content-left">
                    <div class="img-box">
                      <img src="../../assets/img/Discount_f@2x.png" alt="" style="width: 1.68rem;height: 1.48rem;margin: 0.68rem 0.56rem 0.64rem;" />
                    </div>
                    <div class="goodscontent">
                      <div style="height: 100%;display: flex;flex-direction: column;width: 6.5rem;">
                        <div class="price">
                          <span style="font-size: 0.48rem;">¥</span>
                          <span style="font-size: 0.96rem;font-weight: 600;height: 1.04rem;line-height: 1.04rem;display: inline-block;" v-if="item.type == 1">
                            {{ item.couponFull.price }}
                          </span>
                          <span style="font-size: 0.96rem;font-weight: 600;height: 1.04rem;line-height: 1.04rem;display: inline-block;" v-if="item.type == 2">
                            {{ item.couponFall.price }}
                          </span>
                          <span style="margin-left: 4px;" v-if="item.type == 1">满{{ item.couponFull.fullPrice }}可用</span>
                          <span style="margin-left: 4px;" v-if="item.type == 2">{{ item.name }}</span>
                        </div>
                        <div class="dec">限{{ item.storeName }}使用</div>
                        <p style="width:6.5rem;height: 0.48rem;line-height: 0.48rem;color: #999;margin-top: 6px;">
                          {{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <img src="../../assets/img/expired@2x.png" alt="" style="width: 2.5rem;height: 2.5rem;" />
                </div>
              </div>
            </div> -->
          <div class="coupon-list" style="padding: 10px 12px; height: 100%;" v-if="pageList && pageList.length > 0">
            <template v-for="(item, index) in pageList">
              <div class="coupon-container" :key="index" v-if="couponType == 1">
                <div class="coupon-card">
                  <span class="top-round-corner"></span>
                  <span class="bottom-round-corner"></span>
                  <img class="mark-img" src="../../assets/img/activity/ygq@2x.png" alt="" />
                  <div class="main-ticket store-padding">
                    <div class="coupon-name unuseful-text">限购【{{ item.storeName }}】店铺商品</div>
                    <div class="coupon-indate unuseful-text">{{ formatTime(item.startTime) }}-{{ formatTime(item.endTime) }}</div>
                  </div>
                  <div class="stub-ticket unuseful-stub-ticket">
                    <div></div>
                    <div class="coupon-price">
                      <span class="symbol">￥</span>
                      <span class="int-price">{{ skuPriceInt(item.couponFull.price) }}</span>
                      <span class="float-price">{{ '.' + skuPriceFloat(item.couponFull.price) }}</span>
                    </div>
                    <div class="coupon-condition">满{{ item.couponFull.fullPrice }}元可用</div>
                    <div></div>
                  </div>
                </div>
              </div>

              <div class="coupon-container" :key="index" v-else>
                <div class="coupon-card">
                  <span class="top-round-corner"></span>
                  <span class="bottom-round-corner"></span>
                  <img class="mark-img platform-position" v-if="item.isClosed" src="../../assets/img/activity/yzf@2x.png" alt="" />
                  <img class="mark-img platform-position" v-else src="../../assets/img/activity/ygq@2x.png" alt="" />
                  <div class="main-ticket platform-padding">
                    <div class="coupon-name unuseful-text">
                      <span v-if="item.permittedType == 0">
                        全平台商品可用
                      </span>
                      <span v-else-if="item.permittedType == 1">
                        {{ `限${item.permittedCatesString}类商品可用` }}
                      </span>
                      <span v-else-if="item.permittedType == 2">
                        平台部分商品可用
                      </span>
                    </div>
                    <div class="coupon-indate unuseful-text">{{ formatTime(item.validityStartTime) }} - {{ formatTime(item.validityEndTime) }}</div>
                    <div class="coupon-explain" @click="changeExpand(index)">
                      <span>使用说明</span>
                      <img class="coupon-explain-icon" v-show="item.isExpand" src="../../assets/img/activity/more01@2x.png" alt="" />
                      <img class="coupon-explain-icon" v-show="!item.isExpand" src="../../assets/img/activity/more02@2x.png" alt="" />
                    </div>
                  </div>
                  <div class="stub-ticket unuseful-stub-ticket">
                    <div></div>
                    <div class="coupon-price">
                      <span class="symbol">￥</span>
                      <span class="int-price" v-if="item.type != 2">{{ skuPriceInt(item.price) }}</span>
                      <span class="int-price" v-else>{{ parseInt(item.discountRate * 100) / 10 }}</span>
                      <span class="float-price" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</span>
                      <span class="float-price" v-else>折</span>
                    </div>
                    <div class="coupon-condition" v-if="item.type != 0">满{{ item.fullPrice }}元可用</div>
                    <div></div>
                  </div>
                </div>
                <div class="coupon-detail" v-if="item.isExpand">
                  <template v-if="item.description">
                    <div v-html="item.description"></div>
                  </template>
                  <template v-else>
                    <p class="default-text">
                      <span v-if="item.permittedType == 0">
                        1. 全平台商品可用
                      </span>
                      <span v-else-if="item.permittedType == 1">
                        {{ `1. 限${item.permittedCatesString}类商品可用` }}
                      </span>
                      <span v-else-if="item.permittedType == 2">
                        1. 平台部分商品可用
                      </span>
                    </p>
                    <p class="default-text">{{ `2. ${item.exclusionType == 1 ? '不' : ''}可与店铺券叠加使用` }}</p>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div v-else style="text-align: center;margin-top: 125px;">
            <img src="../../assets/img/Discount_bg@2x.png" alt="" style="width: 90px;height: 90px;" />
            <p class="nocoupon-txt">您目前没有已失效的优惠券</p>
          </div>
        </van-list>
        <!-- </van-pull-refresh> -->
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
  import { XHeader, XButton, Divider } from 'vux'
  import { Tab, Tabs, Button, List, PullRefresh } from 'vant'
  import {
    queryCoupons, //查询优惠券
    queryUserCoupons, //查询【已领取未使用】的优惠券列表（无分页）
    pageUserCoupons, //查询【已过期/已使用】的优惠券列表（分页）
    pagePlatformCoupon, //查询平台优惠券
  } from '@/api/mycoupon'
  import {
    getUsableCount, //查询可用优惠券数量
  } from '@/api/home'
  export default {
    components: {
      XHeader,
      XButton,
      Divider,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Button.name]: Button,
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
    },
    data() {
      return {
        pageCount: {
          platformFailedCount: 0,
          platformUsableCount: 0,
          platformUsedCount: 0,
          storeFailedCount: 0,
          storeUsableCount: 0,
          storeUsedCount: 0,
          usableTotalCount: 0,
        },
        expand: false,
        couponType: 1,
        active: 0,
        listQuery: {
          status: 1,
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        pageList: [],
        usableList: [], //可用优惠券
        usedList: [], //使用过的优惠券/过期的优惠券
        usableCount: 0, //可用优惠券数量
        usedCount: 0, //使用过的优惠券数量
        overdueCount: 0, //过期的优惠券数量

        noMore: false, //没有更多
        loading: false, //正在加载
        refreshing: false,
        isUpLoading: false,
        upFinished: false,
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      if (this.$route.query.type) {
        this.couponType = this.$route.query.type
        if (this.couponType == 1) {
          this.pageUserCoupons() // 加载数据
        } else if (this.couponType == 2) {
          this.getPlatformCoupon()
        }
      } else {
        this.pageUserCoupons()
      }
      this.getUsableCount()
    },
    methods: {
      skuPriceInt(price) {
        let intPrice = 0,
          floatPrice = 0
        if (!price) {
          price = 0
        } else {
          price = price.toFixed(2).split('.')[0]
        }
        return price
      },
      skuPriceFloat(price) {
        let intPrice = 0,
          floatPrice = 0
        if (!price) {
          price = 0
        } else {
          price = price.toFixed(2).split('.')[1]
        }
        return price
      },
      goCouponCenter() {
        this.$router.push({ path: '/couponCenter' })
      },
      goUseCoupon(id) {
        this.$router.push({ path: '/useCoupon', query: { id: id } })
      },
      changeExpand(index) {
        this.pageList[index].isExpand = !this.pageList[index].isExpand
        this.pageList = Object.assign([], this.pageList)
      },
      changeCouponType(type) {
        this.isUpLoading = false
        this.upFinished = false
        this.couponType = type
        this.listQuery.pageNum = 0
        this.pageList = []
        if (this.couponType == 1) {
          this.pageUserCoupons() // 加载数据
        } else if (this.couponType == 2) {
          this.getPlatformCoupon()
        }
      },
      onRefresh() {
        this.listQuery.pageNum = 0
        this.pageList = []
        this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
        this.refreshing = true
        if (this.couponType == 1) {
          this.pageUserCoupons() // 加载数据
        } else if (this.couponType == 2) {
          this.getPlatformCoupon()
        }
      },
      onLoad() {
        this.refreshing = false
        if (this.couponType == 1) {
          this.pageUserCoupons() // 加载数据
        } else if (this.couponType == 2) {
          this.getPlatformCoupon()
        }
      },
      //查询优惠券数量
      getUsableCount() {
        getUsableCount().then((res) => {
          console.log('res', res)
          if (res.code == 200) {
            this.pageCount = res.data
            // this.usableCount = res.data.usableCount
            // this.usedCount = res.data.usedCount
            // this.overdueCount = res.data.overdueCount
          }
        })
      },
      //获取可用数据数据
      getData() {
        queryUserCoupons().then((response) => {
          console.log('response', response)
          this.usableList = response.data
        })
      },
      pageUserCoupons() {
        if (this.loading) {
          return
        }
        this.loading = true
        pageUserCoupons(this.listQuery)
          .then((res) => {
            let list = res.data.list
            this.isUpLoading = false
            this.refreshing = false
            if (list.length > 0) {
              this.pageList = this.pageList.concat(list)
            }
            this.loading = false
            if (this.listQuery.pageNum == res.data.totalPage) {
              this.upFinished = true
            } else {
              this.listQuery.pageNum++
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      getPlatformCoupon() {
        if (this.loading) {
          return
        }
        this.loading = true
        pagePlatformCoupon(this.listQuery)
          .then((res) => {
            let list = res.data.records
            this.isUpLoading = false
            this.refreshing = false
            if (list.length > 0) {
              this.pageList = this.pageList.concat(list)
            }
            for (let i in this.pageList) {
              this.pageList[i].isExpand = false
            }
            if (this.listQuery.pageNum + 1 >= Number(res.data.pages)) {
              this.upFinished = true
            } else {
              this.listQuery.pageNum++
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      formatTime(time) {
        return time
          .split(' ')[0]
          .split('-')
          .join('.')
      },

      changeTab(name, title) {
        this.isUpLoading = false
        this.upFinished = false
        console.log('title', title)
        switch (name) {
          case 'a':
            this.listQuery.status = 1
            break
          case 'b':
            this.listQuery.status = 2
            break
          case 'c':
            this.listQuery.status = 3
            break
        }
        this.listQuery.pageNum = 0
        this.pageList = []
        if (this.couponType == 2) {
          this.getPlatformCoupon()
        } else if (this.couponType == 1) {
          this.pageUserCoupons()
        }
      },
      toCouponDetails(row) {
        this.$router.push({ path: '/coupondetails', query: { type: row.type == '2' ? '立减' : '满减', desc: row.desc } })
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({ path: '/home' })
      },
      toBack() {
        this.$router.go(-1)
      },
      // 进入店铺
      gostore(id) {
        if (id) {
          this.$router.push({
            path: '/storeindex',
            query: { storeId: id },
          })
        } else this.$router.push({ path: '/' })
      },
    },
  }
</script>
<style lang="less" scoped>
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.76rem;
    z-index: 999;
  }
  .comments-header {
    display: flex;
    background: #fff;
    position: relative;
    .comments-header-left {
      position: absolute;
      top: 0;
      left: 0;
      width: 1.76rem;
      height: 1.76rem;
      padding: 0.4rem;
    }
    .comments-header-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      .coupon-radio-box {
        border-radius: 13px;
        overflow: hidden;
        border: 1px solid #e60113;
        .coupon-radio {
          float: left;
          width: 82px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #e60113;
        }
        .active {
          background-color: #e60113;
          color: #fff;
        }
      }
    }
  }
  .coupon-page {
    /deep/.van-sticky {
      position: fixed;
      width: 100%;
      z-index: 999;
      top: 1.76rem;
    }
    /deep/.van-tabs__content {
      padding-top: 1.36rem;
      padding-bottom: 46px;
    }
  }

  .couponbox1 {
    width: 100%;
    background: #fff;
    // height: 141px;
    // background: url(../../assets/img/Discount_d@2x.png) no-repeat;
    // background-size: 100% 100%;
    // margin-top: 0.48rem;
    .price {
      color: #e60113;
      margin-top: -5px;
      width: 6.5rem;
    }
  }
  .couponbox1-head {
    height: 53px;
    width: 100%;
    padding: 13px 0px 25px 10px;
    display: flex;
    align-items: center;
    background: url(../../assets/img/bgo@2x.png) no-repeat;
    background-size: 100% 100%;
  }
  .couponbox1-head-icon {
    display: inline-block;
    width: 0.64rem;
    height: 0.64rem;
    background: url(../../assets/img/cat_shop@2x.png) no-repeat;
    background-size: contain;
    margin-right: 3px;
  }
  .couponbox1-content {
    height: 100px;
    width: 100%;
    box-sizing: border-box;
    padding: 0.32rem 0.4rem 0.32rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .couponbox1-content-left {
    height: 100px;
    display: flex;
    align-items: center;
  }
  .img-box {
    width: 70px;
    height: 70px;
    display: inline-block;

    background: #f5f5f5;
    border-radius: 5px;
  }
  .goodscontent {
    display: inline-block;
    width: 6.5rem;
    height: 70px;
    // background: red;
    margin-left: 0.4rem;
    // .price {
    //   color: #e60113;
    //   margin-top: -5px;
    // }
  }
  .dec {
    width: 6.5rem;
    height: 1.12rem;
    line-height: 0.56rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
  }
  .btn-box {
    // width: 60px;
    min-width: 2.4rem;
    padding: 0 10px;
    height: 0.96rem;
    line-height: 0.96rem;
    text-align: center;
    background: #e60113;
    border-radius: 0.56rem;
    font-size: 0.48rem;
    color: #fff;
    cursor: pointer;
    margin-left: 0.4rem;
  }
  .couponbox2 {
    width: 100%;
    height: 100px;
    background: url(../../assets/img/Discount_e@2x.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 0.48rem;
    color: #bababa !important;
    .price {
      margin-top: -5px;
    }
  }
  .nocoupon-txt {
    font-size: 0.56rem;
    color: #999999;
    margin-top: -3px;
    height: 20px;
    line-height: 20px;
  }

  .coupon-list {
    padding: 10px 12px;
    .coupon-container {
      margin-top: 10px;
      .coupon-card {
        position: relative;
        display: flex;
        height: 100px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        .top-round-corner {
          background-color: #f5f5f5;
          position: absolute;
          top: -6px;
          right: 100px;
          transform: translate(50%, 0);
          height: 12px;
          width: 12px;
          border-radius: 0 0 50% 50%;
        }
        .bottom-round-corner {
          background-color: #f5f5f5;
          position: absolute;
          bottom: -6px;
          right: 100px;
          transform: translate(50%, 0);
          height: 12px;
          width: 12px;
          border-radius: 50% 50% 0 0;
        }
        .mark-img {
          width: 74px;
          height: 54px;
          position: absolute;
          right: 109px;
          bottom: 0;
        }
        .platform-position {
          right: 140px;
        }
        .platform-padding {
          padding: 10px 18px;
        }
        .store-padding {
          padding: 18px;
        }
        .main-ticket {
          width: 251px;
          display: inline-flex;
          flex-direction: column;
          justify-content: space-between;
          .coupon-name {
            font-weight: 500;
            line-height: 20px;
            color: #000;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box; //作为弹性伸缩盒子模型显示。
            -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
            -webkit-line-clamp: 2; //显示的行
          }
          .coupon-indate {
            color: #666;
            font-size: 11px;
            line-height: 16px;
          }
          .unuseful-text {
            color: #999;
          }
          .coupon-explain {
            color: #999;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            line-height: 12px;
            .coupon-explain-icon {
              width: 12px;
              height: 12px;
            }
          }
        }
        .stub-ticket {
          padding: 8px 0;
          width: 100px;
          display: inline-flex;
          flex-direction: column;
          justify-content: space-around;
          .coupon-price {
            width: 100%;
            display: inline-flex;
            justify-content: center;
            align-items: baseline;
            color: #fff;
            .symbol {
              font-size: 14px;
              line-height: 14px;
            }
            .int-price {
              font-size: 32px;
              line-height: 34px;
            }
            .float-price {
              font-size: 14px;
              line-height: 14px;
            }
          }
          .coupon-condition {
            font-size: 12px;
            width: 100%;
            text-align: center;
            color: #fff;
          }
          .coupon-use-button {
            width: 60px;
            height: 20px;
            background: #fff;
            border-radius: 15px;
            line-height: 20px;
            text-align: center;
            font-size: 10px;
            margin: 0 auto;
          }
          .store-button {
            color: #fe8c02;
          }
          .platform-button {
            color: #e60113;
          }
        }
        .useful-platform-ticket {
          background: linear-gradient(135deg, #ff6b77 0%, #e60113 100%);
        }
        .useful-store-ticket {
          background: linear-gradient(134deg, #ffba66 0%, #fe8c02 100%);
        }
        .unuseful-stub-ticket {
          background: #999;
        }
      }
      .coupon-detail {
        background: linear-gradient(180deg, #f2f2f2 0%, #ffffff 100%);
        padding: 8px 18px;
        .default-text {
          color: #999;
          line-height: 16px;
          font-size: 11px;
        }
      }
    }
  }
  .footer {
    position: fixed;
    z-index: 99;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 46px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-weight: 600;
      color: #000;
      font-size: 14px;
      margin-left: 3px;
      margin-right: 8px;
    }
    .coupon-icon {
      width: 20px;
      height: 20px;
    }
    .go-icon {
      width: 18px;
      height: 12px;
    }
  }
</style>
