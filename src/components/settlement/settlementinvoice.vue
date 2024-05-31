<template>
  <div class="invoiceWrapper">
    <!-- 发票tabs -->
    <van-tabs v-model="invoice.type" @change="invoiceChange" class="tabsbox" title-inactive-color="#000" title-active-color="#E60113">
      <van-tab title="不开发票" name="0"></van-tab>
      <van-tab title="电子普通发票" name="1"></van-tab>
      <van-tab title="增值税专用发票" name="2"></van-tab>
    </van-tabs>

    <!--电子普通发票-->
    <div v-if="invoice.type == '1'">
      <div class="commonInvoicebox">
        <p class="invoiceTitle">发票抬头</p>
        <van-tabs v-model="invoice.titleType" class="invoicetabs" @change="invoiceChangeTitle" title-inactive-color="#000" title-active-color="#E60113">
          <van-tab title="个人" name="2"></van-tab>
          <van-tab title="单位" name="1"></van-tab>
        </van-tabs>
      </div>
      <div class="rise_box userinfo" v-if="invoice.titleType == '2'">
        <van-field v-model="invoice.title" required clearable label="个人名称" placeholder='请填写"个人"或您的姓名' />
      </div>
      <div class="rise_box userinfo company" v-else>
        <van-field v-model="invoice.title" required clearable label="单位名称" placeholder="请填写单位名称" />
        <van-field v-model="invoice.taxId" required clearable label="纳税人识别码" placeholder="请在此填写纳税人识别号" class="userCode"/>
      </div>
    </div>

    <!-- 增值税发票 -->
    <div class="commonInvoicebox userinfo taxInvoicebox" v-if="invoice.type == '2'">
      <p class="invoiceTitle userInfoTitle">发票抬头</p>
      <van-field v-model="invoice.invoiceCompanyName" required clearable label="单位名称" maxlength="45" placeholder="请填写单位名称" />
      <van-field v-model="invoice.taxId" required clearable label="发票税号" maxlength="45" placeholder="请填写纳税人识别号" />
      <van-field v-model="invoice.invoiceRegisterAddress" required clearable label="注册地址" maxlength="128" placeholder="请填写注册地址" />
      <van-field v-model="invoice.invoiceRegisterMobile" required clearable label="注册电话" maxlength="18" placeholder="请填写注册电话" @blur="telCheck(invoice.invoiceRegisterMobile)"/>
      <van-field v-model="invoice.invoiceOpenBank" required clearable label="开户银行" maxlength="64" placeholder="请填写开户银行" />
      <van-field v-model="invoice.invoiceBankAccount" required clearable label="银行账号" maxlength="64" placeholder="请填写银行账号" @blur="accountCheck(invoice.invoiceBankAccount)" />
    </div>

    <!-- 收票人信息 -->
    <div class="commonInvoicebox userinfo user" v-if="invoice.type != '0'">
      <p class="invoiceTitle userInfoTitle">收票人信息</p>
      <van-field v-model="invoice.invoicePhone" required clearable label="收票人手机" @blur="phoneCheck(invoice.invoicePhone)" placeholder="请填写手机号码" />
      <van-field v-model="invoice.invoiceMail" required clearable label="收票人邮箱" @blur="mailCheck(invoice.invoiceMail)" placeholder="用来接收电子发票邮件" />
    </div>
    <!-- 发票内容 -->
    <div class="commonInvoicebox contentbox"  v-if="invoice.type != '0'" style="border-bottom:unset; padding-bottom: 2.8rem">
      <p class="invoiceTitle contenttitle">发票内容</p>
      <van-tabs v-model="invoice.content" class="invoicetabs" title-inactive-color="#000" title-active-color="#E60113">
        <van-tab title="商品明细" name="1"></van-tab>
        <van-tab title="商品类别" name="2"></van-tab>
      </van-tabs>
      <p class="tips">发票内容将显示本单商品所属类别及价格信息，发票金额为实际支付金额，不含虚拟资产、优惠等扣减金额。</p>
    </div>

    <div class="confirmbox">
      <span class="confirm" @click="chooseInvoice">确定</span>
    </div>
  </div>
</template>

<script>
  import { Button, Toast, CellGroup, Switch, Field, Stepper, Popup,Tab, Tabs  } from 'vant'
  import { isEmail, isMobilePhone, isNumber } from '@/utils/validate'

  export default {
    components: {
      [Tab.name]:Tab,
      [Tabs.name]:Tabs,
      [Field.name]:Field,
      [Toast.name]:Toast,
    },
    data() {
      return {
        invoice: {
          storeId:'',   // 店铺id
          type: '0', //  发票类型 0 不需要发票 1 普通增值税发票 2 增值税发票
          title: '', // 发票抬头
          taxId: '', // 发票增值税号
          titleType: '1', // 发票抬头类型 1 企业 2 个人
          invoiceCompanyName: '', //公司名称
          invoiceRegisterAddress: '', // 注册地址
          invoiceRegisterMobile: '', // 注册电话
          invoiceOpenBank: '', // 开户银行
          invoiceBankAccount: '', // 开户账户
          invoicePhone:'',    // 收票人手机
          invoiceMail:'',    // 收票人邮箱
          content: '1', // 发票内容 1 商品明细 2 商品类别
        },
      }
    },
    props: [
      'settlementInvoice',  // form信息表单
      'index',               // 商家下标
    ],
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.invoice = JSON.parse(JSON.stringify(this.settlementInvoice))
    },
    methods: {
      // 手机校验
      phoneCheck(value) {
        if (!isMobilePhone(value)) return Toast('请输入正确的手机号')
      },
      // 邮箱校验
      mailCheck(value) {
        if (!isEmail(value)) return Toast('请输入正确的邮箱')
      },
      // 注册电话校验
      telCheck(value) {
        if (!isNumber(Number(value))) return Toast('请在注册电话输入非负整数')
      },
      //银行账号校验
      accountCheck(value) {
        if (!isNumber(Number(value))) return Toast('请在银行账号输入非负整数')
      },
      // 发票类型改变
      invoiceChange() {
        this.invoice.title = ''
        this.invoice.taxId = ''
        this.invoice.titleType == '1'
        this.invoice.invoiceCompanyName = ''
        this.invoice.invoiceRegisterAddress = ''
        this.invoice.invoiceRegisterMobile = ''
        this.invoice.invoiceOpenBank = ''
        this.invoice.invoiceBankAccount = ''
        this.invoice.invoicePhone = ''
        this.invoice.invoiceMail = ''
        this.invoice.content = '1'
      },
      // 发票抬头改变
      invoiceChangeTitle() {
        this.invoice.title = ''
        this.invoice.taxId = '';
      },
      // 选择发票
      chooseInvoice() {
        if (this.invoice.type == '1') { // 电子发票
          if (!this.invoice.title) {
            if (this.invoice.titleType == '2') Toast('请填写个人名称!');
            else  Toast('请填写单位名称!');
            return
          }
          if (this.invoice.titleType == '1' && !this.invoice.taxId) {
            Toast('请填写纳税人识别码!');
            return
          }
        } else if (this.invoice.type == '2') { // 增值税发票
          // 增值税专票
          if (!this.invoice.invoiceCompanyName) {
            Toast('请填写单位名称!');
            return
          }
          if (!this.invoice.taxId) {
            Toast('请填写纳税人识别号!');
            return
          }
          if (!this.invoice.invoiceRegisterAddress) {
            Toast('请填写注册地址!');
            return
          }
          if (!this.invoice.invoiceRegisterMobile) {
            Toast('请填写注册电话!');
            return
          } else {
            if(!isNumber(this.invoice.invoiceRegisterMobile)) {
              Toast('请在注册电话输入非负整数!');
              return false
            }
          }
          if (!this.invoice.invoiceOpenBank) {
            Toast('请填写开户银行!');
            return
          }
          if (!this.invoice.invoiceBankAccount) {
            Toast('请填写银行账户!');
            return
          } else {
            if(!isNumber(this.invoice.invoiceBankAccount)) {
              Toast('请在银行账号输入非负整数!');
              return false
            }
          }
        }
        if (this.invoice.type != '0') {
          if (!this.invoice.invoicePhone) {
            Toast('请填写收票人手机号!');
            return false
          } else {
            if(!isMobilePhone(this.invoice.invoicePhone)) {
              Toast('请输入正确的手机号!');
              return false
            }
          }
          if (!this.invoice.invoiceMail) {
            Toast('请填写收票人邮箱!');
            return false
          } else {
            if(!isEmail(this.invoice.invoiceMail)) {
              Toast('请输入正确的邮箱!');
              return false
            }
          }
        }
        this.$emit('closeInvoce', this.invoice,this.index)
        // this.$emit('update:settlementInvoice',this.invoice)

      },
      keyboardDown() {
        window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
      },
    },
  }
</script>

<style lang="less" scoped>
.invoiceWrapper{
  // height: 100%;
  padding-top: 0 !important;
  color: #000;
  /deep/ .van-tabs__line{
    display: none;
  }
  .tabsbox{
    border-bottom: 1px solid #f7f7f7;
    padding-bottom: 0.12rem;
    /deep/ .van-tab{
      height: 1.2rem;
      background-color: #F2F2F2;
      border-radius: 0.6rem;
      font-size: 0.48rem;
      border: 1px solid #F2F2F2;
    }
    /deep/ .van-tab:nth-child(2){
      margin:  0 0.4rem;
    }
    /deep/ .van-tab--active{
      border: 1px solid #E60113;
      background-color: #fff;
      color: #E60113!important;
    }
  }
  .commonInvoicebox{
    padding-bottom: 0.2rem;
    border-bottom: 1px solid #f7f7f7;
    .invoiceTitle{
      margin: 0.68rem 0;
      font-size: 0.52rem;
      font-weight: bold;
    }
    /deep/ .van-tabs__nav{
      display: block;
    }
    /deep/ .van-tab{
      display: inline-block;
      height: 1.2rem;
      line-height: 1.2rem;
      border-radius: 0.6rem;
      background-color: #F2F2F2;
      border: 1px solid #f2f2f2;
      width: 3.4rem;
      text-align: center;
      margin-right: 0.48rem;

    }
    /deep/ .van-tab--active{
      background-color: #fff;
      border: 1px solid #E60113;
      color: #E60113;
    }
  }
  .rise_box{
    /deep/ .van-cell{
      padding-left: unset;
      font-size: 0.48rem;
    }
    /deep/ .van-field__label{
      color: #000;
    }
    /deep/ .van-cell::after{
      content: unset;
    }
  }
  .userinfo{
    /deep/ .van-cell{
      padding-left: 0.32rem;
      // padding-left: 0;
      font-size: 0.48rem;
    }
    /deep/ .van-field__label{
      color: #000;
    }
    /deep/ .van-cell::after{
      content: unset;
    }
    /deep/ .van-cell--required::before{
      left:0;
      // left:1.96rem;
    }
    /deep/ .van-field__body{
      input::-webkit-input-placeholder {
        color: #BABABA !important;
      }
      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #BABABA !important;
      }
      input::-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #BABABA !important;
      }
      input::-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #BABABA !important;
      }
    }
    /deep/ .van-field__control{
      color: #000;
    }
  }
  .company{
    .userCode {
      /deep/ .van-field__body{
        input::-webkit-input-placeholder {
          color: #E60113 !important;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #E60113 !important;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #E60113 !important;
        }
        input::-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #E60113 !important;
        }
      }
    }
  }
  // .user{
    // /deep/ .van-cell--required::before{
      // left:2.4rem;
    // }
  // }
  .contentbox{
    .tips{
      color: #999;
      font-size: 0.48rem;
    }
  }

  .confirmbox{
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    border-top: 1px solid #f7f7f7;
    background-color: #fff;
    .confirm{
      text-align: center;
      height: 1.52rem;
      line-height: 1.52rem;
      background-color: #E60113;
      color: #fff;
      border-radius: 0.76rem;
      width: 13.56rem;
      margin: 0.24rem auto 0.24rem;
      display: inline-block;
    }
  }
}

</style>
