<template>
  <div class="share-page">
    <div class="navbar">
      <van-nav-bar title="我要分享" fixed left-arrow @click-left="back">
        <template #left>
          <img src="@/assets/img/back.png" class="icon-back" />
        </template>
      </van-nav-bar>
    </div>
    <div class="page-body">
      <div class="tab-wrap">
        <van-tabs type="card" v-model="tabIndex">
          <van-tab title="小程序分享">
            <image-share :imgs="imgs" :data="shareData"></image-share>
          </van-tab>
          <van-tab title="文案分享">
            <text-share :data="shareData"></text-share>
          </van-tab>
          <van-tab title="图片分享">
            <image-share :imgs="imgs" :data="shareData" showSwitch></image-share>
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <!-- 分享面板 -->
    <!-- <div class="share-sheet">
        <div class="share-title">分享至</div>
        <div class="share-content">
            <ul>
                <li @click="handleShare">
                    <img src="@/assets/img/icon-wechat.png">
                    <p>微信好友</p>
                </li>
                <li @click="handleShare" v-if="tabIndex!=1">
                    <img src="@/assets/img/icon-circle.png">
                    <p>朋友圈</p>
                </li>
                <li @click="handleShare">
                    <img src="@/assets/img/icon-qq.png">
                    <p>QQ</p>
                </li>
                <li @click="handleShare" v-if="tabIndex!=1">
                    <img src="@/assets/img/icon-save.png">
                    <p>保存到相册</p>
                </li>
            </ul>
        </div>
    </div> -->
    <van-button class="share-btns" block color="linear-gradient(to right, #ff6034, #ee0a24)" @click="handleShare">
      我要分享
    </van-button>
    <!-- 分享面板 -->
    <van-share-sheet v-model="showSharePopup" class="custome-share" title="立即分享给好友" :options="options" @select="onSelect" />
    <van-popup v-model="showGuide" class="guide-popup">
      <!-- 微信引导图过大，防止点击不能关闭 -->
      <img src="@/assets/img/weixin-guide.png" v-if="isWeixin()" class="weixin-guide" @click="showGuide = false" />
      <img src="@/assets/img/browser-guide.png" v-else class="browser-guide" />
    </van-popup>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import { querySpu } from '@/api/spudetail'
  export default {
    name: 'share',
    components: {
      programShare: () => import('./components/programShare'),
      textShare: () => import('./components/textShare'),
      imageShare: () => import('./components/imageShare'),
    },
    data() {
      return {
        id: this.$route.query.id || '15989428439241020',
        tabIndex: 0,
        imgs: [],
        // 分享数据
        shareData: {},
        showSharePopup: false,
        showGuide: false,
      }
    },
    computed: {
      options() {
        if (this.tabIndex != 1) {
          return [
            { name: '微信好友', icon: 'wechat' },
            { name: '朋友圈', icon: require('@/assets/img/icon-circle.png') },
            { name: 'QQ', icon: 'qq' },
            { name: '分享海报', icon: require('@/assets/img/icon-save.png') },
          ]
        } else {
          return [
            { name: '微信好友', icon: 'wechat' },
            { name: 'QQ', icon: 'qq' },
          ]
        }
      },
    },
    mounted() {
      this.getGoodsDetail(this.id)
      this.getjssdk(window.location.href.split('#')[0])
    },

    methods: {
      isWeixin() {
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true
        } else {
          return false
        }
      },
      onSelect(option) {
        console.log(option)
        this.showSharePopup = false
      },
      // 查询商品详情信息
      getGoodsDetail(id) {
        let data = {
          skuId: id,
        }
        querySpu(data).then((res) => {
          console.log(res)
          let data = res.data
          this.imgs = data.images.length > 4 ? data.images.splice(0, 4) : data.images
          this.shareData = {
            id: data.id,
            price: data.price,
            url: `${location.origin}/spudetail?id=${this.id}`,
            title: data.name,
            content: data.subTitle,
            ico: data.images[0],
          }
        })
      },
      back() {
        this.$router.go(-1)
      },
      // 分享
      handleShare() {
        const { url, title, content, ico } = this.shareData
        console.log(url, title, content, ico)
        if (window.ws) {
          // app环境
          window.ws.shareDrivierThird(url, title, content, ico, 2)
        } else if (this.isWeixin()) {
          this.showGuide = true
          // this.showSharePopup = true
        } else {
          this.showGuide = true
          // this.showSharePopup = true
        }
      },

      getjssdk(url) {
        this.$http.get(`https://api-test.wsfmall.com/api/mobile/get/signature?url=${url}`).then((res) => {
          console.log('wx', res)
          if (res.code == 200) {
            let { title, content: desc, url: link, ico: imgUrl } = this.shareData
            let { appId, timestamp, nonceStr, signature } = res.data
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId, // 必填，公众号的唯一标识
              timestamp, // 必填，生成签名的时间戳
              nonceStr, // 必填，生成签名的随机串
              signature, // 必填，签名
              jsApiList: [
                // "updateAppMessageShareData",
                // "updateTimelineShareData",
                'onMenuShareAppMessage', //老版本分享接口。
                'onMenuShareTimeline', //老版本分享接口。
                'onMenuShareQQ',
              ], // 需要使用的JS接口列表
            })

            wx.ready(() => {
              console.log('wx ready')
              //需在用户可能点击分享按钮前就先调用
              // 分享给朋友 分享到QQ
              // wx.updateAppMessageShareData({
              //   title, // 分享标题
              //   desc, // 分享描述
              //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              //   imgUrl, // 分享图标
              //   success: () => {
              //     // 设置成功
              //   }
              // });
              // // 分享到朋友圈及分享到QQ空间
              // wx.updateTimelineShareData({
              //   title, // 分享标题
              //   link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              //   imgUrl, // 分享图标
              //   success: () => {
              //     // 设置成功
              //   }
              // });

              wx.onMenuShareTimeline({
                title, // 分享标题
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl, // 分享图标
                success: function() {
                  // 用户点击了分享后执行的回调函数
                },
              })

              wx.onMenuShareAppMessage({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                  // 用户点击了分享后执行的回调函数
                },
              })
              wx.onMenuShareQQ({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接
                imgUrl, // 分享图标
                success: function() {
                  // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                  // 用户取消分享后执行的回调函数
                },
              })
            })
            wx.error(function(res) {
              console.log('err', res)
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            })
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .navbar {
  }
  .page-body {
    position: fixed;
    left: 0;
    right: 0;
    top: 1.76rem;
    bottom: 1.76rem;
    overflow-y: auto;
    z-index: 2001;
    background: #f5f5f5;
  }
  .icon-back {
    width: 0.96rem;
    height: 0.96rem;
  }
  .share-page {
    background: #f5f5f5;
    .tab-wrap {
      height: 100%;
      .van-tabs {
        height: 100%;
      }
      /deep/ .van-tabs__nav--card {
        overflow: hidden;
        border-radius: 0.8rem;
        height: 100%;
      }
      .van-tab__pane {
        height: 100%;
      }
      /deep/ .van-tabs__content {
        height: 100%;
      }
      /deep/ .van-tabs__wrap {
        position: fixed;
        top: 10px;
        z-index: 4;
        top: 0.32rem;
        left: 1.4rem;
        right: 1.4rem;
      }
    }
  }
  .share-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .share-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 0.4rem 0.4rem 0px 0px;
    padding: 0.4rem 1.2rem 0.8rem;
    .share-title {
      position: relative;
      font-size: 0.56rem;
      color: #666;
      text-align: center;
      margin-bottom: 0.8rem;
      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 0.4rem;
        width: 4.8rem;
        height: 1px;
        background: #f2f2f2;
      }
      &:before {
        left: 0;
      }
      &:after {
        right: 0;
      }
    }
    .share-content {
      ul {
        display: flex;
        justify-content: center;
        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          img {
            width: 1.84rem;
            height: 1.84rem;
            margin-bottom: 12px;
          }
          p {
            font-size: 0.48rem;
            color: #000;
            font-weight: bold;
          }
        }
      }
    }
  }
  .custome-share {
    /deep/ .van-share-sheet__option {
      flex: 1;
    }
  }
  .guide-popup {
    background: transparent;
    .browser-guide {
      width: 13rem;
    }
    .weixin-guide {
      width: 15rem;
    }
  }
</style>
