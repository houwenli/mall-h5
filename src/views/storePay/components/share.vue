<template>
  <van-dialog v-model="showQrcode" close-on-click-overlay :show-confirm-button="false" :show-cancel-button="false" class="share-pop" @close="onClose">
    <div ref="shareCard" class="share-card">
      <slot name="title">
        <h3 class="share-pop-title">{{ title }}</h3>
      </slot>
      <div class="qrcode-wrap">
        <img v-if="!isplanImg" :src="qrCodeImgUrl" class="qrcode-img" />
        <img v-else :src="planImg" class="qrcode-img" />
        <div class="qrcode-wrap-c">
          <slot name="qrcodeTips">
            <div>
              <p class="qrcode-wrap-tip">1、保存图片至相册；</p>
              <p class="qrcode-wrap-tip">2、打开微信/支付宝扫一扫。</p>
            </div>
          </slot>
          <div class="tips-img">
            <img v-if="!iswechartCode" src="@/assets/img/wsf_mall_logo.png" class="wechart-img" alt="" />
            <img v-else :src="wechartCode" class="wechart-img" alt="" />
            <slot name="tips"></slot>
          </div>
        </div>
      </div>
      <div class="qrcode-wrap-footer">
        <img src="@/assets/img/wsf_logo@2x.png" alt="" />
      </div>
    </div>
    <!-- <div class="save-img" @click="saveImge">保存至相册</div>
    <div class="save-img close-bt" @click="showQrcode = false">关闭</div> -->
  </van-dialog>
</template>
<script>
  import QRCode from 'qrcode'
  import html2canvas from 'html2canvas'
  import { Dialog } from 'vant'
  // import { getPlatformType } from '@/utils/tool';
  // const { isPhone, isAndroid } = getPlatformType();
  export default {
    // eslint-disable-next-line vue/require-prop-types
    props: {
      isplanImg: {
        type: Boolean,
        default: false,
      },
      planImg: {
        type: String,
        default: '',
      },
      iswechartCode: {
        type: Boolean,
        default: false,
      },
      wechartCode: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
    },
    components: {
      [Dialog.Component.name]: Dialog.Component,
    },
    data() {
      return {
        showQrcode: false,
        qrCodeImgUrl: '',
        shareImgUrl: '',
        loading: false,
        // loadingImg: require
      }
    },
    methods: {
      openShow() {
        this.showQrcode = true
      },
      closeShow() {
        this.showQrcode = false
      },
      async payCode(query) {
        let baseUrl = window.location.origin
        QRCode.toDataURL(
          `${baseUrl}${query || ''}`,
          {
            width: 300,
            height: 300,
            margin: 0,
          },
          (err, url) => {
            this.qrCodeImgUrl = url
            this.$emit('getCode', url)
          }
        )
        // this.qrCodeImgUrl = url
        // try {
        //     await this.getBase64(this.postMainImg, dataUrl => {
        //         this.postMainImg = dataUrl;
        //         this.createImg();
        //     });
        // } catch (error) {
        //     window.console.log(error);
        // }
      },
      getBase64(url, callback) {
        let Img = new Image(),
          dataURL = '',
          miniImgUrl = `${url}?imageView2/1/w/446`
        Img.crossOrigin = 'Anonymous'
        Img.setAttribute('crossOrigin', 'Anonymous')
        Img.src = miniImgUrl + '?v=' + Math.random()
        Img.onload = function() {
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
      // 生成图片
      createImg() {
        // let w = this.$refs['shareCard'].offsetWidth,
        //     h = this.$refs['shareCard'].offsetHeight;
        // console.log('w: ', w, 'h: ', h);
        return new Promise((resolve, reject) => {
          html2canvas(this.$refs['shareCard'], {
            allowTaint: true,
            logging: true,
            scale: 2,
            dpi: 300,
          })
            .then((canvas) => {
              let url = canvas.toDataURL('image/png')
              this.shareImgUrl = url
              console.log(url)
              resolve(url)
              //延时关闭loading
            })
            .catch((err) => {
              window.console.log(err)
              reject(err)
            })
        })
      },
      async saveImge() {
        this.$toast.loading({
          message: '正在保存中…',
          forbidClick: true,
          duration: 5000,
        })
        try {
          !this.shareImgUrl && await this.createImg()
          let shareData = {
            sharePlatformList: [
              {
                // imgUrl: this.spu.images[0],
                imgBase64: this.shareImgUrl,
                platformTag: 5,
              },
            ],
          }
          shareData = JSON.stringify(shareData)
          if (window.ws) {
            // android环境
            console.log('进入android分享方法')
            this.$toast.clear()
            window.ws.wsShare(shareData)
          } else if (window.webkit) {
            // ios环境
            console.log('进入ios分享方法')
            this.$toast.clear()
            window.webkit.messageHandlers.wsShare.postMessage(shareData)
          } else {
            this.$toast('图片保存失败')
          }
        } catch (error) {
          this.$toast('图片保存失败')
        }

        // try {
        //     if (isAndroid) {
        //         ws.saveImage(this.shareImgUrl);
        //     } else if (isPhone) {
        //         window.webkit.messageHandlers.saveImage.postMessage(this.shareImgUrl);
        //     }
        //     this.$toast('图片已保存至相册');
        // } catch (error) {
        //     this.$toast('图片已保存失败');
        // }
        // toast.clear();
        this.showQrcode = false
      },
      onClose() {
        this.$emit('onClose')
      },
    },
  }
</script>
<style lang="less" scoped>
  .share-card {
    border-radius: 10px;
    background-color: #fff;
  }

  .qrcode-wrap {
    width: 217px;
    margin: 0 auto;
    height: max-content;
    background-color: transparent;

    .qrcode-img {
      display: block;
      width: 100%;
      height: 217px;
    }

    .qrcode-wrap-c {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;

      .qrcode-wrap-tip {
        line-height: 20px;
        width: 145px;
      }

      .wechart-img {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
      }
    }
  }

  .qrcode-wrap-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    height: 20px;

    background-color: #fef0f1;
    border-radius: 0 0 10px 10px;

    img {
      transform: scale(0.5);
      height: 24px;
      width: 72px;
    }
  }

  .share-pop {
    border-radius: 10px;
    overflow: visible;
    width: 250px;
    font-size: 14px;
    transform: translateY(-50%);
    top: 35%;
    left: 0;
    right: 0;
    margin: auto;
    height: max-content;
    background-color: transparent;

    /deep/ .van-dialog__footer {
      display: none;
    }

    .share-pop-title {
      padding: 16px 0;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }

    .save-img {
      margin-top: 24px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      background: #e60113;
      border-radius: 25px;
    }

    .close-bt {
      margin-top: 12px;
      background-color: transparent;
      border: 1px solid #e60113;
      color: #e60113;
    }
  }
</style>
