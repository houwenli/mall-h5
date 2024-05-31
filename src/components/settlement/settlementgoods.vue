<template>
  <div>
    <!-- 店铺遍历信息 -->
    <div class="goodsboxwrapper" v-for="(item, index) in orderSettlement.storeSettlements" :key="item.storeId">
      <div class="goodsbox" v-for="(res) in item.shoppingCartResponse.normalSkus" :key="res.skuId">
        <div class="good-item">
          <img class="goodsimg" :src="res.image" alt="" />
          <div class="goodsInfobox">
            <div class="goodsInfobox-wrapper">
              <p class="goodsname">{{ res.name }}</p>
              <div class="goods_gg">
                <label v-for="(temp, e) in res.skuSpecValues" :key="e">
                  <span>{{ temp.spec.name }}：{{ temp.valueRemark }}</span>
                  <span class="goods_ggshu"></span>
                  <!-- <span>规格：包装箱发货极具中国哈哈哈</span> -->
                </label>
              </div>
              <!-- 买送 -->
              <span class="buygiveboxwrapper" v-for="r in res.marketingVos" :key="r.id" :style="{ 'margin-bottom': r.type == 12 ? '' : '0.72rem' }">
                <label class="buygivebox border_half" v-if="r.type == 12">
                  {{ r.name }}
                </label>
              </span>
              <div class="performate-point" v-if="res.performanceScore && res.performanceScore>0">
                <img src="https://wsjc-web.wsecar.com/wsf-mall/home/ic_performance_mark.png" alt="">绩效分:{{res.performanceScore}}
              </div>
            </div>
            <div class="pricebox">
              <div class="price-wrapper">
                <span class="fqz-price" v-if= "res.integralPoint > 0 && !isOldPriceBuy">
                  <span>
                    <span class="special">{{res.integralPoint }}</span>
                    福气值+<span>{{ res.deductionAfterPrice }}</span>元
                  </span>
                </span>
                <span class="price" v-else>
                  <span class="price_rmb">¥</span><span class="font-din">{{ res.oldPrice | getPriceInt }}</span><span class="price_rmb font-din">{{ res.oldPrice | getPricePrecision }}</span>
                </span>
              </div>

              <van-stepper
                v-model="res.num"
                integer
                min="1"
                :max="res.stock"
                :disable-plus="res.num == res.stock ? true : false"
                v-if="params.temp == 1 && params.againBuy == 0"
                @change="addreduce($event, res)"
                :class="{ pluscolor: res.num == res.stock }"
              />
              <span v-else class="goodsnum">
                <em class="cha">×</em>{{ res.num }}
              </span>
            </div>
          </div>
        </div>

        <!-- 赠品 -->
        <div class="giveGiftbox" v-if="res.marketingVos">
          <template v-for="(temp, s) in res.marketingVos">
            <div :key="s" v-if="temp.type == 2">
              <div v-for="g in filterGiftSku(temp.fullGiftList, res.num * res.price)" :key="g.id" class="giveGift">
                <p class="overline">[赠品] {{ g.name }}</p>
                <span>
                  <strong>×</strong>
                  {{ g.num }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 运费发票留言 -->
      <div class="freightbox">
        <van-cell
          title="配送"
          is-link
          ref="refyoufei"
          :value="item.freightPrice == 0 ? '快递免邮' : '快递 ¥' + item.freightPrice.toFixed(2)"
          @click="Freight"
          class="FreightClick"
        />
        <van-field label="留言" v-model="item.remark" input-align="right" :maxlength="50" clearable class="remark" placeholder="建议留言前先与商家沟通确认" />
        <van-cell class="activity-item" v-if="item.totalDiscountPrice>0">
          <span>-¥{{ (item.totalDiscountPrice || 0).toFixed(2) }}</span>
          <template #title>
            <span class="custom-title">活动</span>
            <!-- <van-tag plain color="#FF0A35">满六百减100</van-tag> -->
          </template>
        </van-cell>
        <van-cell title="优惠券" v-if="item.userCouponDiscount>0 || item.onlineRetailerCouponIds.length || (item.couponList && item.couponList.length)" is-link @click="showCoupon(item, index)" class="FreightClick copun-cell">
          <span style="color: #FF0A35" v-if="item.userCouponDiscount>0">-¥{{ item.userCouponDiscount }}</span>
          <span v-else-if="item.onlineRetailerCouponIds && item.onlineRetailerCouponIds.length">{{ item.couponList.length }}张可用</span>
          <span v-else>无可用</span>
        </van-cell>

      </div>
      <p class="totalpricebox">
        <span class="allgoodsNum">共{{ item.allSkuNum }}件</span>
        <strong>合计¥<span class="font-din">{{ item.userCouponDiscount && item.userCouponDiscount>0 ? (item.totalPrice - item.userCouponDiscount + item.freightPrice).toFixed(2) : (item.totalPrice + item.freightPrice).toFixed(2) }}</span></strong>
      </p>

      <!-- 运费弹出层 -->
      <van-popup get-container="body" v-model="showFreight" round closeable close-icon="close" position="bottom" :style="{ height: '68.5%' }" class="freightwrapper">
        <div class="freightbox">
          <p class="titlebox">
            <span>配送</span>
          </p>
          <div class="freightprice">
            <label style="margin-right: 0.24rem">普通配送</label>
            <span>{{ item.freightPrice == 0 ? '快递 免邮' : '快递 &nbsp;¥'+ item.freightPrice.toFixed(2)}}</span>
            <img src="@/assets/img/cat_Selected.png" alt="" class="choosebox" />
          </div>
          <div class="confirmbox">
            <span class="confirm" @click="closeFreight">确定</span>
          </div>
        </div>
      </van-popup>
    </div>
    <div class="goodsboxwrapper bill-cell-wrapper">
      <van-cell
        title="发票"
        is-link
        :value="invoice.type == '0' ? '不需要发票' : invoice.type == '1' ? invoice.title : invoice.invoiceCompanyName"
        @click="Invoice(invoice)"
        class="FreightClick"
      />
    </div>

    <!-- 礼品卡 -->
    <div class="goodsboxwrapper" v-if="orderSettlement.valueCardCods&&orderSettlement.valueCardCods.length">
      <div class="freightbox">
        <van-cell title="礼品卡" style="padding: 0" is-link>
          <span style="color: #e60113;padding-right: 0.92rem;" v-if="giftIndex!==null" @click="showGiftFun()">
            <span>
              {{ '-￥' + giftDeduction }}
            </span>
          </span>
          <span style="color: #000;padding-right: 0.92rem;" v-else @click="showGiftFun()">
            <span>{{orderSettlement.valueCardCods.length}}张可用</span>
          </span>
        </van-cell>
      </div>
    </div>

    <!-- 发票弹出层 -->
    <van-popup
      get-container="body"
      v-if="showInvoice"
      v-model="showInvoice"
      round
      close-icon="close"
      position="bottom"
      :style="{ height: '68.5%' }"
      class="freightwrapper"
      @click-overlay="closeInvoce"
    >
      <div class="freightbox">
        <p class="titlebox invoicetext">
          发票
          <img src="@/assets/img/close@2x.png" alt="" @click="showInvoice = false" />
        </p>
        <settlementinvoice :index="storeIndex" :settlementInvoice="listdata" @closeInvoce="closeInvoce" style="padding-top: 1.92rem"></settlementinvoice>
      </div>
    </van-popup>

    <!-- 优惠券弹出层 -->

    <!-- 礼品卡弹出层 -->
    <van-popup
      v-model="showGift"
      @close="giftClose"
      round
      closeable
      close-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
      position="bottom"
      :style="{ height: '68.5%' }"
      class="freightwrapper"
      @click-overlay="closecoupon"
    >
      <div class="gift_content">
        <div class="gift_title">礼品卡</div>
        <div class="gift_list">
          <template v-if="true">
            <div class="min_card" v-for="(item,index) in orderSettlement.valueCardCods" :key="index">
              <div class="up">
                <div class="txt_1">
                  <span>{{ item.cardName }}</span>
                </div>
                <div class="txt_2">
                  <span>面值: {{ fmoney(item.cardPrice, 2, false) }}元</span>
                  <span>{{ item.validityStartTime | dateFilter }} - {{ item.validityEndTime | dateFilter}}</span>
                </div>
              </div>
              <div class="down">
                <div class="left">
                  <p>
                    余额:
                    <span>¥ {{ fmoney(item.balance, 2, false) }}</span>
                  </p>
                  <p style="float: left">
                    <span v-if="item.permittedType == 0">全平台商品可用</span>
                    <template v-if="item.permittedType == 1">
                      <span>{{`仅${item.marketingName}活动商品可用` | thumbnailString}}</span>
                      <van-icon v-if="`仅${item.marketingName}活动商品可用`.length>15" size="15px" name="info-o" @click="explainFun(item)" />
                    </template>
                    <template v-if="item.permittedType == 2">
                      <span>{{`仅${item.storeNames}店铺的商品可用` | thumbnailString}}</span>
                       <van-icon v-if="`仅${item.storeNames}店铺的商品可用`.length>15" size="15px" name="info-o" @click="explainFun(item)" />
                    </template>
                  </p>
                </div>
                <div class="right">
                  <div class="stub-ticket">
                    <img
                      src="@/assets/img/cat_Selected@2x.png"
                      v-if="giftIndex === index"
                      class="choosebox"
                      @click="giftSelectCoupon(null,index)"
                    />
                    <img src="@/assets/img/activity/cat_ns@2x.png" v-else class="choosebox" @click="giftSelectCoupon(item,index)" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="gift_btn">
          <div class="gift_confirmbox">
            <span class="gift_confirm" @click="giftConfirm()">确定</span>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="explain"
      closeable
      :close-on-click-overlay="false"
      :round="true"
      close-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
    >
      <div class="popup_text">
        <h3>说明</h3>
        <div class="content">
          <p>{{explainText}}</p>
        </div>
        <div class="btn" @click="explain = false">我知道了</div>
      </div>
    </van-popup>
    <coupun-popup ref="coupunPopup" isCheckBox @coonfirmCoupun='coonfirmCoupun'></coupun-popup>
  </div>
</template>

<script>
  import { Field, Stepper, Cell, Popup, CellGroup, Radio, RadioGroup, Toast, Tab, Tabs, Tag } from 'vant'
  import settlementinvoice from '@/components/settlement/settlementinvoice'
  import { checkSkuPanicBuyLimitNum } from '@/api/activities/seckill'
  import timeFormat from '@/utils/timeFormat'
  import {mapGetters} from 'vuex'
  import CoupunPopup from '@/components/commons/coupunPopup.vue'

  let giftData = {},isConfirm=false,giftIndex_= null,giftData_=null
  export default {
    props: {
      orderSettlement: {
        type: Object,
      },
      isOldPriceBuy: {
        type: Number
      }
    },
    computed: {
      ...mapGetters(['orderLastTotalPriceCopy'])
    },
    components: {
      settlementinvoice,
      [Cell.name]: Cell,
      [Field.name]: Field,
      [Stepper.name]: Stepper,
      [Popup.name]: Popup,
      [Radio.name]: Radio,
      [RadioGroup.name]: RadioGroup,
      [CellGroup.name]: CellGroup,
      [Toast.name]: Toast,
      [Tabs.name]: Tabs,
      [Tab.name]: Tab,
      [Tag.name]: Tag,
      CoupunPopup
    },
    data() {
      return {
        explainText: '',
        explain: false,
        platformCanUseList: [],
        platformNoUseList: [],
        timeFormat,
        storeIndex: '', // 店铺下标
        params: JSON.parse(this.$route.query.params),
        showFreight: false, // 运费弹出层
        showInvoice: false, // 发票弹出层
        chooseShow: false, // 运费是否选中
        listdata: '',
        showcoupon: false, //优惠券弹出层
        showGift: false, //礼品卡弹出层
        giftDeduction: 0, //最终礼卡抵扣金额
        giftIndex: null,
        goodsNum: 0, // 计算总金额用于礼卡计算
        parentIndex: 0,
        invoice: {
          type: '0', //  发票类型 0 不需要发票 1 普通增值税发票 2 增值税发票
          title: '', // 发票抬头
          content: '1', // 发票内容 1 商品明细 2 商品类别
          taxId: '', // 发票增值税号
          titleType: '1', // 发票抬头类型1 企业 2 个人
          invoiceCompanyName: '', //公司名称
          invoiceRegisterAddress: '', // 注册地址
          invoiceRegisterMobile: '', // 注册电话
          invoiceOpenBank: '', // 开户银行
          invoiceBankAccount: '', // invoiceBankAccount
          invoicePhone: '', // 收票人手机
          invoiceMail: '', // 收票人邮箱
        },
      }
    },
    watch: {
      'orderSettlement.storeSettlements':{
        handler(newVal){
          this.amountFun()
        },
        deep: true,
        // immediate: true
      }
    },
    created() {
      this.amountFun()

    },
    methods: {

      async amountFun(){
        //  商品价格                 数量     // 运费           //优惠券
        let goodsNum = 0, price = 0,num = 0, freightPrice = 0, coupon = 0
        let storeSettlements = this.orderSettlement.storeSettlements?this.orderSettlement.storeSettlements:''
          for (let i = 0; i < storeSettlements.length; i++) {
              freightPrice+=(+storeSettlements[i].freightPrice)
              if(storeSettlements[i].userCouponDiscount && storeSettlements[i].userCouponDiscount>0){
                coupon+=(+storeSettlements[i].userCouponDiscount)
              }
              for(let k = 0; k < storeSettlements[i].orderAllSkus.length; k++){
                price = storeSettlements[i].orderAllSkus[k].price
                num = storeSettlements[i].orderAllSkus[k].num
                goodsNum+=(price*num)
              }
          }

          goodsNum = +(goodsNum + freightPrice-coupon).toFixed(2)
          this.goodsNum = goodsNum
          await this.$store.dispatch('orderLastTotalPriceCopy',goodsNum)
          if(this.giftIndex !== null){
            await this.giftConfirm()
          }else {
            this.orderSettlement.valueCardCodeId = ''
            this.orderSettlement.giftMoney = 0
          }
      },
      //关闭发票弹出层
      closeInvoce(val, index) {
        if (val) {
          // this.orderSettlement.storeSettlements[index].invoiceList = val
          this.invoice = {...val}
          this.orderSettlement.storeSettlements = this.orderSettlement.storeSettlements.map(item=>{
            return {
              ...item,
              invoiceList: {...val,storeId: item.invoiceList.storeId}
            }
          })
        }
        this.showInvoice = false
      },
      // 关闭运费弹出层
      closeFreight() {
        this.showFreight = false
      },
      // 显示运费弹出层
      Freight() {
        this.showFreight = true
      },
      // 显示发票弹出层
      Invoice(item) {
        this.listdata = item
        this.storeIndex = 0
        this.showInvoice = true
      },
      // 数量改变
      changeInputNum(data) {
        let param = {
          num: data.num >= data.stock ? data.stock : data.num, // 数量
        }
        if (param.num > 0) {
          this.$emit('changGoodsNum', param)
        }
      },
      // 检查该sku是否为 首单 商品活动
      checkSkuIsFirstOrder(sku) {
        if (!sku.marketingVos) return false
        let isFirst = sku.marketingVos.map((item) => item.type).includes('16') || sku.marketingVos.map((item) => item.type).includes('13')
        return isFirst
      },
      // 商品加 减
      async addreduce(val, data) {
        if (data.num > data.stock) {
          Toast('商品加购件数(含已加购件数)已超过库存!')
          // return
        }
        let param = {
          num: data.num >= data.stock ? data.stock : data.num, // 数量
        }
        // 首单活动加购校验
        if (!val && data.marketingVos && this.checkSkuIsFirstOrder(data)) {
          let reqData = {
            isIgnoreCartNum: true,
            buyNowRequestList: [
              {
                skuId: data.skuId,
                num: data.num,
              },
            ],
          }
          let res = await this.checkLimit(reqData)
          if (res.data && res.data.limitNum) {
            if (res.data.hasBoughtNum) {
              data.num = res.data.limitNum - res.data.hasBoughtNum
              Toast({
                message: `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`,
              })
            } else {
              data.num = res.data.limitNum
              Toast({
                message: `抱歉，该商品限购${res.data.limitNum}件`,
              })
            }
            return
          }
        }
        this.orderSettlement.platformCouponCode = null
        this.$emit('changGoodsNum', param)
      },
      // 检查数据
      checkLimit(reqData) {
        return checkSkuPanicBuyLimitNum(reqData).then((res) => {
          return res
        })
      },
      // 跳转商品详情
      godetil(item) {
        this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
      },
      closecoupon() {
        this.showcoupon = false
      },
      showCoupon(item, index) {
        const spuParams = item.shoppingCartResponse.normalSkus.map(skuItem=>{
          return {
            spuId: skuItem.spuId,
            skuId: skuItem.skuId,
            num: skuItem.num,
            beforeCouponPrice: skuItem.price
          }
        })
        this.parentIndex = index
        this.$refs.coupunPopup.setShowPopup({skuList: spuParams, ids: item.onlineRetailerCouponIds})
      },
      showGiftFun(){
        this.showGift = true
      },
      coonfirmCoupun(params) {
        console.log(params, 22222222222)
        this.orderSettlement.storeSettlements[this.parentIndex].couponList = params.couponList.map(item=>item)
        this.orderSettlement.storeSettlements[this.parentIndex].userCouponDiscount = params.userCouponDiscount
        this.orderSettlement.storeSettlements[this.parentIndex].onlineRetailerCouponIds = params.onlineRetailerCouponIds
        this.orderSettlement.sumUserCouponDiscount = this.orderSettlement.storeSettlements && this.orderSettlement.storeSettlements.reduce((prev, cur)=>{
          return prev + Number(cur.userCouponDiscount);
        }, 0).toFixed(2)
        this.amountFun()
        this.$parent.calcPrice()
        this.$emit('changeCopun')
        this.showcoupon = false
      },
      filterGiftSku(giftskus, price) {
        let tempArr = giftskus.filter((el) => {
          return price >= el.fullPrice
        })
        return tempArr.length > 0 ? tempArr[0].giftSkuInfos : []
      },
      // 礼卡是否选中操作
      giftSelectCoupon(item,index){
        if(!item){
          this.giftIndex = null
          this.orderSettlement.valueCardCodeId = ''
          this.orderSettlement.giftMoney = 0
          giftData.balance = 0
          return
        }
          this.giftIndex = index
          giftIndex_ = index
          giftData_ = JSON.parse(JSON.stringify(item))
          giftData = JSON.parse(JSON.stringify(item))
      },
      giftClose(){
        if(isConfirm){
          this.giftSelectCoupon(giftData,this.giftIndex)
        }else if(this.giftDeduction>0){
          this.giftSelectCoupon(giftData_,giftIndex_)
        }else {
          this.giftSelectCoupon(null)
        }
        isConfirm = false
        this.$parent.calcPrice()
      },

      explainFun(item){
        let txt = ''
        if(item.permittedType == 1){
          txt = `仅${item.marketingName}活动商品可用`
        }
        if(item.permittedType == 2){
          txt = `仅${item.storeNames}店铺的商品可用`
        }
        this.explainText = txt
        this.explain = true
      },
      giftConfirm(){
        isConfirm = true
        this.showGift = false
        giftIndex_ = null
          if(+this.orderLastTotalPriceCopy > giftData.balance) {
          this.giftDeduction = giftData.balance
          }else {
            this.giftDeduction = this.orderLastTotalPriceCopy
          }
          this.orderSettlement.giftMoney = this.giftDeduction
          this.orderSettlement.valueCardCodeId = this.giftIndex == null ? null : giftData.valueCardCodeId
          this.$parent.calcPrice()
      },
      //格式化金额显示,s为金额数字，n为精确小数位,isAry 是否返回数组形式如: 23.88 ==> [23,88] 默认 false
      fmoney(s, n, isAry = false) {
        n = n > 0 && n <= 20 ? n : 2
        s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
        let l = s
            .split('.')[0]
            .split('')
            .reverse(),
          r = s.split('.')[1],
          t = ''
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
        }
        return isAry
          ? [
              t
                .split('')
                .reverse()
                .join(''),
              r,
            ]
          : t
              .split('')
              .reverse()
              .join('') +
              '.' +
              r
      },
    },
    filters: {
      dateFilter(value) {
        let arr = value.split(" ")[0];
        let str = arr.split('-').join('.')
        return str;
      },
      thumbnailString(value){
        if(value && value.length > 15){
          return value.substring(0,15)+'. . .'
        }
        return value
      },

      getPriceInt(val){
        return Math.floor(val)
      },
      getPricePrecision(val) {
        const num = Number(val).toFixed(2)
        return num.substring(num.length-3, num.length)
    }
    },
  }
</script>

<style lang="less" scoped>
.font-din {
    font-family: DINAlternate-Bold, DINAlternate;
}
  .buygiveboxwrapper {
    margin: 0.12rem 0.16rem 0rem -0.08rem;
    .buygivebox {
      padding: 0rem 0.12rem;
      color: #e60113;
      position: relative;
      display: inline-block;
      font-size: 0.48rem;
      transform: scale(0.833);
      height: 0.68rem;
    }
    .buygivebox::after {
      // top: -51%;
      border-radius: 0.08rem;
      border: 1px solid #e60113;
    }
  }
  .goodsboxwrapper {
    padding: 12px;
    background-color: #fff;
    border-radius: 0.4rem;
    margin-top: 0.48rem;
    color: #000;
    .goodsbox {
      overflow: hidden;
      margin-bottom: 12px;
      height: auto;
      .good-item {
        overflow: hidden;
        display: flex;
        justify-content: space-between;
      }
      .goodsimg {
        width: 102px;
        height: 102px;
        border-radius: 8px;
        border: 1px solid #eeeeee;
        margin-right: 0.4rem;
      }
      .goodsInfobox {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        .goodsInfobox-wrapper {
          flex: 1;
        }
        .goodsname {
          font-size: 13px;
          color: #191919;
          width: 99%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .goods_gg {
          font-size: 0.44rem;
          color: #999;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          label {
            margin-left: 0.28rem;
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
        .performate-point {
            display: flex;
            align-items: center;
            height: 14px;
            border-radius: 4px;
            color: #008864;
            font-size: 11px;
            font-weight: normal;
            line-height: 15px;
            background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
            margin-bottom: 4px;
            width: fit-content;
            padding: 1px 4px;
            >img {
              width: 14px;
              height: 14px;
            }
          }
        .pricebox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .pluscolor {
            /deep/ .van-stepper__plus {
              color: #d8d8d8;
            }
          }
          .price {
            color: #191919;
            font-size: 16px;
            font-weight: bold;
            line-height: 20px;
            .price_rmb {
              font-size: 12px;
            }
          }
          .price-wrapper {
            display: flex;
            align-items: center;
          }
          .goodsnum {
            font-size: 13px;
            color: #999;
          }
          /deep/ .van-stepper__minus {
            background-color: unset;
            color: #000;
            width: 0.72rem;
            height: 0.72rem;
          }
          /deep/ .van-stepper__plus {
            background-color: unset;
            color: #000;
            width: 0.72rem;
            height: 0.72rem;
          }
          /deep/ .van-stepper__minus--disabled,
          .van-stepper__plus--disabled {
            color: #d8d8d8;
          }
          /deep/ .van-stepper__minus::before {
            height: 0.08rem;
            border-radius: 1px;
          }
          /deep/ .van-stepper__plus::before {
            height: 0.08rem;
            border-radius: 1px;
          }
          /deep/ .van-stepper__minus::after {
            width: 0.08rem;
            border-radius: 1px;
          }
          /deep/ .van-stepper__plus::after {
            width: 0.08rem;
            border-radius: 1px;
          }
          /deep/ .van-stepper__input {
            background: #f5f5f5;
            border-radius: 0.2rem;
            width: 28px;
            height: 22px;
            color: #000;
            font-weight: bold;
            font-size: 13px;
          }
          .fqz-price{
            color: #191919;
            font-size: 11px;
            font-family: DINAlternate, DINAlternate;
            font-weight: 600;
            line-height: 17px;
            .special{
              font-size: 16px;
              font-weight: bold;
              line-height: 20px;
            }
        }
        }
        .performance-part {
          font-weight: normal;
          display: inline-block;
          height: 22px;
          background: #fcf0f2;
          border-radius: 11px;
          line-height: 22px;
          padding: 0 10px;
          font-size: 13px;
          color: #e60113;
        }
      }
      .giveGiftbox {
        .giveGift {
          display: flex;
          justify-content: space-between;
          color: #999;
          font-size: 0.44rem;
          margin-top: 0.32rem;
          p {
            width: 11rem;
          }
          span {
            // transform: scale(0.95);
            font-weight: bold;
            strong {
              vertical-align: text-top;
            }
          }
        }
      }
    }
    .freightbox {
      // margin-top: 15px;
      /deep/.van-cell__title, /deep/.van-cell__value, /deep/.van-cell__right-icon {
        line-height: 17px;
        height: 17px;
      }
      /deep/ .van-cell {
        padding: 10px 0 9px;
        color: #191919;
        font-size: 13px;
        position: relative;
        align-items: center;
      }
      /deep/ .van-cell::after {
        content: unset;
      }
      .remark {
        /deep/ .van-field__body {
          padding-right: 16px;
          width: 100%;
          font-size: 11px;
        }
        /deep/ .van-field__label {
          color: #191919;
        }
        /deep/ .van-field__control {
          color: #191919;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      /deep/ .van-cell__value {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .activity-item {
        .van-tag {
          border-radius: 4px;
        }
        /deep/ .van-cell__value {
          color: #FF0A35;
          padding-right: 16px;
        }
      }

      .FreightClick {
        /deep/ .van-cell__value {
          color: #191919;
          font-size: 11px;
        }
      }
      /deep/ .van-cell__right-icon {
        color: #999;
        font-size: 12px;
      }
    }
    .totalpricebox {
      color: #191919;
      font-size: 15px;
      text-align: right;
      padding: 8px 18px 0 0;
      position: relative;
      .allgoodsNum {
        color: #999;
        font-size: 10px;
      }
      strong {
        color: #191919;
      }
    }
    .totalpricebox::before {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0;
      top: 0;
      left: 0;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    /deep/ .van-overlay {
      background-color: rgba(0, 0, 0, 0.5);
    }
    &.bill-cell-wrapper {
      .van-cell {
        padding: 0;
      }
      /deep/.van-cell__value {
        font-size: 11px;
      }
    }
  }
  .freightwrapper {
    border-radius: 0.4rem 0.4rem 0 0;
    color: #000;
    /deep/ .van-popup__close-icon--top-right {
      top: 0.76rem;
      font-size: 0.72rem;
    }
    .freightbox {
      height: 100%;
      padding: 0 0.72rem;
      font-size: 0.56rem;
      .titlebox {
        font-size: 0.72rem;
        font-weight: bold;
        height: 50px;
        line-height: 50px;
      }
      .invoicetext {
        z-index: 1;
        left: 0;
        width: 100%;
        background-color: #fff;
        // margin-top: -0.4rem;
        border-radius: 0.8rem 0.8rem 0 0;
        padding: 0 0.72rem;
        img {
          width: 0.64rem;
          height: 0.64rem;
          position: absolute;
          right: 0.72rem;
          top: 0.8rem;
        }
      }
      .coupon-text {
        text-align: center;
      }
      .freightprice {
        position: relative;
        margin-top: 0.4rem;
        .choosebox {
          width: 0.72rem;
          height: 0.72rem;
          position: absolute;
          right: 0;
          top: 0.08rem;
        }
      }
      .confirmbox {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        border-top: 1px solid #f7f7f7;
        .confirm {
          text-align: center;
          height: 1.52rem;
          line-height: 1.52rem;
          background-color: #e60113;
          color: #fff;
          border-radius: 0.76rem;
          width: 13.56rem;
          margin: 0.24rem auto 0.24rem;
          display: inline-block;
        }
      }
    }

  }
  .confirmbox {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    border-top: 1px solid #f7f7f7;
    background-color: #fff;
    .confirm {
      text-align: center;
      height: 1.52rem;
      line-height: 1.52rem;
      background-color: #e60113;
      color: #fff;
      border-radius: 0.76rem;
      width: 13.56rem;
      margin: 0.24rem auto 0.24rem;
      display: inline-block;
    }
  }
  .gift_content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #F5F5F5;
    .gift_title {
      background-color: #fff;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      font-size: .64rem;
      color: #000;
      font-weight: 800;
    }
    .gift_list {
      flex: 1;
      box-sizing: border-box;
      padding: .48rem;
      padding-top: 0;
      overflow-y: scroll;
      .min_card {
        margin-top: 0.48rem;
        overflow: hidden;
        width: 100%;
        border-radius: 0.4rem;
        .up {
          color: #fff;
          background-color: #7689df;
          box-sizing: border-box;
          padding: 0.48rem;
          .txt_1 {
            display: flex;
            justify-content: space-between;
            font-size: 0.6rem;
            .sp {
              font-size: 0.48rem;
              display: flex;
              align-items: center;
            }
          }
          .txt_2 {
            margin-top: 0.4rem;
            display: flex;
            justify-content: space-between;
            span:nth-child(1) {
              font-size: 0.52rem;
            }
            span:nth-child(2) {
              font-size: 0.44rem;
            }
          }
        }
        .down {
          background-color: #fff;
          box-sizing: border-box;
          padding: 0.8rem 0.48rem;
          display: flex;
          .left {
            flex: 0.65;
            p:nth-child(1) {
              font-size: 0.48rem;
              span {
                font-size: 0.72rem;
              }
            }
            p:nth-child(2) {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 0.4rem;
              font-size: 0.48rem;
              color: #999;
            }
          }
          .right {
            flex: 0.35;
            display: flex;
            justify-content: flex-end;
            align-items: center;
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
    .gift_btn {
      height: 2rpx;
      .gift_confirmbox {
    width: 100%;
    border-top: 1px solid #f7f7f7;
    background-color: #fff;
    display: flex;
      justify-content: center;
    .gift_confirm {
      text-align: center;
      height: 1.52rem;
      line-height: 1.52rem;
      background-color: #e60113;
      color: #fff;
      border-radius: 0.76rem;
      width: 13.56rem;
      margin: 0.24rem auto 0.24rem;
      display: inline-block;
    }
  }
    }
  }
  .popup_text {
      width: 12.64rem;
      h3 {
        margin-top: 1.2rem;
        margin-bottom: 0.8rem;
        font-size: 0.64rem;
        color: #333;
        text-align: center;
      }
      .content {
        max-height: 12rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-size: 0.56rem;
        color: #333;
        box-sizing: border-box;
        padding: 0 1.2rem 0 1.2rem;
      }
      .instructions {
        max-height: 12rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-size: 0.56rem;
        color: #333;
        margin-bottom: 1.48rem;
        box-sizing: border-box;
        padding: 0 1.2rem 0 1.2rem;
      }
      .usage_record {
        max-height: 15rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-size: 0.56rem;
        color: #333;
        margin-bottom: 1.48rem;
        box-sizing: border-box;
        .item {
          padding: 0 0.8rem 0 0.8rem;
          .date {
            font-size: 0.52rem;
            color: #000;
            margin-top: 0.6rem;
          }
          .order {
            margin: 0.48rem 0;
            span:nth-child(1) {
              font-size: 0.52rem;
              color: #666;
            }
            span:nth-child(2) {
              padding: 0.12rem 0.24rem;
              border-radius: 0.44rem;
              display: inline-block;
              font-size: 0.44rem;
              color: #000;
              background-color: #f5f5f5;
            }
          }
          .money {
            padding-bottom: 0.6rem;
          }
        }
      }
      .image {
        text-align: center;
        p {
          margin-bottom: 4rem;
        }
      }
      .btn {
        margin: 0 auto;
        margin-top: 2.56rem;
        margin-bottom: 1.6rem;
        width: 6rem;
        text-align: center;
        height: 1.2rem;
        padding: 0.2rem 1.84rem;
        background-color: #e60113;
        border-radius: 0.6rem;
        font-size: 0.48rem;
        color: #fff;
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

</style>
