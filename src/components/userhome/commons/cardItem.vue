<template>
  <div v-if="item" class="shop-card">
    <div @click.stop="goSkuDetail()" v-if="data">
      <!-- 商品主图 -->
      <div class="shop-img" ref="shopImg">
        <img v-if="isUrl" :src="data.baseLabel.url" alt="" style="height: 100%; width: 100%;object-fit: cover" />
        <img
          v-else
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAAFWBAMAAADAgaiwAAAAFVBMVEX7+/vt7e3w8PD19fXz8/P5+fn39/ejJ1KzAAADyElEQVR42u3dT3PSQBiA8Xe0m/sm2LNE8Iyu5dy0qedQCGcQ4ft/BHezZSWmUqrTLMw8v5mi1Dg8De/mz/SAGGO2tZy7emk7xabKJVi61qlcho1tXcllSIxcym4V2ciNXIq5XMoIiCRSyaVQtL4JJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOXl3Xlf9jXh5y31Q/VyLL3aGtvL2hfk4qiX2c2KrOv9vKeaHHImt9aCAdPbXqptXk+cMzre992qz31uLIfv2q9fUzrQttVfLYe+v69a2JtiZy1Xvr7NWtS+O+l5lvvbe+e3XrWgc9t1693Jq2W2f7bb7mBx7k7b0/obW2tJXVVvW436a1g8fy9pITWufGD2dmjLmReK1iHFtlpWZv2mot9G+ZLCK0do9cHyQ4bB20W68it/rVPjmpNWm1fjKm6LE1LLBy7/5Yq9qYL9oaNK23IrM+W7snhKrTengcVX5PNq2jsux3vw5f17rw20SZ10S/3Jo7vlUVPjpK6+MJrfVut6tdYth8EqW1OKHVLafrpjUZPk1DjNZEn9DqvjJXqELiMELr48utPmzgvhZ6LzUHppX0odAdzx9fUx2edKQ9tIYRyL3hkVZnMIzZ6kcgOzwtpEda1zFbv2jn42Hr4EjrImKr2q8mb/1Ca6a0NwqPg2Ffre98QmuhZcdaC39TM25mx7hLraKP1u4IKNtmC4+0ykx/b/7HY28z0B0BVTpPF93H7gsGy0itV37FtE9fH3+36u716zaJ1LoOZ0ilg9vQmv259G9EJFKrn0+9al/FTlqtWaGdjXYGVau17O04EEYgrDKv2rf602o4ADirVuu9/1l6aQ0j4P/upeJ7jL+8/vA0F01cGmEGuiPQtLRW2sT3j780773f+Dpa6/vQZoUldB1alcucuKqHpx/mNlrrzB9OQ7g3Dq3NTUCV+CUlqrBJ0VoXpbOShiq9u4l7Yu+v3MvP9cA2pn6Tuc4ktC7arefwcbCLzyKzB/F+jMVSG2PM6kw/DzaEXNCH6f6dqqTrLF9ludv205ps/uuF1PJbOa2kJ2pTltP6X0PzkS3t0/wuHd3vXtdbL83dUI9upHf1z1yneWm2pwTX9eabuzvP77cSh30/tbbBo/vp1v+Su0PVy40pbaaV2tCYmrfVcsl5WZbG2RjHPstdpDeyofG5dZ3rI9xkn9Mpod6Z8s7txcBPR2l2tZwnVe8sM3WP9blGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAi/ULMvopqX0wGS4AAAAASUVORK5CYII="
          alt=""
          style="height: 100%; width: 100%; object-fit: cover"
        />
      </div>
      <!-- 内容 -->
      <div class="shop-info">
        <!-- 商品名称 -->
        <div class="shop-info-name">{{ data.baseLabel.name }}</div>
        <div class="flexLay">
          <!-- 商品价格 -->
          <div class="shop-info-price" v-if="isLinePice">
            <span class="unit">¥</span>
            <span class="intPice">{{setPrice(data.baseLabel.price)[0]}}</span>
            <span class="decimal">.{{setPrice(data.baseLabel.price)[1]}}</span>
          </div>
          <!-- 商品勾选框 -->
          <div class="shop-info-select" @click.stop="clickSku()" v-show="!isEdit">
            <i :class="selectList.includes(item.id) ? 'icon_select_ok' : 'icon_select_out'" ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatPrice } from '@/utils/utils'
  export default {
    name: 'cardItem',
    components: {},
    inject: ['selectList'],
    props: {
      item: {
        type: Object,
        default: () => {},
      },
      isEdit: {
        type: Boolean,
        default: () => false,
      },
    },
    data() {
      return {
        formatPrice,
        data: this.item.skuLable,
        result: [],
        isKey: true,
      }
    },
    computed: {
      // 万顺售价
      isLinePice() {
        return this.data.baseLabel && this.data.baseLabel.price
      },
      // 主图
      isUrl() {
        return this.data.baseLabel && this.data.baseLabel.url
      },
      isSelect(item) {
        return this.selectList.includes(item.id);
      },
    },
    filters: {},
    methods: {
      // 选择
      clickSku() {
        // 勾选变化
        this.$emit('clickSku', this.item)
      },
      //详情
      goSkuDetail() {
         this.$emit('goSkuDetail', this.item)
      },
      // 价格展示处理
      setPrice(val) {
        return this.formatPrice(val).split('.')
      },
    },
  }
</script>
<style lang="less" scoped>
  .flexLay {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .shop-card {
    width: 100%;
    margin-top: 10px;
    border-radius: 12px;
    background-color: #fff;
    .shop-img {
      width: 100%;
      height: 170px;
      img {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        height: 100%;
        width: 100%;
      }
    }
    .shop-info {
      padding: 6px 8px 10px;
      // 商品名称
      .shop-info-name {
        color: #191919;
        font-size: 13px;
        font-weight: 500;
        /* 超出两行隐藏 */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .shop-info-price {
        margin-top: 6px;
        color: #ff0a35;
        font-weight: bold;
        font-family: 'AlternateBold';
        .unit {
          font-size: 11px;
          line-height: 15px;
        }
        .intPice {
          font-size: 20px;
           line-height: 24px;
        }
        .decimal {
          font-size: 11px;
          line-height: 15px;
        }
      }
      .shop-info-select {
        position: relative;
        margin-top: 6px;
        width: 16px;
        height: 16px;
        .icon_select_ok::after,
        .icon_select_out::after {
          position: absolute;
          top: 0;
          content: '';
          display: block;
          width: 16px;
          height: 16px;
        }
        //勾选
        .icon_select_ok::after {
          background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png");
          background-size: 16px;
          background-repeat: no-repeat;
        }
        // 未勾选
        .icon_select_out::after {
          background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/browse-records/no.png');
          background-size: 16px;
          background-repeat: no-repeat;
        }
      }
    }
  }
</style>
