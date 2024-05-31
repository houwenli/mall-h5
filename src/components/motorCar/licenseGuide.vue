<template>
    <div class="license-guide-page">
        <navbartop :title="'上牌指引'" @clickBack="backLastPage"></navbartop>
        <!-- 商品卡片 -->
        <van-pull-refresh v-if='!$route.query.showDetail' v-model="isLoading" disabled :success-text="success">
            <div v-if="list.length">
                <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
                    <license-item v-for="(item, index) in list" :item="item" :key="index" @click.native="goDetails(item)"></license-item>
                </van-list>
            </div>
            <div v-else class="noData">
                <img src="@/assets/img/authorizeManagement.png" style="width:10rem;height:10rem;display:block;margin: 0 auto;" alt="" />
                <p class="noData-p">空</p>
            </div>
        </van-pull-refresh>
        <div class="content-html" v-else>
            <div  v-html="detail"></div>
        </div>
    </div>
</template>

<script>
import LicenseItem from './component/licenseItem.vue'
import navbartop from '@/components/commons/navBartop' // 导航栏
import {guidances} from '@/api/motorCar.js'
export default {
    components:{
        LicenseItem,
        navbartop
    },
    data() {
        return {
            list: [],
            success: '刷新成功',
            isLoading: true, // 是否正在加载中, 下拉刷新
            loading: false,
            finished: false,
            params: {
                pageNum: 0,
                pageSize: 10
            },
            defUrl: require('@/assets/img/shop_default.png'),
            detail: ''
        }
    },
    created() {
      this.getList()
    },
    methods: {
        backLastPage() {
            this.$router.back()
        },
        goDetails(item) {
            this.$router.push({
                path: '/motorCar/licenseGuide',
                query: {
                    showDetail: true
                }
            })
            this.detail = item.contentConfig
         },

        //下拉加载
        async onLoad() {
            this.params.pageNum += 1
            try {
                let res = await guidances(this.params)
               
                let data = res.data.list || []
                if (data.length == 0) {
                    // 数据全部加载完成
                    this.finished = true
                    this.params.pageNum -= 1
                } else {
                    this.list = this.list.concat(data)
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
                guidances(this.params)
                    .then((res) => {
                        if (res.code == 200) {
                            this.list = res.data.list
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
    }
}
</script>

<style lang="less" scoped>
.license-guide-page {
  background: #f6f6f6;
  padding: 12px;
  min-height: 100vh;
  /deep/.navbarbox .topbox {
    left: 0;
  }
  .noData {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(~'100vh - 190px');
    background: #f5f5f5;

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
}
</style>


