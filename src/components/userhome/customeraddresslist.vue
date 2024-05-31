<template>
  <div class="addressBox" :class="{ bgcolor: bgcolor }" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <navbartop :title="'地址管理'" :isConfirm="false" :isradius="true" @clickBack="backLastPage" class="navtop"></navbartop>

    <!-- 无地址 -->
    <div class="noaddressbox" v-if="addressListData.length === 0">
      <img src="@/assets/img/noAdress2.png" alt="" class="img" />
      <p>您还没有收货地址哦！</p>
      <div class="addAddress" @click="toAddAddress">新建地址</div>
    </div>

    <!-- 地址列表 -->
    <div class="addresslist" v-else>
      <div class="addressbox">
        <div v-for="(item, e) in addressListData" :key="e" class="address_ul" @click.stop="selectItem(item.id)" :class="{ noSelectbox: listType }">
          <van-swipe-cell>
            <div class="address_padding" :class="{ noSelectList: listType }">
              <div class="selectbox" :class="{ selected: item.id == settlementParams.addressId, ischoose: listType }"></div>
              <div class="first_li">
                <strong class="username">{{ item.name }}</strong>
                <label style="margin-left: 0.4rem">{{ item.mobile }}</label>
                <span v-if="item.isDefault == '1'" class="default">默认</span>
              </div>
              <div class="second_li">
                {{ item.address.replace(/,/g, '') + '&nbsp; ' + item.detailAddress }}
              </div>
              <div class="edit" @click.stop="toEditAddress(item.id)">
                <img src="../../assets/img/Order_edit@2x.png" alt="" />
              </div>
            </div>
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" @click="delAddress(item)" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </div>

    <div class="footbtnbox" v-if="addressListData.length > 0" @click="toAddAddress">
      <span class="addAddressbtn">新增收货地址</span>
    </div>

    <!-- 二次确认 -->
    <SecondConfirm
      :title="this.isnoaddress ? '您还没有收货地址哦，赶快设置一个吧！' : '是否确认删除改地址？'"
      :cancleText="'取消'"
      :sureText="this.isnoaddress ? '去设置' : '删除'"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
    ></SecondConfirm>
    <!--  v-if="this.isnoaddress == true&&!this.toaddresstype" -->
  </div>
</template>

<script>
import { SwipeCell, Button, Toast } from 'vant'
import navbartop from '@/components/commons/navBartop'
import SecondConfirm from '@/components/commons/SecondConfirm'
import {
  queryCustomerAddress, //查询用户收货地址
} from '@/api/customeraddresslist'
import {
  deleteCustomerAddressById, //删除地址
} from '@/api/customeraddressdetail'

export default {
  components: {
    navbartop,
    SecondConfirm,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [Toast.name]: Toast,
  },
  data() {
    return {
      listType: this.$route.query.from != 'settlement', // 是否有选择框  true 没有 false 有  来自个人中心没有 来自结算页有
      toaddresstype: this.$route.query.toaddresstype, // 1 来自个人结算页   2 个人中心页
      addressListData: [], //收货地址
      settlementParams: {}, // 结算页带过来的参数
      bgcolor: false,
      dialogshow: false,
      id: '', // 选中删除id
      isnoaddress: false,
    }
  },
  created: function () {
    // document.body.removeAttribute('class', 'gray-bg')
    if (this.$route.query.from == 'settlement') {
      this.settlementParams = JSON.parse(this.$route.query.params)
      console.log('this.settlementParams', this.settlementParams)
    } else {
      this.settlementParams.toaddresstype = 2
    }
    this.getData()
  },
  methods: {
    //查询数据
    getData() {
      queryCustomerAddress().then((res) => {
        this.addressListData = res
        console.log(this.addressListData, '收货地址')
        if (this.addressListData.length > 0) {
          this.bgcolor = true
          this.isnoaddress = false
          this.dialogshow = false
        } else {
          this.bgcolor = false
          this.isnoaddress = true
          this.dialogshow = true
        }
      })
    },
    // 选择收货地址
    selectItem(id) {
      console.log(this.$route.query.from);
      // 不是来自结算页或者换货申请页直接return
      if (this.$route.query.from != 'settlement' && this.$route.query.from !='exchangeGoods') {
        return
      }
      //判断是否用于换货更换地址
      if(this.$route.query.from =='exchangeGoods') {
        localStorage.setItem('exchangeGoodsAddressId', id)
      } else {
        localStorage.setItem('addressId', id)
      }
      this.$router.back()
      // this.settlementParams.addressId = id
      // this.$router.replace({
      //   path: '/settlement',
      //   query: { params: JSON.stringify(this.settlementParams) },
      // })
    },
    //编辑地址
    toEditAddress(id) {
      this.$router.push({
        path: '/customeraddressdetail',
        query: { type: '2', id: id, params: JSON.stringify(this.settlementParams), from: this.$route.query.from },
      })
    },
    //添加地址
    toAddAddress() {
      this.$router.push({
        path: '/customeraddressdetail',
        query: { type: '1', params: JSON.stringify(this.settlementParams), from: this.$route.query.from },
      })
    },
    // 删除地址
    delAddress(item) {
      this.dialogshow = true
      this.id = item.id
    },
    // 二次确认左按钮
    closeBack() {
      if (this.isnoaddress) this.$router.back()
      else this.dialogshow = false
    },
    // 二次确认右按钮
    rightEvent() {
      if (this.isnoaddress) {
        this.toAddAddress()
      } else {
        deleteCustomerAddressById(this.id).then((res) => {
          if (res > 0) {
            this.getData()
            this.dialogshow = false
          } else {
            Toast('默认地址不能删除')
            // _this.$vux.toast.text('默认地址不能删除', 'middle')
          }
        })
      }
    },
    // 返回上一页
    backLastPage(value) {
      // 来自结算页直接返回
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.goods-card {
  margin: 0;
}
.delete-button {
  height: 100%;
  background-color: #e60113;
  border: 1px solid #e60113;
  border-radius: 0 0.4rem 0.4rem 0;
}
.addressBox {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .navtop {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
  .noaddressbox {
    .img {
      display: block;
      margin: 4rem auto 0;
      width: 3.36rem;
      height: 2.16rem;
    }
    p {
      color: #999999;
      font-size: 0.64rem;
      text-align: center;
      margin: 0.76rem 0 0.6rem;
    }
    .addAddress {
      width: 4rem;
      height: 1.4rem;
      line-height: 1.36rem;
      border-radius: 0.8rem;
      color: #000;
      font-size: 0.64rem;
      margin: 0 auto;
      text-align: center;
      position: relative;
    }
    .addAddress::after {
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
  .addresslist {
    // padding-bottom: 2.8rem;
    // margin-top: 2.24rem;
    background-color: unset;
    position: absolute;
    top: 1.92rem;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    overflow-y: scroll;
    .addressbox {
      margin-bottom: 2.8rem;
    }
    .address_ul {
      padding: unset;
      margin-top: 0.48rem;
      border-radius: 0.4rem;
      background-color: #fff;
      z-index: 9;
      .edit {
        color: transparent;
        width: 2rem;
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -0.32rem;
        img {
          width: 0.64rem;
          height: 0.64rem;
        }
      }
      // .edit::after {
      //   background: url('../../assets/img/Order_edit@2x.png') no-repeat;
      //   background-size: 0.64rem;
      //   right: 0.72rem;
      // }
      .first_li {
        display: flex;
        align-items: center;
        color: #333;
        font-size: 0.68rem;
        .username {
          display: inline-block;
          width: 3.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000;
        }
      }
      .second_li {
        color: #666;
        font-size: 0.52rem;
        margin-top: 0.28rem;
      }
      .default {
        margin-left: 0.4rem;
        color: #fff;
        font-size: 0.48rem;
        padding: 0px 0.14rem;
        background-color: #e60113;
        border-radius: 0.08rem;
        transform: scale(0.8);
      }
      .address_padding {
        padding: 0.8rem 2.32rem 0.8rem 1.68rem;
      }
      .noSelectList {
        padding: 0.8rem 2.32rem 0.8rem 0.72rem;
      }
      /deep/ .van-swipe-cell {
        z-index: 8;
      }
    }
    .selectbox:before {
      background: url('../../assets/img/cat_ns@2x.png') no-repeat;
      background-size: 0.72rem;
      background-size: contain;
      left: 0.48rem;
      content: ' ';
      width: 0.8rem;
      height: 0.72rem;
      position: absolute;
      top: 50%;
      margin-top: -0.4rem;
    }
    .selected:before {
      background: url('../../assets/img/cat_Selected@2x.png') no-repeat;
      background-size: 0.72rem;
      background-size: contain;
    }
    .ischoose {
      display: none;
    }
    .address_ul:after {
      content: unset;
    }
    .address_ul:before {
      content: unset !important;
    }
  }
  .footbtnbox {
    border-top: unset;
    text-align: center;
    position: fixed;
    left: 50%;
    margin-left: -6.78rem;
    bottom: 0.8rem;
    background-color: #e60113;
    width: 13.56rem;
    height: 1.52rem;
    line-height: 1.52rem;
    font-size: 0.64rem;
    color: #fff;
    border-radius: 1rem;
    font-weight: bold;
    padding: unset;
    z-index: 9;
    .addAddressbtn {
      display: inline-block;
      padding-left: 1.08rem;
      background: url('../../assets/img/Order_plus@2x.png') no-repeat left center;
      background-size: 0.64rem;
    }
  }
}
.bgcolor {
  background-color: #f5f5f5;
}
</style>
