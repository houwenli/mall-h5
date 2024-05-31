<template>
  <div class="commentboxwrapper" ref="backTop" :class="[returntop ? 'backtopactive' : '']" :style="{ overflow: dialogshow ? 'hidden' : '', height: '100%' }">
    <navBartop :title="'评价'" :isConfirm="true" @clickBack="back" class="navtop"></navBartop>

    <div class="commentgradebox">
      <img :src="datacomment.skuImage" alt="" />
      <div class="commentgrade">
        <p>{{this.datacomment.skuName}}</p>
        <van-rate v-model="formData.score" :size="16" color="#E60113" void-icon="star" void-color="#eee" />
        <span>{{ formData.score == 1 ? '非常差' : formData.score == 2 ? '差' : formData.score == 3 ? '一般' : formData.score == 4 ? '好' : '非常好' }}</span>
      </div>
    </div>
    <div class="border_ra contentbox">
      <div class="content">
        <!-- <textarea name="" id="" cols="30" rows="10" placeholder="写下购物体会和使用感受〜"></textarea> -->
        <van-field
          v-model="formData.comment"
          rows="4"
          autosize
          clearable
          type="textarea"
          maxlength="200"
          placeholder="写下购物体会和使用感受〜"
          show-word-limit
          class="content_data"
          @focus="getcontentfocus"
          @blur="losecontentfocus"
          :class="{ isgetfocus: isgetfocus }"
        />
      </div>
      <div class="addphotobox">
        <!-- <img src="../../assets/img/image@2x.png" alt=""> -->
        <van-uploader
          v-model="formData.pictures"
          multiple
          :max-count="6"
          class="iconimg"
          upload-text="添加图片"
          :after-read="afterRead"
          :before-read="beforeRead"
          :class="{ isnoimg: isnoimg }"
          @delete="deleteimg"
        ></van-uploader>
        <!-- <span>添加图片</span> -->
      </div>
      <p class="content_nm">
        <img src="../../assets/img/cat_ns@2x.png" alt="" @click="toanonymous(1)" v-if="formData.anonymous == 0" />
        <img src="../../assets/img/cat_Selected.png" alt="" @click="toanonymous(0)" v-else />
        <span>匿名评价</span>
      </p>
    </div>
    <div class="border_ra storegradebox">
      <!-- <p class="storebox">
        <img src="../../assets/img/Shop2.png" class="storeimg" alt="" />
        <span>{{ datacomment.storeName }}</span>
      </p> -->
      <p class="gradebox">
        <label>描述相符</label>
        <van-rate v-model="formData.descScore" :size="16" color="#E60113" void-icon="star" void-color="#eee" />
      </p>
      <p class="gradebox">
        <label>卖家服务</label>
        <van-rate v-model="formData.sellerScore" :size="16" color="#E60113" void-icon="star" void-color="#eee" />
      </p>
      <p class="gradebox">
        <label>物流服务</label>
        <van-rate v-model="formData.logisticsScore" :size="16" color="#E60113" void-icon="star" void-color="#eee" />
      </p>
    </div>
    <footer class="footerBox">
      <span @click="submitForm">提交</span>
    </footer>
    <!-- 二次确认 -->
    <SecondConfirm
      :title="'您尚未发布'"
      :cancleText="'不保存'"
      :sureText="'保存'"
      :textp="'是否对已编辑内容进行保存'"
      :textshow="textshow"
      :dialogshow="dialogshow"
      @closeBack="closeBack"
      @rightEvent="rightEvent"
    ></SecondConfirm>

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop">
      <img src="@/assets/img/top@2x.png" class="returntop" @click="backtop" alt="" />
    </div>
  </div>
</template>

<script>
import navBartop from '@/components/commons/navBartop'
import SecondConfirm from '@/components/commons/SecondConfirm'
import { Button, Toast, Field, Popup, Tab, Tabs, List, PullRefresh, Rate, Uploader } from 'vant'

import { addEvaluation } from '@/api/comments'
import upLoaderImg from '@/utils/uploadimg'
import { UUID } from '@/utils/validate'

export default {
  components: {
    navBartop,
    SecondConfirm,
    [Rate.name]: Rate,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
  },
  data() {
    return {
      datacomment: this.$route.query,
      formData: {
        orderId: this.$route.query.orderId,
        skuId: this.$route.query.skuId,
        storeId: this.$route.query.storeId,
        score: 5,
        pictures: [],
        anonymous: '0', // 匿名  0 否 1是 默认0
        comment: '', // 内容
        descScore: 5, //描述分
        sellerScore: 5, //卖家服务分
        logisticsScore: 5, //物流分
      },
      imgList: [], // 图片
      isgetfocus: false,
      isnoimg: true, // 没有图片
      dialogshow: false, // 二次確認
      textshow: false,
      isshowtop: false, // 回到顶部
      returntop: false, // 返回顶部
    }
  },
  mounted() {
    // 滚动条的获取
    window.addEventListener('scroll', this.handleScroll, true)
  },
  watch: {
    isshowtop(value) {
      if (!value) this.returntop = false
    },
  },
  created() {
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    let temp = JSON.parse(localStorage.getItem('commentdata'))
    if (temp && temp.orderId == this.formData.orderId && temp.storeId == this.formData.storeId) {
      this.imgList = temp.pictures
      this.formData = temp
      if (temp.pictures.length > 0) this.isnoimg = false
      else this.isnoimg = true
    }
    console.log(this.datacomment)
  },
  methods: {
    // 监听滚动
    handleScroll() {
      if (!this.$refs.backTop) return
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop) // 取绝对值
      // console.log('滚动了', scorllTop)
      if (scorllTop >= 2500) this.isshowtop = true
      else this.isshowtop = false
    },
    // 回到顶部
    backtop() {
      if (this.isshowtop) this.returntop = true
      else this.returntop = false
    },
    // 弹窗左按钮
    closeBack(data) {
      this.dialogshow = false
      localStorage.removeItem('commentdata')
      this.$router.back()
    },
    // 弹窗右按钮
    rightEvent(data) {
      let params = {
        orderId: this.$route.query.orderId,
        skuId: this.$route.query.skuId,
        storeId: this.$route.query.storeId,
        pictures: this.imgList,
        score: this.formData.score,
        anonymous: this.formData.anonymous,
        comment: this.formData.comment,
        descScore: this.formData.descScore,
        sellerScore: this.formData.sellerScore,
        logisticsScore: this.formData.logisticsScore,
      }
      localStorage.setItem('commentdata', JSON.stringify(params))
      this.$router.back()
    },
    // 上传之前
    beforeRead(file) {
      //单张图片为对象
      let fileList = Array.isArray(file) ? file : [file]
      if(this.isAcceptImg(fileList)){
        Toast('只允许上传jpg/png/gif格式的图片！')
        return false
      }
      return true
    },
    isAcceptImg(arr){
      let fileType = ['image/jpeg', 'image/png', 'image/gif']
      return arr.some(item=>{
        return !fileType.includes(item.type)
      })
    },
    //文件读取完成后的回调函数
    async afterRead(file) {
      if(file instanceof Array) {
          for(let i in file) {
            let uploadImg = await upLoaderImg(file[i].file) //使用上传的方法。file.file
            let dataimg = {
              url: uploadImg.data,
            }
            this.imgList.push(dataimg)
          }
        } else {
          let uploadImg = await upLoaderImg(file.file) //使用上传的方法。file.file
          let dataimg = {
            url: uploadImg.data,
          }
          this.imgList.push(dataimg)
        }
      // console.log('上传图片数组',this.imgList)
      if (this.imgList.length > 0) this.isnoimg = false
      else this.isnoimg = true
    },
    // 删除图片
    deleteimg(file, val) {
      // console.log(val,'index');
      let img = this.imgList.splice(val.index, 1)
      // console.log(this.imgList,'this.imgList');
      if (this.imgList.length > 0) this.isnoimg = false
      else this.isnoimg = true
    },
    // 是否匿名
    toanonymous(data) {
      this.formData.anonymous = data
    },
    // 提交数据
    submitForm() {
      this.formData.pictures = this.imgList.map((res) => {
        return res.url
      })
      addEvaluation(this.formData).then((res) => {
        if (res.code == 200 && res.data == 1) {
          // this.$router.push('/evaluate')
          localStorage.removeItem('commentdata')
          this.$router.back()
        }
      })
    },
    // textarea 获取焦点
    getcontentfocus() {
      this.isgetfocus = true
    },
    // textarea 失去焦点
    losecontentfocus() {
      if (!this.formData.comment) {
        this.isgetfocus = false
      }
    },
    back() {
      if (this.formData.comment || this.imgList.length > 0 || this.formData.descScore || this.formData.sellerScore || this.formData.logisticsScore) {
        this.dialogshow = true
        this.textshow = true
      } else {
        this.$router.back()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.commentboxwrapper {
  padding-bottom: 2.4rem;
  .border_ra {
    border-radius: 0.4rem;
    padding: 0.8rem 0.72rem;
    background-color: #fff;
    margin-top: 0.48rem;
  }
  .commentgradebox {
    padding: 0 0.72rem;
    width: 100%;
    // height: 110px;
    background-color: #fff;
    border-radius: 0 0 0.4rem 0.4rem;
    display: flex;
    padding-top: 1.2rem;
    padding-bottom: 0.8rem;
    img {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 0.2rem;
      border: 1px solid #eee;
    }
    .commentgrade {
      margin-left: 0.4rem;
      width: 12rem;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      padding-top: 0.16rem;
      padding-bottom: 0.32rem;
      p {
        font-size: 0.56rem;
        color: #000;
        margin-bottom: 0.4rem;
      }
      span {
        margin-left: 0.6rem;
        vertical-align: text-bottom;
        color: #999;
        display: inline-block;
      }
      /deep/ .van-rate__item:not(:last-child) {
        padding-right: 0.4rem;
      }
    }
  }
  .contentbox {
    font-size: 0.52rem;
    color: #999;
    .content {
      .content_data {
        background: url('../../assets/img/pen@2x.png') no-repeat left 0.12rem;
        background-size: 0.64rem;
        padding: 0 0 0.4rem 0.96rem;
      }
      .isgetfocus {
        padding: 0 0 0.4rem 0;
        background: none;
      }
    }
    .addphotobox {
      .iconimg {
        border-radius: 0.32rem;
        margin-bottom: 0.16rem;
        /deep/ .van-uploader__upload-icon {
          background: url('../../assets/img/image@2x.png') no-repeat center;
          background-size: 0.8rem;
          width: 0.8rem;
          height: 0.8rem;
        }
        /deep/ .van-icon-photograph::before {
          content: unset;
        }
        /deep/ .van-uploader__upload {
          margin: 0;
          background-color: #f5f5f5;
          border-radius: 0.32rem;
          width: 4rem;
          height: 4rem;
          margin-bottom: 0.44rem;
        }
        /deep/ .van-uploader__preview {
          width: 4rem;
          height: 4rem;
          margin: 0 0.72rem 0.44rem 0rem;
        }
        /deep/ .van-uploader__preview:nth-child(3) {
          margin-right: 0;
        }
        /deep/ .van-uploader__preview:nth-child(6) {
          margin-right: 0;
        }
        /deep/ .van-uploader__preview-image {
          width: 4rem;
          height: 4rem;
          border-radius: 0.32rem;
        }
      }
      .isnoimg {
        width: 100%;
        /deep/ .van-uploader__upload {
          width: 100%;
        }
      }
      span {
        display: inline-block;
        position: absolute;
        bottom: 0.92rem;
        left: 50%;
        width: 2.2rem;
        margin-left: -1.1rem;
      }
    }
    .content_nm {
      display: flex;
      align-items: center;
      img {
        height: 0.72rem;
        width: 0.72rem;
        margin-right: 0.32rem;
      }
      span {
        color: #000;
      }
    }
  }
  .storegradebox {
    color: #000;
    font-size: 0.52rem;
    .storebox {
      display: flex;
      align-items: center;
      img {
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.32rem;
        // margin-top: -1px;
      }
    }
    .gradebox {
      margin-top: 0.8rem;
      padding-left: 1.04rem;
      display: flex;
      align-items: center;
      &:first-child {
        margin-top: 0;
      }
      label {
        margin-right: 0.68rem;
      }
      /deep/ .van-rate__item:not(:last-child) {
        padding-right: 0.48rem;
      }
    }
  }
  .footerBox {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    span {
      display: inline-block;
      width: 13.56rem;
      height: 1.52rem;
      border-radius: 0.76rem;
      background-color: #e60113;
      text-align: center;
      line-height: 1.52rem;
      color: #fff;
      font-size: 0.56rem;
    }
  }
}
.returntopBox {
  width: 100%;
  .returntop {
    width: 1.6rem;
    height: 1.6rem;
    position: fixed;
    bottom: 2.6rem;
    right: 0.48rem;
  }
}
.backtopactive {
  position: fixed;
  top: 0;
}
</style>