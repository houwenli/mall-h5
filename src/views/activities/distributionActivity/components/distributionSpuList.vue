<template>
  <!-- 商品卡片 -->
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="success">
    <div v-if="list.length">
      <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="我也是有底线的~" @load="onLoad">
        <!-- <div v-for="item in list" :key="item.id" class="all-pro-item" @click="goDetails(item)">
          <img :src="item.productUrl ? item.productUrl : defUrl" alt="" srcset="" class="list_item_img" />
          <div class="list_item_bottom">
            <p class="list_item_title">{{ item.skuName ? item.skuName : '' }}</p>
            <p class="all-price-box">
              <span class="coin">￥</span>
              <span class="price">{{ item.finalPrice && item.finalPrice.toFixed(2) }}</span>
              <span class="initPrice" v-if="item.finalPrice < item.price">￥{{ item.price && item.price.toFixed(2) }}</span>
            </p>
            分销商品
            <div class="distribution_div">
              <div class="distribution_gain" v-if="!!$route.query.promoteInfo"></div>
              <div class="distribution_gain" v-else>
                赚
                <span>¥{{ item.preCommission ? item.preCommission.toFixed(2) : '0.00' }}</span>
              </div>
              <div v-if="!!$route.query.promoteInfo" class="distribution_buy">立即购买</div>
              <div v-else class="distribution_buy" style="width:36px" @click.stop="$emit('shareComm', item)">分享</div>
            </div>
          </div>
        </div> -->

        <div class="column-container">
          <div class="column-container-left">
            <list-goods-item
              v-for="item in listLeft"
              :key="item.id"
              :item="item"
              :fromUser="!!$route.query.promoteInfo"
              @goDetails="goDetails"
              @shareComm="$emit('shareComm', item)"
            ></list-goods-item>
          </div>
          <div class="column-container-right">
            <list-goods-item
              v-for="item in listRight"
              :key="item.id"
              :item="item"
              :fromUser="!!$route.query.promoteInfo"
              @goDetails="goDetails"
              @shareComm="$emit('shareComm', item)"
            ></list-goods-item>
          </div>
        </div>
      </van-list>
    </div>
    <div v-else class="noData">
      <img src="@/assets/img/authorizeManagement.png" style="width:10rem;height:10rem;display:block;margin: 0 auto;" alt="" />
      <p class="noData-p">暂无商品</p>
    </div>
  </van-pull-refresh>
</template>

<script>
  import listGoodsItem from './list-goods-item.vue'

  import { getList } from '@/api/activities/distributionActivity'
  export default {
    components: {
      listGoodsItem,
    },
    name: '',
    data() {
      return {
        isSharedPage: true,
        success: '刷新成功',
        isLoading: true, // 是否正在加载中, 下拉刷新
        loading: false,
        finished: false,
        list: [],
        params: {
          pageNum: 0,
          pageSize: 10,
          isDistribution: 1, //0:非分销商品 1:分销商品 空：查询所有
          sortItems: [
            //排序
            {
              field: 'distributionAuditDate',
              order: null,
            },
          ],
        },
        defUrl: require('@/assets/img/shop_default.png'),
      }
    },

    computed: {
      listLeft() {
        return this.list.filter((item, index) => {
          return index % 2 == 0
        })
      },
      listRight() {
        return this.list.filter((item, index) => {
          return index % 2 == 1
        })
      },
    },

    created() {
      // this.isSharedPage = !!this.$route.query.promoteInfo
      this.getList()
    },
    methods: {
      //详情
      goDetails(item) {
        console.log('0----', item)
        // 走通用详情页面
        if (item.skuId !== 0 && !item.skuId) {
          this.$vux.toast.text('缺少参数', 'middle')
          return
        } else {
          const isDistribution = !this.$route.query.promoteInfo
          this.$router.push({
            path: '/spudetail',
            query: { sourceType: item.sourceType || 1, id: item.skuId, isDistribution, promoteInfo: this.$route.query.promoteInfo },
          })
        }
      },
      //上拉刷新
      onRefresh() {
        this.params.pageNum = 0
        this.finished = false
        setTimeout(() => {
          try {
            this.getList()
              .then((res) => {
                this.isLoading = false
              })
              .catch((err) => {
                this.isLoading = false
                this.success = '刷新失败'
              })
          } catch (error) {
            this.isLoading = false
            this.success = '刷新失败'
          }
        }, 1000)
      },
      //下拉加载
      async onLoad() {
        try {
          let res = await getList(this.params)
          let data = res.data || []
          if (data.length == 0) {
            // 数据全部加载完成
            this.finished = true
          } else {
            this.list = this.list.concat(data)
            this.params.pageNum += 1
          }

          this.loading = false
        } catch (error) {
          // 加载状态结束
          this.loading = false
          console.log(error)
        }
      },
      //商品列表
      getList() {
        return new Promise((resolve, reject) => {
          getList(this.params)
            .then((res) => {
              if (res.code == 200) {
                let data = res.data || []
                this.list = data

                if (data.length < this.params.pageSize) {
                  // 数据全部加载完成
                  this.finished = true
                }
                this.params.pageNum += 1

                resolve(res)
              } else {
                reject(res)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .column-container {
    padding: 0 12px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .column-container-left {
      overflow: hidden;
      flex: 1 0;
      margin-right: 10px;
    }
    .column-container-right {
      overflow: hidden;
      flex: 1 0;
    }
  }

  .noData {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(~'100vh - 190px');
    img {
      width: 180px !important;
      height: 170px !important;
    }

    .noData-p {
      font-size: 15px;
      font-weight: 500;
      text-align: center;
      color: #999999;
    }
  }
</style>
