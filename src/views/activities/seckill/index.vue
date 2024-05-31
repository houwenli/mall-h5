<template>
  <div id="seckill">
    <!--  头部导航栏  -->
    <van-nav-bar title="秒杀专区" left-text="" right-text="" left-arrow :fixed="true" :border="false" @click-left="$router.go(-1)" style="z-index: 100">
      <template #title>
        <div style="display: flex;justify-content: center;align-items: center">
          <img
            style="width: 96px;height: 22px"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///df7adde5c78b7867466db0d68756c32d.png?imageView2/1/w/380/h/88'"
            alt=""
          />
        </div>
      </template>

      <template #left>
        <div style="display: flex;justify-content: center;align-items: center">
          <img
            style="width: 24px;height: 24px"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///7c42a0f854755cd679055e6002bfcc0a.png?imageView2/1/w/48"
            alt=""
          />
        </div>
      </template>
    </van-nav-bar>
    <!--  背景  -->
    <div class="nav-bg">
      <!--   头部图   -->
      <div class="seckill-pic">
        <img style="width: 100%;height: 100%;border-radius: 10px;overflow: hidden" :src="mobilePic + '?imageView2/1/w/702/h/280'" alt="" />
      </div>
    </div>
    <!--  秒杀列表  -->
    <div class="seckill-wrap">
      <!--   秒杀场次导航栏   -->

      <van-sticky offset-top="11.7333333333vw">
        <div class="seckill-scenes-nav">
          <img
            style="height: 34px;width: 34px"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///ee3da344214d2e5caa7e5356bdf50944.png?imageView2/1/w/68/h/68"
            alt=""
          />
          <div class="seckill-scenes-list">
            <template v-for="(item, index) in scenes">
              <div :key="index" class="scenes-wrap" :class="`${selectSceneIdx == index ? 'scenes-selected' : ''}`" @click="changeScene(item, index)">
                <div class="scenes-time">{{ item.secen }}</div>
                <div class="scenes-type">
                  {{ item.sceneStatus }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </van-sticky>

      <!--   秒杀商品列表   -->
      <div class="seckill-commodity-list">
        <van-list v-model="loading" :offset="300" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="querySceneDetail" v-if="showList">
          <div class="commodity" v-for="(item,i) in commodities" :key="i" @click="goToSkuDetail(item)">
            <img class="commodity-image" :src="item.url + '?imageView2/1/w/224/h/228'" />
            <div class="commodity-info">
              <div>
                <div class="commodity-info-title text-clamp2">{{ item.name }}</div>
                <!-- <div class="commodity-stock-progress" v-if="canBuy">
                  <div class="progress">
                    <van-progress :percentage="item.progress" track-color="#F8D8C9" stroke-width="10"
                                  :show-pivot="false" :color="item.noStock ?'#F2F2F2' :'#FFA000'"/>
                  </div>
                  <div :class="`${item.noStock ? 'progress-cant' : 'progress-can'} progress-text`">
                    已抢{{ item.noStock ? '完' : `${item.progress}%` }}
                  </div>
                </div> -->
              </div>
              <div class="commodity-info-price">
                <span class="new-price">
                  <span class="price-icon">¥</span>
                  {{ item.seckillPrice.toFixed(2) }}
                </span>
                <span v-if="item.seckillPrice.toFixed(2).length < 7" class="old-price">
                  <span class="price-icon">¥</span>
                  {{ item.price.toFixed(2) }}
                </span>
              </div>
              <div v-if="canBuy === '抢购中'" :class="`commodity-btn ${item.progress < 100 ? 'btn-can' : ''}`">
                {{ item.noStock ? '已售罄' : '去抢购' }}
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <!-- 回到顶部 -->
    <div class="back-top-btn" v-if="btnFlag" @click="toTop">
      <img src="@/assets/img/top@2x.png" style="height: 100%;width: 100%;" alt />
    </div>
  </div>
</template>

<script>
  import { querySeckilldetail, querySeckillSceneSpu } from '@/api/activities/seckill'
  import { visit } from '@/api/visit'
  import { List, Progress, Sticky } from 'vant'
  import timeFormat from '@/utils/timeFormat.js'
  import { debounce } from '@/utils/utils'

  export default {
    name: 'Seckill',
    components: { [List.name]: List, [Progress.name]: Progress, [Sticky.name]: Sticky },
    data() {
      return {
        debounce,
        canBuy: '',
        scenes: [], // 场次列表
        mobilePic: '', // 秒杀图片
        countTimer: '', // 计时器ID,用于销毁时自动去除定时器
        selectSceneIdx: 0, // 选中的场次序列
        commodities: [], // 秒杀场次的商品列表
        loading: false, // 是否加载中
        finished: false, // 是否还有更多
        queryForm: {
          pageNum: 0,
          pageSize: 10,
          seckillSceneId: '',
        },
        showList: true,
        scrollTop: 0, // 距离顶部的距离
        btnFlag: false, // 是否显示返回顶部按钮
      }
    },
    created() {
      this.querySeckill()
    },
    mounted() {
      this.visitFun()
      window.addEventListener('scroll', this.scrollToTop)
    },
    beforeDestroy() {
      clearTimeout(this.countTimer)
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrollToTop)
    },

    methods: {
      visitFun() {
        let that = this
        let data = {
          route: that.$route.path,
          routeName: '秒杀页',
          userId: that.$store.getters.userId,
        }
        visit(data)
      },
      // 查询秒杀场次
      querySeckill() {
        let that = this
        // 查询秒杀场次
        querySeckilldetail().then((res) => {
          this.mobilePic = res.data.mobilePic
          // 如果没有场次则直接返回
          if (!res.data.secenes) return
          // 遍历处理场次信息
          let scenes = res.data.secenes.map((el, index) => {
            // 兼容ios的时间计时方法
            el.seckillTime = el.seckillTime.replace(/-/g, '/')
            let nowTime = new Date().getTime()
            let seckillTime = new Date(el.seckillTime).getTime()
            let countTime = seckillTime - nowTime
            el.sceneStatus = countTime < 0 ? 1 : 2
            // 如果当前时间大于活动开始时间则为负数,此时应该计算该场次还剩余多少时间,因此加上一个小时的毫秒数
            countTime = countTime < 0 ? (countTime += 3600000) : countTime
            el.countTime = countTime
            return el
          })

          // 如果时间仍然小于0,说明该场次时间已经结束,后台接口的数据缓存问题,此时过滤掉该场次
          scenes = scenes.filter((el) => {
            return el.countTime > 0
          })

          // 如果没有场次了怎么办 Todo

          // 如果没有超时缓存,则去除超出5个场次之外的数据
          scenes.splice(5, 1)

          //setTimeout不超过1天
          let seckillCountTime = parseInt(scenes[0].countTime)
          if (seckillCountTime > 86400000) {
            seckillCountTime = 86400000
          }
          // 设置定时器更新数据
          this.countTimer = setTimeout(function() {
            that.querySeckill()
          }, seckillCountTime)

          this.resetQueryForm(scenes[0])
          // 赋值
          this.scenes = this.scenesFun(scenes)
          // if(this.scenes.length){
          //   let scene = this.scenes[0]
          //   this.changeScene(scene, 0)
          // }
          // this.querySceneDetail()
        })
      },
      scenesFun(data) {
        let label = null,
          secen = null,
          seckillTime = null,
          m = null,
          d = null
        for (let i = 0; i < data.length; i++) {
          secen = data[i].secen
          secen = parseInt(secen.split(':')[0])
          // 转化成时间戳
          seckillTime = new Date(data[i].seckillTime).getTime()
          m = timeFormat(seckillTime, 'm') //月
          d = timeFormat(seckillTime, 'd') //日
          // 格式化时间
          seckillTime = timeFormat(seckillTime, 'm.dd')
          if (new Date().getHours() === secen && m == new Date().getMonth() + 1 && d == new Date().getDate()) {
            data[i].sceneStatus = '抢购中'
          } else if (m == new Date().getMonth() + 1 && d == new Date().getDate()) {
            data[i].sceneStatus = '即将开始'
          } else {
            data[i].sceneStatus = `${seckillTime}日抢`
          }
        }
        this.canBuy = data[0].sceneStatus
        return data
      },
      // 修改秒杀场次
      changeScene(scene, index) {
        this.canBuy = scene.sceneStatus
        if (index === this.selectSceneIdx) return
        this.selectSceneIdx = index
        this.loading = false
        this.finished = false
        this.resetQueryForm(scene)
      },
      resetQueryForm(scene) {
        this.showList = false
        console.log('scene: ', scene)
        this.commodities = []
        this.queryForm.pageNum = 0
        this.queryForm.seckillSceneId = scene.seckillSceneId
        this.showList = true
        this.querySceneDetail()
      },
      // 根据场次查询该场次下的活动sku
      querySceneDetail() {
        if (!this.queryForm.seckillSceneId) {
          return
        }
        this.loading = true
        // 如果正在加载中或已完成
        querySeckillSceneSpu(this.queryForm)
          .then((res) => {
            console.log('##########');
            if (!res.data || res.data.list.length < 10) {
              this.finished = true
            }
            if (!res.data) return
            let commoditiesList = res.data.list.map((el) => {
              el.noStock = el.stock <= 0
              if (el.noStock) {
                el.progress = 100
              } else {
                console.log('((el.originalStockSum - el.stock) / el.originalStockSum).toFixed(2): ')
                el.progress = (((el.originalStockSum - el.stock) / el.originalStockSum) * 100).toFixed(0)
                el.progress = el.progress < 0 ? 0 : el.progress
                el.progress = el.progress > 100 ? 100 : el.progress
              }
              return el
            })
            this.commodities.push(...commoditiesList)
            this.loading = false
            this.queryForm.pageNum++
          })
          .catch((err) => {
            this.loading = false
          })
      },
      // 跳转到商品详情
      goToSkuDetail(sku) {
        this.$router.push({
          name: 'SpuDetail',
          query: {
            id: sku.skuId,
            activity: 13,
            startTime: this.scenes[this.selectSceneIdx].seckillTime,
          },
        })
      },
      // 点击图片回到顶部方法，加计时器是为了过渡顺滑
      toTop() {
        console.log('document.documentElement.scrollTop: ', document.documentElement.scrollTop)
        console.log('document.body.scrollTop: ', document.body.scrollTop)
        const that = this
        let timer = setInterval(() => {
          let ispeed = Math.floor(-that.scrollTop / 5)
          document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
          if (that.scrollTop === 0) {
            clearInterval(timer)
          }
        }, 16)
      },
      // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
      scrollToTop() {
        const that = this
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        that.scrollTop = scrollTop
        if (that.scrollTop > 120) {
          that.btnFlag = true
        } else {
          that.btnFlag = false
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  // 处理vant未暴露的样式问题
  #seckill {
    & /deep/ .van-nav-bar {
      background: linear-gradient(90deg, #eb465f 0%, #eb482c 100%);
    }

    & /deep/ .van-nav-bar__content {
      height: 44px;
    }

    // 覆盖进度条样式
    & /deep/ .van-progress {
      border-radius: 20px;
    }
    & /deep/ .van-progress__portion {
      border-radius: 20px;
    }

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .nav-bg {
    z-index: 99;
    height: 152px;
    background: linear-gradient(90deg, #eb465f 0%, #eb482c 100%);
    border-radius: 0px 0px 10px 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .seckill-pic {
      //margin-top: -103px;
      padding: 0 12px;
      height: 140px;
      margin-bottom: -37px;
      background: transparent;
    }
  }

  .seckill-wrap {
    z-index: 11;
    //min-height: 100vh;
    flex: 1;
    width: 100%;
    padding: 49px 0 40px;
    background-color: #f5f5f5;

    .seckill-scenes-nav {
      height: 48px;
      padding: 0 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: #f5f5f5;
      .seckill-scenes-list {
        padding-left: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .scenes-wrap {
          min-width: 46px;
          height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;

          .scenes-time {
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            line-height: 18px;
            margin-bottom: 4px;
          }

          .scenes-type {
            width: 44px;
            font-weight: 400;
            color: #666666;
            line-height: 13px;
            text-align: center;
            font-size: 10px;
            //.text {
            //  width: 49px;
            //  line-height: 13px;
            //  font-size: 11px;
            //  //transform: scale(0.83);
            //}
          }
        }

        .scenes-selected {
          color: #e60113;

          .scenes-time {
            color: #e60113;
          }

          .scenes-type {
            width: 100%;
            color: #fff;
            border-radius: 9px;
            background-color: #e60113;
          }
        }

        .scenes-wrap:not(:last-child) {
          margin-right: 18px;
        }
      }
    }
  }

  .seckill-commodity-list {
    padding: 12px;
    height: 100%;

    .commodity {
      margin-bottom: 12px;
      padding: 10px;
      border-radius: 10px;
      background-color: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .commodity-image {
        width: 112px;
        height: 114px;
        border-radius: 5px;
        margin-right: 11px;
      }

      .commodity-info {
        height: 114px;
        padding: 4px 4px 0px 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;

        .commodity-info-title {
          font-size: 15px;
          font-weight: 400;
          color: #000000;
          line-height: 20px;
          margin-bottom: 9px;
          margin-bottom: 9px;
        }

        .commodity-stock-progress {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .progress {
            width: 90px;
            margin-right: 4px;
          }

          .progress-text {
            margin-left: -14px;
            transform: scale(0.5);
            font-size: 20px;
            font-weight: 400;
            color: #e60113;
            line-height: 10px;
          }

          .progress-cant {
            color: #bababa;
          }

          .progress-can {
            color: #e60113;
          }
        }

        .commodity-info-price {
          .new-price {
            color: #e60113;
            font-size: 20px;
            font-weight: 500;
            margin-right: 3px;
          }

          .old-price {
            font-size: 11px;
            font-weight: 400;
            color: #999999;
            text-decoration: line-through;
          }

          .price-icon {
            font-size: 12px;
            font-weight: 400;
          }
        }

        .commodity-btn {
          width: 75px;
          height: 28px;
          line-height: 28px;
          background: #f2f2f2;
          border-radius: 20px;
          position: absolute;
          right: 3px;
          bottom: 4px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          color: #bababa;
        }

        .btn-can {
          color: #fff;
          background-color: #e60113;
        }
      }
    }
  }

  .back-top-btn {
    position: fixed;
    top: 70%;
    right: 20px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    overflow: hidden;
    z-index: 99;
  }
</style>
