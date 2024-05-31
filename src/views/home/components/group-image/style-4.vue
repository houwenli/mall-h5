<template>
  <div class="columns-container" data-desc='四列图'>
    <!-- :style="getStyle" -->
    <div class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" >
      <img v-if="item.url" class="pic" :src="item.url" alt="" />
      <img class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
    </div>
  </div>
</template>

<script>
import { toPage } from './data.js'

// 4列图
export default {
  name: 'style-4',
  props: {
    config: {
      type: Object,
      default: () => { },
    },
  },
  computed: {
    getStyle () {
      if (String(this.config.hasBackground) === '0' && String(this.config.showComTitle) === '0') {
        return {
          width: '80px',
          height: '80px',
        }
      }

      return {}
    },
  },
  methods: {
    toPage
  }
}
</script>

<style lang="less" scoped>
.columns-container {
  display: flex;

  .item {
    flex: 1;
    width: 100%;
    // width: 74px;
    // height: 74px;
    border-radius: 12px;
    overflow: hidden;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }

    .pic {
      width: 100%;
      height: 100%;
      border: none;
    }

    img[src=''] {
      opacity: 0;
    }
  }
}
</style>
