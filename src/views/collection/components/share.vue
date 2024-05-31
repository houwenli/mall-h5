<template>
  <div>
    <!-- 底部分享选项 -->
    <van-share-sheet
      v-model="showShare"
      class="custome-share"
      title="分享图片至"
      :close-on-click-overlay="true"
      :lock-scroll="false"
      :options="shareSheetOptions"
      @select="onSelectShare"
      @cancel="onCancelShare"
      @click-overlay="clonse"
    ></van-share-sheet>

    <!-- 海报展示 -->
    <div v-show="posterShow" class="saveImg">
      <van-image :src="posterImg" />
    </div>

    <div class="share-poster-loading" v-show="showLoading == true">
      <van-loading color="#fff" size="0.96rem" vertical>加载中...</van-loading>
    </div>

    <div class="share-poster-container" ref="shareCard" v-show="showShareType == 2 && showShare">
      <div class="share-card-wrap">
        <div class="goods-img">
          <img v-if="postMainImg" :src="postMainImg" alt="" />
        </div>
        <div class="goods-info">
          <div class="info">
            <div class="goods-price">
              ￥
              <span>{{ price ? price.toFixed(2) : '' }}</span>
            </div>
            <div class="hint-text">价格具有时效性</div>
            <div class="goods-name">{{ postSpuName }}</div>
          </div>
          <div class="qrcode-wrap" v-if="showQrcode">
            <div id="qrcode" ref="qrcode"></div>
            <img :src="qrCodeImgUrl" class="qrcodeImg" />
            <p class="tip">-长按或扫码购买-</p>
          </div>
        </div>
        <div class="brand">
          <img src="@/assets/img/wsf_logo@2x.png" class="logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import html2canvas from 'html2canvas'
  export default {
    name: '',
    data() {
      return {
        showShare: false,
        showShareType: 1,
        postMainImg: null,
        qrCodeImgUrl: '',
        postSpuName: null,
        showQrcode: true,
        posterShow: false, //显示--海报展示
        posterImg: '', //海报图片
        showLoading: false,
      }
    },
    props: {
      showSharePopup: {
        type: Boolean,
        default: false,
      },
      showGuide: {
        type: Boolean,
        default: false,
      },
      spu: {
        type: Object,
        default: () => {},
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    watch: {
      showSharePopup(newVal) {
        this.showShare = newVal
      },
    },
    computed: {
      shareSheetOptions() {
        if (this.showShareType == 2) {
          return [
            {
              name: '保存图片',
              icon: require('@/assets/img/icon-save.png'),
              type: 5,
            },
            {
              name: '微信好友',
              icon: require('@/assets/img/WeChat@2x.png'),
              type: 1,
            },
            {
              name: '朋友圈',
              icon: require('@/assets/img/icon-circle.png'),
              type: 6,
            },
            // { name: 'QQ好友', icon: require('@/assets/img/QQ@2x.png'), type: 2 },
          ]
        } else if (this.showShareType == 5) {
          return [
            { name: '微信好友', icon: 'wechat', type: 11 },
            {
              name: '朋友圈',
              icon: require('@/assets/img/icon-circle.png'),
              type: 12,
            },
            {
              name: '海报下载',
              icon: require('@/assets/img/icon-save.png'),
              type: 13,
            },
          ]
        } else {
          // 旧版本能力检测兼容
          if (!this.showGuide) {
            return [
              {
                name: '复制链接',
                icon: require('@/assets/img/copy@2x.png'),
                type: 3,
              },
            ]
          } else {
            return [
              {
                name: '微信好友',
                icon: require('@/assets/img/WeChat@2x.png'),
                type: 1,
              },
              {
                name: '生成海报',
                icon: require('@/assets/img/pt@2x.png'),
                type: 4,
              },
              {
                name: '复制链接',
                icon: require('@/assets/img/copy@2x.png'),
                type: 3,
              },
              // { name: 'QQ好友', icon: require('@/assets/img/QQ@2x.png'), type: 2 },
            ]
          }
        }
      },
    },
    methods: {
      async onSelectShare(option) {
        console.log(option, 'opstion')
        let baseUrl = window.location.origin,
          shareData
        let skuName = this.spu.name
        this.postSpuName = this.spu.shareMsg || skuName
        if (this.postSpuName.length > 30) {
          this.postSpuName = this.postSpuName.substr(0, 30) + '…'
        }
        let iconImgUrl = `${this.spu.shareImage}?imageView2/1/w/60`
        let shareflag = 'share'
        switch (option.type) {
          //微信
          case 1:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  url: `${baseUrl}/collectionSpudetail?id=${this.$route.query.id}&storeId=${this.spu.storeId}&enterpriseAgencyId=${this.$route.query.enterpriseAgencyId}&shareflag=${shareflag}`,
                  title: this.spu.name,
                  imgUrl: iconImgUrl,
                  description: this.spu.shareMsg || this.spu.name,
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
          //qq
          case 2:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  url: `${baseUrl}/collectionSpudetail?id=${this.$route.query.id}&storeId=${this.spu.storeId}&enterpriseAgencyId=${this.$route.query.enterpriseAgencyId}&shareflag=${shareflag}`,
                  title: this.spu.name,
                  imgUrl: this.spu.shareImage,
                  description: this.spu.shareMsg || this.spu.name,
                  shareType: 1,
                  platformTag: 1,
                },
              ],
            }
            if (this.showShareType == 2) {
              shareData.sharePlatformList[0]['imgBase64'] = this.shareImgUrl
              shareData.sharePlatformList[0]['shareType'] = 3
            }
            this.goAppShareFun(shareData)
            break
          //复制链接
          case 3:
            this.clickFun()
            let shareContent = `${baseUrl}/collectionSpudetail?id=${this.$route.query.id}&storeId=${this.spu.storeId}&enterpriseAgencyId=${this.$route.query.enterpriseAgencyId}&shareflag=${shareflag}`
            let input1 = document.createElement('input') // 直接构建input
            input1.value = shareContent // 设置内容
            document.body.appendChild(input1)
            input1.select() // 选择实例内容
            document.execCommand('Copy') // 执行复制
            document.body.removeChild(input1) // 删除临时实例
            this.$toast.success('复制成功！')
            this.$emit('update:showSharePopup', false)
            break
          //生成海报
          case 4:
            this.showShareType = 2
            this.showLoading = true
            this.postMainImg = this.spu.shareImage
            QRCode.toDataURL(
              `${baseUrl}/collectionSpudetail?id=${this.$route.query.id}&storeId=${this.spu.storeId}&enterpriseAgencyId=${this.$route.query.enterpriseAgencyId}`,
              (err, url) => {
                this.qrCodeImgUrl = url
              }
            )
            await this.getBase64(this.postMainImg, (dataUrl) => {
              this.postMainImg = dataUrl
              this.createImg()
            })
            break
          //保存图片
          case 5:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  imgBase64: this.shareImgUrl,
                  platformTag: 5,
                },
              ],
            }
            this.goAppShareFun(shareData)
            break
          //朋友圈
          case 6:
            this.clickFun()
            if (this.showLoading == true) return
            shareData = {
              sharePlatformList: [
                {
                  url: `${baseUrl}/collectionSpudetail?id=${this.$route.query.id}&storeId=${this.spu.storeId}&enterpriseAgencyId=${this.$route.query.enterpriseAgencyId}&shareflag=${shareflag}`,
                  title: this.spu.name,
                  imgUrl: this.spu.shareImage,
                  imgBase64: this.shareImgUrl,
                  description: this.spu.shareMsg || this.spu.name,
                  shareType: 3,
                  platformTag: 4,
                },
              ],
            }
            this.goAppShareFun(shareData)
            break

          case 11:
            shareData = {
              sharePlatformList: [
                {
                  imgUrl: this.posterImg,
                  platformTag: 3, //3= 微信好友
                  shareType: 3, //3=分享图片
                },
              ],
            }
            this.goAppShareFun(shareData)
            break
          case 12:
            shareData = {
              sharePlatformList: [
                {
                  imgUrl: this.posterImg,
                  platformTag: 4, // 4=朋友圈
                  shareType: 3, //3=分享图片
                },
              ],
            }
            this.goAppShareFun(shareData)
            break
          case 13:
            shareData = {
              sharePlatformList: [
                {
                  shareType: 3,
                  imgUrl: this.posterImg,
                  platformTag: 5, //5= 保存图片
                },
              ],
            }
            this.goAppShareFun(shareData)
            break
          default:
            break
        }
      },
      // 生成图片
      createImg() {
        this.$nextTick(function() {
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
      goAppShareFun(shareData) {
        this.$emit('update:showSharePopup', false)
        this.showShareType = -1
        shareData = JSON.stringify(shareData)
        this.posterShow = false
        console.log(JSON.stringify(shareData), '普通商品分享log')
        if (window.ws) {
          // android环境
          window.ws.wsShare(shareData)
        } else if (window.webkit) {
          // ios环境
          window.webkit.messageHandlers.wsShare.postMessage(shareData)
        }
      },
      clickFun() {
        let params = {
          type: 0,
          id: this.spu.spuId,
        }
        this.$store.dispatch('BURIED_POINT/shareVisitRequest', params)
      },
      onCancelShare() {
        console.log('1111111')
        this.$emit('update:showSharePopup', false)
        this.showShareType = 1
        this.shareImgUrl = ''
        this.posterShow = false
      },
      clonse() {
        this.$emit('update:showSharePopup', false)
        this.showShareType = 1
        this.posterShow = false
        this.posterImg = ''
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
</style>
