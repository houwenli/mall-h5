<template>
  <div>
    <div v-if="listData.showComTitle == 1 && list.length > 0" class="com-title">
      {{ listData.comTitle }}
    </div>
    <van-list ref="vanList" v-model="loading" :finished="finished" class="list-box" @load="onLoad">
      <waterfall v-if="listData.text === '双列商品'" :data="list" :isbot="false"></waterfall>
      <three-colun v-else-if="listData.text === '三列商品'" :list="list"></three-colun>
      <template v-else>
        <component v-for="item in list" :key="item.id" :is="componentNmae" :item="item"></component>
      </template>
    </van-list>
  </div>
</template>

<script>
  import { getRecommendList } from '@/api/home' //分页查询为你推荐
  import { getCustomPageSpuList } from '@/api/specialTopic/ranking'

  export default {
    props: {
      listData: {
        type: Object,
        default: () => {
          return {}
        },
      },
      index: {
        type: Number,
        default: 0,
      },
      goodsParticipateNum: {
        type: Number,
        default: 0,
      },
      renderProductNum: {
        type: Number,
        default: 0,
      },
    },
    components: {
      bigView: (resolve) => require(['@/views/specialTopic/comp/customization/components/listProducts/bigView'], resolve),
      smallView: (resolve) => require(['@/components/commons/productList.vue'], resolve),
      waterfall: (resolve) => require(['@/components/commons/waterfall.vue'], resolve),
      threeColun: (resolve) => require(['./threeColun.vue'], resolve),
    },
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        pageSize: 10,
        pageNum: 0,
      }
    },

    computed: {
      componentNmae({ listData }) {
        let componentNmae = ''
        if (listData.layoutStyle === '0') {
          componentNmae = 'bigView'
        } else if (listData.layoutStyle === '1') {
          componentNmae = 'smallView'
        }

        return componentNmae
      },
    },

    methods: {
      async onLoad() {
        let params = {
          orderCode: this.orderCode || '',
          spuId: this.$route.query.spuId || '',
          pageType: this.listData.productConfiguration,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          subjectId: this.$route.query.id,
          recommendNum: this.listData.productsNum,
        }
        try {
          let postMethod = getRecommendList
          if (this.listData.productConfiguration === 13) {
            if (this.list.length >= this.listData.productsNum || this.renderProductNum >= this.goodsParticipateNum) {
              this.finished = true
              this.$emit('finished', this.index)
              return
            }

            postMethod = getCustomPageSpuList
            params.pageNum = this.renderProductNum
            let productsNum = Number(this.listData.productsNum)
            let endNum = productsNum - this.list.length
            params.recommendNum = endNum >= this.pageSize ? this.pageSize : endNum
          }

          let res = await postMethod(params)
          let data = (res.data || []).map((item) => {
            item.skuLable && (item.skuLable.thematicLabel = null)
            return item
          })

          this.list = this.list.concat(data)
          
          if (this.listData.productConfiguration === 13) {
            this.$emit('update:renderProductNum', this.renderProductNum + data.length)
          }

          if (data.length < this.pageSize) {
            this.finished = true
            this.$emit('finished', this.index)
          }
          this.pageNum++
        } catch (error) {
          console.log(error)
          this.finished = true
          this.$emit('finished', this.index)
        }

        setTimeout(() => {
          this.loading = false
        }, 500)
      },
    },
  }
</script>

<style lang="less" scoped>
  .com-title {
    padding: 12px;
    padding-top: 2px;
    font-size: 16px;
    font-weight: 600;
    color: #191919;
    line-height: 22px;
    text-align: center;
  }
  .list-box {
    margin: 0 12px;
  }
</style>
