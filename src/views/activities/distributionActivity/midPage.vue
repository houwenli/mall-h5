<template></template>

<script>
  import { isDistribution } from '@/api/home'
  export default {
    created() {
      this.isDistribution()
    },
    methods: {
      //是否为分销员
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
            if (isDistribution == 1) {
              //是分销-推广员
              let data = {
                customerId: res.data.customerId || '', //关联商城用户ID
                mobile: res.data.mobile || '', //电话号码
                promoteId: res.data.promoteId || '', //关联推广员ID
                promoteType: res.data.promoteType || '', //推广员类型（1-推广员 2-车主）
                id: res.data.id || '', //分销员ID
              }
              this.$store.dispatch('setDistrInfo', data)
            }
            //页面跳转 1 是推销员  0 不是推销员
            let path = isDistribution == 1 ? '/distributionActivity' : '/promoter'
            this.$router.replace(path)
          } else {
            //-1 接口有误
            this.$router.go(-1)
          }
        } catch (error) {
          //-1 接口有误
        this.$router.go(-1)
        }
      },
    },
  }
</script>

<style></style>
