<template>
  <div>
    <div class="backhead">
      <div class="bgtitle">
        <div style="font-size:20px">
          <van-icon name="passed" size="23" />
          已开票
        </div>
        <div style="padding-top:10px">已开发票金额：￥{{ (Number(datalist.invoicingmoney) || 0).toFixed(2) }}</div>
      </div>
      <div class="bgbody">
        <div style="padding-top:30px">
          发票类型：
          <span v-if="datalist.invoiceType == '1'" class="invoicingData">电子普通发票</span>
          <span v-if="datalist.invoiceType == '2'" class="invoicingData">增值税专票</span>
          <span v-if="datalist.invoiceType === '0'" class="invoicingData">不需要发票</span>
        </div>
        <div style="padding-top:15px">
          发票抬头：
          <span v-if="datalist.invoiceTitleType == '1'" class="invoicingData">企业</span>
          <span v-if="datalist.invoiceTitleType == '2'" class="invoicingData">个人</span>
        </div>
        <div style="padding-top:15px;">
          抬头名称：
          <span class="invoicingData">{{ datalist.invoiceTitle }}</span>
        </div>
        <div style="padding-top:15px">
          开票金额：
          <span class="invoicingData">{{ (Number(datalist.invoicingmoney) || 0).toFixed(2) }}</span>
        </div>
        <div style="padding-top:15px">
          开票时间：
          <span class="invoicingData">{{ datalist.uploadTime }}</span>
        </div>
        <!-- <div style="padding-top:8px">
          申请时间：
          <span class="invoicingData">{{ datalist.applytime }}</span>
        </div> -->
        <!-- <van-uploader v-model="fileList" multiple /> -->
        <div class="InvoicingedImg">
          <img
            v-if="this.imgType[0] == 'pdf' || this.imgType[0] == 'PDF'"
            style=" border-radius: 5px;"
            src="../../assets/img/invoice.png"
            alt=""
            @click="openImg()"
            width="100"
            height="50"
          />
          <img v-else style=" border-radius: 5px;" src="../../assets/img/invoice.png" alt="" @click="openotherImg()" width="100" height="50" />
          <!-- <img
            v-else
            style=" border-radius: 5px;"
            src="../../assets/img/invoice.png"
            alt=""
            @touchstart="touchStart"
            @touchend="touchEnd"
            @touchmove="gotouchMove"
            width="100"
            height="50"
          /> -->
          <div style="color:#999999;padding-top:8px">点击预览发票</div>
        </div>
        <div class="downImg">
          <img
            v-if="this.imgType[0] == 'pdf' || this.imgType[0] == 'PDF'"
            src="../../assets/img/downimg.png"
            @click="downPDF()"
            width="86"
            height="26"
            alt=""
          />
          <img v-else src="../../assets/img/downimg.png" @click="downImg()" width="86" height="26" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ImagePreview } from 'vant'
  import { getInvoicing } from '@/api/orderlist'
  // import axios from 'axios'
  export default {
    components: [ImagePreview],
    data() {
      return {
        datalist: {
          invoiceType: '',
          invoiceTitleType: '',
          invoiceTitle: '',
          invoicingmoney: this.$route.query.price,
          uploadTime: '',
          applytime: '',
          invoiceUrl: '',
        },
        imgType: '',
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        let params = {
          orderId: this.$route.query.id,
        }
        getInvoicing(params).then((res) => {
          if (res.code == 200) {
            console.log(res.data)
            this.datalist.invoiceUrl = res.data.invoiceUrl
            this.datalist.invoiceTitle = res.data.invoiceTitle
            this.datalist.invoiceType = res.data.invoiceType
            this.datalist.invoiceTitleType = res.data.invoiceTitleType
            this.datalist.uploadTime = res.data.uploadTime
            this.imgType = res.data.invoiceUrl.split('.').slice(-1)
            // this.datalist.invoiceTitle=res.data.invoiceTitle
          }
        })
      },
      openImg() {
        let src = this.datalist.invoiceUrl;
        let form = document.createElement('form');
        form.action = src;
        document.getElementsByTagName('body')[0].appendChild(form);
        form.submit();
        document.getElementsByTagName('body')[0].removeChild(form);
      },
      async downPDF() {
         window.open(this.datalist.invoiceUrl)//  目前仅支持用户端，待后续APP迭代后，优化支持IOS和司机端
        // axios({
        //   url: this.datalist.invoiceUrl,
        //   responseType: 'arraybuffer',
        //   method: 'get',
        // }).then((res) => {
        //   let blob = [res.data]
        //   let url = window.URL.createObjectURL(
        //     new Blob(blob, {
        //       type: 'application/pdf',
        //     })
        //   )
        // //   let src = url;
        // // let form = document.createElement('form');
        // // form.action = src;
        // // document.getElementsByTagName('body')[0].appendChild(form);
        // // form.submit();
        //   const a = document.createElement('a')
        //   a.href = url+ '?response-content-type=application'
        //   a.target = '_blank'
        //   a.download = '发票.pfg'
        //   a['download-octet-stream'] = '发票.pdf'
        //   console.log( a);
        //   document.body.append(a)
        //   a.click()
        // })
          // window.webkit.messageHandlers.fileDownload.postMessage( this.datalist.invoiceUrl)
      },
      openotherImg() {
        let imgList = [this.datalist.invoiceUrl]
        ImagePreview({
          images: imgList,
          closeable: true,
        })
      },
      // touchStart() {
      //   clearTimeout(this.timeOutEvent) //清除定时器
      //   this.timeOutEvent = 0
      //   this.timeOutEvent = setTimeout(() => {
      //     this.longPress()
      //   }, 1000) //这里设置定时
      // },
      // /** 触屏结束 */
      // touchEnd() {
      //   clearTimeout(this.timeOutEvent)
      //   console.log(this.timeOutEvent, '-------')
      //   if (this.timeOutEvent != 0) {
      //     console.log('=========')
      //     let imgList = [this.datalist.invoiceUrl]
      //     ImagePreview({
      //       images: imgList,
      //       closeable: true,
      //     })
      //   }
      // },
      // /**定时器清除 */
      // gotouchMove() {
      //   clearTimeout(this.timeOutEvent) //清除定时器
      //   this.timeOutEvent = 0
      // },
      // longPress() {
      //   console.log('长按')
      // },
      downImg() {
        let shareData = {
          sharePlatformList: [
            {
              imgUrl: this.datalist.invoiceUrl,
              platformTag: 5, // 1 = QQ好友，2= QQ空间,3= 微信好友，4= 微信朋友圈，5= 保存图片
            },
          ],
        }
        console.log(window.ws, '=cbbbb')
        console.log(window.webkit, '=cbbvvv')
        console.log(shareData, 'xiazaineirong22222222222222222222222222222')

        shareData = JSON.stringify(shareData)
        if (window.ws) {
          // android环境
          console.log('进入android分享方法', shareData)
          window.ws.wsShare(shareData)
        } else if (window.webkit) {
          // ios环境
          console.log('进入ios分享方法')
          window.webkit.messageHandlers.wsShare.postMessage(shareData)
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .backhead {
    height: 100vh;
    background-color: #f5f5f5;
  }
  .bgtitle {
    color: white;
    height: 23vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(right bottom, #e60113, #f16310);
  }
  .bgbody {
    margin-top: -10px;
    height: 30vh;
    padding-left: 5%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    position: relative;
    color: #999999;
  }
  .invoicingData {
    color: black;
  }
  .InvoicingedImg {
    display: flex;
    position: absolute;
    right: 24px;
    top: 30px;
    flex-direction: column;
    align-items: center;
  }
  .downImg {
    position: absolute;
    right: 24px;
    top: 150px;
  }
</style>
