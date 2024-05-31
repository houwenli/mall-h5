import { getCreateShareCode, getShareCode } from '@/api/activities/distributionActivity'
export default {
  data() {
    return {
      distrInfo: {},
    }
  },
  methods: {
    //APP分享方法--判别手机类型
    sharePro(shareData) {
      if (window.ws) {
        //安卓
        this.toMiniH5(2, shareData)
      } else if (window.webkit) {
        //IOS
        this.toMiniH5(1, shareData)
      } else {
        console.log('APP分享失败')
      }
    },
    // APP分享方法--分享H5
    async toMiniH5(platform, shareData) {
      shareData = JSON.stringify(shareData)
      console.log(`分享海报${platform === 1 ? 'ios' : '安卓'},shareData: `, shareData)
      if (platform === 2) {
        try {
          window.ws.wsShare(shareData)
        } catch (err) {
          console.log('安卓分享失败', err)
        }
      } else if (platform === 1) {
        try {
          window.webkit.messageHandlers.wsShare.postMessage(shareData)
        } catch (err) {
          console.log('ios分享失败', err)
        }
      }
      this.clonse()
    },
    //获取推广码
    getShareCode(val) {
      let params = {
        spuId: val.spuId,
        recommendUserType: this.distrInfo.promoteType,
        phone: this.distrInfo.mobile,
        buyNowFlag: false,
        customerId: this.distrInfo.promoteId,
      }
      return new Promise((resolve, reject) => {
        getShareCode(params)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 单个海报
    async getCreateShareCode(val, shareType) {
      this.$toast.loading({
        message: '正在生成海报中…',
        forbidClick: true,
        duration: 5000,
      })
      let params = {
        width: 40,
        autoColor: false,
        lineColor: "",
        isHyaline: false,
        suncode: '',
        page: 'productModule/pages/skuDetail/skuDetail',
        scene: '',
        goodsImgUrl: val.shareImage,
        goodsName: val.skuName || val.name,
        price: val.finalPrice || val.price,
      }
      try {
        let data = await this.getShareCode(val)
        if (data.code == 200 && data.data.data) {
          //推广码
          params.suncode = data.data.data
          //跳转参数
          params.scene = 'n=' + val.skuNo + '&c=' + params.suncode
          //获取海报
          let res = await getCreateShareCode(params)
          if (res.code == 200) {
            this.posterImg = res.data.wsSunCodeUrl
            this.posterShow = true
            this.showShare = true
            this.shareType = shareType
            this.$toast.clear()
          } else {
            this.$toast('生成海报失败')
            this.clonse()
          }
        } else {
          this.$toast((data.data && data.data.description) || '生成海报失败')
          this.clonse()
        }
      } catch (error) {
        this.$toast.clear()
      }
    },
    //判断商品是否可以分享
    isShare(val) {
      if (val) {
        //单个商品是否有推广码
        try {
          this.getCreateShareCode(val, 3)
              //弹出分享方式框

        } catch (error) {
           console.log(error);
        }
      } else {
        this.getListShareCode(4)
      }
    }
  },
}
