<template>
	<div class="ranking-container">
    <headerCom v-if="(isAndroid || isPhone) && ![106, 107].includes(paramsCode)" :pageTitle="config.pageTitle"></headerCom>

    <div v-if="isInit" style="padding-top:44px">
      <div v-if="[101, 102].includes(paramsCode)" :class="(isAndroid || isPhone) && !isH5 ? 'share-app' : ''" class="share" @click="handleShare" >分享</div>
      <van-share-sheet v-if="[101, 102].includes(paramsCode)" v-model="showShare" :options="options" @select="onSelect" @cancel="close"
          @click-overlay="close" />
      <!-- <special-goods></special-goods> -->
      <component :is="getCurrentTab" :moduleData="moduleData" :config="config"></component>

      <!-- 热销商品 -->
      <div class="xq_wntj" ref="wntj" v-if="recommendGoodsSource">
        <shopList :title="'精选好物'" :titleImg="true" :detailShow="true" :pageType="recommendGoodsSource"></shopList>
      </div>
    </div>

    <!-- 回到顶部  -->
    <div class="returntopBox" v-if="isshowtop">
      <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/special-subject/backtop.png" class="returntop" @click="backtop" alt="" />
    </div>
	</div>
</template>

<script>
import hotCategory from './comp/hotCategory/hotGoods.vue' // 品类热销
import specialGoods from './comp/special/specialGoods.vue' // 排行专题
import singlePage from './comp/singlePage/index.vue' // 单页模板
import customization from './comp/customization/index.vue'
import shopList from '@/components/commons/shopList' // 底部精选好物
import emptyView from './comp/common/emptyView.vue' // 无排行
import headerCom from './comp/common/header.vue'
// 接口
import { selectSubjectById } from '@/api/specialTopic/ranking'
import { pageEnums } from './data.js'

import { dealError } from './common/dealError'
import { getQueryString, isMobile } from '@/utils/utils'

export default {
    components: {
      shopList,
      specialGoods,
      singlePage,
      emptyView,
      hotCategory,
      customization,
      headerCom,
    },
    data() {
      return {
        isInit: false, // 判断页面是否初始化完成

        // 上部不同类型专题区域
        moduleData: null, // 模块数据
        paramsCode: '', // 模块类型
        config: {}, // 配置

        // 分享相关
        showShare: false, //显示--分享面板
        shareType: -1,

        isPhone: false,
        isAndroid: false,
        isAppEnter: 0,

        // 回到顶部
        isshowtop: false,
        recommendGoodsSource: '' // 排行榜pageType类型
      }
    },
    computed: {
      options() {
        if (this.isH5) {
          return [
            { name: '复制链接', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang_lianjie.png', type: 3 },
          ]
        } else {
          return [
            { name: '微信好友', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang-vxicon.png', type: 1 },
            //{ name: 'QQ好友', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang_QQ.png', type: 2 },
            { name: '复制链接', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/fenxiang_lianjie.png', type: 3 },
          ]
        }
      },
      isH5() {
        return this.$store.state.userSource == 3
      },

      getCurrentTab(){
        let obj = pageEnums.find(item=>{
          return item.id == this.paramsCode
        })
        return obj && obj.name ? obj.name : 'emptyView'
      }
    },
    created() {
      // 获取专题id
      this.id = getQueryString('id') || '';

      const { isAndroid, isPhone } = isMobile();
      this.isPhone = isPhone;
      this.isAndroid = isAndroid;
      // isAppEnter判断是否是从APP进入 是为1 否则为0
      this.isAppEnter = getQueryString('isAppEnter') || 0;

      // 初始化
      this.init()
    },
    mounted() {
      // 滚动条的获取
      window.addEventListener('scroll', this.handleScroll, true)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('scroll', this.handleScroll, true)
      })
    },
    methods: {
      // 初始化，获取专题详情
      // 获取配置文件，分享信息
      init() {
        this.getSubjectDetail()
      },
      // 根据专题id获取专题详情，配置文件，分享信息等
      getSubjectDetail() {
        let param = {
          id: this.id
        }
        this.isInit = true;
        selectSubjectById(param).then(res => {
          this.isInit = true;
          const {
            code,
            data = {},
            msg
          } = res || {}
          if (code === 200) {
            let {
              templateCode,
              content
            } = data
            // templateCode = 107
            // 主页面对不同专题不做处理，数据传递进组件
            this.paramsCode = templateCode;
            this.moduleData = data
            // JSON.parse要用try包起来防止出错
            try {
              this.config = JSON.parse(content)
            } catch(err) {
              dealError(code, msg)
            }
            if(this.config && this.config.recommendGoodsSource){
              this.recommendGoodsSource = this.config.recommendGoodsSource
            }
            console.log(66666, this.moduleData, this.config )
            // 处理主页公共逻辑
            this.dealMainCommon()
          } else {
            // 接口异常兜底提示
            dealError(code, msg)
          }
        }).catch(err => {
          // 接口异常兜底提示
          dealError(err.code, err.msg)
        })
      },

      // 处理主页公共逻辑
      dealMainCommon() {
        // 获取分享信息
        this.getShareInfo();
        // 设置页面标题
        this.setPageTitle();

      },

      // 处理分享
      close() {
        this.showShare = false
      },
      async toMiniH5(platform, shareData) {
        shareData = JSON.stringify(shareData)
        console.log(`分享弹窗${platform === 1 ? 'ios' : '安卓'},shareData: `, shareData)
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
        this.close()
      },
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
      //分享方式  微信  海报
      onSelect(option) {
        switch (option.type) {
          case 1:
            let shareData = this.getShareData(option.type)
            this.sharePro(shareData)
            break
          case 2:
            let shareAata = this.getShareData(option.type)
            this.sharePro(shareAata)
            break;
          case 3:
            this.getShareLink()
            break;
          default:
            break
        }
      },
      getShareLink() {
        let shareContent = window.location.href
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
      // 分享方式入参
      getShareData(key) {
        let share

        const {
          shareText: title,
          landPageH5Url: url,
          imgUrl,
          shareDescription: description,
        } = this.moduleData
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
          case 1:
            share = {
              imgUrl,
              platformTag: 3, //3= 微信好友
              shareType: 1, //3=分享图片
              title,
              description,
              url,
            }
            break
          case 2:
            share = {
              imgUrl,
              platformTag: 1, //1=qq好友
              shareType: 1, //3=分享图片
              title,
              description,
              url,
            }
            break
          case 6:
            share = {
              imgUrl,
              platformTag: 4, // 4=朋友圈
              shareType: 3, //3=分享图片
            }
            break
          default:
            break
        }
        return { sharePlatformList: [share] }
      },
      handleShare() {
        this.showShare = true
        this.shareType == 5
      },
      getShareInfo() {
        const {
          shareText: title,
          landPageH5Url: path,
          imgUrl: imageUrl,
        } = this.moduleData
        this.shareInfo = {
          title,
          path,
          imageUrl,
        }
      },

      // 设置页面标题
      setPageTitle() {
        const {
          pageTitle
        } = this.config
        // 设置页面标题
        document.title = pageTitle || '万顺福商城'
      },


      // 监听滚动
      handleScroll() {
        let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        scorllTop = Math.abs(scorllTop) // 取绝对值
        // console.log('滚动了', scorllTop)
        if (scorllTop >= 500) this.isshowtop = true
        else this.isshowtop = false
      },
      // 回到顶部
      backtop() {
        window.scroll({
          top: 0,
          behavior: "smooth", //滚动条平滑滚动
        });
      },
    },
}
</script>

<style scoped lang="less">
.ranking-container {
  position: relative;
}
.share {
  position: absolute;
  width: 30px;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  font-size: 10px;
  color: #fff;
  top: 54px;
  right: 12px;
}
.share-app {
  top: 55px;
}
.ranking-container{
  .xq_wntj {
    background-color: #f5f5f5;
    padding: 34px 0.48rem 32px;
    /deep/ .guess-warp .guess-title {
      font-family: PingFangSC-Medium, PingFang SC;
      text-align: center;
      font-weight: bold;
      font-size: 0.64rem;
      height: 18px;
      line-height: 18px;
      box-sizing: content-box;
    }
  }
}

.returntopBox {
  .returntop {
    width: 37px;
    height: 37px;
    position: fixed;
    right: 6px;
    bottom: 75px;
    z-index: 999;
  }
}

</style>
