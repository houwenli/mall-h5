<template>
    <div>
        <div class="action-other-li" @click="handleShare">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_share.png" alt />
            <span>分享</span>
        </div>
        <div class="share-poster-container" ref="shareCard" v-show="showShareType == 2 && showSharePopup == true">
            <div class="share-card-wrap">
                <div class="goods-img">
                    <img v-if="postMainImg" :src="postMainImg" alt="" />
                </div>
                <div class="goods-info">
                    <div class="info">
                        <!-- <div class="goods-price">
                            ￥
                            <span>{{ spu.price ? spu.price.toFixed(2) : '' }}</span>
                        </div>
                        <div class="hint-text">价格具有时效性</div>
                        <div class="goods-name">{{ postSpuName }}</div> -->
                        <div class="goods-name">                           
                            <span>{{ spu.shareMsg }}</span>
                        </div>                                          
                    </div>
                    <div class="qrcode-wrap">
                        <div id="qrcode" ref="qrcode"></div>
                        <img :src="qrCodeImgUrl" class="qrcodeImg" />
                        <p class="tip">-长按或扫码购买-</p>
                    </div>
                </div>
                <!-- <div class="brand">
                    <img :src="spu.shareMsg" alt="">            
                </div> -->
            </div>
        </div>

        <van-share-sheet v-model="showSharePopup" class="custome-share" title="分享至" :close-on-click-overlay="true" :lock-scroll="false" :options="shareSheetOptions" @select="onSelectShare" @cancel="onCancelShare" @click-overlay="clonse"></van-share-sheet>

        <div class="share-poster-loading" v-show="showLoading">
            <van-loading color="#fff" size="0.96rem" vertical>加载中...</van-loading>
        </div>
    </div>

</template>

<script>
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import { Loading } from 'vant'
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        return {
            showGuide: false, //微信或者浏览器引导
            showShareType: -1,
            showSharePopup: false,
            posterImg: '',
            showLoading: false,
            shareImgUrl: '',
            qrCodeImgUrl: '',
            postMainImg: '',
            postSpuName: ''
        }
    },
    components: {
        [Loading.name]: Loading,
    },
    computed: {
        shareSheetOptions() {
            if (this.showShareType == 2) {
                return [
                    { name: '保存图片', icon: require('@/assets/img/icon-save.png'), type: 5 },
                    { name: '微信好友', icon: require('@/assets/img/WeChat@2x.png'), type: 1 },
                    { name: '朋友圈', icon: require('@/assets/img/icon-circle.png'), type: 6 },
                    // { name: 'QQ好友', icon: require('@/assets/img/QQ@2x.png'), type: 2 },
                ]
            } else {
                // 旧版本能力检测兼容
                if (!this.showGuide) {
                    return [{ name: '复制链接', icon: require('@/assets/img/copy@2x.png'), type: 3 }]
                } else {
                    return [
                        { name: '微信好友', icon: require('@/assets/img/WeChat@2x.png'), type: 1 },
                        { name: '生成海报', icon: require('@/assets/img/pt@2x.png'), type: 4 },
                        // { name: '复制链接', icon: require('@/assets/img/copy@2x.png'), type: 3 },
                        // { name: 'QQ好友', icon: require('@/assets/img/QQ@2x.png'), type: 2 }
                    ]
                }
            }
        },
    },
    methods: {
        // 分享
        handleShare() {
            // 方案代号: H1002 用于修复html2canvas的截屏问题
            window.pageYoffset = 0
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0

            // 能力检测: 是否为内嵌H5且为新版本系统
            this.showGuide = Boolean(window.webkit && window.webkit.messageHandlers.wsShare) || Boolean(window.ws && window.ws.wsShare)
            this.showShareType = 1
            this.showSharePopup = true
        },
        onCancelShare() {
            this.showShareType = 1
            this.shareImgUrl = ''
        },
        onSelectShare(option) {
            let baseUrl = window.location.origin;
            let skuName = this.spu.shareMsg
            this.postSpuName =  this.spu.shareMsg || skuName
            if (this.postSpuName.length > 30) {
                this.postSpuName = this.postSpuName.substr(0, 30) + '…'
            }
            // let iconImgUrl = `${this.spu.images[0]}?imageView2/1/w/60`
            let adreeInfo = JSON.parse(sessionStorage.getItem('motorPotionParams'))
            let { longitude, latitude, cityCode } = adreeInfo
            const url = `${baseUrl}/elecBike/detail?id=${this.spu.id}&longitude=${longitude}&latitude=${latitude}&cityCode=${cityCode}&fromSource=mini`   
            console.log(url,'urlurlurlurlurlurlurl');        
            const comParasm = {
                url,
                title: skuName,
                description: this.spu.shareMsg,
            }
           
            const typeData = {
                1: {
                    ...comParasm,
                    // imgUrl: iconImgUrl,
                    imgUrl: url,
                    shareType: 1,
                    platformTag: 3,
                },
                2: {
                    ...comParasm,
                    imgUrl: url,
                    shareType: 1,
                    platformTag: 1,
                },
                5: {
                    imgBase64: this.shareImgUrl,
                    platformTag: 5,
                },
                6: {
                    ...comParasm,
                    imgUrl: url,
                    imgBase64: this.shareImgUrl,
                    shareType: 3,
                    platformTag: 4,
                }
            }
            let shareData = {
                sharePlatformList: [
                    typeData[option.type]
                ]
            }
            switch (option.type) {
                //微信
                case 1:
                    this.clickFun()
                    if (this.showLoading == true) return
                    shareData = {
                        sharePlatformList: [
                            {
                                url,
                                title: this.spu.motorcycleTypeName,
                                imgUrl: this.spu.shareImage,
                                description: this.spu.shareMsg,
                                shareType: 1,
                                platformTag: 3,
                            },
                        ],
                    }
                    if (this.showShareType == 2) {
                        shareData.sharePlatformList[0]['imgBase64'] = this.shareImgUrl
                        shareData.sharePlatformList[0]['shareType'] = 3
                    }
                    this.goAppShareFun(shareData)
                    break
                case 2:
                    this.clickFun()
                    if (this.showLoading == true) return
                    if (this.showShareType == 2) {
                        shareData.sharePlatformList[0]['imgBase64'] = this.shareImgUrl
                        shareData.sharePlatformList[0]['shareType'] = 3
                    }
                    this.goAppShareFun(shareData)
                    break
                //复制链接
                case 3:
                    this.copyLinkFun(url)
                    break
                //生成海报
                case 4:
                    this.getPosterCase(url)
                    break
                //保存图片
                case 5:
                case 6:
                    this.clickFun()
                    if (this.showLoading == true) return
                    this.goAppShareFun(shareData)
                    break
                default:
                    break
            }
        },
        copyLinkFun(url) {
            this.clickFun()
            let input1 = document.createElement('input') // 直接构建input
            input1.value = url // 设置内容
            document.body.appendChild(input1)
            input1.select() // 选择实例内容
            document.execCommand('Copy') // 执行复制     
            document.body.removeChild(input1) // 删除临时实例
            this.$toast.success('复制成功！')
            this.showSharePopup = false
        },
        async getPosterCase(url) {
            this.showShareType = 2
            this.showLoading = true
            // this.postMainImg = this.spu.images[0]
            this.postMainImg = this.spu.shareImage
            QRCode.toDataURL(url, (err, dataUrl) => {
                this.qrCodeImgUrl = dataUrl
            })
            await this.getBase64(this.postMainImg, (dataUrl) => {
                this.postMainImg = dataUrl
                this.createImg()
            })
        },
        clonse() {
            this.posterImg = ''
        },
        clickFun() {
            let params = {
                type: 0,
                id: this.spu.spuId,
            }
            this.$store.dispatch('BURIED_POINT/shareVisitRequest', params)
        },
        // 生成图片
        createImg() {
            this.$nextTick(function () {
                let w = this.$refs['shareCard'].offsetWidth,
                    h = this.$refs['shareCard'].offsetHeight
                console.log('w: ', w, 'h: ', h)
                html2canvas(this.$refs['shareCard'], {
                    allowTaint: true,
                    logging: true,
                    scale: 2,
                    dpi: 300,
                }).then((canvas) => {
                    let url = canvas.toDataURL('image/png')
                    this.shareImgUrl = url
                    //延时关闭loading
                    this.$nextTick(() => {
                        this.showLoading = false
                    })
                })
            })
        },
        getBase64(url, callback) {
            let Img = new Image(),
                dataURL = '',
                miniImgUrl = `${url}?imageView2/1/w/446`
            Img.crossOrigin = 'Anonymous'
            Img.setAttribute('crossOrigin', 'Anonymous')
            Img.src = miniImgUrl + '?v=' + Math.random()
            Img.onload = function () {
                let canvas = document.createElement('canvas'),
                    width = Img.width,
                    height = Img.height
                canvas.width = width
                canvas.height = height
                canvas.getContext('2d').drawImage(Img, 0, 0, width, height)
                dataURL = canvas.toDataURL('image/png')
                return callback ? callback(dataURL) : null
            }
        },
        goAppShareFun(shareData) {
            this.showSharePopup = false
            this.showShareType = -1
            console.log(JSON.stringify(shareData),'分享参数11111')
            shareData = JSON.stringify(shareData)
            if (window.ws) {
                // android环境        
                window.ws.wsShare(shareData)
            } else if (window.webkit) {
                // ios环境         
                window.webkit.messageHandlers.wsShare.postMessage(shareData)
            }
        },
    }
}
</script>


<style lang="less" scoped>
.action-other-li {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  color: #999999;
  align-items: center;

  margin-right: 15px;
  img {
    margin-left: 2px;
    width: 20px;
    height: 20px;
    margin-bottom: 0 auto 2px;
  }
}

.custome-share {
  /deep/ .van-share-sheet__options {
    justify-content: space-around;
  }
}

.share-poster-container {
  position: fixed;
  top: 35%;
  left: 50%;
  z-index: 99999;
  transform: translate(-50%, -50%);

  .share-card-wrap {
    position: relative;
    width: 9.6rem;
    background: #fff;
    padding: 0.36rem 0.36rem 1.28rem;
    background: #ffffff;
    box-shadow: 0px 0px 0.24rem 0.08rem rgba(0, 0, 0, 0.08);
    border-radius: 0.4rem;
    box-sizing: border-box;

    .goods-img {
      img {
        width: 8.92rem;
        height: 8.92rem;
      }

      margin-bottom: 0.48rem;
    }

    .multi-img {
      margin-bottom: 0.48rem;

      img {
        display: block;
      }

      .img-big {
        width: 8.92rem;
        height: 8.92rem;
        margin-bottom: 0.04rem;
      }

      ul {
        display: flex;

        li {
          flex: 1;
          margin-right: 1px;

          .img-small {
            flex: 1;
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .goods-info {
      display: flex;
      justify-content: space-between;

      .info {
        flex: 1;

        .goods-price {
          font-size: 0.48rem;
          font-weight: 500;
          color: #e60113;
          line-height: 0.6rem;

          span {
            font-weight: bold;
            font-size: 0.68rem;
          }
        }

        .hint-text {
          line-height: 0.8rem;
          font-size: 0.36rem;
          color: #666;
          padding: 0 0 0.16rem;
        }

        .goods-name {
          font-size: 0.56rem;
          line-height: 0.88rem;
          color: #000;
        }
      }

      .qrcode-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0 0 3.36rem;

        img {
          width: 2.4rem;
          height: 2.4rem;
          margin-bottom: 0.18rem;
        }

        .tip {
          color: #666;
          font-size: 0.36rem;
          transform: scale(0.8);
        }

        #qrcode {
          width: 2.4rem;
          height: 2.4rem;
          position: fixed;
          right: -100%;
        }
      }
    }

    .brand {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fef0f1;
      border-radius: 0px 0px 0.4rem 0.4rem;

      .logo {
        width: 1.44rem;
      }
    }
  }
}
</style>

