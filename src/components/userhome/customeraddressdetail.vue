<template>
  <div :style="getStyle" class="boxwrapper">
    <navbartop :title="this.type == '1' ? '新增收货地址' : '编辑收货地址'" :isConfirm="true" @clickBack="backLastPage"></navbartop>

    <!-- <van-cell-group>
      <van-field v-model="value" label="收货人" placeholder="请填写收货人姓名" clearable />
      <van-field v-model="value" label="手机号码" placeholder="请填写收货人手机号" clearable />
      <van-cell title="所在地区" is-link @click="showarea = true" />
      <van-popup v-model="showarea" round position="bottom" :style="{ height: '30%' }">
        <van-picker show-toolbar :columns="addressListData" @cancel="showarea = false" @confirm="onConfirm" />
        <van-area :area-list="addressListData" value="addressValue" />
      </van-popup>
      <van-field v-model="value" rows="1" autosize label="详细地址" type="textarea" placeholder="街道、楼牌号等" clearable />
    </van-cell-group> -->

    <!-- <group v-if="isLoading" class="addressInfo"> -->
    <group class="addressInfo">
      <van-field v-model="addressForm.name" :maxlength="15" label="收货人" placeholder="请填写收货人姓名" clearable />
      <van-field v-model="addressForm.mobile" :maxlength="11" label="手机号码" placeholder="请填写收货人手机号" clearable />
      <!-- <x-input title="收货人" placeholder="请填写收货人姓名" :max="15" v-model="addressForm.name"></x-input>
      <x-input title="手机号码" placeholder="请填写收货人手机号" :max="11" v-model="addressForm.mobile" keyboard="number"></x-input> -->
      <popup-picker
        class="adressPicker"
        title="所在地区"
        placeholder="请选择所在地区"
        value-text-align="left"
        :data="addressListData"
        :columns="3"
        v-model="addressValue"
        popup-picker-header-text-color="#E60113"
        popup-header-right-text-color="#E60113"
        show-name
      ></popup-picker>
      <!-- <van-cell-group class="adressDetail"> -->
      <!--  -->
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
      <!-- </van-cell-group> -->
      <!-- <x-input title="详细地址" placeholder="街道、楼牌号等" v-model="addressForm.detailAddress" :max="64"></x-input> -->
    </group>

    <van-cell center title="设置默认地址" class="defaultAddress">
      <template #right-icon>
        <van-switch v-model="defaultValue" size="24" active-color="#e60113" />
      </template>
    </van-cell>
    <div class="footbtnbox footer_btn" @click="save" v-if="this.type == '1'">
      <span class="addAddressbtn">保存并使用</span>
    </div>

    <div v-else>
      <div class="footer_save footbtnbox" @click="save">
        <span class="addAddressbtn">确认</span>
      </div>
      <div class="footer_delete footbtnbox" @click="delAddress">
        <span class="addAddressbtn">删除地址</span>
      </div>
    </div>

    <!-- 二次确认 -->
    <SecondConfirm
      :title="!this.backOrdelete ? '是否确认删除改地址？' : '是否保存本次编辑结果'"
      :cancleText="!this.backOrdelete ? '取消' : '不保存'"
      :sureText="!this.backOrdelete ? '删除' : '保存'"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
    ></SecondConfirm>
  </div>
</template>

<script>
import { Group, XButton, PopupPicker, XInput, CheckIcon } from 'vux'
import { Button, Toast, CellGroup, Cell, Switch, Field } from 'vant'
import navbartop from '@/components/commons/navBartop'
import SecondConfirm from '@/components/commons/SecondConfirm'
import {
  addAddress, //新增用户收货地址
  updateAddress, //修改收货地址
  deleteCustomerAddressById, //删除地址
  queryCustomerAddress, //根据收货地址id查询收货地址
  queryAllAreas, //查询所有省份(包含下面的市区)
} from '@/api/customeraddressdetail'
import {
  isMobilePhone, //判断是否是手机号码
} from '@/utils/validate'

export default {
  components: {
    Group,
    Cell,
    XButton,
    PopupPicker,
    XInput,
    CheckIcon,

    navbartop,
    SecondConfirm,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Switch.name]: Switch,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Field.name]: Field,
    // [Area.name]: Area,
    // [Picker.name]: Picker,
    // [Popup.name]: Popup,
  },
  data() {
    return {
      value: '',
      showarea: false,
      dialogshow: false, //
      backOrdelete: true, // 删除弹窗or返回弹窗

      defaultValue: false, //是否设为默认地址
      type: this.$route.query.type, //操作类型   1 新增  2 编辑
      addressListData: [], //地区数组
      addressValue: [], //已选地区信息
      isLoading: false,
      errorMsg: '', //错误信息
      settlementParams: {}, // 结算页带过来的参数
      from: '', //来自哪里
      addressForm: {
        name: '', //收货人姓名
        phone: '', //固定电话
        mobile: '', //手机号码
        zipCode: '', //邮编
        address: '', //地址(省市区)
        detailAddress: '', //详细地址
        provinceId: '', // 省id
        cityId: '', //市id
        countryId: '', //区id
        isDefault: '', //是否默认收货地址 0 否 1 是
      },
    }
  },

  computed: {
    getStyle() {
      let c =  { overflow: this.dialogshow ? 'hidden' : '', height: '100%' }

      return c
    }

  },

  created() {
    this.queryAreas()
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.settlementParams = JSON.parse(this.$route.query.params)
    this.from = this.$route.query.from
    console.log('params////////////', this.settlementParams)
  },
  methods: {
    // 弹窗左边按钮
    closeBack() {
      if (this.backOrdelete) {
        localStorage.removeItem('addressInfo')
        localStorage.removeItem('addressValue')
        localStorage.removeItem('editres')
        this.$router.back()
      }
      this.dialogshow = false
    },
    // 弹窗右边按钮
    rightEvent() {
      let _this = this
      if (_this.backOrdelete) {
        if (_this.type == '2') _this.addressForm.addtype = 2 // 编辑信息标识
        // else _this.addressForm.addtype = 1

        _this.addressForm.isDefault = _this.defaultValue
        localStorage.setItem('addressInfo', JSON.stringify(_this.addressForm))
        localStorage.setItem('addressValue', JSON.stringify(_this.addressValue))
        _this.dialogshow = false
        // _this.$router.back()
        this.save()
      } else {
        deleteCustomerAddressById(_this.$route.query.id).then((res) => {
          if (res > 0) {
            _this.toAddressList()
          } else {
            Toast('默认地址不能删除')
          }
        })
      }
    },
    // 返回上一页
    backLastPage(value) {
      if (this.addressForm.name || this.addressForm.phone || this.addressForm.address || this.addressForm.detailAddress) {
        let editres = JSON.parse(localStorage.getItem('editres'))
        // console.log(this.addressForm,'列表form');
        // console.log(editres,'缓存中的编辑数据');
        if (editres) {
          if (
            this.addressForm.name == editres.name &&
            this.addressForm.mobile == editres.originMobile &&
            this.addressForm.detailAddress == editres.detailAddress &&
            this.addressForm.isDefault == editres.isDefault &&
            this.addressForm.provinceId == editres.provinceId &&
            this.addressForm.cityId == editres.cityId &&
            this.addressForm.countryId == editres.countryId
          ) {
            this.$router.go(-1)
          } else {
            this.backOrdelete = true
            this.dialogshow = true
          }
        } else {
          this.backOrdelete = true
          this.dialogshow = true
        }
      } else {
        this.$router.go(-1)
      }
    },

    //查询地区信息
    queryAreas() {
      queryAllAreas().then((res) => {
        this.addressListData = res
        this.showInfo()
      })
    },
    //编辑时展示原信息
    showInfo() {
      let datainfo = JSON.parse(localStorage.getItem('addressInfo'))
      let addresdata = JSON.parse(localStorage.getItem('addressValue'))
      if (this.type != '2') {
        //新增
        this.isLoading = true
        let res = datainfo
        if (res) {
          this.addressForm.name = res.name
          this.addressForm.phone = res.originPhone
          this.addressForm.mobile = res.originMobile || res.mobile
          this.addressForm.zipCode = res.zipCode
          this.addressForm.address = res.name
          this.addressForm.detailAddress = res.detailAddress
          this.addressForm.provinceId = res.provinceId
          this.addressForm.cityId = res.cityId
          this.addressForm.countryId = res.countryId
          this.addressForm.isDefault = res.isDefault
          this.defaultValue = res.isDefault == '1'
          // this.addressValue = ['P-' + res.provinceId, 'C-' + res.cityId, 'D-' + res.countryId]
          this.addressValue = addresdata
        }
        return
      } else {
        // 编辑
        queryCustomerAddress(this.$route.query.id).then((res) => {
          // console.log('编辑RES', res)
          localStorage.setItem('editres', JSON.stringify(res)) // 对比编辑页面信息有无变动

          if (datainfo && datainfo.addtype == 2) {
            // 编辑信息修改了
            let res = datainfo
            // console.log('改动res', res)
            this.addressForm.name = res.name
            this.addressForm.phone = res.originPhone
            this.addressForm.mobile = res.originMobile || res.mobile
            this.addressForm.zipCode = res.zipCode
            this.addressForm.address = res.name
            this.addressForm.detailAddress = res.detailAddress
            this.addressForm.provinceId = res.provinceId
            this.addressForm.cityId = res.cityId
            this.addressForm.countryId = res.countryId
            this.addressForm.isDefault = res.isDefault
            this.defaultValue = res.isDefault == '1'
            // this.addressValue = ['P-' + res.provinceId, 'C-' + res.cityId, 'D-' + res.countryId]
            this.addressValue = addresdata
          } else {
            // 编辑信息无修改
            this.addressForm.name = res.name
            this.addressForm.phone = res.originPhone
            this.addressForm.mobile = res.originMobile
            this.addressForm.zipCode = res.zipCode
            this.addressForm.address = res.name
            this.addressForm.detailAddress = res.detailAddress
            this.addressForm.provinceId = res.provinceId
            this.addressForm.cityId = res.cityId
            this.addressForm.countryId = res.countryId
            this.addressForm.isDefault = res.isDefault
            this.defaultValue = res.isDefault == '1'
            this.addressValue = ['P-' + res.provinceId, 'C-' + res.cityId, 'D-' + res.countryId]
          }
          this.isLoading = true
        })
      }
    },
    //保存信息
    save() {
      if (this.type == '1') {
        this.insert()
      }
      if (this.type == '2') {
        this.update()
      }
    },
    //新增收货地址
    insert() {
      if (!this.createAddressForm()) {
        Toast(this.errorMsg)
        return
      }
      addAddress(this.addressForm).then((res) => {
        if (res.code == 200 && res.data) {
          Toast('新建成功')
          this.toAddressList('add', res.data.id)
        } else {
          Toast(res.description)
        }
      })
    },
    //修改收货地址
    update() {
      if (!this.createAddressForm()) {
        Toast(this.errorMsg)
        return
      }
      this.addressForm.id = this.$route.query.id
      updateAddress(this.addressForm).then((res) => {
        if (res.code == 200 && res.data) {
          Toast('修改成功')
          this.toAddressList('edit', res.data.id)
        } else {
          Toast(res.description)
        }
      })
    },
    //获取省市区地址
    getAddress(areasIds) {
      let address = []
      for (let k = 0; k < areasIds.length; k++) {
        for (let i = 0; i < this.addressListData.length; i++) {
          if (areasIds[k] == this.addressListData[i].value) {
            address.push(this.addressListData[i].name)
          }
        }
      }
      return address.length > 0 ? address.join(',') : ''
    },
    // 删除地址
    delAddress() {
      let _this = this
      _this.backOrdelete = false
      _this.dialogshow = true
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
      if (this.addressValue.length == 0) {
        this.errorMsg = '请选择地区'
        return false
      }
      if (this.addressForm.detailAddress == '') {
        this.errorMsg = '请输入详细地址'
        return false
      }
      if (this.addressForm.detailAddress.length < 5) {
        this.errorMsg = '详细地址最少5个字'
        return false
      }
      
      this.addressForm.isDefault = this.defaultValue ? '1' : '0'
      this.addressForm.address = this.getAddress(this.addressValue)
      this.addressForm.provinceId = this.addressValue[0].split('-')[1]
      this.addressForm.cityId = this.addressValue[1].split('-')[1]
      this.addressForm.countryId = this.addressValue[2].split('-')[1]
      return true
    },
    //跳转地址列表
    toAddressList(text, data) {
      localStorage.removeItem('addressInfo')
      localStorage.removeItem('addressValue')
      localStorage.removeItem('editres')
      //
      console.log('‘this.settlementParams----------', this.settlementParams)
      console.log('提交的this.addressForm', this.addressForm)
      // if (this.settlementParams.toaddresstype == 1) {
      //   // 新增、编辑时，接口需要返回地址id
      //   if (text && data) {
      //     this.settlementParams.addressId = data
      //     this.settlementParams.routerType = 1
      //   }
      //   this.$router.replace({
      //     path: '/settlement',
      //     query: { from: this.from, params: JSON.stringify(this.settlementParams) },
      //   })
      // } else {
      //   this.$router.back()
      // }
      this.$router.back()
      // this.$router.go(-2)
      // this.settlementParams.toAddressList == 1

      // this.$router.replace({
      //   path: '/customeraddresslist',
      //   query: { from: this.from, params: JSON.stringify(this.settlementParams) },
      // })
    },
  },
}
</script>

<style lang="less" scoped>
.gray-bg /deep/ .vux-popup-header-right {
  color: #e60113 !important;
}
.boxwrapper {
  .addressInfo {
    /deep/ .weui-cell {
      padding: 0.52rem 0.72rem;
    }
    /deep/ .van-cell {
      padding: 0.52rem 0.72rem;
    }
    /deep/ .weui-cells:before {
      content: unset;
    }
    /deep/ .van-field__label {
      width: 2.8rem;
      margin-right: unset;
      color: #333;
    }
    /deep/ .van-field__control {
      color: #000;
    }
    .adressDetail {
      padding-bottom: 1.96rem;
      /deep/ .van-field__control {
        color: #000;
      }
    }
    .adressDetail:before {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0.64rem;
      top: 0;
      left: 0.64rem;
      border-top: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    /deep/ .weui-cells {
      border-radius: 0 0 0.4rem 0.4rem;
    }
    /deep/ .weui-cells:after {
      content: unset;
    }
    .adressPicker {
      /deep/ .weui-label {
        width: 2.8rem !important;
        color: #333;
      }
      /deep/ .vux-popup-picker-placeholder {
        color: #bababb;
      }
      /deep/ .weui-cell_access .weui-cell__ft {
        background: url(/static/img/Order_more@2x.69954f3.png) no-repeat center right;
        background-size: 0.2rem;
        width: 0.2rem;
        height: 0.44rem;
      }
      /deep/ .weui-cell_access .weui-cell__ft:after {
        content: unset;
      }
    }
    .adressPicker:not(:first-child):before {
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

  .defaultAddress {
    margin-top: 0.48rem;
    border-radius: 0.4rem;
    /deep/ .van-cell--center {
      border-radius: 0.4rem;
      color: #333;
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
  .footer_delete {
    margin: 0px auto;
    background-color: unset;
    // border: 1px solid #666666;
    color: #333;
    position: relative;
    left: 0;
    top: 0;
  }
  .footer_delete::after {
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
}
</style>
