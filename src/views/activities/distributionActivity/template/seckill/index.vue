<template>
  <!-- 秒杀组件 -->
  <div :style="{margin:'0 0.4rem 0', 'margin-top': `${listData.blankHeight || 0}px`}" v-if="seckill.skus.length > 0">
    <div
      class="seckill"
      :style="{
        'background-color': listData.bgColor,
        'background-image': 'url(' + listData.bgImage + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center',
      }"
    >
      <template>
        <div v-if="hasSeckill" class="box-seckill" @click="navigate">
          <div class="seckill-header">
            <div class="seckill-header-title">限时秒杀</div>
            <div class="seckill-header-count">
              <div class="seckill-header-tips">{{ seckill.secenes[0].secen.split(':')[0] }}点场{{ seckill.secenes[0].countStr }}</div>
              <van-count-down :time="seckill.secenes[0].countTime" style="display: flex; justify-content: center; align-items: center; margin-right: 0.4rem">
                <template #default="timeData">
                  <span class="block" v-if="timeData.days > 0">{{ timeData.days * 24 + timeData.hours }}</span>
                  <span class="block" v-else>{{ timeData.hours &lt; 10 ? '0' + timeData.hours : timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ timeData.minutes &lt; 10 ? '0' + timeData.minutes : timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ timeData.seconds &lt; 10 ? '0' + timeData.seconds : timeData.seconds }}</span>
                </template>
              </van-count-down>
              <img src="@/assets/img/cat_more@2x.png" style="width: 0.2rem; height: 0.44rem" alt="" />
            </div>
          </div>
          <div class="seckill-body" v-if="seckill.skus && seckill.skus.length > 0">
            <template v-for="(subEl, x) in seckill.skus">
              <div class="seckill-skus" :key="x">
                <div class="imgbox">
                  <van-image style="height: 100%; width: 100%" :src="subEl.url + '?imageView2/1/w/150/h/150'" />
                </div>
                <div class="seckill-skus-price">
                  <span class="price">
                    <span class="symbol-money" style="margin-top: 0.04rem">¥</span>
                    {{ subEl.seckillPrice.toFixed(2) }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import { querySeckilldetail, querySeckillSceneSpu } from '@/api/activities/seckill'
  import { CountDown, Image as VanImage } from 'vant'
  import Cookies from 'js-cookie'
  export default {
    components: {
        [CountDown.name]: CountDown,
      VanImage,
    },
    props: {
      listData: {
        type: Object,
        default: () => {
          return {
            // 1 背景色 2 背景图片
            radio: 1,
            bgColor: '#fff',
            bgImage: '',
          }
        },
        required: true,
      },
    },
    data() {
      return {
        hasSeckill: false,
        seckill: {
          // 秒杀场次信息
          secenes: [],
          skus: [],
        },
      }
    },
    created() {
      this.querySeckill()
    },
    methods: {
      // 查询秒杀场次
      querySeckill() {
        let that = this
        // 查询秒杀场次
        querySeckilldetail().then((res) => {
          // 如果没有场次则直接返回
          if (!res.data.secenes) return
          // 遍历处理场次信息
          let secenes = res.data.secenes.map((el, index) => {
            // 兼容ios的时间计时方法
            el.seckillTime = el.seckillTime.replace(/-/g, '/')
            let nowTime = new Date().getTime()
            let seckillTime = new Date(el.seckillTime).getTime()
            let countTime = seckillTime - nowTime
            el.countStr = countTime < 0 ? '' : '，距离开始'
            // 如果当前时间大于活动开始时间则为负数,此时应该计算该场次还剩余多少时间,因此加上一个小时的毫秒数
            countTime = countTime < 0 ? (countTime += 3600000) : countTime
            el.countTime = countTime
            return el
          })

          // 如果时间仍然小于0,说明该场次时间已经结束,后台接口的数据缓存问题,此时过滤掉该场次
          secenes = secenes.filter((el) => {
            return el.countTime > 0
          })

          //设置定时器更新数据.setTimeout不超过1天
          let seckillCountTime = parseInt(secenes[0].countTime)
          if (seckillCountTime > 86400000) {
            seckillCountTime = 86400000
          }
          this.countTimer = setTimeout(function() {
            that.querySeckill()
          }, seckillCountTime)

          // 赋值
          this.seckill.secenes = secenes

          // 查询场次商品
          this.querySceneDetail(this.seckill.secenes[0])

          //用于判断是否还拥有场次
          this.hasSeckill = secenes && secenes.length > 0
        })
      },
      // 查询首页展示Sku
      querySceneDetail(secenes) {
        if (!secenes.seckillSceneId) {
          return
        }
        // 如果正在加载中或已完成
        querySeckillSceneSpu({ pageNum: 0, pageSize: 10, seckillSceneId: secenes.seckillSceneId }).then((res) => {
          if (res.code == 200 && res.data) {
            this.seckill.skus = res.data.list
          }
        })
      },
      // 埋点
      navigate(){
        this.$router.push({ name: 'Seckill' })
        // 流量分析埋点
        let params = {
          name:'秒杀',
          type:9,
          image: this.listData.bgImage || '',
          url: 'Seckill',
          channel_source:Cookies.get('_wsf_role') || ''
        }
        this.$store.dispatch('BURIED_POINT/advertVisitRequest',params)
      }
    },
  }
</script>

<style scoped lang="less">
  .seckill {
    width: 100%;
    border-radius: 10px;
    // 秒杀功能
  .box-seckill {
    // background-color: #fff;
    border-radius: 0.4rem;
    padding-left: 0.4rem;

    .seckill-header {
      height: 1.84rem;
      padding: 0.48rem 0.4rem 0.48rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .seckill-header-title {
        font-size: 0.68rem;
        font-weight: 500;
        color: #000000;
      }

      .seckill-header-count {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .seckill-header-tips {
          font-size: 0.4rem;
          font-weight: 500;
          color: #000000;
          line-height: 0.56rem;
          margin-right: 0.16rem;
        }

        .colon {
          display: inline-block;
          padding: 0 0.04rem;
          height: 0.64rem;
          line-height: 0.6rem;
          color: #e60113;
        }

        .block {
          display: inline-block;
          width: 0.72rem;
          height: 0.64rem;
          line-height: 0.64rem;
          color: #fff;
          font-size: 0.48rem;
          text-align: center;
          background-color: #e60113;
          border-radius: 0.08rem;
        }
      }
    }

    .seckill-body {
      display: flex;
      // justify-content: flex-start;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 0.36rem;
      width: 100%;
      // overflow-x: scroll;
      overflow-x: hidden;

      .seckill-skus {
        max-width: 3rem;
        margin-right: 0.36rem;
        // width: 3rem;
        .imgbox {
          width: 3rem;
          height: 3rem;
          border-radius: 0.2rem;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .seckill-skus-price {
          // width: 3rem;
          width: 100%;
          height: 1.04rem;
          line-height: 1.04rem;
          overflow: hidden;
          text-align: center;
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;

          .old-price {
            font-size: 0.4rem;
            color: #999999;
            text-decoration: line-through;
            display: flex;
          }

          .price {
            font-weight: 500;
            font-size: 0.56rem;
            color: #e60113;
            display: flex;
            margin-right: 0.08rem;
          }

          .symbol-money {
            font-size: 0.4rem;
          }
        }
      }
      .seckill-skus:nth-child(5){
        display: none;
      }
    }
  }
  }
</style>
