<template>
  <!-- 商品介绍 -->
  <div class="tab-details tab-introduce" v-if="spu.detail || spu.video || (spu.mobileImageUrlList && spu.mobileImageUrlList.length > 0)">
    <div class="tab-details-contaier tab-details-contaier-introduce">
      <img src="@/assets/img/goodsDetail/introduce.png" alt="" />
      <span>商品介绍</span>
    </div>

    <div
      :class="['clearfix', 'tab-introduce-contaier']"
      :style="trueImgHeight >= 500 ? 'height: 500px;overflow: hidden;' : 'height: auto;'"
      ref="imgHeight"
      id="imgHeight"
    >
      <!-- 新详情 -->
      <div v-if="spu.detail">
        <video
          controls
          v-if="spu.video"
          style="width: 100%; height: 9rem; object-fit: fill"
          :src="spu.video"
          :poster="spu.videoPic"
          webkit-playsinline="true"
          x-webkit-airplay="true"
          playsinline="true"
          x5-video-player-type="h5"
          x5-video-orientation="h5"
          x5-video-player-fullscreen="true"
          preload="auto"
        ></video>
        <div v-html="spu.detail" class="richText"></div>
      </div>
      <!-- 旧详情 -->
      <div v-else>
        <video
          controls
          v-if="spu.video"
          style="width: 100%; height: 9rem; object-fit: fill"
          :src="spu.video"
          :poster="spu.videoPic"
          webkit-playsinline="true"
          x-webkit-airplay="true"
          playsinline="true"
          x5-video-player-type="h5"
          x5-video-orientation="h5"
          x5-video-player-fullscreen="true"
          preload="auto"
        ></video>
        <span class="spu-desc" v-html="spu.mobileDesc" v-if="spu.detailIsNew == 0"></span>
        <div class="tab-introduce-contaier">
          <template v-for="(item, index) in spu.mobileImageUrlList">
            <img :src="item" alt="" :key="index" width="100%" />
          </template>
        </div>
      </div>
    </div>
    <div class="tab-introduce-contaier-box" v-if="firstImgHeight > 500">
      <div class="activity-desc-btn" @click="handleImgUnFold">
        <img :src="trueImgHeight >= 500 ? require('@/assets/img/goodsDetail/down_arrow.png') : require('@/assets/img/goodsDetail/up_arrow.png')" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        trueImgHeight: 0, // 详情图片区域高度
        firstImgHeight: 0, // 详情图片区域是否折叠
      }
    },
    props: {
      spu: {
        type: Object,
        default: () => {},
      },
    },
    mounted() {
      if (this.spu.video || (this.spu.mobileImageUrlList && this.spu.mobileImageUrlList.length > 0) || this.spu.detail) {
        this.$nextTick(() => {
          setTimeout(() => {
            let height = 0
            height = this.$refs.imgHeight.offsetHeight
            this.firstImgHeight = this.trueImgHeight = height
          }, 500)
        })
      }
    },
    methods: {
      handleImgUnFold() {
        this.trueImgHeight = this.trueImgHeight >= 500 ? '0' : 500
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
  @import '~@/components/spus/imgUi.less';
</style>
