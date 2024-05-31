<template>
<div class="distributionShare_div">
    <!-- 分享面板 -->
    <van-share-sheet v-bind="$attrs" v-on="$listeners" v-model="showShare" title="分享至" :options="options" @select="onSelect" @cancel="clonse" @click-overlay="clonse" />

    <!-- 海报展示 -->
    <div v-show="posterShow" class="saveImg">
      <van-image :src="posterImg" />
    </div>
</div>
</template>

<script>
import { getToken } from '@/utils/token'
import {  getListShareCode } from '@/api/activities/distributionActivity'
import mixins from '@/mixins/activities/distributionActivity.js'
import { isDistribution } from '@/api/home'

 export default {
   name: 'distributionShare',
   mixins: [mixins],
   data () {
     return {
        showShare: false, //显示--分享面板
        shareType: 1,
        posterShow: false, //显示--海报展示
        posterImg: '', //海报图片
        proList: {
          val: {},
        }
     }
   },
    computed: {
      options() {
        if (this.shareType == 1 || this.shareType == 2 || this.shareType == 3 || this.shareType == 4) {
          return [
            { name: '微信好友', icon: 'wechat', type: 4 },
            { name: '朋友圈', icon: require('@/assets/img/icon-circle.png'), type: 6 },
            { name: '海报下载', icon: require('@/assets/img/icon-save.png'), type: 3 },
          ]
        } else if (this.shareType == 5 || this.shareType == 6) {
          return [{ name: '复制链接', icon: require('@/assets/img/copy@2x.png'), type: 5 }]
        }
        return []
      },
      /**
       * 判断是app还是H5
       * 纯H5只有分享链接
       * APP内嵌的H5是可以有 【微信好友】【朋友圈】 【海报下载】
       */
      isH5() {
        // 安卓内嵌H5
        if (window.ws !== undefined) {
          return false
        }

        // IOS 内嵌H5
        if (window.webkit !== undefined) {
          return false
        }

        // 纯H5网页
        return true
      }
    },
    watch: {
      showShare(val) {
        let getDom = document.querySelector('#footer-position-fixed')
        val ? getDom.style.zIndex = -1 : getDom.style.zIndex = 2
        // val ? getDom.setAttribute('style', 'z-index:-1') : getDom.setAttribute('style', 'z-index:2')
      },
    },
   methods:{
      //分享商品/列表
      async shareComm(isList, val) {
        if(!getToken()) {
          this.$router.push({ path: '/login', query: { url: '/distributionActivity' }})
          return
        }
        if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId || this.$store.getters.distrInfo.customerId != this.$store.getters.userInfo.id) {
          await this.isDistribution()
        } else {
          let data = {
              customerId: this.$store.getters.distrInfo.customerId || '', //关联商城用户ID
              mobile: this.$store.getters.distrInfo.mobile || '', //电话号码
              promoteId: this.$store.getters.distrInfo.promoteId || '', //关联推广员ID
              promoteType: this.$store.getters.distrInfo.promoteType || '', //推广员类型（1-推广员 2-车主）
              id: this.$store.getters.distrInfo.id || '', //分销员ID
            }
            this.distrInfo = data
        }

        if(!this.$store.getters.distrInfo || !this.$store.getters.distrInfo.promoteId) {
          this.$router.push({ path: '/promoter', query: { url: '/distributionActivity' }})
          return
        }
        this.proList.val = val || ''
        if(this.isH5) {
          this.shareType = val ? 5: 6
          // 弹出分享方式框
          this.showShare = true
        } else {
          this.posterImg = ''
          this.shareType = isList
          //保存单个商品信息
          this.isShare(val)
        }

      },
      async isDistribution() {
        if (!this.$store.getters.userId) {
          await this.$store.dispatch('user/getUserInfo')
        }
        let params = {
          userId: this.$store.getters.userId,
          userPhone: this.$store.getters.userInfo.mobile,
        }
        try {
          let res = await isDistribution(params)
          if (res.data.code == 1) {
            let isDistribution = res.data.isDistribution
            // if (isDistribution == 1) {
              //是分销-推广员
              let data = {
                customerId: res.data.customerId || '', //关联商城用户ID
                mobile: res.data.mobile || '', //电话号码
                promoteId: res.data.promoteId || '', //关联推广员ID
                promoteType: res.data.promoteType || '', //推广员类型（1-推广员 2-车主）
                id: res.data.id || '', //分销员ID
              }
              this.distrInfo = data
              this.$store.dispatch('setDistrInfo', data)
            // }
            //页面跳转 1 是推销员  0 不是推销员
          } else {
            //-1 接口有误
          }
        } catch (error) {
          //-1 接口有误
        }
      },
      //取消
      clonse() {
        this.showShare = false
        this.posterShow = false
        this.posterImg = ''
        // this.$emit('cancel')
      },
      //分享方式  微信  海报
      onSelect(option) {
        switch (option.type) {
          // case 1:
          case 3:
          case 6:
          case 4:
            let shareData = this.getShareData(option.type)
            this.sharePro(shareData)
            break
          case 5:
            this.getShareLink()
            break;
          default:
            break
        }
      },
      // 分享方式入参
      getShareData(key) {
        let share
        /**
        * this.shareType-option.type
          //单品-微信好友-链接 1-1
          单品-分享海报-保存图片 3-3
          单品-分享海报-微信好友 3-4
          //列表-微信好友-链接 2-1
          列表-分享海报-保存图片 4-3
          列表-分享海报-微信好友 4-4
        */
        switch (key) {
          // case 1:
          //   if (this.shareType == 1) {
          //     }
          //   } else {
          //     share = {
          //   }
          //   break
          case 3:
            share = {
              imgUrl: this.posterImg,
              platformTag: 5, //5= 保存图片
              shareType: 3, //3=分享图片
            }
            break
          case 4:
            share = {
              imgUrl: this.posterImg,
              platformTag: 3, //3= 微信好友
              shareType: 3, //3=分享图片
            }
            break
          case 6:
          share ={
            imgUrl: this.posterImg,
            platformTag: 4, // 4=朋友圈
            shareType: 3, //3=分享图片
          }
           break
          default:
            break
        }
        return { sharePlatformList: [share] }
      },
      getShareLink() {
        let baseUrl = window.location.origin
        let shareContent
        if(this.shareType==5) {
          shareContent = `${baseUrl}/spudetail?id=${this.proList.val.skuId}&promoteInfo=${JSON.stringify(this.distrInfo)}&sourceType=1`
        } else {
          shareContent = `${baseUrl}/distributionActivity?promoteInfo=${JSON.stringify(this.distrInfo)}&sourceType=1`
        }
        let input1 = document.createElement('input') // 直接构建input
        input1.value = shareContent // 设置内容
        document.body.appendChild(input1)
        input1.select() // 选择实例内容
        document.execCommand('Copy') // 执行复制
        console.log(input1.value)
        document.body.removeChild(input1) // 删除临时实例
        this.$toast.success('复制成功！')
        this.showShare = false
      },
      //列表海报
      async getListShareCode() {
        let params = {
          scene: 'id=' + this.distrInfo.promoteId,
          page: 'distributionModule/pages/distributionIndex/distributionList',
          recommendId: this.distrInfo.promoteId,
          width: 40,
          autoColor: false,
          lineColor: '',
          isHyaline: false,
        }
        try {
          this.$toast.loading({
            message: '正在生成海报中…',
            forbidClick: true,
            duration: 5000,
          })
          let res = await getListShareCode(params)
          if (res.code == 200 && res.data.wsSunCodeUrl) {
            this.posterImg = res.data.wsSunCodeUrl
            this.posterShow = true
            // 弹出分享方式框
            this.showShare = true
            this.shareType = 4
            this.$toast.clear()
          } else {
            this.$toast('海报生成失败')
          }
        } catch (error) {
          console.log(error)
        }
      },
    }
 }
</script>

<style lang='less' scoped>
.distributionShare_div{
    .saveImg {
      width: 100vw;
      height: 50vh;
      display: flex;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      .van-image {
        position: absolute;
        top: 80px;
        width: 65vw;
        height: 50vh;
        z-index: 2200;
        /deep/.van-image__img {
          border-radius: 10px;
        }
      }
    }
    /deep/ .van-share-sheet__options {
      justify-content: space-around !important;
    }
}
</style>