<template>
  <div class="image-share">
    <div class="select-wrap">
      <div class="select-title">生成拼图<span>(按照选择图片顺序生成拼图)</span></div>
      <div class="select-content">
        <ul>
          <li v-for="img of imgs" :key="img" @click='select(img)'>
            <img :src="img" alt="">
            <div class="num" v-if="selectedImg.includes(img)">{{sortNum(img)}}</div>
            <div class="tag" v-else></div>
          </li>
        </ul>
      </div>
    </div>
    <van-cell title="图片自动生成二维码" v-if="showSwitch">
      <template #title>
        <div @click="showTip=true">
            <span class="custom-title">图片自动生成二维码</span>
            <van-icon name="question-o" class="question-o" />
        </div>
      </template>
      <van-switch v-model="showQrcode" size="24" active-color="#E60113" />
    </van-cell>
    <div class="share-card-wrap">
      <!-- 小于三张图 -->
      <div class="goods-img" v-if="selectedImg.length<=2">
        <img :src="img" alt="" v-for="(img,index) of selectedImg" :key="index">
      </div>
      <!-- 大于等于三张图 -->
      <div class="multi-img" v-else>
        <img :src="selectedImg[0]" class="img-big">
        <ul>
          <li v-for="(img,index) of selectedImg.slice(1)" :key="index"><img :src="img" class="img-small"></li>
        </ul>
      </div>
      <div class="goods-info">
        <div class="info">
          <div class="goods-price">￥<span>{{data.price}}</span></div>
          <div class="goods-name van-multi-ellipsis--l3">{{data.title}}</div>
        </div>
        <div class="qrcode-wrap" v-if="showQrcode">
          <div id="qrcode" ref="qrcode"></div>
            <img :src="imgUrl" class="qrcodeImg" />
          <p class="tip">长按或扫码购买</p>
        </div>
      </div>
      <div class="brand">
        <img src="@/assets/img/wsf_logo.png" class="logo">
      </div>
    </div>

    <van-popup v-model="showTip" class="popup-tip">
      <img src="@/assets/img/icon-tip.png" class="tip-icon">
      <div class="title">提示</div>
      <div class="desc">如果分享图片至微信朋友圈未成功或未显示，请关闭“图片自动生成二维码”再尝试！</div>
      <van-button type="danger" plain class="tip-btn" size="small" round @click="showTip=false">我知道了</van-button>
    </van-popup>

  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
export default {
  name: 'programShare',
   props:{
        imgs:{
            type:Array,
            default:()=>[]
        },
        data:{
            type:Object,
            default:()=>{}
        },
        showSwitch:{
          type:Boolean,
          default:false
        }
    },
  data() {
    return {
      showQrcode: true,
      showTip: false,
      selectedImg: [], //选中的分享图片
      imgUrl:""
    }
  },
  computed: {
    sortNum() {
      return (img) => {
        return this.selectedImg.findIndex((item) => item == img) + 1
      }
    },
  },
  mounted() {
      setTimeout(() => {
            this.selectedImg.push(this.imgs[0])
        }, 300);
    this.createQrcode(`${location.origin}/spudetail?id=${this.data.id}`)
    this.createImg()
  },
  methods: {
    // 选择图片
    select(img) {
      if (this.selectedImg.includes(img)) {
        // 如果存在，则取消选中
        let index = this.selectedImg.findIndex((item) => item == img)
        if (this.selectedImg.length == 1) {
          this.$toast('至少选择一张图片')
          return
        }
        this.selectedImg.splice(index, 1)
      } else {
        // 不存在就追加
        this.selectedImg.push(img)
      }
    },
    // 生成二维码
    createQrcode(url) {
      this.$nextTick(function () {
        this.$refs.qrcode.innerHTML = ''
        new QRCode(this.$refs.qrcode, {
          text: url,
          width: 60,
          height: 60,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.Q,
        })
      })
      
    },

    // 生成图片
    createImg() {
      this.$nextTick(function () {
        setTimeout(() => {
          html2canvas(this.$refs.qrcode, {
            allowTaint: true,
            useCORS: true,
            logging: true,
          }).then((canvas) => {
            let url = canvas.toDataURL('image/png')
            this.imgUrl = url
            console.log(url)
          })
        })
      }, 1000)
    },
  },
}
</script>

<style lang="less" scoped>
.image-share {
  background: #F5F5F5;
    padding-bottom: 2rem;
  .select-wrap {
    background: #fff;
    padding: 0.48rem;
    .select-title {
      font-size: 0.56rem;
      font-weight: bold;
      margin-bottom: 8px;
      span {
        font-size: 0.48rem;
        color: #999;
        font-weight: normal;
        margin-left: 4px;
      }
    }
    .select-content {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 6px;
      ul {
        display: flex;
        overflow-x: auto;
      }
      li {
        position: relative;
        flex: none;
        margin-right: 6px;
        border-radius: 6px;
        width: 3.2rem;
        height: 3.2rem;
        overflow: hidden;
        &:last-child {
          margin-right: 0;
        }
        img {
          width: 3.2rem;
          height: 3.2rem;
          object-fit: cover;
        }
        .tag,
        .num {
          position: absolute;
          top: 0.16rem;
          right: 0.16rem;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
        }
        .tag {
          border: 0.04rem solid #999;
          background: #fff;
        }
        .num {
          border: 0.04rem solid #e60113;
          background: #e60113;
          font-size: 0.48rem;
          color: #fff;
          text-align: center;
          line-height: 0.6rem;
        }
      }
    }
  }
  .question-o{
      vertical-align: middle;
  }
  .share-card-wrap {
    position: relative;
    width: 9.6rem;
    background: #fff;
    padding: 0.36rem 0.36rem 1.28rem;
    width: 9.6rem;
    margin: 0.48rem auto 0;
    background: #ffffff;
    box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.08);
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
      img{
        display: block;
      }
      .img-big {
        width: 8.92rem;
        height: 8.92rem;
        margin-bottom: 1px;
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
          margin-bottom: 0.32rem;
          span {
            font-weight: bold;
            font-size: 0.68rem;
          }
        }
        .goods-name {
          font-size: 14px;
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
        #qrcode{
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
      text-align: center;
      line-height: 0.8rem;
      background: #fef0f1;
      border-radius: 0px 0px 10px 10px;
      .logo {
        width: 1.44rem;
        height: 0.48rem;
        object-fit: cover;
      }
    }
  }
}

.popup-tip {
  width: 85%;
  border-radius: 0.4rem;
  padding:  0.96rem 0.72rem;
  box-sizing: border-box;
  text-align: center;
  overflow: inherit !important;
  .tip-icon {
    position: relative;
    margin-top: -1.68rem;
    z-index: 2009;
  }
  .title {
    font-size: 0.64rem;
    color: #000;
    margin: 0.64rem 0;
    font-weight: bold;
  }
  .desc {
    font-size: 0.56rem;
    color: #666;
    margin-bottom: 0.96rem;
  }
  .tip-btn {
    width: 4.16rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 0.48rem;
    color: #e60113;
  }
}


</style>