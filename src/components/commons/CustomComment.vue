<template>
  <div class="custom-comment" v-if="commentData.length > 0" :style="paddingStyle || defaultPaddingStyle">
    <div class="comment-region">
      <div v-for="(item, idx) in commentData" :key="idx" class="comment-item">
        <p style="margin-bottom: 0.2rem" class="title">商家回复：</p>
        <span style="color: #666666" :class="['conent', keys=='detail'?'line-camp' : '']">{{ item.reply }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'custom-comment',
  props: {
    commentData: {
      type: Array,
      default: () => [],
    },
    paddingStyle: {
      type: Object,
      default: () => {},
    },
    keys: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      // 图片列 默认宽高
      defaultPaddingStyle: {
        padding: '0 12px 14px',
        fontSize: '0.52rem',
      },
    }
  },
}
</script>
<style lang="less" scoped>
.custom-comment {
  padding: 0 12px 14px;
  font-size: 0.52rem;
  // line-height: 0.88rem;
  .comment-region {  
    padding: 6px 8px;
    word-break: break-all;
    border-radius: 0.4rem;
    background: #F6F6F6;
    opacity: 0.5;
    .comment-item {
      padding-bottom: 6px;
      .title {
        margin-bottom: 4px;
        font-size: 13px;        
        color: #999999;
        opacity: 1;
      }
      .conent {
        font-size: 13px;
        color: #6E6E6E;     
        width: 100%;   
        opacity: 1;   
      }
      .line-camp{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        opacity: 1;
      }
    }
    .comment-item:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
