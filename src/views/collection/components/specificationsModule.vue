<template>
  <div class="tab-details" ref="detailBox" v-if="spu.spuAttributeList && spu.spuAttributeList.length > 0">
    <div class="tab-details-contaier">
      <img src="@/assets/img/goodsDetail/spu.png" alt="" />
      <span>商品规格</span>
    </div>
    <div class="clearfix" style="margin-bottom: 3px">
      <table class="table-border" width="100%">
        <tbody>
          <tr v-for="(attribute, index) in showup ? spu.spuAttributeList : spu.spuAttributeList.slice(0, 7)" :key="index">
            <td>
              <span style="color: #999;font-size:11px; transform: scale(0.91);">
                {{ attribute.attributeName }}
              </span>
            </td>
            <td>
              <span style="color: #999;font-size:11px; transform: scale(0.91);">{{ attribute.attributeValue }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="spu.spuAttributeList.length > 7" class="activity-desc-tab-btn tab-details-rule" @click="showdown">
        <img :src="showup ? require('@/assets/img/goodsDetail/up_arrow.png') : require('@/assets/img/goodsDetail/down_arrow.png')" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showup: false, // 显示商品规格展开、收起
        downOrup: '展开', // 展开收起
      }
    },
    props: {
      spu: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      // 展开收起商品规格
      showdown() {
        this.showup = !this.showup
        if (this.showup) {
          this.downOrup = '收起'
        } else {
          this.downOrup = '展开'
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
</style>
