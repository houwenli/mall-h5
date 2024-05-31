<template>
  <div class="boxwrapper">
    <top-header class="nav-top" :title="'选择售后类型'" @clickBack="back"></top-header>
    <div class="main-content">
      <div class="titleboxWrapper">
        <p class="titlebox">
          本次售后服务将由<span class="store-name">{{ storeName }}</span>为你提供
        </p>
      </div>

      <div class="goodsboxwrapepr">
        <img :src="skuInfo.skuImage" alt="" />
        <div class="goodsInfo">
          <div class="goodsTitle">{{ skuInfo.skuName }}</div>
          <div class="goodsPrice">
            <strong class="money"><span class="coin">¥</span><span class="int">{{ setPrice(skuInfo.unitPrice)[0] }}</span><span class="float">.{{ setPrice(skuInfo.unitPrice)[1] }}</span></strong>
            <span class="goodsnum">x{{ skuInfo.num }}</span>
          </div>
        </div>
      </div>
      <div class="returnGoods" v-if="isShowReturnColumn && orderType != 10">
        <span class="returnGoods_title" :class="{ isopeacity: overDueStatus == 1 || afterTime <= 0 }">退货</span>
        <span class="returnGoods_tips isopeacity" v-if="overDueStatus != 0 || afterTime <= 0">已超过规定的退货时间</span>
        <span class="returnGoods_tips" v-else @click="toServerDetail('return')">{{timeDescript}}</span>
      </div>
      <div class="returnGoods" v-if="isShowExchangeColumn">
        <span class="returnGoods_title" :class="{ isopeacity: overDueStatus == 1 || afterTime <= 0}">换货</span>
        <span class="returnGoods_tips isopeacity" v-if="overDueStatus != 0 || afterTime <= 0">已超过规定的换货时间</span>
        <span class="returnGoods_tips" v-else @click="toServerDetail('exchange')">{{timeDescript}}</span>
      </div>
    </div>
    

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
import { queryBackOrderDetail } from '@/api/backorderlist'
import SecondConfirm from '@/components/commons/SecondConfirm'
import TopHeader from '../components/topHeader.vue'
import { formatPrice, appBack } from '@/utils/utils'
export default {
  components: {
    SecondConfirm,
    TopHeader
  },
  data() {
    return {
      hintDialogText: '',
      hintDialogShow: false,
      isShowReturnColumn: true, //显示退货栏
      isShowExchangeColumn: true, //显示换货栏
      skuInfo: {},
      storeName: '',
      id: this.$route.query.id ? this.$route.query.id : '',
      orderId: this.$route.query.orderId ? this.$route.query.orderId : '',
      overDueStatus: this.$route.query.overDueStatus ? this.$route.query.overDueStatus : 0,
      afterTime: 0,
      orderType: 0,
      timeDescript: '前可申请'
    }
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    if (this.id) {
      this.getDetail()
    } else {
      this.storeName = this.$route.query.storeName
      this.skuInfo = JSON.parse(this.$route.query.skuInfo)
      this.orderType = this.$route.query.orderType
      if(this.$route.query.receivingTime) {
        const timeNumber = new Date(this.$route.query.receivingTime.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 * 7
        this.afterTime = timeNumber -  new Date().getTime()
        this.timeDescript = `${this.formatDateTime(new Date(timeNumber))}前可申请`
      }
        // 实体店商品不能换货
      if(Number(this.orderType) === 9){
        this.isShowExchangeColumn = false
      }
    }
  },
  methods: {
    setPrice(val) {
      return formatPrice(val).split('.')
    },
    formatDateTime(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${this.pad(month)}-${this.pad(day)}`;
    },
    pad(num) {
      return num.toString().padStart(2, '0');
    },
    getDetail() {
      let param = {
        id: this.id,
      }
      queryBackOrderDetail(param).then((res) => {
        if (res.code == 200) {
          this.skuInfo = res.data.returnSku
          console.log(res.data);
          this.skuInfo.receivingTime = res.data.receivingTime
          this.storeName = res.data.storeName
          let type = res.data.type
          if(this.skuInfo.receivingTime) {
            const timeNumber = new Date(this.skuInfo.receivingTime.replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000 * 7
            this.afterTime = timeNumber -  new Date().getTime()
            this.timeDescript = `${this.formatDateTime(new Date(timeNumber))}前可申请`
          }
          // 判断此单之前是什么售后类型
          if(type == '2') { //退货
            this.isShowExchangeColumn = false
          } else if(type == '3') { //换货
            this.isShowReturnColumn = false
          }
        }
      })
    },
    back() {
      appBack(this)
    },
    // 服务单详情
    async toServerDetail(name) {
      let params
      if (this.id) {
        params = {
          id: this.id,
        }
      } else {
        params = {
          orderSkuId: this.skuInfo.orderSkuId,
          orderId: this.orderId,
        }
      }
      if(name == 'return') {
        params.type = '2'
        this.$router.push({
          path: '/returnGoods',
          query: params,
        })
      } else if(name == 'exchange') {
        let data = {
          spuId: this.skuInfo.spuId
        }

        /**
         * TODO
         * 注释校验库存接口
         */
        // let response = await this.$store.dispatch('AFTER_SALES_CONFIG/checkExchangeSkuOrSpu', data)
        // if(response.code !== 200) {
        //   this.hintDialogText = response.description
        //   this.hintDialogShow = true
        //   return
        // }
        params.type = '3'
        this.$store.commit('AFTER_SALES_CONFIG/LOAD_EXCHANGE_GOODS_DATA', true)
        this.$router.push({
          path: '/exchangeGoods',
          query: params,
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.boxwrapper {
  width: 100%;
 
  .isopeacity {
    opacity: 0.35;
  }
  .main-content {
    padding: 10px;
  }
  .titleboxWrapper {
    text-align: left;
    
    .titlebox {
      display: inline-block;
      font-size: 12px;
      line-height: 15px;
      transform: scale(0.93);
      text-align: center;
      color: #999;
      margin-bottom: 10px;
      .store-name {
        color: #FF0A35;
      }
    }
  }
  .goodsboxwrapepr {
    padding: 10px;
    display: flex;
    border-radius: 12px;
    background-color: #fff;
    img {
      width: 74px;
      height: 74px;
      border-radius: 8px;
    }
    .goodsInfo {
      width: 100%;
      margin-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 13px;
      color: #000;
      .goodsTitle{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .goodsPrice {
        display: flex;
        justify-content: space-between;
        .money {
          color: #191919;
          font-size: 16px;
          font-weight: bold;
          line-height: 20px;
          .coin {
            font-size: 12px;
          }
          .float {
            font-size: 13px;
          }
        }
        .goodsnum {
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
  .returnGoods {
    margin-top: 10px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    padding: 4px 12px;
    background-color: #fff;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .returnGoods_title {
      color: #191919;
      font-size: 13px;
    }
    .returnGoods_tips {
      padding-right: 22px;
      color: #191919;
      font-size: 11px;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png') no-repeat right center;
      background-size: 16px 16px;
    }
    &:first-child {
      border: none;
    }
  }
}
</style>