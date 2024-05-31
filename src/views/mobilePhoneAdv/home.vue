<template>
  <div>
    <navbartop :title="'开卡业务'" @clickBack="backLastPage" :isConfirm="true" class="navtop" v-if="!isMini"></navbartop>
    <div class="page-content">    
      <div v-if="!isShowQue" class="contaier-box">      
        <div v-if="imgList && imgList.length>0 && !showLoading">
          <img v-for="(item, index) in imgList" :key="index" :src="item.packageImg" class="package_img" @click="handleClick(item)" /> 
        </div>
      
        <div v-if="imgList.length==0 && !showLoading" class="que-style">
          <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/comm/blank_network.png" alt="">
        <span>空空如也~</span>
      </div>    
      </div>
      <div v-else class="que-style">
        <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/comm/blank_network.png" alt="">
        <span>空空如也~</span>
      </div>  
    </div> 
  </div>
</template>

<script>
  import { Toast } from 'vant'
  import { queryPackageCfgList } from './service/index'
  import { setToken } from '@/utils/token'
  import { appBack } from '@/utils/utils'
  import navbartop from '@/components/commons/navBartop' // 导航栏
  export default {
    name: 'mobilePhoneAdvHome',
    components: {    
      [Toast.name]: Toast,
      navbartop
    },
    data() {
      return {
        imgList: [],
        mobile: '',
        userId: '',
        timeInterval: null,  
        isShowQue: false,
        showLoading: true,
        isMini: false  
      }
    },
    beforeDestroy(){
      clearTimeout(this.timeInterval)
      this.timeInterval = null
    }, 
    beforeRouteEnter(to, from, next){      
      if(from.path == '/mobilePhoneAdv/index'){
        window.location.reload()
      }
      next()
    },  
    mounted() {    
      this.isMini = window.__wxjs_environment === 'miniprogram'    
      // this.getGinsengInfo()             
      if(this.$route.query.token && window.__wxjs_environment === 'miniprogram'){
        setToken(this.$route.query.token)
        if (!this.$store.getters.userId) {
          let userInfo = this.$store.dispatch('user/getUserInfo')
        }
      }  
      this.timeInterval = setTimeout(()=>{           
        this.selectImgList()             
      },1000)
    },
    methods: {
      backLastPage() {
        appBack(this)
      },
      handleClick(item){      
        if(item.packageName.includes('深圳联通') && item.providerName.includes('深圳零玖')){
          // 联通跳转自己页面         
          // this.$router.push(`/mobilePhoneAdv/index?mobile=${this.mobile}&packageId=${item.id}&userId=${this.userId}`) 
          this.$router.push({
            path: '/mobilePhoneAdv/index',
            query: {
              mobile: this.mobile,
              packageId: item.id,
              userId: this.userId
            }
          })                
        } else if((item.packageName.includes('广东移动') || item.packageName.includes('上海电信') || item.packageName.includes('佛山移动')) && item.providerName.includes('北京合智源')){
          if(
            item.packageLink && (
              ((item.packageName.includes('广东移动') && item.operatorStatus==1) || (item.packageName.includes('上海电信') && item.operatorStatus==3) || (item.packageName.includes('佛山移动') && item.operatorStatus==1))
            )
          )
          {
            window.location.href = item.packageLink + `&mobile=${this.mobile}&packageId=${item.id}&userId=${this.userId}`
          } else {
            console.error('未配置第三方链接')
          }
        } else {        
          console.error('未配置第三方链接')         
        }
      },
      selectImgList() {                
        let params = {
          userId: this.$store.getters.userId     
        }      
             
        queryPackageCfgList(params)
          .then((res) => {           
            
            if (res.code === 200 && res.data) {
              clearTimeout(this.timeInterval)              
              this.imgList = res.data.packageList || []                            
              this.showLoading = false
              this.mobile = res.data.mobile
              this.userId = res.data.userId
              this.isShowQue = false           
            } else {                      
              this.inNext++  
              if(this.inNext<3){
                this.selectImgList()
              }
            }
          })
          .catch((error) => {
            this.isShowQue = true
            console.log(error,'errorerrorerrorerrorerrorerror');
            // clearTimeout(this.timeInterval)
          })
      },
      // 获取公参信息
      // getGinsengInfo() {
      //   // 解析公参 获取司机id
      //   analysisGinseng().then((res) => {
      //     console.log(res,'resresres');
      //     this.selectImgList(res.driverId)
      //   })
      // },
    },
  }
</script>
<style lang="less" scoped>
  .page-content {
    height: 100vh;
    background: #F6F6F6;
    padding: 8px;
    .package_img {
        height: 120px;
        border-radius: 12px;
        width: 100%;
    }
    .contaier-box{
      height: 100%;
    }
    .que-style{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: -100px;
      img{
        width: 200px;
      }
    }
  }
</style>
