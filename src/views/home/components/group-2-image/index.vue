<template>
  <div class="container">
    <div v-if="config.hasBackground === '1'" class="group-panel" :style="getBackground('left')">
      <!-- 标题 -->
      <div v-if="config.hasBackground === '1' && config.showComTitle === '1'" class="title">{{ config.leftTitle }}</div>
      <div class="pic-list">
        <div v-for="(item, index) in leftList" :key="index" class="item" :style="getStyle()" @click="toPage(item)">
          <img v-if="item.url" class="pic" :src="item.url" />
          <img
            v-else
            class="pic"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
          />
        </div>
      </div>
    </div>
    <div v-if="config.hasBackground === '1'" class="group-panel" :style="getBackground('right')">
      <!-- 标题 -->
      <div v-if="config.hasBackground === '1' && config.showComTitle === '1'" class="title">
        {{ config.rightTitle }}
      </div>
      <div class="pic-list">
        <div v-for="(item, index) in rightList" :key="index" class="item" :style="getStyle()" @click="toPage(item)">
          <img v-if="item.url" class="pic" :src="item.url" />
          <img
            v-else
            class="pic"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
          />
        </div>
      </div>
    </div>
    <div v-if="config.hasBackground === '0'" class="flex-center">
      <div v-for="(item, index) in config.list" :key="index" class="item" :style="getStyle()" @click="toPage(item)">
        <img v-if="item.url" class="pic" :src="item.url" />
        <img
          v-else
          class="pic"
          src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { toPage } from './data.js'
  // 半屏双列图
  export default {
    name: 'group-2-image',
    props: {
      config: {
        type: Object,
        default: () => {},
      },
    },
    computed: {
      leftList() {
        return this.config.list.filter((item, index) => index < 2)
      },
      rightList() {
        return this.config.list.filter((item, index) => index > 1)
      }
    },
    methods: {
      toPage,
      getStyle() {
      if (String(this.config.hasBackground) === '0' && String(this.config.showComTitle) === '0') {
        return {
          width: '80px',
          height: '80px'
        }
      }
      return {}
    },
    getBackground(type) {
      let styles = {}
      // 没有背景
      if (String(this.config.hasBackground) === '0') {
        return {
          padding: '0px',
          height: 'auto'
        }
      }

      // 有背景 判断是背景图片还是背景颜色
      if (String(this.config.backgroundType) === '0') {
        let background = type === 'left' ? 'leftBgColor' : 'rightBgColor'

        styles.background = this.config[background] || '#FFF'
      } else {
        let img = type === 'left' ? 'leftBgImage' : 'rightBgImage'
        styles.backgroundImage = `url(${this.config[img]})`
        styles.backgroundRepeat = 'no-repeat'
        styles.backgroundSize = '100% 100%'
      }

      return styles
    }
    },
  }
</script>

<style lang="less" scoped>
  .container {
  display: flex;
  justify-content: space-between;
  margin: 0 12px;
  .title {
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
    margin-bottom: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .item {
    width: 74px;
    height: 74px;
    border-radius: 12px;
    overflow: hidden;

    .pic {
      width: 100%;
      height: 100%;
    }
  }
  .group-panel {
    border-radius: 16px;
    width: 170px;
    height: 122px;
    padding: 12px 8px 8px 8px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .pic-list {
      display: flex;
      justify-content: space-between;
    }
  }
  .flex-center{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>