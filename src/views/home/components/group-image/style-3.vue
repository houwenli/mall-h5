<template>
  <div class="columns-container" data-desc='三列图'>
    <div class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" >
		<img v-if="item.url" class="pic" :src="item.url" alt="" />
		<img class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png" />
    </div>
  </div>
</template>

<script>
import { toPage } from './data.js'

// 3列图
export default {
  name: 'style-3',
  props: {
    config: {
      type: Object,
      default: () => { }
    }
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
    height: 100%;
    
    overflow: hidden;
    margin-right: 11px;

    &:last-child {
      margin-right: 0;
    }
    .pic {
      	width: 100%;		
		height: 102px;
		border: none;
		border-radius: 12px;
    }

    img[src=''] {
      opacity: 0;
    }
  }
}
</style>
