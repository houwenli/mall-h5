<template>
  <div class="box" ref="backTop" :class="[returntop ? 'backtopactive' : '']" :style="[{ 'background-color': switchViewValue ? '#fff' : '#f5f5f5' }, { 'padding-top': storeInfoData ? '6.92rem' : $route.query.type==='gift'?'5.24rem':'3.72rem' }]">
    <div v-if="storeInfoData" class="scrolltopBox" :class="[nostore ? 'movenostoredown' : 'movenostoreup']" :style="[{ 'z-index': filterBoxStyle ? '499' : '1001' }]">
      <div class="search-group">
      <img class="search-left" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search-toback-black-icon.png" alt @click="toBack()" />
      <div class="inputBox">
        <img class="left-icon" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/17815d79b28664db6277bd06ad38a730.png" />
        <input
          ref="search"
          :placeholder="$route.query.type==='gift'?'在结果中搜索商品':'请输入搜索关键字'"
          class="input"
          v-model="keyword"
          @click="toSearch()"
        />
      </div>
      <!-- 暂时隐藏单双列切换图标 -->
        <!-- <div class="search-icon" :class="switchViewValue ? 'smallIcon' : 'bigIcon'" @click="switchViewValue = !switchViewValue"></div> -->
    </div>
      <!-- 商家 -->
      <div class="storeBox" v-if="storeInfoData">
        <div class="storelogo">
          <img :src="storeInfoData.avatarPicture" alt />
        </div>
        <div class="store_xx">
          <p>{{ storeInfoData.storeName }}</p>
        </div>
        <div class="jumoStore" @click="jumpDeatail(storeInfoData.id)">
          进入店铺
          <img src="@/assets/img/you.png" alt style="width: 0.2rem; height: 0.36rem; margin-left: 0.12rem" />
        </div>
      </div>
      <!-- nav -->
      <ul class="result-sort wbox" :class="{ showWrap: sortWrapStyle }" :style="[{ 'z-index': filterBoxStyle ? '499' : '' }]">
        <template v-for="(item, index) in filterBoxList">
          <li class="wbox-flex" :key="index" :class="{ cur: filterItemIndex === index }" @click="filterChoose(item, index)">
            <div v-if="item.hasSort" :class="{myMenu: showTitle}">
              <dropdown-menu >
                <dropdown-item get-container=".box" @change="changePriceSort" :title="item.filterBoxName" v-model="priceSortValue" :options="priceSortOption" />
              </dropdown-menu>
            </div>
            <span v-else>
              {{item.filterBoxName}}
            </span>
            <div class="sort-type" v-if="item.hasSort">
              <img v-show="sortWrapIndex === 0 && filterItemIndex === index" src="../../assets/img/sort_up_select@2x.png" alt="" />
              <img v-show="sortWrapIndex === 0 && filterItemIndex === index" class="mt2" src="../../assets/img/sort_down@2x.png" alt="" />
              <img v-show="sortWrapIndex === 1 && filterItemIndex === index" src="../../assets/img/sort_up@2x.png" alt="" />
              <img v-show="sortWrapIndex === 1 && filterItemIndex === index" class="mt2" src="../../assets/img/sort_down_select@2x.png" alt="" />
              <img v-show="sortWrapIndex == -1 || filterItemIndex !== index" src="../../assets/img/sort_up@2x.png" alt="" />
              <img v-show="sortWrapIndex == -1 || filterItemIndex !== index" class="mt2" src="../../assets/img/sort_down@2x.png" alt="" />
            </div>
          </li>
        </template>
        <li style="height: 0.76rem; width: 1px; background-color: #e1e1e1; margin-top: 0.46rem"></li>
        <li class="wbox-flex" :class="{ cur: filterItemIndex === 3 && filterButtonActive }" @click="filterItemAttribute">
          筛选
          <img src="@/assets/img/sx.png" alt style="vertical-align: middle; margin: -0.08rem 0 0 -0.08rem; width: 0.56rem; height: 0.56rem" />
        </li>
      </ul>
      <div class="list-wrapper">
        <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" :disabled="true" :class="{ isfilterBoxVisible: filterBoxVisible ? true : false }">
          <div :class="{ overHeightBox: !switchViewValue }"></div>
          <!-- 商品列表 -->
          <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" :offset="300" finished-text=" 我也是有底线的~ " @load="onLoadList" v-if="spus && spus.length > 0" style="padding: 0.24rem 0.46rem">
            <div v-if="!isOld" style="overflow: hidden;">
              <productList  v-for="(item, index) in spus" ref="productList" :item="item" :key="index" :isLRLayout="true"></productList>
            </div>
            <ul class="clearfix searchlist-normal" :class="{ 'searchlist-square-pic': !switchViewValue }" :style="[{ 'background-color': switchViewValue ? '#fff' : '#f5f5f5' }, { padding: switchViewValue ? '0 0.46rem' : '0 0.38rem' }]">
              <li v-for="(item, e) in spus" :key="e" class="normal-list" @click="tospudetail(item)">
                <div class="pro-img" :class="[switchViewValue ? 'listclass' : 'shuclass']">
                  <img :src="item.url" style="text-align: center" />
                </div>
                <div class="product-info-box" :style="[
                { width: switchViewValue ? '59.71%' : '100%' },
                { margin: switchViewValue ? '' : '0.25rem 0 0 0.3rem' },
                { height: switchViewValue ? 'auto' : '3.92rem' },
              ]">
                  <div class="product-name" :class="[switchViewValue ? '' : 'productname']">{{ item.skuName }}</div>

                  <div class="product-price-m" :style="[{ 'margin-top': switchViewValue ? '1.96rem' : '0.48rem' }]" :class="[item.price > item.finalPrice && switchViewValue ? 'isactivetype' : item.price == item.finalPrice ? 'unfallprice' : 'unactivetype']">
                    <span v-if="item.afterCouponPrice" class="beforeCouponPriceCoin">¥</span>
                    <span class="beforeCouponPrice" v-if="item.afterCouponPrice">{{item.afterCouponPrice}}</span>
                    <span class="beforeCouponPriceLabel" v-if="item.afterCouponPrice">券后价</span>
                    <span class="hasAfterCouponPrice" v-if="item.afterCouponPrice">¥{{ item.isBatchSku == '1' ? item.lowestBatchPrice.toFixed(2) : item.finalPrice.toFixed(2) }}</span>
                    <em v-else>
                      ¥
                      <span class="price">{{ item.isBatchSku == '1' ? item.lowestBatchPrice.toFixed(2) : item.finalPrice.toFixed(2) }}</span>
                    </em>
                    <span class="oldPrice" v-if="item.price != item.finalPrice && !item.afterCouponPrice">¥{{ item.price }}</span>

                  </div>
                  <!-- 活动 -->
                  <div class="activebox" v-if="item.couponLabelList && item.couponLabelList.length">
                    <span class="copun-icon" v-for="(tag,index) in item.couponLabelList" :key="index">
                      {{ tag.text }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </van-list>
        </van-pull-refresh>
        <divider v-if="typeof spus === 'object' && spus.length === 0" style="padding: 38% 1.6rem" class="noneDara">
          <div class="noneBox">
            <img src="@/assets/img/bge.png" alt />
          </div>
          <p class="none_p1">没有搜索结果</p>
          <p class="none_p2">没有找到相关宝贝</p>
        </divider>
        <divider v-if="!spus" style="padding: 38% 1.6rem" class="noneDara">
          <div class="noneBox">
            <img src="@/assets/img/bge.png" alt />
          </div>
          <p class="none_p1">加载商品信息</p>
        </divider>
      </div>

    </div>
    <div v-else class="scrolltopBox search-result" :class="[showTitle ? 'moveDown' : 'moveup']" :style="[{ 'z-index': filterBoxStyle ? '499' : '1001' }]">
      <!-- 搜索 -->
      <!-- <group class="search-group" style="position: unset">
        <div class="search-left-arrow" @click="toBack"></div>
        <x-input ref="search" :placeholder="$route.query.type==='gift'?'在结果中搜索商品':'请输入搜索关键字'" v-model="searchParam.queryString" class="search-input"  @click.native="toSearch">
          <i class="goods-search" slot="label"></i>
        </x-input> -->
      <!-- </group> -->
      <!-- 搜索框 -->
    <div class="search-group">
      <img class="search-left" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search-toback-black-icon.png" alt @click="toBack()" />
      <div class="inputBox">
        <img class="left-icon" src="https://wsjc-web.wsecar.com/wsf-mall/home/search.png" />
        <input
          ref="search"
          :placeholder="$route.query.type==='gift'?'在结果中搜索商品':'请输入搜索关键字'"
          class="input"
          v-model="keyword"
          @click="toSearch()"
        />
      </div>
      <!-- 暂时隐藏单双列切换图标 -->
      <!-- <div class="search-icon" :class="switchViewValue ? 'smallIcon' : 'bigIcon'" @click="switchViewValue = !switchViewValue"></div> -->
    </div>
      <!-- 商家 -->
      <div class="storeBox" v-if="storeInfoData">
        <div class="storelogo">
          <img :src="storeInfoData.avatarPicture" alt />
        </div>
        <div class="store_xx">
          <p>{{ storeInfoData.storeName }}</p>
        </div>
        <div class="jumoStore" @click="jumpDeatail(storeInfoData.id)">
          进入店铺
          <img src="@/assets/img/you.png" alt style="width: 0.2rem; height: 0.36rem; margin-left: 0.12rem" />
        </div>
      </div>
      <!-- nav -->
      <ul class="result-sort wbox" :class="{ showWrap: sortWrapStyle }" :style="[{ 'z-index': filterBoxStyle ? '499' : '' }]">
        <!-- 综合 销量 最新上架 -->
        <template v-for="(item, index) in filterBoxList">
          <li class="wbox-flex" :key="index" :class="{ cur: filterItemIndex === index }" @click="filterChoose(item, index)">
            <div v-if="item.hasSort" :class="{myMenu: showTitle}">
              <dropdown-menu>
                <dropdown-item get-container=".box" @change="changePriceSort" :title="item.filterBoxName" v-model="priceSortValue" :options="priceSortOption" />
              </dropdown-menu>
            </div>
            <div class="title-name" v-else>
              {{item.filterBoxName}}
              <span class="subscript"></span>
            </div>
            <div :class="['sort-type',sortType?'active-sort-type':'']" v-if="item.hasSort">
              <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/down.png" />
            </div>
          </li>
        </template>
        <!-- 线 -->
        <li style="height: 12px; width: 1px; background-color: #e1e1e1; margin-top: 14px"></li>
        <!-- 切换单双列图 -->
        <li class="wbox-change-list" @click.stop="isBroadwise=!isBroadwise">
          <img  v-show="isBroadwise" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/broadwise_list.png" />
          <img  v-show="!isBroadwise" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/direction_list.png" />
        </li>
        <!-- 线 -->
        <li style="height:12px; width: 1px; background-color: #e1e1e1; margin-top: 14px"></li>
        <!-- 筛选 -->
        <li class="wbox-flex condition" :class="{ cur: filterItemIndex === 3 && filterButtonActive }" @click="filterItemAttribute">
          筛选
          <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/screening.png" alt style="vertical-align: middle; margin: -0.06rem 0 -0.08rem; width: 0.56rem; height: 0.56rem" />
        </li>
      </ul>
      <div v-if="$route.query.type==='gift'" class="explain">以下商品可使用面值{{$route.query.cardPrice || 0}}元的礼品卡进行购买</div>
      <div class="list-wrapper">
        <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" :disabled="true" :class="{ isfilterBoxVisible: filterBoxVisible ? true : false }">
          <div :class="{ overHeightBox: !switchViewValue }"></div>
          <!-- 商品列表 -->
          <van-list v-model="isUpLoading" :finished="upFinished" :immediate-check="false" :offset="300" finished-text=" 我也是有底线的~ " @load="onLoadList" v-if="spus && spus.length > 0" :style="!isOld?'padding: 10px 12px':'padding: 10px 8px'" >
            <div v-if="!isOld">
              <div v-if="isBroadwise">
                <productList v-for="(item, index) in spus" ref="productList" :item="item" :key="index" :isLRLayout="true" @shareComm="$refs.distributionShare.shareComm(1, item)"></productList>
              </div>
              <div v-else>
                <waterfall class="waterfall" ref="waterfall" :data="spus" :storeId="storeId" :isEmpty="! typeof spus === 'object' && spus.length === 0" :isbot="false" @shareComm="(item) => $refs.distributionShare.shareComm(1, item)"/>
              </div>
            </div>
            <ul v-else class="clearfix searchlist-normal" :class="{ 'searchlist-square-pic': !switchViewValue }" :style="[{ 'background-color': switchViewValue ? '#fff' : '#f5f5f5' }, { padding: switchViewValue ? '0 0.46rem' : '0 0.38rem' }]">
              <li v-for="(item, e) in spus" :key="e" class="normal-list" @click="tospudetail(item)">
                <div class="pro-img" :class="[switchViewValue ? 'listclass' : 'shuclass']">
                  <img :src="item.url" style="text-align: center" />
                </div>
                <div class="product-info-box" :style="[
                { width: switchViewValue ? '59.71%' : '100%' },
                { margin: switchViewValue ? '' : '0.25rem 0 0 0.3rem' },
                { height: switchViewValue ? 'auto' : '3.92rem' },
              ]">

                  <div class="product-name" :class="[switchViewValue ? '' : 'productname']">{{ item.skuName }}</div>
                  <div class="product-price-m" :style="[{ 'margin-top': switchViewValue ? '30px' : '0.48rem' }]" :class="[item.price > item.finalPrice && switchViewValue ? 'isactivetype' : item.price == item.finalPrice ? 'unfallprice' : 'unactivetype']">
                    <span v-if="item.afterCouponPrice" class="beforeCouponPriceCoin">¥</span>
                    <span class="beforeCouponPrice" v-if="item.afterCouponPrice">{{item.afterCouponPrice}}</span>
                    <span class="beforeCouponPriceLabel" v-if="item.afterCouponPrice">券后价</span>
                    <span class="hasAfterCouponPrice" v-if="item.afterCouponPrice">¥{{ item.isBatchSku == '1' ? item.lowestBatchPrice.toFixed(2) : item.finalPrice.toFixed(2) }}</span>
                    <em v-else>
                      ¥
                      <span class="price">{{ item.isBatchSku == '1' ? item.lowestBatchPrice.toFixed(2) : item.finalPrice.toFixed(2) }}</span>
                    </em>
                    <span class="oldPrice" v-if="item.price != item.finalPrice && !item.afterCouponPrice">¥{{ item.price }}</span>
                  </div>
                  <!-- 分销 搜索 -->
                  <template v-if="$route.query.from=='/distributionActivity'">
                    <div class="distribution_gain" v-if="!$route.query.promoteInfo">赚 <span>¥{{item.commissionAmount ? item.commissionAmount.toFixed(2) : '0.00'}}</span></div>
                    <div v-if="!!$route.query.promoteInfo"  :class="switchViewValue?'distribution_buy':'distribution_buy switch'">立即购买</div>
                    <div v-else :class="switchViewValue?'distribution_buy':'distribution_buy switch'" :style="{width:switchViewValue?'60px':'36px'}" @click.stop="$refs.distributionShare.shareComm(1, item)">分享</div>
                  </template>
                  <!-- 活动 -->
                  <div class="activebox" :class="{'switchViewValue': !switchViewValue}" v-if="item.couponLabelList && item.couponLabelList.length">
                    <span class="copun-icon" v-for="(tag,index) in item.couponLabelList" :key="index">
                      {{ tag.text }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </van-list>
        </van-pull-refresh>
        <divider v-if="typeof spus === 'object' && spus.length === 0" style="height: 100%;padding: 38% 1.6rem" class="noneDara">
          <div class="noneBox">
            <img src="@/assets/img/bge.png" alt />
          </div>
          <p class="none_p1">没有搜索结果</p>
          <p class="none_p2">没有找到相关宝贝</p>
        </divider>
        <divider v-if="!spus" style="height: 100%;padding: 38% 1.6rem" class="noneDara">
          <div class="noneBox">
            <img src="@/assets/img/bge.png" alt />
          </div>
          <p class="none_p1">加载商品信息</p>
        </divider>
      </div>

    </div>
    <!-- 筛选弹窗  @touchmove.prevent -->
    <div touchmove.native.stop.prevent style="overflow: hidden" class="popupBox">
      <popup v-model="filterBoxVisible" position="right" width="85%" class="popCover" @on-show="filterBoxStyle = true" @on-hide="toSearchSpus()" :safe-area-inset-bottom="true" lock-scroll="true" @touchmove.prevent style="overscroll-behavior: contain; z-index: 888">
        <div class="filterbox">
          <div class="clearfix">
            <div style="background-color: #fff; border-radius: 0px 0px 10px 10px">
              <p style="font-size: 14px; font-weight: 600; padding: 20px 0 0 18px">服务/折扣</p>
              <div class="filtrate" style="background-color: unset; padding-bottom: 8px">
                <div @click="
                    () => {
                      this.freeShipping = !this.freeShipping
                    }
                  ">
                  <span :class="freeShipping ? 'active' : ''">包邮</span>
                </div>
                <div @click="
                    () => {
                      this.promotion = !this.promotion
                    }
                  ">
                  <span :class="promotion ? 'active' : ''">促销</span>
                </div>
                <div @click="
                    () => {
                      this.hasSku = !this.hasSku
                    }
                  ">
                  <span :class="hasSku ? 'active' : ''">仅看有货</span>
                </div>
                <!-- <div @click="() => { this.filterStore = !this.filterStore}">
                <span :class="filterStore ? 'active' : ''">商城自营</span>
              </div> -->
              </div>
            </div>

            <div style="background-color: #fff; border-radius: 0px 0px 10px 10px">
              <p style="font-size: 14px; font-weight: 600; padding: 20px 0 15px 18px">价格区间</p>
              <div class="filtrate" style="background-color: unset; padding-left: 18px">
                <input type="number" class="inputbox" placeholder="最低价" v-model.number="priceRange.min" />

                <span style="margin: 0 10px; color: #666; display: flex; align-items: center; margin-top: -1px">—</span>

                <input type="number" class="inputbox" placeholder="最高价" v-model.number="priceRange.max" />
              </div>
            </div>

            <div v-for="(item, key, index) in aggs" class="filterItem" :key="index">
              <div class="bottom-title" @click="showAll(item)">
                <span class="title">{{ key }}</span>
                <span class="selected">
                  <!-- <span v-for="(i, e) in item" :key="e">
                    <span class="selectedSign">、</span>
                    {{ i }}
                  </span> -->
                </span>
                <!-- <img style="width: 0.4rem; height: 0.24rem" v-if="item.isShowAll" src="../../assets/img/unfoldGray@2x.png" alt="" />
                <img style="width: 0.4rem; height: 0.24rem" v-else src="../../assets/img/packUpGray@2x.png" alt="" /> -->
              </div>
              <div class="btns" :class="{ showall: item.length }">
                <div v-for="(child, e) in item" :key="e" @click="filtersClick(key, child)">
                  <!-- @click="checkAttributeValue(child)" -->
                  <span :class="{ active: iscChooseBrandName(key, child, item) }">{{ child }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="index-bnts" @touchmove.prevent>
          <div @click="resetFilter">重置</div>
          <div class="submit" @click="submitFilter">确认</div>
        </div>
      </popup>
    </div>

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop">
      <img src="@/assets/img/goodsDetail/go_top.png" alt />
      <span>顶部</span>
    </div>

    <!-- 分享弹框 -->
    <distributionShare ref="distributionShare"></distributionShare>
  </div>
</template>

<script>
import { Group, XInput, Divider, Popup } from 'vux'
import { isWx, appBack } from '@/utils/utils'
import { searchSpus, searchAggregations } from '@/api/spulist'
import { getSpuDiscountList } from '@/api/mycoupon'
import { queryStoreInfo } from '@/api/storeindex'
import { visit, searchWordsVisit } from '@/api/visit'
import { List, PullRefresh, Toast, DropdownMenu, DropdownItem } from 'vant'
import  distributionShare  from '@/views/activities/distributionActivity/components/distributionShare.vue'
import {
  isMoney, //判断是否是金钱
  isNumber,
  isNum,
} from '@/utils/validate'
import productList from '@/components/commons/productList.vue'
import waterfall from '@/components/commons/waterfall.vue'
let maxPageNum = 0
export default {
  components: { Group, XInput, Divider, Popup, [List.name]: List, [PullRefresh.name]: PullRefresh, DropdownMenu, DropdownItem,distributionShare ,productList,waterfall},
  data() {
    return {
      // isOld: this.$route.query.from=='/distributionActivity'?true:false,// 是否是分销
      isOld: false,
      reset: false,
      isWx: isWx(), // 判断是否是微信
      storeInfo: {}, // 店铺信息
      storeId: this.$route.query.storeId, // 店铺id
      showSearch: false, // 是否显示搜索
      searchParam: {
        attributes: [], // 过滤的属性
        cateId: '-1', // 一级分类id
        pageNum: 0,
        pageSize: 10,
        // queryString: '', // 关键字搜索
        sortItems: [], // 排序
        storeId: this.$route.query.storeId,
        brandNames: [],
        // 二级分类Id
        secondCateId: '',
        // attributes: [], // 分类
        // brandNames: [], // 品牌

        // 三期上线接口异常，和小程序保持一致 接口通
        storeCateId: '-1',
        stockFilter: '-1',
        freeShipping: '-1',
        promotion: '-1',
        priceRange: {
          "min": "",
          "max": ""
        },
      }, // 搜索的参数
      filterBoxStyle: false, // 刷选窗显示隐藏的标记
      sortWrapStyle: false,
      filterItemName: '综合', //  第一个过滤的名称
      filterItemIndex: 0, // 过滤的item
      sortWrapIndex: -1, // 综合过滤 0 综合过滤 1 价格从低到高 2 价格从高到低
      filterBoxList: [
        {
          filterBoxName: '综合',
          hasSort: true,
        },
        {
          filterBoxName: '销量',
          hasSort: false,
        },
        {
          filterBoxName: '最新上架',
          hasSort: false,
        },
      ], // 筛选条件列表
      isStore: this.$route.query.storeId ? true : false, //是否是店铺商品搜索
      shopTopNavVisible: false,
      switchViewValue: true, // 大小图片
      sortWrapVisible: false,
      filterBoxVisible: false,
      aggs: [], // 聚合数据
      spus: '', // 商品信息
      filterStore: false, // 涮选中的店铺过滤
      hasSku: false, // 涮选中的仅看有货过滤
      hasLoadAgg: false, // 是否加载过聚合数据
      noMore: false, //没有更多
      loading: false, //正在加载

      isUpLoading: false,
      isDownLoading: false,
      upFinished: false,

      showTitle: false,
      storeInfoData: '', //店铺信息
      nostore: false,
      documentScrollTop: 0,
      isshowtop: false, // 回到顶部
      returntop: false, // 返回顶部

      chooseBrandNames: [], // 选中的品牌
      chooseAttributes: [], // 选中的分类
      freeShipping: false, // 包邮过滤
      promotion: false, // 促销过滤
      priceRange: {
        min: '',
        max: '',
      }, //  价格区间
      storeIds: [],
      priceSortValue: -1,
      priceSortOption: [
        { text: '综合排序', value: -1 },
        { text: '价格从低到高', value: 0 },
        { text: '价格从高到低', value: 1 },
      ],

      // 搜索框关键字
      keyword: '',
      isBroadwise:false, //单双列 切换
      sortType:true //综合下拉框是否开启
    }
  },
  computed: {
    //筛选按钮active状态
    filterButtonActive() {
      let flag = false, attributeFlag = false
      for (let i in this.chooseAttributes) {
        if (this.chooseAttributes[i].values && this.chooseAttributes[i].values.length > 0) {
          attributeFlag = true
        }
      }
      if (this.freeShipping || this.promotion || this.hasSku || this.priceRange.min || this.priceRange.max || attributeFlag || (this.chooseBrandNames && this.chooseBrandNames.length > 0)) {
        flag = true
      }
      return flag
    }
  },
  //从首页进搜索结果页 需要缓存首页传来的queryString为了搜索页的搜索框placeholder使用
  beforeRouteEnter(to, from, next) {
      if (from.path === '/'){
        sessionStorage.setItem('searchPlaceholder', to.query.queryString)
      }
      next()
  },
  created() {
    document.body.removeAttribute('class', 'gray-bg')
    // 判断是否是礼卡进入
    if (this.$route.query.storeids && this.$route.query.storeids.length) {
      this.searchParam.storeIds = [...this.$route.query.storeids]
    }
    // 设置查询的参数
    if (this.$route.query.queryString) {
      this.keyword = this.$route.query.queryString
      this.searchParam.queryString = this.$route.query.queryString
      searchWordsVisit({
        searchName: this.$route.query.queryString
      })
    }

    // 设置查询的分类
    if (this.$route.query.cateId) {
      this.searchParam.cateId = this.$route.query.cateId
    }

    // 通过点击-二级分类进来的-通过二级分类id去查询商品列表-关键字queryString 需要置空
    if (this.$route.query.secondCateId) {
      this.searchParam.secondCateId = this.$route.query.secondCateId
      this.searchParam.queryString = ''
    }

    // 设置店铺的分类
    if (this.$route.query.storeCateId) {
      this.searchParam.storeCateId = this.$route.query.storeCateId
    }

    // 是否是店铺搜索
    if (this.isStore) {
      this.searchParam.storeId = this.storeId
    }

    // 查询店铺信息
    if (this.isStore) {
      this.queryStoreInfo(this.storeId)
    }

    // this.setSearchParmas()

  },
  methods: {
    // 筛选条件点击事件
    filtersClick(key, item) {
      if (key === '品牌') {
        let keyIdx = this.chooseBrandNames.indexOf(item)
        if (keyIdx < 0) {
          this.chooseBrandNames.push(item)
        } else {
          this.chooseBrandNames.splice(keyIdx, 1)
        }
      } else {
        let keyIdx = this.chooseAttributes.findIndex((el) => {
          return el.name === key
        })
        if (keyIdx < 0) {
          this.chooseAttributes.push({ name: key, values: [item] })
        } else {
          let valIdx = this.chooseAttributes[keyIdx].values.indexOf(item)
          if (valIdx < 0) {
            this.chooseAttributes[keyIdx].values.push(item)
          } else {
            this.chooseAttributes[keyIdx].values.splice(valIdx, 1)
          }
        }
      }
      console.log(this.chooseAttributes, 'this.chooseAttributes')
      console.log(this.chooseBrandNames, 'this.chooseBrandNames')
    },
    // 返回筛选条件是否已经点击
    iscChooseBrandName(key, item, val) {
      if (key === '品牌') {
        return this.chooseBrandNames.indexOf(item) >= 0 || false
      } else {
        let keyIdx = this.chooseAttributes.findIndex((el) => {
          return el.name === key
        })
        console.log('keyIdx', keyIdx)
        if (keyIdx >= 0) {
          return this.chooseAttributes[keyIdx].values.indexOf(item) >= 0 || false
        } else {
          return false
        }
      }
    },
    visitFun(properties) {
      let data = {
        route: this.$route.path,
        routeName: '搜索页',
        userId: this.$store.getters.userId,
      }
      visit(data, properties)
    },
    // 进入店铺
    jumpDeatail(id) {
      if (!id) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.push({
          path: '/storeindex',
          query: { storeId: id },
        })
      }
    },
    // 滚动吸顶
    handleScroll() {
      if (!this.$refs.backTop) return
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop) // 取绝对值
      // 回到顶部
      if (scorllTop >= 2500) this.isshowtop = true
      else this.isshowtop = false

      // console.log(scorllTop, 'top')
      if (!this.storeInfoData) {
        if (scorllTop > 51) {
          if (scorllTop > this.documentScrollTop) {
            this.showTitle = true
          } else {
            this.showTitle = false
          }
        } else {
          this.showTitle = false
        }
      } else {
        if (scorllTop > 131) {
          if (scorllTop > this.documentScrollTop) {
            this.nostore = true
          } else {
            this.nostore = false
          }
        } else {
          this.nostore = false
        }
      }

      if (scorllTop > 125) {
        if (scorllTop > this.documentScrollTop) {
          this.showTitle = true
        } else {
          this.showTitle = false
        }
      } else {
        this.showTitle = false
      }

      this.documentScrollTop = JSON.parse(JSON.stringify(scorllTop))
    },
    // 回到顶部
    backtop() {
      if (this.isshowtop) this.returntop = true
      else this.returntop = false
    },
    // 查询店铺信息
    queryStoreInfo(storeId) {
      let that = this
      queryStoreInfo(storeId).then((res) => {
        if (res.flag && res.data) {
          that.storeInfo = res.data
        }
      })
    },
    // 设置搜索参数
    setSearchParmas() {
      this.searchParam.attributes = []
      this.searchParam.pageNum = 0
      this.searchParam.pageSize = 10
      this.searchParam.sortItems = []
      this.noMore = false
      this.spus = []
      // 选中的第一个过滤
      if (this.filterItemIndex == 0) {
        // 选中价格过滤
        if (this.sortWrapIndex === 0) {
          // 价格从低到高
          this.searchParam.sortItems.push({ field: 'price', order: 0 })
        } else if (this.sortWrapIndex === 1) {
          // 价格从高到低
          this.searchParam.sortItems.push({ field: 'price', order: 1 })
        } else {
          this.searchParam.sortItems = []
        }
        this.searchParam.brandNames = []
        this.searchParam.attributes = []
        // delete this.searchParam.storeId
      } else if (this.filterItemIndex == 1) {
        // 选中销量过滤
        this.searchParam.sortItems.push({ field: 'saleNum', order: 1 })
        this.searchParam.brandNames = []
        this.searchParam.attributes = []
        // delete this.searchParam.storeId
      } else if (this.filterItemIndex == 2) {
        // 综合过滤
        this.searchParam.sortItems.push({ field: 'skuUpTime', order: 1 })
        this.searchParam.brandNames = []
        this.searchParam.attributes = []
        // delete this.searchParam.storeId
      } else {
        // 过滤是否有货
        if (this.hasSku) {
          this.searchParam.stockFilter = 0
        } else {
          this.searchParam.stockFilter = null
        }

        // 过滤是否是自营
        if (this.filterStore) {
          this.searchParam.storeId = 0
        } else {
          // 如果店铺搜索则设置店铺id没有则删除属性
          if (this.isStore) {
            this.searchParam.storeId = this.storeId
          } else {
            delete this.searchParam.storeId
          }
        }
        this.aggs.forEach((agg) => {
          if (agg.key == '品牌') {
            let checkedBrands = agg.childs.filter((child) => child.isChecked).map((child) => child.key)
            if (checkedBrands.length > 0) {
              this.searchParam.brandNames = checkedBrands
            } else {
              this.searchParam.brandNames = []
            }
          } else {
            // 属性
            let checkedAttrValues = agg.childs.filter((child) => child.isChecked).map((child) => child.key)
            // console.log('我是循环内部:checkedAttrValues', checkedAttrValues)
            if (checkedAttrValues.length > 0) {
              console.log('我有值: checkedAttrValues', checkedAttrValues)
              let attribute = {}
              attribute.name = agg.key
              attribute.values = checkedAttrValues
              console.log('我生成了attribute', attribute)
              this.searchParam.attributes.push(attribute)
            } else {
              // this.searchParam.attributes = []
            }
          }
          if (
            this.searchParam.brandNames.length > 0 ||
            this.searchParam.attributes.length > 0 ||
            this.searchParam.stockFilter == 0 ||
            this.searchParam.storeId == 0
          ) {
            this.filterItemIndex = 3
          } else {
            this.filterItemIndex = 0
          }
        })
      }

      this.searchSpus()
    },
    onDownRefresh() {
      this.searchParam.pageNum = 0
      this.upFinished = false // 不写这句会导致你上拉到底过后在下拉刷新将不能触发下拉加载事件
      this.isDownLoading = true
      this.spus = []
      // this.isUpLoading = true
      this.searchSpus() // 加载数据
    },
    onLoadList() {
      // this.isUpLoading = true
      this.searchParam.pageNum++
      this.searchSpus()
    },
    // 搜索商品
    searchSpus() {
      // this.visitFun(this.searchSpus)
      let _self = this
      setTimeout(
        () => {
          _self.visitFun(_self.searchParam)
          // isDistribution 为1查分销商品
          searchSpus({..._self.searchParam,isDistribution:this.$route.query.from=='/distributionActivity'?1:''}).then((res) => {
            // console.log(res, '列表')
            this.searchParam.total = +res.data.esSearchResponse.total
            this.loading = false //数据请成功后
            _self.isUpLoading = false
            _self.isDownLoading = false
            let spus = res.data.esSearchResponse.datas || []
            // if (!spus || spus.length == 0) {
            //   _self.spus = []
            //   return
            // }
            // this.storeInfoData = res.data.storeInfo
            if (spus == null || spus.length === 0) {
              // 加载结束
              _self.upFinished = true
            }
            maxPageNum = Math.ceil(this.searchParam.total / 10)

            this.aggs = res.data.esSearchResponse.aggRes
            if (this.searchParam.pageSize > spus.length) {
              // 最后一页不足10条的情况
              _self.upFinished = true
            }
            // 处理数据
            if (_self.searchParam.pageNum === 0) {
              _self.spus = spus
            } else {
              _self.spus = _self.spus.concat(spus)
            }
            this.handleCouponList(spus)
          }).catch(() => {
            this.spus = []
          })
        },
        this.isDownLoading ? 100 : 0
      )
    },
    async handleCouponList(spus) {
      try {
        const getPopupParam = spus.map(ele=>{
          return {
            skuId: ele.skuId,
            spuId: ele.spuId,
            beforeCouponPrice: ele.finalPrice
          }
        })
        const res = await getSpuDiscountList(getPopupParam) || {}
        if(res.data) {
          this.spus = this.spus.map(item=>{
            let afterCouponPrice = '', couponLabelList=item.couponLabelList || []
            res.data.forEach(ele=>{
              if(item.skuId == ele.skuId) {
                afterCouponPrice = ele.afterCouponPrice
                couponLabelList = ele.couponLabelList
              }
            })
            couponLabelList = couponLabelList.map(tag=>{
              return {
                ...tag,
                text: tag.couponsType == 3?`立减￥${tag.faceValue}` : tag.couponsType == 2 ?`${tag.faceValue}折` : `满￥${tag.amountLimitation}减￥${tag.faceValue}`
              }
            })
            return {
              ...item,
              afterCouponPrice,
              couponLabelList
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    toBack() {
      appBack(this)
    },
    // 跳转到搜索页面
    toSearch() {
      // 分销首页搜索跳转到/shopSearch
      if(this.$route.query.from=='/distributionActivity'){
        // this.$router.replace({ path: '/shopSearch', query: { ...this.$route.query,searchValue: this.searchParam.queryString } })
        this.$router.replace({ path: '/search', query: { ...this.$route.query,searchValue: this.searchParam.queryString } })
        return
      }
      if (this.isStore) {
        this.$router.replace({ path: '/search', query: { storeId: this.storeId, searchValue: this.searchParam.queryString } })
      } else {
        if (this.$route.query.type && this.$route.query.type === 'gift') {
          this.$router.replace({ path: '/search', query: { cardPrice: this.$route.query.cardPrice, type: 'gift', storeIds: this.$route.query.storeids, searchValue: this.searchParam.queryString } })
        } else {
          // 从二级分类的入口进来-需要清空 queryString， 这里点击查询，跳转到查询页面，将参数找回就可以， keyword只是给用户看的
          let searchValue = this.searchParam.queryString || this.keyword
          this.$router.replace({ path: '/search', query: { searchValue: searchValue } })
        }
      }
    },
    // 跳转到商品详情页
    tospudetail(item) {
      // 分销购买商品
      if (this.$route.query.from=='/distributionActivity') {
        const isDistribution = !this.$route.query.promoteInfo
        return  this.$router.push({ path: '/spudetail', query: { sourceType: item.sourceType || 1,id: item.skuId, isDistribution, promoteInfo: this.$route.query.promoteInfo } })
      }
      let path = '/spudetail'
        let query = { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType }
        if(item.goodsSource == 4) {
          path = '/motorCar/detail',
          query = {skuId: item.actionParamId, storeId: item.storeId }
        }
        this.$router.push({ path, query})
    },
    // 筛选排序
    filterChoose(item, index) {
      this.sortType=!this.sortType

      this.isUpLoading = false
      this.isDownLoading = false
      this.upFinished = false
      if (this.loading) {
        return
      }
      if (this.filterItemIndex === index) return
      this.sortWrapIndex = !index ? -1 : 1
      if(!index) this.priceSortValue = this.sortWrapIndex
      this.filterItemIndex = index
      if (!item.hasSort) {
        this.filterItemIndex = index
        this.setSearchParmas()
      }
    },
    // 刷选属性
    filterItemAttribute() {
      this.filterBoxVisible = true
      // this.searchAggregations()
    },
    // 搜索商品聚合数据
    searchAggregations() {
      // 如果已经加载过聚合数据则直接返回
      if (this.hasLoadAgg) {
        return
      }
      const params = {}

      if (this.searchParam.cateId != -1) {
        params.cateId = this.$route.query.cateId
      }
      if (this.searchParam.queryString) {
        params.queryString = this.$route.query.queryString
      }

      if (this.searchParam.storeCateId) {
        params.storeCateId = this.$route.query.storeCateId
      }

      // 是否是店铺搜索
      if (this.isStore) {
        params.storeId = this.storeId
      }

      searchAggregations(params).then((res) => {
        this.hasLoadAgg = true
        if (res.aggRes) {
          const values = res.aggRes
          let filterParams = []
          let brandvalues = {}
          for (let key in values) {
            if (key == '品牌') {
              brandvalues = values[key]
            } else {
              let inparam = {}
              inparam.isShowAll = false
              inparam.childs = this.getAggChild(values[key])
              inparam.key = key
              filterParams.push(inparam)
            }
          }

          // 将品牌放入第一位
          let inparam = {}
          inparam.isShowAll = false
          inparam.childs = this.getAggChild(brandvalues)
          inparam.key = '品牌'
          filterParams.unshift(inparam)
          this.aggs = filterParams
        }
      })
    },
    //  设置刷选的参数
    getAggChild(childs) {
      let newChileds = []
      if (childs && childs.length > 0) {
        childs.map((child) => {
          let newChild = {}
          newChild.key = child
          newChild.isChecked = false
          newChileds.push(newChild)
        })
      }

      return newChileds
    },
    // 是否显示全部
    showAll(item) {
      // console.log(item, 'item')
      // item.isShowAll = !item.isShowAll
    },
    // 清除选项
    resetFilter() {
      // this.reset = true //是否重置
      // this.hasSku = false
      // this.filterStore = false
      // this.aggs.forEach((value) => {
      //   value.isShowAll = false
      //   value.childs.forEach((childValue) => {
      //     childValue.isChecked = false
      //   })
      // })
      this.isDownLoading = false
      this.chooseBrandNames = []
      this.chooseAttributes = []
      this.searchParam.brandNames = []
      this.searchParam.attributes = []
      this.searchParam.priceRange = this.priceRange = {
        min: '',
        max: '',
      }
      this.freeShipping = false
      this.promotion = false
      this.hasSku = false
      this.searchParam.stockFilter = -1
      this.searchParam.freeShipping = -1
      this.searchParam.promotion = -1
      this.searchSpus()
    },
    // 确认刷选
    submitFilter() {
      // if (this.priceRange.min < 0 ) {
      //   Toast('请输入大于0的数字')
      //   this.priceRange.min = ''
      //   return
      // }
      // if (this.priceRange.min < 0) {
      //   Toast('请输入大于0的数字')
      //   this.priceRange.min = ''
      //   return
      // }
      let min = this.priceRange.min
      let max = this.priceRange.max
      if (max < 0 && min < 0) {
        Toast('请输入大于0正整数')
        this.priceRange.min = ''
        this.priceRange.max = ''
        return
      }

      if (min < 0) {
        console.log(typeof min, 'typeof min')
        Toast('请输入大于0正整数')
        this.priceRange.min = ''
        return false
      }
      if (max < 0) {
        Toast('请输入大于0正整数')
        this.priceRange.max = ''
        return false
      }
      if (min > max) {
        Toast('最高价不得小于最低价')
        this.priceRange.min = ''
        this.priceRange.max = ''
        return false
      }

      if (this.freeShipping) {
        this.searchParam.freeShipping = 1
      } else {
        this.searchParam.freeShipping = -1
      }
      if (this.promotion) {
        this.searchParam.promotion = 1
      } else {
        this.searchParam.promotion = -1
      }
      // 过滤是否有货
      if (this.hasSku) {
        this.searchParam.stockFilter = 1
      } else {
        this.searchParam.stockFilter = -1
      }
      console.log(this.chooseBrandNames, 'this.chooseBrandNames')
      console.log(this.chooseAttributes, 'this.chooseAttributes')
      console.log(this.priceRange, 'this.priceRange')
      this.searchParam.brandNames = this.chooseBrandNames
      this.searchParam.attributes = this.chooseAttributes
      this.searchParam.priceRange = this.priceRange

      this.filterBoxVisible = false

      if (
        this.searchParam.attributes.length > 0 ||
        this.searchParam.brandNames.length > 0 ||
        this.searchParam.priceRange.min ||
        this.searchParam.priceRange.max ||
        this.searchParam.stockFilter >= 0 ||
        this.searchParam.freeShipping >= 0 ||
        this.searchParam.promotion >= 0
      ) {
        this.filterItemIndex = 3
      }
      this.searchSpus()
    },
    // 选中属性值
    // checkAttributeValue(attrValue) {
    //   console.log(attrValue)
    //   attrValue.isChecked = !attrValue.isChecked
    // },
    // 涮选搜索商品
    toSearchSpus() {
      // this.filterBoxStyle = false
      // this.setSearchParmas()
      // this.searchSpus()
      // this.$refs.scroller.finishInfinite(false)
    },
    changePriceSort(val) {
      this.sortWrapIndex = val
      this.setSearchParmas()
    }
  },
  watch: {
    isshowtop(value) {
      if (!value) this.returntop = false
    },
    filterBoxVisible: function (val) {
      console.log('监听', val)

      if (val == true) {
        document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handleScroll, { passive: false }) // 阻止默认事件
        window.addEventListener('touchmove', this.handleScroll, false)

        document.getElementsByTagName('body')[0].addEventListener('scroll', this.handleScroll, { passive: false }) // 阻止默认事件
        window.addEventListener('scroll', this.handleScroll, false)
      }
    },
    switchViewValue: function (value) {
      if (!value && this.storeInfoData) {
        document.querySelector('body').setAttribute('style', 'background-color:#f5f5f5')
      } else {
        document.querySelector('body').removeAttribute('style')
      }
    }
  },
  mounted() {
    this.searchSpus() // 查询
    // 滚动条的获取
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    // 销毁背景色
    document.querySelector('body').removeAttribute('style')
    document.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<style scoped lang="less">
.wbox-change-list{
  padding-top:1px;
  width: 16px;
  height: 100%;
  margin: 0 12px;
  img{
    width: 100%;
    height:16px;
  }
}
/deep/.van-list__finished-text{
    color: #C3C3C3 !important;
    line-height: 14px;
    padding: 10px 0  40px;
    font-size: 11px;
  }
.isfilterBoxVisible {
  position: fixed;
  left: 0;
  top: 3.72rem;
  bottom: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
}
.isactivetype {
  margin-top: 1.2rem !important;
  margin-bottom: 0.2rem !important;
}

.unactivetype {
  // margin-top: 1.2rem !important;
  margin-bottom: 0.24rem !important;
}
.unfallprice {
  margin-bottom: 0;
}
.activebox {
  display: flex;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
  &.switchViewValue {
    margin-top: 0;
  }
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
      border-radius: unset !important;
    }
    .downprice {
      position: absolute;
      top: -0.06rem;
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
    }
  }
  .fullgivebox {
    position: relative;
    margin-right: 0.16rem;
    width: 0.54rem;
    height: 0.54rem;
    .fullgive {
      font-size: 0.48rem;
      transform: scale(0.82);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #e60113;
    }
  }
  .fullgivebox::after {
    border-radius: 0.08rem;
    border-color: #e60113;
  }
  .copun-icon {
    padding: 0 2px;
    border: 1px solid #FD302C;
    border-radius: 2px;
    color: #FD302C;
    font-size: 10px;
    margin-right: 4px;
    margin-bottom: 4px;
  }
}
.vux-popup-animate-top-enter,
.vux-popup-animate-top-leave-active {
  transform: none !important;
}

.vux-popup-animate-top-enter,
.vux-popup-animate-top-leave-active {
  transform: none !important;
}

.vux-popup-animate-top-leave-active {
  transition-duration: 100ms !important;
}
//搜索结果页
.search-result{
  .wbox-flex {
    .title-name,/deep/.van-ellipsis{
      font-size: 13px;
    }
    .title-name, /deep/.van-dropdown-menu__bar {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .subscript, /deep/.van-dropdown-menu__bar::after{
      position: relative;
      bottom: 5px;
      content: "";
      width: 26px;
      height: 4px;
      background-color:#fff;
      border-radius: 5px;
    }
    .subscript{
      display: inline-block;
      bottom: 7.5px;
    }
  }
  .cur {
    color: #191919;
    font-weight: bold;
    .subscript, /deep/.van-dropdown-menu__bar::after {
      background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/search-list/slither.png');
      background-size: 26px 4px;
    }
    /deep/.van-ellipsis {
      color: #191919;
      font-weight:bold;
    }
    /deep/.van-cell__title{
        font-weight: 400;
    }
  }
  .condition{
    font-size: 13px;
    padding-bottom: 4px;
    img{
      width: 16px !important;
      height: 17px !important;
      margin-left: 6px !important;
    }
  }
  .sort-type{
    -webkit-transform: rotate(180deg);
		transition: all 1s;
		transform: rotate(180deg);
    img{
      width: 4px;
      height: 4px;
    }
  }
  .active-sort-type{
    -webkit-transform: rotate(0deg);
		transform: rotate(0deg);
  }
}
.result-sort {
  position: unset;
  // box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.04);
}

.result-sort li {
  border-bottom: 0;
  color: #000000;
}

.result-sort li.cur {
  color: #000000;
  /deep/ .van-ellipsis {
    color: #000000;
  }
}

.sort-wrap li.cur {
  color: #000000 !important;
}

.result-sort li:first-child .arrow {
  top: 1px;
  // vertical-align: middle;
}

.result-sort li:first-child .arrow:after {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.16rem;
  transform: rotate(180deg);
  border-color: transparent transparent #e60113 transparent;
}

.result-sort li:first-child .firstNavli:after {
  border-color: transparent transparent #000 transparent;
}

.result-sort li:first-child .arrowactive {
  top: --0.12rem;
  // vertical-align: middle;
}

.result-sort li:first-child .arrowactive:after {
  transform: rotate(0deg);
}

.searchlist-normal {
  padding: 0rem 0.38rem;
  background-color: #fff;
}

.searchlist-normal .normal-list {
  margin-bottom: 0.48rem;
  border-radius: 0.2rem;
  padding-top: 0;
  height: auto;
  position: relative;
}

.searchlist-normal .normal-list .pro-img {
  height: 5.6rem;
  // width: 69%;
  margin-left: 0;
}

.searchlist-normal .normal-list .listclass {
  width: 40.645%;
  border-radius: 0.2rem;
  // overflow: hidden;
}

.searchlist-normal .normal-list img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  border: none;
  border-radius: 0.2rem;
}

.searchlist-normal .normal-list .product-info-box {
  margin-top: 0.15rem;
  width: 58.3%;
  .distribution_buy{
    position: absolute;
    bottom: 8px;
    right: 12px;
    // height: 28px;
    background: #FD302C;
    border-radius: 4px;
    font-weight: 500;
    color: #FFFFFF;
    font-size: 14px;
    text-align: center;
    line-height: 14px;
    // padding: 0 12px;
    padding: 7px 0;
    width: 80px;
  }
  .switch{
    font-size: 12px;
    // height: 20px;
    padding: 4px 0;
    line-height: 12px;
    width: 60px;
  }
  .distribution_gain{
    position: absolute;
    bottom: 8px;
    left: 0;
      background: linear-gradient(290deg, rgba(254, 103, 128, 0.12) 0%, rgba(255, 22, 61, 0.12) 100%);
      border-radius: 2px;
      color: #FD302C;
      padding: 0 4px;
      line-height: 14px;
      font-size: 10px;
  }
}
// .searchlist-square-pic .normal-list .product-info-box{
//     .distribution_gain{
//       bottom: 14px;
//     }
// }


.searchlist-square-pic .normal-list .product-info-box .productname {
  overflow: hidden; /*超出部分隐藏*/
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
  width: 100%; /*需要配合宽度来使用*/
  display: block !important;
  height: 0.8rem;
  line-height: 0.8rem;
}

// .searchlist-square-pic {
//   background: linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
//   background: -moz-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
//   background: -webkit-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
//   background: -webkit-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
//   background: -o-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
//   background: -ms-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
// }

.searchlist-square-pic .normal-list {
  width: 47.4%;
  margin: 0px 1.3% 0.36rem;
  border: 0;
}

.searchlist-square-pic .normal-list .product-info-box {
  height: 3.32rem;
  position: relative;
}

.searchlist-normal .normal-list .product-info-box .product-name {
  color: #000;
  display: -webkit-box;
}

.searchlist-normal .normal-list .product-info-box:after {
  display: none;
}

.searchlist-normal .normal-list .product-info-box .product-price-m .oldPrice {
  display: inline-block;
  font-size: 0.48rem;
  text-decoration: line-through;
  color: #999;
  transform: scale(0.92);
  margin-left: 0.08rem;
  margin-top: 0.04rem;
}
.searchlist-normal .normal-list .product-info-box .product-price-m .beforeCouponPriceCoin {
  font-size: 12px;
  color: #FD302C;
  font-weight: bold;
}
.hasAfterCouponPrice {
  font-size: 10px;
  color: #666;
  font-weight: normal;
  margin-left: 6px;
}
.searchlist-normal .normal-list .product-info-box .product-price-m .beforeCouponPriceLabel {
  color: #FD302C;
  font-size: 12px;
  font-weight: normal;
}
.searchlist-normal .normal-list .product-info-box .product-price-m .beforeCouponPrice{
  color: #FD302C;
  font-size: 18px;
  margin-right: 2px;
  font-weight: bold;
}

.searchlist-normal .normal-list .product-info-box .product-price-m em {
  font-size: 0.48rem;
  font-family: PingFangSC-Regular, PingFang SC;
}

.searchlist-normal .normal-list .product-info-box .product-price-m em span.price {
  font-size: 0.7rem;
  // font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
}

.storeBox {
  // width: 100%;
  height: 2.8rem;
  margin: 0.2rem 0.4rem;
  padding: 0 0.48rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  border-radius: 0.24rem;

  .storelogo {
    width: 10%;

    img {
      width: 1.28rem;
      height: 1.28rem;
    }
  }

  .store_xx {
    width: 66%;
    font-size: 0.56rem;
    color: #000;
    text-align: left;
    margin-left: 0.48rem;

    .store_gz {
      font-size: 0.4rem;
      color: #666;
      margin-left: -0.48rem;
      transform: scale(0.9);
    }
  }

  .jumoStore {
    text-align: right;
    width: 24%;
    color: #333;
  }
}

.store {
  .storeInfo {
    color: #888;
    font-size: 0.48rem;
    height: 1.2rem;
    line-height: 1.2rem;
    display: flex;

    .storename {
      margin-right: 0.4rem;
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      max-width: 60%; /*需要配合宽度来使用*/
    }

    .jumpstore {
      position: relative;
      display: inline-block;

      img {
        width: 0.2rem;
        height: 0.36rem;
        margin-left: 0.12rem;
        position: absolute;
        top: 50%;
        left: unset;
        margin-top: -0.184rem;
      }
    }
  }
}
.search-group {
    display: flex;
    align-items: center;
    padding: 12px;
    background: none;

    position: static !important;
    .search-left {
      width: 20px;
      height: 20px;
    }

    .inputBox {
      background: #f2f2f2;
      border-radius: 19px;
      width: 100%;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 2px 0px 8px;
      margin-left: 12px;
      .left-icon {
        width: 16px;
        height: 16px;
      }
      .input {
        flex: 1;
        padding: 0px 12px 0px 8px;
        height: 100%;
        border-top-right-radius: 19px;
        border-bottom-right-radius: 19px;
        background: #f2f2f2;
      }
      .search-icon {
        width: 62px;
        height: 28px;
        border-radius: 19px;
        color: #fff;
        justify-content: space-around;
        align-items: center;
        margin: 0px !important;
        font-size: 14px;
        font-weight: 400;
        background: linear-gradient(90deg, #ff6b4e 0%, #ff0a35 100%) !important;
      }
    }
  }
.searchlist-normal .normal-list .product-info-box .gray-pro-info {
  margin-top: 0.32rem;
}

.spuListScroll /deep/ .loading-layer {
  background: #f5f5f5;
  margin-top: -0.48rem;
}

.searchlist-normal .normal-list .shuclass {
  width: 100%;
  border-radius: 0.2rem 0.2rem 0 0;
  .distribution_buy{
    height: 20px;
    line-height: 20px;
  }
}

.searchlist-normal .normal-list .shuclass img {
  border-radius: 0.2rem 0.2rem 0 0;
}


.box {
  height: 100%;
  padding: 0;
  padding-top: 3.72rem;
}

/*商品列表*/
.smallIcon {
  background: url('../../assets/img/shu.png') no-repeat center center;
  background-size: 85%;
}

.bigIcon {
  background: url('../../assets/img/list.png') no-repeat center center;
  background-size: 85%;
}

.scrolltopBox {
  display: block;
  width: 100%;
  height: 100vh;
  z-index: 1001;
  background-color: #fff;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  .list-wrapper {
    flex: 1;
    overflow-y: auto;
    background-color:#F6F6F6  ;
  }
  .explain {
    height: 1.52rem;
    line-height: 1.52rem;
    padding-left: 0.4rem;
    margin: 0 0.46rem;
    background-color: #fff7ea;
    color: #e18f04;
    border-radius: 0.2rem;
  }
}

.noneDara {
  background-color: #fff;
  text-align: center;

  .noneBox {
    img {
      margin-bottom: 1.4rem;
    }
  }

  .none_p1 {
    font-size: 0.64rem;
    color: #666;
    margin-bottom: 0.48rem;
  }

  .none_p2 {
    font-size: 0.56rem;
    color: #999;
  }
}

.noneDara:before {
  background: none;
}

.noneDara:after {
  background: none;
}

.movenostoredown {
  -webkit-transform: translate3d(0, -5.24rem, 0);
  -moz-transform: translate3d(0, -5.24rem, 0);
  -o-transform: translate3d(0, -5.24rem, 0);
  transform: translate3d(0, -5.24rem, 0);
  -webkit-animation: movenostoredown 0.35s;
  -moz-animation: movenostoredown 0.35s;
  -o-animation: movenostoredown 0.35s;
  animation: movenostoredown 0.35s;
}

@keyframes movenostoredown {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
}

@-moz-keyframes movenostoredown /* Firefox */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
}

@-webkit-keyframes movenostoredown /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
}

@-o-keyframes movenostoredown /* Opera */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
}

.movenostoreup {
  -webkit-transform: translate3d(0, 0px, 0);
  -moz-transform: translate3d(0, 0px, 0);
  -o-transform: translate3d(0, 0px, 0);
  transform: translate3d(0, 0, 0);
  -webkit-animation: movenostoreup 0.35s;
  -moz-animation: movenostoreup 0.35s;
  -o-animation: movenostoreup 0.35s;
  animation: movenostoreup 0.35s;
}

@keyframes movenostoreup {
  from {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-moz-keyframes movenostoreup /* Firefox */ {
  from {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-webkit-keyframes movenostoreup /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-o-keyframes movenostoreup /* Opera */ {
  from {
    -webkit-transform: translate3d(0, -5.24rem, 0);
    -moz-transform: translate3d(0, -5.24rem, 0);
    -o-transform: translate3d(0, -5.24rem, 0);
    transform: translate3d(0, -5.24rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

.moveDown {
  -webkit-transform: translate3d(0, -2.04rem, 0);
  -moz-transform: translate3d(0, -2.04rem, 0);
  -o-transform: translate3d(0, -2.04rem, 0);
  transform: translate3d(0, -2.04rem, 0);
  -webkit-animation: moveDown 0.35s;
  -moz-animation: moveDown 0.35s;
  -o-animation: moveDown 0.35s;
  animation: moveDown 0.35s;
}

@keyframes moveDown {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
}

@-moz-keyframes moveDown /* Firefox */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
}

@-webkit-keyframes moveDown /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
}

@-o-keyframes moveDown /* Opera */ {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
}

.moveup {
  -webkit-transform: translate3d(0, 0px, 0);
  -moz-transform: translate3d(0, 0px, 0);
  -o-transform: translate3d(0, 0px, 0);
  transform: translate3d(0, 0px, 0);
  -webkit-animation: moveup 0.35s;
  -moz-animation: moveup 0.35s;
  -o-animation: moveup 0.35s;
  animation: moveup 0.35s;
}

@keyframes moveup {
  from {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-moz-keyframes moveup /* Firefox */ {
  from {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-webkit-keyframes moveup /* Safari 和 Chrome */ {
  from {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

@-o-keyframes moveup /* Opera */ {
  from {
    -webkit-transform: translate3d(0, -2.04rem, 0);
    -moz-transform: translate3d(0, -2.04rem, 0);
    -o-transform: translate3d(0, -2.04rem, 0);
    transform: translate3d(0, -2.04rem, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0px, 0);
    -moz-transform: translate3d(0, 0px, 0);
    -o-transform: translate3d(0, 0px, 0);
    transform: translate3d(0, 0px, 0);
  }
}

.sort-type {
  height: 42px;
  margin-left: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > img {
    width: 8px;
    &.mt2 {
      margin-top: 2px;
    }
  }
}

.wbox-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.overHeightBox {
  position: absolute;
  height: 4.8rem;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  background: -moz-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  background: -webkit-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  background: -webkit-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  background: -o-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
  background: -ms-linear-gradient(rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%) rgb(245, 245, 245);
}
.returntopBox {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 88px;
  right: 12px;
  width: 40px;
  height: 40px;
  z-index: 99;
  opacity: 0.8;
  background: #191919;
  border-radius: 20px;
  >img {
    margin-top: 4px;
    width: 14px;
    height: 18px;
  }
  span{
    font-size: 11px;
    font-weight: 400;
    color: #FFF;
  }
}
.backtopactive {
  position: fixed;
  top: 0;
}
.active {
  background-color: #fff;
  color: #e60113;
  border: 1px solid #e60113;
}
.inputbox {
  display: inline-block;
  width: 90px;
  height: 30px;
  background: #f2f2f2;
  border-radius: 15px;
  padding-left: 12px;
}

/deep/ .van-dropdown-menu__title::after {
  display: none;
}
/deep/ .van-dropdown-menu__title {
  padding: 0 2px;
  font-size: 0.6rem;
}
/deep/ .van-dropdown-menu__bar {
  box-shadow: none;
  height: 42px;
}


// /deep/ .van-dropdown-item--down {
//   transform: translate3d(0, 2.04rem, 0);
// }

// /deep/.van-dropdown-menu__bar{
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// }
// /deep/.van-dropdown-menu__bar::after{
//   position: relative;
//   bottom: 5px;
//   content: "";
//   width: 26px;
//   height: 4px;
//   background-color:#fff;
//   border-radius: 5px;
// }

/deep/ .van-dropdown-item {
  z-index: 1555;
  top: 98px !important;
}
</style>
