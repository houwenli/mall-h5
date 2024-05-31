<template>
  <div class="page-container">
    <header v-if="isWeChat" class="fixed-header">
      <div class="back" @click="$router.push({ path: '/' })"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">年货节</div>
      <div class="more"></div>
    </header>
    <!-- 海报 -->
    <img class="poster" :style="{'marginTop': isWeChat ? '44px' : '0'}" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/new-year-kv.png" />
    <div class="goods-container-panel">
      <goodsPanel type="1" :list="goodsList[1]"></goodsPanel>
      <goodsPanel type="2" :list="goodsList[2]"></goodsPanel>
      <goodsPanel type="3" :list="goodsList[3]"></goodsPanel>
    </div>
  </div>
</template>

<script>
import goodsPanel from './goods-panel.vue'
import { goodsList } from './data.js'
import { bargainVisit } from '@/api/visit.js'

export default {
  name: 'newYearShoppingFestival',
  components: {
    goodsPanel
  },
  data () {
    return {
      hasData: false,
      goodsList: goodsList,
      isWeChat: false
    }
  },
  created () {
    this.isWeChat = window.__wxjs_environment !== 'miniprogram'
    bargainVisit({
      // 页面埋点
      isBargain: 1
    }).then(res => { }).catch(e => { })
    if(window.__wxjs_environment === 'miniprogram'){
      const secScript = document.createElement("script");
      secScript.setAttribute("type", "text/javascript");
      secScript.setAttribute("src", "https://res.wx.qq.com/open/js/jweixin-1.3.2.js");
      document.body.append(secScript);
    }
  }
}
</script>

<style lang="less" scoped>
.fixed-header {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .back {
    margin-left: 12px;

    img {
      width: 24px;
    }
  }

  .title {
    text-align: center;
    color: #000;
    font-size: 18px;
    line-height: 44px;
  }

  .more {
    width: 28px;
    height: 20px;
    line-height: 20px;
    margin-right: 20px;
    color: #333;
    font-size: 14px;
  }
}
.page-container {
  background: rgb(206, 69, 44);
  overflow-y: auto;
}
.poster {
  width: 100%;
  height: 600px;
  display: block;
  margin: 0;
}

.goods-container-panel {
  margin-top: -30px;
}
</style>
