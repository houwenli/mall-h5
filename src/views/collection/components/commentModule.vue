<template>
  <div ref="commentBox">
    <group class="commenbox">
      <cell title="" :value="'暂时还没有评价哦~'" value-align="left" v-if="commentTotal <= 0" class="noneComment"></cell>
      <div v-else class="coment-answer">
        <section>
          <div class="coment-answer-left">
            <span>评价</span>
            <span>({{ commentTotal | filterComment }})</span>
          </div>
          <div
            class="coment-answer-right"
            v-if="
              !((commentList.length == 1 && commentList[0].score < 5) || commentList.length == 0) &&
                !(commentList.length == 2 && commentList[0].score < 5 && commentList[1].score < 5)
            "
          >
            <span>好评度{{ goodRate }}%</span>
          </div>
        </section>
      </div>

      <div class="assess-wrapper" v-if="commentTotal > 0" @click="toMoreComments">
        <group :class="['friends-item', commentTotal > 2 ? 'friends-item-line' : '']" v-for="(item, index) in commentList" :key="index">
          <cell class="pl_header">
            <div slot="title" class="header">
              <img v-if="item.customerImage" :src="item.customerImage" class="pl_headerimg" alt />
              <img src="@/assets/img/Avatar_default.png" alt v-else class="pl_headerimg" />

              <section>
                <main>
                  <div class="username" v-if="item.isAnonymous == 0">
                    <span v-if="item.relename">
                      {{
                        item.relename.length > 1
                          ? item.relename.charAt(0) + '****' + item.relename.charAt(item.relename.length - 1)
                          : item.relename.charAt(0) + '****'
                      }}
                    </span>
                    <span v-else>
                      {{
                        item.customerName.length > 1
                          ? item.customerName.charAt(0) + '****' + item.customerName.charAt(item.customerName.length - 1)
                          : item.customerName.charAt(0) + '****'
                      }}
                    </span>
                  </div>
                  <div class="username" v-else>
                    <span v-if="item.relename">
                      {{ '*****' + item.relename.charAt(item.relename.length - 1) }}
                    </span>
                    <span v-else>
                      {{ '*****' + item.customerName.charAt(item.customerName.length - 1) }}
                    </span>
                  </div>
                  <div class="ping-list">
                    <img :src="item.score >= '1' ? require('@/assets/img/goodsDetail/ping_1.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="" />
                    <img :src="item.score >= '2' ? require('@/assets/img/goodsDetail/ping_2.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="" />
                    <img :src="item.score >= '3' ? require('@/assets/img/goodsDetail/ping_3.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="" />
                    <img :src="item.score >= '4' ? require('@/assets/img/goodsDetail/ping_4.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="" />
                    <img :src="item.score >= '5' ? require('@/assets/img/goodsDetail/ping_5.png') : require('@/assets/img/goodsDetail/ping_gray.png')" alt="" />
                  </div>
                </main>
                <span class="pl_header_footer">{{ item.createTime.split(' ')[0] }}</span>
              </section>
            </div>
          </cell>
          <cell :title="item.comment" class="commentContent" @click.native="toMoreComments"></cell>

          <div class="sku_sx">{{ item.skuSpecName }}</div>

          <div class="commentList-img" v-if="item.commentPics.length > 0">
            <div class="previewerImg" v-for="(element, imgIndex) in item.commentPics" :key="imgIndex">
              <img v-if="element.url" :src="element.url" @click.stop="showImg(item.commentPics, imgIndex)" />
            </div>
          </div>

          <custom-comment :commentData="item.commentReplies" :paddingStyle="{ padding: '0' }" :keys="'detail'"></custom-comment>
        </group>
      </div>

      <div class="coment-answer-btn" v-if="commentTotal > 2" @click="toMoreComments">
        查看全部评价
      </div>
    </group>
  </div>
</template>

<script>
  import { Badge, Cell, Clocker, Divider, Group, InlineXNumber, LoadMore, PopupPicker, Previewer, Swiper, SwiperItem, Tab, TabItem } from 'vux'

  export default {
    components: {
      Group,
      Cell,
      Badge,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Divider,
      InlineXNumber,
      Previewer,
      PopupPicker,
      LoadMore,
      Clocker,
    },
    data() {
      return {
        property: 'value',
      }
    },
    props: {
      skuId: {
        type: String,
        default: '',
      },
      spuId: {
        type: String,
        default: '',
      },
      // 评论数量
      commentTotal: {
        type: Number,
        default: 0,
      },
      // 好评率
      goodRate: {
        type: [String, Number],
        default: 0,
      },
      commentList: {
        type: Array,
        default: () => [],
      },
    },
    filters: {
      filterComment(val, make) {
        console.log(val, make, 'val, make')
        if (val <= 100) {
          return val + '条'
        } else if (val > 100 && val < 999) {
          let baiwei = parseInt(val / 100)
          return baiwei + '00+条'
        } else {
          return '999+条'
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
</style>
