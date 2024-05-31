<template>
  <div class="wrap-content">
    <navbartop :title="$route.meta.title" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <van-cell-group>
      <div class="titleName">姓名/昵称</div>
      <van-field
        type="text"
        v-model="params.userName"
        maxlength="10"
        minLength="2"
        :error-message="nameError"
        placeholder="请输入您想要得昵称"
        @input="params.userName=$event.replace(/[^\u4e00-\u9fa5]/g,'')"
      />
      <div class="titleName">实体店</div>
      <van-field class="age_Input" v-model="params.simpleName" placeholder="请输入或选择实体店" @focus="getOrgList()" @blur="setShow()"></van-field>
      <van-cell-group class="text" v-show="isShow && stoList.length != 0">
        <van-cell :title="item.orgName" v-for="item in stoList" :key="item.index" @click="setAgencyNumber(item)" />
      </van-cell-group>
      <div
        class="button"
        :style="params.userName.length>=2 && params.simpleName ? 'opacity: 1;' : 'opacity:0.4;'"
        @click="params.userName.length>=2 && params.simpleName ? regpromoteRegister() : ''"
      >
        立刻加入万顺推广员
      </div>
    </van-cell-group>
    <div class="bottom_img">
      <img src="../../../assets/img/activity/img_logo.png" />
    </div>
    <!-- <el-amap style="display: none" :plugin="plugin">
    </el-amap> -->
  </div>
</template>

<script>
  import { regpromoteRegister, getOrgList } from '@/api/activities/distributionActivity'
  import { getLocation, debounce, location } from '@/utils/utils'
  import navbartop from '@/components/commons/navBartop'
  import store from '@/store/store.js'
  export default {
    components: {navbartop},
    data() {
      const self = this;
      return {
        nameError:'',
        isBlur: false, //是否是失焦时触发了点击
        isShow: false,
        isActive: false,
        params: {
          userPhone: store.getters.userInfo.mobile || '',
          userId: store.getters.userId || null,
          userName: '',
          agencyNumber: '',
          userSource: store.getters.getUserSource || '',
          simpleName: '',
        },
        backUrl: this.$route.query.url,
        stoList: [],
        agency:{
          agencyNumber:'',
          orgName:''
        },
        // plugin: [{
        //   enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        //   timeout: 30000,          // 超过30秒后停止定位，默认：无穷大
        //   zoomToAccuracy: true,     // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        //   showButton: false, // 显示定位按钮，默认：true
        //   pName: 'Geolocation',
        //   events: {
        //     init: (o) => {
        //       self.GDinit(o, self); // 获取当前位置
        //     }
        //   }
        // }],
        longitude: '',
        latitude:''
      }
    },
    watch: {
      'params.simpleName': {
        handler(newVal) {
          if (!this.isActive) {
            this.getOrgList()
          } else {
            this.isActive = false
          }
        },
      },
      'params.userName': {
        handler(newVal) {
          if (this.params.userName.length<2) {
            this.nameError="请输入2-10个汉字"
          }else{
            this.nameError=""
          }
        },
      },
    },
    created() {},
    methods: {
      // GDinit(o, self) {
      //   let that = this;
      //   o.getCurrentPosition((status, result) => {
      //     if (status === 'complete' && result.info === 'SUCCESS') {
      //       that.longitude = result.position.getLng();
      //       that.latitude = result.position.getLat();
      //       console.log(that.longitude, that.latitude, 22222222222222222222)
      //     } else {
      //       that.$vux.toast.text('定位失败,请刷新后重试', 'middle');
      //     }
      //   });
      // },
      //获取实体店
      async getOrgList() {
        this.isShow = true
        let params = {
          longlat: '',
          orgName: this.params.simpleName,
        }
        let platform

        try {
          //判断是啥机型
          if (window.ws) {
            platform = 1
          } else if (window.webkit) {
            platform = 2
          }
          if(this.$store.state.userSource == 3) {
            params.longlat = this.longitude && this.latitude? (this.longitude + ',' + this.latitude) : ''
          } else {
            await getLocation(platform)
            .then((res) => {
              let longlat = res.longitude + ',' + res.latitude || ''
              params.longlat = longlat
            })
            .catch((err) => {
              console.log('err:', err)
              return
            })
          }
          

          await getOrgList(params)
            .then((res) => {
              if (res.code == 200) {
                this.stoList = res.data
              } else {
                this.stoList = []
                this.isShow = false
              }
            })
            .catch((err) => {
              console.log('err:', err)
            })
        } catch (error) {
          console.log(error)
        }
      },
      setShow() {
        //解决失焦事件快于点击事件
        setTimeout(() => {
          this.isShow = false
        }, 1000)
      },
      //选择实体店
      setAgencyNumber(val) {
        this.agency=val
        this.params.agencyNumber = val.agencyNumber
        this.params.simpleName = val.orgName
        this.isShow = false
        this.isActive = true
      },
      //注册推广员
      regpromoteRegister: debounce(async function() {
        if (!this.params.agencyNumber||this.params.simpleName!=this.agency.orgName) {
          this.$toast('请选择实体店')
          return
        }
        if (this.isProcess) {
          return
        }
        this.isProcess = true
        try {
          let res = await regpromoteRegister(this.params)
          res = res.data
          if (res.code == 1) {
            let data = {
              customerId: res.customerId || '', //关联商城用户ID
              mobile: res.mobile || '', //电话号码
              promoteId: res.promoteId || '', //关联推广员ID
              promoteType: res.promoteType || '', //推广员类型（1-推广员 2-车主）
              id: res.id || '', //分销员ID
            }
            store.dispatch('setDistrInfo', data)
            // this.$router.replace({ name: 'distributionActivity' })
            if(this.backUrl) {
              this.$router.replace(this.backUrl)
            } else {
              // 已经授权或者不存在关联账号直接跳转首页
              this.$router.replace({ name: 'distributionActivity' })
            }
          } else {
            this.params.userName = ''
            this.params.simpleName = ''
            this.$toast(res.msg)
          }
        } catch (error) {
          console.log(error)
        }
        this.isProcess = false
      }),
      backLastPage() {
        this.$router.go(-1)
      }
    },
  }
</script>

<style lang="less" scoped>
  .titleName {
    font-size: 16px;
    font-weight: 400;
    padding: 16px 0px 8px 0px;
  }
  .button {
    padding: 13px 16px;
    margin-top: 32px;
    width: 100%;
    overflow: hidden;
    text-align: center;
    background: #5069fe;
    border-radius: 8px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
  }
  .bottom_img {
    position: absolute;
    bottom: 31px;
    width: 100vw;
    text-align: center;
    z-index: 1;
  }
  .van-cell-group {
    padding: 8px 32px 24px 32px;
    margin: 0px 16px;
    border-radius: 8px;
    z-index: 2;
  }
  .van-field {
    background-color: #f5f5f5;
    padding-left: 8px;
    border-radius: 8px;
    font-size: 14px;
  }
  .text {
    position: absolute;
    margin: 0;
    padding: 0;
    // top: 196px;
    width: calc(~'100% - 64px');
    max-height: 240px;
    overflow: auto;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #ebebeb;
    z-index: 999;
    .van-cell {
      //  display: inline-block;
      padding: 13px 12px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
    }
  }
  .wrap-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    // background-image: url('../../../assets/img/img_bg_promote.png');
    // background-repeat: no-repeat;
    background: url('../../../assets/img/img_bg_promote.png') center 46px no-repeat;
    background-size: 100vw;
    background-color: #3e76ff;
    // background-color: aqua;
    height: 100vh;
  }
</style>
