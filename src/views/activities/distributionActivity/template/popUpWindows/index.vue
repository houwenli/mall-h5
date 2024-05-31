<template>
  <div class="pop_up_windows">
    <van-overlay :z-index="999999999" :show="popupWindowIsShow">
      <div class="wrapper" @click.stop>
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in popupWindowConfigData" :key="index">
            <!-- <a :href="item.jumpAddress" v-if="item.jumpAddress">
                </a> -->
            <img @click="imgActive(item.jumpAddress)" :src="item.windowUrl" style="width:100%;height:100%" />
          </van-swipe-item>
        </van-swipe>
        <img
          style="width:24px;height:24px;margin-top:10px"
          @click="popupWindowConfigIsShow(false)"
          src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/34ec0d07e9734660a34f7e3b8218edc2.png"
        />
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import { Overlay, Swipe, SwipeItem } from 'vant'
  import { mapGetters } from 'vuex'
  import { routerPathName } from '@/utils/utils'
  export default {
    components: {
      [Overlay.name]: Overlay,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
    },
    props: {
      popupWindowConfigData: {
        type: Array,
        default: () => [],
        required: true,
      },
    },
    data() {
      return {
        show: false,
      }
    },
    computed: {
      ...mapGetters(['popupWindowIsShow']),
    },
    watch: {},
    created() {
      this.popupWindowConfigData.length ? (this.show = true) : (this.show = false)
    },
    mounted() {
      console.log(this.popupWindowConfigData, 'popupWindowConfigData')
    },
    methods: {
      imgActive(data) {
        if(data){
          routerPathName(data)
        }
      },
      popupWindowConfigIsShow(isShow) {
        this.$store.dispatch('HOME_PAGE_CONFIG/popupWindowConfigIsShow', isShow)
      },
    },
  }
</script>

<style scoped lang="less">
  .pop_up_windows {
    .wrapper {
      // padding-top: 2.8rem;
      padding-top: 100px;
      margin: 0 auto;
      width: 300px;
      height: 400px;
      text-align: center;
    }
    .my-swipe,
    .van-swipe-item {
      width: 300px;
      height: 400px;
    }
  }

  .my-swipe .van-swipe-item {
    background-color: rgba(0, 0, 0, 0);
  }
</style>
