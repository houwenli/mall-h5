<template>
  <!-- <div class="thematic-activity-container" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }"> -->
  <div class="thematic-activity-container">
    <div class="fixed-header">
      <div class="back" @click="$router.push({ path: '/' })"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">手机狂欢</div>
      <div class="more"></div>
    </div>
    <div class="thematic-banner"><img :src="bannerUrl" /></div>
    <div class="thematic-hot">
      <div class="thematic-hot-title"><img :src="titleUrl" /></div>
      <div class="thematic-hot-desc">
        <!-- <p>万顺应用无需授权，实现最优配置</p>
        <p>后台切换更加流畅，里程不再丢失</p>
        <p>软件无需手动升级，直接静默安装</p> -->
        <img :src="descImgUrl" />
      </div>
      <div class="thematic-hot-spu" v-for="(item, index) in list" :key="index" @click="goSpuDetail(item)">
        <img :src="spuImgUrl[index]" />
        <div class="price-box">
          <div class="price">
            <span class="icon">¥</span>
            <span class="int">{{ parseInt(item.finalPrice) }}</span>
            <span class="float">
              {{ item.finalPrice % 1 != 0 ? '.' + (item.finalPrice % 1).toFixed(2).toString().split('.')[1] : '.00' }}
            </span>
          </div>
          <div class="old-price" v-if="item.finalPrice != item.price">¥{{ item.price }}</div>
        </div>
        <div class="score">{{ item.performanceScore }}绩效分</div>
      </div>
    </div>
    <!-- 		<div class="thematic-recommend">
			<div class="thematic-recommend-title"><img :src="url"/></div>
			<div class="thematic-recommend-list">
				<div class="thematic-recommend-spu" v-for="(item, index) in list.slice(4, 10)"><img :src="url"/></div>
			</div>
		</div> -->
    <div class="thematic-rule" :style="{ backgroundImage: 'url(' + ruleBgUrl + ')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }">
      <div class="rule-title">活动规则</div>
      <div class="rule-content">
        <div class="rule-column">
          <div class="left">1、</div>
          <div class="right">凡万顺福特产商城用户，均可参与本次专题活动；</div>
        </div>
        <div class="rule-column">
          <div class="left">2、</div>
          <div class="right">万顺叫车合伙人参与本次活动，可获相应绩效分奖励；</div>
        </div>
        <div class="rule-column">
          <div class="left">3、</div>
          <div class="right">活动订单若发生退款或退货，则不享有任何活动优惠；</div>
        </div>
        <div class="rule-column">
          <div class="left">4、</div>
          <div class="right">活动手机一年质保，自签收后因质量问题一个月内包换，原则上除未拆包外不支持退货；</div>
        </div>
        <div class="rule-column">
          <div class="left">5、</div>
          <div class="right">因库存有限，具体赠品以下单页面所展示为准，且物流受春节影响可能会出现延后发货，造成不便，敬请谅解。</div>
        </div>
        <div class="rule-column special-hint">特别提示：</div>
        <div class="rule-column">本次活动中，万顺叫车合伙人所获得的绩效分奖励，将在订单最终确认收货后的第七天，发放至合伙人账户中。</div>
        <div class="rule-column hint">*本活动最终解释权归万顺福特产商城所有*</div>
      </div>
    </div>
    <div class="thematic-cloud-icon">
      <!-- <img :src="cloudIcon" /> -->
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
import { visit } from '@/api/visit'
import { encrypt } from '../../../utils/sign'
import SecondConfirm from '@/components/commons/SecondConfirm'
// import Cookies from 'js-cookie'
import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
export default {
  data() {
    return {
      miniAppletUserName: process.env.MINI_APPLET_ID, // 小程序原始Id
      portApi: process.env.NODE_ENV,
      isShowShareIcon: false,
      url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2981800396,1345038855&fm=26&gp=0.jpg',
      list: [1, 2],
      // backgroundUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/4dc5b509dc457192ea94ae564543759b.png',

      // bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/fdae05e45bb39e2836fae7e90df0b6f8.jpg',     // banner图片
      bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/474a049a824d37d75aad9330f4c0ad97.jpg',     // banner图片 - 11-22日期
      titleUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/7f76a9a59f4181fd271ca16473020b27.png',     //  title标题图片
      // descImgUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/cd546bd0ab05952db10507fdc7b3e870.png',   //  8大理由图片
      descImgUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/a2142f7bbca57ae66632baeec9a2d014.png',   //  8大理由图片 -- 11-22

      spuImgUrl: [    // 商品图片
        'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f6e0df2f93c9c8607d5f426e174401f8.png',
        'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/402319e5a4812c10d6c62cb5f10124ef.png',
        // 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2013089f9b87d5c88afb1988681a71e3.png',
      ],

      ruleBgUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1da210ec89b4d5ca721327f8a4bd40f8.png',  // 活动规则背景

      shareIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/0468b601b72b880bd13f026e2ea7ab1d.png',  // 分享图标
      cloudIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/d422eb3d835d43435bc7a9ee1cab1ece.png',

      // postImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/c82376b21c55d0d633432e69beebe616.jpg',
      postImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/3223754e229a80c23720feb49eb4f6b8.jpg',
    }
  },
  mixins: [userRegistrationProtocol],
  components: {
    SecondConfirm,
  },
  computed: {
    registrationProtocolIsShow() {
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
    }, 2000)
  },
  methods: {
    visitFun() {
      let that = this
      let data = {
        route: that.$route.path,
        routeName: '手机专区活动页',
        userId: that.$store.getters.userId,
      }
      visit(data)
    },
    getInfo() {
      let arr
      if (this.portApi == 'test') {
        arr = ['480','102']
      } else if (this.portApi == 'uat') {
        arr = ['229','245']
      } else if (this.portApi == 'local') {
        arr = ['229','66']
      } else if (this.portApi == 'production') {
        // arr = ['449', '447']  959vivo
        arr = ['958', '1414']
      }
      selectPerformanceSkuBySpuId(arr).then((res) => {
        if (res.code == 200) {
          console.log(res, '-----')
          this.$nextTick(() => {
            this.list = res.data
            console.log(this.list, 'this.list')
          })
        }
      })
    },
    goSpuDetail(item) {
      this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
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
            path: `productModule/pages/thematicActivity/thematicActivity?k=${aesToken}`, //
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
.thematic-activity-container {
  width: 100%;
  background-repeat: repeat-y;
  background-size: contain;
  background-color: #7b47f2;
  margin-top: 44px;
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
      width: 36px;
    }
  }
  .thematic-banner {
    width: 100%;
    height: 420px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .thematic-hot {
    text-align: center;
    padding: 0 10px;
    .thematic-hot-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      height: 18px;
      img {
        width: 210.5px;
        height: 100%;
      }
    }
    .thematic-hot-desc {
      p {
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        color: #fcf8d5;
        line-height: 20px;
      }
      img {
        width: 356px;
        height: 312.5px;
      }
      margin-bottom: 20px;
    }
    .thematic-hot-spu {
      position: relative;
      width: 355px;
      height: 178px;
      margin-bottom: 15px;
      img {
        width: 100%;
        height: 100%;
      }
      .price-box {
        position: absolute;
        top: 114px;
        left: 151px;
        width: 160px;
        display: flex;
        align-items: flex-end;
        .price {
          display: inline-block;
          line-height: 20px;
          color: #7b47f2;
          font-weight: bold;
          background-image: linear-gradient(120deg, #d561e7, #635bf5);
          -webkit-background-clip: text;
          color: transparent;
          .icon {
            font-size: 12px;
            vertical-align: bottom;
          }
          .int {
            font-size: 20px;
            line-height: 20px;
            margin-left: -3px;
            // display: inline-block;
          }
          .float {
            font-size: 12px;
            // display: inline-block;
            margin-left: -3px;
          }
        }
        .old-price {
          margin-left: 8px;
          text-decoration: line-through;
          font-size: 10px;
          color: #5f5f5f;
        }
      }
      .score {
        position: absolute;
        top: 35.5px;
        left: 10px;
        width: 125px;
        font-size: 14px;
        text-align: center;
        line-height: 14px;
        font-weight: bold;
        color: #7b47f2;
      }
    }
  }
  .thematic-recommend {
    .thematic-recommend-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 28px 0;
      height: 45px;
      img {
        width: 278px;
        height: 100%;
      }
    }
    .thematic-recommend-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 10px;
      .thematic-recommend-spu {
        width: 170px;
        height: 225px;
        margin-bottom: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .thematic-rule {
    width: 355px;
    // height: 583rpx;
    // background: #ac0c03;
    border-radius: 10px;
    margin: 0 10px;
    padding: 10px 20px;
    color: #fff;
    .rule-title {
      text-align: center;
      padding: 20px 0;
      font-size: 18px;
      line-height: 20px;
    }
    .rule-content {
      .rule-column {
        line-height: 20px;
        margin-bottom: 5px;
        display: flex;
        vertical-align: top;
        font-size: 12px;
        .left {
          width: 22px;
          display: inline-block;
          font-size: 12px;
        }
        .right {
          flex: 1;
          display: inline-block;
          font-size: 12px;
        }
      }
      .special-hint {
        margin-top: 15px;
      }
      .hint {
        margin: 28px 0 20px;
        justify-content: center;
      }
    }
  }
  .thematic-cloud-icon {
    padding: 22px 0 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 60px;
      height: 23px;
    }
  }
  .share-btn {
    position: fixed;
    right: 0;
    bottom: 100px;
    width: 50px;
    height: 35px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
