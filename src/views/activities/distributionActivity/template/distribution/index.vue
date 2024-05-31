<template>
  <!-- 分销组件 -->
  <div class="distribution" :style="{'margin-top': `${listData.blankHeight || 0}px`}" v-if="getDistribution">
    <div
      @click.stop="toDistribution"
      class="image_list"
      :style="{
        'height': '100px',
        'background-image': listData.bgImage?`url(${listData.bgImage})`:'url(https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png)',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center',
      }"
    >
    <template v-for="(item, index) in listData.styles[listData.radio]">
      <img v-if="item.url" @click.stop="navigate(item,index)" class="img_item" :key="index" :src="item.url" />
      <img v-else class="img_item" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png" />
    </template>

    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { encrypt } from '@/utils/sign'
  import { getToken } from '@/utils/token'
  import {routerPathName} from '@/utils/utils'
  export default {
    components: {},
    props: {
      listData: {
        type: Object,
        default: () => {
          return {
            // 0: 风格1 1: 风格2 2: 风格3
            radio: 0,
            bgImage: this.defaultImg,
            styles: [
              [],
              [
                {
                  id: 1,
                  url: this.defaultImg,
                  link: '',
                },
                {
                  id: 2,
                  url: this.defaultImg,
                  link: '',
                },
              ],
              [
                {
                  id: 1,
                  url: this.defaultImg,
                  link: '',
                },
                {
                  id: 2,
                  url: this.defaultImg,
                  link: '',
                },
                {
                  id: 3,
                  url: this.defaultImg,
                  link: '',
                },
              ],
            ],
          }
        },
        required: true,
      },
    },
    data() {
      return {
        miniAppletUserName: process.env.MINI_APPLET_ID, // 小程序原始Id
        defaultImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1a764c3ad0a4f6dbdf3e4f7ecdb80bb3.png'
      }
    },
    computed: {
      userId() {
        return this.$store.getters.userId
      },
      // 响应式获取是否存在分销权限
      getDistribution() {
        /* Todo 临时方案: 限制车生活入口访问分销专区 */
        // if (sessionStorage.getItem('WSFPORT') == 1) {
        //   return false
        // }
        console.log('sessionStorage.getItem', sessionStorage.getItem('HASDISTRIBUTIONPOWER'))

        let token = getToken() ? getToken() : '' // 判断token是否存在
        let is_distribution = sessionStorage.getItem('HASDISTRIBUTIONPOWER') // 字符串
        is_distribution = is_distribution == 'true'

        let getDistribution = this.$store.getters.getDistribution // 首次免密登陆处理数据不同步问题
        console.log('仓库的状态getDistribution', getDistribution)

        let hasDistribution = getDistribution || is_distribution

        console.log('token---------', token)
        console.log('是否有分销权限getDistribution', hasDistribution)

        if (token && hasDistribution) {
          return hasDistribution
        } else {
          return false
        }
      },
    },
    methods: {
      navigate(data,index) {
        // 流量分析埋点
        let params = {
          name:'分销',
          image:data.url || '',
          url:data.link || '',
          type: 10,
          index,
          channel_source:Cookies.get('_wsf_role')
        }
        this.$store.dispatch('BURIED_POINT/advertVisitRequest',params)
        if (!data || !data.link) return
        routerPathName(data.link,"distribution")
        // window.location.href = data.link
      },
      getUrl(isIndexPage=false){
        let url = ''
        if(isIndexPage){
          if (process.env.NODE_ENV === 'uat' ) {
            url = 'https://m-uat.wsfmall.com'
          } else if (process.env.NODE_ENV === 'test' ) {
            url = 'https://m-test.wsfmall.com'
          }else if (process.env.NODE_ENV === 'dev') {
            url = 'https://m-dev.wsfmall.com'
          }else if (process.env.NODE_ENV === 'dev2') {
            url = 'https://m-dev2.wsfmall.com'
          } else if (process.env.NODE_ENV === 'local') {
            url = 'https://m.wsfmall.com'
          } else {
            url = 'https://m.wsfmall.com'
          }
        }else{
          if (process.env.NODE_ENV === 'uat' ) {
            url = 'https://m-uat.wsfmall.com/distribution'
          } else if (process.env.NODE_ENV === 'test' ) {
            url = 'https://m-test.wsfmall.com/distribution'
          }else if (process.env.NODE_ENV === 'dev') {
            url = 'https://m-dev.wsfmall.com/distribution'
          }else if (process.env.NODE_ENV === 'dev2') {
            url = 'https://m-dev2.wsfmall.com/distribution'
          } else if (process.env.NODE_ENV === 'local') {
            url = 'https://m.wsfmall.com/distribution'
          } else {
            url = 'https://m.wsfmall.com/distribution'
          }
        }
        console.log(url,"<---要返回的页面🎄🎄🎄🎄")
        return url
      },
      // 分销模块入口
      toDistribution() {
        // 尝试拉起小程序
        /* Todo 1.8日才放开H5拉起小程序 */
        if (window.ws) {
          this.toMiniAppDistribution(2)
          // return
        } else if (window.webkit) {
          this.toMiniAppDistribution(1)
          // return
        } else {
          if (Cookies.get('_wsf_role') != 1) {
            let url = this.getUrl()

            window.location.href = url
            // 流量分析埋点
            let params = {
              name:'分销',
              image:this.listData.bgImage?this.listData.bgImage:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png',
              url:url,
              type: 10,
              channel_source:Cookies.get('_wsf_role') || ''
            }
            this.$store.dispatch('BURIED_POINT/advertVisitRequest',params)
          }
        }
      },
      // 唤醒小程序分销
      async toMiniAppDistribution(platform) {
        // 流量分析埋点
        let params = {
          name:'分销',
          image:this.listData.bgImage?this.listData.bgImage:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png',
          // url:'distributionModule/pages/distributionIndex/distributionIndex',
          url: 'pages/usercenter/usercenter',
          type: 10,
          channel_source:Cookies.get('_wsf_role') || ''
        }
        this.$store.dispatch('BURIED_POINT/advertVisitRequest',params)
        if (!this.userId) {
          const { data } = await this.$store.dispatch('user/getUserInfo')
        }
        // 准备密钥
        console.log('this.userId: ', this.userId)
        let aesToken = encrypt(this.userId, 'VGrCjJsxus1pXky0').encryptStr
        console.log('aesToken', aesToken)
        let userSource = this.$store.getters.getUserSource,
          // let userSource = localStorage.getItem('userSource'),
          us = ''
        if (userSource && userSource == 1) {
          us = 6
        } else if (userSource && userSource == 2) {
          us = 5
        }
        //判断是否为生成环境
        let miniprogramType
        if (process.env.NODE_ENV == 'production') {
          miniprogramType = 0
        } else {
          miniprogramType = 2
        }
        let shareData = {
          sharePlatformList: [
            {
              userName: this.miniAppletUserName, // 分销小程序原始ID
              path: `distributionModule/pages/distributionIndex/distributionIndex?k=${aesToken}&us=${us}`, //
              miniprogramType: miniprogramType,
              platformTag: 7,
            },
          ],
        }
        shareData = JSON.stringify(shareData)

        console.log(`拉起小程序${platform === 1 ? 'ios' : '安卓'},shareData: `, shareData)
        if (platform === 2) {
          try {
            window.ws.wsShare(shareData)
            window.location.href = this.getUrl(true)
          } catch (err) {
            console.log('安卓拉起失败', err)
            if (Cookies.get('_wsf_role') != 1) {
              // window.location.href = '/distribution'
              // this.$router.push({path:'/distribution'})
              window.location.href = this.getUrl()
            }
          }
        } else if (platform === 1) {
          try {
            window.webkit.messageHandlers.wsShare.postMessage(shareData)
            window.location.href = this.getUrl(true)
          } catch (err) {
            console.log('ios拉起失败', err)
            if (Cookies.get('_wsf_role') != 1) {
              // window.location.href = '/distribution'
              // this.$router.push({path:'/distribution'})
              window.location.href = this.getUrl()
            }
          }
        }
        if (Cookies.get('_wsf_role') != 1) {
          // window.location.href = '/distribution'
          // this.$router.push({path:'/distribution'})
          window.location.href = this.getUrl(true)
        }
        // 判断是否是开发环境
        // if (process.env.NODE_ENV === 'local') {
        //   window.location.href = 'http://172.16.3.42:8081/distribution?token=' + getToken()
        // } else {
      },
    },
  }
</script>

<style scoped lang="less">
  .distribution {
    margin: 0 0.48rem;
    .image_list {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-radius: 0.4rem;
      padding: 0.4rem 0px;
      background-color: #fff;
      .img_item {
        margin-right: 0.4rem;
        border-radius: 0.4rem;
        width: 3.2rem;
        height: 3.2rem;
      }
    }
  }
</style>
