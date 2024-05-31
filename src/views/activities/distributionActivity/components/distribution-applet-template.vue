<template>
  <div>
    <div class="list-group-item" v-for="element in contentList" :key="element.id">
      <!-- 金刚区 -->
      <template v-if="element.text === '金刚区'">
        <pageNav :config="element" />
      </template>

      <template v-if="element.text === '轮播图'">
        <swipe :config="element"></swipe>
      </template>

      <template v-else-if="element.text === '半屏双列图'">
        <group2Image :config="element" />
      </template>

      <!-- 1-4列图 -->
      <template v-else-if="showGroupImageComponent(element)">
        <groupImage2 :config="element"></groupImage2>
      </template>

      <template v-else-if="element.text === '滑动区块'">
        <slideModule :config="element" />
      </template>
      <template v-else-if="element.text === '图片魔方'">
        <cubeImage :config="element" />
      </template>
      <template v-else-if="element.text === '秒杀'">
        <seckill :listData="element.list"></seckill>
      </template>
      <template v-else-if="element.text === '分销'">
        <distribution :listData="element.list"></distribution>
      </template>
      <template v-else-if="element.text === '公告'">
        <notice-bar :listData="element"></notice-bar>
      </template>
      <template v-else-if="element.text === '辅助空白'">
        <blank :listData="element"></blank>
      </template>
    </div>
  </div>
</template>
<script>
  import pageNav from '@/views/home/components/pageNav/index.vue'
  import swipe from '@/components/index/template/swipe/index.vue'
  import group2Image from '@/views/home/components/group-2-image/index.vue'
  import slideModule from '@/components/index/template/SlideModule/index.vue'
  import cubeImage from '@/views/home/components/cube-image/index.vue'
  import seckill from '@/components/index/template/seckill/index.vue'
  import distribution from '@/components/index/template/distribution/index.vue'
  import noticeBar from '@/components/index/template/noticeBar/index.vue'
  import blank from '@/components/index/template/blank/index.vue'
  import groupImage2 from '@/views/home/components/group-image/index.vue'
  export default {
    props: {
      contentList: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    components: {
      pageNav,
      swipe,
      group2Image,
      slideModule,
      cubeImage,
      seckill,
      distribution,
      noticeBar,
      blank,
      groupImage2
      // pageNav: (resolve) => require(['@/views/home/components/pageNav/index.vue'], resolve),
      // swipe: (resolve) => require(['@/components/index/template/swipe/index.vue'], resolve),
      // group2Image: (resolve) => require(['@/views/home/components/group-2-image/index.vue'], resolve),
      // slideModule: (resolve) => require(['@/components/index/template/SlideModule/index.vue'], resolve),
      // cubeImage: (resolve) => require(['@/views/home/components/cube-image/index.vue'], resolve),
      // seckill: (resolve) => require(['@/components/index/template/seckill/index.vue'], resolve),
      // distribution: (resolve) => require(['@/components/index/template/distribution/index.vue'], resolve),
      // noticeBar: (resolve) => require(['@/components/index/template/noticeBar/index.vue'], resolve),
      // blank: (resolve) => require(['@/components/index/template/blank/index.vue'], resolve),
      // groupImage2: (resolve) => require(['@/views/home/components/group-image/index.vue'], resolve)
    },

    methods: {
      showGroupImageComponent(item) {
        return ['单列图', '双列图', '三列图', '四列图'].includes(item.text)
      },
    },
  }
</script>
<style lang="less" scoped>
.list-group-item {
  padding-top: 10px;
  width: 100vw;
  overflow: hidden;
}
</style>
