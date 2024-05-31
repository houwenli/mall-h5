<template>
  <div class="boxwrapper" ref="exchangeBox">
    <top-header :title="'换货'" @clickBack="back"></top-header>
    <div class="scroll-container">
      <div class="tipsBox">
        <p>
          本次售后服务将由<span>{{ params.storeName }}</span>为你提供
        </p>
      </div>
      <!-- 申请商品 -->
      <div class="goodsBoxWrapper bgcolor" v-if="params.returnSku">
        <div class="goodsBox">
          <img :src="params.returnSku.skuImage" alt="" />
          <div class="goodsInfo">
            <div class="goodsInfo_title">
              <p class="overline">{{ params.returnSku.skuName }}</p>
              <p class="goodsInfo_spe">
                <span>购买数量：{{ params.returnSku.num }}</span>
                <span style="margin-left: 0.4rem">申请数量：{{ params.returnSku.num - params.returnSku.returnNum }}</span>
              </p>
            </div>
            <p class="goodsPrice"><span class="coin">¥</span><span class="int">{{ setPrice(params.returnSku.accurateUnitPrice)[0] }}</span><span class="float">.{{ setPrice(params.returnSku.accurateUnitPrice)[1] }}</span></p>
          </div>
        </div>
        <div class="applyNumBox">
          <label class="applyNum">申请数量</label>
          <van-stepper
            v-model="applyNum"
            integer
            min="1"
            :max="params.returnSku.returnNum"
            :disable-plus="applyNum == params.returnSku.returnNum"
            @click.native="addreduce(params.returnSku)"
            @blur="changeInputNum(params.returnSku)"
            class="stepperBox"
            :class="{ pluscolor: applyNum == params.returnSku.returnNum }"
          />
        </div>
      </div>
      <!-- 申请原因 -->
      <div class="applyReasonBox bgcolor">
        <div class="applyReason_top" @click="popupShow">
          <label class="applyReason_title">申请原因</label>
          <div class="applyReason_valueBox">
            {{ params.reason }}
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
            <!-- <label class="applyReason_value">{{ params.reason }}</label> -->
          </div>
        </div>
        <div class="applyReason">
          <van-field
            v-model="params.desc"
            rows="3"
            autosize
            clearable
            type="textarea"
            maxlength="200"
            placeholder="请描述申请售后服务的具体原因"
            show-word-limit
            class="content_data"
          />
        </div>
        <div class="applyReason_imgbox">
          <van-uploader
            v-model="params.pics"
            multiple
            :max-count="9"
            class="iconimg"
            :after-read="afterRead"
            :before-read="beforeRead"
            @delete="deleteimg"
          >
          <div class="add-pic-btn">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/upload-icon.png" alt="">
            <p>上传凭证</p>
            <p>(最多9张)</p>
          </div>
        </van-uploader>
        </div>
        <p class="applyReason_tips">为了帮您更好的解决问题，请务必上传照片凭证</p>
      </div>
      <!-- 退回金额 -->
      <div class="common_column bgcolor" @click="handleChangeSku()" v-if="params.orderType != 10">
        <div class="common_p">
          <label class="return_title">换新商品</label>
          <div class="chose_value">
            <label class="chose_value_empty_text" v-if="!changeSkuName">请选择需求要更换的新品</label>
            <label class="chose_value_text" v-else>{{ changeSkuName }}</label>
          </div>
        </div>
        <!-- 退回方式 -->
        <div class="common_p" v-if="params.returnSku">
          <label class="return_title">换货方式</label>
          <span class="return_value">自行寄回</span>
        </div>
      </div>

      <!-- 退回联系人 -->
      <!-- <div class="common_column bgcolor" v-if="params.orderAttr">
        <p class="common_p">
          <label class="return_title">联系人</label>
          <span class="return_value">{{ params.orderAttr.receiptName }}</span>
        </p>
        <p class="common_p">
          <label class="return_title">联系方式</label>
          <span class="return_value">{{ params.orderAttr.receiptMobileHidden }}</span>
        </p>
      </div> -->
      <!-- 收货信息 -->
      <div class="common_column bgcolor userInfo">
        <p class="column-header">
          收货地址 <span>（商家会将换货商品寄到此地址）</span>
        </p>

        <div class="flex_p" @click="toAddress()">
          <div>
            <p class="contact">
              <span class="return_title">{{ params.addressVo && params.addressVo.name }}</span>
              <span class="return_title">{{ params.addressVo && params.addressVo.mobile }}</span>
            </p>
          {{ params.addressVo && params.addressVo.address && params.addressVo.address.replace(/,/g, "")}} {{params.addressVo && params.addressVo.detailAddress && params.addressVo.detailAddress }}
          </div>
        </div>
      </div>
    </div>

    <div class="footer-btn" :class="{'footer-disabled': disabled}">
      <!-- 提交 -->
      <p class="submiTips">提交服务单后，售后专员可能与您电话沟通，请保持手机畅通</p>
      <div class="submitBox" @click="submitReturnGoods">提交</div>
    </div>

    <reason-popup ref="reasonPopup" @selectApply="selectApply"></reason-popup>

    <exchange-sku :show.sync="showSkuPopup" :skuId="changeSkuId" :storeId="storeId" :applyNum="applyNum" :orderType="params.orderType" @handleClose="showSkuPopup = false" @handleSumit="selectedChangeSku" :isExchangeGoods="true"></exchange-sku>

     <!-- 商品校验提示弹窗 -->
    <SecondConfirm
      :title="hintDialogText"
      cancleText="我知道了"
      :dialogshow="hintDialogShow"
      @closeBack="hintDialogShow = false"
      :hideConfirmBtn="true"
    ></SecondConfirm>
  </div>
</template>

<script>
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import exchangeSku from './component/exchangeSku'
  import {
    queryorderforreturn,
    applyReturnOrder,
    queryBackOrderDetail,
    updateAfterApply,
  } from '@/api/backorderlist'
  import { Toast, Uploader, Stepper, Sku } from 'vant'
  import TopHeader from '../components/topHeader.vue'
  import upLoaderImg from '@/utils/uploadimg'
  import ReasonPopup from './component/reasonPopup.vue'
  import { formatPrice, appBack } from '@/utils/utils'
  import { mapGetters } from 'vuex'
  import { queryCustomerAddress } from '@/api/customeraddressdetail'
  export default {
    components: {
      TopHeader,
      [Stepper.name]: Stepper,
      [Uploader.name]: Uploader,
      [Sku.name]: Sku,
      exchangeSku,
      ReasonPopup,
      SecondConfirm
    },

    data() {
      return {
        hintDialogText: "",
        hintDialogShow: false,
        showSkuPopup: false,
        changeSkuName: '',
        changeSkuId: '',
        storeId: '', // 店铺ID
        goodsData: '', //  详情
        applyNum: 1, // 申请换货数量
        params: {
          orderId: this.$route.query.orderId,
          orderSkuId: this.$route.query.orderSkuId,
          type: this.$route.query.type,
          reason: '', // 换货原因
          desc: '', // 换货说明
          pics: [], // 换货凭证
          returnSku: '',
          exchangeSkuId: '',
          userAddressId: '',
          addressVo: {}
        },
        imgList: [], // 换货凭证图片,
        id: this.$route.query.id,
        isThird: false, // 订单类型是否是第三方，为3时需要请求第三方售后原因
        isUploading: false
      }
    },
    computed: {
      ...mapGetters(['exchangeGoodsScorllTop']),
      disabled({params}) {
        return !params.reason || !params.desc || (!params.exchangeSkuId && this.params.orderType!=10)
      },
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      if (this.id) {
        this.getSererDetail()
      } else {
        this.getDetail()
        this.$nextTick(()=>{
          if (this.$store.getters.loadExchangeGoodsData) {
            this.$refs.reasonPopup.init({
              reason: ''
            })
            this.$store.commit('AFTER_SALES_CONFIG/LOAD_EXCHANGE_GOODS_DATA', false)
          }
        })
      }

    },
    methods: {
      setPrice(val) {
        return formatPrice(val).split('.')
      },
      //设置页面信息
      setPageInfo() {
        //设置地址信息
        let addressId = localStorage.getItem('exchangeGoodsAddressId')
        if (addressId) {
          this.params.userAddressId = addressId
          localStorage.removeItem('exchangeGoodsAddressId')
          //查询新的地址信息
          queryCustomerAddress(addressId).then(res => {
            this.params.addressVo = {
              name: res.name,
              mobile: res.mobile,
              address: res.address,
              detailAddress: res.detailAddress,
            }
            let pageParams = JSON.parse(JSON.stringify(this.params))
            this.params = pageParams
          })
          //重新设置页面高度
          this.$nextTick(() => {
            document.documentElement.scrollTop = this.exchangeGoodsScorllTop
          })
        }
        //从vuex拿回存储的页面信息
        let loadObj = this.$store.getters.exchangeGoodsPageData
        if (JSON.stringify(loadObj) !== '{}') {
          this.applyNum = loadObj.applyNum
          let params = Object.assign(this.params, loadObj.params)
          this.params = params
          this.changeSkuId = loadObj.params.exchangeSkuId
          this.changeSkuName = loadObj.changeSkuName
          //清空
          this.$store.dispatch('AFTER_SALES_CONFIG/saveExchangeGoodsPageData', {})
        }
      },
      // 申请换货详情
      getDetail() {
        let param = {
          orderSkuId: this.params.orderSkuId,
          orderId: this.params.orderId,
          type: this.params.type,
        }
        queryorderforreturn(param).then((res) => {
          if (res.code == 200) {
            this.goodsData = res.data
            let params = {...this.params, ...this.goodsData}
            this.params = params
            this.storeId = this.params.storeId
            this.params.addressVo = {
              name: this.params.orderAttr.receiptName,
              mobile: this.params.orderAttr.receiptMobileHidden,
              address: this.params.orderAttr.receiptAddress,
              detailAddress: this.params.orderAttr.receiptDetailAddress,
            }
            this.setPageInfo()

            this.isThird = (res.data || {}).placeOrderType == 3
          }
        })
      },
      // 修改换货详情
      getSererDetail() {
        let param = {
          id: this.id,
        }
        queryBackOrderDetail(param).then((res) => {
          if (res.code == 200) {
            this.goodsData = res.data
            let params = {...this.params, ...this.goodsData}
            this.params = params
            this.storeId = this.params.buyStoreId
            if (this.params.picsLists) {
              let tempimg = this.params.picsLists.map((temp) => {
                return {
                  url: temp,
                }
              })
              this.params.pics = tempimg
              this.imgList = tempimg
            } else {
              this.params.pics = []
              this.imgList = []
            }
            this.$nextTick(()=>{
              if (this.$store.getters.loadExchangeGoodsData) {
                this.$refs.reasonPopup.init({
                  reason: this.params.reason
                })
                this.$store.commit('AFTER_SALES_CONFIG/LOAD_EXCHANGE_GOODS_DATA', false)
              }
            })

            this.setPageInfo()

            this.isThird = (res.data || {}).backOrderType == 4
          }
        })
      },
      // 提交
      submitReturnGoods() {
        let params = {
          reason: this.params.reason,
          desc: this.params.desc,
          pics: [],
          returnSku: {
            num: this.applyNum,
            skuId: this.params.returnSku.skuId,
            price:
              this.applyNum == this.params.returnSku.returnNum
                ? this.params.returnSku.canRefundAmount
                : this.applyNum * this.params.returnSku.accurateUnitPrice,
          },
          orderId: this.$route.query.orderId ? this.$route.query.orderId : '',
          orderSkuId: this.$route.query.orderSkuId ? this.$route.query.orderSkuId : '',
          id: this.id ? this.id : '',
          type: this.$route.query.type,
          userAddressId: this.params.userAddressId,
          exchangeSkuId: this.params.orderType==10?this.params.returnSku.skuId:this.params.exchangeSkuId,//接口需要根据orderType判断一下，如果是10 就填当前skuId,
        }
        // ordertype = 10是礼品订单，需求是礼品订单换货不能选择商品
        if (!params.exchangeSkuId&&this.params.orderType!=10) {
          Toast('请选择换新商品')
          return
        }
        if (!params.reason) {
          Toast('请选择申请原因')
          this.params.pics = this.imgList
          return
        }
        if (!params.desc) {
          Toast('请填写问题描述信息')
          this.params.pics = this.imgList
          return
        }
        // IOS可存在一次性选择9张图片，图片上传为异步，需要等图片都上传完成才可提交数据
        if (this.isUploading) {
          Toast('图片正在上传中,请稍等')
          return
        }

        params.pics = this.imgList.map((res) => {
          return res.url
        })
        if (!this.id) {
          params.contactName = this.params.orderAttr.receiptName
          params.contactMobile = this.params.orderAttr.receiptMobile
          // 申请
          applyReturnOrder(params).then((res) => {
            if (res.code == 200) {
              //后端接口延时0.1s, 等待主从库数据同步
              setTimeout(() => {
                this.$router.push({
                  path: '/applyAfterSuccess',
                  query: {
                    id: res.data,
                  },
                })
              }, 100)
            } else {
              // this.params.pics = this.imgList
              Toast(res.description)
              this.imgList = []
              this.params.pics = []
            }
          })
        } else {
          // 修改
          updateAfterApply(params).then((res) => {
            if (res.code == 200) {
              this.$router.push({
                path: '/applyAfterSuccess',
                query: {
                  id: this.params.id,
                },
              })
            } else {
              // this.params.pics = this.imgList
              Toast(res.description)
              this.imgList = []
              this.params.pics = []
            }
          })
        }
      },
      // 数量改变
      changeInputNum(data) {
        if (this.applyNum >= data.returnNum) this.applyNum = data.returnNum
        else this.applyNum = this.applyNum
        // this.checkSkuOrSpu()
      },
      // 商品加 减
      addreduce(data) {
        if (this.applyNum >= data.returnNum) this.applyNum = data.returnNum
        else this.applyNum = this.applyNum
        // this.checkSkuOrSpu()
      },
      //校验商品是否可用
      async checkSkuOrSpu() {
        let data = {
          num: this.applyNum,
          spuId: this.params.returnSku.spuId,
        }
        if (this.params.exchangeSkuId) {
          data.skuId = this.params.exchangeSkuId
        }
        /**
         * TODE
         * 注释校验库存接口
         */
        // let response = await this.$store.dispatch('AFTER_SALES_CONFIG/checkExchangeSkuOrSpu', data)
        // if (response.code !== 200) {
        //   this.hintDialogText = response.description
        //   this.hintDialogShow = true
        //   this.params.exchangeSkuId = ''
        //   this.changeSkuId = ''
        //   this.changeSkuName = ''
        //   return false
        // } else return true
        return true
      },
      // 弹出层
      popupShow() {
        this.$refs.reasonPopup.init({
          reason: this.params.reason
        })
      },
      // 选中
      selectApply(data, i) {
        this.$set(this.params,'reason',data.title)
      },
      // 上传之前
      beforeRead(file) {
        if(file instanceof Array) {
          for(let i in file) {
            if (file[i].type !== 'image/jpeg' && file[i].type !== 'image/png' && file[i].type !== 'image/gif') {
              Toast('只允许上传jpg/png/gif格式的图片！')
              return false
            }
          }
        } else {
          if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            Toast('只允许上传jpg/png/gif格式的图片！')
            return false
          }
        }
        return true
      },
      //文件读取完成后的回调函数
      async afterRead(file) {
        this.isUploading = true

        if(file instanceof Array) {
          for(let i in file) {
            let uploadImg = await upLoaderImg(file[i].file) //使用上传的方法。file.file
            let dataimg = {
              url: uploadImg.data,
            }
            this.imgList.push(dataimg)
          }
        } else {
          let uploadImg = await upLoaderImg(file.file) //使用上传的方法。file.file
          let dataimg = {
            url: uploadImg.data,
          }
          this.imgList.push(dataimg)
        }
        this.isUploading = false
      },
      // 删除图片
      deleteimg(file, val) {
        let img = this.imgList.splice(val.index, 1)
      },
      back() {
        appBack(this)
      },
      toAddress() {
        // 如果是第三方商品不允许换地址
        if (this.isThird) {
          return
        }

        let scorllTop =
          window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.exchangeBox.getBoundingClientRect().top
        scorllTop = Math.abs(scorllTop) // 取绝对值
        //存储当前页滚动高度
        this.$store.dispatch('AFTER_SALES_CONFIG/setExchangeGoodsScorllTop', scorllTop)
        //存储当前页已填写信息
        let saveObj = {
          params: {
            reason: this.params.reason,
            desc: this.params.desc,
            pics: this.params.pics,
            exchangeSkuId: this.params.exchangeSkuId,
          },
          applyNum: this.applyNum,
          changeSkuName: this.changeSkuName,
        }
        this.$store.dispatch('AFTER_SALES_CONFIG/saveExchangeGoodsPageData', saveObj)

        this.$router.push({
          path: '/customeraddresslist',
          query: { from: 'exchangeGoods' },
        })
      },
      handleChangeSku() {
        // let flag = this.checkSkuOrSpu()
        let flag = true
        if (flag) {
          if (!this.changeSkuId) {
            this.changeSkuId = this.params.returnSku.skuId
          }
          this.showSkuPopup = true
        }
      },
      selectedChangeSku(data) {
        this.showSkuPopup = false
        this.changeSkuId = data.id
        this.params.exchangeSkuId = this.changeSkuId
        this.changeSkuName = data.name
        // this.checkSkuOrSpu()
      },
    },
  }
</script>

<style lang="less" scoped>
  .boxwrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    .scroll-container {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }
    .bgcolor {
      background-color: #fff;
    }
    .tipsBox {
      text-align: left;
      margin-bottom: 10px;
      p {
        font-size: 11px;
        color: #999;
        span {
          color: #FF0A35;
        }
      }
    }
    .goodsBoxWrapper {
      padding: 12px;
      color: #191919;
      border-radius: 12px;
      .goodsBox {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding-bottom: 12px;
        overflow: hidden;
        img {
          width: 102px;
          height: 102px;
          border-radius: 8px;
          margin-right: 8px;
        }
        .goodsInfo {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          .goodsInfo_title {
            overflow: hidden;
            flex: 1;
            width: 100%;
            .overline {
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              font-size: 13px;
            }
            .goodsInfo_spe {
              margin-top: 8px;
              font-size: 13px;
              color: #999;
            }
          }
          .goodsPrice {
            color: #191919;
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
            display: flex;
            justify-content: flex-end;
            align-items: baseline;
            .coin {
              font-size: 12px;
            }
            .float {
              font-size: 13px;
            }
          }
        }
      }
      .applyNumBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        border-top: 1px solid #eee;
        .applyNum {
          font-size: 14px;
        }
        .stepperBox {
          /deep/ .van-stepper__input {
            width: 1.6rem !important;
            height: 0.8rem !important;
            background: #f5f5f5;
            border-radius: 0.2rem;
          }
          /deep/ .van-stepper__minus {
            background-color: unset;
            width: 0.8rem;
            height: 0.8rem;
          }
          /deep/ .van-stepper__plus {
            background-color: unset;
            width: 0.8rem;
            height: 0.8rem;
          }
        }
      }
    }
    .applyReasonBox {
      padding: 10px 12px;
      border-radius: 12px;
      margin-top: 10px;
      .applyReason_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 17px;
        color: #191919;
        .applyReason_title {
          font-size: 13px;
          color: #191919;
        }
        .applyReason_valueBox {
          display: flex;
          align-items: center;
          font-size: 11px;
          img {
            margin-left: 6px;
            width: 16px;
            height: 16px;
          }
        }
      }
      .applyReason {
        padding: 10px 0;
        .content_data {
          background-color: #f6f6f6;
          border-radius: 8px;
          padding: 10px;
          /deep/ .van-field__word-limit {
            font-size: 11px;
            color: #999;

          }
          /deep/ .van-field__control {
              line-height: 17px;
              font-size: 13px;
            }
        }
      }
      .applyReason_imgbox {
        .iconimg {
          .add-pic-btn {
            border: 1px dotted #C3C3C3;
            width: 74px;
            height: 74px;
            border-radius: 8px;
            padding: 10px 0 6px;
            color: #999;
            font-size: 12px;
            text-align: center;
            >img {
              width: 24px;
              height: 24px;
              margin: 0 auto 6px;
              display: block;
            }
            >p {
              line-height: 14px;
              transform: scale(0.83);
            }
          }
          /deep/ .van-uploader__upload {
            border: 1px dashed #999;
            width: 74px;
            height: 74px;
          }
          /deep/ .van-uploader__preview {
            margin-right: 12px;
            margin-bottom: 12px;
            .van-image__img {
              border-radius: 8px;
            }
            &:nth-child(4n) {
              margin-right: 0;
            }
            &:nth-child(4n - 1) {
              margin-right: 11px;
            }
          }
          /deep/ .van-uploader__input-wrapper {
            margin-right: 12px;
            margin-bottom: 12px;
            &:nth-child(4n) {
              margin-right: 0;
            }
            &:nth-child(4n - 1) {
              margin-right: 11px;
            }
          }
          /deep/ .van-uploader__preview-image {
            width: 74px;
            height: 74px;
          }

          /deep/ .van-uploader__upload-text {
            text-align: center;
            margin-top: 0;
            color: #999;
            line-height: 1.2;
          }
          /deep/ .van-uploader__preview-delete {
            width: 16px;
            height: 16px;
            top: -8px;
            right: -8px;
            background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_image_upload_delect.png') center no-repeat;
            background-size: 16px;
            border-radius: 0;
            .van-icon {
              display: none;
            }
          }
        }
      }
      .applyReason_tips {
        color: #999;
        font-size: 11px;
        line-height: 15px;
      }
    }
    .common_column {
      margin-top: 10px;
      padding: 20px 18px;
      border-radius: 10px;
      .column-header {
        color: #191919;
        line-height: 17px;
        margin-bottom: 9px;
        >span {
          color: #999;
          font-size: 11px;
        }
      }
      .contact {
        margin-bottom: 4px;
        color: #191919;
        font-size: 13px;
        font-weight: bold;
      }
      .common_p {
        line-height: 17px;
        color: #191919;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        margin-bottom: 19px;
        &:last-child {
          margin-bottom: 0;
        }

        .chose_value {
          font-size: 11px;
          padding-right: 22px;
          background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png') no-repeat right center;
          background-size: 16px 16px;
          .chose_value_text {
            color: #191919;
          }
          .chose_value_empty_text {
            color: #999;
          }
          strong {
            padding-left: 14px;
            span {
              display: inline-block;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: #999;
              vertical-align: middle;
            }
          }
        }
        .return_value {
          font-size: 11px;
          padding-right: 22px;
        }
      }
      .flex_p {
        display: flex;
        flex-wrap: nowrap;
        padding-right: 28px;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png') no-repeat right center;
        background-size: 16px 16px;
        color: #6E6E6E;
        font-size: 13px;
        line-height: 17px;
      }

    }
    .footer-btn {
      background: #fff;
      padding: 6px 12px 4px;
      padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
      padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
      .submiTips {
        font-size: 11px;
        transform: scale(0.93);
        text-align: center;
        color: #999;
      }
      .submitBox {
        width: 100%;
        margin: 6px auto 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFF9E9;
        height: 40px;
        border-radius: 20px;
        font-size: 16px;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      }
    }

    .footer-disabled {
      .submitBox {
        background: #eee;
        color: #999;
      }
    }

  }
</style>
