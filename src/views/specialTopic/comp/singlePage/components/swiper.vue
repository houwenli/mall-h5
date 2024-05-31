<template>
  <van-swipe width="100%" class="my-swipe" indicator-color="white" @change="onChange" :autoplay="autoplay">
    <van-swipe-item v-for="(img, index) in carouselPics" :key="index">
      <img
        src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2c523a830be84b6436fa80fffc125a16.png"
        v-if="current == 0 && video && isPlayer"
        @click="playVideo()"
        alt=""
        class="iconPlay"
      />
      <video
        ref="bannerVideo"
        :controls="controlsShow"
        style="object-fit: unset"
        :src="video"
        :poster="videoPic"
        webkit-playsinline="true"
        x-webkit-airplay="true"
        playsinline="true"
        x5-video-player-type="h5"
        x5-video-orientation="h5"
        x5-video-player-fullscreen="true"
        preload="none"
        class="bannerVideo"
        v-if="index == 0 && video"
        @ended="endVideo()"
        id="videoBanner"
        :key="videoKey"
      ></video>

      <img :src="img" alt="" @click="openImg(index)" />
    </van-swipe-item>

    <template #indicator>
      <div class="custom-indicator" v-if="carouselPics.length > 1">
        <span>{{ current + 1 }}/{{ carouselPics.length }}</span>
      </div>
    </template>
  </van-swipe>
</template>
<script>
  import { ImagePreview } from 'vant'
  export default {
    props: {
      carouselPics: {
        type: Array,
        default: () => {
          return []
        },
      },
      video: {
        type: String,
        default: '',
      },
      videoPic: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isPlayer: true,
        controlsShow: false, // 视频控制器
        videoKey: Date.now(),
        current: 0,
        autoplay: 3000,
      }
    },
    methods: {
      onChange(index) {
        this.current = index
        if (index != 0 && this.controlsShow) {
          this.endVideo()
        }
      },

      // 开始播放
      playVideo() {
        this.$refs.bannerVideo[0].play()
        this.controlsShow = true
        this.isPlayer = false
        this.autoplay = 0
      },

      endVideo() {
        this.isPlayer = true
        this.controlsShow = false
        this.autoplay = 3000
      },

      openImg(index) {
        let imgList = this.carouselPics.map((item) => {
          return item
        })
        ImagePreview({
          startPosition: index,
          images: imgList,
          closeable: true,
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .my-swipe {
    flex: 1;
    position: relative;
  }
  .custom-indicator {
    position: absolute;
    width: 33px;
    height: 20px;
    right: 12px;
    top: 12px;
    text-align: center;

    background: rgba(25, 25, 25, 0.8);
    border-radius: 12px;
    span {
      display: block;
      font-size: 12px;
      height: 12px;
      line-height: 12px;
      margin-top: 4px;
      color: #fff;
    }
  }
  .van-swipe-item {
    // height: calc(~'100% - 92px');
    height: 100%;
    img {
      height: 100%;
      width: 100%;
    }
    .iconPlay {
      position: absolute;
      width: 2.4rem;
      height: 2.4rem;
      z-index: 2;
      top: 50%;
      left: 50%;
      margin-left: -1.2rem;
      margin-top: -1.2rem;
    }
  }
  .bannerVideo {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
