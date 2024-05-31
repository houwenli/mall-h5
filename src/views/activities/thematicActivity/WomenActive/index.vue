<template>
  <div class="boxWrapper">
    <header class="fixed-header">
      <div class="back" @click="$router.push({ path: '/' })"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">万顺福·女王节</div>
      <div class="more"></div>
    </header>

    <div class="bannerBox">
      <img :src="bannerUrl" />
    </div>

    <div style="padding-bottom: 44px; position: relative">
      <div class="contentBox">
        <div class="goodsBox" v-for="(item, index) in list" :key="index" @click="goSpuDetail(item)">
          <div class="imgBox">
            <!-- <img :src="spuImgUrl[index]" /> -->
            <img v-if="item.skuImages" :src="item.skuImages[0].url" alt="" />
          </div>
          <div class="goodsInfoBox">
            <div class="goodsTitle doubleoverline">{{ item.skuName }}</div>
            <div class="goodsEffect overline">{{ spuTitle[index] }}</div>
            <div class="goodsMoneyBox">
              <div class="money_l">
                <div class="salePrice">
                  ¥
                  <span>
                    {{ parseInt(item.finalPrice) }}
                  </span>
                  {{ item.finalPrice % 1 != 0 ? '.' + (item.finalPrice % 1).toFixed(2).toString().split('.')[1] : '.00' }}
                </div>
                <div class="oldPrice" v-if="item.price">¥{{ item.price.toFixed(2) }}</div>
              </div>
              <div class="buynow">立即抢购</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="share-btn" v-if="isShowShareIcon" @click="goShare">
      <img :src="shareIcon" />
    </div>
    <SecondConfirm
      title="用户注册协议"
      cancleText="先浏览看看"
      sureText="同意"
      :dialogshow="registrationProtocolIsShow"
      @closeBack="$store.commit('SET_REGISTRATIONPROTOCOL', false)"
      @rightEvent="hasPayPasswordDialogFun"
    >
    <div slot="textp">
        <div class="registration-protocol">
          <div v-html="protocol"></div>
        </div>
      </div>
    </SecondConfirm>
  </div>
</template>

<script>
import { selectPerformanceSkuBySpuId } from '@/api/activities/thematicActivity'
import {visit} from '@/api/visit'
import { encrypt } from '@/utils/sign'
import SecondConfirm from '@/components/commons/SecondConfirm'
// import Cookies from 'js-cookie'
import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
export default {
  mixins:[userRegistrationProtocol],
  components:{
    SecondConfirm
  },
  data() {
    return {
      miniAppletUserName: process.env.MINI_APPLET_ID, // 小程序原始Id
      portApi: process.env.NODE_ENV,
      isShowShareIcon: false,
      bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/52e7803da822d55cc8855d786b56b89a.png',
      shareIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/e5f81918971f644df3870bb7a23598d6.png',
      spuImgUrl: [],
      spuTitle: [
        '滴滴润养 水嫩Q弹',
        '无菌防层更透气',
        '抑菌杀菌 口气更清新',
        '风车郁金香  迷情风车梦',
        '全方位缓压  舒适靠枕',
        '流光磁吸  一触即插',
        '家庭装强力去污',
        '为薄而生 与众不同',
      ],
      list: [
        {
          skuId: '16056804116132851',
          goodsImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/b3e518a386eae1f343b58a3c73e1c05d.png',
          title: '皓顿真皮学生复古运动皓顿真皮学生复古运动皓顿真皮学生复古运动皓顿真皮学生复古运动',
          effect: '抢单更快 老司机推荐 超长续航 抢单更快 老司机推荐 超长续航',
          salePrice: '1052.00',
          oldPrice: '10.00',
        },
      ],
    }
  },
  computed: {
    registrationProtocolIsShow(){
        return this.$store.getters.getRegistrationProtocol
      },
    userId() {
      return this.$store.getters.userId
    },
  },
  created() {
    if ((window.ws && window.ws.wsShare) || (window.webkit && window.webkit.messageHandlers.wsShare)) {
      this.isShowShareIcon = true
    }
    this.getInfo()
  },
  mounted() {
    let that = this
    setTimeout(() => {
      that.visitFun()
    }, 2000);
    
  },
  methods: {
    visitFun(){
        let that = this
        let data = {
        route:that.$route.path,
        routeName: '女王节日活动页',
        userId: that.$store.getters.userId
      }
      visit(data)
    },
    goSpuDetail(item) {
      this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
    },
    getInfo() {
      let arr
      if (this.portApi == 'test') {
        arr = ['388', '285', '295', '285', '295']
      } else if (this.portApi == 'uat') {
        arr = ['84', '85', '87', '89', '229']
      } else if (this.portApi == 'local') {
        arr = ['229']
      } else if (this.portApi == 'production') {
        arr = ['540', '416', '361', '298', '456', '536', '163', '36']
      }
      selectPerformanceSkuBySpuId(arr).then((res) => {
        if (res.code == 200) {
          this.list = res.data
        }
      })
    },
    goShare() {
      // 尝试拉起小程序
      if (window.ws) {
        this.toMiniAppDistribution(2)
      } else if (window.webkit) {
        this.toMiniAppDistribution(1)
      } else {
        console.log('app拉起小程序失败')
      }
    },
    // 唤醒小程序分销
    async toMiniAppDistribution(platform) {
      if (!this.userId) {
        const { data } = await this.$store.dispatch('user/getUserInfo')
      }
      // 准备密钥
      console.log('this.userId: ', this.userId)
      let aesToken = encrypt(this.userId, 'VGrCjJsxus1pXky0').encryptStr
      console.log('aesToken', aesToken)
      // let userSource = this.$store.getters.getUserSource,
      // let userSource = localStorage.getItem('userSource'),
      //   us = ''
      // if (userSource && userSource == 1) {
      //   us = 6
      // } else if (userSource && userSource == 2) {
      //   us = 5
      // }
      //判断是否为生成环境
      let miniprogramType
      if (process.env.NODE_ENV == 'production') {
        miniprogramType = 0
      } else {
        miniprogramType = 2
      }
      let shareData = {
        sharePlatformList: [
          {
            userName: this.miniAppletUserName, // 分销小程序原始ID
            path: `productModule/pages/thematicActivity/womensDay/womensDay?k=${aesToken}`, //
            miniprogramType: miniprogramType,
            platformTag: 7,
          },
        ],
      }
      shareData = JSON.stringify(shareData)

      console.log(`拉起小程序${platform === 1 ? 'ios' : '安卓'},shareData: `, shareData)
      if (platform === 2) {
        try {
          window.ws.wsShare(shareData)
        } catch (err) {
          console.log('安卓拉起失败', err)
        }
      } else if (platform === 1) {
        try {
          window.webkit.messageHandlers.wsShare.postMessage(shareData)
        } catch (err) {
          console.log('ios拉起失败', err)
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
.boxWrapper {
  background-color: #d21650;
}

.fixed-header {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .back {
    margin-left: 12px;
    img {
      width: 24px;
    }
  }
  .title {
    text-align: center;
    color: #000;
    font-size: 18px;
    line-height: 44px;
  }
  .more {
    width: 28px;
    height: 20px;
    line-height: 20px;
    margin-right: 20px;
    color: #333;
    font-size: 14px;
  }
}
.bannerBox {
  width: 100%;
  height: 282px;
  margin-top: 44px;
  z-index: -1;
  img {
    width: 100%;
    height: 100%;
  }
}
.contentBox {
  margin: -20px 14px 0px;
  .goodsBox {
    // padding: 10px 15px 10px 10px;
    padding: 7px 12px 7px 7px;
    margin: 10px 0;
    background-color: #ffeee0;
    border: 3px solid #f1ba8d;
    border-radius: 10px;
    display: flex;
    .imgBox {
      display: block;
      width: 100%;
      height: 100%;
      width: 150px;
      height: 150px;
      background: #fafafa;
      img {
        width: 150px;
        height: 150px;
        border-radius: 5px;
      }
    }
    .goodsInfoBox {
      width: 164px;
      margin-left: 10px;
      margin-right: 10px;
      padding: 10px 0;
      .goodsTitle {
        font-size: 16px;
        color: #000;
        font-weight: bold;
        height: 40px;
        line-height: 21px;
        // height: 38.5px;
      }
      .goodsEffect {
        margin: 3px 0 18px;
        font-size: 12px;
        color: #999;
      }
      .goodsMoneyBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .money_l {
          .salePrice {
            font-size: 12px;
            color: #e60113;
            font-weight: bold;
            span {
              display: inline-block;
              font-size: 20px;
              margin: 0 -2px 0 -3px;
            }
          }
          .oldPrice {
            color: #999;
            text-decoration: line-through;
          }
        }
        .buynow {
          width: 70px;
          height: 30px;
          border-radius: 20px;
          line-height: 30px;
          // background-color: #ffa000;
          background: linear-gradient(180deg, #ffa000 0%, #c82b1d 100%);
          text-align: center;
          font-size: 13px;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
}
.share-btn {
  position: fixed;
  right: 0;
  bottom: 100px;
  width: 50px;
  height: 35px;
  z-index: 999;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>