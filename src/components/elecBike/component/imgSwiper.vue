<template>
    <div>
        <van-swipe class="my-swipe" indicator-color="white" @change="onChange" loop style="height:375px;">
            <van-swipe-item v-for="(item, index) in carouselPics" :key="index">
                <!-- <img src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2c523a830be84b6436fa80fffc125a16.png" v-if="current == 0 && spu.spuVideo && isPlayer" @click="playVideo()" alt="" class="iconPlay" />
                <video :controls="controlsShow" style="object-fit: unset" :src="spu.spuVideo" :poster="spuVideoPic" webkit-playsinline="true" x-webkit-airplay="true" playsinline="true" x5-video-player-type="h5" x5-video-orientation="h5" x5-video-player-fullscreen="true" preload="none" class="bannerVideo" v-if="current == 0 && spu.spuVideo" @ended="endVideo()" id="videoBanner" :key="videoKey">
                </video> -->
                <img :src="item.img" alt="" @click="openImg()" style="width:100%;height:375px" />
            </van-swipe-item>

            <template #indicator>
                <div class="custom-indicator">
                    <span>{{ current + 1 }}/{{ carouselPics.length }}</span>
                </div>
            </template>
        </van-swipe>
    </div>
</template>
<script>
import { ImagePreview } from 'vant'
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        },
        carouselPics: {
            type: Array,
            default: () => []
        },
        spuVideoPic:{
            type: String,
             default: () => ''
        }
    },
    components: {
        [ImagePreview.name]: ImagePreview,
    },
    watch:{
        spu: {
            handler() {
              this.current=0
              this.videoKey = Date.now()
            },
            immediate: true,
        },
    },
    data() {
        return {
            videoKey: Date.now(),
            current: 0, // 自定义指示器
            controlsShow: false, // 视频控制器
            isPlayer: true,
        }
    },
    methods: {
        onChange(index) {
            this.current = index
            if (index == 0) {
                this.controlsShow = false
                this.isPlayer = true
            }
        },
        playVideo() {
            document.getElementById('videoBanner').play()
            this.controlsShow = true
            this.isPlayer = false
        },
        // 播放结束
        endVideo() {
            this.controlsShow = true
        },
        openImg() {
            let imgList = this.carouselPics.map(item => {
                return item.img
            })
            ImagePreview({
                images: imgList,
                closeable: true
            });
        }
    }
}
</script>

<style lang="less" scoped>
.custom-indicator {
  position: absolute;
  width: 33px;
  height: 20px;
  right: 12px;
  bottom: 12px;
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
    position: relative;
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
    // position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    // left: 50%;
    // transform: translateX(-50%);
  }
</style>