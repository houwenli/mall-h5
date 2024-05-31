<template>
	<div class="wraper">
    
	</div>
</template>

<script>
import { setToken } from '@/utils/token'
import { setWebFunny, getPlatform, call } from '@/utils/hybrid'
import { SYSPLATFORM } from '@/constants/userinfo'

export default {
    components: {
    },
    data() {
      return {
        defaultPath: 'https://m.wsfmall.com/'
      }
    },
    computed: {
      
    },
    created() {
      this.transferOpe()
    },
    mounted() {
      
    },
    methods: {
      // 解析跳转数据，中转操作
      // 获取token，打入cookie中，然后获取用户信息
      transferOpe() {
        let data = this.$route.query.data
        let parseData = {}
        try {
          parseData = JSON.parse(data)
        } catch(e) {
          console.log(e)
        }

        let { path = this.defaultPath, pageParam = {}, token } = parseData
        // 设置cookie，获取用户信息
        setToken(token)
        setWebFunny()

        // 获取app信息
        this.getAppInfo()
        // 跳转到指定页面
        setTimeout(() => {
          this.jumpPage(path, pageParam)
        }, 0)
      },

      // 获取app信息，打入localstorage
      getAppInfo() {
        const platform = getPlatform()
        if (platform == SYSPLATFORM.android || platform == SYSPLATFORM.ios) {
          // 防止是ios app 获取平台标识延迟
          setTimeout(() => {
            call('userInfo', '', 'userInfoBack').then(
              (data) => {
                console.log('smartEntry获取的APP数据---->', JSON.stringify(data))
                localStorage.setItem('appData', JSON.stringify(data))
              }
            )
          }, 0)
        }
      },

      // 跳转指定页面
      jumpPage(path, pageParam = {}) {
        // 判断时候是http开头
        if (/^(http|https):\/\/[^\s]+/.test(path)) {
          // 判断连接中会不会有?
          let searchFlag = path.indexOf('?') >= 0

          let paramStr = Object.keys(pageParam).reduce((prev, next, index) => {
            return prev + `${index == 0 && !searchFlag ? '?' : '&'}${next}=${pageParam[next]}`
          }, '')

          window.location.replace(`${path}${paramStr}`)
        }
        // 相对路径，直接走路由
        else {
          this.$router.replace({ path, query: pageParam })
        }
        
        
      }
    },
}
</script>

<style scoped lang="less">


</style>
