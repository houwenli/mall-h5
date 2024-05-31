<template>
    <div class="copun-item">
        <div  class="copun-item-wrapper" @click="Invoice()">
            <span class="label">发票</span>
            <div class="value">
                <span>{{listdata.type == '0' ? '不需要发票' : listdata.type == '1' ? listdata.title : listdata.invoiceCompanyName}}</span>
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
            </div>
        </div>

        <!-- 发票弹出层 -->
        <van-popup get-container="body" v-model="showInvoice" round close-icon="close" position="bottom" :style="{ height: '68.5%' }" class="freightwrapper" @click-overlay="showInvoice = false">
            <div class="freightbox">
                <p class="titlebox invoicetext">
                    发票
                    <img src="@/assets/img/close@2x.png" alt="" @click="showInvoice = false" />
                </p>
                <settlementinvoice :index="0" :settlementInvoice="listdata" @closeInvoce="closeInvoce" style="padding-top: 1.92rem"></settlementinvoice>
            </div>
        </van-popup>
    </div>
</template>
<script>
import settlementinvoice from '@/components/settlement/settlementinvoice'
export default {
    components: {
        settlementinvoice
    },
    data() {
        return {
            showInvoice: false,
            listdata: {
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
            }
        }
    },
    methods: {
        // 显示发票弹出层
        Invoice() {
            this.showInvoice = true
        },
        //关闭发票弹出层
        closeInvoce(val, index) {
            this.listdata = val
            this.showInvoice = false
            this.$emit('setData',[val],'invoiceList')
        },
    }
}
</script>

<style lang="less" scoped>
.copun-item {
  .copun-item-wrapper {
    display: flex;
    justify-content: space-between;
    .label {
      font-size: 13px;
      color: #191919;
      line-height: 17px;
      font-weight: bold;
    }
    .value {
      color: #6e6e6e;
      font-size: 13px;
      display: flex;
      align-items: center;
      > img {
        width: 16px;
        height: 16px;
      }
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
    }
  }
</style>

