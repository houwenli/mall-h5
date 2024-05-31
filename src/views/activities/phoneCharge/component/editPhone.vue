<template>
  <div class="centent">
    <navbartop :title="'编辑联系人'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <!-- 输入手机号输入框 -->
    <div class="phone">
      <van-field
        v-model.trim="data.mobile"
        type="tel"
        boder="false"
        maxlength="11"
        name="用户名"
        label="手机号码"
        label-width="64px"
        placeholder="请输入手机号码"
        @input="onCallInput"
      />
      <van-field v-model.trim="data.nickName" name="昵称" label="昵称" maxlength="4" label-width="64px" placeholder="请输入昵称,不超过4个字" />
      <van-cell title="设置为默认充值号码" label="默认优先展示该号码" namr="checked" class="default">
        <div class="shop-info-select" @click.stop="data.defaultStatus = 1">
          <i :class="data.defaultStatus == 1 ? 'icon_select_ok' : 'icon_select_out'"></i>
        </div>
      </van-cell>
    </div>
    <div class="footerBtn">
      <van-button color="linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%)" @click="save">保存</van-button>
    </div>
  </div>
</template>

<script>
  import { Switch, RadioGroup, Radio } from 'vant'
  import navbartop from '@/components/commons/navBartop' // 导航栏

  import { updateCustomerCommonPhone, addCustomerCommonPhone, selectCustomerCommonPhoneById, getMobileArea } from '@/api/phoneCharge'
  import { appBack } from '@/utils/utils'
  export default {
    data() {
      return {
        data: {
          mobile: '',
          nickName: '',
          defaultStatus: 0,
        },
        radio: '',
        id: this.$route.query.id,
        isPhone: true,
        beforeData: { mobile: '', nickName: '', defaultStatus: 0 }, //修改前的数据
      }
    },
    components: {
      [Switch.name]: Switch,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      navbartop,
    },
    created() {
      if (this.id) {
        this.selectCustomerCommonPhoneById()
      }
    },
    methods: {
      // 输入事件
      onCallInput(event) {
        this.data.mobile = event.replace(/\D/g, '')
      },
      //添加 修改  常用联系人
      async save() {
        try {
          let isPone = false 
          if (!this.data.mobile || this.data.mobile.length < 11) {
            this.$toast(!this.data.mobile ? '号码不能为空' : '号码不正确')
            return
          }
          if (this.id && this.beforeData.mobile === this.data.mobile) {
            // if (this.beforeData.nickName === this.data.nickName && this.beforeData.defaultStatus === this.data.defaultStatus) {
            //   this.$toast('保存成功')
            //   return             
            // } else {
              isPone = true //是否是在相同手机号下有了其他修改
            // }
          }
          await this.getMobileConfig()

          let name = this.id ? updateCustomerCommonPhone : addCustomerCommonPhone
          let params = {
            id: this.id,
            ...this.data,
            mobile: isPone ? null : this.data.mobile,
          }
          let res = await name(params)
          if (res && res.code == 200) {
            this.backLastPage()
          } else {
            this.$toast(res.msg)
          }
        } catch (error) {
          console.log(error)
        }
      },
      //查询常用联系人详情
      async selectCustomerCommonPhoneById() {
        try {
          let params = {
            id: this.id,
          }
          let res = await selectCustomerCommonPhoneById(params) // 查询手机号和归属地
          if (res && res.code == 200 && res.data ) {
            this.data = res.data
            this.beforeData = JSON.parse(JSON.stringify(res.data))
          }
        } catch (error) {
          console.log(error)
        }
      },
      //电话号码校验   查询对应运营商、为空、不到11位
      async getMobileConfig() {
        try {
          let res = await getMobileArea({ mobile: this.data.mobile }) // 查询手机号和归属地
          let areaVal = res.data || {}
          if (!areaVal.mobileCode) {
            this.$toast('未发现对应运营商')
            return Promise.reject()
          }
        } catch (error) {
          console.log(error)
        }
      },
      backLastPage() {
        appBack(this)
      },
    },
  }
</script>

<style lang="less" scoped>
  /deep/ .van-field__label {
    white-space: nowrap;
    margin-right: 10px;
    // min-width: 64px;
    font-size: 16px;
    font-weight: 600;
    color: #010b2a;
    line-height: 40px;
  }
  /deep/ .van-field__value {
    height: 40px;
    background: #f6f6f6;
    line-height: 40px;
    padding: 0 10px;
    border-radius: 10px;
    font-size: 14px;
  }
  /deep/ .van-cell::after {
    border: none;
  }
  /deep/ .van-cell {
    padding: 0 0 16px 0;
  }
  /deep/ .van-cell--center {
    padding-bottom: 0;
  }
  /deep/ .van-cell__title {
    span {
      font-size: 16px;
      font-weight: 600;
      color: #010b2a;
      line-height: 22px;
    }
    .van-cell__label {
      margin-top: 5px;
      font-size: 12px;
      font-weight: 400;
      color: #b4b7ba;
      line-height: 20px;
    }
  }
  .centent {
    background: #f6f6f7;
    height: 100%;
    overflow: hidden;
    .phone {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 12px;
      margin: 11px 12px;
      .default {
        padding-bottom: 0;
        /deep/ .van-cell__value {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    .footerBtn {
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      background: #ffffff;
      box-shadow: 0px -2px 10px 0px rgba(189, 194, 204, 0.2);
      padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
      padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
      /deep/.van-button {
        margin: 4px;
        width: 351px;
        height: 40px;
        border-radius: 20px;
      }
    }
  }
  .shop-info-select {
    position: relative;
    margin-top: 2.5px;
    width: 16px;
    height: 16px;
    .icon_select_ok::after,
    .icon_select_out::after {
      position: absolute;
      top: 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
    }
    //勾选
    .icon_select_ok::after {
      background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png');
      background-size: 16px;
      background-repeat: no-repeat;
    }
    // 未勾选
    .icon_select_out::after {
      background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/browse-records/no.png');
      background-size: 16px;
      background-repeat: no-repeat;
    }
  }
</style>
