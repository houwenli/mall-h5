<template>
  <div>
    <div :style="skuImgList.length > 1 ? 'background: #fff;' : ''">
      <van-swipe width="100%" class="my-swipe" indicator-color="white" @change="onChange" loop style="height:375px;">
        <van-swipe-item v-for="(item, index) in carouselPics" :key="index">
          <img
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2c523a830be84b6436fa80fffc125a16.png"
            v-if="current == 0 && spu.spuVideo && isPlayer"
            @click="playVideo()"
            alt=""
            class="iconPlay"
          />
          <video
            :controls="controlsShow"
            style="object-fit: unset"
            :src="spu.spuVideo"
            :poster="spuVideoPic"
            webkit-playsinline="true"
            x-webkit-airplay="true"
            playsinline="true"
            x5-video-player-type="h5"
            x5-video-orientation="h5"
            x5-video-player-fullscreen="true"
            preload="none"
            class="bannerVideo"
            v-if="current == 0 && spu.spuVideo"
            @ended="endVideo()"
            id="videoBanner"
            :key="videoKey"
          ></video>
          <img :src="item.img" alt="" @click="openImg()" style="width:100%;height:375px" />
        </van-swipe-item>

        <template #indicator>
          <div class="custom-indicator">
            <span>{{ current + 1 }}/{{ carouselPics.length }}</span>
          </div>
        </template>
      </van-swipe>
    </div>
    <!-- sku属性选择小图 -->
    <div class="img-box" v-if="skuImgList.length > 1">
      <div class="img-box-contaier-left">
        <span>{{ skuImgList.length }}种</span>
        <span>
          可选
        </span>
      </div>
      <div class="img-box-contaier">
        <div
          v-for="(item, index) in skuImgList"
          :key="index"
          :class="['level_menu', sku && sku.skuId === item.skuId ? 'ui-active' : '']"
          @click="pitchOnFun(item, index)"
        >
          <img :src="item.url" alt="" v-if="item.url" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ImagePreview } from 'vant'
  export default {
    components: {
      [ImagePreview.name]: ImagePreview,
    },
    data() {
      return {
        property: 'value',
        current: 0, // 自定义指示器
        controlsShow: false, //视频控制器
        isPlayer: false,
      }
    },
    props: {
      skuImgList: {
        type: Array,
        default: () => [],
      },
      carouselPics: {
        type: Array,
        default: () => [],
      },
      spu: {
        type: Object,
        default: () => {},
      },
      sku: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      // 点击sku小图切换sku
      pitchOnFun(item) {
        this.$emit('updateSku', item.skuId)
      },
      openImg() {
        let imgList = this.carouselPics.map((item) => {
          return item.img
        })
        ImagePreview({
          images: imgList,
          closeable: true,
        })
      },
      onChange(index) {
        this.current = index
        if (index == 0) {
          this.controlsShow = false
          this.isPlayer = true
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/components/spus/imgUi.less';
  @import '~@/assets/css/spudetail.less';
</style>
