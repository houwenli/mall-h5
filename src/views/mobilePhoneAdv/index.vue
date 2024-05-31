<template>
  <div class="main-backColor">
    <navbartop :title="'联通广告手机号'" @clickBack="backLastPage" :isConfirm="true" class="navtop" v-if="!isMini"></navbartop>
    <div class="top-pic"></div>
    <div class="mian-box">
      <div class="top-text">
        <p>根据国家实名制要求，请准确提供身份证信息</p>
      </div>

      <div class="main-form">
        <ul id="ul">
          <li>
            <p class="ione">
              名字
              <span class="itwo">(已加密)</span>
            </p>
            <input type="text" v-model="name" maxlength="10" placeholder="请填写办理人真实姓名" @blur="checkName()" />
          </li>
          <!-- 分割线 -->
          <div class="line-style line-one"></div>
          <li>
            <p class="ione">
              联系电话
              <span class="itwo">(已加密)</span>
            </p>
            <input type="phone" v-model="mobile" maxlength="13" placeholder="请输入正确的联系电话" @blur="checkTel()" />
          </li>
          <!-- 分割线 -->
          <div v-show="this.name" class="line-style line-one"></div>
          <li v-show="this.name">
            <p class="ione">
              身份证号
              <span class="itwo">(已加密)</span>
            </p>
            <input type="phone" v-model="cardId" maxlength="20" placeholder="请输入正确的身份证号" @blur="checkId()" />
          </li>
        </ul>
        <div class="mian-text">
          <p>请填写配送信息</p>
        </div>
        <van-field v-model="fieldValue" is-link readonly label="所在地区" placeholder="请选择区/县" @click="showArea = true" class="input-sty" />
        <!-- 分割线 -->
        <div class="line-style line-two"></div>

        <van-popup v-model="showArea" round position="bottom">
          <van-cascader
            v-model="cascaderValue"
            title="请选择所在地区"
            :options="options"
            @close="showArea = false"
            @change="onChange"
            @finish="onFinish"
            :field-names="fieldNames"
          />
        </van-popup>

        <input type="text" v-model="postAddr" maxlength="100" placeholder="请输入详细街道/镇+村/小区/写字楼+门牌号" @blur="checkAddress()" class="input-sty" />

        <div class="mian-text">
          <p>请选择号码</p>
        </div>
        <div class="choice-btn">
          <label for="choiceMobile" class="choice-btn-lable">
            选择号码
          </label>
          <button type="button" @click="openDialog" class="choice-btns">
            {{ choiceMobile ? choiceMobile : '请选择号码' }}
          </button>
        </div>
        <!-- 分割线 -->
        <div class="line-style line-three"></div>

        <div class="main-rad">
          <van-checkbox v-model="checkbox" checked-color="#000000" icon-size="14px" />
          <div class="main-rad-title">
            我已阅读并同意
            <a href="https://m.75510010.com/view/73Cd7812C9">《客户入网服务协议及业务协议》</a>
            <a href="https://m.75510010.com/view/3F8Bc1DC61">《关于客户个人信息收集、使用规则的公告》</a>
            <a href="https://m.75510010.com/view/8b147a3A2e">《中国联通客户移动业务靓号协议》</a>
          </div>
        </div>
        <!-- 立即领取图片按钮 -->
        <div class="sava-box">
          <img src="../../assets/img/linkTogether/savaBtn.png" class="sava-btn" @click="onSubmit" />
        </div>
      </div>
      <div class="bottom-erwei">
        <img src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/communication/qiyewx.jpg" />
      </div>
    </div>

    <!-- 选号弹框 -->
    <van-dialog v-model="show" title="" :show-confirm-button="false" close-on-click-overlay @close="onClose">
      <div class="wrapper">
        <div class="block">
          <van-search
            v-model="searchValue"
            show-action
            maxlength="11"
            placeholder="生日、幸运数字等"
            left-icon=""
            @search="onSearch"
            @cancel="onCancel"
            class="in-put"
          >
            <template #action>
              <img src="../../assets/img/linkTogether/search.png" @click="onSearch" />
            </template>
          </van-search>
          <p v-if="dataList && dataList.length == 0" class="tip-text">暂无数据</p>
          <div v-else class="search-dataList">
            <div class="searchList" v-for="(item, idx) in dataList" :key="idx">
              <button @click="selectIn(item.oldPhon)" class="searchList-btn">
                <div class="searchList-box">
                  <img src="../../assets/img/linkTogether/tel-icon.png" />
                  <div class="searchList-tel">
                    <p v-html="item.newPhon"></p>
                  </div>
                </div>
              </button>
              <p class="beizhu">发达靓号</p>
            </div>
          </div>
          <div v-show="dataList && dataList.length > 0" class="lines">
            <!-- 分割线 -->
            <div class="line-style"></div>
            <button @click="onSearch">换一批</button>
          </div>
        </div>
      </div>
    </van-dialog>

    <div class="select-order" @click="goOrder()">
      <span>订单查询</span>
    </div>
  </div>
</template>
<script>
  import { Field, Checkbox, Search, Toast, Cascader, Dialog } from 'vant'
  import { queryMobileNumber, queryAreas, checkIdNumber, saveMobileNumber, queryDriverInfo } from './service/index'
  import { debounce, appBack } from '@/utils/utils'
  import { analysisGinseng } from '@/utils/hybrid'
  import { getToken, setToken } from '@/utils/token'
  import navbartop from '@/components/commons/navBartop' // 导航栏

  export default {
    components: {
      [Field.name]: Field,
      [Checkbox.name]: Checkbox,
      [Search.name]: Search,
      [Toast.name]: Toast,
      [Cascader.name]: Cascader,
      [Dialog.name]: Dialog,
      navbartop
    },
    data() {
      return {
        name: '', //名字
        mobile: '', //联系电话
        postAddr: '', //详细街道
        cardId: '', //身份证号
        choiceMobile: '', //选择号码
        fieldValue: '', //配送信息
        checkbox: false, //协议
        show: false,
        cascaderValue: '',
        fieldValueList: [], // 所在地区name数组
        fieldCodeList: [], // 所在地区code数组
        fieldNames: {
          text: 'name',
          value: 'code',
          children: 'items',
        },
        options: [],
        showArea: false,
        searchValue: '',
        dataList: [],
        chauffeurId: '', // 提及的driverId
        isMini: false
      }
    },
    beforeRouteEnter(to, from, next){
      if(from.path == '/'){
        setToken(sessionStorage.getItem('now-token'))
      }
      next()
    },
    created() {
      this.isMini = window.__wxjs_environment === 'miniprogram'
      console.log(this.$route.query.userId,'userIduserIduserId');
      sessionStorage.setItem('now-token',getToken())
      this.mobile = this.$route.query.mobile
      this.queryAreas()
      this.getGinsengInfo()
    },
    watch: {
      mobile(newValue, oldValue) {
        if (newValue && oldValue) {
          if (newValue.length > oldValue.length) {
            // 文本框中输入
            if (newValue.length === 3 || newValue.length === 8) {
              this.mobile += ' '
            }
          } else {
            // 文本框中删除
            this.mobile = this.mobile.trim()
          }
        }
      },
      cardId(newValue, oldValue) {
        if (newValue.length > oldValue.length) {
          // 文本框中输入
          if (newValue.length === 6 || newValue.length === 15) {
            this.cardId += ' '
          }
        } else {
          // 文本框中删除
          this.cardId = this.cardId.trim()
        }
      },
    },
    methods: {
      backLastPage() {
        appBack(this)
      },
      // 获取公参信息
      getGinsengInfo() {
        // 解析公参 获取司机id
        analysisGinseng().then((res) => {
          let { driverId, appScheme } = res
          driverId && this.getUserInfo(driverId, appScheme)
          this.chauffeurId = res.driverId
        })
      },

      /**
       * 根据公参解析的id 查询名称和电话
       * @param {*} channelUserId id
       * @param {*} port wsjc / wscz / wsdj
       */
      getUserInfo(channelUserId, port) {
        queryDriverInfo({ channelUserId }).then((res) => {
          if (res.code === 200) {
            let { name, phone } = res.data || {}
            this.name = name
            this.mobile = phone.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '\$1 \$2 \$3')
          }
        })
      },

      // 提交按钮
      onSubmit: debounce(async function() {
        if (!this.name) {
          Toast('请输入名字')
          return
        }
        if (!this.mobile) {
          Toast('请输入联系电话')
          return
        }
        if (!this.cardId) {
          Toast('请输入身份证号')
          return
        }
        if (!this.fieldValue) {
          Toast('请选择所在地区')
          return
        }
        if (!this.postAddr) {
          Toast('请输入详细街道/镇+村/小区/写字楼+门牌号')
          return
        }
        if (!this.choiceMobile) {
          Toast('请选择号码')
          return
        }
        if (!this.checkbox) {
          Toast('请勾选协议')
          return
        }
        let res = await this.checkIdNumber()
        if(!res) return
        let data = {
          channelUserId: this.chauffeurId, // 渠道用户ID ，司机端就表示司机id
          operatorStatus: '2', // 手机卡运营商类型：1-移动 2-联通 3-电信
          name: this.name, // 姓名
          mobile: this.mobile.replace(/\s+/g, ''), // 联系手机号
          cardId: this.cardId.replace(/\s+/g, ''), // 身份证号
          postProvinceCode: this.fieldCodeList[0], // 省/自治区code
          postProvinceName: this.fieldValueList[0], // 省/自治区名称
          postCityCode: this.fieldCodeList[1], // 城市code
          postCityName: this.fieldValueList[1], // 城市名称
          postDistrictCode: this.fieldCodeList[2], // 区code
          postDistrictName: this.fieldValueList[2], // 区名称
          postAddr: this.postAddr, // 详细地址
          choiceMobile: this.choiceMobile, // 选中的靓号
          pageUrl: '/mobilePhoneAdv/index', // 开发出来的下单链接
          packageId: this.$route.query.packageId, //套餐id
          userId: this.$route.query.userId, //智慧生活id
        }
        saveMobileNumber(data).then((res) => {
          if (res.code == 200) {
            window.location.href = 'https://m.75510010.com/html/simple/kingCardOrderSuccess'
          } else {
            Toast(res.msg)
          }
        }).catch(err=>{
            Toast(err.msg)
        })
      }, 3000),
      // 点击查询省市区
      onChange({ value }) {
        setTimeout(() => {
          try {
            //调接口
            this.queryAreas()
          } catch (error) {
            console.log(error)
          }
        }, 500)
      },
      // 接口查询省市区
      queryAreas() {
        let data = {}
        queryAreas(data).then((res) => {
          this.options = res.data
        })
      },
      // 省市区弹窗关闭回显
      onFinish({ selectedOptions }) {
        this.showArea = false
        this.fieldValue = selectedOptions.map((option) => option.name).join('/')
        this.fieldValueList = selectedOptions.map((option) => option.name.toString())
        this.fieldCodeList = selectedOptions.map((option) => option.code)
      },
      //打开选号弹框
      openDialog() {
        if (!this.cardId) {
          Toast('请先输入身份证号')
          return
        }
        this.show = true
        this.queryMobileNumber()
      },
      // 查询联通手机号
      onSearch(val) {
        this.queryMobileNumber()
      },
      // 接口查询手机号
      queryMobileNumber() {
        let data = {
          searchValue: this.searchValue,
        }
        queryMobileNumber(data).then((res) => {
          if (res.data.length == 0) {
            Toast('未找到相关号码')
          }
          let oldArr = res.data.slice(0, 10)
          let newArr = this.highlight(res.data.slice(0, 10), this.searchValue)
          this.dataList = oldArr.map((item, index) => {
            return {
              oldPhon: item,
              newPhon: newArr[index],
            }
          })
        })
      },
      // 查询电话号码高亮显示
      highlight(str, key) {
        var reg = new RegExp(`(${key})`, 'gi')
        var replace = `<span style="color:#FD463E;">${'$&'}</span>`
        str = str.map((item) => {
          return item.replace(reg, replace)
        })
        return str
      },
      onCancel() {
        Toast('取消')
      },
      selectIn(e) {
        this.choiceMobile = e
        this.show = false
      },
      // 关闭号码弹框清空查询条件
      onClose() {
        this.searchValue = ''
      },
      // 失焦校验名字
      checkName() {
        var CellPoe = /^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
        if (!CellPoe.test(this.name)) {
          Toast('名字至少填写 2 个汉字，不能为数字或字母')
          this.name = ''
        }
      },
      // 失焦校验电话号码
      checkTel() {
        let str = this.mobile.replace(/\s+/g, '')
        let searchValue = /1[3,4,5,7,8][0-9]{9}$/
        if (!searchValue.test(str)) {
          Toast('请输入 11 位的手机号码')
          this.mobile = ''
        }
      },
      // 身份证框失焦后校验
      checkId() {
        var sId = this.cardId.replace(/\s+/g, '')
        let sIdValue = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!sIdValue.test(sId)) {
          Toast('请输入 18 位准确的身份证号')
        } else {
          this.checkIdNumber()

        }
      },
      // 接口校验身份证
      async checkIdNumber() {
        let data = {
          certName: this.name,
          certNum: this.cardId.replace(/\s+/g, ''),
        }
        try {
          let res = await checkIdNumber(data)
          if (res.code == 200) {
            // this.queryMobileNumber()
            return true
          } else {
            Toast(res.msg)
            return false
          }
        } catch (error) {
          Toast(error.msg)
          return false
        }
      },
      // 失焦校验详细地址
      checkAddress() {
        if (this.postAddr.length < 6) {
          Toast('详细地址至少填写 6 个字')
        }
      },
      goOrder(){
        window.location.href = 'https://m.10010.com/myorder'
      }
    },
  }
</script>

<style scoped lang="less">
  .main-backColor {
    height: 100%;
    width: auto;
    background-color: #fcefdf;
    overflow: auto;
    z-index: 1;
    position: relative;
    .top-pic {
      margin: 0px;
      background: url('../../assets/img/linkTogether/top.png') no-repeat center center;
      background-origin: border-box;
      background-size: 100%;
      height: 515px;
    }
    .mian-box {
      margin-top: 34px;
      .top-text {
        margin: 0px 15px 0px 15px;
        background-color: #ffca98;
        border-radius: 15px 15px 0px 0px;
        padding-top: 14px;
        padding-left: 15px;
        padding-bottom: 11px;
        p {
          font-size: 13px;
          color: #262626;
        }
      }
      .main-form {
        margin: 0px 15px 0px 15px;
        background-color: #fefffa;
        border-radius: 0px 0px 15px 15px;
        ul {
          padding: 20px 0px 20px 15px;
          background: #fefffa;
          li {
            display: flex;
            align-items: flex-end;
            .ione {
              color: #040404;
              font-size: 14px;
              display: inline-block;
              width: 120px;
              .itwo {
                font-size: 11px;
              }
            }
            /deep/ input {
              font-size: 14px;
            }
          }
        }
      }
      .sava-box {
        background: #fefffa;
        text-align: center;
        border-radius: 0px 0px 15px 15px;
        margin-top: 18px;
        padding-left: 30px;
        padding-right: 28px;
        padding-bottom: 33px;
        // position: sticky;
        // bottom: 0;
        .sava-btn {
          width: 100%;
        }
      }
      .bottom-erwei {
        margin-top: 24px;
        background: url('../../assets/img/linkTogether/pic.png') no-repeat center center;
        background-size: 100%;
        width: 100%;
        height: 2020px;
        img {
          position: relative;
          top: 1150px;
          left: 39%;
          text-align: center;
          width: 79px;
          height: 79px;
        }
      }
    }
    .select-order{
        position: fixed;
        right: 0px;
        top: 420px;
        z-index: 100;
        width: 21px;
        height: 59px;
        background: #ec5c5f;
        color: #FFFFFF;
        font-size: 12px;
        display: flex;
        line-height: 14px;
        text-align: center;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        span{
          padding: 2px;
        }
    }
  }
  .mian-text {
    background-color: #f7f4f1;
    padding-top: 14px;
    padding-left: 13px;
    padding-bottom: 14px;
    p {
      font-size: 13px;
      color: #262626;
    }
  }
  .choice-btn {
    padding: 20px 0px 20px 15px;
    .choice-btn-lable {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      color: #040404;
      line-height: 17px;
      width: 120px;
    }
    .choice-btns {
      font-size: 14px;
      font-weight: 400;
      color: #a5a5a5;
      background: #fefffa;
    }
  }

  .main-rad {
    display: flex;
    align-items: baseline;
    padding: 0px 18px;
    /deep/ .van-checkbox {
      overflow: visible;
    }
    .main-rad-title {
      color: #262626;
      font-size: 12px;
      padding-left: 10px;
      background: #fefffa;
      line-height: 18px;
      /deep/ .van-cell {
        padding: 20px;
      }
    }
    a {
      color: #db393f;
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    .block {
      width: 100%;
      background: #fefffa;
      border-radius: 15px;
      padding: 20px 0px 14px 0px;
      .in-put {
        margin: 0px 16px 15px 16px;
        border: 0.5px solid #a5a5a5;
        border-radius: 16px;
        background-color: #fefffa;
        /deep/ .van-search__content {
          background-color: #fefffa;
        }
        img {
          width: 25px;
          height: 25px;
        }
      }
      .tip-text {
        font-size: 14px;
        text-align: center;
        margin-top: 20px;
      }
      .search-dataList {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0px 20px 20px 20px;
        .searchList {
          padding: 3px 0px;
          .searchList-btn {
            background-color: #fefffa;
            padding: 1px 0px;
            .searchList-box {
              display: flex;
              align-items: center;
              img {
                width: 17px;
                height: 17px;
                margin-right: 4px;
              }
              .searchList-tel {
                color: #040404;
                p {
                  font-size: 17px;
                  font-weight: 600;
                }
              }
            }
          }
          .beizhu {
            color: #ed1820;
            font-size: 12px;
            padding-left: 22px;
          }
        }
      }
    }
    .lines {
      text-align: center;
      button {
        font-size: 14px;
        color: #040404;
        text-align: center;
        background-color: #fefffa;
        margin-top: 13px;
      }
    }
  }
  .label-class {
    margin-left: 25px;
    margin-bottom: 12px;
    color: #ed1820;
  }
  /deep/ input {
    font-size: 14px;
  }
  /deep/ .van-field__label {
    color: #040404;
    font-size: 14px;
    width: 108px;
  }
  /deep/ input::placeholder {
    font-weight: 400;
    font-size: 14px;
    color: #a5a5a5;
  }
  .input-sty {
    width: 100%;
    padding: 20px 15px 20px 15px;
    background: #fefffa;
  }
  /deep/ .van-dialog .van-dialog__footer {
    height: 0px !important;
  }
  .line-style {
    height: 1px;
    border-top: solid #e2dfdc 1px;
  }
  .line-one {
    margin: 20px 0px;
  }
  .line-two {
    margin-left: 15px;
  }
  .line-three {
    margin: 0px 0px 15px 15px;
  }
  /deep/.van-cell::after {
    border: none;
  }
  /deep/ .van-dialog {
    width: 345px;
  }
  /deep/ .van-search__action {
    padding: 0 19px 0 8px;
    line-height: 0px;
  }
</style>
