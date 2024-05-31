<template>
  <div class="boxwrapper" ref="backTop" :class="[returntop ? 'backtopactive' : '']" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <div class="headerboxwrapper">
      <div class="navtopbox" id="headerwrapper">
        <span class="topleftbox" @click="back">
          <van-icon name="arrow-left" class="iconLeftbox" />
        </span>
        <navBartop :title="'订单详情'" :isConfirm="false" @clickBack="back" class="navtop"></navBartop>
      </div>
      <header class="headerbox">
        <div class="headercontent">
          <div class="header_top">
            <img src="../../assets/img/wait-pay.png" alt="" class="headerimgsize" v-if="order.status == '1'" />
            <img
              src="../../assets/img/waiting.png"
              alt=""
              class="headerimgsize"
              v-if="order.status == '2' || order.status == '3' || order.status == '6' || order.status == '7'"
            />
            <img src="../../assets/img/finish.png" alt="" class="headerimgsize" v-if="order.status == '4'" />
            <img src="../../assets/img/cancel.png" alt="" class="headerimgsize" v-if="order.status == '5'" />
            <!-- <span class="orderstatus">正在出库</span> -->
            <span class="orderstatus orderstatus-one" v-if="order.status == '1'">等待付款</span>
            <span class="orderstatus" v-if="order.status == '2'">{{ order.backOrderLogVO && order.backOrderLogVO.status == '1' ? '退款申请中' : '正在出库' }}</span>
            <span class="orderstatus" v-if="order.status == '3'">{{ order.backOrderLogVO && order.backOrderLogVO.status == '1' ? '退款申请中' : '等待收货' }}</span>
            <span class="orderstatus" v-if="order.status == '4'">完成</span>
            <span class="orderstatus" v-if="order.status == '5' || order.status == '6' || order.status == '7'">已取消</span>
          </div>
          <span class="order_kd" v-if="order.status == '1'">
            <van-count-down :time="countdown" format="剩余00 时 mm 分 ss 秒自动关闭">
              <!-- <template #default="timeData">
                <span style="color: #fff">剩00时</span>
                <span style="color: #fff">剩{{ timeData.minutes }}分</span>
                <span style="color: #fff">{{ timeData.seconds }}秒自动关闭</span>
              </template> -->
            </van-count-down>
          </span>
          <span class="order_kd" v-if="order.status == '2' && (!order.backOrderLogVO || order.backOrderLogVO && order.backOrderLogVO.status != '1')">您的订单正在快马加鞭出库中</span>
          <span class="order_kd" v-if="order.status == '3' && (!order.backOrderLogVO || order.backOrderLogVO && order.backOrderLogVO.status != '1')">您的订单正在快马加鞭向您赶来</span>
          <span class="order_kd" v-if="!order.cancelReson && order.status == '5'">取消原因：超时未支付</span>

          <div class="topay" v-if="order.status == 1" @click="opeationOreder(order, '去支付')">去支付</div>
        </div>
      </header>
    </div>
    <van-notice-bar v-if="showNotice" left-icon="volume-o" :text="order.signContent">
      <template #left-icon>
          <img src="@/assets/img/icon_inform.png" class="left-icon" alt="" />
      </template>
    </van-notice-bar>
    <main
      class="contentboxwrapper"
      :class="{ statustop: order.status == '4' || order.status == '5' || order.status == '6' || (order.status == '7' && order.cancelReson) }"
    >
      <div class="addressboxwrapper bg_color">
        <ul class="orderaddressbox">
          <div v-if="(order.backOrderLogVO != null&& order.oldRefund==1)">
            <li class="order_cancel order_li" @click="torefundDetail(order,1)">
              <label>
                {{
                  order.backOrderLogVO
                    ? order.backOrderLogVO.backOrderLogDescVOs[0].message
                    : '取消/退款进度：您的订单已取消。如您使用了优惠券等，请查看取消进度详情。'
                }}
              </label>
              <img src="../../assets/img/cat_more@2x.png" class="order_yjt address_yjt" alt="" />
            </li>
            <span>{{ order.backOrderLogVO ? order.backOrderLogVO.backOrderLogDescVOs[0].createTime : '' }}</span>
          </div>
          <!--start 物流板块 虚拟商品无需展示-->
          <div v-if="order.orderType != 7 && (order.status == 2 || order.status == 3 || order.status == 4||order.status == 6) && order.splitLogistics == 0">
            <li class="order_logistics order_li" @click="toCheckLogistics(order, 1)">
              <label v-if="order.status == 2">您提交了订单，请等待发货</label>
              <label v-if="order.status == 3">{{ order.kdniaoTrackVO.tracesList ? order.kdniaoTrackVO.tracesList[0].acceptStation : '正在等待揽收' }}</label>
              <label v-if="order.status == 4 && order.deliverGoodsMode != 2">您的订单已签收，感谢您在万顺福购物，欢迎您再次光临!</label>
              <label v-if="order.status == 4 && order.deliverGoodsMode == 2">您的订单需要自行去门店提货,请尽快前往实体店门店提货,感谢您在万顺福购物,欢迎您再次光临!</label>
              <img src="../../assets/img/cat_more@2x.png" class="order_yjt address_yjt" alt="" v-if="order.status == 3 || (order.status == 4 && order.deliverGoodsMode != 2)" />
            </li>
            <!-- 2022.12.30推荐商品项目中提出改时间不准确，先注释掉 -->
            <!-- <span v-if="order.status != 6">{{ order.createTime }}</span> -->
          </div>
          <!--end 物流板块-->
          <!-- 收货地址 -->
          <li class="order_address order_li" v-if="order.orderAttr">
            <p class="addressbox_p">
              <label style="display: flex">
                <strong class="overline" style="margin-right: 0.28rem; max-width: 4.8rem; display: inline-block">
                  {{ order.orderAttr.receiptName ? order.orderAttr.receiptName : '' }}
                </strong>
                {{ order.orderAttr.receiptMobile | phoneSubstr }}
              </label>
              <!-- <em class="editaddress" v-if="order.status == '1'" @click="toaddressList()">修改</em>  -->
            </p>
            <p class="addressInfo">地址：{{ order.orderAttr.receiptAddress && order.orderAttr.receiptAddress.replace(/\,/g, '') }}{{ order.orderAttr.receiptDetailAddress }}</p>
          </li>
        </ul>
      </div>
      <!-- 订单商品 -->
      <div class="orderboxwrapper bg_color">
        <!-- <p class="storeheader">
          <label @click="tostore(order.storeId)">{{ order.storeName }}</label>
          <img src="../../assets/img/cat_more@2x.png" class="order_yjt" alt="" @click="tostore(order.storeId)" />
        </p> -->
        <div v-for="item in order.orderSkuWithMarketings" :key="item.id" class="goodsContainer">
          <div class="goodsbox">
            <!--start 虚拟商品标签显示-->
            <span v-if="order.orderType == 7" class="virtual_tag">虚拟</span>
            <!--end 虚拟商品标签显示-->
            <img :src="item.skuImage" class="goodsimg" alt="" @click="togoodsdetail(item)" />
            <div class="goodsinfo">
              <img src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/8129da13a13684f4d6ef799f54c72e97.png" class="btn" @click="addcart(item)">
              <p class="goodsname commomover" @click="togoodsdetail(item)">{{ item.skuName }}</p>
              <p class="goods_gg overline">
                <span style="margin-right: 0.36rem">数量:{{ item.num }}</span>
                {{ item.skuSpecs }}
              </p>
              <!-- 买送-->
              <span
                class="buygiveboxwrapper"
                v-for="r in item.marketingVos"
                :key="r.id"
                :style="{ 'margin-bottom': r.type == 12 ? '' : '0.56rem', display: r.type == 12 ? '' : 'inline-block' }"
              >
                <label class="buygivebox border_half" v-if="r.type == 12">
                  {{ r.name }}
                </label>
              </span>
              <p class="goodsprice" :style="{ 'margin-top': !item.marketingVos ? '0.72rem' : '' }">
                <span>¥ {{ item.skuPrice.toFixed(2) }}</span>
                <span class="performate-point" v-if="item.performanceScore && item.performanceScore>0">绩效分{{ item.performanceScore }}</span>
              </p>
              <div class="gift">
                <span style="color: #000" class="reality-price" v-if="item.valueCardPrice>0&&order.status != 1"><span style="color:#999">礼品卡抵扣:</span> ￥{{ item.valueCardPrice }}</span>
                <span style="color: #000" class="reality-price" v-if="order.status != 1 && item.skuPrice != item.unitPrice && order.status != 5 && order.orderType != 10"><span style="color:#999">实付单价</span>￥{{ item.unitPrice.toFixed(2) }}</span>
              </div>
            </div>
            <!-- <img src="../../assets/img/cat_o@2x.png" class="addcart" alt="" @click="addcart(item)" /> -->
          </div>

          <!-- 赠品 -->
          <div class="giveGiftbox" v-if="item.marketingVos">
            <div v-for="(temp, s) in item.marketingVos" :key="s" v-if="temp.type == 2">
              <div v-if="temp.fullGiftList.length > 0">
                <div v-for="g in temp.fullGiftList[0].giftSkuInfos" :key="g.id" class="goodsbox">
                  <img :src="g.url" class="goodsimg" alt="" />
                  <div class="goodsinfo">
                    <p class="goodsname commomover">{{ g.name }}</p>
                    <p class="goods_gg overline">
                      <span>数量:{{ g.num }}</span>
                      <label v-for="(r, e) in filterSkuSpecs(g.skuSpecValues)" :key="e">
                        <span>{{ r.name }}：{{ r.valueRemark }}</span>
                        <span class="goods_ggshu"></span>
                      </label>
                    </p>
                    <strong style="margin-top: 0.8rem; display: inline-block; font-size: 0.56rem">赠品</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer class="orderfooter">
            <div>
              <span
                  class="common_btn"
                  style="margin-right: 10px"
                  v-if="(item.isDelivery == 1 && order.splitLogistics == 1 && order.status != 1&& order.orderType != 7)"
                  @click="toCheckLogistics(item, 2)"
                >
                  查看物流
              </span>
              <span @click="torefundDetail(item)" v-if="[1,'1',3,'3'].includes(item.refundStatus)||(item.refundStatus == 2 && order.oldRefund != 1) ">{{refundTextMap[item.refundStatus]}}</span> 
              <span class="refund" v-if="([0,'0',3,'3'].includes(item.refundStatus) && order.canRefund && order.orderType != 10)" @click="orderOperation(item,'申请退款')">申请退款</span>
            </div>                                                              
          </footer>
          <!--start 虚拟商品无需显示-->

          <!--end 虚拟商品无需显示-->
        </div>
        <div class="goods_server">
          <img src="../../assets/img/service2.png" class="serverimg" alt="" />
          <span @click="callUp" style="color: #333">联系客服</span>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="ordercodeboxwrapper bg_color">
        <p class="ordercode_p" :class="{ isopenColor: isopen }" style="display:block">
          <label class="ordercode_label">订单编号:</label>
          <span class="ordercode">{{ order.orderCode }}</span>
          <span class="copy" @click="copyOrderCode(order.orderCode)"></span>
        </p>
        <div class="orderCodebox" v-show="!isopen">
          <p class="ordercode_p">
            <label class="ordercode_label">下单时间:</label>
            <span class="ordercode">{{ order.createTime }}</span>
          </p>
          <p class="ordercode_p" v-if="order.remark">
            <label class="ordercode_label">买家留言:</label>
            <span class="ordercode">{{ order.remark }}</span>
          </p>
          <div class="orderbottom"></div>
          <!-- <p class="ordercode_p">
            <label class="ordercode_label">支付方式:</label>
            <span class="ordercode">微信支付</span>
          </p> -->
          <div v-if="order.status != '1' && order.status != '5'">
            <p class="ordercode_p">
              <label class="ordercode_label">支付方式:</label>
              <span class="ordercode" v-if="order.payChannel == null">/</span>
              <span class="ordercode" v-else>{{ order.payChannel | payChannelDict }}</span>
            </p>
            <p class="ordercode_p">
              <label class="ordercode_label">支付时间:</label>
              <span class="ordercode">{{ order.payTime }}</span>
            </p>
            <div v-if="order.orderType != 7">
              <div class="orderbottom"></div>
              <!--虚拟商品无需展示-->
              <p class="ordercode_p">
                <label class="ordercode_label">配送方式:</label>
                <span class="ordercode">普通快递</span>
              </p>
            </div>
            <!--start 虚拟商品卡密信息模块 判断显示条件完成并且为虚拟订单-->
            <div v-if="order.orderType == 7 && order.status == 4">
              <div class="orderbottom"></div>
              <p class="ordercode_p" style="display: block">
                <label class="ordercode_label" style="vertical-align: top">卡密兑换链接:</label>
                <span class="ordercode" v-if="order.webUrlType == 0">
                  <a :href="order.webUrl" style="color: #007aff">{{ order.webUrl }}</a>
                </span>
                <img v-else :src="order.webUrl" alt="" style="width: 3.6rem; height: 3.6rem" />
              </p>
              <p class="ordercode_p camilo">
                <label class="ordercode_label">权益卡卡密:</label>
                <span class="ordercode">
                  <span v-for="(item, index) in camiloList" v-if="isOpenCamilo ? index < 4 : index < camiloList.length" :key="index" class="camilo_space">
                    <span>{{ item }}</span>
                    <span class="copy" @click="copyCamilo(item)"></span>
                  </span>
                </span>
              </p>
              <!--超过四个现实展开功能-->
              <div class="box_openclose" v-if="camiloList != null && camiloList.length > 4 && order.status != '1' && order.status != '5'">
                <span :class="isOpenCamilo ? 'open' : 'close'" @click="openCamilo">
                  {{ isOpenCamilo ? '展开全部卡密' : '收起' }}
                  <img src="../../assets/img/cat_Unfold_a@2x.png" v-if="!isOpenCamilo" alt="" />
                  <img src="../../assets/img/cat_Unfold@2x.png" v-else alt="" />
                </span>
              </div>
            </div>
            <!--end 虚拟商品卡密信息模块-->
            <div class="orderbottom"></div>
          </div>
          <div class="orderpricebox">
            <p class="order_price">
              <label>商品总额</label>
              <span v-if="order.totalSalePrice">¥{{ order.totalSalePrice.toFixed(2) }}</span>
            </p>
            
            <p class="order_price">
              <label>运费</label>
              <span>{{ order.freightPrice > 0 ? '+¥' + order.freightPrice.toFixed(2) : '+¥0.00' }}</span>
            </p>
            <p class="order_price copun_price" v-if="order.retailerCouponPrice && order.retailerCouponPrice > 0">
              <label>优惠</label>
              <span>-¥{{ order.retailerCouponPrice.toFixed(2) }}</span>
            </p>
            <p class="order_price" v-if="order.valueCardPrice>0">
              <label>礼品卡抵扣</label>
              <span>-¥{{ order.valueCardPrice }}</span>
            </p>
          </div>
        </div>
        <p class="ordertotalprice" :class="{ isopenActive: isopen }">
          <!-- <label class="ordertotal_title" style="margin-right: 16px" v-if="performanceScoreTotal > 0">绩效分总计：{{ performanceScoreTotal }}</label> -->
          <label class="ordertotal_title">{{ order.status == 1 || order.status == 5 ? '应付款' : '实付款' }}：</label>
          <span class="ordertotal_rmb">¥</span>
          <span class="ordertotal_price">{{ (order.price && order.price.toFixed(2)) || '0.00' }}</span>
        </p>
        <!--start 展开收起功能 虚拟迭代将此操作去掉[小程序目前没有此功能]-->
        <!--        <div class="box_openclose" v-if="order.status != '1' && order.status != '5'">-->
        <!--          <span @click="open">-->
        <!--            {{ isopen ? '展开' : '收起' }}-->
        <!--            <img src="../../assets/img/cat_Unfold_a@2x.png" v-if="!isopen" alt="" />-->
        <!--            <img src="../../assets/img/cat_Unfold@2x.png" v-else alt="" />-->
        <!--          </span>-->
        <!--        </div>-->
        <!--end 展开收起功能 虚拟迭代将此操作去掉[小程序目前没有此功能]-->
      </div>
    </main>

    <!-- 底部footer -->
    <footer class="orderfooterwrapper" :class="{ iscancle: order.status == 4 || order.status == 5 || order.status == 6 || order.status == 7 ? true : false,'needButtomSpace': isIOS }">
      <span
        v-if="order.status == 4 || order.status == 5 || order.status == 6 || order.status == 7"
        style="font-weight: bold; font-size: 0.56rem"
        @click="opeationOreder(order, '删除订单')"
      >
        删除订单
      </span>
      <div style="display:flex">
        <span class="orderfooter_com border_half" v-if="order.status != 5 && order.status != 6 && order.status != 7 && order.invoiceFlag!=1" @click="opeationOreder(order, '发票服务')">
          发票服务
        </span>
           <span class="orderfooter_com border_half" v-if="order.status != 5 && order.status != 6 && order.status != 7 &&order.invoiceFlag==1" @click="Invoicinged()">
          查看发票
        </span>
        <span class="orderfooter_com border_half" v-if="order.status == 1" @click="opeationOreder(order, '取消订单')">取消订单</span>
        <!-- <span class="orderfooter_com border_half" v-if="order.status == 2 || order.status == 3 || order.status == 6 || order.status == 7" @click="opeationOreder(order,'申请退款')">申请退款</span> -->
        <!-- <span class="orderfooter_com border_half" v-if="order.canRefund" @click="opeationOreder(order, '申请退款')">
          申请退款
        </span> -->
        <!-- <span class="orderfooter_com border_half" v-if="!order.canRefund && (order.status == 2 || order.status == 3)">退款中</span> -->
        <span class="orderfooter_com border_half orderfooter_true" v-if="order.status == 3" @click="opeationOreder(order, '确认收货')">
          确认收货
        </span>
        <span class="orderfooter_com border_half orderfooter_true" v-if="(order.orderType != 7 && order.status == 4) || order.status == 5 || order.status == 6 || order.status == 7" @click="opeationOreder(order, '再次购买')">
          再次购买
        </span>
        <span class="orderfooter_com border_half orderfooter_true" v-if="order.status == 1" @click="opeationOreder(order, '去支付')">去支付</span>
        <!-- <span class="orderfooter_com border_half" v-if="order.backOrderLogVO && order.backOrderLogVO.status == 1" @click="opeationOreder(order, '取消申请')">取消申请</span> -->
      </div>
    </footer>

    <!-- 热销商品 -->
    <div class="xq_wntj" style="margin-top: 0.4rem">
      <shopList v-if="orderCode" :title="'热销商品'" :titleImg="true" :orderCode="orderCode"></shopList>
    </div>

    <!-- 回到顶部  -->
    <!-- <div class="returntopBox" v-if="isshowtop">
      <img src="../../assets/img/top@2x.png" class="returntop" @click="backtop" alt="" />
    </div> -->

    <!-- 回到顶部 -->
    <div class="backtop" v-if="isshowtop" @click="backtop">
      <img src="@/assets/img/goodsDetail/go_top.png" alt />
      <span>顶部</span>
    </div>
    <!-- 二次确认弹窗 -->
    <SecondConfirm
      :title="titleTextMap[isType]"
      :cancleText="cancleTextMap[isType]"
      :sureText="sureTextMap[isType]"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
    ></SecondConfirm>

    <!-- 积分支付确认弹窗 -->
    <fqzConfirm ref="fqzConfirm" @confirm='confirmPay' :isWsorder='isWsorder'></fqzConfirm>

    <SecondConfirm
      :title="discountOrderType == 'cancelOrder' ? '以下订单需一起取消' : '以下订单需一起付款'"
      :cancleText="discountOrderType == 'cancelOrder' ? '直接买了' : '取消'"
      :sureText="discountOrderType == 'cancelOrder' ? '取消订单' : '付款'"
      :dialogshow="discountOrderDialog"
      :isNeedTouchClose="true"
      @closeBack="discountOrderCancel"
      @rightEvent="discountOrderConfirm"
      @handleCloseDialog="discountOrderDialog = false"
    >
      <div class="discount-order-container" slot="textp">
        <div class="order-auto-box">
          <div class="discount-order" v-for="(item, index) in discountOrderData.orderList" :key="index">
            <div class="discount-order-info">
              <div class="left-part">{{ item.storeName }}</div>
              <div class="right-part">￥{{ item.price }}</div>
            </div>
            <div class="discount-order-count">(共{{ item.orderSkus && item.orderSkus.length }}件)</div>
          </div>
        </div>
        <div class="order-total-box">
          <span class="text">订单合计金额：</span>
          <span class="symbol">￥</span>
          <span class="price">{{ discountOrderData.totalPrice }}</span>
        </div>
      </div>
    </SecondConfirm>

    <!-- 弹出层 -->
    <ordercancelpopup :isShowPoup="isShowPoup" :isShowCatSwitch="isVirtual" @closePoup="closePoup" @submitPoup="submitPoup"></ordercancelpopup>
    <orderAllpopup :isorderShowPoup.sync="isorderShowPoup" @input="isorderShowPoup = false" :isWsorder="isWsorder"></orderAllpopup>
  </div>
</template>

<script>
  import { Toast, Icon, CountDown, NoticeBar } from 'vant'
  import shopList from '@/components/commons/shopList'
  import navBartop from '@/components/commons/navBartop'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import ordercancelpopup from './ordercancelpopup'
  import { cancleApplySale } from '@/api/backorderlist'
  import orderAllpopup from './orderAllpopup.vue'
  import fqzConfirm from './fqzConfirm'
  import { judgeRefund } from '@/api/orderlist'
  import {
    queryOrderDetail,
    confirmReceipt,
    getCheckLogisticsUrl,
    deleteOrder,
    cancelOrder,
    settlementDetail,
    selectWsOrderInfoByOrderId,
    checkOrder,
    cancelOrderBatch,
  } from '@/api/orderlist'
  import { addShoppingCart } from '@/api/spudetail'
  let appData = JSON.parse(localStorage.getItem('appData'))
  import { appBack }  from '@/utils/utils'
  export default {
    components: {
      shopList,
      orderAllpopup, // 订单合并成大订单弹窗
      navBartop, // 顶部nav
      ordercancelpopup, // 取消弹出层
      SecondConfirm, // 二次确认
      [Icon.name]: Icon,
      [CountDown.name]: CountDown,
      [NoticeBar.name]: NoticeBar,
      fqzConfirm
    },
    data() {
      return {
        refundTextMap:{
          1: '退款中',
          2: '退款完成',
          3: '退款失败',
        },
        titleTextMap: {
          1: '确认删除此订单？',
          2: '您是否收到该订单商品？',
          3: '非自营订单的发票由商家开具， 具体金额以实际开票为准。如有疑问，请联系商家。',
          4: '确认取消退款申请？',
          5: '订单中存在退款申请中商品，确认收货则默认撤销申请!'
        },
        cancleTextMap: {
          1: '取消',
          2: '未收货',
          3: '取消',
          4: '再想想',
        },
        sureTextMap: {
          1: '删除',
          2: '已收货',
          3: '联系商家',
          4: '确认',
        },
        discountOrderData: {},
        discountOrderDialog: false,
        discountOrderType: '',
        skuId: null,
        orderCode: '',
        order: '', // 订单详情 order.status: 1 待付款/2 待发货/3 待收货/4 已完成/5 取消订单/6 退款通过/7 退货通过
        isopen: false, //  展开收起 此功能再虚拟商品迭代去掉，与卡密操作展开收起有冲突
        isshowtop: false, // 回到顶部
        returntop: false, // 返回顶部类
        isType: '', // 1 删除弹窗  2 确认收货弹窗  3发票服务弹窗
        dialogshow: false,
        isShowPoup: false, // 弹出层
        setTimer: null, // 定时器
        timeInteval: null, // 倒计时函数
        countdown: 1800, // 倒计时
        camiloList: [],
        isOpenCamilo: true, //权益卡密收起功能
        isVirtual: false, //虚拟商品标识
        isIOS:false,
        isorderShowPoup: false,
        isWsorder: {},
      }
    },
    computed: {
      performanceScoreTotal() {
        if (!this.order || !this.order.orderSkuWithMarketings) {
          return 0
        } else {
          let list = this.order.orderSkuWithMarketings,
            point = 0
          list.forEach((item) => {
            if (item.performanceScore && item.performanceScore > 0) {
              let num = item.performanceScore * item.num
              point = point + num
            }
          })
          return point
        }
      },
      // 是否显示疫情管控提示
      showNotice() {
        return (this.order.status == 2 || this.order.status == 3) && this.order.signType == 1
      }
    },
    watch: {
      isshowtop(value) {
        if (!value) this.returntop = false
      },
      countdown(value) {
        if (value == 0) {
          clearInterval(this.setTimer)
          clearInterval(this.timeInteval)
        }
      },
      '$route' (to, from) {
        if(to.path == from.path && from.path == "/orderdetail"){
          this.queryOrderDetail()
        }
      }  
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
    },
    created() {
      if (this.$store.getters.phoneType == 'Android') {
        this.isIOS = false
      } else {
        this.isIOS = true
      }
      console.log(this.$store.getters.phoneType,'手机类型----------*****');
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryOrderDetail()
      // this.settime()
      this.setTimer = setInterval(this.queryOrderDetail, 60000)
    },
    methods: {
      Invoicinged(){
      this.$router.push({
            path: '/Invoicinged',
            query: {
              id: this.order.id,
              price:this.order.price
            },
          })
      },
       //申请退款   
      async orderOperation(data, text) {
        if (text == '申请退款') {
          this.$router.push({
            path: 'refundorder',
            query: {
              orderSkuId:data.id,//订单商品ID
              orderId: data.orderId,//订单ID
            },
          })
        }
      },
      // 规格过滤
      filterSkuSpecs(data) {
        console.log('JSON.parse(data)', JSON.parse(data))
        return JSON.parse(data)
      },
      // 查询订单详情
      queryOrderDetail() {
        let that = this
        queryOrderDetail({ id: this.$route.query.orderId }).then((res) => {
          if (res.code == 200) {
            this.order = res.data
            this.skuId = res.data.orderSkuWithMarketings[0].skuId
            this.orderCode = res.data.orderCode
            if (this.order.status == 1) {
              let overtime = new Date(this.order.createTime.replace(/-/g, '/')).getTime() + 1800000
              let time = overtime - new Date().getTime()
              this.countdown = time
              if (this.countdown < 0) {
                that.autoSubmit({ addCart: false, reason: '订单超时自动取消' })
              } else {
                setTimeout(function() {
                  that.autoSubmit({ addCart: false, reason: '订单超时自动取消' })
                }, time)
              }

              // if (overtime - new Date().getTime() > 0) {
              //   let h = parseInt((time / 60 / 60) % 24)
              //   let m = parseInt((time / 60) % 60)
              //   let s = parseInt(time % 60)
              //   h = h > 9 ? h : '0' + h
              //   m = m > 9 ? m : '0' + m
              //   this.timedown = '剩' + h + '小时' + m + '分' + '自动关闭'
              // }
            }
            if (this.order.orderType == 7) {
              this.camiloList = this.order.virtualCardKeyList
            }
          }
        })
      },
      // 自动取消订单
      autoSubmit(data) {
        let that = this
        let params = {
          orderId: this.order.id,
          addCart: data.addCart,
          reason: data.reason,
        }
        cancelOrder(params).then((res) => {
          if (res == 1) {
            that.queryOrderDetail()
          }
        })
      },
      // 提交取消订单
      submitPoup(data) {
        if (this.discountOrderType == 'cancelOrder' && this.discountOrderData.orderIdList && this.discountOrderData.orderIdList.length > 0) {
          let params = {
            orderIdList: this.discountOrderData.orderIdList,
            addCart: data.addCart,
            reason: data.reason,
          }
          cancelOrderBatch(params).then((res) => {
            if (res.code == 200) {
              Toast('取消成功')
              this.isShowPoup = false
              this.discountOrderType = ''
              this.discountOrderData = {}
              appBack(this)
            } else {
              Toast(res.description)
            }
          })
        } else {
          let params = {
            orderId: this.order.id,
            addCart: data.addCart,
            reason: data.reason,
          }
          cancelOrder(params).then((res) => {
            if (res == 1) {
              Toast('取消成功')
              this.isShowPoup = false
              appBack(this)
            } else if (res == -1) {
              Toast('订单不存在')
            } else if (res == -2) {
              Toast('订单不匹配')
            } else if (res == -4) {
              Toast('订单支付成功，取消失败')
            } else {
              Toast('取消失败')
            }
          })
          // Toast("提交成功，正在为您取消订单")
        }
      },
      // 关闭弹出层
      closePoup(data) {
        this.isShowPoup = data
      },
      // 弹窗左按钮
      closeBack(data) {
        this.dialogshow = false // 关闭弹窗
      },
      // 弹窗右按钮
      rightEvent(data) {
        if (this.isType == 1) {
          let params = {
            orderId: this.order.id,
          }
          deleteOrder(params).then((res) => {
            if (res.code == 200) {
              this.$router.back()
            }
          })
        } else if (this.isType == 2||this.isType == 5) {
          confirmReceipt(this.order.id).then((res) => {
            if (res.code == 200) {
              Toast('确认收货成功')
              this.$router.back()
            } else {
              // Toast('确认收货失败')
              Toast(res.description)
            }
          })
        } else if (this.isType == 3) {
          window.ysf('open')
          // let a = document.createElement('a')
          // a.setAttribute('href', 'tel:0755-23061865')
          // a.click()
          // a.remove()
        } else if (this.isType == 4) {
          let param = {
            id: this.order.backOrderLogVO.backOrderId,
          }
          cancleApplySale(param).then((res) => {
            if (res.code == 200) {
              Toast('取消申请成功')
              this.$router.back()
            } else {
              Toast(res.description)
            }
          })
        }
        this.dialogshow = false // 关闭弹窗
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

      //合并支付/取消订单 确认按钮
      discountOrderConfirm() {
        if (this.discountOrderType == 'cancelOrder') {
          //取消订单 走填写取消原因逻辑
          this.discountOrderDialog = false
          this.isShowPoup = true
        } else if (this.discountOrderType == 'goPayOrder') {
          //付款 跳转支付页面        
          
          if(appData && appData.appScheme == 'wsf') {           
            this.commonPay(this.discountOrderData.totalPrice, this.discountOrderData.masterOrderCode, appData)
          } else {
            this.$router.push({
              path: '/zhPay',
              query: { money: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, type: 1, id: this.discountOrderData.orderIdList[0], serviceType: 100 },
            })
            // this.$router.push({
            //   path: '/pay',
            //   query: {
            //     id: this.discountOrderData.orderIdList[0],
            //     money: this.discountOrderData.totalPrice,
            //     orderCode: this.discountOrderData.masterOrderCode,
            //     type: 1,
            //   },
            // })
          }
        }
      },
      //合并支付/取消订单 取消按钮
      discountOrderCancel() {
        if (this.discountOrderType == 'cancelOrder') {
          //直接买了 跳转支付页面         
          if(appData && appData.appScheme == 'wsf') {           
            this.commonPay(this.discountOrderData.totalPrice, this.discountOrderData.masterOrderCode, appData)
          } else {
            this.$router.push({
              path: '/zhPay',
              query: { money: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, type: 1, id: this.discountOrderData.orderIdList[0], serviceType: 100 },
            })
            // this.$router.push({
            //   path: '/pay',
            //   query: {
            //     id: this.discountOrderData.orderIdList[0],
            //     money: this.discountOrderData.totalPrice,
            //     orderCode: this.discountOrderData.masterOrderCode,
            //     type: 1,
            //   },
            // })
          }         
        } else if (this.discountOrderType == 'goPayOrder') {
          //取消 关闭弹窗
          this.discountOrderDialog = false
          this.discountOrderType = ''
          this.discountOrderData = {}
        }
      },
      // 订单操作
      async opeationOreder(data, text) {
        console.log(data, text)
        if (text == '删除订单' || text == '确认收货' || text == '发票服务' || text == '取消申请') {
          if (text == '删除订单') {
            this.isType = 1
          } else if (text == '确认收货') {
            try {
              //判断是否有退款中的商品
              let res=await judgeRefund({orderId:data.id})
              if(res.code == 200){
                //有退款
                if (res.data == 2002){
                  this.isType = 5
                }else{
                  this.isType =2
                }
              }else{
                Toast(res.msg)
                return
              }
            } catch (error) {
              console.log(error);
              return
            }
          } else if (text == '发票服务') {
            this.isType = 3
          } else if (text == '取消申请') {
            this.isType = 4
          }
          this.dialogshow = true
        }
        if (text == '取消订单') {
          if (data.platformCouponCode) {
            checkOrder(data.id).then((res) => {
              this.discountOrderType = 'cancelOrder'
              if (res.data && res.data.orderList.length > 0) {
                this.discountOrderData = res.data
                this.discountOrderDialog = true
              } else {
                this.isShowPoup = true
                this.isVirtual = data.orderType == 7
              }
            })
          } else {
            this.isShowPoup = true
            this.isVirtual = data.orderType == 7
          }
        }
        if (text == '申请退款') {
          this.$router.push({
            path: 'refundorder',
            query: {
              orderId: data.id,
              money: data.price,
              orderCode: data.orderCode,
            },
          })
        }
        if (text == '去支付') {
          try {
            let res = await selectWsOrderInfoByOrderId({ orderId: data.id })
            if (res.code === 200) {
              let data = res.data
              this.isWsorder = data
              if (data.orderInfoVos.length > 1) {
                this.isorderShowPoup = true
                return
              }
            }
          } catch (error) {
            console.log(error);
          }
          if (data.platformCouponCode) {
            checkOrder(data.id).then((res) => {
              console.log(res, 'res')
              this.discountOrderType = 'goPayOrder'
              if (res.data && res.data.orderList.length > 0) {
                this.discountOrderData = res.data
                this.discountOrderDialog = true
              } else {               
                if(appData && appData.appScheme == 'wsf') { 
                  this.commonPay(data.price, data.orderCode, appData)
                } else {
                  this.$router.push({
                    path: '/zhPay',
                    query: { money: data.price, orderCode: data.orderCode, type: 1, id: this.$route.query.orderId, serviceType: 100 },
                  })
                  // this.$router.push({
                  //   path: '/pay',
                  //   query: {
                  //     id: this.$route.query.orderId,
                  //     money: data.price,
                  //     orderCode: data.orderCode,
                  //     type: 1,
                  //   },
                  // })
                }
              }
            })
          } else {
            if(this.isWsorder.fqzPrice && this.isWsorder.fqzPrice>0) {
              this.isWsorder.orderCode = data.orderCode
              this.$refs.fqzConfirm.show = true
            } else {              
              if(appData && appData.appScheme == 'wsf') { 
                this.commonPay(data.price, data.orderCode, appData)
              } else {
                this.$router.push({
                  path: '/zhPay',
                  query: { money: data.price, orderCode: data.orderCode, type: 1, id: this.$route.query.orderId, serviceType: 100 },
                })
              }
                // this.$router.push({
                //   path: '/pay',
                //     query: {
                //       id: this.$route.query.orderId,
                //       money: data.price,
                //       orderCode: data.orderCode,
                //       type: 1,
                //     },
                //   })
                // }
            }
            
          }
        }
        if (text == '再次购买') {
          let skuInfos = this.order.orderSkuWithMarketings.map((res, index) => {
            console.log(res);
            return `${res.skuId},${res.num},${this.order.storeId},${this.order.sourceType}`
          })
          let params = JSON.stringify({
            ids: [],
            addressId: 0,
            skuInfos: skuInfos,
            isGroup: 0,
            groupId: 0,
            temp: 1, //  判断是否从详情页进入   1 详情  0购物车
            againBuy: 1, // 再次购买
          })
          this.$router.push({
            path: '/settlement',
            query: {
              params: params,
            },
          })
          // settlementDetail(params).then((res) => {
          //   this.$router.push({
          //     path: '/settlement',
          //     query: {
          //       params: params,
          //     },
          //   })
          // })
        }
      },
      // 复制订单编号
      copyOrderCode(code) {
        let oInput = document.createElement('input')
        oInput.value = code
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        Toast('复制成功')
        oInput.remove()
      },
      // 复制卡密
      copyCamilo(code) {
        console.log('复制卡密code：', code)
        let oInput = document.createElement('input')
        oInput.value = code
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        Toast('复制成功')
        oInput.remove()
      },
      // 加入购物车
      addcart(data) {
        addShoppingCart({ skuId: data.skuId, num: data.num, storeId: this.order.storeId, sourceType: this.order.sourceType }).then((res) => {
          this.isProcess = false
          if (res.code == 200) {
            switch (res.data) {
              case 0:
                Toast('加入购物车失败，请刷新后重试！')
                break
              case 1:
                Toast('成功加入购物车')
                // 重新查询购物车数量
                // this.queryCartCount()
                //重新调详情接口
                break
              case -1:
                Toast('库存不足！')
                break
              case -2:
                Toast('商品不存在！')
                break
              case -3:
                Toast('参数错误！')
                break
              case -4:
                Toast('商品已下架！')
                break
              case -5:
                Toast('达到商品限购数量！')
                break
              case -6:
                Toast('预售商品不能加入购物车！')
                break
              case -7:
                Toast('商品已过期！')
                break
              default:
                Toast('加入购物车失败，请刷新后重试！')
                break
            }
          }
        })
      },
      // 修改收货地址
      toaddressList() {
        this.$router.push({
          path: '/customeraddresslist',
          query: {},
        })
      },
      back() {
        this.$router.back()
      },
      // 跳转至店铺
      tostore(storeId) {
        this.$router.push({ path: '/storeindex', query: { storeId: storeId } })
      },
      togoodsdetail(data) {
        // console.log('跳转信息', data)
        this.$router.push({
          path: '/spudetail',
          query: {
            id: data.skuId,
            sourceType: this.order.sourceType || 1,
            storeId: this.order.storeId
          },
        })
      },
      // 退款详情
      torefundDetail(data,val) {
        let path=val?'/refundDetail':'/refundServerDetails'
        let query=val? { orderId: data.id,orderCode: data.orderCode,cancelTime: data.cancelTime,}:{ id: data.backOrderId }
        this.$router.push({
          path,
          query,
        })
      },
      // 查看物流
      toCheckLogistics(data, type) {
        if (type == 1) {
          if (data.status < 3 || data.status > 4 || (data.status == 4 && data.deliverGoodsMode == 2)) return
          this.$router.push({
            path: '/tracesOrder',
            query: {
              id: data.id,
              type: 0,
            },
          })
        } else if (type == 2) {
          this.$router.push({
            path: '/tracesOrder',
            query: {
              id: data.id,
              type: 2,
            },
          })
        }
      },
      confirmPay(data) {       
        if(appData && appData.appScheme == 'wsf') { 
          this.commonPay(data.money, data.orderCode, appData)
        } else {
          this.$router.push({
            path: '/zhPay',
            query: { money: data.money, orderCode: data.orderCode, type: 1, id: data.id, serviceType: 100 },
          })
          // this.$router.push({
          //   path: '/pay',
          //   query: {
          //     id: data.id,
          //     money: data.money,
          //     orderCode: data.orderCode,
          //     type: 1,
          //   },
          // })
        }
      },
      // 监听滚动
      handleScroll() {
        if (!this.$refs.backTop) return
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop) // 取绝对值
        // 顶部top淡入淡出
        let headerdom = document.getElementById('headerwrapper')
        if (!headerdom || !headerdom.classList) {
          return
        }
        if (scorllTop < 10) {
          headerdom.classList.add('headershow0')
          headerdom.classList.remove('headershow1', 'headershow2', 'headershow3', 'headershow4', 'headershow5')
        } else if (scorllTop >= 10 && scorllTop < 35) {
          headerdom.classList.add('headershow1')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow3', 'headershow4', 'headershow5')
        } else if (scorllTop >= 35 && scorllTop < 60) {
          headerdom.classList.add('headershow2')
          headerdom.classList.remove('headershow0', 'headershow1', 'headershow3', 'headershow4', 'headershow5')
        } else if (scorllTop >= 60 && scorllTop < 85) {
          headerdom.classList.add('headershow3')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow1', 'headershow4', 'headershow5')
        } else if (scorllTop >= 85 && scorllTop < 110) {
          headerdom.classList.add('headershow4')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow1', 'headershow3', 'headershow5')
        } else if (scorllTop >= 110) {
          headerdom.classList.add('headershow5')
          headerdom.classList.remove('headershow0', 'headershow2', 'headershow1', 'headershow3', 'headershow4')
        }
        // 回到顶部
        if (scorllTop >= 2500) this.isshowtop = true
        else this.isshowtop = false
      },
      // 回到顶部
      backtop() {
        if (this.isshowtop) this.returntop = true
        else this.returntop = false
      },
      // 展开收起
      open() {
        this.isopen = !this.isopen
      },
      // 展开收起
      openCamilo() {
        this.isOpenCamilo = !this.isOpenCamilo
      },
      // 联系客服
      toService() {
        let that = this
        let storeServiceConfig = undefined,
          options = {},
          data = undefined,
          pt_is_sj = false
        data = that.order
        storeServiceConfig = that.order.storeServiceConfig
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
        //  options.staffid = '6014114' //指定客服
        options.staffid ? (pt_is_sj = true) : (pt_is_sj = false)
        console.log(options, '👩')
        ysf('config', {
          ...options,
          success: function() {
            that.productFun(data, pt_is_sj)
          },
        })
      },
      productFun(data, pt_is_sj) {
        let that = this,
          tagsUrl = '',
          pt = '',
          sj = '',
          title = '',
          status = 0
        status = that.order.status
        pt = `https://platform.wsfmall.com/ordermagamemt/storeorder/storeorderdetail?id=${that.$route.query.orderId}&backStatus=${that.$route.query.backStatus}`
        sj = `https://merchant.wsfmall.com/ordermanagement/mallorder/orderdetail?id=${that.$route.query.orderId}&backStatus=${that.$route.query.backStatus}`
        // 判断：指定客服id为空，则跳转平台端订单详情，否则跳转商家端订单详情
        pt_is_sj ? (tagsUrl = sj) : (tagsUrl = pt)
        ysf('product', {
          show: 1, //1为打开， 其他参数为隐藏（包括非零元素
          title: `订单号: ${that.orderCode}`,
          desc: data.orderSkuWithMarketings[0].skuName,
          picture: data.orderSkuWithMarketings[0].skuImage,
          note: `￥${data.orderSkuWithMarketings[0].price}`,
          url: `https://m.wsfmall.com/orderdetail?orderId=${data.id}&backStatus=${data.backStatus}`, // 跳转客户端商品详情页面
          sendByUser: 0, //自动发送卡片
          tags: [
            {
              label: '查看订单详情', // 按钮名字
              url: tagsUrl, // 跳转客户端商品详情页面
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
    },
    beforeDestroy() {
      clearInterval(this.setTimer)
      clearInterval(this.timeInteval)
    },
  }
</script>

<style lang="less" scoped>
  .van-notice-bar {
    margin-bottom: -10px;
    padding-bottom: 10px;
    height: 48px;
    line-height: 18px;
    font-size: 13px;
    background-color: #FFE7C0;
    border-radius: 10px 10px 0 0;
    color: #FFA000;
    z-index: -1;
    .left-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }
  }
  .goods_gg {
    font-size: 0.44rem;
    color: #999;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    label {
      margin-left: 0.36rem;
    }
    label:first-child {
      margin-left: 0 !important;
    }
    label:last-child .goods_ggshu {
      display: none;
    }
    .goods_ggshu {
      width: 1px;
      height: 0.28rem;
      display: inline-block;
      background-color: #999;
      vertical-align: middle;
      margin-top: -1px;
      margin-left: 0.12rem;
    }
  }
  .boxwrapper {
    .commomover {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .headerboxwrapper {
      .navtopbox {
        width: 100%;
        height: 1.76rem;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5;
        .topleftbox {
          display: inline-block;
          position: absolute;
          top: 0;
          bottom: 0;
          padding: 0 0.64rem;
          display: flex;
          align-items: center;
          .iconLeftbox {
            font-size: 0.92rem;
            color: #666;
          }
        }
        .navtop {
          opacity: 0;
        }
        .iconLeftbox {
          opacity: 1;
        }
      }
      .headershow0 {
        .topleftbox {
          opacity: 1;
        }
        .navtop {
          display: none;
          opacity: 0;
        }
      }
      .headershow1 {
        .topleftbox {
          opacity: 0.8;
        }
        .navtop {
          display: block;
          opacity: 0.2;
        }
      }
      .headershow2 {
        .topleftbox {
          opacity: 0.6;
        }
        .navtop {
          display: block;
          opacity: 0.4;
        }
      }
      .headershow3 {
        .topleftbox {
          opacity: 0.4;
        }
        .navtop {
          display: block;
          opacity: 0.6;
        }
      }
      .headershow4 {
        .topleftbox {
          opacity: 0.2;
        }
        .navtop {
          display: block;
          opacity: 0.8;
        }
      }
      .headershow5 {
        .topleftbox {
          opacity: 0;
          display: none;
        }
        .navtop {
          display: block;
          opacity: 1;
        }
      }
      .headerbox {
        // min-height: 60px;
        background: #F5F5F5;
        background-size: 100%;
        position: relative;
        color: #fff;
        z-index: 1;
        .headercontent {
          // padding-bottom: 32px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .header_top {
            margin-top: 0.24rem;
            margin-bottom: 0.28rem;
            display: flex;
            align-items: center;
            .headerimgsize {
              width: 0.76rem;
              height: 0.76rem;
              margin-right: 0.28rem;
            }
            .orderstatus {
              font-size: 0.8rem;
              color: #000;
              font-weight: bold;
              &.orderstatus-one {
                color: #E60113;
              }
            }
          }
          .order_kd {
            margin-bottom: 16px;
            font-size: 14px;
            color: #333333;
            .van-count-down {
              color: #333333;
            }
          }
        }
      }
    }
    .contentboxwrapper {
      // margin-top: -16px;
      .order_yjt {
        width: 0.16rem;
        height: 0.4rem;
      }
      .bg_color {
        width: 100%;
        background-color: #fff;
        padding: 0 0.72rem;
        border-radius: 0.4rem;
        margin-bottom: 0.48rem;
      }
      .addressboxwrapper {
        padding-top: 0.82rem;
        padding-bottom: 0.82rem;
        .orderaddressbox {
          .order_li {
            padding-left: 0.72rem;

            color: #000;
            font-size: 0.56rem;
            font-weight: bold;
            position: relative;
            label {
              display: inline-block;
              width: 11.56rem;
            }
            .address_yjt {
              position: absolute;
              right: 0;
              top: 50%;
              margin-top: -0.2rem;
            }
          }
          span {
            display: inline-block;
            margin-left: 0.6rem;
            color: #999;
            font-size: 0.48rem;
            // transform: scale(0.92);
            margin-bottom: 0.48rem;
            margin-top: 0.12rem;
          }
          .order_cancel {
            background: url('../../assets/img/icon_b@2x.png') no-repeat left 0.12rem;
            background-size: 16px;
          }
          .order_logistics {
            background: url('../../assets/img/receipt.png') no-repeat left 0.12rem;
            background-size: 0.64rem;
          }
          .order_address {
            background: url('../../assets/img/region@2x.png') no-repeat left 0.12rem;
            background-size: 0.64rem;
            .addressbox_p {
              display: flex;
              justify-content: space-between;
              label {
                width: auto;
              }
              .editaddress {
                display: inline-block;
                font-size: 0.52rem;
                background: url('../../assets/img/cat_more@2x.png') no-repeat center right;
                background-size: 0.16rem 0.4rem;
                padding-right: 0.4rem;
              }
            }
            .addressInfo {
              color: #666;
              font-size: 0.52rem;
              font-weight: normal;
              margin-top: 0.16rem;
            }
          }
        }
      }
      .orderboxwrapper {
        padding-top: 0.7rem;
        padding-bottom: 0.88rem;
        color: #000;
        .storeheader {
          background: url('../../assets/img/Shop2.png') no-repeat left center;
          background-size: 0.56rem;
          padding-left: 0.68rem;
          display: flex;
          align-items: center;
          margin-bottom: 0.68rem;
          label {
            display: inline-block;
            font-size: 0.56rem;
            font-weight: bold;
            max-width: 8.4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          img {
            margin-top: 0.12rem;
            margin-left: 0.16rem;
          }
        }
        .goodsContainer {
          margin-bottom: 22px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .goodsbox {
          display: flex;
          position: relative;
          .virtual_tag {
            width: 1.2rem;
            height: 0.64rem;
            line-height: 0.64rem;
            background: #e95762;
            border-radius: 0.2rem 0.4rem 0.4rem 0rem;
            opacity: 0.8;
            color: #ffffff;
            font-size: 0.4rem;
            text-align: center;
            position: absolute;
            top: 0;
          }
          .goodsimg {
            width: 3.2rem;
            height: 3.2rem;
            border-radius: 0.2rem;
            margin-right: 0.48rem;
            border: 1px solid #f1f1f1;
          }
          .goodsinfo {
            // width: 100%;
            position: relative;
            .btn {
              width: .96rem;
              height: .96rem;
              position: absolute;
              top: 35px;
              right: 0;
            }
            .goodsname {
              width: 9.6rem;
              font-size: 0.52rem;
            }
            .goods_gg {
              font-size: 0.48rem;
              color: #999;
              // display: -webkit-box;
              // -webkit-box-orient: vertical;
              // -webkit-line-clamp: 2;
              // overflow: hidden;
              width: 9.6rem;
              height: 0.8rem;
              line-height: 0.8rem;
              transform: scale(0.9);
              margin-left: -5%;
              // margin-bottom: 0.16rem;
              // margin-top: 2px;
            }
            .buygivebox {
              padding: 0rem 0.12rem;
              color: #e60113;
              position: relative;
              display: inline-block;
              font-size: 0.48rem;
              transform: scale(0.833);
              height: 0.68rem;
              margin: 0.12rem 0.16rem 0.28rem -0.08rem;
            }
            .buygivebox::after {
              // top: -51%;
              border-radius: 0.08rem;
              border: 1px solid #e60113;
            }
            .goodsprice {
              font-weight: bold;
              font-size: 0.56rem;
              .performate-point {
                display: inline-block;
                // margin-top: 8px;
                border: 1px solid #fd302c;
                border-radius: 2px;
                padding: 1px 4px;
                color: #fd302c;
                font-size: 10px;
                font-weight: normal;
                line-height: 12px;
              }
              .reality-price {
                // font-weight: normal;
                font-size: 14px;
                color: #e60113;
                line-height: 18px;
                margin-left: 10px;
              }
            }
          }
          .addcart {
            position: absolute;
            bottom: 0.2rem;
            right: 0;
            width: 0.96rem;
            height: 0.96rem;
          }
        }
        .orderfooter {
          padding-top: 24px;
          text-align: right;
          span {
            display: inline-block;
            height: 1.2rem;
            width: 3.04rem;
            text-align: center;
            line-height: 1.12rem;
            font-size: 0.52rem;
            color: #000;
            border: 1px solid #666;
            border-radius: 0.6rem;
            margin-left: 0.4rem;
          }
          .refund{
            color:#E60113;
            border-color:#E60113;
          }
          .order_status {
            border-color: #e60113;
            color: #e60113;
          }
          .order_s3 {
            background-color: #e60113;
            border-color: #e60113;
            color: #fff;
          }
        }
        .btnBox {
          padding-top: 20px;
          text-align: right;
          .common_btn {
            display: inline-block;
            height: 30px;
            border-radius: 15px;
            border: 1px solid #666666;
            line-height: 28px;
            font-size: 13px;
            color: #000;
            padding: 0 12px;
          }
        }

        .goods_server {
          display: flex;
          justify-content: center;
          padding-top: 0.8rem;
          margin-top: 1.2rem;
          border-top: 1px solid #f8f8f8;
          .serverimg {
            width: 0.72rem;
            height: 0.72rem;
            margin-right: 0.32rem;
          }
          span {
            font-size: 0.52rem;
          }
        }
        .goods_server::before {
        }
      }
      .ordercodeboxwrapper {
        padding: 1rem 0.72rem 0.8rem;
        .camilo {
          margin-bottom: 0 !important;
        }
        .ordercode_p {
          font-size: 0.52rem;
          margin-bottom: 0.6rem;
          display: flex;
          justify-items: space-between;
          align-items: flex-start;
          .ordercode_label {
            white-space: nowrap;
            color: #666;
            margin-right: 0.48rem;
          }
          .ordercode {
            font-weight: bold;
            .copy {
              float: right;
              width: 20px;
              height: 20px;
              background: url('~@/assets/img/copy.png') no-repeat center center;
              background-size: 20px;
            }
            .camilo_space {
              margin-bottom: 0.72rem;
              display: block;
              float: left;
            }
          }
          .copy {
            float: right;
            width: 20px;
            height: 20px;
            background: url('~@/assets/img/copy.png') no-repeat center center;
            background-size: 20px;
          }
          .buygiveboxwrapper {
            // display: inline-block;
            .buygivebox {
              padding: 0rem 0.12rem;
              color: #e60113;
              position: relative;
              display: inline-block;
              font-size: 0.48rem;
              transform: scale(0.833);
              height: 0.68rem;
              margin: 0.12rem 0.16rem 0.28rem -0.08rem;
            }
            .buygivebox::after {
              // top: -51%;
              border-radius: 0.08rem;
              border: 1px solid #e60113;
            }
          }
          .goodsprice {
            font-weight: bold;
            font-size: 0.56rem;
          }
        }
        .orderbottom {
          height: 1px;
          width: 100%;
          margin-top: 0.8rem;
          margin-bottom: 0.8rem;
          background-color: #f5f5f5;
        }
        .orderpricebox {
          font-size: 0.52rem;
          .order_price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.72rem;
            span {
              font-weight: bold;
            }
            &.copun_price {
              span {
                color: #E60113;
              }
            }
          }
        }
        .ordertotalprice {
          text-align: right;
          font-size: 0.72rem;
          font-weight: bold;
          color: #e60113;
          margin-top: 0.84rem;
          margin-bottom: 0.72rem;
          .ordertotal_title {
            font-size: 0.56rem;
            font-weight: unset;
            margin-right: 0.28rem;
            color: #000;
          }
          .ordertotal_rmb {
            font-size: 0.44rem;
          }
          .ordertotal_price {
            font-size: 0.72rem;
            margin-left: -0.08rem;
          }
        }
        .isopenColor {
          label {
            color: #000 !important;
          }
        }
        .isopenActive {
          text-align: left;
          margin-top: unset;
          font-size: 0.52rem;
          font-weight: normal;
          span {
            font-size: 0.52rem !important;
          }
        }
        .box_openclose {
          width: 100%;
          text-align: center;
          .open {
            width: 4.4rem;
          }
          .close {
            width: 2.52rem;
          }
          span {
            display: inline-block;
            height: 0.96rem;
            line-height: 0.92rem;
            border-radius: 0.6rem;
            border: 1px solid #666;
            text-align: center;
            font-size: 0.48rem;
            img {
              width: 0.28rem;
              height: 0.16rem;
              margin-top: -1px;
              vertical-align: middle;
            }
          }
          span::before {
          }
        }
      }
    }
    .statustop {
      // margin-top: -1.96rem;
    }
    .orderfooterwrapper {
      height: 2rem;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      padding: 0 0.8rem 0 0.72rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      z-index: 99;
      .orderfooter_com {
        width: 3.04rem;
        height: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.52rem;
        color: #000;
        position: relative;
        margin-left: 0.4rem;
      }
      .orderfooter_true {
        background-color: #e60113;
        color: #fff;
        border-radius: 0.6rem;
      }
      .orderfooter_true::after {
        border-color: #e60113;
      }
    }
    .needButtomSpace{
      // padding-bottom: 8px;
      height: 2.3rem;
      line-height: 2.3rem;
    }
    .iscancle {
      justify-content: space-between;
    }
    .xq_wntj {
      padding: 0 0.48rem;
      text-align: center;
      /deep/ .guess-warp {
        .guess-title {
          height: 0.72rem;
          line-height: 0.72rem;
          margin: 1.2rem 0 0.48rem;
          padding: unset;
        }
      }
    }
    .border_half::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      border: 1px solid #666666;
      border-radius: 999px;
      width: 200%;
      height: 200%;
      -webkit-transform: scale(0.5, 0.5);
      transform: scale(0.5, 0.5);
      box-sizing: border-box;
    }
    .returntopBox {
      width: 100%;
      .returntop {
        width: 1.6rem;
        height: 1.6rem;
        position: fixed;
        bottom: 2.6rem;
        right: 0.48rem;
      }
    }
  }
  .backtopactive {
    position: fixed;
    top: 0;
  }
  .discount-order-container {
    .order-auto-box {
      overflow-y: auto;
      height: 260px;
      .discount-order {
        padding-top: 20px;
        .discount-order-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 24px;
          color: #000;
          font-size: 14px;
          .left-part {
            max-width: 203px;
          }
          .right-part {
            font-weight: 500;
          }
        }
        .discount-order-count {
          color: #666;
          line-height: 24px;
          font-size: 14px;
        }
      }
    }
    .order-total-box {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-top: 20px;
      .text {
        color: #000;
        font-size: 14px;
        line-height: 16px;
      }
      .symbol {
        font-size: 11px;
        color: #e60113;
        font-weight: 500;
      }
      .price {
        color: #e60113;
        font-size: 18px;
        font-weight: 600;
        line-height: 18px;
      }
    }
  }
  .topay {
    width: 108px;
    height: 28px;
    background: #E60113;
    border-radius: 19px;
    font-size: 14px;
    color: 14px;
    line-height: 28px;
    text-align: center;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .backtop {
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
      width: 14px;
      height: 18px;
    }
    span{
      font-size: 11px;
      font-weight: 400;
      color: #FFFFFF;
    }
  }
</style>
