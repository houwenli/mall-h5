<template>
  <div style="min-height: 100vh">
    <van-nav-bar title="个人设置" left-arrow @click-left="$router.back(-1)" style="margin-bottom: 0.48rem">
      <template #left>
        <img style="width: 0.96rem; height: 0.96rem" src="../../assets/img/back_1@2x.png" alt="" />
      </template>
    </van-nav-bar>

    <van-cell-group class="mobile-personal-info-wrap">
      <van-cell center style="border-radius: 0.4rem 0.4rem 0 0" title="头像" is-link>
        <uploader
          class="profileImgUploader"
          :url="uploadApi"
          v-model="imageList"
          name="image"
          limit="1"
          :multiple="false"
          :withCredentials="true"
          :headers="headers"
          @on-success="onSuccess"
          @on-delete="onDelete"
        ></uploader>
      </van-cell>
      <!-- <van-cell title="昵称" :value="nickName" is-link url="/setnickname" /> -->
      <van-cell title="昵称" :value="nickName" is-link @click="$router.push({ path: '/setnickname' })" />
      <van-cell title="用户名" :value="userName" is-link @click="goToSetUserName" />
      <van-cell title="修改密码" is-link @click="$router.push({ path: '/updatepwd' })" />
      <van-cell title="手机号码" is-link @click="$router.push({ path: '/validateoldmobile' })" style="border-radius: 0 0 0.4rem 0.4rem" />
      <!-- <van-cell style="border-radius: 0 0 0.4rem 0.4rem" title="地址管理" is-link @click="$router.push({ path: '/customeraddresslist?toaddresstype=2' })" /> -->
    </van-cell-group>

    <van-button class="mobile-personal-logout-btn" type="default" @click.native="toLogOut" v-if="is_disTshow">退出登录</van-button>
  </div>
</template>

<script>
  import { isWx } from '@/utils/utils'
  import { getToken, removeToken } from '@/utils/token'

  import { logout, queryCustomerPersonalInfo, unbindAccount, updateCustomerPersonalInfo, uploadToQqOSSYun } from '@/api/personalinfo'

  import Uploader from 'vux-uploader-component'
  export default {
    components: { Uploader },
    data() {
      return {
        isWx: isWx(), // 判断是否是微信
        uploadApi: process.env.UPLOAD_API, // 上传图片api
        headers: {
          Authorization: 'Bearer ' + getToken(),
        }, // 认证的头部
        isProcess: false, // 接口是否处理中
        nickName: '', // 昵称
        userName: '', // 用户名
        customer: null, // 个人信息
        isUpdate: 0, // 是否修改过用户名 0 - 未修改 1 - 已修改 只能修改一次
        imageList: [], // 头像图片,
        // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
        platform: '',
        is_disTshow: true, // 分销展示退出按钮
      }
    },
    mounted() {
      // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
      // this.platform = window.platform || ''
      this.platform = ((window.ws && window.ws.wsShare) || (window.webkit && window.webkit.messageHandlers.wsShare))
      document.getElementsByTagName('body')[0].className = 'gray-bg'
      this.queryCustomerPersonalInfo()

      let is_distribution = sessionStorage.getItem('HASDISTRIBUTIONPOWER') // 字符串
      if (is_distribution == 'true') is_distribution = true
      else is_distribution = false

      if (this.platform || is_distribution) this.is_disTshow = false
      else this.is_disTshow = true
    },
    methods: {
      // 上传图片前的回调
      beforeRead(file) {
        if (file.type !== 'image/jpeg') {
          this.$toast('请上传 jpg 格式图片')
          return false
        }
        return true
      },
      // 读取图片后的回调,上传图片
      afterRead(file) {
        console.log(file)
        uploadToQqOSSYun(file).then((res) => {})
      },
      // 上传图片成功回调
      onSuccess(res, file) {
        this.updateImage(res.data)
      },
      // 删除图片
      onDelete(deleteItem, cb) {
        cb && cb()
        this.updateImage('')
      },
      // 查询用户个人信息
      queryCustomerPersonalInfo() {
        let that = this
        queryCustomerPersonalInfo().then((res) => {
          if (res.flag) {
            that.customer = res.data
            if (res.data.image) {
              let image = {
                url: res.data.image,
              }
              that.imageList.push(image)
            }
            that.userName = res.data.userName
            that.nickName = res.data.nickName
            that.isUpdate = res.data.isUpdate
          }
        })
      },
      // 更改头像
      updateImage(picurl) {
        let that = this
        that.customer.image = picurl
        that.updateCustomerPersonalInfo()
      },
      // 修改个人信息
      updateCustomerPersonalInfo() {
        let that = this
        if (that.isProcess) {
          return
        }
        that.isProcess = true
        updateCustomerPersonalInfo(that.customer).then((res) => {
          that.isProcess = false
          if (res === 1) {
            that.$vux.toast.text('保存成功', 'middle')
          } else {
            that.$vux.toast.text('保存失败', 'middle')
          }
        })
      },
      // 退出登录
      toLogOut() {
        if (this.isWx) {
          unbindAccount().then(() => {
            // window.isLogin = false
            removeToken()
            this.$router.push({ path: '/home' })
          })
        } else {
          // this.$http.get(`${process.env.LOGIN_API}/logout`).then((res) => {
          //   removeToken()
          //   this.$router.push({ path: '/home' })
          // })
          logout().then(() => {
            // window.isLogin = false
            localStorage.removeItem('LOG888')
            localStorage.setItem("LOGOUT",true)
            removeToken()
            this.$router.push({ path: '/home' })
          })
        }
      },
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({ path: '/home' })
      },
      // 跳转设置用户名界面
      goToSetUserName() {
        if (this.isUpdate > 0) {
          this.$toast('您已修改过一次用户名,不可继续修改')
          return
        }
        this.$router.push('/setusername')
      },
    },
  }
</script>

<style lang="less" scoped>
  .mobile-personal-info-wrap {
  }

  .mobile-personal-logout-btn {
    margin-top: 0.48rem;
    width: 100%;
    border-radius: 0.4rem;
  }
  .profileImgUploader /deep/ .vux-uploader_bd {
    margin-left: 0;
    display: flex;
    justify-content: flex-end;
    & /deep/ .vux-uploader_input-box {
      float: right;
    }
    & /deep/ .vux-uploader_files {
      float: right;
    }
  }
</style>
