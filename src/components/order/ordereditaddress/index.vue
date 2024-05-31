<template>
    <div class="boxwrapper">
      <navbartop title="编辑收货地址" :isConfirm="true" @clickBack="backLastPage"></navbartop>
  
      <group class="addressInfo">
        <van-field v-model="addressForm.name" :maxlength="15" label="收货人" placeholder="请填写收货人姓名" clearable />
        <van-field v-model="addressForm.mobile" :maxlength="11" label="手机号码" placeholder="请填写收货人手机号" clearable />
        <van-field v-model="addressForm.addressValue" :maxlength="11" label="所在地区" placeholder="请填写收货人手机号" clearable disabled />
    
        <van-field
          class="adressDetail"
          v-model="addressForm.detailAddress"
          maxlength="50"
          rows="1"
          autosize
          label="详细地址"
          type="textarea"
          placeholder="街道、楼牌号等"
          clearable
        />
      </group>

      <div>
        <div class="footer_save footbtnbox" @click="save">
          <span class="addAddressbtn">确认</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Group } from 'vux'
  import { Toast } from 'vant'
  import navbartop from '@/components/commons/navBartop'
  
  import { updateReceiptInfo } from '@/api/orderlist'

  import {
    isMobilePhone, //判断是否是手机号码
  } from '@/utils/validate'
  
  export default {
    components: {
      navbartop,
      Group
    },
    data() {
      return {
        addressForm: {
          name: '', //收货人姓名
          mobile: '', //手机号码
          detailAddress: '', //详细地址
          addressValue: '', // 所在地区
          orderIdList: [], // 订单id集合
        },
      }
    },
    created() {
      this.initQuery()
    },
    methods: {
      initQuery() {
        let orderdetail = {}
        try{
          orderdetail = JSON.parse(this.$route.query.orderdetail)
        }catch(e) {
          orderdetail = {}
        }

        // 组装地址数据
        this.addressForm = Object.assign({}, orderdetail)
      },
      // 返回上一页
      backLastPage() {
        this.$router.go(-1)
      },
      //保存信息
      save() {
        this.update()
      },
      //修改收货地址
      update() {
        if (!this.createAddressForm()) {
          Toast(this.errorMsg)
          return
        }
        updateReceiptInfo(this.addressForm).then((res) => {
          if (res.code == 200 && res.data) {
            Toast('修改成功')
            this.backLastPage()
          } else {
            Toast(res.description)
          }
        })
      },
      //构建表单信息
      createAddressForm() {
        if (this.addressForm.name == '') {
          this.errorMsg = '请输入收货姓名'
          return false
        }
        if (this.addressForm.mobile == '') {
          this.errorMsg = '请输入手机号码'
          return false
        }
        if (!isMobilePhone(this.addressForm.mobile)) {
          this.errorMsg = '手机格式不对，请重新输入'
          return false
        }
        if (this.addressForm.detailAddress == '') {
          this.errorMsg = '请输入详细地址'
          return false
        }
        return true
      },
    },
  }
  </script>
  
  <style lang="less" scoped>
  .boxwrapper {
    .addressInfo {
      /deep/ .van-cell {
        line-height: 44px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
      }

      /deep/ .van-cell:after {
        content: unset;
      }

      /deep/ .van-field__label {
        width: 68px;
        margin-right: unset;
        color: #191919;  
        font-weight: 500;
        font-size: 13px;
      }

      /deep/ .van-field__value {
        width: 283px;
        margin-right: unset;
        color: #333;
        border-radius: 8px;
        background: rgba(246, 246, 246, 0.5);
        padding: 0 16px;
      }
      /deep/ .van-field__control {
        color: #000;
      }
      .adressDetail {
        padding-bottom: 20px;
        align-items: flex-start;
        /deep/ .van-field__value {
          min-height: 78px;
          line-height: 39px;
        }
        /deep/ .van-field__control {
          color: #000;
        }
      }
  
      /deep/ .weui-cells {
        border-radius: 0 0 0.4rem 0.4rem;
      }
      /deep/ .weui-cells:after {
        content: unset;
      }
      /deep/ .weui-cells::before {
        content: unset;
      }

      /deep/ .van-field__body {
        input::-webkit-input-placeholder {
          color: #bababb !important;
        }
  
        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #bababb !important;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #bababb !important;
        }
        input::-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #bababb !important;
        }
        textarea::-webkit-input-placeholder {
          color: #bababb !important;
        }
        textarea::-moz-placeholder {
          color: #bababb !important;
        }
        textarea::-moz-placeholder {
          color: #bababb !important;
        }
        textarea::-ms-input-placeholder {
          color: #bababb !important;
        }
      }
    }
  
    .footbtnbox {
      border-top: unset;
      text-align: center;
      left: 50%;
      margin-left: -6.78rem;
      bottom: 0.8rem;
      background-color: #e60113;
      width: 13.56rem;
      height: 1.52rem;
      line-height: 1.48rem;
      font-size: 0.64rem;
      color: #fff;
      border-radius: 1rem;
      font-weight: bold;
      padding: unset;
    }
    .footer_save {
      margin: 1.2rem auto 0.8rem;
    }
    
  }
  </style>
  