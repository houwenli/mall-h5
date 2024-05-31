<template>
  <div>
    <!-- 商品介绍 -->
    <div class="tab-details tab-introduce" v-if="spu.detail || spu.video || (spu.mobileImageUrlList && spu.mobileImageUrlList.length > 0)">
        <div class="tab-details-contaier tab-details-contaier-introduce">
            <img src="@/assets/img/goodsDetail/introduce.png" alt="">
            <span>商品介绍</span>
        </div>      
        <div :class="['clearfix', 'tab-introduce-contaier', ]" ref="imgHeight" id="imgHeight">
          <!-- 新详情 -->
          <div v-if="spu.detail" >
            <video controls v-if="spu.video" style="width: 100%; height: 9rem; object-fit: fill" :src="spu.video" :poster="spu.videoPic" webkit-playsinline="true" x-webkit-airplay="true" playsinline="true" x5-video-player-type="h5" x5-video-orientation="h5" x5-video-player-fullscreen="true" preload="auto"></video>
            <div v-html="spu.detail" class="richText"></div>
          </div>
          <!-- 旧详情 -->
          <div v-else>
            <video controls v-if="spu.video" style="width: 100%; height: 9rem; object-fit: fill" :src="spu.video" :poster="spu.videoPic" webkit-playsinline="true" x-webkit-airplay="true" playsinline="true" x5-video-player-type="h5" x5-video-orientation="h5" x5-video-player-fullscreen="true" preload="auto"></video>
            <span class="spu-desc" v-html="spu.mobileDesc" v-if="spu.detailIsNew == 0"></span>
            <div class="tab-introduce-contaier">
                <img v-for="(item, index) in spu.mobileImageUrlList" :src="item" alt="" :key="index" width="100%" />
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
    }
}
</script>
<style lang="less" scoped>
.tab-details {
  padding: 14px 12px 4px;
  margin: 0;
  margin-bottom: 14px;
  .tab-details-contaier {
    font-weight: 400;
    color: #191919;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    height: 17px;
    box-sizing: border-box;

    img {
      margin-top: 0.5px;
      width: 16px;
      height: 16px;
      height: 100%;
      // vertical-align: middle;
    }
    span {
      height: 17px;
      font-size: 13px;
      line-height: 1;
      margin-top: 5px;
      margin-left: 4px;
    }
  }
  .tab-details-contaier-introduce {
    margin-bottom: 10px;
  }
  .xq_title {
    height: 0.96rem;
    line-height: 0.96rem;

    .xq {
      width: 0.12rem;
      height: 0.56rem;
      margin-top: 0.2rem;
      margin-right: 0.12rem;
      background-color: #e60113;
      border-radius: 0.08rem;
      display: inline-block;
    }

    font-size: 0.6rem;
    font-weight: bold;
    color: #000;
  }

  .xq_spjs {
    font-size: 0.56rem;
    color: #666;
    height: 1.4rem;
    line-height: 1.4rem;
  }
}
.tab-introduce {
  padding: 14px 4px 4px;
  .tab-details-contaier {
    margin-left: 8px;
  }
  .tab-introduce-contaier {
    border-radius: 8px;
    video {
      border-radius: 8px;
    }
  }
  .tab-introduce-contaier-hide {
    overflow: hidden;
    height: 500px;
  }
}

.activity-desc-btn-contaier,
.tab-introduce-contaier-box {
  background: rgba(246, 246, 246, 0.5);
  padding: 8px 0;
  // margin-top: -2px;
  .activity-desc-btn {
    margin: 0 auto;
    width: 61px;
    height: 16px;
    border-radius: 8px;
    border: 0.5px solid #979797;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
.tab-introduce-contaier-box {
  padding: 12px 0 10px;
  background: #fff;
}
.richText {
    padding: 0px 8px 0px;
    /deep/ img {
        max-width: 100%;
    }
    /deep/ table {
        border-bottom: solid 1px #000;
        border-left: solid 1px #000;
        min-width: 100%;
        td {
            border-top: solid 1px #000;
            border-right: solid 1px #000;
        }
    }
    /deep/ em {
        font-style: italic;
    }
    /deep/ ol {
        li {
            list-style-type: decimal;
            list-style-position: inside;
        }
    }
    /deep/ ul {
          list-style-type: disc;
        li {
          list-style-type: inherit;
          list-style-position: inside;
        }
    }
    /deep/ blockquote {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 40px;
        margin-inline-end: 40px;
    }
    /deep/ video{
      max-width: 100%;
    }
}
</style>

