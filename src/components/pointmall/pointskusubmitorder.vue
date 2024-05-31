<template>
  <div style="height:100%;">

    <!-- <x-header :left-options="{backText: ''}">兑换礼品</x-header> -->

    <group style="margin-top: 15px">
      <x-input title="收货人：" placeholder="请输入收货人名" :max="15" required v-model="pointMallOrder.receiver"
               ref="receiver"></x-input>
      <x-input title="手机号码：" placeholder="请输入收货人手机号码" :max="11" keyboard="number" required is-type="china-mobile"
               v-model="pointMallOrder.mobile" ref="mobile"></x-input>
      <popup-picker class="adressPicker" title="所在地区：" placeholder="请选择所在地区" value-text-align="left"
                    :data="addressListData" :columns="3" v-model="addressValue" ref="address" show-name></popup-picker>
      <x-input title="详细地址：" placeholder="请输入详细地址" :max="64" required v-model="detailAddress"
               ref="detailAddress"></x-input>
      <x-input title="固定电话：" placeholder="请输入固定电话" :max="12" keyboard="tel" v-model="pointMallOrder.phone"
               ref="phone" :is-type="telephoneValidator"></x-input>
      <x-input title="邮编：" placeholder="请输入邮编" :max="10" keyboard="number" v-model="pointMallOrder.zipCode"
               ref="zipCode" :is-type="zipCodeValidator"></x-input>
    </group>

    <group style="margin-top: 15px">
      <cell title="兑换件数">
        <inline-x-number @click.native="numChange()" v-model="pointMallOrder.num" style="position: relative; top: 4px"
                         class="count_choose" :min="1" :max="99"></inline-x-number>
      </cell>
    </group>

    <div class="fixBar">
      <div class="total">
        <p style="padding: 0; line-height: 50px; font-weight: normal">应扣积分：<strong>{{ totalPoint }}</strong></p>
        <a class="buy" style="font-weight: normal" @click="submitPointOrder">提交订单</a>
      </div>
    </div>

    <popup v-model="warnTipsVisible" position="top" :show-mask="false">
      <div class="warn-toptips">{{msg}}</div>
    </popup>

  </div>
</template>

<script>
  import {XHeader, Group, Cell, XButton, PopupPicker, XInput, InlineXNumber, Popup} from 'vux'

  import {
    queryAllAreas, // 查询所有省份(包含下面的市区)
    submitPointMallOrder, // 提交积分商城订单
  } from '@/api/pointskusubmitorder';

  import {telephoneValidator, zipCodeValidator} from '@/utils/validate'

  export default {
    components: {
      XHeader, Group, Cell, XButton, PopupPicker, XInput, InlineXNumber, Popup
    },
    data() {
      return {
        isProcess: false, // 接口是否处理中
        buyNum: 1, // 兑换数量
        totalPoint: null, // 应扣总积分
        addressListData: [], // 地区数组
        addressValue: [], //已选地区信息
        pointMallOrder: {
          skuId: this.$route.query.skuId, // 积分单品id
          num: 1, // 兑换数量
          receiver: '', // 收货人
          address: '', // 地址
          mobile: '', // 手机号码
          phone: '', // 固定号码
          zipCode: '', // 邮政编码
        },// 积分商品订单实体
        telephoneValidator: telephoneValidator, // 固定电话校验器
        zipCodeValidator: zipCodeValidator, // 邮编校验器
        warnTipsVisible: false, // 是否展示错误提示
        msg: '', // 错误提示
        detailAddress: '', // 详细地址
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg';
      this.queryAreas();
      this.numChange();
    },
    watch: {
      warnTipsVisible(val) {
        if (val) {
          setTimeout(() => {
            this.warnTipsVisible = false
          }, 1000)
        }
      }
    },
    methods: {
      // 查询地区信息
      queryAreas() {
        queryAllAreas().then(res => {
          this.addressListData = res;
        });
      },
      // 改变兑换数量
      numChange() {
        // 计算应扣总积分
        this.totalPoint = this.pointMallOrder.num * parseFloat(this.$route.query.point);
      },
      // 提交积分订单
      submitPointOrder() {
        if (!this.$refs.receiver.valid) {
          this.showError('请填写收货人！');
          return;
        }
        if (!this.$refs.mobile.valid) {
          this.showError('请填写正确的手机号码！');
          return;
        }
        if (this.addressValue.length === 0 || !this.$refs.address.getNameValues()) {
          this.showError('请选择所在地区！');
          return;
        }
        if (!this.$refs.detailAddress.valid) {
          this.showError('请填写详细地址！');
          return;
        }
        if (!!this.pointMallOrder.phone && !this.$refs.phone.valid) {
          this.showError(this.$refs.phone.errors.format);
          return;
        }
        if (!!this.pointMallOrder.zipCode && !this.$refs.zipCode.valid) {
          this.showError(this.$refs.zipCode.errors.format);
          return;
        }
        this.pointMallOrder.address = this.$refs.address.getNameValues().replace(/\s*/g, "") + this.detailAddress;
        if (this.isProcess) {
          return;
        }
        this.isProcess = true;
        submitPointMallOrder(this.pointMallOrder).then(res => {
          this.isProcess = false;
          if (res == 1) {
            this.$router.push({path: '/submitpointordersuccess'})
          } else if (res == -1) {
            this.showError('缺少参数！');
          } else if (res == -2) {
            this.showError('库存不足！');
          } else if (res == -3) {
            this.showError('积分商品不存在！');
          } else if (res == -4) {
            this.showError('您的积分不够哦！');
          } else if (res == -5) {
            this.showError('商品已下架！');
          } else {
            this.showError('下单失败，请稍后重试！');
          }
        })
      },
      // 错误提示
      showError(msg) {
        this.warnTipsVisible = true;
        this.msg = msg;
      },
    }
  }
</script>
